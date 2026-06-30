---
name: |
  bulldozer-studio
description: |
  Generate images and videos via the Bulldozer Studio using prompts and optional imported assets.
when-to-use: |
  Use when the user wants to produce visual creative assets via Bulldozer — e.g., requests to generate, create, make, render, or produce images, videos, creatives, visuals, or ads.
user-invocable: false
allowed-tools:
  - mcp__plugin_bulldozer_bulldozer__bdzCreateStudioJob
  - mcp__plugin_bulldozer_bulldozer__bdzImportStudioAsset
effort: |
  low
---

# Bulldozer Studio

The Bulldozer Studio generates images and videos from a text prompt and zero or more imported assets.

## Core Rules

- The prompt **cannot** reference an image by its URL. Any asset must first be imported via `mcp__plugin_bulldozer_bulldozer__bdzImportStudioAsset` to obtain an `asset_id`.
- Inside the prompt, an asset can **only** be referred to by its `asset-uuid` (see example below).
- Phrases like *"based on the provided images"* or *"use the provided asset as inspiration"* are silently ignored by the Studio. Always reference assets by uuid instead.
- Do **not** add styling rules to the prompt on your own. Only include styling guidance if the user explicitly stated it.

## End-to-End Workflow

1. **Detect intent**: Confirm the user wants an image or a video, and clarify which one if ambiguous.
2. **Collect assets**: If the user references any external image/URL/file, import each one via `mcp__plugin_bulldozer_bulldozer__bdzImportStudioAsset` and keep the returned `asset_id`.
3. **Ask about Tone of Voice**: Ask the user whether to apply the project's tone of voice, unless they have already stated a preference in the current conversation. Use the answer as the `useTov` argument (boolean).
4. **Build the prompt**: Use the user's wording. Reference any imported asset by its uuid inside the prompt (e.g., `{{asset:<asset-uuid>}}`). Do not inject styling unless the user asked for it.
5. **Create the job**: Call `mcp__plugin_bulldozer_bulldozer__bdzCreateStudioJob` with the prompt, `useTov`, the asset ids (if any), and the desired output type (image or video).
6. **Set expectations**: Tell the user the expected wait time:
   - Image: ~20 seconds
   - Video: ~60 seconds
7. **Return the result**: Once the job completes, share the generated asset with the user.

## Tone of Voice

- Always ask whether to use the project tone of voice before creating a job, unless the user already made it clear (e.g., "don't use the project style", or they've already answered earlier in the same session).
- Pass the user's choice as a boolean to the `useTov` argument of `createStudioJob`.

## Asset Reference Example

If the user provides an image URL and asks for *"a cat sitting next to this object"*:

1. Import the URL → receive `asset_id = "abc-123"`.
2. Send a prompt such as: `"A cat sitting next to {{asset:abc-123}}"`.
3. Do **not** write: `"A cat sitting next to the provided image"` — that reference will be ignored.

## Error & Edge Cases

- **Import fails**: Inform the user which asset failed and ask whether to retry or proceed without it.
- **Job fails**: Report the failure to the user; do not silently retry. Offer to adjust the prompt or assets.
- **Multiple assets**: Import each one separately and reference each by its uuid in the prompt where relevant.
- **No assets**: That is fine — a prompt alone is sufficient.

## Timings

- Image generation: ~20 seconds
- Video generation: ~60 seconds
