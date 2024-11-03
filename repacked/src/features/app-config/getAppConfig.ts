import cwd from "../../utils/cwd";
import { AppConfig } from "./types";

const defaultAppConfig: AppConfig = {
  entry: "./src/index.tsx",
  devServer: {},
  webpack: (config) => config,
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
