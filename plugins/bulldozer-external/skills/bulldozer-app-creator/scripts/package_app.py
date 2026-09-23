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
import zoneinfo

MANIFEST = "bulldozer.app.json"
FRONTEND_DIR = "frontend/"
BACKEND_DIR = "backend/"
BACKEND_ENTRY = "index.mjs"
ROOT_INDEX = "index.html"
MIGRATIONS_DIR = "migrations/"

# The fridge refuses 25 MB or more, and that is the tighter of the two limits (the service bundle
# alone may go to 40 MB). Checking the loose one would let a rejected upload look like our success.
MAX_ARCHIVE_BYTES = 25 * 1024 * 1024

# Bounds enforced server-side by AppManifestValidator. Duplicated here on purpose: a manifest
# refused at publish time costs a full round trip, and the message the user gets is ours.
MEMORY_MB = (128, 3008)
TIMEOUT_SEC = (1, 300)

# What the runtime provides — to the SHIPPED HELPER, and to nothing else.
#
# There is no dependency installation step, so an import of anything outside this set and Node's own
# modules resolves to nothing and the service crashes on its first call, in production, with no clue.
#
# These are the store, the file space and the queue. The helper reaches them and derives the project
# boundary itself; that derivation IS the boundary, and it is the only thing enforcing it — the app's
# IAM role grants its whole table and its whole database, with no per-project condition. An app that
# imports these talks to the store directly and reads the neighbouring project of the same customer:
# by assembling its own DynamoDB keys, or by opening its own transaction and setting bdz.project_id
# to whatever it likes, which is precisely the value Row-Level Security trusts. Hence the refusal
# below, outside the helper.
HELPER_ONLY = {
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
    "@aws-sdk/client-s3",
    "@aws-sdk/s3-request-presigner",
    "@aws-sdk/client-sqs",
    "@aws-sdk/client-rds-data",
    "@aws-sdk/client-secrets-manager",
}

# The one file those imports belong to.
HELPER = BACKEND_DIR + "bulldozer.mjs"

IMPORT_RE = re.compile(r"""(?:^|[^\w$.])(?:import|export)\s
                           (?:[^'"()]*?\sfrom\s)?['"]([^'"]+)['"]""", re.X | re.M)

# A route as `defineApp` declares it: `'GET /leads/{id}': async (…) => …`.
ROUTE_RE = re.compile(r"""['"](GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(/[^'"]*)['"]\s*:""")

# A long task, as the code names it: a key of the `jobs` block, and every ctx.jobs.start('name').
JOB_HANDLER_RE = re.compile(r"""['"]?([A-Za-z_][\w-]*)['"]?\s*:\s*async\s*\(""")
JOB_START_RE = re.compile(r"""\bjobs\s*\.\s*start\s*\(\s*['"]([^'"]+)['"]""")
JOBS_BLOCK_RE = re.compile(r"""\bjobs\s*:\s*\{""")

# The sort axis of a query: `list({ by: 'createdAt', … })`.
AXIS_RE = re.compile(r"""\bby\s*:\s*['"]([A-Za-z_]\w*)['"]""")

# Comments are stripped before the scan: a commented-out import is not an import, and refusing to
# publish over one would be a false accusation the author cannot argue with.
COMMENT_RE = re.compile(r"/\*.*?\*/|(?<![:\\])//[^\n]*", re.S)

# `…/{subdomain}/api/…` belongs to the service, for every app on the platform. A screen shipping a
# folder by that name has its files uploaded and never served — the one failure with no symptom.
RESERVED_SCREEN_DIR = "api"

# Provided by the platform on every app, so they are never declared and never implemented. The
# helper answers them from the request path rather than from a route key, precisely so that
# `_check_routes` below does not read them out of the shipped helper as routes of the app.
BUILTIN_ROUTES = {"/jobs/{id}", "/openapi.yaml", "/openapi.json"}

# `001_initial.sql` — the number gives the order migrations are applied in, so a file without one
# has no place in the sequence. Sorting by name instead would put `010_` before `9_`.
MIGRATION_NAME_RE = re.compile(r"^(\d{3,})_[^/]+\.sql$")

# Every table the platform hosts is partitioned by project, and it enforces that with Row-Level
# Security keyed on this column. A table without it cannot be policed, so the platform refuses the
# whole publication — better to say so here, where the author still has the file open.
PROJECT_COLUMN = "project_id"

# Partitioning is the platform's to enforce, and a migration that writes its own policy is refused.
# Not a style rule: permissive policies combine with OR, so one `USING (true)` next to the
# platform's would hand every project's rows to everyone. Measured, before this check existed.
SECURITY_DDL_RE = re.compile(
    r"\b(CREATE\s+POLICY|ALTER\s+POLICY|DROP\s+POLICY"
    r"|ALTER\s+TABLE\s+[^;]*?\bROW\s+LEVEL\s+SECURITY)", re.I | re.S)

# Same family, and the platform refuses both. A table in a schema of the author's own escapes every
# check the platform runs — they all read `public`: the project_id column, row-level security, the
# policies, and the re-read of the catalogue. It would return every project's rows, with no symptom.
# Giving CREATE back on `public` is the other half: the app would own the tables it creates at
# runtime, and an owner may turn row-level security off.
SCHEMA_DDL_RE = re.compile(
    r"\b(CREATE\s+SCHEMA|GRANT\s+[^;]*?\bCREATE\b[^;]*?\bON\s+SCHEMA)", re.I | re.S)

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
        if path in BUILTIN_ROUTES:
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


def _jobs_in_code(files: dict[str, str]) -> set[str]:
    """Every long task the code names — handlers declared, and names passed to ctx.jobs.start."""
    found: set[str] = set()
    for archive_path, source in files.items():
        if not archive_path.endswith((".mjs", ".js")) or archive_path == HELPER:
            continue
        with open(source, encoding="utf-8", errors="replace") as f:
            code = COMMENT_RE.sub("", f.read())
        found.update(JOB_START_RE.findall(code))
        block = JOBS_BLOCK_RE.search(code)
        if block:
            # The handlers live between `jobs: {` and the matching brace; scan a bounded window
            # rather than parse, and let ctx.jobs.start above catch whatever this misses.
            depth, end = 0, len(code)
            for i in range(block.end() - 1, len(code)):
                if code[i] == "{":
                    depth += 1
                elif code[i] == "}":
                    depth -= 1
                    if depth == 0:
                        end = i
                        break
            found.update(JOB_HANDLER_RE.findall(code[block.end():end]))
    return found


def _check_jobs(manifest: dict, files: dict[str, str]) -> list[str]:
    """The manifest's `jobs` against the ones the code actually runs.

    This is not bookkeeping. The platform creates a queue and a consumer only for an app that
    declares tasks, because a consumer polls its queue about 21 600 times a day whether or not
    anything is ever sent to it — a fleet of idle apps is billed for nothing else. An undeclared
    task therefore means no queue at all, and ctx.jobs.start refusing at runtime.
    """
    in_code = _jobs_in_code(files)
    declared = {j for j in (manifest.get("jobs") or []) if isinstance(j, str) and j.strip()}

    missing = sorted(in_code - declared)
    if missing:
        return ['the code runs long task(s) the manifest does not declare: %s. Add them to "jobs" '
                "in %s — without it the app gets no queue and ctx.jobs.start() refuses."
                % (", ".join(missing), MANIFEST)]

    extra = sorted(declared - in_code)
    if extra and in_code:
        return ['"jobs" declares %s, which the code never runs. An app is given a queue only for '
                "the tasks it declares, and a queue costs whether it is used or not."
                % ", ".join(extra)]
    return []


# `rate(3 hours)` and `cron(0 21 * * ? *)`, as EventBridge Scheduler spells them.
RATE_RE = re.compile(r"^rate\(\s*(\d+)\s+(minute|minutes|hour|hours|day|days)\s*\)$", re.I)
CRON_RE = re.compile(r"^cron\(\s*(.+?)\s*\)$", re.I)

# minute, hour, day-of-month, month, day-of-week, year — AWS takes six fields, not the five of
# Unix cron, and rejects the five-field form outright.
CRON_FIELD_RANGES = [(0, 59), (0, 23), (1, 31), (1, 12), (1, 7), (1970, 2199)]

# The schedule's full name must fit AWS's 64 characters next to `bdz-app-` and the installation id.
MAX_SCHEDULE_NAME = 19


def _cron_field_ok(field: str, low: int, high: int) -> bool:
    """One field of an AWS cron expression, wildcards and lists included."""
    if field in ("*", "?"):
        return True
    for part in field.split(","):
        part = part.split("/", 1)[0]            # step: the base is what must be in range
        if part in ("*", "?", "L", "W"):
            continue
        for bound in part.split("-", 1):
            bound = bound.rstrip("LW#0123456789") or bound
            if bound.isdigit():
                if not low <= int(bound) <= high:
                    return False
            elif not bound.isalpha():           # JAN…DEC, MON…SUN and the like
                return False
    return True


def _schedule_expression_error(expression: str) -> str | None:
    """Why AWS would refuse this expression — said here rather than mid-deployment."""
    if RATE_RE.match(expression):
        if int(RATE_RE.match(expression).group(1)) < 1:
            return "a rate must be at least 1"
        return None

    matched = CRON_RE.match(expression)
    if not matched:
        return ('expected cron(...) or rate(...), as in cron(0 21 * * ? *) or rate(3 hours)')

    fields = matched.group(1).split()
    if len(fields) != 6:
        return ("a cron expression takes SIX fields — minute hour day-of-month month day-of-week "
                "year — and got %d. The five-field Unix form is refused by AWS." % len(fields))
    for field, (low, high) in zip(fields, CRON_FIELD_RANGES):
        if not _cron_field_ok(field, low, high):
            return 'field "%s" is out of range (%d-%d)' % (field, low, high)
    if fields[2] != "?" and fields[4] != "?":
        return ("day-of-month and day-of-week cannot both be set: one of them must be \"?\". "
                "Use cron(0 21 * * ? *) for every day, cron(0 21 ? * MON *) for Mondays.")
    return None


def _check_schedules(manifest: dict, files: dict[str, str]) -> list[str]:
    """The manifest's `schedules` against the code, and against what AWS will accept.

    A schedule runs a `jobs` handler with no caller. Pointing it at a handler that does not exist
    would fire on time, every time, and do nothing — the longest kind of failure to find. And an
    expression AWS refuses only surfaces when the schedule is created, which is mid-deployment
    rather than here.
    """
    schedules = manifest.get("schedules") or []
    if not schedules:
        return []

    problems: list[str] = []
    in_code = _jobs_in_code(files)
    declared = {j for j in (manifest.get("jobs") or []) if isinstance(j, str)}
    seen: set[str] = set()

    for entry in schedules:
        if not isinstance(entry, dict):
            problems.append('every entry of "schedules" must be an object')
            continue
        name = (entry.get("name") or "").strip()
        if not name:
            problems.append('a schedule needs a "name", naming the job it runs')
            continue
        if name in seen:
            problems.append('two schedules are both named "%s"' % name)
        seen.add(name)
        if len(name) > MAX_SCHEDULE_NAME:
            problems.append('schedule "%s" exceeds %d characters; its full name must fit AWS\'s '
                            "64-character limit next to the installation id"
                            % (name, MAX_SCHEDULE_NAME))
        if name not in declared:
            problems.append('schedule "%s" runs a job that "jobs" does not declare' % name)
        elif in_code and name not in in_code:
            problems.append('schedule "%s" runs a job the code never defines: it would fire on '
                            "time and do nothing" % name)

        expression = (entry.get("cron") or "").strip()
        if not expression:
            problems.append('schedule "%s" has no "cron" expression' % name)
        else:
            why = _schedule_expression_error(expression)
            if why:
                problems.append('schedule "%s" has an invalid expression "%s": %s'
                                % (name, expression, why))

        tz = (entry.get("tz") or "").strip()
        if not tz:
            problems.append('schedule "%s" has no "tz". A time of day means nothing without a '
                            "timezone, and it would drift by an hour twice a year." % name)
        else:
            try:
                zoneinfo.ZoneInfo(tz)
            except Exception:
                problems.append('schedule "%s" names an unknown timezone "%s"; expected an IANA '
                                'zone such as "Europe/Paris"' % (name, tz))
    return problems


def _check_imports(files: dict[str, str]) -> list[str]:
    """Every import of the service must resolve, offline, inside the archive."""
    problems: list[str] = []
    for archive_path, source in sorted(files.items()):
        if not archive_path.endswith((".mjs", ".js")):
            continue
        with open(source, encoding="utf-8", errors="replace") as f:
            code = COMMENT_RE.sub("", f.read())
        for specifier in IMPORT_RE.findall(code):
            if specifier.startswith("node:"):
                continue
            if specifier in HELPER_ONLY:
                if archive_path == HELPER:
                    continue
                # Deliberately NOT the "nothing is installed" message below: this module does exist
                # at runtime, so that message would be false and the author would chase the wrong
                # thing. Name the boundary instead, and where to go.
                problems.append(
                    '%s imports "%s". An app reaches its data through ctx.db or ctx.sql, its files '
                    "through ctx.files and its long tasks through ctx.jobs — never the store "
                    "directly. The shipped helper derives the project from the caller's sealed "
                    "token, and that is what keeps one project's data out of another's: a key "
                    "assembled by hand, or a project set by hand, reads the neighbouring project."
                    % (archive_path, specifier))
                continue
            if specifier.startswith("."):
                target = os.path.normpath(
                    os.path.join(os.path.dirname(archive_path), specifier)).replace(os.sep, "/")
                if target not in files:
                    problems.append("%s imports %s, which is not in the archive"
                                    % (archive_path, specifier))
                continue
            problems.append(
                '%s imports "%s". Nothing is installed for the app: only its own files, the shipped '
                "helper, and Node's own modules can be imported."
                % (archive_path, specifier))
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


# ───────────────────────────────────────────────────────────── the migrations


def _strip_sql_comments(sql: str) -> str:
    """Comments can hold anything — a `project_id` in prose must not count as a column."""
    sql = re.sub(r"/\*.*?\*/", " ", sql, flags=re.S)
    return re.sub(r"--[^\n]*", " ", sql)


def _table_body(sql: str, start: int) -> str:
    """The parenthesised column list beginning at `start`, paren-matched rather than regexed.

    A column list holds nested parentheses — `numeric(10,2)`, `CHECK (x > 0)` — which a
    non-greedy regex would cut short and a greedy one would run past.
    """
    depth = 0
    for index in range(start, len(sql)):
        if sql[index] == "(":
            depth += 1
        elif sql[index] == ")":
            depth -= 1
            if depth == 0:
                return sql[start + 1:index]
    return sql[start:]


def _tables_without_project_id(migrations: list[tuple[str, str]]) -> list[str]:
    """Replay the migrations on paper and report the tables that end up unpoliceable.

    Cumulative on purpose: a column added by a later `ALTER TABLE` counts, because the platform
    checks the state the base ends in, not the state each file leaves. Flagging a table that
    `002` fixes would be a refusal the author cannot act on.
    """
    tables: dict[str, bool] = {}

    for _, sql in migrations:
        clean = _strip_sql_comments(sql)

        for match in re.finditer(
                r"\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\w.\"]+)\s*\(",
                clean, re.I):
            body = _table_body(clean, match.end() - 1)
            has_column = re.search(
                r"\b%s\s+uuid\b" % PROJECT_COLUMN, body, re.I) is not None
            tables[match.group(1).strip('"').lower()] = has_column

        for match in re.finditer(
                r"\bALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?([\w.\"]+)\s+ADD\s+(?:COLUMN\s+)?"
                r"(?:IF\s+NOT\s+EXISTS\s+)?%s\s+uuid\b" % PROJECT_COLUMN, clean, re.I):
            tables[match.group(1).strip('"').lower()] = True

        for match in re.finditer(
                r"\bDROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([\w.\"]+)", clean, re.I):
            tables.pop(match.group(1).strip('"').lower(), None)

    return sorted(name for name, policed in tables.items() if not policed)


def _check_migrations(manifest: dict, app: str | None) -> dict[str, str]:
    """Collect `migrations/`, in order, and refuse what the platform would refuse on upload."""
    wants_sql = manifest.get("storage") == "sql"
    folder = os.path.join(app, "migrations") if app else None
    present = bool(folder) and os.path.isdir(folder)

    if not present:
        if wants_sql:
            raise Refused(
                'this app declares storage "sql" but has no migrations/ folder. Its database '
                "would hold no table at all, and every query would fail on a missing relation. "
                "Add migrations/001_initial.sql with the CREATE TABLE statements.")
        return {}
    if not wants_sql:
        raise Refused(
            'this app has a migrations/ folder but does not declare storage "sql", so the '
            "platform would never run it. Either set storage to \"sql\" in %s, or delete the "
            "folder." % MANIFEST)

    numbers: dict[int, str] = {}
    collected: list[tuple[int, str, str]] = []
    for name in sorted(os.listdir(folder)):
        source = os.path.join(folder, name)
        if not os.path.isfile(source):
            continue
        matched = MIGRATION_NAME_RE.match(name)
        if not matched:
            raise Refused(
                "migrations/%s is not a valid migration name. Expected a number of at least "
                "three digits, an underscore, a label and .sql — 001_initial.sql for instance."
                % name)
        number = int(matched.group(1))
        if number in numbers:
            raise Refused(
                "migrations/%s and migrations/%s share the number %d, so there is no saying "
                "which runs first. Renumber one of them."
                % (numbers[number], name, number))
        numbers[number] = name
        with open(source, encoding="utf-8") as f:
            collected.append((number, name, f.read()))

    if not collected:
        raise Refused(
            'this app declares storage "sql" but migrations/ holds no .sql file. Add '
            "migrations/001_initial.sql with the CREATE TABLE statements.")

    collected.sort()

    for _, name, sql in collected:
        found = SECURITY_DDL_RE.search(_strip_sql_comments(sql))
        if found:
            raise Refused(
                "migrations/%s writes a security policy (%s). Partitioning by project is the "
                "platform's job, not the app's: it puts a restrictive policy on every table after "
                "your migrations run, and a policy written here is refused. Remove it — you never "
                "filter by project, and you never write a project_id."
                % (name, " ".join(found.group(1).split())))

    for _, name, sql in collected:
        found = SCHEMA_DDL_RE.search(_strip_sql_comments(sql))
        if found:
            raise Refused(
                "migrations/%s reaches outside the public schema (%s). Partitioning lives on "
                "public — the project_id default, row-level security and its policies are posed "
                "there and nowhere else. A table in another schema, or a schema the app may create "
                "in, would return every project's rows without a symptom, so the platform refuses "
                "the publication. Keep your tables in public."
                % (name, " ".join(found.group(1).split())))

    unpoliced = _tables_without_project_id([(name, sql) for _, name, sql in collected])
    if unpoliced:
        raise Refused(
            "these tables have no %s uuid column, so the platform cannot partition them by "
            "project and will refuse the whole publication: %s. Add the column — you never "
            "filter on it yourself, ctx.sql does."
            % (PROJECT_COLUMN, ", ".join(unpoliced)))

    return {MIGRATIONS_DIR + name: os.path.join(folder, name) for _, name, _ in collected}


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
        problems = (_check_routes(manifest, service) + _check_indexes(manifest, service)
                    + _check_jobs(manifest, service)
                    + _check_schedules(manifest, service))
        if problems:
            raise Refused("the manifest and the code disagree — the review refuses this:\n  - %s"
                          % "\n  - ".join(problems))
        files.update(service)
    files.update(_check_migrations(manifest, app))
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
