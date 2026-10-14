# Figma Library Architecture and Naming — Detail

## Figma library file structure and publishing

**File structure:**

```
📁 Design System (Library file)
  ├── 📄 _Cover (cover page with version + changelog summary)
  ├── 📄 Tokens (visual reference: swatches and specimens for every primitive and semantic
  │      token, laid out for a human to scan — the tokens themselves are defined once as
  │      Figma Variables, not drawn shapes; this page documents them, it doesn't hold them)
  ├── 📄 Icons (all icons as components, organized by category)
  ├── 📄 Tier 1 Components (Foundation)
  ├── 📄 Tier 2 Components (Layout)
  ├── 📄 Tier 3 Components (Feedback)
  ├── 📄 Tier 4 Components (Data Display)
  └── 📄 Patterns (composite patterns: forms, empty states, onboarding flows)

📁 Product Files (consume the library)
  ├── 📄 [Feature Area 1]
  ├── 📄 [Feature Area 2]
  └── 📄 ...
```

**Library publishing:** Publish the Design System file as a shared library. All product files enable this library. When a component updates in the library, product files receive an update notification and choose to accept.

**Separate libraries for scale:** When the design system grows beyond 200 components, split into:
- Foundation library (tokens, base components)
- Product library (product-specific patterns that compose foundation components)
- Marketing library (landing page components, separate from product UI)

## Naming examples

Examples:
- `Button / Primary / Large / Default`
- `Button / Primary / Large / Hover`
- `Button / Primary / Large / Disabled`
- `Input / Text / Default / Default`
- `Input / Text / Default / Error`
- `Badge / Status / Success`
- `Badge / Status / Warning`
- `Icon / Navigation / Home`
- `Icon / Actions / Plus`

## What the naming pattern names, and the Slot property

**What this pattern actually names — one component set, not one layer per combination.** `Button / Primary / Large / Hover` documents the component's identity and its property *values*; it is not an instruction to publish four separate top-level entries in the assets panel for one button, let alone forty for its full state matrix. The current mechanism (component properties: Variant, Boolean, Instance Swap, Text) puts Type, Size, and State on the *same* component set — a designer picks Primary/Large/Hover from three property fields on one Button entry, they don't hunt through a flat list of pre-named layers. I refuse a handoff where a client's assets panel reads like a sitemap dump — one row per state combination — because that's the naming convention being used to do the job component properties exist for. If a component's asset-panel entry doesn't fit on one line, the properties are set up wrong; the naming above is still correct, it's just documenting the values, not licensing a layer per value.

**A fifth property type for content that isn't a fixed list: Slot.** Confirmed general availability — Figma's plugin API changelog (2026-06-10) moved Slot out of open beta, with a dedicated SlotNode type and `createSlot`/`resetSlot` methods now part of the stable API. (A handful of older help-center pages still describe it as beta; treat the dated changelog as the current word, not those.) A Slot property opens a free content area inside a component — filled or rearranged directly on the instance, without detaching it. That's the tool for the body of a Card, a Modal, or a Drawer (Tier 2, Step 2): those need to hold whatever a screen puts in them, which Instance Swap can't do (it only swaps between a fixed list of pre-built candidates) and which forcing through Variant turns into a combinatorial mess. Reach for Instance Swap when the content really is a short, known list — an icon, a status glyph; reach for Slot when it isn't. Detaching a Card's content frame to hand-edit it every time is the tell that a Slot property belongs there instead.
