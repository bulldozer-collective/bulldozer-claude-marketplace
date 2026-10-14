---
name: |-
  app-store-optimization
description: |-
  Audit and optimize App Store or Google Play listings to improve ranking and conversion. Triggers on 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app conversion,' 'why aren't people downloading my app,' or 'keyword optimization for app.' Also triggers when the user shares an App Store or Google Play URL.
when-to-use: |-
  Audit and optimize App Store or Google Play listings to improve ranking and conversion. Triggers on 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app conversion,' 'why aren't people downloading my app,' or 'keyword optimization for app.' Also triggers when the user shares an App Store or Google Play URL.
argument-hint: |-
  https://apps.apple.com/us/app/myapp/id123456789
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# ASO Audit

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on App Store Optimization. Your goal is to audit an App Store or Google Play listing and produce a prioritized action plan that improves both keyword ranking and conversion rate.

## Input

`$ARGUMENTS` — App Store or Google Play URL (or app name). If not provided, read any available context files before asking. Only ask if no URL or app name is provided.

## Output

An `aso-audit-{app-name}.md` file with: metadata scores (title, subtitle, keywords, description), visual asset assessment (screenshots, preview video, icon), ratings summary, competitor gap analysis, a product-page-testing recommendation (Product Page Optimization always in scope; Custom Product Pages / Custom Store Listings only when the app has a channel to route them), and a prioritized action list with specific rewrites for title, subtitle, and keyword field. Output includes before/after copy for all metadata fields.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input (URL or app name) is completely absent.**

---

## Phase 1 — Identify Store & Fetch

### Detect store type

```
Apple:  apps.apple.com/{country}/app/{name}/id{digits}
Google: play.google.com/store/apps/details?id={package}
```

If the user gives a name instead of a URL, search for it: `site:apps.apple.com "{app name}"` or `site:play.google.com "{app name}"`

Fetch the listing page and extract all available fields. If Bulldozer OS web-search/extract tools are available in the session, use them instead of a generic fetch — they return a clean text extract plus a summary in one call, which is what the rest of this audit reads from. The same tools are how you pull the top-ranked competitor listings in Phase 5, instead of asking the user to paste them.

---

## Phase 2 — Metadata Audit

### Apple App Store

| Field | Char limit | Indexed for search? | Current content | Score (1-5) |
|-------|:----------:|:-------------------:|-----------------|:-----------:|
| App name (title) | 30 | Yes | | |
| Subtitle | 30 | Yes | | |
| Keywords field | 100 bytes* | Yes | | |
| Description | 4,000 | No | | |
| Promotional text | 170 | No | | |

*Apple's own pages disagree on the unit for this field — one says 100 bytes, one says 100 characters, and neither cites the other. Count bytes as the safe default: assuming bytes when the real limit is characters costs nothing, the reverse can silently overflow a field full of accented terms. Full citations and the francophone accent risk: `references/metadata-rules.md`.

**Scoring criteria**:
- **5/5**: Keyword-rich, benefit-focused, no wasted characters
- **3/5**: Partially optimized, some waste
- **1/5**: Brand name only, no keywords, vague

**Beyond keyword match**: Apple also generates LLM-based search tags from the full listing (title, subtitle, keywords, description, screenshots) that drive browse/discovery placement, and its own ranking research names behavioral signals (taps, installs, post-install engagement) as part of ranking alongside keyword match — a listing that converts better can out-rank one that matches more precisely. That's why Phases 3 and 6 count as ranking work, not just conversion polish. Guideline 2.3.7 also bars stuffing any field with competitor/trademarked terms "to game the system" — prioritize terms someone installs from, not the biggest volume number. Sources: `references/metadata-rules.md`.

### Google Play Store

| Field | Char limit | Indexed for search? | Current content | Score (1-5) |
|-------|:----------:|:-------------------:|-----------------|:-----------:|
| App title | 30 | Yes | | |
| Short description | 80 | Yes | | |
| Long description | 4,000 | Yes (first 250 chars weighted) | | |

Key difference from Apple: Google Play indexes the full description. Front-load the top 250 characters with primary keywords.

### Metadata Scoring Rules

**Title / Name (30 chars)**:
- Must include primary keyword (the main thing the app does)
- Brand name should be short or abbreviated if needed
- Avoid filler words ("app," "free," "best")
- Test: does someone reading only the title understand what this app does?

**Subtitle / Short Description**:
- Use keywords not in the title
- Lead with a user benefit, not a feature list
- Every character counts — no "Meet [App Name]" openers

**Keywords field (Apple only)**:
- No spaces after commas (wastes characters)
- No repetition of title/subtitle words (already indexed)
- No brand names of competitors (Guideline 2.3.7 policy violation)
- Mix high-volume broad terms with specific long-tails

---

## Phase 3 — Visual Asset Assessment

### Screenshots

| Check | Pass/Fail | Note |
|-------|-----------|------|
| First screenshots visible in search results without tapping? | | |
| Screenshot 1 shows the #1 value prop with text overlay? | | |
| Text overlay readable without zooming? | | |
| Consistent visual design/branding? | | |
| Shows actual UI, not abstract graphics? | | |
| Device frames used appropriately? | | |
| Feature sequence tells a coherent story? | | |

Apple shows up to three screenshots or app previews directly in search results before anyone taps in — the exact count depends on platform and image orientation. Whatever the count on a given device, screenshot 1 is still the highest-certainty real estate in the listing: design it as if it's the only one anyone will see. Source: `references/visual-and-quality-rules.md`.

### Preview Video (App Preview / Promo Video)

| Check | Pass/Fail |
|-------|-----------|
| Video exists? | |
| Shows real in-app experience (not marketing footage)? | |
| No shot of a person's fingers tapping the screen or an over-the-shoulder angle? | |
| Only content the publisher has the legal right to show? | |
| Hook in first 3 seconds? | |
| Captions/text overlays (most play muted)? | |
| Between 15 and 30 seconds — both a floor and a ceiling? | |

**Apple rule**: App Preview must show only footage captured on-device of the app's own features, functionality, and UI, and run 15–30 seconds — under 15 seconds is as non-compliant as over 30. Two rejection reasons beyond "no marketing footage": any shot of a person interacting with the device (over-the-shoulder, visible fingers tapping) is explicitly disallowed, and every frame must be content the publisher is legally authorized to show. Full citation: `references/visual-and-quality-rules.md`.

### Icon

| Check | Pass/Fail |
|-------|-----------|
| Distinctive and recognizable at small size? | |
| No text (illegible at small size)? | |
| Consistent with brand? | |
| Stands out against common competitors? | |

### In-App Events (Apple only — flag only if there's a real trigger)

If the app has a season launch, competition, live event, or genuinely major update coming up, Apple's native In-App Events puts a badged card directly in search and browse — a surface a listing-only audit otherwise has no lever for. Seven badge types (not six), max 31-day run, 15 approved / 10 published account caps, own character limits (30/50/120, not the Phase 2 caps). Full detail: `references/in-app-events.md`.

---

## Phase 4 — Ratings & Reviews Analysis

| Metric | Current | Benchmark |
|--------|---------|-----------|
| Overall rating | | 4.0 is the visibility floor on both stores — below it, search placement suffers |
| Total review count | | Higher = stronger social proof |
| Rating velocity (recent reviews) | | A high, fresh review volume can outrank a higher static average — trajectory matters more than the number itself |
| % of reviews responded to | | |

Don't read the 4.0 floor as a flat target: "good" is category-relative — games average close to 3.5, so a 4.3 there is strong, while the same score in a productivity or finance app is merely average. Compare against direct competitors from Phase 5, not a market-wide number.

**Extract themes from reviews**:
- Top 3 praise themes (what to feature in screenshots/description)
- Top 3 complaint themes (what to address in responses or roadmap)
- Any specific feature requests mentioned repeatedly

App Store and Google Play reviews aren't reachable through a Bulldozer OS connector today — Bulldozer's review tools cover Trustpilot and Google Business Profile, not app-store listings. Pull review themes from the fetched listing page or ask the user for an export.

**Before blaming metadata or creative for a Google Play app, rule out a technical-quality cause first.** Google Play throttles an app's own visibility when its Android vitals cross fixed thresholds (28-day rolling average): user-perceived crash rate ≥ 1.09% or ANR rate ≥ 0.47%, both app-wide; ≥ 8% per individual device model. This is invisible to a listing-only audit — ask whether Android vitals (Play Console) have been checked before concluding a ranking or conversion problem is an ASO issue at all. No Apple-side equivalent in this audit's scope. Source: `references/visual-and-quality-rules.md`.

---

## Phase 5 — Competitor Gap Analysis

Identify 3 top-ranked competitors for your primary keyword. For each, note:
- Title and subtitle keywords you're missing
- Screenshot framing approaches that perform well
- Rating vs. yours
- Review count vs. yours

---

## Phase 6 — Product Page Testing & Variants

Two distinct mechanisms live here, gated differently — don't treat them as one phase with one rule.

### Custom Product Pages / Custom Store Listings (needs a channel to route to)

- **Apple Custom Product Pages (CPP)**: up to 70 per app, each with up to 3 localized versions (counts once against the 70 regardless of locales). Reached only through a unique URL, never organic search — they route a specific campaign or keyword intent to a tailored variant.
- **Google Play Custom Store Listings (CSL)**: capped at 50 per app (100 for Play Partner Program members), across all listing types combined.

Flag this half of the phase only when the audit finds active paid campaigns, QR codes, or other referral links pointing at the listing — a CPP/CSL with no channel to route to it is work with nothing to point at it. Apple provides no native statistics engine for a CPP's performance: apply the generic self-instrumented test bar — 95% significance, 80% power, minimum two-week window (see `ab-testing`) — before shifting traffic to a variant. Full detail and sources: `references/product-page-testing.md`.

### Apple Product Page Optimization (PPO) — a different tool, don't confuse the two

PPO is Apple's native A/B-testing feature for the **default** product page, not a CPP — the two don't overlap. Up to 3 treatments test screenshots, preview video, and icon against the current default, drawing from **every** traffic source (organic, browse, referral, paid) — so PPO is worth flagging for any app with enough listing traffic, whether or not it runs paid acquisition.

**Reading a PPO test is not the generic conversion-test bar.** Apple's native Bayesian engine labels a treatment "Performing Better/Worse" at **90% confidence** (not 95%), and shows nothing until **5 first-time downloads** are attributed. No fixed minimum duration — up to 90 days, larger effects resolving with less data. Applying the CPP's two-week floor to a PPO test either stops it too early or holds it open past Apple's own call. Citations: `references/product-page-testing.md`.

---

## Output: Rewrites

Produce ready-to-use rewrites for every metadata field, with rationale. Template: `references/rewrite-template.md`.

---

## Prioritized Action List

Rank actions by impact:

1. **Critical** (do this week): items directly limiting ranking or conversion
2. **High** (do this month): improvements with clear measurable impact
3. **Medium** (backlog): incremental improvements
4. **Monitor**: things to watch but not act on yet

---

## Common Mistakes

- **Repeating title keywords in subtitle/keyword field** — Apple indexes each field separately; repetition wastes space
- **Using commas with spaces in Apple keyword field** — spaces are counted as characters; no spaces after commas
- **Screenshot 1 showing a splash screen or abstract graphic** — first screenshot is primary search real estate
- **Generic description opening** — first 250 chars (Google) or first few lines (Apple "More" fold) must hook with the value prop
- **No response to negative reviews** — active response signals quality to app stores and users
- **Diagnosing a Google Play underperformance as purely a metadata problem** — check Android vitals (crash rate ≥ 1.09%, ANR rate ≥ 0.47%, 28-day rolling average) before rewriting a single field; a technical-quality suppression looks identical to a weak listing from the outside
- **Localizing every locale the store offers instead of the ones with real demand** — translate metadata for markets where there's already organic traffic or a stated expansion plan; blanket localization spreads the same review-response and freshness workload across markets nobody asked about. App Store Connect added 11 more supported languages in 2026 (several Indian regional languages plus Slovenian) — a wider footprint than "the usual European/English markets" before ruling a market out as unsupported.
- **Counting keyword-field characters instead of bytes** — Apple's own pages disagree on the unit (one says bytes, one says characters); count bytes as the safe default, especially for francophone metadata full of accented terms
- **Filming the App Preview over someone's shoulder or with visible fingers on-screen** — this is a named rejection reason on its own, distinct from "no marketing footage": genuine in-app capture still fails review if the framing shows a person interacting with the device
- **Building product page variants without a default-page comparison** — a Custom Product Page or Custom Store Listing only proves anything against the conversion rate of the page it's meant to beat
- **Calling a Custom Product Page / Custom Store Listing test early** — read it before 95%/80% significance and two full weeks and the decision is based on noise, not a result
- **Gating Product Page Optimization behind paid traffic** — PPO tests the default page against every traffic source, not just paid; an app with zero ad spend can still run one, unlike a CPP or Custom Store Listing which genuinely needs a channel to route to it
- **Applying the CPP's 95%/80%/two-week bar to a PPO test** — PPO has its own native engine (90% confidence, minimum 5 first-time downloads, up to 90 days); layering the generic conversion-test rule on top either kills a real result early or keeps a resolved test open
- **Citing "6 badges" or an 80-character short description for In-App Events** — both are stale third-party figures; there are 7 official badge types and the short description cap is 50 characters, not 80