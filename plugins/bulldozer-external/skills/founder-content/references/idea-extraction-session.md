# Idea Extraction Session — Prompts

```
Warm-up (5 min):
- What's the most interesting thing you saw or heard this week related to [category]?
- What's a piece of conventional wisdom in your space you've stopped believing?

Pillar 1 — Category problem (15 min):
- What mistake are your customers making right now that you wish you could fix for free?
- What would you tell a smart first-time [ICP role] who just started their job?
- What do prospects misunderstand about your category that costs them before they find you?

Pillar 2 — Building-in-public (15 min):
- What's a decision you made in the last 30 days that you'd make differently now?
- What surprised you about a customer interaction this month?
- What did you learn the hard way that you'd tell a founder 6 months behind you?

Pillar 3 — Contrarian takes (10 min):
- What advice do you hear in your industry that you think is actually harmful?
- What's a metric that everyone tracks that you've stopped caring about?
- What's a trend that everyone is excited about that you're skeptical of?
```

**Record it properly.** If Claap is available, record the session there rather than an ad-hoc call — it keeps a searchable transcript instead of a memory of the conversation. Attach the recording with `bdzAddWorkspaceLink` (type Claap) so the next extraction session, or anyone pulling ideas for a different pillar, can find it instead of re-asking the founder the same questions. One thing to get right: this isn't a per-project workspace. `bdzAddWorkspaceLink`, `bdzListWorkspaceLinks` and `bdzListWorkspaces` key off `customerId` and `workspaceId` only — no project field exists on any of them — and a customer gets exactly one shared workspace (verified directly: `bdzListWorkspaces` on a real customer returns a single workspace, not one per project). Check `bdzListWorkspaceLinks` before concluding no material exists: on a customer running several projects, the recording could already be sitting there from a different one, filed under that same shared workspace.
