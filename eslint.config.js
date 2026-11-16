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
    files: ["**/*.{js,mjs}", "vite.config.ts", "config/**/*.ts"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  // Plan section 5: the site never logs to the console.
  { rules: { "no-console": "error" } },
  // Command-line scripts report their result on the console.
  { files: ["scripts/**"], rules: { "no-console": "off" } },
]);
