import "@fontsource-variable/fraunces";
import "@fontsource-variable/source-sans-3";
import "@/styles/tokens.css";
import "@/styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/routes";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("index.html has no element with the id 'root'.");
}

// A hash router, so GitHub Pages needs no 404 workaround and the old addresses keep working (plan section 3.3.5).
const router = createHashRouter(routes);

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
