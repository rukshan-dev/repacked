import type { moduleFederationPlugin } from "@module-federation/sdk";
import { Configuration } from "webpack";
export type AppConfig = {
  entry: string;
  devServer: Configuration["devServer"];
  moduleFederation?: moduleFederationPlugin.ModuleFederationPluginOptions;
  webpack: (config: Configuration) => Configuration;
};
