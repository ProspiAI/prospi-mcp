#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as readline from "readline";
import { execSync } from "child_process";

const MCP_NAME = "prospi";
const MCP_COMMAND = "npx";
const MCP_ARGS = ["-y", "prospi-mcp"];

function getClaudeDesktopConfigPath(): string | null {
  const platform = os.platform();
  if (platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  } else if (platform === "win32") {
    const appData = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
    return path.join(appData, "Claude", "claude_desktop_config.json");
  } else {
    // Linux
    const configHome = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
    return path.join(configHome, "Claude", "claude_desktop_config.json");
  }
}

function isClaudeCodeInstalled(): boolean {
  try {
    execSync("claude --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function configureClaudeDesktop(apiKey: string): { success: boolean; message: string } {
  const configPath = getClaudeDesktopConfigPath();
  if (!configPath) {
    return { success: false, message: "Unsupported platform" };
  }

  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let config: Record<string, unknown> = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch {
      return { success: false, message: `Could not parse ${configPath}` };
    }
  }

  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  (config.mcpServers as Record<string, unknown>)[MCP_NAME] = {
    command: MCP_COMMAND,
    args: MCP_ARGS,
    env: { PROSPI_API_KEY: apiKey },
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return { success: true, message: configPath };
}

function configureClaudeCode(apiKey: string): { success: boolean; message: string } {
  try {
    const cmd = [
      "claude mcp add",
      MCP_NAME,
      `-e PROSPI_API_KEY=${apiKey}`,
      "--",
      MCP_COMMAND,
      ...MCP_ARGS,
    ].join(" ");
    execSync(cmd, { stdio: "pipe" });
    return { success: true, message: "Claude Code configured" };
  } catch (e: unknown) {
    const err = e as { stderr?: Buffer; message?: string };
    const stderr = err.stderr?.toString() || "";
    // If already exists, try to update
    if (stderr.includes("already exists") || stderr.includes("already configured")) {
      try {
        execSync(`claude mcp remove ${MCP_NAME}`, { stdio: "pipe" });
        const cmd = [
          "claude mcp add",
          MCP_NAME,
          `-e PROSPI_API_KEY=${apiKey}`,
          "--",
          MCP_COMMAND,
          ...MCP_ARGS,
        ].join(" ");
        execSync(cmd, { stdio: "pipe" });
        return { success: true, message: "Claude Code updated" };
      } catch (e2: unknown) {
        const err2 = e2 as { message?: string };
        return { success: false, message: err2.message || "Unknown error" };
      }
    }
    return { success: false, message: err.message || "Unknown error" };
  }
}

async function main() {
  console.log("\n=== Prospi MCP Setup ===\n");
  console.log("This will configure Claude to use the Prospi MCP server.");
  console.log("You can get your API key from: app.prospi.ai → Settings → API\n");

  let apiKey = process.env.PROSPI_API_KEY || "";
  if (!apiKey) {
    apiKey = await prompt("Enter your Prospi API key: ");
  } else {
    console.log("Using PROSPI_API_KEY from environment.\n");
  }

  if (!apiKey) {
    console.error("Error: API key is required.");
    process.exit(1);
  }

  let anySuccess = false;

  // Claude Desktop
  const desktopResult = configureClaudeDesktop(apiKey);
  if (desktopResult.success) {
    console.log(`✓ Claude Desktop configured (${desktopResult.message})`);
    anySuccess = true;
  } else {
    console.log(`  Claude Desktop: skipped (${desktopResult.message})`);
  }

  // Claude Code
  if (isClaudeCodeInstalled()) {
    const codeResult = configureClaudeCode(apiKey);
    if (codeResult.success) {
      console.log(`✓ Claude Code configured`);
      anySuccess = true;
    } else {
      console.log(`  Claude Code: failed (${codeResult.message})`);
    }
  } else {
    console.log("  Claude Code: not installed, skipping");
  }

  if (!anySuccess) {
    console.error("\nSetup failed - no clients were configured.");
    process.exit(1);
  }

  console.log("\n✓ Setup complete!");
  console.log("\nNext steps:");
  console.log("  • Restart Claude Desktop if it's open");
  console.log("  • The server updates automatically on next launch (via npx)");
  console.log("  • Test by asking Claude: 'List my Prospi campaigns'\n");
}

main().catch((err) => {
  console.error("Setup error:", err.message);
  process.exit(1);
});
