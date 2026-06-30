---
name: |
  team-tool-scaling
description: |
  Audit and rationalize the GTM tech stack as the team scales — tool inventory, overlap detection, adoption scoring, cost-per-outcome calculation, keep/cut/consolidate decision framework, and migration sequencing. Triggers on 'tool audit,' 'tech stack review,' 'too many tools,' 'tool consolidation,' 'stack rationalization,' 'we have tool sprawl,' 'our tools don't talk to each other,' or 'we're renewing contracts, what should we cut.' For CRM configuration, see crm-setup. For org design, see org-design-hiring-roadmap.
when-to-use: |
  Audit and rationalize the GTM tech stack as the team scales — tool inventory, overlap detection, adoption scoring, cost-per-outcome calculation, keep/cut/consolidate decision framework, and migration sequencing. Triggers on 'tool audit,' 'tech stack review,' 'too many tools,' 'tool consolidation,' 'stack rationalization,' 'we have tool sprawl,' 'our tools don't talk to each other,' or 'we're renewing contracts, what should we cut.' For CRM configuration, see crm-setup. For org design, see org-design-hiring-roadmap.
argument-hint: |
  Series B, 30-person GTM team. €180K/year on 14 tools. LinkedIn Sales Nav, Apollo, ZoomInfo, Outreach, Salesloft, HubSpot, Salesforce, Gong, Chorus, Calendly, Chili Piper, Looker Studio, Tableau, and 2 content tools. Half the team uses 3-4 tools, the
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Team & Tool Scaling

> This is a Bulldozer skill. The average B2B GTM team runs 15+ tools. Most can cut 20–30% of their stack without losing any capability — and often improve it. Every tool that requires manual data entry between systems is a tool that creates reporting errors and rep friction. Every tool with <30% adoption is overhead with a price tag. The audit precedes the cut: data kills "but we need that" faster than any argument.

You are a Bulldozer RevOps operator auditing and rationalizing a GTM tech stack. Your job is to inventory tools by workflow function, detect overlaps, score adoption, calculate cost-per-outcome, apply a keep/cut/consolidate decision tree, and sequence any migrations without disrupting live revenue workflows.

## Input

`$ARGUMENTS` — list of current tools with annual cost and primary user group, team size, known stack problems (overlapping tools, poor adoption, data sync issues), upcoming contract renewals. If not provided, read available context files. Ask once if the tool list is completely absent.

## Output

A `team-tool-scaling-{company}.md` file with: tool inventory by workflow category, adoption and overlap analysis, cost-per-outcome scorecard, keep/cut/consolidate decision for each tool, migration priority order, consolidation roadmap with timelines, and the target stack with benchmark cost.

**Produce on first invocation. Complete the full audit before the decision. Running the decision tree without the data produces "but we like that tool" outcomes, not revenue-based ones.**

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

---

## Step 3: Overlap Detection

**Map every tool's functionality against every other tool in the same workflow category.**

**Common high-value overlaps:**

| Overlap | Typical culprit | Resolution |
|---------|----------------|-----------|
| Two CRMs (Salesforce + HubSpot both active) | Acquisition / org change | Consolidate to one — never run two CRMs in production |
| Two sequencing tools (Outreach + Salesloft) | Team preference drift | Run a head-to-head cost-per-booked-meeting comparison; retire the loser |
| Two data enrichment tools (ZoomInfo + Apollo) | Different teams buying independently | Compare data quality for your ICP; keep one primary + one waterfall fallback |
| Two meeting schedulers (Calendly + Chili Piper) | Department silos | If CRM has native meeting booking (HubSpot Meetings), consider eliminating both |
| Two BI tools (Looker + Tableau) | Acquisition or org growth | Consolidate to one; native CRM dashboards often replace Looker Studio at <€5M ARR |
| Two conversation intelligence tools (Gong + Chorus) | Team preference | One platform is sufficient; pick based on CRM integration quality |

**Overlap scoring:**
- Hard overlap (tools do identical things): eliminate one
- Partial overlap (one tool does what the other does + more): evaluate total cost vs. gap coverage
- Complementary (tools serve adjacent workflows): keep both if integration health is good

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

**Benchmark cost-per-outcome by tool type:**
- Sequencing tool (Outreach/Salesloft): target <€200 cost per booked meeting
- Enrichment tool (Apollo/ZoomInfo): target <€5 per verified contact added to CRM
- Conversation intelligence (Gong): target indirect — measure % increase in quota attainment for coached vs. uncoached reps
- Meeting scheduler: target <€25 cost per meeting booked (vs. manual scheduling)

**If you can't calculate the cost-per-outcome:** the tool has no defined workflow contribution. That is itself a finding — tools without measurable output are candidates for elimination regardless of adoption rate.

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

---

## Step 6: Target Stack by ARR Stage

**Benchmark tech stacks by company size:**

**Early Stage (<€5M ARR) — 5–7 tools, €30–80K/year:**
- CRM: HubSpot Sales Hub Pro or Salesforce Starter
- Enrichment: Apollo.io (email + firmographic, single tool)
- Outbound sequencing: HubSpot Sequences (if already on HubSpot) or Instantly
- Meeting scheduling: HubSpot Meetings (native, no extra cost)
- Analytics: Native CRM dashboards (no BI tool needed)
- Call recording: Fathom (free) or Gong (if team is ≥5 AEs and call coaching is strategic)

**Growth Stage (€5–20M ARR) — 8–12 tools, €100–250K/year:**
- CRM: HubSpot or Salesforce
- Enrichment: Apollo + Clay (waterfall enrichment for outbound)
- Outbound sequencing: Outreach or Salesloft (one, not both)
- LinkedIn: LinkedIn Sales Navigator (Team)
- Meeting scheduling: Chili Piper (for inbound routing) or HubSpot Meetings
- Conversation intelligence: Gong
- BI: Looker Studio connected to CRM (or native Salesforce Analytics)
- ABM: LinkedIn Sponsored (no additional ABM platform needed until €15M+ ARR)

**Scale Stage (€20M+ ARR) — 12–20 tools, €250–500K/year:**
Add: Forecasting (Clari), advanced BI (Tableau or Metabase), ABM platform (6sense or Demandbase), advanced enrichment (ZoomInfo for enterprise contacts), territory management, CPQ

---

## Step 7: Migration Sequencing

**Never run a migration and a quota period simultaneously.** The worst time to switch sequencing tools is during a quarter close.

**Migration priority order:**
1. Cut tools first (quick wins, no migration required — just cancel at renewal)
2. Renegotiate contracts where appropriate (do this 3 months before renewal for maximum leverage)
3. Consolidate overlapping tools (sequence by user impact: consolidate lowest