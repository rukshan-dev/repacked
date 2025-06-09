import { Configuration } from "@rspack/core";

export type BuildMode = "production" | "development";
export type BuildTarget = "client" | "server";
export type RspackConfigOptions = Partial<{
  target: BuildTarget;
  watch: boolean;
  clean: boolean;
  override: (config: Configuration) => Configuration;
}>;
