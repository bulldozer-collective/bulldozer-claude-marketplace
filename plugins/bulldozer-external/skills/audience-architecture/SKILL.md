---
name: |-
  audience-architecture
description: |-
  Build the paid advertising audience system for a B2B GTM team — ICP translation into ad platform segments, lookalike seed construction, suppression list design, account-level scoring upload, and cross-platform audience synchronization. Triggers on 'audience architecture,' 'build our ad audiences,' 'LinkedIn audience setup,' 'lookalike audiences,' 'suppression lists,' 'our ads are reaching the wrong people,' or 'connect our CRM to ad targeting.' For paid campaign execution, see audit-paid-ads. For ICP definition, see icp-builder.
when-to-use: |-
  Build the paid advertising audience system for a B2B GTM team — ICP translation into ad platform segments, lookalike seed construction, suppression list design, account-level scoring upload, and cross-platform audience synchronization. Triggers on 'audience architecture,' 'build our ad audiences,' 'LinkedIn audience setup,' 'lookalike audiences,' 'suppression lists,' 'our ads are reaching the wrong people,' or 'connect our CRM to ad targeting.' For paid campaign execution, see audit-paid-ads. For ICP definition, see icp-builder.
argument-hint: |-
  Series B SaaS, €3M+ ARR, HubSpot CRM — LinkedIn + Google Ads. ICP defined but not connected to ad platforms. Reps say MQLs from paid are too small. Need to rebuild audiences from closed-won data and kill waste from non-ICP traffic.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Audience Architecture

> This is a Bulldozer skill. Most B2B paid teams have an ICP document. Almost none have connected it to their ad platform. An ICP sitting in Notion changes nothing — it only changes your cost per SQL when it becomes a Customer Match list, a suppression audience, and a set of offline conversion values that tell the algorithm who to find more of.

You are a Bulldozer growth operator building B2B paid audience architecture. Your job is to translate the ICP into ad platform segments, build seed audiences from closed-won CRM data, design suppression lists that eliminate waste before it happens, and connect account-level scoring to the algorithms that decide who sees the ads.

## Input

`$ARGUMENTS` — primary ad platforms (LinkedIn, Google, Meta), CRM (HubSpot / Salesforce), ICP definition or CRM segment parameters, closed-won deal volume (# of customers for seed quality), current audience setup status. If not provided, read available context files. Ask once if the ad platforms and CRM are completely absent.

## Output

A `audience-architecture-{company}.md` file with: ICP-to-platform translation map, audience segment definitions (ICP-fit, competitor displacement, in-market), closed-won seed construction protocol, suppression list architecture, account score upload procedure, and a quarterly refresh calendar.

**Produce on first invocation. Start with the suppression lists — eliminating waste is the fastest win.**

---

## Why Most B2B Audience Targeting Fails

Three structural mistakes produce the "wrong people" problem:

1. **Targeting individuals instead of accounts.** With 6–10 stakeholders per B2B deal, a champion scoring high means nothing if the account is a terrible fit. Score at the account level, target at the buying committee level.

2. **No negative ICP feeding exclusions.** Without suppression lists, ads reach students, competitors, job seekers, and companies that will never buy. The only figure circulating for how much budget this wastes traces back to a single agency's self-reported account sample, not an audited study — treat "a meaningful double-digit share of spend" as the honest claim, not a precise percentage.

3. **MQL signals feeding the algorithm instead of revenue signals.** If your offline conversions are form fills, the algorithm optimizes for people who fill forms — not people who pay. Closed-won customer data is the only signal that teaches the algorithm to find buyers.

---

## Step 1: ICP-to-Platform Translation

**The ICP needs to become four operational artifacts, not a document:**

| ICP Dimension | LinkedIn Translation | Google Translation |
|---------------|---------------------|-------------------|
| Industry | Company industry filter | Customer Match + in-market audiences |
| Company size | Company headcount filter | Customer Match bid adjustments |
| Seniority | Job seniority (VP, Director, C-suite) | N/A (no professional targeting) |
| Job function | Sales, Marketing, Operations, etc. | N/A |
| Funding stage | N/A (use company list upload) | N/A |
| Technographic | N/A (use third-party list — Clay/Apollo) | N/A |
| Geographic | Location targeting | Location targeting |
| Negative ICP | Exclusion audiences | Negative Customer Match + audience exclusions |

**LinkedIn-specific:** Build a matched audience list from your top 200–500 ICP-fit accounts (company name list upload via Campaign Manager → Audiences → Create Audience → Company List). This enables company-level targeting regardless of who clicks.

**Google-specific:** Upload ICP-fit companies as Customer Match audiences for bid adjustments (+30–50% bid multiplier on accounts matching ICP). Negative Customer Match is less precise than LinkedIn — layer it with audience exclusions (competitors, job seekers, students).

**If you're launching the LinkedIn side through Bulldozer OS:** the facet labels in the table above (seniority, job function, industry, company size) aren't free text you can type into `bdzCreateAdLayer2`/`bdzUpdateAdLayer2` and hope for the best — resolve the exact accepted value first via `bdzSearchAdTargetingEntities` (LinkedIn only; any other platform returns 400). A label that doesn't match one of the returned values exactly (trimmed, case-insensitive) is rejected outright with a 400, not loosely matched. Eight facets — seniority, job function, language, growth rate, years of experience, age, gender, company size — return their full list without a query; everything else (job title, industry, skill, interest…) needs a `query` string, the taxonomy being too large to enumerate. Two facets that look like a place to plug in a custom audience — Matched Audiences and Dynamic Segment — never return a lookup at all: they only accept a raw LinkedIn segment URN you already hold, never a typed label. For Dynamic Segment, that URN is what `bdzCreateWebsiteRetargetingAudience` hands back once a retargeting audience exists (Segment 4, Step 4) — not a value you go hunting for elsewhere.

---

## Step 2: Closed-Won Seed Construction

**Neither platform still offers a manual "lookalike audience" you build from a seed and a size slider.** LinkedIn retired classic Lookalike Audiences on February 29, 2024; Google retired Similar Audiences in August 2023 (new ones stopped generating from May 2023). What replaced both is an automated, AI-driven expansion the algorithm runs on its own from a seed you supply — you no longer pick the percentage. The seed itself is still the highest-leverage input you control: closed-won CRM data as the seed outperforms a form-fill seed, because the algorithm is expanding from people who paid, not people who converted on a lead magnet.

For the full seed construction protocol (CRM export filters and platform-specific minimum seed sizes, cleaning rules before upload, the four-seed segmentation table, and the upload steps for LinkedIn and Google, including the Bulldozer OS route), read `references/seed-construction.md` before building any seed.

---

## Step 3: Suppression List Architecture

**Suppression is the highest-ROI targeting action in B2B paid.** Every dollar not spent on someone who will never buy is a dollar that can be spent on someone who might.

**Required suppression lists (build all four before launching any campaign):**

**1. Existing customers**
- Source: CRM → Contacts, filter Lifecycle Stage = Customer + Company type = Customer
- Update: Automatically when a deal closes (build a CRM workflow that exports to a shared list)
- Platform upload: LinkedIn matched audience (company list), Google Customer Match (email list)
- Refresh cadence: Weekly

**2. Active pipeline**
- Source: CRM → Deals, filter Stage = Discovery through Negotiation
- Purpose: Don't run ads to accounts your reps are already working — it creates channel confusion and inflates pipeline attribution
- Refresh cadence: Weekly

**3. Closed-lost (poor fit)**
- Source: CRM → Deals, Closed Lost Reason = Not ICP / Wrong Size / Wrong Industry
- Exclude these permanently — they represent confirmed non-fit
- Exclude separately from Closed Lost Reason = Timing / Budget — those re-enter the market

**4. Negative ICP**
- Source: Define negative criteria from ICP (company size <20, student domains, competitor domains, wrong industries)
- Build as a company exclusion list — upload all known instances of these companies
- Supplement with platform-native exclusions: LinkedIn's `AD_TARGET_FACET_COMPANY_SIZE` only accepts nine fixed bucket values (1, 2-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10001+) — there's no free-text "<11 employees" threshold to type in. Build the exclusion as one facet entry carrying both `1` and `2-10` as OR'ed values with `excluded: true` (the schema OR's multiple values within the same facet). Don't stack this exclusion in the same AND rule as an employer facet (`AD_TARGET_FACET_EMPLOYER`/`_PAST`/`_ALL`) — industry/company-size and employer targeting conflict and the call is rejected with a 400. Plus audience category exclusions (students, job seekers).

**Where Bulldozer OS reaches these, and where it doesn't yet:** all four lists above are company/account-level exclusions on LinkedIn — consistent with the account-based targeting this whole document argues for — and `bdzCreateAudience`'s `COMPANY_LIST` audience type (LinkedIn only) is built for exactly that shape. Populating it is confirmed, not a guess: `bdzAddAudienceMembers` takes a `companies` array for a `COMPANY_LIST` audience (companyName, websiteDomain, emailDomain, organizationUrn, pageUrl, country — at least one of name/organization/domain/page required) instead of the people-shaped `members` field used for a contact list; sending the wrong one for the audience's type is refused with a 400. Build and refresh all four LinkedIn lists through this path rather than by hand. None of this reaches Google either way — Customer Match exclusions (the email-list side of list 1) go through the Google Ads account regardless, `bdzCreateAudience` only creates on LinkedIn or Meta.

**Suppression list naming convention:** `[Date]-[Type]-[Segment]` — e.g., `2026-Q1-Customers-AllAccounts`, `2026-Q1-ActivePipeline`, `2026-Q1-ClosedLost-NoFit`.

---

## Step 4: Audience Segment Library

Build these five core audience segments as named, reusable audiences in each ad platform. **Five is close to the practical ceiling, not a starting point to build past.** Each additional segment splits budget and dilutes the volume any single audience needs to leave a platform's learning phase — refuse to add a sixth without retiring one first, and if a client already runs a dozen ad-hoc audiences today, the first move here is consolidating them into this library, not adding this library on top.

For the definition, construction and usage of each of the five core segments (ICP-Fit In-Market, Closed-Won Expansion, Competitor Displacement, Engaged Non-Converted, Buying Committee Expansion) and the LinkedIn delivery check for Segment 1, read `references/segment-library.md`.

---

## Step 5: Account Score Upload

**Connecting your ICP scoring model to ad platforms converts the score from a CRM field into a targeting input.**

For the full account-score upload playbook (LinkedIn tiered campaigns, Google native audience bid modifiers with the Bulldozer OS tool calls, offline conversion values, setup constraints, pre-launch checks and the data checkpoint), read `references/account-score-upload.md` before touching bids or conversion values.

---

## Step 6: Refresh Calendar and Cross-Platform Consistency

For the refresh cadence table per asset and the cross-platform consistency check, read `references/refresh-calendar.md` at every refresh.

---

## Common Mistakes

- **Reading performance on whatever window the reporting tool defaults to, then blaming the audience structure.** If you pull spend and conversions from Bulldozer OS (`bdzGetAdAnalytics`) without setting the date range explicitly, it reports the trailing 180 days by default — a cost-per-lead pulled that way is smoothed over six months and will not show a structure change from three weeks ago, good or bad. Pass an explicit `from`/`to` (30–60 days, matched to what you're evaluating) before concluding the new segments underperform or overperform; the signal has to match the change you're trying to see, or you're diagnosing the wrong window. Before blaming the audience at all, check that same response's per-account `freshness` entry (`upToDate`, `dataThrough`, `lastAttemptErrorKind`) — `upToDate: false` means the window you asked for is missing data, often an expired or missing token, not that performance actually dropped; chasing an audience fix for a stalled import burns the week you needed to diagnose the real problem.
- **Judging a new audience structure inside the first two weeks.** In B2B, the gap between a click and a closed-won deal is measured in weeks or months — reading cost-per-lead at day 10 evaluates the wrong metric entirely. Wait for at least one full sales cycle, or judge on a leading indicator you've already validated correlates with revenue.
- **Applying a benchmark CPL or ROAS from outside the account.** A cost per lead that's healthy for a €50k/year enterprise deal is a disaster for a €2k self-serve plan. Every threshold in this architecture is relative to the account's own history, never an industry number pasted in from a blog post.
- **Touching a campaign that's mid-learning-phase.** Uploading a new seed, changing a suppression list, or adjusting bids on a campaign that changed significantly in the last 7–14 days resets the clock. Stack enough of these and the campaign never leaves learning.
- **Treating the creative as a footnote to the targeting work.** A perfectly built audience architecture still loses to a mediocre one running better ads. Budget the same rigor for message and format testing as for the seed and suppression work above — targeting narrows who sees it, creative decides whether they act.
- **Optimizing toward form fills instead of revenue.** If the signal feeding the algorithm is "filled a form" rather than "became a customer," every optimization pass makes the account better at finding people who fill forms — the opposite of the goal.
- **Building the architecture once and never touching it again.** See Step 6 — an audience system with no refresh calendar degrades quietly, and by the time performance drops enough to notice, the seeds and suppression lists have been stale for a quarter or more.

---

## Rules

- **No conclusion below the minimum volume.** Don't compare audiences, tiers, or seeds on a handful of conversions. Below roughly 30 events, wait — the difference you're seeing is noise, not signal.
- **Suppression before expansion.** Never launch a new prospecting audience before the four suppression lists in Step 3 are live. Spend saved from exclusion funds the next test.
- **Revenue signal over volume signal, always.** Closed-won data and ICP-weighted conversion values feed the algorithm; MQL counts and raw form-fill volume do not — not even temporarily "to get started faster."
- **One lever at a time during learning.** A campaign in its learning window gets patience, not a second simultaneous change to react to.
- **A stop rule beats a hope.** Every segment and every tier needs a written condition for pausing it. An architecture with no kill criteria spends until someone notices by accident.