---
name: |
  audience-architecture
description: |
  Build the paid advertising audience system for a B2B GTM team — ICP translation into ad platform segments, lookalike seed construction, suppression list design, account-level scoring upload, and cross-platform audience synchronization. Triggers on 'audience architecture,' 'build our ad audiences,' 'LinkedIn audience setup,' 'lookalike audiences,' 'suppression lists,' 'our ads are reaching the wrong people,' or 'connect our CRM to ad targeting.' For paid campaign execution, see audit-paid-ads. For ICP definition, see icp-builder.
when-to-use: |
  Build the paid advertising audience system for a B2B GTM team — ICP translation into ad platform segments, lookalike seed construction, suppression list design, account-level scoring upload, and cross-platform audience synchronization. Triggers on 'audience architecture,' 'build our ad audiences,' 'LinkedIn audience setup,' 'lookalike audiences,' 'suppression lists,' 'our ads are reaching the wrong people,' or 'connect our CRM to ad targeting.' For paid campaign execution, see audit-paid-ads. For ICP definition, see icp-builder.
argument-hint: |
  Series B SaaS, €3M+ ARR, HubSpot CRM — LinkedIn + Google Ads. ICP defined but not connected to ad platforms. Reps say MQLs from paid are too small. Need to rebuild audiences from closed-won data and kill waste from non-ICP traffic.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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

2. **No negative ICP feeding exclusions.** Without suppression lists, ads reach students, competitors, job seekers, and companies that will never buy. Research across 300+ B2B accounts shows 36.1% of paid budget goes to non-ICP traffic without active exclusion lists.

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

---

## Step 2: Closed-Won Seed Construction

**Lookalike audiences seeded from closed-won data outperform all other B2B targeting approaches.** The algorithm finds prospects who resemble people who already paid — not people who filled a form.

**Seed construction protocol:**

**Step 1: Export from CRM**
- Filter: Deal Stage = Closed Won, Close Date = last 24 months
- Segment by deal size (separate seeds for SMB / mid-market / enterprise — mixing them dilutes precision)
- Minimum seed size: 100 companies for LinkedIn (300+ for meaningful lookalike quality)
- Include: company domain, contact email, first name, last name, country

**Step 2: Clean before upload**
- Remove one-off enterprise deals that don't represent your typical buyer profile
- Remove deals that churned within 90 days (these represent a bad fit despite closed-won status)
- Remove competitors who bought to test your product
- Deduplicate by domain

**Step 3: Segment the seeds**
Build separate lookalike seeds per segment — each produces a distinct lookalike:

| Seed | Filter | Produces |
|------|--------|---------|
| Top LTV customers | Closed-won, top 20% by lifetime revenue | Highest-value account lookalike |
| Fast-close deals | Closed-won, sales cycle < 45 days | Self-serve / high-intent buyer lookalike |
| Best-fit industry | Closed-won, primary ICP industry only | Vertical-specific lookalike |
| Expansion accounts | Customers who expanded MRR by 50%+ | Expansion-potential lookalike |

**Step 4: Upload and set lookalike size**
- LinkedIn: 1% lookalike = tightest match. Start at 1–2%, expand to 5% only after validating conversion rate
- Google: Similar Audiences (now AI-driven) from Customer Match upload
- Test: run 1% vs. 3% side-by-side for 30 days and compare cost per SQL, not cost per lead

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
- Supplement with platform-native exclusions: LinkedIn company size filter (<11 employees), audience category exclusions (students, job seekers)

**Suppression list naming convention:** `[Date]-[Type]-[Segment]` — e.g., `2026-Q1-Customers-AllAccounts`, `2026-Q1-ActivePipeline`, `2026-Q1-ClosedLost-NoFit`.

---

## Step 4: Audience Segment Library

Build these five core audience segments as named, reusable audiences in each ad platform:

**Segment 1: ICP-Fit In-Market (highest priority)**
Definition: Accounts matching ICP firmographic criteria + showing purchase intent signals
Construction: Company list upload (ICP-fit accounts from CRM/enrichment) + behavioral signals (website visitors, G2 profile views, pricing page visitors)
Expected conversion rate: 3–5x above baseline
Usage: Bottom-funnel campaigns, demo request CTAs, highest bid multipliers

**Segment 2: Closed-Won Lookalike (prospecting)**
Definition: 1–2% lookalike from closed-won customer seed
Construction: See Step 2
Usage: Top-funnel prospecting; use educational/awareness creative

**Segment 3: Competitor Displacement**
Definition: Companies confirmed using a named competitor product
Construction: Technographic list from Clay/Apollo filtered by competitor tool, combined with "alternatives" or "vs [competitor]" keyword intent
Usage: Competitive campaigns with explicit switching narrative; keep separate from generic prospecting

**Segment 4: Engaged Non-Converted**
Definition: Website visitors (excluding existing customers) who visited 2+ pages or spent 2+ minutes
Construction: Pixel-based retargeting + suppression of existing customers
Usage: Retargeting creative; message shifts from awareness to proof (case studies, ROI calculators)

**Segment 5: Buying Committee Expansion**
Definition: Multiple contacts from the same account showing engagement
Construction: LinkedIn Account Targeting — match accounts with 2+ engaged contacts from the same company
Usage: Multi-stakeholder campaigns; content for influencers and economic buyers at accounts where only the champion has engaged

---

## Step 5: Account Score Upload

**Connecting your ICP scoring model to ad platforms converts the score from a CRM field into a targeting input.**

**LinkedIn: Matched Audience + Bid Modifiers**
- Export Tier A accounts (ICP score ≥ 80) as company list → upload as matched audience → apply +50% bid modifier
- Export Tier B accounts (score 50–79) → upload separately → apply +20% bid modifier
- Export Tier C accounts (score <50) → add as exclusion audience

**Google: Offline Conversion Values (the most powerful mechanism)**
Instead of reporting all conversions at the same value (the default), upload tiered offline conversion values based on ICP score:
- ICP Tier A lead: conversion value = €500
- ICP Tier B lead: conversion value = €200
- ICP Tier C lead: conversion value = €50

Google's Smart Bidding then optimizes for high-value conversions, not conversion volume. Result: 30–50% lower cost per ICP-qualified lead.

**Setup:** CRM → sync qualified leads with ICP score → offline conversion upload via Google Ads API or Salesforce/HubSpot native integration → Smart Bidding switches to