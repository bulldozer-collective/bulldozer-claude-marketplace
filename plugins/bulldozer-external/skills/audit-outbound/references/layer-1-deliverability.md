# Layer 1: Deliverability & Infrastructure

### Domain Health
- SPF, DKIM, DMARC records: all three must be properly configured. Missing DMARC = deliverability risk at scale
- Domain age: sending domains under 60 days in age must be in active warm-up. Under 90 days = treat as probable cause of any deliverability issue
- Blacklist status: check all sending domains against Spamhaus, SURBL, and Barracuda. One major blacklist listing can suppress inbox placement across the entire ICP. (Use MXToolbox: covers 100+ lists)
- Sender Score (Validity): a third-party approximation, not something Gmail/Outlook/Yahoo compute themselves — treat it as a signal, not a verdict. Current guides converge on >80 = healthy, 70–79 = warning zone (throttling starts), <70 = active problem, <50 = serious.

### Since November 2025: Gmail and Yahoo can reject outright, not just spam-fold
For senders sending 5,000+ messages/day to Gmail/Yahoo, missing authentication, a spam-complaint rate above 0.3%, or no one-click unsubscribe no longer means "landed in spam" — it can mean the message is rejected outright. This is a bulk-sender policy, confirmed by convergent deliverability-industry reporting (no official Google page reachable to cross-check directly). Below that volume the same hygiene still applies, just without the hard rejection.

### Warm-Up Status
The exact day-by-day ramp is not something to cite as a fixed rule: 2026 guides diverge widely on the "full ramp" ceiling — anywhere from ~30 to 150 cold emails/day/mailbox depending on the source and the warm-up tool used. What's consistent across sources:
- Start low (roughly 15–20/day) on a new or reactivated domain and increase gradually over 3–4 weeks, never in a single jump
- Keep some warm-up traffic running even after the domain is live — don't switch 100% to cold the moment ramp-up ends
- Sudden volume spikes — even on healthy domains — trigger algorithmic spam filters. Flag any week where volume increased >20% without a corresponding warm-up extension

Ask the client what ceiling their warm-up tool (Lemwarm, Mailreach, etc.) actually recommends for their setup rather than asserting a universal number.

**Watch the warm-up tool itself, not just its ramp.** 2026 deliverability commentary converges on a specific failure mode: a shared, fully automated warm-up pool — mailboxes that only ever email each other, on the same tool, the same schedule, with uniform engagement — is an increasingly recognizable pattern, and mailbox providers are reported to discount or flag that engagement rather than reward it, precisely because it's a closed loop rather than real recipient behavior. Don't leave a domain on 100% tool-driven warm-up traffic past the first couple of weeks; blend in real sends as soon as volume allows. A domain still at 100% warm-up-tool traffic in week 3 is itself a finding, not just a detail of the ramp.

**Retire, don't nurse, once damage is confirmed.** Warm-up builds reputation on a clean domain — it is not a cure for one that's already hurt. Google retired the old Postmaster Tools reputation tiers (High/Medium/Low/Bad) with the v1 dashboard on September 30, 2025, and stopped reporting reputation data around August 2026 — a domain's standing now shows as a Compliance Status (Compliant / Needs work / No data found) plus a Deliverability Analysis verdict (added June 2026), a rules-check rather than a reputation score. Don't cite a "Low" or "Bad" Postmaster reputation as something a client can still look up. The senior call is the same as before: once a domain's Compliance Status has actually turned to "Needs work" on the spam-rate signal, or a fresh seed-list placement test lands in spam, stop sending from it and move volume to fresh infrastructure rather than repeating a slower warm-up cycle on the same one. A concrete line worth citing — anchored to Gmail's own published mitigation criteria rather than an aggregator average: Gmail only restores sending eligibility on the spam-rate control once the complaint rate holds below 0.3% for 7 consecutive days, which in practice means a 2–4 week recovery, not an afternoon fix. Once the rate is sitting at or above that same 0.3% line (the one that also triggers outright rejection — see Bounce & Complaint Rates below) and isn't coming back down, or the domain lands on multiple major blocklists (Spamhaus, Barracuda, SpamCop) at the same time, retiring is faster than nursing it. Below that line, give real recovery a few weeks first. Teams that run real volume keep several domains in rotation for exactly this reason instead of betting a client's whole send capacity on nursing one back. This is a threshold call, not a rule to trip on the first soft metric — one week of a slightly elevated bounce rate doesn't mean retire; a confirmed compliance/spam-rate verdict or a spam-folder placement result does.

### Inbox Placement
Bounce rate and spam complaint rate do not tell you where email is landing. Use a seed list test (GlockApps, or a similar multi-inbox panel) to get actual placement data across Gmail, Outlook, and Yahoo — treat it as directional (a fixed test panel, not the real list), not a certainty. Mailgenius and mail-tester.com score a single send for spam triggers and authentication; neither runs a seed-list panel across providers, so don't cite them as a placement-data source.

- Target: >85% inbox placement — close behind the 2026 industry-wide average: Validity's 2026 Email Deliverability Benchmark Report puts global placement at 87.2% (Gmail 89.8%, Yahoo 87.3%, Apple 82.0%, Microsoft 77.4% — Microsoft stays the weakest of the major mailbox providers)
- <80%: active infrastructure problem — do not scale sends
- Google Postmaster Tools no longer shows a domain-reputation tier to check (see the warm-up section above for the 2025–2026 shift to Compliance Status) — use its Compliance Status and spam-rate dashboard instead of asking for a "Low" or "Bad" reading. Recovery timeframes are still only an order of magnitude, from deliverability-industry blogs rather than an official Google source: minor damage can turn around in 3–14 days once risky segments stop being sent to and complaints/bounces are held down; moderate damage in 2–6 weeks; severe damage (sustained spam-folder placement) in 6–12+ weeks, with some domains never fully recovering

### Bounce & Complaint Rates
| Metric | Healthy | Investigate | Critical |
|--------|---------|-------------|---------|
| Bounce rate | <2% | 2–5% | >5% |
| Spam complaint rate | <0.08% | 0.08–0.3% | >0.3% |
| Open rate | >40% | 25–40% | <25% |
| Reply rate | >5% | 2–5% | <2% |
| Positive reply rate | >50% of replies | 30–50% | <30% |

The 0.3% spam-complaint ceiling is not arbitrary — it's the exact line Gmail/Yahoo bulk-sender policy uses for outright rejection (see above). Below 0.08% is comfortably under it; between 0.08% and 0.3% is close enough to the line to fix now, not just "investigate."
