# Reddit Ads — Targeting, Creative, Budget

### Reddit Targeting

**Subreddit targeting (most powerful lever):**
Build a list of subreddits where your ICP asks questions your product answers. Examples:
- GTM tool targeting RevOps: r/hubspot, r/salesforce, r/crm, r/sales, r/revenue_operations
- Dev tool: r/webdev, r/programming, r/devops, r/SaaS
- Marketing platform: r/marketing, r/SEO, r/PPC, r/digital_marketing

Layer targeting: **Subreddit + keyword + interest targeting** in combination. Example: targeting r/SaaS + keyword "project management tool" + interest "Software Developers" creates an ultra-qualified segment.

**Fewer, tighter subreddits beat a long list cast wide.** 2026 agency guidance converges on 3–5 highly relevant subreddits consistently outperforming a broad list — Reddit's delivery is reported to weigh "conversation velocity" (how actively a thread is being engaged with right now) when it decides where to serve, which rewards concentration over reach. This isn't confirmed on a Reddit help page directly (WebFetch is blocked on Reddit's own domains this session, as it has been for months in this environment) — treat it as a targeting discipline to apply, not a platform mechanic to cite as documented fact.

**Custom audiences:** Upload your email list for retargeting. Reddit pixel for site visitor retargeting — pair it with the Reddit Conversions API (server-side) and enable Advanced Matching (hashed email/phone) rather than the pixel alone; Reddit's own guidance is that pixel-only tracking under-counts conversions lost to ad blockers and browser privacy settings, and CAPI is what feeds the automated bidding below. Reddit is also piloting its own first-party attribution tool (multiple 2026 agency sources call it "dual attribution," still in beta) meant to show Reddit's role earlier in the path than last-click alone — unread directly and unconfirmed as GA, so keep the CAPI-fed conversion event as your primary source until it ships out of beta.

**Exclude:** r/cscareerquestions, r/jobsearch (job seekers), r/personalfinance (wrong context).

### Before Launch: Confirm the Signal, Then Leave It Alone

**Confirm tracking end to end before the first euro of spend, not after the first disappointing report.** Fire a test conversion and check it lands with the right event name and value — not just that the pixel is "installed." A campaign that looks expensive at day 15 is indistinguishable, from the ads manager alone, from a campaign whose conversion event never fired at all; rule out broken tracking before diagnosing creative or targeting.

**Once the 30-day learning window starts, the only lever worth touching is creative.** Resist nudging budget, bidding, or subreddit targeting mid-flight because early numbers look soft — each edit risks restarting the read on a test that already needs the full 30 days. If the day-15 creative checkpoint (see the cross-platform scorecard below) says the hook is wrong, swap the creative — that's the one edit worth making before day 30. Anything else waits for the checkpoint.

### Reddit Max: Automated Campaigns

Reddit's automated campaign type (Max) left beta in early 2026: it optimizes targeting, bidding, and creative selection together instead of the manual layered targeting above, and reporting includes audience-persona insights you don't get from a manual build. In Reddit's own split testing it ran meaningfully cheaper and more efficient than business-as-usual manual campaigns — but "automated" still needs the Pixel/CAPI setup above feeding it real conversion events, and a manual build is still the right call while you're establishing which subreddits and angles work at all (Max can't tell you *why* something converts, only that it does). Practical bidding sequence once you do use it: run "Lowest Cost" bidding for the first 7–14 days to let the system learn your conversion event, then switch to a capped strategy once a stable target CPA emerges — don't leave it on uncapped "Lowest Cost" once you have a number worth defending.

### Reddit Creative Rules

**The most important rule: your ad must survive as an organic post.** Before publishing, read 10 recent posts in the subreddit you're targeting. If your ad would feel out of place as an organic post — too promotional, too polished, too brand-centered — rewrite it.

**Format by objective:**
- Awareness / education: Text ad (no image required) with a conversational headline and a question
- Traffic: Promoted post with an image + headline that mirrors how users title their own posts
- Conversion: Conversation ad format — appear directly in comments of relevant threads

**Reddit creative brief template:**
```
Format: Image + headline (or text-only)
Headline: [State the problem the user is probably experiencing, as they would say it]
Body: [2–3 sentences solving the problem, not pitching the product — end with a soft CTA]
Tone: Direct, helpful, no hype — write as a practitioner, not a brand
NOT: "Our award-winning platform helps teams achieve 10x..."
YES: "If your pipeline reports take 2 hours to pull, here's how teams with your stack fixed it."
```

**What gets brigaded (negative comments, downvotes):**
- Obvious promotional language ("award-winning," "industry-leading," "transform your business")
- Claims without evidence
- Generic copy that clearly wasn't written for the community

### Reddit Budget and Benchmarks

Minimum test budget: €2,000–3,000/month (€100/day minimum for meaningful data)
Learning phase: 30 days

| Metric | Target | Warning | Stop |
|--------|--------|---------|------|
| CTR | >0.6% | 0.3–0.6% | <0.3% |
| CPC | <€2.00 | €2–4 | >€4 |
| CPL | <€50 (SMB) / <€150 (mid-market) | 1.5x target | 3x target |
| Spam/downvote comments | <5% of impressions | 5–10% | >10% |

**30-day go/no-go:** If CPL is within 3x of your LinkedIn CPL at equal lead quality (measure by SQL conversion rate), continue. Reddit leads typically have lower volume but equal or higher downstream conversion rates.
