#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCampaignTools } from "./tools/campaigns.js";
import { registerDncTools } from "./tools/dnc.js";
import { registerDomainTools } from "./tools/domains.js";
import { registerLeadTools } from "./tools/leads.js";
import { registerListTools } from "./tools/lists.js";
import { registerSequenceTools } from "./tools/sequences.js";

const server = new McpServer({
  name: "prospi",
  version: "0.1.0",
});

registerCampaignTools(server);
registerDncTools(server);
registerDomainTools(server);
registerLeadTools(server);
registerListTools(server);
registerSequenceTools(server);

const transport = new StdioServerTransport();
server.connect(transport);
