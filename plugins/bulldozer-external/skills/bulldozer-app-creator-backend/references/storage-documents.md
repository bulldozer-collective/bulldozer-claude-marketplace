# Its own data — `storage: "documents"`

This file describes **one** of the two stores. It applies only to an app whose manifest says
`"storage": "documents"`, which has `ctx.db` and no `ctx.sql`. For the other, read
`storage-sql.md` — nothing here transfers to it: there are no collections, no `list({ by })`, and
`indexes` in the manifest means nothing.

Everything outside the store — routes, files, long tasks, the Bulldozer API — is in
`capabilities.md` and is the same either way.

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

## What it actually is

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

## Sorting, filtering, limiting

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

## What it costs, and why the answer says so

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

## Counting, summing, grouping

None of it exists server-side. The app reads and computes, and `all()` is the honest way to say so:

```js
const perStatus = {};
for await (const lead of leads.all({ where: { status: 'open' } })) {
  perStatus[lead.owner] = (perStatus[lead.owner] ?? 0) + 1;
}
```

`all()` pages through everything for you. There is deliberately no `count()` or `groupBy()`: a short
name would hide an unbounded read behind something that looks cheap.

## The collection name is a design decision, not a label

A collection is the unit of bounded reading. Choosing `leads-2026-08` over `leads` makes "August's
leads" a direct read that never touches the other months — free, and it needs no index. Splitting a
collection is often the better answer to a slow query.

## Two traps

⚠️ **A timestamp is not a sequence.** Two documents written in the same millisecond carry the same
instant, and their order relative to each other is then arbitrary. Humans never hit this; a loop
writing rows hits it constantly. Harmless for "the ten most recent", not enough when the exact order
within a batch matters — then the app numbers its own records.

⚠️ **Never sort a single page.** `list` returns 100 by default. Fetching one page and sorting it in
memory to show "the ten most recent" sorts an arbitrary hundred: the answer is wrong and looks
perfectly normal. Use `by`, or read everything with `all()`.
