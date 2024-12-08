import { webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import WebpackDevServer from "webpack-dev-server";
import { expressServer } from "../express/server";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import { BuildMode } from "../webpack/types";
import { AppConfig } from "../app-config/types";
import history from "connect-history-api-fallback";
import path from "path";
import getServerWebpackConfig from "../express/getServerWebpackConfig";
import getClientWebpackConfig from "../webpack/getClientWebpackConfig";
import { logWebpackErrors } from "../webpack/utils";
import { ChildProcessEvents } from "../../types";

const openTab = (url: string) => {
  process.send?.(ChildProcessEvents.ShouldOpenTab);
  process.on("message", (message) => {
    if (message === ChildProcessEvents.OpenTab) {
      const openDevApp = async (url: string) => {
        const open = (await import("open")).default;
        await open(url);
      };
      openDevApp(url);
    }
  });
};

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

  const appEntry = path.join(
    serverWebpackConfig.output?.path as string,
    serverWebpackConfig.output?.filename as string
  );

  const bindRoutes = async () => {
    const clientApp = await import(appEntry);
    const clientAppCallback = clientApp.default?.default || clientApp.default;
    typeof clientAppCallback === "function" && clientAppCallback(app);

    if (clientEnabled) {
      app.use(history());
      const devMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath: clientWebpackConfig.output?.publicPath,
      });
      app.use(devMiddleware);
      app.use(webpackHotMiddleware(clientCompiler));
    }
    appConfig.development.open && openTab(`http://localhost:${port}`);
  };

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  const serverCompiler = webpack(serverWebpackConfig, logWebpackErrors);

  let watchInitiated = false;
  serverCompiler.hooks.done.tap("OnServerCompiled", async (stats) => {
    bindRoutes();
    watchInitiated && process.send?.(ChildProcessEvents.Reload);
    watchInitiated = true;
  });
};

const serveClientOnly = async (mode: BuildMode, appConfig: AppConfig) => {
  const webpackConfig = await getClientWebpackConfig(mode, appConfig);
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
