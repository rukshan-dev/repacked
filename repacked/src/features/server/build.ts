import { AppConfig } from "../app-config/types";
import { BuildMode } from "../rspack/types";
import { rspack } from "@rspack/core";
import getServerRspackConfig from "./getServerRspackConfig";
import { logRspackErrors } from "../rspack/utils";

export const buildServer = async (mode: BuildMode, appConfig: AppConfig) => {
  const rspackConfig = await getServerRspackConfig(mode, appConfig, {
    clean: false,
  });
  return new Promise((resolve, reject) => {
    rspack(rspackConfig, (err, stats) => {
      logRspackErrors(err, stats);
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
