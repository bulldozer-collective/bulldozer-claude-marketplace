---
name: |-
  market-category
description: |-
  Analyze market category dynamics — competitive forces, buyer maturity, category creation vs. entry, and positioning strategy. Triggers on 'category analysis,' 'market category,' 'category creation,' 'competitive landscape,' 'where does our product fit,' or 'blue ocean.' For market size quantification, see market-sizing. For competitor profiles, see competitor-profiling.
when-to-use: |-
  Analyze market category dynamics — competitive forces, buyer maturity, category creation vs. entry, and positioning strategy. Triggers on 'category analysis,' 'market category,' 'category creation,' 'competitive landscape,' 'where does our product fit,' or 'blue ocean.' For market size quantification, see market-sizing. For competitor profiles, see competitor-profiling.
argument-hint: |-
  AI-powered recruiting automation — analyze the category, competitive forces, and whether we should create a new category or compete in existing ones
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Category Analysis

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on market category analysis. Your goal is to help a company understand the category it operates in — or should operate in — so positioning, messaging, and GTM are grounded in market reality rather than internal assumptions.

## Input

`$ARGUMENTS` — product description and the category question (e.g., "AI-powered recruiting automation — analyze the category and whether we should create a new one or compete in existing ATS"). If not provided, read any available context files. Only ask if the product is completely absent.

## Output

A `category-analysis-{market}.md` file with: category definition, competitive forces analysis, buyer maturity assessment, category entry vs. creation decision, positioning recommendation, and category narrative. Includes a strategic recommendation on how to compete or define the category.

**Produce output on first invocation. Read available context before asking. Only ask if the product is completely absent.**

**When not to run this.** A category analysis is a big investment to hand back a verdict nobody asked a real question about. Skip or scope down when: the client already has a completed positioning-map and value-proposition analysis in Bulldozer OS that's converting fine and nobody has flagged the category story as broken — a fresh full pass is a solution looking for a problem, a quick check of those two analyses for drift is enough. Refuse to render a verdict on Part 4 (entry vs. creation) if Part 3 (buyer maturity) hasn't actually been assessed — a category-creation recommendation made without knowing whether buyers are unaware or already comparing vendors isn't strategy, it's a guess wearing a framework. And if the team has no standing content, PR, or analyst-relations capacity, say so up front rather than at the end of Part 4: it caps what's realistically on the table before you spend the client's time weighing an option they can't fund.

---

## Part 1: Category Definition

### What Is a Category?

A category is the mental shelf a buyer puts your product on when deciding whether to consider it. It defines:
- Who you're competing against (in the buyer's mind)
- What criteria they use to evaluate you
- What "good" looks like for them

**The single most important question**: When a buyer has the problem your product solves, what do they search for, what do they call it, and what alternatives do they consider?

### Category Map

Identify all the categories your product could live in, and for each:

| Category | Buyer's Search Terms | Typical Alternatives | Evaluation Criteria |
|----------|---------------------|---------------------|-------------------|
| [Category A] | [what they Google] | [competitors] | [what they measure] |
| [Category B] | | | |

**If competitors are already tracked for this client's project in Bulldozer OS, pull that list first instead of typing "Typical Alternatives" from memory.** For the gap on non-software alternatives, read `references/os-analyses-for-category.md` (section Competitor tracking).

**A category that doesn't say who it excludes isn't a category, it's a description.** For every row of the map, name at least one real buyer segment or use case this category definition deliberately doesn't chase — not as a caveat, as part of the definition. "Everyone with this problem" is not a category answer; it's the sign the exercise hasn't been done yet.

---

## Part 2: Competitive Forces Analysis

Use a structured framework to understand what makes the category hard or easy to compete in.

### Five Forces (adapted for SaaS)

| Force | Questions | Assessment |
|-------|-----------|-----------|
| **Existing rivals** | How many? How differentiated? How entrenched? | Strong / Moderate / Weak |
| **New entrants** | How easy is it to build a competing product? Are there funded entrants entering? | High / Medium / Low threat |
| **Substitutes** | What do buyers use instead — spreadsheets, agencies, doing nothing? | High / Medium / Low substitution risk |
| **Buyer power** | How price-sensitive are buyers? How easy is it for them to switch? | High / Medium / Low |
| **Supplier power** | What key inputs do you depend on (AI models, data providers)? | High / Medium / Low |

**If a competition-intensity analysis has completed for this client's project in Bulldozer OS, use it to score "Existing rivals" instead of an eyeball call.** For what it rates, the scale, and the async-job freshness rule, read `references/os-analyses-for-category.md` (section Competition-intensity).

**Don't score rivalry from a competitor's own homepage copy.** A competitor's stated positioning is marketing, not evidence of how entrenched they actually are — that's the same "analyse concurrentielle recopiée du site concurrent" a rushed pass falls back on when it skips the OS data above. Ground the assessment in the channel scores, tracked review signals, and win/loss or sales-call notes instead.

### Category Structure

| Structure | Characteristics | Implication |
|-----------|----------------|-------------|
| **Fragmented** | Many vendors, no dominant player, low switching costs | First-mover advantage through distribution, not product |
| **Consolidated** | 1–3 dominant players, high switching costs | Need a wedge strategy — don't compete head-on |
| **Emerging** | Category not yet defined, buyers solving problem with hacks | Category creation opportunity |
| **Declining** | Market contracting, buyers moving to alternatives | Avoid unless you have a specific wedge into the survivors |

**Bulldozer OS can ground the Fragmented/Consolidated read instead of leaving it to judgment** — an offer-structure analysis returns a verdict, a share estimate, and named competitors, though never "Emerging" vs. "Declining." Several fields come back as `{value, override, overridden}` — **read the correction, not the AI draft, when one exists.** Full mechanics: `references/os-analyses-for-category.md` (section Offer-structure).

---

## Part 3: Buyer Maturity Assessment

How sophisticated are buyers in this category?

| Maturity Level | Characteristics | Your Implication |
|---------------|----------------|-----------------|
| **Unaware** | Don't know the problem exists | Lead with education, not product |
| **Problem-aware** | Know the problem, not that software solves it | Lead with "there's a better way" |
| **Solution-aware** | Know software solutions exist, evaluating | Lead with differentiation |
| **Product-aware** | Know your product and competitors | Lead with proof and specifics |
| **Most aware** | Ready to buy, just need the offer | Lead with pricing and CTA |

Most B2B categories have a mix. Identify where your ICP sits and calibrate messaging accordingly.

---

## Part 4: Category Entry vs. Category Creation

**Default to entry. Category creation is the exception you have to earn, not a free upgrade from "we're different."** Inventing a category to dodge a hard head-to-head comparison costs more than winning inside an existing one, and almost no team actually has the budget and runway to pay that cost — this is the single most common misuse of this framework, and the right answer in most sessions is to talk the client out of it, not to build them a category-creation playbook.

**The gating question, in order, before recommending creation:**
1. **Is positioning even clean yet?** If reps don't already repeat the same story unprompted and the site still reads like a generic entry in an existing category, the real gap is positioning clarity, not a missing category — fix that first, and the category question may resolve itself once it's fixed. (Practitioner convergence on this sequencing — position first, category ambition second — points back to April Dunford's own framing; not confirmed by direct reading, treat the sequencing principle as solid and any specific cost/timeline figure attached to it as illustrative, not audited.)
2. **What does Part 3 say about buyer maturity?** Category creation only makes sense when a real share of buyers sit at Unaware or Problem-aware — you're selling them a new frame *because* no existing one fits their situation. If Part 3 shows a Solution-aware or Product-aware buyer base, they already have a mental shelf for this problem; creating a new one is optional marketing risk, not a requirement, and entry is almost always the better bet.
3. **Could a rival plausibly claim the same category name next quarter?** If the "new category" is a positioning phrase rather than a real combination of things that didn't exist together before, it isn't defensible — a competitor copies the label in a press release and you've spent the education budget on their behalf.
4. **Does the team have the standing capacity to run this for years, not months?** — dedicated content and analyst-relations effort sustained well past the first launch push, not a single campaign. Recommending creation to a team that can't keep feeding the narrative below is the same mistake as any other resourcing plan sized to a wish instead of a headcount.

Only recommend creation when all four hold. When even one doesn't, say so plainly and route the client to the sharpest possible entry position instead — a well-fought entry beats an underfunded category attempt every time.

### Category Entry (compete in existing category)

**Best when:**
- Category is established, buyers search for it
- You have clear differentiation vs. incumbents
- You can win on a specific segment the incumbent ignores

**Before checking that second box, run the table-stakes test.** A capability every named incumbent could also claim isn't differentiation — it's the price of entry into the category, something a buyer expects from anyone on the shortlist. (Practitioner test attributed to April Dunford's positioning method, not a verified quote.) If a rival could honestly write the same sentence about themselves, move it into Category Definition's evaluation criteria instead of counting it here.

**Risk**: Being compared on incumbent's terms. You're always playing catch-up on awareness.

**Strategy**: Pick a narrow beachhead segment where you win clearly, then expand. Don't try to win the whole category on day one.

### Category Creation (define a new category)

Best when the problem exists but buyers don't know there's a category for it, you're combining things that haven't been combined before, or existing categories frame the problem wrong — expensive and slow, and most teams that reach for it lack the standing capacity to sustain it. For the full playbook, the famous examples, and the complete Decision Framework table scoring Entry vs. Creation question by question, read `references/category-creation-playbook.md`.

---

## Part 5: Category Narrative

Every winning category has a narrative — a story about why the world has changed and why the old way no longer works. Build yours around three elements:

### The Category Narrative Structure

**1. The World Has Changed**
What macro shift (technology, regulation, buyer behavior, economic pressure) makes the old solution inadequate?

**No real signal, no "the world has changed" claim — this is the most invented-sounding sentence in the whole document if it isn't grounded.** Before writing it, check for actual movement: a rising competition-intensity score or media-budget range on tracked rivals, a genuine hiring/growth signal on competitors or the category, or a real uptick in the project's demand-intensity read (its verdict, capture score, capturable-volume estimate, and note follow the same `{value, override, overridden}` shape as offer-structure and positioning-map above — read the override when one exists). If none of these show movement, the honest claim is narrower — the world hasn't changed yet, only this company's answer to it has — and the narrative should say that instead of manufacturing a trend.

**Real movement elsewhere in the market still isn't proof about this client.** A seed-stage company with a handful of customers can't carry "the category is heating up" as validation of its own narrative, even when tracked rivals are genuinely moving — that claim belongs to whoever has the scale to be cited as evidence of it. When the signal is real but the client isn't yet the proof, narrow the claim: the market may be shifting, but this company's role in that shift is still to be established, not assumed.

**2. The Old Way Fails**
What does the "before" state look like? What is the enemy behavior — not a competitor, a method or mindset?

**3. The New Way Wins**
What does success look like with your approach? What new outcomes are possible?

**Example structure:**
> "The way companies [do X] was designed for [old world condition]. But [macro shift] changed everything. Now [old approach] costs companies [specific pain]. [Category name] is the new way — [brief description of approach and outcome]."

---

## Positioning Recommendation

**If this client's project already has a completed value-proposition analysis, a completed market-perception analysis, and at least one tracked competitor in Bulldozer OS, a positioning-map analysis can plot the whitespace directly** — use it as the starting map instead of filling the axes from a blank table. For the three prerequisites, the fallback when a run is missing or errored, and the same read-the-override rule applied three times per axis, read `references/os-analyses-for-category.md` (section Positioning-map).

Based on the analysis, choose one of these positions:

| Position | When to Use | Risk |
|----------|-------------|------|
| **Category leader** | You're #1 or #2 in an established category | Must maintain the lead |
| **Challenger** | Clear #2 with a specific angle on the leader | Leader can copy your angle |
| **Niche specialist** | Win a narrow segment the leader ignores | Growth ceiling |
| **Category creator** | You're defining a new way | Expensive, slow |
| **Disruptor** | Attack from below with a simpler/cheaper approach | Leader's reaction risk |

For each position, specify:
- What you lead with in messaging
- Who you target first (beachhead segment)
- What you avoid saying (what would undermine the position)
- **Who you're telling no** — name a real segment or use case this position deliberately gives up, not a hedge. A recommendation that reads well for every buyer at once hasn't actually chosen a position; the quickest way to check a positioning draft is to ask who reads it and correctly concludes "not for me" — if no one does, it's not done.
- **Is this claim checkable?** State the position's central promise in a form the client's own buyer could confirm or contradict against their experience, not a feeling. "Category leader" isn't checkable; "the only vendor with case studies from three of the named challenger's own lost deals" is.