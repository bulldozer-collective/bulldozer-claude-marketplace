---
name: |
  bulldozer-customer-id-chooser
description: |
  Resolves the customerId parameter required for Bulldozer MCP server interactions by checking conversation history and the project's bulldozer.json configuration file.
when-to-use: |
  When a Bulldozer MCP tool requires a `customerId` parameter and one is not already known or provided in the current turn.
allowed-tools:
  - Read
effort: |
  low
paths:
  - bulldozer.json
---

# Bulldozer Customer ID Chooser

Use this skill whenever a Bulldozer MCP tool call requires a `customerId` parameter and you do not already have one for the current turn.

## Lookup Procedure

Resolve the `customerId` by checking the following sources **in order**, stopping at the first successful match:

1. **Explicit user input in the current turn** — if the user just provided a `customerId`, use it directly.
2. **Conversation history** — scan prior messages for a previously-used `customerId`. If multiple distinct candidates appear, prefer the most recent one and confirm it with the user before proceeding.
3. **`bulldozer.json` at the project root** — read the file and use the value of the `customerId` key.

## Expected `bulldozer.json` Shape

```json
{
  "customerId": "cust_abc123"
}
```

## Edge Cases & Fallbacks

- **File does not exist:** Invoke the `bulldozer-config-creator` skill (the dedicated skill responsible for creating `bulldozer.json`) to create it, then re-run the lookup.
- **File exists but is malformed JSON:** Warn the user that `bulldozer.json` is corrupted and ask whether they want to re-create it via the `bulldozer-config-creator` skill. Do not attempt to silently overwrite it.
- **File exists and is valid JSON but `customerId` key is missing or empty:** Warn the user that `bulldozer.json` is missing the `customerId` field and needs to be re-created, then offer to invoke `bulldozer-config-creator`.
- **No source yields a `customerId`:** Prompt the user directly for the `customerId` rather than failing silently. Once provided, offer to persist it via `bulldozer-config-creator`.

## Notes

- This skill is read-only; persisting a new `customerId` is delegated to `bulldozer-config-creator`.
- Always confirm with the user before using a `customerId` inferred from ambiguous history.
