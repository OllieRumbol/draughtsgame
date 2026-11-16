// The rules for "npm run audit" (spec section 6.5, item 5, and plan section 6).
// Any known vulnerability fails the audit, unless the owner approved it in docs/audit-exceptions.md.
// A row whose review date has passed also fails the audit, so every exception is looked at again.

const ADVISORY_ID = /GHSA(-[0-9a-z]{4}){3}/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Reads the rows of the table in docs/audit-exceptions.md.
 * The columns are: Advisory | Package | Reason | Review by.
 * @param {string} markdown
 * @returns {{ advisory: string, package: string, reason: string, reviewBy: string }[]}
 */
export function parseExceptions(markdown) {
  const rows = [];

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) {
      continue;
    }

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    // Only a row that starts with an advisory ID is an exception. This skips the header and divider rows.
    if (cells.length !== 4 || !ADVISORY_ID.test(cells[0])) {
      continue;
    }

    const [advisory, packageName, reason, reviewBy] = cells;
    rows.push({ advisory: advisory.toUpperCase(), package: packageName, reason, reviewBy });
  }

  return rows;
}

/**
 * Lists the advisories in the JSON from "npm audit --json".
 * An advisory with no GitHub advisory ID is listed by its npm source number, so it can never be approved by mistake.
 * @param {any} auditJson
 * @returns {string[]}
 */
export function reportedAdvisories(auditJson) {
  const advisories = new Set();

  for (const vulnerability of Object.values(auditJson.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      // A string names another vulnerable package. Its own entry lists the advisory.
      if (typeof via !== "object") {
        continue;
      }

      const match = String(via.url ?? "").match(ADVISORY_ID);
      advisories.add(match ? match[0].toUpperCase() : `npm advisory ${via.source}`);
    }
  }

  return [...advisories];
}

/**
 * Lists every reason the audit fails. An empty list means that it passes.
 * @param {any} auditJson
 * @param {{ advisory: string, package: string, reviewBy: string }[]} exceptions
 * @param {string} today The date as YYYY-MM-DD.
 * @returns {string[]}
 */
export function auditProblems(auditJson, exceptions, today) {
  const problems = [];

  if (auditJson.error) {
    problems.push(`npm audit could not run: ${auditJson.error.summary ?? "no reason given"}`);
  }

  const approved = new Set(exceptions.map((row) => row.advisory));
  for (const advisory of reportedAdvisories(auditJson)) {
    if (!approved.has(advisory)) {
      problems.push(`${advisory} is not approved in docs/audit-exceptions.md.`);
    }
  }

  for (const row of exceptions) {
    if (!ISO_DATE.test(row.reviewBy)) {
      problems.push(`The exception for ${row.advisory} (${row.package}) has no review date as YYYY-MM-DD.`);
    } else if (row.reviewBy < today) {
      problems.push(`The exception for ${row.advisory} (${row.package}) passed its review date, ${row.reviewBy}.`);
    }
  }

  return problems;
}
