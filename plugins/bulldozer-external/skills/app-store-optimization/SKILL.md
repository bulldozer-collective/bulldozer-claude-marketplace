---
name: |
  app-store-optimization
description: |
  Audit and optimize App Store or Google Play listings to improve ranking and conversion. Triggers on 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app conversion,' 'why aren't people downloading my app,' or 'keyword optimization for app.' Also triggers when the user shares an App Store or Google Play URL.
when-to-use: |
  Audit and optimize App Store or Google Play listings to improve ranking and conversion. Triggers on 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app conversion,' 'why aren't people downloading my app,' or 'keyword optimization for app.' Also triggers when the user shares an App Store or Google Play URL.
argument-hint: |
  https://apps.apple.com/us/app/myapp/id123456789
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# ASO Audit

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on App Store Optimization. Your goal is to audit an App Store or Google Play listing and produce a prioritized action plan that improves both keyword ranking and conversion rate.

## Input

`$ARGUMENTS` — App Store or Google Play URL (or app name). If not provided, read any available context files before asking. Only ask if no URL or app name is provided.

## Output

An `aso-audit-{app-name}.md` file with: metadata scores (title, subtitle, keywords, description), visual asset assessment (screenshots, preview video, icon), ratings summary, competitor gap analysis, and a prioritized action list with specific rewrites for title, subtitle, and keyword field. Output includes before/after copy for all metadata fields.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input (URL or app name) is completely absent.**

---

## Phase 1 — Identify Store & Fetch

### Detect store type

```
Apple:  apps.apple.com/{country}/app/{name}/id{digits}
Google: play.google.com/store/apps/details?id={package}
```

If the user gives a name instead of a URL, search for it: `site:apps.apple.com "{app name}"` or `site:play.google.com "{app name}"`

Fetch the listing page and extract all available fields.

---

## Phase 2 — Metadata Audit

### Apple App Store

| Field | Char limit | Indexed for search? | Current content | Score (1-5) |
|-------|:----------:|:-------------------:|-----------------|:-----------:|
| App name (title) | 30 | Yes | | |
| Subtitle | 30 | Yes | | |
| Keywords field | 100 | Yes | | |
| Description | 4,000 | No | | |
| Promotional text | 170 | No | | |

**Scoring criteria**:
- **5/5**: Keyword-rich, benefit-focused, no wasted characters
- **3/5**: Partially optimized, some waste
- **1/5**: Brand name only, no keywords, vague

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
- No brand names of competitors (policy violation)
- Mix high-volume broad terms with specific long-tails

---

## Phase 3 — Visual Asset Assessment

### Screenshots

| Check | Pass/Fail | Note |
|-------|-----------|------|
| First 2 screenshots visible in search results without tapping? | | |
| Screenshot 1 shows the #1 value prop with text overlay? | | |
| Text overlay readable without zooming? | | |
| Consistent visual design/branding? | | |
| Shows actual UI, not abstract graphics? | | |
| Device frames used appropriately? | | |
| Feature sequence tells a coherent story? | | |

**Critical insight**: On Apple, only screenshots 1–2 (portrait) or 1 (landscape) show in search results. Screenshot 1 is the most important real estate in your entire listing.

### Preview Video (App Preview / Promo Video)

| Check | Pass/Fail |
|-------|-----------|
| Video exists? | |
| Shows real in-app experience (not marketing footage)? | |
| Hook in first 3 seconds? | |
| Captions/text overlays (most play muted)? | |
| Under 30 seconds? | |

**Apple rule**: App Preview must show real in-app footage. Marketing-only footage gets rejected.

### Icon

| Check | Pass/Fail |
|-------|-----------|
| Distinctive and recognizable at small size? | |
| No text (illegible at small size)? | |
| Consistent with brand? | |
| Stands out against common competitors? | |

---

## Phase 4 — Ratings & Reviews Analysis

| Metric | Current | Benchmark |
|--------|---------|-----------|
| Overall rating | | ≥4.0 required; ≥4.5 for competitive categories |
| Total review count | | Higher = stronger social proof |
| Rating velocity (recent reviews) | | Trending up = algorithm boost |
| % of reviews responded to | | |

**Extract themes from reviews**:
- Top 3 praise themes (what to feature in screenshots/description)
- Top 3 complaint themes (what to address in responses or roadmap)
- Any specific feature requests mentioned repeatedly

---

## Phase 5 — Competitor Gap Analysis

Identify 3 top-ranked competitors for your primary keyword. For each, note:
- Title and subtitle keywords you're missing
- Screenshot framing approaches that perform well
- Rating vs. yours
- Review count vs. yours

---

## Output: Rewrites

Produce ready-to-use rewrites for every metadata field, with rationale:

```
## Title (current → rewrite)
Current: MyApp
Rewrite: MyApp — Task Manager (28/30 chars)
Rationale: Adds primary keyword "task manager" which gets [volume] monthly searches

## Subtitle (current → rewrite)
Current: Manage your tasks easily
Rewrite: Organize Projects & Beat Deadlines (36/30 chars — trim to fit)
Rationale: Surfaces "organize projects" and "deadlines" — not in title, both in keyword field

## Keywords field (current → rewrite)
Current: tasks,todo,productivity
Rewrite: todo list,planner,daily planner,reminder,habit tracker,schedule,agenda
Rationale: Eliminates "tasks" (in title), adds 6 additional terms with search volume
```

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
- **Ignoring localization** — if your app is in multiple markets, metadata must be localized separately per store locale