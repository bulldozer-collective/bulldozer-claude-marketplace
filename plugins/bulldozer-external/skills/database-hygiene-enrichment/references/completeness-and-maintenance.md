# Completeness Action Plan Template and Quarterly Maintenance Calendar

## Step 7 — Field priority table and action plan template

**Prioritize fields by what they're blocking, not by how empty they are.** A field that's 60% empty but feeds lead scoring outranks a field that's 90% empty but exists for reporting only.

| Priority | Field type | Example | Why it comes first |
|----------|-----------|---------|-------------------|
| 1 | Scoring inputs | Employee count, industry, job title | Empty field silently zeroes out that dimension of the score — the rep never sees why a lead scored low |
| 2 | Segmentation / routing | Territory, ICP tier, lifecycle stage | Empty field means the record doesn't route anywhere, or routes to a default bucket |
| 3 | Personalization inputs | LinkedIn URL, tech stack, funding stage | Empty field forces generic outreach — no signal to write from |
| 4 | Reporting-only | Referral source detail, secondary contact role | Missing value only affects a report, not a live process |

**For each field in scope, the action plan states:**

| Field | Current % filled | Target | Fill method | Owner | Deadline |
|-------|------------------|--------|-------------|-------|----------|
| [field] | [from Step 1 scorecard] | [not 100% by default — see below] | Enrichment waterfall (Step 3) / sales manual entry / form capture / inferred from another field | [role, not a name] | [date] |

**Don't chase 100% on every field.** A field with no scoring or segmentation dependency and low fill rate isn't worth an enrichment pass or a mandatory-field rule — mark it out of scope in the plan and say why, rather than silently ignoring it. The plan should list what's explicitly *not* being fixed as clearly as what is.

**Fill method matters more than the target number.** A field enrichment can reliably fill (job title, employee count) belongs in the waterfall. A field only a human can fill accurately (deal-specific context, a qualification note) belongs in a form or a required-at-stage rule, not an enrichment queue that will guess.

## Step 8 — Maintenance calendar

| Cadence | Task | Trigger to escalate |
|---------|------|---------------------|
| Weekly | Clear the fuzzy-match dedupe review queue (Step 2) | Queue backlog exceeds a few days' volume — flag to the data steward |
| Monthly | Review hard-bounce list, confirm the decay-prevention workflow (Step 4) moved them out of active sequences | Bounce rate trending up two months running |
| Monthly | Spot-check new records against the validation rules (Step 5) — are reps or integrations finding a way around them | New free-text values reappearing in a standardized field (Step 6) |
| Quarterly | Re-run the full Step 1 scorecard and compare to baseline | Any dimension regresses below its target for two quarters running, **on a population large enough that two quarters of noise wouldn't produce the same pattern** — a dip on a segment of a few dozen records is not the same finding as the same dip across the full database, and shouldn't be escalated the same way |
| Quarterly | Refresh firmographic and job-title data on ICP Tier 1/2 accounts via the enrichment waterfall (Step 3), even for records not flagged by the 90-day decay trigger | — |
| Annually | Reassess the enrichment waterfall itself — is the first-step provider's match rate still holding, has a new provider overtaken it | Match rate on the primary provider drops noticeably from what Step 3 assumed |
| Annually | Audit CRM properties for fields nobody reads — a property with a validation rule and no report or workflow using it is a maintenance cost with no payoff | — |

**Assign the quarterly re-audit and the annual waterfall review to a named owner before closing this project out.** A calendar with no owner is a calendar nobody runs. **That owner should be RevOps or a data steward, not a sales leader.** Sales leadership owns the pipeline number, and the pipeline number always wins against a quarterly data-quality task when the two compete for the same week — not out of bad faith, just misaligned incentive. Put the cadence under whoever's job doesn't get easier by skipping it.
