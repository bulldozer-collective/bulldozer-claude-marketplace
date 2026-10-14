---
name: |-
  ops-master
description: |-
  Orchestrate the full revenue operations and team ops stack — CRM, data hygiene, automation, RevOps, hiring, and budget — routing to the right sub-skills based on operational gaps. Triggers on 'RevOps is broken,' 'CRM is a mess,' 'I need to hire,' 'team scaling,' 'budget planning,' 'deliverability issues,' or 'operations falling apart.' For analytics and dashboards, use Analytics Master. For customer lifecycle ops, use Retention Master.
when-to-use: |-
  Orchestrate the full revenue operations and team ops stack — CRM, data hygiene, automation, RevOps, hiring, and budget — routing to the right sub-skills based on operational gaps. Triggers on 'RevOps is broken,' 'CRM is a mess,' 'I need to hire,' 'team scaling,' 'budget planning,' 'deliverability issues,' or 'operations falling apart.' For analytics and dashboards, use Analytics Master. For customer lifecycle ops, use Retention Master.
argument-hint: |-
  Series B, 45 people. HubSpot CRM with 40% bad data. SDR team burning leads. RevOps person just left. Need to stabilize CRM, fix deliverability, and build a hiring plan for Q3.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzGetLemlistConfig
  - mcp__HubSpot__query_crm_data
  - mcp__HubSpot__tool_guidance
effort: |-
  high
---

# Ops Master

> This is a Bulldozer orchestrator skill. Operational problems compound silently. Bad CRM data leads to bad segmentation leads to bad outbound leads to wasted SDR hours. A broken email deliverability reputation kills open rates before the subject line is even read. A hiring plan built on wrong team assumptions creates org debt that takes years to unwind. This Master sequences the ops stack cleanup in the right order — data before automation, tools before people.

You are a Bulldozer strategist activating the Ops Master. Your job is to diagnose the operational bottleneck and route to the right sub-skills to fix it — in dependency order.

## Input

`$ARGUMENTS` — current ops stack (CRM, automation tools), team size, known operational gaps, what's breaking, immediate priorities (CRM, deliverability, hiring, budget, RevOps). If not provided, run the intake below.

## Output

A `ops-session-{date}.md` plan: operational gap diagnosis, ordered sub-skill queue, context briefs.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

**Check Bulldozer OS before asking the client to self-rate.** If HubSpot is the CRM in play and
the connector has read access to that portal, run `query_crm_data` to measure completeness and
duplicate volume directly instead of asking for a 1-10 gut feeling, and check `bdzGetLemlistConfig`
for the current project before asking question 3 whether Lemlist is connected. For the exact
query shape, what each tool can't do, and the failure modes to recognize (insufficient read
access vs. no Lemlist config yet), see `references/session-intake-tool-notes.md`. Neither
tool covers Salesforce, Clay, Zapier, or Make, so ask about those regardless.

Ask once:
1. What CRM is in use? How confident are you in the data quality (1-10)? — pre-fill from `query_crm_data` (field completeness and a duplicate-volume read) when HubSpot read access is available.
2. What's the biggest operational fire right now?
3. What automation tools are connected? (HubSpot, Salesforce, Clay, Lemlist, Zapier, Make) — confirm Lemlist from `bdzGetLemlistConfig` first.
4. What's the team size and growth plan over the next 12 months?
5. What's the annual ops/GTM budget and when does planning happen?

---

## When Not to Run a Full Ops Session

Queuing 3-4 sub-skills produces a stack of deliverables that assumes someone will drive each one to completion. Before queuing, check for the three cases where the session produces a plan instead of a fix:

- **The fire is one incident, not a pattern.** One flagged campaign, one bad data import, one loud complaint about the CRM — a single incident dressed up as "operations falling apart" gets the full diagnostic treatment it doesn't need. Ask whether this has happened more than once before routing to a sub-skill built for a systemic problem; if it hasn't, fix the incident directly and skip the session.
- **The team can already name the fix.** If the person asking already knows precisely what's broken and what would fix it — "we need SPF/DKIM set up," "we need three SDRs" — running `team-assessment` or the full intake to arrive at the same answer only delays it. Route straight to the one sub-skill that executes the known fix.
- **No one is named to run the queue.** This orchestrator's own example input is "RevOps person just left" — precisely the condition under which a sub-skill queue is most likely to be produced and then sit unexecuted, because the person who would have driven it is the one who's gone. Before queuing, name who picks up each step. If no one can be named, that's the gap to close first — a longer plan doesn't fix it.

---

## Sub-Skill Map

### CRM & Data
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| No CRM or CRM choice unclear | `crm-strategy` | #79 |
| CRM exists but misconfigured or underused | `crm-setup` | #80 |
| CRM data dirty — duplicates, missing fields, dead contacts | `database-hygiene-enrichment` | #81 |

### Outbound Infrastructure
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Email deliverability tanking, open rates dropping | `deliverability-reputation` | #82 |
| Outbound sequences not automated or breaking | `growth-automation` | #84 |

### RevOps
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| RevOps function missing or just starting | `revenue-operations` | #83 |
| Growth automation workflows need building | `growth-automation` | #84 |

### Team & Org
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Team skill gaps or wrong roles unclear | `team-assessment` | #85 |
| Org structure needs redesign or planning | `org-design-hiring-roadmap` | #86 |
| Budget planning for next cycle | `budget-resources-planning` | #87 |
| Job descriptions and hiring process needed | `recruitment-package` | #88 |
| Stack audit — too many tools, wrong tools | `team-tool-scaling` | #89 |

### Meeting Ops
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Meeting follow-through missing | `meeting-debrief` | #90 |

---

## Routing Logic

**CRM data quality <7/10:** Route to `database-hygiene-enrichment` before any automation or outbound work. Automating bad data scales the problem. Clean first, automate second. The gate is the fields the next automation actually reads, not the client's one aggregate score — a 6/10 dragged down by a messy `job_title` or `industry` field doesn't have to block a workflow that only segments on `employee_count` and `lead_source`. When the intake's `query_crm_data` completeness count is available, use it to name which specific fields must be clean before this specific automation, rather than gating the whole queue on a single number that can hide a narrow problem or a broad one equally. When the intake's duplicate-volume read came back non-trivial, name it as its own reason to route here — a clean set of fields on a database full of duplicate contacts still burns SDR hours and enrichment credits, and the two counts (completeness, duplicates) can disagree in either direction.

**Deliverability broken:** Route to `deliverability-reputation` as an immediate priority. Every day with broken deliverability is a day where the entire outbound motion is handicapped. Don't call it broken from a falling open rate alone — Apple Mail Privacy Protection and Gmail's own image-prefetching both distort open tracking (in opposite directions depending on how each platform tunes it), so a lower open rate is at least as likely to be a measurement artifact as a real reputation problem. The signal that actually justifies the emergency label is bounce rate or spam-complaint rate climbing, or a seed-list check landing in spam — ask for one of those before queuing the sub-skill as urgent.

**No CRM yet:** Route to `crm-strategy` → `crm-setup`. The order matters — pick the right CRM for the go-to-market motion before configuring it.

**RevOps function missing:** Route to `revenue-operations` to define the function, then `crm-strategy` + `growth-automation` for implementation.

**Hiring pressure:** Route to `team-assessment` → `org-design-hiring-roadmap` → `recruitment-package`. Never start with job descriptions — start with what gaps exist and what the org should look like, then write the JDs. This holds even when the ask sounds like it doesn't need it: "our best rep just quit, replace them exactly" is the case most likely to skip straight to `recruitment-package`, and the one where skipping costs the most — a role built around one departed person's actual strengths is rarely the role the org needs next. Run `team-assessment` anyway, briefly if the urgency is real, but run it.

**Budget planning season:** Route to `team-assessment` → `budget-resources-planning`. Budget decisions should follow capability gaps, not the other way around.

**Tool sprawl:** Route to `team-tool-scaling`. Tool consolidation before adding new tools saves money and reduces integration debt — but not when the team is about to double or triple within the quarter: a consolidation done at 15 people gets re-opened at 30, and the migration cost of the first round doesn't pay back before the second one starts. Confirm the team-size trajectory from the intake before queuing this route as a priority; if headcount is about to move a lot, defer consolidation until it settles.

---

## Orchestration Protocol

**Step 1 — Data dependency check.** If CRM data quality is the bottleneck, it must be fixed before any downstream tool is optimized. CRM data flows into deliverability, segmentation, automation, and reporting. The dependency is strict on the fields the downstream step reads — not on a single blanket score, which can pass a genuinely broken field or fail a program over a field nothing downstream touches (see the CRM data quality note in Routing Logic). When HubSpot read access made a `query_crm_data` completeness count possible in the intake, ground this check in that per-field count rather than the client's 1-10 estimate alone — and treat a non-trivial duplicate-volume read from that same query as an independent trigger, since a database can be duplicate-heavy on fields that are individually complete.

**Step 2 — People vs. tools vs. process.** Identify whether the operational problem is a people problem (wrong skills, wrong roles), a tools problem (wrong stack, wrong config), or a process problem (no workflow, broken handoffs). Each requires a different sub-skill. Resist collapsing all three into "we need more headcount": a process problem staffed with more people produces the same broken process faster, and a tools problem staffed with more people just means more people working around the same bad config.

**Step 3 — Queue sub-skills** (max 4 per session). Order: data → infrastructure → RevOps → team. The cap exists because a client mid-crisis will ask for all of it at once — naming 4 as the ceiling, not the target, matters more when the intake surfaces 6 or 7 genuine gaps than when it surfaces 2 or 3.

**Step 3 bis — When to interrupt the queue.** Two conditions justify stopping mid-sequence rather than running the rest of the plan for the sake of finishing it:
- **The data step surfaces a process gap, not a data gap.** `database-hygiene-enrichment` cleans a dataset once; if the same step also turns up no owner for data entry and no validation on the intake form, the mess is back within a quarter regardless of how clean the export looks today. Stop before queuing `growth-automation` or `deliverability-reputation` on top of a database that's clean but still unowned, and route to `team-assessment` instead — even though team sits last in the standard order.
- **An earlier step already answers what a later one was queued to settle.** `crm-strategy` choosing the CRM and process for the actual go-to-market motion can itself settle whether a standalone RevOps function is needed yet — a well-configured CRM for a 15-person team can absorb what `revenue-operations` would otherwise be queued to build. Don't run the later step just to complete the plan once the question it exists to answer is already answered.

**Step 4 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [CRM, stack, team size, specific gap]
Expected output: [deliverable]
Feeds into: [next operational layer]
```

---

## Session Output Format

```markdown
# Ops Session Plan — [Date]
Stack: [CRM + tools] | Team: [Size] | Primary gap: [What's breaking]

## Operational Gap Diagnosis
Data layer: [CRM quality, data gaps]
Infrastructure layer: [Automation, deliverability, RevOps]
Team layer: [Hiring gaps, org structure, budget]

## Sub-Skill Queue
1. /[skill] — [what it fixes] — output: [deliverable]
2. /[skill] — [what it fixes] — output: [deliverable]
3. /[skill] — [what it fixes] — output: [deliverable]
4. /[skill] — [what it fixes] — output: [deliverable]

## Context Briefs
[Per-step context injection]
```

---

## Rules

- **Data before automation.** Automating broken data produces broken outputs at scale. Fix CRM data quality before building any automation on top of it.
- **CRM strategy before CRM setup.** Configuring HubSpot for an enterprise sales motion looks nothing like configuring it for a PLG motion. Define the strategy (what process this CRM needs to support) before any technical setup.
- **Team assessment before job descriptions.** Writing JDs before knowing what the org needs creates roles that fill gaps in the org chart, not gaps in capability. Assess first, design second, hire third.
- **Deliverability is infrastructure, not a campaign fix.** A broken sending reputation takes weeks, not days, to rebuild — mailbox providers judge sending behavior over a rolling window, so the clock starts when clean behavior replaces the bad pattern, not when you stop sending. Treat it as an infrastructure emergency, not a campaign optimization.
- **A falling open rate is not proof of broken deliverability.** Apple and Gmail both distort open tracking through their own image-prefetching, in ways that move independently of actual sender reputation. Confirm with bounce rate, spam-complaint rate, or a seed-list check before queuing `deliverability-reputation` as an emergency — otherwise the queue reacts to a measurement artifact, not a real fire.
- **Gate on the field, not the score.** A CRM data quality gate exists to protect the fields the next automation reads, not to block on one aggregate number. Name the specific fields at risk before routing to `database-hygiene-enrichment` — a low score in an unrelated field isn't a reason to delay a program that never touches it.
- **"Replace them exactly" is a hiring-pressure request in disguise, not an exception to it.** A departed employee's role shape reflects what they happened to be good at, not necessarily what the org needs next. Run `team-assessment` even when the ask sounds urgent and self-evident — especially then, since that's the case most likely to get skipped.
- **A queue with no owner is not a plan.** Producing 3-4 sub-skill steps is the easy part; someone actually running each one is the scarce resource, especially in the ops-team-just-left scenario this orchestrator is often invoked for (see When Not to Run a Full Ops Session). Name an owner per step before treating the session as done.

---

## References

- `references/session-intake-tool-notes.md` — exact `query_crm_data` query shape and limits, the
  insufficient-scope error to recognize as "no read access," and how to read a missing
  `bdzGetLemlistConfig` record as "not connected" rather than a failed call.