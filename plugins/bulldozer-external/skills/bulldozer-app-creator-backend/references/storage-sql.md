# Its own data — `storage: "sql"`

This file describes **one** of the two stores. It applies only to an app whose manifest says
`"storage": "sql"`, which gets a **PostgreSQL database of its own**, reached through `ctx.sql`. It
has no `ctx.db`: collections, `list({ by })` and the manifest's `indexes` do not exist for it, and
`storage-documents.md` does not apply.

Everything outside the store — routes, files, long tasks, the Bulldozer API — is in
`capabilities.md` and is the same either way.

```js
const rows = await ctx.sql('SELECT * FROM notes WHERE statut = :statut', { statut: 'ouvert' });
const [note] = await ctx.sql('INSERT INTO notes (id, texte) VALUES (gen_random_uuid(), :texte) '
                             + 'RETURNING *', { texte: 'hello' });
```

Parameters are **named** — `:nom`, never `?` — and never interpolated into the string. `ctx.sql`
returns an array of plain objects, one per row, empty for a statement that returns nothing.

**Never write `WHERE project_id = …`, and never insert a `project_id` yourself.** Each call runs in
a transaction where the platform has already set the caller's project, and PostgreSQL Row-Level
Security filters every read and stamps every write. A query without a project clause returns exactly
the current project's rows — that is the same guarantee documents get from their key, obtained a
different way. It is also why the app cannot reach another project even by writing the wrong query.

**Every table must carry a `project_id uuid` column.** It is the column the policy keys on; a table
without it cannot be partitioned, and the platform refuses the publication rather than host a table
that would show every project's rows to everyone. You never write a value into it either — the
platform puts a `DEFAULT` on the column, so the database stamps the project on every insert.

### Row-Level Security is the platform's, never the app's

**Never write `CREATE POLICY`, `ALTER POLICY`, `DROP POLICY`, or `… ROW LEVEL SECURITY` in a
migration.** Packaging refuses them, and so does the platform — before the migration is recorded, so
the file stays correctable.

This is not a matter of tidiness. PostgreSQL combines permissive policies with **OR**: a single
`CREATE POLICY tout_voir ON notes USING (true)` beside the platform's would hand every project's
rows to everyone, silently. Measured on a real cluster: two rows returned where one was expected.

The platform therefore poses its own policy **as restrictive** — restrictive policies combine with
AND — so a policy written by an app can no longer widen what the platform has bounded. It is refused
anyway, because wanting to write one means misunderstanding who guarantees what.

What belongs in a migration is ordinary schema: tables, columns, indexes, constraints, defaults.

## Schema changes: `migrations/`

The DDL lives in a `migrations/` folder at the root of the app, **beside** `bulldozer.app.json` —
not under `backend/`, which is the code that gets deployed.

```
migrations/001_initial.sql
migrations/002_ajoute_statut.sql
```

Names start with at least three digits: the number is the order they run in. Each file is applied
**exactly once**, before the new code goes live, and recorded. So:

- to change the schema, **add a file**. Never edit one that has already been published — the
  platform records a fingerprint of each applied file and refuses a publication whose content has
  drifted, because the database cannot be brought back in line by replaying it.
- nothing has to be idempotent. `ALTER TABLE notes ADD COLUMN statut text` is the whole file; no
  `IF NOT EXISTS` guard, no defensive rewriting.
- a failed migration rolls back whole and stops the publication, so the running version keeps
  working against the schema it knows.

```sql
-- migrations/001_initial.sql
CREATE TABLE notes (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    texte      text NOT NULL,
    statut     text NOT NULL DEFAULT 'ouvert',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notes_projet ON notes (project_id, created_at DESC);
```

## Two limits worth knowing before designing against them

⚠️ **One statement per call.** `ctx.sql` refuses two statements separated by a semicolon. Call it
twice. (Migration files may hold many; they are split by the platform.)

⚠️ **A result caps at 1 MiB**, and the call fails rather than truncating. `SELECT *` over a large
table hits it; paginate with `LIMIT`/`OFFSET` or select the columns actually needed.

## Was this the right choice?

The choice was made before any code was written, and **it cannot be changed after the first
publication** — the platform refuses the switch, and the data would not be converted.

SQL earns its keep when the app genuinely needs what documents cannot do: joining two kinds of
record, `GROUP BY`, `SUM`, a uniqueness constraint, reporting across many rows. If none of that is
in the need, `storage-documents.md` describes a store that costs nothing when idle and needs no
schema. Say so now if the brief looks wrong — after publication it is a new app.
