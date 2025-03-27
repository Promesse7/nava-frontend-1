import globals from "globals";
import js from "@eslint/js";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node, // Node.js globals (e.g., require, module)
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "error", // Matches your previous linting errors
    },
  },
  js.configs.recommended, // Spread ESLint's recommended rules
];