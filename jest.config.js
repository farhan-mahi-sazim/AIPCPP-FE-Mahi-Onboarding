/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
    uuid: require.resolve("uuid"),
  },
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
};
