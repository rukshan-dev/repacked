import { webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import getWebpackConfig from "./getWebpackConfig";
import WebpackDevServer from "webpack-dev-server";

export const serve = async () => {
  const appConfig = await getAppConfig();
  const webpackConfig = await getWebpackConfig(appConfig);
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);

  const runServer = async () => {
    console.log("Starting server...");
    await server.start();
  };

  runServer();
};

export const build = async () => {};
