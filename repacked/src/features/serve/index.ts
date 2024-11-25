import { Compiler, Configuration, webpack } from "webpack";
import getAppConfig from "../app-config/getAppConfig";
import WebpackDevServer from "webpack-dev-server";
import { expressServer } from "../express/server";
import cwd from "../../utils/cwd";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import { BuildMode } from "../webpack/types";
import getWebpackConfig from "../webpack/getWebpackConfig";
import { AppConfig } from "../app-config/types";
import { getBabelOptions } from "../babel/babelOptions";
import history from "connect-history-api-fallback";

const serveExpress = async (
  appConfig: AppConfig,
  webpackConfig: Configuration,
  compiler: Compiler
) => {
  const babelOptions = getBabelOptions(true);
  const port = appConfig.devServer?.port || 3000;
  require("@babel/register")({
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    presets: babelOptions.presets,
    plugins: [
      "@babel/plugin-transform-modules-commonjs",
      ...babelOptions.plugins,
    ],
  });
  const { default: apiServerCallback } = await import(
    cwd(appConfig.apiServer?.entry as string)
  );
  const app = expressServer();
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output?.publicPath,
    stats: { colors: true },
  });
  apiServerCallback(app);
  app.use(history());
  app.use(devMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

const serveWebpack = async (
  appConfig: AppConfig,
  webpackConfig: Configuration,
  compiler: Compiler
) => {
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);
  const runServer = async () => {
    console.log("Starting server...");
    await server.start();
  };

  runServer();
};

const serve = async (mode: BuildMode) => {
  const appConfig = await getAppConfig();
  const webpackConfig = await getWebpackConfig(mode, appConfig);
  const compiler = webpack(webpackConfig);
  if (appConfig.apiServer?.enabled) {
    serveExpress(appConfig, webpackConfig, compiler);
  } else {
    serveWebpack(appConfig, webpackConfig, compiler);
  }
};

export default serve;
