import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerCampaignTools(server: McpServer): void {
  // 1. list_campaigns
  server.tool(
    "list_campaigns",
    "List all campaigns in your Prospi account",
    {},
    async () => {
      const data = await prospiRequest("/public/campaigns");
      return ok(data);
    }
  );

  // 2. get_campaign
  server.tool(
    "get_campaign",
    "Get details of a specific campaign by ID",
    { campaign_id: z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}`);
      return ok(data);
    }
  );

  // 3. create_campaign
  server.tool(
    "create_campaign",
    "Create a new campaign",
    {
      name: z.string().describe("Campaign name"),
      country: z.string().optional().describe("Target country"),
      timezone: z.string().optional().describe("Campaign timezone (e.g. America/New_York)"),
    },
    async ({ name, country, timezone }) => {
      const data = await prospiRequest("/public/campaigns", {
        method: "POST",
        body: { name, country, timezone },
      });
      return ok(data);
    }
  );

  // 4. delete_campaign
  server.tool(
    "delete_campaign",
    "Delete a campaign by ID",
    { campaign_id: z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}`, {
        method: "DELETE",
      });
      return ok(data);
    }
  );

  // 5. update_campaign_status
  server.tool(
    "update_campaign_status",
    "Activate or deactivate a campaign",
    {
      campaign_id: z.string().describe("Campaign ID"),
      status: z.enum(["Active", "Inactive"]).describe("New status"),
    },
    async ({ campaign_id, status }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/status`, {
        method: "PUT",
        body: { status },
      });
      return ok(data);
    }
  );

  // 6. rename_campaign
  server.tool(
    "rename_campaign",
    "Rename a campaign",
    {
      campaign_id: z.string().describe("Campaign ID"),
      name: z.string().describe("New campaign name"),
    },
    async ({ campaign_id, name }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/rename`, {
        method: "PUT",
        body: { name },
      });
      return ok(data);
    }
  );

  // 7. duplicate_campaign
  server.tool(
    "duplicate_campaign",
    "Duplicate an existing campaign",
    { campaign_id: z.string().describe("Campaign ID to duplicate") },
    async ({ campaign_id }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/duplicate`, {
        method: "POST",
      });
      return ok(data);
    }
  );

  // 8. update_campaign_settings
  server.tool(
    "update_campaign_settings",
    "Update sending settings for a campaign. Use emails to set which mailboxes send for this campaign — pass an array of email addresses (use list_email_accounts with a tag filter to get the right addresses). Also supports dailyLimit, trackOpens, trackClicks.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      emails: z.array(z.string()).optional().describe("Email addresses of mailboxes to use as senders (replaces current senders). Use list_email_accounts with tag filter to get these."),
      dailyLimit: z.number().optional().describe("Max emails to send per day"),
      trackOpens: z.boolean().optional().describe("Enable open tracking"),
      trackClicks: z.boolean().optional().describe("Enable click tracking"),
    },
    async ({ campaign_id, emails, dailyLimit, trackOpens, trackClicks }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/settings`, {
        method: "PUT",
        body: { emails, dailyLimit, trackOpens, trackClicks },
      });
      return ok(data);
    }
  );

  // 9. update_campaign_schedule
  server.tool(
    "update_campaign_schedule",
    "Update sending schedule for a campaign (time window and days)",
    {
      campaign_id: z.string().describe("Campaign ID"),
      from: z.string().optional().describe("Send window start time (HH:MM)"),
      to: z.string().optional().describe("Send window end time (HH:MM)"),
      days: z.array(z.string()).optional().describe("Days to send (e.g. ['Monday', 'Tuesday'])"),
      timezone: z.string().optional().describe("Schedule timezone (e.g. America/New_York)"),
    },
    async ({ campaign_id, from, to, days, timezone }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/schedule`, {
        method: "PUT",
        body: { from, to, days, timezone },
      });
      return ok(data);
    }
  );

  // 10. import_leads
  server.tool(
    "import_leads",
    "Import all leads from a lead list into a campaign. Pass the lead list ID (from create_lead_list or list_lead_lists). Only leads that have an email and haven't been imported into this campaign yet will be added.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      lead_list_id: z.string().describe("Lead list ID to import leads from"),
    },
    async ({ campaign_id, lead_list_id }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/leads/import`, {
        method: "POST",
        body: { leadListId: lead_list_id },
      });
      return ok(data);
    }
  );

  // 11. get_campaign_sequence
  server.tool(
    "get_campaign_sequence",
    "Get the email sequence (steps and variants) for a campaign",
    { campaign_id: z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/sequence`);
      return ok(data);
    }
  );

  // 12. get_statistics
  server.tool(
    "get_statistics",
    "Get overall campaign statistics for a date range",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      const data = await prospiRequest(
        `/public/campaigns/statistics?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      return ok(data);
    }
  );

  // 13. get_campaign_statistics
  server.tool(
    "get_campaign_statistics",
    "Get statistics for a specific campaign (leads, emails sent, replies, bounce rate, progress)",
    { campaign_id: z.string().describe("Campaign ID") },
    async ({ campaign_id }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/statistics`);
      return ok(data);
    }
  );

  // 14. get_statistics_by_day
  server.tool(
    "get_statistics_by_day",
    "Get campaign statistics broken down by day for a date range",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      const data = await prospiRequest(
        `/public/campaigns/statistics/by-day?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      return ok(data);
    }
  );
}
