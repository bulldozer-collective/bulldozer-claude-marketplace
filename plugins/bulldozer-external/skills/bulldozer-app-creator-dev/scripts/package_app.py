#!/usr/bin/env python3
"""Assemble the archive of a Bulldozer App — and refuse to write one the platform would reject.

The archive's shape is not a convention, it is a contract, and every mistake in it fails *late*:
the upload succeeds, the publish succeeds, and the app is quietly wrong. The worst of them is
silent — zipping the working folder instead of its contents puts everything under a wrapping
directory, the manifest is then no longer at the root, and an app with a service is published as a
plain static site with no service and no review at all.

So this script builds the archive itself and then **re-reads the archive it just wrote** to check
its shape, because what matters is what is inside the zip, not what was intended.

It also front-runs the checks the review would fail an app on a minute later, and the ones the app
would only fail at runtime: does the service parse, does every import resolve, does the manifest
agree with the routes the code actually answers, are its numbers in bounds, and does the screen ship
a folder named `api` (which the platform routes to the service, so those files would never be
served).

Shape of an app with a service:

    bulldozer.app.json        at the root, exactly there
    backend/index.mjs         the entry point
    backend/bulldozer.mjs     the shipped helper, and anything else the service imports
    frontend/index.html       the screen, if the app has one
    frontend/…

Shape of a screen-only app (unchanged from before, no manifest, no review):

    index.html                at the root
    …

Usage:
    python package_app.py --app ./my-app --screen ./my-app/dist/my-app/browser --out app.zip
    python package_app.py --app ./my-app --out app.zip          # service only
    python package_app.py --screen ./dist/my-app/browser --out app.zip   # screen only, legacy

Exit codes:
    0  archive written and verified      1  the app is not publishable, nothing written
    2  bad usage
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile

MANIFEST = "bulldozer.app.json"
FRONTEND_DIR = "frontend/"
BACKEND_DIR = "backend/"
BACKEND_ENTRY = "index.mjs"
ROOT_INDEX = "index.html"

# The fridge refuses 25 MB or more, and that is the tighter of the two limits (the service bundle
# alone may go to 40 MB). Checking the loose one would let a rejected upload look like our success.
MAX_ARCHIVE_BYTES = 25 * 1024 * 1024

# Bounds enforced server-side by AppManifestValidator. Duplicated here on purpose: a manifest
# refused at publish time costs a full round trip, and the message the user gets is ours.
MEMORY_MB = (128, 3008)
TIMEOUT_SEC = (1, 300)

# What the runtime provides. There is no dependency installation step: an import of anything else
# resolves to nothing and the service crashes on its first call, in production, with no clue.
PROVIDED = {
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
    "@aws-sdk/client-s3",
    "@aws-sdk/s3-request-presigner",
    "@aws-sdk/client-sqs",
}

IMPORT_RE = re.compile(r"""(?:^|[^\w$.])(?:import|export)\s
                           (?:[^'"()]*?\sfrom\s)?['"]([^'"]+)['"]""", re.X | re.M)

# A route as `defineApp` declares it: `'GET /leads/{id}': async (…) => …`.
ROUTE_RE = re.compile(r"""['"](GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(/[^'"]*)['"]\s*:""")

# The sort axis of a query: `list({ by: 'createdAt', … })`.
AXIS_RE = re.compile(r"""\bby\s*:\s*['"]([A-Za-z_]\w*)['"]""")

# Comments are stripped before the scan: a commented-out import is not an import, and refusing to
# publish over one would be a false accusation the author cannot argue with.
COMMENT_RE = re.compile(r"/\*.*?\*/|(?<![:\\])//[^\n]*", re.S)

# `…/{subdomain}/api/…` belongs to the service, for every app on the platform. A screen shipping a
# folder by that name has its files uploaded and never served — the one failure with no symptom.
RESERVED_SCREEN_DIR = "api"

# Provided by the platform on every app, so it is never declared and never implemented.
BUILTIN_ROUTE = "/jobs/{id}"

SKIPPED_NAMES = {".DS_Store", "Thumbs.db", ".bulldozer-app.json"}
SKIPPED_DIRS = {"__MACOSX", "node_modules", ".git", ".angular", "__pycache__"}


class Refused(Exception):
    """The app is not publishable. Raised before anything is written."""


# ───────────────────────────────────────────────────────────── collecting the files


def _collect(root: str, prefix: str) -> dict[str, str]:
    """Map archive path → source path, for every file under `root`.

    Symlinks are refused rather than followed: a link resolving outside the folder would put a
    file in the archive that the author never meant to publish.
    """
    files: dict[str, str] = {}
    for folder, subdirs, names in os.walk(root):
        subdirs[:] = [d for d in subdirs if d not in SKIPPED_DIRS]
        for name in names:
            if name in SKIPPED_NAMES:
                continue
            source = os.path.join(folder, name)
            if os.path.islink(source):
                raise Refused("symbolic link in the archive: %s"
                              % os.path.relpath(source, root))
            relative = os.path.relpath(source, root).replace(os.sep, "/")
            files[prefix + relative] = source
    if not files:
        raise Refused("nothing to publish in %s" % root)
    return files


# ───────────────────────────────────────────────────────────── the manifest


def _check_manifest(path: str, has_service: bool) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            manifest = json.load(f)
    except json.JSONDecodeError as e:
        raise Refused("%s is not valid JSON: %s" % (MANIFEST, e)) from e
    if not isinstance(manifest, dict):
        raise Refused("%s must be a JSON object" % MANIFEST)

    problems: list[str] = []
    if not isinstance(manifest.get("name"), str) or not manifest["name"].strip():
        problems.append('"name" is required and must be a non-empty string')
    if not isinstance(manifest.get("runtime"), str) or not manifest["runtime"].strip():
        problems.append('"runtime" is required (e.g. "nodejs22")')
    # Not defaulted anywhere: whether the app handles personal data is a declaration its author
    # must make, and the review compares the answer against the code.
    if has_service and not isinstance(manifest.get("personalData"), bool):
        problems.append('"personalData" must be present and be true or false')

    limits = manifest.get("limits") or {}
    if not isinstance(limits, dict):
        problems.append('"limits" must be an object')
    else:
        for key, (low, high) in (("memoryMb", MEMORY_MB), ("timeoutSec", TIMEOUT_SEC)):
            value = limits.get(key)
            if value is not None and (not isinstance(value, int) or isinstance(value, bool)
                                      or not low <= value <= high):
                problems.append('"limits.%s" must be an integer between %d and %d'
                                % (key, low, high))

    if problems:
        raise Refused("%s:\n  - %s" % (MANIFEST, "\n  - ".join(problems)))
    return manifest


# ───────────────────────────────────────────────────────────── the service's imports


def _check_syntax(files: dict[str, str]) -> list[str]:
    """Parse the service with Node itself, before it is ever uploaded.

    A syntax error otherwise surfaces only after the upload, the review and the deployment — several
    minutes to learn about a missing brace. Skipped, with a note, when Node is not installed: an
    absent tool must not read as a passing check.
    """
    if not shutil.which("node"):
        return []
    problems: list[str] = []
    for archive_path, source in sorted(files.items()):
        if not archive_path.endswith((".mjs", ".js")):
            continue
        done = subprocess.run(["node", "--check", source], capture_output=True, text=True)
        if done.returncode != 0:
            # Node prints the offending line, a caret, the error, a stack, then its own version.
            # Only the `SyntaxError:` line says anything useful; the last line is the version.
            lines = [l.strip() for l in done.stderr.splitlines() if l.strip()]
            said = next((l for l in lines if re.match(r"\w*Error:", l)), lines[0] if lines else "")
            problems.append("%s does not parse: %s" % (archive_path, said or "syntax error"))
    return problems


def _check_routes(manifest: dict, files: dict[str, str]) -> list[str]:
    """The manifest's routes against the ones the code actually declares.

    This is the disagreement the review refuses most often, and it is entirely mechanical: catching
    it here costs nothing, catching it there costs a minute and a refusal the author must read.
    """
    declared_in_code: set[tuple[str, str]] = set()
    for archive_path, source in files.items():
        if not archive_path.endswith((".mjs", ".js")):
            continue
        with open(source, encoding="utf-8", errors="replace") as f:
            code = COMMENT_RE.sub("", f.read())
        declared_in_code.update((m.upper(), p) for m, p in ROUTE_RE.findall(code))

    # No route key found at all means the extraction did not work — on a service written some other
    # way, for instance. Judging a manifest against nothing would accuse it wrongly.
    if not declared_in_code:
        return []

    in_manifest: set[tuple[str, str]] = set()
    for route in manifest.get("routes") or []:
        if not isinstance(route, dict):
            continue
        path = route.get("path")
        for method in route.get("methods") or []:
            if isinstance(path, str) and isinstance(method, str):
                in_manifest.add((method.upper(), path))

    problems = []
    for method, path in sorted(declared_in_code - in_manifest):
        problems.append('the code answers %s %s but "routes" does not declare it' % (method, path))
    for method, path in sorted(in_manifest - declared_in_code):
        if path == BUILTIN_ROUTE:
            problems.append('"routes" declares %s %s — the platform provides it, remove the entry'
                            % (method, path))
        else:
            problems.append('"routes" declares %s %s but no code answers it' % (method, path))
    return problems


def _check_indexes(manifest: dict, files: dict[str, str]) -> list[str]:
    """Every sort axis the code asks for must be declared in the manifest.

    This one refuses rather than warns, and the distinction is worth stating: a *filter* on an
    unindexed field is merely expensive — it reads the collection and returns the right answer, so
    the app works and the cost shows up in `scanned`. A *sort axis* that was never declared does not
    exist at all: the query fails, every time, in production only. Catching it here costs a second.
    """
    declared = {index.get("field") for index in (manifest.get("indexes") or [])
                if isinstance(index, dict)}
    asked: set[str] = set()
    for archive_path, source in files.items():
        if not archive_path.endswith((".mjs", ".js")):
            continue
        with open(source, encoding="utf-8", errors="replace") as f:
            asked.update(AXIS_RE.findall(COMMENT_RE.sub("", f.read())))

    return ['the code sorts by "%s" but "indexes" does not declare it — that query would fail '
            "every time once published" % field
            for field in sorted(asked - declared)]


def _check_imports(files: dict[str, str]) -> list[str]:
    """Every import of the service must resolve, offline, inside the archive."""
    problems: list[str] = []
    for archive_path, source in sorted(files.items()):
        if not archive_path.endswith((".mjs", ".js")):
            continue
        with open(source, encoding="utf-8", errors="replace") as f:
            code = COMMENT_RE.sub("", f.read())
        for specifier in IMPORT_RE.findall(code):
            if specifier.startswith("node:") or specifier in PROVIDED:
                continue
            if specifier.startswith("."):
                target = os.path.normpath(
                    os.path.join(os.path.dirname(archive_path), specifier)).replace(os.sep, "/")
                if target not in files:
                    problems.append("%s imports %s, which is not in the archive"
                                    % (archive_path, specifier))
                continue
            problems.append(
                '%s imports "%s". Nothing is installed for the app: only relative files and '
                "the modules the runtime provides (%s) can be imported."
                % (archive_path, specifier, ", ".join(sorted(PROVIDED))))
    return problems


# ───────────────────────────────────────────────────────────── writing, then re-reading


def _write(out: str, files: dict[str, str]) -> None:
    # Fixed timestamps and sorted entries: the same sources produce byte-identical archives, so
    # "did anything actually change since the last publish" is answerable.
    fixed = (1980, 1, 1, 0, 0, 0)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for archive_path in sorted(files):
            info = zipfile.ZipInfo(archive_path, date_time=fixed)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with open(files[archive_path], "rb") as f:
                zip_file.writestr(info, f.read())


def _verify_archive(out: str, expect_service: bool, expect_screen: bool) -> dict:
    """Re-read the written archive and judge it exactly as the platform will."""
    with zipfile.ZipFile(out) as zip_file:
        paths = [i.filename for i in zip_file.infolist() if not i.is_dir()]

    has_manifest = MANIFEST in paths
    has_service = (BACKEND_DIR + BACKEND_ENTRY) in paths
    screen = [p for p in paths if p.startswith(FRONTEND_DIR)]
    problems: list[str] = []

    if has_service and not has_manifest:
        problems.append("a service is present but %s is not at the archive root" % MANIFEST)
    if has_manifest and not has_service and not screen:
        problems.append("%s is present but the archive holds neither %s%s nor %s"
                        % (MANIFEST, BACKEND_DIR, BACKEND_ENTRY, FRONTEND_DIR))
    if screen and (FRONTEND_DIR + ROOT_INDEX) not in paths:
        problems.append("%s must hold an %s at its root" % (FRONTEND_DIR, ROOT_INDEX))
    if not has_manifest and not screen and ROOT_INDEX not in paths:
        problems.append("a screen-only archive must hold %s at its root" % ROOT_INDEX)

    # The silent failure this whole script exists for.
    if expect_service and not has_service:
        wrapped = [p for p in paths if p.endswith("/" + BACKEND_DIR + BACKEND_ENTRY)]
        where = (" but at %s — everything sits under a wrapping directory" % wrapped[0]
                 if wrapped else "")
        problems.append("the service is not at %s%s%s" % (BACKEND_DIR, BACKEND_ENTRY, where))
    if expect_screen and not screen and ROOT_INDEX not in paths:
        problems.append("the screen was requested but no %s reached the archive" % ROOT_INDEX)

    size = os.path.getsize(out)
    if size >= MAX_ARCHIVE_BYTES:
        problems.append("the archive is %.1f MB; the limit is 25 MB"
                        % (size / 1024 / 1024))

    if problems:
        raise Refused("the archive that was written is not publishable:\n  - %s"
                      % "\n  - ".join(problems))

    return {
        "archive": os.path.abspath(out),
        "bytes": size,
        "files": len(paths),
        "manifest": has_manifest,
        "service": has_service,
        "screen": bool(screen) or ROOT_INDEX in paths,
        "reviewed_before_going_live": has_service,
    }


# ───────────────────────────────────────────────────────────── assembling


def build(app: str | None, screen: str | None, out: str) -> dict:
    files: dict[str, str] = {}
    manifest_path = os.path.join(app, MANIFEST) if app else None
    service_dir = os.path.join(app, "backend") if app else None

    has_manifest = bool(manifest_path) and os.path.isfile(manifest_path)
    has_service = bool(service_dir) and os.path.isfile(
        os.path.join(service_dir, BACKEND_ENTRY))

    if has_service and not has_manifest:
        raise Refused("%s carries a backend/%s but no %s. An app with a service must declare what "
                      "it does — run the manifest step first." % (app, BACKEND_ENTRY, MANIFEST))
    if has_manifest and not has_service and not screen:
        raise Refused("%s declares an app but there is neither a backend/%s nor a --screen to "
                      "publish." % (app, BACKEND_ENTRY))
    if not has_manifest and not screen:
        raise Refused("nothing to package: pass --screen for a screen-only app, or an --app "
                      "folder holding %s." % MANIFEST)

    manifest: dict = {}
    if has_manifest:
        manifest = _check_manifest(manifest_path, has_service)
        files[MANIFEST] = manifest_path
    if has_service:
        service = _collect(service_dir, BACKEND_DIR)
        problems = _check_syntax(service) + _check_imports(service)
        if problems:
            raise Refused("the service cannot run as packaged:\n  - %s"
                          % "\n  - ".join(problems))
        problems = _check_routes(manifest, service) + _check_indexes(manifest, service)
        if problems:
            raise Refused("the manifest and the code disagree — the review refuses this:\n  - %s"
                          % "\n  - ".join(problems))
        files.update(service)
    if screen:
        index = os.path.join(screen, ROOT_INDEX)
        if not os.path.isfile(index):
            raise Refused("no %s at the root of %s. Point --screen at the build output "
                          "directory, the one holding %s." % (ROOT_INDEX, screen, ROOT_INDEX))
        if os.path.isdir(os.path.join(screen, RESERVED_SCREEN_DIR)):
            raise Refused(
                '%s holds a folder named "%s". That part of the address always belongs to the '
                "app's service, so those files would be uploaded and never served. Rename it."
                % (screen, RESERVED_SCREEN_DIR))
        # With a manifest the screen goes under frontend/; without one it is the whole archive.
        files.update(_collect(screen, FRONTEND_DIR if has_manifest else ""))

    _write(out, files)
    try:
        return _verify_archive(out, expect_service=has_service, expect_screen=bool(screen))
    except Refused:
        # A bad archive must not be left behind: the next step would upload it.
        os.remove(out)
        raise


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Assemble and verify the archive of a Bulldozer App.")
    parser.add_argument("--app", help="The app working folder: holds %s and backend/." % MANIFEST)
    parser.add_argument("--screen", help="The compiled screen: the build output directory "
                                        "holding %s." % ROOT_INDEX)
    parser.add_argument("--out", default="app.zip", help="Archive to write. Default: app.zip")
    args = parser.parse_args()

    for label, folder in (("--app", args.app), ("--screen", args.screen)):
        if folder and not os.path.isdir(folder):
            print("error: %s is not a directory: %s" % (label, folder), file=sys.stderr)
            return 2
    if not args.app and not args.screen:
        print("error: pass --app, --screen, or both", file=sys.stderr)
        return 2

    try:
        report = build(args.app, args.screen, args.out)
    except Refused as e:
        print("refused: %s" % e, file=sys.stderr)
        return 1

    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
