# Create, update, publish collection items (blog posts…)

## 1. Find the collection and its schema

1. `bdzListCmsCollections(siteId)` — pick the collection (Webflow: "Blog Posts"…; WordPress: `post` for articles,
   `page`, or a custom post type). `id` is the `collectionId`.
2. `bdzGetCmsCollection(siteId, collectionId)` — **mandatory before writing**: `fields[].slug` are the keys of
   `fieldData`, `type` tells the value format, `metadata.options` lists allowed values.

## 2. Create (always a draft)

`bdzCreateCmsItem(siteId, collectionId, fieldData)`.

- **Webflow**: `fieldData` keyed by field slug, must contain `name` and `slug` (409 if the slug exists).
  `RichText` takes HTML. `Image` takes `{"url": "…", "alt": "…"}` — upload first ([assets.md](assets.md)) and
  use the asset's `hostedUrl`. `Option` takes the option **id**, `Reference` the referenced item **id**.
  `isDraft` defaults to true — keep it.
- **WordPress**: `name` (→ title) and `content` (HTML or block markup), plus `excerpt`, `slug`, `categories` /
  `tags` (arrays of term **ids**), `featured_media` (media **id** from [assets.md](assets.md)), `meta`, ACF
  fields. `status` is ignored: the item is always created as a draft.

## 3. Review

Give the user the item `id` and its content; on WordPress the draft is visible in wp-admin.

## 4. Publish

`bdzPublishCmsItems(siteId, collectionId, itemIds)` — ≤ 100 ids. Live immediately on both providers.
**Always read `errors`**: a success status does not mean every item went live. No `bdzPublishCmsSite` needed.

## Update

1. `bdzListCmsItems(siteId, collectionId, slug=…)` (or `name=…`) to find the item and its current `fieldData`.
2. `bdzUpdateCmsItem(siteId, collectionId, itemId, fieldData)`:
   - **Webflow**: send the **complete** merged `fieldData` (name and slug included) — omitted fields are lost.
     A published item edited this way must be published again.
   - **WordPress**: partial is fine; send only changed keys. A published post stays published (edit is live);
     `isDraft: true` unpublishes it. `isArchived: true` → 400.

## Delete

`bdzDeleteCmsItem` — Webflow: deletes the staged item. WordPress: moves it to the trash (restorable in wp-admin).
Confirm with the user first.

## Multilingual sites

**Webflow** — an item has the **same id in every language**; each tool targets one language through `cmsLocaleId`.

1. `bdzGetCmsSite(siteId)` → `locales[]`: take the `cmsLocaleId` of the wanted language (match `tag` / `displayName`).
   Not `localeId` — that one is for pages and assets.
2. Pass the **same** `cmsLocaleId` to `bdzListCmsItems`, then `bdzUpdateCmsItem` (merge the `fieldData` read in that
   language), then `bdzPublishCmsItems`.
3. Omitting `cmsLocaleId` always means the **primary** language: an update without it overwrites the primary
   version, not the one you read. `bdzDeleteCmsItem` with a locale removes that language only.

**WordPress** — no locales (`locales` is empty). With Polylang / WPML each translation is a separate item with its
own id: find it with `bdzListCmsItems` and address it by that id. Sending `cmsLocaleId` is a 400.

## Webflow only: new collection / field

`bdzCreateCmsCollection` / `bdzCreateCmsCollectionField` — **irreversible** (no delete via API). Confirm the
schema with the user before creating. On WordPress (501), a post type or field is added by a plugin (CPT UI, ACF).
