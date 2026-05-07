# prospi-mcp

MCP (Model Context Protocol) server for [Prospi AI](https://prospi.ai). Exposes Prospi's public API as tools you can use directly inside Claude, Cursor, or any MCP-compatible client - manage cold email campaigns, sequences, and leads via natural language.

## Installation

### Claude Desktop (recommended)

```bash
claude mcp add prospi -- npx -y prospi-mcp
```

Then set your API key in `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent config on your OS:

```json
{
  "mcpServers": {
    "prospi": {
      "command": "npx",
      "args": ["-y", "prospi-mcp"],
      "env": {
        "PROSPI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor / other MCP clients

Add to your MCP config:

```json
{
  "mcpServers": {
    "prospi": {
      "command": "npx",
      "args": ["-y", "prospi-mcp"],
      "env": {
        "PROSPI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Getting your API key

1. Log in to [app.prospi.ai](https://app.prospi.ai)
2. Go to **Settings -> API**
3. Generate or copy your API key
4. Set it as `PROSPI_API_KEY` in your MCP client config

## Available tools

### Campaigns

| Tool | Description |
|------|-------------|
| `list_campaigns` | List all campaigns in your account |
| `get_campaign` | Get details of a specific campaign |
| `create_campaign` | Create a new campaign |
| `delete_campaign` | Delete a campaign |
| `update_campaign_status` | Activate or deactivate a campaign |
| `rename_campaign` | Rename a campaign |
| `duplicate_campaign` | Duplicate an existing campaign |
| `update_campaign_settings` | Update daily limit, open/click tracking |
| `update_campaign_schedule` | Set sending time window and days |
| `import_leads` | Import leads (email, name, company) into a campaign |
| `get_campaign_sequence` | Get the email sequence for a campaign |
| `get_statistics` | Get overall stats for a date range |
| `get_statistics_by_day` | Get per-day stats for a date range |

### Sequences

| Tool | Description |
|------|-------------|
| `preview_email` | Preview a rendered email from a sequence step/variant |
| `toggle_variant_status` | Enable or disable a specific A/B variant |
| `update_sequence` | Rewrite the full sequence (steps, subjects, messages) |

## Example prompts

- "Show me all my active campaigns"
- "Create a campaign called 'US SaaS Q2' in the America/New_York timezone"
- "Import these 3 leads into campaign abc123: ..."
- "What are my email stats for last week?"
- "Update the sequence for campaign xyz - change the subject of step 1 to ..."

## License

MIT
