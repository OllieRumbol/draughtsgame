import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
// Imported through the "@" alias, so this test also fails if the alias breaks.
import { PlaceholderPage } from "@/pages/placeholder/PlaceholderPage";

describe("PlaceholderPage", () => {
  it("shows the main heading Draughts", () => {
    render(<PlaceholderPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Draughts" })).toBeInTheDocument();
  });
});
