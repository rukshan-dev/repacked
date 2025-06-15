import "@rspack/dev-server";
import { Configuration } from "@rspack/core";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import { BuildMode, RspackConfigOptions } from "./types";
import { getSwcOptions } from "../swc/swcOptions";

const getRspackConfig: (
  mode: BuildMode,
  appConfig: AppConfig,
  options: RspackConfigOptions
) => Promise<Configuration> = async (mode, appConfig, options) => {
  const isDevelopment = mode === "development";
  const isServer = options?.target === "server";
  const configOverride =
    options?.override ?? ((config: Configuration) => config);

  const outputDirectory = cwd(appConfig.output.dir);

  const rspackConfig: Configuration = {
    mode,
    watch: options?.watch,
    watchOptions: options?.watch
      ? {
          ignored: /node_modules/,
          poll: 1000,
          aggregateTimeout: 300,
        }
      : undefined,
    cache: false,
    entry: cwd(appConfig.client.entry),
    devtool: "source-map",
    output: {
      uniqueName: appConfig.appName,
      publicPath: appConfig.client.publicPath,
      path: outputDirectory,
      filename: "js/[name].[fullhash].js",
      clean: typeof options?.clean === "boolean" ? options.clean : true,
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.(j|t)s?$/,
          use: {
            loader: "builtin:swc-loader",
            options: getSwcOptions({
              tsx: false,
              isProduction: !isDevelopment,
              isServer,
            }),
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(js|ts)x?$/,
          use: {
            loader: "builtin:swc-loader",
            options: getSwcOptions({
              tsx: true,
              isProduction: !isDevelopment,
              isServer,
            }),
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          exclude: /node_modules/,
          use: [
            isServer
              ? {
                  loader: "file-loader",
                  options: {
                    emitFile: false,
                    publicPath: appConfig.client.publicPath,
                  },
                }
              : "file-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: ["*", ".jsx", ".tsx", ".ts", ".js"],
    },
    performance: {
      hints: false,
    },
  };

  //unstable - override rspack config via plugins
  appConfig.plugins.forEach((plugin) => {
    const customPlugin = plugin({ target: options.target, appConfig });
    rspackConfig.plugins?.push(customPlugin);
    customPlugin.updateConfig?.(rspackConfig);
  });

  return appConfig.rspack(
    configOverride(rspackConfig),
    options?.target ?? "client"
  );
};

export default getRspackConfig;
