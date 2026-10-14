# Section 6 Design Direction and Section 8 Technical Requirements

**References are more useful than adjectives.** "Modern and professional" describes 80% of B2B SaaS websites. A list of 3 reference sites with notes on what specifically works is actionable.

**Format:**
```
References (provide 3–5 URLs with notes):
1. [URL] — what we like about it: [specific element — e.g., "the way they show the product without a product tour video"]
2. [URL] — what we like: [specific element]
3. [URL] — what we like: [specific element]

What we want to avoid:
- [Specific visual pattern or approach to avoid]
- [Example of what we consider off-brand]

Constraints:
- Must work with existing color palette: [colors]
- Typography: [keep existing / replace with]
- Logo: [current logo applies / logo refresh in progress — deliverable by X date]
```

**Design system status:** Does a design system or component library exist? If yes, the new pages must extend it. If no, does the agency scope include creating one? This needs to be explicit — a component library is a significant scope item.

**Judgment calls that belong here, not in a design review three weeks from now:**
- **A reference the budget can't fund is a scope conversation, not a design problem.** If Section 9's budget and timeline don't support the ambition in the chosen references (a €15K, 3-week project citing Stripe or Linear as "the vibe we want"), say so back to the client before design starts. Accepting the reference and hoping the execution catches up is how design rounds multiply later — cheaper to reset the reference now than to re-litigate it after two rounds of feedback.
- **Missing brand assets are a dependency, exactly like missing positioning in Section 5.** A logo that only exists as a reversed/white logotype has no version that works on a light hero — don't let that surface mid-design. Flag it here, with an owner and a date, the same discipline Section 5 already applies to a missing positioning statement.
- **The threshold for reconsidering "no design system":** a common rule of thumb across design and engineering teams — build it directly the first time, tolerate the duplication the second time, and by the third time the same pattern (a card, a table, a callout block) gets rebuilt for a different page, pull it into a shared component instead of another one-off. If Section 4 already lists three or more pages that will reuse the same layout pattern (three case studies, or a blog plus resources plus a changelog), don't let "no system, just build the pages" stand as final — put the cost of skipping it back in front of the client once, in writing, and let them choose with that cost visible.
- **"Make it pop" doesn't get actioned.** Feedback with no named element — which one, on which page, what should visually outrank it — gets a follow-up question, not a design pass. Same discipline as the reference rule above: specificity is the agency's job to ask for, not to guess at.

**List every system the website must connect to, comply with, or perform within.**

**Required fields:**
- CMS platform: [Webflow / WordPress / Contentful / custom] — can non-technical staff update content?
- Hosting: [client-managed / agency-managed] — who holds the domain and DNS?
- Analytics: [GA4 event tracking setup — which key events must fire? ("key events" is GA4's current term for what used to be called "conversions" outside the Google Ads context — Google renamed it in March 2024)]
- CRM integration: [HubSpot form embed / API / Zapier — which forms connect to which lists?]
- Marketing tags: [LinkedIn Insight Tag, Google Ads pixel, hotjar, Intercom — which tools must be installed? If Google Ads or GA4 serves EEA/UK visitors, the tags must also wire up to the consent banner's real state (Google Consent Mode — ad_storage, analytics_storage, ad_user_data, ad_personalization), not just sit next to it. A banner that looks compliant while the pixel fires regardless is the actual failure mode, not the button styling.]
- Performance requirements: [Core Web Vitals targets — LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, measured at the 75th percentile — Google's published "good" thresholds. INP replaced FID as the responsiveness metric in March 2024; don't ask for an FID target, the metric no longer exists.]
- Accessibility: [WCAG 2.2 AA — the current, most complete published standard: it includes every WCAG 2.1 AA criterion plus newer ones (e.g. 2.5.8 Target Size Minimum, 24×24 CSS px). WCAG 2.1 AA is still a valid baseline if that's what the client already commits to elsewhere — just less complete than 2.2. Compliance required — yes/no, and which version?]
- Security: [HTTPS, data processing agreement with the agency/host, cookie consent banner, GDPR/CCPA disclosures — confirm which regimes apply given where visitors and the company are based. The banner is a UI element; the compliance question is whether declining actually stops every tag listed above from firing — test that on staging, don't take the banner's presence as proof.]

**If any field above is "not yet decided":** flag it as a dependency in Section 9, not as a detail to sort out mid-build. A CMS choice or hosting decision made after wireframes are approved usually forces rework.
