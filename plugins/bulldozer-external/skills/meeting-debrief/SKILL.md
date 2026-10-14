---
name: |-
  meeting-debrief
description: |-
  Turn a meeting transcript or recording into a structured 1-page debrief — decisions logged, action items with owners and deadlines, and a push to Notion and Slack. Triggers on 'debrief this meeting,' 'meeting summary,' 'extract action items from transcript,' 'write up the meeting,' 'meeting notes from Claap,' or 'what did we decide.' For full sales call analysis and pipeline intelligence, see pipeline-deal-review. For customer interview synthesis, see customer-research.
when-to-use: |-
  Turn a meeting transcript or recording into a structured 1-page debrief — decisions logged, action items with owners and deadlines, and a push to Notion and Slack. Triggers on 'debrief this meeting,' 'meeting summary,' 'extract action items from transcript,' 'write up the meeting,' 'meeting notes from Claap,' or 'what did we decide.' For full sales call analysis and pipeline intelligence, see pipeline-deal-review. For customer interview synthesis, see customer-research.
argument-hint: |-
  Claap transcript from a 1-hour strategy meeting with the exec team. Need a 1-pager with decisions, action items (owner + deadline), and key context. Push to the #exec-sync Slack channel and create a Notion page in the Meeting Notes database.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Meeting Debrief

> This is a Bulldozer skill. Manual meeting notes cost 20-45 minutes per meeting and still miss half the action items. For a team running 10 meetings per week, that's 200-450 minutes of administrative work per week that produces a document nobody reads because it arrived too late and lacked the right structure. This skill eliminates that gap: transcript in, structured debrief out, pushed to the right places, in under 2 minutes.

You are a Bulldozer operator turning meeting recordings and transcripts into structured, actionable debriefs. Your job is to extract what matters — decisions made, actions assigned, context captured — and push it to the team before the next meeting starts.

## Input

`$ARGUMENTS` — transcript or recording source (Claap URL, pasted transcript, or file path), meeting type, Notion database and Slack channel targets. If not provided, read any transcript or recording in the current context. Ask once only if the transcript source cannot be found.

A Claap recording is scoped to a workspace: if the connected account has more than one, resolve which one the recording belongs to before pulling the transcript — never assume the first one found.

When the meeting is tied to a specific deal, resolve the recording through that deal (`get_recordings`, `filters.dealId`) rather than a title search. Meeting titles like "Kickoff call" or "Weekly sync" repeat across dozens of client accounts in the same workspace — a title-only search can just as easily hand back the wrong client's recording as the right one.

## Output

A `debrief-{meeting-slug}-{date}.md` structured debrief, plus a Slack-formatted version posted to the target channel and a Notion page created in the target database.

**Produce on first invocation from whatever transcript is available. Do not ask for the transcript if it is in the context.**

---

## Why Meeting Follow-Through Fails

The gap between a productive meeting and actual progress is the admin layer in between. When it's manual, three things go wrong:

**Delayed notes.** Notes written 24-48 hours after a meeting rely on memory that's already degraded. Decisions get softened, context gets lost, and action items get assigned to whoever the note-taker remembers most clearly — not necessarily the right person.

**No attribution.** "We agreed to move forward with X" is not an action item. "Jordan will finalize the pricing deck and share with the team by Thursday EOD" is. The difference is owner and deadline. Without both, the action item doesn't exist in practice.

**Wrong destination.** Meeting notes in someone's personal Notion or a doc nobody bookmarks don't exist for the team. The debrief must land in the place the team already uses — the project channel in Slack, the shared database in Notion — within 2 hours of the meeting ending.

---

## Meeting Type Templates

Different meeting types produce different extraction priorities. Five types, each with its own priority order: Strategic / Exec Sync (decisions > context > actions), Sales Call / Discovery (customer signals > next steps > risk flags), Project / Sprint Review (status updates > blockers > action items), 1:1 (coaching signals > commitments > feedback captured), Customer Success / QBR (health signals > expansion signals > follow-up commitments).

Read `references/meeting-type-templates.md` for the extraction questions specific to each type — including the single-threaded-contact escalation rule for Sales Call / Discovery — before writing the debrief.

---

## Extraction Framework

For every transcript, extract these four layers:

**Layer 1 — Decisions**
Statements of the form "we decided," "we agreed," "let's go with," "the call is," or any definitive choice made. Include the reasoning if the speaker gave it — context is what prevents decisions from being relitigated, and include who made or approved the call — a decision nobody can be attributed to is a rumor, not a record.

Format:
```
✅ DECISION: [What was decided]
Decided by: [Name of the person who made or approved the call. If it was a genuine group consensus, say so explicitly — never default to "the team" just because no one in particular spoke up]
Context: [Why this was chosen over alternatives, if stated]
```

**Layer 2 — Action Items**
Every commitment made by a named person with an implied or explicit deadline. Extract from statements like "I'll handle," "can you take care of," "let's make sure [name] does X by."

Format:
```
☐ ACTION: [What needs to happen]
Owner: [Name]
Deadline: [Date or relative — "by EOD Friday" → convert to actual date]
```

**Deadline inference rule:** If no deadline is stated, infer from context (next meeting date, project milestone, stated urgency). Mark inferred deadlines with `[inferred]`. Never leave deadline blank — an action item with no deadline is a wish.

**Exception — commitments owned outside the room.** This rule bends when the action belongs to someone who wasn't on the call: a prospect getting internal budget sign-off, a partner returning a signed contract, a customer's IT team provisioning access. Inventing a deadline for someone else's commitment isn't a debrief anymore, it's a promise nobody made. Log it as an open question — what you're waiting on, and who owns confirming it — instead of a deadline pulled out of the air.

**Layer 3 — Open Questions**
Topics raised but not resolved. Things the team needs to come back to.

Format:
```
❓ OPEN: [Question or issue not resolved]
Owner to resolve: [Name or "team"]
```

**Layer 4 — Key Context**
Information shared in the meeting that would confuse someone reading the debrief cold — background context, assumptions, references to documents or external events. Keep short; include only what's needed for the decisions and actions to make sense.

---

## 1-Page Debrief Format

```markdown
# Meeting Debrief: [Meeting Title]
Date: [Date] | Duration: [X min] | Attendees: [Names]
Type: [Strategic / Sales / Project / 1:1 / QBR]

---

## Summary
[2-4 sentence executive summary of what happened and why it matters. Written for someone who wasn't there and has 30 seconds.]

---

## Decisions
[Decision entries]

## Action Items
[Action entries, sorted by deadline]

## Open Questions
[Open question entries]

## Context
[Key background only — keep under 100 words]

---
*Generated from Claap recording [URL if available] | [Date and time]*
```

---

## Slack Push Format

The Slack message is a compressed version of the debrief — designed for a channel, not for a doc reader. The exact layout is in `references/output-templates.md` (Slack Debrief Template).

**Slack formatting rules:**
- Tag owners by Slack handle when identifiable (infer from names if the team is small)
- Keep action items to one line each — no elaboration in Slack
- Always include the Notion link — the Slack message surfaces to the team, the Notion page is where they act
- Resolve the target channel to its real ID first (a channel search, not the typed name) — posting needs the ID, and the same channel name can exist in more than one workspace
- **Sending and drafting are not interchangeable, and the choice isn't about preference.** Posting directly favors speed over review, which is the right trade for an internal team channel: the cost of a wrong inferred owner is a two-second correction in front of people who already read debriefs critically. That trade flips the moment anyone outside the company sits in the channel — a client or partner reads an inferred owner or an `[inferred]` deadline as a commitment, not a guess. For any channel shared with someone outside the company, create a draft instead of sending and let a person confirm and send it themselves from Slack.
- **A channel shared externally (Slack Connect) can refuse the post outright — that's a wall, not a retry-able error.** Sending to it fails by design, independently of the review question above. Don't loop on it or invent a workaround (posting to a different channel, splitting the message): say plainly that the target channel can't receive it and hand the debrief to the user to place themselves.
- **Only one draft can be attached to a channel at a time.** A second draft on the same channel fails (`draft_already_exists`) — if a retry is needed, don't create another draft blind; check whether the earlier one is still sitting there first. Other failures to expect and surface plainly rather than retry into: `channel_not_found`, `not_in_channel` (the connected account needs to already be a member with write access to that channel).
- **If the finalized debrief later goes out through the skill itself rather than being sent by the reviewer from Slack, close out the draft it replaces.** Pass that same draft's identifier to the send call so it gets deleted as part of sending — otherwise it keeps sitting in Drafts & Sent, and the next debrief for that channel hits `draft_already_exists` before it even starts.

---

## Notion Push Format

Create a page in the target database with:
- Title: `[Meeting Title] — [Date]`
- Properties: Date, Meeting Type, Attendees, Status (default: "Needs review")
- Body: Full 1-page debrief content
- Embed Claap recording link at the top if a Claap URL is available

Database matching: Bulldozer's own Notion does not keep one shared "Meeting Notes" database — meeting notes live nested inside each client's mission space, and several missions each have their own page or database that is literally titled "Meeting notes." Picking "the most recently updated" match across the whole workspace risks filing a debrief under the wrong client. If no destination is named, search scoped to the current project or mission (its name, not a generic keyword) and confirm the match belongs to that mission before writing. If the match stays ambiguous, don't guess: create the page as an explicit private draft and tell the user where it landed, so they can move it themselves — that's safer than silently attaching it to the wrong client's space.

Finding a prior debrief in the same series (for the carried-over action item rule below) means searching that same mission-scoped "Meeting notes" destination — never the meeting-notes lookup tool that returns only the connected user's own meetings (attendee or creator). That tool has no mission or project filter at all, so it can just as easily come back empty (a teammate logged the earlier debrief without inviting this account) as it can mix in an unrelated mission the connected account happens to attend. Treat an empty result from it as "not checked," not as "no prior debrief exists."

---

## Quality Checks Before Pushing

Before generating output, verify:

| Check | Pass condition |
|-------|---------------|
| Every action item has an owner | No "TBD" or "team" owners — assign to the most likely person if unclear, mark `[inferred]` |
| Every action item has a deadline | Infer from context if not stated; mark `[inferred]` |
| Every decision has a name attached | Not "the team decided" by default — name who made or approved the call, or mark `[inferred]` if the transcript implies it without saying so directly |
| Decisions capture the reasoning | "We decided X" without context will be relitigated. Add "because Y" if the reasoning was stated |
| Summary is stand-alone | Read the summary without the rest of the debrief. Does it communicate what happened and what changed? If not, rewrite |
| No raw transcript leakage | The debrief should read as a structured document, not as cleaned-up notes |

---

## Rules

- **Action items without owners are wishes.** If a commitment was made but not attributed to a person, assign it to the most likely owner based on role and context. Mark it `[inferred]` so the team can correct it. Do not leave it as "team" or "TBD."
- **Push within 2 hours.** Debriefs that arrive the next morning have already lost context. A debrief that lands in Slack before the team leaves the call captures attention when alignment is highest — for an internal channel, push it directly rather than waiting on a review step. That default reverses for any channel with someone outside the company in it (see Slack Push Format): draft it and let a person confirm before it goes out, even if that costs the two-hour window.
- **Decisions need context.** A decision without reasoning will be relitigated at the next meeting by someone who wasn't in the room. The context field is not optional.
- **A decision with no name on it is a rumor.** "The team decided to move forward with X" tells no one who actually had the authority to make that call, and it reads as consensus even when it wasn't one. Name the person who made or approved the decision the same way an action item gets a named owner — mark it `[inferred]` if the transcript implies who but never says so directly, and say "consensus" explicitly rather than defaulting to "the team" when no one in particular is on the hook.
- **Never output "please review and edit."** The debrief should be usable as-is. If assumptions were made, mark them `[inferred]`. The team can correct inferences; they cannot fix a debrief that asks them to do the work.
- **Separate what was decided from what was discussed.** Discussion is context. Decision is outcome. A long discussion with no decision logged is a wasted meeting that will repeat itself.
- **A next step needs a date and a name, or it isn't one.** "We'll follow up" or "they'll think it over and get back to us" is a stall dressed as progress. Log it as an Open Question, never as a next step, until both are attached — inventing either just moves the same stall one layer down, where it's harder to see.
- **Disagreement in the room stays in the debrief.** If a decision passed over real pushback, or without the buy-in of someone whose job is affected by it, that's exactly the context the next meeting needs. Writing "the team aligned on X" over a decision that was actually contested erases the one thing a manager reading cold would want to know before it resurfaces as a conflict later.
- **A carried-over action item is a signal, not a repeat.** If a previous debrief for the same meeting series or deal is available and an action item shows up unresolved for a second or third straight time, don't just log it again identically — name it as stalled and note it explicitly, so it reads differently from a fresh item. A rule that has been open three times running needs a decision about the rule, not a fourth restatement of it.