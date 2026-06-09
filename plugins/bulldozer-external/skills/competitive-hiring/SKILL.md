---
name: competitive-hiring
description: Produce a monthly Competitive Hiring Signal Brief — track GTM headcount spikes, role distribution shifts, and geographic expansion signals across named competitors to anticipate strategic moves 3-6 months in advance. Triggers on 'competitive hiring signals,' 'what are competitors hiring for,' 'monitor competitor jobs,' 'hiring intelligence report,' 'competitive headcount analysis,' or 'what is competitor X building.' For full competitor profiling including product and messaging, see competitor-profiling. For battlecard creation, see battlecards.
when-to-use: Produce a monthly Competitive Hiring Signal Brief — track GTM headcount spikes, role distribution shifts, and geographic expansion signals across named competitors to anticipate strategic moves 3-6 months in advance. Triggers on 'competitive hiring signals,' 'what are competitors hiring for,' 'monitor competitor jobs,' 'hiring intelligence report,' 'competitive headcount analysis,' or 'what is competitor X building.' For full competitor profiling including product and messaging, see competitor-profiling. For battlecard creation, see battlecards.
argument-hint: Competitors to track: Notion, Coda, Confluence. Want a monthly brief on GTM and product hiring signals — are they investing in sales, support, engineering? Any new geographies? 3 competitors, pull from LinkedIn job postings.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Competitive Hiring Signals

> This is a Bulldozer skill. Job postings are the only public document where a competitor describes exactly what they need to build, sell, and market next — without spin. Marketing pages describe aspirations. Press releases describe accomplishments. Job postings describe gaps, and gaps reveal strategy. A competitor cannot launch an AI feature without first hiring ML engineers. They cannot enter EMEA without posting AE roles in London. They cannot build a partner ecosystem without hiring a Head of Partnerships. Every posting is a piece of a strategic puzzle that, assembled monthly, gives your team a 3-6 month preview of what's coming.

You are a Bulldozer intelligence analyst producing a monthly Competitive Hiring Signal Brief. Your job is to convert job posting patterns into strategic intelligence — not a list of job titles, but an interpretation of what those titles reveal about the next 12 months.

## Input

`$ARGUMENTS` — list of competitors to track, time window (default: last 30 days), specific signals to prioritize (GTM, product, geo expansion). If not provided, ask once: "Which competitors should I track, and are there specific signal types you care most about this month?"

## Output

A `hiring-signals-{month}-{year}.md` Competitive Hiring Signal Brief with: headcount velocity summary per competitor, signal interpretation by category, geographic signals, and a 3-bullet strategic response recommendation for GTM leadership.

**Produce on first invocation from LinkedIn RapidAPI data or provided job posting data.**

---

## Why Hiring Signals Are Underused Intelligence

Most CI programs focus on product announcements, pricing pages, and G2 reviews — information competitors control and sanitize. Job postings are different:

**They are commitments, not aspirations.** Posting a role costs money and signals internal budget approval. Unlike a blog post that describes a strategic direction, a job posting represents actual organizational investment.

**They are leading indicators, not lagging ones.** Product announcements come after the product is built. Job postings come before the team that builds it is hired. The average gap between a key hire and its resulting product launch: 6-12 months for engineers, 3-6 months for GTM roles. You are reading the roadmap before it exists.

**They reveal intent without PR polish.** The specific skills required in a job description reveal the technical bets being made. "Experience with FHIR standards" reveals healthcare vertical expansion. "Experience with Apache Kafka" reveals a platform architectural shift. These signals don't appear in press releases.

---

## Signal Taxonomy

Classify every job posting into one of four signal types:

### Signal Type 1: Product & Engineering
**What it reveals:** What they're building next.

High-signal role patterns:
- ML/AI engineers → AI feature development (6-12 month lead time before launch)
- Platform/API engineers → Ecosystem and integration play
- Security/compliance roles → Enterprise market entry (SOC2, HIPAA, FedRAMP expansion)
- Infrastructure engineers ("hyperscale experience") → Preparing for rapid growth / major customer
- Domain specialists (e.g., "experience in healthcare/fintech/logistics") → Vertical expansion bet

**3-role threshold rule:** One ML hire is background noise. Three ML hires in 90 days is a signal. Seven ML hires is a confirmed strategic bet. Do not interpret single postings as signals — wait for pattern confirmation.

### Signal Type 2: GTM Expansion
**What it reveals:** Where and how they're growing revenue.

High-signal role patterns:
- SDR/BDR ramp → Top-of-funnel investment, not yet profitable enough at current scale
- AE in new geography → Market entry (location is the signal, not the role)
- Vertical-specific AE ("Healthcare AE," "Financial Services Solutions Engineer") → Vertical go-to-market
- Head of Partnerships / Channel Account Manager → Building indirect go-to-market
- VP/Director of Revenue / CRO hire → GTM restructuring, new playbook incoming
- Marketing roles increasing faster than sales → Shifting to PLG or brand-led motion

**The GTM acceleration signal:** Track the ratio of sales roles to total new postings per quarter. When sales roles exceed 40% of total postings, the company is in active revenue acceleration — expect pricing pressure and increased aggression in shared accounts.

### Signal Type 3: Seniority Shifts
**What it reveals:** Company phase transition.

- Wave of senior/staff engineer postings → Product maturation, "build it right" phase (scaling a proven product, not experimenting)
- Wave of junior/mid hiring → Scaling execution of something proven, headcount expansion
- Executive hire (C-suite, VP) → Strategic direction change; check the executive's LinkedIn background to predict direction
- Director+ hiring outpacing IC hiring → Entering a structuring phase, preparing for next growth stage

**Executive background rule:** When a competitor hires a new CMO or CRO, the executive's last 2-3 companies reveal the playbook they'll import. A CMO from a PLG company will push PLG. A CRO from enterprise SaaS will build an enterprise motion. Check LinkedIn within 48 hours of the announcement.

### Signal Type 4: Geographic Expansion
**What it reveals:** Which markets they're entering.

- First international sales hire in a city → Market entry signal (London = EMEA, Singapore = APAC, Toronto = Canadian expansion)
- Engineering hub in a new city → Cost optimization or talent acquisition, not customer expansion
- Customer success roles in a new geo → Revenue is already there; they're building retention infrastructure
- Multiple geos opening simultaneously → Well-funded expansion, not a test

**First international hire rule:** The location of the first international AE reveals the competitor's expansion priority. They will build infrastructure (CS, SE, marketing) in that market 6-12 months after the first AE hire.

---

## Monthly Analysis Protocol

### Step 1: Data collection (Week 1 of month)
Pull all job postings from the last 30 days for each tracked competitor via:
- RapidAPI LinkedIn `/company/jobs` endpoint per competitor
- Company careers page (if RapidAPI data is incomplete)
- LinkedIn company page follower count for headcount velocity (compare month-over-month)

For each posting, log:
- Date posted
- Role title
- Location
- Seniority level (entry / mid / senior / director / VP / C-suite)
- Department (Engineering / Product / Sales / Marketing / CS / HR / G&A)
- Key skill requirements (extract 2-3 most distinctive terms)
- Signal type (1-4 from taxonomy)

### Step 2: Pattern detection
Apply the 3-role threshold. Only interpret patterns with 3+ postings in the same signal category. Flag single anomalous postings (e.g., a Head of Federal Sales hire from a non-federal player) separately as "watch signals" — not yet confirmed but worth monitoring.

### Step 3: Headcount velocity calculation
```
Monthly velocity = (current LinkedIn employee count - last month count) / last month count
```

Interpretation:
- < 2% monthly growth → Steady state
- 2-5% monthly growth → Active hiring, executing on existing plan
- > 5% monthly growth → Aggressive expansion, likely post-funding or post-enterprise deal
- Negative → Restructuring or financial pressure; check news for funding/revenue signals

### Step 4: Cross-reference
Before finalizing any interpretation, cross-reference against:
- Funding announcements (Crunchbase, Coresignal) — sudden hiring spike post-funding is expected, not strategic
- Product changelog / release notes — confirms or refutes engineering hiring signals
- Conference sponsorships / event presence — confirms geographic and vertical expansion signals

---

## Monthly Brief Format

```markdown
# Competitive Hiring Signal Brief — [Month Year]

**Competitors tracked:** [List]
**Analysis window:** [Date range]
**Data sources:** LinkedIn Jobs, RapidAPI, [other sources]

---

## Executive Summary (3 bullets)
• [Most important signal this month — what it means for GTM]
• [Second signal]
• [Third signal]

---

## Competitor Snapshots

### [Competitor 1]
**Headcount velocity:** [X%] MoM (was [Y%] last month)
**Total open roles:** [N] ([+/- vs last month])
**Dominant signal type:** [Product / GTM / Seniority / Geographic]

**Key signals this month:**
| Signal | Roles | Location | Interpretation |
|--------|-------|----------|----------------|
| [e.g., ML engineering push] | 7 ML/AI roles | US | Building AI feature layer, likely 6-9 months to launch |
| [e.g., EMEA expansion] | 3 AE roles in London | UK | Entering EMEA; expect pricing pressure on UK accounts |

**Watch signals (< 3 roles, worth monitoring):**
• [Single anomalous hire and what it might signal]

---

### [Competitor 2]
[Same structure]

---

## Cross-Competitor Trends
[Patterns emerging across multiple competitors — indicates market-wide shifts]

---

## Strategic Response Recommendations
**For Sales:** [Specific talk track update, battlecard addition, or territory implication]
**For Product:** [Signal relevant to roadmap prioritization]
**For Marketing:** [Positioning or messaging implication]

---
*Next brief: [Date] | Data cutoff: [Date]*
```

---

## Signal Interpretation Rules

**Rule: Distinguish hiring intent from execution.** A single VP of EMEA Sales hire signals intent to enter a market. Ten SDR hires in London signals execution of an already-committed market entry. The strategic implication is different — one gives you 12 months of lead time, the other gives you 3.

**Rule: Headcount freeze before layoffs.** The sequence is predictable: (1) posting velocity drops, (2) non-essential roles disappear, (3) backfill-only hiring, (4) freeze, (5) layoffs 2-4 months later. Catching a competitor in stage 1 or 2 is competitive intelligence that sales teams can use on calls immediately.

**Rule: The executive background check.** Within 48 hours of any Director+ hire at a competitor, check the new