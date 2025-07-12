import { CLIENT_MANIFEST_FILENAME } from "../../constants";
import path from "path";
import importJson from "./utils/importJson";
import { ClientAssets, RuntimeConfigs } from "./types";

type DevRuntimeOptions = {
  devPort: number;
};

export const getDevRuntimeConfigs = (
  options: DevRuntimeOptions
): RuntimeConfigs => {
  return {
    getClientManifest: async () => {
      try {
        const clientAssets = await fetch(
          `http://localhost:${options.devPort}/${CLIENT_MANIFEST_FILENAME}`,
          {
            headers: {
              "x-dev-repacked-client-only": "manifest-fetch",
            },
          }
        );
        return await clientAssets.json();
      } catch (e) {
        return null;
      }
    },
  };
};

export const getProdRuntimeConfigs = (): RuntimeConfigs => {
  return {
    getClientManifest: async () => {
      try {
        const manifestPath = path.join(
          __dirname,
          "client",
          CLIENT_MANIFEST_FILENAME
        );
        return importJson<ClientAssets>(manifestPath);
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  };
};
