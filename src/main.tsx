import "@fontsource-variable/fraunces";
import "@fontsource-variable/source-sans-3";
import "@/styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PlaceholderPage } from "@/pages/placeholder/PlaceholderPage";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("index.html has no element with the id 'root'.");
}

createRoot(rootElement).render(
  <StrictMode>
    <PlaceholderPage />
  </StrictMode>,
);
