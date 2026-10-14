# Common Mistakes

- **Building every Figma Variables collection because the architecture note lists 3–4 of them.** A Brand collection with no second brand, or a Dark mode nobody asked for, is governance overhead invented before there's a product that needs it.
- **Designing every state for every variant before anything ships.** Most of a tier's state matrix is a menu, not a v1.0.0 requirement — build what a real screen actually exercises first, add the rest as MINOR when it's needed.
- **Publishing one layer per state instead of one component set with properties.** If a library's assets panel reads like a sitemap — `Button / Primary / Large / Hover` as its own top-level entry, repeated for every combination — the naming convention is being used to do the job component properties exist for.
- **Forcing a Card, Modal, or Drawer's free-form content through Instance Swap or a Variant explosion instead of a Slot property.** Detaching an instance to hand-edit its content every time it's placed is the tell that the component needed a Slot, not a longer candidate list.
- **Stating "meets AA" without saying against which background.** The same accent token can pass on one card and fail on another two components down — record the pairing, not just the ratio.
- **Shipping a Drawer or Toast that can sit over a focused element without trapping focus.** WCAG 2.2's Focus Not Obscured only forgives this for a true modal — a persistent, non-modal overlay still has to leave keyboard focus visible.
- **Treating a clean publish cadence as proof of adoption.** A library that ships on schedule while product files quietly dismiss every update notification is not adopted — it's tolerated, and worth asking why.
- **Bundling a breaking token rename with unrelated additive work in the same release.** It buries the one line a consuming file's owner actually needs to see before accepting the update.
- **Chasing a perfect merge of every historical variant before shipping v1.0.0.** Pick the version closest to where the product is heading, ship it, deprecate the rest as usage turns up — reconciliation isn't the thing that proves the system works.
