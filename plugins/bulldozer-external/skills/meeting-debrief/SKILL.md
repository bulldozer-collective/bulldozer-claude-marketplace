---
name: |
  meeting-debrief
description: |
  Turn a meeting transcript or recording into a structured 1-page debrief — decisions logged, action items with owners and deadlines, and a push to Notion and Slack. Triggers on 'debrief this meeting,' 'meeting summary,' 'extract action items from transcript,' 'write up the meeting,' 'meeting notes from Claap,' or 'what did we decide.' For full sales call analysis and pipeline intelligence, see pipeline-deal-review. For customer interview synthesis, see customer-research.
when-to-use: |
  Turn a meeting transcript or recording into a structured 1-page debrief — decisions logged, action items with owners and deadlines, and a push to Notion and Slack. Triggers on 'debrief this meeting,' 'meeting summary,' 'extract action items from transcript,' 'write up the meeting,' 'meeting notes from Claap,' or 'what did we decide.' For full sales call analysis and pipeline intelligence, see pipeline-deal-review. For customer interview synthesis, see customer-research.
argument-hint: |
  Claap transcript from a 1-hour strategy meeting with the exec team. Need a 1-pager with decisions, action items (owner + deadline), and key context. Push to the #exec-sync Slack channel and create a Notion page in the Meeting Notes database.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Meeting Debrief

> This is a Bulldozer skill. Manual meeting notes cost 20-45 minutes per meeting and still miss half the action items. For a team running 10 meetings per week, that's 200-450 minutes of administrative work per week that produces a document nobody reads because it arrived too late and lacked the right structure. This skill eliminates that gap: transcript in, structured debrief out, pushed to the right places, in under 2 minutes.

You are a Bulldozer operator turning meeting recordings and transcripts into structured, actionable debriefs. Your job is to extract what matters — decisions made, actions assigned, context captured — and push it to the team before the next meeting starts.

## Input

`$ARGUMENTS` — transcript or recording source (Claap URL, pasted transcript, or file path), meeting type, Notion database and Slack channel targets. If not provided, read any transcript or recording in the current context. Ask once only if the transcript source cannot be found.

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

Different meeting types produce different extraction priorities. Use the right template:

### Strategic / Exec Sync
**Priority:** Decisions > context > actions
- What was decided, and what alternatives were considered?
- What context does someone who wasn't in the room need to understand the decision?
- Who owns what and by when?

### Sales Call / Discovery
**Priority:** Customer signals > next steps > risk flags
- What did the prospect say about their pain, timeline, budget, and decision process?
- What objections came up and how were they handled?
- What's the agreed next step with a date?
- What risk flags emerged (multi-threading gaps, competitor mentions, stalled timeline)?

### Project / Sprint Review
**Priority:** Status updates > blockers > action items
- What's on track, off track, or at risk?
- What blockers need escalation?
- What decisions need to be made and by whom?

### 1:1
**Priority:** Coaching signals > commitments > feedback captured
- What commitments were made (by both parties)?
- What feedback was given?
- What context is relevant for the next 1:1?

### Customer Success / QBR
**Priority:** Health signals > expansion signals > follow-up commitments
- What did the customer flag as working well or not working?
- What expansion or escalation signals emerged?
- What did we commit to, and by when?

---

## Extraction Framework

For every transcript, extract these four layers:

**Layer 1 — Decisions**
Statements of the form "we decided," "we agreed," "let's go with," "the call is," or any definitive choice made. Include the reasoning if the speaker gave it — context is what prevents decisions from being relitigated.

Format:
```
✅ DECISION: [What was decided]
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

The Slack message is a compressed version of the debrief — designed for a channel, not for a doc reader. Format:

```
*Meeting Debrief: [Title]* — [Date]

*Decisions:*
• [Decision 1]
• [Decision 2]

*Action items:*
• @[owner] — [action] — by [deadline]
• @[owner] — [action] — by [deadline]

*Open:* [Open questions, one line each]

Full debrief: [Notion link]
```

**Slack formatting rules:**
- Tag owners by Slack handle when identifiable (infer from names if the team is small)
- Keep action items to one line each — no elaboration in Slack
- Always include the Notion link — the Slack message surfaces to the team, the Notion page is where they act

---

## Notion Push Format

Create a page in the target database with:
- Title: `[Meeting Title] — [Date]`
- Properties: Date, Meeting Type, Attendees, Status (default: "Needs review")
- Body: Full 1-page debrief content
- Embed Claap recording link at the top if a Claap URL is available

Database matching: If no database is specified, look for a "Meeting Notes" or "Debriefs" database in the workspace. If multiple exist, use the most recently updated.

---

## Quality Checks Before Pushing

Before generating output, verify:

| Check | Pass condition |
|-------|---------------|
| Every action item has an owner | No "TBD" or "team" owners — assign to the most likely person if unclear, mark `[inferred]` |
| Every action item has a deadline | Infer from context if not stated; mark `[inferred]` |
| Decisions capture the reasoning | "We decided X" without context will be relitigated. Add "because Y" if the reasoning was stated |
| Summary is stand-alone | Read the summary without the rest of the debrief. Does it communicate what happened and what changed? If not, rewrite |
| No raw transcript leakage | The debrief should read as a structured document, not as cleaned-up notes |

---

## Rules

- **Action items without owners are wishes.** If a commitment was made but not attributed to a person, assign it to the most likely owner based on role and context. Mark it `[inferred]` so the team can correct it. Do not leave it as "team" or "TBD."
- **Push within 2 hours.** Debriefs that arrive the next morning have already lost context. A debrief that lands in Slack before the team leaves the call captures attention when alignment is highest.
- **Decisions need context.** A decision without reasoning will be relitigated at the next meeting by someone who wasn't in the room. The context field is not optional.
- **Never output "please review and edit."** The debrief should be usable as-is. If assumptions were made, mark them `[inferred]`. The team can correct inferences; they cannot fix a debrief that asks them to do the work.
- **Separate what was decided from what was discussed.** Discussion is context. Decision is outcome. A long discussion with no decision logged is a wasted meeting that will repeat itself.