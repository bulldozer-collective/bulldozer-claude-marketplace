---
name: pricing
description: Design or optimize SaaS pricing — tiers, value metrics, packaging, and willingness-to-pay research. Triggers on 'pricing tiers,' 'willingness to pay,' 'how much should I charge,' 'my pricing is wrong,' 'freemium vs paid,' 'annual discount strategy,' or 'Van Westendorp.' For in-app upgrade screens, see paywalls. For cancel flows, see churn-prevention.
when-to-use: Design or optimize SaaS pricing — tiers, value metrics, packaging, and willingness-to-pay research. Triggers on 'pricing tiers,' 'willingness to pay,' 'how much should I charge,' 'my pricing is wrong,' 'freemium vs paid,' 'annual discount strategy,' or 'Van Westendorp.' For in-app upgrade screens, see paywalls. For cancel flows, see churn-prevention.
argument-hint: B2B SaaS, current pricing $29/$99/$249 per month, high conversion on $29 plan but almost no upgrades — redesign pricing
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Pricing Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on SaaS pricing and monetization. Your goal is to help design pricing that captures value, drives growth, and aligns with customer willingness to pay.

## Input

`$ARGUMENTS` — current pricing (if any), product type, and what decision to make or evaluate (e.g., "current pricing $29/$99 per month, high conversion but low upgrades — what should we change?"). If not provided, read any available context files. Only ask if the pricing decision is completely absent.

## Output

A `pricing-brief-{product}.md` file with: pricing diagnosis (what's working and what's broken), recommended value metric, tier structure (name, price, inclusions, positioning for each), annual discount strategy, pricing page structure recommendations, and a research plan if willingness-to-pay data is needed.

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
- **Next best alternative** — the floor for differentiation
- **Your cost to serve** — a baseline, not the basis

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

---

## Tier Structure Design

### Good-Better-Best Framework

| Tier | Role | Positioning |
|------|------|-------------|
| **Good (Entry)** | Acquisition — get them in | Core features, limited usage, lowest price |
| **Better (Recommended)** | Revenue — where most customers land | Full features, reasonable limits, anchor price |
| **Best (Premium)** | Expansion — high-value accounts | Everything + advanced, 2–3× Better price |

**Decoy rule**: The middle tier should be the obvious choice. Price the Best tier high enough that Better looks reasonable. Price the Good tier low enough that it's accessible but clearly limited.

### Tier Differentiation Methods

- **Feature gating**: Basic vs. advanced features (most common in B2B SaaS)
- **Usage limits**: Same features, different caps (users, records, API calls)
- **Support level**: Email → Priority → Dedicated CSM
- **Security / compliance**: SSO, audit logs, SAML (enterprise gate)

### What NOT to Gate

Don't gate core value. If a feature is the reason they signed up, putting it behind a paywall destroys trust. Gate expansion features — things that matter when they're getting more value.

---

## Annual vs. Monthly Pricing

**Standard annual discount**: 15–20% (equivalent to 2 months free). Show monthly price with "(save 20%)" next to annual option.

**Why push annual:**
- Reduces churn dramatically (annual customers churn at 3–5× lower rates)
- Improves cash flow
- Increases LTV

**When NOT to offer annual:**
- Product is still finding PMF (annual locks customers before you know if they're the right ICP)
- High-volume, low-price products (annual discount math doesn't work)

---

## Pricing Research Methods

### Van Westendorp Price Sensitivity Meter

Four survey questions:
1. At what price would this be so expensive you wouldn't consider it? (too expensive)
2. At what price would this be so cheap you'd question the quality? (too cheap)
3. At what price would this start to feel expensive, but you'd still consider it? (getting expensive)
4. At what price would this feel like a bargain? (a bargain)

Plot the four curves. The "acceptable price range" is where "too cheap" and "too expensive" cross. Your sweet spot is between "getting expensive" and "a bargain."

### Willingness-to-Pay Signals (without a formal study)

- Conversion rate >40% at current price → price is too low, raise it
- "It's so cheap!" feedback → raise price
- Prospects don't flinch at price → raise price
- Win rate doesn't change when you raise price → keep raising
- Losing deals on price consistently → evaluate if it's the right ICP, not just the price

---

## When to Raise Prices

**Signals it's time:**
- Very high conversion rate (>40%)
- Very low churn (<2% monthly for B2B)
- Customers saying "it's so cheap"
- Competitors have raised prices
- Significant value added since last pricing change

**Price increase strategies:**
1. **Grandfather existing** — new price for new customers only
2. **Delayed increase** — announce 3–6 months out, grandfather for 90 days
3. **Tied to value** — raise price but add features simultaneously
4. **Plan restructure** — change plans entirely, allow existing customers to stay on old plan

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

---

## Common Pricing Mistakes

- **Per-seat pricing for solo users** — creates barriers to adoption; use flat fee for small teams
- **Too many tiers** — three is the sweet spot; five or more causes paralysis
- **Pricing based on cost** — irrelevant to customers; price based on value
- **No annual option** — leaving retention and cash flow on the table
- **Changing prices too frequently** — erodes trust; change max once per year unless restructuring
- **Hiding the price** — "contact sales" for everything below enterprise destroys self-serve conversion