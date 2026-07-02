#!/usr/bin/env python3
"""Upload a file to the Bulldozer fridge (public, code-gated, auto-expiring drop).

The fridge upload endpoint is PUBLIC (no authentication) but requires a valid, non-expired
*fridge code*. The code is minted separately by an authenticated user via the MCP tool
``bdzRequestFridgeCode`` (or ``POST /fridge/codes``) and passed to this script — the code is the
only credential this script needs.

Constraints enforced by the server:
  * file must be smaller than 25 MB
  * the object is deleted automatically ~2 hours after upload
  * there is no download or delete endpoint

Usage:
    python upload_fridge_file.py --file ./report.pdf --code <fridge-code>
    FRIDGE_CODE=<fridge-code> python upload_fridge_file.py --file ./report.pdf
    python upload_fridge_file.py --file ./a.png --code <code> --base-url http://localhost:24510
"""

import argparse
import json
import mimetypes
import os
import sys
import uuid
from urllib import error, request

# 25 MB, matching FridgeConstraints.MAX_FILE_SIZE_BYTES on the server.
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024
DEFAULT_BASE_URL = "https://api.bulldozer-collective.fr/v2"
UPLOAD_PATH = "/pub/fridge/files"


def _build_multipart(file_path: str, code: str) -> tuple[bytes, str]:
    """Build a multipart/form-data body with a ``file`` part and a ``code`` field.

    Returns the raw body bytes and the matching Content-Type header value.
    """
    boundary = "----fridge-" + uuid.uuid4().hex
    file_name = os.path.basename(file_path)
    content_type = mimetypes.guess_type(file_name)[0] or "application/octet-stream"

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    crlf = b"\r\n"
    parts: list[bytes] = []

    # code field
    parts.append(("--" + boundary).encode())
    parts.append(b'Content-Disposition: form-data; name="code"')
    parts.append(b"")
    parts.append(code.encode())

    # file field
    parts.append(("--" + boundary).encode())
    parts.append(
        (
            'Content-Disposition: form-data; name="file"; filename="%s"' % file_name
        ).encode()
    )
    parts.append(("Content-Type: %s" % content_type).encode())
    parts.append(b"")

    head = crlf.join(parts) + crlf
    tail = crlf + ("--" + boundary + "--").encode() + crlf
    body = head + file_bytes + tail
    return body, "multipart/form-data; boundary=" + boundary


def upload(base_url: str, file_path: str, code: str) -> dict:
    body, content_type = _build_multipart(file_path, code)
    url = base_url.rstrip("/") + UPLOAD_PATH
    req = request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", content_type)
    req.add_header("Content-Length", str(len(body)))

    with request.urlopen(req) as resp:
        raw = resp.read().decode("utf-8")
    return json.loads(raw) if raw else {}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Upload a file to the Bulldozer fridge (public, code-gated, auto-expiring).",
    )
    parser.add_argument("--file", required=True, help="Path to the file to upload (< 25 MB).")
    parser.add_argument(
        "--code",
        default=os.environ.get("FRIDGE_CODE"),
        help="Fridge code (or set FRIDGE_CODE). Mint one via the bdzRequestFridgeCode MCP tool.",
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("FRIDGE_BASE_URL", DEFAULT_BASE_URL),
        help="API base URL (or set FRIDGE_BASE_URL). Default: %s" % DEFAULT_BASE_URL,
    )
    args = parser.parse_args()

    # Validate the code.
    if not args.code:
        print("error: no fridge code provided (use --code or FRIDGE_CODE)", file=sys.stderr)
        return 2

    # Validate the file locally before any network call.
    if not os.path.isfile(args.file):
        print("error: file not found: %s" % args.file, file=sys.stderr)
        return 2
    size = os.path.getsize(args.file)
    if size == 0:
        print("error: file is empty: %s" % args.file, file=sys.stderr)
        return 2
    if size >= MAX_FILE_SIZE_BYTES:
        print(
            "error: file is %d bytes; the fridge limit is < %d bytes (25 MB)"
            % (size, MAX_FILE_SIZE_BYTES),
            file=sys.stderr,
        )
        return 2

    try:
        result = upload(args.base_url, args.file, args.code)
    except error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        hint = ""
        if e.code == 403:
            hint = " (invalid or expired fridge code — mint a fresh one)"
        elif e.code == 400:
            hint = " (empty file or file too large)"
        print("error: upload failed: HTTP %d%s\n%s" % (e.code, hint, detail), file=sys.stderr)
        return 1
    except error.URLError as e:
        print("error: could not reach %s: %s" % (args.base_url, e.reason), file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
