import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "@/test-server";

// A request that no handler answers fails the test, so no test can reach the live API.
beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

// jsdom has no matchMedia, which useTheme reads. By default the device is in light mode and never changes.
// A test can stub it again to set the device's mode.
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
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
