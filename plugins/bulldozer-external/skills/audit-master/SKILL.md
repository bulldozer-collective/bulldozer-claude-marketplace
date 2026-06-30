---
name: |
  audit-master
description: |
  Orchestrate a full GTM audit — SEO, paid, content, outbound, CRM tracking, website CRO, and brand positioning — routing to the right audit sub-skills based on what needs diagnosis. Triggers on 'full audit,' 'something isn't working, let's diagnose,' 'before we scale we need to audit,' 'find what's broken,' 'performance review,' or 'pre-investment audit.' For strategy after the audit, use Strategy Master. For channel execution, use Acquisition Master.
when-to-use: |
  Orchestrate a full GTM audit — SEO, paid, content, outbound, CRM tracking, website CRO, and brand positioning — routing to the right audit sub-skills based on what needs diagnosis. Triggers on 'full audit,' 'something isn't working, let's diagnose,' 'before we scale we need to audit,' 'find what's broken,' 'performance review,' or 'pre-investment audit.' For strategy after the audit, use Strategy Master. For channel execution, use Acquisition Master.
argument-hint: |
  B2B SaaS, new CMO starting. Want a full 30-day GTM audit before setting strategy: SEO health, paid efficiency, outbound quality, CRM integrity, website conversion, and brand perception.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
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
1. What triggered this audit? (New leadership / underperformance / pre-investment / routine)
2. Which domains are in scope? (SEO / Paid / Content / Outbound / CRM & Tracking / Website & CRO / Brand)
3. What does leadership believe is broken? (Hypothesis to validate or refute)
4. What decisions will this audit inform? (Budget reallocation / team restructure / channel pivot / investor deck)
5. What's the timeline? (30-day sprint / quarterly review / pre-raise due diligence)

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

**Full audit (new CMO, pre-raise, major underperformance):** Run all 7 in order. Week 1: SEO + Paid + CRM. Week 2: Content + Outbound. Week 3: Website. Week 4: Brand + synthesis.

**Revenue underperforming:** Prioritize `audit-paid-ads` + `audit-outbound` + `audit-crm-tracking`. Revenue problems trace to acquisition (paid/outbound) or to data quality hiding what's actually working.

**Organic traffic declining:** Prioritize `seo-audit`. Algorithm changes, technical issues, or content gaps are distinct problems that require different fixes.

**Conversion rate dropping:** Prioritize `audit-website-cro` + `audit-crm-tracking`. Either the website is broken or the funnel tracking is, making it look like conversion dropped.

**Outbound response rates tanking:** Prioritize `audit-outbound` + `audit-crm-tracking`. Deliverability issues, sequence quality, or ICP drift are the three common causes.

**Brand perception misaligned:** Prioritize `audit-brand-positioning`. Usually a pre-strategy or pre-relaunch trigger, not a tactical one.

**Pre-investment due diligence:** Run all 7, compress to 2 weeks. Investors want to see what's working, what's not, and that the team knows the difference.

---

## Orchestration Protocol

**Step 1 — Scope definition.** Define which of the 7 audit domains are in scope. A full audit without scoping becomes a 6-month project. Define the scope before starting.

**Step 2 — Hypothesis-first approach.** For each audit domain, state the leadership hypothesis: "We believe SEO traffic is down because of a Google algorithm update." The audit either validates or refutes it. This prevents audits that produce findings no one acts on.

**Step 3 — Queue sub-skills** in the right order. Data-layer audits (CRM, tracking) before channel audits. Foundation audits (brand, SEO) before execution audits (paid, outbound).

**Step 4 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [hypothesis to test, known data, tools in use, access level]
Expected output: [findings + prioritized fix list]
Feeds into: [strategy or investment decision]
```

**Step 5 — Synthesis.** After all audits complete, produce a master findings summary: top 5 critical fixes (blockers), top 5 optimization opportunities, and the 3 domains to invest in vs. 3 to stabilize.

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
- **Data-layer audits first.** CRM and tracking audits must run before channel audits. If the data is unreliable, channel audit findings are unreliable.
- **Findings need fix lists.** An audit that surfaces problems without prioritized fixes is an expensive exercise in frustration. Every audit sub-skill ends with a fix list sorted by impact and effort.
- **Audit informs strategy — it doesn't replace it.** After the Audit Master completes, route to Strategy Master to build the forward plan. Audits are diagnostic; strategy is prescriptive.
- **Never audit all 7 domains simultaneously.** Running 7 audits in parallel produces 7 half-finished audits. Sequence them. Two domains per week maximum.