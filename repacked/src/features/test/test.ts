import { AppConfig } from "../app-config/types";
import { getJestConfigAsJSON } from "./jestConfig";

const jest = require("jest");

export const runTest = async (argv: string[], appConfig: AppConfig) => {
  const jestConfig = getJestConfigAsJSON(appConfig.jest);
  argv.push("--config", jestConfig);
  jest.run(argv);
};
