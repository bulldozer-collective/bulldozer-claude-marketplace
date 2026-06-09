---
name: deliverability-reputation
description: Audit and fix email deliverability — DNS authentication setup (SPF/DKIM/DMARC), domain warming protocol, bounce and spam rate benchmarks, inbox placement testing, and reputation recovery. Triggers on 'deliverability,' 'emails going to spam,' 'inbox placement,' 'domain reputation,' 'email warmup,' 'bounce rate,' 'our emails aren't getting through,' or 'set up DMARC.' For outbound sequence strategy, see audit-outbound. For automation stack, see growth-automation.
when-to-use: Audit and fix email deliverability — DNS authentication setup (SPF/DKIM/DMARC), domain warming protocol, bounce and spam rate benchmarks, inbox placement testing, and reputation recovery. Triggers on 'deliverability,' 'emails going to spam,' 'inbox placement,' 'domain reputation,' 'email warmup,' 'bounce rate,' 'our emails aren't getting through,' or 'set up DMARC.' For outbound sequence strategy, see audit-outbound. For automation stack, see growth-automation.
argument-hint: Sales team sending 500 emails/day from primary domain — bounce rate at 4.2%, spam complaints rising, inbox placement dropped to 60%. Need to diagnose and fix before the next campaign.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

- Global average inbox placement: 83.5% (Validity 2025)
- Target for cold outbound: 85%+
- Full authentication (SPF + DKIM + DMARC): 83.75% avg inbox placement
- No authentication: 44.99% avg inbox placement
- Authentication alone does NOT guarantee inbox placement — warmup is the second requirement

**Since February 2024, Gmail and Yahoo enforce hard rules on senders >5,000 emails/day:**
- SPF + DKIM + DMARC must all pass
- Spam complaint rate < 0.3% (Gmail recommends < 0.1%)
- One-click unsubscribe required for marketing email

Missing any of these means emails get filtered to spam — no warmup protocol compensates.

---

## Step 1: Authentication Audit

**Test current status before making changes.** Use mail-tester.com (send a test email → score should be 9–10/10) and Google Postmaster Tools (domain registration required).

### SPF (Sender Policy Framework)

SPF specifies which mail servers are authorized to send on behalf of your domain. Every legitimate sending source must be listed.

**Check:** Does your DNS have a TXT record starting with `v=spf1`?

**Required format:**
```
v=spf1 include:[your-ESP.com] include:[secondary-sender.com] -all
```
- `include:` — authorized sending services (HubSpot, Google Workspace, Instantly, Lemlist, etc.)
- `-all` — hard fail for anything not listed (recommended)
- `~all` — soft fail (more permissive, acceptable for initial setup)

**Common SPF mistakes:**
- Missing a sending service (every tool that sends email on your behalf must be included)
- Too many `include` lookups (maximum 10 DNS lookups — split into subdomains if needed)
- Using both `-all` and `~all` (use one)

### DKIM (DomainKeys Identified Mail)

DKIM adds a cryptographic signature to emails. Receiving servers verify the signature using your public DNS key.

**Check:** Log into your email sending tool → find DKIM settings → verify the DNS record is published and validated.

**Setup path (varies by provider):**
- Google Workspace: Admin console → Apps → Gmail → Authenticate email → Generate DKIM record
- HubSpot: Settings → Marketing → Email → Authentication → Add DKIM record
- Instantly / Lemlist: Settings → Email accounts → DKIM → Add DNS record provided

**Validate:** Use `dig TXT selector._domainkey.yourdomain.com` — should return a `p=` public key.

### DMARC (Domain-based Message Authentication, Reporting & Conformance)

DMARC tells receiving servers what to do when SPF or DKIM fail — and sends you reports so you can monitor.

**Check:** Does `_dmarc.yourdomain.com` have a TXT record?

**Setup progression:**
1. **Start with monitoring:** `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`
   - p=none: take no action on failures, just report
   - rua: where to send aggregate reports (use a dedicated DMARC inbox)
   
2. **After 2 weeks of clean reports → quarantine:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com`
   
3. **After 2 weeks of clean quarantine → enforce:** `v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com`

**Authentication inbox placement data:**
| Authentication Profile | Avg Inbox Rate | Bounce Rate |
|----------------------|----------------|-------------|
| Full (SPF + DKIM + DMARC) | 83.75% | 1.92% |
| SPF + DKIM, no DMARC | 74.20% | 3.36% |
| No authentication | 44.99% | 8.74% |

Only 7.6% of domains have enforced DMARC (p=quarantine or reject). Enforcing it is a differentiator for inbox placement.

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
- Age the domain at least 3–4 weeks before warming (new domains have a 30pp inbox placement penalty)
- Configure SPF + DKIM + DMARC on the outbound domain before starting warmup
- Add a real website to the outbound domain (even a redirect to the primary site) — bare domains raise spam scores

**Custom tracking domain:**
Configure a custom tracking domain for link and open tracking. This ensures tracking pixels don't share reputation with your sending domain. Set up in your sequencer tool settings.

---

## Step 3: Warmup Protocol

**Warmup = gradually increasing send volume to build sender reputation.** Email providers treat new senders as suspicious. Warmup is the process of proving you're a legitimate sender.

**Authentication must be fully validated before starting warmup.** If authentication fails during warmup, you waste weeks of reputation building.

**New domain warmup schedule:**

| Week | Daily volume | Approach | KPIs to monitor |
|------|-------------|----------|----------------|
| 1 | 20–50 emails/day | Warmup tool only (InboxWarm, Mailreach, Smartlead warmup pool) | Spam complaint rate < 0.1% |
| 2 | 50–100/day | Warmup tool + start with 5–10 real recipients | Bounce rate < 2% |
| 3 | 100–200/day | 50% warmup / 50% real outreach | Inbox placement > 75% |
| 4 | 200–400/day | 30% warmup / 70% real outreach | Inbox placement > 80% |
| 5–6 | 400–600/day | Full real outreach (warmup tool can stay on in background) | All benchmarks met |

**Warmup tools:** InboxWarm, Mailreach, Instantly built-in warmup, Lemlist warmup — all simulate email activity between real inboxes to build engagement signals.

**New mailbox warmup (on an established domain):**
- 2–3 weeks warmup required for each new mailbox added
- Don't add all new mailboxes simultaneously — stagger by 1 week
- Max mailboxes per domain: 3–5 (more dilutes the domain reputation)

**Volume limits by setup:**
- New domain, first 30 days: max 50 emails/day
- New domain, day 31–60: max 200 emails/day
- Established domain (6+ months, clean reputation): up to 500/day per mailbox
- Multiple mailboxes on one domain: total domain volume cap applies — don't just multiply per-mailbox limits

---

## Step 4: Benchmark Scorecard

Track these metrics per domain and per campaign. If any metric hits the danger threshold, pause and diagnose before sending more.

| Metric | Target | Warning | Danger (pause and fix) |
|--------|--------|---------|------------------------|
| **Inbox placement rate** | >85% | 70–84% | <70% |
| **Bounce rate** | <2% | 2–4% | >4% (list quality crisis) |
| **Spam complaint rate** | <0.1% | 0.1–0.3% | >0.3% (Gmail enforcement threshold) |
| **Open rate (cold)** | >25% | 15–25% | <15% (deliverability or subject line issue) |
| **Reply rate (cold)** | >5% | 2–5% | <2% |
| **Unsubscribe rate** | <0.2% | 0.2–0.5% | >0.5% |

**Test inbox placement:** Use GlockApps or Smartlead SmartDelivery — these tools send test emails to seed accounts at Gmail, Outlook, Yahoo, and others, then report where they landed (inbox / spam / promotions).

**Google Postmaster Tools (free, mandatory):** Register your sending domain at postmaster.google.com. Monitor: domain reputation (Good/Medium/Low/Bad), IP reputation, spam rate, delivery errors. If domain reputation drops to "Low" or "Bad," pause outbound and investigate immediately.

---

## Step 5: List Quality

**Bounce rate > 2% means the list quality is the problem, not the authentication.**

**Before every campaign:**
1. Verify all emails through NeverBounce or ZeroBounce (catch-all, invalid, disposable)
2. Remove hard bounces immediately (these addresses don't exist — sending again = spam signal)
3. Remove contacts with 3+ soft bounces (temporary delivery failures that keep recurring)
4. Remove unsubscribes and spam complaints immediately (do not wait for the next list pull)

**List quality by source:**
- Clay waterfall enrichment with verification: typically 3–5% invalid rate
- Purchased lists: typically 15–30% invalid rate — never use without full verification
- Scraped LinkedIn data: 5–10% invalid rate (emails often guessed)
- Form fills / inbound: typically < 1% invalid rate (highest quality)

**The bounce calculation:**
```
Bounce rate = (Hard bounces + Soft bounces repeated) ÷ Emails sent

Example: 15 hard bounces + 5 repeat soft bounces out of 1,000 emails sent = 2.0% bounce rate
```

---

## Step 6: Reputation Recovery

If reputation is already damaged (Gmail Postmaster shows "Low" or "Bad," inbox placement <60%):

**Phase 1: Stop