---
name: |
  bulldozer-project-chooser
description: |
  Choose and persist a Bulldozer project identifier for use with Bulldozer MCP servers.
when-to-use: |
  Use this skill whenever a Bulldozer MCP tool call requires a `projectId` parameter and one has not already been determined. Typical triggers: the user invokes a Bulldozer MCP tool without specifying a project, or a previous tool call failed because `projectId` was missing. Not needed if the user has explicitly provided a project ID in the current turn.
allowed-tools:
  - Read
  - Write
  - mcp__plugin_bulldozer_bulldozer__listProjects
effort: |
  low
paths:
  - bulldozer.json
---

# Bulldozer Project Chooser

Resolve a `projectId` for Bulldozer MCP server calls by checking known sources in order, prompting the user only when necessary, and persisting the choice for future runs.

## Resolution order

When a `projectId` is required, try these sources in order and stop at the first success:

1. **Conversation context.** If the user has explicitly stated a project ID in the current conversation (e.g., "use project `abc123`") or it was returned by a recent tool call in this session, use that value directly.
2. **`bulldozer.json` at the project root.** Read the file and look for a top-level `projectId` key. The expected shape is:

   ```json
   {
     "projectId": "abc123"
   }
   ```

   (Note: the key is `projectId` at the root of the JSON object — there is no leading dot in the actual key.)
3. **Ask the user.** If neither source yields a value, call `mcp__plugin_bulldozer_bulldozer__listProjects` and prompt the user to pick one (see below).

## Handling `bulldozer.json`

- **File does not exist:** Skip to step 3. After the user chooses, create the file with `{ "projectId": "<chosen-id>" }`.
- **File exists but is malformed JSON:** Do not overwrite blindly. Report the parse error to the user and ask whether to repair/replace it before writing.
- **File exists but has no `projectId` key:** Skip to step 3. When writing, **merge** the new `projectId` into the existing object — preserve all other keys.
- **File exists with a `projectId`:** Use it. Optionally, if a subsequent MCP call fails because the ID is unknown/stale, fall back to step 3 and overwrite the stored value.

## Validating a cached `projectId` (recommended)

If you have time/budget, after reading `projectId` from `bulldozer.json`, call `mcp__plugin_bulldozer_bulldozer__listProjects` once and confirm the cached ID still appears. If it does not, treat it as missing and proceed to step 3.

## Prompting the user

When you must ask the user to choose:

1. Call `mcp__plugin_bulldozer_bulldozer__listProjects`.
2. Present the list with an incrementing number, the project name, and the project ID, e.g.:

   ```
   1. Acme Website (id: prj_abc123)
   2. Internal Tools (id: prj_def456)
   3. Mobile App (id: prj_ghi789)
   ```

3. Ask the user to reply with the number of the project they want to use.
4. Map the chosen number back to its `projectId`.

## Persisting the choice

After the user chooses:

- If `bulldozer.json` does not exist, create it with `{ "projectId": "<chosen-id>" }`.
- If it exists, read it, set/replace the `projectId` key, and write it back so all other existing keys are preserved.
- Confirm to the user which project was selected and stored.
