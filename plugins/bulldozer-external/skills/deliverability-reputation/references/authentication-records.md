# SPF, DKIM and DMARC — Audit Detail

## SPF, DKIM and DMARC

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

**Authentication level and inbox placement move together, in this order:** full authentication with DMARC enforced places best, SPF+DKIM without an enforced DMARC policy sits in the middle, and no authentication lands worst by a wide margin. Don't quote a precise inbox-rate or bounce-rate figure per profile — no current, checkable source backs one, and repeating one would be false precision.

DMARC enforcement (p=quarantine or p=reject) is still a minority practice, but less of one than it looks at first glance — and the two figures that get quoted for it measure different things, so don't conflate them. The best-sourced 2026 estimate (EasyDMARC's DMARC Adoption & Enforcement Report, 1.8M domains analyzed) puts enforcement at 22.9% of *all* domains — against 52.1% of that same set publishing any valid DMARC record at all. In other words, a domain that has gotten as far as publishing DMARC is still close to a coin flip on whether it actually enforces (≈44% of DMARC-adopting domains, in line with a separately reported ~42% "enforcement plateau" among adopters). A much smaller figure often quoted alongside this — around 9% — is not the enforcement rate: it's the narrower share combining p=reject specifically *with* aggregate (rua=) reporting, the stricter setup Step 1 above recommends working toward. Enforcing DMARC remains a differentiator for inbox placement precisely because the clear majority of domains, even DMARC-aware ones, still don't.

**Strict or relaxed alignment — pick relaxed by default for an outbound stack.** DMARC's `adkim`/`aspf` tags choose how strictly the From-domain must match the authenticating domain: strict demands an exact match, relaxed accepts any subdomain of the organizational domain. An outbound program almost always sends through a sequencer or ESP and often through a purpose-built subdomain (Step 2's architecture) — relaxed is the setup that tolerates that without false failures. Reach for strict only once every sending source is known, audited, and stable (a single mailbox, no third-party sequencer) — recommending strict on a stack still being built is a common over-engineering trap that turns a minor DNS oversight into a full outage instead of a warning.
