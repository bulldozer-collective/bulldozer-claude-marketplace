# Optimization Guide

**Before touching anything, pull the real numbers instead of eyeballing Ads Manager**: `bdzGetAdAnalytics` with `target=AD_ANALYTICS_TARGET_LAYER_1_ALL` (campaign level) or `AD_ANALYTICS_TARGET_LAYER_3_ALL` (ad level) returns cost, CPL, CPA and conversions per period. Three landmines in that data. First: the `conversions` field only counts terminal events (purchase, lead, complete_registration, etc.) and `costPerConversion` is already cost/conversions — a real CPA. The `conversionsPerType` breakdown additionally lists upper-funnel events (view_content, add_to_cart, initiate_checkout...) that are **not** included in `conversions` — never sum those into a CPA, they overlap with the terminal count. Second, a `custom_pixel_events` key can also show up: an unnamed aggregate of the account's custom pixel events, used only when their individual names couldn't be recovered — also excluded from `conversions` for the same reason, don't fold it into a total either. Third landmine: leave `from` off and you get a 180-day blended average, not the current picture — pass it explicitly (see Input) whenever the question is "how is this doing right now."

**On a Shopify account that isn't on Plus, don't take a sudden CAC/ROAS improvement at face value if it shows up after August 26, 2026.** Shopify's forced migration off `checkout.liquid` around that date silently dropped pixels and tags that lived in Additional Scripts and were never moved to Web Pixels — an account can look like it just got more efficient when it actually lost tracking on part of its funnel. Confirm the pixel/CAPI feed is still complete before crediting the campaign for the gain.

**Set a stop-loss before you need it, not after.** A playbook without an explicit "when do we pause" line spends until someone happens to notice. Agree a CPA ceiling with the client up front (a multiple of target, e.g. "2x for two consecutive weeks with real volume behind it"); when the account crosses it, the default action is pause the offending campaign, not "keep spending while we audit." Audit the landing page and creative with the account paused, then relaunch — don't fund the audit with live budget.

**If CPA is too high**:
1. Check landing page first — is the problem post-click?
2. Tighten audience (too broad = low-quality visitors) — or, if already on Advantage+ Audience, tighten the suggestions rather than reintroducing hard interest constraints
3. Test new creative angles (concept, not just copy)
4. Check ad relevance diagnostics (Quality Ranking, Engagement Rate Ranking, Conversion Rate Ranking) in Ads Manager — Meta only computes them once an ad has 500+ impressions, so don't read them on a fresh launch

**On a Leads objective, know which CPA you're actually reading.** `bdzGetAdAnalytics` gives you cost-per-lead in near real time, but a lead is not revenue — in B2B especially, the gap between the click and the deal closing can run weeks to months. A 30-day "CPA is too high" read on a lead-gen account is really a CPL-is-too-high read: legitimate grounds to fix the funnel above (landing page, audience, creative), but not grounds to declare the channel a bad investment before sales has had time to qualify and close what it produced. Don't wait on that lag to fix an obviously broken CPL — just don't confuse a cost-per-lead problem with a proven revenue problem.

**If CTR is low (<1% for feed, <0.5% for video)**:
- Creative isn't stopping the scroll → test new hooks
- Audience mismatch → try different targeting
- Ad fatigue → check frequency (>3x per week = refresh needed)

**If frequency is high (>3.5) with poor results**:
- Expand audience
- Refresh creative (new concepts, not just variations)
- Pause for 2–4 weeks if audience is exhausted
