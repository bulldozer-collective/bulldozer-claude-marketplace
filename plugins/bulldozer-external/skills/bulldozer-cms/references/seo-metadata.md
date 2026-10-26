# Audit and rewrite page SEO metadata

## Audit

1. `bdzListCmsPages(siteId, pageSize=100)` — page through until `content.length` covers `totalElement`.
2. Per page, check: `seoTitle` (missing, duplicate, > 60 chars), `seoDescription` (missing, duplicate,
   outside 120–160 chars), `openGraphTitle` / `openGraphDescription` (missing), `slug` (non-descriptive).
   Skip `draft: true` and `archived: true` pages unless asked. On Webflow, `collectionId != null` marks a CMS
   template page: its SEO fields are templates, edit them only knowingly.
3. Present the findings as a table; propose new values; get approval before writing.

On WordPress, `seo*` / `openGraph*` come from Yoast and are null when Yoast is absent — report "no SEO plugin
data", not "empty meta".

## Rewrite

`bdzUpdateCmsPage(siteId, pageId, …)` — partial: send only the fields that change.

| | Webflow | WordPress |
|---|---|---|
| `title`, `slug` | ✓ (slug ignored on home, templates, utility pages) | ✓ |
| `seoTitle`, `seoDescription`, `openGraph*` | ✓ | 501 — give the user the values to paste into Yoast |
| `openGraphTitleCopied` / `…DescriptionCopied` = true | OG mirrors the SEO value; don't also send the OG value | 501 |
| Goes live | after `bdzPublishCmsSite(siteId)` | immediately |

After a batch on Webflow, publish **once** at the end (1 publish / minute).

## Changing a slug

A slug change breaks the old URL. On Webflow (Enterprise) add a redirect from the old `publishedPath` to the new
one — see [redirects-robots.md](redirects-robots.md). On WordPress, tell the user to add it in their redirect plugin
(WordPress usually redirects old post slugs itself, not page slugs reliably).
