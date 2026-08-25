# What a service can do

Five capabilities, and nothing else. Everything below is reached through `ctx`, the second argument
of every handler. `ctx` is built by the platform, not by the app: the app cannot forge any of it.

## The whole file, in outline

```js
import { defineApp } from './bulldozer.mjs';

export const handler = defineApp({
  routes: {
    'GET /notes': async (request, ctx) => ctx.json(await ctx.db.collection('notes').list()),
    'POST /notes': async (request, ctx) => {
      const { text } = await request.json();
      return ctx.json(await ctx.db.collection('notes').put({ text }), 201);
    },
    'GET /notes/{id}': async (request, ctx) => {
      const note = await ctx.db.collection('notes').get(request.params.id);
      return note ? ctx.json(note) : ctx.json({ error: 'Unknown note.' }, 404);
    },
  },
  jobs: {},
});
```

`defineApp` is the only export. `routes` keys are `'<METHOD> <path>'`; a `{name}` segment becomes
`request.params.name`. `request` is a standard `Request` — `await request.json()`,
`request.headers.get(…)`, `new URL(request.url).searchParams`. Return `ctx.json(body, status)`, or a
plain object for a 200.

```js
'GET /leads': async (request, ctx) => {
  const params = new URL(request.url).searchParams;         // ?limit=20&statut=ouvert
  const limit = Number(params.get('limit') ?? 20);
  const statut = params.get('statut');
  return ctx.json(await ctx.db.collection('leads')
    .list({ limit, ...(statut ? { where: { statut } } : {}) }));
},
```

Read a missing parameter as absent, never as an error: a screen that omits `?statut=` is asking for
everything, not making a mistake.

## 1. REST routes

Declare only what the app needs, and name paths after what they hold, not after what they do:
`GET /reports`, `POST /reports`, `DELETE /reports/{id}`.

An unmatched path answers `404` on its own. An uncaught error answers `500` with the message, so the
app's author can see what broke — do not swallow errors to keep responses tidy.

**A request is cut off after 30 seconds**, by what sits in front of the app. There is no setting to
raise. Anything that could take longer is a long task (§4).

### The API documents itself

Every app answers `GET …/api/openapi.yaml` (and `.json`) with an OpenAPI document, built from the
routes it declares. Nothing to write and nothing to maintain — and **never declare these paths in
the manifest**, the platform provides them like `GET /jobs/{id}`.

Derived rather than written, because a hand-kept document drifts from its API on the second change,
and a wrong document is worse than none: it gets believed.

What cannot be derived is what the bodies contain. Add it with an optional `openapi` key — a plain
OpenAPI fragment, merged over the generated one:

```js
export const handler = defineApp({
  openapi: {
    info: { title: 'Content Machine' },
    paths: {
      '/notes': {
        post: {
          summary: 'Creates a note',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } },
        },
      },
    },
    components: { schemas: { Note: { type: 'object', properties: { text: { type: 'string' } } } } },
  },
  routes: { … },
});
```

Only what you add is yours to keep correct; paths, methods, path parameters and the platform's own
response codes stay in step with the code on their own.

### Calls are counted

Every call to one of your routes is recorded — who made it, which route, what status came back.
Nothing to write: the helper does it, and the platform reads the caller's identity from their own
token, so the figure cannot be inflated by the app.

Only the routes **you** declare are counted. The endpoints the platform provides are not: the screen
polls the job status every two seconds, and counting that would bury the only question the figures
answer — who uses this app, and for what.

## 2. Its own data

```js
const notes = ctx.db.collection('notes');

await notes.put({ text: 'hello' });          // creates, returns the document with its id
await notes.put({ id, text: 'edited' });     // replaces that document
await notes.get(id);                          // the document, or null
await notes.list({ limit: 50 });              // { items, nextCursor }
await notes.list({ after: nextCursor });      // the next page
await notes.delete(id);
```

Name as many collections as the app needs — `notes`, `products`, `apples`. **A collection is created
by using it**: no declaration, no schema, no migration, and an empty one costs nothing. Two documents
in different collections may carry the same id without colliding.

Documents are **automatically scoped to the project the caller is working in** — the app never
writes a project id into a key, and cannot express a read outside its own project even by mistake.
That is the platform's first safety rule, and it is why the app must not try to build keys itself.
The same collection name under two projects holds two separate sets of documents, which is why an
app's data changes when the user switches project.

`put` replaces the whole document. To change one field, `get` it, spread it, and `put` it back.

Every document also gets an `updatedAt`, written on each `put`. That is the only field the platform
adds: **anything else the app needs, the app writes**.

### What it actually is

The store is **DynamoDB**, one table per installation, with two keys:

| Key | Value |
|-----|-------|
| partition key | `{projectId}#{collection}` — built by the helper, never by the app |
| sort key | the document's `id` |

`by` names a **global secondary index**, and every index reuses that same partition key. The project
boundary therefore holds by construction, indexes included: no query can be written that reaches
another project's partition, not even through an index.

Knowing this makes the rest deducible instead of arbitrary:

- a sort axis has to be **declared** because the index must exist before it can be queried;
- a condition **on the sort axis** narrows what is read; a condition on any other field is a filter
  applied after reading the partition — which is why `scanned` can dwarf what comes back;
- there is no `count()` and no `groupBy()` because DynamoDB has neither;
- splitting `leads` into `leads-2026-08` splits the **partition**, and a smaller partition is a
  cheaper read. That is usually the most effective answer to a slow query — more so than an index.

**And the rule that follows from all of it: `ctx.db` is the only way in.** The AWS modules the helper
imports are the helper's, not yours. Reaching the table directly means building the key yourself,
and a key built by hand reads the neighbouring project of the same customer — the packaging step
refuses those imports for exactly that reason.

### Sorting, filtering, limiting

```js
await leads.list({ by: 'createdAt', reverse: true, limit: 10 });      // the 10 most recent
await leads.list({ where: { status: 'open' }, limit: 20 });           // where status = 'open'
await leads.list({ by: 'createdAt', where: { createdAt: { gte: '2026-08-01' } } });
```

`where` takes a value for equality, or one of `gt`, `gte`, `lt`, `lte`, `between: [a, b]`,
`beginsWith`, `not`, `in: [...]`, `contains`.

**`by` names a field declared in the manifest under `indexes`** — see `manifest.md`. Without `by`,
the order is the document id, which is drawn at random unless the app chose its own: stable, but not
chronological and not meaningful.

### What it costs, and why the answer says so

Every result carries `scanned`: how many documents were read to produce it.

```js
const page = await leads.list({ where: { status: 'open' }, limit: 10 });
page.scanned;   // 10 if the index carried the query, 40 000 if it read the collection
```

A condition **carried by the sort axis** — `by: 'createdAt'` with a condition on `createdAt` — is
bounded: ten documents asked, ten read. A condition on **any other field** is applied after reading:
the answer is exactly as correct, and may have cost the whole collection. Nothing else distinguishes
the two — same call, same result, a thousand times the price — which is why `scanned` exists.

For a collection of a few hundred documents, ignore all of this. Past a few thousand, look at
`scanned` once and declare an index if it is large.

### Counting, summing, grouping

None of it exists server-side. The app reads and computes, and `all()` is the honest way to say so:

```js
const perStatus = {};
for await (const lead of leads.all({ where: { status: 'open' } })) {
  perStatus[lead.owner] = (perStatus[lead.owner] ?? 0) + 1;
}
```

`all()` pages through everything for you. There is deliberately no `count()` or `groupBy()`: a short
name would hide an unbounded read behind something that looks cheap.

### The collection name is a design decision, not a label

A collection is the unit of bounded reading. Choosing `leads-2026-08` over `leads` makes "August's
leads" a direct read that never touches the other months — free, and it needs no index. Splitting a
collection is often the better answer to a slow query.

### Two traps

⚠️ **A timestamp is not a sequence.** Two documents written in the same millisecond carry the same
instant, and their order relative to each other is then arbitrary. Humans never hit this; a loop
writing rows hits it constantly. Harmless for "the ten most recent", not enough when the exact order
within a batch matters — then the app numbers its own records.

⚠️ **Never sort a single page.** `list` returns 100 by default. Fetching one page and sorting it in
memory to show "the ten most recent" sorts an arbitrary hundred: the answer is wrong and looks
perfectly normal. Use `by`, or read everything with `all()`.

## 3. Its own files

```js
await ctx.files.put('report.csv', csvText, 'text/csv');
await ctx.files.get('report.csv');            // a Buffer
await ctx.files.list();                       // [{ name, size, updatedAt }]
await ctx.files.url('report.csv', 300);       // a download link, valid 5 minutes
await ctx.files.uploadUrl('scan.pdf', 'application/pdf', 300);   // an upload link
await ctx.files.delete('report.csv');
```

Names cannot contain `..` or start with `/`; the storage is per-project, like the data.

**Files never travel through the app — in either direction.** To let someone download one, return
`url(...)`, never the bytes. To let someone *send* one, return `uploadUrl(...)` and let the screen
`PUT` the file straight to it.

This is not a preference. **A request body reaching the app is capped at 1 MB**, and anything above
that gets a `413` before your code runs. So an upload posted to one of your own routes works while
the file is small and starts failing the day a user picks a real document — the worst kind of bug,
because it looks like it works.

The screen's side of an upload:

```js
const { url } = await api.post('/attachments', { name: file.name, type: file.type });
await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
```

The `Content-Type` sent must be **exactly** the one passed to `uploadUrl` — the signature covers
it, so a different type is refused by the storage.

The 1 MB cap applies to every route, not only file ones: a very long text or a large JSON payload
hits it too. Split the work, or route the payload through a file.

## 4. Long tasks

For work that can exceed 30 seconds — an import, a report, a batch of calls.

```js
routes: {
  'POST /imports': async (request, ctx) => {
    const { source } = await request.json();
    return ctx.json(await ctx.jobs.start('import', { source }), 202);
  },
},
jobs: {
  import: async (payload, ctx) => {
    const rows = await readSomehow(payload.source);
    for (const row of rows) await ctx.db.collection('rows').put(row);
    return { imported: rows.length };     // becomes the task's result
  },
},
```

`start` hands the work off and returns straight away. **`GET /jobs/{id}` exists automatically** —
never write it. What the handler returns becomes `result`; if it throws, the message becomes `error`.

Three things to know, all of which have bitten:

- **A task may be delivered more than once.** Work that has already finished is never redone, but
  work interrupted halfway can restart. Make the handler safe to re-run: write with a stable id
  rather than appending.
- **A task has no caller**, so `ctx.user` is `null` and **`ctx.bulldozer` does not work inside a
  task** — there is no one to act on behalf of. Read from the Bulldozer API in the route, pass what
  you need in the payload.
- **A task that runs out of time dies without being able to say so.** The platform reports it failed
  once its deadline passes, so nothing stays stuck — but the work is half-done. Keep tasks short
  enough to finish, or make them resumable.

## 5. The Bulldozer API, as the caller

```js
const contacts = await ctx.bulldozer.get('/contacts', { 'pagination.pageSize': 50 });
await ctx.bulldozer.post('/contacts', { firstName: 'Ada' });
```

The signed-in user's own token is relayed, so **the app never has more access than the person using
it**, and the customer and project headers are set for you. `get`, `post`, `put`, `patch`, `delete`.

Three failures are worth catching by name: out of jetons, access refused, too many requests. The
error message says which.

## Also on `ctx`

- `ctx.user` — `{ id, role }`, or `null` inside a task. Comes from the platform, so it cannot be
  faked by a request.
- `ctx.project` — `{ id, customerId }`.
- `ctx.log.info / warn / error` — `(message, data)`. Values under keys that look like secrets are
  masked. ⚠️ **Nothing can read these logs today** — no viewer, no endpoint. They are written for
  support and for a future one.
- `ctx.json(body, status)`.

**So the response is the only feedback anyone gets.** An error that says nothing is an app nobody can
fix. Let errors surface with their message, and make a refusal explain itself —
`ctx.json({ error: 'No lead list named "X".' }, 404)`, not a bare `400`.

## The app holds no secret

There is no vault, no setting an author can fill in, no environment variable of its own. Anything the
app stores sits in its own data, in clear.

So an app can only call an outside service that **needs no credential**, or one whose credential the
caller hands over in the request. Everything else must go through `ctx.bulldozer`: when Bulldozer
already integrates the tool — HubSpot, Slack, Webflow, Google Ads, GA4, Search Console — the platform
holds the customer's token and the app never sees it. Reaching such a tool directly would mean asking
the user to paste a token into an app that cannot protect it. Do not design that; say the app goes
through Bulldozer instead.

## Not available

No scheduled runs, no work outside a request or a task, no incoming webhooks, no shared state
between calls, no writable disk (`/tmp` only, and it does not survive), no library installation, no
secret storage, no way to read the app's logs. If the user needs one of these, say so rather than
approximating it.
