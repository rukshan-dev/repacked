import { webpack } from "webpack";
import { BuildMode } from "./types";
import { AppConfig } from "../app-config/types";
import getClientWebpackConfig from "./getClientWebpackConfig";
import { logWebpackErrors } from "./utils";

export const build = async (mode: BuildMode, appConfig: AppConfig) => {
  const webpackConfig = await getClientWebpackConfig(mode, appConfig);
  webpack(webpackConfig, logWebpackErrors);
};
