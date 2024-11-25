import cwd from "../../utils/cwd";
import { AppConfig } from "./types";

const defaultAppConfig: AppConfig = {
  appName: "app_name",
  entry: "./src/index.tsx",
  output: {
    dir: "./dist",
  },
  devServer: {},
  envFilter: (key) => key.startsWith("PUBLIC_"),
  webpack: (config) => config,
  jest: (config) => config,
};

const getAppConfig = async () => {
  try {
    const config = (await import(cwd("config.repacked.js")))
      .default as AppConfig;
    return { ...defaultAppConfig, ...config };
  } catch (e) {
    console.warn("loading default config");
    return defaultAppConfig;
  }
};

export default getAppConfig;
