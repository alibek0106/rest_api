import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import playwrightPlugin from "eslint-plugin-playwright";

export default [
    {
        // Apply to all TypeScript files
        files: ["**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslintPlugin,
            "playwright": playwrightPlugin,
        },
        rules: {
            // Standard ESLint Rules
            "no-console": "error", // STRICTLY ENFORCE Rule #4
            "no-duplicate-imports": "error",

            // TypeScript Rules
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
            "@typescript-eslint/no-explicit-any": "warn", // Discourage 'any' type

            // Playwright Best Practices
            ...playwrightPlugin.configs['playwright-test'].rules,
            "playwright/no-focused-test": "error", // Prevent .only from getting committed
            "playwright/no-skipped-test": "warn",
        },
    },
];