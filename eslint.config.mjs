import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // General config for Node.js environment and globals
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
      parser: tseslint.parser, // Use TS parser
      parserOptions: {
        sourceType: "module", // Expect ES Modules
      },
      ecmaVersion: "latest",
    },
    // Apply this global setting to .js and .mjs files
    files: ["*.js", "*.mjs"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  { // Configuration for .ts files
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": "warn",
      "no-unused-labels": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // Ignore list
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "prisma.config.ts",
      "prisma/seed.ts",
      "*.config.mjs",
      "*.config.js"
    ],
  },
);
