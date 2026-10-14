# Token System — Full Reference

## Contents

- Two-tier color system
- Tier 1: Primitive colors (raw values)
- Tier 2: Semantic tokens (use-based)
- Pre-defined text styles (combinations of size + weight + line-height)
- Grid tokens

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

Figma Styles (the older mechanism — color styles, text styles, effect styles) are static: one value, no concept of "this token means something different depending on context." Figma Variables are the current native mechanism for exactly the two-tier system above, and they add what Styles can't: **modes**. A single semantic collection can carry a Light and a Dark mode, so `color/background/default` resolves to `white` in Light and to `gray/900` in Dark without a second set of tokens to maintain — components bound to the variable adapt automatically when the mode switches.

The architecture teams converge on in 2026 is 3–4 variable collections, not one flat list:
- **Primitives** — no modes. The raw palette, spacing scale, and type sizes from this step.
- **Color (semantic)** — Light/Dark modes, each semantic token aliased to a different primitive per mode.
- **Brand** (if the system serves more than one brand or a white-label product) — overrides a small subset of semantic color tokens per brand identity, layered on top of the semantic collection rather than duplicating it.
- **Density/Spacing** (optional) — default/compact/comfortable modes, useful when the same component library serves both a marketing site and a dense internal tool.

The binding rule doesn't change: components reference semantic variables, never primitives, exactly as above — modes are a property of the semantic layer, not a reason to bind deeper.

**Interoperability with code:** Figma now supports exporting a variable collection to a DTCG-aligned JSON (right-click the collection → Export to JSON) for a Style Dictionary–style pipeline into CSS custom properties. As of 2026 this native export doesn't yet cover composite tokens (typography, gradients, shadows) — those still go through a third-party plugin if the team needs them in the same pipeline. Worth checking the current state before committing a build step to it; this corner of Figma has moved fast.

**Sequencing: don't build every collection because the architecture above lists 3–4 of them.** That shape is a target, not a checklist to clear before Phase 2 starts. A single-brand product with no dark-mode requirement on its roadmap needs exactly one collection beyond Primitives — semantic Color, Light mode only. Adding a Dark mode "in case," or a Brand collection for a client who has never mentioned a second identity or a white-label plan, creates a governance surface someone has to maintain (contrast checked in a mode nobody uses, an override layer nobody remembers exists at the next rebrand) for a product that doesn't need it yet. Add Dark mode the day a real screen has to render in it; add a Brand collection the day a second identity actually exists — not ahead of that.

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
