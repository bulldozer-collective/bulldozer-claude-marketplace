---
name: |-
  site-architecture
description: |-
  Plan or restructure website page hierarchy, navigation, URL structure, and internal linking. Triggers on 'site structure,' 'page hierarchy,' 'information architecture,' 'navigation design,' 'URL structure,' 'internal linking strategy,' or 'what pages do I need.' For XML sitemaps and technical SEO, see seo-audit. For structured data, see structured-data-schema.
when-to-use: |-
  Plan or restructure website page hierarchy, navigation, URL structure, and internal linking. Triggers on 'site structure,' 'page hierarchy,' 'information architecture,' 'navigation design,' 'URL structure,' 'internal linking strategy,' or 'what pages do I need.' For XML sitemaps and technical SEO, see seo-audit. For structured data, see structured-data-schema.
argument-hint: |-
  B2B SaaS marketing site — plan full page hierarchy, navigation, and URL structure
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsPages
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsPageContent
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsRedirect
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsRedirects
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainSitemaps
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscDomainInspections
  - mcp__plugin_bulldozer_bulldozer__bdzGetGscInspectionUrls
  - mcp__plugin_bulldozer_bulldozer__bdzPutGscInspectionUrls
  - mcp__plugin_bulldozer_bulldozer__bdzGetSeoDomainKeywords
  - mcp__plugin_bulldozer_bulldozer__bdzListSeoDataSources
effort: |-
  high
---

# Site Architecture

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on website information architecture. Your goal is to plan site structure — page hierarchy, navigation, URL patterns, and internal linking — so the site is intuitive for users and optimized for search.

## Input

`$ARGUMENTS` — site type and scope (e.g., "B2B SaaS marketing site — full page hierarchy and navigation plan" or "restructure the blog section with hub-and-spoke clusters"). If not provided, read any available context files. Only ask if the site type is completely absent.

**Restructuring a site already live on Bulldozer OS**: pull the real pages before redesigning the tree. `bdzListCmsPages` reads the connected Webflow site directly and returns each page's title, meta description, Open Graph fields, slug and published path — a faster and more reliable starting point than reconstructing the current hierarchy from memory or a stale export.

## Output

A `site-architecture-{site}.md` file with: page hierarchy (ASCII tree with URLs), visual sitemap (Mermaid diagram), URL map table, navigation spec (header + footer), and internal linking plan with hub-and-spoke recommendations.

**Produce output on first invocation. Read available context before asking. Only ask if the site type is completely absent.**

---

## Site Type Starting Points

Six recurring site types each have a typical depth and key sections — SaaS marketing,
content/blog, e-commerce, documentation, hybrid SaaS + content, small business. For the full
table, see `references/gabarits-et-tableaux.md` — "Site types (tableau complet)".

---

## Page Hierarchy Design

### Depth Rules

Three approaches — flat, moderate, deep — each with a best fit. Table in
`references/gabarits-et-tableaux.md` — "Profondeur par approche (tableau complet)".

**Rule**: Go as flat as possible while keeping navigation clean. If a dropdown has 20+ items, add a level of hierarchy.

**The trigger to add a level is dilution, not tidiness.** A homepage-to-page click count that keeps climbing is a real cost, not a cosmetic one — Google's own crawl-budget guidance treats it as a genuine constraint on large sites, and a page five or six clicks deep gets crawled and refreshed less often than one two clicks away. That's a real argument for flattening. It is not an argument for restructuring a site that already ranks, purely because the tree "would look cleaner" with an extra folder: every URL that moves needs a 301, and on Bulldozer OS that's either `bdzCreateCmsRedirect` — a Webflow **Enterprise** workspace only, a 403 naming the plan on anything lower — or a manual entry in Webflow's own site settings. Reserve a hierarchy change for a concrete problem: pages nobody can find, a real keyword cannibalization between two pages that should be one, orphaned pages with backlinks pointing at a URL that no longer resolves cleanly. Not for symmetry.

**That constraint scales with the site, not with any one page.** Crawl budget is Google's own term, and Google's own documentation is specific about who needs to think about it: sites north of a million pages that get updated at least weekly, or sites of 10,000+ pages that change daily. Either way, that's the range a real e-commerce catalog or a large documentation set reaches — not a fifty- or hundred-page B2B marketing site, which sits nowhere near either threshold regardless of how the tree is shaped. (Google has also said server and database response speed now weigh at least as much as raw page count — a slow backend can hit a crawl ceiling well below a million pages — but that's a hosting question, not a hierarchy one.) Citing crawl budget to justify flattening a small site borrows an argument that doesn't apply yet — the actual reasons to flatten a small site are findability and a clean nav, which stand on their own without reaching for crawl budget.

### ASCII Tree Format

Every hierarchy output uses an indented ASCII tree with each node's URL in parentheses. For
the full worked example (SaaS site, nested features, blog categories), see
`references/gabarits-et-tableaux.md` — "Arbre ASCII (gabarit)".

---

## Navigation Design

### Header Navigation Rules

- 4–7 items max in the primary nav (more causes decision paralysis)
- CTA button goes rightmost ("Start Free Trial," "Get Started")
- Logo links to homepage (left side)
- Order by priority: most important/visited pages first
- Mega menu: limit to 3–4 columns if used
- Every tappable nav element (hamburger icon, dropdown toggle, mobile menu item) needs a hit area of at least 24×24 CSS px — that's the WCAG 2.2 AA floor (SC 2.5.8), not a suggestion. 44×44 is the tighter Apple HIG / WCAG AAA guidance and worth using when space allows, but don't present it as *the* accessibility minimum — 24×24 is what's actually required

**A mega menu is a hierarchy decision, not a storage bin.** Reaching for one because the primary nav ran out of room, then filling every column with whatever didn't fit, produces the opposite of what it's for: it should make the priority order obvious, not hide it behind a wall of links read like a sitemap. Group columns by how a visitor thinks about the site — by buyer type, by use case — not by how the internal sitemap happens to be organized, and give each column a real heading rather than a bare list. Don't pad the primary nav to hit "4 items" when the site genuinely has three offerings, or split one into two so it doesn't feel sparse — three items read as decisive; a stretched four reads as unsure of itself. And build any mega menu or dropdown to open on tap or click, never hover-only: a hover-triggered submenu simply doesn't exist on a touch device, which is most of the traffic on most sites.

### Footer Organization

Group into columns by function (Product, Resources, Company, Legal). For a worked example
with typical links per column, see `references/gabarits-et-tableaux.md` — "Footer (gabarit)".

### Breadcrumbs

Format: `Home > Features > Analytics`

- Every segment is clickable except the current page
- Mirrors the URL hierarchy exactly
- Implement on all pages except homepage

---

## URL Structure

### Design Principles

1. Readable by humans — `/features/analytics` not `/f/a123`
2. Hyphens, not underscores — `/blog/seo-guide` not `/blog/seo_guide`
3. Reflect the hierarchy — URL path mirrors site structure
4. Consistent trailing slash policy — pick one and enforce everywhere
5. Lowercase always — `/About` redirects to `/about`
6. Short but descriptive — avoid keyword stuffing in slugs

### Subdomain vs. Subdirectory

The recurring fork for a blog, docs, or help center: `/blog` or `blog.{domain}`. Google has long said it treats the two as functionally equivalent for indexing and ranking — this isn't a ranking-penalty question. It's a link-equity and crawl-context question: a subdomain starts as a separate host in Google's eyes and doesn't automatically inherit the root domain's backlink history or internal-link equity the way a subdirectory does. Default to a subdirectory when the content's job is organic growth *for the main site* — a blog, resources, or docs meant to support the core product. A subdomain is a legitimate choice when the content is a genuinely separate product, targets a different audience, or has to live on a stack that can't be routed under the main domain's path.

On Bulldozer OS specifically, this has an operational side: everything `bdzListCmsPages` and `bdzGetCmsPageContent` can read is the connected Webflow site. A subdomain hosted elsewhere (a separate docs platform, a different app) sits outside that visibility, and outside `bdzCreateCmsRedirect` / `bdzListCmsRedirects` too — one more reason to prefer a subdirectory unless the separate stack is genuinely unavoidable.

### URL Patterns by Page Type

Nine recurring page types each have a standard pattern — feature, blog post, blog category,
case study, documentation, comparison, integration, template, legal. For the full table with
examples, see `references/gabarits-et-tableaux.md` — "URL par type de page (tableau complet)".

### Common URL Mistakes

- Dates in blog URLs (`/blog/2024/01/post`) — remove dates, use `/blog/slug`
- IDs in URLs (`/product/12345`) — use slugs
- Query parameters for content (`/blog?id=123`) — use path-based URLs
- Changing URLs without 301 redirects — every old URL needs a redirect or you lose backlink equity. On Bulldozer OS the tool is `bdzCreateCmsRedirect` (and `bdzListCmsRedirects` to audit what's already set) — both require a Webflow **Enterprise** workspace; on any lower plan the call fails with a 403 naming the plan limit, and redirects have to be added by hand in Webflow's own site settings instead

---

## Visual Sitemap (Mermaid)

A `graph TD` diagram with one node per page, nested under its parent, using `subgraph` to
denote navigation zones (Header Nav vs. Footer Nav). For the full gabarit, see
`references/gabarits-et-tableaux.md` — "Sitemap visuel (gabarit Mermaid)".

**Mermaid is the working diagram, not the client deliverable.** It's fast to iterate and good enough to check the tree's logic with an engineer, but it renders every node at the same visual weight — exactly what a stakeholder review needs *not* to do, since the point of showing a sitemap is making clear what matters most. When this needs to go in front of a client or an exec, translate it into an actual visual hierarchy — size, weight, or color signaling priority, homepage and top pages heavier than a footer utility page — rather than handing over the Mermaid output as-is.

---

## Internal Linking Strategy

### Link Types

Four types to cover: navigational (header/footer/sidebar), contextual (in-text, related
content), hub-and-spoke (cluster to pillar), cross-section (feature page to related case
study). For the full table with examples, see `references/gabarits-et-tableaux.md` —
"Types de lien (tableau complet)".

### Internal Linking Rules

1. No orphan pages — every page has at least one inbound internal link
2. Descriptive anchor text — "our analytics features" not "click here"
3. 2–5 internal links per 1,000 words as a rough benchmark, more for long or pillar content — the number matters less than relevance: a link added to hit a quota is worse than no link
4. Link to important pages more often — homepage, key features, pricing
5. Breadcrumbs as free internal links on every page

**Checking this once it's live**: no Bulldozer OS tool lists the internal links pointing *into* a page, so catching an orphan page still means walking the site by hand, or reading a suspected linking page's real content with `bdzGetCmsPageContent`. After publishing a restructure, `bdzGetGscDomainSitemaps` confirms Search Console picked up the new sitemap and `bdzGetGscDomainInspections` shows per-URL indexing status — both run on a daily scheduler, not instantly, and the inspected-URL list defaults to the site's most-clicked pages if nothing is explicitly tracked. That fallback only surfaces pages that already have clicks — a URL born from this restructure has none yet, so it will never appear there on its own. Push new or moved URLs explicitly with `bdzPutGscInspectionUrls` (dedupes, 50 by default) right after publishing, then read `bdzGetGscDomainInspections` on the *next* daily run, not the same day — `bdzGetGscInspectionUrls` shows what's currently tracked if you need to check first.

### Hub-and-Spoke Model

A hub page (comprehensive overview) with spokes that each link back to it and to sibling
spokes where relevant. For the full worked example, see `references/gabarits-et-tableaux.md`
— "Modèle hub-and-spoke (gabarit)".

**Build a spoke because the intent is genuinely distinct, not because the template has a slot for it.** Two pages can legitimately target the same keyword at different stages of the buyer's journey — an explainer ("what is X") and a pricing or comparison page ("X pricing") — without cannibalizing each other; merging them serves neither reader. A spoke created just to round out a cluster, with no real content of its own, is the opposite failure. On a live site, `bdzGetSeoDomainKeywords` (with the market set correctly via `bdzListSeoDataSources` — it only returns rows for markets already configured on the domain) shows keyword+URL pairs: two spokes actually ranking for the same query is the signal to merge, a shared topic alone is not.

The same discipline applies to any page family this hierarchy proposes at scale — `/vs/{competitor}`, `/integrations/{name}`, one page per city or use case. Google's scaled-content-abuse policy doesn't target templates or AI drafting as such; it targets pages that add nothing for a reader beyond the swapped variable, and enforcement of that policy tightened through 2026. A handful of `/vs/` pages with real, specific differentiation beats generating the full set from a spreadsheet of names — and if the plan genuinely calls for dozens, publish in batches and confirm indexation on one batch before generating the next, rather than shipping the whole set at once.

---

## URL Map Table (required in output)

Every deliverable includes a table with one row per page: Page, URL, Parent, Nav Location,
Priority. For a filled-in example, see `references/gabarits-et-tableaux.md` — "URL map (exemple de tableau)".

---

## Common Mistakes

- **Restructuring a ranking site for tidiness alone** — every moved URL needs a 301; without a concrete problem to solve (orphaned pages, real cannibalization, users stuck), the redirect and ranking risk isn't worth the cleaner-looking tree
- **Generating comparison, integration, or city pages from a list without differentiated content** — the exact pattern Google's scaled-content-abuse enforcement targets; a smaller set with real depth beats the full spreadsheet published at once
- **Merging two pages because they share a keyword** — check search intent first; an explainer and a pricing page can legitimately target the same term at different funnel stages
- **Defaulting to a subdomain for the blog or docs "to keep things separate"** — it doesn't inherit the root domain's link equity the way a subdirectory does; reserve it for a genuinely separate product or stack
- **Turning the mega menu into a junk drawer** — it should group by how a visitor thinks about the site, with real headings, not catch everything that didn't fit the primary nav
- **Padding the primary nav to hit an item count** — three genuine offerings read better as three items than as four with one split for symmetry
- **Building a mega menu or dropdown that only opens on hover** — it doesn't exist on a touch device, which is most of the traffic on most sites
- **Handing over the Mermaid sitemap as the client deliverable** — it's the working diagram to check the tree's logic, not a hierarchy visual; translate priority into weight or size before it goes in front of a stakeholder