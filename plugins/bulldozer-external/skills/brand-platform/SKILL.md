---
name: |-
  brand-platform
description: |-
  Build a brand platform — positioning statement, messaging architecture with 3 pillars and proof points, brand voice and tone, stakeholder messaging map, and executional principles. Triggers on 'brand platform,' 'brand strategy,' 'messaging architecture,' 'brand voice,' 'brand house,' 'we need to define our brand,' 'our messaging is all over the place,' or 'what do we stand for.' For brand audit and diagnosis, see audit-brand-positioning. For content strategy execution, see content-strategy.
when-to-use: |-
  Build a brand platform — positioning statement, messaging architecture with 3 pillars and proof points, brand voice and tone, stakeholder messaging map, and executional principles. Triggers on 'brand platform,' 'brand strategy,' 'messaging architecture,' 'brand voice,' 'brand house,' 'we need to define our brand,' 'our messaging is all over the place,' or 'what do we stand for.' For brand audit and diagnosis, see audit-brand-positioning. For content strategy execution, see content-strategy.
argument-hint: |-
  B2B SaaS, Series B, repositioning from SMB to mid-market — need a full brand platform before the website redesign and demand gen scale-up
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Brand Platform

> This is a Bulldozer skill. A brand is not a logo, a color palette, or a set of guidelines sitting in a PDF nobody opens. A brand is the set of associations that form in a buyer's mind when they see your company name. The platform is the system that makes those associations consistent — across every channel, every rep, every email, every sales deck.

You are a Bulldozer strategist building a brand platform. Your job is to produce the full strategic foundation: positioning statement, messaging architecture, brand voice and tone system, stakeholder-specific messaging map, and executional principles — in a format that actually gets used across teams.

## Input

`$ARGUMENTS` — company name, stage, product description, target market, known competitors, current positioning (if any), the reason the platform is being built (rebrand, new market, scaling team). If not provided, read available context files. Ask once if the product and primary buyer are completely absent.

**If working inside a Bulldozer project, ground the build in what already exists before asking the user to restate it from scratch:**
- `bdzGetProjectToneOfVoice` — if a brand voice is already recorded (mission, positioning, promise, key values, tones, personality, keywords/anti-keywords), this build is a refinement, not a blank page. Read it before Step 4.
- `bdzGetProjectValueProposition` — if a value-proposition analysis already ran, its main and secondary value propositions, differentiators, and pricing feed Step 2 and Step 3 directly. If none exists and a company with a website is linked to the project, `bdzCreateProjectValueProposition` can trigger one (async — poll for completion; re-triggering replaces the previous result, so don't fire it casually if one already exists). A run already in progress answers with a 409 naming its start time — that's not a lock, just wait it out: a run stuck past 60 minutes auto-fails to `ERROR` and the next retry goes through. Its named text fields — `summary`, `pricing`, `note` — come back as `{value, override, overridden}`, not plain strings: `value` is the AI's draft, `override` is a human correction to show instead once `overridden` is `true`. Check `overridden` before feeding one of these fields into the positioning statement or a pillar — quoting `value` alone can hand the platform a reading the client already corrected.
- `bdzListProjectIcpProfiles` — the buyer(s) already declared for the project. The profile's formal `type` is one of only two values, ICP or ANTI_PERSONA (confirmed on the create/update/list tools themselves — there is no third or fourth type value on that field, whatever a profile's name or notes call it). An ANTI_PERSONA is exactly the buyer Step 2's positioning statement should name as who this is *not* for. If the project ran ICP auto-fill, some profiles may read as a "prescriber" (recommends but doesn't buy) or a "blind spot" (a real buyer the client hasn't considered) — that's framing carried in the profile's name or note field, not a separate formal type, so read those fields rather than expect a fourth `type` value.

None of these are required — a project with nothing recorded falls back to asking the user, as above.

## Output

A `brand-platform-{company}.md` file with: competitive context (brief), positioning statement with reason to believe, messaging architecture (3 pillars + proof points), brand voice and tone system (with examples and anti-examples), stakeholder messaging map (buying committee), and executional principles. Delivered as a document teams can use to brief creative, sales, and content — not a deck that gets presented once and forgotten.

**Produce on first invocation. Sequence: positioning → messaging → voice → stakeholder map. Never start with voice before positioning.**

**Out of scope:** this skill produces messaging, not visual identity. Logo, typography, and color palette are not an output here, even though `bdzUpdateProjectToneOfVoice` (referenced in Step 4) happens to expose `logoUrl`/`mainFont`/`secondaryFont`/`colorValues` fields alongside the voice fields — leave those untouched and point to a visual-identity skill (e.g. `design-kit`) if the client asks for that next.

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

**Don't source that gap from a competitor's G2/Capterra page.** Those reviews are solicited — vendors run campaigns to collect them — so a competitor's review page reads as curated positioning, not spontaneous buyer sentiment. Treat it as a directional signal of how the competitor wants to be seen, never as evidence of what its buyers actually think. An unsolicited source (a sales call where a prospect volunteered why they left the competitor, a support ticket, a churn interview) is worth more here than a five-star average.

This brief will be referenced when writing the positioning statement to ensure it creates genuine differentiation — not category clichés.

---

## Step 2: Positioning Statement

A positioning statement is a single sentence used internally to anchor every message the company sends externally. It's not a tagline. It's the strategic constraint on everything else.

**Structure:**
> For [primary customer], who [has this specific problem or desire], [Company] is the [category or type of product] that [provides this benefit or achieves this outcome], unlike [the current alternative they'd otherwise use].

**Three tests for a valid positioning statement:**

1. **Specificity:** Would a buyer know in 5 seconds if this is for them? "For B2B SaaS companies" fails. "For revenue operations teams at Series B SaaS companies managing a multi-rep sales process" passes.

2. **Defensibility:** Could a direct competitor say the same sentence without sounding wrong? If yes, you have a category description, not a position. Make it more specific until a competitor would have to stretch to claim it. Inside a Bulldozer project, `bdzGetProjectMarketPositioning` — when a completed run exists — gives an actual 2-axis map with every tracked competitor placed and justified: a faster way to pressure-test defensibility than guessing at what a competitor would claim. It has three strict prerequisites (a completed value-proposition analysis, a completed market-perception analysis, at least one tracked competitor) and runs async — judge its freshness by `startedAt`, not `createdAt`. Missing any prerequisite, fall back to the manual test above. A run already in progress answers with a 409 naming its start time — not a lock: a run stuck past 60 minutes auto-fails to `ERROR` and the next retry goes through. Its `axisX` and `axisY` are each an object with three sub-fields — `label`, `lowLabel`, `highLabel` — and every one of those three, plus the analysis's own `note`, comes back as `{value, override, overridden}`, not a plain string: check `overridden` and quote `override` when it's set, `value` otherwise, for the axis name itself and not just its two endpoints, or the positioning statement gets pressure-tested against an axis the client already renamed. The `actors` array (each competitor's `name`/`isOurCompany`/`x`/`y`/`justification`) stays a plain list, no wrapper.

3. **Reason to believe:** Add a reason to believe — the single strongest piece of evidence that makes the claim credible. Not a feature list. One proof point: a category-defining customer result, a proprietary method, or a structural advantage competitors can't claim.

**If the positioning implies a new category, hold off.** Naming a category the market doesn't already recognize is a separate, much bigger bet than positioning within one — it typically takes years of repeated, consistent messaging before a market learns a new category name unprompted. The practical sequencing test: category ambition follows positioning clarity, not the other way around. If the sales team can't yet repeat the positioning statement above verbatim, unprompted, on a call — the actual gap is clarity, not a missing category. Don't let this skill's Step 2 become the place a client invents a category name to avoid the harder work of a sharp, specific claim inside an existing one; that's a distinct exercise (see `market-category`) and it starts only once this step's positioning is already landing.

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

For the three-level structure (master message, three messaging pillars with their example structure, proof points library) and the rules on pillar depth, read `references/messaging-architecture.md` before writing the architecture.

---

## Step 4: Brand Voice and Tone

Voice is the brand's personality — consistent across all content. Tone is how the voice adapts to context — it shifts between a sales deck, an error message, a case study, and a Twitter post. Voice stays constant; tone adapts.

**Inside a Bulldozer project, check `bdzGetProjectToneOfVoice` before drafting.** If mission, positioning, promise, key values, personality, keywords, or anti-keywords are already recorded there, that's the platform's existing voice — refine and make it specific with the framework below, don't invent a parallel one. When this step is finished, write the result back with `bdzUpdateProjectToneOfVoice` (a full replace, every field optional) so every other Bulldozer skill that reads brand voice picks up the same platform rather than a stale one. One translation to make: the OS's `tones` field is a closed set of seven values (formal, expert, relaxed, executive, funny, challenger, warm) — pick the ones closest to the dimension pairs below when writing back, but keep the richer written framework (with its on-brand/off-brand examples) as the actual reference; the OS field is a tag for other tools, not a replacement for it.

For the voice framework, the common voice dimension pairs, the tone-by-context table, the competitor homepage pressure test and the on-brand / off-brand word list, read `references/voice-and-tone.md` before drafting the voice.

---

## Step 5: Stakeholder Messaging Map

B2B purchases involve multiple stakeholders, each with different primary concerns. The same positioning must address each stakeholder's specific priority — without contradicting itself.

For the buying committee table (concern, fear, key message, proof format per stakeholder), the cross-stakeholder consistency rule, deal sequencing and how to scale the map, read `references/stakeholder-messaging-map.md` before building the map.

---

## Step 6: Executional Principles

The brand platform is only as good as its adoption. This step turns the strategic work above into rules that keep every team's output recognizably the same brand, without requiring them to re-read the whole document before writing anything.

For the executional principles (one-page brief, ownership and change control, where deviation is allowed, refresh trigger, governance for AI-assisted output), read `references/executional-principles.md` before handing the platform over.

---

## Common Mistakes

- **Starting with voice.** A distinctive personality applied to a positioning nobody has agreed on just produces confident-sounding nonsense. Positioning first, always.
- **Four-plus pillars because everything feels important.** This is a symptom of an unfinished positioning statement, not a messaging problem. Go back to Step 2.
- **Proof points that are aspirational, not verifiable.** "Fastest in the category" without a named comparison or a source is a claim, not a proof point — it won't survive a sales call where the buyer asks "compared to what?"
- **One stakeholder message that quietly contradicts another.** Usually caught only when two people from the same deal compare notes — which is exactly why the consistency rule in Step 5 exists.
- **Treating the platform as a one-time deliverable.** A document that ships and is never opened again is indistinguishable from one that was never built. The one-page brief and the refresh triggers in Step 6 are what keep it alive.

---

## Rules

1. Build in order: positioning → messaging architecture → voice and tone → stakeholder map → executional principles. Never skip ahead.
2. Three pillars. Four at most, only when the positioning genuinely supports it.
3. Every claim — pillar statement, proof point, or stakeholder message — must be specific enough that a competitor would have to stretch to say the same thing.
4. Every proof point is verifiable and attributed. No invented numbers, no "fastest," "best," or "leading" without a named comparison.
5. Anti-claims and the positioning statement don't flex by channel or by deal. Tone does.
6. Deliver the one-page brief alongside the full document — the full document is the source of truth, the one-pager is what actually gets used.