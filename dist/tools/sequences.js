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
var sequences_exports = {};
__export(sequences_exports, {
  registerSequenceTools: () => registerSequenceTools
});
module.exports = __toCommonJS(sequences_exports);
var import_zod = require("zod");
var import_client = require("../client.js");
function ok(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function registerSequenceTools(server) {
  server.tool(
    "preview_email",
    "Preview a rendered email from a sequence step/variant",
    {
      sequence_id: import_zod.z.string().describe("Sequence ID"),
      step: import_zod.z.number().optional().describe("Step index (0-based)"),
      variant: import_zod.z.number().optional().describe("Variant index (0-based)")
    },
    async ({ sequence_id, step, variant }) => {
      let url = `/public/sequences/${sequence_id}/preview-email`;
      const params = [];
      if (step !== void 0) params.push(`step=${step}`);
      if (variant !== void 0) params.push(`variant=${variant}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const data = await (0, import_client.prospiRequest)(url);
      return ok(data);
    }
  );
  server.tool(
    "toggle_variant_status",
    "Enable or disable a specific variant within a sequence step",
    {
      sequence_id: import_zod.z.string().describe("Sequence ID"),
      step: import_zod.z.number().describe("Step index (0-based)"),
      variant: import_zod.z.number().describe("Variant index (0-based)"),
      status: import_zod.z.enum(["Active", "Inactive"]).describe("New status for the variant")
    },
    async ({ sequence_id, step, variant, status }) => {
      const data = await (0, import_client.prospiRequest)(`/public/sequences/${sequence_id}/variant/status`, {
        method: "PUT",
        body: { step, variant, status }
      });
      return ok(data);
    }
  );
  server.tool(
    "update_sequence",
    "Update the full sequence steps and variants (subject lines and message bodies)",
    {
      sequence_id: import_zod.z.string().describe("Sequence ID"),
      steps: import_zod.z.array(
        import_zod.z.object({
          sendAfterDays: import_zod.z.number().describe("Days to wait before sending this step"),
          variants: import_zod.z.array(
            import_zod.z.object({
              subject: import_zod.z.string().describe("Email subject line"),
              message: import_zod.z.string().describe("Email body (HTML or plain text)")
            })
          ).describe("A/B test variants for this step")
        })
      ).describe("Array of sequence steps")
    },
    async ({ sequence_id, steps }) => {
      const data = await (0, import_client.prospiRequest)(`/public/sequences/${sequence_id}`, {
        method: "PUT",
        body: { steps }
      });
      return ok(data);
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerSequenceTools
});
