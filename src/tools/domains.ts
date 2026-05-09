import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerDomainTools(server: McpServer): void {
  server.tool(
    "generate_domain_variants",
    "Search for available domain name variants based on a base domain",
    {
      baseDomain: z.string().describe("Base domain name (e.g. 'mycompany')"),
      variantCount: z.number().describe("Number of variants to return"),
      tlds: z.array(z.string()).optional().describe("TLDs to check (e.g. ['com', 'io', 'co'])"),
    },
    async ({ baseDomain, variantCount, tlds }) => {
      const data = await prospiRequest("/public/domains/generate", {
        method: "POST",
        body: { baseDomain, variantCount, tlds },
      });
      return ok(data);
    }
  );

  server.tool(
    "purchase_domains",
    "Register one or more domains using InboxKit wallet balance",
    {
      domains: z.array(z.string()).describe("Domain names to register (e.g. ['mycompany.io'])"),
      forwardingUrl: z.string().optional().describe("URL to forward domain traffic to"),
    },
    async ({ domains, forwardingUrl }) => {
      const data = await prospiRequest("/public/domains/purchase", {
        method: "POST",
        body: { domains, forwardingUrl },
      });
      return ok(data);
    }
  );

  server.tool(
    "buy_mailboxes",
    "Create Google Workspace mailboxes for registered domains via InboxKit",
    {
      mailboxes: z.array(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          username: z.string().describe("Email username (e.g. 'john.doe')"),
          domainName: z.string().describe("Domain to create mailbox on"),
        })
      ).describe("Mailboxes to create"),
    },
    async ({ mailboxes }) => {
      const data = await prospiRequest("/public/domains/buy-mailboxes", {
        method: "POST",
        body: { mailboxes },
      });
      return ok(data);
    }
  );
}
