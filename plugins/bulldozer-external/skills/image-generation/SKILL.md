---
name: image-generation
description: Create marketing images using AI generation tools — blog heroes, social-content graphics, product mockups, and OG images. Triggers on 'AI image generation,' 'generate an image,' 'create a graphic,' 'product mockup,' 'hero image,' or 'social media graphic.' For paid ad image specs, see ad-creative. For AI video, see video-script.
when-to-use: Create marketing images using AI generation tools — blog heroes, social-content graphics, product mockups, and OG images. Triggers on 'AI image generation,' 'generate an image,' 'create a graphic,' 'product mockup,' 'hero image,' or 'social media graphic.' For paid ad image specs, see ad-creative. For AI video, see video-script.
argument-hint: Hero image for a blog post about data pipeline automation — professional, tech aesthetic
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Image

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on AI-powered visual content production. Your goal is to help produce professional marketing images efficiently using AI generation tools — from blog heroes and social graphics to product mockups and OG images.

## Input

`$ARGUMENTS` — image type, context, and style (e.g., "hero image for a SaaS landing page — minimalist, tech-forward, no stock photography feel"). If not provided, read any available context files before asking. Only ask if there is absolutely no context about what to create.

## Output

Ready-to-use AI image generation prompts optimized for the specified tool (Gemini, Flux, Ideogram, or GPT Image), with: prompt text, negative prompts, recommended settings, platform-specific sizing, and 3 creative direction variations. If generating directly, produces the image.

**Produce output on first invocation. Read available context before asking. Only ask if there is no context about what to create.**

---

## Choosing the Right AI Approach

| Approach | Best for | Tools |
|----------|----------|-------|
| **AI Generation** | Original images from text prompts — blog heroes, social-content graphics, lifestyle scenes | Gemini, Flux, Ideogram, GPT Image |
| **AI Editing** | Modify existing images — background removal, style changes, variations | Gemini, Flux Flex |
| **Screenshot + Overlay** | Product UI showcases | Browser screenshot + code overlay |
| **Stock Photography** | Generic business/lifestyle — when speed > uniqueness | Unsplash, Pexels |

---

## Model Selection Guide

| Model | Best for | Text in images | API |
|-------|----------|:--------------:|:----|
| **Gemini Image** (Google) | All-around, editing, text rendering | Good | Gemini API |
| **Flux** (Black Forest Labs) | Photorealism, brand consistency, batch production | Limited | BFL API, Replicate, fal.ai |
| **Ideogram** | Typography, branded graphics, text-heavy images | Best | Ideogram API |
| **GPT Image** (OpenAI) | General purpose, fast iteration | Good | OpenAI API |
| **Midjourney** | High-aesthetic, artistic | Poor | Subscription (no API) |

**Decision tree**:
- Need text/headlines in the image → Ideogram (best), then Gemini
- Need brand consistency across multiple images → Flux (multi-image reference)
- Need to edit an existing image → Gemini, Flux Flex
- Need volume at low cost → Flux Schnell, Gemini Flash

---

## Prompt Engineering

### Strong Prompt Structure

**Subject + Setting + Style + Lighting + Composition + Technical**

```
[What is in the image and what is it doing]
[Where it's set]
[Visual style — photography style, illustration, 3D render]
[Lighting conditions]
[Camera angle and framing]
[Technical specs — 4K, sharp focus, etc.]
```

### Example Prompts by Use Case

**Blog hero — Tech/SaaS**:
```
A minimalist workspace with a laptop showing a clean data dashboard,
coffee cup to the side, modern office background softly blurred,
professional product photography style, natural window light,
top-down angle, high resolution, editorial quality, no people
```

**Social media graphic — B2B**:
```
Abstract geometric shapes in navy blue and white representing data flow,
clean minimal design, professional business aesthetic,
flat design style, square format, bold typography space on left third,
modern corporate feel
```

**Product mockup**:
```
A MacBook Pro laptop with screen showing a UI screenshot [describe the UI],
placed on a modern white desk, studio photography,
soft shadow, clean background, 3/4 angle view, product photography
```

**OG Image (social preview)**:
```
A 1200x630 pixel banner with [brand color] background,
large bold headline text "[Your Headline]",
simple icon or illustration on the right,
clean minimal design, professional SaaS aesthetic,
logo space in top-left corner
```

---

## Platform Image Sizes

| Platform | Recommended size | Notes |
|----------|-----------------|-------|
| Blog hero | 1200×630px | Also works as OG image |
| OG image (social preview) | 1200×630px | 1.91:1 aspect ratio |
| LinkedIn post image | 1200×627px | Near identical to OG |
| Twitter/X header | 1500×500px | |
| Instagram square | 1080×1080px | |
| Instagram story/reel | 1080×1920px | |
| Facebook cover | 820×312px | |
| LinkedIn cover | 1584×396px | |
| Google ad image | 1200×628px | |
| Meta feed image | 1080×1080px (square) or 1080×1350px (portrait) | |

---

## Quality Standards

**Good marketing images**:
- Clear focal point — one dominant element, not five competing
- Brand-consistent style across assets
- No stock photography clichés (handshakes, generic office scenes, staged smiles)
- Resolution appropriate for use case (72dpi for web, 300dpi for print)
- Alt text planned (for accessibility and SEO)

**Negative prompts** (add to most AI generators):
```
blurry, low quality, pixelated, watermark, text errors, distorted faces,
extra limbs, stock photo, corporate, generic business
```

---

## OG Image Best Practices

OG (Open Graph) images appear when your page is shared on social. They have a dramatic impact on click-through rate.

**Must have**:
- Your logo or brand mark
- Clear, readable headline (28pt+ font size)
- On-brand colors
- Minimal text (5–8 words maximum for readability)

**Test**: View the image at thumbnail size (roughly 400×210px in Twitter preview). Can you still read it and tell what it's about?