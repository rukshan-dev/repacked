import "webpack-dev-server";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced";
import CopyPlugin from "copy-webpack-plugin";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import { BuildMode } from "./types";
import { EnvVariablesPlugin } from "./plugins/envVariables";
import HtmlMFWebpackPlugin from "./plugins/htmlMFWebpackPlugin";
import { getBabelOptions } from "../babel/babelOptions";

const getWebpackConfig: (
  mode: BuildMode,
  appConfig: AppConfig
) => Promise<Configuration> = async (mode, appConfig: AppConfig) => {
  const isDevelopment = mode === "development";
  const outputDirectory = cwd(appConfig.output.dir);
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
  if (appConfig.moduleFederation) {
    plugins.push(new ModuleFederationPlugin(appConfig.moduleFederation));
    plugins.push(new HtmlMFWebpackPlugin(appConfig.moduleFederation.filename));
  }

  const webpackConfig: Configuration = {
    mode,
    cache: false,
    entry:
      appConfig.server.enabled && isDevelopment
        ? [
            "webpack-hot-middleware/client?reload=true",
            cwd(appConfig.client.entry),
          ]
        : cwd(appConfig.client.entry),
    devtool: "source-map",
    output: {
      uniqueName: appConfig.appName,
      publicPath: "auto",
      path: outputDirectory,
      filename: "js/[name].[fullhash].js",
      clean: true,
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          use: {
            loader: "babel-loader",
            options: getBabelOptions(isDevelopment),
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
          use: ["file-loader"],
        },
      ],
    },
    resolve: {
      extensions: ["*", ".jsx", ".tsx", ".ts", ".js"],
    },
    performance: {
      hints: false,
    },
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      ...appConfig.development,
    },
  };
  return appConfig.webpack(webpackConfig);
};

export default getWebpackConfig;
