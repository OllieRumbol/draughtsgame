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

const auditJson = parseAuditOutput(result);
if (auditJson === null) {
  console.error("npm audit did not return a JSON report.");
  console.error(result.error?.message ?? result.stderr);
  // exitCode, not exit(): exit() can cut off the messages above when they go to a pipe.
  process.exitCode = 1;
} else {
  // 2. Get the approved exceptions.
  const exceptionsFile = new URL("../docs/audit-exceptions.md", import.meta.url);
  const exceptions = parseExceptions(readFileSync(exceptionsFile, "utf8"));

  // 3. Compare them. The review dates are the owner's dates, so compare with the local date, not UTC.
  const today = localDate(new Date());
  const problems = auditProblems(auditJson, exceptions, today);

  // 4. Report.
  if (problems.length > 0) {
    console.error("The audit failed:");
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exitCode = 1;
  } else {
    const total = auditJson.metadata?.vulnerabilities?.total ?? 0;
    console.log(
      total === 0
        ? "The audit passed: no known vulnerabilities."
        : `The audit passed: ${total} known vulnerabilities, each approved in docs/audit-exceptions.md.`,
    );
  }
}

// Returns the report object, or null when npm could not run or printed something other than a JSON object.
function parseAuditOutput(spawnResult) {
  if (spawnResult.error || typeof spawnResult.stdout !== "string") {
    return null;
  }
  try {
    const parsed = JSON.parse(spawnResult.stdout);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

// The date as YYYY-MM-DD in the computer's own time zone.
function localDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
