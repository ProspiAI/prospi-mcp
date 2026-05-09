import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerDncTools(server: McpServer): void {
  server.tool(
    "list_dnc_entries",
    "List do-not-contact entries for the workspace",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 25)"),
    },
    async ({ page = 1, limit = 25 }) => {
      const data = await prospiRequest(`/public/dnc?page=${page}&limit=${limit}`);
      return ok(data);
    }
  );

  server.tool(
    "delete_dnc_entries",
    "Bulk delete DNC entries by their IDs",
    {
      selected: z.array(z.string()).describe("Array of DNC entry IDs to delete"),
    },
    async ({ selected }) => {
      const data = await prospiRequest("/public/dnc/bulk", {
        method: "DELETE",
        body: { selected },
      });
      return ok(data);
    }
  );
}
