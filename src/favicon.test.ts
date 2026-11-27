import { describe, expect, it } from "vitest";
import favicon from "../public/favicon.svg?raw";

// The site icon is an SVG file, so it must be valid XML. A browser shows no icon for a file it cannot read. On
// 2026-11-27 a comment with "--" in it broke the file, which XML does not allow.
describe("the site icon", () => {
  it("is a valid SVG file", () => {
    const icon = new DOMParser().parseFromString(favicon, "image/svg+xml");

    expect(icon.querySelector("parsererror")).toBeNull();
    expect(icon.documentElement.tagName).toBe("svg");
  });
});
