import type { moduleFederationPlugin } from "@module-federation/sdk";
import { Configuration } from "webpack";
export type AppConfig = {
  appName: string;
  entry: string;
  devServer: Configuration["devServer"];
  moduleFederation?: moduleFederationPlugin.ModuleFederationPluginOptions;
  envFilter: (key: string, value?: string) => boolean;
  webpack: (config: Configuration) => Configuration;
};
