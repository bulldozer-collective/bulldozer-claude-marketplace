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

The example above is a `"documents"` app — a `"sql"` one writes `ctx.sql` in the same places, and
`storage-sql.md` shows it. Everything else on this page is identical for both.

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

## 2. Its own data — in a separate file, because there are two stores

An app is given **one** store, decided before any code is written, and the two are exclusive: an app
has `ctx.db` or `ctx.sql`, never both. Read the one that matches its manifest, and only that one —
the other describes an API this app does not have, and following it produces code that is
`undefined` at the first call.

| `"storage"` | Read | Reached through |
|---|---|---|
| `"documents"` (default) | **`storage-documents.md`** | `ctx.db` |
| `"sql"` | **`storage-sql.md`** | `ctx.sql` |
| `"none"` | nothing — the app stores nothing | neither |

Whichever it is, the data is **partitioned by project**: the same app under two projects holds two
separate sets, the app never writes a project id itself, and it cannot express a read outside its
own project even by mistake. That is the platform's first safety rule, and it is why an app must
never build its own keys or set its own project.

The one way to name another project is `ctx.forProject(id)`, and it is bounded — see
[Working on several projects](#working-on-several-projects) below. On a request it is refused
outright: the project is the one the platform sealed.

Everything below this section is the same either way.

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
    for (const row of rows) await ctx.db.collection('rows').put(row);   // or ctx.sql, per the store
    return { imported: rows.length };     // becomes the task's result
  },
},
```

**Every task must be listed in the manifest's `jobs`.** The platform provisions a queue only for an
app that declares tasks — a consumer polls its queue about 21 600 times a day whether or not
anything is sent to it, so an app with no task is given none, and `ctx.jobs.start()` refuses.

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

### Running on a timetable

A task declared in `schedules` also runs on its own, with nobody calling it:

```js
jobs: {
  digest: async (payload, ctx) => {
    ctx.mode;          // 'schedule' rather than 'job' or 'user'
    ctx.user;          // null — a tick has no caller, so no roles and no identity
    ctx.project.id;    // the project this tick is for
    await ctx.db.collection('reports').put(await build(ctx));
  },
}
```

**`payload` is empty**: nobody passed anything. Everything the task needs it reads from its own data.

**The project is not in your code and not up to you.** Each tick carries one project, written into
the schedule by the platform when someone registered it — a call where their membership of that
project was checked. An app serving five projects has five schedules for the same task, firing
independently. Registering happens outside the app; a schedule with no project registered never
fires, and that is not a bug.

**The caller's credentials never reach the app.** `Authorization`, `X-Bdz-Api-Key` and `Cookie` are
stripped before the request is handed over: reading them returns nothing. Who is calling is in
`ctx.user`, and the platform talks to itself on the app's behalf through `ctx.bulldozer`. Naming
either header in the code is flagged by the review, and the app's own key is refused outright.

**`ctx.bulldozer` works in a tick, but not by default.** With no caller there is no token to
forward, so the app acts as **its own service account** — a Keycloak identity of its own, using a
key deposited on the installation. What that allows is exactly what the service account is a member
of: the projects registered to its scheduled tasks, and nothing else.

Until a key is deposited, `ctx.bulldozer` refuses in a tick and says so. That is an operator's step,
not something the app can arrange for itself.

`ctx.projects()` lists the projects the app was added to — the same ones the API will accept from
it. A tick already carries its own project, so this is only for an app that needs to act beyond its
ticks. It is read fresh each time: a manager can add or remove the app at any moment.

### Working on several projects

`ctx.forProject(id)` returns a context whose data, files and tasks are partitioned on that project
instead — the only way an app ever names a project.

```js
for (const project of await ctx.projects()) {
  const c = ctx.forProject(project.id);
  await c.db.collection('reports').put(await build(c));
}
```

Two bounds, and neither is up to the app:

- **On a request it is refused.** The project was sealed by the platform after checking that the
  caller belongs to it; rewriting it would hand the app a project nobody authorised for that visit.
- **In a tick or a task, the project must be one the app was added to.** The check runs at the first
  operation on that context, against the same list `ctx.projects()` returns, and an unknown project
  fails with its id in the message. The sealed project pays nothing: it is not re-checked.

An id the app invented therefore reads nothing. Writing `ctx.forProject` on a request, or on a
project the app was never added to, is a bug the platform will tell you about — not a way in.

A failing tick is retried **twice**, then dropped — no queue builds up, and an hour late the run is
abandoned rather than done at the wrong time. The failure is in the app's own log.

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

- `ctx.user` — `{ id, roles }`, or `null` inside a task. Comes from the platform, so it cannot be
  faked by a request. **`roles` is a list** — the caller's roles on the Bulldozer platform, e.g.
  `['bulldozer-customer-employee', 'bulldozer-core-admin']`. Often empty, and that is not an error.
- `ctx.project` — `{ id, customerId, role }`. **`role` is the caller's role in THIS project**, and
  there is exactly one: `PROJECT_MEMBERSHIP_ROLE_MANAGER` or `PROJECT_MEMBERSHIP_ROLE_MEMBER`.

  Two different questions, so two fields — they used to share one, and an app could not tell which
  vocabulary it had been handed:

  ```js
  if (ctx.project.role === 'PROJECT_MEMBERSHIP_ROLE_MANAGER') { … }   // manages this project
  if (ctx.user.roles.includes('bulldozer-core-admin')) { … }          // Bulldozer staff
  ```

  A staff member reaching an app of a project they do not belong to has **`ctx.project.role` empty**
  and their platform roles listed. Gate on whichever fact you actually mean; gating on the wrong one
  fails silently.

  An app only ever serves **its own customer's projects**. Someone who belongs to projects at two
  customers cannot bring the other customer's project here — the platform answers `403` before your
  code runs. So `ctx.project.id` varies, `ctx.project.customerId` does not.
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
