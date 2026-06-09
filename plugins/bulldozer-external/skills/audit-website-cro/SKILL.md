---
name: audit-website-cro
description: Full conversion rate optimization audit of a website or landing page — funnel drop-off, copy and value proposition, UX friction, forms, mobile, and trust signals. Triggers on 'CRO audit,' 'website audit,' 'why isn't my website converting,' 'landing page audit,' 'my conversion rate dropped,' 'funnel audit,' or 'website is not working.' For SEO specifically, see seo-audit. For paid landing pages only, see audit-paid-ads.
when-to-use: Full conversion rate optimization audit of a website or landing page — funnel drop-off, copy and value proposition, UX friction, forms, mobile, and trust signals. Triggers on 'CRO audit,' 'website audit,' 'why isn't my website converting,' 'landing page audit,' 'my conversion rate dropped,' 'funnel audit,' or 'website is not working.' For SEO specifically, see seo-audit. For paid landing pages only, see audit-paid-ads.
argument-hint: SaaS homepage + pricing page — free trial CVR at 1.2%, benchmark is 3–5% for the category, mobile traffic is 60% of total
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
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

This sequence reflects impact magnitude. Copy changes produce 50–200% conversion lifts. Technical changes produce 5–20%. Audit in the order that moves the most revenue first.

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

- Is the primary conversion event firing correctly in GA4? Test a live conversion and confirm it appears within 30 minutes
- Are all key pages tagged? Check for missing GA4 tag on thank-you page, checkout steps, or trial confirmation
- Funnel exploration set up in GA4? If not, there's no step-by-step drop-off data — the audit proceeds on estimates, not evidence
- Conversion goal definition: is the tracked event a real business outcome (purchase, trial start, demo booked) or a proxy (button click, page view)? Proxy goals produce optimization pressure on the wrong metric
- MQL/SQL attribution: do CRM contacts created via the site have a source field populated? If attribution is broken, you can't prove what CRO improvements did to pipeline

---

## Layer 2: Funnel Drop-Off

**The 80/20 rule in CRO: 80% of conversion problems live on 20% of pages.**

### High-leverage pages to identify:
- Homepage (first impression for most channels)
- Pricing page (highest commercial intent, highest abandonment)
- Sign-up / trial / demo request page (conversion point itself)
- Product pages (consideration stage)

### Drop-off analysis:
- Pull GA4 funnel exploration: Landing → Key Page → Conversion. Which step has the highest drop-off?
- Exit rate by page: pages with >70% exit rate that are not the conversion confirmation page are leak candidates
- Time on page vs. scroll depth (if Hotjar or equivalent is available): are visitors reading, or bouncing immediately?

The step with the highest drop-off is the first test target. Every other optimization is secondary until this leak is addressed.

---

## Layer 3: Copy & Value Proposition

**The highest-leverage layer. Fix this before touching design.**

### The 5-second headline test
Read the homepage headline cold. Within 5 seconds, can you answer:
1. What does this product do?
2. Who is it for?
3. Why is it better than the alternative?

If any answer is no: the headline is failing. This is the single most impactful fix in CRO — a rewritten headline routinely produces 20–80% conversion lifts.

**Common headline failure modes:**
- Category cliché: "The all-in-one platform for modern teams" — could be any B2B SaaS product
- Feature-first: "AI-powered workflow automation" — what does it mean for the buyer?
- Audience mismatch: headline speaks to a persona that doesn't match the traffic arriving

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
- Are there competing CTAs on the same page? Multiple CTAs dilute intent. On high-intent pages (pricing, sign-up), one primary CTA wins

### Navigation
- Does navigation pull visitors toward conversion or away from it? On a high-converting landing page, removing or simplifying nav increases CVR by removing escape routes
- Are the highest-intent pages (Pricing, Demo, Trial) in the main nav and reachable in one click?

### Trust signals
- Social proof: testimonials, logos, case studies, review ratings — are they visible before the main CTA?
- Specific proof beats generic proof: "We cut our CAC by 34% in 90 days — Sarah T., VP Marketing, Acme" > "Game-changer! — Sarah"
- Trust mechanics: security badges, SOC2 certification, "no credit card required" near CTAs — are they present on forms and checkout?

### Message match (for paid traffic)
- Does the page headline match the ad or email that drove the click? If the ad promises "Free trial of X" and the page says "Explore our platform," CVR drops significantly
- Is there a dedicated landing page per channel/campaign, or is all traffic landing on the homepage? Homepages are generic — dedicated landing pages consistently outperform by 30–50%

---

## Layer 5: Forms & Conversion Flows

**Every field on a form is a conversion barrier. Audit each one.**

- Count the fields on the primary conversion form. Is each field genuinely required to fulfill the conversion goal, or is it qualification/CRM enrichment?
- B2B standard: Name + Email is sufficient for most top-of-funnel forms. Phone number, company size, and annual revenue at first touch is friction that qualification should happen after conversion, not before
- Multi-step forms: long forms converted to multi-step (Step 1: email → Step 2: rest) typically see 20–40% higher completion
- Error handling: are form errors specific ("Invalid email format") or generic ("Something went wrong")? Generic errors cause form abandonment
- Form confirmation: after submission, does the user get a clear next step? "We'll be in touch" vs. "You'll receive a calendar invite in 5 minutes" — the latter reduces no-show rates

---

## Layer 6: Mobile Experience

**>50% of web traffic is mobile. Audit this as a separate experience, not a scaled-down desktop.**

Test this on a real phone — not a browser simulator. Browser simulators miss real-world touch targets, font rendering, and keyboard behavior.

- Is the CTA button visible without scrolling on mobile? If not, a sticky CTA bar typically recovers 5–15% of mobile conversions
- Is the CTA button large enough to tap comfortably? Minimum touch target: 44×44px (Apple HIG standard)
- Form fields on mobile: does the email field trigger the email keyboard (`type="email"`)? Does the phone field trigger the numeric keyboard (`type="tel"`)? Wrong keyboard type = friction that causes abandonment
- Is the headline truncated or the value proposition hidden on mobile? Run the 5-second test again on mobile specifically
- Checkout or signup flow completable on mobile without pinching or zooming? Walk the entire flow on the device

---

## Layer 7: Technical Performance

**Technical issues are amplifiers — they make good copy reach fewer people. Fix them, but never before copy.**

- Page speed (desktop + mobile): run Google PageSpeed Insights on the primary landing URLs, not the homepage alone
- LCP (Largest Contentful Paint): target <2.5s. The most common killer is unoptimized hero images or render-blocking JavaScript
- Mobile load time >3s: significant conversion loss before a single word is read
- Broken elements: run the full conversion flow and check for broken images, non-functional buttons, or forms that don't submit
- HTTPS: all pages HTTPS. Mixed content warnings erode trust

---

## Prioritization Framework

Score every finding:

| Tier | Criteria | Action |
|------|----------|--------|
| **1 — Fix immediately** | High revenue impact, low effort: broken forms, missing CTAs, unclear headline, slow pages | Ship without testing |
| **2 — A/B test** | High revenue impact, medium-high effort: new layouts, pricing changes, CTA rewrites, checkout redesigns | Test before full rollout |
| **3 — Backlog** | Low/medium impact: minor copy tweaks, design preferences, secondary page elements | Document, revisit after Tier 1–2 |

Write hypotheses for every Tier 2 test: "We believe that [change] will [improve metric] because [evidence from audit]." No hypothesis = no test. Random testing is expensive and slow.

**Prio