import { LicenseWebpackPlugin } from "license-webpack-plugin";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import getWebpackConfig from "../webpack/getWebpackConfig";
import { BuildMode, WebpackConfigOptions } from "../webpack/types";
import { BundleServerConfig } from "./plugins/bundleServerConfig";
import { HotReloadServer } from "./plugins/hotReloadServer";
import path from "path";

const getServerWebpackConfig = async (
  mode: BuildMode,
  appConfig: AppConfig,
  options?: Omit<WebpackConfigOptions, "override" | "target">
) => {
  const runtimeEnv = mode === "production" ? "prod" : "dev";

  const getCustomRuntime = () => {
    if (mode === "production" && !!appConfig.server.runtimeScript.production) {
      return appConfig.server.runtimeScript.production;
    }
    if (!!appConfig.server.runtimeScript.development) {
      return appConfig.server.runtimeScript.development;
    }
    return null;
  };

  return await getWebpackConfig(mode, appConfig, {
    ...(options ?? {}),
    target: "server",
    override: (config) => {
      config.plugins?.push(new BundleServerConfig(appConfig));
      config.plugins?.push(
        new LicenseWebpackPlugin({
          outputFilename: "LICENSE",
          perChunkOutput: false,
          addBanner: true,
          stats: {
            warnings: false,
          },
        }) as any
      );

      if (mode === "development") {
        config.plugins?.push(new HotReloadServer(appConfig));
      }

      config.target = "node";
      config.entry = {
        app: cwd(appConfig.server.entry),
        index:
          getCustomRuntime() ??
          path.join(
            __dirname,
            "/features/server/runtimes/",
            `runtime.${runtimeEnv}.js`
          ),
      };
      config.output!.libraryTarget = "commonjs2";
      config.output!.filename = "[name].js";
      config.output!.publicPath = appConfig.client.publicPath;

      config.optimization = {
        sideEffects: true,
      };

      delete config.devServer;
      return config;
    },
  });
};

export default getServerWebpackConfig;
