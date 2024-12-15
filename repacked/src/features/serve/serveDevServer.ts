import { webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import getServerWebpackConfig from "../express/getServerWebpackConfig";
import { expressServer } from "../express/server";
import { logWebpackErrors } from "../webpack/utils";
import { ChildProcessEvents } from "../../types";
import { Express } from "express";
import path from "path";

const loadClientApp = async (appEntry: string, appInstance: Express) => {
  const clientApp = await import(appEntry);
  const clientAppCallback = clientApp.default?.default || clientApp.default;
  typeof clientAppCallback === "function" && clientAppCallback(appInstance);
};

const serverServer = async () => {
  const appConfig = await getAppConfig();
  const port = appConfig.development.port + 1 || 3000;
  const serverWebpackConfig = await getServerWebpackConfig(
    "development",
    appConfig,
    {
      watch: true,
    }
  );
  const appEntry = path.join(
    serverWebpackConfig.output?.path as string,
    serverWebpackConfig.output?.filename as string
  );

  const app = expressServer();
  await loadClientApp(appEntry, app);
  //HACK: send custom header if route is not handled from server, so app can fallback to Client App.
  if (appConfig.client.enabled) {
    app.use((req, res) => {
      res.setHeader("x-dev-repacked-route-status", "unhandled");
      res.sendStatus(404);
    });
  }
  app.listen(port);

  const serverCompiler = webpack(serverWebpackConfig, logWebpackErrors);
  let watchInitiated = false;
  serverCompiler.hooks.done.tap("OnServerCompiled", async (stats) => {
    watchInitiated && process.send?.(ChildProcessEvents.Reload);
    watchInitiated = true;
  });
};

serverServer();
