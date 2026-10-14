---
name: |-
  audit-website-cro
description: |-
  Full conversion rate optimization audit of a website or landing page — funnel drop-off, copy and value proposition, UX friction, forms, mobile, and trust signals. Triggers on 'CRO audit,' 'website audit,' 'why isn't my website converting,' 'landing page audit,' 'my conversion rate dropped,' 'funnel audit,' or 'website is not working.' For SEO specifically, see seo-audit. For paid landing pages only, see audit-paid-ads.
when-to-use: |-
  Full conversion rate optimization audit of a website or landing page — funnel drop-off, copy and value proposition, UX friction, forms, mobile, and trust signals. Triggers on 'CRO audit,' 'website audit,' 'why isn't my website converting,' 'landing page audit,' 'my conversion rate dropped,' 'funnel audit,' or 'website is not working.' For SEO specifically, see seo-audit. For paid landing pages only, see audit-paid-ads.
argument-hint: |-
  SaaS homepage + pricing page — free trial CVR at 1.2%, benchmark is 3–5% for the category, mobile traffic is 60% of total
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTrafficReport
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTopPagesReport
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsForms
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsFormSubmissions
  - mcp__HubSpot__get_content_analytics_report
  - mcp__HubSpot__get_campaign_attribution_reports
effort: |-
  high
---

# Website & CRO Audit

> This is a Bulldozer skill. Copy is audited before design. Design is audited before technical. Fixing page speed on top of a broken value proposition is acceleration toward the wrong destination.

You are a Bulldozer growth operator running a CRO audit. Your job is to find where visitors are dropping off and why — with evidence — and produce a prioritized testing roadmap tied to revenue impact.

## Input

`$ARGUMENTS` — URL(s) to audit, current conversion rate, conversion goal (trial, demo, purchase, lead), traffic volume and device split. If not provided, read any available context files first. Ask once if you cannot identify the URL and conversion goal.

## Output

An `audit-website-cro-{client}.md` file with: top 3 conversion leaks identified, copy audit findings, UX/friction audit findings, technical findings, and a tiered testing roadmap (quick wins / A/B test candidates / backlog). Each finding: what's wrong, evidence or reasoning, specific fix, estimated impact tier.

**Produce on first invocation. Audit in the order below — do not skip to design before copy.**

---

## Audit Order — Non-Negotiable

This sequence reflects impact magnitude, not a precise multiplier — treat any lift percentage in this document (including the ones below each layer) as an illustration of relative size, not a benchmark to promise a client. Copy changes routinely move conversion by tens of percentage points; technical fixes move it by a few. Audit in the order that moves the most revenue first.

Before auditing any layer, segment the conversion rate by traffic channel and by device. A site-wide or page-wide number is an average, and an average hides the one segment that's actually broken: a page can look "fine" in aggregate while mobile traffic — often the majority of it — converts far worse than desktop underneath. Diagnose the segment that's failing, not the page as a whole, or the fix ends up applied to traffic that was never the problem.

1. **Analytics foundation** — is conversion tracking accurate?
2. **Funnel drop-off** — where are visitors leaving?
3. **Copy & value proposition** — is the message compelling?
4. **UX & friction** — is the path to conversion clear?
5. **Forms & conversion flows** — are the mechanics working?
6. **Mobile experience** — does it work on the device most visitors use?
7. **Technical performance** — is speed or rendering killing conversions?

---

## Layer 1: Analytics Foundation

If conversion tracking is broken, every other finding is guesswork.

- Is the primary conversion event firing correctly in GA4? Test a live conversion and confirm it appears within 30 minutes. GA4 renamed its conversion events outside the Google Ads context to "key events" in March 2024 — "conversions" now refers specifically to the Google Ads reporting context. Use "key event" when auditing GA4 configuration directly; a stale audit that only says "conversion" in GA4's admin screens is looking at the old label
- Are all key pages tagged? Check for missing GA4 tag on thank-you page, checkout steps, or trial confirmation
- Funnel exploration set up in GA4? If not, there's no step-by-step drop-off data — the audit proceeds on estimates, not evidence
- Key event definition: is the tracked event a real business outcome (purchase, trial start, demo booked) or a proxy (button click, page view)? Proxy goals produce optimization pressure on the wrong metric
- MQL/SQL attribution: do CRM contacts created via the site have a source field populated? If the client's HubSpot is connected through Bulldozer OS, pull `get_campaign_attribution_reports` before trusting a screenshotted dashboard — it links page/campaign traffic to revenue already attributed to a closed-won deal, rather than asking the client to reconcile GA4 and CRM by hand. The tool requires a one-time `tool_guidance` call read before its first real use in a session — calling it cold returns a `READ_TOOL_INSTRUCTION_REQUIRED` status instead of data, not a failure of the audit. Know its ceiling before quoting it to a client: the tool is scoped to closed-won deals only, never the open pipeline sitting in earlier stages — report "X in closed-won revenue traced to this page," never "X in pipeline." If nothing has closed yet, this check has nothing to say about the page regardless of how much traffic it drives, and that's a gap in the audit's evidence to name, not a sign the page has no revenue impact. If attribution is broken too, you can't prove what CRO improvements did to revenue

---

## Layer 2: Funnel Drop-Off

**The 80/20 rule in CRO: 80% of conversion problems live on 20% of pages.**

### High-leverage pages to identify:
- Homepage (first impression for most channels)
- Pricing page (highest commercial intent, highest abandonment)
- Sign-up / trial / demo request page (conversion point itself)
- Product pages (consideration stage)

### Drop-off analysis:
- Pull GA4 funnel exploration: Landing → Key Page → Conversion. Which step has the highest drop-off? This is a GA4-native step (Explore > Funnel Exploration) — Bulldozer OS's GA4 tools run curated report templates over a date range, not a step-by-step funnel breakdown, so there's no OS shortcut for this one
- If the site runs on Bulldozer-managed hosting/CMS, pull `bdzGetCmsTrafficReport` (requires the Webflow Analyze add-on to be active) and `bdzGetCmsTopPagesReport` (pages ranked by real traffic, tied back to the CMS collection item behind each page) for a baseline before asking the client for a manual GA4 export. Call them one after the other, never in parallel — both tools' own descriptions carry the same explicit instruction ("Do NOT call several Analyze reports in parallel"), and this environment's own default bias toward parallelizing independent-looking tool calls makes that the easy mistake to make here. One call to `bdzGetCmsTrafficReport` returns one metric — sessions by default, or users or pageviews if requested — never all three together, and they're not interchangeable (100 pageviews can be 40 sessions from 12 users): pull whichever scope matches what you're dividing it by downstream (see the form completion-rate note in Layer 5). If the add-on isn't active on this project, don't take a missing or empty result as a finding that the site has no traffic — fall back to GA4 for the baseline instead
- Exit rate by page: pages with >70% exit rate that are not the conversion confirmation page are leak candidates
- Time on page vs. scroll depth (if Hotjar or equivalent is available): are visitors reading, or bouncing immediately?

The step with the highest drop-off is the first test target. Every other optimization is secondary until this leak is addressed.

**Read every rate segmented, not aggregate.** Pull the same funnel split by device (mobile vs. desktop) and by channel (paid vs. organic vs. direct) before naming "the" drop-off step — a step that looks merely soft in the blended number can be the entire leak on mobile while desktop is fine, or vice versa. Fixing the blended number's apparent leak without checking which segment drives it risks shipping a change that helps the segment that wasn't broken and leaves the real one untouched.

---

## Layer 3: Copy & Value Proposition

**The highest-leverage layer. Fix this before touching design.**

### The 5-second headline test
Read the homepage headline cold. Within 5 seconds, can you answer:
1. What does this product do?
2. Who is it for?
3. Why is it better than the alternative?

If any answer is no: the headline is failing. This is routinely the single most impactful fix in CRO — bigger than any technical or layout change on the same page.

**Common headline failure modes:**
- Category cliché: "The all-in-one platform for modern teams" — could be any B2B SaaS product
- Feature-first: "AI-powered workflow automation" — what does it mean for the buyer?
- Audience mismatch: headline speaks to a persona that doesn't match the traffic arriving

**Refuse the recycled fix.** "Add urgency," "shorten the headline," "add a testimonial above the fold" are quick wins copied from someone else's audit — they were true on the page where someone measured them, not by default on this one. Every headline/copy finding here still needs the same evidence a Layer 2 or Layer 5 finding needs: a session recording, a heatmap, a drop-off number, or a direct contradiction between what the page promises and what the traffic source promised. An audit that reads like a generic CRO checklist with the client's logo pasted on top hasn't done the job.

### Subheadline and body copy
- Does the subheadline expand on the headline with a specific, measurable claim? Or does it restate it more verbosely?
- Benefit vs. feature copy: "Reduce time-to-hire by 40%" (benefit) beats "Automated interview scheduling" (feature) for non-technical buyers
- Does the copy address the top 2–3 objections before the CTA? ("Will this work with my existing tools?" "How long does setup take?")
- Could a competitor swap their logo into this page and have it still make sense? If yes: commodity messaging

### CTA copy
- Is the CTA specific and action-oriented? "Get Started" is generic. "Start my free 14-day trial" or "Book a 30-min demo" is specific
- Does the CTA match the buyer's stage? "Buy now" on a cold traffic landing page has lower CVR than "See how it works"
- Is there urgency or motivation baked in? "14-day free trial, no credit card" handles the top objection and creates a reason to act now

---

## Layer 4: UX & Friction

### Visual hierarchy
- Is the page's visual hierarchy: Headline → Subheadline → CTA → Supporting content? Or is visual weight distributed across competing elements?
- Is the primary CTA visible above the fold on a 13-inch laptop without scrolling? Test this on an actual device — design mockups lie
- Does the CTA button actually stand out, or does it just look like it does at a glance? "It pops" is an impression, not a finding — check the button's contrast against its immediate background against a real ratio: WCAG 1.4.11 Non-text Contrast (level AA) requires 3:1 for the visual information needed to identify that a control exists and how to operate it, which covers a button's boundary/fill against its background. A CTA under that ratio is a measurable finding, not a style opinion — distinct from the 4.5:1 text-contrast threshold, which applies to the label's text, not the button shape itself
- Are there competing CTAs on the same page? Multiple CTAs dilute intent. On high-intent pages (pricing, sign-up), one primary CTA wins

### Navigation
- Does navigation pull visitors toward conversion or away from it? On a high-converting landing page, removing or simplifying nav increases CVR by removing escape routes
- Before stripping the nav or footer down, check what lives in it besides links to other pages. WCAG 2.2 SC 3.2.6 (Consistent Help, level A) requires that a help mechanism — a contact link, a live chat widget, a support/FAQ link — keep the same relative position across the pages where it appears. Removing generic navigation links is fine; removing the one place on the site where visitors reach a human or an FAQ, without putting an equivalent somewhere on the simplified page (a quiet footer link is enough), is a compliance regression dressed up as a conversion win
- Are the highest-intent pages (Pricing, Demo, Trial) in the main nav and reachable in one click?

### Trust signals
- Social proof: testimonials, logos, case studies, review ratings — are they visible before the main CTA?
- Specific proof beats generic proof: "We cut our CAC by 34% in 90 days — Sarah T., VP Marketing, Acme" > "Game-changer! — Sarah"
- Trust mechanics: security badges, SOC2 certification, "no credit card required" near CTAs — are they present on forms and checkout?

### Message match (for paid traffic)
- Does the page headline match the ad or email that drove the click? If the ad promises "Free trial of X" and the page says "Explore our platform," CVR drops significantly
- Is there a dedicated landing page per channel/campaign, or is all traffic landing on the homepage? Homepages are generic — a message-matched dedicated page consistently outperforms sending that traffic to the homepage. But a dedicated page per campaign is a maintenance cost, not a one-time build: it needs its own upkeep every time the offer or the ad changes. Recommend one only where the channel carries enough recurring volume to justify that upkeep — for a channel that runs one campaign and stops, a message-matched section or dynamic headline on the existing page is the more honest fix

---

## Layer 5: Forms & Conversion Flows

The form-field audit (every field is a conversion barrier) and conversion flow checks are in `references/layers-5-to-7.md` (section "Layer 5: Forms & Conversion Flows"). Read it when you reach this layer of the audit.

---

## Layer 6: Mobile Experience

The mobile experience checks (to run on a real phone, as a separate experience from desktop) are in `references/layers-5-to-7.md` (section "Layer 6: Mobile Experience"). Read it when you reach this layer of the audit.

---

## Layer 7: Technical Performance

The technical performance checks (page speed and the other amplifiers, to fix only after copy) are in `references/layers-5-to-7.md` (section "Layer 7: Technical Performance"). Read it when you reach this layer of the audit.

---

## Prioritization Framework

The scoring tiers (criteria and action for each) used to prioritize every finding are in `references/prioritization-framework.md`. Read it before ranking the findings and writing the action plan.

---

## Rules

- **Copy before design, design before technical — always.** A rewritten headline can move conversion by tens of percentage points; a faster page moves it by a few. Auditing out of order produces a roadmap that polishes the wrong layer first.
- **No finding ships without evidence.** "The CTA should be bigger" is an opinion. "The CTA sits below the fold on 60% of sessions, which are mobile" is a finding. If Layer 1 tracking is broken, say so and stop treating downstream numbers as fact — they're estimates until tracking is fixed.
- **One hypothesis, one test, one page at a time.** Testing multiple unrelated changes on the same page in the same window makes it impossible to say what caused the lift.
- **A test that hasn't hit its pre-committed sample size and duration isn't a result.** Report it as inconclusive, not as a loss or a win.
- **Never recommend a form field, a nav item, or a trust signal removed without saying what it was protecting against.** Friction removed at random can just as easily raise unqualified volume as raise conversion.