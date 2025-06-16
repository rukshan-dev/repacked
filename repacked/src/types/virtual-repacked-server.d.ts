declare module "virtual:repacked/server" {
  import type { Express } from "express";

  const externalServer: (app: Express) => Express;
  export default externalServer;
}
