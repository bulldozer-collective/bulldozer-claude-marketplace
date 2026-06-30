---
name: |
  referral-program
description: |
  Design and optimize customer referral programs, affiliate programs, and word-of-mouth growth loops. Triggers on 'referral program,' 'affiliate program,' 'viral loop,' 'refer a friend,' 'customers referring customers,' or 'referral incentive design.' For product launch virality, see launch.
when-to-use: |
  Design and optimize customer referral programs, affiliate programs, and word-of-mouth growth loops. Triggers on 'referral program,' 'affiliate program,' 'viral loop,' 'refer a friend,' 'customers referring customers,' or 'referral incentive design.' For product launch virality, see launch.
argument-hint: |
  B2B SaaS, $99/mo ACV, want double-sided referral for existing customers
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Referral & Affiliate Programs

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on referral and affiliate programs. Your goal is to design programs that turn customers into growth engines with measurable, compounding impact.

## Input

`$ARGUMENTS` — product type, pricing, target program type (e.g., "B2B SaaS $99/mo, want a customer referral program"). If not provided, read any available context files before asking. Only ask if the product context and program type are completely absent.

## Output

A `referral-program-spec.md` file with: program type selection, incentive structure, share mechanism, trigger moment recommendations, copy for referral invitation (email + in-app), referred user landing page copy, launch checklist, and key metrics to track. For affiliate programs, includes commission structure and recruitment strategy.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Referral vs. Affiliate — Choose First

### Customer Referral Programs

**Best for**: Products with natural word-of-mouth, lower-ticket or self-serve products, existing happy customer base.

Referrer = existing customer. Higher trust, lower volume. One-time or limited rewards.

**The benchmark**: Referred customers have 16–25% higher LTV and 18–37% lower churn than non-referred. They also refer others at 2–3x the rate of regular customers.

### Affiliate Programs

**Best for**: Reaching audiences you don't have, products with higher ACV that justify ongoing commissions, content creators and bloggers in your space.

Affiliates may not be customers. Ongoing commission relationship. Higher volume potential, variable trust level.

---

## The Referral Loop

```
Trigger Moment → Share Action → Referred User Converts → Reward Delivered → (Loop)
```

Design every step of this loop before launching.

---

## Step 1: Identify Trigger Moments

The best referral prompt comes immediately after the user experiences real value — not randomly.

**High-intent trigger moments**:
- Right after first "aha moment" (when they've done the thing that made the product click)
- After achieving a milestone (exported first report, created first project, hit a goal)
- After exceptional support interaction
- After renewal or voluntary upgrade (demonstrated strong satisfaction)

**Wrong moments**:
- During onboarding (before they've felt value)
- When they're mid-task or in a flow
- During a friction moment (billing, errors, support issues)

---

## Step 2: Share Mechanism (Ranked by Effectiveness)

1. **In-product sharing** — dedicated referral button visible after key moments (highest conversion)
2. **Personalized referral link** — unique URL to share anywhere
3. **Email invitation** — "Invite a teammate" flow inside the product
4. **Social sharing** — pre-filled tweet/LinkedIn post (lowest friction, lower conversion)
5. **Referral code** — works offline, at events, on podcasts

Most programs use a combination. Prioritize in-product sharing first.

---

## Step 3: Incentive Structure

### Double-sided (recommended for most B2B SaaS)

Both referrer and referred user get rewarded. Win-win framing. Higher conversion on both sides.

Example: "Give $50 off, get $50 off"

### Single-sided (referrer only)

Simpler to explain. Works for high-value products where the referred user's win is obvious.

Example: "Earn $200 for every team you refer"

### Tiered rewards

Gamifies referral. Increases engagement. Best for products with strong community.

Example: "Refer 1 → $50. Refer 5 → $300 + your logo on our site"

### Incentive Sizing by Product Type

| Product type | Referrer reward | Referred reward |
|-------------|----------------|----------------|
| Self-serve SaaS (<$50/mo) | 1 month free or $10-$50 credit | 1 month free or $10-$30 credit |
| Mid-market SaaS ($100-$500/mo) | $100-$500 credit or cash | 20-30% off first 3 months |
| High-ACV SaaS (>$1k/mo) | % of first year revenue ($500-$2k) | Custom negotiated |
| E-commerce | 10-20% commission | 10-15% off first order |

---

## Referral Email Template

Subject: You can now earn [reward] for sharing [Product]

```
Hey [Name],

We just launched our referral program.

Share [Product] with someone in your network who'd find it useful — 
they get [their reward], you get [your reward] after they sign up.

Your referral link: [unique link]

It's simple:
1. Share your link
2. They sign up
3. You both get [reward]

[Share My Link]

Thanks for being part of the [Product] community.

[Your name]
```

---

## Referral Program Launch Checklist

### Before Launch
- [ ] Define program goals and success metrics
- [ ] Choose incentive structure and amounts
- [ ] Select referral tracking tool (Rewardful, Tolt, PartnerStack, or custom)
- [ ] Build referral landing page for referred users
- [ ] Set up tracking and attribution
- [ ] Define fraud prevention rules (cap per referrer, verification requirements)
- [ ] Write terms and conditions
- [ ] Test complete referral flow end-to-end

### Launch
- [ ] Announce to existing customers via email
- [ ] Add in-app referral prompt at trigger moment
- [ ] Add referral CTA to post-milestone screens
- [ ] Brief support team on program details

### First 30 Days
- [ ] Review conversion funnel (where are people dropping off?)
- [ ] Identify top referrers and reach out personally
- [ ] Gather friction feedback from program participants
- [ ] Send reminder to non-referrers at day 14

---

## Key Metrics

| Metric | What it tells you |
|--------|------------------|
| Active referrers (30d) | Program awareness and participation |
| Shares per active referrer | Share mechanism friction |
| Referral link click rate | Offer attractiveness |
| Click → signup conversion | Referred user landing page quality |
| % new customers from referrals | Business impact |
| Referral CAC vs. other channels | Program ROI |
| LTV of referred customers | Quality of referred users |

---

## Affiliate Program Design

For content creators, bloggers, and distribution partners:

**Commission structure**:
- SaaS: 20–30% recurring monthly commission (for 6–12 months) OR 50–100% of first month one-time
- E-commerce: 5–15% of sale value
- High-ACV: Flat fee per qualified introduction ($500–$2k) plus percentage of closed revenue

**Recruitment**:
1. Start with people already writing about you (Google: "best [category]" and find who lists competitors)
2. Check who links to competitors (Ahrefs backlink analysis)
3. Reach out to newsletter and podcast hosts in your space
4. List your program on affiliate directories (Commission Junction, ShareASale for e-commerce)

**Tool options**: Rewardful (Stripe-native), Tolt (SaaS-focused), PartnerStack (enterprise features), Introw (B2B partner programs with deal registration and QBRs).