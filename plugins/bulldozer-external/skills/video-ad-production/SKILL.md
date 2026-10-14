---
name: |-
  video-ad-production
description: |-
  Take a creative brief (ad-creative-brief) or a reverse-engineered template (ad-reverse-engineer) and turn it into an actually produced video ad — hook and shot list, Studio generation prompt, AI-generated clip (and voiceover if needed), quality check, and upload to the ad platform. Triggers on 'produce the video ad,' 'turn this brief into a video,' 'generate the ad video,' 'make this template into a real video,' 'render the ad,' 'shoot this script,' or any approved brief/template handed over for production. For the brief itself, see ad-creative-brief. For decomposing a reference ad first, see ad-reverse-engineer. For QA before it ships, see ad-creative-scorecard.
when-to-use: |-
  Take a creative brief (ad-creative-brief) or a reverse-engineered template (ad-reverse-engineer) and turn it into an actually produced video ad — hook and shot list, Studio generation prompt, AI-generated clip (and voiceover if needed), quality check, and upload to the ad platform. Triggers on 'produce the video ad,' 'turn this brief into a video,' 'generate the ad video,' 'make this template into a real video,' 'render the ad,' 'shoot this script,' or any approved brief/template handed over for production. For the brief itself, see ad-creative-brief. For decomposing a reference ad first, see ad-reverse-engineer. For QA before it ships, see ad-creative-scorecard.
argument-hint: |-
  Produce this UGC testimonial brief as a 15s vertical video for Meta — Seedance 2.5, French voiceover
allowed-tools:
  - Bash
  - Read
  - Write
  - mcp__plugin_bulldozer_bulldozer__bdzCreateStudioJob
  - mcp__plugin_bulldozer_bulldozer__bdzGetStudioJob
  - mcp__plugin_bulldozer_bulldozer__bdzListStudioVoices
  - mcp__plugin_bulldozer_bulldozer__bdzRequestFridgeCode
  - mcp__plugin_bulldozer_bulldozer__bdzCreateAdVideo
  - mcp__plugin_bulldozer_bulldozer__bdzCreateAdLayer3
  - mcp__plugin_bulldozer_bulldozer__bdzListRegisteredAdAccounts
  - mcp__plugin_bulldozer_bulldozer__bdzCheckAdAccountAccess
effort: |-
  high
---

# Video Ad Production

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on video ad production. Your goal is to take an approved brief or template and come out with an actual rendered, uploaded video ad — not a shot list someone else still has to produce.

## Input

$ARGUMENTS — a creative brief (ad-creative-brief output), a reverse-engineered template (ad-reverse-engineer output), or a direct description of the video ad to produce (script or visual direction, platform, target length). If not provided, read any available context files before asking. Only ask if no brief, template, or description is available at all.

## Output

A produced video ad: the rendered clip (and a separate voiceover track if one was requested), plus the exact Studio prompt(s) and job id(s) used for traceability and re-generation. On Meta and LinkedIn, the clip is already uploaded to the ad account with a `videoId` ready for `bdzCreateAdLayer3` (Step 6). For any other platform, the rendered file is handed over for manual upload — see Step 6.2.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Step 1: Lock the Hook and the Shot List

### 1.1 Build the Scene List

From an ad-reverse-engineer template: keep its scene-by-scene map (timestamp, visual, audio, text overlay, camera, purpose) and swap only the `[PRODUCT]` placeholders. From an ad-creative-brief concept: break its single visual direction into scenes yourself — most AI-generated ads run 3 to 5 scenes of 3–8 seconds each (hook, problem/context, product/solution, proof, CTA). Size each scene to what the chosen model can actually render in one clip (Step 3.1) — a scene longer than the model's ceiling means another clip, stitched in post, not a longer single generation.

Consistency across stitched clips is still the real ceiling here, not solved by any model: character, logo or product detail drifts, worse the longer the sequence runs. Test the first two scenes before committing to the rest — if they already drift, restructure (fewer, longer Seedance 2.5 scenes over many short stitched clips) rather than push on. Anchor every clip after the first with a reference image from a clip already approved, never a fresh text description of the same subject — that's what drifts.

### 1.2 Hook Formulas (0–3 seconds)

Same 10 hook types as ad-reverse-engineer's catalog — pick one, then write the exact opening line and the frame-1 visual:

| Hook type | Formula / example |
|---|---|
| Pattern interrupt | An unexpected visual or action in frame 1, before any words |
| Question | "What would you do with 6 extra hours a week?" |
| Bold claim | "Most teams waste 6 hours a week on reports nobody reads." |
| POV | "POV: you just found the dashboard your team's been missing." |
| Stat / authority | "9 out of 10 ops teams still build reports by hand." |
| Visual-only | No narration — a sight that stops the scroll on its own |
| Controversy | A position most of the category wouldn't say out loud |
| Social proof | "12,000 teams switched this year. Here's why." |
| Narrative | "I almost gave up on fixing this. Then —" |
| Direct address | Presenter looks straight at camera, names the viewer's problem |

A hook that only works with sound fails on autoplay: the frame-1 visual and the on-screen text need to carry the same meaning alone (see Step 5).

### 1.3 When the Brief Is a Fake Testimonial

A "UGC testimonial" brief asks, by construction, for a generated person to claim they used the product when they never did — don't render that literally. The FTC's fake-endorsement rule (in force since October 2024, penalties reported up to ~$53,000 per posting) covers an AI testimonial the same as a human one; New York's synthetic-performer law adds a state obligation from June 2026 (secondary sources, not a direct read of ftc.gov or the statute). The practical test: if the on-screen person claims direct experience with the product, the brief needs a real person who had it, not a Studio stand-in. Keep the brief's intent without the risk — shoot it as a dramatization instead of a first-person claim, or push back for real footage — and say which one happened rather than shipping a silent "testimonial."

## Step 2: Write the Studio Prompt

### 2.1 Structure

One prompt block per scene: Subject + Action + Camera + Style + Lighting + Technical. Keep the same subject, palette and lighting description across scenes that are meant to look continuous — the model has no memory between separate jobs.

### 2.2 What the Prompt Must Never Ask For

Same ceiling as image generation: the model does not reliably render legible on-screen text, logos, or brand marks. A hook line, a lower-third, or a CTA card gets incrusted in post — never described inside the generation prompt. Add explicit negatives to every scene prompt: `no text, no letters, no numbers, no logos, no watermark`.

### 2.3 Reference Images

A product shot, packaging, or presenter likeness goes in as a reference image, never as a URL typed into the prompt text — that gets silently ignored. Pass it in `inputs[].referenceUrls` (a public image URL) or `inputs[].fridgeIds` (a file already deposited via `bdzRequestFridgeCode`, owner-only). There is no separate asset-import call and no inline `{{asset:uuid}}` syntax for this tool.

## Step 3: Generate the Clip

### 3.1 Pick the Model

`bdzCreateStudioJob` with `mediaType=STUDIO_MEDIA_TYPE_VIDEO` only runs two video models — there is no Runway, Kling, or Pika inside Bulldozer OS; produce with one of these two, or fall back to an external tool manually if the brief specifically calls for one of the others.

| Model | Clip length | Reference images | Resolution / ratio | Notes |
|---|---|---|---|---|
| **Veo** (`STUDIO_VIDEO_MODEL_VEO`, default) | 4, 6 or 8 sec | Up to 3 | Fixed at 480p — not a parameter you choose | Must be 8 sec when reference images are supplied |
| **Seedance 2.5** (`STUDIO_VIDEO_MODEL_SEEDANCE_2_5`) | 4–30 sec | Up to 30 | `resolution` required (480p/720p/1080p), `aspectRatio` optional | Carries native audio (ambiance, a delivered line) baked into the generation |

A video parameter the chosen model doesn't support is a 400, never silently ignored — don't pass `resolution`/`aspectRatio` to a Veo job, and leave `personGeneration` unset on both (the backend resolves it automatically). **Delivery quality matters for paid media**: Veo's output is capped at 480p through this integration — for anything running at real spend on Feed/Reels/LinkedIn, Seedance 2.5 at 720p or 1080p is the only one of the two that reaches a platform-acceptable resolution; reserve Veo for drafts, concepting, or placements where 480p is genuinely enough.

### 3.2 Call the Job

`bdzCreateStudioJob(mediaType=STUDIO_MEDIA_TYPE_VIDEO, videoModel=…, durationSeconds=…, inputs=[{text, referenceUrls?, fridgeIds?}], useTov=…)`. Ask the user whether to apply the project's tone of voice before setting `useTov` — don't assume. One job per scene when the shot list needs more than one model-length clip; stitch them in post.

### 3.3 Poll for Completion

`bdzGetStudioJob` until `status = "completed"`. `startedAt` null means the job is still queued behind other generations — normal, can take a few minutes, not stuck. A `429` means the generation queue is full, not that anything broke: retry after a short delay. A job that genuinely stalls is failed server-side within 30 minutes with a reason; don't poll past that point waiting for something that already failed.

## Step 4 (Optional): Generate the Voiceover

`bdzCreateStudioJob(mediaType=STUDIO_MEDIA_TYPE_AUDIO)`: `voiceId` is required (pick one from `bdzListStudioVoices`, filterable with `search`), `text` is required and read aloud verbatim (10,000-character cap, 40,000 with `STUDIO_VOICE_MODEL_ELEVEN_FLASH_V2_5`), `languageCode` is optional. This produces a **standalone audio file** — nothing in the OS merges it onto the generated clip; mixing it in is a manual or external editing step. When the ad genuinely needs sound baked into the visuals (ambiance, a line delivered on camera), use Seedance 2.5's native audio instead of a separate voiceover job.

## Step 5: Quality Control Before Upload

- Hallucinated or garbled on-screen text/logos — regenerate the scene, don't crop to hide it.
- Warped hands, faces, or objects in any frame. A generated face or likeness gets a human sign-off before it ships — a convincing frame 1 doesn't guarantee a consistent frame 40, and a likeness raises its own consent question.
- Continuity between stitched clips — same subject, same lighting, same palette scene to scene.
- Aspect ratio matches the destination placement (Step 6.3).
- The hook reads with sound off — captions on, since most social video is watched muted. Don't fix captions to one color: the background changes shot to shot, so what contrasts on scene 1 can vanish on scene 3 — use an outline/stroke or a semi-opaque bar instead.
- The clip is downloaded and archived once the job completes. `results[].assets[].url` is a CDN link with no documented expiry — that's not a promise it's permanent either, so don't leave it un-archived.

Two failed regenerations on the same scene: stop and change the approach (a different hook type, a different reference image) instead of re-rolling the same prompt a third time.

## Step 6: Hand Off to the Ad Platform

This assumes the destination campaign and ad group (Layer 1/2) already exist — this skill attaches a creative, it doesn't build campaign structure. If they don't exist yet, build them first with the platform's own skill (meta-ads, linkedin-ads, google-ads). On LinkedIn specifically, a manually-bid ad group with no `linkedIn.unitCost` stays in `DRAFT` forever and **any** creative attached to it — video included — fails; check the ad group's status before spending time on the render.

A failed creative call isn't necessarily a video problem: Layer 1 and 2 can create cleanly and Layer 3 still fail, because Layer 3 publishes on behalf of the Facebook Page or LinkedIn Organization — a permission the first two never touch. Before re-rendering, call `bdzCheckAdAccountAccess(adAccountId)`: `pageAccess: DENIED` means re-share the Page/Organization (a permissions fix, not a creative one); `pageAccess: UNKNOWN` is inconclusive, not a refusal — retry or reconnect. No access check is implemented for Microsoft Ads.

### 6.1 Meta and LinkedIn — the Two-Step Upload

1. `bdzCreateAdVideo(adAccountId, mediaUrl=<the Studio CDN url> or fridgeId=<a fridge file>)` — LinkedIn captions (an SRT, via `captionsUrl` or `captionsFridgeId`, English only) are attached **here**, never at Layer 3. Returns a `videoId` as soon as the upload itself is done, before the platform has finished processing the file (status is usually `AD_VIDEO_STATUS_PROCESSING`).
2. `bdzCreateAdLayer3(l2Id, platform, l3Type=AD_CREATIVE_TYPE_VIDEO, videoId, …)`. While the platform is still processing, this answers `409` and creates nothing: wait about 30 seconds and retry the **same** call. Never call `bdzCreateAdVideo` again on a `409` — that uploads a second copy of the video.

Platform specifics: Meta requires `meta.pageId` (or a `leadFormId` that supplies one) and can only carry a destination through the CTA (`destinationUrl` → the video's call-to-action link) — a video creative has no separate landing-page field the way an image one does. LinkedIn requires the connected member to hold `ADMINISTRATOR` or `DIRECT_SPONSORED_CONTENT_POSTER` on the ad account's organization Page; the refusal names the missing permission. Once created, `bdzUpdateAdLayer3` can only change `name` and `status` — to replace the clip itself, pause the creative and recreate it, never try to update it in place.

Meta labels this automatically whether asked or not: since June 2026, Advantage+ detects AI-made/modified media via C2PA metadata and applies an "AI info" label (agency sources, not a Meta policy page read directly) — a clip from this skill is exactly that kind of media, and the advertiser stays responsible even when the label was platform-applied, not chosen (see 1.3).

### 6.2 Platforms This Step Doesn't Cover

Google Ads (YouTube) and Microsoft Ads are registered platforms in Bulldozer OS, but no `bdz*` tool uploads a video ad on either one today — hand the rendered file over for manual upload through the platform's own interface rather than inventing a step that doesn't exist. TikTok and Pinterest are a different gap entirely: neither is an integrated platform in the OS at all (no account registration, no analytics, nothing) — a TikTok or Pinterest video ad from this skill means handing over the rendered file and the rest of the process stays fully manual, on every platform these two touch, not just upload.

### 6.3 Platform Specs to Check Before Rendering

Aspect ratio, runtime and file-size ranges for Meta/LinkedIn, with sourcing caveats, are in `references/platform-specs.md` — read before finalizing a render.

---

## Handoff to Production

1. ad-creative-brief or ad-reverse-engineer → the brief or template.
2. video-ad-production (this skill) → the rendered, uploaded video.
3. ad-creative-scorecard → QA before spend goes behind it.

---

## Common Mistakes

- Typing an asset's URL into the prompt text instead of passing it as `referenceUrls`/`fridgeIds` — the model silently ignores it.
- Asking the model to render the hook line, a CTA card, or a logo — that goes in post, never in the prompt.
- Calling `bdzCreateAdVideo` a second time on a `409` instead of retrying `bdzCreateAdLayer3` — duplicates the upload.
- Assuming Google Ads or Microsoft Ads video upload is wired into the OS — it isn't; say so rather than inventing the step.
- Treating a Studio CDN link as permanent, or panicking over a specific expiry — neither is documented. Download it once the job completes and move on.
- Promising Runway, Kling, or Pika output from inside Bulldozer OS — Studio only runs Veo and Seedance 2.5.
- Rendering a paid-spend ad with Veo and expecting more than 480p — pick Seedance 2.5 when resolution matters.
- Attaching a video creative to a LinkedIn ad group that's still in `DRAFT` for lack of a bid — the creative call fails regardless of the video itself.
- Treating TikTok or Pinterest as covered by this skill's upload step — neither platform is integrated into Bulldozer OS at all.
- Rendering a "UGC testimonial" as a literal first-person claim without checking it's real customer footage — exactly what the FTC's fake-endorsement rule and NY's synthetic-performer law exist to catch.
- Committing the full shot list before checking the first two clips side by side — drift compounds past clip two.
- Re-rendering the clip to fix a failed `bdzCreateAdLayer3` before checking `bdzCheckAdAccountAccess` — `pageAccess: DENIED` is a permission problem, not a video one.