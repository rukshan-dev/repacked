import { AppConfig } from "../app-config/types";
import { BuildMode } from "../webpack/types";
import { webpack } from "webpack";
import getServerWebpackConfig from "./getServerWebpackConfig";
import { logWebpackErrors } from "../webpack/utils";

export const buildServer = async (mode: BuildMode, appConfig: AppConfig) => {
  const webpackConfig = await getServerWebpackConfig(mode, appConfig, {
    clean: false,
  });
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      logWebpackErrors(err, stats);
      if (err) {
        reject(err);
        return;
      }
      if (stats?.hasErrors()) {
        const info = stats.toJson();
        reject(
          new Error(`Build failed with errors:\n${info.errors?.join("\n")}`)
        );
        return;
      }

      resolve(true);
    });
  });
};
