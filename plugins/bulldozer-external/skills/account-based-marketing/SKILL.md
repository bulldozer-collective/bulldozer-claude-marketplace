---
name: |-
  account-based-marketing
description: |-
  Build Account-Based Marketing and Account-Based Experience playbooks: target account selection, multi-touch orchestration, account scoring, and personalization at scale. Triggers on 'ABM,' 'account-based marketing,' 'target account strategy,' 'ABX,' or 'named account campaign.' For individual deal review, see pipeline-deal-review. For LinkedIn targeting, see linkedin-ads.
when-to-use: |-
  Build Account-Based Marketing and Account-Based Experience playbooks: target account selection, multi-touch orchestration, account scoring, and personalization at scale. Triggers on 'ABM,' 'account-based marketing,' 'target account strategy,' 'ABX,' or 'named account campaign.' For individual deal review, see pipeline-deal-review. For LinkedIn targeting, see linkedin-ads.
argument-hint: |-
  B2B SaaS, $50k ACV, targeting 200 named enterprise accounts in financial services
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# ABM / ABX Playbook

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on Account-Based Marketing and Account-Based Experience. Your goal is to design a playbook that orchestrates coordinated, personalized outreach across channels — turning target accounts into pipeline.

## Input

`$ARGUMENTS` — ICP, ACV, target account count, and primary ABM objective (e.g., "B2B SaaS, $80k ACV, 150 named enterprise accounts in healthcare, want to generate pipeline from cold accounts"). If not provided, read any available context files before asking. Only ask if ACV and target account profile are completely absent.

## Output

An `abm-playbook-{industry}.md` file with: account tiering model (Tier 1/2/3 with criteria), channel mix per tier, content personalization map, account scoring model, multi-touch orchestration sequence (4–8 weeks), success metrics per tier, and a 90-day launch roadmap.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## ABM vs. ABX — Know the Difference

**ABM (Account-Based Marketing)**: Marketing runs targeted campaigns to a named account list. Sales follows up. Often single-channel or campaign-focused.

**ABX (Account-Based Experience)**: Marketing and sales coordinate every touchpoint — ads, outbound, content, events, gifting — into a unified, orchestrated account experience. ABX treats the account as the customer, not an individual lead.

This skill builds ABX — coordinated multi-touch consistently outperforms a single-channel campaign once a deal is large enough to justify more than one seller-hour per account. Below that bar, a lighter single-channel ABM motion is the right call, not this playbook.

---

## Step 1: Account Tiering

Tier accounts before building the playbook. Different tiers get different investment levels.

### Tier 1 — Named Accounts (High Touch)

**Criteria**: Best-fit ICP, highest revenue potential, strategic value, or active buying signals.
**Size**: 10–50 accounts
**Investment**: Maximum personalization, direct outbound, gifting, 1:1 content, executive engagement
**Goal**: Pipeline within 90 days

### Tier 2 — Target Cluster (Moderate Touch)

**Criteria**: Strong ICP fit, good revenue potential, less urgency
**Size**: 50–200 accounts
**Investment**: Industry/persona-level personalization, paid ads targeting the account cluster, multi-step outbound
**Goal**: Generate awareness and early engagement within 90 days

### Tier 3 — Programmatic (Low Touch)

**Criteria**: ICP fit but lower priority
**Size**: 200–1000+ accounts
**Investment**: Intent-based ads, standard outbound sequences, content at industry level
**Goal**: Capture inbound demand and warm leads as they emerge

---

## Step 2: Identify Target Accounts

### Selection Criteria (Score 1–5 Each)

| Criterion | Weight | What to look for |
|-----------|:------:|-----------------|
| Firmographic fit (size, industry, geo) | 30% | Match to your ICP definition |
| Technographic fit (tools they use) | 20% | Complementary stack, competitor usage |
| Revenue potential (ACV estimate) | 25% | Can they afford and benefit from your product? |
| Buying signals (intent data, activity) | 15% | Website visits, job postings, news events |
| Strategic value (reference, logo, network) | 10% | Would this account open doors? |

**Treat this weighting as a starting framework, not an audited formula** — vendor models published in 2026 don't converge on a single split, and none publish their methodology. Use the table to get a first list moving, then replace the weights with whatever predicts closed-won in your own pipeline once you have enough data. Vendor comparison: `references/account-selection-sources.md`.

**Data sources for account selection**:
- CRM data: who's already in your pipeline or CRM without closing?
- 6sense / Bombora: intent data on who is researching your category — the two overlap rather than stack (6sense ingests Bombora's feed as an input), so pick one. Detail: `references/account-selection-sources.md`.
- LinkedIn Sales Navigator: firmographic filters + account lists
- G2 Buyer Intent: reviewers and profile visitors from target companies — as of early 2026 this is one consolidated dataset across G2, Capterra, Software Advice, and GetApp, not separate sources to check twice. Detail: `references/account-selection-sources.md`.
- Your own product data: freemium users, trial accounts from target companies
- Bulldozer OS Signals: `SIGNAL_TYPE_JOB_OFFERS_WATCHLIST` monitors a **named** account list directly; `COMPANY_GROWTH` / `DEPARTMENT_GROWTH` / `EMPLOYEE_DEPARTURE` *discover* candidates from broad filters instead of monitoring a list. Use the growth/departure signals to build the Tier 2/3 pool, reserve `JOB_OFFERS_WATCHLIST` for the locked Tier 1 list. Detail: `references/account-selection-sources.md`.

---

## Step 3: Account Scoring Model

Track engagement signals at the account level (not just individual contacts).

### Engagement Scoring

| Signal | Points |
|--------|:------:|
| Website visit (any page) | 1 |
| Pricing page visit | 10 |
| Product/features page | 5 |
| Content download | 5 |
| Email opened | 2 |
| Email click | 5 |
| Ad click | 3 |
| Demo request | 50 |
| Free trial signup | 40 |
| Executive visit to pricing page | 20 |

**Account score thresholds**:
- Hot: 50+ points in last 30 days — sales outreach same week
- Warm: 20–49 points — marketing nurture + sales alert
- Cold: <20 points — programmatic campaigns only

**Recording tiers and scores in Bulldozer OS**: the points table above lives outside the OS (CRM or spreadsheet) — there is no native numeric score field on an account. What the OS does hold is the account list itself: `bdzCreateLeadList` creates it, `bdzSourceLeadList` (type `LEAD_SOURCE_TYPE_FIND_PEOPLE`) populates it from firmographic filters, and `bdzUpdateLeadListLead` is where each account gets qualified — but only into three states (`TO_REVIEW` / `ACCEPTED` / `REJECTED`) plus a free-text note of up to 2000 characters. Encode the tier and score in that note (for example a `T1 — 62 pts` prefix), reserve `ACCEPTED` for accounts that cleared tiering, and `REJECTED` for accounts dropped from the program — `bdzListLeadListLeads` reads the list back by state.

---

## Step 4: Channel Mix Per Tier

### Tier 1 Playbook (1:1 Personalized)

| Channel | Tactic | Timing |
|---------|--------|--------|
| **Direct outbound** | Personalized 5-touch sequence (2 calls, 3 emails) | Weeks 1–3 |
| **LinkedIn ads** | Sponsored Content to all contacts at the account | Always on |
| **Executive gifting** | Relevant physical gift to economic buyer | Week 2 |
| **Custom content** | Account-specific one-pager, use case, ROI analysis | Week 2 |
| **Executive-to-executive** | CEO/founder intro email or LinkedIn message | Week 3 |
| **Event invitation** | Private dinner or exclusive content session | Week 4–8 |

### Tier 2 Playbook (1:Few Personalized)

| Channel | Tactic | Timing |
|---------|--------|--------|
| **Outbound sequence** | Industry-personalized 4-touch sequence | Weeks 1–2 |
| **LinkedIn ads** | Sponsored Content targeting all roles at accounts in tier | Always on |
| **Industry webinar** | Invite all contacts to industry-specific virtual event | Week 4 |
| **Content campaign** | Industry-specific case study or benchmark report | Week 3 |

### Tier 3 Playbook (1:Many Programmatic)

| Channel | Tactic | Timing |
|---------|--------|--------|
| **Paid ads** | LinkedIn + Google Display, industry-level targeting | Always on |
| **Standard outbound** | 3-touch sequence (2 emails, 1 call) | On intent signal |
| **Content syndication** | Industry content pushed to target accounts | Quarterly |

**Named-account targeting on LinkedIn (and Meta) ads is a real, verified capability, not an aspiration**: `bdzSearchAdTargetingEntities` (facet `AD_TARGET_FACET_EMPLOYER`) resolves a company name to the ad-network organization URN, which goes in the `audience` array of the ad group (`bdzCreateAdLayer2` — the campaign shell `bdzCreateAdLayer1` has no audience field at all). That's the mechanism behind "Sponsored Content to all contacts at the account" in the Tier 1/2 tables above.

For narrowing that audience to the buying committee (SENIORITY/JOB_FUNCTION/JOB_TITLE facets — there is no dedicated buyer-group facet), the Tier 2/3 topical layers (GROUP/SKILL/INTEREST/MEMBER_BEHAVIOR facets), retargeting already-engaged accounts (via `bdzListPlatformSegments` or the simpler `AD_TARGET_FACET_FOLLOWED_COMPANY`), and the Gmail/Yahoo deliverability gate before scaling Tier 3 volume, see `references/paid-targeting-mechanics.md`.

---

## Step 5: Multi-Touch Orchestration (8-Week Sequence — Tier 1)

```
Week 1:
  Day 1: SDR call (attempt 1, no voicemail)
  Day 2: Personalized email 1 (specific observation + pain)
  Day 3: LinkedIn connection request from AE
  Day 5: SDR call + voicemail

Week 2:
  Day 8: LinkedIn ad impression begins (account-level targeting)
  Day 9: Personalized email 2 (new angle + relevant case study)
  Day 11: AE sends personalized video message (Loom)

Week 3:
  Day 15: Gift ships (relevant physical item + handwritten note)
  Day 16: SDR call (mention gift)
  Day 17: Email 3 (gift follow-up + ROI question)

Week 4:
  Day 22: Executive outreach (CEO/VP sends 1:1 email or LinkedIn note)
  Day 25: Email 4 (invite to private event or exclusive content)

Week 5-8:
  Continue LinkedIn ads to all contacts
  Monitor account score for engagement signals
  Trigger immediate follow-up if pricing page or demo page visited
```

---

## Step 6: Content Personalization Map

| Tier | Personalization level | Content examples |
|------|----------------------|-----------------|
| Tier 1 | Account-specific | ROI analysis with their company name, custom use case brief, account-specific case study from same industry + size |
| Tier 2 | Industry-specific | "[Healthcare] Benchmark Report," "[FinServ] Case Study," industry landing page |
| Tier 3 | Persona-specific | "For VP of Operations," persona-level content, generic ROI calculator |

**Content that performs best in ABM**:
1. Industry benchmark reports (establish credibility + generate data-based conversation)
2. Account-specific ROI models (quantify the opportunity for their situation)
3. Peer case studies (same industry, similar size, same role)
4. Executive briefings / private dinner invitations (FOMO + exclusivity)

---

## Success Metrics Per Tier

| Metric | Tier 1 | Tier 2 | Tier 3 |
|--------|:------:|:------:|:------:|
| Account engagement rate | >60% | >30% | >15% |
| Meeting booked per account | >40% | >15% | >5% |
| Pipeline created per account | >$X (1x ACV) | >$X (0.5x ACV) | Track |
| Average sales cycle (vs. non-ABM) | -20% | -10% | Baseline |

**Leading indicators** (track weekly): Account score changes, page visits by tier, email reply rates, LinkedIn engagement by account.

**Treat the table above as a directional starting point, not a verified benchmark.** Published ABM engagement and meeting-rate figures vary two- to three-fold across vendors depending on how "engagement" is defined, and none of that is audited primary data. Use these numbers to calibrate the program in month one, then replace every cell with your own trailing-90-day baseline.

---

## 90-Day ABM Launch Roadmap

**Month 1 — Foundation**:
- Finalize account list (Tier 1/2/3 criteria applied)
- Set up account-level tracking in CRM and LinkedIn
- Build account scoring model and alert thresholds
- Create Tier 2/3 industry content assets
- Launch LinkedIn ad campaigns (all tiers)

**Month 2 — Outreach + Orchestration**:
- Launch Tier 1 personalized sequences
- Launch Tier 2 industry-personalized sequences
- Executive gifting for top 20 Tier 1 accounts
- First account score review: move hot accounts to Tier 1

**Month 3 — Convert and Optimize**:
- Host exclusive event for engaged Tier 1 accounts
- Review pipeline creation by tier
- Kill underperforming channels, double down on what works
- Adjust account scoring model based on observed conversion patterns.

---

## Common Mistakes

- **Tiering on firmographic fit alone.** An account that matches the ICP but has no recent, verifiable trigger is a filter, not a target — it earns a Tier 3 slot at most, never Tier 1 budget.
- **Cosmetic personalization.** Inserting the company name and contact name into a template is not account-specific content, and the recipient can tell the difference between a merge tag and a message written for them.
- **Running Tier 3 volume through the same sending domain as Tier 1 outreach.** One bad Tier 3 batch damages deliverability for the whole program, Tier 1 included.
- **Scoring engagement without closing the loop to sales.** An account that crosses the Hot threshold and doesn't get same-week outreach teaches the scoring model nothing — the alert has to change someone's behavior or it's decoration.
- **No exit for accounts that never engage.** A Tier 2/3 list that never gets re-tiered down, or dropped, just gets more expensive to run every quarter.
- **Sizing the tier structure to marketing's ambition instead of what sales can work.** A 200-account Tier 1 list with two AEs able to run maybe 30 accounts each isn't an ABX program — it's a plan nobody executes.

---

## Rules

- **No trigger, no Tier 1 slot.** Firmographic fit earns an account a place on the master list; a real, recent, verifiable event is what earns it 1:1 investment.
- **Tier down before you spend more.** An account that hasn't moved after a full cycle of Tier 1 treatment goes back to Tier 2 — reallocate the budget to accounts showing signal, not to hope.
- **Deliverability is a gate on Tier 3 volume, not a fix applied after the fact.** Confirm domain authentication and warm-up before scaling, not after open rates disappoint.
- **One ask per touch, every channel.** Email, LinkedIn message, or call — each touch in the sequence makes exactly one request.
- **The account score routes work, it doesn't keep score.** Its only job is telling sales when to act; if crossing a threshold never changes what anyone does, stop maintaining it.
- **A tier list without a stated "who this isn't for" isn't a target list.** If the Tier 1 criteria admit almost every account already in the pipeline, tighten them until they exclude someone.