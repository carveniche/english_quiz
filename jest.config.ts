export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/src/**/**/*.test.tsx",
    "<rootDir>/src/components/FeatureComponent/**/_tests_/*.test.tsx",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/database",
    "src/test",
    "src/types",
  ],
  reporters: ["default", "jest-junit"],
  globals: { "ts-jest": { diagnostics: false } },
  moduleNameMapper: {
    "\\.(svg|png|jpg)$": "<rootDir>/jestFileMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
