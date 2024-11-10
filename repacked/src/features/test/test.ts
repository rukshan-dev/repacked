import getAppConfig from "../app-config/getAppConfig";
import { getJestConfigAsJSON } from "./jestConfig";

const jest = require("jest");

export const runTest = async (argv: string[]) => {
  const appConfig = await getAppConfig();
  const jestConfig = getJestConfigAsJSON(appConfig.jest);
  argv.push("--config", jestConfig);
  jest.run(argv);
};
