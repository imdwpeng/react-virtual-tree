/*
 * @Author: Dong
 * @Date: 2021-11-01 13:07:57
 * @LastEditors: Dong
 * @LastEditTime: 2022-02-10 09:21:08
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "no-nested-ternary": 0,
    "no-use-before-define": 0,
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/jsx-props-no-spreading": 0,
    "react/jsx-filename-extension": [0, { extensions: [".js", ".jsx"] }],
    "import/extensions": 0,
    "import/no-extraneous-dependencies": [2, { devDependencies: true }],
    "import/no-unresolved": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "max-len": [1, 200],
    "jsx-a11y/no-static-element-interactions": 0,
    "no-param-reassign": 0,
    "prettier/prettier": "error",
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-explicit-any": "off",
  },
};
