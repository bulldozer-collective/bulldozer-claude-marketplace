---
name: |-
  popups
description: |-
  Build and optimize popups, modals, overlays, slide-ins, and banners for lead capture and conversion. Triggers on 'exit intent popup,' 'popup conversions,' 'modal optimization,' 'lead capture popup,' 'announcement banner,' or 'scroll trigger popup.' For forms outside of popups or general page optimization, see conversion-optimization.
when-to-use: |-
  Build and optimize popups, modals, overlays, slide-ins, and banners for lead capture and conversion. Triggers on 'exit intent popup,' 'popup conversions,' 'modal optimization,' 'lead capture popup,' 'announcement banner,' or 'scroll trigger popup.' For forms outside of popups or general page optimization, see conversion-optimization.
argument-hint: |-
  Exit intent popup for SaaS pricing page — trying to capture emails before visitors leave
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Popup CRO

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on popup and modal optimization. Your goal is to create popups that convert without annoying users or damaging brand perception.

## Input

`$ARGUMENTS` — what the popup is for and where it lives (e.g., "exit intent popup on pricing page, want to capture emails"). If not provided, read any available context files before asking. Only ask if you have no idea what the popup is for.

## Output

A `popup-spec-{name}.md` file with: popup type, trigger strategy, targeting rules, frequency rules, complete copy (headline, subheadline, CTA, decline option), design notes, and 3 A/B test hypotheses. Output includes ready-to-use copy for all text elements.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Principles

### 1. Timing Is Everything
Too early = annoying interruption. Too late = missed opportunity. Right time = helpful offer at the moment of need.

### 2. Value Must Be Obvious
The popup must offer something worth the interruption. "Subscribe to our newsletter" is not a value proposition. "Get the 12-step onboarding checklist used by 5,000 teams" is.

### 3. Respect the User
Easy to dismiss. Don't trap. Remember preferences. Users who can't find the close button will leave the site — not fill the form.

### 4. A Popup Treats a Symptom — Know Which One
A high exit rate on a page is a symptom, and a popup only ever answers one specific cause of it: someone who read the page, found it credible, and was still about to leave without acting. It does nothing for the other common cause — visitors who never should have landed there in the first place, because the ad or link that sent them promised something the page doesn't deliver. A popup "winning" on fill rate while that mismatch stays unfixed doesn't fix the leak, it just adds a step before the same person drops out of a nurture sequence at the same rate they'd have bounced. Before building the popup, check where the traffic came from and whether its exit rate is unusually high *relative to other sources landing on the same page* — if one channel is bleeding out at a much higher rate than the rest, that's a targeting or messaging bug upstream, and no popup copy fixes it.

---

## Trigger Strategies

| Trigger | When to use | Best for |
|---------|-------------|----------|
| **Exit intent** | Cursor moves toward browser close | Last-chance capture before leaving |
| **Scroll depth (50%)** | Proven content engagement | Blog posts, long-form content |
| **Time-based (30–60 sec)** | After user has explored | General site visitors |
| **Click-triggered** | User initiates by clicking button/link | Lead magnets, gated content, demos |
| **Page count (3+ pages)** | Research/comparison behavior | Multi-page journeys |
| **Behavior-based** | Specific pages visited, cart abandonment | High-intent segments |

**Never**: "Show after 5 seconds" — 5 seconds is too fast; user hasn't read anything yet. Minimum 30 seconds for time-based triggers.

**The trap: a popup's own fill rate doesn't prove it created anything.** Someone who submits an exit-intent form might well have converted through the page's primary CTA a few seconds later anyway — the popup just claimed the credit. The way to find out is a holdout: hold the popup back from a slice of matched traffic (a fixed share, e.g. 10–20%, kept constant for the test's duration) and compare the page's *total* conversion rate between the exposed group and the holdout, not the popup's isolated fill rate against nothing. A popup with a strong fill rate and no real lift on the page's total conversion — or worse, a lower one, because it interrupted people who were already about to convert on their own — is cannibalizing, not adding. Run this before trusting any trigger-strategy comparison, not only at the end.

---

## Popup Types and Templates

For the copy templates and best practices of each popup type (email capture, lead magnet, exit intent, announcement banner), including when to break the single-field rule and when to change the offer, read `references/popup-types-templates.md`.

---

## Design Rules

**Visual hierarchy**:
1. Headline (largest, first seen)
2. Value prop (clear benefit)
3. Form/CTA (obvious action)
4. Close option (visible)

**Close button**: Always visible in top-right corner. Alternative: "No thanks" text link below CTA. Tap target at least 24×24 CSS px — the actual accessibility floor (WCAG 2.2 AA, SC 2.5.8 Target Size Minimum), not the commonly-quoted "44px." 44px is a stronger platform convention (Apple's Human Interface Guidelines, and WCAG's optional AAA "Enhanced" level) — good practice, but don't present it as *the* minimum a popup must clear.

**Visual weight of the decline option — a design call, not only a legal one.** The GDPR "Refuse" symmetry rule under Compliance is a floor for consent banners specifically; apply the same principle to every popup, consent or not. A CTA rendered as a solid, brand-colored button next to a decline option shrunk to pale gray text is confirmshaming by design, whatever the copy says. If the CTA and the decline differ along every visual axis at once — size, weight, color saturation, and position all pushed the same direction — that combination is what a "trick you" popup looks like, not what a "you're free to say no" popup looks like. One axis of difference (e.g. solid vs. outline button, same size) reads as a normal default; three or four stacked together don't.

**Sizing**: Desktop 400–600px wide. Never cover the entire screen. Mobile: full-width bottom or center — not full-screen.

**Full-screen vs. contained — check the brand's registered tone before defaulting to whichever tests best.** A full-screen interstitial reads as aggressive no matter how polished its copy is. On first-time, cold traffic to a brand whose tone is registered as premium or calm (`bdzGetProjectToneOfVoice`, when set), a full-screen exit-intent discount can undercut the exact positioning the rest of the site is built around — even if it wins the isolated conversion test, because that test doesn't price in the visitors who don't convert *anywhere* on the site afterward. Default to a contained modal or a corner slide-in for that traffic, and reserve full-screen for contexts where the interruption reads as expected rather than as ambush — a returning visitor, a cart already started, someone already several pages deep.

**Mobile**: Can't reliably detect exit intent — use time-based (30+ sec) or scroll-based (50%+) instead. Test on mobile specifically; what works on desktop often fails there.

---

## CTA Copy Formulas

| Pattern | Example |
|---------|---------|
| First-person possessive | "Get My Discount" > "Get Your Discount" |
| Specific over generic | "Send Me the Guide" > "Submit" |
| Value-focused | "Claim My 10% Off" > "Subscribe" |
| Outcome-focused | "Start Saving Time" > "Sign Up" |

**Decline options**: Polite and neutral. "No thanks" or "Maybe later." Avoid manipulative: "No, I don't want to save money." This isn't only a brand-perception call — see *Dark patterns* under Compliance below, it's an active enforcement target now.

---

## Frequency and Targeting Rules

| Rule | Setting |
|------|---------|
| Max per session | Once |
| Dismiss cool-down | 7–30 days before reshowing |
| Exclude converted users | Always — never show an email popup to subscribers |
| Exclude checkout/payment flows | Always — never interrupt a transaction |
| Context match | Blog popups offer content, pricing popups offer trial/demo |

**"7–30 days" is a default, not a constant — size it from how often this site's visitors actually come back.** A 7-day cool-down reshows the popup at nearly every visit for a site whose typical visitor returns every week or two (a SaaS pricing page revisited during a buying cycle), and barely matters at all for a site most people hit once from a search result. Count in the visitor's likely sessions over that window, not calendar days: where GA4 is connected, the `newVsReturning` dimension (via a report template — `bdzListGoogleAnalyticsDimensions` to confirm it, `bdzRunGoogleAnalyticsReportTemplate` to pull it) gives the real repeat-visit rate for this site to size the cool-down from, instead of copying the default.

**Frequency capping is usually cookie- or localStorage-based, which caps per browser, not per person.** The same visitor sees the popup again on their phone, in a second browser, or after clearing cookies — a "reach" number built from popup-shown events overcounts unique people. Read it as an upper bound on annoyance, not a real reach figure, unless the site can key the cap to a logged-in identifier instead.

**"Exclude converted users" should mean known contacts, not just email subscribers.** A returning visitor already in the CRM — matched by cookie sync, a logged-in session, or IP-to-company enrichment — getting shown an anonymous email-capture popup reads as the company not recognizing its own contact, which costs more trust than showing nothing. Where the site can check for a CRM match before rendering, exclude on that; "has this browser dismissed it before" alone isn't the same guarantee.

---

## Compliance

For the compliance checklist (Google SEO interstitials, GDPR / ePrivacy, button symmetry and post-click behavior, dark patterns, accessibility, WCAG 2.2 Focus Not Obscured and Redundant Entry), read `references/compliance-accessibility.md` before finalizing any spec.

---

## Benchmarks

For the popup conversion benchmark ranges by type and how they move between aggregators, read `references/benchmarks.md`. They are a starting point, not a target.

---

## Measuring in Bulldozer OS

The benchmark ranges above are a starting point, not a target — the real number is whatever this popup does on this site. Don't stop at the spec; measure the popup once it's live:

- **Form submissions**: `bdzListCmsForms` lists the site's forms by page and `formElementId` (never trust the display name alone — the same site routinely has several forms called the same thing). `bdzListCmsFormSubmissions`, filtered on that `formElementId`, gives the real submission count to compute an actual conversion rate against `bdzGetCmsTrafficReport` traffic for the same page and window (requires the Webflow Analyze add-on).
- **Routing captured leads**: `bdzAttachLeadListToCmsForm` routes a form's submissions straight into an outbound lead list — every new submission becomes a lead awaiting review, with the site's webhook registered automatically. Useful so a popup's captures don't just sit in a form export waiting to be pulled by hand.
- **GA4 side**: if the popup's CTA fires a GA4 event, name it as a **conversion** when building or reading the report template (`bdzListGoogleAnalyticsReportTemplates` / `bdzRunGoogleAnalyticsReportTemplate`), not a "key event" — the OS's curated GA4 metric catalog only exposes `conversions`; `keyEvents` (the label GA4's own UI has used since its March 2024 rename) isn't in that catalog and the tool call fails, naming the unknown field, if you ask for it.
- **Don't throw away what the GA4 call already computed.** Both calls to `bdzRunGoogleAnalyticsReportTemplate` above (`newVsReturning` for the cool-down, the CTA conversion for the popup itself) persist their result — it can be re-read later via `bdzGetGoogleAnalyticsReport` by `reportId` — and the tool runs anomaly detection automatically each time, flagging any metric that deviates more than 2 standard deviations from its own history. Re-read the report by its ID rather than keeping only the single value you asked for: a flagged anomaly on the CTA conversion count (a sudden drop unrelated to the popup itself, a tracking break) is a signal worth seeing before blaming the popup's copy or trigger for a conversion dip that was never really there.
- **CRM tie-back**: when the client runs HubSpot, `mcp__HubSpot__get_campaign_attribution_reports` links the traffic a popup's page received to attributed revenue — useful when the popup sits on a paid landing page and the question isn't "did they submit" but "did that submission turn into pipeline."

## A/B Test Hypotheses

For the three starter A/B test hypotheses (trigger, incentive type, decline copy), when to call a test (significance, power, minimum duration, no early stopping), the fill-rate guardrail and when to kill a popup outright, read `references/ab-test-hypotheses.md`.
**When to kill a popup outright, not just iterate its copy or timing:** if a correctly-run test — significance, power, duration, and holdout-checked per *Trigger Strategies* above — shows the page's *total* conversion rate flat or down with the popup live versus without it, stop. A popup that only redistributes credit within the page, or interrupts visitors who were already converting, is a net cost even while its own fill-rate number looks healthy in isolation.