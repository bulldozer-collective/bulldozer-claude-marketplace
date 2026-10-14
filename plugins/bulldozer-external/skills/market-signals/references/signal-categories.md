# Signal Categories — Tables, Sources and Bulldozer OS Notes

## Contents

- 1. Technology Signals
- 2. Regulatory Signals
- 3. Behavioral Signals
- 4. Competitive Signals (including Bulldozer OS notes)
- 5. Customer Signals
- 6. Macro / Economic Signals

### 1. Technology Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Model capability jumps | New AI models that change what's automatable in your domain |
| Infrastructure cost drops | API/compute costs falling that change the economics of a product category |
| Developer ecosystem shifts | New frameworks, tools, or APIs that enable products that weren't feasible |
| Platform changes | App store policy changes, API deprecations, platform consolidation |

**Sources**: AI research papers (arxiv.org), developer community discussions (HN, r/MachineLearning), startup activity in the space (AngelList, Crunchbase), OSS project growth rates.

### 2. Regulatory Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Draft legislation | Bills in committee stage, not yet law — 12–24 months from impact |
| Regulatory guidance | Agencies clarifying rules before formal rulemaking |
| Enforcement actions | What regulators are actively pursuing — signals future priorities |
| International adoption | Regulations enacted elsewhere spreading to new jurisdictions |

**Sources**: Federal Register (US), EUR-Lex (EU), FTC/SEC/NLRB press releases, law firm regulatory blogs, government RFI responses.

### 3. Behavioral Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Buyer behavior shifts | New procurement patterns, new evaluation criteria, new stakeholders involved in decisions |
| Talent / hiring patterns | What skills companies are hiring for — signals strategic direction |
| Usage pattern changes | How end users are using adjacent tools differently |
| Vocabulary shifts | New language buyers are using to describe problems (precedes product category awareness) |

**Sources**: LinkedIn job postings (track changes over time), Reddit and Slack community discussions, customer support tickets, sales call recordings, G2 review language changes. For hiring patterns on a named watchlist of accounts already tracked in the project, Bulldozer OS's Signals feature turns this into a standing feed instead of a manual LinkedIn check — see the Bulldozer OS note under Competitive Signals below.

**One job posting is not a hiring signal — don't rate it that way.** A single opening at a single company is noise; it takes a cluster (several roles, or the same role reposted, or paired with a growth signal) before "they're hiring for X" earns Moderate confidence, let alone Strong. `SIGNAL_TYPE_RECRUITMENT_CAMPAIGN` builds this into the tool itself — its config takes a `minJobCount`/`maxJobCount` threshold rather than firing on any single posting — a useful default to borrow even when reading job boards by hand instead of through the OS.

### 4. Competitive Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Strategic pivots | Incumbents quietly changing product direction or messaging |
| Funding patterns | Where VC money is moving in the category |
| M&A activity | Acquisitions that signal what incumbents see as strategic |
| Pricing changes | Competitors repricing — up (confidence) or down (pressure) |
| Hire patterns | Executive hires that signal new product bets |

**Sources**: Press releases, LinkedIn job postings (executive hires), Crunchbase funding, product changelog tracking, pricing page history (Wayback Machine).

**Bulldozer OS — only two of the Signal types actually watch a named list of accounts.** Of the five Signal types that look like account-watching tools, only `SIGNAL_TYPE_COMPETITOR_RELATIONSHIP` (config takes `linkedinCompanyUrls`/`linkedinProfileUrls` or `restrictToCompanies`/`restrictToProfiles` — companies you name directly) and `SIGNAL_TYPE_JOB_OFFERS_WATCHLIST` (config takes a `companies` list, or a `sourceType` that reads an existing list from a connected CRM — `csv`, `hubspot_list`, `pipedrive_filter`, `hubspot_company_list`, `pipedrive_org_filter`) genuinely accept a positive list of companies to watch. Watching one isn't passive, either: `COMPETITOR_RELATIONSHIP`'s own field description says it discovers employees at the named companies and queues LinkedIn connection requests on your behalf, surfacing a prospect only once they accept — real outbound activity drawing on that LinkedIn account's weekly connection budget like any other campaign (see `outbound-linkedin`), not a read-only watch. Expect a multi-day lag between setup and the first lead, and weigh it against whatever else is already sending connection requests from the same account. `SIGNAL_TYPE_EMPLOYEE_DEPARTURE`, `SIGNAL_TYPE_COMPANY_GROWTH`, `SIGNAL_TYPE_DEPARTMENT_GROWTH`, and `SIGNAL_TYPE_RECRUITMENT_CAMPAIGN` are different in kind: their config only takes broad ICP filters (company size, industry, location, department, growth min/max, job-count thresholds — `EMPLOYEE_DEPARTURE` adds only an `excludedCompanyUrls` exclusion, no inclusion field), so they *discover* companies matching a criteria set rather than *monitor* a list you already track. Don't call the discovery types a "watchlist" — that word belongs to the two that actually take a company list. And note that `JOB_OFFERS_WATCHLIST` doesn't read the project's own tracked competitors (`bdzGetCompetitors`/`bdzListCompanies`) automatically — their names or domains have to be copied into `companies` by hand, or already exist as a HubSpot/Pipedrive list. Each signal type carries its own per-lead provider cost (`bdzListSignalTypes` lists all 32 types with their config and credits) and feeds a lead list rather than a report — worth setting up only once the scan is narrow enough to name accounts, not for an open macro scan of a domain. Competitors already followed in the project (`bdzGetCompetitors`) also carry public-ad history (`bdzListPublicAds` — targeting, timing, and messaging shifts, a real substitute for manually screenshotting competitor ads) and a per-channel competition-intensity score (`bdzGetProjectCompetitionIntensity` — SEO/SEA/CRO/GEO/Meta/LinkedIn/social scored 0–100, plus an estimated monthly media budget range) worth checking before assuming a pricing or budget shift is new. None of this replaces Crunchbase/press releases for funding and M&A — Bulldozer OS has no tool for that.

**Spend the credits on conviction, not curiosity.** The 32 signal types are not priced alike: `bdzListSignalTypes` shows per-lead cost spread across roughly 0.5 to 12 credits — a ~24x range — with the three technology-adoption types (`TECH_ADOPTION`, `TECH_DISPLACEMENT`, `AI_ADOPTION`) sitting at the top of that range, and each of the optional enrichment add-ons (email/phone/company-registry lookup, tech detection, homepage content) stacking further credits per lead on top of whatever the base type costs. Don't enroll the expensive company-level types just to "keep an eye on things" while a scan is still exploratory — reserve them for the small number of named accounts where the strategic bet is real enough to justify the ongoing spend, and turn a refresh config off once the scan has answered its question rather than letting it run because it's already set up.

**If you actually call `bdzCreateSignal`, two call-mechanics mistakes cause most of its real-world failures.** First, `targetPersonas`/`deliverPersonas` take the closed `SignalPersona` enum value (list it with `bdzListSignalPersonas` — e.g. `SIGNAL_PERSONA_HR_DIRECTOR`), never the human-readable label the OS displays for it ("HR Director"): passing the label returns 400 naming the persona as unknown. Second, `bdzCreateSignal` returns 409 when a signal with that exact `name` already exists *in the project* — it's a name collision, not a config clash — so retrying a failed call with the same name fails again for a different reason; check `bdzListSignals` for an existing signal with that name (or use a new one) before retrying rather than assuming the first attempt silently didn't go through. `leadListId` is mandatory and immutable once set: the lead list has to already exist in the project.

### 5. Customer Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Churn to unexpected alternatives | Customers leaving for tools not previously on your radar |
| Feature requests clustering | Multiple unrelated customers requesting the same thing — may indicate a market shift |
| Language changes in conversations | Customers using new vocabulary to describe their problems |
| New stakeholders in deals | A new persona entering the buying process |

**Sources**: CRM notes and call recordings, churn surveys, NPS verbatims, support ticket tagging, sales meeting notes. If the connected CRM is HubSpot, deal and company records (stage, close date, days-to-close, deal amount, industry, headcount) are queryable directly through the CRM connector instead of requiring a manual export — useful for spotting deal-shape changes or new stakeholders in the closed-won/closed-lost data itself. That query path needs its own OAuth scope (`crm.hubsql.execute`, plus reporting scopes) beyond what a schema-read HubSpot connection grants by default — a permission error naming those scopes means the connection needs re-authorizing (or an admin's sign-off), not that the CRM isn't HubSpot or that the query is malformed. Bulldozer OS does not hold a loss-reason field by default, so "churn to unexpected alternatives" still needs a CRM-side note or field, not an OS one.

### 6. Macro / Economic Signals

| Signal Type | What to Look For |
|-------------|-----------------|
| Budget pressures | Macro conditions shifting IT/marketing/ops budgets |
| Workforce changes | Remote work shifts, labor market changes that affect your buyer's priorities |
| Industry consolidation | M&A in your customers' industries changing who the buyers are |
| Supply chain / infrastructure changes | Changes in the infrastructure your product runs on |
