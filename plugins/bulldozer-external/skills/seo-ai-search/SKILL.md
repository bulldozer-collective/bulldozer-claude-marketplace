---
name: |-
  seo-ai-search
description: |-
  Optimize content to get cited in AI-generated answers from ChatGPT, Perplexity, Google AI Overviews, Gemini, and Claude. Triggers on 'AI SEO,' 'answer engine optimization,' 'optimize for ChatGPT,' 'get cited by AI,' 'AI Overviews visibility,' or 'LLM citations.' For traditional SEO audits, see seo-audit. For structured data markup, see structured-data-schema.
when-to-use: |-
  Optimize content to get cited in AI-generated answers from ChatGPT, Perplexity, Google AI Overviews, Gemini, and Claude. Triggers on 'AI SEO,' 'answer engine optimization,' 'optimize for ChatGPT,' 'get cited by AI,' 'AI Overviews visibility,' or 'LLM citations.' For traditional SEO audits, see seo-audit. For structured data markup, see structured-data-schema.
argument-hint: |-
  saas-analytics-tool.com — want to appear in 'best analytics for startups' AI answers
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# AI SEO

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on AI search optimization — making content discoverable, extractable, and citable by AI systems including Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, and Copilot.

## Input

`$ARGUMENTS` — domain, URL, or target queries (e.g., "saas-tool.com" or "queries: best CRM for startups, CRM alternative"). If not provided, read any available context files before asking.

**Before asking the client for anything, check what Bulldozer OS already has for this project**: `bdzListAvailableGscDomains` / `bdzGetSeoGscDomains` for a connected Search Console property, `bdzGetSeoDomains` for a tracked SEO domain (third-party keyword tracking), and `bdzListCmsSites` for the connected Webflow site. A project with GSC or a tracked domain already gives you real queries and real rankings to prioritize — don't ask the client to name 10-20 queries from memory when the data exists. Only ask if none of this is connected and no domain/query set was given.

## Output

An `ai-seo-audit-{domain}.md` file with: AI visibility audit results, content extractability score per priority page, action plan ranked by citation impact (structure fixes, authority additions, bot access, machine-readable files), and monitoring setup instructions.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## How AI Search Works

| Platform | How It Works | Source Selection |
|----------|-------------|-----------------|
| Google AI Overviews | Summarizes top-ranking pages | Strong correlation with traditional rankings |
| ChatGPT (with search) | Searches web, cites sources | Draws from wider range, not just top-ranked |
| Perplexity | Always cites sources with links | Favors authoritative, recent, well-structured content |
| Gemini | Google's AI assistant | Pulls from Google index + Knowledge Graph |
| Copilot | Bing-powered AI search | Bing index + authoritative sources |

**Key difference from traditional SEO**: In AI search, a well-structured page can get cited even if it ranks on page 2 or 3. AI systems select based on content quality, structure, and relevance — not just rank position.

Before quoting any AI-search statistic in a deliverable, read `references/evidence-and-research.md` (section critical stats): AI Overviews coverage, the click-through impact, third-party citation share, the GEO research figures and the keyword-stuffing finding. Treat all of them as directional, not audited benchmarks.

---

## AI Visibility Audit

### Step 1: Test key queries across platforms

No platform gives API access to AI Overviews/ChatGPT/Perplexity citation checks through Bulldozer OS — this step stays manual. But don't pick the 10-20 queries from a brief: pull them from real data first, since Google AI Overviews correlates strongly with traditional rankings (see table above).

- If the project has a GSC property connected, `bdzGetGscDomainAnalytics` (dimension=QUERY) gives real query volume and current position — take the highest-impression queries close to page 1, not a guess.
- If the project has a tracked SEO domain, `bdzGetSeoDomainKeywords` gives the same view from third-party rank tracking, useful when GSC isn't connected — but it's a monthly snapshot, not live data. Check `metadata.month`/`year` on the rows returned before treating a position as current; it can lag the actual date by months.
- Then check ChatGPT, Perplexity, and Google AI Overviews manually for those queries:

| Query | Google AI Overview | ChatGPT | Perplexity | You cited? | Who cited? |
|-------|:-----------------:|:-------:|:----------:|:----------:|:----------:|

**Query types to test**:
- "What is [your product category]?"
- "Best [category] for [use case]"
- "[Your brand] vs [competitor]"
- "How to [problem your product solves]"

### Step 2: Content extractability check

For each priority page:

| Check | Pass/Fail |
|-------|-----------|
| Clear definition in first paragraph? | |
| Self-contained answer blocks (work without surrounding context)? | |
| Statistics with attributed sources? | |
| Comparison tables for evaluation queries? | |
| FAQ section with natural-language questions? | |
| Schema markup (FAQ, HowTo, Article, Product)? | |
| Expert attribution (author name, credentials)? | |
| Updated within 6 months? | |
| AI bots allowed in robots.txt? | |

### Step 3: AI bot access check

Verify `robots.txt` allows these crawlers (blocking = no citations):
For the crawler list (GPTBot, OAI-SearchBot, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Bingbot) and what each one does — plus why `Google-Extended` is deliberately absent, how to read the real rules on a Webflow site with `bdzGetCmsRobotsTxt`, and which training-only crawlers can be blocked, read `references/crawlers-and-machine-files.md` (section Step 3).

---

## The Three Pillars of AI SEO

### Pillar 1: Structure — Make Content Extractable

AI systems extract passages, not pages. Every key claim should work as a standalone statement.

**Content block patterns**:
- **Definition blocks** — for "What is X?" queries (lead with the answer in 1 sentence)
- **Step-by-step blocks** — for "How to X" queries (numbered, each step self-contained)
- **Comparison tables** — for "X vs Y" queries (structured data beats prose)
- **FAQ blocks** — for common questions (match how people phrase queries)
- **Statistic blocks** — with cited sources and dates

**Structural rules**:
- Lead every section with the direct answer — don't bury it in paragraph 3
- Keep key answer passages to 40–60 words (optimal for snippet extraction)
- Use H2/H3 headings that match query phrasing
- Each paragraph: one clear idea

For the warning about blocks that pass every check and still say nothing, read `references/evidence-and-research.md` (section Pillar 1).

### Pillar 2: Authority — Make Content Citable

For the Generative Engine Optimization (GEO) research findings behind this pillar and the granular ranking of tactics, read `references/evidence-and-research.md` (section Pillar 2).

**Freshness signals**:
- "Last updated: [date]" prominently displayed
- Quarterly minimum refresh for competitive topics
- Remove or update outdated statistics

### Pillar 3: Presence — Be Where AI Looks

AI systems don't just cite your website — they cite where you appear.

**Third-party sources that drive citations**:
- Wikipedia and Reddit are consistently the two largest single sources of ChatGPT citations — a multi-source Q1 2026 synthesis (5WPR, aggregating Similarweb/Semrush/Profound/Peec AI/Ahrefs data) puts them both above 10% of US ChatGPT citations each, together over a quarter of all citations. Exact shares move by study and quarter — keep your own brand's Wikipedia page accurate and current, and don't quote a specific percentage as fixed.
- Industry publications and guest posts
- Review sites (G2, Capterra, TrustRadius for B2B SaaS)
- YouTube (frequently cited by Google AI Overviews)
- Quora answers with depth

---

## Machine-Readable Files for AI Agents

AI agents are increasingly evaluating tools on behalf of users. If your pricing is behind a "contact sales" wall or requires JavaScript rendering, agents skip you.

For the `/pricing.md` template, why not to sell `/llms.txt` as a visibility lever, and how to publish root-level files (Bulldozer OS CMS and hosting tools cannot write to the site root), read `references/crawlers-and-machine-files.md` (section Machine-Readable Files).

---

## Schema Markup for AI

| Content type | Schema | Why it helps |
|-------------|--------|-------------|
| Articles/Blog | `Article`, `BlogPosting` | Author, date, topic identification |
| How-to content | `HowTo` | Step extraction |
| FAQs | `FAQPage` | Direct Q&A extraction |
| Products | `Product` | Pricing, features, reviews |
| Comparisons | `ItemList` | Structured comparison data |

For the `FAQPage` rich-result removal note and the caveat on schema's measured impact on AI visibility, read `references/crawlers-and-machine-files.md` (section Schema Markup).

---

## Content Types That Get Cited Most

Exact citation shares by content type vary a lot between the trackers that publish them (methodology and sample differ), so treat this as a ranking, not a set of fixed percentages:

| Content type | Why AI cites it |
|-------------|----------------|
| Comparison articles | Structured, balanced, matches high-intent evaluation queries — the type that shows up first across most trackers |
| Original research/data | Unique, citable statistics nothing else has |
| Definitive guides | Comprehensive, authoritative, easy to extract a self-contained passage from |
| Best-of/listicles | Clear structure, entity-rich |
| Product pages | Specific extractable details (pricing, specs) when not gated |
| How-to guides | Step-by-step structure maps directly to "how to" queries |

**Underperformers**: Generic blog posts without structure, thin product pages, gated content, content without dates or attribution.

---

## Monitoring AI Visibility

| Tool | Coverage | Best for |
|------|----------|----------|
| Otterly AI | ChatGPT, Perplexity, Google AI Overviews | Share of AI voice tracking |
| Peec AI | ChatGPT, Gemini, Perplexity, Claude, Copilot+ | Multi-platform at scale |
| Rankscale | Google AI Overviews, ChatGPT, Perplexity | Brand mention + sentiment |
| Profound / AthenaHQ | ChatGPT, Perplexity, AI Overviews, Gemini | Enterprise-tier, priced well above the tools above — worth it once AI-referred traffic is material, not for a first check |

Before recommending any tool in this table, read `references/monitoring-ai-visibility.md`: the vendor-bias caveat, Search Console's own AI report (check it first), the second free session-level signal, the threshold for moving a client to paid monitoring, and the DIY monthly check.

---

## What a Senior Operator Refuses to Recommend

**A dedicated AI-search program before the foundations are solid.** Google AI Overviews correlates strongly with traditional rankings (see the table at the top) — a page that doesn't already rank won't get cited more just because it now has FAQ blocks and schema. Running this audit as a client's *first* SEO engagement mostly re-surfaces the same gaps a normal technical/content audit would find, dressed in AI-SEO language. Sequence it alongside or after core SEO work, never as a substitute for it — this is the same point as the first line of Common Mistakes below, stated as a refusal rather than a warning.

**A specific uplift number in a client-facing business case.** The "up to ~40%" GEO figure (Pillar 2) comes from a synthetic benchmark scoring LLM-generated answers against each other, not a controlled measurement of citation rates on a real domain. Cite it to justify *doing* the work — sources and stats beat keyword stuffing, direction confirmed — never to forecast what a specific client should expect. No published study connects a specific on-page tactic to a specific citation-rate change in production; promising one manufactures a number nobody can defend later.

**Citation count as the only KPI in a report.** Getting mentioned in an AI answer without a link, or with a link nobody clicks, isn't proof of commercial value by itself — and unlike a SERP click, most citation-tracking tools can't tell you whether the mention drove a session. Tie the work to something measurable — AI-referral sessions in GA4 (see Monitoring above) — or, failing that, report share-of-voice as a leading indicator and say plainly that it isn't a session or a lead yet.

**Extractability tactics applied at scale without editorial judgment.** Definition blocks, FAQ blocks and comparison tables (Pillar 1) are a structure, not a license to mass-produce templated pages to "cover more queries." The same patterns that make a page easy for an LLM to extract are the ones Google's scaled-content-abuse enforcement targets when there's no real value behind them — thin topical coverage, templated phrasing, no genuine expertise signal (see the programmatic-seo skill's doctrine on the March 2026 spam update, which made this an explicit enforcement priority). One well-built page beats fifty thin ones shaped the same way.

**Spreading effort evenly across every platform.** ChatGPT, Perplexity, Gemini, Copilot and Google AI Overviews don't reach the same buyers. Which one or two actually matter for a given client is a judgment call to make explicit in the plan, not a reason to default to testing all five evenly — a B2B audience researching a vendor shortlist and a local/consumer audience typing a quick question aren't looking in the same place.

---

## Common Mistakes

- **Treating AI SEO as separate from SEO** — good traditional SEO is the foundation; AI SEO adds structure and authority on top
- **Blocking AI bots** — if GPTBot or PerplexityBot are blocked, those platforms can't cite you
- **Assuming `Google-Extended` gates AI Overviews** — it doesn't; it only controls Gemini/Vertex AI training. Don't spend a client's attention "fixing" it expecting an AI Overviews win
- **Hiding pricing behind "contact sales"** — AI agents can't parse what they can't read
- **No freshness signals** — undated content loses to dated content because AI weights recency heavily
- **Keyword stuffing** — reduces AI visibility rather than helping it, the opposite of what it used to do in classic SEO
- **Gating all content** — AI can't access gated content; keep authoritative content open
- **No structured data** — schema gives AI systems structured context about your content
- **Treating `/llms.txt` as a visibility lever** — the major AI crawlers barely request it; time spent there is better spent on server-rendered HTML and structure