import "@rspack/dev-server";
import {
  Configuration,
  HotModuleReplacementPlugin,
  HtmlRspackPlugin as HtmlRspackPlugin,
  rspack,
} from "@rspack/core";
import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import { BuildMode, RspackConfigOptions } from "../rspack/types";
import { EnvVariablesPlugin } from "./plugins/envVariables";
import HtmlMFRspackPlugin from "./plugins/htmlMFWebpackPlugin";
import getRspackConfig from "../rspack/getRspackConfig";

const getClientRspackConfig = async (
  mode: BuildMode,
  appConfig: AppConfig,
  options?: Omit<RspackConfigOptions, "override" | "target">
) => {
  const isDevelopment = mode === "development";
  const outputDirectory = cwd(appConfig.output.dir);

  let entry: string | string[] | Record<string, string> = [];
  if (appConfig.server.enabled && isDevelopment) {
    entry = [
      "webpack-hot-middleware/client?reload=true",
      cwd(appConfig.client.entry),
    ];
  } else {
    entry = cwd(appConfig.client.entry);
  }

  const plugins: Configuration["plugins"] = [];

  plugins.push(
    new HtmlRspackPlugin({ template: cwd(appConfig.client.template) })
  );
  plugins.push(EnvVariablesPlugin(appConfig.client.envFilter));
  isDevelopment && plugins.push(new HotModuleReplacementPlugin());
  isDevelopment &&
    plugins.push(new ReactRefreshRspackPlugin({ library: appConfig.appName }));
  plugins.push(
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: cwd(appConfig.client.assetsDir),
          to: outputDirectory,
        },
      ],
    })
  );
  //TODO: add support to server
  if (appConfig.moduleFederation) {
    plugins.push(new ModuleFederationPlugin(appConfig.moduleFederation));
    plugins.push(new HtmlMFRspackPlugin(appConfig.moduleFederation.filename));
  }

  return await getRspackConfig(mode, appConfig, {
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

export default getClientRspackConfig;
