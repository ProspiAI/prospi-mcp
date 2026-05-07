import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prospiRequest } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerSequenceTools(server: McpServer): void {
  // 14. preview_email
  server.tool(
    "preview_email",
    "Preview a rendered email from a sequence step/variant",
    {
      sequence_id: z.string().describe("Sequence ID"),
      step: z.number().optional().describe("Step index (0-based)"),
      variant: z.number().optional().describe("Variant index (0-based)"),
    },
    async ({ sequence_id, step, variant }) => {
      let url = `/public/sequences/${sequence_id}/preview-email`;
      const params: string[] = [];
      if (step !== undefined) params.push(`step=${step}`);
      if (variant !== undefined) params.push(`variant=${variant}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const data = await prospiRequest(url);
      return ok(data);
    }
  );

  // 15. toggle_variant_status
  server.tool(
    "toggle_variant_status",
    "Enable or disable a specific variant within a sequence step",
    {
      sequence_id: z.string().describe("Sequence ID"),
      step: z.number().describe("Step index (0-based)"),
      variant: z.number().describe("Variant index (0-based)"),
      status: z.enum(["Active", "Inactive"]).describe("New status for the variant"),
    },
    async ({ sequence_id, step, variant, status }) => {
      const data = await prospiRequest(`/public/sequences/${sequence_id}/variant/status`, {
        method: "PUT",
        body: { step, variant, status },
      });
      return ok(data);
    }
  );

  // 16. update_sequence
  server.tool(
    "update_sequence",
    "Update the full sequence steps and variants (subject lines and message bodies)",
    {
      sequence_id: z.string().describe("Sequence ID"),
      steps: z.array(
        z.object({
          sendAfterDays: z.number().describe("Days to wait before sending this step"),
          variants: z.array(
            z.object({
              subject: z.string().describe("Email subject line"),
              message: z.string().describe("Email body (HTML or plain text)"),
            })
          ).describe("A/B test variants for this step"),
        })
      ).describe("Array of sequence steps"),
    },
    async ({ sequence_id, steps }) => {
      const data = await prospiRequest(`/public/sequences/${sequence_id}`, {
        method: "PUT",
        body: { steps },
      });
      return ok(data);
    }
  );
}
