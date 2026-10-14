# Prompt Examples

Four worked prompts built on the structure named in `PROPOSITION.md`: **Subject + Setting +
Style + Lighting + Composition + Technical**. Quality checklist and negative prompts below.

## Quality Checklist

**Good marketing images**:
- Clear focal point — one dominant element, not five competing
- Brand-consistent style across assets
- No stock photography clichés (handshakes, generic office scenes, staged smiles)
- Resolution appropriate for use case (72dpi for web, 300dpi for print)
- Alt text planned (for accessibility and SEO)
- Any text baked into the image holds at least 4.5:1 contrast against its background
  (WCAG AA for text) — check it at the final export, not just in the prompt
- Designed to still read against a dark feed background, not just white — OG and social
  images land in both light and dark timelines and the image itself doesn't get to adapt

```
[What is in the image and what is it doing]
[Where it's set]
[Visual style — photography style, illustration, 3D render]
[Lighting conditions]
[Camera angle and framing]
[Technical specs — 4K, sharp focus, etc.]
```

## Blog hero — Tech/SaaS

```
A minimalist workspace with a laptop showing a clean data dashboard,
coffee cup to the side, modern office background softly blurred,
professional product photography style, natural window light,
top-down angle, high resolution, editorial quality, no people
```

## Social media graphic — B2B

```
Abstract geometric shapes in navy blue and white representing data flow,
clean minimal design, professional business aesthetic,
flat design style, square format, bold typography space on left third,
modern corporate feel
```

## Product mockup

```
A MacBook Pro laptop with screen showing a UI screenshot [describe the UI],
placed on a modern white desk, studio photography,
soft shadow, clean background, 3/4 angle view, product photography
```

## OG Image (social preview)

```
A 1200x630 pixel banner with [brand color] background,
large bold headline text "[Your Headline]",
simple icon or illustration on the right,
clean minimal design, professional SaaS aesthetic,
logo space in top-left corner
```

## Negative Prompts

For diffusion-style generators (Gemini, Flux, Stable Diffusion):

```
blurry, low quality, pixelated, watermark, text errors, distorted faces,
extra limbs, stock photo, corporate, generic business
```

GPT Image models (OpenAI) have no dedicated negative-prompt field — fold exclusions straight
into the main prompt instead (e.g. "…. Avoid: people, text, logos").
