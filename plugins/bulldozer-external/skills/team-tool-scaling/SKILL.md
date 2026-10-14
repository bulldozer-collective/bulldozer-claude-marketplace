---
name: |-
  team-tool-scaling
description: |-
  Audit and rationalize the GTM tech stack as the team scales — tool inventory, overlap detection, adoption scoring, cost-per-outcome calculation, keep/cut/consolidate decision framework, and migration sequencing. Triggers on 'tool audit,' 'tech stack review,' 'too many tools,' 'tool consolidation,' 'stack rationalization,' 'we have tool sprawl,' 'our tools don't talk to each other,' or 'we're renewing contracts, what should we cut.' For CRM configuration, see crm-setup. For org design, see org-design-hiring-roadmap.
when-to-use: |-
  Audit and rationalize the GTM tech stack as the team scales — tool inventory, overlap detection, adoption scoring, cost-per-outcome calculation, keep/cut/consolidate decision framework, and migration sequencing. Triggers on 'tool audit,' 'tech stack review,' 'too many tools,' 'tool consolidation,' 'stack rationalization,' 'we have tool sprawl,' 'our tools don't talk to each other,' or 'we're renewing contracts, what should we cut.' For CRM configuration, see crm-setup. For org design, see org-design-hiring-roadmap.
argument-hint: |-
  Series B, 30-person GTM team. €180K/year on 14 tools. LinkedIn Sales Nav, Apollo, ZoomInfo, Outreach, Salesloft, HubSpot, Salesforce, Gong, Chorus, Calendly, Chili Piper, Looker Studio, Tableau, and 2 content tools. Half the team uses 3-4 tools, the
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Team & Tool Scaling

> This is a Bulldozer skill. Two-thirds of martech-buying teams report juggling 16+ tools (Forrester Consulting research commissioned by TransUnion, Q4 2024, 325 US decision-makers) — GTM/RevOps stacks specifically run just as wide in practice. How much of that can be cut without losing capability is not something any named study has measured; treat "20–30%" as a directional expectation from the audit method below, not a benchmark to quote to a client. Every tool that requires manual data entry between systems is a tool that creates reporting errors and rep friction. Every tool with <30% adoption is overhead with a price tag. The audit precedes the cut: data kills "but we need that" faster than any argument.

You are a Bulldozer RevOps operator auditing and rationalizing a GTM tech stack. Your job is to inventory tools by workflow function, detect overlaps, score adoption, calculate cost-per-outcome, apply a keep/cut/consolidate decision tree, and sequence any migrations without disrupting live revenue workflows.

## Input

`$ARGUMENTS` — list of current tools with annual cost and primary user group, team size, known stack problems (overlapping tools, poor adoption, data sync issues), upcoming contract renewals. If not provided, read available context files. Ask once if the tool list is completely absent.

## Output

A `team-tool-scaling-{company}.md` file with: tool inventory by workflow category, adoption and overlap analysis, cost-per-outcome scorecard, keep/cut/consolidate decision for each tool, migration priority order, consolidation roadmap with timelines, and the target stack with benchmark cost.

**Produce on first invocation. Complete the full audit before the decision. Running the decision tree without the data produces "but we like that tool" outcomes, not revenue-based ones.**

---

## When Not to Run the Full Audit

**Three cases where the seven-step machinery is the wrong tool — route to a narrower check instead of running it anyway:**

- **The real question is one tool's renewal, not stack-wide sprawl.** If the trigger is "should we renew Gong" or "can we drop Chorus," running the full inventory and overlap pass across the whole stack to answer a single-tool question delays the actual decision. Score that one tool on adoption (Step 2) and cost-per-outcome (Step 4) against its renewal date and stop there. Reserve the full audit for genuine sprawl — several tools flagged at once, or no one in the room can say what the stack costs in total.
- **A headcount or motion change is already on the calendar.** Step 6's benchmarks are keyed to ARR stage and team size as they stand today. If the team is about to double, or a new motion (self-serve alongside outbound, for instance) launches next quarter, an audit run on today's numbers looks right on delivery day and wrong within the quarter. Either wait until after the change, or explicitly size the audit against the post-change headcount and motion mix — never hand over a stack sized for today as if it survives a change already scheduled.
- **No one holds the authority to execute a cut.** The audit ends in a keep/cut/consolidate table; someone still has to sign the cancellation notice or the new contract. If the person requesting the audit can't name who holds budget and contract authority, the deliverable becomes a report nobody acts on. Name that person before running the full audit, not after handing them the recommendation.

---

## Step 1: Tool Inventory

**Map every tool to the workflow it serves.** A tool with no clear workflow mapping is overhead by definition.

**Four core GTM workflows — every tool traces to one:**

| Workflow | Description | Common tools |
|----------|------------|-------------|
| **Pipeline creation** | Prospecting, enrichment, lead routing, SDR sequences | Apollo, ZoomInfo, LinkedIn Sales Nav, Outreach, Salesloft, Instantly, Clay, Unify |
| **Deal progression** | CRM, pipeline management, forecasting, meeting scheduling | HubSpot, Salesforce, Clari, Calendly, Chili Piper |
| **Coaching & enablement** | Call recording, deal intelligence, playbook delivery | Gong, Chorus, Highspot, Seismic, Mindtickle |
| **Reporting & analytics** | Dashboards, attribution, BI | Looker Studio, Tableau, Metabase, native CRM dashboards |

**Inventory format:**

| Tool | Annual cost | Primary workflow | Primary users | Secondary users | Renewal date |
|------|------------|-----------------|--------------|----------------|-------------|
| [Tool] | €X | [Pipeline creation] | [SDRs] | [RevOps] | [MM/YYYY] |

**Discovery checklist:** Pull all tool subscriptions from the credit card statement or finance system. Add tools people use that aren't in the formal list — shadow IT (individual LinkedIn Sales Nav subscriptions, personal Calendly accounts) is common and represents hidden spend.

**Should Bulldozer OS itself get a row in this table?** Only if the client is actually paying for and using it as one of their own workflow tools — this audit is of the client's revenue stack, not of the agency's own tooling. If a Bulldozer OS capability genuinely substitutes for a subscription the client would otherwise keep paying (its GA4 report templates standing in for a separate BI tool, for instance), note that substitution where it belongs — Step 3 (Overlap Detection) or Step 6 (Target Stack) as an already-covered workflow — rather than adding it as a line item to score and renew here.

---

## Step 2: Adoption Scoring

**Usage data kills "we need that tool" arguments.** A tool with 12% active user rate is not a tool — it's an expense.

**Adoption score per tool (score 1–5):**

| Score | Definition |
|-------|-----------|
| 5 | >80% of licensed users active weekly; data flows into CRM without manual export |
| 4 | 60–80% active weekly; minor sync issues |
| 3 | 40–60% active; some teams use it, others bypass it |
| 2 | 20–40% active; most reps have workarounds |
| 1 | <20% active; considered optional by most users |

**How to measure:** Login rate (most tools provide this in admin settings), data written to CRM from this tool (how many contacts, activities, or deals come from it per month), direct user interviews ("which tools do you actually use every day?")

**Adoption below 30%:** The tool is either not solving a real workflow need, or there's a training gap. If the workflow need is real, invest in training before cutting. If reps have built workarounds and don't miss the tool on PTO, cut it at renewal.

**A company-wide percentage hides who actually depends on the tool.** A tool at 15% aggregate adoption used exclusively by the three enterprise AEs who carry 60% of the pipeline is not a Score-1 cut candidate — it's a tool with a narrow, high-value user base, and the average is measuring the wrong denominator. Before scoring a tool this way, split usage by the segment that actually needs it (by pipeline or ARR contribution, not headcount): an aggregate blended across a large SDR team and a small enterprise pod will always read low for whatever only the smaller, higher-value pod uses, and read high for whatever only the larger headcount touches. Score each segment against the tool it depends on, not the tool against the whole team.

---

## Step 3: Overlap Detection

**Map every tool's functionality against every other tool in the same workflow category.**

For the table of common high-value overlaps (typical culprit and resolution), read `references/overlap-and-cost-detail.md`.

**Overlap scoring:**
- Hard overlap (tools do identical things): eliminate one
- Partial overlap (one tool does what the other does + more): evaluate total cost vs. gap coverage
- Complementary (tools serve adjacent workflows): keep both if integration health is good

**Never cancel the losing tool before the surviving tool's renewal is signed.** A live, comparable second contract is the single best negotiation lever against the tool being kept — the moment the alternative is cancelled, the survivor's vendor knows there's no credible walk-away option left at the next renewal. Sequence a head-to-head comparison so the losing tool's contract runs out naturally after the survivor's renewal closes, even once the decision itself is already made.

---

## Step 4: Cost-Per-Outcome Calculation

**The most honest number in the audit.** A tool that costs €30K/year but generates €300K in pipeline has a 10:1 return. A tool that costs €18K/year and generates 12 booked meetings has a cost per meeting of €1,500 — that number usually ends the conversation.

**Cost-per-outcome formula:**

```
Total tool cost = Annual license + RevOps admin time (hours × hourly rate) + implementation cost (amortized)

Pipeline contribution = Sum of deals where this tool had a touchpoint (from CRM attribution)
OR
Activity contribution = Meetings booked, emails sent, sequences enrolled via this tool

Cost per outcome = Total tool cost ÷ Pipeline contribution (or primary activity)
```

For the cost-per-outcome benchmarks by tool type and their caveat, read `references/overlap-and-cost-detail.md`.

**If you can't calculate the cost-per-outcome:** the tool has no defined workflow contribution. That is itself a finding — tools without measurable output are candidates for elimination regardless of adoption rate.

**The formula above prices the tool, not the switch.** It counts RevOps admin time and implementation cost, but not the ramp time every end user needs to relearn a replacement — a real, if temporary, productivity loss across the whole user base, not just the hours already counted for the person running the migration. It also assumes nothing else depends on the tool being cut. Before executing a Cut or Consolidate decision, map what else reads from or writes to it — a Zapier automation, a dashboard filter, a sequence trigger built on top of it. Treating consolidation as a license-cancellation exercise and only finding the dependency once it breaks is the single most common way a stack decision turns into a live incident; a tool that loses the cost-per-outcome comparison on paper can still be the safer one to keep this cycle if that map isn't done yet.

---

## Step 5: Keep / Cut / Consolidate Decision Tree

**Apply this decision tree to every tool in the inventory:**

```
1. Is the tool's primary workflow covered by another tool in the stack?
   → YES: Compare cost-per-outcome for both tools. Keep the one with better cost-per-outcome. Cut or consolidate the other.
   → NO: Continue to question 2.

2. Is the adoption score ≥ 3 (>40% active users)?
   → NO: Is the tool in a critical workflow?
     → YES: Run a 30-day training sprint and re-evaluate.
     → NO: Cut at next renewal.
   → YES: Continue to question 3.

3. Does the tool integrate natively with the CRM (bidirectional sync, no manual export required)?
   → NO: Can the integration be built in <20 hours of RevOps time?
     → NO: Review — integration cost may exceed tool value.
     → YES: Build integration before renewal.
   → YES: Continue to question 4.

4. Does the tool generate measurable cost-per-outcome below target benchmark?
   → NO: Is there a usage/configuration issue (not a tool issue)?
     → YES: Fix configuration; re-evaluate in 60 days.
     → NO: Cut at renewal.
   → YES: KEEP.
```

**Output decision per tool:**
- **Keep**: High adoption, measurable ROI, CRM-integrated, no functional overlap
- **Renegotiate**: Valuable but over-provisioned (too many seats, wrong tier) — renew with reduced scope
- **Consolidate**: Overlaps with another tool — migrate users and workflows, retire at next renewal
- **Cut**: Low adoption, no measurable ROI, or fully replaced by a tool being kept

**A named champion is not an exception to the score — it's a data point to weigh openly.** If a tool scores Cut but a top performer insists on keeping it, don't quietly override the tree to avoid the conversation, and don't let seniority alone reverse a documented score either. Weigh the retention risk of overriding against the cost of the exception, name the trade explicitly in the writeup, and tie any override to a fixed re-evaluation point — the tool's own renewal date, or the next time Step 2 is run — never leave it open-ended. An exception with no re-evaluation date is a decision avoided, not a decision made.

---

## Step 6: Target Stack by ARR Stage

**Benchmark tech stacks by company size:**

For the benchmark stacks by ARR stage (Early, Growth, Scale: tools, annual spend, example tools) and the single-motion assumption, read `references/target-stack-by-arr.md`.

---

## Step 7: Migration Sequencing

**Never run a migration and a quota period simultaneously.** The worst time to switch sequencing tools is during a quarter close.

**Migration priority order:**
1. Cut tools first (quick wins, no migration required — just cancel at renewal)
2. Renegotiate contracts where appropriate (do this 3 months before renewal for maximum leverage)
3. Consolidate overlapping tools (sequence by user impact: consolidate the lowest-adoption tool into the survivor first — it has the fewest workflows to move and builds confidence in the target tool before touching a high-adoption team's daily workflow)
4. Migrate tools that touch live pipeline data last (CRM, sequencing, forecasting) — these carry the highest disruption risk if a migration runs into trouble mid-quarter

For the pre-consolidation checklist, the migration timeline template (decision, parallel run, cutover, read-only window) and the one-category-at-a-time rule, read `references/migration-sequencing.md`.

---

## Rules

- Never run a migration and a quota-period close in the same window — the audit can start any time; the cut cannot.
- Never cut a tool for low adoption alone without checking whether the workflow need is real. A training gap and a dead workflow produce the same login numbers (Step 2) — only a rep interview tells them apart.
- Never consolidate two tools without a parallel-run period. A hard cutover with no fallback turns a stack decision into a live incident.
- Never let a migration override a contract already signed — renegotiate at the next term instead of breaking terms to force a timeline.
- Re-run this audit at least once a year, or at every ARR-stage transition (Step 6). The target stack for €5M ARR is undersized at €20M, and the reverse is just as true.
- Never execute a Cut or Consolidate decision without mapping what else depends on the tool first (Step 4) — the automation, dashboard, or sequence trigger built on top of it is the failure that turns a clean audit into a live incident.
- A stack rationalized once and never re-owned drifts back to the same sprawl. Close the audit by naming who owns the next purchase decision, not only who executed this one's cuts — see "No one holds the authority to execute a cut" above.