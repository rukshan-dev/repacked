import "webpack-dev-server";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";
import CopyPlugin from "copy-webpack-plugin";
import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";

const getWebpackConfig: (
  appConfig: AppConfig
) => Promise<Configuration> = async (appConfig: AppConfig) => {
  const plugins: Configuration["plugins"] = [];
  plugins.push(new HtmlWebpackPlugin({ template: cwd("./src/index.html") }));
  plugins.push(new ReactRefreshWebpackPlugin()); //only dev mode
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
              plugins: ["react-refresh/babel"], //only dev mode
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
    mode: "development",
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 10000,
        maxSize: 250000,
      },
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
