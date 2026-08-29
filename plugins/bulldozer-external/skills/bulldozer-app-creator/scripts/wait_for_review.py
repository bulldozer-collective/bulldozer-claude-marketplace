#!/usr/bin/env python3
"""Read — and if asked, wait for — the review verdict of an app that has a service.

An app with a service is not published on upload. It is reviewed first: a few automated checks,
about a minute, and the app goes live only if they pass. While the review runs, and if the app is
refused, **the version already online stays online** — a refusal never takes an app down.

Two modes, because the credential lives in two different places:

  * ``--from-json`` reads a hosting object already fetched through MCP (``bdzGetHosting``) and only
    renders the verdict. This is the mode the skill uses: MCP carries the authentication.
  * ``--token`` polls the API directly until the verdict lands. For tests and scripts.

Usage:
    bdzGetHosting … | python wait_for_review.py --from-json -
    python wait_for_review.py --hosting-id <id> --customer-id <id> --project-id <id> \\
        --token "$BDZ_TOKEN" [--timeout 300]

Exit codes:
    0  the app is live                    5  refused, reasons on stdout
    6  no verdict yet — still under review when we stopped waiting
    7  this version was replaced by a newer one before it was decided
    1  the call failed                    2  bad usage
"""

import argparse
import json
import os
import sys
import time
from urllib import error, request

DEFAULT_BASE_URL = "https://api.bulldozer-collective.fr/v2"
POLL_SECONDS = 5
DEFAULT_TIMEOUT = 300

PENDING = "APP_REVIEW_STATUS_PENDING"
APPROVED = "APP_REVIEW_STATUS_APPROVED"
REJECTED = "APP_REVIEW_STATUS_REJECTED"
DEPLOYED = "APP_REVIEW_STATUS_DEPLOYED"
SUPERSEDED = "APP_REVIEW_STATUS_SUPERSEDED"

# What each check looked at, said without naming a single piece of machinery. The *reasons* a check
# fails, and what to do about each, are in references/review-verdicts.md — this is only a label.
CHECKS = {
    "APP_REVIEW_CHECK_LINT": "what the code is allowed to do",
    "APP_REVIEW_CHECK_POLICY": "what the app is for",
    "APP_REVIEW_CHECK_COHERENCE": "the app does what it says it does",
    "APP_REVIEW_CHECK_ADVERSARIAL": "the code cannot reach beyond the app",
}

# Told to the user as-is when the verdict lands, so the wait and the refusal are never a surprise.
STATUS_MEANING = {
    PENDING: "under review",
    APPROVED: "accepted, going live",
    REJECTED: "refused — nothing was published, and the version already online is untouched",
    DEPLOYED: "live",
    SUPERSEDED: "replaced by a more recent version of the app",
}


def fetch(base_url: str, hosting_id: str, customer_id: str, project_id: str, token: str) -> dict:
    url = "%s/hostings/%s" % (base_url.rstrip("/"), hosting_id)
    req = request.Request(url, method="GET")
    req.add_header("Authorization", "Bearer " + token)
    req.add_header("X-Bdz-Customer-Id", customer_id)
    req.add_header("X-Bdz-Project-Id", project_id)
    with request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _hosting(payload: dict) -> dict:
    """Accept the response envelope or a bare hosting: callers paste both."""
    if isinstance(payload.get("hosting"), dict):
        return payload["hosting"]
    return payload


def render(hosting: dict) -> tuple[dict, int]:
    review = hosting.get("appReview")
    if not review:
        # No review at all means no service: a screen-only app is published straight away.
        return {
            "status": "PUBLISHED",
            "meaning": "live — this app has no service, so it goes out without a review",
            "publicUrl": hosting.get("publicUrl"),
            "reasons": [],
        }, 0

    status = review.get("status") or "unknown"
    findings = review.get("findings") or []
    blocking = [f for f in findings if f.get("verdict") == "APP_REVIEW_VERDICT_FAIL"]
    warnings = [f for f in findings if f.get("verdict") == "APP_REVIEW_VERDICT_WARN"]

    def reasons(items: list[dict]) -> list[dict]:
        return [{
            "about": CHECKS.get(f.get("check"), f.get("check")),
            "reason": f.get("summary"),
            "details": f.get("details"),
        } for f in items]

    verdict = {
        "status": status,
        "meaning": STATUS_MEANING.get(status, status),
        "publicUrl": hosting.get("publicUrl"),
        "submittedAt": review.get("submittedAt"),
        "decidedAt": review.get("decidedAt"),
        "reasons": reasons(blocking),
        "warnings": reasons(warnings),
    }
    if status == DEPLOYED:
        return verdict, 0
    if status == REJECTED:
        return verdict, 5
    # Terminal too, and not a refusal: this version simply lost the race to a newer one. Reporting
    # it as "still waiting" would send the caller into a loop that never ends.
    if status == SUPERSEDED:
        return verdict, 7
    return verdict, 6


def main() -> int:
    parser = argparse.ArgumentParser(description="Read the review verdict of a Bulldozer App.")
    parser.add_argument("--from-json", metavar="FILE",
                        help="Read a hosting object already fetched (- for stdin) and only render "
                             "it. No polling, no credential needed.")
    parser.add_argument("--hosting-id")
    parser.add_argument("--customer-id")
    parser.add_argument("--project-id")
    parser.add_argument("--token", default=os.environ.get("BDZ_TOKEN"))
    parser.add_argument("--base-url", default=os.environ.get("BDZ_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT,
                        help="Seconds to wait for a verdict. Default: %d" % DEFAULT_TIMEOUT)
    args = parser.parse_args()

    if args.from_json:
        raw = sys.stdin.read() if args.from_json == "-" else open(
            args.from_json, encoding="utf-8").read()
        try:
            hosting = _hosting(json.loads(raw))
        except json.JSONDecodeError as e:
            print("error: not valid JSON: %s" % e, file=sys.stderr)
            return 2
        verdict, code = render(hosting)
        print(json.dumps(verdict, indent=2, ensure_ascii=False))
        return code

    missing = [n for n in ("hosting_id", "customer_id", "project_id", "token")
               if not getattr(args, n)]
    if missing:
        print("error: missing %s (or use --from-json)"
              % ", ".join("--" + n.replace("_", "-") for n in missing), file=sys.stderr)
        return 2

    deadline = time.monotonic() + args.timeout
    while True:
        try:
            hosting = _hosting(fetch(args.base_url, args.hosting_id, args.customer_id,
                                     args.project_id, args.token))
        except error.HTTPError as e:
            hint = " (the token is expired or lacks access to this project)" if e.code in (
                401, 403) else ""
            print("error: HTTP %d%s\n%s" % (e.code, hint, e.read().decode("utf-8", "replace")),
                  file=sys.stderr)
            return 1
        except error.URLError as e:
            print("error: could not reach %s: %s" % (args.base_url, e.reason), file=sys.stderr)
            return 1

        verdict, code = render(hosting)
        # Still moving: PENDING, and APPROVED while the app is being put online.
        if verdict["status"] not in (PENDING, APPROVED) or time.monotonic() >= deadline:
            print(json.dumps(verdict, indent=2, ensure_ascii=False))
            return code
        print("  %s…" % verdict["meaning"], file=sys.stderr)
        time.sleep(min(POLL_SECONDS, max(0, deadline - time.monotonic())))


if __name__ == "__main__":
    sys.exit(main())
