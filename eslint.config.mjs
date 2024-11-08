import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactNative from "eslint-plugin-react-native";
import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
    plugins: {
      react,
      "react-native": reactNative,
      "@typescript-eslint": typescript,
    },
    rules: {
      // Add your custom rules here
    },
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
  },
];