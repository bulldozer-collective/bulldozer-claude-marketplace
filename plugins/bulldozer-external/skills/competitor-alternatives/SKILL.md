---
name: |-
  competitor-alternatives
description: |-
  Build competitor comparison and alternative pages that rank for competitive search terms. Triggers on 'alternative page,' 'vs page,' 'competitor comparison page,' 'alternatives to X,' 'X vs Y landing page,' or 'competitive landing pages.' For competitive intelligence and profiles, see competitor-profiling. For sales battle cards, see battlecards.
when-to-use: |-
  Build competitor comparison and alternative pages that rank for competitive search terms. Triggers on 'alternative page,' 'vs page,' 'competitor comparison page,' 'alternatives to X,' 'X vs Y landing page,' or 'competitive landing pages.' For competitive intelligence and profiles, see competitor-profiling. For sales battle cards, see battlecards.
argument-hint: |-
  Build a '[Competitor] alternatives' page and a 'Us vs [Competitor]' comparison page
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Competitor & Alternative Pages

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on competitor comparison and alternative pages. Your goal is to build pages that rank for competitive search terms, help evaluators make a decision, and position your product effectively.

## Input

`$ARGUMENTS` — page type and competitor name (e.g., "Build '[Competitor] alternatives' page and 'Us vs [Competitor]' comparison page"). If not provided, read any available context files before asking. Only ask if the competitor name is completely absent.

## Output

A `competitive-pages-{competitor}.md` file with: page type recommendation (with rationale), full page copy for each page type requested (title, meta, all sections), keyword targets, and internal linking recommendations.

**Produce output on first invocation. Read available context before asking. Only ask if there is no competitor name to work with.**

---

## Page Format Selection

| Format | Search Intent | URL Pattern | Target Keywords |
|--------|--------------|-------------|----------------|
| **[Competitor] Alternative** | Actively looking to switch | `/alternatives/[competitor]` | "[Competitor] alternative," "switch from [Competitor]" |
| **[Competitor] Alternatives** | Researching options, earlier in journey | `/alternatives/[competitor]-alternatives` | "[Competitor] alternatives," "best [Competitor] alternatives" |
| **You vs [Competitor]** | Directly comparing two options | `/vs/[competitor]` | "[You] vs [Competitor]," "[Competitor] vs [You]" |
| **[A] vs [B]** | Comparing two competitors | `/compare/[a]-vs-[b]` | "[A] vs [B]," "[B] vs [A]" |

Build all four types for your single highest-intent competitor first, then extend one competitor at a time as content capacity allows. Four formats × five competitors is 20 pages to write and keep current through Quarterly Maintenance below — most small content teams can't sustain that; a short list kept accurate beats a long list that goes stale. The "[A] vs [B]" format captures traffic where you're not mentioned — you appear as "the third option."

**The named competitor is rarely the whole story.** In most B2B evaluations the account you're actually losing to is the status quo — a spreadsheet, a manual process, the incumbent already in place, or doing nothing. A page set built only against named vendors misses this by construction. Don't build a fifth page type for it: fold "why change now" into the opening section of Formats 1 and 2 (the frustration you're validating) and into the Migration Section, where the real question is whether switching is worth the effort compared to staying put.

**Punching up is a real trade-off, not just an opportunity.** Going head-to-head against a bigger, better-known name tends to work in the challenger's favor more than in the leader's — comparative-advertising research has long found that a smaller or newer brand gains more credibility from a direct comparison than a category leader gains from the same page. But that only holds while the page stays honest: a comparison table that shows every checkmark green against a known leader reads as spin the moment a prospect who's used both products lands on it, and it costs the deal instead of winning it. Against a clear category leader, weight the page toward the categories and segment you can genuinely win rather than trying to beat them on every row — Format 2 (you as one of several alternatives) usually survives that test better than Format 3 (a single head-to-head), because it doesn't stake the whole page on beating the leader everywhere.

---

## Page Structure by Format

### Format 1: [Competitor] Alternative (Singular)

1. Why people look for alternatives (validate their frustration)
2. Summary: you as the alternative (quick positioning)
3. Detailed comparison (features, support, pricing)
4. Who should switch — and who shouldn't (be honest)
5. Migration path
6. Social proof from switchers
7. CTA

### Format 2: [Competitor] Alternatives (Plural)

1. Why people look for alternatives (common pain points)
2. Criteria for choosing an alternative
3. List of alternatives (you first, include 4–7 real options)
4. Comparison table
5. Detailed breakdown per alternative
6. Recommendation by use case
7. CTA

**Rule**: Include real alternatives. Being genuinely helpful builds trust and ranks better than a list of weak straw-men.

### Format 3: You vs [Competitor]

1. TL;DR summary (key differences in 2–3 sentences)
2. At-a-glance comparison table
3. Detailed comparison by category (features, pricing, support, ease of use, integrations)
4. Who [You] is best for
5. Who [Competitor] is best for (be honest)
6. What customers say (testimonials from switchers)
7. Migration support
8. CTA

### Format 4: [Competitor A] vs [Competitor B]

1. Overview of both products
2. Comparison by category
3. Who each is best for
4. The third option (introduce yourself naturally)
5. Comparison table (all three)
6. CTA

---

## Writing Principles

**Honesty builds trust**: Acknowledge competitor strengths. Be accurate about your limitations. Readers will verify claims.

**Depth over surface**: Go beyond feature checklists. Explain why differences matter. Show use cases.

**Help them decide**: Be explicit about who you're best for and who the competitor is best for. Reducing evaluation friction wins deals.

**Make claims checkable**: "Saves time" can't be verified. "Set up in a day, not a week" can — the reader can test it against their own onboarding experience. Prefer the version a prospect could confirm or contradict.

**Test every row against the table-stakes line.** Before a comparison-table cell or a "why us" bullet ships, check whether the competitor could honestly write the same sentence about itself. If they could, it's table stakes — what any credible option in the category needs to have — not a reason to pick you, and it belongs in a shared row, not in your differentiation column. This is a practitioner test (associated with positioning consultant April Dunford's table-stakes/differentiator distinction, not an exact quote of hers) — apply it to the comparison table and to "Who [You] is best for," not just to the page intro.

**Don't publish a superiority claim you couldn't back up if challenged.** The claim doesn't need a footnote on the page, but it needs a real source behind it — a support-ticket count, a signed customer quote, a documented benchmark — before it goes live. That standard also protects the page legally: comparative claims about a named competitor are a favorite target for a cease-and-desist letter, and an unsubstantiated claim is a far easier target than the mere use of their name.

**Name them, don't dress as them.** Use the competitor's name in plain text — that's the well-protected comparative-advertising case. Don't reproduce their logo, brand colors, or UI screenshots without permission; that's a different, much weaker legal position and it isn't necessary to make the comparison land.

**TL;DR first**: Start every comparison with a 2–3 sentence summary for scanners. The majority of visitors won't read the full page.

**Refuse the page you can't win honestly.** If the honest answer to "who should switch" is nobody, don't publish it yet — fix the product gap or wait, but a page that only ever says you're better isn't a comparison. The first reader who's used both products and catches the tilt discounts every other page on the site.

---

## Comparison Categories to Cover

For each comparison dimension, write a paragraph explaining the difference and when it matters — not just a checkmark table.

| Category | What to Compare |
|----------|----------------|
| Core features | Which features each has, and at what quality |
| Pricing | Tier-by-tier, total cost for a sample team size, hidden costs |
| Ease of use | Setup complexity, learning curve, support quality |
| Integrations | What integrates natively vs. via Zapier |
| Support | Response time, channels, documentation quality |
| Target market | Who each is built for (company size, use case) |

---

## Migration Section (required on alternative pages)

- What transfers automatically vs. what needs reconfiguration
- Estimated migration time
- What support you offer during migration
- Quotes from customers who switched (with their experience)

---

## SEO Rules

- Keyword targeting: see table above — use both "[You] vs [Competitor]" and "[Competitor] vs [You]" variants
- Internal linking: link between related competitor pages; link from feature pages to relevant comparisons
- Create a hub page linking to all competitor content (`/alternatives`, `/compare`)
- Consider FAQ schema for "What is the best alternative to [Competitor]?" type questions

---

## Content Architecture

Maintain a centralized competitor data file (YAML) with:
- Positioning and target audience
- Pricing (all tiers, updated quarterly)
- Feature ratings per category
- Strengths and weaknesses
- "Best for / not ideal for" statements
- Common complaint themes from reviews
- Migration notes

This single source of truth feeds all comparison pages — updates propagate everywhere without rewriting individual pages.

If the competitor is already tracked as a Bulldozer OS competitor record, treat that as a live complement to the file rather than duplicating it by hand: use it to pull review data and to log positioning observations as you spot them (see Quarterly Maintenance below). It doesn't hold pricing tiers or feature ratings, so the file stays the source of truth for those.

**Weigh a G2 or Capterra rating as a directional signal, not a verdict.** Those pages are built substantially from solicited review campaigns — a vendor asking its own customers to leave a review, sometimes with an incentive — so they skew toward whoever runs the campaign harder, not toward a spontaneous cross-section of the market. Use them to spot a positioning theme worth checking, not as proof of what a competitor's customers really think; don't quote a G2/Capterra star rating or complaint count in page copy as if it were an audited fact.

**A strong G2 score and a strong Capterra, GetApp, or Software Advice score for the same competitor were never independent readings — not even before the 2026 deal.** Gartner ran Capterra, GetApp, and Software Advice on one shared review database for years under its Digital Markets brand — their scores on a given vendor already matched by construction, long before G2 bought all three from Gartner (deal closed February 2026) and brought a genuinely separate fourth pool — its own — under the same roof. Buyer-intent data across all four has fed a single G2 account profile since June 2026, but the review pools themselves stayed where they always were: one combined pool (Capterra/GetApp/Software Advice) plus G2's own, not four. Citing "well-reviewed on G2, Capterra, and Software Advice" as three markets agreeing is citing one sales operation's one solicitation campaign three times, not three independent ones; only a G2-vs-(Capterra/GetApp/Software Advice) comparison actually pits two separate pools against each other.

**Template the data, not the prose.** Feeding the same file into every page is what makes this architecture reproducible — reusing the same paragraph structure and phrasing across pages with only the competitor's name swapped is a different thing, and it's the specific pattern search engines' scaled-content-abuse policies exist to catch. That risk isn't limited to search rankings anymore: Google's spam policies have explicitly covered manipulating AI Overviews and AI Mode answers since May 2026, not just classic rankings, so a templated page is now just as likely to cost an AI citation as a ranking position. SEO trade analysis of that scaled-content-abuse category treats a near-duplicate comparison page — same structure, only the competitor's name swapped, no real evaluation behind it — as a textbook case, whether a person or a tool produced it. Google's September 2026 spam update (rolled out September 24 through roughly October 7) enforced that same standing policy at scale; treat it as proof the policy gets applied, not as a new rule written specifically for comparison pages — no Google-published source names "comparison pages" as its own example, so don't repeat that attribution as if it were a quote. If a page reads like the last one with find-and-replace applied, rewrite the analysis by hand before publishing, even when every fact in it came straight from the file.

---

## Quarterly Maintenance

- Verify pricing (most volatile — changes without announcement). Bulldozer OS doesn't track competitor pricing — this stays a manual check.
- Check for major feature releases in their changelog. Also manual — no OS source for this.
- Update review ratings and counts. For a competitor tracked in Bulldozer OS, turn on automatic review refresh instead of counting by hand each quarter — but that "set once" auto-refresh only exists for Trustpilot. A Google Business Profile location still needs a manual re-sync every time you want current numbers (no standing refresh for GBP), and G2/Capterra ratings always need a manual check regardless — Bulldozer OS doesn't pull either.
- Refresh customer quotes if better ones exist.
- Note any positioning changes in their homepage messaging. If the competitor is tracked in Bulldozer OS, log the finding on its note field so it's visible the next time anyone writes a comparison page against it, not just in the local file.
- Don't wait for the quarter to react to a competitor's own instability — a merger, acquisition, rebrand, or shutdown makes a page's whole premise wrong overnight, not gradually. Treat it as an immediate rewrite-or-retire trigger the day you learn of it, the same as a pricing change you'd never wait a quarter to reflect.
- Retire a page that isn't earning its maintenance. A page that still hasn't reached page one after two maintenance cycles and drives close to no conversions is dead weight, not work in progress — fold what's useful into the centralized file and pull the page rather than keep polishing something no one reads. A short list kept accurate beats a long list kept alive out of habit.