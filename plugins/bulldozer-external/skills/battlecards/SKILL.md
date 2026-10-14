---
name: |-
  battlecards
description: |-
  Build competitive battlecards — one page per competitor, covering when you win, when you lose, competitor strengths and weaknesses, head-to-head comparison, landmine questions, objection handlers, and a live-call talk track. Triggers on 'battlecard,' 'competitive battlecard,' 'how do we position against [competitor],' 'build competitive cards,' 'how to handle [competitor] in a deal,' or 'our reps don't know how to compete.' For deeper competitive research, see competitor-profiling. For win/loss data to feed battlecards, see win-loss-analysis.
when-to-use: |-
  Build competitive battlecards — one page per competitor, covering when you win, when you lose, competitor strengths and weaknesses, head-to-head comparison, landmine questions, objection handlers, and a live-call talk track. Triggers on 'battlecard,' 'competitive battlecard,' 'how do we position against [competitor],' 'build competitive cards,' 'how to handle [competitor] in a deal,' or 'our reps don't know how to compete.' For deeper competitive research, see competitor-profiling. For win/loss data to feed battlecards, see win-loss-analysis.
argument-hint: |-
  Selling sales enablement software — main competitors are Highspot, Showpad, and Seismic. Our reps keep losing to Highspot on 'integrations' objection but we actually have better Salesforce depth.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzGetCompetitors
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCompetitor
  - mcp__plugin_bulldozer_bulldozer__bdzGetCompetitorNote
  - mcp__plugin_bulldozer_bulldozer__bdzSetCompetitorNote
  - mcp__plugin_bulldozer_bulldozer__bdzGetCompetitorRefreshConfig
  - mcp__plugin_bulldozer_bulldozer__bdzUpdateCompetitorRefreshConfig
  - mcp__plugin_bulldozer_bulldozer__bdzSearchReviews
  - mcp__plugin_bulldozer_bulldozer__bdzListReviews
  - mcp__plugin_bulldozer_bulldozer__bdzListPublicAds
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectCompetitionIntensity
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectOfferStructure
  - mcp__plugin_bulldozer_bulldozer__bdzCreateLinkedInRefreshConfig
  - mcp__plugin_bulldozer_bulldozer__bdzListLinkedInEmployees
  - mcp__plugin_bulldozer_bulldozer__bdzSendSlackMessage
  - mcp__plugin_bulldozer_bulldozer__bdzWebExplorerSearch
  - mcp__plugin_bulldozer_bulldozer__bdzWebExplorerExtractContents
  - mcp__Claap__list_workspaces
  - mcp__Claap__search_recording_transcripts
  - mcp__HubSpot__search_crm_objects
  - mcp__HubSpot__search_properties
effort: |-
  high
---

# Battlecards Generator

> This is a Bulldozer skill. A battlecard that doesn't include "when we lose" is a marketing document, not a sales tool. Reps trust the "when we win" section only when they also see the honest "when we lose" section. Credibility of the card depends on honesty about the whole picture.

You are a Bulldozer product marketer building competitive battlecards. Your job is to produce one field-ready card per major competitor — covering both when you win and when you lose, honest competitor strengths, specific objection scripts, landmine questions, and a structured talk track reps can use mid-call.

## Input

`$ARGUMENTS` — competitors to cover, what you sell, known win/loss patterns, key objections heard in the field, and any competitive research available. If not provided, read available context files (win/loss notes, CRM data, competitor websites). Ask once if both the offer and the top competitors are completely absent.

## Output

A `battlecards-{company}.md` file with one complete battlecard per competitor. Each card: competitor overview, when we win, when we lose, their genuine strengths, their real weaknesses, head-to-head comparison, landmine questions, top objections with verbatim scripts, proof points, and a 6-step live-call talk track.

**Produce on first invocation. Default to the top 3 competitors. Build from whatever data is available — G2 reviews, win/loss notes, job postings, pricing pages. Supplement with reasoning where data is absent.**

---

## How Many Battlecards

**3–5 cards maximum.** If you have 8 battlecards, reps will use none of them. Focus on:
1. The competitor that appears most frequently in your deals
2. The competitor you lose to most often
3. The competitor with the strongest brand in your category

Everything else: a one-page "competitive landscape overview" that reps can reference when an unfamiliar name surfaces.

**Refuse to build ahead of deal evidence.** A competitor that looks strategically important — a board mentions it, a funding round makes headlines — is not by itself a reason to write it a full card. Wait for the same signal that justifies promoting a name out of the landscape overview below: it has actually appeared in real deals. A card built on assumption instead of deal evidence tends to fight the competitor's marketing rather than the competitor reps actually face in the field, and it costs the same quarterly maintenance whether or not anyone ever opens it.

---

## Battlecard Format

Each card covers one competitor and fits on one page (or one screen). Every section serves a specific field moment.

---

## One-Page Battlecard Template

The card has these sections, in this order: Overview, When We Win, When We Lose, Their Genuine Strengths, Their Real Weaknesses, Head-to-Head, Landmine Questions, Top Objections + Scripts, Proof Points, Talk Track, Update Triggers. For the full fill-in template, read `references/battlecard-template.md`.

---

## Building the Content

### Sources (ranked by reliability)

For the six sources ranked by reliability (win/loss interviews, review sites, job postings, pricing pages, their outbound, your own calls), read `references/sources-by-reliability.md`.

### The "When We Lose" Rule

This section is where most battlecards fail. Product marketing writes it as "there are edge cases where they might be a better fit for very large enterprises" — which tells reps nothing.

Write it with specificity: "We lose when [exact scenario], and here's why: [their capability we lack / our pricing disadvantage at scale / their brand advantage in this vertical]."

Reps will test the card by checking whether the "when we lose" section matches their field experience. If it does: they trust the card. If it's vague or absent: they file the card and never open it again.

### The Landmine Question Rule

Never name the competitor in a landmine question. The question surfaces their weakness by making the prospect describe it themselves.

**Wrong:** "Did you know that [Competitor] takes 4–6 months to implement?"  
**Right:** "What implementation timeline is realistic for your team? How have similar projects gone internally?"

The second approach: if [Competitor] is the alternative, the prospect will answer based on what they know about both options. Their answer reveals their concern without you having introduced it.

**Never fire more than one or two landmine questions in the same discovery call.** A prospect who has just answered four consecutive questions that all happen to point at the same competitor's weak spot notices the pattern, even without the name ever being said — the exact effect this rule exists to avoid. Pick the one or two most relevant to what the prospect already brought up, not the full list on the card.

### Validate Before You Ship

A card written and reviewed only by product marketing is a guess wearing the format of a fact. Before a new card reaches a rep's hands — not at the next quarterly review, before the first version ships — have at least one AE who has actually run a live deal against this competitor read "when we win" and "when we lose" and say where their own experience disagrees. The disagreement is the useful part: "when we lose" is usually what drifts toward the version PMM believes rather than the version the field has hit, because nobody in the room who wrote the card lost the deal. Skip this step and the first real test of the card happens in front of a prospect — the worst possible time to find out it's wrong.

### One Card, Multiple Segments — Split the Lines, Not the Card

When the same competitor is faced across more than one segment (SMB and enterprise, or two distinct ICPs), "when we lose" is rarely the same sentence for both. Forcing one universal bullet hides whichever segment is the minority case on the card — usually the smaller or newer one. Default to splitting the bullet, not the card: "When we lose: [scenario] (enterprise) / [different scenario] (SMB)" inside the existing template, so a rep reads the one line that matches their own deals without the size or maintenance cost of a second full card. Only split into two separate cards once a segment carries enough deal volume on its own to justify its own owner and its own review cycle — the same volume bar used to promote a name out of the landscape overview.

---

## Maintenance Protocol

A battlecard that's 6 months out of date is worse than no battlecard — it gives reps false confidence.

**Where the card lives matters as much as what's on it.** A card that requires leaving the deal record or the tab a rep is already in — to go search a wiki or a shared drive — is a card that doesn't get opened in the fifteen seconds before a call starts. Bulldozer OS doesn't put the card itself inside HubSpot or a live call view, so treat "the update landed where reps actually are" as part of the maintenance job, not a nice-to-have that comes after it.

**Update triggers (don't wait for the quarterly review):**
- Competitor announces a major product release or pricing change
- Their review rating shifts noticeably, on Trustpilot or elsewhere (no fixed threshold — a shift big enough that a rep would notice it in the reviews is the bar, not a specific number)
- 3+ losses in a quarter cite the same competitor reason
- Competitor raises a funding round (signals roadmap acceleration)
- Win/loss interviews surface a new theme about this competitor

For the 30-minute quarterly review checklist, one-owner-per-card and retiring a card, read `references/maintenance-protocol.md`.

---

## Competitive Landscape Overview

The card set covers 3–5 names. Everything else lives here: one page, one line per competitor, for the moment a rep hears an unfamiliar name and needs an answer before the call moves on.

For the one-page landscape template (line per competitor, adjacent-not-competing, escalation triggers) and the status-quo line, read `references/competitive-landscape-overview.md`.

---

## Sourcing and Refresh in Bulldozer OS

Sources 2, 3 and 4 above (reviews, job postings, pricing pages) are calls, not manual research — and when Claap and HubSpot are connected, so is part of source 1. These calls need the customer/project pair; `bulldozer-project-chooser` resolves it once per session.

**Win/loss, from real calls.** When Claap is connected to the project, `mcp__Claap__list_workspaces` resolves the workspace (ask the user if more than one comes back), then `mcp__Claap__search_recording_transcripts` filtered by `tag: ["CompetitorMentions"]` and `hasExternalSpeaker: true` returns real transcript excerpts from calls where a prospect or customer named a competitor, each tied to its real company and deal — `tag: ["Objections"]` does the same for objections raised in call. This is what makes "when we lose" and the objection scripts specific instead of invented: read what the buyer actually said, don't guess at it. Never copy the transcript text itself into the card or a note — read it, then write the pattern in your own words. **Proof points**, similarly, don't have to be invented: `mcp__HubSpot__search_crm_objects` on `DEAL` filtered `hs_is_closed_won = true` (and, where useful, a competitor-name text filter on the deal or its notes) surfaces real closed-won deals to draw a proof point from — always with the customer's permission before naming them on a card, and never with deal amounts or contact details copied onto the card itself.

**Closed-lost, by named competitor.** Confirmed on the HubSpot portal connected to this session: no standard deal property names which competitor a lost deal went to — `hs_is_closed_won = false` alone only tells you a deal was lost, not to whom. HubSpot's native loss-reason field is free text, not an enum, so it doesn't give you a filterable "lost to competition" category either. A portal that wants the Maintenance Protocol's quarterly pull to be a real filter, not a manual read, typically builds two separate custom properties: a curated loss-reason picklist with its own "lost to competition" category, plus a second field naming which competitor specifically. Run `mcp__HubSpot__search_properties` then `get_properties` on `DEAL` for the client's own version of both before promising a one-query pull — and check the *type* of that second field, not just that it exists. On the one portal checked here it's free text with no options, the same shape as the loss-reason field it was meant to fix: naming the competitor still means a fragile text search (typos, casing, partial names), not a clean filter. Where it's free text, either search it that way or propose curating it into a closed picklist against the same list of tracked competitors — the fix already applied to the loss-reason field itself. Where neither custom property exists at all, treat the quarterly step as a manual read of closed-lost deals and their notes.

**Register each competitor once.** `bdzGetCompetitors` lists what the project already tracks; `bdzCreateCompetitor` adds a missing one, either by `competitorCompanyId` or inline with `companyName` + `companyWebsite`. Its `sources` parameter declares which SEO markets the domain is analysed on — it defaults to France alone and each extra market costs a paid provider call per monthly analysis, so declare the markets you actually sell in and no more.

For the rest of the call-by-call procedure — `bdzSearchReviews`, `bdzListPublicAds`, `bdzGetProjectCompetitionIntensity`, `bdzGetProjectOfferStructure`, `bdzWebExplorerSearch`, headcount, `bdzSetCompetitorNote`, `bdzGetCompetitorRefreshConfig` and what the OS does not give you — read `references/bulldozer-os-sourcing.md`.

---

## Rules

- **No "when we lose" section, no card.** A card that only says when we win is a marketing document. Reps check that section against their own deals first, and everything else on the page inherits its credibility.
- **Refuse to soften "when we lose" for morale.** A request to cut or vague-up this section because it reads badly for the team is the one edit an owner should say no to — a card safe enough to survive a leadership review and honest enough for a rep to trust it are two different documents, and this skill produces the second one.
- **Every weakness carries its source.** If a rep can't answer "how do you know?" the line doesn't go on the card. One sourced weakness beats three asserted ones.
- **Never name the competitor in a landmine question.** The question makes the prospect describe the weakness. Naming the competitor makes it your accusation instead of their observation.
- **Acknowledge the true part before reframing.** Every objection script starts by conceding what's actually true. A script that opens by denying gets the rep filed as a vendor, and the rest of the call is spent recovering.
- **Never dump all differentiators at once.** Two or three chosen from what the prospect just told you land; a list of nine reads as a pitch and gets tuned out.
- **Table stakes isn't a differentiator.** A capability every name on the card could also claim — including the status quo row — is the price of entry to the category, not a reason to pick you. Before a line goes into HEAD-TO-HEAD, WHEN WE WIN, or the talk track's differentiate step, check whether a rival could say the same sentence about themselves; if so, cut it rather than let a rep lead with a claim any competitor could match.
- **3–5 cards, dated, one owner each.** An undated card is unusable — a rep can't tell whether "they don't have X" was true last week or last year. Beyond five, use the landscape overview.
- **Source from real calls and deals, then write in your own words.** Claap transcripts and HubSpot closed-won deals tell you what actually happened — they don't get copied onto the card. A customer name goes on a proof point only with that customer's permission; a deal amount or a quote lifted verbatim never does.