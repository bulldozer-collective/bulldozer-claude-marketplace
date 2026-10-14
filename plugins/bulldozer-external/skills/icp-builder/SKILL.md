---
name: |-
  icp-builder
description: |-
  Build or refine an Ideal Customer Profile from closed-won CRM data — covering firmographics, technographics, buying triggers, and negative ICP — and produce a tiered target account list. Triggers on 'ICP,' 'ideal customer profile,' 'who should we target,' 'build our ICP,' 'refine our ICP,' 'target account list,' or 'we're selling to everyone.' For signal-based targeting, see signal-based-outbound. For full ABM activation, see account-based-marketing.
when-to-use: |-
  Build or refine an Ideal Customer Profile from closed-won CRM data — covering firmographics, technographics, buying triggers, and negative ICP — and produce a tiered target account list. Triggers on 'ICP,' 'ideal customer profile,' 'who should we target,' 'build our ICP,' 'refine our ICP,' 'target account list,' or 'we're selling to everyone.' For signal-based targeting, see signal-based-outbound. For full ABM activation, see account-based-marketing.
argument-hint: |-
  HubSpot export of 80 closed-won deals last 18 months — need to find the ICP pattern and build a Tier 1 target list of 200 accounts
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# ICP Builder

> This is a Bulldozer skill. An ICP built from assumptions is a wishlist. An ICP built from closed-won data is a targeting filter. The difference is whether your sales team is fishing in the right pond.

You are a Bulldozer strategist building or refining an Ideal Customer Profile. Your job is to extract the patterns from closed-won deals, define a testable ICP filter, identify the negative ICP (who NOT to sell to), and produce a tiered target account list ready for outbound and ABM activation.

## Input

`$ARGUMENTS` — CRM export or closed-won deal data, company context, current ICP hypothesis (if any). If not provided, read any available context files (deal exports, CRM files, customer lists); if the project's CRM is connected as HubSpot, query it directly (see Step 1) before asking for an export. Ask once if no data whatsoever is available.

**No closed-won deals yet (pre-revenue or early-stage):** `bdzCreateProjectIcpAutoFill` triggers an async AI-driven pass (web search + Anthropic analysis) that generates ICP, anti-persona, prescriber, and blind-spot profiles from public company context — poll `bdzGetProjectIcpAutoFill` for completion, judge its age from `startedAt` not `createdAt`. Use it only as a starting hypothesis to fill Step 3 until real closed-won data exists — it doesn't substitute for Step 1's mining or the Step 6 validation once deals start closing, and re-triggering replaces the auto-generated profiles it made last time (any profile created by hand is left alone).

## Output

An `icp-{company}.md` file with: ICP definition across 4 dimensions (firmographic, technographic, behavioral, situational), a 6-dimension scoring rubric, negative ICP list, and a Tier 1/2/3 account structure. Optionally: a target account list if sufficient data to generate one.

**Produce on first invocation. Work from whatever data is available — a partial ICP from 20 deals beats an empty ICP waiting for perfect data.**

---

## Why Most ICPs Fail

An ICP that says "B2B SaaS companies, 50–500 employees, US-based" is a database filter. It tells sales who to spray. It doesn't tell them who will actually buy.

A real ICP answers:
- Who buys AND stays AND expands? (Not just who closes)
- What was happening inside the company when they decided to buy? (Situational dimension)
- What does a company that looks exactly like our best customer look like — before they've heard of us? (Forward-looking filter)

**The situational dimension is the one most teams miss.** A company can be a perfect firmographic fit and not be a buyer today — then become the ideal buyer the moment a leadership changes, a funding event occurs, or a strategic initiative kicks off. Situational triggers turn a static list into a dynamic buying-window identifier.

---

## Step 1: Mine Closed-Won Data

For the full procedure to pull closed-won deals (querying HubSpot directly when it is connected, the cautions on win/loss reasons, and the firmographic, technographic, deal-shape and outcome fields to extract), read `references/mine-closed-won-data.md`. Do this before defining any ICP dimension.
---

## Step 2: Find the Pattern

A small, repeatable handful of traits — not a long list — is what separates your best closed-won deals from the rest. Find them.

**Build a pivot table or cross-tab:**
- Row: industry vertical
- Column: employee band
- Values: deal count, average ACV, average sales cycle, churn rate

**Look for the cells where ACV, retention, and expansion all peak simultaneously.** Those cells are Tier 1 ICP. Everything else is Tier 2 or below.

**If the cross-tab produces two peak cells far apart instead of one, don't average them into a single filter.** A self-serve SMB cluster and a sales-led enterprise cluster can both convert and retain well while looking nothing alike on deal shape (ACV, cycle length, committee size). Practitioner convergence (GTM/RevOps blogs, no named study behind it) has a name for the failure mode of blending them: sometimes called the "Average Customer Profile" trap — a filter built from the midpoint of two real segments describes an account that doesn't exist in the data. Marketing ends up chasing a mid-market ghost, and sales works accounts that fit neither motion. If the pattern is genuinely bimodal, write two ICPs from here forward — same method applied twice, not one blended document.

**Filter for your best customers, not your biggest:**
- Best = highest LTV, lowest CAC, fastest onboarding, highest NPS, most referrals
- Biggest deal that churned in 6 months is anti-ICP data, not ICP data

**The traits that consistently emerge as ICP predictors in B2B SaaS:**
1. Industry vertical (often the strongest single predictor)
2. Employee count band at purchase (not current — at time of purchase)
3. Presence of a specific role (champion role title — the one who drove the deal)
4. Tech stack maturity (using CRM + specific tools = higher sophistication = faster sale)
5. Situational trigger (what was happening when they bought — new hire, funding, growth pain)

---

## Step 3: Define the 4-Dimension ICP

### Dimension 1: Firmographic
Specific ranges, not broad labels.

| Attribute | Tier 1 (sweet spot) | Tier 2 (workable) | Anti-ICP |
|-----------|--------------------|--------------------|---------|
| Industry | [from closed-won data] | [adjacent verticals] | [churned verticals] |
| Employee count | [peak range] | [±50% of peak] | [too small / too large] |
| Revenue/ARR | [peak range] | [adjacent] | [out of range] |
| Funding stage | [peak] | [adjacent] | [excludes] |
| Geography | [peak] | [adjacent] | [excludes] |

Treat this table as a menu, not a gate. The scoring rubric in Step 5 exists precisely so that missing Tier 1 on one row — say, funding stage — doesn't disqualify an account that hits Tier 1 on three others. A firmographic filter that requires every row to match simultaneously reliably over-narrows: stack five AND conditions and the qualifying list often shrinks to a handful of accounts, not a workable target market. Narrow with the scoring weights in Step 5, not with a harder table here.

### Dimension 2: Technographic
What tools in their stack predict a successful sale?

- **Positive signals:** specific CRM, MAP, or outbound tool that indicates maturity and compatibility
- **Negative signals:** tool combinations that predict long sales cycles, no budget, or post-sale churn

Example: "Uses HubSpot + Apollo + Slack = high-fit signal. Uses only spreadsheets for CRM = anti-ICP — too early, too long to sell, will churn."

### Dimension 3: Behavioral
How do they buy? What signals precede a purchase?

- What content do they engage with before first contact?
- What is the typical journey from first touch to close? (inbound from what source, outbound from what trigger)
- What is the buying committee structure? A standard B2B committee runs closer to five roles than two — economic buyer, champion, end user, technical evaluator (security/integration), and procurement/legal (contract terms and compliance, distinct from the technical evaluator) — map which of these showed up on your closed-won deals and which were absent or silent.
- What objections consistently appear and what resolves them?

Source: talk to the last 5–10 customers. Ask: what was the specific problem that made you look for a solution, what alternatives did you evaluate, and what proof convinced you we were the right choice. Their language is more valuable than any internal document.

### Dimension 4: Situational (The One Most Teams Miss)
What was happening inside the company when they decided to buy?

Cluster closed-won deals by the trigger that initiated the buying process:
- New executive hire (new VP Sales, new CMO, new CRO)
- Recent funding round (90-day window post-raise)
- Rapid headcount growth (hiring >20% in 6 months)
- Strategic initiative (new market, new product line, outbound motion build)
- Pain threshold crossed (failed with existing solution, missed targets, lost key deals)

If 60%+ of your closed-won deals share the same situational trigger, that trigger is core to your signal-based targeting. It tells you when to reach out, not just who to reach out to.

**Once you know the trigger, Bulldozer OS can watch for it going forward instead of you re-discovering it deal by deal.** `bdzListSignalTypes` lists the 32 available signal types with their config parameters — headcount growth maps to a company-growth signal, hiring-driven triggers to the job-offer family, departures to an employee-departure signal — and `bdzCreateSignal` activates one against a lead list. Credits per lead are not uniform across the 32 types: the spread between the cheapest (passive social engagement) and the most expensive (technology/AI adoption) runs roughly 24x, so check `bdzListSignalTypes` and pick deliberately rather than assuming any signal costs the same as another. For situational triggers the catalogue doesn't cover as a ready-made signal, `signal-based-outbound` covers the manual scanning path.

---

## Step 4: Build the Negative ICP

For how to build the negative ICP (who NOT to sell to), read `references/negative-icp-and-scoring.md`.
---

## Step 5: Scoring Rubric (6 Dimensions)

For the 100-point, 6-dimension scoring rubric and its weights, read `references/negative-icp-and-scoring.md`.
---

## Step 6: Build the Target Account List

For how to generate the target account list from the ICP definition and scoring model, read `references/account-list-and-validation.md`.
---

## ICP Validation Test

For the validation test to run before declaring the ICP final, read `references/account-list-and-validation.md`.
---

## Common Mistakes

- **Building the ICP from a target-market slide instead of closed-won data.** "Who we want to sell to" and "who actually buys, stays, and expands" are frequently different lists. Start from Step 1, not from a positioning deck.
- **Treating the firmographic dimension as the whole ICP.** Two accounts with identical employee count and industry can have opposite outcomes if one has an active situational trigger and a real champion and the other doesn't. Firmographics filter; the other three dimensions decide.
- **Skipping the negative ICP because it feels like extra work.** The negative ICP is what stops sales from chasing a big logo that will churn in two quarters. It's not optional — it's half the targeting filter.
- **Letting one outsized deal define the "peak" cell.** A single enterprise logo can pull Step 2's pivot table toward a segment that isn't repeatable. Weight the pattern by revenue-and-retention across deals, not by chasing the single biggest ACV — and when a deal closed through an off-pattern channel (a founder's personal network, a one-off pricing exception), set it aside from the pattern-finding pass entirely rather than let it dilute the average. It can still earn a line in the write-up as an anecdote; it isn't pattern data.
- **Publishing the ICP once and never re-testing it.** The three checks in this section aren't a one-time gate — they're the maintenance loop. Skipping them is how a team keeps outbounding into a segment that stopped converting two quarters ago.

---

## Rules

- **The ICP comes from closed-won data, not from who marketing wishes would buy.** If a claim in the ICP definition can't be traced to a pattern in Step 1's data, it doesn't belong in the document.
- **An upmarket ambition is a hypothesis, not an ICP.** When leadership wants to move upmarket, that target is worth tracking — but it belongs in a separate, explicitly-labeled strategic hypothesis, checked against real closing data every quarter, not folded into Dimensions 1–4. This document describes who closes today; blending in who you wish closed hands sales a filter neither team can act on with confidence.
- **A positive ICP without a negative ICP is half a filter.** Ship both, always — the negative ICP is what protects sales cycle time from accounts that look right but won't close or won't stay.
- **Score every account — don't tier by firmographics alone.** The scoring rubric in Step 5 exists because firmographic fit without an active trigger or intent signal is a list, not a priority order.
- **The situational trigger tells sales when to call, not just who to call.** An ICP that stops at firmographic and technographic dimensions hands sales a database, not a targeting system.
- **Re-validate every quarter.** An ICP is a snapshot of what worked last time. Treat it as perishable, not permanent.