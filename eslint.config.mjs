import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js default configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Override specific rules
  {
    rules: {
      // Allow usage of `any` when necessary
      "@typescript-eslint/no-explicit-any": "off",
      // Warn on unused vars, but ignore those prefixed with `_`
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }
      ],
    },
  },
];

export default eslintConfig;

