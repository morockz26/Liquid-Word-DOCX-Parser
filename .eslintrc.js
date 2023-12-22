const environment = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `./.env.${environment}` });

module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: [
    "eslint:recommended",
    "plugin:cypress/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
    "plugin:prettier/recommended",
  ],
  parser: "@babel/eslint-parser", // Uses @babel/eslint-parser transforms.
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  plugins: [
    "import",
    "react",
    "prettier",
    "sort-destructure-keys",
    "cypress",
    "custom-rules",
  ],
  root: true, // For configuration cascading.
  rules: {
    "cypress/no-unnecessary-waiting": "off",
    "cypress/unsafe-to-chain-command": "off",
    "custom-rules/decorator-order": "error", // Use the custom rule
    "testing-library/await-async-utils": "warn",
    "testing-library/render-result-naming-convention": "off",
    "prettier/prettier": "error",
    "jest/expect-expect": "off",
    "sort-destructure-keys/sort-destructure-keys": "error",
    "react/sort-prop-types": "error",
    "react/jsx-wrap-multilines": "off",
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: false,
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "airbnb-typescript",
      ],
      rules: {
        "comma-dangle": "off",
        "object-curly-newline": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
        "react/require-default-props": "off",
        "react/jsx-wrap-multilines": "off",
        "react/function-component-definition": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
  ignorePatterns: ["dist/*"],
  settings: {
    react: {
      version: "detect", // Detect react version
    },
  },
};
