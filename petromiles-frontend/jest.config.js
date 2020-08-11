/*module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
};*/

const { defaults } = require("jest-config");

module.exports = {
  //preset: "@vue/cli-plugin-unit-jest",
  //testMatch: ["**/test/**/*.spec.js", "**/src/**/*.spec.js"],
  ...defaults,
  testMatch: ["**/tests/**/*.spec.js"],
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
  //setupFiles: ['./tests/setup.js'],
};
