---
name: |-
  competitor-profiling
description: |-
  Research and profile competitors from their URLs — positioning, pricing, SEO strength, and product gaps. Triggers on 'competitor profile,' 'competitive intelligence,' 'competitor analysis,' 'profile this competitor,' 'competitive audit,' or 'competitor dossier.' For comparison landing pages, see competitor-alternatives. For sales battle cards, see battlecards.
when-to-use: |-
  Research and profile competitors from their URLs — positioning, pricing, SEO strength, and product gaps. Triggers on 'competitor profile,' 'competitive intelligence,' 'competitor analysis,' 'profile this competitor,' 'competitive audit,' or 'competitor dossier.' For comparison landing pages, see competitor-alternatives. For sales battle cards, see battlecards.
argument-hint: |-
  https://competitor.com https://competitor2.com — deep profile, focus on pricing and positioning
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Competitor Profiling

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on competitive intelligence. Your goal is to take a list of competitor URLs and produce structured competitor profiles by combining live site research with SEO and market data.

## Input

`$ARGUMENTS` — competitor URLs and depth level (e.g., "https://competitor.com — deep profile, focus on pricing and SEO"). If not provided, ask for URLs. Only ask for depth if not specified — default is quick scan.

## Output

One `competitor-profiles/{competitor-slug}.md` per competitor + a `competitor-profiles/_summary.md` cross-competitor summary. Each profile follows the standard template below. Raw scraped data saved to `competitor-profiles/raw/{slug}/{YYYY-MM-DD}/`.

**Produce profiles on first invocation. Default to quick scan. Only ask for URLs if completely absent.**

---

## Quick Scan vs. Deep Profile

### Quick Scan (default)

- Pages: homepage + pricing
- SEO: domain overview + top keywords
- Skip: reviews, backlink details, changelog
- Output: abbreviated profile (At a Glance + Positioning + Pricing + SEO summary)

### Deep Profile

- Pages: all key pages + review sites (Trustpilot is the one review source Bulldozer OS genuinely fetches and stores for a competitor; Google Business Profile, G2, Capterra and Product Hunt have no usable path for a competitor and fall back to a one-off manual web search, see Phase 1)
- SEO: full backlink analysis + keyword intelligence + competitor discovery
- Output: full profile template below

Default to **quick scan** unless the user specifies deep profiling or provides ≤3 competitors.

**Refuse the profile nobody will act on.** A URL that came up once, in a single lost deal or a single sales call, isn't the same signal as a name that keeps recurring across deals, renewals, or the project's own positioning read (see below) — the first is an anecdote, the second is a pattern worth the research time. If whoever asked for the profile can't say what decision it feeds — a pricing change, a battlecard, a positioning pivot — that's the moment to ask rather than produce a document that gets filed and never opened.

---

## Research Process

Before spending research time on the handed list itself: the name on the URL isn't always the account's real alternative. `bdzGetProjectMarketPositioning`, when the project has one, places the project's own company on a positioning map next to the field it actually competes against — and on the one real read checked (the internal Bulldozer project), that field wasn't a set of feature-equivalent peers at all, it was a channel specialist, a limited-scope subscription, and a more generalist studio, each on a different axis. A prospect names a familiar SaaS competitor, but the deal actually at risk might be against a single-channel agency, a freelancer, an internal build, or doing nothing. If the handed list is all peer software and the positioning map (or plain sales knowledge) points somewhere else, say so before spending the budget confirming what's already suspected — five well-profiled wrong competitors is still the wrong five.

### Phase 0 — Check What Bulldozer OS Already Knows

Before scraping anything, ground the competitor in the OS — most of the time it already has data:

1. **Resolve the company**: `bdzSearchCompanies` (filter by `website`) to see if this competitor already exists as a company record. If not, `bdzCreateCompany` (name + website) creates one — `enrichment=true` triggers the platform's own enrichment.
2. **Check if it's a tracked competitor**: `bdzGetCompetitors` (filtered by `filterByCompanyId`). If it isn't tracked yet and the user wants ongoing monitoring rather than a one-off profile, `bdzCreateCompetitor` adds it (`type` defaults to `COMPETITOR_TYPE_COMPETITOR`; declare `sources` — SEO markets — explicitly, it defaults to FRANCE-only).
3. **Pull the existing competition-intensity read, if any**: `bdzGetProjectCompetitionIntensity` returns, per already-tracked competitor, an AI-generated `positioning`, `creativeTargeting`, a 0–100 score on 7 channels (seo/sea/cro/geo/meta/linkedin/social), an estimated `monthlyMediaBudget` range as a free-text bracket (never a structured number to quote as-is), and sourced `strengths`. When the job state is `SUCCESS` and recent — judge "recent" by the analysis's `startedAt`, never `createdAt`: the same record is reused across regenerations, so `createdAt` can predate the actual last run by months — this covers most of the **Positioning & Messaging** section of the template without any scraping. It's a project-wide read — `bdzCreateProjectCompetitionIntensity` regenerates it, but always for *every* non-inspiration competitor on the project at once, never for one competitor in isolation, so don't offer "refresh just this one." **Treat it as a hypothesis, not the profile itself** — it's an AI-generated read, not a verified one. For a quick scan, citing it with the AI-generated label is enough; for a deep profile meant to inform a sales or pricing call, cross-check at least one of its `strengths` claims and its channel scores against something you actually observe (a live ad, a real ranking, a genuine review) before repeating it as settled fact. Unlike the value-proposition and positioning reads cited under **Competitive Implications** below, this one has no human-correction layer — the only write path on a competition-intensity read is `bdzUpdateCompetitionIntensityActor`, scoped to a single competitor's CRM note, not to `positioning`/`strengths`/the channel scores. There's no `overridden` flag to check here; the cross-check above is the only safeguard against repeating a bad AI read.

If the OS has nothing yet (new competitor, no analysis run), fall through to Phase 1.

### Phase 1 — Site Scraping & Public Signals

For Phase 1 in full (page-by-page extraction table, team size and public-source boundaries, public ad activity, review sites for deep profiles, call transcripts as a source), read `references/research-phases-1-2.md` before scraping a competitor.

### Phase 2 — SEO & Market Data

For Phase 2 in full (the Bulldozer OS SEO tools to call for tracked and untracked competitor domains, and competitor discovery), read `references/research-phases-1-2.md` (same file) before any SEO pull.

### Phase 3 — Synthesis

Combine OS reads (Phase 0), site + ad data (Phase 1) and SEO data (Phase 2). Cross-reference claims (e.g., "10,000 customers" — does their traffic profile support that scale?). Label inferences clearly, and label anything sourced from a `bdzGetProjectCompetitionIntensity` read as an AI-generated estimate, not a verified figure — same caution as any Bulldozer OS market-sizing output.

**A claim's absence from independent sources is itself a signal, not proof of dishonesty — but it changes how confidently you repeat it.** If a competitor's site claims a customer count or revenue figure that shows up nowhere on Trustpilot, Google reviews, press, or LinkedIn commentary, carry it in the profile as an unverified claim, not as fact — the same standard this project applies to its own unverified claims the moment a prospect asks for proof.

---

## Profile Template

For the full profile template (At a Glance, Positioning & Messaging, Product & Features, Pricing, SEO & Content, Customer Reviews, Strengths & Weaknesses, Competitive Implications), read `references/profile-template.md` before writing any profile.

For the "us" side of this section, don't ask the user to restate it from memory — `bdzGetProjectValueProposition` (current project's stated value propositions and differentiators) and `bdzGetProjectMarketPositioning` (a 2-axis positioning map with the project's own company already placed on it) hold the project's declared baseline and are faster and more consistent than re-deriving it per profile. `bdzGetProjectValueProposition`'s named text fields — `summary`/`pricing`/`note` — come back as `{value, override, overridden}`, not plain strings: `value` is the AI-generated draft, `override` is a human correction to show instead once `overridden` is `true`. `bdzGetProjectMarketPositioning`'s `note` carries the same wrapper, but its `axisX`/`axisY` are not themselves wrapped objects — each is a container with three sub-fields (`label`, `lowLabel`, `highLabel`), and it's those three sub-fields, individually, that come back as `{value, override, overridden}`. Always check `overridden` at the field (or sub-field) you're about to quote, and show `override` when it's set, never `value` alone — a profile that quotes an axis's raw `value` after a client already renamed it would publish wording they've already corrected. The `actors` array on the positioning map (each competitor's `name`/`isOurCompany`/`x`/`y`/`justification`) stays a plain list without this wrapper.

---

## Summary Document

After profiling all competitors, produce `competitor-profiles/_summary.md` with:

1. Competitive landscape overview (1 paragraph)
2. Comparison table — key metrics side by side
3. Positioning map — where each competitor sits
4. Key takeaways — 3–5 strategic observations
5. Gaps and opportunities — where the market is underserved

---

## Handling Multiple Competitors

- Parallelize scraping — scrape all homepages simultaneously, then pricing pages
- Use consistent metrics across all profiles so they're comparable
- Build the summary last, after all individual profiles are complete
- If 10+ competitors: suggest profiling the top 5 first by market relevance
- Before committing effort to the batch, check refresh config (see Updating Profiles) for each already-tracked competitor in one pass — the state varies competitor to competitor even within the same project, so some need almost no manual pull and others need the full Phase 1/2 treatment. Don't budget the same effort per competitor by default.
- Five profiles kept current beat ten that go stale. If the list keeps growing past what one person can revisit each quarter, that's a signal to prune it, not to move faster.

---

## Updating Profiles

Profiles are snapshots — but the question that matters before touching one isn't "what changed," it's "does this competitor refresh itself in Bulldozer OS, and for which categories."

**Check the refresh config before re-pulling anything by hand.** For a competitor already tracked, `bdzGetCompetitorRefreshConfig` returns four independent flags — `refreshAds`, `refreshSeo`, `refreshSea`, `refreshReviews`. Verified by real call on the internal Bulldozer project, across six tracked competitors spanning three creation dates: the default at creation is `refreshAds: true` and `refreshReviews: true` paired with `refreshSeo: false` and `refreshSea: false` — a split, not a coin flip, and it tracks the cost structure already established for SEO (a paid provider call per declared market, per month, see Phase 2): ads and reviews are cheap OS-native reads, SEO/SEA are metered. But that default isn't the last word — two competitors on the same project had all four flags overridden by hand well after creation (one to all-`true`, one to all-`false`), so a profile still can't assume the default holds for a given competitor without checking. `refreshReviews` is specifically the Trustpilot toggle, not a generic "reviews" switch — confirmed by real call pairing two competitors' `refreshReviews` state with their company's Trustpilot-specific refresh config (`bdzGetReviewRefreshConfig`): both read `false`/`false` on one competitor and `true`/`true` on another, with matching or near-matching timestamps, meaning flipping `refreshReviews` on the competitor is what creates or updates that Trustpilot config underneath. It has no bearing on Google Business Profile, which isn't a real source for a competitor to begin with (see Phase 1) — don't read `refreshReviews: true` as "this competitor's reviews, however sourced, stay current." Don't assume a number in an old profile is stale just because time has passed, and don't assume it's fresh just because the competitor is "in the system" — check the config for that specific competitor first, and only manually re-pull the categories it doesn't cover. `bdzUpdateCompetitorRefreshConfig` turns SEO/SEA on when a competitor is worth the ongoing cost — the same "commit to revisiting" bar as registering its SEO domain in the first place (Phase 2).

What stays manual regardless: pricing pages remain the most volatile and the one category the OS refresh config doesn't cover at all (it's SEO/SEA/ads/reviews, never pricing) — check them first on any manual pass, whatever the refresh config says. Scan the changelog for product changes. Note what changed in a `## Change Log` section.

**Don't wait for a scheduled pass to react to an event that breaks the profile's premise.** An acquisition, a merger, a rebrand, or a shutdown makes a profile wrong overnight, not gradually — treat it as an immediate rewrite-or-retire trigger the day it's known, the same as a pricing change nobody would sit on for a quarter.