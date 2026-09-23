# When an app is refused

Read this only when `wait_for_review.py` returns `APP_REVIEW_STATUS_REJECTED`.

## What to say first

Three facts, before anything else, because the user will assume the worst:

1. **Nothing was published, and nothing is billed.** A refused app never runs.
2. **The version already online is untouched.** If the app existed, it still works.
3. **A refusal is a decision about this code, not about the user.** Say what was refused, not who.

## Then: explain, and ask

Your job is to translate the reason and hand the decision back. Report each blocking reason in one
sentence a non-developer can act on, propose the fix you would make, and **ask before making it**.

**Never rewrite the app to get past a check on your own initiative.** Two of these checks exist to
catch code that hides what it does; quietly reshaping code until it passes is exactly the behaviour
they are looking for, and the user would end up with an app they never agreed to.

## The four checks, in plain words

| `about` | What it looked at |
|---|---|
| what the code is allowed to do | mechanical rules — some constructs are simply not permitted |
| what the app is for | the name and the manifest: is this a growth-marketing tool? |
| the app does what it says it does | the code against its own declaration |
| the code cannot reach beyond the app | how this code could reach data that is not its own |

## The refusals you will actually meet

**"eval", "new Function", a dynamic import, `require` built at runtime.** The app builds code, or
picks what to load, while it runs — so nobody can tell in advance what it will do. There is no
workaround and no exception. The fix is always the same: write the branches out explicitly. If the
user genuinely needs a choice at runtime, it becomes a `switch` over a fixed set.

**A module the app may not use** — `child_process`, `worker_threads`, `vm`, `net`, `dgram`,
`cluster`, `v8`, `inspector`, `dns`, `module`. Whatever the app was trying to do, it has a supported
way to do it: long work goes through the long-task mechanism, calls out go through plain `fetch`,
storage goes through the app's own data and files. Point at the capability instead of arguing the
module. `module` is on the list because `createRequire` rebuilds `require` from it, which would put
every other name on this list back within reach.

**A module that is not `node:` and not one of the app's own files.** Nothing is installed, so there
is no third name to import. The only exception is the shipped helper, and it is the shipped helper
that reaches the store — an app that imports the store's client builds its own keys, and a key built
by hand reads the neighbouring project.

**Reading `process`.** Not a style rule: a function's environment carries the credentials of its
execution role, and nothing an app needs to read is in there. Its data is in `ctx.db` or `ctx.sql`,
its files in `ctx.files`. Writing `const p = process` to get around the name is the same refusal —
the check is on the reference, not on `process.env`.

**Writing to a file on disk.** An app has no durable disk. Files belong in the app's own file
storage; a scratch file, if truly needed, goes in `/tmp` and disappears. This one is usually a
one-line change.

**"Looks obfuscated"** — base64 blobs, strings built from character codes, globals reached through
a computed name. On its own this is a warning, not a refusal, but it feeds the check that looks for
hidden behaviour, and it is what tips a borderline app over. If the app has a legitimate reason
(decoding an upload, for instance), say so plainly in the code around it and resubmit; if not,
write the value out in the open.

**"Outside the growth-marketing domain."** The platform hosts marketing tooling. Adult content,
gambling, and the other excluded categories are refused, and no rewording changes that. Tell the
user directly; do not try to disguise the app's purpose.

## One refusal that is **ours**, not the app's

**"The check could not be completed, for a technical reason on our side."** That is exactly what it
says: no check found anything against the app. The reviewing model's answer could not be read —
usually because it ran long and was cut off.

Do not look for a fault in the code, and do not change anything. Say plainly that the platform
failed, and republish the same app unchanged. If it happens twice in a row on the same app, that is
worth reporting rather than working around.

## Two refusals that are the *manifest's* fault, not the code's

These two are worth checking before touching a single line, because the code is usually right and
the declaration is wrong:

- **"stores personal data but declares it does not."** Look at what is actually stored. The
  identifiers the platform hands the app — the signed-in user, the customer, the project — do
  **not** count as personal data: every app receives them. The attributes of a *person the app
  describes* — a contact's name, email, phone, job — do. If the app stores those, `personalData`
  must be `true`, and that is the whole fix.
- **"reaches an address it did not declare."** The app's own data, files and long tasks are not
  outside calls and must not be listed. Only genuine third-party addresses the app contacts belong
  in `egress`. A refusal here means either a missing third-party address, or a listed one that
  should never have been there.

## After a fix

Repackage and republish exactly as the first time — `package_app.py`, fridge, then
`bdzReplaceHostingContent`. The review runs again from scratch on the new version. A refused
version consumes nothing: it does not count against the customer's app quota.
