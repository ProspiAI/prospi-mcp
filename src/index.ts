#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCampaignTools } from "./tools/campaigns.js";
import { registerSequenceTools } from "./tools/sequences.js";

const server = new McpServer({
  name: "prospi",
  version: "0.1.0",
});

registerCampaignTools(server);
registerSequenceTools(server);

const transport = new StdioServerTransport();
server.connect(transport);
