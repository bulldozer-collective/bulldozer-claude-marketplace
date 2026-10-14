---
name: |-
  video-watch
description: |-
  Watch any video — URL or local file — frame by frame with full audio transcript. Downloads, extracts frames (scene-change aware, budget-capped), microscopes the 0-10s hook, and transcribes via native captions or a Whisper API fallback.
when-to-use: |-
  Watch any video — URL or local file — frame by frame with full audio transcript, not just a title or a guess. Downloads, extracts frames, microscopes the 0-10s hook, and transcribes via captions or Whisper. Triggers on 'watch this video,' 'analyze this ad,' 'what's the hook in this,' 'summarize this video,' 'what happens at [timestamp],' or any pasted video URL/file with a question attached. For turning a watched ad into a reusable template, see ad-reverse-engineer.
argument-hint: |-
  https://youtu.be/abc123 what hook pattern are they using in the first 10 seconds?
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
effort: |-
  medium
---

# Video Watch

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on video intelligence. Your goal is to actually watch a video — frames and audio, not a summary of the title — and answer with the same grounding a human editor would have after scrubbing through it themselves.

This skill has no bundled scripts. Every step below is a direct `ffmpeg` / `yt-dlp` / `curl` call you run yourself with Bash — copy the command, don't go looking for a file that isn't there.

## Input

$ARGUMENTS — a video URL or local file path, plus the question or reason for watching it (e.g., "https://youtu.be/abc what's the hook pattern?" or "local-ad.mp4 what happens in the last 5 seconds?"). If no question is given, infer a brief intent ("general summary") so the analysis has a lens. If not provided, read any available context files before asking. Only ask if no video source is given at all.

A URL is a URL whatever hosts it — a Bulldozer-internal CDN media link (e.g. the url another skill pulled from `bdzGetAdLayer3Creatives` for an ad already live in an ad account) goes through the same Downloading step below as a public link, no special-casing needed.

## Output

A grounded answer citing exact timestamps from both the frames and the transcript, plus a structured `report.md` (TL;DR, key moments, hook breakdown, editorial pacing profile, quotable lines, entities, concepts, full timestamped transcript).

**Produce output on first invocation. Read available context before asking. Only ask if the primary input (a video source) is completely absent.**

---

## Setup Preflight (silent on success)

One check, every run:

```bash
command -v ffmpeg >/dev/null 2>&1 && command -v ffprobe >/dev/null 2>&1 && command -v yt-dlp >/dev/null 2>&1 \
  && echo "preflight: ok" || echo "preflight: missing tool(s) — see Installing the tools below"
```

Exit message `preflight: ok` → say nothing, move straight to download/extraction. Anything else → install what's missing (below), then re-run the check once before continuing.

Separately, check for a Whisper API key — only needed if native captions turn out to be missing (see Transcription Source Priority):

```bash
grep -E "^(GROQ_API_KEY|OPENAI_API_KEY)=" ~/.config/watch/.env 2>/dev/null || echo "no whisper key on file"
```

If no key is on file *and* the source turns out to have no native captions, ask via AskUserQuestion for a Groq key (preferred — cheaper, faster) or an OpenAI key, then write it to `~/.config/watch/.env` as `GROQ_API_KEY=...` or `OPENAI_API_KEY=...` so later runs skip the question.

## Installing the tools (only when Setup Preflight reports something missing)

- **macOS**: `brew install ffmpeg yt-dlp`
- **Linux**: `sudo apt-get install -y ffmpeg && pip install -U yt-dlp` (or `pipx install yt-dlp` if the system blocks global pip installs)
- **Windows**: `winget install ffmpeg` and `pip install -U yt-dlp`

`yt-dlp` ships as a single self-updating binary/package — `yt-dlp -U` catches up a stale install; a video that fails to download with a parsing error is usually that, not a dead link.

## Downloading the Source

Skip this entirely for a local file path — use it as-is.

For a URL, one call gets the capped-resolution video *and* any native captions in the same pass:

```bash
mkdir -p /tmp/watch/"$SLUG" && yt-dlp \
  -f "bv*[height<=720]+ba/b[height<=720]" \
  --write-auto-subs --sub-langs "en.*,en" --sub-format vtt \
  --merge-output-format mp4 \
  -o "/tmp/watch/$SLUG/source.%(ext)s" \
  "<source-url>"
```

`$SLUG` — a short id for this run (the video id from the URL, or a slugified title). 720p is a deliberate cap: frame extraction and the hook microscope only need on-screen text and composition to be legible, not full resolution — scale up the *extracted frames* (below) if small on-screen text genuinely needs reading, not the download itself.

If `source.en.vtt` (or another English variant) lands next to `source.mp4`, native captions exist — skip Whisper entirely. If it doesn't, move to the Whisper fallback once you reach the transcription step.

---

## Extraction and Frame Budget

Default frame budget, capped at 100 frames total (the user can ask for a different cap — treat it as `N` directly in the steps below):

| Duration | Frame budget |
|----------|--------------|
| ≤30s | ~30 |
| 30s–1min | ~40 |
| 1–3min | ~60 |
| 3–10min | ~80 |
| >10min | 100 (sparse-scan warning — re-run focused on a `--start`/`--end` range instead) |

**1. Get duration and set the target count:**

```bash
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/watch/"$SLUG"/source.mp4)
```

Pick `N` from the table above (or a user-requested cap), scoped to the start/end window when the user only wants a section covered instead of the full `$DUR`, and set it as a variable for the commands below — e.g. `N=60` for a 90-second video.

**2. Try scene-change extraction first** — this is what actually captures cuts, not just a clock tick:

```bash
mkdir -p /tmp/watch/"$SLUG"/frames && ffmpeg -y -i /tmp/watch/"$SLUG"/source.mp4 \
  -vf "select='gt(scene,0.3)',showinfo,scale=512:-1" -fps_mode vfr -frames:v "$N" -q:v 2 \
  /tmp/watch/"$SLUG"/frames/scene_%04d.jpg 2> /tmp/watch/"$SLUG"/frames.log
```

The frame's real timestamp lives in `frames.log`, not in its filename — pull it with
`grep -oP 'pts_time:\K[0-9.]+' /tmp/watch/"$SLUG"/frames.log`; the first match is
`scene_0001.jpg`'s timestamp, the second is `scene_0002.jpg`'s, in order. **Never compute a
scene-change frame's timestamp as index ÷ fps** — the fps ffmpeg reports is an average over
the whole clip, and a source that's been through a mobile export or a social re-encode is
often variable-frame-rate, so that arithmetic can drift by whole seconds, worst exactly at a
cut (the one moment this skill most needs right).

Count what landed: `ls /tmp/watch/"$SLUG"/frames | wc -l`. A talky, mostly-static video (talking head, screen recording) trips few scene changes and under-fills the budget — when the count comes back under ~60% of `N`, supplement with an evenly-spaced pass over the same range instead of shipping a thin set:

```bash
ffmpeg -y -i /tmp/watch/"$SLUG"/source.mp4 \
  -vf "fps=$(python3 -c "print($N/$DUR)"):round=up,scale=512:-1" \
  /tmp/watch/"$SLUG"/frames/even_%04d.jpg
```

Use `scale=1024:-1` instead of `512:-1` only when on-screen text needs to be read (burned-in captions, UI screenshots, pricing cards) — the default 512px is enough for composition and hook reads.

For a focused re-run on a section (a long video, or a follow-up question about one part), add `-ss START -to END` right after `-i source.mp4` on both of the commands above, and compute `N`/`$DUR` from that window's length instead of the full video.

**3. Hook microscope — dense pass on the first 10 seconds**, on by default for anything that reads as ad creative (keep it on unless the question clearly doesn't need the opening parsed frame-by-frame):

```bash
mkdir -p /tmp/watch/"$SLUG"/hook && ffmpeg -y -ss 0 -t 10 -i /tmp/watch/"$SLUG"/source.mp4 \
  -vf "fps=2,scale=512:-1" /tmp/watch/"$SLUG"/hook/hook_%03d.jpg
```

That's one frame every 0.5s across the opening 10s — enough to catch a cut the main pass would skip past.

**4. Pacing fingerprint — cut count, cheaply, without writing a single frame:**

```bash
ffmpeg -i /tmp/watch/"$SLUG"/source.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2> /tmp/watch/"$SLUG"/cuts.log
CUTS=$(grep -c "pts_time" /tmp/watch/"$SLUG"/cuts.log)
```

`$CUTS` divided by `$DUR/60` is cuts per minute — the raw number behind the "editorial pacing fingerprint" line in the report; translate it into the one-line style read yourself (e.g. under ~4 cuts/min reads as a single static shot or talking head, 15+ reads as fast-cut social edit).

## Report Template

Create the shell of `report.md` before reading anything, so you fill real content into real headings rather than inventing structure after the fact:

```bash
cat > /tmp/watch/"$SLUG"/report.md <<'EOF'
# Video Report

## TL;DR
<!-- pending Claude fill: 3-5 bullets through the lens of the stated intent -->

## Key Moments
<!-- pending Claude fill: 5-10 timestamped bullets -->

## Hook Microscope
<!-- pending Claude fill: frame-by-frame visual change x spoken words for 0-10s; name the pattern -->

## Editorial Pacing Fingerprint
<!-- pending Claude fill: one-line style summary from cut density + hero frames -->

## Quotable Moments
<!-- pending Claude fill: 3-5 standalone punchy lines -->

## Entities and Concepts
<!-- pending Claude fill: people, brands, products, concepts mentioned -->

## Full Timestamped Transcript
<!-- pending Claude fill: the complete transcript, timestamped -->
EOF
```

---

## Reading the Evidence

**Read every frame path in a single message** (parallel tool calls) so they land in context together, in chronological order, timestamped `t=MM:SS` — merge the `frames/` and `hook/` sets by timestamp rather than reading them as two separate sequences. For `frames/`, the timestamp is whatever `pts_time` gave each file (above) or the evenly-spaced fallback's own `index ÷ fps` (exact there, since the `fps` filter resamples to that exact cadence); for `hook/`, it's `index × 0.5s` (fixed `fps=2`).

Answer the user first, citing timestamps from both frames and transcript. Then fill every `<!-- pending Claude fill: ... -->` marker in `report.md`, in this order:
- TL;DR — 3–5 bullets through the lens of the stated intent
- Key moments — 5–10 timestamped bullets
- Hook microscope read — frame-by-frame visual change × spoken words; name the hook pattern (question, bold claim, in-medias-res, POV, pattern interrupt, etc.) as something a creative team could brief a new cut from, not just a label for this one
- Editorial pacing fingerprint — one-line style summary from cut density + hero frames
- Quotable moments — 3–5 standalone punchy lines
- Entities and concepts mentioned
- Full timestamped transcript

Never ship a half-filled report — an empty marker means the video wasn't actually watched closely enough.

---

## Transcription Source Priority

Skip this whole step when the question is purely visual (e.g. "what font is this" from frames alone) — don't burn a Whisper call for words nobody asked about.

**1. Native captions (free, preferred)** — already pulled in the Download step via `--write-auto-subs`. If `source.en.vtt` exists, read it directly; it's plain timestamped text, no further call needed.

**2. Whisper fallback** — only when no caption file landed. Extract the audio once:

```bash
ffmpeg -y -i /tmp/watch/"$SLUG"/source.mp4 -vn -ac 1 -ar 16000 -b:a 64k /tmp/watch/"$SLUG"/audio.mp3
```

Only this extracted audio clip ever leaves the machine — never the full video, and only when captions are missing.

Send it to whichever key is on file. **Groq `whisper-large-v3`** (cheaper, faster — preferred) via its OpenAI-compatible endpoint:

```bash
curl -s https://api.groq.com/openai/v1/audio/transcriptions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -F file=@/tmp/watch/"$SLUG"/audio.mp3 -F model=whisper-large-v3 \
  -F response_format=verbose_json -F "timestamp_granularities[]=segment" \
  -o /tmp/watch/"$SLUG"/transcript.json
```

Or **OpenAI `whisper-1`** as a fallback key:

```bash
curl -s https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file=@/tmp/watch/"$SLUG"/audio.mp3 -F model=whisper-1 \
  -F response_format=verbose_json -F "timestamp_granularities[]=segment" \
  -o /tmp/watch/"$SLUG"/transcript.json
```

Use `whisper-1`, not OpenAI's newer `gpt-4o-transcribe` / `gpt-4o-mini-transcribe` models — those only support `response_format=json` (plain text, no `verbose_json`), so they can't produce the per-segment timestamps this report needs. `whisper-1` is the OpenAI model that still does.

## Common Mistakes

- Answering from the title or a guess — if the frames weren't Read and the transcript wasn't loaded, the video hasn't actually been watched.
- Re-running the extraction on a follow-up question — if the video was already watched this session, answer from what's already in context.
- Sparse-scanning a long video — past 10 minutes, always re-run focused on the section the question is actually about instead of a thin full-length pass.
- Shipping a report with unfilled pending Claude fill markers — go back and fill every one before calling it done.
- Downloading at full source resolution by default — it slows the download and the extraction for no gain; only step up to `scale=1024:-1` when on-screen text genuinely needs reading.
- Timestamping a scene-change frame as index ÷ fps instead of reading its real `pts_time` from `frames.log` — a variable-frame-rate source makes that arithmetic wrong, worst right at the cut.

## Source

Concept adapted from bradautomates/claude-video (fork taoufik123-collab/claude-watch), MIT © Bradley Bonanno. Reimplemented here as direct `yt-dlp` / `ffmpeg` / `curl` calls — this skill carries no bundled scripts; every command above is the whole implementation.