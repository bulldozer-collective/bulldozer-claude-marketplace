# Indexation Strategy

- Submit dedicated sitemap for programmatic pages (`/sitemap-integrations.xml`). Webflow
  generates this from the published CMS collection; check it was picked up and error-free
  with `bdzGetGscDomainSitemaps` rather than assuming a silent success.
- Noindex combinations with very thin data (e.g., an integration that barely exists). On
  Webflow, this is a manual per-item setting in the item's SEO panel — no Bulldozer OS tool
  sets it, and blocking a path in `robots.txt` (`bdzReplaceCmsRobotsTxt`, itself gated behind
  a Webflow Enterprise workspace) only stops crawling, it does not deindex a page Google
  already indexed. Decide the noindex list before launch; it is not something the OS
  automates away.
- Monitor crawl budget — limit the number of low-value pages Google crawls. Google's own
  guidance reserves this concern for sites over 1 million pages (updated at least weekly) or
  over 10,000 pages that change daily — most Bulldozer client sites start well under that
  line, so don't sell crawl budget as a launch-blocking risk for a first batch of a few
  hundred pages. It's worth tracking specifically *because* a programmatic rollout is the
  one thing that can push a small site toward that threshold over successive batches — and
  Google has since said a slow database/server matters as much as raw page count, so a
  heavier template (slow queries, large embeds) tightens the budget faster than page count
  alone would suggest.
- Prioritize high-volume combinations in internal link frequency
