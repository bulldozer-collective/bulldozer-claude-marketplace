# Handoff Specification — Detail

**Measure contrast against the actual pairing, not the page's darkest background.** A spec that states "meets AA" without saying against which surface is a claim that can be true on one screen and false on another — the same accent token often serves a dark hero section and a light settings panel in the same file. Compute the ratio for the specific foreground/background pairing the component actually renders against wherever it appears, and record more than one value if the component shows up on more than one background. A number without its pairing isn't a verified spec, it's an assumption dressed as one — I don't sign off on a component's accessibility line until I've checked it against the background it's actually placed on, not the one that happened to be open in the file.

**Handoff format (add to component description in Figma or link to external doc):**
```
Component: Button
Usage: Use for primary actions. One primary button per view — use secondary or ghost for additional actions.
Do NOT use: As a navigation element (use Link instead); more than 1 primary button per modal
Props: variant (primary|secondary|ghost|danger), size (sm|base|lg), disabled (bool), loading (bool), icon (left|right|none)
Tokens: color/interactive/primary, font/size/sm, spacing/3, radius/base
Accessibility: role=button, aria-disabled when disabled, aria-busy when loading, keyboard: Enter/Space to activate
```
