import "webpack-dev-server";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";
import CopyPlugin from "copy-webpack-plugin";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import { BuildMode } from "./types";
import { EnvVariablesPlugin } from "./plugins/envVariables";

const getWebpackConfig: (
  mode: BuildMode,
  appConfig: AppConfig
) => Promise<Configuration> = async (mode, appConfig: AppConfig) => {
  const isDevelopment = mode === "development";
  const plugins: Configuration["plugins"] = [];

  plugins.push(new HtmlWebpackPlugin({ template: cwd("./src/index.html") }));
  plugins.push(EnvVariablesPlugin(appConfig.envFilter));
  isDevelopment && plugins.push(new ReactRefreshWebpackPlugin());
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: cwd("./public"),
          to: cwd("dist"),
        },
      ],
    })
  );
  if (appConfig.moduleFederation) {
    plugins.push(new ModuleFederationPlugin(appConfig.moduleFederation));
  }

  const webpackConfig: Configuration = {
    mode,
    entry: cwd(appConfig.entry),
    devtool: "source-map",
    output: {
      path: cwd("dist"),
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
            options: {
              plugins: isDevelopment ? ["react-refresh/babel"] : [],
              presets: [
                "@babel/preset-env",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
                "@babel/preset-typescript",
              ],
            },
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
      port: 3000,
      hot: true,
      open: true,
      ...appConfig.devServer,
    },
  };
  return appConfig.webpack(webpackConfig);
};

export default getWebpackConfig;
