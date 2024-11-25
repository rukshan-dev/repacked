import cwd from "../../utils/cwd";
import { AppConfig, ConsumerAppConfig } from "./types";

const defaultAppConfig: AppConfig = {
  appName: "app_name",
  entry: "./src/index.tsx",
  output: {
    dir: "./dist",
  },
  server: {
    enabled: false,
    entry: "",
  },
  development: {
    port: 3000,
    open: true,
  },
  envFilter: (key) => key.startsWith("PUBLIC_"),
  webpack: (config) => config,
  jest: (config) => config,
};

const getAppConfig = async () => {
  try {
    const config = (await import(cwd("config.repacked.js")))
      .default as ConsumerAppConfig;
    const finalConfig: AppConfig = {
      ...defaultAppConfig,
      ...config,
      output: {
        ...defaultAppConfig.output,
        ...(config.output ?? {}),
      },
      server: {
        ...defaultAppConfig.server,
        ...(config.server || {}),
      },
      development: {
        ...defaultAppConfig.development,
        ...(config.development || {}),
      },
    };
    return finalConfig;
  } catch (e) {
    console.warn("loading default config");
    return defaultAppConfig;
  }
};

export default getAppConfig;
