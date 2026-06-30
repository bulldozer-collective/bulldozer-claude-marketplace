---
name: |
  market-category
description: |
  Analyze market category dynamics — competitive forces, buyer maturity, category creation vs. entry, and positioning strategy. Triggers on 'category analysis,' 'market category,' 'category creation,' 'competitive landscape,' 'where does our product fit,' or 'blue ocean.' For market size quantification, see market-sizing. For competitor profiles, see competitor-profiling.
when-to-use: |
  Analyze market category dynamics — competitive forces, buyer maturity, category creation vs. entry, and positioning strategy. Triggers on 'category analysis,' 'market category,' 'category creation,' 'competitive landscape,' 'where does our product fit,' or 'blue ocean.' For market size quantification, see market-sizing. For competitor profiles, see competitor-profiling.
argument-hint: |
  AI-powered recruiting automation — analyze the category, competitive forces, and whether we should create a new category or compete in existing ones
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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

### Category Structure

| Structure | Characteristics | Implication |
|-----------|----------------|-------------|
| **Fragmented** | Many vendors, no dominant player, low switching costs | First-mover advantage through distribution, not product |
| **Consolidated** | 1–3 dominant players, high switching costs | Need a wedge strategy — don't compete head-on |
| **Emerging** | Category not yet defined, buyers solving problem with hacks | Category creation opportunity |
| **Declining** | Market contracting, buyers moving to alternatives | Avoid unless you have a specific wedge into the survivors |

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

### Category Entry (compete in existing category)

**Best when:**
- Category is established, buyers search for it
- You have clear differentiation vs. incumbents
- You can win on a specific segment the incumbent ignores

**Risk**: Being compared on incumbent's terms. You're always playing catch-up on awareness.

**Strategy**: Pick a narrow beachhead segment where you win clearly, then expand. Don't try to win the whole category on day one.

### Category Creation (define a new category)

**Best when:**
- The problem exists but buyers don't know there's a product category for it
- You're combining things that haven't been combined before
- The existing categories frame the problem in the wrong way

**Risk**: Category creation is expensive. Buyers need to be educated before they can evaluate you. Can take 3–5 years.

**Famous examples**: Salesforce ("CRM" didn't exist as a concept), Slack ("team messaging" was new), HubSpot ("inbound marketing" was invented to describe a category).

**Category creation playbook:**
1. Name the category (a new name buyers can latch onto)
2. Describe the enemy (the old way of doing things — not a competitor, a behavior)
3. Define the category criteria so you win by them
4. Invite others to participate (paradoxically, competitor-alternatives validate the category)
5. Own the category narrative through content, events, and research

### Decision Framework

| Question | Entry | Creation |
|----------|-------|----------|
| Buyers already searching for a solution? | Yes | No |
| Market >$500M in established vendors? | Yes | No |
| Your differentiation fits existing evaluation criteria? | Yes | No |
| You have 3–5 years and capital to build a category? | No | Yes |
| You're combining things nobody has combined before? | No | Yes |

---

## Part 5: Category Narrative

Every winning category has a narrative — a story about why the world has changed and why the old way no longer works. Build yours around three elements:

### The Category Narrative Structure

**1. The World Has Changed**
What macro shift (technology, regulation, buyer behavior, economic pressure) makes the old solution inadequate?

**2. The Old Way Fails**
What does the "before" state look like? What is the enemy behavior — not a competitor, a method or mindset?

**3. The New Way Wins**
What does success look like with your approach? What new outcomes are possible?

**Example structure:**
> "The way companies [do X] was designed for [old world condition]. But [macro shift] changed everything. Now [old approach] costs companies [specific pain]. [Category name] is the new way — [brief description of approach and outcome]."

---

## Positioning Recommendation

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