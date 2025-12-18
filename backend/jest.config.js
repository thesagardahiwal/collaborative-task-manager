const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  resetMocks: true,
};