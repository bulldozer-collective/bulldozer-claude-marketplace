---
name: |-
  bulldozer-cms
description: |-
  Drive a customer's website CMS (Webflow or WordPress) through the Bulldozer CMS MCP tools: connect a site, read and rewrite page SEO metadata, create and publish collection items (blog posts…), manage media, route form submissions into a lead list, manage redirects and robots.txt, read site analytics.
when-to-use: |-
  Use whenever the user wants to act on their website's CMS: "connect my Webflow / WordPress site", "rewrite the meta descriptions of my pages", "publish a blog post", "add an article to the CMS", "upload this image to the site", "fix the alt texts", "send the contact form leads to a lead list", "add a 301 redirect", "edit robots.txt", "which pages get the most traffic on the site". Webflow, WordPress, CMS, site, blog, pages and articles all point here.
user-invocable: false
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzConnectCmsSite
  - mcp__plugin_bulldozer_bulldozer__bdzSearchCmsSites
  - mcp__plugin_bulldozer_bulldozer__bdzDisconnectCmsSite
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsSites
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsSite
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsPages
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsPage
  - mcp__plugin_bulldozer_bulldozer__bdzUpdateCmsPage
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsPageContent
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsCollections
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsCollection
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsCollection
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsCollectionField
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsItems
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsItem
  - mcp__plugin_bulldozer_bulldozer__bdzUpdateCmsItem
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteCmsItem
  - mcp__plugin_bulldozer_bulldozer__bdzPublishCmsItems
  - mcp__plugin_bulldozer_bulldozer__bdzPublishCmsSite
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsForms
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsForm
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsFormSubmissions
  - mcp__plugin_bulldozer_bulldozer__bdzPreviewCmsFormFieldMapping
  - mcp__plugin_bulldozer_bulldozer__bdzAttachLeadListToCmsForm
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsLeadListAttachments
  - mcp__plugin_bulldozer_bulldozer__bdzDetachLeadListFromCmsForm
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTrafficReport
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTopPagesReport
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTopDimensionsReport
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTopEventsReport
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsTimeOnPageReport
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsAssets
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsAsset
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsAssetFromFridge
  - mcp__plugin_bulldozer_bulldozer__bdzUpdateCmsAsset
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteCmsAsset
  - mcp__plugin_bulldozer_bulldozer__bdzListCmsRedirects
  - mcp__plugin_bulldozer_bulldozer__bdzCreateCmsRedirect
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteCmsRedirect
  - mcp__plugin_bulldozer_bulldozer__bdzGetCmsRobotsTxt
  - mcp__plugin_bulldozer_bulldozer__bdzReplaceCmsRobotsTxt
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteCmsRobotsTxtRules
  - mcp__plugin_bulldozer_bulldozer__bdzListLeadLists
  - mcp__plugin_bulldozer_bulldozer__bdzRequestFridgeCode
  - Read
effort: |-
  medium
paths:
  - "**/bulldozer.json"
metadata:
  "forge": "disabled"
---

# Bulldozer CMS

## Rules

- Every tool needs `customerId` and `projectId` (from `bulldozer.json` / `bulldozer-project-chooser`).
- Every tool except connect / search / list takes a `siteId`: the **Bulldozer** UUID of the connection, from
  `bdzListCmsSites` — never the Webflow site id nor the WordPress URL. A project may have several sites: when more
  than one is listed and the user did not name it, ask which one.
- The provider is fixed at connection time and read from the site afterwards. Check `provider` on the site
  (`CMS_PROVIDER_WEBFLOW` / `CMS_PROVIDER_WORDPRESS`) before planning a workflow — capabilities differ.
- Never write before reading: fetch the current state (page, item, robots.txt), show the user the before/after for
  bulk or destructive changes, then write.
- Never ask the user to paste a credential into a file. A token / application password is passed once to
  `bdzConnectCmsSite` and is never returned by any tool.

## Publishing model — the main difference between providers

| | Webflow | WordPress |
|---|---|---|
| Item created | staged draft (`isDraft` defaults to true) | draft |
| Item goes live | `bdzPublishCmsItems` — live immediately | `bdzPublishCmsItems` — live immediately |
| Page metadata edit | live at the next `bdzPublishCmsSite` | live immediately |
| `bdzPublishCmsSite` | pushes page/design changes live (1 success / minute) | 501 — there is no site-level publish; nothing to do |

## Capabilities

| Capability | Webflow | WordPress |
|---|---|---|
| Sites (connect, search, list, get, disconnect) | ✓ | ✓ (application password) |
| Pages: list, get, update title/slug | ✓ | ✓ |
| Pages: update SEO / Open Graph | ✓ | ✗ 501 — readable only (Yoast) |
| Page content nodes | ✓ read-only | ✗ 501 |
| Collections: list, get schema | ✓ | ✓ (post types: `post`, `page`, custom) |
| Collections: create, add field | ✓ irreversible | ✗ 501 |
| Items: list, create, update, delete, publish | ✓ | ✓ |
| Assets | ✓ | ✓ (no folders, delete is permanent) |
| Forms, submissions, lead-list attachments | ✓ | ✗ 501 |
| Redirects, robots.txt | ✓ Enterprise plan only (else 403) | ✗ 501 |
| Analytics reports | ✓ Analyze add-on | ✗ 501 |

A 501 means the provider has no equivalent: say so plainly and, if relevant, tell the user where to do it
(WordPress admin, Yoast, a redirect plugin). Do not retry.

## Errors

| Status | Meaning | Action |
|---|---|---|
| 400 | invalid input; the message names the field | fix and retry |
| 403 | Webflow plan lacks the feature (Enterprise, Analyze) | tell the user; no retry |
| 404 | unknown `siteId` / page / item / collection | re-list |
| 409 | credential revoked or too weak (scope, WordPress role) — or a duplicate slug / attachment | reconnect via [connect-site](references/connect-site.md), or change the slug |
| 429 | rate limit (Webflow: 60–120 req/min, 1 site publish/min) | wait `Retry-After`, then retry once |
| 501 | not supported by this provider | stop |
| 502 | the CMS is down or unreachable | retry later |

## Workflows

Read the matching reference before running a workflow:

- [connect-site.md](references/connect-site.md) — connect, reconnect, disconnect a Webflow or WordPress site
- [seo-metadata.md](references/seo-metadata.md) — audit and rewrite page titles, slugs, meta descriptions
- [content-items.md](references/content-items.md) — create, update and publish blog posts / collection items
- [assets.md](references/assets.md) — upload images, audit and fix alt texts
- [forms-to-leads.md](references/forms-to-leads.md) — route a Webflow form's submissions into a lead list
- [redirects-robots.md](references/redirects-robots.md) — 301 redirects after a slug change, robots.txt edits
- [analytics.md](references/analytics.md) — traffic, top pages, sources, events (Webflow Analyze)
