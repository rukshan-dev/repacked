import cwd from "../../utils/cwd";
import { AppConfig, ConsumerAppConfig } from "./types";
import path from "path";

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
  plugins: [],
};

const resolveConfig = async (
  extension: string
): Promise<ConsumerAppConfig | null> => {
  try {
    const configPath = path.resolve(cwd(`config.repacked.${extension}`));
    const configModule = await import(configPath);
    return configModule.default ?? (configModule as ConsumerAppConfig);
  } catch (e) {
    return null;
  }
};

const resolveConfigByExtensions = async () => {
  const mjs = await resolveConfig("mjs");
  if (mjs) {
    return mjs;
  }
  const cjs = await resolveConfig("js");
  if (cjs) {
    return cjs;
  }
  throw new Error("unable to resolve config file");
};

const getAppConfig = async () => {
  try {
    const config = await resolveConfigByExtensions();
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
      plugins: config.plugins ?? defaultAppConfig.plugins,
    };

    return finalConfig;
  } catch (e) {
    console.warn("loading default config", e);
    return defaultAppConfig;
  }
};

export default getAppConfig;
