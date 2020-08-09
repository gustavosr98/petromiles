const { defaults } = require("jest-config");

module.exports = {
  ...defaults,
  testMatch: ["**/test/**/*.spec.js"],
  rootDir: ".",
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/$1"],
  transformIgnorePatterns: ["<rootDir>/node_modules/$1"],
};
