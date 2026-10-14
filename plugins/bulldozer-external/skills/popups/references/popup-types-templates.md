# Popup Types and Templates

### Email Capture Popup

**Goal**: Newsletter/list subscription

**Copy structure**:
```
[Headline] Get the Growth Newsletter
[Subhead] 3 tactics every Monday. Read by 12,000 growth teams.
[Email field]
[CTA] Send Me the Newsletter
[Decline] No thanks, I'll figure it out myself
```

**Best practices**: Single email field only. Specific benefit with cadence. Include list size if >1,000.

**When to break the single-field rule**: one field maximizes raw fill rate, but for a B2B lead magnet it also maximizes the share of personal Gmail/Yahoo addresses and one-off signups a sales team can't work. If the CRM shows a large share of popup-sourced leads bouncing at first outreach — bad domain, no company match, never opens a follow-up — add one lightweight qualifying field (work email domain, or company size as a dropdown) even though it lowers the popup's own fill rate. The number that matters is leads a rep can actually work, not raw form completions; don't keep the field count minimal on faith once the CRM shows what it's actually buying.

**Before rendering the email field empty, check if the visitor is already known** (a page form filled earlier this session, a logged-in state, a cookie-synced CRM match) — see *Redundant Entry* under Compliance → Accessibility.

### Lead Magnet Popup

**Goal**: Exchange content for email

```
[Cover image of the guide]
[Headline] The Landing Page Teardown Guide
[Subhead] 47 pages. Real examples. Used by 3,200+ marketers.
[Email field]
[CTA] Get the Free Guide
[Decline] Not interested
```

**Best practices**: Show the cover image. Specific page count or asset size. Instant delivery expectation.

### Exit Intent Popup

**Goal**: Last-chance conversion before leaving

```
[Headline] Before you go — get 10% off
[Subhead] Use code WELCOME10 at checkout.
[Email field]
[CTA] Claim My Discount
[Decline] I'll pay full price
```

**Best practices**: Different offer from entry popup. Address a specific concern (price, commitment). No guilt-trippy decline copy.

**The threshold to change the offer**: a blanket, unlimited-use discount code trains visitors to open-and-abandon on purpose just to trigger it. Watch the code's redemption pattern once it's live — if a growing share of redemptions come from repeat visitors, or the code turns up on a coupon-aggregator site, that's the signal to switch to a code bound to the session or the captured email rather than a static string anyone can reuse or share. Don't wait for the discount to visibly erode margin before treating this as a live risk, not a hypothetical one — code leakage is usually visible in redemption data well before it shows up in the P&L.

### Announcement Banner (Top of Page)

**Goal**: Site-wide time-sensitive communication

```
🚀 New: AI Report Generation is live — [See what's new →]    [×]
```

**Best practices**: Single, clear message. Always dismissable. Link to more info. Remove after 14 days maximum — stale announcements damage credibility. It's non-modal by nature — see *Focus Not Obscured* under Compliance → Accessibility: it must never fully hide a page element that has keyboard focus while it's on screen.
