// eslint.config.js
import js from "@eslint/js";
import ts from "typescript-eslint";
import jest from 'eslint-plugin-jest';

export default [
  // Base configs
  js.configs.recommended,
  ...ts.configs.recommended,

  // Configuration for all .ts files
  {
    files: ["**/*.ts"], // Target only .ts files
    ignores: ["dist/**", "node_modules/**"], // Ensure these are ignored
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: "./tsconfig.json", // Point to the updated tsconfig.json
        sourceType: "module",
      },
      globals: {
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      // Temporarily disabled rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", // Still disabled for now
      "@typescript-eslint/ban-ts-comment": "off",
      // Kept rules
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-unused-labels": "warn",
      "no-unused-expressions": "warn",
    },
  },
  // Configuration for test files
  {
    files: ["tests/**/*.ts"],
    plugins: {
      jest, // Register the Jest plugin
    },
    // Removed the languageOptions block with globals that used require().
    // The plugin itself should provide necessary globals or rules.
  },
];
