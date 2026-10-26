# Redirects and robots.txt (Webflow Enterprise only)

A non-Enterprise Webflow site answers 403; WordPress answers 501 (point the user to a redirect plugin such as
Redirection, or to Yoast's robots.txt editor).

## Redirects

- List: `bdzListCmsRedirects(siteId)`.
- Add: `bdzCreateCmsRedirect(siteId, fromUrl="/old-path", toUrl="/new-path")` — paths, not full URLs. Check first
  that `fromUrl` is not already redirected and that you do not create a chain (A→B while B→C exists: point A to C).
- Edit: no update — `bdzDeleteCmsRedirect` then `bdzCreateCmsRedirect`.

After a slug change: `fromUrl` = old `publishedPath`, `toUrl` = new one.

## robots.txt

1. `bdzGetCmsRobotsTxt(siteId)` — always first.
2. Change it:
   - `bdzReplaceCmsRobotsTxt(siteId, rules, sitemap?)` is a **full replacement**: send the current rules merged with
     the change; a user agent left out loses its block.
   - `bdzDeleteCmsRobotsTxtRules(siteId, rules)` removes only the given allows/disallows.
   Each rule: `{"userAgent": "*", "allows": [...], "disallows": [...]}`.
3. Show the user the before/after: a stray `Disallow: /` de-indexes the whole site.
