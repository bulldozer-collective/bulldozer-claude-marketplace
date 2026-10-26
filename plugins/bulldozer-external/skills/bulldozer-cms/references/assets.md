# Media library: upload, audit alt texts

## Upload a file

MCP cannot carry bytes: the file goes through the Bulldozer fridge.

1. Put the file in the fridge (skill `bulldozer-fridge`: `bdzRequestFridgeCode`, then the fridge upload). Only the
   user who uploaded it can use it; it expires after 2 hours; ≤ 25 MB.
2. `bdzCreateCmsAssetFromFridge(siteId, fridgeId, fileName?)` — set a descriptive, hyphenated `fileName`
   (`team-paris-office.jpg`): it ends up in the public URL. `parentFolderId` is Webflow only (400 on WordPress).
3. Keep `asset.id` (WordPress `featured_media`) and `asset.hostedUrl` (Webflow `Image` field, HTML `<img>`).

## Audit and fix alt texts

1. `bdzListCmsAssets(siteId, pageSize=100)` — page through `totalElement`.
2. Images (`contentType` starting with `image/`) with `altText == null` are missing an alt text.
3. Propose alts (describe the image, ≤ 125 chars, no "image of"); after approval,
   `bdzUpdateCmsAsset(siteId, assetId, altText)`. `displayName` renames the asset's title, not the file.

## Delete

`bdzDeleteCmsAsset` — check first that no item or page still uses it. On WordPress the delete is **permanent**.
