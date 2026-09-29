# `bulldozer.app.json`, field by field

The manifest sits at the **root of the archive**, next to `backend/`. It is the app's declaration of
what it does, and the review compares it against the code — so a wrong field is not a detail, it is
a refusal.

Do not write it by hand: `bdz-app-manifest-writer` derives it from the finished code, and
`bdz-app-personal-data-auditor` answers the one question that cannot be derived. This page is the
reference they and you check against.

## A complete manifest

```json
{
  "name": "Lead tracker",
  "runtime": "nodejs22",
  "personalData": true,
  "storage": "documents",
  "routes": [
    { "path": "/leads", "methods": ["GET", "POST"] },
    { "path": "/leads/{id}", "methods": ["GET", "DELETE"] }
  ],
  "egress": [
    { "host": "api.exchangerate.host", "why": "convert campaign spend to the customer's currency" }
  ],
  "limits": { "memoryMb": 512, "timeoutSec": 60 }
}
```

## What each field is worth

Three tiers, and confusing them is how a manifest ends up lying:

- **applied** — `storage`, `indexes` and `limits` decide what is actually set up. `indexes` is the
  only one that is **billed**: an index too many costs on every write, used or not;
- **checked before the app goes live** — `name`, `runtime`, `personalData`, `routes`, `egress`;
- **neither** — `scopes` and `serviceProjects` are read and stored, but nothing acts on them yet.
  Do not write them expecting an effect, and never present them to the user as a protection.

| Field | Required | Rules |
|---|---|---|
| `name` | yes | non-empty, 120 characters max |
| `runtime` | yes, with a service | `"nodejs22"` — the only one |
| `personalData` | yes, with a service | `true` or `false`, never omitted, never guessed |
| `storage` | no | `"documents"` (default), `"sql"` or `"none"` |
| `jobs` | no | names of the long tasks the code runs; omit when there are none |
| `schedules` | no | `{ name, cron, tz }` per task that runs on a timetable |
| `routes` | no, but write them | `path` starts with `/`; `methods` from GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS; 100 max |
| `egress` | no, but write them | `host` is a bare hostname, `why` is mandatory; 50 max |
| `indexes` | no | fields the app sorts or filters on; 20 max, see below |
| `limits.memoryMb` | no | 128 to 3008. Default 512 |
| `limits.timeoutSec` | no | 1 to 300. Default 30 |

`personalData` has no default on purpose. It is a question its author must answer, and answering it
wrong is caught: the review reads the code and compares.

## `routes` — what the app exposes

One entry per path the service declares, with the methods it handles. Write the path as the code
declares it, `{id}` included. `GET /jobs/{id}` is provided by the platform, not by the app — **do
not list it**.

A route in the code that is missing from the manifest, or a route declared and not implemented,
both read as the app doing something other than what it says.

## `egress` — genuine outside calls only

A hostname, nothing else: no `https://`, no path, no port. `*.example.com` is allowed, with the
wildcard only in first position. Every entry needs a `why` in plain words — "convert campaign spend
to the customer's currency", not "API call".

**A long `egress` list usually means a design mistake.** The app holds no credential, so a tool that
needs one cannot be called directly. When Bulldozer already integrates it — HubSpot, Slack, Webflow,
Google Ads, GA4, Search Console — the call goes through `ctx.bulldozer` and there is no egress entry
at all.

**The app's own data, files and long tasks are not outside calls.** They are the app's own
resources; listing them here declares an outside dependency that does not exist, and that
contradiction is itself a reason to refuse. Only hosts the code actually contacts with `fetch`
belong here.

**Neither is the Bulldozer API.** `ctx.bulldozer` reaches the platform itself, on the signed-in
user's behalf, through the shipped helper — every app would carry the same entry, and `egress` would
stop meaning anything. Do not list `api.bulldozer-collective.fr`.

Egress is **declarative today**: nothing blocks a call to a host that is not listed. That makes the
declaration more important, not less — it is what the review judges the code against, and it is what
a customer reads to know where their data goes.

## `indexes` — what the app can sort and filter on cheaply

```json
"indexes": [
  { "field": "createdAt", "type": "string" },
  { "field": "score", "type": "number" }
]
```

Each entry makes `list({ by: 'createdAt', reverse: true, limit: 10 })` read ten documents instead of
the whole collection. Without the declaration **that query does not fail expensively, it fails
outright** — which is why `package_app.py` refuses to package code that sorts by an undeclared
field.

- `field` — a top-level attribute. A nested path (`lead.company.name`) cannot be indexed.
- `type` — `"string"` (default) or `"number"`. It decides the order: `"10"` comes before `"9"` as
  text and after it as a number. A wrong type breaks nothing visible; it just sorts wrongly.
- `id`, `pk` and `sk` are refused: documents are already keyed on the id, so sorting on it needs no
  index.

**An index is the only manifest field that is billed.** It costs storage and a write on every
document that carries the field, whether the app ever queries it or not. Declare what the app
actually sorts or filters on, and nothing else. A collection of a few hundred documents needs none:
reading it whole is cheaper than maintaining an index over it.

An index is **sparse** — a document without the field is simply not in it — and it is shared by all
of the app's collections, so `createdAt` declared once serves `leads`, `notes` and the rest. That is
why 20 is a generous ceiling.

> Removing an entry **deletes** the index on the next publication. No document is lost, but a query
> that relied on it starts failing.
>
> Adding one to an app that already holds data makes that publication take **five to ten minutes**
> instead of one: the platform waits for the index to be built rather than let the app read a
> half-built one. That delay is a fixed cost of building an index, not something proportional to how
> much data there is — it is the same on five documents as on five thousand. Say so before starting;
> otherwise the wait looks like a failure.

## `limits` — the two settings that matter

`memoryMb` also buys speed: 512 is a sensible floor, and raising it is the fix for a task that runs
out of time on real data.

`timeoutSec` caps a **long task**. It cannot exceed 300, and raising it does not help an ordinary
request: those are cut off at 30 seconds by what sits in front of the app, whatever the manifest
says.

## `jobs` — and why an empty one is not free

List the long tasks the code actually runs: the keys of the `jobs` block, plus every name passed to
`ctx.jobs.start()`. Omit the field when the app has none.

The platform gives an app a queue and a consumer **only if it declares tasks**. That is not tidiness:
a consumer polls its queue roughly 21 600 times a day whether or not a single message is ever sent.
Three idle apps were enough to consume the whole free monthly allowance, so an app with no task is
given no queue, and `ctx.jobs.start()` refuses rather than queueing into nothing.

Declaring a task the code never runs buys a queue for nothing. Forgetting one it does run breaks it
at runtime. Packaging checks both against the code.

**Tasks do not depend on `storage`.** An app in `sql`, or one with no store at all, runs them just
as well: the platform keeps their journal in a store of its own, which your code never sees and
cannot reach.

## `schedules` — running without being called

```json
"schedules": [{ "name": "digest", "cron": "cron(0 21 * * ? *)", "tz": "Europe/Paris" }]
```

`name` is a key of `jobs`: a scheduled task is not a second kind of code, it is one more trigger on
a handler that already exists. It is capped at **19 characters** — the full schedule name must fit
AWS's 64 next to the installation id.

`cron` is EventBridge Scheduler's own syntax, and it takes **six** fields — minute, hour,
day-of-month, month, day-of-week, year. The five-field Unix form is refused. One of day-of-month and
day-of-week must be `?`. `rate(3 hours)` works too.

| Want | Write |
|---|---|
| every day at 21:00 | `cron(0 21 * * ? *)` |
| every three hours | `rate(3 hours)` |
| the 1st of each month at 14:00 | `cron(0 14 1 * ? *)` |
| every Monday at 09:30 | `cron(30 9 ? * MON *)` |

`tz` is **mandatory**, an IANA zone. Without it a time of day means nothing, and an evening task
would drift by an hour twice a year with nothing to connect the symptom to the clock change.

**Declaring a schedule does not make it run.** It says the task exists; *which projects* it runs for
is registered afterwards, one call per project, by someone who belongs to that project. A schedule
with no project registered never fires. See `capabilities.md`.

## `storage` — which store the app gets

| Value | What the app gets | On `ctx` |
|---|---|---|
| `"documents"` (default) | a DynamoDB table of its own | `ctx.db` |
| `"sql"` | a PostgreSQL database of its own | `ctx.sql` |
| `"none"` | nothing | neither |

The three are exclusive: an app declaring `"sql"` has no `ctx.db`, and one declaring `"documents"`
has no `ctx.sql`. Getting this wrong is not caught until the first call, where the missing one is
simply `undefined`.

**`"none"`** is for an app that stores nothing at all — it avoids setting up a database that would
then have to be backed up, watched and purged for nothing.

**`"sql"`** additionally requires a `migrations/` folder at the root of the app, holding at least
`001_initial.sql`, and every table in it must carry a `project_id uuid` column. Packaging refuses
the app otherwise, and so does the platform. See `storage-sql.md`.

Choose `"sql"` for what documents cannot do — joins, `GROUP BY`, `SUM`, uniqueness constraints,
reporting over many rows. It bills for the shared database's capacity, so it is a decision, not a
default.
