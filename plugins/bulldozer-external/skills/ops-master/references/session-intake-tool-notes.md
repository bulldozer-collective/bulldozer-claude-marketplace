# Session Intake — ce que les outils Bulldozer OS renvoient vraiment

Détail derrière les deux vérifications automatiques de l'intake (question 1 sur la qualité CRM,
question 3 sur Lemlist) : ce que chaque outil peut et ne peut pas faire, et comment reconnaître
un échec attendu plutôt qu'une panne.

## `query_crm_data` (HubSpot) — complétude et volume de doublons

**Call `tool_guidance(["query_crm_data"])` once at the start of the session, before the first
query.** The tool's own current description states this as a requirement ("You MUST call the
Tool Guidance tool before your first query"), not a suggestion — it isn't optional context the
way it is for a tool whose description is already self-sufficient. One call covers the whole
session; don't repeat it per query.

**Check Bulldozer OS before asking the client to self-rate.** If HubSpot is the CRM in play and
the connector has read access to that portal, run `query_crm_data` to measure completeness
directly — e.g. count contacts or deals missing a required field (`WHERE property IS NULL`) —
instead of asking for a 1-10 gut feeling. The same tool also gives a first read on duplicates,
not just completeness: it has no server-side `HAVING`, so a raw `GROUP BY email, COUNT(*)`
returns every group in one call rather than only the ones worth flagging — filter for
`count > 1` in the rows that come back, rather than expecting the query itself to isolate them.
Treat this as a duplicate-volume signal to size the routing decision, not a de-dupe: there's no
`COALESCE`, `CASE WHEN`, or `SELECT DISTINCT` to normalize near-duplicate values or merge
records — that work stays `database-hygiene-enrichment`'s job. Read access is never guaranteed,
and in practice the observed failure isn't a silent empty result — it's an explicit insufficient-
scope error naming the missing OAuth scopes (`crm.hubsql.execute` plus several `reporting.*` /
`marketing.campaigns.revenue.*` scopes), reproduced on every portal called through this connector
so far. Recognize that error as "no read access on this portal" and fall back to the self-rating
question immediately — don't retry the query or treat the error as a transient fault. Same fallback
when the CRM isn't HubSpot at all.

## `bdzGetLemlistConfig` — ce que "pas de config" veut dire

Separately, `bdzGetLemlistConfig` for the current project returns whether a Lemlist integration
is already registered and `enabled` — check it before asking question 3 whether Lemlist is
connected. Its own description says the config record is only created once an API key has been
registered for the project, so a project that has never connected Lemlist has no record to
return yet — treat that outcome as "Lemlist not connected," not as a failed tool call. It still
doesn't cover Salesforce, Clay, Zapier, or Make, so ask about those regardless.
