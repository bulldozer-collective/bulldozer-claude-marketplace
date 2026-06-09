---
name: |
  bulldozer-project-chooser
description: |
  Choose and persist a Bulldozer customerId/projectId pair for use with Bulldozer MCP servers.
when-to-use: |
  Use this skill whenever a Bulldozer MCP tool call requires a `projectId` (and associated `customerId`) parameter and one has not already been determined. Typical triggers: the user invokes a Bulldozer MCP tool without specifying a project, or a previous tool call failed because `projectId`/`customerId` was missing. Not needed if the user has explicitly provided a project ID in the current turn.
allowed-tools:
  - Read
  - Write
  - mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships
effort: |
  low
paths:
  - "bulldozer.json"
---

# Bulldozer Project / Customer Chooser

Most Bulldozer MCP tools need a `(customerId, projectId)` tuple.
This skill resolves both values by checking known sources in order, prompting the user only when necessary, and persisting the choice for future runs.

## Data model

A user can have 0 or more `ProjectMembership`. Each membership exposes (at least) a `customerId`, a `projectId`, and a project display name. To list the current user's memberships, call `mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships`.

If a user has **no** project memberships, gently tell them they have access to no Bulldozer data and end the conversation without writing any file.

## Resolution order

When a `(customerId, projectId)` tuple is required, try these sources in order and stop at the first success:

1. **Conversation context.** If the user has explicitly stated both IDs in the current conversation (e.g., "use project `abc123` for customer `cus_xyz`") or they were returned by a recent tool call in this session, use those values directly.
2. **`bulldozer.json` at the project root.** Read the file and look for top-level `customerId` and `projectId` keys. The expected shape is:

   ```json
   {
     "customerId": "cus_xyz",
     "projectId": "prj_abc123"
   }
   ```

   Both keys must be present and non-empty for this source to be considered a success. If only one is present, treat it as a partial hit and continue to step 3 to resolve the missing value (and re-persist the complete tuple).
3. **Ask the user (after listing memberships).** If neither source yields a complete tuple, call `mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships` and use the result as described in "Prompting the user" below.

## Handling `bulldozer.json`

- **File does not exist:** Skip to step 3. After the user chooses, create the file with both `customerId` and `projectId`.
- **File exists but is malformed JSON:** Do not overwrite blindly. Report the parse error to the user and ask whether to repair/replace it.
  - If the user agrees to replace it, continue to step 3 and overwrite the file with a fresh `{ "customerId": "...", "projectId": "..." }` object.
  - If the user declines, abort the skill without writing anything and report that no project could be resolved.
- **File exists but is missing `customerId`, `projectId`, or both:** Skip to step 3 for the missing parts. When writing, **merge** the resolved values into the existing object — preserve all other keys.
- **File exists with both keys:** Use them. See the validation section below for handling stale values.

## Validating a cached tuple (recommended)

If you have time/budget, after reading `customerId`/`projectId` from `bulldozer.json`, call `mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships` once and confirm that a membership exists whose `(customerId, projectId)` matches the cached tuple.

- If a matching membership is found, use the cached tuple.
- If no matching membership is found, treat the cached tuple as stale, discard it, and proceed to the prompting step. Overwrite the stored values with the newly chosen tuple.

This validation step is the only mechanism this skill uses to detect staleness — do not attempt to react to unrelated downstream tool failures.

## Prompting the user

When you must ask the user to choose:

1. Call `mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships`.
2. Branch on the number of memberships returned:
   - **Zero memberships:** Tell the user they have no Bulldozer projects available and end the conversation. Do not write `bulldozer.json`.
   - **Exactly one membership:** Auto-select it without prompting. Briefly inform the user which project was chosen.
   - **Two or more memberships:** Present the list with an incrementing number, the project name, and the project ID, e.g.:

     ```
     1. Acme Website (id: prj_abc123)
     2. Internal Tools (id: prj_def456)
     3. Mobile App (id: prj_ghi789)
     ```

     Ask the user to reply with the number of the project they want to use, then map the chosen number back to its membership.
3. From the selected membership, extract both `customerId` and `projectId`.

## Persisting the choice

After a tuple has been resolved (whether by auto-selection or explicit choice):

- If `bulldozer.json` does not exist, create it with `{ "customerId": "<chosen-customer-id>", "projectId": "<chosen-project-id>" }`.
- If it exists, read it, set/replace both the `customerId` and `projectId` keys, and write it back so all other existing keys are preserved.
- Confirm the result to the user in a single short message that includes:
  - the path written (e.g., `bulldozer.json`),
  - the chosen project name (if known),
  - the chosen `customerId` and `projectId`.

  Example: `Saved selection to bulldozer.json — project "Acme Website" (customerId: cus_xyz, projectId: prj_abc123).`
