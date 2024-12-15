import { webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import WebpackDevServer from "webpack-dev-server";
import { BuildMode } from "../webpack/types";
import { AppConfig } from "../app-config/types";
import path from "path";
import getClientWebpackConfig from "../webpack/getClientWebpackConfig";
import { createChildProcess } from "../childProcess/childProcess";
import { expressServer } from "../express/server";
import history from "connect-history-api-fallback";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import { createProxyMiddleware } from "http-proxy-middleware";

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

const serveServer = async (mode: BuildMode, appConfig: AppConfig) => {
  const programPath = path.join(__dirname, "features/serve/serveDevServer.js");
  createChildProcess(programPath);

  const clientWebpackConfig = await getClientWebpackConfig(mode, appConfig, {});
  clientWebpackConfig.output!.publicPath = appConfig.client.publicPath;
  const clientCompiler = webpack(clientWebpackConfig);
  const port = appConfig.development.port || 3000;
  const clientEnabled = appConfig.client.enabled;

  const app = expressServer();
  const nextWeakMap = new WeakMap();

  const proxy = createProxyMiddleware({
    target: `http://localhost:${port + 1}`,
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyRes: (proxyRes, req, res) => {
        if (!clientEnabled) {
          proxyRes.pipe(res);
          return;
        }
        if (proxyRes.headers?.["x-dev-repacked-route-status"] === "unhandled") {
          const next = nextWeakMap.get(req);
          return next();
        } else {
          proxyRes.pipe(res);
        }
      },
    },
  });

  app.use((req, res, next) => {
    nextWeakMap.set(req, next);
    proxy(req, res, next);
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
