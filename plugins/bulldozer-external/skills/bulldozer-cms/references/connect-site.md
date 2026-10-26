# Connect, reconnect, disconnect a site

## Webflow

1. Ask the user for a **site token**: Webflow → *Site settings → Apps & integrations → API access → Generate API
   token*. Scopes: `sites`, `pages`, `cms`, `forms`, `assets` read+write, `site_config` read+write (robots.txt).
   A missing scope later answers 409 naming it.
2. `bdzSearchCmsSites(provider=CMS_PROVIDER_WEBFLOW, token)` — lists the sites the token reaches.
3. `bdzConnectCmsSite(provider=CMS_PROVIDER_WEBFLOW, token, externalSiteId?)` — `externalSiteId` (the `externalId`
   from step 2) only when the token reaches several sites; otherwise 400.
4. Keep `site.id` from the response: it is the `siteId` of every other tool.

## WordPress

1. Ask for the site URL (https), the WordPress **username**, and an **application password**: WordPress admin →
   *Users → Profile → Application Passwords* (WordPress 5.6+). The user must be **Editor** or **Administrator** —
   an Author cannot edit pages (409 later).
2. `bdzConnectCmsSite(provider=CMS_PROVIDER_WORDPRESS, token=<application password>, siteUrl, username)`.
   `bdzSearchCmsSites` with the same fields only checks the credential without connecting.
3. Keep `site.id`. `externalId` is the normalised `host[/path]`.

Common 400s: `http://` URL, a port other than 443, a URL with a query, a host resolving to a private address.
A 409 right away on a valid password usually means the host strips the `Authorization` header (some cheap shared
hostings, security plugins): the user must fix it on their side.

## Reconnect (409 on a connected site)

Run the connect tool again with a fresh credential for the **same** site: the connection is updated in place, its
`siteId` and Webflow lead-list attachments are kept. Never disconnect first.

## Check / list

- `bdzListCmsSites` — cheap, from Bulldozer's database; live fields (domains, preview url, last publish) are empty.
- `bdzGetCmsSite(siteId)` — live read; the right way to test that a credential still works.

## Disconnect

`bdzDisconnectCmsSite(siteId)` — deletes the stored credential and, on Webflow, the form webhook and every
lead-list attachment of that site. Confirm with the user first.
