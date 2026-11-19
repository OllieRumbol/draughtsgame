// The mock API for every test, at the HTTP boundary (plan section 7.1). It has no handlers of its own:
// each test adds the responses it needs with server.use(). test-setup.ts starts and stops it.
import { setupServer } from "msw/node";

export const server = setupServer();

// The address from .env.test. MSW answers it, so no test request leaves the computer (plan section 2).
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
