---
name: |
  product-marketing
description: |
  Create or update the product marketing context document — positioning, ICP, messaging, and differentiation. Triggers on 'product context,' 'marketing context,' 'positioning,' 'who is my target audience,' 'ideal customer profile,' 'ICP,' or 'describe my product.' Run this first — all other skills reference this context.
when-to-use: |
  Create or update the product marketing context document — positioning, ICP, messaging, and differentiation. Triggers on 'product context,' 'marketing context,' 'positioning,' 'who is my target audience,' 'ideal customer profile,' 'ICP,' or 'describe my product.' Run this first — all other skills reference this context.
argument-hint: |
  B2B SaaS for ops teams — help me capture positioning, ICP, and key messaging
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Product Marketing Context

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You help create and maintain a product marketing context document — the foundational positioning and messaging that all other marketing skills reference. Run this first so you don't repeat context in every other skill invocation.

## Input

`$ARGUMENTS` — product description or update request (e.g., "B2B SaaS for ops teams — build the full context doc" or "update the ICP section"). If not provided, check for existing context files and offer to auto-draft from codebase or walk through sections.

## Output

A `product-marketing.md` file (or `.agents/product-marketing.md` if in a code repo) with all sections completed. Show the full document inline, then save it.

**On first invocation: auto-draft from available codebase/context, then ask what needs correcting. Only start from scratch if there is nothing to read.**

---

## Workflow

### Step 1 — Check for Existing Context

Look for (in order): `.agents/product-marketing.md`, `.claude/product-marketing.md`, `product-marketing.md` in the project root.

- **If found**: Read it, summarize what's there, ask which sections to update. Only gather info for those sections.
- **If not found**: Offer two options:
  1. **Auto-draft from codebase** (recommended) — read README, landing pages, marketing copy, package.json, any docs. Draft a V1. Present it, ask what needs correcting.
  2. **Start from scratch** — walk through each section conversationally, one at a time.

Most users prefer option 1. After the draft: "What needs correcting? What's missing?"

---

## Sections to Capture

### 1. Product Overview

- One-liner (how the product is described in one sentence)
- What it does (2–3 sentences)
- Product category (how customers search for you — "project management tool" not "productivity platform")
- Product type (SaaS, marketplace, e-commerce, etc.)
- Business model and pricing

### 2. Target Audience

- Target company type (industry, size, stage)
- Target decision-makers (roles, departments)
- Primary use case (the main problem you solve)
- Jobs to be done (2–3 things customers "hire" you for)
- Specific use cases or scenarios

### 3. Personas (B2B)

For each stakeholder in the buying process (User, Champion, Decision Maker, Technical Influencer):
- What they care about
- Their challenge
- The value you promise them

### 4. Problems & Pain Points

- Core challenge customers face before finding you
- Why current solutions fall short
- What it costs them (time, money, missed opportunity)
- Emotional tension (stress, fear, doubt)

### 5. Competitive Landscape

- **Direct competitors**: Same solution, same problem
- **Secondary competitors**: Different solution, same problem
- **Indirect competitors**: Conflicting approach (spreadsheets, hiring, etc.)
- How each falls short for customers

### 6. Differentiation

- Key differentiators (capabilities alternatives lack)
- How you solve it differently
- Why customers choose you over alternatives

### 7. Objections & Anti-Personas

- Top 3 objections in sales and how to address them
- Who is NOT a good fit (anti-persona) — saves time for both sides

### 8. Switching Dynamics (JTBD Four Forces)

- **Push**: What frustrations drive them away from current solution
- **Pull**: What attracts them to you
- **Habit**: What keeps them stuck with current approach
- **Anxiety**: What worries them about switching

### 9. Customer Language

- How customers describe the problem (verbatim — not your paraphrase)
- How they describe your solution (verbatim)
- Words/phrases to use
- Words/phrases to avoid
- Glossary of product-specific terms

### 10. Brand Voice

- Tone (professional, casual, direct, warm)
- Communication style (conversational vs. authoritative)
- Brand personality (3–5 adjectives)

### 11. Proof Points

- Key metrics or results to cite
- Notable customers/logos
- Testimonial snippets
- Main value themes with evidence

### 12. Goals

- Primary business goal
- Key conversion action (what you want people to do)
- Current metrics (if known)

---

## Document Format

```markdown
# Product Marketing Context

*Last updated: [date]*

## Product Overview
**One-liner**: 
**What it does**: 
**Product category**: 
**Product type**: 
**Business model**: 

## Target Audience
**Target companies**: 
**Decision-makers**: 
**Primary use case**: 
**Jobs to be done**:
- 
**Use cases**:
- 

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|

## Problems & Pain Points
**Core problem**: 
**Why alternatives fall short**:
- 
**What it costs them**: 
**Emotional tension**: 

## Competitive Landscape
**Direct**: [Competitor] — falls short because...
**Secondary**: [Approach] — falls short because...
**Indirect**: [Alternative] — falls short because...

## Differentiation
**Key differentiators**:
- 
**How we do it differently**: 
**Why customers choose us**: 

## Objections
| Objection | Response |
|-----------|----------|

**Anti-persona**: 

## Switching Dynamics
**Push**: 
**Pull**: 
**Habit**: 
**Anxiety**: 

## Customer Language
**How they describe the problem**:
- "[verbatim]"
**How they describe us**:
- "[verbatim]"
**Words to use**: 
**Words to avoid**: 
**Glossary**:
| Term | Meaning |
|------|---------|

## Brand Voice
**Tone**: 
**Style**: 
**Personality**: 

## Proof Points
**Metrics**: 
**Customers**: 
**Testimonials**:
> "[quote]" — [who]
**Value themes**:
| Theme | Proof |
|-------|-------|

## Goals
**Business goal**: 
**Conversion action**: 
**Current metrics**: 
```

---

## Tips for Gathering Good Input

- **Push for specificity**: "What's the #1 frustration that brings them to you?" beats "What problem do you solve?"
- **Capture exact words**: Ask customers to describe the problem in their words. Those phrases go straight into copy.
- **Ask for examples**: "Can you give me an example?" unlocks better answers than abstract questions.
- **Skip what doesn't apply**: B2C products don't need the Personas section. Don't force it.
- **Revisit quarterly**: Markets shift. Positioning that was true 12 months ago may be stale.