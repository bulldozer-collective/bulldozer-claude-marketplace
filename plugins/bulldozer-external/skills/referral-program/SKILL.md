---
name: |-
  referral-program
description: |-
  Design and optimize customer referral programs, affiliate programs, and word-of-mouth growth loops. Triggers on 'referral program,' 'affiliate program,' 'viral loop,' 'refer a friend,' 'customers referring customers,' or 'referral incentive design.' For product launch virality, see launch. For a full affiliate/partner program build (recruitment tiers, deal registration, dispute rules), see affiliate-program.
when-to-use: |-
  Design and optimize customer referral programs, affiliate programs, and word-of-mouth growth loops. Triggers on 'referral program,' 'affiliate program,' 'viral loop,' 'refer a friend,' 'customers referring customers,' or 'referral incentive design.' For product launch virality, see launch. For a full affiliate/partner program build (recruitment tiers, deal registration, dispute rules), see affiliate-program.
argument-hint: |-
  B2B SaaS, $99/mo ACV, want double-sided referral for existing customers
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
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

**On the benchmark**: the often-quoted 16–25% LTV lift, 18–37% lower churn, and 2–3x re-referral rate for referred customers don't hold up as a single, verified package — they conflate several sources, at least one of which doesn't actually say what's attributed to it, and a later replication complicates even the LTV figure. Treat the range as directional at best, never as a number to promise a client. Run your own referred-vs-non-referred cohort (activation, retention, revenue) before quoting any of it internally. Full citation trail in `references/benchmarks-and-alternative.md`.

**The alternative you're really comparing to.** It's rarely a competitor's referral program — it's the unincentivized word-of-mouth already happening for free. Before building the mechanism, get a baseline: ask new customers how they heard about you, or check the free-text `source` field on the lead lists this skill sets up below (already used for other attribution). Without that baseline, a program that looks like it's "working" may just be paying for referrals that would have happened anyway — money spent buying credit for word-of-mouth you already had, not lifting the volume. Detail in `references/benchmarks-and-alternative.md`.

### Affiliate Programs

**Best for**: Reaching audiences you don't have, products with higher ACV that justify ongoing commissions, content creators and bloggers in your space.

Affiliates may not be customers. Ongoing commission relationship. Higher volume potential, variable trust level. For the recruitment, tiering, deal-registration and dispute mechanics of a standalone program, use `affiliate-program` — the section below stays scoped to what changes when affiliates are layered onto an existing referral motion.

---

## The Referral Loop

```
Trigger Moment → Share Action → Referred User Converts → Reward Delivered → (Loop)
```

Design every step of this loop before launching.

**Before you build it, check what it's compounding.** A referral program is a growth loop like any other, and a loop only compounds what's already there — it doesn't fix it. Pouring new signups into a product that's losing existing customers just increases the volume that leaks out the other side, and it shows up as "the program doesn't work" a few months later when it was never the program's job to fix. Look at logo retention (or net revenue retention, for an expansion-heavy motion) across the last two or three cohorts before committing budget and engineering time to this. If it's trending down, that's the higher-leverage fix — a referral program built on customers who are quietly unhappy also produces fewer referrers and worse-fit referred signups, because people don't vouch for something they're about to leave.

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

**Refuse this for enterprise motions.** A public leaderboard or a "your logo on our site" tier reads as gimmicky in front of a buyer who's about to run your contract through procurement, and it undermines the trusted-advisor framing sales spent months building. Tiering fits products with a real community or a high-frequency, low-ACV self-serve motion — not a handful of enterprise accounts referring other enterprise accounts.

### Cash vs. credit, and sizing by product type

The reward *type* is a compliance decision, not just a marketing preference — cash above the US 1099-NEC threshold means collecting a W-9, and a personal cash reward to a B2B referrer who isn't the buyer can read as a kickback in a regulated industry. Whatever the amount, the ceiling is what the same customer costs through your next-best paid channel. For the full cash-vs-credit tradeoffs and the incentive sizing table by product type, read `references/incentive-economics.md`.

---

## Referral Program Launch Checklist

### Before Launch
- [ ] Define program goals and success metrics
- [ ] Choose incentive structure and amounts
- [ ] Select referral tracking tool (Rewardful, Tolt, PartnerStack, or custom) — or, before buying anything, a dedicated lead list in Bulldozer OS for a first pass (see "Measuring this in Bulldozer OS" below)
- [ ] Build referral landing page for referred users
- [ ] Set up tracking and attribution
- [ ] Define fraud prevention rules (cap per referrer, verification requirements) — for what this actually means (self-referral, reward farming, gating the reward on a verified conversion), read `references/launch-assets.md`
- [ ] Write terms and conditions
- [ ] Test complete referral flow end-to-end

### Launch
- [ ] Announce to existing customers via email — for the referral email template, read `references/launch-assets.md`
- [ ] Add in-app referral prompt at trigger moment
- [ ] Add referral CTA to post-milestone screens
- [ ] Brief support team on program details

### First 30 Days
- [ ] Review conversion funnel (where are people dropping off?)
- [ ] Identify top referrers and reach out personally
- [ ] Gather friction feedback from program participants
- [ ] Send reminder to non-referrers at day 14

**What 30 days can and can't tell you, in short**: enough to read the funnel for a self-serve product, not enough to judge incentive size once a real sales cycle is involved — that needs at least one full cycle length. Full reasoning and the HubSpot pointer in `references/launch-assets.md`.

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

**Measuring this in Bulldozer OS, in short.** Bulldozer OS has no dedicated referral object, but a lead list per cohort (`bdzCreateLeadList` / `bdzAddLeadToList`, free-text `source` field) covers the first four rows before any paid tracking tool is wired in, HubSpot's `DEAL` object covers the revenue rows where connected, and a GA4 report template (metric name `conversions`, not `keyEvents`) covers click → signup. **One real trap**: the `source` field only writes once per lead — a referred person already known to the OS keeps their old source silently, which understates "% new customers from referrals" with no error thrown. For the full mechanism, the `source` caveat, and the HubSpot/GA4 field names, read `references/measuring-in-bulldozer-os.md`.

---

## Affiliate Program Design

For content creators, bloggers, and distribution partners — commission structure, recruitment sequence, and tool landscape (Rewardful, Tolt, PartnerStack, Introw) in `references/affiliate-program-design.md`. No audited study sets a market-standard commission rate: every figure in that annex comes from affiliate-software vendors describing their own customers' programs, not an independent survey — treat it as a starting range to negotiate from, not a benchmark to defend. For the recruitment tiers, deal-registration and dispute mechanics of a standalone affiliate program, use `affiliate-program` instead of building that out here.