import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest does not use globals here, so React Testing Library cannot clean up by itself.
afterEach(() => {
  cleanup();
});
