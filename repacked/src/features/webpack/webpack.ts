import { webpack } from "webpack";
import getWebpackConfig from "./getWebpackConfig";
import { BuildMode } from "./types";
import { AppConfig } from "../app-config/types";

export const build = async (mode: BuildMode, appConfig: AppConfig) => {
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
