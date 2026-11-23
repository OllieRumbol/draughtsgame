// Dev only: the entry for dev/board.html, which shows the board in states the Play page cannot reach yet.
// The built site never loads it.
import "@fontsource-variable/fraunces";
import "@fontsource-variable/source-sans-3";
import "@/styles/tokens.css";
import "@/styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BoardPreview } from "./BoardPreview";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("dev/board.html has no element with the id 'root'.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BoardPreview />
  </StrictMode>,
);
