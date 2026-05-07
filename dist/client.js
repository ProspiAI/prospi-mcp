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
var client_exports = {};
__export(client_exports, {
  prospiRequest: () => prospiRequest
});
module.exports = __toCommonJS(client_exports);
const BASE_URL = "https://backendapp.prospi.ai/api";
function getApiKey() {
  const key = process.env.PROSPI_API_KEY;
  if (!key) throw new Error("PROSPI_API_KEY environment variable is required");
  return key;
}
async function prospiRequest(endpoint, options = {}) {
  const { method = "GET", body } = options;
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : void 0
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Prospi API error ${res.status}: ${text}`);
  }
  return res.json();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  prospiRequest
});
