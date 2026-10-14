---
name: |-
  pricing
description: |-
  Design or optimize SaaS pricing — tiers, value metrics, packaging, and willingness-to-pay research. Triggers on 'pricing tiers,' 'willingness to pay,' 'how much should I charge,' 'my pricing is wrong,' 'freemium vs paid,' 'annual discount strategy,' or 'Van Westendorp.' For in-app upgrade screens, see paywalls. For cancel flows, see churn-prevention.
when-to-use: |-
  Design or optimize SaaS pricing — tiers, value metrics, packaging, and willingness-to-pay research. Triggers on 'pricing tiers,' 'willingness to pay,' 'how much should I charge,' 'my pricing is wrong,' 'freemium vs paid,' 'annual discount strategy,' or 'Van Westendorp.' For in-app upgrade screens, see paywalls. For cancel flows, see churn-prevention.
argument-hint: |-
  B2B SaaS, current pricing $29/$99/$249 per month, high conversion on $29 plan but almost no upgrades — redesign pricing
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Pricing Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on SaaS pricing and monetization. Your goal is to help design pricing that captures value, drives growth, and aligns with customer willingness to pay.

## Input

`$ARGUMENTS` — current pricing (if any), product type, and what decision to make or evaluate (e.g., "current pricing $29/$99 per month, high conversion but low upgrades — what should we change?"). If not provided, read any available context files. Only ask if the pricing decision is completely absent.

## Output

A `pricing-brief-{product}.md` file with: pricing diagnosis (what's working and what's broken), recommended value metric, tier structure (name, price, inclusions, positioning for each), annual discount strategy, pricing page structure recommendations, and a research plan if willingness-to-pay data is needed. Ground the diagnosis in real usage/revenue data where it's available (see "Measuring Your Own Signals" below) rather than in market benchmarks alone.

**Produce output on first invocation. Read available context before asking. Only ask if there is zero context about the product or pricing.**

---

## Pricing Fundamentals

### The Three Pricing Axes

**1. Value metric** — what do you charge for? (per seat, per usage, flat fee)
**2. Packaging** — what's included at each tier?
**3. Price point** — the actual dollar amounts

Get the value metric right first. Everything else follows from it.

### Value-Based Pricing

Price between the next best alternative and perceived value:

- **Customer's perceived value** — the ceiling
- **Your price** — between alternatives and perceived value
- **Next best alternative** — the floor for differentiation. This is very often not a named competitor's software — it's the spreadsheet, the manual process, the incumbent already in place, or doing nothing at all. Anchor the pricing conversation against what the customer is actually giving up, not just the closest tool on the market.
- **Your cost to serve** — a baseline, not the basis

### When Pricing Isn't the Real Problem

Before redesigning tiers or running a price test, check whether "pricing" is actually the symptom of something else. The same test applies here as anywhere in the funnel: are you looking at the problem or the thing it produced? A few tells that the real issue sits upstream of price:

- Deals are lost "on price" but the CRM shows losses concentrated in one segment or ICP — that's a targeting problem wearing a price complaint.
- Trial users churn before ever seeing the paywall — no pricing change fixes an activation problem.
- The ask is "raise prices to hit a revenue number" with no signal (win rate, churn, qualitative feedback) that the current price is actually too low — that's a growth-target problem, not a pricing one.

If none of the diagnostic signals below point at price specifically, say so in the brief rather than proposing a tier redesign anyway — a pricing project that doesn't fix the actual constraint just moves the same revenue problem three months down the road.

---

## Value Metric Selection

### What Makes a Good Value Metric?

- Aligns price with value delivered (customers paying more get more)
- Easy to understand and explain
- Scales as the customer grows
- Hard to game

### Common Value Metrics

| Metric | Best For | Example |
|--------|----------|---------|
| Per seat / user | Collaboration tools | Slack, Notion |
| Per usage | Variable consumption | AWS, Twilio |
| Per record / contact | CRM, email tools | Mailchimp, HubSpot |
| Per transaction | Payments, marketplaces | Stripe |
| Flat fee | Simple products, high-trust | Basecamp |
| Per feature | Modular products | HubSpot add-ons |

**Test**: "As a customer uses more of [metric], do they get more value?" If yes — good value metric.

**A pattern worth knowing about, treated as a direction rather than a target**: a hybrid structure — a base platform fee for predictability, plus a metered or credit-based component that scales with usage — comes up repeatedly in 2025–2026 pricing commentary as an alternative to pure per-seat pricing, especially for products where AI/automation lets a customer's headcount shrink while their actual usage of the product grows. This is no longer just vendor-blog chatter: a named, sampled survey now sits behind it — Kyle Poyar's Growth Unhinged "State of B2B SaaS and AI Monetization" report, which polled 230+ B2B software and AI companies in 2026 and is cited consistently across independent write-ups as showing hybrid has overtaken seat-based as the most common primary pricing structure. The report itself wasn't reachable to read directly (blocked), and the specific percentage breakdown circulating in secondary blogs isn't confirmed at the source — don't quote a number from it — but the underlying mechanism is worth naming on its own merits: a pure per-seat metric will under-price a shrinking-headcount, high-usage account.

**A step some AI-native products are taking past that hybrid pattern**: pricing per completed outcome — a resolved support ticket, a qualified lead, a finished agent action — instead of per seat or even per usage unit. It shows up in 2026 pricing-page language and product announcements from several vendors, not in any audited adoption study, so treat the direction as real without quoting a market-share number for it. Before copying it: an outcome is only a safe value metric if it's unambiguous and hard to game from the side that gets measured on it — a support ticket marked "resolved" by an agent under volume pressure isn't the same signal as a customer confirming the problem is actually gone. Pressure-test the outcome definition against real cases before billing on it, the same discipline this document already asks of any value metric.

**Never test a value-metric change and a price change at the same time.** If both move together, you can't tell which one drove the result — a bad practice regardless of how confident either change feels on its own.

---

## Tier Structure Design

### Good-Better-Best Framework

| Tier | Role | Positioning |
|------|------|-------------|
| **Good (Entry)** | Acquisition — get them in | Core features, limited usage, lowest price |
| **Better (Recommended)** | Revenue — where most customers land | Full features, reasonable limits, anchor price |
| **Best (Premium)** | Expansion — high-value accounts | Everything + advanced, 2–3× Better price |

**The renunciation test**: a tier structure that doesn't make clear who *shouldn't* buy the Good tier — and who is priced out of buying at all — isn't a positioning decision, it's just a menu. If every prospect fits every tier equally well, the tiers aren't doing their job.

**Decoy rule**: The middle tier should be the obvious choice. Price the Best tier high enough that Better looks reasonable. Price the Good tier low enough that it's accessible but clearly limited. Treat this as a hypothesis to test, not a guarantee: the lab result behind it (asymmetric dominance / the decoy effect, Huber, Payne & Puto, 1982) has a documented replication problem once the choice looks like a real pricing page rather than a lab task. The most-cited large-scale replication (Yang & Lynn, "More Evidence Challenging the Robustness and Usefulness of the Attraction Effect," Journal of Marketing Research 51(4), 2014) ran 91 attempts across 23 product categories and found only 11 reliable effects — and the effect dropped to chance levels specifically when options were described the way a pricing page actually describes plans (qualitative, verbal feature lists) rather than as abstract numeric attributes. Anchoring (showing the higher tier first) has stronger empirical support by comparison. Validate a decoy-driven restructure with an A/B test before committing to it as fact.

**Naming a tier that will be sold as an iOS in-app purchase or subscription?** The App Store product page enforces a hard character limit on what a customer actually sees: 35 characters for the displayed name, 55 for the description — both far shorter than the rest of the product page (app title 30, subtitle 30, keywords 100). A label like "Pro Annual — Unlimited AI Reports" clears a slide deck but gets truncated or rejected in App Store Connect. The in-app purchase and subscription sections of a product page also cap out at 20 combined items total — past that, extra tiers simply aren't shown to users. Check both limits before finalizing tier names and counts for an iOS SKU, not after building the paywall around them.

### Tier Differentiation Methods

- **Feature gating**: Basic vs. advanced features (most common in B2B SaaS)
- **Usage limits**: Same features, different caps (users, records, API calls)
- **Support level**: Email → Priority → Dedicated CSM
- **Security / compliance**: SSO, audit logs, SAML (enterprise gate)

### What NOT to Gate

Don't gate core value. If a feature is the reason they signed up, putting it behind a paywall destroys trust. Gate expansion features — things that matter when they're getting more value.

---

## Annual vs. Monthly Pricing

**Standard annual discount**: 15–20% (equivalent to 2 months free) is the convention most SaaS pricing pages converge on — not a fixed rule, just the common default. Show monthly price with "(save 20%)" next to annual option.

**Why push annual:**
- Reduces churn — annual cohorts churn markedly less than monthly cohorts, but the exact multiplier varies a lot by source and segment (nothing found in an audited study; market aggregates for 2025–2026 range roughly from "a third of the monthly rate" to 5×+). Track your own annual vs. monthly cohort rather than quoting a market multiplier.
- Improves cash flow
- Increases LTV

**When NOT to offer annual:**
- Product is still finding PMF (annual locks customers before you know if they're the right ICP)
- High-volume, low-price products (annual discount math doesn't work)

---

## Pricing Research Methods

For the pricing research methods — the Van Westendorp price sensitivity meter, how to read a pricing or paywall A/B test, willingness-to-pay signals without a formal study, and how to measure your own signals in Bulldozer OS (GA4, CMS traffic and forms, HubSpot CRM) — read `references/pricing-research-methods.md` when diagnosing or testing price.

---

## When to Raise Prices

For the signals that it is time to raise prices, the four price-increase strategies and the Apple App Store and Google Play rules for in-app subscription price increases, read `references/raising-prices.md` when the question is whether or how to raise prices.

---

## Pricing Page Design

### Above the Fold

- Clear tier comparison table
- Recommended tier highlighted (badge: "Most Popular" or "Best Value")
- Monthly/Annual toggle (default to annual)
- Primary CTA for each tier

### Essential Elements

- Feature comparison table (detailed, not just checkmarks)
- "Who this is for" per tier (1 sentence)
- FAQ section (pricing objections, cancellation policy, trial policy)
- Annual discount callout (show monthly price both ways)
- Money-back guarantee if applicable
- Customer logos / trust signals below the fold

### Pricing Psychology

| Technique | Application |
|-----------|------------|
| **Anchoring** | Show higher-priced tier first (left to right: Best → Better → Good) |
| **Decoy effect** | Middle tier should be best value — highest-priced should make middle look reasonable |
| **Charm pricing** | $49 vs. $50 — signals value, not premium |
| **Round pricing** | $100 vs. $99 — signals quality, premium positioning |
| **Mental accounting** | "$3/day" feels different than "$90/month" |

Anchoring has more consistent support across real pricing pages than the decoy effect: the 2014 large-scale replication (Yang & Lynn, Journal of Marketing Research) found the decoy/asymmetric-dominance effect held up in only 11 of 91 attempts, and it weakened further on realistic, verbally-described choices — the exact format of a pricing table. Validate a decoy-based tier structure with an A/B test rather than assuming the lift — same caveat as the Decoy rule above.

---

## Common Pricing Mistakes

- **Per-seat pricing for solo users** — creates barriers to adoption; use flat fee for small teams
- **Too many tiers** — three is the sweet spot; five or more causes paralysis
- **Pricing based on cost** — irrelevant to customers; price based on value
- **No annual option** — leaving retention and cash flow on the table
- **Changing prices too frequently** — erodes trust; change max once per year unless restructuring
- **Hiding the price** — "contact sales" for everything below enterprise destroys self-serve conversion
- **Copying a market benchmark instead of measuring your own cohort** — churn multipliers, conversion-rate thresholds, and psychology tactics quoted in vendor blogs and pricing-page listicles vary wildly by source and are rarely an audited study; treat every number in this document that isn't from your own data as a starting hypothesis, not a target to hit
- **Changing the value metric and the price in the same test** — if both move together, a win or a loss can't be attributed to either one