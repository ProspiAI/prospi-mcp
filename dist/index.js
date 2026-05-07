#!/usr/bin/env node
"use strict";
var import_mcp = require("@modelcontextprotocol/sdk/server/mcp.js");
var import_stdio = require("@modelcontextprotocol/sdk/server/stdio.js");
var import_campaigns = require("./tools/campaigns.js");
var import_sequences = require("./tools/sequences.js");
const server = new import_mcp.McpServer({
  name: "prospi",
  version: "0.1.0"
});
(0, import_campaigns.registerCampaignTools)(server);
(0, import_sequences.registerSequenceTools)(server);
const transport = new import_stdio.StdioServerTransport();
server.connect(transport);
