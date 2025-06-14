import cwd from "../../utils/cwd";
import { AppConfig, ConsumerAppConfig } from "./types";

const defaultAppConfig: AppConfig = {
  appName: "app_name",
  output: {
    dir: "./dist",
  },
  client: {
    enabled: true,
    template: "./src/index.html",
    entry: "./src/index.tsx",
    publicPath: "/",
    assetsDir: "./public",
    envFilter: (key) => key.startsWith("PUBLIC_"),
  },
  server: {
    enabled: false,
    entry: "./src/server.ts",
    runtimeScript: {},
  },
  development: {
    port: 3000,
    open: true,
  },
  rspack: (config) => config,
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
      client: {
        ...defaultAppConfig.client,
        ...(config.client || {}),
      },
      server: {
        ...defaultAppConfig.server,
        ...(config.server || {}),
      },
      development: {
        ...defaultAppConfig.development,
        ...(config.development || {}),
      },
      rspack: config.rspack ?? config.webpack ?? defaultAppConfig.rspack,
    };

    return finalConfig;
  } catch (e) {
    console.warn("loading default config");
    return defaultAppConfig;
  }
};

export default getAppConfig;
