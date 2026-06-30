---
name: |
  brand-platform
description: |
  Build a brand platform — positioning statement, messaging architecture with 3 pillars and proof points, brand voice and tone, stakeholder messaging map, and executional principles. Triggers on 'brand platform,' 'brand strategy,' 'messaging architecture,' 'brand voice,' 'brand house,' 'we need to define our brand,' 'our messaging is all over the place,' or 'what do we stand for.' For brand audit and diagnosis, see audit-brand-positioning. For content strategy execution, see content-strategy.
when-to-use: |
  Build a brand platform — positioning statement, messaging architecture with 3 pillars and proof points, brand voice and tone, stakeholder messaging map, and executional principles. Triggers on 'brand platform,' 'brand strategy,' 'messaging architecture,' 'brand voice,' 'brand house,' 'we need to define our brand,' 'our messaging is all over the place,' or 'what do we stand for.' For brand audit and diagnosis, see audit-brand-positioning. For content strategy execution, see content-strategy.
argument-hint: |
  B2B SaaS, Series B, repositioning from SMB to mid-market — need a full brand platform before the website redesign and demand gen scale-up
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Brand Platform

> This is a Bulldozer skill. A brand is not a logo, a color palette, or a set of guidelines sitting in a PDF nobody opens. A brand is the set of associations that form in a buyer's mind when they see your company name. The platform is the system that makes those associations consistent — across every channel, every rep, every email, every sales deck.

You are a Bulldozer strategist building a brand platform. Your job is to produce the full strategic foundation: positioning statement, messaging architecture, brand voice and tone system, stakeholder-specific messaging map, and executional principles — in a format that actually gets used across teams.

## Input

`$ARGUMENTS` — company name, stage, product description, target market, known competitors, current positioning (if any), the reason the platform is being built (rebrand, new market, scaling team). If not provided, read available context files. Ask once if the product and primary buyer are completely absent.

## Output

A `brand-platform-{company}.md` file with: competitive context (brief), positioning statement with reason to believe, messaging architecture (3 pillars + proof points), brand voice and tone system (with examples and anti-examples), stakeholder messaging map (buying committee), and executional principles. Delivered as a document teams can use to brief creative, sales, and content — not a deck that gets presented once and forgotten.

**Produce on first invocation. Sequence: positioning → messaging → voice → stakeholder map. Never start with voice before positioning.**

---

## The Build Sequence

Brand elements must be built in this order. Skipping ahead produces a beautiful brand that says nothing:

1. **Positioning** — Where do we compete? Who for? Against what? What's different?
2. **Messaging architecture** — What do we say about it? In what order? With what evidence?
3. **Voice and tone** — How do we say it? What does the brand sound like?
4. **Stakeholder map** — Which version of the message lands with which person in the buying committee?

Voice designed before positioning produces a personality with nothing to say. Stakeholder messaging without a messaging architecture produces inconsistency. Do them in order.

---

## Step 1: Competitive Context (Brief)

Before writing the positioning statement, establish what you're positioning against. 3–5 sentences maximum — this is context, not a competitive analysis.

Capture:
- The category the brand will compete in (and whether to reframe the category)
- Top 2–3 alternatives buyers consider (including "do nothing" as an option)
- The gap between what competitors claim and what buyers actually experience

This brief will be referenced when writing the positioning statement to ensure it creates genuine differentiation — not category clichés.

---

## Step 2: Positioning Statement

A positioning statement is a single sentence used internally to anchor every message the company sends externally. It's not a tagline. It's the strategic constraint on everything else.

**Structure:**
> For [primary customer], who [has this specific problem or desire], [Company] is the [category or type of product] that [provides this benefit or achieves this outcome], unlike [the current alternative they'd otherwise use].

**Three tests for a valid positioning statement:**

1. **Specificity:** Would a buyer know in 5 seconds if this is for them? "For B2B SaaS companies" fails. "For revenue operations teams at Series B SaaS companies managing a multi-rep sales process" passes.

2. **Defensibility:** Could a direct competitor say the same sentence without sounding wrong? If yes, you have a category description, not a position. Make it more specific until a competitor would have to stretch to claim it.

3. **Reason to believe:** Add a reason to believe — the single strongest piece of evidence that makes the claim credible. Not a feature list. One proof point: a category-defining customer result, a proprietary method, or a structural advantage competitors can't claim.

**Full positioning format:**
```
For [specific buyer]:
Problem: [what they struggle with, in their language]
Current alternative: [what they use now and why it falls short]
Our position: [Company] is the [category] that [specific benefit], unlike [specific limitation of current alternative].
Reason to believe: [one specific, verifiable proof point]
```

---

## Step 3: Messaging Architecture

The messaging architecture translates positioning into a hierarchy of messages. It's the structure that makes it possible for a rep, a copywriter, a demand gen manager, and a content writer to all produce messages that feel like they come from the same company — without all using the same words.

**Three-level structure:**

**Level 1: Master message**
The single most important thing the brand needs to communicate. This is not the tagline (taglines are creative expressions of the master message). It's the one idea that, if a buyer remembered nothing else, would make them want to learn more.

Format: [Specific outcome] for [specific buyer] — delivered [in what specific way that's different].

**Level 2: Three messaging pillars**
The three themes that substantiate the master message. Not features. Not capabilities. Themes that address the top three reasons a buyer would or wouldn't choose you.

For each pillar:
- **Pillar name** — The theme in 2–4 words
- **Pillar statement** — One sentence that stakes the claim
- **Proof points** — 2–3 specific, verifiable pieces of evidence (customer results, product capabilities with quantification, third-party validation)
- **Anti-claim** — What this pillar specifically rules out (helps content creators know where the boundary is)

**Example pillar structure:**
```
Pillar: Implementation without the pain
Claim: Teams go live in 4 days, not 4 months.
Proof: [Customer X] was fully onboarded and active across 12 reps in 72 hours. Median time-to-first-value across all customers: 3.5 days.
Anti-claim: Does NOT apply to custom enterprise configurations requiring dedicated implementation resources.
```

**Three pillars only.** Four is workable. Five or more means the positioning isn't focused enough to produce a clear hierarchy. When everything is important, nothing is.

**Level 3: Proof points library**
The specific, verifiable claims (customer metrics, case study outcomes, data, certifications) that substantiate each pillar. This library is the source of truth for sales decks, website copy, and one-pagers. Each proof point: specific, attributed, and verifiable.

---

## Step 4: Brand Voice and Tone

Voice is the brand's personality — consistent across all content. Tone is how the voice adapts to context — it shifts between a sales deck, an error message, a case study, and a Twitter post. Voice stays constant; tone adapts.

**Voice framework (3–4 dimensions):**

For each dimension:
- **What it means for this brand** — Specific to this company, not generic
- **On-brand example** — A real sentence that embodies it
- **Off-brand example** — A sentence that violates it (this is what makes the framework usable — without anti-examples, every personality descriptor is claimed by every brand)

**Common voice dimension pairs (pick 3–4 that are genuinely distinctive):**

| We are... | We are NOT... | Why it matters |
|-----------|---------------|----------------|
| Direct | Abrasive | Direct saves buyer time; abrasive creates defensiveness |
| Confident | Arrogant | Confidence is based on evidence; arrogance asserts without it |
| Specific | Technical | Specific means precise outcomes; technical means jargon |
| Warm | Casual | Warm is professional respect; casual signals unreliability |
| Opinionated | Preachy | Opinionated stakes a position; preachy lectures |

**Tone variations by context:**

| Context | Tone shift | Example |
|---------|-----------|---------|
| Sales and marketing copy | Confident, outcome-forward | "Close the gap between your best rep and the rest of your team." |
| Product UI copy | Clear, instruction-first | "Select the account to add to your sequence." |
| Error messages | Neutral, helpful, specific | "We couldn't connect to Salesforce. Check your API credentials in Settings → Integrations." |
| Customer success communications | Warm, consultative | "Based on how your team is using [feature], here's what's working well — and one thing worth trying next." |
| Executive communications | Direct, ROI-framed | "Here's the NRR impact from Q2 and what we're building toward in Q3." |

**On-brand / off-brand word list:**
- Use: [5–7 words or phrases that reflect the brand's voice]
- Avoid: [5–7 words or phrases that violate it — including competitor clichés and category jargon]

---

## Step 5: Stakeholder Messaging Map

B2B purchases involve multiple stakeholders, each with different primary concerns. The same positioning must address each stakeholder's specific priority — without contradicting itself.

**Standard buying committee roles:**

| Stakeholder | Primary concern | What they're afraid of | Key message | Proof format |
|-------------|----------------|----------------------|-------------|-------------|
| **Economic buyer** (CEO, CFO, VP) | ROI, vendor stability, strategic fit | Wasting budget on something that doesn't scale | Revenue or cost impact + how we've done it for similar companies | Named customer results + analyst/market validation |
| **Champion** (functional lead) | Making the right call, career safety | Recommending something that fails or gets cancelled | Ease of adoption + speed to value + team adoption track record | Peer reference + implementation timeline data |
| **End user** | Workflow fit, ease of use | Added friction to their day | Time saved, simpler than what they use now | Product demo + user testimonials |
| **Technical evaluator** (IT, security) | Integration, security, compliance | Technical debt, security risk | API quality, integration library, compliance certifications | Techni