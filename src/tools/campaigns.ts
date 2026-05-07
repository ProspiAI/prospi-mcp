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
    "Update sending settings for a campaign (daily limit, open/click tracking)",
    {
      campaign_id: z.string().describe("Campaign ID"),
      dailyLimit: z.number().optional().describe("Max emails to send per day"),
      trackOpens: z.boolean().optional().describe("Enable open tracking"),
      trackClicks: z.boolean().optional().describe("Enable click tracking"),
    },
    async ({ campaign_id, dailyLimit, trackOpens, trackClicks }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/settings`, {
        method: "PUT",
        body: { dailyLimit, trackOpens, trackClicks },
      });
      return ok(data);
    }
  );

  // 9. update_campaign_schedule
  server.tool(
    "update_campaign_schedule",
    "Update sending schedule for a campaign. Times in HH:MM format (e.g. '08:00'), days as names (e.g. 'Monday').",
    {
      campaign_id: z.string().describe("Campaign ID"),
      from: z.string().optional().describe("Send window start time in HH:MM format (e.g. '08:00')"),
      to: z.string().optional().describe("Send window end time in HH:MM format (e.g. '17:00')"),
      days: z.array(
        z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
      ).optional().describe("Days of the week to send (e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])"),
      timezone: z.string().optional().describe("IANA timezone (e.g. 'America/New_York')"),
    },
    async ({ campaign_id, from, to, days, timezone }) => {
      const dayMap: Record<string, number> = {
        Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
        Thursday: 4, Friday: 5, Saturday: 6,
      };
      const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + (m || 0);
      };
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/schedule`, {
        method: "PUT",
        body: {
          from: from !== undefined ? toMinutes(from) : undefined,
          to: to !== undefined ? toMinutes(to) : undefined,
          days: days !== undefined ? days.map((d) => dayMap[d]) : undefined,
          timezone,
        },
      });
      return ok(data);
    }
  );

  // 10. import_leads
  server.tool(
    "import_leads",
    "Import leads into a campaign",
    {
      campaign_id: z.string().describe("Campaign ID"),
      leads: z.array(
        z.object({
          email: z.string().describe("Lead email address"),
          firstName: z.string().optional().describe("First name"),
          lastName: z.string().optional().describe("Last name"),
          companyName: z.string().optional().describe("Company name"),
        })
      ).describe("Array of leads to import"),
    },
    async ({ campaign_id, leads }) => {
      const data = await prospiRequest(`/public/campaigns/${campaign_id}/leads/import`, {
        method: "POST",
        body: { leads },
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

  // 13. get_statistics_by_day
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
