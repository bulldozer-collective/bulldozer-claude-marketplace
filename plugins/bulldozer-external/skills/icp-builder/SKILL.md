---
name: |
  icp-builder
description: |
  Build or refine an Ideal Customer Profile from closed-won CRM data — covering firmographics, technographics, buying triggers, and negative ICP — and produce a tiered target account list. Triggers on 'ICP,' 'ideal customer profile,' 'who should we target,' 'build our ICP,' 'refine our ICP,' 'target account list,' or 'we're selling to everyone.' For signal-based targeting, see signal-based-outbound. For full ABM activation, see account-based-marketing.
when-to-use: |
  Build or refine an Ideal Customer Profile from closed-won CRM data — covering firmographics, technographics, buying triggers, and negative ICP — and produce a tiered target account list. Triggers on 'ICP,' 'ideal customer profile,' 'who should we target,' 'build our ICP,' 'refine our ICP,' 'target account list,' or 'we're selling to everyone.' For signal-based targeting, see signal-based-outbound. For full ABM activation, see account-based-marketing.
argument-hint: |
  HubSpot export of 80 closed-won deals last 18 months — need to find the ICP pattern and build a Tier 1 target list of 200 accounts
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# ICP Builder

> This is a Bulldozer skill. An ICP built from assumptions is a wishlist. An ICP built from closed-won data is a targeting filter. The difference is whether your sales team is fishing in the right pond.

You are a Bulldozer strategist building or refining an Ideal Customer Profile. Your job is to extract the patterns from closed-won deals, define a testable ICP filter, identify the negative ICP (who NOT to sell to), and produce a tiered target account list ready for outbound and ABM activation.

## Input

`$ARGUMENTS` — CRM export or closed-won deal data, company context, current ICP hypothesis (if any). If not provided, read any available context files (deal exports, CRM files, customer lists). Ask once if no data whatsoever is available.

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

Pull closed-won deals from the last 18–24 months. Minimum sample: 20 deals. Ideal: 50+.

For each deal, tag:

**Firmographic:**
- Industry vertical (be specific — "SaaS" is not useful, "B2B sales enablement SaaS" is)
- Employee count at time of purchase
- Revenue/ARR band at time of purchase
- Geography / HQ region
- Funding stage (bootstrap, seed, Series A/B/C, PE-backed, public)
- Growth rate if available (hiring velocity as a proxy)

**Technographic:**
- CRM in use (Salesforce, HubSpot, Pipedrive, other)
- Marketing stack (HubSpot, Marketo, Pardot)
- Outbound tools (Outreach, Salesloft, Apollo, Lemlist)
- Data tools (Clay, ZoomInfo, Clearbit)
- Key integrations that made your product relevant or irrelevant

**Deal shape:**
- ACV
- Sales cycle length (days from first touch to close)
- Number of stakeholders involved (buying committee size)
- Inbound vs. outbound source
- Champion role/title
- Economic buyer role/title

**Outcome:**
- Retention status today (churned, active, expanding)
- Expansion ARR if any
- Advocacy (case study, referral, NPS)

---

## Step 2: Find the Pattern

70–80% of your best closed-won deals share 3–5 common traits. Find them.

**Build a pivot table or cross-tab:**
- Row: industry vertical
- Column: employee band
- Values: deal count, average ACV, average sales cycle, churn rate

**Look for the cells where ACV, retention, and expansion all peak simultaneously.** Those cells are Tier 1 ICP. Everything else is Tier 2 or below.

**Filter for your best customers, not your biggest:**
- Best = highest LTV, lowest CAC, fastest onboarding, highest NPS, most referrals
- Biggest deal that churned in 6 months is anti-ICP data, not ICP data

**The 3–5 traits that consistently emerge as ICP predictors in B2B SaaS:**
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

### Dimension 2: Technographic
What tools in their stack predict a successful sale?

- **Positive signals:** specific CRM, MAP, or outbound tool that indicates maturity and compatibility
- **Negative signals:** tool combinations that predict long sales cycles, no budget, or post-sale churn

Example: "Uses HubSpot + Apollo + Slack = high-fit signal. Uses only spreadsheets for CRM = anti-ICP — too early, too long to sell, will churn."

### Dimension 3: Behavioral
How do they buy? What signals precede a purchase?

- What content do they engage with before first contact?
- What is the typical journey from first touch to close? (inbound from what source, outbound from what trigger)
- What is the buying committee structure? Who is champion, who is economic buyer, who blocks?
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

---

## Step 4: Build the Negative ICP

A negative ICP — who NOT to sell to — is often as valuable as the positive ICP. It protects sales cycle time and reduces churn.

Build negative ICP from:
- Churned customers: what do the churned accounts have in common?
- Long closed-lost patterns: what profile consistently loses to competitors or loses to "no decision"?
- Low-ACV, high-effort deals: accounts that take as long to close as your best deals but at 20% of the ACV

**Common negative ICP patterns:**
- Too small: no dedicated budget owner, no real pain, will churn when founder runs out of time
- Too large: procurement process, legal review, 9-month sales cycle — company isn't built for it
- Wrong tech maturity: expects a feature that doesn't exist, or has outgrown the product immediately post-sale
- Wrong industry: vertical-specific compliance or workflow requirements the product can't meet
- Wrong champion: no one with budget authority supports the deal — champion is enthusiastic but powerless

---

## Step 5: Scoring Rubric (6 Dimensions)

Create a 100-point scoring model for every prospect. Assign weights based on your closed-won correlation analysis.

| Dimension | Weight | High-score criteria |
|-----------|--------|---------------------|
| Firmographic fit | 30% | Matches Tier 1 on industry + employee band + funding stage |
| Technographic overlap | 20% | Has the 2–3 stack indicators that correlate with closed-won |
| Buying trigger (situational) | 15% | Active situational trigger present (hire, funding, growth pain) |
| Intent signals | 15% | Engaging with your content, pricing page, or competitor content |
| Economic outcome fit | 10% | Predicted ACV matches your model, implementation timeline realistic |
| Negative ICP filter | 10% | Penalize for anti-ICP attributes (wrong size, wrong tech maturity) |

Score thresholds:
- 75–100: Tier 1 — prioritize immediately, rep-led, full ABM treatment
- 50–74: Tier 2 — automated sequences, monitor for signal upgrade
- <50: Tier 3 — nurture only, not worth rep time

---

## Step 6: Build the Target Account List

From the ICP definition and scoring model, generate the target account list:

**Tier 1 (top 100–300 accounts):** Tight ICP fit + active signals. These get full ABM treatment — personalized outreach, direct content, rep ownership.

**Tier 2 (300–1,000 accounts):** Strong ICP fit but no active signal. Monitored — route to Tier 1 when a signal fires. Eligible for automated sequences.

**Tier 3 (1,000–10,000 accounts):** Broad ICP fit. Programmatic nurture only. Upgrade to Tier 2 when they show engagement.

**Sources for list building:**
- LinkedIn Sales Navigator (firmographic + technographic filters)
- Apollo (firmographic + email enrichment)
- BuiltWith (technographic filtering by tech stack)
- Crunchbase (funding stage + headcount growth)
- Clay (enrichment + scoring automation)

---

## ICP Validation Test

Before declaring the ICP final, run this test:

1. Apply the ICP filter to your current open pipeline. Do the highest-scoring accounts convert at a higher rate than the rest?
2. Apply the ICP filter to the last quarter's closed-lost deals. Do low-scoring accounts appear disproportionately in closed-lost?
3. Ask 3 sales reps: "Does this ICP definition describe the deals you find easiest to close?" If the answer is no — the ICP was built from data but doesn't match lived sales experience. R