import { rspack } from "@rspack/core";
import { RspackDevServer } from "@rspack/dev-server";
import { BuildMode } from "../rspack/types";
import { AppConfig } from "../app-config/types";
import { expressServer } from "../server/server";
import history from "connect-history-api-fallback";
import rspackHotMiddleware from "webpack-hot-middleware";
import rspackDevMiddleware from "webpack-dev-middleware";
import { createProxyMiddleware } from "http-proxy-middleware";
import getServerRspackConfig from "../server/getServerRspackConfig";
import { logRspackErrors } from "../rspack/utils";
import getClientRspackConfig from "../client/getClientRspackConfig";
import { copyHeaders } from "./utils/copyHeaders";
import { Compiler } from "webpack";

const serveClientOnly = async (mode: BuildMode, appConfig: AppConfig) => {
  const rspackConfig = await getClientRspackConfig(mode, appConfig);
  rspackConfig.devServer!.historyApiFallback = true;
  const compiler = rspack(rspackConfig);
  const server = new RspackDevServer(rspackConfig.devServer ?? {}, compiler);
  const runServer = async () => {
    console.log("Starting server...");
    await server.start();
  };

  runServer();
};

const serveServer = async (mode: BuildMode, appConfig: AppConfig) => {
  const serverRspackConfig = await getServerRspackConfig(mode, appConfig, {
    watch: true,
  });
  rspack(serverRspackConfig, logRspackErrors);

  const clientRspackConfig = await getClientRspackConfig(mode, appConfig, {});
  clientRspackConfig.output!.publicPath = appConfig.client.publicPath;
  const clientCompiler = rspack(clientRspackConfig);
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
          copyHeaders(proxyRes, res);
          proxyRes.pipe(res);
        }
      },
    },
  });

  app.use((req, res, next) => {
    //handle client only requests
    if (req.headers["x-dev-repacked-client-only"]) {
      return next();
    }
    nextWeakMap.set(req, next);
    proxy(req, res, next);
  });

  if (clientEnabled) {
    app.use(history());
    const devMiddleware = rspackDevMiddleware(
      //@todo: fix once rspack dev middleware released
      clientCompiler as unknown as Compiler,
      {
        publicPath: clientRspackConfig.output?.publicPath,
      }
    );
    app.use(devMiddleware);
    //@todo: fix once rspack dev middleware released
    app.use(rspackHotMiddleware(clientCompiler as unknown as Compiler));
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

const serve = async (mode: BuildMode, appConfig: AppConfig) => {
  if (appConfig.server.enabled) {
    serveServer(mode, appConfig);
  } else {
    serveClientOnly(mode, appConfig);
  }
};

export default serve;
