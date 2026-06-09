---
name: |
  paid-social-others
description: |
  Run paid advertising on non-primary platforms — Reddit, TikTok, and Pinterest — with platform-specific creative strategy, targeting approach, budget allocation, and success benchmarks calibrated to each platform's audience and buying mode. Triggers on 'Reddit ads,' 'TikTok ads for B2B,' 'Pinterest advertising,' 'paid social beyond LinkedIn,' 'alternative paid channels,' 'we want to test TikTok,' or 'our Meta/LinkedIn costs are too high.' For LinkedIn or Google Ads, see audit-paid-ads. For audience architecture across platforms, see audience-architecture.
when-to-use: |
  Run paid advertising on non-primary platforms — Reddit, TikTok, and Pinterest — with platform-specific creative strategy, targeting approach, budget allocation, and success benchmarks calibrated to each platform's audience and buying mode. Triggers on 'Reddit ads,' 'TikTok ads for B2B,' 'Pinterest advertising,' 'paid social beyond LinkedIn,' 'alternative paid channels,' 'we want to test TikTok,' or 'our Meta/LinkedIn costs are too high.' For LinkedIn or Google Ads, see audit-paid-ads. For audience architecture across platforms, see audience-architecture.
argument-hint: |
  B2B SaaS tool targeting marketers and growth teams, €50K/quarter paid budget, currently only on LinkedIn. CPLs rising. Want to test Reddit and TikTok with €5K/month each and understand what 'success' looks like before committing.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Paid Social: Reddit, TikTok, Pinterest

> This is a Bulldozer skill. The teams that fail on Reddit, TikTok, and Pinterest all make the same mistake: they upload their LinkedIn creative and call it a test. Platform failure is almost always a creative mismatch, not a targeting failure. Each platform has a buying mode — the emotional posture users are in when they see your ad. Ads that match the mode convert. Ads that ignore it get scrolled past or brigaded.

You are a Bulldozer growth operator designing paid advertising strategy for alternative social platforms. Your job is to select the right platform(s) for the specific product and ICP, design platform-native creative, set up correct targeting, establish benchmark thresholds, and define the decision criteria for scaling vs. cutting.

## Input

`$ARGUMENTS` — product category and ICP, current paid channel mix and CPL benchmarks, budget available for platform testing, primary goal (brand awareness, demand capture, lead generation). If not provided, read available context files. Ask once if the product category and goal are completely absent.

## Output

A `paid-social-others-{company}.md` file with: platform selection rationale, per-platform strategy (targeting, creative brief, budget allocation, launch checklist), benchmark scorecard, and a go/no-go evaluation framework for each platform at 30 and 60 days.

**Produce on first invocation. Start with platform selection — the wrong platform wastes 30 days of test budget. Only proceed to execution once the selection rationale is documented.**

---

## Platform Selection Framework

**Pick platform based on buying mode, not audience size.**

| Platform | Primary buying mode | Best for | Avoid if |
|----------|--------------------|---------|---------:|
| **Reddit** | Research and peer validation — users actively seeking information and comparing options | B2B SaaS, dev tools, fintech, complex consumer purchases | Your ICP isn't on Reddit; your product has no relevant subreddits |
| **TikTok** | Discovery and entertainment — users open to being surprised by new products | SMB-facing SaaS, tools for marketers/founders/creators, consumer apps | Enterprise SaaS with 18-month sales cycles; ICP is 50+ years old |
| **Pinterest** | Planning and aspiration — users saving ideas for future action | E-commerce with visual products, home/lifestyle brands, wedding/event | B2B SaaS, developer tools, anything that doesn't photograph |

**2026 platform benchmarks:**

| Platform | CPM | CTR | CPC | Best ICP age |
|----------|-----|-----|-----|-------------|
| Reddit | €3–8 | 0.5–0.9% | €0.50–2.00 | 25–45, tech-savvy |
| TikTok | €7–11 | 0.9–1.3% | €0.60–1.50 | 18–34, creators/founders |
| Pinterest | €8–14 | 0.3–0.6% | €1.50–4.00 | 25–44, female skew |
| LinkedIn | €60–120 | 0.4–0.7% | €8–16 | All B2B |

For B2B SaaS targeting marketers, founders, or operators: **Reddit first, TikTok second, Pinterest experimental only.**

---

## Reddit Ads

### Why Reddit Works for B2B

Reddit's community structure means ads reach users who are actively researching in the decision phase — not passively scrolling. In relevant subreddits (r/SaaS, r/entrepreneur, r/marketing, r/webdev, r/projectmanagement), users discuss problems and compare tools. A well-placed Reddit ad reaches a buyer who is in research mode, not entertainment mode.

CPMs are lower than LinkedIn (€3–8 vs. €60–120), and post-click intent is 2–3x higher because of this research context.

### Reddit Targeting

**Subreddit targeting (most powerful lever):**
Build a list of subreddits where your ICP asks questions your product answers. Examples:
- GTM tool targeting RevOps: r/hubspot, r/salesforce, r/crm, r/sales, r/revenue_operations
- Dev tool: r/webdev, r/programming, r/devops, r/SaaS
- Marketing platform: r/marketing, r/SEO, r/PPC, r/digital_marketing

Layer targeting: **Subreddit + keyword + interest targeting** in combination. Example: targeting r/SaaS + keyword "project management tool" + interest "Software Developers" creates an ultra-qualified segment.

**Custom audiences:** Upload your email list for retargeting. Reddit pixel for site visitor retargeting.

**Exclude:** r/cscareerquestions, r/jobsearch (job seekers), r/personalfinance (wrong context).

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

---

## TikTok Ads

### Why TikTok Works (and When It Doesn't)

TikTok works for B2B when the ICP is reachable through behavioral targeting (marketers, founders, creators) rather than explicit professional targeting. The platform lacks LinkedIn's job title targeting — but it captures users in their personal browsing mode, when they're receptive to discovery in a way they aren't on LinkedIn.

TikTok works best for: tools targeting marketers, founders, small business operators, developers, or creative professionals.
TikTok does not work for: enterprise software procurement, anything requiring C-suite sign-off at large companies, or products with 6-month+ sales cycles.

### TikTok Targeting for B2B

TikTok has no job title targeting. Build ICP audiences through behavioral proxies:

**Interest layer stacking (B2B SaaS example — targeting marketing leads):**
"Entrepreneurship" + "Marketing" + "Technology" + "Business News" = approximates marketing professionals at growth companies

For buying authority signals, add: "Investing" + "Finance" — this skews toward people with budget decision authority.

**Lookalike audiences:** Upload your customer email list. Start with 1% similarity for tightest match. Expand to 2–3% once you've validated conversion rates. Lookalikes from paying customers outperform lookalikes from trial starters.

**Behavioral targeting over interest:** Users who recently searched for terms in your category or watched competitor review content show active intent signals — prioritize behavioral targeting before broadening to interest.

**Retargeting layer:** 75%+ video viewers, pricing page visitors, trial page visitors. This is where TikTok's cost efficiency compounds — first-touch awareness from broad targeting, conversion from precise retargeting.

### TikTok Creative Rules

**The non-negotiable rule: the creative must look like organic content.** Polished brand spots get punished by the algorithm. If your video was produced by an agency for YouTube, it will not work on TikTok. The benchmark is: if this posted organically, would it get engagement?

**Creative framework for B2B SaaS:**
```
Hook (0–3 seconds): State the problem or share a surprising fact — "If your team is still doing X manually..."
Problem agitation (3–15 seconds): Show or describe the pain they recognize
Solution reveal (15–30 seconds): Introduce the product as the answer — show the product in use, not a logo
Offer (final 3–5 seconds): Low-commitment CTA — "grab our free template" or "comment GUIDE for the playbook" rather than "book a demo"
```

**Spark Ads (most effective format for B2B):** Boost an existing organic post or creator-made content. Spark Ads maintain the original engagement count (likes, comments), which builds social proof. Spark Ads with genuine engagement outperform cold creative by significant margin — use them whenever an organic piece resonates.

**Native feeling signals:**
- Vertical video only (9:16)
- No logo in first 3 seconds
- Captions on every video (80%+ of TikTok is viewed silent)
- Creator voice or face-to-camera beats polished brand video
- Trending audio where appropriate — check TikTok Creative Center weekly

**What kills TikTok B2B performance:**
- Repurposing horizontal LinkedIn or YouTube creative
- Starting with a logo or brand name
- Corporate voiceover
- Hard sell CTAs in the first 15 seconds

### TikTok Budget and Benchmarks

Minimum test budget: €3,000–5,000/month (TikTok requires minimum €50/day per ad group)
Learning phase: 45 days (TikTok's algorithm needs more volume than Reddit)

| Metric | Target | Warning | Stop |
|--------|--------|---------|------|
| Hook rate (3-sec view ÷ impressions) | >30% | 20–30% | <20% |
| Video completion rate | >25% | 15–25% | <15% |
| CTR | >1.0% | 0.5–1