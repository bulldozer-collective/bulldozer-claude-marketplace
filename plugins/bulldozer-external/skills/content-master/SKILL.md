---
name: |-
  content-master
description: |-
  Orchestrate a full content and brand strategy — from brand platform to content calendar, social, video, case studies, and design — routing to the right sub-skills based on content goals and stage. Triggers on 'we need a content strategy,' 'build our brand,' 'content calendar,' 'what content should we create,' 'social media strategy,' or 'content not driving results.' For distribution via paid, use Acquisition Master. For founder-specific LinkedIn, use founder-content directly.
when-to-use: |-
  Orchestrate a full content and brand strategy — from brand platform to content calendar, social, video, case studies, and design — routing to the right sub-skills based on content goals and stage. Triggers on 'we need a content strategy,' 'build our brand,' 'content calendar,' 'what content should we create,' 'social media strategy,' or 'content not driving results.' For distribution via paid, use Acquisition Master. For founder-specific LinkedIn, use founder-content directly.
argument-hint: |-
  B2B SaaS, post-PMF, ICP is VP Operations. Brand undefined. Blog exists but drives no pipeline. No social presence. Want a content engine that generates inbound over 6-12 months.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
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

Run the OS Diagnosis below first — it answers question 2 from real data. Then ask:
1. What is the primary content goal? (Inbound pipeline / SEO / Brand / Social credibility / Sales enablement)
2. What content exists today? (Blog, social, case studies, video, newsletter) — cross-check against the OS Diagnosis, don't take the self-report alone.
3. What is the ICP? (Role, industry, company size)
4. Who produces content? (In-house writer, founder, freelancers, no one)
5. What's the publishing cadence target and the team's realistic bandwidth?

---

## OS Diagnosis (run before intake question 2)

A self-reported "yes we have a blog" is weaker than a real read. Check what Bulldozer OS already
holds for this project before asking:

| Check | Tool | What it tells you |
|---|---|---|
| Brand voice defined? | `bdzGetProjectToneOfVoice` | `state: PROJECT_TONE_OF_VOICE_STATE_SUCCESS` with a filled mission/positioning/tones means a brand platform already exists — skip straight past the "brand undefined" trigger unless the client wants to revise it. |
| Blog / site live? | `bdzListCmsSites`, then `bdzListCmsPages` with the returned `siteId` | An empty site list or a near-empty page list makes "no content" a fact, not an assumption. |
| Traffic baseline? | `bdzGetCmsTrafficReport` on that `siteId` | Real current traffic for the Primary Content Metric baseline. Requires the Webflow Analyze add-on — if it errors, don't fall back to asking the client for a traffic number they'll have to go pull themselves; fall back to a metric this session can actually track instead (lead-list volume from `case-study` downloads, or engagement pulled from `bdzListLinkedInPosts` on a followed profile). A metric nobody will come back to check isn't a metric, it's a placeholder. |
| Case-study raw material already recorded? | `bdzListWorkspaceLinks` (get `workspaceId` from `bdzListWorkspaces` first), filter `type=WORKSPACE_LINK_TYPE_CLAAP` — but don't stop there: also check Claap directly (`mcp__Claap__get_recordings`, filter `companyId`/`dealId`, `hasExternalSpeaker=true`) | Customer or expert interviews often already sit in Claap — check before `case-study` writes a fresh interview brief. A project's Claap recordings aren't always linked to its Bulldozer workspace: an empty `bdzListWorkspaceLinks` result means no interview has been attached yet, not that none exists. |
| Founder/company LinkedIn baseline? | `bdzListLinkedInPosts` with the profile's URL | Real post history and engagement (reactions, comments) instead of a guessed follower count — this only reads what Bulldozer OS already has stored, no scrape triggered. An empty result means nothing has been pulled for this profile yet, not that it's inactive: pulling a real baseline (`bdzCreateLinkedInPostListJob`, one-off) or setting up ongoing tracking (`bdzCreateLinkedInRefreshConfig`, `targetType=PEOPLE`) both cost jetons — leave that call to the execution step, not this diagnosis. |
| Positioning stable enough to build volume on? | `bdzGetProjectMarketPositioning`, `bdzGetProjectValueProposition` | Both are async analyses with a `state` field — judge freshness by `startedAt`, not `createdAt` (the analysis line is reused across re-runs, so `createdAt` can look older than the last real pass). If either is missing, still running, or the client flags it as mid-revision, treat that as a reason to queue one case study rather than a full execution push — case studies and pillar content encode a claim about who the product beats and why, and that claim is exactly what's still moving. |
| Can the operator already post as the founder? | `bdzListSharedConnectors` | Returns the LinkedIn connectors other Bulldozer users have shared with whoever runs this session, each with a `connectorId`. If the founder's LinkedIn connector shows up here, `founder-content` output can go straight to `bdzCreateLinkedInPost` (`connectorId` set to the shared one) without routing the text back to the founder to paste by hand. Nothing shows up unless the founder ran `bdzShareConnector` first — that share is per platform, permanent until revoked, and survives the founder reconnecting their account, so it's worth setting up once rather than re-asking each session. Re-read the list each time rather than caching a `connectorId`: it changes if the owner reconnects. |

`bdzGetProjectToneOfVoice`, `bdzGetProjectMarketPositioning` and `bdzGetProjectValueProposition` each take a third required parameter beyond the usual `customerId`/`projectId` headers: `targetProjectId`. Omit it and the call fails outright — pass the project's own id there too when wiring this table. A 404 on `bdzGetProjectToneOfVoice` means no tone of voice yet (normal — read as brand undefined); a 402 means the plan lacks this capability, a gap to flag, not an empty brand.

Only ask the human what the OS can't answer: the goal, who writes, and bandwidth.

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

For sales enablement specifically, sequence the queue to the order a deal actually raises questions in — the champion needs the case study before the CFO asks for proof, the technical buyer needs the detailed copy before legal reviews anything — rather than treating `case-study` + `ad-creative` + `copywriting` as three parallel outputs due whenever they're ready. This is about ordering an already-sized queue, not a reason to add a full stakeholder-mapping pass on top of it.

**Founder-led brand:** Route to `founder-content` as the core engine. Founder content compounds faster than brand content because it's personal and the algorithm rewards it.

**No case studies and sales cycle >30 days:** `case-study` is the highest-ROI content investment for B2B companies with social proof gaps. Route here before any other execution skill.

**When the sequence should bend.** Foundation-first is the default, not a law. A company with a live sales enablement gap — reps losing deals for lack of proof, a demo that ends with "send me something I can show my boss" — is losing revenue every week the sequence waits on a full brand platform. If `bdzGetProjectToneOfVoice` already returns a filled object (`state: PROJECT_TONE_OF_VOICE_STATE_SUCCESS`), even an imperfect one, that's foundation enough — route straight to `case-study`. Reserve a full `brand-platform` pass for when the tone-of-voice check comes back empty, or the client names a real reason the existing voice no longer fits (a pivot, a rebrand, a new ICP) — not for polishing a voice that already works well enough to write against. Revisiting brand-platform on a schedule rather than on one of those signals is busywork dressed up as rigor.

**A goal is not an idea.** Don't queue `content-strategy` or an execution sub-skill on a stated goal alone ("we want more inbound," "we need a social presence"). Ask what the client actually knows that their market doesn't — a finding from their own data, a stance the industry avoids, a customer pattern they've seen repeatedly. A content stack built to fill a calendar produces volume nobody reads; one built around something worth saying produces the compounding this Master exists to sequence toward. If nothing surfaces in intake, say so in the session plan rather than queuing sub-skills against an empty goal — a queue is not a substitute for having something to say.

---

## Orchestration Protocol

**Step 1 — Foundation check.** Does a brand platform exist? Does a content strategy exist? If either is missing, start there. Execution without foundation is expensive and inconsistent.

**Step 2 — Goal-to-channel mapping.** Map the content goal to the right channel mix. Not all goals require all channels.

**Step 3 — Queue sub-skills** (max 4 per session, and size it down from there). 4 is a ceiling, not a target: it assumes a team that can act on 4 outputs in parallel. A one-person content function — often a founder or a single marketer — can usually carry one foundation piece and one execution piece at a time; queuing all 4 against them isn't ambitious, it's a plan that won't get executed. Cut the queue to what the bandwidth answer from intake can actually turn into published content, then order it: foundation → strategy → execution → distribution.

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
Exists: [Brand platform / Content strategy / Case studies / Social / Video / Design — grounded in the OS Diagnosis where available, self-reported otherwise]
Missing: [What gaps need to be filled]

## Goal-to-Channel Map
[Primary goal] → [Primary channel] → [Content format]

## Sub-Skill Queue
1. /[skill] — [what it builds] — output: [deliverable]
2. /[skill] — [what it builds] — output: [deliverable]
3. /[skill] — [what it builds] — output: [deliverable]

## Primary Content Metric
[Metric]: [current baseline — from bdzGetCmsTrafficReport or bdzListLinkedInPosts when available, self-reported otherwise] → [90-day target]
```

---

## Rules

- **Brand before content.** A blog without a brand platform is a set of disconnected articles. A brand platform without a blog is a foundation ready to build on. Always build the foundation first.
- **Strategy before calendar.** A content calendar without a strategy is a schedule for creating noise. The strategy defines what to say; the calendar defines when. Don't reverse the order.
- **Case studies before thought leadership.** Social proof outperforms thought leadership in a sales process. If no case studies exist, build those before investing in brand content.
- **Match format to ICP consumption habits.** A VP Engineering reads long-form technical content. A CMO at a $50M company consumes LinkedIn and 3-minute videos. Don't produce content your ICP doesn't consume.
- **Check before asking.** Bulldozer OS already holds brand voice, CMS content, traffic, and recorded interviews for the project — run the OS Diagnosis before trusting a self-reported "we have a blog" or "we have no case studies."
- **A publishing date in the queue is a reminder, not automation.** Bulldozer OS's only native social publishing tool (`bdzCreateLinkedInPost`) posts to the feed immediately when called — there's no scheduled or draft mode. If a sub-skill's output assigns future dates to posts (a content calendar, a LinkedIn posting cadence), those dates are for whoever runs the program to act on that day; the OS will not publish anything on its own on that date.
- **A founder-led engine is a single point of failure.** `founder-content` compounds fast because it's personal, but the founder's time is the first thing a hard quarter takes away — a demo pipeline in trouble always wins over a LinkedIn post. Never queue `founder-content` as the only engine; pair it with at least one channel that doesn't depend on the founder's calendar, so the program survives the weeks the founder can't show up. A shared LinkedIn connector (see OS Diagnosis) removes the copy-paste bottleneck on *publishing* — the operator can post through the founder's account directly — but it doesn't remove the founder as the source of the material itself; the program still stalls the week the founder has nothing left to say.
- **Don't build volume on a positioning that's still moving.** Case studies, pillar content, and social proof all encode a claim about who the product beats and why. If the OS Diagnosis shows market positioning or value proposition missing, still running, or explicitly mid-revision, that's a reason to queue one case study, not a full execution push — content built on a claim that's about to change gets rewritten, not reused.