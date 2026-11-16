import { describe, expect, it } from "vitest";
import { contentSecurityPolicy } from "./csp.ts";

const productionApi = "https://func-draughts-game-chhwarhkf4hphjf0.uksouth-01.azurewebsites.net/api";

describe("contentSecurityPolicy", () => {
  it("is the policy in plan section 6, with the API host allowed for requests", () => {
    expect(contentSecurityPolicy(productionApi)).toBe(
      "default-src 'self'; " +
        "connect-src 'self' https://func-draughts-game-chhwarhkf4hphjf0.uksouth-01.azurewebsites.net; " +
        "img-src 'self' data:; " +
        "style-src 'self' 'unsafe-inline'; " +
        "font-src 'self'; " +
        "script-src 'self'; " +
        "base-uri 'self'; " +
        "form-action 'none'",
    );
  });

  it("allows only the site itself when the API address is relative", () => {
    expect(contentSecurityPolicy("/api")).toContain("connect-src 'self';");
  });

  it("refuses an empty API address", () => {
    expect(() => contentSecurityPolicy("")).toThrow("VITE_API_BASE_URL is empty");
  });
});
