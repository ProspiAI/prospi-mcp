import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerLeadTools(server: McpServer): void {
  // 1. search_leads
  server.tool(
    "search_leads",
    "Search the 325M+ lead database using filters. Returns paginated results from enrich.so. Max 100 per page.",
    {
      jobTitle: z.array(z.string()).optional().describe("Job titles (e.g. ['CEO', 'Founder'])"),
      countryName: z.array(z.string()).optional().describe("Countries (e.g. ['United States', 'Germany'])"),
      companyName: z.array(z.string()).optional().describe("Company names"),
      industryNaicsDescription: z.array(z.string()).optional().describe("Industries (e.g. ['Software'])"),
      jobLevel: z.array(z.string()).optional().describe("Seniority levels (e.g. ['C-Team', 'Director'])"),
      jobFunction: z.array(z.string()).optional().describe("Job functions (e.g. ['Engineering', 'Sales'])"),
      employeeCountMin: z.number().optional().describe("Minimum company employee count"),
      employeeCountMax: z.number().optional().describe("Maximum company employee count"),
      revenueBuckets: z.array(z.string()).optional().describe("Revenue ranges (e.g. ['$1M-$10M', '$10M-$50M'])"),
      locationCity: z.array(z.string()).optional().describe("Cities"),
      locationState: z.array(z.string()).optional().describe("States/regions"),
      domain: z.array(z.string()).optional().describe("Company domains"),
      skills: z.array(z.string()).optional().describe("Skills"),
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().max(100).optional().describe("Results per page, max 100 (default: 25)"),
    },
    async ({ page, limit, ...filters }) => {
      const data = await prospiRequest("/public/leads", {
        method: "POST",
        body: { filters, page, limit },
      });
      return ok(data);
    }
  );

  // 2. get_saved_leads
  server.tool(
    "get_saved_leads",
    "Get paginated list of saved leads in your workspace",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 25)"),
    },
    async ({ page = 1, limit = 25 }) => {
      const data = await prospiRequest(`/public/leads?page=${page}&limit=${limit}`);
      return ok(data);
    }
  );

  // 3. get_lead
  server.tool(
    "get_lead",
    "Get a single saved lead by its ID",
    {
      lead_id: z.string().describe("Lead MongoDB ObjectId"),
    },
    async ({ lead_id }) => {
      const data = await prospiRequest(`/public/leads/${lead_id}`);
      return ok(data);
    }
  );

  // 4. get_leads_in_list
  server.tool(
    "get_leads_in_list",
    "Get paginated leads from a specific lead list",
    {
      lead_list_id: z.string().describe("Lead list ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 25)"),
    },
    async ({ lead_list_id, page = 1, limit = 25 }) => {
      const data = await prospiRequest(`/public/leads/list/${lead_list_id}?page=${page}&limit=${limit}`);
      return ok(data);
    }
  );

  // 5. get_leads_in_campaign
  server.tool(
    "get_leads_in_campaign",
    "Get paginated leads assigned to a specific campaign",
    {
      campaign_id: z.string().describe("Campaign ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 25)"),
    },
    async ({ campaign_id, page = 1, limit = 25 }) => {
      const data = await prospiRequest(`/public/leads/campaign/${campaign_id}?page=${page}&limit=${limit}`);
      return ok(data);
    }
  );

  // 6. get_lead_field_options
  server.tool(
    "get_lead_field_options",
    "Get distinct values for a lead field — useful for building filter dropdowns. Example fields: email, customFields.company",
    {
      field: z.string().describe("Field name (e.g. 'email', 'customFields.company')"),
    },
    async ({ field }) => {
      const data = await prospiRequest(`/public/leads/field/options?field=${encodeURIComponent(field)}`);
      return ok(data);
    }
  );
}
