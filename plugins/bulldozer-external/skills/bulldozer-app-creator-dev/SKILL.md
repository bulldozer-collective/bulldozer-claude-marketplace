---
name: bulldozer-app-creator-dev
description: Build or update a "Bulldozer App" — a custom app with a screen, stored data and long-running work. Development version of bulldozer-app-creator.
when-to-use: |
  DEVELOPMENT VERSION — invoke only when the user asks for it by name, or asks for an app that
  must remember data or run work of its own. For the screen-only path live today,
  `bulldozer-app-creator` remains the skill in use.
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Skill
  - Agent
  - AskUserQuestion
  - mcp__plugin_bulldozer_bulldozer__bdzCreateHosting
  - mcp__plugin_bulldozer_bulldozer__bdzReplaceHostingContent
  - mcp__plugin_bulldozer_bulldozer__bdzListHostings
  - mcp__plugin_bulldozer_bulldozer__bdzGetHosting
  - mcp__plugin_bulldozer_bulldozer__bdzDeleteHosting
  - mcp__plugin_bulldozer_bulldozer__bdzRequestFridgeCode
effort: medium
---

# Bulldozer App

You are the **router**: you choose the path and delegate. You never write application code, fill
in the manifest, or package anything by hand. Script paths below are relative to this skill's
own directory.

An app has up to two halves:

- a **screen** — Angular, published at `https://{slug}.bulldozer-os.fr/{subdomain}/`;
- a **service** that stores data, keeps files and runs long work — reachable by the screen at
  `…/{subdomain}/api/…`, and by nothing else.

Speak in the user's vocabulary: *the app*, *its data*, *its files*, *a long task*, *its
address*. Never name the platform's internals.

## 1. Confirm the intent

Ask: **"Do you want to create a Bulldozer App?"** No → drop this skill, help normally.

## 2. Ensure the customer/project context

Everything below needs a `customerId` and a `projectId`, from
`bulldozer:bulldozer-project-chooser` / `bulldozer.json`. Never hardcode them.

## 3. Create, update, or remove?

Ask which. For the last two, find the working folder — **the platform keeps no source**:

```bash
python scripts/find_app.py --search <dir> [--search <dir>…]
```

It prints every folder carrying a `.bulldozer-app.json` marker (written at creation) with its
name, subdomain and hosting id; cross-check with `bdzListHostings`. If no folder is left, say so
plainly and offer to rebuild from scratch — do not pretend an update is possible.

**Removing** is `bdzDeleteHosting` on that id, and it is final: the app's screen, **its stored data
and its files** go with it, with no copy kept and no undo. Say exactly that, name the app, and get a
clear yes before calling. Afterwards, delete the local `.bulldozer-app.json` so the folder stops
looking like a live app.

## 4. The shape — one question, no jargon

> *"Does your app only need a screen, or must it also remember data and run work of its own?"*

A screen only → front path, **no manifest, no review, published straight away**. Otherwise the
app has a service. A service **without** a screen is allowed, but nothing calls it on its own — say
so before agreeing to it.

## 5. Reserve, delegate, publish — in that order

The address must exist before the screen can be compiled against it, so **reserve first**:
`references/packaging.md` §1. Keep the `id`, `clientId` and `publicUrl` it returns.

One folder holds the whole app:

```
my-app/                    the Angular project (ng new), and inside it:
├── bulldozer.app.json     what the app does
├── backend/index.mjs      the service, next to the shipped helper
└── .bulldozer-app.json    the local marker — never published
```

Then: **service** → `bulldozer-app-creator-dev-backend` first, since the screen needs its
routes; **screen** → `bulldozer-app-creator-dev-frontend`, given the `clientId` and the
`subdomain`; then publish with `references/packaging.md` §2 onwards.

An app with a service is **reviewed before it goes live** — about a minute, and it can end in a
refusal. Then read **`references/review-verdicts.md`**: explain the reason in plain words and ask
the user how to proceed. Never rewrite their app to slip past a check on your own initiative.
