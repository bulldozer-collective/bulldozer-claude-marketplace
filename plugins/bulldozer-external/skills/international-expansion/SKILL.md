---
name: |-
  international-expansion
description: |-
  Plan go-to-market entry into a new geographic market: localization checklist, regulatory considerations, channel adaptation, pricing adjustments, and hiring priorities. Triggers on 'expand to,' 'international expansion,' 'new market,' 'localization,' or 'enter the French market.' For ABM in a new market, see account-based-marketing. For pricing strategy, see pricing.
when-to-use: |-
  Plan go-to-market entry into a new geographic market: localization checklist, regulatory considerations, channel adaptation, pricing adjustments, and hiring priorities. Triggers on 'expand to,' 'international expansion,' 'new market,' 'localization,' or 'enter the French market.' For ABM in a new market, see account-based-marketing. For pricing strategy, see pricing.
argument-hint: |-
  B2B SaaS expanding from US to France — currently 50 French trials, no French-language support
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
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

**One large inbound deal is not the same signal as five organic customers.** A single big prospect from a target country asking for local invoicing, a translated contract, or an in-region entity is real revenue, but it's one data point, not distributed demand — the same test the strategy applies to positioning ("is the alternative the right one, is the signal real") applies here: don't read one enterprise logo's requirements as market validation and skip straight to Phase 3 commitments for that customer alone. Serve that one deal through Phase 2's without-entity approach if the terms allow it, and still wait for the 5-customer/50-trial bar before treating the market itself as validated.

Two of the six signals have a real data source in Bulldozer OS (SEO domain overview, Google Analytics, declared project markets); for the exact calls and the four signals that stay judgment calls, read `references/go-no-go-signals-in-os.md`.

---

## Which Market First — Distance, Not Just Size

Ranking candidate markets by TAM alone is the most common sequencing mistake. A market that scores well on every Go/No-Go signal above can still be the wrong *first* market if it's the most distant one on the list — distance is what determines how fast Phase 1–2 actually move, not how big the number in the pitch deck is.

Compare candidates against the home market using the **CAGE Distance Framework** (Pankaj Ghemawat, "Distance Still Matters: The Hard Reality of Global Expansion," *Harvard Business Review*, September 2001) — four axes, not one TAM figure:

- **Cultural** — language, business etiquette, how buying decisions get made
- **Administrative** — legal system, trade agreements, data-localization rules
- **Geographic** — time zone overlap, travel time for the markets that still require in-person selling
- **Economic** — purchasing power, category maturity

**The arbitrage**: a smaller market that's close on all four axes (familiar language, workable regulatory regime, usable time-zone overlap) clears Phase 1–2 in one cycle. A bigger market that's far on all four takes longer to even learn from — translating, hiring, and adapting to unfamiliar regulation before there's any signal the market wants the product at all. If the team can only run one entry at a time (the Bulldozer rule above), run the low-distance market first even when its TAM is smaller — it validates faster, and what it teaches (localization process, first-hire profile, channel mix) transfers partially to the harder market next.

**What distance doesn't excuse**: skipping the Go/No-Go signals for a low-distance market just because it's cheap to reach. Proximity makes a market cheaper to test, not automatically worth entering — a nearby market with zero organic demand is still zero organic demand.

---

## The 4-Phase Entry Approach

For the four entry phases (Validate, Expand Without Entity, Commit, Scale) with their timing, actions and go signals, read `references/entry-phases-and-localization.md`.

---

## Localization Checklist

For the product and content localization checklists, read `references/entry-phases-and-localization.md`.

---

## Regulatory Considerations by Market

For the regulatory points by market (EU/EEA, United Kingdom, Germany, France, Japan), read `references/regulatory-by-market.md` for every market you are assessing before recommending entry.

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

**Data source**: World Bank PPP data, or the Big Mac Index as a fast, intuitive proxy. Treat the Big Mac Index as a rough starting point only — it's a single-good basket that ignores local costs, competitive pricing, and willingness-to-pay, not a calibration method to defend a final price with.

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
| Paying customers | 3+ (per 90-day plan) | 10+ (first-hire threshold) | Steady net-new adds every quarter |
| ARR from market | First revenue booked | Meets the ARR gate set in Phase 2 | Tracked as a distinct, growing line in company ARR |
| LTV:CAC in market | Not yet measurable | Directional read from the first cohort | >3:1 before scaling further investment in the market |
| Local coverage | Home-entity support only | Reseller/partner confirmed, or first AE hired | Country manager or team, per Phase 3/4 |
| Compliance status | Documentation drafted | Complete (per 90-day plan) | Renewed and audited on a regular cycle |
| Referenceable customers | None yet | First customer willing to be a reference | 3+ referenceable customers, usable in sales |

Treat this as a scorecard, not a single number: a market can look strong on customer count while still failing the LTV:CAC gate, or have a referenceable customer while compliance documentation lags. Either half being weak is a real signal to slow down, not a rounding error to average away.

### When to Stop, Not Just When to Advance

The Go/No-Go Framework and the phase gates above say when to advance. They don't say when to quit — and no audited, named source gives a universal ARR gate or time limit for a market entry that isn't working (checked 2026-09-08: only unattributed agency and vendor blogs circulate specific numbers here; none traceable to a named practitioner, firm, or study, so none is cited).

Use the team's own capacity instead of a borrowed number: if a market hasn't cleared its Phase 2 ARR gate after two full sales cycles at that stage, that's not a market that needs more patience — it's a market that failed the test, the same discipline the Go/No-Go signals already apply to entry. Redirect the budget and the in-market time to the home market or to a different candidate, rather than open-ending the timeline because the sunk cost feels too large to walk away from.

---

## Common Mistakes

- **Entering more than one market at a time.** Splits the team and the budget across markets that are each too thin to validate properly. Run the Go/No-Go Framework and the 4-phase approach on one market before opening a second.
- **Treating translation as localization.** A translated homepage with US payment methods, US date formats, and a US-only support timezone is not localized — see the Product and Content Localization checklists above.
- **Building before validating.** Setting up a legal entity, hiring a country manager, or fully localizing the product before the market has shown organic signal (Phase 1) reverses the order the Go/No-Go Framework is built around.
- **Hiring the first in-market rep too early.** A country manager or AE with no pipeline to work has to build it from scratch instead of closing it — wait for the 10+ paying customers threshold in First Hire in a New Market.
- **Copy-pasting the home-market playbook.** Channels, pricing, and messaging that work at home don't transfer as-is — see Channel Adaptation and Pricing Adaptation. A market entry plan that skips those sections is a home-market plan with a new currency symbol.
- **Selling compliance as a differentiator.** "GDPR compliant" or "hosted in-region" is table stakes to operate in a regulated market, not a reason a prospect picks the product over a competitor who is also compliant — see Regulatory Considerations. A market entry pitch that leans on compliance as its main selling point is usually covering for the fact that Phase 1 validation (does the market actually want the product) never really happened.
- **Ranking candidate markets by TAM alone.** The biggest market on paper is often the most culturally and administratively distant one — see Which Market First. Sequencing by size instead of distance is how a first entry takes twice as long to validate as it needed to.
- **Escalating a market that hasn't cleared its gate.** Missing the Phase 2 ARR gate is a real signal, not a reason to extend the timeline and hope it turns — see When to Stop, Not Just When to Advance.