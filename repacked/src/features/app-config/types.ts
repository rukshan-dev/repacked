import type { moduleFederationPlugin } from "@module-federation/sdk";
import { Configuration } from "webpack";
import { Config } from "jest";

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
  webpack: (
    config: Configuration,
    target: "client" | "server"
  ) => Configuration;
  jest: (config: Config) => Config;
};

export type ConsumerAppConfig = DeepPartial<AppConfig>;
