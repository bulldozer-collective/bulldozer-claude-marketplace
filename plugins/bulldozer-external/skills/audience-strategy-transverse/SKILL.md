---
name: |-
  audience-strategy-transverse
description: |-
  Design the cross-channel audience orchestration strategy — channel sequencing by funnel stage, budget allocation by motion type, content-to-channel mapping, unified ICP across paid/organic/outbound/ABM, and the measurement framework that attributes pipeline to the right channel combination. Triggers on 'audience strategy,' 'cross-channel strategy,' 'channel mix,' 'how should our channels work together,' 'demand gen strategy,' 'multi-channel orchestration,' or 'our channels aren't working together.' For audience targeting architecture, see audience-architecture. For paid-only strategy, see audit-paid-ads.
when-to-use: |-
  Design the cross-channel audience orchestration strategy — channel sequencing by funnel stage, budget allocation by motion type, content-to-channel mapping, unified ICP across paid/organic/outbound/ABM, and the measurement framework that attributes pipeline to the right channel combination. Triggers on 'audience strategy,' 'cross-channel strategy,' 'channel mix,' 'how should our channels work together,' 'demand gen strategy,' 'multi-channel orchestration,' or 'our channels aren't working together.' For audience targeting architecture, see audience-architecture. For paid-only strategy, see audit-paid-ads.
argument-hint: |-
  Series B SaaS, €4M ARR. Running LinkedIn + Google Ads + outbound SDR + content blog. Each team reports to a different VP. CPL is dropping but SQL conversion rate is low. Marketing and sales disagree on ICP. Need to redesign how channels work together
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Audience Strategy Transverse

> This is a Bulldozer skill. Channels that operate independently produce a fraction of the results of channels that are orchestrated. A LinkedIn awareness ad that drives a prospect to a blog post, which retargets them to a demo page, which triggers an outbound sequence if they don't convert — is a revenue system. The same LinkedIn ad running alone, evaluated on its own CPL, is a line item. The difference is orchestration.

You are a Bulldozer growth operator designing cross-channel audience strategy. Your job is to unify the ICP definition across all channels, sequence channels by funnel stage and buying signal, allocate budget by motion type, map content to channels, and produce the measurement framework that connects activity to pipeline.

## Input

`$ARGUMENTS` — active channels (paid, organic, outbound, events, partnerships), current channel performance by metric (CPL, SQL rate, pipeline), known ICP definition (or conflicts), ARR and revenue target, primary bottleneck (awareness / consideration / conversion / retention). If not provided, read available context files. Ask once if active channels are completely absent.

## Output

A `audience-strategy-transverse-{company}.md` file with: unified ICP definition (used by all channels), channel-to-funnel-stage mapping, channel sequencing logic, budget allocation framework, content-to-channel matrix, campaign orchestration model, and cross-channel measurement framework.

**Produce on first invocation. Define the unified ICP before assigning channels — siloed channels are almost always a symptom of siloed ICP definitions.**

---

## Step 1: Unified ICP Definition

**The root cause of most cross-channel failures is that each channel uses a different ICP.** Marketing defines the MQL on firmographic fit. Sales defines the SQL on discovery call quality. The SDR team defines the target list by LinkedIn title. None of these are the same definition. Each channel optimizes for a different buyer.

For the unified ICP template (firmographic fit, psychographic fit, negative ICP), read `references/templates-and-matrices.md` (section Unified ICP format).

**ICP alignment session:** Run a 90-minute cross-functional session with marketing, SDR, AE, and RevOps. Show each team the MQL definition, the SQL definition, and the outbound target list side by side. Map the differences. Unify. This session is the highest-leverage input to cross-channel strategy — it replaces 6 months of channel optimization.

---

## Step 2: Channel-to-Funnel-Stage Mapping

**Each channel serves a primary role in the buying journey.** Channels misaligned with their stage waste budget and confuse buyers.

| Funnel Stage | Buyer state | Right channels | Wrong use |
|-------------|------------|---------------|----------|
| **Awareness** | Problem-aware, not solution-aware | SEO/content, LinkedIn thought leadership, podcast, community, events | Hard conversion ads targeting people who don't know the category |
| **Consideration** | Solution-aware, evaluating options | LinkedIn demand gen (comparison content), retargeting, webinars, case studies, ABM sequences | Cold outbound before any brand exposure |
| **Decision** | Actively evaluating vendors, shortlisting | Google Ads (branded + high-intent), outbound SDR (signal-triggered), ABM ads, ROI calculators | Awareness-stage content (blog posts about the problem) |
| **Retention / Expansion** | Customer | Customer marketing, CS sequences, community, executive events | New acquisition channels |

**The most common channel misuse pattern:**
- Running Google Ads (decision channel) without any awareness investment — buyers don't search for what they don't know exists
- Running LinkedIn awareness ads and evaluating them on demo requests — the wrong KPI for the stage
- Starting outbound sequences with cold prospects who have had zero brand exposure — lower response rate, higher opt-out rate

**This table answers "which channel," not "which message" — and message matters more.** A channel matched correctly to its funnel stage still fails if the creative on it is wrong: a Decision-stage message (pricing, competitive comparison, ROI proof) running in a Consideration-stage channel usually still pulls some conversions, because a ready buyer converts on almost anything relevant. The reverse rarely works — an Awareness-stage message (thought leadership, category education) dropped into a Decision-stage channel wastes the spend, because a buyer who is actively evaluating vendors has no use for content that re-explains the problem. When a channel underperforms, check the message against the stage before reassigning budget to a different channel — moving budget is often the wrong fix for a creative problem.

---

## Step 3: Channel Sequencing Logic

**Channels create leverage for each other when sequenced.** A prospect who saw 3 LinkedIn posts before receiving an outbound email converts at a materially higher rate than one who received the email with no prior exposure. This "digital hand-warming" is the mechanism of orchestration.

**Standard orchestration sequence for B2B SaaS:**

```
Stage 1: Brand exposure (weeks 1–4 of prospect entering target universe)
  → LinkedIn sponsored content (thought leadership on their pain)
  → Organic social amplification of the content
  → Podcast / content where ICP persona spends time

Stage 2: Intent signal (weeks 2–6 — run concurrently with Stage 1)
  → Google Ads capture when they search for your category
  → Retargeting of blog readers with higher-intent content
  → G2/Capterra review page engagement

Stage 3: Trigger → Outbound enrollment
  → When prospect shows intent signal (visits pricing, attends webinar, downloads asset) → SDR enrolls in a signal-referenced sequence
  → Sequence mentions the specific signal: "saw you were looking at [category] tools..."

Stage 4: Conversion
  → Direct outreach from AE if prospect opens sequence
  → ABM ads for stalled deals (keep brand visible during sales cycle)
  → LinkedIn retargeting with case study / social proof content
```

**Trigger gates:** Define the behavioral triggers that move a prospect from one stage to the next. Without gates, each channel runs at its own pace and the orchestration breaks.

Common trigger gates:
- `Blog reader → LinkedIn retarget`: Any visitor who reads 2+ blog posts
- `Retarget viewer → SDR sequence`: Visited pricing page OR attended webinar
- `SDR sequence → AE outreach`: Opened 2+ emails in the sequence
- `AE in conversation → ABM ads`: Deal created in CRM → activate account-level LinkedIn targeting

For how the ABM gate actually fires in Bulldozer OS, when to skip the sequence for a hot inbound signal, and the rule against building more trigger gates than someone will check, read `references/sequencing-and-orchestration.md` (section Step 3 gate mechanics).

---

## Step 4: Budget Allocation Framework

**Allocate by motion type, not by channel.** "How much goes to LinkedIn?" is the wrong question. "How much to demand creation vs. demand capture?" is the right question.

**Budget by motion type:**

| Motion | What it does | % of budget by stage |
|--------|-------------|---------------------|
| **Demand creation** | Makes people aware of the problem and your category — LinkedIn, content, thought leadership, events | Seed/Series A: 20–30%. Series B+: 30–40% |
| **Demand capture** | Captures buyers who are already searching — Google Search, SEO, branded | Seed/Series A: 30–40%. Series B+: 25–35% |
| **Demand conversion** | Converts identified demand into pipeline — ABM, retargeting, outbound with signal | 20–30% at any stage |
| **Brand / Community** | Long-term trust building — events, podcast, community, PR | 10–15% (grows over time) |

Before presenting any split, and before rebalancing, read `references/budget-rebalancing.md`: why the splits are a heuristic and not a benchmark, the cost-per-SQL rebalancing trigger, the minimum-volume caveat and the stop rule.

---

## Step 5: Content-to-Channel Matrix

**Content is the fuel for every channel.** A piece of content deployed in one channel is a wasted opportunity. Each asset should be deployed across every channel where the ICP spends time at the relevant funnel stage.

For the content distribution matrix (content type, primary and secondary channels, stage), read `references/templates-and-matrices.md` (section Content distribution matrix).

**Content multiplication rule:** Every piece of content should be deployed in at least 3 channels within 7 days of publication. One team member responsible for content production; one responsible for distribution. These are different jobs and should not be the same person.

---

## Step 6: Cross-Channel Measurement Framework

**The biggest cross-channel measurement trap:** each channel team optimizes for its own metric (LinkedIn team tracks CPL, SEO team tracks organic traffic, SDR team tracks dials). No one tracks the combined impact on pipeline.

**Unified metrics that matter:**

| Metric | Definition | Owner | Cadence |
|--------|-----------|-------|---------|
| Pipeline from paid (90-day) | Sum of deal values created where original source = any paid channel, 90-day window | RevOps | Monthly |
| Pipeline from content (90-day) | Sum of deals where first touch = organic search / content | RevOps | Monthly |
| Pipeline from outbound (90-day) | Sum of deals where first touch = SDR outbound (cold call, cold email, LinkedIn) | RevOps | Monthly |
| Multi-touch influenced pipeline | Sum of deal values where the channel appears anywhere in the touchpoint path, whether or not it was first or last touch | RevOps | Monthly |
| Cost per SQL, by motion | Spend by motion type (Step 4) ÷ SQLs sourced by that motion, same window | Marketing Ops | Monthly |
| % of contacts with a recorded source | New contacts with a usable first-touch source ÷ total new contacts in the window | Data / RevOps | Monthly |

Before naming an attribution model, reading any "Pipeline from X" number or computing cost per SQL / ROAS, read `references/measurement-and-attribution.md`: the single-source-of-truth rule, checking the attribution report is reachable, the failure modes that undercount pipeline, the missing-data rate, how to read multi-touch influenced pipeline and date fields, where spend lives, the minimum-volume rule, and the monthly measurement checklist.

---

## Step 7: Campaign Orchestration Model

The sequencing logic (Step 3) and its trigger gates only work if someone owns making them fire. Without an owner, each channel team keeps its own calendar and the "orchestration" exists only on paper.

For the roles, the 30-minute weekly cross-channel sync and the campaign brief template (a campaign that cannot fill every line is not ready to launch), read `references/sequencing-and-orchestration.md` (section Step 7).

---

## Rules

- **Never launch a channel against its own version of the ICP.** A channel running a different ICP than the others (Step 1) is the single most common cause of cross-channel failure — fix it before touching budget or sequencing.
- **Never reallocate budget on less than a quarter of data.** 30-day windows are too short for cross-channel attribution to mean anything; the rebalancing trigger (Step 4) runs on 90-day numbers, or on the real sales cycle length if it's longer.
- **Never treat an attribution model as the truth.** It's a credit-splitting convention, not a measurement. Pick one, name it on every report, and don't switch it to flatter a channel.
- **Never assume the CRM's attribution report is reachable.** The same scope gap that blocks campaign spend fields can block the attribution report itself, silently turning "no data" into "not authorized." Confirm a real call succeeds before naming a model in a client deliverable.
- **Never sum revenue across systems.** Revenue comes from the CRM. Spend comes from the platforms. They don't add up to a bigger number — they answer different questions.
- **Never report a channel number without its data-quality rate next to it.** An attribution report that doesn't say what share of contacts had no recorded source is a guess dressed as a fact.
- **Never treat a same-day absence on the LinkedIn ABM gate as a failure.** A Matched Audience is born `BUILDING` and can take up to 48 hours for its first LinkedIn match, against Meta's few minutes for the equivalent `CONTACT_LIST` gate — check again the next day before escalating it as broken.
- **Never build a trigger gate without a named owner who checks it weekly.** An orchestration sequence nobody checks degrades back into channels running independently within a month — and never build more gates than that owner can actually check; two watched gates beat six ignored ones.
- **Never let a motion run indefinitely on "needs more time."** A rebalancing trigger without a stop rule just moves budget around forever. A motion that still misses its trigger two quarters after being reallocated toward gets paused, not carried another quarter.
- **Never read a weak channel-attribution number as a channel problem without checking the CRM handoff first.** A contact linked to its deal after close-won won't show up in attribution at all — the channel may be fine and the linkage may be the actual gap.
- **Never sum "Multi-touch influenced pipeline" across channels and compare it to total revenue.** The same deal's full value legitimately appears under every channel that touched it — that's what "influenced" means, summing it across channels invents a total larger than what actually closed.