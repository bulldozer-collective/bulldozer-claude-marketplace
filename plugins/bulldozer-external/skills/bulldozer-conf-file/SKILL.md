---
name: bulldozer-config
description: Manages the bulldozer.json configuration file shared across Bulldozer skills, agents, and MCP tools — handling its creation, validation, and lookup.
when-to-use: |
  Use this skill when the user refers to the bulldozer config file, when bulldozer.json is encountered, or when other Bulldozer skills or MCP tools need configuration values.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
effort: low
paths:
  - bulldozer.json
  - .gitignore
---

# Bulldozer Config File

The `bulldozer.json` file stores configuration and identifiers shared across all Bulldozer skills, agents, and MCP tool calls. When the Bulldozer plugin is enabled, this file should be present at the root of the project (where the user started the Claude session).
Always read the `bulldozer-choose-project-id` and `bulldozer-choose-customer-id` skill. They have crucial information.

## Lifecycle

### When the file is present and valid
Read the file and return the relevant fields requested by the calling skill or context. No further action is needed.

### When the file is missing
Warn the user and offer two choices:

1. **Provide a path** to an existing `bulldozer.json` file to use instead. Record this path in the conversation context (state it explicitly in your response so subsequent tool calls in the same session can refer back to it) and use it for the remainder of the session.
2. **Create a new `bulldozer.json` file** at the project root.

When creating a new file:
- Ask the user for their customer ID, which **must be a valid UUID v4**.
- Validate the input against this regex: `^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$` (case-insensitive). If it does not match, explain the format and re-prompt.
- Write the file at the project root with default permissions (the file may contain sensitive identifiers, so do not make it world-readable; on POSIX systems prefer `0600`).
- If the project is a git repository (a `.gitignore` exists or `.git/` is present), ensure `bulldozer.json` is gitignored. The file is excluded from version control because the `customerId` and other keys other skills may add are tenant-specific identifiers that should not be shared. Implement this idempotently:
  - If `.gitignore` does not exist, create it containing `bulldozer.json`.
  - If `.gitignore` exists, check whether a line matching `bulldozer.json` is already present; only append it if absent.

### When the file is corrupted (invalid JSON)
Warn the user that `bulldozer.json` cannot be parsed. **Do not delete it automatically.** Offer to:

1. Back up the corrupted file (e.g., copy to `bulldozer.json.bak`) so the user can attempt manual recovery of any custom keys other skills may have written.
2. After backup, create a fresh `bulldozer.json` following the creation flow above.

Only proceed once the user confirms.

## Format

`bulldozer.json` must be a valid JSON object. The only required field is `customerId` at the root. Other keys are defined and managed by individual Bulldozer skills.

### Minimal example

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Example with additional skill-managed keys

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "someOtherSkill": {
    "setting": "value"
  }
}
```

When reading or modifying the file on behalf of another skill, preserve all unknown top-level keys.
