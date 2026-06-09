# Bulldozer Plugin for Claude Code

An AI-native plugin that connects Claude to the Bulldozer platform — enabling SEO analysis, paid ads management (LinkedIn, Meta, Google Ads), creative asset generation, and company/project management.

Works on **Claude Code** (CLI, desktop app, VS Code / JetBrains extensions) and **Claude.ai** (web app, cowork).

**Version**: 1.0.15

---

## Prerequisites

- **Claude Code** (CLI / desktop / IDE) or **Claude.ai** (web / cowork) — authenticated
- A Bulldozer account with a valid Customer ID (UUID v4)
- Access to the Bulldozer platform (`https://mcp.bulldozer-collective.fr`)

---

## Installation

### From the Claude Marketplace (recommended)

1. Open Claude Code.
2. Search for **Bulldozer** in the marketplace and install the plugin.
3. Claude Code will automatically configure the MCP server and register all skills.
4. On first use, Claude will guide you through creating your `bulldozer.json` configuration file (see [First-time Setup](#first-time-setup)).

### Manual installation

1. Clone or copy this plugin folder into your local plugins directory.
2. Ensure `.mcp.json` is present at the plugin root — it configures the MCP server:

```json
{
  "mcpServers": {
    "bulldozer": {
      "type": "http",
      "url": "https://mcp.bulldozer-collective.fr/mcp",
      "oauth": {
        "clientId": "claude-code-bulldozer-plugin"
      }
    }
  }
}
```

3. Claude Code will authenticate with the Bulldozer server via OAuth on first connection.

---

## First-time Setup

The plugin uses a `bulldozer.json` file at the root of your project to store tenant-specific configuration (customer ID, project ID, ad account IDs). This file is **not** version-controlled.

When you first use any Bulldozer skill, Claude will automatically invoke the `bulldozer-config` skill to set up the file. You can also trigger it manually:

```
/bulldozer-config
```

You will be prompted for your **Customer ID** — a UUID v4 in the format:

```
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
```

The file will be created at the project root and automatically added to `.gitignore`.

### Minimal `bulldozer.json`

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Full `bulldozer.json` (all skill-managed keys)

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "projectId": "your-project-uuid",
  "ads": {
    "adAccount": {
      "LINKEDIN": "linkedin-account-id",
      "META": "meta-account-id"
    }
  },
  "sea": {
    "adAccount": {
      "adwordLoginId": "google-login-customer-id",
      "adwordCustomerId": "google-customer-id"
    }
  }
}
```

Keys other than `customerId` are populated automatically by skills as you use them.

---

## Skills Reference

Skills are invoked automatically by Claude based on your request, or manually with `/skill-name`.

| Skill | Name | What it does |
|---|---|---|
| `bulldozer-config` | Config File | Creates, reads, and validates `bulldozer.json` |
| `bulldozer-identity` | Bulldozer Identity | Reference for Bulldozer's positioning, offers, and scope boundaries |
| `bulldozer-choose-customer-id` | Customer ID Chooser | Resolves `customerId` from `bulldozer.json` or conversation context |
| `bulldozer-choose-project-id` | Project ID Chooser | Lists your project memberships and persists the chosen `projectId` |
| `bulldozer-seo-api` | SEO | Fetch domain overviews, organic keywords, and backlinks; orchestrates async SEO analysis jobs |
| `bulldozer-ad-management` | Ads Management | Import and query LinkedIn and Meta ads; resolves ad accounts and handles campaign hierarchy |
| `bulldozer-sea-management` | SEA / Google Ads | Query Google Ads campaigns, ad groups, keywords, and performance metrics |
| `bulldozer-studio` | Studio | Generate images and videos from text prompts via Bulldozer Studio |
| `bulldozer-create-company` | Create Company | Create new companies in Bulldozer with deduplication checks |

### Example prompts

```
Show me the SEO performance of acme.com for last month in France.
List my active LinkedIn campaigns.
Generate a banner image for our new SaaS product launch.
Create a new company: Acme Corp, website acme.com.
What are my top-performing Google Ads keywords this month?
```

---

## Hooks

Two hooks run automatically when the plugin is active.

### PreToolUse — AI metric recording

Fires before any Bulldozer MCP tool call. Records the tool usage as an AI metric via `bdzCreateAiMetric`, scoped to the current `customerId` and `projectId`. This enables usage analytics in the Bulldozer platform.

### PostToolUse — Config change detection

Fires after any `Write` or `Edit` tool call. If `bulldozer.json` was modified, Claude is instructed to re-read the file and discard stale project context if `customerId` or `projectId` changed.

---

## Helper Scripts

The `scripts/` directory contains standalone Python MCP servers and utilities for integrations not covered by the main Bulldozer MCP.

| Script | Purpose | Required credentials |
|---|---|---|
| `ahrefs_mcp.py` | Ahrefs v3 API wrapper — domain analysis, backlinks, competitive research | `AHREFS_API_KEY` env var |
| `ga4_report.py` | Google Analytics 4 organic traffic reports via OAuth | `GSC_REFRESH_TOKEN` env var |
| `google_auth.py` | Google OAuth token handler (used by GA4 and GSC scripts) | Google OAuth credentials |
| `crux_history.py` | Chrome User Experience Report (CrUX) historical data | Google API key |
| `pagespeed_check.py` | PageSpeed Insights analysis | Google API key |
| `nlp_analyze.py` | NLP content analysis | None |

These scripts are not auto-loaded — they are invoked on demand by Claude when the relevant skill or context requires them.

---

## Project Structure

```
bulldozer-external/
├── .mcp.json                   # MCP server config (HTTP + OAuth)
├── .claude-plugin/
│   └── plugin.json             # Plugin manifest
├── .claude/
│   └── settings.local.json     # Dev-only: disables MCP server in this dir
├── skills/                     # 9 Claude Code skills
│   ├── bulldozer-ad-management/
│   ├── bulldozer-choose-customer-id/
│   ├── bulldozer-choose-project-id/
│   ├── bulldozer-conf-file/
│   ├── bulldozer-create-company/
│   ├── bulldozer-identity/
│   ├── bulldozer-sea-management/
│   ├── bulldozer-seo-api/
│   └── bulldozer-studio/
├── hooks/
│   └── hooks.json              # PreToolUse + PostToolUse hook definitions
├── scripts/                    # Standalone Python helper scripts
├── output-styles/
│   └── bulldozer-seo-geo-styling.md  # Output format rules for SEO/GEO work
├── agents/                     # Reserved for future agents
├── monitors/                   # Reserved for future monitors
└── bin/                        # Reserved for executables
```
