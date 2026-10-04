import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

// CI sets SKIP_SONARJS=true: SonarCloud already reviews PRs, so the rules stay registered
// (disable comments keep resolving) but are switched off there.
const skipSonar = process.env.SKIP_SONARJS === "true";
const sonarRules = skipSonar
  ? Object.fromEntries(Object.keys(sonarjs.configs.recommended.rules).map((r) => [r, "off"]))
  : {
      ...sonarjs.configs.recommended.rules,
      // Reported but not blocking: large render functions need a planned refactor.
      "sonarjs/cognitive-complexity": "warn",
    };

export default tseslint.config(
  { ignores: ["dist"] },
  {
    // SonarSource rules (same engine as SonarCloud) to catch findings before they reach the dashboard.
    ...sonarjs.configs.recommended,
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: sonarRules,
    linterOptions: { reportUnusedDisableDirectives: skipSonar ? "off" : "warn" },
    languageOptions: { ...sonarjs.configs.recommended.languageOptions, globals: { ...globals.browser, ...globals.node } },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // Generated shadcn/ui primitives and test helpers export variants/utilities next to
    // components by design; Fast Refresh granularity doesn't matter there.
    files: ["src/components/ui/**/*.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    rules: { "react-refresh/only-export-components": "off" },
  },
);
