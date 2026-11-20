// Renders the whole app at an address, with the same hash router and routes as main.tsx.
import { render } from "@testing-library/react";
import { createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/routes";

export function renderApp(hash = "#/") {
  window.location.hash = hash;
  return render(<RouterProvider router={createHashRouter(routes)} />);
}
