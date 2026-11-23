import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "@/test-server";

// A request that no handler answers fails the test, so no test can reach the live API.
beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

// jsdom has no matchMedia, which useTheme and usePrefersReducedMotion read. By default the device is in light mode,
// with no reduced motion, and never changes. A test can stub it again to set the device's mode.
// jsdom has no Element.animate either, which the board's motion uses. The stand-in finishes at once, and a test can
// read its calls.
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  Element.prototype.animate = vi.fn(() => ({ finished: Promise.resolve(), cancel() {} }) as unknown as Animation);
});

// Vitest does not use globals here, so React Testing Library cannot clean up by itself.
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.unstubAllGlobals();
});

afterAll(() => {
  server.close();
});
