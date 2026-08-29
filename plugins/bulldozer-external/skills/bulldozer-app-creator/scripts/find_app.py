#!/usr/bin/env python3
"""Find the working folders of Bulldozer Apps already published from this machine.

Why this exists: the platform keeps no source. The screen is stored compiled, the service lives
inside its own runtime, and the uploaded bundle is purged once deployed. So an app can only be
updated from the folder it was built in, and the only reliable trace of that folder is the marker
this skill writes at creation time:

    .bulldozer-app.json   {"hostingId", "name", "subdomain", "clientId", "publicUrl"}

The script answers one question — *where are they, and are the sources still there* — and answers
it offline. Cross-checking against what the platform actually hosts is the caller's job, with
``bdzListHostings``: a marker may name an app that was deleted since.

Usage:
    python find_app.py                       # search the current directory
    python find_app.py --search ~/projects --search ~/work
    python find_app.py --name "lead tracker" # keep the apps whose name/subdomain match

Exit codes:
    0  at least one app found          2  bad usage
    4  no app found (not an error — the caller must offer to rebuild from scratch)
"""

import argparse
import json
import os
import sys

MARKER = ".bulldozer-app.json"

# Directories never worth descending into: they hold dependencies and build output, never a marker
# we wrote, and walking node_modules turns a one-second scan into a minute.
PRUNED = {"node_modules", ".git", ".angular", "dist", "build", ".venv", "__pycache__", ".next"}

MAX_DEPTH = 6


def _sources(folder: str) -> dict:
    """What is still on disk next to the marker. An update needs at least one of the two halves."""
    return {
        "manifest": os.path.isfile(os.path.join(folder, "bulldozer.app.json")),
        "service": os.path.isfile(os.path.join(folder, "backend", "index.mjs")),
        # The Angular project, not its build output: `angular.json` survives a `dist/` wipe.
        "screen": os.path.isfile(os.path.join(folder, "angular.json"))
        or os.path.isfile(os.path.join(folder, "frontend", "angular.json")),
    }


def _read_marker(folder: str) -> dict | None:
    try:
        with open(os.path.join(folder, MARKER), encoding="utf-8") as f:
            marker = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        return {"path": folder, "error": "unreadable %s: %s" % (MARKER, e)}
    if not isinstance(marker, dict):
        return {"path": folder, "error": "%s is not a JSON object" % MARKER}

    found = {"path": os.path.abspath(folder), "sources": _sources(folder)}
    for key in ("hostingId", "name", "subdomain", "clientId", "publicUrl"):
        found[key] = marker.get(key)
    # A marker with no hostingId cannot drive an update: say so here rather than let the caller
    # discover it three steps later.
    if not found["hostingId"]:
        found["error"] = "%s carries no hostingId" % MARKER
    return found


def scan(roots: list[str]) -> list[dict]:
    apps: list[dict] = []
    seen: set[str] = set()
    for root in roots:
        root = os.path.abspath(os.path.expanduser(root))
        base_depth = root.rstrip(os.sep).count(os.sep)
        for folder, subdirs, files in os.walk(root, followlinks=False):
            if folder.count(os.sep) - base_depth >= MAX_DEPTH:
                subdirs[:] = []
            subdirs[:] = [d for d in subdirs if d not in PRUNED and not d.startswith(".")]
            if MARKER in files and folder not in seen:
                seen.add(folder)
                found = _read_marker(folder)
                if found:
                    apps.append(found)
    return apps


def main() -> int:
    parser = argparse.ArgumentParser(description="Find Bulldozer App working folders.")
    parser.add_argument(
        "--search", action="append", metavar="DIR",
        help="Directory to search, repeatable. Default: the current directory.",
    )
    parser.add_argument(
        "--name", help="Keep only the apps whose name or subdomain contains this text.",
    )
    args = parser.parse_args()

    roots = args.search or [os.getcwd()]
    for root in roots:
        if not os.path.isdir(os.path.expanduser(root)):
            print("error: not a directory: %s" % root, file=sys.stderr)
            return 2

    apps = scan(roots)
    if args.name:
        needle = args.name.strip().lower()
        apps = [
            a for a in apps
            if needle in (a.get("name") or "").lower()
            or needle in (a.get("subdomain") or "").lower()
        ]

    apps.sort(key=lambda a: (a.get("name") or "", a["path"]))
    print(json.dumps({"searched": [os.path.abspath(os.path.expanduser(r)) for r in roots],
                      "apps": apps}, indent=2, ensure_ascii=False))
    if not apps:
        print("no app found under: %s" % ", ".join(roots), file=sys.stderr)
        return 4
    return 0


if __name__ == "__main__":
    sys.exit(main())
