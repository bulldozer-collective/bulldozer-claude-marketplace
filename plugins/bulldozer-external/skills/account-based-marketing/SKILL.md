---
name: account-based-marketing
description: Build Account-Based Marketing and Account-Based Experience playbooks: target account selection, multi-touch orchestration, account scoring, and personalization at scale. Triggers on 'ABM,' 'account-based marketing,' 'target account strategy,' 'ABX,' or 'named account campaign.' For individual deal review, see pipeline-deal-review. For LinkedIn targeting, see linkedin-ads.
when-to-use: Build Account-Based Marketing and Account-Based Experience playbooks: target account selection, multi-touch orchestration, account scoring, and personalization at scale. Triggers on 'ABM,' 'account-based marketing,' 'target account strategy,' 'ABX,' or 'named account campaign.' For individual deal review, see pipeline-deal-review. For LinkedIn targeting, see linkedin-ads.
argument-hint: B2B SaaS, $50k ACV, targeting 200 named enterprise accounts in financial services
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

This skill builds ABX — because coordinated multi-touch outperforms siloed campaigns at every ACV above $10k.

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

**Data sources for account selection**:
- CRM data: who's already in your pipeline or CRM without closing?
- 6sense / Bombora: intent data showing who is researching your category
- LinkedIn Sales Navigator: firmographic filters + account lists
- G2 / Capterra: reviewers and profile visitors from target companies
- Your own product data: freemium users, trial accounts from target companies

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
- Adjust account scoring model based on observed conversion patterns