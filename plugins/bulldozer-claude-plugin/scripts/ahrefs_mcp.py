"""
Ahrefs MCP Server — Bulldozer SEO Agent
Wraps the Ahrefs v3 API and exposes tools to Claude via the MCP protocol.

Requirements:
  pip install mcp httpx

Setup:
  Set AHREFS_API_KEY in your .env file.
  The server is launched automatically by Claude Code via .claude/settings.json.
"""

import asyncio
import os
import httpx
from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp import types

AHREFS_API_BASE = "https://api.ahrefs.com/v3"
API_KEY = os.environ.get("AHREFS_API_KEY", "")

app = Server("ahrefs-bulldozer")


def ahrefs_headers() -> dict:
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }


async def ahrefs_get(path: str, params: dict) -> dict:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{AHREFS_API_BASE}{path}",
            headers=ahrefs_headers(),
            params=params,
        )
        response.raise_for_status()
        return response.json()


@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_domain_overview",
            description=(
                "Get a high-level overview of a domain: Domain Rating (DR), "
                "estimated organic traffic, number of referring domains, and "
                "total number of organic keywords."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "domain": {
                        "type": "string",
                        "description": "The domain to analyse, e.g. 'example.com'",
                    }
                },
                "required": ["domain"],
            },
        ),
        types.Tool(
            name="get_organic_keywords",
            description=(
                "Get the top organic keywords a domain ranks for, including "
                "their position, search volume, keyword difficulty, and estimated traffic."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "domain": {
                        "type": "string",
                        "description": "The domain to analyse, e.g. 'example.com'",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of keywords to return (default: 50, max: 200)",
                        "default": 50,
                    },
                    "country": {
                        "type": "string",
                        "description": "Two-letter country code for the target market (default: 'fr')",
                        "default": "fr",
                    },
                },
                "required": ["domain"],
            },
        ),
        types.Tool(
            name="get_backlink_profile",
            description=(
                "Get the backlink profile of a domain: total referring domains, "
                "top anchor texts, and distribution of link types."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "domain": {
                        "type": "string",
                        "description": "The domain to analyse, e.g. 'example.com'",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of referring domains to return (default: 20)",
                        "default": 20,
                    },
                },
                "required": ["domain"],
            },
        ),
        types.Tool(
            name="get_top_pages",
            description=(
                "Get the top organic pages of a domain sorted by estimated organic traffic."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "domain": {
                        "type": "string",
                        "description": "The domain to analyse, e.g. 'example.com'",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of pages to return (default: 20)",
                        "default": 20,
                    },
                    "country": {
                        "type": "string",
                        "description": "Two-letter country code (default: 'fr')",
                        "default": "fr",
                    },
                },
                "required": ["domain"],
            },
        ),
        types.Tool(
            name="get_keyword_gap",
            description=(
                "Find keywords that competitor domains rank for but the target domain does not. "
                "Returns the top keyword opportunities sorted by traffic potential."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "target": {
                        "type": "string",
                        "description": "The target domain (the lead being audited)",
                    },
                    "competitors": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of competitor domains (max 5)",
                        "maxItems": 5,
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of keyword gap results to return (default: 50)",
                        "default": 50,
                    },
                    "country": {
                        "type": "string",
                        "description": "Two-letter country code (default: 'fr')",
                        "default": "fr",
                    },
                },
                "required": ["target", "competitors"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    try:
        if name == "get_domain_overview":
            data = await ahrefs_get(
                "/site-explorer/overview",
                {
                    "target": arguments["domain"],
                    "mode": "domain",
                    "date_to": "today",
                },
            )
            return [types.TextContent(type="text", text=str(data))]

        elif name == "get_organic_keywords":
            data = await ahrefs_get(
                "/site-explorer/organic-keywords",
                {
                    "target": arguments["domain"],
                    "mode": "domain",
                    "country": arguments.get("country", "fr"),
                    "limit": arguments.get("limit", 50),
                    "order_by": "traffic:desc",
                },
            )
            return [types.TextContent(type="text", text=str(data))]

        elif name == "get_backlink_profile":
            data = await ahrefs_get(
                "/site-explorer/refdomains",
                {
                    "target": arguments["domain"],
                    "mode": "domain",
                    "limit": arguments.get("limit", 20),
                    "order_by": "domain_rating:desc",
                },
            )
            return [types.TextContent(type="text", text=str(data))]

        elif name == "get_top_pages":
            data = await ahrefs_get(
                "/site-explorer/top-pages",
                {
                    "target": arguments["domain"],
                    "mode": "domain",
                    "country": arguments.get("country", "fr"),
                    "limit": arguments.get("limit", 20),
                    "order_by": "traffic:desc",
                },
            )
            return [types.TextContent(type="text", text=str(data))]

        elif name == "get_keyword_gap":
            # Ahrefs keyword gap endpoint — combine target + competitors
            params = {
                "targets[0][target]": arguments["target"],
                "targets[0][mode]": "domain",
            }
            for i, comp in enumerate(arguments["competitors"]):
                params[f"targets[{i+1}][target]"] = comp
                params[f"targets[{i+1}][mode]"] = "domain"
            params["country"] = arguments.get("country", "fr")
            params["limit"] = arguments.get("limit", 50)
            params["select"] = "keyword,volume,difficulty,traffic_potential"
            # Filter: target ranks for none, competitors rank for at least one
            params["where"] = f"positions_count_target:eq:0"

            data = await ahrefs_get("/keywords-explorer/keyword-ideas/also-rank-for", params)
            return [types.TextContent(type="text", text=str(data))]

        else:
            return [types.TextContent(type="text", text=f"Unknown tool: {name}")]

    except httpx.HTTPStatusError as e:
        return [
            types.TextContent(
                type="text",
                text=f"Ahrefs API error {e.response.status_code}: {e.response.text}",
            )
        ]
    except Exception as e:
        return [types.TextContent(type="text", text=f"Error: {str(e)}")]


async def main():
    if not API_KEY:
        raise ValueError(
            "AHREFS_API_KEY environment variable is not set. "
            "Add it to your .env file and restart Claude Code."
        )
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="ahrefs-bulldozer",
                server_version="1.0.0",
            ),
        )


if __name__ == "__main__":
    asyncio.run(main())
