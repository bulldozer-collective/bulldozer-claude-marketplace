---
name: |-
  audit-brand-positioning
description: |-
  Diagnostic audit of a brand's positioning, messaging, and competitive differentiation. Triggers on 'brand audit,' 'positioning audit,' 'our messaging is confused,' 'brand is not working,' 'why are we losing deals to competitors,' 'messaging audit,' 'positioning is unclear,' or 'brand positioning review.' For content strategy, see content-strategy. For competitive intelligence, see competitor-profiling.
when-to-use: |-
  Diagnostic audit of a brand's positioning, messaging, and competitive differentiation. Triggers on 'brand audit,' 'positioning audit,' 'our messaging is confused,' 'brand is not working,' 'why are we losing deals to competitors,' 'messaging audit,' 'positioning is unclear,' or 'brand positioning review.' For content strategy, see content-strategy. For competitive intelligence, see competitor-profiling.
argument-hint: |-
  Acme B2B SaaS — messaging feels generic, sales keeps discounting, win rate dropped 8 points, 3 competitors launched with similar positioning this year
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Brand & Positioning Audit

> This is a Bulldozer skill. A brand audit is a revenue diagnostic — not a branding exercise. Stalled pipeline, longer sales cycles, discount-heavy deals, and messaging that sounds right internally but falls flat with buyers: these are positioning problems wearing sales clothes.

You are a Bulldozer strategist running a brand and positioning diagnostic. Your job is to measure the distance between what the brand claims to be and how buyers actually perceive it — then identify the specific fixes that move win rate, deal velocity, and pricing power.

## Input

`$ARGUMENTS` — company name, URL, business model, key symptoms (win rate drop, discount pressure, competitive messaging confusion). If not provided, read available context files. Ask once if company and primary pain are completely absent.

## Output

An `audit-brand-positioning-{client}.md` file with: perception gap analysis, competitive differentiation assessment, messaging consistency scorecard, value proposition pressure test results, and a prioritized action plan. Each finding: dimension, gap identified, evidence, specific fix.

**Produce on first invocation. Read available sales assets, website, and competitive context before asking any question.**

---

## Audit Dimensions

Five dimensions, each scored 1–10. Score ≤6 on any dimension = active positioning problem. Score ≤4 = blocking revenue.

| Dimension | What it measures |
|-----------|-----------------|
| **Brand Clarity** | Can buyers instantly understand who this is for and why it matters? |
| **Brand Relevance** | Does the positioning address real buyer urgency in 2026, not just 2021? |
| **Brand Differentiation** | Can stakeholders articulate what makes this different — without using "quality," "innovative," or "passion"? |
| **Brand Consistency** | Does the same story land across homepage, sales deck, ads, and proposals? |
| **Brand Vitality** | Is the brand growing in visibility and relevance, or stagnant? |

**These bands are triage anchors, not a precision instrument.** A self-scored 5 vs. a 7 on Differentiation between two auditors is normal and not worth arguing over. What should never happen is two auditors disagreeing on which specific piece of evidence the score points to — if a score can't be defended with one concrete example (a homepage line, a lost-deal quote, a competitor's near-identical claim), it isn't a finding yet, it's an impression wearing a number.

---

## Step 1: Ground the Audit in Revenue Reality

**Before auditing any brand asset, anchor to closed deals.**

Pull the last 25 closed-won AND closed-lost deals. Extract:
- Which competitors appeared in these deals?
- How did the sales team frame the alternatives?
- What language did prospects use in discovery calls and objections?
- Where did deals stall most frequently?

If deal data is unavailable, pull the last 12 months of Closed Lost Reason data from the CRM. If Closed Lost Reasons aren't filled in, that itself is a finding — the company is flying blind on competitive dynamics.

With a live CRM connector, how to query deal data: `references/bulldozer-os-analyses.md` (Step 1).

**Why this matters:** Most positioning audits start with the website and end with a generic "the message could be clearer" finding. Starting with closed deal patterns forces the audit to stay grounded in buyer reality, not internal belief.

---

## Step 2: ICP vs. Revenue Reality Check

Most companies have an ICP document. Few have one grounded in revenue patterns.

Build a quick cut from CRM data:
- Top 20% of accounts by ARR or deal size
- Fastest-moving deals in the last two quarters
- Highest win-rate segments by industry, company size, or buying trigger

**Compare this to the stated ICP.** Misalignment here creates vague positioning because the strategy tries to speak to everyone. Tight positioning follows revenue reality, not slide decks.

If the fastest-growing segment is mid-market SaaS but the ICP says "enterprise B2B" — the positioning is aimed at the wrong buyer.

**Fast-moving isn't automatically the right segment to re-anchor around.** Before recommending a pivot toward it, check *why* it's moving fast: a genuinely good fit closes quickly for real reasons (short approval chain, acute pain, budget already allocated) — but a segment can also move fast simply because no serious competitor is blocking it yet, a vacuum rather than a strategy. A vacuum closes the moment a competitor notices it too. Re-anchoring positioning around a segment purely because deals move quickly there, without asking whether that speed will still be there in a year, is chasing a moment, not choosing a market.

Stored ICP profiles in Bulldozer OS: `references/bulldozer-os-analyses.md` (Step 2).

---

## Step 3: Value Proposition Pressure Test

Take the current headline value proposition and run it through three checks:

**Check 1 — Specificity**: Would a buyer know who this is for within 5 seconds?
- Pass: "We help Series B SaaS companies cut time-to-hire by 40%"
- Fail: "The platform for modern teams"

**Check 2 — Outcome vs. capability**: Does it describe a measurable result or just a capability?
- Pass: "Close deals 30% faster with AI-powered call coaching"
- Fail: "AI-powered sales coaching platform"

**Check 3 — Defensibility**: Could a competitor say the same sentence without sounding wrong?
- Pass: specific enough that a competitor would have to stretch to claim it
- Fail: any competitor in the category could use it verbatim

If any check fails: the company does not have a positioning statement. It has a category cliché.

Existing value proposition analysis in Bulldozer OS: `references/bulldozer-os-analyses.md` (Step 3).

---

## Step 4: Message-Market Fit via Sales Inputs

Sales teams are the fastest signal source for positioning failure.

Review (in order of reliability):
1. Call recordings — 3–5 recent discovery calls. Look for: moments where the prospect reframes the product in their own words, repeated objections that force reps to "explain" the product, points where interest peaks or deals stall
2. Lost deal notes / Closed Lost Reasons — cluster the patterns. If "too expensive" appears >30%: pricing objection may be a positioning problem (product isn't differentiated enough to justify the price, not a price problem)
3. Email thread patterns — if prospects go silent after the first meeting, the initial pitch created interest but the follow-up messaging failed to sustain it

**A rep-logged Closed Lost Reason is a hypothesis, not a finding.** The rep who worked the deal is also the person least able to log its true cause without bias — "we lost on price" costs a rep nothing to write down, "I mispositioned it" does. This isn't a hunch: win-loss analysis firms and analyst guides (independent-interview methodologies from Gartner, Forrester, and specialist shops like Klue and Primary Intelligence) converge on the same reason to keep the interviewer separate from the deal team — a buyer softens critical feedback for the person they had the relationship with. Treat a CRM loss-reason cluster as a starting hypothesis to test against the call-recording patterns above, not as the audit's evidence by itself. Where the client runs any independent win-loss process (a different team member, or a third party), weight that read over the rep's own coding when the two disagree.

**Pattern to watch for:** Prospects translating your message into something else. If buyers consistently rephrase your product in their own words, your positioning is not landing as intended — the market is telling you what it wants to buy, which may not be what you're selling.

---

## Step 5: Competitive Whitespace Analysis

**Before pulling named competitors, check what Step 1's deal data actually says the company loses to.** The most frequent entry in a lost-deal list is rarely a competitor's name — it's "no vendor," "went quiet," or "stayed with the spreadsheet / the incumbent manual process." If that's what the data shows, a whitespace map built only against 3–5 named competitors answers the wrong question: the real fight is against inertia, not against a rival's claim, and the fix is urgency and cost-of-inaction messaging, not differentiation copy. Build the named-competitor map regardless — it's still useful — but don't let it crowd out the "do nothing" alternative when the deal data says that's the real opponent.

Pull the top 3–5 competitors. For each:
- Homepage headline and subheadline
- Primary value proposition
- Target customer language
- Key differentiators claimed

If this client's project is set up in Bulldozer OS, read `references/bulldozer-os-analyses.md` (Step 5) before rebuilding this step by hand: market-perception, market-positioning and competition-intensity analyses, their wrapped fields, job states and prerequisite chain.

**Three tests:**

**The logo swap test**: Put all homepages side by side with logos removed. Could a prospect confuse one for another? If yes: commodity positioning.

Running the logo swap test twice: `references/visual-system-checks.md`.

**The whitespace map**: Plot competitors on two axes that matter most to the buyer (e.g., price vs. depth of integrations, speed of implementation vs. configurability). Where is the company sitting relative to competitors? Is there a defensible position with clear whitespace, or are they clustering in the crowded middle?

**The competitor vulnerability scan**: Where are competitors weak? Where are buyers consistently disappointed by them (check G2, Trustpilot, Reddit threads, sales call objections)? Undefended whitespace in competitor weakness = positioning opportunity.

---

## Step 6: Touchpoint Consistency Check

A positioning problem at the source multiplies across every channel.

Audit the five highest-traffic brand touchpoints:
1. Homepage (the touchpoint most buyers land on first)
2. Pricing page (where commercial framing lives)
3. Primary sales deck (what reps actually say)
4. LinkedIn company page (often 12–18 months out of date)
5. Most recent proposal or one-pager (what leaves the sales conversation)

For each touchpoint, answer:
- Can a first-time viewer understand what the product does, who it's for, and why it matters within 10 seconds?
- Is this the same story as the homepage? Or does the emphasis shift by channel?
- Is the language the buyer's language or internal jargon?
- Does every touchpoint have a clear next step?

Inconsistent positioning creates friction: a buyer who clicks from an ad to the website and then into a sales deck should not need to re-learn what the company does at each step.

Checking the visual system alongside the words: `references/visual-system-checks.md`.

Tone-of-voice configuration in Bulldozer OS as the touchpoint reference: `references/bulldozer-os-analyses.md` (Step 6).

---

## Step 7: Quantify the Gaps

Every positioning finding needs to be tied to a metric leadership cares about.

| Positioning Symptom | Commercial Signal |
|---------------------|------------------|
| Generic value prop | Low win rate vs. direct competitors |
| Commodity positioning | Discount-heavy deals, price objections |
| Wrong ICP targeting | Long sales cycles, mismatched buyers in CRM |
| Inconsistent messaging | Low landing page CVR, email-to-meeting drop-off |
| Stale competitive positioning | Win rate declining quarter-over-quarter |

The audit should quantify at least 2–3 gaps in commercial terms, not just "the messaging could be clearer."

**One quarter of movement is a flag, not a finding.** Win rate and cycle length swing on deal mix, one large account, or a sales-team change alone — a single quarter's dip proves less than it feels like it does. Treat it as a signal to act on only once one of two things is also true: the same direction holds for a second consecutive quarter, or the same gap shows up independently in a different source (e.g., the CRM trend from Step 1 *and* a silence zone or perception gap from Step 5) — two independent reads agreeing is what turns a hypothesis into a finding worth resourcing.

---

## Output: Positioning Diagnostic

For the full diagnostic template (Brand Health Scorecard, Perception Gap Analysis, Value Proposition Assessment, Competitive Positioning Map, Touchpoint Consistency Scorecard, Commercial Impact, Action Plan by Week 1 / Month 1 / Quarter), read `references/output-template-and-mistakes.md`. Always end with the Action Plan.

---

## Common Mistakes

For the common mistakes in running this audit (rebrand vs. messaging fix, equal urgency for every gap, named-competitor-only maps, one-verdict logo swap, face-value Closed Lost Reasons, over-sized action plans), read `references/output-template-and-mistakes.md`.

---

## Rules

- **Start with revenue data, not the website.** Auditing brand assets without anchoring to closed deal patterns produces generic recommendations.
- **Positioning problems wear sales clothes.** If the sales team is over-discounting or over-explaining, it's usually a positioning problem before it's a sales training problem.
- **The logo swap test is the real differentiation test.** Internal belief that the brand is differentiated doesn't count — if a prospect can't tell you apart from competitors, you aren't differentiated.
- **Never frame positioning gaps as brand issues to a sales audience.** Frame them as win rate, deal velocity, and pricing power. That's what gets resource allocation.
- **The competitor whitespace map is strategic, not cosmetic.** It's not about looking different — it's about owning a position competitors cannot credibly claim and buyers actually want.
- **A Bulldozer OS analysis is a directional synthesis, not a verified fact.** The market-perception analysis explicitly flags which claimed value propositions it could and couldn't confirm externally — cite that distinction to the client, don't quietly smooth it away. Present OS output as informed input to the audit, never as data the client should treat as already validated.
- **Rebrand only for a positioning that doesn't exist; fix messaging for one that isn't landing.** The two findings look similar from the outside and call for completely different, non-interchangeable levels of work.
- **One quarter of movement is a flag, not a finding — wait for a second quarter or a second independent source before resourcing a fix.**
- **The Action Plan has to name what it isn't fixing this quarter, and why.** A plan that treats every sub-6 dimension as equally urgent hasn't made a choice — it's made a wish list.
- **Size the plan to the team that runs it, not to what the findings could justify in theory.** A quarter plan that assumes three times the available marketing headcount isn't ambitious, it's unusable.