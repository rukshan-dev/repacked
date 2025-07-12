import type { moduleFederationPlugin } from "@module-federation/sdk";
import { Compiler, Configuration } from "@rspack/core";
import { Config } from "jest";
import { BuildTarget } from "../rspack/types";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (...args: any[]) => any // Exclude function types
    ? T[P]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type OutputOptions = {
  dir: string;
};

export type ClientOptions = {
  enabled: boolean;
  entry: string;
  template: string;
  publicPath: string;
  assetsDir: string;
  envFilter: (key: string, value?: string) => boolean;
};

export type ServerOptions = {
  enabled: boolean;
  entry: string;
};

export type DevelopmentOptions = {
  port: number;
  open: boolean;
};

export type AppConfig = {
  appName: string;
  output: OutputOptions;
  development: DevelopmentOptions;
  client: ClientOptions;
  server: ServerOptions;
  moduleFederation?: moduleFederationPlugin.ModuleFederationPluginOptions;
  /**
   * @deprecated use `rspack` instead
   */
  webpack?: (config: Configuration, target: BuildTarget) => Configuration;
  rspack: (config: Configuration, target: BuildTarget) => Configuration;
  jest: (config: Config) => Config;
  plugins: ReturnType<RepackedPluginFactory>[];
};

export type ConsumerAppConfig = DeepPartial<AppConfig> & {
  plugins?: ReturnType<RepackedPluginFactory>[];
};

export type RepackedPluginConfig = {
  target: BuildTarget;
  appConfig: AppConfig;
};

type RepackedPluginReturn = {
  apply: (compiler: Compiler) => void;
  updateConfig?: (config: Configuration) => void;
};

export type RepackedPluginFactory<Options = unknown> = (
  customOptions: Options
) => (config: RepackedPluginConfig) => RepackedPluginReturn;
