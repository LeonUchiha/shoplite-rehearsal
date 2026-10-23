#!/usr/bin/env node
// review-tools guard: a PreToolUse hook that keeps the workflow human-owned and secret-free.
// Reads the hook payload on stdin. No network, no file writes, no dependencies.
//
// Blocks:
//   1. any MCP tool that merges a pull request
//   2. `git push --force` / `gh pr merge` from the shell
//   3. writing token-shaped strings or private keys into files or commands
//   4. writing a .env file
//
// Claude Code payload : { hook_event_name, tool_name, tool_input }   -> block = exit 2 + stderr
// Copilot payload     : { toolName, toolArgs }                       -> block = JSON permissionDecision

const SECRET_PATTERNS = [
  /\bghp_[A-Za-z0-9]{36}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{60,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

function readStdin() {
  try {
    return require("fs").readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parse(raw) {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function check(toolName, input) {
  const text = typeof input === "string" ? input : JSON.stringify(input || {});

  if (/merge_pull_request|pr_merge/i.test(toolName)) {
    return "Merging is a human decision. The review-tools workflow never merges a PR.";
  }
  if (/git\s+push\b[^\n]*(--force\b|--force-with-lease\b|\s-f\b)/.test(text)) {
    return "Force-push is blocked by review-tools.";
  }
  if (/\bgh\s+pr\s+merge\b/.test(text)) {
    return "Merging is a human decision. The review-tools workflow never merges a PR.";
  }
  const path = (input && (input.file_path || input.path)) || "";
  if (/(^|[\\/])\.env(\.[^\\/]*)?$/.test(path) && !/\.env\.example$/.test(path)) {
    return "Writing .env files is blocked: secrets come from the environment, not from files.";
  }
  if (SECRET_PATTERNS.some((re) => re.test(text))) {
    return "A token or private key was detected in this tool call. Use an environment variable placeholder instead.";
  }
  return null;
}

const payload = parse(readStdin());
const isClaude = "hook_event_name" in payload || "tool_name" in payload;
const toolName = payload.tool_name || payload.toolName || "";
let input = payload.tool_input || payload.toolArgs || {};
if (typeof input === "string") {
  input = parse(input) || input;
}

const reason = check(toolName, input);

if (!reason) {
  process.exit(0);
}
if (isClaude) {
  process.stderr.write(`[review-tools guard] ${reason}\n`);
  process.exit(2);
}
process.stdout.write(JSON.stringify({ permissionDecision: "deny", permissionDecisionReason: reason }));
process.exit(0);
