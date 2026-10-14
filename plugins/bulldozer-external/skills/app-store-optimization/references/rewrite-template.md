# Rewrite output template

Called from `SKILL.md`, "Output: Rewrites". Produce ready-to-use rewrites for every metadata field, with rationale, in this shape:

```
## Title (current → rewrite)
Current: MyApp
Rewrite: MyApp — Task Manager (28/30 chars)
Rationale: Adds primary keyword "task manager" which gets [volume] monthly searches

## Subtitle (current → rewrite)
Current: Manage your tasks easily
Rewrite: Organize Projects & Beat Deadlines (36/30 chars — trim to fit)
Rationale: Surfaces "organize projects" and "deadlines" — not in title, both in keyword field

## Keywords field (current → rewrite)
Current: tasks,todo,productivity
Rewrite: todo list,planner,daily planner,reminder,habit tracker,schedule,agenda
Rationale: Eliminates "tasks" (in title), adds 6 additional terms with search volume
```
