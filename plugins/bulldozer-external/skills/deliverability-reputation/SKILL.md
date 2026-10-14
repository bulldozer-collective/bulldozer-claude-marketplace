---
name: |-
  deliverability-reputation
description: |-
  Audit and fix email deliverability — DNS authentication setup (SPF/DKIM/DMARC), domain warming protocol, bounce and spam rate benchmarks, inbox placement testing, and reputation recovery. Triggers on 'deliverability,' 'emails going to spam,' 'inbox placement,' 'domain reputation,' 'email warmup,' 'bounce rate,' 'our emails aren't getting through,' or 'set up DMARC.' For outbound sequence strategy, see audit-outbound. For automation stack, see growth-automation.
when-to-use: |-
  Audit and fix email deliverability — DNS authentication setup (SPF/DKIM/DMARC), domain warming protocol, bounce and spam rate benchmarks, inbox placement testing, and reputation recovery. Triggers on 'deliverability,' 'emails going to spam,' 'inbox placement,' 'domain reputation,' 'email warmup,' 'bounce rate,' 'our emails aren't getting through,' or 'set up DMARC.' For outbound sequence strategy, see audit-outbound. For automation stack, see growth-automation.
argument-hint: |-
  Sales team sending 500 emails/day from primary domain — bounce rate at 4.2%, spam complaints rising, inbox placement dropped to 60%. Need to diagnose and fix before the next campaign.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Deliverability & Reputation

> This is a Bulldozer skill. You can write the perfect cold email, target the right prospect, and time the send perfectly. None of it matters if the email lands in spam. Deliverability is infrastructure — it must be correct before any outbound program runs.

You are a Bulldozer GTM engineer auditing and fixing email deliverability. Your job is to diagnose the current authentication setup, calculate the gap to benchmark, design the domain architecture, run the warmup protocol, and produce a standing monitoring system.

## Input

`$ARGUMENTS` — primary sending domain(s), current tool stack (CRM, sequencer), daily send volume, current bounce rate and spam complaint rate if known, and the specific symptom (emails going to spam, low open rates, account suspended). If not provided, read available context files. Ask once if the sending domain is completely absent.

## Output

A `deliverability-{company}.md` file with: authentication status and gaps, domain architecture recommendation, warmup protocol (new domains and mailboxes), benchmark scorecard, monitoring setup, and a prioritized fix list. Produces a step-by-step remediation plan, not just a diagnosis.

**Produce on first invocation. Run through the diagnostic checklist in order — authentication before warmup, warmup before volume.**

---

## The Deliverability Reality

- Global average inbox placement reached 87.2% in Validity's 2026 benchmark report (a 3.7-point year-over-year rise), per-provider: Gmail 89.8%, Yahoo 87.3%, Apple 82.0%, Microsoft 77.4% (still the laggard, though improving as senders catch up with its 2025 bulk-sender rules). Half a dozen independent secondary write-ups quote this exact figure and attribute it to the same named report — the primary report page itself couldn't be reached to confirm it directly (still blocked in this environment), but that's a real step up from last check, when no two secondary sources agreed on a number at all.
- Target for cold outbound: 85%+
- Full authentication (SPF + DKIM + DMARC) produces meaningfully higher inbox placement than no authentication at all — commonly cited as on the order of 2–3x, not a precise percentage. Distrust any source that gives this gap as a single-decimal figure; that level of precision isn't backed by a checkable study.
- Authentication alone does NOT guarantee inbox placement — warmup is the second requirement

**Since February 2024, Gmail and Yahoo enforce hard rules on senders >5,000 emails/day:**
- SPF + DKIM + DMARC must all pass
- Spam complaint rate < 0.3% (Gmail recommends < 0.1%)
- One-click unsubscribe required for marketing email

Missing any of these used to mean spam-foldering. Since November 2025 it means outright rejection: Gmail and Yahoo now bounce non-compliant bulk mail instead of delivering it to spam — no warmup protocol compensates for a message that never gets accepted in the first place.

---

## Step 1: Authentication Audit

**Test current status before making changes.** Use mail-tester.com (send a test email → score should be 9–10/10) and Google Postmaster Tools (domain registration required).

### SPF (Sender Policy Framework)

For the SPF, DKIM and DMARC audit detail — required record formats, common SPF mistakes, provider setup paths, validation commands, the DMARC monitoring-to-reject progression and the alignment guidance — read `references/authentication-records.md` when auditing or fixing authentication.

---

## Step 2: Domain Architecture

**Never send cold outbound from your primary brand domain.**

If your primary domain's reputation tanks — from a high bounce rate, spam complaint surge, or being flagged by Gmail — your transactional email, team communication, and marketing email all suffer with it.

**Separate domain architecture for outbound:**

```
Primary domain: yourcompany.com → Team email, transactional, marketing (protect this)
Outbound domain 1: get-yourcompany.com → Cold outbound sequences
Outbound domain 2: yourcompany-team.com → Secondary outbound (rotate volume)
```

**Domain selection rules:**
- Use the same brand name with a different suffix or prefix (recognizable but separate)
- Age the domain at least 3–4 weeks before warming — an unwarmed new domain places dramatically worse than a warmed one (vendor blogs cite figures anywhere from ~30 to ~75 points apart, which means none of them is a number worth repeating; the gap is real, the precise size isn't checkable)
- Configure SPF + DKIM + DMARC on the outbound domain before starting warmup
- Add a real website to the outbound domain (even a redirect to the primary site) — bare domains raise spam scores

**Custom tracking domain:**
Configure a custom tracking domain for link and open tracking. This ensures tracking pixels don't share reputation with your sending domain. Set up in your sequencer tool settings.

**If the client runs on Bulldozer OS, check the native domain stack before reaching for an external registrar.** Bulldozer OS can search, buy, and track sending domains directly: a search tool finds free domains against a keyword and TLD list with price and token cost upfront, a purchase tool buys them off the provider balance (spends real money — confirm with the user first, and note it's all-or-nothing: one already-taken or premium domain in the batch fails the whole purchase), and a listing tool shows what the project already owns with its status (pending → active, or failed). This doesn't replace anything above — age, SPF/DKIM/DMARC, and warmup still apply exactly as written — it's one more place to buy the domain, worth checking before a separate registrar account.

---

## Step 3: Warmup Protocol

**Warmup = gradually increasing send volume to build sender reputation.** Email providers treat new senders as suspicious. Warmup is the process of proving you're a legitimate sender.

**Authentication must be fully validated before starting warmup.** If authentication fails during warmup, you waste weeks of reputation building.

For the new-domain warmup schedule table, the warmup-tool caveat, the new-mailbox warmup rules and the volume limits by setup, read `references/warmup-protocol.md` when building the warmup plan.

---

## Step 4: Benchmark Scorecard

Track these metrics per domain and per campaign. If any metric hits the danger threshold, pause and diagnose before sending more.

| Metric | Target | Warning | Danger (pause and fix) |
|--------|--------|---------|------------------------|
| **Inbox placement rate** | >85% | 70–84% | <70% |
| **Bounce rate** | <2% | 2–5% | >5% (list quality crisis) |
| **Spam complaint rate** | <0.1% | 0.1–0.3% | >0.3% (Gmail/Yahoo bulk-sender threshold — crossing it since Nov. 2025 means rejection, not just spam-foldering) |
| **Open rate (cold)** | >25% | 15–25% | <15% (deliverability or subject line issue) |
| **Reply rate (cold)** | >5% | 2–5% | <2% |
| **Unsubscribe rate** | <0.2% | 0.2–0.5% | >0.5% |

**Test inbox placement:** Use GlockApps or Smartlead SmartDelivery — these tools send test emails to seed accounts at Gmail, Outlook, Yahoo, and others, then report where they landed (inbox / spam / promotions).

**Google Postmaster Tools (free, mandatory):** Register your sending domain at postmaster.google.com. The old four-tier domain/IP reputation table (Good/Medium/Low/Bad) is gone — Google retired it in the v1→v2 transition (v1 shut down September 2025). Monitor two things instead: **Compliance Status** (Compliant / Needs work / No data found — a pass/fail check on authentication, one-click unsubscribe, spam rate, and TLS) and **Deliverability Analysis** (added June 2026, a separate verdict in plain language — from `USERS_WANT_MAIL` down to `ABUSE_OR_SPAM` — answering "do people actually want this mail," not just "is it configured correctly"). A domain can show Compliant and still land a poor Deliverability Analysis verdict — check both, not just one. Spam complaint rate is still a plain number in both tools. If Compliance Status shows "Needs work" or the Deliverability Analysis verdict sits at the bottom of the scale (`SOMEWHAT_USERS_DONT_WANT_MAIL` or worse), pause outbound and investigate immediately.

---

## Step 5: List Quality

**Bounce rate > 2% means the list quality is the problem, not the authentication.**

**Before every campaign:**
1. Verify all emails through NeverBounce or ZeroBounce (catch-all, invalid, disposable)
2. Remove hard bounces immediately (these addresses don't exist — sending again = spam signal)
3. Remove contacts with 3+ soft bounces (temporary delivery failures that keep recurring)
4. Remove unsubscribes and spam complaints immediately (do not wait for the next list pull)

For the typical invalid rate by list source (Clay waterfall, purchased, scraped, inbound), read `references/list-quality.md` (section "List quality by source").

**A list you don't yet trust never touches the domain you rely on.** Full verification cuts invalid *addresses*, not the risk of a list that's simply the wrong people, wrong data, or bought in bulk — that risk only shows up after send, in complaint and reply behavior no verifier predicts. Refuse to run a purchased list, a first batch from a new scraping source, or any list acquired outside the team's normal sourcing straight through the primary outbound domain (Step 2). Route it through a disposable domain first and judge it on a small batch's real bounce and complaint numbers. If it burns a domain, it burns a spare — not the domain the rest of the program depends on.

For the bounce-rate formula and a worked example, read `references/list-quality.md` (section "The bounce calculation").

---

## Step 6: Reputation Recovery

For the three-phase recovery plan (stop and diagnose, fix the root cause, controlled rebuild) and the recover-or-replace decision with the threshold that ends a rehab attempt, read `references/reputation-recovery.md` when reputation is already damaged.

---

## Monitoring Setup

Deliverability is not a one-time audit — it degrades silently between checks. Put this cadence in place before closing out the engagement, not as an afterthought.

| Cadence | Check | Where |
|---------|-------|-------|
| Daily (while warming or rebuilding) | Bounce rate, spam complaints for the last 24h | Sequencer dashboard (Instantly / Lemlist / Smartlead) |
| Weekly | Compliance Status, Deliverability Analysis verdict, spam rate trend | Google Postmaster Tools (free, mandatory — register every sending domain) |
| Weekly | Inbox placement test (seed-account send) | GlockApps or Smartlead SmartDelivery |
| Before every list pull | Email verification pass, remove invalid/risky | NeverBounce or ZeroBounce |
| Monthly | DMARC aggregate reports — confirm no unauthorized senders, no authentication drift | The DMARC report inbox (`rua=` address from Step 1) |

**Alert thresholds** (tie these to the benchmark scorecard in Step 4): if bounce rate crosses 2%, spam complaints cross 0.1%, Compliance Status turns to "Needs work," or the Deliverability Analysis verdict drops a level, pause the campaign that day rather than waiting for the weekly check. A drop caught on day one is a warmup-schedule adjustment; the same drop caught two weeks later is a Step 6 recovery project.

---

## Prioritized Fix List

When multiple issues surface at once, fix in this order — each layer depends on the one before it, so fixing out of order wastes the fix:

1. **Authentication** (Step 1) — nothing else matters if SPF, DKIM, or DMARC is broken or missing. Fix this before touching volume or content.
2. **Domain architecture** (Step 2) — if cold outbound is still running from the primary domain, migrate it before doing anything else. Every day on the wrong domain is reputation risk on the domain that can't be replaced.
3. **List quality** (Step 5) — a bounce-rate problem is a list problem, not an authentication or warmup problem. Verify and clean before resuming or increasing volume.
4. **Warmup and volume** (Step 3) — only once authentication, domain, and list are clean does the volume schedule apply. Ramping volume on top of an unfixed list or a shared primary domain just accelerates the damage.
5. **Monitoring** (above) — once the first four are in place, this is what keeps the fix from silently regressing.

If reputation is already damaged, Step 6 overrides this order: stop first, diagnose, fix the specific root cause, then rebuild — the priority list above is for a clean or newly-damaged setup, not an active recovery.

---

## Rules

- **Authentication before volume, always.** Never start a warmup schedule, and never increase send volume, on a domain where SPF, DKIM, or DMARC isn't fully validated. Warmup on broken authentication burns weeks of reputation for nothing.
- **Never send cold outbound from the primary brand domain.** The primary domain carries transactional and internal mail that can't be sacrificed to a bad list or an aggressive sequence.
- **Since bulk sender enforcement tightened in November 2025, Gmail and Yahoo reject non-compliant mail outright — it no longer just lands in spam.** Missing authentication, a spam complaint rate over 0.3%, or no one-click unsubscribe on marketing mail can mean the message never gets delivered at all, not just filtered.
- **A bounce rate over 2% is a list problem, not a sending problem.** Fix the list before touching anything else — don't compensate for a bad list with a slower send cadence.
- **Pause on any danger-threshold breach (Step 4) — don't wait for the campaign to finish.** Continuing to send while a metric is in the danger zone is how a warning becomes a failing Postmaster Compliance Status or a bottom-of-scale Deliverability Analysis verdict.
- **Don't promise a response-rate number.** Deliverability determines whether the email arrives; it says nothing about whether the message is good. Never present deliverability fixes as a guarantee of reply or conversion rates.
- **A green warmup-tool dashboard is not a green light on its own.** It proves baseline sending history, not real-world placement — cross-check it against actual bounce and complaint data from real sends (Step 3) before moving up a volume tier.
- **Never let an unproven list share a domain with the outbound program that depends on it.** Purchased lists, first batches from a new source, anything not yet verified in production — quarantine it on a disposable domain (Step 2 + Step 5) until its real bounce and complaint rate is known.
- **Bulldozer OS has no object for this step.** No signal type, no domain-health check, nothing that overlaps authentication, warmup, or reputation monitoring — confirmed against the OS tool catalogue. Run this entirely through the dedicated tools above (Google Postmaster Tools, mail-tester.com, GlockApps, NeverBounce/ZeroBounce); don't force it into an OS report just because the rest of the engagement lives there.