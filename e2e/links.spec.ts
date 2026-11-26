import { expect, test, type Locator } from "@playwright/test";

// The look of a link in running text (plan section 3.6, --link; the owner's choice on 2026-11-26). The colours come
// from tokens.css: --link is #8A4B1F in light mode and #E0B96A in dark mode, and --text is #3B2A1A and #EFE6D8.
const LINK = { light: "rgb(138, 75, 31)", dark: "rgb(224, 185, 106)" };
const TEXT = { light: "rgb(59, 42, 26)", dark: "rgb(239, 230, 216)" };

// The text links on each page: How to play's contents and its About link, About's two links, and game setup's.
const PAGES = [
  { address: "./#/howtoplay", links: ["The rules", "Our house rules", "Using the game", "Read about Ernest"] },
  { address: "./#/about", links: ["the web app", "the API"] },
  { address: "./#/", links: ["Why this game exists"] },
];

test.skip(({ isMobile }) => isMobile, "A phone has no pointer to hover with");

async function expectLinkLook(link: Locator, mode: "light" | "dark"): Promise<void> {
  // Its own colour, not the text's, with an underline in that colour.
  await expect(link).toHaveCSS("color", LINK[mode]);
  await expect(link).toHaveCSS("text-decoration-line", "underline");
  await expect(link).toHaveCSS("text-decoration-color", LINK[mode]);
  await expect(link).toHaveCSS("text-decoration-thickness", "1.5px");

  // A thicker underline under the pointer.
  await link.hover();
  await expect(link).toHaveCSS("text-decoration-thickness", "3px");
}

// At 395 px, "the API" ends a line. Its arrow must stay on that line, not start the next one alone (design review).
test("keeps the arrow of a link that leaves the site on the same line as the link's words", async ({ page }) => {
  await page.setViewportSize({ width: 395, height: 800 });
  await page.goto("./#/about");

  for (const name of ["the web app", "the API"]) {
    const link = page.getByRole("main").getByRole("link", { name, exact: true });
    expect(await link.evaluate((element) => element.getClientRects().length)).toBe(1);
  }
});

for (const mode of ["light", "dark"] as const) {
  for (const { address, links } of PAGES) {
    test(`text links on ${address} look like links in ${mode} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: mode });
      await page.goto(address);
      await expect(page.locator("body")).toHaveCSS("color", TEXT[mode]);

      for (const name of links) {
        await expectLinkLook(page.getByRole("main").getByRole("link", { name, exact: true }), mode);
      }
    });
  }
}
