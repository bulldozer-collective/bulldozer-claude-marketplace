# Publishing an app

**§1 runs before a line of code is written** — the screen has to be compiled against an address, and
the address only exists once the app is reserved. Everything from §2 onwards runs once the code is
there.

Publishing an app that has a service costs a handful of jetons, and takes anything from a minute to
ten depending on its size, because it is reviewed first. Say so before starting, so neither the
wait nor the cost is a surprise.

## 1. Reserve the app — before building anything

Ask the user for two things, in their words:

- **a name** — human-readable, shown nowhere but in listings;
- **the end of the address** (the *subdomain*): the app will live at
  `https://{slug}.bulldozer-os.fr/{subdomain}/`. Lowercase letters, digits and hyphens, 63 max,
  unique per customer.

Then generate a client id with a random suffix — `bdz-app-{subdomain}-{random}` — and call
**`bdzCreateHosting`** with `type = HOSTING_TYPE_STATIC_SITE`, `name`, `subdomain`, `clientId`,
and **no `fridgeId` and no `url`**. That reserves the address and provisions sign-in against it,
and returns the hosting `id`, the `clientId` and the `publicUrl`.

> On an **update**, do not create anything: reuse the hosting `id` and the **same `clientId`**
> from `.bulldozer-app.json`. A new client id would mean a new app, and every user would have to
> sign in again.

## 2. Compile the screen

The app is served from a sub-path, so the compiled screen must know it:

```bash
ng build --base-href "/{subdomain}/"
```

The output lands in `dist/<project>/browser/` — that directory, the one holding `index.html`, is
what the next step wants.

## 3. Assemble the archive

Never zip by hand. The shape is a contract and every mistake in it fails silently, hours later:

```bash
python scripts/package_app.py --app ./my-app \
    --screen ./my-app/dist/my-app/browser --out app.zip
```

- `--app` — the folder holding `bulldozer.app.json` and `backend/`, plus `migrations/` for a
  `storage: "sql"` app. Omit for a screen-only app.
- `--screen` — the compiled screen. Omit for an app that has no screen.

The script refuses to write an archive the platform would reject, and re-reads the one it wrote to
prove its shape. It also catches, in a second rather than after a minute of review: a service that
does not parse, an import nothing provides, a manifest that declares routes the code does not answer
(or the reverse), a manifest field out of bounds, and a screen shipping a folder named `api`. For a
SQL app it also checks the migrations: numbered names, no two sharing a number, and a `project_id
uuid` column on every table — without which the platform refuses the whole publication. If it
refuses, **fix the cause** — the message names it — and run it again.

## 4. Upload, then publish

The archive goes through the fridge, a short-lived drop. Use the `bulldozer:bulldozer-fridge`
skill's script rather than hand-rolling the upload — **invoke that skill and let it give you the
path to its own script**, which is not the same depending on how it is installed:

```bash
python <path given by bulldozer-fridge>/upload_fridge_file.py --file app.zip --code <code>
```

- mint the code with **`bdzRequestFridgeCode`** (needs `customerId`);
- take `file.id` from the response — that is the `fridgeId`;
- call **`bdzReplaceHostingContent`** with `customerId`, `projectId`, the hosting `id` and that
  `fridgeId`, within the two hours before the drop expires.

## 5. Wait for the verdict — only when the app has a service

A screen-only app is live the moment step 4 returns. An app **with a service** is reviewed first,
and **the version already online stays online throughout** — including if the new one is refused.

**Budget the wait.** About a minute for a small app. **Up to ten for a large one**: two of the
checks re-read the code in slices, so the time grows with the size of the service, not with the
number of files. Say so up front, then keep watching.

Poll `bdzGetHosting` and read the answer through the script, which turns the verdict into plain
words:

```bash
# feed the bdzGetHosting response to:
python scripts/wait_for_review.py --from-json -
```

This renders one snapshot — it does not wait. Calling it again is your job.

- `status: APP_REVIEW_STATUS_DEPLOYED` → live. Give the user `publicUrl`.
- `APP_REVIEW_STATUS_PENDING` → under review.
- `APP_REVIEW_STATUS_APPROVED` → accepted, **not yet live**. The database, the service and its
  routes are being set up, and that follows the decision rather than being part of it.
- `APP_REVIEW_STATUS_REJECTED` → read **`review-verdicts.md`**. Nothing was published and nothing
  is billed.
- `APP_REVIEW_STATUS_SUPERSEDED` → a newer version of the app overtook this one. Follow that one.

On either of the first two non-final answers, wait ~15 s and call `bdzGetHosting` again. **Keep
going until `DEPLOYED`, `REJECTED` or `SUPERSEDED`** — those three are the only answers worth
reporting. Say what is happening at each turn rather than going quiet, and do not announce an app as
live on `APPROVED`.

**Do not republish to unstick it.** A revision that stays `APPROVED` for a long time is a
deployment that failed, and the platform retries it by itself every minute. Publishing again only
supersedes the revision that was about to succeed and starts the whole setup over. Tell the user
what you see and stop there.

## 6. Leave a trace — always, create or update

The platform keeps no source. Write `.bulldozer-app.json` at the root of the working folder, so
the app can be found and updated later:

```json
{
  "hostingId": "…",
  "name": "…",
  "subdomain": "…",
  "clientId": "…",
  "publicUrl": "https://{slug}.bulldozer-os.fr/{subdomain}/"
}
```

`package_app.py` never puts this file in the archive — it is a local note, not part of the app.

## Checklist

- [ ] Name and subdomain asked in the user's words, subdomain explained as the end of the address
- [ ] Hosting reserved (`bdzCreateHosting`, no `fridgeId`/`url`) — or reused as-is on an update
- [ ] Screen compiled with `--base-href "/{subdomain}/"`
- [ ] Archive assembled by `package_app.py`, never by hand
- [ ] Uploaded through the fridge script, published with `bdzReplaceHostingContent`
- [ ] Verdict awaited and reported when the app has a service
- [ ] `.bulldozer-app.json` written, and the public URL given to the user
