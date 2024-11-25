import type { moduleFederationPlugin } from "@module-federation/sdk";
import { Configuration } from "webpack";
import { Config } from "jest";

export type OutputOptions = {
  dir: string;
};

export type AppConfig = {
  appName: string;
  entry: string;
  output: OutputOptions;
  devServer: Configuration["devServer"];
  apiServer?: {
    enabled: boolean;
    entry: string;
  };
  moduleFederation?: moduleFederationPlugin.ModuleFederationPluginOptions;
  envFilter: (key: string, value?: string) => boolean;
  webpack: (config: Configuration) => Configuration;
  jest: (config: Config) => Config;
};
