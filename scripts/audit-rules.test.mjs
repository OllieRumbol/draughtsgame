import { describe, expect, it } from "vitest";
import { auditProblems, parseExceptions, reportedAdvisories } from "./audit-rules.mjs";

const table = `
| Advisory | Package | Reason | Review by |
| --- | --- | --- | --- |
| GHSA-abcd-efgh-ijkl | example-tool | Build only, no fix yet | 2026-12-31 |
`;

// The shape of "npm audit --json": a package with an advisory, and a package that only depends on it.
function auditWith(...urls) {
  return {
    vulnerabilities: {
      "example-tool": {
        via: urls.map((url, index) => ({ source: 1000 + index, url })),
      },
      "uses-example-tool": { via: ["example-tool"] },
    },
    metadata: { vulnerabilities: { total: urls.length } },
  };
}

describe("parseExceptions", () => {
  it("reads each advisory row, and skips the header and divider", () => {
    expect(parseExceptions(table)).toEqual([
      {
        advisory: "GHSA-ABCD-EFGH-IJKL",
        package: "example-tool",
        reason: "Build only, no fix yet",
        reviewBy: "2026-12-31",
      },
    ]);
  });

  it("finds no rows in the empty table", () => {
    expect(parseExceptions("| Advisory | Package | Reason | Review by |\n| --- | --- | --- | --- |\n")).toEqual([]);
  });
});

describe("reportedAdvisories", () => {
  it("lists each GitHub advisory once", () => {
    const audit = auditWith(
      "https://github.com/advisories/GHSA-abcd-efgh-ijkl",
      "https://github.com/advisories/GHSA-abcd-efgh-ijkl",
    );

    expect(reportedAdvisories(audit)).toEqual(["GHSA-ABCD-EFGH-IJKL"]);
  });

  it("lists an advisory with no GitHub ID by its npm number", () => {
    expect(reportedAdvisories(auditWith(""))).toEqual(["npm advisory 1000"]);
  });
});

describe("auditProblems", () => {
  const exceptions = parseExceptions(table);

  it("passes with no vulnerabilities and no exceptions", () => {
    expect(auditProblems(auditWith(), [], "2026-11-16")).toEqual([]);
  });

  it("fails on a vulnerability that is not approved", () => {
    const audit = auditWith("https://github.com/advisories/GHSA-zzzz-zzzz-zzzz");

    expect(auditProblems(audit, [], "2026-11-16")).toEqual([
      "GHSA-ZZZZ-ZZZZ-ZZZZ is not approved in docs/audit-exceptions.md.",
    ]);
  });

  it("passes on an approved vulnerability before its review date", () => {
    const audit = auditWith("https://github.com/advisories/GHSA-abcd-efgh-ijkl");

    expect(auditProblems(audit, exceptions, "2026-12-31")).toEqual([]);
  });

  it("fails when an exception's review date has passed", () => {
    expect(auditProblems(auditWith(), exceptions, "2027-01-01")).toEqual([
      "The exception for GHSA-ABCD-EFGH-IJKL (example-tool) passed its review date, 2026-12-31.",
    ]);
  });

  it("fails when an exception has no proper review date", () => {
    const badDate = [{ ...exceptions[0], reviewBy: "next year" }];

    expect(auditProblems(auditWith(), badDate, "2026-11-16")).toEqual([
      "The exception for GHSA-ABCD-EFGH-IJKL (example-tool) has no review date as YYYY-MM-DD.",
    ]);
  });

  it("fails when npm audit could not run", () => {
    const audit = { error: { summary: "network error" } };

    expect(auditProblems(audit, [], "2026-11-16")).toEqual(["npm audit could not run: network error"]);
  });
});
