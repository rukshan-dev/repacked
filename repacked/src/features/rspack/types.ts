import { Configuration } from "@rspack/core";

export type BuildMode = "production" | "development";
export type BuildTarget = "client" | "server";
export type RspackConfigOptions = {
  target: BuildTarget;
  watch?: boolean;
  clean?: boolean;
  override?: (config: Configuration) => Configuration;
};
