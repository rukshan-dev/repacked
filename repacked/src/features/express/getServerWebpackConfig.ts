import cwd from "../../utils/cwd";
import { AppConfig } from "../app-config/types";
import getWebpackConfig from "../webpack/getWebpackConfig";
import { BuildMode, WebpackConfigOptions } from "../webpack/types";

const getServerWebpackConfig = async (
  mode: BuildMode,
  appConfig: AppConfig,
  options?: Omit<WebpackConfigOptions, "override" | "target">
) => {
  return await getWebpackConfig(mode, appConfig, {
    ...(options ?? {}),
    target: "server",
    override: (config) => {
      config.target = "node";
      config.entry = cwd(appConfig.server.entry);
      config.output!.libraryTarget = "commonjs2";
      config.output!.filename = "app.js";
      config.output!.publicPath = appConfig.client.publicPath;
      delete config.devServer;
      return config;
    },
  });
};

export default getServerWebpackConfig;
