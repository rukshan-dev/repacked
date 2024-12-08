import { webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import WebpackDevServer from "webpack-dev-server";
import { expressServer } from "../express/server";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import { BuildMode } from "../webpack/types";
import getWebpackConfig from "../webpack/getWebpackConfig";
import { AppConfig } from "../app-config/types";
import history from "connect-history-api-fallback";
import { Router } from "express";
import path from "path";
import getServerWebpackConfig from "../express/getServerWebpackConfig";
import getClientWebpackConfig from "../webpack/getClientWebpackConfig";
import { logWebpackErrors } from "../webpack/utils";

const serveServer = async (mode: BuildMode, appConfig: AppConfig) => {
  const clientWebpackConfig = await getClientWebpackConfig(mode, appConfig, {});
  clientWebpackConfig.output!.publicPath = appConfig.client.publicPath;
  const serverWebpackConfig = await getServerWebpackConfig(mode, appConfig, {
    watch: true,
  });
  const clientCompiler = webpack(clientWebpackConfig);
  const port = appConfig.development.port || 3000;
  const clientEnabled = appConfig.client.enabled;
  const app = expressServer();
  let clientRouter: Router;

  const resetRoutes = async (entry: string) => {
    clientRouter = Router();
    delete require.cache[require.resolve(entry)];
    const clientApp = await import(entry);
    const clientAppCallback = clientApp.default;
    typeof clientAppCallback === "function" &&
      clientAppCallback(clientRouter, app);
    app.use(clientRouter);
  };

  app.use(function dynamicRouter(req, res, next) {
    clientRouter(req, res, next);
  });

  if (clientEnabled) {
    app.use(history());
    const devMiddleware = webpackDevMiddleware(clientCompiler, {
      publicPath: clientWebpackConfig.output?.publicPath,
    });
    app.use(devMiddleware);
    app.use(webpackHotMiddleware(clientCompiler));
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  const serverCompiler = webpack(serverWebpackConfig, logWebpackErrors);

  serverCompiler.hooks.done.tap("ResetRoutes", async (stats) => {
    const info = stats?.toJson({
      assets: true,
    });
    info?.assets?.forEach(async (asset) => {
      if (!stats?.hasErrors()) {
        delete require.cache[
          require.resolve(
            path.join(
              serverWebpackConfig.output?.path as string,
              asset.name as string
            )
          )
        ];
        await resetRoutes(
          path.join(
            serverWebpackConfig.output?.path as string,
            serverWebpackConfig.output?.filename as string
          )
        );
      }
    });
  });
};

const serveClientOnly = async (mode: BuildMode, appConfig: AppConfig) => {
  const webpackConfig = await getWebpackConfig(mode, appConfig);
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);
  const runServer = async () => {
    console.log("Starting server...");
    await server.start();
  };

  runServer();
};

const serve = async (mode: BuildMode) => {
  const appConfig = await getAppConfig();
  if (appConfig.server.enabled) {
    serveServer(mode, appConfig);
  } else {
    serveClientOnly(mode, appConfig);
  }
};

export default serve;
