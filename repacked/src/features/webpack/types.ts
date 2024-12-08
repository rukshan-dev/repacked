import { Configuration } from "webpack";

export type BuildMode = "production" | "development";
export type BuildTarget = "client" | "server";
export type WebpackConfigOptions = Partial<{
  target: BuildTarget;
  watch: boolean;
  clean: boolean;
  override: (config: Configuration) => Configuration;
}>;
