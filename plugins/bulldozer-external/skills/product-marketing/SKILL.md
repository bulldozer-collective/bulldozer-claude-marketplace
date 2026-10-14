---
name: |-
  product-marketing
description: |-
  Create or update the product marketing context document — positioning, ICP, messaging, and differentiation. Triggers on 'product context,' 'marketing context,' 'positioning,' 'who is my target audience,' 'ideal customer profile,' 'ICP,' or 'describe my product.' Run this first — all other skills reference this context.
when-to-use: |-
  Create or update the product marketing context document — positioning, ICP, messaging, and differentiation. Triggers on 'product context,' 'marketing context,' 'positioning,' 'who is my target audience,' 'ideal customer profile,' 'ICP,' or 'describe my product.' Run this first — all other skills reference this context.
argument-hint: |-
  B2B SaaS for ops teams — help me capture positioning, ICP, and key messaging
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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
- **If not found**: Offer three options, in this order:
  1. **Pull from Bulldozer OS** (recommended when this client's project is set up there) — see "Grounding the draft in Bulldozer OS" below. It fills several sections from analyses the client may already have running, before you ask them anything.
  2. **Auto-draft from codebase** — read README, landing pages, marketing copy, package.json, any docs. Draft a V1. Present it, ask what needs correcting.
  3. **Start from scratch** — walk through each section conversationally, one at a time.

Most engagements have a Bulldozer project: start there, layer the codebase read on top for anything the OS doesn't cover, and only fall back to option 3 when neither has anything to read. After the draft: "What needs correcting? What's missing?"

### Grounding the draft in Bulldozer OS

For which sections Bulldozer OS can pre-fill (ICP profiles, value proposition analysis, market-positioning analysis, tone-of-voice configuration) and the caveats on using them, read `references/bulldozer-os-grounding.md` when the client's project is set up in Bulldozer OS.

---

## Sections to Capture

### 1. Product Overview

- One-liner (how the product is described in one sentence)
- What it does (2–3 sentences)
- Product category (how customers search for you — "project management tool" not "productivity platform")
- Product type (SaaS, marketplace, e-commerce, etc.)
- Business model and pricing

**Resist inventing a category to dodge comparison.** A brand-new category name feels like differentiation, but it's a multi-year, well-funded education bet that almost nobody in the room can actually afford — and it usually means the real work (a sharp answer to "what do I compare you against") hasn't been done yet. Default to the category customers already search for; only break from it if the client can name the budget and time horizon for teaching the market a new one.

### 2. Target Audience

- Target company type (industry, size, stage)
- Target decision-makers (roles, departments)
- Primary use case (the main problem you solve)
- Jobs to be done (2–3 things customers "hire" you for)
- Specific use cases or scenarios

**This section isn't done until it names who to say no to.** A target audience that never excludes anyone isn't a target, it's a wish list — the fastest check on a positioning draft is whether it names a segment worth actively declining, not just one worth pursuing. Pair this with Section 7's anti-persona rather than treating that as an optional footnote.

### 3. Personas (B2B)

For each stakeholder in the buying process — User, Champion, Economic Buyer, Technical Evaluator, and Procurement/Legal:
- What they care about
- Their challenge
- The value you promise them

Don't drop Procurement/Legal to save time. It rarely says yes, but on a deal of any size it can say no late, after everyone else already agreed — map what it will ask for (security review, contract terms, data handling) during discovery, not after the deal stalls.

Not every stakeholder earns the full three-part treatment, though. Write the full row for anyone who can independently say yes or no to the deal. For a role that only ever rubber-stamps what the Champion decided, one line is enough — filling out "what they care about / their challenge / the value we promise" for someone who never actually weighs in is a framework exercise, not intelligence a seller can use.

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

Don't let this section skip straight to named software vendors. The indirect row is usually the real competitor — a spreadsheet, an incumbent process, or doing nothing — and it's the one most drafts leave thin because it's less flattering to write about than a named rival. See "Grounding the draft in Bulldozer OS" above for what a market-positioning or offer-structure analysis can add here if one exists for this project.

**Don't read a competitor's G2 or Capterra page as evidence of what its customers actually think.** Those review pages are a solicited sample — vendors run campaigns to get reviews posted — not a spontaneous one. Treat them as a directional signal of how a competitor positions itself at best, never as a competitive fact to repeat to the client. And know which cross-site comparison is meaningless, versus merely no longer independent: Capterra, GetApp, and Software Advice have shared one Gartner-run review database for years, well before 2026 — a matching score across any two of these three was never two populations agreeing, at any point in time, because they're reading the same underlying reviews. G2 is the separate pool: it only joined the other three under one owner when it acquired all three from Gartner (announced January 2026, deal closed that following month), and has kept merging the two sides' infrastructure since — buyer-intent signals from all four brands already roll up into a single G2 profile as of mid-2026, and vendor guides report that since September 2026 my.G2 has moved toward one shared listings page with a submission flow that publishes across Capterra/GetApp/Software Advice together (reported alongside migration friction — vanished Capterra profiles, logins redirecting to G2 — a sign the merge is still mid-transition, not a direct read off an official page). What hasn't moved across five separate checks since January: the reader-facing review pools themselves still stay apart (a review posted on G2 doesn't appear on the trio, or vice versa). So a G2 score next to a Capterra, GetApp, or Software Advice score for the same competitor confirms the reach of one, increasingly unified, solicitation effort — not two populations agreeing. A customer interview or a recorded call that mentions the competitor unprompted is worth far more than a page of solicited stars, on any of these sites.

### 6. Differentiation

- Key differentiators (capabilities alternatives lack)
- How you solve it differently
- Why customers choose you over alternatives

**Push back on anything a customer can't verify.** "We're faster" or "we're easier to use" isn't a differentiator until it's a claim someone could confirm or contest — a number, a capability alternatives are on record as lacking, a workflow you can show in a demo. If a differentiator only survives as an adjective, it's not ready for this section yet; note it as a hypothesis to test, not a fact to publish.

**Run the table-stakes test before anything goes in this list.** A capability every competitor in Section 5 also has isn't a differentiator — it's the price of being considered at all (the distinction is central to April Dunford's positioning method, Obviously Awesome). The practical check: read the claim against the Competitive Landscape section above — if a direct competitor could put the same sentence on its own site without lying, move it to Product Overview as a category requirement and find what's actually different underneath it.

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

**Verbatim means verbatim — go find the actual words before asking someone to reconstruct them from memory.** If this client's project has recorded customer interviews stored in Bulldozer OS (Claap calls linked to the project workspace), check there first: pulling a real quote from a transcript beats asking a stakeholder to paraphrase what a customer probably said. Fall back to a live interview only when nothing recorded exists yet.

### 10. Brand Voice

- Tone (professional, casual, direct, warm)
- Communication style (conversational vs. authoritative)
- Brand personality (3–5 adjectives)

An adjective alone doesn't correct a draft — "write in a warm, direct tone" can't be checked against a paragraph any more than "write clearly and engagingly" can. Pair each tone word with one rule or example a writer could actually apply ("direct: lead with the recommendation, not the caveat"), and carry over the explicit banned-words list from the OS tone-of-voice configuration when one exists (see "Grounding the draft in Bulldozer OS" above) rather than leaving this section as a list of vibes.

### 11. Proof Points

- Key metrics or results to cite
- Notable customers/logos
- Testimonial snippets
- Main value themes with evidence

Every row in the value-themes table needs a real proof, not a placeholder. A theme with no proof yet is a gap to flag to the client, not a row to fill in with a plausible-sounding number — an invented metric is worse than an empty cell, because it looks verified when it isn't.

**A number the company controls isn't proof by itself.** A headline metric that only lives on the client's own site or in a case study it wrote is a claim to present as a claim, not evidence a skeptical prospect has already accepted — the test is whether someone could find or confirm it somewhere the company doesn't control (an independent review, press coverage, an analyst mention, the customer's own channel). Mark anything that fails that test as "what we say about ourselves," and keep pushing the client for the corroborated version rather than let the two blur together on the page.

### 12. Goals

- Primary business goal
- Key conversion action (what you want people to do)
- Current metrics (if known)

---

## Document Format

For the exact markdown template of the context document, read `references/document-format.md` before writing or saving it.

---

## Tips for Gathering Good Input

- **Push for specificity**: "What's the #1 frustration that brings them to you?" beats "What problem do you solve?"
- **Capture exact words**: Ask customers to describe the problem in their words. Those phrases go straight into copy.
- **Ask for examples**: "Can you give me an example?" unlocks better answers than abstract questions.
- **Skip what doesn't apply**: B2C products don't need the Personas section. Don't force it.
- **Revisit quarterly**: Markets shift. Positioning that was true 12 months ago may be stale.

---

## Common Mistakes

For the list of common mistakes when building the context document, read `references/common-mistakes.md`.

## Rules

- **No renunciation, no positioning.** Sections 2 and 7 have to name who this is for and who to actively decline — a document that only says yes hasn't positioned anything.
- **Table stakes isn't a differentiator.** If a direct competitor could put the same sentence on its own site without lying, it belongs in Product Overview as a category requirement, not in Section 6.
- **The indirect competitor gets a full row.** Spreadsheets, incumbent process, and doing nothing beat named vendors as the real alternative in most B2B deals — don't let the section skip past it.
- **Proof means someone outside the company could find it.** A metric that lives only on the client's own site or in its own case study is a claim to label as a claim, not evidence to publish as settled.
- **A rubber-stamp stakeholder gets one line, not a forced full write-up.** Save the three-part persona template for whoever can independently block or accelerate the deal.
- **An OS analysis is a draft, never the finished section — and it's a snapshot, not a fixed fact.** Present it to the client to confirm, keep competitor revenue and headcount as rough estimates, and re-check a market-positioning or offer-structure read before repeating it in a later engagement rather than assuming it still holds.
- **A corrected field beats the AI's original guess, always.** Where positioning, value-proposition, or offer-structure text carries a client correction alongside the AI's draft, quote the correction — never the AI's guess sitting underneath it.