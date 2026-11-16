// "npm run audit": runs npm audit and applies the owner-approved exceptions (plan section 6).
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { auditProblems, parseExceptions } from "./audit-rules.mjs";

// 1. Get the audit result. npm audit exits with an error code when it finds a vulnerability, so read its output.
// A shell finds npm on every system, including npm.cmd on Windows. The command is fixed text, with no input in it.
const result = spawnSync("npm audit --json", {
  encoding: "utf8",
  shell: true,
  maxBuffer: 64 * 1024 * 1024,
});

let auditJson;
try {
  auditJson = JSON.parse(result.stdout);
} catch {
  console.error("npm audit did not return JSON.");
  console.error(result.stderr);
  process.exit(1);
}

// 2. Get the approved exceptions.
const exceptionsFile = new URL("../docs/audit-exceptions.md", import.meta.url);
const exceptions = parseExceptions(readFileSync(exceptionsFile, "utf8"));

// 3. Compare them.
const today = new Date().toISOString().slice(0, 10);
const problems = auditProblems(auditJson, exceptions, today);

// 4. Report.
if (problems.length > 0) {
  console.error("The audit failed:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

const total = auditJson.metadata?.vulnerabilities?.total ?? 0;
console.log(
  total === 0
    ? "The audit passed: no known vulnerabilities."
    : `The audit passed: ${total} known vulnerabilities, each approved in docs/audit-exceptions.md.`,
);
