import { rspack } from "@rspack/core";
import { BuildMode } from "../rspack/types";
import { AppConfig } from "../app-config/types";
import getClientRspackConfig from "./getClientRspackConfig";
import { logRspackErrors } from "../rspack/utils";

export const buildClient = async (mode: BuildMode, appConfig: AppConfig) => {
  const rspackConfig = await getClientRspackConfig(mode, appConfig);
  rspack(rspackConfig, logRspackErrors);
};
