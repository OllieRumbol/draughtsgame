import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/test-server";

// A request that no handler answers fails the test, so no test can reach the live API.
beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

// Vitest does not use globals here, so React Testing Library cannot clean up by itself.
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
