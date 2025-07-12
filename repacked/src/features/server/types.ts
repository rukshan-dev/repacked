import { Express } from "express";
import { RuntimeConfigs } from "./runtime-config";
export type Server = (app: Express, utils: RuntimeConfigs) => Promise<Express>;
