# Layers 5 to 7: Forms, Mobile Experience, Technical Performance

## Layer 5: Forms & Conversion Flows

**Every field on a form is a conversion barrier. Audit each one.**

- Count the fields on the primary conversion form. Is each field genuinely required to fulfill the conversion goal, or is it qualification/CRM enrichment?
- Measure the real completion rate instead of estimating it from field count alone. On Bulldozer-managed CMS, `bdzListCmsForms` identifies each form by `pageName` + `formElementId` — never trust the form's display name, several forms on the same site routinely share the same visible label. `bdzListCmsFormSubmissions` then filters on that ID to count actual submissions, and `get_content_analytics_report` (HubSpot, SUBMISSIONS metric) cross-checks the same page's submission volume when the client's forms run through HubSpot instead. Two caveats before turning that count into a rate: `bdzListCmsFormSubmissions` carries no anti-bot or anti-spam field — a submission spike with no matching rise in traffic is worth a manual look at the actual responses before it's read as a real lift; and divide submissions by traffic pulled at the matching scope (sessions, not pageviews — one session routinely produces several pageviews, which understates the true completion rate if you divide by the wrong one)
- B2B standard: Name + Email is sufficient for most top-of-funnel forms. Phone number, company size, and annual revenue at first touch is friction that qualification should happen after conversion, not before
- Multi-step forms: long forms converted to multi-step (Step 1: email → Step 2: rest) typically raise completion meaningfully — but completion is the wrong finish line to declare victory at. A shorter or multi-step form that raises raw submissions can just as easily lower the MQL→SQL rate if the fields it dropped were doing real qualification work. Before recommending a form shortened, check what happens to the leads it produces one full sales cycle out — closed-won rate or at minimum SQL rate — not just the top-of-funnel completion percentage; the real "did this work" answer lives downstream of the form, at the same revenue bascule this audit is ultimately accountable to
- Multi-step forms, compliance check: WCAG 2.2 SC 3.3.7 (Redundant Entry, level A) prohibits re-asking for information the visitor already gave earlier in the same flow — a later step must pre-fill a field from an earlier step's answer (editable, not forced to re-type from empty), not repeat it blank. A multi-step form that collects email on step 1 and asks for it again on step 2 fails this independently of how good its completion rate looks
- Error handling: are form errors specific ("Invalid email format") or generic ("Something went wrong")? Generic errors cause form abandonment
- Form confirmation: after submission, does the user get a clear next step? "We'll be in touch" vs. "You'll receive a calendar invite in 5 minutes" — the latter reduces no-show rates

## Layer 6: Mobile Experience

**>50% of web traffic is mobile. Audit this as a separate experience, not a scaled-down desktop.**

Test this on a real phone — not a browser simulator. Browser simulators miss real-world touch targets, font rendering, and keyboard behavior.

- Is the CTA button visible without scrolling on mobile? If not, a sticky CTA bar is the standard fix and typically recovers a meaningful share of mobile conversions — treat any specific recovery percentage as a hypothesis to validate on this site, not a number to promise before the test runs
- Is the CTA button large enough to tap comfortably? Two thresholds matter and audits routinely conflate them: 24×24 CSS px is the actual accessibility floor (WCAG 2.2 SC 2.5.8, level AA — legally the one that counts for compliance); 44×44px is the stronger recommendation (Apple HIG, and WCAG's own optional AAA level) — flag a CTA under 24×24px as a compliance finding, and anything under 44×44px as a usability finding, but don't present 44×44 as "the" accessibility minimum
- Form fields on mobile: does the email field trigger the email keyboard (`type="email"`)? Does the phone field trigger the numeric keyboard (`type="tel"`)? Wrong keyboard type = friction that causes abandonment
- Is the headline truncated or the value proposition hidden on mobile? Run the 5-second test again on mobile specifically
- Checkout or signup flow completable on mobile without pinching or zooming? Walk the entire flow on the device

## Layer 7: Technical Performance

**Technical issues are amplifiers — they make good copy reach fewer people. Fix them, but never before copy.**

- Page speed (desktop + mobile): run Google PageSpeed Insights on the primary landing URLs, not the homepage alone
- Core Web Vitals, all three, at the 75th percentile: **LCP** (Largest Contentful Paint) target <=2.5s — the most common killer is unoptimized hero images or render-blocking JavaScript; **INP** (Interaction to Next Paint) target <=200ms — this replaced FID as the responsiveness metric in March 2024, so an audit checklist that still lists FID is auditing a retired metric; **CLS** (Cumulative Layout Shift) target <=0.1 — late-loading ads, images without reserved dimensions, or web fonts that swap in are the usual causes
- Mobile load time >3s costs real conversion before a single word is read. The ~3s ceiling traces to a named but dated source — Google's 2016 "The Need for Mobile Speed" report (53% of mobile visits abandoned past 3 seconds, measured on ad-network data from mobile networks a decade old) — repeated since by trade press and technical aggregators without a newer measurement at that precision. Cite it as the historical justification for a hard 3s ceiling, not as a live 2026 benchmark: the metric to actually test today is the LCP threshold above
- Broken elements: run the full conversion flow and check for broken images, non-functional buttons, or forms that don't submit
- HTTPS: all pages HTTPS. Mixed content warnings erode trust
