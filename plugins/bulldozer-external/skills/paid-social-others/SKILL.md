---
name: |-
  paid-social-others
description: |-
  Run paid advertising on non-primary platforms — Reddit, TikTok, and Pinterest — with platform-specific creative strategy, targeting approach, budget allocation, and success benchmarks calibrated to each platform's audience and buying mode. Triggers on 'Reddit ads,' 'TikTok ads for B2B,' 'Pinterest advertising,' 'paid social beyond LinkedIn,' 'alternative paid channels,' 'we want to test TikTok,' or 'our Meta/LinkedIn costs are too high.' For LinkedIn or Google Ads, see audit-paid-ads. For audience architecture across platforms, see audience-architecture.
when-to-use: |-
  Run paid advertising on non-primary platforms — Reddit, TikTok, and Pinterest — with platform-specific creative strategy, targeting approach, budget allocation, and success benchmarks calibrated to each platform's audience and buying mode. Triggers on 'Reddit ads,' 'TikTok ads for B2B,' 'Pinterest advertising,' 'paid social beyond LinkedIn,' 'alternative paid channels,' 'we want to test TikTok,' or 'our Meta/LinkedIn costs are too high.' For LinkedIn or Google Ads, see audit-paid-ads. For audience architecture across platforms, see audience-architecture.
argument-hint: |-
  B2B SaaS tool targeting marketers and growth teams, €50K/quarter paid budget, currently only on LinkedIn. CPLs rising. Want to test Reddit and TikTok with €5K/month each and understand what 'success' looks like before committing.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Paid Social: Reddit, TikTok, Pinterest

> This is a Bulldozer skill. The teams that fail on Reddit, TikTok, and Pinterest all make the same mistake: they upload their LinkedIn creative and call it a test. Platform failure is almost always a creative mismatch, not a targeting failure. Each platform has a buying mode — the emotional posture users are in when they see your ad. Ads that match the mode convert. Ads that ignore it get scrolled past or brigaded.

You are a Bulldozer growth operator designing paid advertising strategy for alternative social platforms. Your job is to select the right platform(s) for the specific product and ICP, design platform-native creative, set up correct targeting, establish benchmark thresholds, and define the decision criteria for scaling vs. cutting.

## Input

`$ARGUMENTS` — product category and ICP, current paid channel mix and CPL benchmarks, budget available for platform testing, primary goal (brand awareness, demand capture, lead generation). If not provided, read available context files. Ask once if the product category and goal are completely absent.

## Output

A `paid-social-others-{company}.md` file with: platform selection rationale, per-platform strategy (targeting, creative brief, budget allocation, launch checklist), benchmark scorecard, and a go/no-go evaluation framework for each platform at 30 and 60 days.

**Produce on first invocation. Start with platform selection — the wrong platform wastes 30 days of test budget. Only proceed to execution once the selection rationale is documented.**

**A measurement note:** Bulldozer OS registers and measures ad accounts for Meta, LinkedIn, Google Ads, and Microsoft Ads — it has no registered-account path or analytics for Reddit, TikTok, or Pinterest. Every number in this playbook's benchmark tables and scorecards comes from each platform's own ads manager, read by hand or exported; there is no automated pull to fall back on for these three, unlike the reporting you'd get for a primary-platform campaign.

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

**These bands are a sanity check, not a target to defend.** A CPL only means something at a given sector, price point, and sales cycle — the same €40 CPL is excellent for a €50/month tool and irrelevant for an enterprise deal with a six-figure ACV. Read every number in this table as a rough order of magnitude to compare your own results against, never as a pass/fail line in isolation; the only comparison that actually decides anything is your own CPL here against your own LinkedIn CPL, at equal lead quality (see the scorecard below).

**The ranking above assumes the team can produce genuinely native creative for whichever platform it picks — if it can't, the ranking doesn't matter.** Reddit needs someone willing to write like a practitioner in a comment thread, not a marketer; TikTok needs a face or voice comfortable on camera, or a working relationship with a creator. A repurposed LinkedIn asset fails on both (see each platform's Creative Rules below). If the team already has strong short-form video production — an in-house creator, a founder who's unscripted on camera — and nobody with the patience to write Reddit-native copy, run TikTok first and Reddit second: the buying-mode fit above is real, but it's outranked by whether the team can actually make the format convincingly. Don't commit budget to a platform whose creative format nobody on the team can produce.

---

## Reddit Ads

### Why Reddit Works for B2B

Reddit's community structure means ads reach users who are actively researching in the decision phase — not passively scrolling. In relevant subreddits (r/SaaS, r/entrepreneur, r/marketing, r/webdev, r/projectmanagement), users discuss problems and compare tools. A well-placed Reddit ad reaches a buyer who is in research mode, not entertainment mode.

CPMs are lower than LinkedIn (€3–8 vs. €60–120), and post-click intent is 2–3x higher because of this research context.

For the full Reddit playbook — targeting, the pre-launch signal check, Reddit Max automated campaigns, creative rules, and budget and benchmarks — read `references/reddit-ads.md` before building any Reddit campaign.
---

## TikTok Ads

### Why TikTok Works (and When It Doesn't)

TikTok works for B2B when the ICP is reachable through behavioral targeting (marketers, founders, creators) rather than explicit professional targeting. The platform lacks LinkedIn's job title targeting — but it captures users in their personal browsing mode, when they're receptive to discovery in a way they aren't on LinkedIn.

TikTok works best for: tools targeting marketers, founders, small business operators, developers, or creative professionals.
TikTok does not work for: enterprise software procurement, anything requiring C-suite sign-off at large companies, or products with 6-month+ sales cycles.

For the full TikTok playbook — targeting for B2B, Smart+ (when to hand over, when not to), creative rules, the learning-phase trap, and budget and benchmarks — read `references/tiktok-ads.md` before building any TikTok campaign.
---

## Pinterest Ads

### Why Pinterest Works (and Why It Rarely Works for B2B SaaS)

Pinterest users are in planning mode — saving ideas for a purchase, project, or event that's often weeks or months away. That posture rewards visual, aspirational categories (home, wedding, fashion, food, DIY) where the product photographs well and the buying decision is personal, not organizational. It does not reward abstract B2B software: there is nothing to "pin" about a project management tool, and Pinterest's own search intent skews toward products and inspiration, not vendor comparison.

Treat Pinterest as **experimental only** for a B2B SaaS ICP, per the Platform Selection Framework above — run it after Reddit and TikTok have already validated the creative-market fit for the offer, not before, and only if part of the product has a genuine visual or lifestyle angle (a founder brand, a physical artifact of the work, a template/download that photographs). If none of that applies, do not open a Pinterest test — redirect the budget to scaling Reddit or TikTok instead.

For the full Pinterest playbook — targeting, Performance+ automated campaigns, creative rules, and budget and benchmarks — read `references/pinterest-ads.md` before building any Pinterest campaign.
---

## Cross-Platform Scorecard and the 60-Day Decision

Run all three tests on the same clock so they're comparable, and score them against each other, not just against their own targets — a platform that clears its own bar but loses to the other two on lead quality is not a platform to keep funding.

| Checkpoint | What to look at | Decision |
|------------|-----------------|----------|
| Day 15 | Creative-level signals only (hook rate, save rate, CTR) — no cost or lead judgment yet | Swap or kill underperforming creative; do not touch targeting or budget |
| Day 30 | Platform-specific benchmark table (per section above) | Per-platform go/no-go as documented; a platform below its own Stop line is cut regardless of what the others show |
| Day 60 | CPL and SQL conversion rate, benchmarked against your existing LinkedIn CPL and against each other | Scale the platform(s) with the best CPL-at-equal-quality; cut the rest — do not run more than two alternative platforms past day 60, attention and creative production split too thin |

**Build the scorecard as one table**, not three separate documents — spend, CPL, SQL rate, and the go/no-go verdict for Reddit, TikTok, and Pinterest side by side. The point of testing three platforms at once is to compare them on the same axis; three isolated reports make that comparison require memory instead of a glance.

### Before You Trust the Comparison

Don't read the day-60 CPL/SQL table as a ranking until each platform has produced enough conversions to mean something — a handful of leads on Reddit and a handful on TikTok can show wildly different SQL rates by chance alone. If a platform is still at a handful of qualifying conversions by day 60, extend its test another cycle rather than cutting or scaling on that number; a gap that looks decisive at a few conversions per side is usually noise, not signal.

For a product with a sales cycle longer than the 60-day test window, treat the day-60 verdict as provisional. CPL and SQL rate tell you whether the top of the funnel is healthy — they don't tell you whether Reddit-sourced or TikTok-sourced deals actually close, and B2B deals from a new channel often close slower or faster than LinkedIn-sourced ones for reasons that have nothing to do with ad quality. Tag lead source through to closed-won and re-check win rate once enough deals from the test have had time to move through the full cycle — a platform cut on day-60 SQL rate alone might have been the best source of revenue by day 150.

## Common Mistakes Across All Three Platforms

- **Uploading LinkedIn creative unchanged.** Every platform in this skill punishes creative that reads as corporate — Reddit brigades it, TikTok's algorithm suppresses it, Pinterest users scroll past it. Budget for platform-native creative production before launching, not after the first test fails.
- **Judging cost before judging creative.** CPC and CPM move before CPL does, and CPL moves before SQL rate does. A platform that looks expensive in week one may be fine once the creative stabilizes — use the day-15 creative checkpoint above before making a cost call.
- **Running all three platforms with the same landing page and offer.** A Reddit user in research mode, a TikTok user who just watched a 15-second hook, and a Pinterest user who saved a pin three weeks ago are not in the same buying moment — sending all three to the same generic page depresses conversion on all of them.
- **Scaling on volume instead of lead quality.** Alternative platforms often produce more leads per euro than LinkedIn at lower per-lead cost — that's the pitch for testing them. It's also the trap: volume without a downstream SQL conversion check just moves the qualification problem to sales.
- **Keeping a platform alive past its stop line out of sunk cost.** The stop thresholds in each benchmark table exist to end a test before it quietly becomes a permanent, mediocre budget line. If a metric crosses into the stop range, cut it at the next checkpoint — don't wait for it to recover on its own.
- **Flipping to the automated campaign type (Reddit Max, TikTok Smart+, Pinterest Performance+) before there's volume to feed it.** Each platform's automation needs real conversion history to learn from — a fresh test account has none. Run the manual setup in each section first; hand over to automation once the account clears the volume the platform itself needs, not on day one because the option is there.
- **Reacting to week-two or week-three numbers by editing budget, bid, or targeting instead of waiting for the day-15/30/45 checkpoints.** This is the most common way a test that would have worked gets killed by its own noise — and on TikTok it also restarts the platform's documented learning phase (see TikTok Ads above), turning a slow start into a genuinely broken test.
- **Running all three platforms because the budget allows it, not because the team can produce three genuinely native creative formats.** A shared account team stretched across Reddit copy, TikTok video, and Pinterest pins usually produces three mediocre versions instead of one or two that actually work — pick based on production capacity as much as the platform fit above, and add a platform only once the first one is running well.