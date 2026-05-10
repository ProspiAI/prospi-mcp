import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerListTools(server: McpServer): void {
  server.tool(
    "list_lead_lists",
    "List all lead lists in the workspace",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 25)"),
    },
    async ({ page = 1, limit = 25 }) => {
      const data = await prospiRequest(`/public/lists?page=${page}&limit=${limit}`);
      return ok(data);
    }
  );

  server.tool(
    "create_lead_list",
    "Create a new lead list",
    {
      name: z.string().describe("Lead list name"),
    },
    async ({ name }) => {
      const data = await prospiRequest("/public/lists", {
        method: "POST",
        body: { name },
      });
      return ok(data);
    }
  );

  server.tool(
    "get_lead_list",
    "Get details of a specific lead list",
    {
      lead_list_id: z.string().describe("Lead list ID"),
    },
    async ({ lead_list_id }) => {
      const data = await prospiRequest(`/public/lists/${lead_list_id}`);
      return ok(data);
    }
  );

  server.tool(
    "get_leads_in_list_detailed",
    "Get paginated leads from a lead list (full lead data)",
    {
      lead_list_id: z.string().describe("Lead list ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 25)"),
    },
    async ({ lead_list_id, page = 1, limit = 25 }) => {
      const data = await prospiRequest(`/public/lists/${lead_list_id}/leads?page=${page}&limit=${limit}`);
      return ok(data);
    }
  );

  server.tool(
    "import_leads_to_list",
    "Import leads into a lead list using their enrich.so IDs. ALWAYS use search_leads first to find leads, then pass the `id` values from those results here. This fetches full data from enrich.so (industries, keywords, company website, LinkedIn, email, etc.) — identical to saving from the UI. Never pass emails or names directly — always pass the `id` field from search_leads results.",
    {
      lead_list_id: z.string().describe("Lead list ID"),
      leads: z.array(z.string()).describe("Array of enrich.so lead IDs — the `id` field from search_leads results"),
    },
    async ({ lead_list_id, leads }) => {
      const data = await prospiRequest(`/public/lists/${lead_list_id}/import`, {
        method: "POST",
        body: { leads },
      });
      return ok(data);
    }
  );

  server.tool(
    "enrich_lead_list",
    "Trigger enrichment for all leads in a lead list. Standard fields: Email, ESP, Title, Company Name, Target Audience, Service Name, Product Name, Sub Industry, Company Type, Company Mission. Optionally add custom AI research fields. Use limit to enrich only the first N leads.",
    {
      lead_list_id: z.string().describe("Lead list ID"),
      enrich: z.array(z.string()).describe("Standard fields to enrich (e.g. ['Email', 'Title', 'Company Name'])"),
      customFields: z.array(z.object({
        source: z.string().optional().describe("Data source field (default: company.websiteUrl)"),
        output: z.string().describe("Variable name for the result (e.g. 'painPoints')"),
        prompt: z.string().describe("AI prompt to research the field"),
        save: z.boolean().optional().describe("Save this prompt for reuse"),
      })).optional().describe("Custom AI research fields"),
      limit: z.number().optional().describe("Only enrich the first N leads"),
    },
    async ({ lead_list_id, enrich, customFields, limit }) => {
      const data = await prospiRequest(`/public/lists/${lead_list_id}/enrich`, {
        method: "PUT",
        body: { enrich, customFields, limit },
      });
      return ok(data);
    }
  );

  server.tool(
    "rename_lead_list",
    "Rename a lead list",
    {
      lead_list_id: z.string().describe("Lead list ID"),
      name: z.string().describe("New name"),
    },
    async ({ lead_list_id, name }) => {
      const data = await prospiRequest(`/public/lists/${lead_list_id}/rename`, {
        method: "PUT",
        body: { name },
      });
      return ok(data);
    }
  );

  server.tool(
    "delete_lead_list",
    "Delete a lead list",
    {
      lead_list_id: z.string().describe("Lead list ID"),
    },
    async ({ lead_list_id }) => {
      const data = await prospiRequest(`/public/lists/${lead_list_id}`, {
        method: "DELETE",
      });
      return ok(data);
    }
  );
}
