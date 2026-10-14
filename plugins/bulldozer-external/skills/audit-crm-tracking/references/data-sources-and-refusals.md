# Query Rules and Handling Refused Calls

## Where the Numbers Come From — query rules and refusals

Seven things to know before writing the first query:

- **Call `tool_guidance` before the first `query_crm_data`.** The tool requires it, and what it returns is portal-specific.
- **Property names are internal names, not the labels reps see.** Confirm every one with `search_properties` first. A query against a label that doesn't exist returns nothing and reads exactly like a data gap — that is how an audit reports a 0% fill rate on a field that is actually populated.
- **Never resolve an object type from memory.** "Leads" is a real object in some portals and a lifecycle stage on contacts in others. Ask the schema, including for anything that sounds standard.
- **The SQL is deliberately narrow.** One object type per query. No joins, no subqueries, no `HAVING`, no `COUNT(DISTINCT …)`. Group with `COUNT(*)` and do the arithmetic afterwards. Presence is `IS NULL` / `IS NOT NULL`, date ranges are `BETWEEN` on date strings rather than timestamps, and `MEDIAN()` is available — which is what makes the "2× the median sales cycle" thresholds above measurable rather than rhetorical.
- **Association pseudo-properties are for existence tests only.** They belong in the `WHERE` clause, never in `SELECT` or `GROUP BY`. Connectivity is therefore counted, not listed, in a single query — pull the record list separately if the client needs names.
- **A one-hop cross-object column is not a join.** `SELECT DEAL.dealname, COMPANY.name FROM DEAL` reads a field off a directly associated record in the same query, for up to two associated object types — it's the one exception to "no joins." Useful for naming the company on an orphaned-deal check without a second `search_crm_objects` call; it still can't chain further (no reading through the company to a parent company).
- **An empty `properties` list on `search_crm_objects` does not mean an empty record back.** Confirmed by a live call: passing `properties: []` still returns the object's full default property set — real deal or contact data, not a blank shell. A fill-rate check only ever needs the response's `total`; the record riding along with it is real client information and never belongs in the audit, a screenshot, or a shared note about how the check went.

### When a call comes back refused

Connector access is not one permission, and it is not uniform across the tools in a single session. Reading the schema of an object and running a query against it are two separate grants: `discover_hubspot_schema`, `search_properties` and `get_properties` regularly keep answering normally in a session where `query_crm_data` refuses every statement. So the first thing to establish, before rewriting a query or blaming the portal, is *which* refusal you got. Four distinct messages, four different actions:

| What comes back | What it actually means | What to do |
|---|---|---|
| `Insufficient scope: required …` on a query, listing scopes such as `crm.hubsql.execute`, `reporting.full.read` | The SQL path is not authorised for this connection, even on an object whose schema reads fine | Ask the portal admin for exactly the scopes named in the message. Meanwhile fall back to counting with `search_crm_objects` totals |
| `Insufficient scope: required marketing.campaigns.read` on campaign fields | Campaign-level spend and budget are a separate grant from CRM objects | Ask for that one scope by name; don't retry |
| `readAccess: REQUIRES_PERMISSION_MODIFICATION` from the schema | The object is gated by portal permissions, not by an expired session | An admin grants it. Waiting or reconnecting changes nothing |
| `requires re-authorization (token expired)` | Genuinely a session problem — but it is also the message that appears when the underlying cause is one of the three above | Try a schema read on another object first. If that answers, this is a permission problem wearing a session problem's clothes |

**Never let a refusal become a finding.** A blocked call returns nothing, and nothing looks exactly like a 0% fill rate, an empty pipeline or a portal with no duplicates. Every one of those has been reported to a client as a data-quality catastrophe when the real answer was a missing scope. If a measurement was refused, it goes in the audit as *not measured, access needed, here is the scope to grant* — never as a number, and never silently dropped.

Three limits to state in the audit rather than work around:

- **The zombie deal query needs its properties resolved first.** Last-activity date and time-in-stage are not names to assume — ask `search_properties` on the deal object what this portal exposes, and if the stage-entry timestamps aren't there, say so and fall back to the stage-distribution report.
- **Workflows can't be read through the connector.** The workflow audit stays a manual pass in the interface, and it is the section most likely to be skipped for that reason. Do it anyway: it's the section where something is actively writing to records right now.
- **Salesforce has no connector here**, unless one has been added to the session. A Salesforce audit is report-building inside the instance — the six dimensions and every threshold still hold, the automation doesn't.
