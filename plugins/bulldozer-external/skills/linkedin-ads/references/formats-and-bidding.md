# Ad Formats and Bidding

## Ad Formats

| Format | Best for | CPM range |
|--------|----------|-----------|
| **Sponsored Content (single image)** | Brand awareness, thought leadership | $30–$60 CPM |
| **Sponsored Content (video)** | Complex product explanation, stories | $25–$55 CPM |
| **Carousel ads** | Feature showcases, case studies | $35–$65 CPM |
| **Message Ads (InMail)** | Direct outreach, event invitations | Per-send pricing |
| **Lead Gen Forms** | Lead capture (no landing page) | CPL-optimized |
| **Conversation Ads** | Interactive multi-step engagement (choose-your-own-path, multiple CTAs) | Per-send pricing |
| **Document ads** | Gated content (whitepapers, reports) — supports page-level view tracking | $35–$65 CPM |
| **Thought Leader Ads** | Sponsoring a post from a named person (founder, exec, SME) instead of the company page | 2026 benchmark aggregators converge on roughly 2–6x the CTR of single-image Sponsored Content — no LinkedIn-published multiple, treat as directional |

**Start with Sponsored Content + Lead Gen Forms**: Lowest friction path from impression to lead. Form data pre-fills from LinkedIn profile — dramatically higher completion rate than external landing pages. **Thought Leader Ads are worth a test slot once you have a named spokesperson** — they trade the polish of a company-page ad for the credibility of a real profile, and multiple 2026 benchmark sources (including at least one that tracks Thought Leader Ads specifically, updated monthly) converge on a 2–6x CTR lift over standard single-image ads. Still no LinkedIn-published figure behind that range, so read it as "expect a real lift, don't promise a specific multiple" rather than a number to put in a client deck.

## Bidding

LinkedIn Campaign Manager gives you three bid strategies:

| Strategy | Behavior | Use for |
|---|---|---|
| **Maximum Delivery** | Fully automatic — spends the whole budget to maximize results | Fast learning phase, awareness objectives, when you can tolerate CPL swings |
| **Cost Cap** | Automatic bidding bounded by a target cost you set | Lead gen once you know a defensible CPL — keeps Maximum Delivery from over-bidding into low-quality inventory |
| **Manual Bidding** | You set CPC/CPM/CPV by hand | Full control, small test budgets, or when Cost Cap isn't converging |

**Start with Maximum Delivery** for the first 1–2 weeks to gather signal, then move lead-gen campaigns to **Cost Cap** rather than staying on Maximum Delivery once you have a real CPL target — Maximum Delivery has no ceiling and will keep spending into diminishing returns. Fall back to Manual Bidding only if Cost Cap can't hit your target with enough volume to learn.

**Don't leave a lead-gen campaign on Maximum Delivery past that first learning window.** Once there's a CPL number worth defending, staying on Maximum Delivery isn't a neutral choice — it's letting the algorithm keep buying at whatever cost it takes to hit volume. The move to Cost Cap is the stop rule for spend efficiency, not optional polish.

**Manual CPC target**: $8–$15 for most B2B audiences is a reasonable starting range, not a rule — validate it against the account's own recent CPC (see "Reading Real Performance from Bulldozer OS" below) before trusting it on a new vertical.

**LinkedIn Campaign Budget**:
- Daily minimum: $10/day (LinkedIn enforced)
- Recommended minimum: $100/day ($3,000/mo) per campaign for meaningful learning
- Below $3k/mo total: Not enough volume to optimize; wait until budget is larger or use Meta instead
