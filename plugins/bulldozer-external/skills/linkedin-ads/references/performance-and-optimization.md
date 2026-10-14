# Reading Real Performance from Bulldozer OS and Optimization Guide

## Reading Real Performance from Bulldozer OS

Once the LinkedIn ad account is registered in the project, don't ask the client for a CSV export or read numbers off the Campaign Manager UI by hand — Bulldozer OS already imports the account and can answer most of the questions below directly:

- **Bring the account's data in**: an ad import job pulls the account's activity for a given window (`importFrom`/`importTo` as ISO-8601 instants — there's no separate "platform" or "start/end date" parameter, the account itself already carries the platform). Re-run it periodically to keep numbers current.
- **Check whether the Insight Tag is actually reporting, don't assume from "I installed it."** The OS can read the tag's real status directly from the ad account, and it's not a simple installed/not-installed — five states: no tag at all, a tag that exists but has never had a domain call back (expect this for 5–10 minutes right after install, it's not broken), a tag whose domains stopped reporting in the last week, one that's blocked on every known domain, or one actively receiving data. Read this before telling a client "tracking is live," and before blaming the campaign for a conversion count that's actually a dead tag.
- **Real CPM/CPC/CPL/conversions per campaign or per ad** — not a benchmark, the account's actual numbers, pulled per campaign (layer 1) or per individual ad (layer 3), including cost-per-conversion and reach/frequency. This is what should replace the benchmark ranges above once the account has spend history. **Don't read a six-month blur when the question is "how is this doing right now."** The analytics call defaults to a 180-day lookback when no explicit date range is passed — fine for a quarterly review, misleading for anything meant to reflect current performance (a CPL that's drifting, a campaign you just changed). Pass an explicit recent window (30–60 days) whenever the question is about the present, or the cost-per-conversion you read back is smoothed over six months and can hide a recent problem entirely.
- **The creative actually running** — the served ad's media, headline, body copy and CTA, matched to its own performance. Useful for the "kill the bottom performer" step in the launch plan below without relying on someone's memory of which ad is which.
- **The live targeting of a campaign, as LinkedIn is actually running it** — not just what was set at launch. This reads back from the campaign on every import, so it catches manual edits made directly in Campaign Manager after launch. A facet Bulldozer doesn't model by name is still preserved in the raw targeting payload, which stays the source of truth if the readable summary looks incomplete.
- **Who actually saw the ads — LinkedIn only, and it's a different question from targeting.** A separate demographic breakdown (job title, job function, seniority, company, company industry, company size, country, region) reads back who the campaign actually reached, day by day and creative by creative — this is the real answer to "is the right seniority/title being served," not the targeting read-back above, which only confirms what was configured. Three caveats keep it a delivery-shape report, not a second ledger: it caps at the top 100 values per creative per day and drops any segment under 3 events, it never reconciles against the cost/impression totals above — LinkedIn doesn't adjust the breakdown for over-delivery, so summing it under-counts the real total and shouldn't be used to audit spend — and it lags 12–24 hours behind the account with only 2 years of retention, against 10 for the account-level numbers. Same 180-day default window as everything else in this section applies here too if `from`/`to` are left unset — pass an explicit recent range for a current read.
- **Lead Gen Form submissions**, pulled from LinkedIn's own lead sync rather than a manual CSV download — each submission carries the standard contact fields plus which campaign, which form, and when.
- **Comments and reactions on Sponsored Content**, with each commenter/reactor resolved to a contact — a cheap way to spot which ad is generating real engagement, not just impressions.

If the account isn't registered yet, that's the first ABM/launch-week task, before any spend: registering it is what makes every number below real instead of guessed.

## Optimization Guide

**Check volume before reacting to anything below.** Comparing two ad angles, two audiences, or Cost Cap against Maximum Delivery on a few dozen conversions is reading noise as signal — wait for volume, or widen the campaign until you have it, before acting on any of these.

**If CPL is too high**:
1. Narrow audience (too broad targeting = low relevance)
2. Test new ad creatives (problem-led vs. outcome-led)
3. Switch to Lead Gen Form instead of landing page (typically 30–50% lower CPL)
4. Test lower-friction offer (content download vs. demo request)

**If CTR is low (<0.4%)**:
- Hook isn't stopping the scroll — test new opening line
- Visual is generic stock photo — test screenshot or data visualization
- Ad fatigue — check frequency (>3–4 per week per person = refresh needed). Campaign Manager's native frequency cap (Default or Customize, 3–30 impressions per member on a rolling 7-day window) shipped mid-2025 for brand-awareness campaigns only, and as of September 2026 that scope still hasn't been confirmed extended to Lead Generation or other objectives — don't assume you can set it on a lead-gen campaign without checking the account first. Where it's available, set it proactively rather than only diagnosing fatigue after the fact; where it isn't, fatigue still has to be read manually from frequency, same as before the feature existed.

**If form fill rate is low (<5% of LGF openers)**:
- Form asks too many fields — remove phone number
- Offer isn't specific enough — improve headline and description
- Privacy policy needs updating
