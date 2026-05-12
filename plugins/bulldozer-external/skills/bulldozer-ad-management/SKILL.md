---
name: Bulldozer Ads
description: Explains how to interact with Bulldozer MCP server for all operations related to ads (Linked In, Meta)
allowed-tools:
- mcp__plugin_bulldozer_bulldozer__createAdAccount
- mcp__plugin_bulldozer_bulldozer__searchAdAccounts
- mcp__plugin_bulldozer_bulldozer__listRegisteredAdAccounts
- mcp__plugin_bulldozer_bulldozer__createAdImport
- mcp__plugin_bulldozer_bulldozer__startAdImport
- mcp__plugin_bulldozer_bulldozer__listAdLayer1
- mcp__plugin_bulldozer_bulldozer__listAdLayer2
- mcp__plugin_bulldozer_bulldozer__listAdLayer3
- mcp__plugin_bulldozer_bulldozer__getAdAnalytics
---

# Ad account management
Each request with all tools related to ad management must reference an ad account.
Some call will need a direct reference by passing the ad account in parameter, sometimes the ad account will be inferred.
When needed an explicit ad account for a tool call, refer to the next chapter.

## Ad account choice
When interacting with Bulldozer MCP tool managing ad data, an ad account must be provided for each call.
The ad account to use will be stored in the `bulldozer.json` file, found usually at the root of the project.
The key containing the ad account for a platform to use is `.ads.adAccount.${PLATFORM}`.
If the ad account cannot be found, do this process:

1- Lists available ad accounts using mcp__plugin_bulldozer_bulldozer__listRegisteredAdAccounts.
If the tool returns one or more ad accounts, create a menu and ask the user to choose one of them.
If the tool returns 0 ad accounts:
- call mcp__plugin_bulldozer_bulldozer__searchAdAccounts
- create a menu and ask the user to choose one of them
- create the ad account using mcp__plugin_bulldozer_bulldozer__createAdAccount

2- Set the selected ad account in the `bulldozer.json` file

3- Return the ad account

# Ad hierarchy
The ad managed by Bulldozer do not follow the nomenclature defined by LinkedIn or Meta.
However, when outputting messages for the user, the LinkedIn or Meta nomenclature shall be used.

This table explains how the Bulldozer nomenclature and the other platform nomenclatures are linked.

|         | LinkedIn | Meta     |
|---------|----------|----------|
| Layer 1 | Campaign | Campaign |
| Layer 2 | AdSet    | AdSet    |
| Layer 3 | Ad       | Ad       |

## Ad Layer 1
The Bulldozer Ad Layer 1 is the higher level.
For LinkedIn, this layer is the `Campaign` layer.
For Meta, this layer is the `Campaign` layer.

## Ad Layer 2
The Bulldozer Ad Layer 2 is the middle layer.
Each Layer 2 must be linked to one and only one layer 1.
For LinkedIn, this layer is the `AdSet` layer.
For Meta, this layer is the `AdSet` layer.

## Ad Layer 3
The Bulldozer Ad Layer 3 is the lower layer, representing the actual ad that will be displayed.
Each Layer 3 must be linked to one and only one layer 2.
For LinkedIn, this layer is the `Ad` layer.
For Meta, this layer is the `Ad` layer.

# Ad import
Ads from platforms are stored only if they are part of a `AdImport`.
Each `AdImport` will target:
- a specific platform
- a time range
- an ad account

An `AdImport` can be created using mcp__plugin_bulldozer_bulldozer__createAdImport and must then be started using mcp__plugin_bulldozer_bulldozer__startAdImport.
These 2 operations shall be made in sequence without user interaction.

Do not create or start a new import without explicit user agreement.
Always check if there are already available ads before starting a new `AdImport`.

# Rules
These rules shall be followed:
- when the user ask for the url of the creative of a layer 3 ad, the url must not be changed. The complete url must be used.
