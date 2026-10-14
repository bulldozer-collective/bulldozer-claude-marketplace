---
name: |-
  competitive-hiring
description: |-
  Produces a Competitive Hiring Signal Brief: tracks competitor headcount growth, role distribution shifts, geographic expansion, and hiring spikes to anticipate strategic moves 3-6 months in advance.
when-to-use: |-
  Trigger when the user asks: 'what are our competitors hiring for?', 'monitor competitor job postings', 'detect competitor hiring spikes', 'competitive headcount analysis', 'what is [competitor] building based on their hiring?', 'track competitor team expansion'. Not for full competitor profiling → use competitor-profiling. Not for battlecard creation → use battlecards. Not for our own hiring plan → use org-design-hiring-roadmap.
argument-hint: |-
  Competitors to track: Notion, Coda, Confluence. Want a monthly brief on GTM and product hiring signals — are they investing in sales, support, engineering? Any new geographies? 3 competitors, pull from LinkedIn job postings.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Competitive Hiring Signals

> This is a Bulldozer skill. Job postings are the only public document where a competitor describes exactly what they need to build, sell, and market next — without spin. Marketing pages describe aspirations. Press releases describe accomplishments. Job postings describe gaps, and gaps reveal strategy. A competitor cannot launch an AI feature without first hiring ML engineers. They cannot enter EMEA without posting AE roles in London. They cannot build a partner ecosystem without hiring a Head of Partnerships. Every posting is a piece of a strategic puzzle that, assembled monthly, gives your team a 3-6 month preview of what's coming.

You are a Bulldozer intelligence analyst producing a monthly Competitive Hiring Signal Brief. Your job is to convert job posting patterns into strategic intelligence — not a list of job titles, but an interpretation of what those titles reveal about the next 12 months.

## Input

`$ARGUMENTS` — list of competitors to track, time window (default: last 30 days), specific signals to prioritize (GTM, product, geo expansion). If not provided, ask once: "Which competitors should I track, and are there specific signal types you care most about this month?"

## Output

A `hiring-signals-{month}-{year}.md` Competitive Hiring Signal Brief with: headcount velocity summary per competitor, signal interpretation by category, geographic signals, and a 3-bullet strategic response recommendation for GTM leadership.

**Produce on first invocation from the Bulldozer OS Job Offers Watchlist signal — the only one that can be scoped to a named competitor list, see Step 1 — or from job posting data the user provides directly.**

---

## Before You Add a Competitor to This Brief

Every competitor on this month's list costs a slot in a document someone is supposed to read and act on within the week (see the "brief goes stale" mistake below). Before adding one, or before carrying last month's list forward unchanged, check three things:

- **Are they actually in your deals?** A competitor that shows up in a market map or a G2 comparison grid but never in your own closed-lost reasons or live pipeline isn't costing you revenue — tracking their hiring produces intelligence nobody will act on. Don't assume a standard CRM field names the competitor: HubSpot's own closed-lost reason field is free text with no fixed options, and no default HubSpot property records which named competitor a deal was lost to — a field that does exists only when a client's RevOps team added it themselves (a custom property, or a picklist value inside their own lost-reason field), and its name is different on every portal. Search the client's actual portal for it before writing anything down, and fall back to the sales team's own naming (a shared list, a pipeline review note) if no such field exists — not from "everyone who sells something similar."
- **Are they large enough for a headcount signal to mean anything?** The 3-role threshold and the growth-rate bands in Step 3 assume a company big enough that a handful of hires is noise, not a lurch. A pre-seed competitor with 8 employees posting 2 roles reads as 25% headcount growth — technically correct, strategically meaningless. For a very small or stealth competitor, treat every hire as a watch signal and never as a headline number.
- **Full monthly write-up, or a lighter quarterly check?** Not every tracked competitor deserves the same rhythm. Collection stays continuous either way — the Signals system runs on its own — but the interpretive write-up is what costs a reader's time. A competitor with no growth-signal movement and a static careers page for two straight months doesn't need a monthly deep read; drop it to a quarterly check-in and spend the slot on one that's actually moving.

If none of the tracked competitors clear the first check this month, say so and produce a shorter brief — a document that only covers real threats is worth more than one padded to look complete.

---

## Why Hiring Signals Are Underused Intelligence

For the rationale — why job postings are commitments, leading indicators and unspun intent, and the exception to each — read `references/why-hiring-signals.md` when you need to justify the method to the reader.

---

## Signal Taxonomy

Classify every job posting into one of four signal types:

For the full taxonomy — the four signal types with their high-signal role patterns, the 3-role threshold rule, the GTM acceleration signal, the executive background rule, the title inflation trap and the first international hire rule — read `references/signal-taxonomy.md` before classifying postings.

---

## Monthly Analysis Protocol

### Step 1: Data collection (Week 1 of month)
Bulldozer OS's own hiring intelligence lives in its Signals system (`bdzListSignalTypes`, `bdzCreateSignal`), not in a manual API pull — but check each type's config fields before reaching for it: only one of the 32 signal types actually accepts a list of named companies.

- **Job Offers Watchlist** (`SIGNAL_TYPE_JOB_OFFERS_WATCHLIST`) — the only signal with a `companies` field (name or domain; names match more reliably than domains). This is the backbone of the brief: set it up once with the tracked list, then read its lead list for the window instead of re-pulling data. Worth knowing before configuring it — `cadenceHours` (how often each company is re-checked, defaults to 24h), `maxJobsPerCompanyPerDay` (defaults to 3: in a real spike month a competitor can post more than that in a single day, so raise it rather than assume the count is complete), `firstRunLookbackDays` (bounds a newly added competitor's initial backfill to 30 days by default, so it doesn't dump its whole posting history on day one), `jobTitleInclude` to narrow to one department this month, and `enablePersonaTargeting` to resolve the hiring manager behind a posting as a contact instead of a company-level lead only. Typing the tracked list by hand isn't the only option: `sourceType` (`hubspot_list`, `hubspot_company_list`, `pipedrive_filter`, `pipedrive_org_filter`, or `csv`) with `sourceListId` points the signal at an existing CRM list instead of the `companies` field, and `sourceDynamicSync` keeps it synced to that list automatically — worth using when the tracked-competitor list already lives in HubSpot or Pipedrive (see "Before You Add a Competitor to This Brief"), so the brief's list and the CRM's list never drift apart.
- **Recruitment Campaign, Republished Job Offers, Company Growth, Department Growth, Employee Departure — none of these can be pointed at this brief's tracked list.** Their config fields are exclusively discovery filters (company size, industry, location, a posting-count band via `minJobCount`/`maxJobCount`, a headcount-growth band via `growthMin`/`growthMax`) with no field to name a company. Each answers "which companies matching this profile are doing X," never "is Notion doing X" — a filter aimed at the market segment your competitors sit in might resurface one of them by coincidence, and might not. Their real use is upstream of this brief, not inside it: run one occasionally against your own ICP filters to surface a competitor you aren't tracking yet (feeds "Before You Add a Competitor," never a line in a monthly snapshot). Don't configure any of them expecting a per-competitor readout — see Steps 2 and 3 for what actually covers the ground they were assumed to cover.
- Company careers page, read directly, if a competitor is not resolvable by Job Offers Watchlist (rare, but happens for very small or stealth companies).

Each signal writes its leads into a lead list (`bdzListLeadListLeads`) — read that list for the window instead of re-pulling data. For each posting, log:
- Date posted
- Role title
- Location
- Seniority level (entry / mid / senior / director / VP / C-suite)
- Department (Engineering / Product / Sales / Marketing / CS / HR / G&A)
- Key skill requirements (extract 2-3 most distinctive terms)
- Signal type (1-4 from taxonomy)

### Step 2: Pattern detection
Apply the 3-role threshold by counting each tracked competitor's own postings inside the window — group the Job Offers Watchlist leads collected in Step 1 by signal category (Product/GTM/Seniority/Geo) per competitor, and count. Only interpret patterns with 3+ postings in the same category for the same competitor. Flag single anomalous postings (e.g., a Head of Federal Sales hire from a non-federal player) separately as "watch signals" — not yet confirmed but worth monitoring. Don't reach for Recruitment Campaign's `minJobCount` to do this counting instead: it screens the whole market for companies clearing a posting threshold, it has no notion of "this month's tracked list" to apply the count to (see Step 1).

### Step 3: Headcount velocity calculation
No Bulldozer OS signal reports a growth percentage for a company you name — Company Growth and Department Growth only discover companies that already sit inside a growth band you set, they don't look up one you ask about (see Step 1). For a tracked competitor's headcount velocity, read `bdzListLinkedInCompanies` instead: `employeeCount` and `followerCount` per company. Both are only as fresh as the record's last sync (`updatedAt`) — and nothing syncs a stored LinkedIn company record on its own. Before the first brief, set up a `bdzCreateLinkedInRefreshConfig` per tracked competitor (`targetType: COMPANY`, `periodicity: MONTHLY`, `targetUrl` the competitor's LinkedIn company URL): skip this and `employeeCount` stays frozen at whatever it read the day the competitor was added, and every month's diff reads 0% regardless of what actually happened. A `COMPANY` config refreshes the company page, its employees, and its posts on the same monthly schedule, and it consumes jetons on an ongoing basis — a project that runs out has its refresh configs disabled, so budget for it the same way as the Job Offers Watchlist signal in Step 1. Even refreshed monthly, this is still a single snapshot, not a trend — the growth rate itself is still count-over-count math the brief has to do on its own, across months, without a human reopening a file for it: log each tracked competitor's current `employeeCount` in the **`note` field** of a workspace file (`bdzUpdateWorkspaceFile` to write it, `bdzGetWorkspaceFile` to read it back next month), never in the file's own text content. Bulldozer OS has no tool that reads a workspace file's stored content back — `bdzGetWorkspaceFile` and `bdzListWorkspaceFiles` return only metadata (name, content type, note, summary), never the body; a file created with `bdzCreateWorkspaceTextFile` can only be re-read by a human redownloading it from the app. `note` is the one field a tool call both writes and reads, and it's capped at 5,000 characters — enough for a compact one-line-per-competitor-per-month log on a normal tracked list, but budget it: over a long enough series (several competitors, two-plus years), it can approach the cap, at which point drop to logging only last month's value per competitor rather than the full history.

Don't swap in `bdzListLinkedInEmployees`'s `totalElement` (the number of employee profiles Bulldozer OS has actually stored for the company) as a substitute for `employeeCount` partway through a competitor's tracked history. The two aren't just different readings of the same thing, they drift apart over time: a `COMPANY` refresh config keeps `employeeCount` current, but it does not refresh the stored employee list behind `totalElement` — that only moves if a `bdzCreateLinkedInEmployeeListJob` search is run and its results re-synced. On a real tracked company checked twice three weeks apart, `employeeCount` moved (updated by its refresh config) while `totalElement` stayed frozen at the same value from its last scrape — the gap between the two widened over that window rather than holding steady, confirming this isn't one-off noise. `totalElement` counts how many profiles a scrape captured, not LinkedIn's own reported headcount — it isn't a more accurate number, just a different, independently-stale one, and a brief that changes which field it reads mid-series will report a "velocity" that's really a change of measurement, not a change at the competitor.

There is no equivalent per-department headcount figure for a named competitor either — Department Growth has the same discovery-only limit as Company Growth. Read department-level movement from the posting mix already collected in Step 1 (which department the postings cluster in) rather than expecting a headcount percentage for it.

Interpretation:
- < 2% monthly growth → Steady state
- 2-5% monthly growth → Active hiring, executing on existing plan
- > 5% monthly growth → Aggressive expansion, likely post-funding or post-enterprise deal
- Negative → Restructuring or financial pressure; check news for funding/revenue signals

These bands are a starting heuristic, not a market benchmark — recalibrate them against the tracked competitors' own history after two or three months of briefs, since normal growth rate varies hard by company size and sector.

### Step 4: Cross-reference
Before finalizing any interpretation, cross-reference against:
- Funding announcements (Crunchbase, Coresignal) — sudden hiring spike post-funding is expected, not strategic
- Product changelog / release notes — confirms or refutes engineering hiring signals
- Conference sponsorships / event presence — confirms geographic and vertical expansion signals

---

## Monthly Brief Format

The full Markdown template for the monthly brief (executive summary, competitor snapshots, cross-competitor trends, strategic response recommendations) is in `references/brief-template.md`; read it before writing the brief and follow its structure.

---

## Signal Interpretation Rules

For the seven signal interpretation rules (intent vs. execution, headcount freeze before layoffs, executive background check, reposted listings, hypothesis vs. fact, absence of signal, sales confidentiality), read `references/interpretation-rules-and-mistakes.md` (section "Signal Interpretation Rules") before writing any interpretation.

---

## Common Mistakes

For the list of common mistakes to check the brief against, read `references/interpretation-rules-and-mistakes.md` (section "Common Mistakes") before sending.

---

## Quality Checklist

Before sending the brief, run the full checklist in `references/quality-checklist.md` and confirm every item.