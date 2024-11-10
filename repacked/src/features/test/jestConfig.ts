import { Config } from "jest";
import { AppConfig } from "../app-config/types";
import cwd from "../../utils/cwd";
import path from "path";

export const getJestConfig = (): Config => {
  return {
    rootDir: cwd(""),
    roots: ["<rootDir>/src"],
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    ],
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
      "^.+\\.(js|jsx|ts|tsx|mjs|cjs)$": path.resolve(
        __dirname,
        "./features/test/transformers/babelTransformer.js"
      ),
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        path.resolve(
          __dirname,
          "./features/test/transformers/fileTransformer.js"
        ),
      "^.+\\.css$": path.resolve(
        __dirname,
        "./features/test/transformers/cssTransformer.js"
      ),
    },
  };
};

export const getJestConfigAsJSON = (override: AppConfig["jest"]) => {
  return JSON.stringify(override(getJestConfig()));
};
