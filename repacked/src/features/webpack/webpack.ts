import { webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import getWebpackConfig from "./getWebpackConfig";
import WebpackDevServer from "webpack-dev-server";
import { BuildMode } from "./types";

export const serve = async (mode: BuildMode) => {
  const appConfig = await getAppConfig();
  const webpackConfig = await getWebpackConfig(mode, appConfig);
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);

  const runServer = async () => {
    console.log("Starting server...");
    await server.start();
  };

  runServer();
};

export const build = async (mode: BuildMode) => {
  const appConfig = await getAppConfig();
  const webpackConfig = await getWebpackConfig(mode, appConfig);
  webpack(
    webpackConfig,
    (err: (Error & { details?: unknown }) | null, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        process.exit(1);
      }
      const statsData = stats?.toJson();
      if (stats?.hasErrors()) {
        console.error(statsData?.errors);
        process.exit(1);
      }
      if (stats?.hasWarnings()) {
        console.warn(statsData?.warnings);
      }
    }
  );
};
