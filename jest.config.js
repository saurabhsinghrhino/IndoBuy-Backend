module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  testPathIgnorePatterns: ["setup.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/config/**", "!src/Services/**"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 10000,
};
