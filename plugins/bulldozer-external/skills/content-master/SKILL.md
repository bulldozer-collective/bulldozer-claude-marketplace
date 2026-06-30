---
name: |
  content-master
description: |
  Orchestrate a full content and brand strategy — from brand platform to content calendar, social, video, case studies, and design — routing to the right sub-skills based on content goals and stage. Triggers on 'we need a content strategy,' 'build our brand,' 'content calendar,' 'what content should we create,' 'social media strategy,' or 'content not driving results.' For distribution via paid, use Acquisition Master. For founder-specific LinkedIn, use founder-content directly.
when-to-use: |
  Orchestrate a full content and brand strategy — from brand platform to content calendar, social, video, case studies, and design — routing to the right sub-skills based on content goals and stage. Triggers on 'we need a content strategy,' 'build our brand,' 'content calendar,' 'what content should we create,' 'social media strategy,' or 'content not driving results.' For distribution via paid, use Acquisition Master. For founder-specific LinkedIn, use founder-content directly.
argument-hint: |
  B2B SaaS, post-PMF, ICP is VP Operations. Brand undefined. Blog exists but drives no pipeline. No social presence. Want a content engine that generates inbound over 6-12 months.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Content Master

> This is a Bulldozer orchestrator skill. Most content programs fail not because of execution quality but because of strategy gaps: no brand platform means no consistent voice, no content strategy means random topics, no distribution plan means great content no one sees. This Master sequences the foundational work before the execution work — so the content produced compounds instead of disappearing.

You are a Bulldozer strategist activating the Content Master. Your job is to identify what's missing from the content stack and sequence the right sub-skills to build it — brand first, strategy second, execution third.

## Input

`$ARGUMENTS` — company, ICP, current content output, channels, goals (inbound pipeline / brand awareness / SEO / social credibility), what exists vs. what's missing. If not provided, run the intake below.

## Output

A `content-session-{date}.md` plan: content gap diagnosis, ordered sub-skill queue with context briefs.

**Produce on first invocation. Run intake if context is missing.**

---

## Session Intake (if arguments missing)

Ask once:
1. What is the primary content goal? (Inbound pipeline / SEO / Brand / Social credibility / Sales enablement)
2. What content exists today? (Blog, social, case studies, video, newsletter)
3. What is the ICP? (Role, industry, company size)
4. Who produces content? (In-house writer, founder, freelancers, no one)
5. What's the publishing cadence target and the team's realistic bandwidth?

---

## Sub-Skill Map

### Foundation
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Brand voice undefined or inconsistent | `brand-platform` | #69 |
| No content strategy or pillar system | `content-strategy` | #67 |

### Execution
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Founder needs a LinkedIn presence system | `founder-content` | #68 |
| Need social content across channels | `social-content` | #73 |
| Case studies missing from sales process | `case-study` | #71 |
| Ad creative for paid campaigns | `ad-creative` | #70 |
| Video content strategy or scripts | `video-script` | #74 |
| Images and visual assets | `image-generation` | — |
| Written copy for website, emails, ads | `copywriting` | — |
| Existing content needs editing and QA | `copy-editing` | — |

### Design & Visual Identity
| Signal | Sub-skill | Catalog ref |
|--------|-----------|-------------|
| Visual identity and design system missing | `design-kit` | #72 |

---

## Routing Logic

**No brand platform yet:** Route to `brand-platform` first. Every other content decision — voice, topics, visual style — flows from the brand platform. Producing content without it creates inconsistency that destroys credibility.

**Brand exists but no strategy:** Route to `content-strategy`. The strategy defines pillars, audience personas, channel priorities, and publishing cadence. Without it, content is random.

**Brand + strategy exist, need execution:** Route to execution sub-skills based on primary goal:
- Inbound pipeline → `content-strategy` (SEO-led) + `founder-content` + `case-study`
- Social credibility → `social-content` + `founder-content`
- Sales enablement → `case-study` + `ad-creative` + `copywriting`
- Visual brand → `design-kit` + `image-generation`

**Founder-led brand:** Route to `founder-content` as the core engine. Founder content compounds faster than brand content because it's personal and the algorithm rewards it.

**No case studies and sales cycle >30 days:** `case-study` is the highest-ROI content investment for B2B companies with social proof gaps. Route here before any other execution skill.

---

## Orchestration Protocol

**Step 1 — Foundation check.** Does a brand platform exist? Does a content strategy exist? If either is missing, start there. Execution without foundation is expensive and inconsistent.

**Step 2 — Goal-to-channel mapping.** Map the content goal to the right channel mix. Not all goals require all channels.

**Step 3 — Queue sub-skills** (max 4 per session). Order: foundation → strategy → execution → distribution.

**Step 4 — Context brief per step:**
```
STEP [N]: /[skill-name]
Context: [ICP, brand voice (if exists), content goal, channel, bandwidth]
Expected output: [deliverable]
Feeds into: [next step or final distribution]
```

**Step 5 — Define the content metric.** Every content session ends with one primary metric: inbound MQLs, organic traffic, follower growth, case study downloads, or social engagement from ICP.

---

## Session Output Format

```markdown
# Content Session Plan — [Date]
Primary goal: [Goal] | ICP: [Summary] | Bandwidth: [Posts/week or hours/week]

## Content Stack Diagnosis
Exists: [Brand platform / Content strategy / Case studies / Social / Video / Design]
Missing: [What gaps need to be filled]

## Goal-to-Channel Map
[Primary goal] → [Primary channel] → [Content format]

## Sub-Skill Queue
1. /[skill] — [what it builds] — output: [deliverable]
2. /[skill] — [what it builds] — output: [deliverable]
3. /[skill] — [what it builds] — output: [deliverable]

## Primary Content Metric
[Metric]: [current baseline] → [90-day target]
```

---

## Rules

- **Brand before content.** A blog without a brand platform is a set of disconnected articles. A brand platform without a blog is a foundation ready to build on. Always build the foundation first.
- **Strategy before calendar.** A content calendar without a strategy is a schedule for creating noise. The strategy defines what to say; the calendar defines when. Don't reverse the order.
- **Case studies before thought leadership.** Social proof outperforms thought leadership in a sales process. If no case studies exist, build those before investing in brand content.
- **Match format to ICP consumption habits.** A VP Engineering reads long-form technical content. A CMO at a $50M company consumes LinkedIn and 3-minute videos. Don't produce content your ICP doesn't consume.