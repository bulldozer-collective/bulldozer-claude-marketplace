# 4-Phase Entry Approach and Localization Checklist

### Phase 1: Validate (Month 1–2)

Don't build anything yet. Validate demand and product-market fit with what you have.

**Actions**:
- Interview 10+ customers/trials from the target market (in their language if possible)
- Identify: Why did they find you? What's their workflow? Who else are they evaluating?
- Test: Will they pay? What's their willingness to pay? What feature gaps exist?

**Go signal for Phase 2**: 3+ paying customers acquired without localization effort.

### Phase 2: Expand Without Entity (Month 3–6)

Serve the market from your existing legal entity. Don't set up a local company yet.

**Actions**:
- Translate homepage, pricing page, and support docs (minimum viable localization)
- Localize payment methods (SEPA for EU, local invoicing requirements)
- Add a local time zone to support coverage
- Identify a local partner or reseller for market intelligence

**Go signal for Phase 3**: >€/£/¥ X in ARR from the market with acceptable unit economics.

### Phase 3: Commit (Month 6–12)

First dedicated hire and possible legal entity.

**Actions**:
- Hire country manager or first AE in market
- Evaluate legal entity requirement (often driven by customer requirements, tax, or employment law)
- Localize product (UI, date formats, currency, address formats)
- Establish local pricing and contract terms
- If working inside a Bulldozer project, declare the market with `bdzCreateProjectMarket` (see Checking These Signals in Bulldozer OS above) — this is the point where the market stops being a hypothesis and becomes a tracked commitment

**Reseller vs. first hire — the real arbitrage**: "hire a country manager" is not the only Phase 3 move. In a heavily regulated market (data residency demands, licensing, an employment law you don't know), a reseller or local partner produces revenue and market intelligence without the entity, payroll, and compliance burden of a direct hire — trading margin for a lower-risk entry. Reserve the direct hire for markets where the buyer expects to deal with your own team, or where the partner channel has already surfaced a named person worth converting to an employee. Don't default to the direct hire because it feels more committed — the goal is revenue at acceptable risk, not the appearance of commitment.

**Who actually owns this**: before committing to Phase 3, name the person who will run the market day to day. "The founder or head of growth will handle it alongside their existing job" is not a plan — it's how markets get half-entered and quietly abandoned six months in. If nobody can be freed up to own it, the team doesn't have the capacity for Phase 3 yet, whatever the ARR gate says — the plan has to fit the team it actually has, not the team the projection assumes.

### Phase 4: Scale (Month 12+)

Build a full local team and complete localization.

### Product Localization

| Item | Priority | Notes |
|------|:--------:|-------|
| UI language translation | High | UI strings, error messages, notifications |
| Date/time format | High | DD/MM/YYYY vs MM/DD/YYYY; 24h vs 12h |
| Currency and number format | High | Comma vs period as decimal separator |
| Address format | Medium | Country-specific postal format |
| Phone number format | Medium | Country code handling |
| Right-to-left support | High (if applicable) | Arabic, Hebrew markets |
| Local payment methods | High | SEPA, iDEAL, PayPal, Boleto, etc. |
| Timezone handling | Medium | Default timezone and display |

### Content Localization

| Item | Priority |
|------|:--------:|
| Homepage (headline, subhead, CTA) | Critical |
| Pricing page | Critical |
| Terms of Service and Privacy Policy | Critical |
| Customer-facing emails (billing, transactional) | High |
| Help documentation (top 20 articles) | High |
| Blog/content (top 10 pages driving organic) | Medium |
| Social content | Low |

**Translation quality tiers**:
1. Machine + human review: for low-stakes content
2. Professional translation: for legal, commercial, and support docs
3. Native-speaker copywriter: for homepage and marketing copy (machine translation marketing copy always reads as machine translation)
