declare module "virtual:repacked/server" {
  import type { Express } from "express";

  type RuntimeConfigs = {
    getClientManifest: () => Promise<ClientAssets | null>;
  };

  const externalServer: (app: Express, utils: RuntimeConfigs) => Express;
  export default externalServer;
}
