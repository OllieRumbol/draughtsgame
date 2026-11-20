import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "coverage", "docs", "playwright-report", "test-results"]),
  {
    files: ["**/*.{ts,tsx}"],
    // The React Hooks rules also report code that the React Compiler has to skip (~/.claude/rules/react.md).
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs}", "vite.config.ts", "playwright.config.ts", "config/**/*.ts", "e2e/**/*.ts"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  // public/theme.js runs in the browser, before the app (see the file).
  {
    files: ["public/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  // Plan section 5: the site never logs to the console.
  { rules: { "no-console": "error" } },
  // Command-line scripts report their result on the console.
  { files: ["scripts/**"], rules: { "no-console": "off" } },
  // Plan section 3.1: src/game/ is plain TypeScript. It imports nothing from React or from the rest of the app.
  {
    files: ["src/game/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react/*", "react-dom", "react-dom/*", "react-router", "react-router/*"],
              message: "src/game/ must not import React (plan section 3.1).",
            },
            {
              group: ["@/*", "!@/game", "!@/game/*", "../*"],
              message: "src/game/ imports nothing from the rest of the app (plan section 3.1).",
            },
          ],
        },
      ],
    },
  },
]);
