import "webpack-dev-server";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced";
import CopyPlugin from "copy-webpack-plugin";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import { BuildMode, WebpackConfigOptions } from "./types";
import { EnvVariablesPlugin } from "./plugins/envVariables";
import HtmlMFWebpackPlugin from "./plugins/htmlMFWebpackPlugin";
import getWebpackConfig from "./getWebpackConfig";

const getClientWebpackConfig = async (
  mode: BuildMode,
  appConfig: AppConfig,
  options?: Omit<WebpackConfigOptions, "override" | "target">
) => {
  const isDevelopment = mode === "development";
  const outputDirectory = cwd(appConfig.output.dir);

  let entry: string | string[] | Record<string, string> = [];
  let filename: string;
  if (appConfig.server.enabled && isDevelopment) {
    entry = [
      "webpack-hot-middleware/client?reload=true",
      cwd(appConfig.client.entry),
    ];
    filename = "js/[name].[fullhash].js";
  } else {
    entry = cwd(appConfig.client.entry);
    filename = "js/[name].[fullhash].js";
  }

  const plugins: Configuration["plugins"] = [];

  plugins.push(
    new HtmlWebpackPlugin({ template: cwd(appConfig.client.template) })
  );
  plugins.push(EnvVariablesPlugin(appConfig.client.envFilter));
  isDevelopment && plugins.push(new HotModuleReplacementPlugin());
  isDevelopment &&
    plugins.push(new ReactRefreshWebpackPlugin({ library: appConfig.appName }));
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: cwd("./public"),
          to: outputDirectory,
        },
      ],
    })
  );
  //TODO: add support to server
  if (appConfig.moduleFederation) {
    plugins.push(new ModuleFederationPlugin(appConfig.moduleFederation));
    plugins.push(new HtmlMFWebpackPlugin(appConfig.moduleFederation.filename));
  }

  return await getWebpackConfig(mode, appConfig, {
    ...(options ?? {}),
    target: "client",
    override: (config) => {
      config.entry = entry;
      config.plugins = [...(config.plugins as []), ...plugins];
      config.devServer = {
        hot: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization",
        },
        ...appConfig.development,
      };
      return config;
    },
  });
};

export default getClientWebpackConfig;
