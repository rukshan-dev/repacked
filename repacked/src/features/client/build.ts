import { webpack } from "webpack";
import { BuildMode } from "../webpack/types";
import { AppConfig } from "../app-config/types";
import getClientWebpackConfig from "./getClientWebpackConfig";
import { logWebpackErrors } from "../webpack/utils";

export const buildClient = async (mode: BuildMode, appConfig: AppConfig) => {
  const webpackConfig = await getClientWebpackConfig(mode, appConfig);
  webpack(webpackConfig, logWebpackErrors);
};
