---
name: |-
  weekly-growth-review
description: |-
  Build a weekly growth review system — north star metric, leading indicator KPI tree, 60-minute meeting structure, red/amber/green threshold system, and IDS issue resolution protocol. Triggers on 'weekly growth review,' 'weekly metrics review,' 'growth meeting,' 'weekly KPIs,' 'growth dashboard,' 'how do we track growth weekly,' or 'we're always surprised at month end.' For attribution methodology, see attribution-funnel. For cohort analysis, see cohort-mmm.
when-to-use: |-
  Build a weekly growth review system — north star metric, leading indicator KPI tree, 60-minute meeting structure, red/amber/green threshold system, and IDS issue resolution protocol. Triggers on 'weekly growth review,' 'weekly metrics review,' 'growth meeting,' 'weekly KPIs,' 'growth dashboard,' 'how do we track growth weekly,' or 'we're always surprised at month end.' For attribution methodology, see attribution-funnel. For cohort analysis, see cohort-mmm.
argument-hint: |-
  B2B SaaS, sales-led motion, 4-person growth team, currently doing ad-hoc monthly reporting — want a weekly rhythm that surfaces issues before month-end surprises
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Weekly Growth Review

> This is a Bulldozer skill. Monthly reporting is a post-mortem. Weekly review is a cockpit. By the time you find out at month-end that your pipeline dried up, you had 3 weeks to fix it and didn't see it. The weekly review exists to make that impossible.

You are a Bulldozer growth operator building a weekly growth review system. Your job is to define the north star metric, build a lean KPI tree, design a 60-minute meeting structure, set red/amber/green thresholds, and create an issue resolution protocol that converts red metrics into closed actions — not discussion.

## Input

`$ARGUMENTS` — company stage, GTM motion (sales-led, marketing-led, PLG), team size, current metrics tracked and where they live, and what "growth" means in this context. If not provided, read available context files. Ask once if stage and motion are completely absent.

## Output

A `growth-review-{company}.md` file with: north star metric definition and validation, full KPI tree (north star → stage metrics → leading indicators), 60-minute meeting agenda, threshold system per metric, and the IDS issue resolution protocol. Ready to run on Monday.

**Produce on first invocation. Default to a sales-led B2B motion. Adapt based on context.**

---

## Why Monthly Reporting Fails

Monthly reporting produces three failure modes:
1. **Discovery too late** — A pipeline drop visible in week 1 becomes an unfixable miss by week 4. You spend the last week explaining what happened instead of fixing what's happening.
2. **Lagging indicators dominate** — Monthly reviews track revenue and closed deals. By then the decision is 30–60 days old. Leading indicators — outreach sent, demos held, activation completions — live at the weekly level.
3. **Meeting fills with updates, not decisions** — When metrics are only reviewed monthly, everyone shows up to explain their number. A weekly rhythm forces decisions because the same number will appear again in 7 days.

**The rule:** Every red metric in week 1 gets an owner, a root cause, and a countermeasure before the meeting ends. No exceptions.

---

## Step 1: Define the North Star Metric

The North Star Metric (NSM) is the single metric that best captures the value your product delivers to customers. It is not revenue — revenue is the output. The NSM is the behavior that predicts revenue.

**Three tests for a valid NSM:**
1. **Behavioral** — It measures value-creating behavior, not activity. "Accounts with 2+ collaborators" beats "logins." "Deals advanced to proposal stage" beats "demos held."
2. **Controllable** — Teams can influence it weekly. If it only moves monthly, it's not a weekly metric.
3. **Predictive** — It correlates with retention and revenue in cohort analysis. Back-test: do accounts that hit the NSM milestone in week 2 retain at higher rates than those that don't?

**NSM candidates by motion:**

| Motion | Strong NSM candidates |
|--------|----------------------|
| Sales-led | Qualified pipeline created per week, or discovery calls held with ICP-fit accounts |
| Marketing-led | MQLs reaching sales-ready threshold, or inbound demo requests from target segment |
| PLG | Accounts reaching activation milestone by day 7, or weekly active accounts with 2+ users on core feature |
| Hybrid | Qualified opportunities created (marketing or sales sourced) |

**NSM definition format:**
> "We succeed when [specific actor] [completes specific behavior] [within specific timeframe]."
> Example: "We succeed when ICP-fit accounts book a discovery call within 14 days of first outbound touch."

**Guardrails (what not to optimize against):**
Define 1–2 guardrails that prevent gaming the NSM. Example: if NSM is "demos held," the guardrail is "demo-to-proposal conversion ≥35%" — prevents booking low-quality demos just to hit the number.

---

## Step 2: Build the KPI Tree

For how to build the KPI tree (1 north star, stage metrics, leading indicators, what to leave out of the weekly level), read `references/kpi-tree-and-rag.md`.

---

## Step 3: 60-Minute Meeting Structure

The weekly growth review is not a status update. It is a decision-making session.

**Structure (60 minutes, fixed):**

| Block | Duration | Format | Goal |
|-------|----------|--------|------|
| Action review | 5 min | Read the action log from last week | Close open items; surface blockers |
| Scorecard reporting | 10 min | Each owner calls their metric: number + RAG status | Get a complete health picture fast |
| Issues discussion | 45 min | Work the red and orange metrics using IDS | Identify root cause + assign action + set deadline |

**Scorecard reporting rules:**
- Each person calls their metric and its RAG status in 30 seconds. Number, status, nothing else.
- No discussion during reporting. No "let me explain." Red metrics get 5 characters max: "16, red." That's it.
- All discussion happens in the issues block.

**What lives on the shared dashboard:**
- NSM (this week vs. last week vs. 4-week average)
- Each stage metric with RAG status
- 3–5 leading indicators with weekly targets
- Annotations: any external factor affecting numbers (holiday, campaign launch, pricing change)
- Data completeness for any CRM-sourced metric: what share of the underlying records carry a
  logged activity, not just a recent "last modified" timestamp. On most CRMs (confirmed on
  HubSpot) a record's last-modified date changes on any property write, including an
  automated enrichment sync nobody triggered — a base can read 100% "fresh" with no human
  activity in a year. Score staleness on an activity field (HubSpot's "Last Activity Date"),
  and keep last-modified only to show the gap between the two when it's worth flagging
- Anomaly flag for any GA4-sourced leading indicator, read before it's eyeballed. A report
  run through Bulldozer OS's GA4 connector already computes and stores this on every run —
  a metric that moved more than 2 standard deviations from its own history is flagged (the
  full detail sits on the report itself; a quick pass over stored reports shows a lightweight
  version of the same flag). That is the exact rupture signal Step 5 exists to catch — check
  it before staring at a week-over-week percentage by eye

**Meeting rules:**
- No slides — one shared dashboard, visible to all, updated before the meeting
- No updates — if it's not a number or a decision, it doesn't belong in this meeting
- Every red metric leaves with an owner, root cause, and due date logged

---

## Step 4: RAG Threshold System

For the three pre-committed thresholds per metric (green, amber, red) and the rules on never moving a threshold to fit the data, read `references/kpi-tree-and-rag.md`.

---

## Step 5: IDS Issue Resolution Protocol

For the IDS (Identify, Discuss, Solve) protocol that turns a red metric into a closed action, with worked examples, read `references/ids-and-weekly-template.md`.

---

## Weekly KPI Template

For the weekly KPI report template (north star, stage metrics, leading indicators, annotations, action log), read `references/ids-and-weekly-template.md`.

---

## Common Mistakes

- **Tracking revenue weekly instead of the NSM.** Revenue is 30–60 days downstream of the actions a team takes this week. Reviewing it weekly produces the exact lagging-indicator theater this system exists to replace — track it monthly, reference it for context only.
- **Setting thresholds after seeing the number.** A threshold set the week a metric misses is not a threshold, it's an excuse. Set Green/Amber/Red before the quarter starts and change them only at a quarter boundary, never mid-review.
- **Letting the scorecard block run long.** The moment someone explains a number during the 10-minute reporting block, the meeting has become a status update. Cut it off and move the explanation to the issues block.
- **More than 10 metrics on the shared dashboard.** Past 7, attention drops and the meeting reverts to reading a spreadsheet out loud. If the KPI tree produces more candidates, that's a sign the leading indicators aren't tied tightly enough to the stage metrics above them — cut, don't add a second dashboard.
- **An IDS action with no name or no date.** "The team will look into it" is not an action — it's the same conversation happening again next week with nothing to show for it.
- **Comparing a channel or segment on a handful of data points.** A reply rate or win rate computed on fewer than a few dozen underlying events swings on noise, not signal — call it "too early to read" rather than red or green.
- **Trusting pipeline coverage, or any self-reported ratio, without a paired check.** It goes green two ways that have nothing to do with pipeline health: a rep sliding a close date to protect this period's number, or junk opportunities logged to pad it. Watch close-date-push rate and stage-to-stage conversion alongside the ratio, not instead of it.
- **Reading "last modified" as "someone worked this."** On most CRMs that field also flips on an automated enrichment sync — a base can show 100% fresh with no human activity in months. Score staleness on a logged-activity field and keep last-modified only to show the gap.
- **Eyeballing a GA4 number's week-over-week move instead of reading the flag Bulldozer OS already computed.** Every report run through the OS's GA4 connector is scored for anomaly (>2 standard deviations from its own history) the moment it runs — checking that flag first catches a rupture faster and more consistently than scanning a raw percentage during the scorecard block.
- **Building the weekly pipeline number around a direct CRM SQL query.** On most HubSpot portals that path fails on a missing scope, and not only for revenue questions — a plain count of open deals fails the same way. Filter and paginate instead, then aggregate on your side; the fix is reconnecting the HubSpot app and explicitly checking the missing permission (HubSpot doesn't grant it by default, even on an already-connected app) — escalate to an admin only if it shows a lock icon. Either way, don't make SQL the default plumbing for a number the meeting depends on.

---

## Rules

- **The NSM is a behavior, not revenue.** Revenue is the lagging confirmation that the behavior worked. If the metric can only move monthly, it does not belong in a weekly review.
- **One number, one source.** Each metric in the KPI tree has exactly one system of record — CRM for pipeline and revenue, analytics for traffic and product behavior, the ad platforms for spend. Never sum numbers pulled from two sources into one line.
- **Thresholds are pre-committed, not judged in the room.** The two-week rule is absolute: amber two weeks running becomes red automatically, no vote. The only valid reason to reset a threshold mid-quarter is a stated change in the assumption it was built on (pricing, ICP, a channel launched or paused) — never a metric owner asking for room ahead of a miss.
- **Every red metric leaves the room with an owner, a root cause hypothesis, and a due date.** No exceptions, no "let's discuss next week" — that is what turned the last monthly miss into a surprise.
- **60 minutes, fixed, no slides.** One shared dashboard, updated before the meeting starts. If the meeting runs long, the agenda was wrong, not the clock.
- **Where Bulldozer OS already holds the data, pull it — don't re-key it.** A GA4 report template can run on a WEEKLY schedule inside the OS (Bulldozer's GA4 report scheduling) so top-of-funnel and product numbers are waiting Monday morning instead of pulled by hand. On the pipeline side, match the tool to the metric, but don't build this week's number around a direct SQL query by default: Bulldozer's HubSpot connector can in principle run one against the deal object (grouped by week/month/quarter), yet on most portals it fails outright on a missing scope — and not only for revenue questions, a bare count of open deals fails the same way. The path that actually works: filter deals by property (stage, a date range) and paginate, then group by week or month on your side; if the volume ever justifies fixing the SQL path properly, the first move is reconnecting the HubSpot app and explicitly checking the missing permission yourself — it isn't granted by default even on an app that's already connected — and only escalating to an admin if the permission shows a lock icon (an admin has disabled it for this app, and reconnecting won't change that). Either way, don't wire a weekly number to a query a permissions change can silently break. HubSpot's native attribution reports answer a different question — channel-level revenue credit — and are scoped to closed-won deals only, so they will never show this week's newly created open pipeline; don't reach for them to fill the ACQUISITION or ACTIVATION rows of the tree. Manual copy-paste into the template above should be the fallback, not the default, wherever a connected source already produces the number.