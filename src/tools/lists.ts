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
    "Import an array of leads (from search results or manual) into a lead list",
    {
      lead_list_id: z.string().describe("Lead list ID"),
      leads: z.array(
        z.object({
          email: z.string().describe("Lead email address"),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          linkedinUrl: z.string().optional(),
          companyName: z.string().optional(),
          jobTitle: z.string().optional(),
          phone: z.string().optional(),
          customFields: z.record(z.string()).optional().describe("Extra key-value fields"),
        })
      ).describe("Array of leads to import"),
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
