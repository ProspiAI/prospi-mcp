import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerEmailAccountTools(server: McpServer): void {
  server.tool(
    "list_email_accounts",
    "List email accounts in the workspace. Use the optional tag parameter to filter by tag name (e.g. tag='US Senders'). Returns email addresses, names, type, and status.",
    {
      tag: z.string().optional().describe("Filter by tag name (e.g. 'US Senders')"),
    },
    async ({ tag }) => {
      const url = tag
        ? `/public/email-accounts?tag=${encodeURIComponent(tag)}`
        : "/public/email-accounts";
      const data = await prospiRequest(url);
      return ok(data);
    }
  );

  server.tool(
    "list_email_account_tags",
    "List all email account tags in the workspace. Each tag includes its name and the IDs of email accounts assigned to it.",
    {},
    async () => {
      const data = await prospiRequest("/public/email-account-tags");
      return ok(data);
    }
  );
}
