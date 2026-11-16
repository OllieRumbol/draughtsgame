/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { contentSecurityPolicy } from "./config/csp.ts";

// Writes the Content Security Policy into the built index.html, straight after the charset (plan section 6).
// Only for builds: the dev server's hot reload needs an inline script that the policy would block.
function contentSecurityPolicyPlugin(apiBaseUrl: string): Plugin {
  const charset = '<meta charset="UTF-8" />';

  return {
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml(html) {
      if (!html.includes(charset)) {
        throw new Error(`index.html must contain ${charset}, so the Content Security Policy can follow it.`);
      }
      const policy = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(apiBaseUrl)}" />`;
      return html.replace(charset, `${charset}\n    ${policy}`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // The dev proxy forwards /api to the live API (plan section 3.5, decision 9).
  // Its address comes from .env.production, so it is written in one place.
  const liveApiOrigin = new URL(loadEnv("production", process.cwd(), "VITE_").VITE_API_BASE_URL).origin;

  return {
    // The site is served from https://ollierumbol.github.io/draughtsgame/ (spec section 2.5).
    base: "/draughtsgame/",
    plugins: [
      react(),
      // The React Compiler, through Babel (plan section 3.5, decision 2).
      babel({ presets: [reactCompilerPreset()] }),
      contentSecurityPolicyPlugin(env.VITE_API_BASE_URL ?? ""),
    ],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: {
      proxy: {
        "/api": { target: liveApiOrigin, changeOrigin: true },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test-setup.ts"],
    },
  };
});
