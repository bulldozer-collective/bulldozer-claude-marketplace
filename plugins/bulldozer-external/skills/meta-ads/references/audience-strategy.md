# Audience Strategy

### Cold Audiences (New Prospects)

**Default in 2026 is broad, algorithm-led targeting, not manual interest stacking.** Meta's targeting engine (the "Andromeda" update) pushes most accounts toward **Advantage+ Audience**, which splits every input into two kinds: **hard controls** (location, language, minimum age, exclusions, Special Ad Category) that Meta will never cross, and **suggestions** (age, gender, detailed targeting, custom and lookalike audiences) that steer the system without binding it — an ad set with a narrow interest suggestion can still serve outside that interest if Meta's signal says it'll perform. Don't read a suggestion as a targeting guarantee when diagnosing why an ad reached someone unexpected. This works best once the account has real conversion signal — as a rule of thumb, once you're consistently over the 50-event learning-phase threshold (see Bid Strategy below), Advantage+ Audience with light suggestions usually outperforms manually stacked interests.

**If you still want to hand-build a cold audience** (new account, thin signal, or a niche the algorithm keeps missing):
- Layer 2–3 interests together (OR logic): one interest = too broad; 5+ interests = too narrow to scale.
- Combine interests with behavioral signals: "Engaged shoppers" + "Small business owners".
- **Expect a coarser interest list than a couple of years ago.** Meta consolidated most granular detailed-targeting interests (specific music genres, car models, diets, niche hobbies) into broader parent categories through 2025, with a hard cutoff of January 15, 2026 — any ad set still referencing a removed interest stopped delivering after that date. If a saved audience or old campaign template names an interest that no longer resolves, that's why; rebuild it from the current picker rather than assuming it's a bug.
- Treat this as a bridge to Advantage+, not a permanent structure — once the ad set has enough conversions, fold the interests back in as suggestions rather than hard constraints.

**No-interest broad targeting** (letting Advantage+ run with no suggestions at all) still works best on accounts with a mature pixel/CAPI feed — the algorithm needs real conversion volume to have something to optimize toward, not just traffic.

**Refuse to launch a brand-new account with zero suggestions.** An account that has never cleared even one learning-phase cycle has nothing for Advantage+ to learn from — running it wide open just spends into a random population while it looks for signal on its own dime. Feed it your best available seed (customer list, past lookalike, tight interest stack) as a starting suggestion, and only strip the suggestions out once the account has real conversion history to steer on.

### Warm Audiences (Retargeting)

| Audience | Window | Message approach |
|----------|--------|-----------------|
| All website visitors | 30–90 days | Broad social proof or reminder |
| Pricing page visitors | 7–14 days | Urgency, objection handling, comparison |
| Product/feature pages | 14–30 days | Case studies, demos |
| Video viewers (75%+) | 30 days | Move to consideration content |

**Exclusion rules** (always set these):
- Existing customers
- Recent converters (7–14 day window)
- Bounced visitors (<10 seconds on site)

### Lookalike Audiences

**Lookalikes still exist in 2026, but their role has narrowed.** Meta folded most of what lookalikes used to do into Advantage+ Audience's own expansion (the current UI still surfaces it as "Advantage+ lookalike" in some flows). A standalone, manually-sized lookalike ad set is worth building only when the seed contains information the pixel/CAPI feed has never seen — offline purchases, CRM-scored high-LTV segments, a closed-won list from sales. If the seed is just "everyone who converted on the website," Advantage+ Audience already has that signal and a separate lookalike ad set mostly duplicates it and splits your learning-phase volume for no gain.

**When it's worth it, build from best signals, in order of quality**:
1. Paying customers (highest quality — optimize for LTV)
2. Qualified leads or trial users
3. Website converters
4. Email list (all subscribers — lower quality than customers)
5. Video viewers (lowest quality — early use only)

**Lookalike size**: 1–2% for highest similarity, 3–5% for reach. Test both. Don't go above 5% — too diluted. The most common 2026 pattern is to feed the same seed to Advantage+ Audience as a suggestion rather than launching it as an isolated ad set — test that against a standalone lookalike ad set before committing to either.

### Building This Audience in Bulldozer OS

If this plan gets built through Bulldozer OS rather than by hand in Ads Manager, the ad-set targeting tool (`bdzCreateAdLayer2`/`bdzUpdateAdLayer2`) accepts a wider set of Meta facets than it used to: `LOCATION`, `LANGUAGE`, `AGE`, `GENDER`, `AUDIENCE_MATCHING_SEGMENT` (custom audiences — including ones created via `bdzCreateAudience`), and detailed targeting (`INTEREST`, `MEMBER_BEHAVIOR`, `INDUSTRY`, `JOB_TITLE`, `EMPLOYER`, `FIELD_OF_STUDY`, `SCHOOL`) — any other facet returns 400. **`LOCATION` is now mandatory on every Meta ad set created this way — there is no default country anymore.** Skipping it doesn't quietly target broad or fall back to the account's home market, the call fails. On an update, `audience` replaces the whole targeting spec rather than merging with what's there, so send the complete set every time, not just the facet you're changing.

The same tool's `meta` object is where the campaign objective becomes an actual ad set: `optimizationGoal` (`REACH`, `IMPRESSIONS`, `LINK_CLICKS`, `LANDING_PAGE_VIEWS`, `OFFSITE_CONVERSIONS`, `VALUE`, `LEAD_GENERATION`) drives what Meta optimizes delivery for, and it defaults to `LEAD_GENERATION` on an on-ad lead ad set or `REACH` otherwise — an ad set left on its default when the plan calls for the Sales objective silently optimizes for reach, not purchases. `LANDING_PAGE_VIEWS`, `OFFSITE_CONVERSIONS` and `VALUE` all require a pixel (`pixelId` + `conversionEvent`, e.g. `LEAD`, `PURCHASE`, `COMPLETE_REGISTRATION`) — the same pixel/CAPI setup this plan's Tracking Setup Checklist already calls for, not an extra step. A native on-ad lead form (`destinationType=ON_AD`) requires `pageId` and cannot be combined with a pixel.
