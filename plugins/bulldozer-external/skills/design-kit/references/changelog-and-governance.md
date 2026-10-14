# Changelog and Maintenance Protocol — Detail

### Versioning

Use semantic versioning, adapted to a design library rather than to code:

- **MAJOR** — a breaking change: a component or token renamed or removed, a prop's accepted values changed in a way that breaks existing instances
- **MINOR** — additive: a new component or token, or a new variant added to an existing component, without touching what already works
- **PATCH** — a visual fix that doesn't change the API: an adjusted spacing value, a corrected hover state, a fixed typo in a label

### Changelog format

Keep it on the library file's cover page (Step 3) and, if the team is large enough to need history beyond what Figma's version panel shows, in a linked doc:

```
## v1.4.0 — [date]
### Added
- Toast / Notification component (Tier 3)
- color/feedback/info token

### Changed
- Button / Primary: adjusted default padding to match the updated spacing scale

### Deprecated
- Badge / Legacy — replaced by Badge / Status. Removal planned for the next MAJOR.

### Removed
- (none this release)
```

### Deprecation protocol

**Never delete a component outright — deprecate it first.**

1. Mark it deprecated in Figma (name prefix, or a status token if the team uses one) and name its replacement in the same changelog entry.
2. Search product files for existing usage before removing anything — a component with active instances is not ready to be removed, whatever the changelog says.
3. Agree on a deprecation window the team can actually observe before the next MAJOR — long enough that every product file gets migrated, not just the ones someone remembered to check.
4. Remove only in a MAJOR release, once usage is confirmed at zero.

### Governance — who can change what

- **Tokens (Tier 1/2 colors, spacing scale, typography):** design system owner only, reviewed before publish. Every component depends on these — an unreviewed token change is the highest-leverage way to break the whole library at once.
- **New component:** any designer can propose one, but it's built and published by the design system owner or a designated contributor, following the Tier order from Step 2.
- **New variant on an existing component:** any team designer can contribute one if it follows the naming convention from Step 4 — reviewed before it merges into the library, not published directly.
- **Emergency fix** (a visual bug already live in production): can skip the review queue, but must be logged in the changelog the same day, not retroactively.

### Update cadence

Batch non-urgent changes into a scheduled publish — weekly or biweekly for most teams — rather than publishing on every edit. Every publish pushes an update notification into every product file that uses the library; a team that publishes too often trains its designers to dismiss the notification without reading it, which defeats the reason the library sends one at all.

**Batching additive changes into one publish is fine; batching a breaking one with them is not.** Isolate a MAJOR change — a renamed token, a removed prop value — into its own release, even if it means publishing twice in the same week. A changelog entry that reads "Added Toast component, renamed color/border/default" makes a consuming file's owner diff out the unrelated addition just to find the one line that will actually break their file.

**A clean publish cadence is not proof of adoption.** A library can hit every scheduled publish with a spotless changelog while product files quietly dismiss the update notification every time — that's not discipline paying off, that's a system being tolerated, not used. Track which product files are actually on the current version, not just how reliably the library ships; a wave of dismissed notifications after a past breaking change is a signal to go find out why, not a reason to publish more quietly.
