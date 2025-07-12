import { Express } from "express";
export type Server = (app: Express, utils: RuntimeConfigs) => Promise<Express>;

export type ClientAssets = Record<string, { js: string[]; css: string[] }>;

export type RuntimeConfigs = {
  getClientManifest: () => Promise<ClientAssets | null>;
};
