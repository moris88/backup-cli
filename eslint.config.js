const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const jestPlugin = require("eslint-plugin-jest");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "jest": jestPlugin,
      "prettier": prettierPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off"
    }
  }
];
