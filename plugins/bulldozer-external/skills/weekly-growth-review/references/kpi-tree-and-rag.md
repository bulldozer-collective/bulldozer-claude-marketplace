# KPI Tree and RAG Threshold System

The KPI tree connects the NSM to the weekly actions teams can take. Maximum structure: 1 NSM → 4 stage metrics → 8–10 leading indicators.

**Standard tree for sales-led B2B:**

```
NORTH STAR: Qualified pipeline created per week
│
├── ACQUISITION
│   Stage metric: ICP accounts contacted per week
│   Leading indicators:
│   • Outreach sequences activated (target: [X]/week)
│   • ICP accounts in active sequence (target: [X] total)
│
├── ACTIVATION (MQL → SQL)
│   Stage metric: Discovery calls held with ICP accounts
│   Leading indicators:
│   • Positive reply rate to outreach (target: >5%)
│   • Discovery-to-pipeline conversion (target: >60%)
│
├── REVENUE (SQL → Close)
│   Stage metric: Opportunities advanced per stage per week
│   Leading indicators:
│   • Pipeline coverage ratio (calculate as 1 ÷ expected win rate — see note below)
│   • Demo-to-proposal conversion (target: >50%)
│   • Avg sales cycle vs. target (flag if >120% of target)
│
└── RETENTION (Pipeline health)
    Stage metric: NRR (tracked monthly, flagged weekly if warning signals)
    Leading indicators:
    • At-risk accounts (usage below activation threshold)
    • Expansion opportunities identified
```

**A note on pipeline coverage:** don't copy a fixed multiplier from a blog post and call it
a target. The 2026 sources on this now disagree about which direction coverage is even
moving: one practitioner/RevOps-vendor cluster (Clari among them) puts typical coverage
closer to 4–6x, up from the 3–4x that was standard until recently, as cold-outbound-sourced
pipeline converts at a lower rate than it used to; a separate 2026 cluster claims the
opposite — that AI-assisted qualification lets well-instrumented teams hold 2.7–3.2x while
close rates hold or grow. Neither cluster is analyst-audited (no shared methodology, no
named study behind either number), and they point in opposite directions — which is itself
the strongest argument yet against quoting either one to a client. The durable version of
the rule is to calculate your own target as 1 ÷ expected win rate (a team closing 20% of
qualified opportunities needs 5x coverage to hit plan) rather than adopt any fixed
multiplier from either direction — recompute it when the win rate moves.

**The coverage number games in both directions — don't trust it alone.** The moment a
coverage ratio becomes the target reps are measured against, it stops measuring what it
was built to measure. It moves two ways that have nothing to do with pipeline health: a
rep protecting this period's number slides a deal's close date into the next one — which
quietly pre-loads next period's ratio too — or opportunities with no budget, no timeline,
or no ICP fit get logged just to keep the number green. Neither shows up in the coverage
ratio itself. Pair it with two signals that catch what it hides: the rate of close-date
pushes per rep (someone moving dates more than the rest of the team isn't managing risk,
they're managing the metric), and stage-to-stage conversion on that same cohort of deals
(junk pipeline shows up as opportunities that enter and then stall or die at the next
stage, not ones that progress). Coverage alone answers "do we have enough logged" — it
was never built to answer "is what's logged real."

**Rules for the KPI tree:**
- Each leading indicator must be movable by a named team or person in a single week
- No orphan metrics (metrics that require other teams but have no joint owner)
- No lagging indicators at the weekly level — track them monthly, reference them in the weekly for context only

For each metric, define three thresholds. These are not opinions — they are pre-committed rules. Thresholds set in the moment of a red metric always favor the metric owner.

**Threshold structure:**

| Status | Definition | Response |
|--------|-----------|----------|
| **Green** | Within 10% of target | No action required |
| **Amber** | 10–25% below target | Flag with one hypothesis; monitor next week |
| **Red** | >25% below target OR red two weeks in a row | Full IDS treatment — owner, root cause, action, deadline |

**Example thresholds:**

| Metric | Target | Amber | Red |
|--------|--------|-------|-----|
| ICP outreach sequences activated | 20/week | <18 | <15 or 2 weeks <18 |
| Positive reply rate | 5% | <4.5% | <3.5% |
| Discovery calls held | 8/week | <7 | <6 or 2 weeks <7 |
| Pipeline coverage (next Q) | 1÷win rate (sources disagree on direction, 2026 — see Step 2) | 10–25% below target | >25% below target or 2 weeks amber |
| Demo-to-proposal conversion | 50% | <45% | <37% |

**The two-week rule:** A metric that is amber for two consecutive weeks automatically becomes red. Growth problems rarely resolve themselves.

**The one legitimate reason to move a threshold mid-quarter** is a stated change in the
assumption it was built on — a pricing change, an ICP redefinition, a channel launched or
paused — the same class of event the Annotations field exists to catch. Log it, then reset
the threshold at the next meeting with the new assumption stated out loud. The illegitimate
reason, which comes up far more often, is a metric owner asking for room the week they're
about to miss it. That gets the same answer every time: no — take the red, bring a root
cause. A threshold that moves because someone is uncomfortable isn't a threshold.
