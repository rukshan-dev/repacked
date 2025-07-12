declare module "virtual:repacked/server" {
  import type { Express } from "express";
  import { RuntimeUtils } from "../features/server/runtime-utils";

  const externalServer: (app: Express, utils: RuntimeUtils) => Express;
  export default externalServer;
}
