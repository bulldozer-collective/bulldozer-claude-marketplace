---
name: |
  analytics-tracking
description: |
  Set up, fix, or audit analytics tracking — conversion tracking, event tracking, UTM parameters, and tracking plans. Triggers on 'set up tracking,' 'conversion tracking,' 'event tracking,' 'UTM parameters,' 'tracking plan,' or 'analytics isn't working.' For A/B test measurement, see ab-testing.
when-to-use: |
  Set up, fix, or audit analytics tracking — conversion tracking, event tracking, UTM parameters, and tracking plans. Triggers on 'set up tracking,' 'conversion tracking,' 'event tracking,' 'UTM parameters,' 'tracking plan,' or 'analytics isn't working.' For A/B test measurement, see ab-testing.
argument-hint: |
  Set up GA4 + GTM for a SaaS marketing site — need conversion tracking for demo requests
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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
3. Enable Enhanced Measurement (captures clicks, scrolls, file downloads automatically)
4. Configure custom events for your conversion goals
5. Mark key events as Conversions in GA4 Admin

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

### Common Issues

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| Events not appearing in GA4 | Tag not firing | Check GTM preview mode — is the trigger condition met? |
| Wrong property values | Data layer key mismatch | Console.log `dataLayer` and check the key names |
| Duplicate events | Multiple tracking scripts | Audit for duplicate GTM containers or gtag.js installs |
| Conversions not attributed | UTMs missing or broken | Test a full UTM URL end-to-end |

---

## Privacy and Compliance

- **EU/UK/CA**: Cookie consent required before firing tracking tags. Use Consent Mode v2 with Google.
- **No PII in events**: Never put email addresses, names, or phone numbers in event properties.
- **Data retention**: Set GA4 retention to match your policy (max 14 months by default).
- **User deletion**: Have a process to delete user data on request (GA4 supports this natively).

---

## Output: Tracking Plan Document

```markdown
# [Site/Product] Tracking Plan

## Overview
- Analytics stack: GA4 + GTM
- Last updated: [Date]
- Owner: [Name]

## Events

| Event Name | Description | Properties | Trigger | Conversion? |
|------------|-------------|------------|---------|-------------|
| demo_requested | User submits demo request | form_location, source | Demo form submit | Yes |
| trial_signup_completed | User completes trial signup | method, plan | Success page | Yes |

## Custom Dimensions
| Name | Scope | Parameter |
|------|-------|-----------|
| user_type | User | user_type |
| plan | Session | plan_name |

## UTM Convention
Source: [list of approved sources]
Medium: [list of approved mediums]
Campaign: [naming pattern]
```