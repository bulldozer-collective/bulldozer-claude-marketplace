---
name: |-
  design-kit
description: |-
  Produce a structured design kit — token system (color, typography, spacing, elevation), component inventory, design file architecture, naming conventions, changelog protocol, and handoff specification. Triggers on 'design kit,' 'design system,' 'component library,' 'Figma setup,' 'brand design tokens,' 'we need a design system,' 'inconsistent UI,' or 'how do we organize Figma.' For brand identity and positioning, see brand-platform. For website design requirements, see website-brief.
when-to-use: |-
  Produce a structured design kit — token system (color, typography, spacing, elevation), component inventory, design file architecture, naming conventions, changelog protocol, and handoff specification. Triggers on 'design kit,' 'design system,' 'component library,' 'Figma setup,' 'brand design tokens,' 'we need a design system,' 'inconsistent UI,' or 'how do we organize Figma.' For brand identity and positioning, see brand-platform. For website design requirements, see website-brief.
argument-hint: |-
  Series A SaaS product, 2 designers + 5 engineers. Figma is used but chaotic — 4 different button styles, no shared colors, designers duplicate components manually. Need a proper design kit before onboarding 2 more engineers.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Design Kit

> This is a Bulldozer skill. A design kit is not an aesthetic exercise — it's an engineering efficiency investment. Every component built without a shared library is rebuilt from scratch by each designer and each engineer who touches it. A button defined once and published as a component is defined once forever. A button defined informally in 4 files is defined 4 times and diverges on the 5th.

You are a Bulldozer design operator building a structured design kit. Your job is to establish the token foundation, define the component architecture, configure the Figma library structure, set naming conventions, and design the handoff and maintenance protocol.

## Input

`$ARGUMENTS` — product type (SaaS / mobile app / marketing site / all), team size (designers + engineers), current Figma state (no system / informal components / partial system), brand assets available (color palette, typography, logo). If not provided, read available context files. Ask once if the product type is completely absent.

## Output

A `design-kit-{company}.md` file with: token system definition (color, typography, spacing, elevation, radius), component inventory with priority tiers, Figma library architecture, naming conventions, handoff specification format, changelog protocol, and a build sequence.

**Produce on first invocation. Start with tokens — components built without tokens are rebuilt when the brand changes. Tokens first, components second, patterns third.**

---

## Step 1: Token System

**Design tokens are the foundation of the system.** They give every design decision a name that both designers and engineers use — a shared language that prevents the drift between "what design intended" and "what engineering built."

### Color Tokens

For the two-tier color system with the full primitive and semantic token lists, read `references/token-reference.md`.

**Rule: Components always reference semantic tokens, never primitive tokens.** If a component references `blue/600` directly instead of `color/interactive/primary`, the component won't update when the brand refreshes the primary color. Reference semantic; define semantic as primitive.

### Implementing tokens in Figma: Variables, not just Styles

For the Figma Variables vs. Styles guidance (collection architecture, code interoperability, sequencing), read `references/token-reference.md`.

### Typography Tokens

For the typography token scale and pre-defined text styles, read `references/token-reference.md`.

### Spacing and Layout Tokens

For the spacing scale and grid tokens, read `references/token-reference.md`.

### Border Radius and Elevation

For the radius and elevation scales, read `references/token-reference.md`.

---

## Step 2: Component Inventory

**Build in priority order.** Don't try to build the full system in week 1. The most-used components produce the most leverage. Start there.

### Tier 1 — Foundation (build first, everything else depends on these)
- Button (primary, secondary, tertiary, danger, ghost, icon-only; sizes: sm, base, lg; states: default, hover, active, disabled, loading)
- Input (text, email, password, number, textarea; states: default, focus, error, disabled; labels + helper text)
- Checkbox, Radio, Toggle
- Badge / Tag (status indicators)
- Avatar (single and group)
- Icon system (icon library integrated and sized consistently)

### Tier 2 — Layout (needed for screens and layouts)
- Card (surface for content grouping)
- Divider (horizontal and vertical)
- Modal / Dialog (with header, body, footer, close button)
- Drawer / Sidebar
- Navigation (top nav, sidebar nav)
- Tabs

### Tier 3 — Feedback (user communication)
- Alert / Banner (success, warning, error, info)
- Toast / Notification (dismissible)
- Loading spinner / skeleton screens
- Empty state (illustration + CTA pattern)
- Tooltip

### Tier 4 — Data Display (product-specific)
- Table (with sorting, selection, pagination)
- Dropdown / Select
- Date picker
- Progress bars and indicators
- Charts (if applicable — often left to charting library)

**Build the states a real screen needs, not every state the list above allows for.** The state list attached to each component (default, hover, active, disabled, loading) is the full menu of what a component *can* need — not a checklist to clear before it ships. A small ghost button that never disables doesn't need a designed disabled state on day one; add it the first time a real screen calls for it, and log the addition as MINOR (Step 6), not as a gap in v1.0.0. Designing all five states for every variant of every Tier 1 component before anything ships is exactly the kind of work that stalls a design system project in month one instead of getting something usable in front of the team in week one.

---

## Step 3: Figma Library Architecture

For the library file structure, publishing and the foundation/product/marketing library split, read `references/figma-library-and-naming.md`.

---

## Step 4: Naming Conventions

**Consistent naming is the most impactful day-1 decision.** Figma uses slash-separated names to create hierarchy in the asset panel — use this consistently.

**Pattern: `[Category] / [Component] / [Variant] / [State]`**

**Rules:**
- Title Case for every segment
- No abbreviations unless they're universal (e.g., "CTA" is OK, "btn" is not)
- Variant names match code prop names: `Primary` in Figma = `variant="primary"` in code
- State names match CSS/code states: `Hover`, `Active`, `Disabled`, `Focus`

For naming examples, what the pattern actually names (one component set, not one layer per state) and the Slot property type, read `references/figma-library-and-naming.md`.

---

## Step 5: Handoff Specification

**A component in Figma is only useful if engineers can implement it correctly.** Handoff requires the component + its specification.

**Required specification per component:**
1. **Usage documentation:** When to use this component, when NOT to use it, common mistakes
2. **Prop table:** Every configurable prop with its type, default value, and accepted values
3. **Token references:** Which tokens this component uses (maps to CSS variables / design tokens in code)
4. **Accessibility requirements:** ARIA roles, keyboard navigation, focus behavior, color contrast (WCAG 2.2 AA — the most complete published reference today; it's additive over 2.1 AA, not a replacement, so anything already meeting 2.1 AA still needs the criteria 2.2 added, including target size). For any interactive component (button, checkbox, radio, toggle), also record its minimum hit area: WCAG 2.2's SC 2.5.8 sets **24×24 CSS px** as the AA floor (with a spacing exception), not 44×44 — that larger figure is Apple's own HIG guidance or the optional AAA tier, useful as a stretch target but not the compliance minimum. State both in the spec so nobody downsizes a "sm" button below the real floor while chasing a stricter number that was never required. For any component that can stay visible on top of other content (Modal/Dialog, Drawer/Sidebar, Toast/Notification — Tiers 2–3, Step 2), record which side of WCAG 2.2's SC 2.4.11 Focus Not Obscured (Minimum) it lands on: a Modal built to trap keyboard focus inside itself already satisfies it by construction, but a Drawer or Toast that stays open without trapping focus does not — if it can sit over a focusable element in the page behind it while that element still has focus, that's a real failure, not an edge case to write up later.
5. **Do/Don't examples:** Side-by-side correct and incorrect usage

For contrast measurement against the real pairing and the per-component handoff format with a Button example, read `references/handoff-format.md`.

---

## Step 6: Changelog and Maintenance Protocol

**A design system without a changelog decays quietly.** Components get edited in place, nobody can say which product files are still on the old version, and "did this button always look like this?" turns into a recurring Slack thread instead of a two-line answer.

For versioning rules, the changelog format, the deprecation protocol, governance (who can change what) and update cadence, read `references/changelog-and-governance.md`.

---

## Step 7: Build Sequence

**Bring the six steps together in an order that produces something usable at every stage, not only at the end.** A design system that's only adoptable once fully built never gets adopted — the team has already built its own workarounds by then.

**Phase 1 — Foundation**
- Tokens (Step 1): color, typography, spacing, radius, elevation. Nothing else can be built correctly without these existing first.
- Figma file structure (Step 3): create the Design System file with its full page structure, even with empty pages — the structure is the commitment, not a detail to add later.
- Naming convention (Step 4) agreed and written down before the first component exists. Renaming twenty components after the fact costs far more than a naming discussion up front.

**Phase 2 — Tier 1 components**
- Button, Input, Checkbox, Radio, Toggle, Badge, Avatar, Icon system, built with full state coverage (Step 2) and published as the library's first version — v1.0.0 under the Step 6 protocol.
- Handoff spec (Step 5) written per component as it's built, not retrofitted once the library has grown too large to document from memory.

**Phase 3 — Tier 2 and Tier 3**
- Layout components (Card, Modal, Navigation, Tabs), then feedback components (Alert, Toast, Tooltip).
- Rebuild one real product screen using only library components. This is the actual test of the system so far: if the screen needs even one one-off custom element, a Tier 1 or Tier 2 gap was missed, not a Tier 4 one.

**Ongoing**
- Tier 4 (data display) components get built when the product needs them, not speculatively. A date picker built before any feature calls for one is usually rebuilt anyway once the real requirement shows up.
- Changelog and governance (Step 6) apply from v1.0.0 onward — retrofitting a versioning discipline onto a library that's already sprawling is a much larger job than starting with it.

**Starting from an existing informal system:** don't start from a blank file. Inventory what's already there — every button variant currently used across product files — and use that inventory to decide which existing pattern becomes the canonical Tier 1 component. Migrating four existing button styles into one canonical component, with a deprecation path (Step 6), is faster than designing a fifth version nobody asked for. If a Figma connector is available in this environment, use it to read the existing file's structure and components before inventorying by eye — but check what that connector account can actually do first: read access (listing libraries, pulling a node's structure) works regardless of the connected account's Figma seat, while creating or editing the library file itself requires an editor seat on that account, not just a working connector. Don't assume the write path is open; confirm it.

**Don't hold v1.0.0 for a perfect reconciliation of every historical variant.** When the existing system has several divergent versions of the same component, pick the one closest to where the product is actually heading, ship it as the canonical Tier 1 component, and route the others through the Step 6 deprecation protocol as usage turns up in the inventory. Chasing one merged version that satisfies every legacy variant before publishing anything delays the one thing that actually proves the system: rebuilding a real screen with it.

---

## Common Mistakes

For the list of common mistakes to check a kit against before delivery, read `references/common-mistakes.md`.

---

## Rules

- **Tokens before components, always.** A component built against a hardcoded color value has to be found and fixed by hand when the brand changes; one built against a semantic token updates on its own.
- **Reference semantic tokens inside a component, never primitives.** This single rule decides whether a rebrand takes an afternoon or two weeks of hunting through files.
- **Build in Tier order, not in the order a screen happens to need components.** A request for a date picker in week one doesn't make Tier 1 optional — Tier 4 without Tier 1 underneath it collapses on the second component built.
- **Never delete a component — deprecate it.** Removing one without a deprecation window breaks whatever product file was still referencing it, silently and without warning.
- **The library only proves itself on a real screen.** A token and component system that hasn't rebuilt one actual product screen end-to-end is a specification, not a working system yet.
- **Publish in batches, not on every edit.** Every publish interrupts every designer's file with an update notification — spend that interruption deliberately, not by habit.