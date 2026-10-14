# Building It In Bulldozer OS (Webflow)

Programmatic pages built on Bulldozer OS live as items in one Webflow CMS collection — one
item per combination, the template's variable slots mapped to the collection's fields.
Before generating a single page:

- **Check what already exists.** `bdzListCmsSites` for the `siteId`, then
  `bdzListCmsCollections` — if a collection for this page type already exists, read its
  field schema with `bdzGetCmsCollection` (field slugs and types) and reuse it rather than
  creating a duplicate.
- **Creating a new collection is a one-way door.** `bdzCreateCmsCollection` has no matching
  delete endpoint in Webflow's API — undoing it means going into the Webflow designer by
  hand. Design the field schema (one field per template variable slot, plus any reference
  fields for cross-links) once, carefully, before the first `bdzCreateCmsCollectionField`
  or `bdzCreateCmsItem` call, not iteratively.
- **Items land staged, not live.** `bdzCreateCmsItem` defaults `isDraft` to `true` — nothing
  is public until published. Check `bdzListCmsItems` (filter by `slug`) before creating, to
  avoid a 409 on a combination that already exists.
- **One item per call, no bulk import tool.** `bdzCreateCmsItem` takes a single item — a batch
  of a few hundred programmatic pages is that many individual calls, not a CSV-style import.
  Webflow's own API does document a bulk endpoint for this (up to 100 items per call), but no
  current Bulldozer OS tool wraps it — budget for the one-by-one loop rather than expecting a
  bulk create.
- **Publishing is two steps.** `bdzPublishCmsItems` takes up to 100 item ids per call and
  reports partial success — read `publication.errors`, a success status does not mean every
  item went live. `bdzPublishCmsSite` then pushes the site itself, and Webflow allows only
  one successful publish per minute — batch a launch, don't fire it item by item.
- **Structured data per item, if the Quality Checklist schema markup is going in the CMS
  template.** Webflow natively supports binding real CMS fields into a custom-code Embed
  block placed inside the Collection Page template — write the JSON-LD once in the template,
  each published item gets its own correct title/date/image automatically. No Bulldozer OS
  tool sets this (it's a Webflow Designer step outside the API), and it never binds a Rich
  Text field directly into the JSON — the nested HTML breaks JSON syntax. Use Plain
  Text/Number/Image fields for anything going into structured data, and check quote
  escaping.
