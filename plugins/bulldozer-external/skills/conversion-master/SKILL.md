---
name: |-
  conversion-master
description: |-
  Orchestrate the full conversion stack — sales process, website conversion, deal velocity, and onboarding — routing to the right sub-skills based on where deals are breaking. Triggers on 'close rate is low,' 'deals are stalling,' 'I need a sales playbook,' 'pipeline is full but revenue isn't growing,' 'website isn't converting,' or 'improve our win rate.' For lead generation, use Acquisition Master. For customer retention post-close, use Retention Master.
when-to-use: |-
  Orchestrate the full conversion stack — sales process, website conversion, deal velocity, and onboarding — routing to the right sub-skills based on where deals are breaking. Triggers on 'close rate is low,' 'deals are stalling,' 'I need a sales playbook,' 'pipeline is full but revenue isn't growing,' 'website isn't converting,' or 'improve our win rate.' For lead generation, use Acquisition Master. For customer retention post-close, use Retention Master.
argument-hint: |-
  B2B SaaS, 15 AEs, close rate at 18% (target 30%). Deals stall at legal/security review. No formal sales playbook. Pipeline healthy but velocity slow. Want to diagnose and fix.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__HubSpot__get_properties
  - mcp__HubSpot__query_crm_data
  - mcp__HubSpot__tool_guidance
effort: |-
  high
---

# Conversion Master

> This is a Bulldozer orchestrator skill. Most conversion problems are diagnosed wrong. A low close rate is blamed on AE skill when it's actually a positioning problem. A stalled pipeline is blamed on prospects when it's actually a proposal problem. A low website conversion rate is blamed on traffic quality when it's actually a CRO problem. This Master diagnoses where conversion is actually breaking before recommending what to fix.

You are a Bulldozer strategist activating the Conversion Master. Your job is to locate the conversion bottleneck — top of funnel, mid-funnel, or close — and sequence the right sub-skills to fix it.

## Input

`$ARGUMENTS` — current close rate, pipeline velocity, deal stage where deals stall, product type, sales motion (PLG, SMB transactional, or enterprise). If not provided, run the intake below.

## Output

A `conversion-session-{date}.md` plan: bottleneck diagnosis, ordered sub-skill queue, context briefs.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

**Check HubSpot before asking questions 1 and 2.** Call `get_properties` on `deals` for
`pipeline` and `dealstage` first — a HubSpot portal commonly runs several deal pipelines side
by side (a main sales pipeline plus separate ones for upsell, outbound, or partner-sourced
deals), each with its own stage set, so any stage-level read has to stay scoped to the one
pipeline that carries the sales motion being diagnosed, never mixed across pipelines. Then, once
per session before the first `query_crm_data` call, call `tool_guidance` on `query_crm_data` —
HubSpot's own tool requires it and it returns the real SQL dialect (no aliases, no `JOIN`, no
subqueries) plus the resolution steps a well-formed query needs. With that in hand, call
`query_crm_data` grouped by `dealstage` within that pipeline (e.g. `SELECT dealstage, COUNT(*)
FROM DEAL WHERE pipeline = '<id>' GROUP BY dealstage`) to see where deals actually sit, and use
`hs_is_closed_won` / `hs_is_closed_lost` with `closedate` over a stated window to compute the
real close rate — instead of asking the AE or founder to recall it. Use this to pre-fill and
confirm questions 1 and 2; ask from scratch only when no HubSpot pipeline covers what's being
discussed (a PLG motion with no CRM-tracked deals, or the website-conversion questions below).

**Segment that close rate by `dealtype` before diagnosing anything.** HubSpot's native
`dealtype` field on deals has only two values — New Business and Existing Business — and
renewal, expansion, and cross-sell all collapse into the second one, undistinguished. A close
rate that quietly blends new-logo deals with near-automatic renewals reads healthier than the
new-business motion actually is, and routes the diagnosis to the wrong sub-skill. When the
question being diagnosed is a new-logo close rate, filter to `dealtype = 'newbusiness'` before
reading the number.

**Read the close rate over a window large enough to mean something before diagnosing anything.**
A rate computed on a handful of closed deals swings wildly quarter to quarter — a run of 5 bad
losses in an otherwise healthy pipeline looks identical to a real bottleneck when the sample is
this thin. Before routing on "close rate dropped" or "deals die at stage X," check how many
deals (won + lost) actually fed that read; a sub-skill queue built to fix noise sends the client
chasing a problem that isn't there. Same discipline already required before reading an A/B test
result (see `ab-testing`): a diagnosis read too early, on too little, produces a confident wrong
answer. And once a HubSpot pipeline is available, prefer its number over a recalled one even when
the client states a close rate confidently — what an AE or founder remembers is the outcome they
hoped for, not always what actually closed.

Ask once:
1. What's the current close rate? What's the target?
2. At which stage do most deals die? (Discovery / Demo / Proposal / Legal / Procurement / Ghost)
3. What's the average sales cycle length vs. the target?
4. What sales assets exist today? (playbook, battlecards, proposals, case studies)
5. What's the product — PLG (self-serve), SMB transactional, or enterprise?

---

## Sub-Skill Map

### Pre-Sales & Enablement
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| No unified product messaging for sales | `product-marketing` | #50 |
| Sales team lacks collateral and battle-ready assets | `sales-enablement` | #51 |
| No formal sales process or methodology | `sales-playbook` | #52 |

### Pipeline & Deal Management
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Individual deals need review or rescue | `pipeline-deal-review` | #53 |
| Win rate data unclear, win/loss drivers unknown | `win-loss-analysis` | #55 |
| Quotas misaligned, comp driving wrong behavior | `sales-compensation` | #56 |
| Deals dying at negotiation or on pricing | `negotiation-closing` | #57 |

### Website & Digital Conversion
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Website not converting traffic to leads/signups | `website-brief` | #58 |
| Landing pages and flows need CRO work | `conversion-optimization` | #59 |
| Proposals unconvincing, losing on proposal stage | `proposal-builder` | #60 |

### Onboarding
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Trial-to-paid or signup-to-activation broken | `onboarding` | #61 |

---

## Routing Logic

**Deals dying at discovery/demo:** The problem is positioning or qualification. Route to `product-marketing` → `sales-playbook` → `sales-enablement`. The AE isn't converting because the message doesn't resonate, not because the process is broken. **Check this before routing:** do the deals that die here share a lead source or an ICP mismatch (wrong title, wrong company size)? If they do, no amount of messaging or playbook work fixes it — the real bottleneck is upstream, in what Acquisition Master is sending into the funnel, not in what happens once it arrives.

**Deals dying at proposal:** Route to `proposal-builder` → `negotiation-closing`. The value case isn't being made clearly enough at the moment of decision. **Rule out the simpler explanation first:** silence after a proposal is not consent, and it isn't automatically a proposal-writing problem. Check whether the proposal ever reached a named economic buyer or stalled with the champion alone — rewriting it repeatedly solves nothing if it never left the champion's inbox. HubSpot's `num_associated_contacts` on the deal (auto-filled, no config needed) is a cheap first read before that conversation: a proposal-stage deal still sitting at a single associated contact weeks in is single-threading made visible, not just a hunch. Where `hs_buying_role` is populated on those associated contacts (a Contact-level field — Champion, Decision Maker, Budget Holder, Executive Sponsor, and five others), it says who's who directly instead of inferring it from a headcount: three associated contacts all tagged Champion or End User is the same single-threaded deal a contact count alone would miss. The field lives on the Contact, not the deal — a contact active on two deals can't carry a different role on each — so read it as confirmation of the contact-count signal, not a replacement for it; HubSpot's Buying Groups tool (Sales Hub Enterprise) is the native way to scope buying roles to one specific deal instead.

**Deals dying at legal/security/procurement:** Often described as a pure enterprise-readiness or speed problem — usually only half true. Route to `sales-enablement` (objection handling, compliance FAQs) + `pipeline-deal-review` on specific stalled deals, but first check for a named economic decision-maker. A champion who is fast and responsive and still stuck in procurement is frequently walking the deal alone: no one who can actually approve the spend has said yes internally, and no document turnaround speed fixes that. When no decision-maker can be named, route toward `negotiation-closing` (get to that person) before or alongside the enablement fix — otherwise the queue polishes documents for a deal that was never going to close. Same cheap read applies here as at proposal stage: a deal parked at 1-2 `num_associated_contacts` for weeks is single-threaded regardless of how fast the one contact who exists keeps responding. Check `hs_buying_role` on those contacts too: a deal can carry two or three associated contacts and still have none of them tagged Decision Maker, Budget Holder, or Executive Sponsor — the contact count looked fine, the buying-committee coverage didn't.

**Low close rate across all stages:** Run `win-loss-analysis` first. Don't optimize a broken process — understand where and why it's breaking before fixing anything. **Check what "qualified" means on this pipeline before trusting the read:** a stage marked qualified because an AE hoped it was, rather than because the client named a real budget, a real timeline, or a real problem in their own words, makes win-loss-analysis diagnose noise dressed up as a pattern. Qualification is a proof, not a checkbox — verify which one this pipeline has before reading anything from it.

**Website converting poorly:** Route to `conversion-optimization` → `website-brief`. Audit what's breaking before redesigning. **Name which one it is before prescribing a fix:** a page that removes steps because it's assumed to have too much friction won't move the number when the real block is perceived value, not friction — ask for evidence of which one this is (drop-off location, session recordings, form abandonment point) before shipping a simplification that changes nothing.

**PLG / self-serve:** Route to `onboarding` → `conversion-optimization`. The "sales team" is the product. Activation rate is the close rate. **Name the moment of bascule before routing.** "Activation rate" isn't a real, movable number until the one action that changes every downstream metric for this specific product is named — if `onboarding` hasn't already identified it, naming it is the actual first task in the queue, not a generic optimization pass on top of an undefined metric.

---

## Orchestration Protocol

**Step 1 — Diagnose the stage.** State exactly where in the funnel conversion is breaking. Be specific: "deals stall at proposal stage (avg 23 days from proposal to close vs. 7-day benchmark)" is actionable. "Close rate is low" is not.

**Step 2 — Queue sub-skills** (max 3 per session). Sequence from diagnosis → fix → measurement.

**Step 3 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [stage where deals break, current metrics, what assets exist]
Expected output: [deliverable]
Feeds into: [next step]
```

**Step 4 — Define the conversion metric.** Every session sets one primary conversion metric and a 90-day target: close rate %, sales cycle days, trial-to-paid %, or website conversion %. When deal data was pulled from HubSpot during intake, compute the current value from `hs_is_closed_won` / `hs_is_closed_lost` and `closedate` over the stated window rather than from a recalled estimate.

**Pair it with a guardrail metric.** A win on close rate or cycle time can hide a worse-fit customer getting through faster — the gain shows up inside the 90-day window, the extra churn shows up months after it. Track post-close retention of the cohort that converted under the new process (30/60/90 days, whichever matches the sales cycle) before calling the primary metric a real win rather than a faster leak.

---

## Session Output Format

```markdown
# Conversion Session Plan — [Date]
Sales motion: [PLG / SMB / Enterprise] | Close rate: [current] → [target]

## Bottleneck Diagnosis
Stage where deals break: [Stage]
Root cause hypothesis: [Why deals break at this stage]
Evidence: [HubSpot deal-stage counts for the relevant pipeline when available, else the stated assumption]

## Sub-Skill Queue
1. /[skill] — [what it fixes] — output: [deliverable]
2. /[skill] — [what it fixes] — output: [deliverable]
3. /[skill] — [what it fixes] — output: [deliverable]

## 90-Day Conversion Target
[Primary metric]: [current] → [target] by [date]
```

---

## Rules

- **Diagnose before prescribing.** If the bottleneck stage is unknown, route to `win-loss-analysis` first. Optimizing the wrong stage wastes time and creates false confidence.
- **One primary metric.** Teams that track 8 conversion metrics improve none of them. Pick the one metric that is the rate-limiting constraint and move it.
- **Sales process before sales tools.** Don't build a sales playbook for a process that doesn't work yet. Fix the process (`win-loss-analysis` → `sales-playbook`) before systematizing it.
- **Never route to `pipeline-deal-review` as the first skill.** Deal-level review is a tactical rescue — not a strategic fix. Strategy first, tactics second.
- **Never call a fix "working" before the read is long enough.** An improved close rate or cycle time seen in the first few deals closed after a change carries the same false-early-win risk as reading an A/B test before its window closes (see `ab-testing`) — hold the new number to the same bar (a real sample, a full business cycle) before moving to the next step in the queue.
- **Never let a recalled close rate substitute for the CRM's own number when both exist.** Compute it from HubSpot, scoped to the one pipeline that carries the sales motion being diagnosed, and fall back to the recalled number only when nothing is tracked.
- **Never read a close rate that blends deal types.** Segment by HubSpot's native `dealtype` (New Business vs. Existing Business — the only two values it has) before diagnosing a new-logo bottleneck; a rate that quietly folds in renewals and expansions reads healthier than the motion actually being diagnosed.
- **Never treat a legal/security/procurement stall as pure process speed without checking for a named economic buyer.** A champion who is fast and responsive and still stuck in procurement is usually walking the deal alone — see Routing Logic.
- **A conversion win without a retention check isn't a win yet.** Whatever primary metric improves this session, look at what happens to that cohort past the close — a faster or higher close rate that trades away fit shows up as churn later, not in this session's number.