# AI Crawlers, Machine-Readable Files and Schema Notes

## Step 3: AI bot access check — per-crawler detail

- `GPTBot` (trains OpenAI's models), `OAI-SearchBot` (crawls and indexes pages so ChatGPT's search feature can surface and cite them — of the three, the one that most directly controls whether ChatGPT can cite you), `ChatGPT-User` (live fetch when a user asks ChatGPT to open one specific URL) — OpenAI's three bots, each controlled independently in robots.txt. Blocking GPTBot alone (the one people remember) while leaving OAI-SearchBot unmanaged is a common miss.
- `PerplexityBot` (crawls and indexes for Perplexity's own index) and `Perplexity-User` (live fetch triggered by a user's query — reported, not officially confirmed, to generally ignore `robots.txt` since the user explicitly requested that page) — Perplexity's two current bots.
- `ClaudeBot` (model training), `Claude-User` (real-time user queries — Anthropic's own docs confirm this one respects `robots.txt`, unlike the equivalent live-fetch bots above from OpenAI and Perplexity), `Claude-SearchBot` (search result quality) — Anthropic's three current crawlers. The older `anthropic-ai` and `Claude-Web` user agents are deprecated and no longer in use; ClaudeBot now also honors any robots.txt rule still written against those old names, so an existing block doesn't silently stop working, but write new rules against the three current names above, not `anthropic-ai`.
- `Bingbot` — Microsoft Copilot

**`Google-Extended` is not in this list on purpose.** It controls whether Google can use the site's content to train Gemini/Vertex AI — several specialized sources converge on it having no effect on eligibility for Google AI Overviews, which still runs on standard Googlebot crawling and indexing. Blocking `Google-Extended` alone does not remove a site from AI Overviews; only blocking Googlebot itself would (and that also removes it from regular Search). We haven't found an official Google page confirming this directly — treat it as well-supported, not proven — but don't tell a client that unblocking `Google-Extended` is what gets them into AI Overviews.

For a Webflow-hosted site, `bdzGetCmsRobotsTxt` reads the actual configured rules (which agents are allowed/disallowed) instead of guessing from a template — but the read AND write tools both require a Webflow ENTERPRISE workspace; on any other plan, robots.txt has to be checked and edited directly in Webflow.

Block only training-only crawlers (e.g., `CCBot`) if you want to prevent model training without blocking citations.

## Machine-Readable Files for AI Agents — pricing.md template and llms.txt

**Add `/pricing.md` to your site root**:

```markdown
# Pricing — [Product Name]

## Free
- Price: $0/month
- Limits: 100 requests/month, 1 user
- Features: Basic features, API access

## Pro
- Price: $49/month (billed annually) | $59/month (billed monthly)
- Limits: 10,000 requests/month, 5 users
- Features: Custom integrations, analytics-tracking, priority support

## Enterprise
- Price: Custom — contact sales@example.com
- Features: SSO, SLA, dedicated account manager
```

**Don't sell `/llms.txt` as a visibility lever.** The major AI crawlers (GPTBot, ClaudeBot, PerplexityBot and the rest) read the HTML directly and, by measurement, almost never request `/llms.txt` — one tracker following 500M+ AI-bot visits over 90 days counted 408 hits on the file; an independent count gives 84 requests out of 62,100 (0.1%). Google has said publicly it doesn't support it and has no plans to. It's fine to add as a zero-cost convention (a short product overview + links, see llmstxt.org) if a client insists, but it never earns a line in an action plan ranked by impact — what actually moves citations is server-rendered HTML, page structure, and structured data.

Neither Bulldozer OS's CMS tools nor its hosting tools can publish a file to the root of the client's own domain: `bdzCreateHosting` publishes to a `bulldozer-os.fr` subdomain (a different domain), and there's no CMS tool for an arbitrary root-level static file on the client's Webflow site. Adding `/pricing.md` or `/llms.txt` at the client's actual domain root stays a manual step for whoever manages that hosting/DNS.

These files, when added, are trivially parseable by any LLM. Same principle as `robots.txt` for crawlers. Opaque pricing gets filtered out of AI-mediated buying journeys — that part of the argument holds regardless of the file format used to fix it.

## Schema Markup for AI — FAQPage note and impact caveat

**`FAQPage` note**: Google removed FAQ rich results from Search entirely on 2026-05-07 (not just restricted, as it had been since 2023 — gone for every site). Keep `FAQPage` markup for what it still does — giving AI systems a structured Q&A block to extract — but don't pitch it to a client as a way to win a Google rich snippet; that payoff no longer exists.

We don't have a verified figure for how much schema markup moves AI visibility specifically — treat "properly marked-up content is easier for AI systems to parse and extract" as the defensible claim, not a percentage. A 2026 cross-platform study (collected ChatGPT and Gemini citations across commercial queries, published as an unreviewed SSRN preprint — not peer-reviewed, treat as a data point rather than a settled finding) is consistent with that caution: it found JSON-LD schema does not by itself predict whether a page gets cited, ahead of clear entity signals and content quality. Don't pitch schema to a client as a citation lever on its own — pitch it as what makes an already-strong page easier to extract. Use the schema skill for implementation.
