---
name: |-
  bulldozer-app-creator-backend
description: |-
  Build the service of a Bulldozer App — REST routes, its own data, its own files and long tasks — and the manifest that declares what it does.
when-to-use: |-
  Called by `bulldozer-app-creator`. Not invoked on its own.
user-invocable: false
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Agent
  - AskUserQuestion
effort: |-
  medium
metadata:
  "forge": "disabled"
---

# The service

The router gave you the app's name, the subdomain, and what the user asked for. You produce a
working folder containing exactly this:

```
my-app/
├── bulldozer.app.json      what the app does — written last, from the finished code
├── migrations/             ONLY for a "sql" app — see step 2
│   └── 001_initial.sql     its CREATE TABLE statements
└── backend/
    ├── index.mjs           the app
    └── bulldozer.mjs       the shipped helper, copied as-is
```

Copy the helper from `assets/bulldozer.mjs`. **Never edit it and never rewrite what it does.** It is
what keeps one project's data out of another's, and an app that builds its own keys loses that.

Nothing is installed. The service may import the helper, Node's own modules and its own files —
nothing else. There is no `package.json` and no dependency step.

**The helper's own imports are not yours.** They reach the store directly, and the helper is the only
thing that builds keys from the caller's project — an app that imports them builds its own keys, and
a hand-built key reads the neighbouring project. Packaging refuses them.

## 1. Understand the need, in the user's words

The person asking is not a developer. Ask about the work, not the design:

- **What must the app remember?** — the things it keeps between visits. That becomes its data.
- **What must it be able to do?** — each action becomes a route.
- **Is anything slow?** — a large import, a report over months of data, calls to another tool. Those
  become long tasks, because a request is cut off after 30 seconds.
- **Does anything have to happen on its own?** — "every evening", "every three hours", "on the first
  of the month". Those become **scheduled tasks**: the same `jobs` handler, with a timetable. Ask for
  the time *and* the timezone; "21 h" means nothing without one. A scheduled task has no caller, so
  it cannot call the Bulldozer API — say so if the need depends on it.
- **Does it need anything from outside Bulldozer?** — name the tools out loud; each becomes an
  `egress` entry with a reason.

Read **`references/capabilities.md`** before answering "can it…". Five capabilities exist; anything
else must be said to be impossible rather than approximated. It covers everything but the store —
which of the two an app gets is step 2, and each has its own reference.

## 2. Decide where it stores things — and say so out loud

An app gets **one** store, chosen now, before a line is written. The three are exclusive: `ctx.db`
and `ctx.sql` never coexist.

| Choice | When | On `ctx` | Reference |
|---|---|---|---|
| `"documents"` | a list of things, each read and written whole | `ctx.db` | `references/storage-documents.md` |
| `"sql"` | the app must **relate, aggregate or constrain** records | `ctx.sql` | `references/storage-sql.md` |
| `"none"` | it remembers nothing between visits | neither | — |

Read the one you chose, and **only** that one: the other describes an API this app does not have.

Reach for `"sql"` when the need contains one of these, in the user's own words: *"how many per
month"*, *"total per client"*, *"the ones with no matching X"*, *"never twice the same reference"*,
*"a report over"*. Those are joins, `GROUP BY`, `SUM` and uniqueness constraints — documents have
none of them, and computing them means reading everything on every call.

Stay with `"documents"` for the ordinary case: a screen listing things, filtering them, showing one.
It costs nothing when idle, needs no schema, and most apps never leave it.

⚠️ **Ask the user when the two readings are both defensible** — with `AskUserQuestion`, in plain
words: "does this need totals and cross-referencing, or just a list of records?" Two reasons, and
neither is caution for its own sake:

- **The choice is final.** Storage is fixed at the app's first publication. An app published on
  documents cannot move to SQL later — its data would not be converted, and the platform refuses the
  change outright. Getting it wrong means republishing under a new name and losing what was stored.
- **SQL is billed** on the shared database's capacity; documents are not billed when idle.

So: obvious need → decide it yourself and say which you chose and why. Any real doubt → ask. Never
pick `"sql"` because it feels more capable, and never pick `"documents"` to avoid the question.

### If it is `"sql"`

Write `migrations/001_initial.sql` at the root of the working folder, **beside** `bulldozer.app.json`
and never under `backend/`. Two rules the platform enforces and packaging checks:

- **every table carries a `project_id uuid` column** — it is what partitions the data by project;
- **each file is applied once**, in the order of its number. To change the schema later, add
  `002_…sql`; never edit a file that has already been published.

The app never writes `WHERE project_id = …` and never inserts one. Read
**`references/storage-sql.md`** before writing any of it. `storage-documents.md` does not apply:
collections, `list({ by })` and the manifest's `indexes` do not exist for a SQL app.

## 3. Write the code

Delegate to the **`bdz-app-backend-implementer`** agent. An agent starts with none of your context,
so everything it needs goes in the prompt: the need in the user's words, **the storage decided in
step 2 and why**, the collections or tables and the routes agreed in step 1, the long tasks, the
outside services, the **absolute path of the working folder**,
and the **absolute paths** of `assets/bulldozer.mjs`, `references/capabilities.md`,
**the storage reference matching step 2** — `references/storage-documents.md` or
`references/storage-sql.md`, never both — and `scripts/try_service.mjs`. It cannot find files
relative to this skill. It writes
`backend/index.mjs`, copies the helper, writes `migrations/001_initial.sql` for a `"sql"` app, and
runs the result before returning.

Read what it produced before going further. If it returned nothing usable, that is a failure — say
so and retry with a sharper brief; do not paper over it by writing the code yourself in passing.

## 4. Run it, here, before anyone publishes it

```bash
node scripts/try_service.mjs --app <folder> \
    --request 'POST /notes {"text":"hello"}' \
    --request 'GET /notes'
```

A scheduled task fires the same way, without waiting for its hour:

```bash
node scripts/try_service.mjs --app <folder> --tick digest
```

A route that depends on who is calling needs to be tried as that person, otherwise it is only ever
tried as an ordinary member:

```bash
node scripts/try_service.mjs --app <folder> --request 'DELETE /notes/1' \
    --project-role MANAGER --roles bulldozer-core-admin
```

The service runs on this machine with its data, its files and its long tasks held in memory —
nothing installed, nothing published, no waiting. Queued tasks run straight away, so one command
covers the whole round trip.

**Do this before every publication.** Otherwise the first run of the code is in production, after a
minute of review — and nobody can read an app's logs afterwards, so a failure there says almost
nothing. Exercise each route, including the refusals; a `4xx` the app returns on purpose is fine, a
`5xx` is not. Show the user what their app does before asking them to wait for it.

## 5. Three things that get an app refused

Every app is reviewed before it goes live. These three are what actually trips authors up:

- **Code that builds code.** `eval`, `new Function`, an `import()` chosen at runtime, a `require`
  assembled from a variable. Refused outright, with no exception: if nobody can tell in advance what
  the app will run, it does not run. Write the branches out.
- **Code that *looks* like it reaches beyond the app** — a key or a path built by hand, a name from
  another installation, a "just to check" access. It is refused even when harmless, and rightly so:
  the check cannot read intent. Do not write it, not even temporarily.
- **The app's own resources listed as outside calls.** Its data, its files, its long tasks are not
  `egress`. Declaring them contradicts the code, and a manifest that contradicts the code is refused.

## 6. Answer the one question that cannot be derived

Run the **`bdz-app-personal-data-auditor`** agent on the finished code, passing the working folder's
absolute path. It answers `personalData`, true or false, with the reason. Do not answer it yourself
and do not ask the user: the review compares the answer to the code, and a guess is a refusal a
minute later.

## 7. Write the manifest

Run the **`bdz-app-manifest-writer`** agent on the finished code, passing the working folder's
absolute path, the app's name, and the auditor's verdict. It derives `routes` from the code and
`egress` from the addresses the code actually contacts — neither is asked for, because asking is
exactly how the two drift apart.

Check its output against **`references/manifest.md`** before accepting it.

## Then hand back

The router takes over: it packages, publishes, and waits for the verdict. Tell it whether the app
also has a screen, and give it the routes so the screen can call them.

## Checklist

- [ ] Helper copied from `assets/bulldozer.mjs`, unmodified
- [ ] Need understood in the user's words: data, actions, slow work, outside tools
- [ ] **Storage chosen** — `documents`, `sql` or `none` — decided when obvious, **asked when not**,
      and its reference read
- [ ] For a `sql` app: `migrations/001_initial.sql` written, every table carrying `project_id uuid`
- [ ] Code written by `bdz-app-backend-implementer`, and read afterwards
- [ ] **Run locally with `scripts/try_service.mjs`** — every route, and the long tasks
- [ ] No generated code, no reach beyond the app, own resources not declared as `egress`
- [ ] `personalData` answered by `bdz-app-personal-data-auditor`, not guessed
- [ ] Manifest written by `bdz-app-manifest-writer` and checked against `references/manifest.md`
