"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var campaigns_exports = {};
__export(campaigns_exports, {
  registerCampaignTools: () => registerCampaignTools
});
module.exports = __toCommonJS(campaigns_exports);
var import_zod = require("zod");
var import_client = require("../client.js");
function ok(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function registerCampaignTools(server) {
  server.tool(
    "list_campaigns",
    "List all campaigns in your Prospi account",
    {},
    async () => {
      const data = await (0, import_client.prospiRequest)("/public/campaigns");
      return ok(data);
    }
  );
  server.tool(
    "get_campaign",
    "Get details of a specific campaign by ID",
    { campaign_id: import_zod.z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}`);
      return ok(data);
    }
  );
  server.tool(
    "create_campaign",
    "Create a new campaign",
    {
      name: import_zod.z.string().describe("Campaign name"),
      country: import_zod.z.string().optional().describe("Target country"),
      timezone: import_zod.z.string().optional().describe("Campaign timezone (e.g. America/New_York)")
    },
    async ({ name, country, timezone }) => {
      const data = await (0, import_client.prospiRequest)("/public/campaigns", {
        method: "POST",
        body: { name, country, timezone }
      });
      return ok(data);
    }
  );
  server.tool(
    "delete_campaign",
    "Delete a campaign by ID",
    { campaign_id: import_zod.z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}`, {
        method: "DELETE"
      });
      return ok(data);
    }
  );
  server.tool(
    "update_campaign_status",
    "Activate or deactivate a campaign",
    {
      campaign_id: import_zod.z.string().describe("Campaign ID"),
      status: import_zod.z.enum(["Active", "Inactive"]).describe("New status")
    },
    async ({ campaign_id, status }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/status`, {
        method: "PUT",
        body: { status }
      });
      return ok(data);
    }
  );
  server.tool(
    "rename_campaign",
    "Rename a campaign",
    {
      campaign_id: import_zod.z.string().describe("Campaign ID"),
      name: import_zod.z.string().describe("New campaign name")
    },
    async ({ campaign_id, name }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/rename`, {
        method: "PUT",
        body: { name }
      });
      return ok(data);
    }
  );
  server.tool(
    "duplicate_campaign",
    "Duplicate an existing campaign",
    { campaign_id: import_zod.z.string().describe("Campaign ID to duplicate") },
    async ({ campaign_id }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/duplicate`, {
        method: "POST"
      });
      return ok(data);
    }
  );
  server.tool(
    "update_campaign_settings",
    "Update sending settings for a campaign (daily limit, open/click tracking)",
    {
      campaign_id: import_zod.z.string().describe("Campaign ID"),
      dailyLimit: import_zod.z.number().optional().describe("Max emails to send per day"),
      trackOpens: import_zod.z.boolean().optional().describe("Enable open tracking"),
      trackClicks: import_zod.z.boolean().optional().describe("Enable click tracking")
    },
    async ({ campaign_id, dailyLimit, trackOpens, trackClicks }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/settings`, {
        method: "PUT",
        body: { dailyLimit, trackOpens, trackClicks }
      });
      return ok(data);
    }
  );
  server.tool(
    "update_campaign_schedule",
    "Update sending schedule for a campaign (time window and days)",
    {
      campaign_id: import_zod.z.string().describe("Campaign ID"),
      from: import_zod.z.string().optional().describe("Send window start time (HH:MM)"),
      to: import_zod.z.string().optional().describe("Send window end time (HH:MM)"),
      days: import_zod.z.array(import_zod.z.string()).optional().describe("Days to send (e.g. ['Monday', 'Tuesday'])"),
      timezone: import_zod.z.string().optional().describe("Schedule timezone (e.g. America/New_York)")
    },
    async ({ campaign_id, from, to, days, timezone }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/schedule`, {
        method: "PUT",
        body: { from, to, days, timezone }
      });
      return ok(data);
    }
  );
  server.tool(
    "import_leads",
    "Import leads into a campaign",
    {
      campaign_id: import_zod.z.string().describe("Campaign ID"),
      leads: import_zod.z.array(
        import_zod.z.object({
          email: import_zod.z.string().describe("Lead email address"),
          firstName: import_zod.z.string().optional().describe("First name"),
          lastName: import_zod.z.string().optional().describe("Last name"),
          companyName: import_zod.z.string().optional().describe("Company name")
        })
      ).describe("Array of leads to import")
    },
    async ({ campaign_id, leads }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/leads/import`, {
        method: "POST",
        body: { leads }
      });
      return ok(data);
    }
  );
  server.tool(
    "get_campaign_sequence",
    "Get the email sequence (steps and variants) for a campaign",
    { campaign_id: import_zod.z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await (0, import_client.prospiRequest)(`/public/campaigns/${campaign_id}/sequence`);
      return ok(data);
    }
  );
  server.tool(
    "get_statistics",
    "Get overall campaign statistics for a date range",
    {
      from: import_zod.z.string().describe("Start date (YYYY-MM-DD)"),
      to: import_zod.z.string().describe("End date (YYYY-MM-DD)")
    },
    async ({ from, to }) => {
      const data = await (0, import_client.prospiRequest)(
        `/public/campaigns/statistics?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      return ok(data);
    }
  );
  server.tool(
    "get_statistics_by_day",
    "Get campaign statistics broken down by day for a date range",
    {
      from: import_zod.z.string().describe("Start date (YYYY-MM-DD)"),
      to: import_zod.z.string().describe("End date (YYYY-MM-DD)")
    },
    async ({ from, to }) => {
      const data = await (0, import_client.prospiRequest)(
        `/public/campaigns/statistics/by-day?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      return ok(data);
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerCampaignTools
});
