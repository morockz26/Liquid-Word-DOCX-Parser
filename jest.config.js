module.exports = {
  verbose: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
    "!<rootDir>/src/reportWebVitals.js",
  ],
  setupFilesAfterEnv: ["./test-setup.js"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/config/jest/__mocks__/styleMock.js",
    "\\.(png|gif|ttf|eot)$": "<rootDir>/config/jest/__mocks__/fileMock.js",
    "\\.svg$": "<rootDir>/config/jest/__mocks__/svgrMock.js",
  },
  modulePathIgnorePatterns: ["<rootDir>/config/"],
  testEnvironment: "jsdom",
};
