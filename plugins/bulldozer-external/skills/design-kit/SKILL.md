---
name: design-kit
description: Produce a structured design kit — token system (color, typography, spacing, elevation), component inventory, design file architecture, naming conventions, changelog protocol, and handoff specification. Triggers on 'design kit,' 'design system,' 'component library,' 'Figma setup,' 'brand design tokens,' 'we need a design system,' 'inconsistent UI,' or 'how do we organize Figma.' For brand identity and positioning, see brand-platform. For website design requirements, see website-brief.
when-to-use: Produce a structured design kit — token system (color, typography, spacing, elevation), component inventory, design file architecture, naming conventions, changelog protocol, and handoff specification. Triggers on 'design kit,' 'design system,' 'component library,' 'Figma setup,' 'brand design tokens,' 'we need a design system,' 'inconsistent UI,' or 'how do we organize Figma.' For brand identity and positioning, see brand-platform. For website design requirements, see website-brief.
argument-hint: Series A SaaS product, 2 designers + 5 engineers. Figma is used but chaotic — 4 different button styles, no shared colors, designers duplicate components manually. Need a proper design kit before onboarding 2 more engineers.
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

**Two-tier color system:**

**Tier 1: Primitive colors (raw values)**
Named by value, not use. These are the color palette's raw material.

```
color/gray/50: #F9FAFB
color/gray/100: #F3F4F6
color/gray/200: #E5E7EB
...
color/gray/900: #111827

color/blue/50: #EFF6FF
...
color/blue/600: #2563EB (primary brand blue)
...
color/blue/900: #1E3A8A
```

**Tier 2: Semantic tokens (use-based)**
Named by what they do, not what they look like. These are what components reference.

```
color/text/primary: → gray/900
color/text/secondary: → gray/500
color/text/disabled: → gray/300
color/text/inverse: → white

color/background/default: → white
color/background/subtle: → gray/50
color/background/overlay: → gray/900 at 60% opacity

color/interactive/primary: → blue/600
color/interactive/primary-hover: → blue/700
color/interactive/primary-disabled: → blue/300

color/feedback/success: → green/600
color/feedback/warning: → amber/500
color/feedback/error: → red/600
color/feedback/info: → blue/600

color/border/default: → gray/200
color/border/strong: → gray/400
color/border/focus: → blue/600
```

**Rule: Components always reference semantic tokens, never primitive tokens.** If a component references `blue/600` directly instead of `color/interactive/primary`, the component won't update when the brand refreshes the primary color. Reference semantic; define semantic as primitive.

### Typography Tokens

```
font/family/sans: [your typeface] — stack: "[Font]", system-ui, sans-serif
font/family/mono: [your mono] — stack: "[MonoFont]", Courier, monospace

font/size/xs: 12px
font/size/sm: 14px
font/size/base: 16px
font/size/lg: 18px
font/size/xl: 20px
font/size/2xl: 24px
font/size/3xl: 30px
font/size/4xl: 36px
font/size/5xl: 48px

font/weight/regular: 400
font/weight/medium: 500
font/weight/semibold: 600
font/weight/bold: 700

line-height/tight: 1.2 (for headings)
line-height/normal: 1.5 (for body text)
line-height/relaxed: 1.75 (for long-form content)
```

**Pre-defined text styles (combinations of size + weight + line-height):**
```
text-style/heading/h1: 5xl / bold / tight
text-style/heading/h2: 4xl / bold / tight
text-style/heading/h3: 3xl / semibold / tight
text-style/heading/h4: 2xl / semibold / normal
text-style/body/large: lg / regular / relaxed
text-style/body/base: base / regular / relaxed
text-style/body/small: sm / regular / normal
text-style/label/base: sm / medium / normal
text-style/caption: xs / regular / normal
```

### Spacing and Layout Tokens

```
spacing/1: 4px
spacing/2: 8px
spacing/3: 12px
spacing/4: 16px
spacing/5: 20px
spacing/6: 24px
spacing/8: 32px
spacing/10: 40px
spacing/12: 48px
spacing/16: 64px
spacing/20: 80px
spacing/24: 96px
```

**Grid tokens:**
```
layout/column-count: 12
layout/gutter: spacing/6 (24px on desktop)
layout/margin/sm: spacing/4 (16px on mobile)
layout/margin/md: spacing/8 (32px on tablet)
layout/margin/lg: spacing/12 (48px on desktop)
layout/max-width/content: 1280px
```

### Border Radius and Elevation

```
radius/none: 0px
radius/sm: 4px
radius/base: 6px
radius/md: 8px
radius/lg: 12px
radius/xl: 16px
radius/full: 9999px (pills)

elevation/0: no shadow
elevation/1: 0 1px 2px rgba(0,0,0,0.05)
elevation/2: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
elevation/3: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
elevation/4: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
elevation/5: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
```

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

---

## Step 3: Figma Library Architecture

**File structure:**

```
📁 Design System (Library file)
  ├── 📄 _Cover (cover page with version + changelog summary)
  ├── 📄 Tokens (color primitives, semantic tokens, typography, spacing, elevation, radius)
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

---

## Step 4: Naming Conventions

**Consistent naming is the most impactful day-1 decision.** Figma uses slash-separated names to create hierarchy in the asset panel — use this consistently.

**Pattern: `[Category] / [Component] / [Variant] / [State]`**

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

**Rules:**
- Title Case for every segment
- No abbreviations unless they're universal (e.g., "CTA" is OK, "btn" is not)
- Variant names match code prop names: `Primary` in Figma = `variant="primary"` in code
- State names match CSS/code states: `Hover`, `Active`, `Disabled`, `Focus`

---

## Step 5: Handoff Specification

**A component in Figma is only useful if engineers can implement it correctly.** Handoff requires the component + its specification.

**Required specification per component:**
1. **Usage documentation:** When to use this component, when NOT to use it, common mistakes
2. **Prop table:** Every configurable prop with its type, default value, and accepted values
3. **Token references:** Which tokens this component uses (maps to CSS variables / design tokens in code)
4. **Accessibility requirements:** ARIA roles, keyboard navigation, focus behavior, color contrast compliance (WCAG 2.1 AA minimum)
5. **Do/Don't examples:** Side-by-side correct and incorrect usage

**Handoff format (add to component description in Figma or link to external doc):**
```
Component: Button
Usage: Use for primary actions. One primary button per view — use secondary or ghost for additional actions.
Do NOT use: As a navigation element (use Link instead); more than 1 primary button per modal
Props: variant (primary|secondary|ghost|danger), size (sm|base|lg), disabled (bool), loading (bool), icon (left|right|none)
Tokens: color/interactive/primary, font/size/sm, spacing/3, radius/base
Accessibility: role=button, aria-disabled when disabled, aria-busy when loading, keyboard: Enter/Space to activate
```

---

## Step 6: Changelog and Maintenance Protocol

**A design system without 