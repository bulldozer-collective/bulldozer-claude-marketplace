# Webflow Implementation (Bulldozer OS Clients)

**Webflow (Bulldozer OS clients)**: no Bulldozer OS tool writes or reads custom code —
`bdzUpdateCmsPage` only edits title, slug, SEO title/description and Open Graph fields.
Every implementation step below is a manual gesture in the Webflow Designer, and nothing
in the OS can verify the result — validation has to go through the checklist further down.

- **Sitewide schema (Organization, WebSite)**: paste once into the site-wide head/body
  custom code embed (Site settings). One block, every page inherits it.
- **Single static pages**: Page settings > Custom Code, for a one-off page that isn't
  part of a CMS Collection.
- **CMS Collection pages (blog posts, products — the common case)**: don't hand-paste a
  block per page. Webflow's Designer lets a Code Embed element placed *inside* the
  Collection page template bind directly to that item's real CMS field values — write the
  JSON-LD once in the template, and every published item gets its own correct `headline`,
  `datePublished`, `image`, etc. automatically. Three things a senior gets bitten by if
  skipped: never bind a Rich Text field straight into the JSON — the embedded HTML tags
  break JSON syntax, use a Plain Text/Number/Image field instead; check that any text
  field feeding the block doesn't carry raw quotes that break the string; and remember
  that a Webflow slug or link field outputs a **relative** path (`/about`) by default —
  every schema property that expects a URL (`url`, `mainEntityOfPage`, `image`, breadcrumb
  `item`) needs an absolute one, so prepend the domain by hand (`https://example.com/` +
  `{{ slug }}`) rather than binding the raw field — one of the most common reasons bound
  JSON-LD fails validation on a Collection page. This is reasonably well-documented in
  current Webflow help content and confirmed independently on Webflow's own community
  forum, though not verified by us beyond search results — check the exact binding UI in
  the client's Designer before promising it in a scope of work.
