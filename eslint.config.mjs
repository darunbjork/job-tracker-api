import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
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
      "@typescript-eslint/no-empty-object-type": "off",   // We'll handle this manually
      "no-console": "warn",
      "no-unused-labels": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // Ignore these files completely
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
  }
);
