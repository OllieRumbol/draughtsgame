// Every route in one place (plan section 3.3.5). The hash router in main.tsx keeps the old addresses working:
// #/, #/howtoplay and #/about (spec section 6.1.10, item 2).
import type { ReactNode } from "react";
import type { RouteObject } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { PageErrorBoundary } from "@/components/layout/PageErrorBoundary";
import { AboutPage } from "@/pages/about/AboutPage";
import { HowToPlayPage } from "@/pages/how-to-play/HowToPlayPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { PlayPage } from "@/pages/play/PlayPage";

// Each page has its own error boundary (plan section 4).
function page(element: ReactNode): ReactNode {
  return <PageErrorBoundary>{element}</PageErrorBoundary>;
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: page(<PlayPage />) },
      { path: "howtoplay", element: page(<HowToPlayPage />) },
      { path: "about", element: page(<AboutPage />) },
      { path: "*", element: page(<NotFoundPage />) },
    ],
  },
];
