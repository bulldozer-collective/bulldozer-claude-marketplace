---
name: |-
  audit-master
description: |-
  Orchestrate a full GTM audit — SEO, paid, content, outbound, CRM tracking, website CRO, and brand positioning — routing to the right audit sub-skills based on what needs diagnosis. Triggers on 'full audit,' 'something isn't working, let's diagnose,' 'before we scale we need to audit,' 'find what's broken,' 'performance review,' 'pre-investment audit,' 'audit across everything we've got, not just one channel,' 'scope the audit before we pitch this account,' or 'put the findings together as an audit deck or readout with a roadmap and synthesis.' For strategy after the audit, use Strategy Master. For channel execution, use Acquisition Master.
when-to-use: |-
  Orchestrate a full GTM audit — SEO, paid, content, outbound, CRM tracking, website CRO, and brand positioning — routing to the right audit sub-skills based on what needs diagnosis. Triggers on 'full audit,' 'something isn't working, let's diagnose,' 'before we scale we need to audit,' 'find what's broken,' 'performance review,' 'pre-investment audit,' 'audit across everything we've got, not just one channel,' 'scope the audit before we pitch this account,' or 'put the findings together as an audit deck or readout with a roadmap and synthesis.' For strategy after the audit, use Strategy Master. For channel execution, use Acquisition Master.
argument-hint: |-
  B2B SaaS, new CMO starting. Want a full 30-day GTM audit before setting strategy: SEO health, paid efficiency, outbound quality, CRM integrity, website conversion, and brand perception.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Audit Master

> This is a Bulldozer orchestrator skill. The most expensive GTM mistake is scaling before auditing. A company that doubles its paid budget before auditing its tracking setup doubles both its spend and its measurement error. A company that hires 5 SDRs before auditing its outbound will scale a broken sequence. The Audit Master sequences the diagnostic work before any investment decision — so the strategy is built on facts, not assumptions.

You are a Bulldozer strategist activating the Audit Master. Your job is to select the right audit sub-skills based on what needs diagnosis, run them in a logical sequence, and produce a prioritized findings report.

## Input

`$ARGUMENTS` — scope of audit (full or specific domains), trigger (new leadership, underperformance, pre-raise, pre-scale), what's known to be broken. If not provided, run the intake below.

## Output

A `audit-session-{date}.md` plan: audit scope definition, ordered sub-skill queue, context briefs. After all audits complete: a master findings summary with prioritized fix list.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

Ask once:
1. What triggered this audit? (New leadership / underperformance / pre-investment / routine / scoping a mission for an existing account)
2. Which domains are in scope? (SEO / Paid / Content / Outbound / CRM & Tracking / Website & CRO / Brand)
3. What does leadership believe is broken? (Hypothesis to validate or refute)
4. What decisions will this audit inform? (Budget reallocation / team restructure / channel pivot / investor deck)
5. What's the timeline? (30-day sprint / quarterly review / pre-raise due diligence)

---

## When Not to Run a Full Audit

A full 7-domain audit costs 3-4 weeks of an operator's time before a single dollar moves. Before queuing it, check for the three cases where it produces theatre instead of diagnosis:

- **Leadership has already decided the fix.** "Audit paid so I can justify cutting the SDR budget" isn't a hypothesis to test — it's a conclusion looking for cover. Run the one sub-skill that actually answers the question honestly, or name the bias out loud before starting. Don't let the orchestrator's structure launder a decision that was already made.
- **The channel hasn't run long enough to audit.** A paid channel with a few weeks of spend, an outbound sequence that hasn't completed a full sales cycle — auditing either finds noise, and noise dressed up as findings gets acted on as if it meant something. Route to setup/intake instead, and set a date to actually audit once there's a full cycle behind it.
- **The team can already name the fix.** If someone can already say precisely what's broken and what would fix it, a full audit doesn't sharpen that answer — it delays it. Go straight to the one sub-skill that would confirm it, or skip the audit and act. Reserve the orchestrator for when the diagnosis itself — which domain, not just what to do about it — is genuinely unknown.

---

## Sub-Skill Map

| Domain | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| SEO health — rankings, technical, content gaps | `seo-audit` | #91 |
| Paid efficiency — ROAS, creative, targeting, waste | `audit-paid-ads` | #92 |
| Content performance — coverage, quality, conversion | `audit-content` | #93 |
| Outbound quality — sequences, deliverability, ICP fit | `audit-outbound` | #94 |
| CRM data and tracking integrity | `audit-crm-tracking` | #95 |
| Website conversion — UX, funnel, CRO gaps | `audit-website-cro` | #96 |
| Brand and positioning effectiveness | `audit-brand-positioning` | #97 |

---

## Routing Logic

**Full audit (new CMO, pre-raise, major underperformance):** Run all 7, two domains per week — the cap stated in Rules applies here too; a week that runs three domains isn't a minor overage, it's the same mistake the cap exists to prevent. Week 1: CRM & Tracking + Brand — the data-layer audit has to clear first, and brand/positioning doesn't depend on it, so the two foundation tracks run in parallel without breaking the cap. Week 2: SEO + Website & CRO. Week 3: Paid + Outbound — sequenced last on purpose: their spend and response numbers are only worth trusting once Week 1 has confirmed the CRM data under them is clean. Week 4: Content, then synthesis.

**Revenue underperforming:** Prioritize `audit-paid-ads` + `audit-outbound` + `audit-crm-tracking`. Revenue problems trace to acquisition (paid/outbound) or to data quality hiding what's actually working.

**Organic traffic declining:** Prioritize `seo-audit`. Algorithm changes, technical issues, or content gaps are distinct problems that require different fixes.

**Conversion rate dropping:** Prioritize `audit-website-cro` + `audit-crm-tracking`. Either the website is broken or the funnel tracking is, making it look like conversion dropped.

**Outbound response rates tanking:** Prioritize `audit-outbound` + `audit-crm-tracking`. Deliverability issues, sequence quality, or ICP drift are the three common causes.

**Brand perception misaligned:** Prioritize `audit-brand-positioning`. Usually a pre-strategy or pre-relaunch trigger, not a tactical one.

**Pre-investment due diligence:** Investors want all 7 domains covered fast, but the two-domains-per-week cap in Rules doesn't lift because the deadline is tighter — at that pace, one auditor needs 4 weeks for 7 domains, same as a full audit. Real compression to 3 weeks means putting a second auditor on the second foundation track (CRM & Tracking and Brand run in parallel, by two different people, in Week 1) rather than asking one auditor to cover more domains per week. Say up front which of the two you're doing — a due-diligence timeline that assumes more reviewer-hours than the team has isn't an aggressive deadline, it's a number nobody checked.

---

## Orchestration Protocol

**Step 1 — Scope definition.** Define which of the 7 audit domains are in scope. A full audit without scoping becomes a 6-month project. Define the scope before starting.

**Step 2 — Hypothesis-first approach.** For each audit domain, state the leadership hypothesis: "We believe SEO traffic is down because of a Google algorithm update." The audit either validates or refutes it. This prevents audits that produce findings no one acts on.

**Step 3 — Queue sub-skills** in the right order. Data-layer audits (CRM, tracking) before channel audits. Foundation audits (brand, SEO) before execution audits (paid, outbound).

**Step 3 bis — When to interrupt the queue.** Two conditions justify stopping before the plan finishes, and both are calls to make out loud rather than push through for the sake of completing the ritual:
- **The data foundation doesn't hold.** If the CRM & Tracking audit finds that revenue and pipeline genuinely can't be traced back to a channel — not just two numbers disagreeing, but neither one trustworthy — stop before running a single channel audit. A paid or SEO audit built on data that doesn't hold gives leadership a confident wrong answer, which is worse than no answer. Brief leadership on the data-integrity blocker, get that fixed, and only then resume the queue — even if it breaks the timeline promised at Step 1.
- **The question is already answered.** If an early domain conclusively explains the symptom leadership asked about — say, revenue underperformance turns out to be entirely a broken CRM sync, not a channel problem — don't keep running the remaining queued audits just to finish the plan. Say so in the synthesis, name what's still unaudited, and let leadership decide whether the rest is still worth doing for other reasons (a due-diligence checklist, say) or whether the answer already in hand is good enough to act on.

**Step 4 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [hypothesis to test, known data, tools in use, access level]
Expected output: [findings + prioritized fix list]
Feeds into: [strategy or investment decision]
```

**Step 4 bis — Access level, made concrete.** Bulldozer OS reads GA4 (reports, conversion events), Search Console, ad account metrics, and — when a CRM connector such as HubSpot is attached to the project — CRM records and multi-touch attribution (scoped to closed-won deals only). It does not push audience lists, lookalike seeds, or offline conversions to any ad platform: that stays a manual step in the platform itself. Before briefing a sub-skill, state which of these connectors are actually attached — a sub-skill briefed to expect CRM data with no CRM connected will stall instead of falling back to its manual method.

The multi-touch attribution report needs a HubSpot scope beyond basic CRM read access, and two other responses from that same call are mechanical, not a permission failure — confirm access with one real call before briefing the CRM audit, and name the exact missing scope to the client's admin if it fails rather than treating it as a data-quality finding. Detail and the exact failure modes: `references/synthese-attribution.md`.

**Step 5 — Synthesis.** After all audits complete, produce a master findings summary: top 5 critical fixes (blockers), top 5 optimization opportunities, and the 3 domains to invest in vs. 3 to stabilize. When two audits answer "is this channel working" with two different numbers — a paid audit citing the platform's own ROAS, a CRM audit citing HubSpot closed-won attribution for the same spend — surface the discrepancy instead of picking whichever number supports the recommendation. The CRM figure is the one to trust for revenue: it's the only one scoped to closed-won, the platform number is scoped to whatever it thinks it caused. That only holds once the attribution call has actually returned data — on a portal missing the scope noted in Step 4 bis it fails outright, and closed-won revenue then has to come straight from deal records instead, not from a number that was never produced.

Before trusting a finding as a trend rather than a data point, check its lookback window against the domain's cycle length, the underlying volume behind the comparison, and whether the platform's own attribution model quietly changed rather than the tracking breaking — GA4's data-driven attribution can silently fall back to last-click or get rebalanced by a model recalibration, and the two look alike from the outside. Bulldozer OS already flags this for GA4 reports (`hasAnomaly` / `anomalyDetails`, >2σ from history) — read that before eyeballing a percentage change by hand. A sub-skill that can't state its own window, volume, and attribution model isn't ready for synthesis — that gap is itself a fix-list item. Thresholds, the two GA4 pitfalls, and the anomaly-flag shortcut: `references/synthese-attribution.md`.

---

## Session Output Format

```markdown
# Audit Session Plan — [Date]
Trigger: [Audit trigger] | Scope: [Domains] | Timeline: [Duration]

## Hypotheses to Test
1. [Domain]: We believe [hypothesis]
2. [Domain]: We believe [hypothesis]
...

## Sub-Skill Queue
1. /[skill] — [domain] — output: [findings + prioritized fixes]
2. /[skill] — [domain] — output: [findings + prioritized fixes]
...

## Context Briefs
[Per-step context injection with hypothesis and access level]

## Synthesis Format (after all audits)
Critical blockers (fix immediately): [Top 5]
Optimization opportunities (fix next 90 days): [Top 5]
Invest vs. stabilize decision: [3 invest / 3 stabilize]
```

---

## Rules

- **Hypothesis before audit.** An audit without a hypothesis produces a report nobody reads. Every domain audit starts with a stated hypothesis that the audit will validate or refute.
- **Data-layer audits first.** CRM and tracking audits must run before channel audits. If the data is unreliable, channel audit findings are unreliable. This also settles ownership: revenue and pipeline numbers belong to the CRM audit, spend and platform-reported performance belong to the channel audits (paid, SEO, outbound) — synthesis compares the two, it never adds them together as if they were one number.
- **Findings need fix lists.** An audit that surfaces problems without prioritized fixes is an expensive exercise in frustration. Every audit sub-skill ends with a fix list sorted by impact and effort.
- **Audit informs strategy — it doesn't replace it.** After the Audit Master completes, route to Strategy Master to build the forward plan. Audits are diagnostic; strategy is prescriptive.
- **Never audit all 7 domains simultaneously.** Running 7 audits in parallel produces 7 half-finished audits. Sequence them. Two domains per week maximum, per auditor. A tighter deadline is solved by adding a second auditor on a second track, never by asking one auditor to cover more domains per week.
- **Finishing the queue is not the goal — answering the hypothesis is.** A broken data foundation or an early conclusive answer are both reasons to stop before the plan is fully run (see Step 3 bis). Running the remaining domains anyway, to have something to show for the timeline promised at Step 1, produces exactly the finding-nobody-acts-on outcome the hypothesis-first rule exists to prevent.
- **Don't audit a decision that's already been made.** If the trigger is a fix leadership has already committed to and the audit is meant to justify it, that's not a hypothesis — see When Not to Run a Full Audit. Naming that out loud costs a moment of discomfort; running seven audits to arrive at a foregone conclusion costs a month.