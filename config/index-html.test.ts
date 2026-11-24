import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type ViteDevServer, createServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// public/theme.js applies the player's light or dark choice before the first paint (spec section 6.4.1, item 2).
// The site is served under /draughtsgame/, so the page must ask for /draughtsgame/theme.js. The e2e tests use the
// build, so this test checks the dev server's page, where the base was once added twice.
// Vitest runs from the repository root.
const root = process.cwd();
let server: ViteDevServer;

beforeAll(async () => {
  server = await createServer({ root, configFile: join(root, "vite.config.ts"), server: { middlewareMode: true } });
});

afterAll(async () => {
  await server.close();
});

describe("index.html on the dev server", () => {
  it("asks for theme.js under the site's base, once", async () => {
    const html = await server.transformIndexHtml("/draughtsgame/", readFileSync(join(root, "index.html"), "utf-8"));

    expect(html).toContain('<script src="/draughtsgame/theme.js"></script>');
  });
});
