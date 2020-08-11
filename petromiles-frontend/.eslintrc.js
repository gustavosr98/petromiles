module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/prettier",
    "prettier",
  ],

  parserOptions: {
    parser: "babel-eslint",
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
  },

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};
