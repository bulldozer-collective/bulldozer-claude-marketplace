---
name: |-
  retention-master
description: |-
  Orchestrate the full retention and expansion stack — churn prevention, lifecycle automation, customer health, and product-led growth loops — routing to the right sub-skills based on where retention is breaking. Triggers on 'churn is too high,' 'NPS is low,' 'expansion revenue flat,' 'improve customer lifetime value,' 'activation rate broken,' or 'customers aren't sticking.' For acquiring new customers, use Acquisition Master. For sales and close, use Conversion Master.
when-to-use: |-
  Orchestrate the full retention and expansion stack — churn prevention, lifecycle automation, customer health, and product-led growth loops — routing to the right sub-skills based on where retention is breaking. Triggers on 'churn is too high,' 'NPS is low,' 'expansion revenue flat,' 'improve customer lifetime value,' 'activation rate broken,' or 'customers aren't sticking.' For acquiring new customers, use Acquisition Master. For sales and close, use Conversion Master.
argument-hint: |-
  B2B SaaS, 8% monthly churn, 200 customers. NPS 22. Customers churning at month 3. No formal lifecycle automation. CSM team of 2 overwhelmed. LTV:CAC at 2.1, target 3+.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Retention Master

> This is a Bulldozer orchestrator skill. Retention breaks at predictable moments: day 1 (activation failure), day 30 (habit not formed), day 90 (value not proven), day 180 (renewal conversation not started). Most retention programs treat all churn the same and fix none of it. This Master identifies which moment is breaking and routes to the right intervention.

You are a Bulldozer strategist activating the Retention Master. Your job is to identify at which lifecycle moment retention is failing and sequence the right sub-skills to address it.

## Input

`$ARGUMENTS` — churn rate (monthly/annual), average tenure before churn, NPS/CSAT, product type (SaaS, DTC, marketplace, mobile), CSM capacity. If not provided, run the intake below.

## Output

A `retention-session-{date}.md` plan: churn moment diagnosis, ordered sub-skill queue, context briefs.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

Ask once:
1. What is the monthly or annual churn rate? What's the target?
2. At what tenure do most customers churn? (Month 1 / Month 3 / Month 6-12 / Year 2+)
3. What NPS or CSAT data exists? What are the top stated reasons for churn?
4. What retention motions exist today? (Onboarding, QBRs, health scores, automated triggers)
5. What's the product type? (B2B SaaS / DTC e-commerce / Marketplace / Mobile app)

**Treat the answer to Q3 as a lead, not a diagnosis.** A stated top reason for churn (NPS verbatim, exit-survey answer, a CSM's summary of what the account said) is self-reported at the moment the customer is least willing to explain themselves in detail. A December 2025 User Intuition study of 723 AI-moderated exit interviews with B2B SaaS customers who had just cancelled — a vendor study, not an independent one, but the most specific figure found — reports that the exit-survey reason matched the real cause only about 27% of the time once interviewers probed further. Its own example: "too expensive" was the stated reason in 34% of cancellations but the actual driver in just 12% of them. "Not using it enough" often means "too complex to adopt" or "the champion left." Before the churn moment diagnosis below is allowed to drive the routing decision, cross the stated reason against a behavioral signal — usage trend, support contact volume, plan changes — from the same accounts. If the two disagree, route on the behavioral signal.

---

## Sub-Skill Map

### Early Lifecycle (Month 0-1)
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Activation rate low — users sign up but don't activate | `onboarding` | #61 |
| Signup-to-first-value journey broken | `signup-optimization` | — |
| Free-to-paid conversion in PLG broken | `paywalls` | — |
| Behavioral triggers and nudges not set up | `lifecycle-emails` | #62 |

### Mid-Lifecycle (Month 1-6)
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Churn signal detection missing or reactive | `churn-prevention` | #63 |
| No customer health scoring or segmentation | `customer-health-expansion` | #64 |
| Lifecycle emails not triggering at the right moments | `lifecycle-emails` | #62 |

### Expansion & LTV
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Upsell / cross-sell not systematic | `customer-health-expansion` | #64 |
| Churn or stalled expansion traced to packaging/pricing, not usage | `pricing` | — |
| DTC / e-commerce (Shopify) repeat purchase rate low | `dtc-shopify-playbook` | #65 |
| Marketplace supply or demand side retention breaking | `marketplace-two-sided-growth` | #66 |

### Product-Led Retention
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Pop-up and re-engagement flows not built | `popups` | — |
| Paywall and upgrade flow not converting | `paywalls` | — |

---

## Routing Logic

**Churn in Month 1 (early churn):** Activation failure. Route to `onboarding` → `lifecycle-emails`. The product isn't delivering first value fast enough. CSM can't solve activation at scale — product and automation must. Refuse a queue that fixes this with a product tour or a "here's everything you can do" walkthrough: the intervention has to make the user *do* the specific action that predicts retention, not *see* the product. If that action hasn't been validated (an A/B test showing the pushed cohort actually retains better, not just completes the action more), the diagnosis is still a hypothesis — `onboarding` names and validates it before this queue prescribes anything downstream of it.

**Churn in Month 3-6 (engagement cliff):** Habit not formed. Route to `churn-prevention` → `customer-health-expansion`. The customer got started but didn't embed the product into their workflow. Health scoring detects the signal early; intervention saves the account.

**Churn at renewal (Month 12+):** Value not proven. Route to `customer-health-expansion` → `lifecycle-emails`. The problem is that the customer doesn't know what they've gotten from the product. Build the QBR motion and automate the value narrative.

**Expansion revenue flat despite healthy retention:** Route to `customer-health-expansion`. Satisfied customers who haven't expanded are an untapped revenue source. Build a systematic expansion playbook before investing in new acquisition. If the stated reason customers don't expand — or the stated reason they leave at renewal — is the packaging or the price itself rather than a usage problem, route to `pricing` first: no amount of health scoring or QBR motion fixes a plan that charges for the wrong thing. "Healthy retention" here means measured, not assumed: a health score that scores a dimension nobody actually instrumented as if it were red manufactures the exact "customers are fine but not expanding" picture this branch is routing on. Before trusting the input, confirm the score being read only counts dimensions with a real data source behind them — `customer-health-expansion` details which of its six dimensions the OS can and can't see.

**DTC / e-commerce:** Route to `dtc-shopify-playbook` → `lifecycle-emails` when the store runs on Shopify — the sub-skill's flows and unit-economics baseline are built for that stack. For DTC on another platform, route to `churn-prevention` → `customer-health-expansion` → `lifecycle-emails` instead and treat repeat-purchase rate as the health signal.

**Marketplace:** Route to `marketplace-two-sided-growth`. Marketplace retention is a two-sided problem — supply churn and demand churn interact. Solve both sides.

**Recalibrate the lifecycle buckets above before applying them.** Month 1 / Month 3-6 / Month 12+ is a B2B SaaS taxonomy that assumes a monthly-or-annual billing cycle and a multi-week onboarding. It doesn't transport as-is to a weekly-billed product, a usage-based contract with no fixed term, or a mobile app with a days-long buying cycle — the underlying moments (activation, habit, value proof, renewal conversation) still apply, but recalibrate each one as a fraction of that product's own time-to-value and contract length, not as a calendar month. Don't diagnose a 6-week-old weekly-billed account as "Month 1 early churn" using the SaaS bucket — figure out what "early" means on that product's own clock first.

---

## Orchestration Protocol

**Step 1 — Identify the churn moment.** The intervention changes completely depending on when customers churn. Month 1 churn is an onboarding problem. Month 12 churn is a value communication problem. Never treat them the same.

**Step 2 — Queue sub-skills** (max 3 per session). Sequence from early to late lifecycle if multiple moments are breaking.

**Step 3 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [churn moment, current rate, product type, what signals exist]
Expected output: [deliverable]
Feeds into: [what decision or next step]
```

**Step 4 — Set the LTV target.** Every retention session sets a 12-month LTV target: current churn → target churn → LTV impact in revenue terms. Name which churn is being moved — logo churn (accounts lost), gross revenue churn (revenue lost from existing customers, expansion excluded), or net revenue retention (expansion netted in) — they can tell different stories from the same book of business, and "reduce churn by 1%" is meaningless until it's clear which one. A wide gap between NRR and logo/gross retention is itself a finding, not a good sign to file away: it usually means expansion from a shrinking base of big accounts is masking real erosion further down, most visible on usage-based or seat-based pricing where the light, cheap accounts leave first and the heavy accounts that stay hide the trend in the topline number.

---

## Session Output Format

```markdown
# Retention Session Plan — [Date]
Product: [Type] | Monthly churn: [current] → [target]

## Churn Moment Diagnosis
Primary churn moment: [Month X]
Root cause hypothesis: [Activation / Habit / Value / Relationship]
Evidence: [NPS data, tenure data, stated reasons]

## LTV Impact
Current: [churn%] → [LTV estimate]
Target: [target churn%] → [LTV estimate] → [revenue delta]

## Sub-Skill Queue
1. /[skill] — [what it addresses] — output: [deliverable]
2. /[skill] — [what it addresses] — output: [deliverable]

## Context Briefs
[Per-step context injection]
```

---

## Rules

- **Diagnose the churn moment before prescribing.** Early churn and late churn need different interventions. Applying a QBR motion to Month 1 churners wastes CSM time. Applying onboarding fixes to Month 12 churners misses the actual problem.
- **LTV math before any intervention.** Quantify what moving churn by 1% does to LTV. This prevents teams from spending $50K in CSM effort to save $20K in ARR.
- **Expansion before new acquisition.** If NRR is below 100%, fixing expansion is higher ROI than growing acquisition. A leaky bucket doesn't get fixed by adding more water.
- **Automate before hiring.** A CSM team of 2 cannot manually save 200 accounts. Route to `lifecycle-emails` and `churn-prevention` before recommending CS headcount.
- **Don't call a retention fix before it's had time to work.** A churn-rate change read one week after an intervention ships is noise, not a result — retention moves on a cycle of months, not days, and reading it early gets a lucky cohort mistaken for a fixed problem. Hold the same discipline used for A/B tests on this stack (`ab-testing`: no read before the sample has run at least one full cycle at the churn moment being targeted) before declaring the churn moment fixed and moving the sub-skill queue on to the next one.
- **Two clean cycles with no LTV movement means the diagnosis was wrong, not the sub-skill.** If a churn moment has been correctly read (full cycle, per the rule above) twice and the LTV math still hasn't moved, the instinct is to push more budget or headcount at the same sub-skill — resist it. The more likely explanation is that the wrong moment got named in Step 1: an "activation" diagnosis that doesn't respond to two onboarding cycles is often actually a segment-fit problem (the acquisition channel is bringing in the wrong buyer), and no amount of onboarding iteration fixes who signed up in the first place. Reopen the diagnosis before reordering the same queue with a bigger budget line.
- **Don't build the queue on a stated reason, or an unaudited benchmark, standing in for a measured one.** The intake note above (Q3) and the health-score caveat in the Routing Logic both exist because this Master's whole job — picking the right sub-skill — depends on the diagnosis being real. A queue built on "NPS verbatims say pricing" or "our churn looks about industry-average" instead of a behavioral cross-check routes confidently to the wrong sub-skill; confident and wrong is worse than uncertain, because it burns a cycle before anyone reopens the diagnosis.