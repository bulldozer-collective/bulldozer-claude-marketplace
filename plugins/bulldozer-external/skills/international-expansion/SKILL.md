---
name: |
  international-expansion
description: |
  Plan go-to-market entry into a new geographic market: localization checklist, regulatory considerations, channel adaptation, pricing adjustments, and hiring priorities. Triggers on 'expand to,' 'international expansion,' 'new market,' 'localization,' or 'enter the French market.' For ABM in a new market, see account-based-marketing. For pricing strategy, see pricing.
when-to-use: |
  Plan go-to-market entry into a new geographic market: localization checklist, regulatory considerations, channel adaptation, pricing adjustments, and hiring priorities. Triggers on 'expand to,' 'international expansion,' 'new market,' 'localization,' or 'enter the French market.' For ABM in a new market, see account-based-marketing. For pricing strategy, see pricing.
argument-hint: |
  B2B SaaS expanding from US to France — currently 50 French trials, no French-language support
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# International Expansion

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on international market expansion. Your goal is to produce a structured market entry plan that avoids the most common expansion mistakes — entering too many markets at once, underestimating localization, and building before validating.

## Input

`$ARGUMENTS` — target market and current GTM motion (e.g., "Expanding to Germany — currently US-only B2B SaaS, 30 German trial users, no German team"). If not provided, read any available context files before asking. Only ask if the target market is completely absent.

## Output

An `expansion-brief-{market}.md` file with: market entry rationale, localization checklist (product + content + legal), regulatory considerations, channel adaptation recommendations, pricing adjustments, first hire criteria, 90-day market entry plan, and success metrics. Includes a go/no-go framework for the expansion decision.

**Produce output on first invocation. Read available context before asking. Only ask if the target market is completely absent.**

---

## Go / No-Go Framework

Before investing in market entry, verify:

| Signal | Strong (go) | Weak (pause) |
|--------|------------|-------------|
| Inbound demand from the market | >5% of signups from target country | <1% of signups |
| Organic customer presence | Paying customers without sales effort | No customers yet |
| Competitor presence | Market has established players (demand validated) | No competitors (demand unvalidated) |
| Regulatory risk | Low or familiar regulatory environment | Heavy industry regulation you don't understand |
| Language barrier | English widely accepted in market | Local language required for business |
| Infrastructure readiness | Can serve customers from HQ today | Requires legal entity, local servers, local team |

**Bulldozer rule**: Never enter a market you don't have at least 5 organic customers or 50 organic trials from. The market is showing you something — respond to it.

---

## The 4-Phase Entry Approach

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

### Phase 4: Scale (Month 12+)

Build a full local team and complete localization.

---

## Localization Checklist

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

---

## Regulatory Considerations by Market

### European Union / EEA

- **GDPR**: Applies from day 1 if you handle EU personal data (you almost certainly do). Requires: privacy policy, data processing agreements with vendors, lawful basis for processing, user consent or legitimate interest, right-to-erasure capability.
- **VAT**: EU VAT rules apply to digital services sold to EU consumers. B2B sales typically handled via reverse charge, but varies by country.
- **Employment law**: Significantly more employee-protective than US. Termination requires cause and notice periods. Non-compete enforceability varies.

### United Kingdom

- **UK GDPR**: Post-Brexit, UK has its own GDPR equivalent. Similar requirements.
- **FCA regulation**: If your product touches financial services, check FCA requirements early.

### Germany (specific)

- **Works council**: If hiring >5 employees, a works council can be formed — this affects hiring, termination, and changes to working conditions.
- **Imprinting requirement**: All German websites require an Impressum (legal notice with company info). Missing this is a compliance risk.
- **Data hosting**: Some German enterprises require data hosted in Germany (Hetzner, Deutsche Telekom).

### France (specific)

- **Labour code**: 35-hour workweek, strong protections. Employment contracts must be in French.
- **CNIL**: French data protection authority. Similar GDPR requirements plus some French-specific rules.
- **Formal business culture**: Contracts and relationships require more formality than Anglo-Saxon markets. Expect longer sales cycles.

### Japan (specific)

- **Language**: English rarely sufficient; Japanese localization is mandatory for serious market entry.
- **Local entity**: Often required by large customers.
- **Hanko**: Physical seal used on contracts historically; digital contracts now accepted but confirm with each customer.

---

## Channel Adaptation

| US channel | EU/UK equivalent | Notes |
|------------|-----------------|-------|
| Content marketing / SEO | Works, but local language required | Google market share >90% in most EU markets |
| LinkedIn Ads | Works well for B2B | Higher engagement in certain EU markets than US |
| Cold email | Works but GDPR requires legitimate interest basis | Document your legal basis before sending |
| Product Hunt | Less effective outside US | Local equivalents: Betalist, specific country forums |
| Events / conferences | Often more important in EU than US | European buyers often prefer in-person relationship building |
| Resellers / partners | More important in some EU markets | Especially for regulated industries |

---

## Pricing Adaptation

### Purchasing Power Parity

Convert US prices to local purchasing power, not just currency. A $100/mo tool priced at €100 in Germany may be fine (similar purchasing power). The same price in Brazil in BRL equivalent would likely be too high.

**Framework**:
1. Identify purchasing power parity index for the target country vs. US
2. Multiply your USD price by the PPP factor
3. Round to a psychologically clean price in local currency
4. Test: show the local price to local prospects and gauge reaction

**Data source**: World Bank PPP data or BigMac Index as a quick proxy.

### Local Pricing Considerations

- Annual contracts are more common in EU than US (expect fewer monthly subscribers)
- Invoicing expectations: EU businesses often expect invoice + bank transfer, not card-on-file
- VAT must be displayed in B2C pricing (where applicable)

---

## First Hire in a New Market

The country manager or first AE is the most important decision you'll make in the expansion.

**Look for**:
- Native speaker, fluent in local business norms
- Prior experience at a startup expanding into the market (not just a large enterprise)
- Network in your ICP's industry
- Can operate without process (first hires in new markets often work with less structure)

**Avoid**:
- "Impressive CV" hire who's never sold at a startup stage
- Someone who needs a team to be effective (they'll have to build it)
- Remote-only arrangement in markets where relationships require in-person presence

**First hire timing**: Don't hire a country manager until you have 10+ paying customers in the market. The hire should have pipeline to work with, not have to generate it from scratch.

---

## 90-Day Market Entry Plan

**Month 1 — Validate**:
- 10 customer/prospect interviews in the target market
- English-first website with local payment option enabled
- Support coverage added to local time zone

**Month 2 — Localize Minimum**:
- Homepage and pricing page translated
- Terms and Privacy Policy localized
- Local payment method added (SEPA, etc.)
- Partner/reseller outreach (3–5 potential partners identified)

**Month 3 — First Revenue**:
- 3 closed deals from the market
- First AE in market (or strong reseller partnership confirmed)
- GDPR compliance documentation complete
- Success metrics dashboard live

---

## Success Metrics

| Metric | Month 3 target | Month 6 target | Month 12 target |
|--------|:--------------:|:--------------:|:---------------:|
| Paying customers | 