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

Connecting is also a diagnosis: if the site refuses, the tool answers **400 with a message that names the fix**.
Relay that message to the user as is — do not guess another cause. The cases it covers:

| Message says | Fix on the user's side |
|---|---|
| no REST API answers at `…/wp-json/` | wrong URL, or a plugin / the host disabled the REST API |
| application passwords are not available / disabled | re-enable them in the security plugin (Wordfence, Solid Security…) or ask the host; WordPress must also detect HTTPS |
| WordPress received no credential … `.htaccess` | the host strips the `Authorization` header: add the quoted `SetEnvIf` line to `.htaccess` (or ask the host) |
| rejected the application password | they pasted the login password, or a password of another user |
| no user with this username | wrong username |
| lacks `edit_pages`, … | connect with an Editor or Administrator account |

Other 400s are about the URL itself: `http://`, a port other than 443, a query string, a private address.
Run `bdzSearchCmsSites` with the same fields to re-test after the user's fix without connecting.

## Reconnect (409 on a connected site)

Run the connect tool again with a fresh credential for the **same** site: the connection is updated in place, its
`siteId` and Webflow lead-list attachments are kept. Never disconnect first.

## Check / list

- `bdzListCmsSites` — cheap, from Bulldozer's database; live fields (domains, preview url, last publish) are empty.
- `bdzGetCmsSite(siteId)` — live read; the right way to test that a credential still works.

## Disconnect

`bdzDisconnectCmsSite(siteId)` — deletes the stored credential and, on Webflow, the form webhook and every
lead-list attachment of that site. Confirm with the user first.
