import { LicenseWebpackPlugin } from "license-webpack-plugin";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import getRspackConfig from "../rspack/getRspackConfig";
import { BuildMode, RspackConfigOptions } from "../rspack/types";
import { HotReloadServer } from "./plugins/hotReloadServer";
import path from "path";
import { DefinePlugin } from "@rspack/core";

const getServerRspackConfig = async (
  mode: BuildMode,
  appConfig: AppConfig,
  options?: Omit<RspackConfigOptions, "override" | "target">
) => {
  let runtimeEnv = mode === "production" ? "prod" : "dev";

  //handle serverless build runtime
  if (runtimeEnv === "prod" && appConfig.server.runtime === "serverless") {
    runtimeEnv = "serverless";
  }

  return await getRspackConfig(mode, appConfig, {
    ...(options ?? {}),
    target: "server",
    override: (config) => {
      //entry file
      const entry = path.join(
        __dirname,
        "/features/server/runtimes/",
        `runtime.${runtimeEnv}.js`
      );

      //replace virtual module with server
      config.module?.rules?.push({
        test: entry,
        use: [
          {
            loader: path.resolve(
              __dirname,
              "./features/server/loaders/loadServer.js"
            ),
            options: {
              entry: cwd(appConfig.server.entry),
            },
          },
        ],
      });

      //@deprecated: no longer in use because of virtual module replacement
      //config.plugins?.push(new BundleServerConfig(appConfig));

      config.plugins?.push(
        new DefinePlugin({
          "process.env.__INTERNAL_REPACKED_SERVER_CONFIG": {
            client: {
              enabled: appConfig.client.enabled,
            },
          },
        })
      );

      //@todo: find root cause for crash in hot reload
      if (mode === "production") {
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
      }
      if (mode === "development") {
        config.plugins?.push(new HotReloadServer(appConfig));
      }

      config.target = "node";
      config.entry = {
        index: entry,
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

export default getServerRspackConfig;
