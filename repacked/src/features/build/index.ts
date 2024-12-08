import getAppConfig from "../app-config/getAppConfig";
import { BuildMode } from "../webpack/types";
import { build as buildClient } from "../webpack/webpack";
import { buildServer, buildRuntime } from "../express/build";
import path from "path";
import removeFolder from "./utils/removeFolder";
import cwd from "../../utils/cwd";

const build = async (mode: BuildMode) => {
  const appConfig = await getAppConfig();
  const serverEnabled = appConfig.server.enabled;
  const clientEnabled = appConfig.client.enabled;
  const clientOutputPath = serverEnabled
    ? path.join(appConfig.output.dir, "client")
    : appConfig.output.dir;

  await removeFolder(cwd(appConfig.output.dir));

  clientEnabled &&
    (await buildClient(mode, {
      ...appConfig,
      output: {
        ...appConfig.output,
        dir: clientOutputPath,
      },
    }));

  if (serverEnabled) {
    await buildRuntime(mode, appConfig);
    await buildServer(mode, appConfig);
  }
};

export default build;
