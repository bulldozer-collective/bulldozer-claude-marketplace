---
name: bulldozer-fridge
description: |
  Temporarily drop a file into the Bulldozer "fridge" — a code-gated, public, auto-expiring S3 upload.
when-to-use: |
  Use when the user wants to quickly share / drop / stash / upload a file for a short time (a scratch
  or throwaway upload that self-destructs), or hand a file to an external/unauthenticated party via a
  fridge code. NOT for permanent hosting of a page/site (use hosting) or for generated project assets
  (use studio).
user-invocable: false
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzRequestFridgeCode
effort: low
---

# Bulldozer Fridge

The **fridge** is an ephemeral, code-gated file drop. A file is uploaded to a dedicated
`bdz-fridge` S3 bucket and **auto-deleted ~2 hours after upload**. It is designed for short-lived,
throwaway sharing — not durable storage.

## Core facts

- **Ephemeral**: every file is deleted automatically ~2h after upload by an hourly cleanup. It
  **cannot** be deleted manually.
- **No public URL**: a fridge file is **not** publicly served and has **no** user- or MCP-facing
  download endpoint. The upload returns only metadata (`file.id`, etc.); the object lives privately at
  S3 key `fridge/{id}` in the `bdz-fridge` bucket. **Never build, guess, or reconstruct a link to it.**
  The **only** sanctioned way to consume a fridge file downstream is to pass its **`fridgeId`**
  (= `file.id`) to hosting (owner-only) — see "Hosting a fridge file" below.
- **Size limit**: the file must be **smaller than 25 MB** (the same ceiling as hosting). Any content
  type is allowed.

> ⚠️ **The intuitive trap:** do **not** take a fridge file and pass a reconstructed S3 URL as a `url`
> to hosting (or anywhere). There is no such URL. Pass the **`fridgeId`** (the `file.id` from the
> upload response) instead.
- **Two-step, split-trust model**: the upload endpoint is **public** (no auth) but gated by a
  **fridge code**. The code is minted only by an **authenticated** user. So: *you* (authenticated)
  mint the code, then the (unauthenticated) upload script sends the file with that code. The code is
  the only credential the upload needs.
- A **fridge code is valid for 1 hour** and is a **global access pass** — any valid, non-expired
  code authorizes an upload.

## End-to-end workflow

1. **Resolve the customer** — ensure a `customerId` is available (via the
   `bulldozer-project-chooser` skill / `bulldozer.json`). It is needed for the subscription check on
   the code endpoint.
2. **Mint a fridge code** — call the MCP tool **`bdzRequestFridgeCode`** with the `customerId`.
   It returns:
   ```json
   { "fridgeCode": { "code": "ab12…", "expiresAt": "2026-07-01T11:00:00Z" } }
   ```
   The code is valid **1 hour**. If it has expired, mint a fresh one.
3. **Upload the file** — run the Python script, passing the file and the code:
   ```bash
   python skills/bulldozer-fridge/scripts/upload_fridge_file.py \
       --file /path/to/file --code <code>
   ```
   The script is dependency-free (stock Python 3) and needs **no** auth — only the code.
4. **Report the result** — on success the script prints an `UploadFridgeFileResponse` in which the
   `FridgeFile` is **nested under `file`** (it is **not** flat):
   ```json
   { "file": { "id": "…", "fileName": "…", "contentType": "…", "sizeBytes": 12345, "createdAt": "…" } }
   ```
   Take **`file.id`** — that id is the `fridgeId` you pass downstream (e.g. to hosting). Tell the user
   the file will disappear ~2h after `file.createdAt`.

## Passing the fridge code to the script

The `code` string from step 2 reaches the script either way:

- **CLI flag**: `--code <code>` (preferred, explicit).
- **Env var**: `export FRIDGE_CODE=<code>` then run without `--code`.

The script sends it as the `code` multipart field alongside the `file` part. No JWT/token is
involved in the upload.

## Script options

| Flag | Env fallback | Default | Notes |
|------|--------------|---------|-------|
| `--file` | — | — | **Required.** Path to the file (< 25 MB). |
| `--code` | `FRIDGE_CODE` | — | Fridge code from `bdzRequestFridgeCode`. |
| `--base-url` | `FRIDGE_BASE_URL` | `https://api.bulldozer-collective.fr/v2` | Use `http://localhost:24510` for local dev. |

The script validates the file exists and is < 25 MB **before** any network call, then POSTs to
`{base-url}/pub/fridge/files`.

## Errors

| Where | Code | Meaning / action |
|-------|------|------------------|
| `bdzRequestFridgeCode` | 402 | Customer subscription lacks `BASICS`. |
| upload script | 403 | Invalid or expired fridge code → mint a fresh one and retry. |
| upload script | 400 | Empty file or file ≥ 25 MB. |

## Hosting a fridge file

If the user actually wants to **host / publish** the file (a durable link, not a throwaway drop),
don't stop at the fridge — invoke the **`bulldozer-hosting`** skill (its Workflow B):

1. Upload to the fridge as above and take **`file.id`**.
2. In the hosting skill, call `bdzCreateHosting` with **`fridgeId` = `file.id`** (owner-only: only the
   user who uploaded the fridge file may host it). Do this **within ~2h**, before the fridge file
   auto-expires.

Again: pass the **`fridgeId`**, never a reconstructed URL — the fridge file has no public URL.

## Reference

Full endpoint contract: `FRIDGE_API.md` at the repository root.
