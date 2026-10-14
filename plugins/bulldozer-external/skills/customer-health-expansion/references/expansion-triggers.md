# Expansion Trigger Library and Readiness Checklist

## Step 3 — Expansion Trigger Library

| Trigger | Signal | Detection | Response | Timeline |
|---------|--------|-----------|----------|---------|
| **Usage ceiling** | >80% of plan limit used for 2 consecutive months | Usage API threshold alert | CSM outreach: usage review + tier preview | Respond within 48 hours |
| **Seat saturation** | >85% of available seats active | Weekly utilization report | CSM: team growth discussion + expansion proposal | Outreach within 7 days |
| **Feature exploration** | 3+ premium/gated features accessed in 14 days | Product analytics events | In-app prompt + CSM notification | Respond within 5 days |
| **Champion promotion** | Internal champion gets promoted (LinkedIn signal) | Re-run the OS's LinkedIn employee search for the account's company, diff against the last stored list | Executive acknowledgment + expansion review | Outreach within 14 days |
| **Headcount growth** | 20%+ employee growth (hiring signals, LinkedIn) | Same LinkedIn employee search, compare headcount between snapshots | CSM: growth alignment call + team expansion discussion | Outreach within 21 days |
| **Power user emergence** | 2x average engagement in 30 days from 1–2 users | Product analytics | CSM: department expansion discussion | Flag in weekly review |
| **Advocacy signal** | NPS 9–10, no referral requested in 6 months | NPS survey results | Referral request + case study invitation | Trigger within 48 hours of NPS score |
| **60-day pre-renewal** | Renewal date minus 60 days, health score green | Calendar trigger | Strategic review with expansion options presented | Begin process at 60-day mark |

**Calibrate the percentages above, don't import them.** The 80%/85% usage and seat cutoffs in this table are starting heuristics, not a market standard — usage-based and seat-based products don't converge on one number, and a threshold copied from a vendor blog will misfire on this account base's own pricing model. Run them against this book's own expansion-vs-churn history for a quarter before trusting them as hard triggers.

**Expansion readiness checklist (must pass before CSQL is created):**
- [ ] Health score ≥75 for at least 30 days
- [ ] Core feature activation milestone reached
- [ ] At least one executive touchpoint in the last 90 days
- [ ] The person who can actually approve this specific spend is identified by name — an executive touchpoint is not the same as knowing who signs
- [ ] No unresolved escalated support tickets
- [ ] Active users ≥60% of licensed seats (SMB) / 70% (mid-market) / 75% (enterprise) — same caveat as the trigger table above: starting heuristics by segment, not source-backed benchmarks, calibrate against this book's own history

**A cheap first check before the checklist above: how many contacts are actually on this deal.** HubSpot auto-populates a deal's associated-contacts count. An expansion opportunity sitting at one associated contact for months — even on a green-scored account — is single-threaded before anyone reviews a call. Run this check first, not instead of the checklist: a low count is a reason to add stakeholders before pitching expansion, not a reason to skip the account. Once there's more than one contact, `hs_buying_role` says which one is actually tagged Decision Maker, Budget Holder or Executive Sponsor — the checklist item above asks for a name, and this field is how to get past a job title to it instead of guessing from seniority.

**If an expansion deal stalls in the customer's own procurement, legal or security review** despite the account team following up promptly, treat it the same as a stalled new-business deal: it usually means no economic buyer on the customer's side has actually said yes internally yet, not that the review itself is slow. Chasing the process faster doesn't fix that — going back to identify who can approve the spend does.
