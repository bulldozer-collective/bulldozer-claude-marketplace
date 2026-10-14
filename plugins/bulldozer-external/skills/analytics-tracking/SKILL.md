---
name: |-
  analytics-tracking
description: |-
  Set up, fix, or audit analytics tracking — conversion tracking, event tracking, UTM parameters, and tracking plans. Triggers on 'set up tracking,' 'conversion tracking,' 'event tracking,' 'UTM parameters,' 'tracking plan,' or 'analytics isn't working.' For A/B test measurement, see ab-testing.
when-to-use: |-
  Set up, fix, or audit analytics tracking — conversion tracking, event tracking, UTM parameters, and tracking plans. Triggers on 'set up tracking,' 'conversion tracking,' 'event tracking,' 'UTM parameters,' 'tracking plan,' or 'analytics isn't working.' For A/B test measurement, see ab-testing.
argument-hint: |-
  Set up GA4 + GTM for a SaaS marketing site — need conversion tracking for demo requests
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Analytics Tracking

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on analytics implementation. Your goal is to set up tracking that provides actionable insights for marketing and product decisions — not vanity metrics.

## Input

`$ARGUMENTS` — what to track, what tool(s) to use, and what's broken or missing (e.g., "Set up GA4 + GTM for a SaaS site — need demo request and trial signup conversions"). If not provided, read any available context files before asking. Only ask if the primary tracking objective is completely absent.

## Output

A `tracking-plan-{product}.md` file with: event list (event name, properties, trigger), GA4/GTM implementation guide with code examples, UTM naming convention, validation checklist, and common issues guide. Includes ready-to-use GTM tags, triggers, and variables for the specified events.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Track for Decisions, Not Data

Every event should inform a decision. Work backwards: what do you need to know? What action will you take based on this data?

Avoid vanity metrics. Don't track "pageviews" for the sake of it — track the pageviews that correlate with purchase intent.

### 2. Start with the Questions

Before setting up any tag:
- What do you need to know?
- What actions will you take based on this data?
- Is this metric actionable by your team?

### 3. Name Things Consistently

Naming conventions matter more than most teams realize. Set them before implementation.

**Standard format**: Object-Action

```
signup_completed
button_clicked (avoid — too generic)
cta_hero_clicked (better — includes context)
checkout_payment_completed
```

**Rules**: lowercase, underscores, be specific, context in property not event name.

### 4. Quality Over Quantity

Clean data beats more data. Validate every event before moving on.

A tracking plan that tries to capture everything "just in case" is the surest way to get one nobody trusts. Push back on requests to add events with no decision attached to them — every extra event is something a future person has to validate, maintain, and reconcile against what GA4 already tracks automatically (see Enhanced Measurement below) forever.

---

## Tracking Plan Framework

### Essential Events by Site Type

**Marketing Site (SaaS)**:

| Event | Properties | Trigger |
|-------|------------|---------|
| `cta_clicked` | button_text, location, page | Any CTA click |
| `demo_requested` | source, form_location | Demo form submit |
| `trial_signup_started` | plan, source | Signup page loaded |
| `signup_completed` | method, plan | Success confirmation |
| `pricing_page_viewed` | — | /pricing page load |
| `form_submitted` | form_type | Any form |

GA4 Enhanced Measurement already fires `page_view` and `form_submit` automatically once enabled — check DebugView before building a custom trigger for `pricing_page_viewed` or `form_submitted`, or the site ends up sending both and double-counting.

**Product/App**:

| Event | Properties | Trigger |
|-------|------------|---------|
| `onboarding_step_completed` | step_number, step_name | Each onboarding step |
| `feature_used` | feature_name | Core feature action |
| `purchase_completed` | plan, value, currency | Payment success |
| `subscription_cancelled` | reason, plan | Cancel action |

---

## GA4 Implementation

### Quick Setup

1. Create GA4 property + data stream for your domain
2. Install via Google Tag Manager (preferred) or gtag.js
3. Enable Enhanced Measurement — it auto-tracks page views, scroll depth (90%), outbound clicks, site search, video engagement, file downloads and form submissions, no code required for any of them
4. Configure custom events for your conversion goals
5. Mark key events as Conversions in GA4 Admin — if the project's GA4 property is connected in Bulldozer, `bdzListGoogleAnalyticsConversionEvents` returns the live list of conversion events configured on the property, so this step can be checked without opening GA4 Admin

### Custom Event via GTM

**Data Layer Push** (add to site code at trigger point):

```javascript
// When a demo is requested
dataLayer.push({
  'event': 'demo_requested',
  'form_location': 'header',
  'page_path': window.location.pathname
});
```

**GTM Setup**:
1. Tag: GA4 Event → Event Name: `{{Event}}` → Parameters: form_location, page_path
2. Trigger: Custom Event → Event Name: `demo_requested`

### GTM Container Structure

| Component | Purpose |
|-----------|---------|
| Tags | Code that executes (GA4, pixel, HubSpot) |
| Triggers | When tags fire (page view, click, custom event) |
| Variables | Dynamic values (click text, data layer values, URL) |

**Folder organization in GTM**: Group by tracking system (GA4, Meta, LinkedIn) not by page.

### Client-Side Is the Default — Server-Side (sGTM) Is a Trade-Off, Not an Upgrade

Standard web GTM (client-side) is the right starting point for most B2B SaaS marketing sites. Server-side GTM is a system to build, host and maintain — a real monthly cost, not a free data-quality upgrade — worth it when volume or regulatory exposure justifies it (heavy ad spend, e-commerce, GDPR-sensitive sectors), not by default for a mid-size site. Don't take a vendor's "20-40% data loss to ad-blockers" claim at face value — measure the gap on your own traffic first. Full cost breakdown (Cloud Run instance count and pricing) and the independent test that debunks the vendor numbers: `references/server-side-gtm.md`.

### Attribution Model — Know What This Plan Does and Doesn't Decide

This plan gets events firing correctly and named consistently. It does not decide which channel gets credit for a conversion — that's the attribution model, set in GA4 Admin > Attribution Settings, not in GTM. GA4 offers three property-level models (Data-Driven Attribution by default, Paid and Organic Last Click, and a Google-Ads-only last-click model that silently falls back to Paid and Organic whenever a path has no Google Ads touchpoint), and DDA needs enough volume to be trusted — but no official, current conversion-volume threshold exists for either GA4 or Google Ads today, so don't cite a specific number: check the account directly instead (Google Ads' own "Switch to DDA" page, or watch for last-click-looking results on a GA4 property set to DDA). When a channel's numbers swing with no GTM/GA4 config change behind it — including after GA4's April 2026 attribution restructure, which reset some properties back to data-driven — check Attribution Settings before treating it as a broken tag (see Common Issues below). Don't let this tracking plan double as an attribution report — that's a separate, model-aware conversation (see the dedicated attribution skill). Full detail, dates and the Google Ads native-selector change: `references/attribution-model.md`.

---

## UTM Parameter Strategy

### Standard Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `utm_source` | Traffic source | `google`, `newsletter`, `linkedin` |
| `utm_medium` | Marketing medium | `cpc`, `email`, `social`, `organic` |
| `utm_campaign` | Campaign name | `spring_launch`, `brand_search` |
| `utm_content` | Differentiate versions | `hero_cta`, `sidebar_link` |
| `utm_term` | Paid search keywords | `project+management+software` |

**Naming conventions**:
- Lowercase everything
- Underscores or hyphens consistently (pick one, never mix)
- Be specific: `blog_footer_cta`, not `cta1`
- Document all UTMs in a shared spreadsheet

**Quick builder**: Use a Google Sheets UTM builder with drop-down validation to enforce consistency across the team.

### Never Tag Internal Links

The most common way a clean tracking plan gets quietly undermined isn't a missing tag — it's UTMs added to links between pages of the same site (nav links, in-content CTAs, footer links). GA4 attributes a new session to whatever source/medium a URL's UTM carries, so an internally-tagged link can reset the visitor's original source mid-visit — and once that tagged URL gets copied, bookmarked or shared, the pollution keeps recurring. Reserve UTMs strictly for links that leave the property (email, social, paid, partner sites); track internal link clicks as a GTM custom event instead (`cta_clicked`, already in the events table above — its `location` property says where the click came from, no UTM needed). For a product that spans multiple domains or subdomains, use GA4's cross-domain measurement and referral exclusion list to stitch sessions together — never UTMs — so the two mechanisms don't get mixed.

---

## Debugging and Validation

### Testing Tools

| Tool | Use for |
|------|---------|
| GA4 DebugView | Real-time event monitoring (enables with debug_mode=true) |
| GTM Preview Mode | Test triggers before publishing |
| Tag Assistant | Chrome extension for tag validation |

### Validation Checklist

- [ ] Events firing on correct triggers (test each one manually)
- [ ] Properties populating with correct values
- [ ] No duplicate events (common: GTM + gtag.js both installed)
- [ ] Works on mobile (especially important for popup and CTA events)
- [ ] Conversions recorded correctly in GA4 and in ad platforms
- [ ] No PII leaking into event properties (emails, names, addresses)
- [ ] Report shows the % of fires where each key property is actually populated — an event that always fires but is blank half the time is a silent tracking gap, not a validated event

### Common Issues

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| Events not appearing in GA4 | Tag not firing | Check GTM preview mode — is the trigger condition met? |
| Wrong property values | Data layer key mismatch | Console.log `dataLayer` and check the key names |
| Duplicate events | Multiple tracking scripts | Audit for duplicate GTM containers or gtag.js installs |
| Conversions not attributed | UTMs missing or broken | Test a full UTM URL end-to-end |
| Channel numbers shifted, nothing changed in GTM/GA4 config | Attribution model or lookback window changed in GA4 Admin, or a platform-side model reset/recalibration (e.g. the April 2026 GA4 attribution restructure) | Check Admin > Attribution Settings before treating it as a broken tag |

---

## Privacy and Compliance

- **EU/UK**: Cookie consent required before firing tracking tags. Implement Consent Mode v2 — the four signals are `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`; without the latter two set correctly, Google Ads and GA4 lose personalized-ads, remarketing and conversion-tracking capability for EEA/UK traffic. Mandatory since March 2024 (DMA / EU User Consent Policy); Google began actively enforcing it on July 21, 2025 — non-compliant accounts lose personalized-ads, remarketing and conversion-tracking access, not just a warning — treat it as a launch blocker, not a nice-to-have, for any site with EU/UK visitors. Since June 15, 2026, `ad_storage` alone governs whether advertising data reaches a linked Google Ads account — Google Signals no longer acts as a fallback and is now reporting-only inside GA4. Test the consent banner's `ad_storage` signal specifically on any site connected to Google Ads: get that wrong post-migration and conversions, remarketing audiences and Smart Bidding signals can go quiet with nothing left to catch the gap.
- **No PII in events**: Never put email addresses, names, or phone numbers in event properties.
- **Data retention**: GA4 defaults to 2 months for the event-level data used in Explorations (funnels, path analysis, custom segments) — not 14. Raise it to 14 months, the ceiling on a free GA4 property, in Admin > Data Settings > Data Retention. Standard reports aggregate data that isn't subject to this ceiling and persists regardless.
- **User deletion**: Have a process to delete user data on request (GA4 supports this natively).

---

## Output: Tracking Plan Document

Ready-to-copy template (Overview, Events table, Custom Dimensions, UTM Convention): `references/tracking-plan-template.md`.

Once the plan is live, add a population-rate column to the Events table: the % of fires where each key property is non-empty. An event that's 100% present but only 60% populated with `form_location` isn't validated, it's decoration.