import { writeFileSync } from "fs";
import { AppConfig } from "../../app-config/types";
import { TsupPlugin } from "../../../types";
import cwd from "../../../utils/cwd";

const bundleStaticConfig = (appConfig: AppConfig): TsupPlugin => {
  return {
    name: "bundle-static-config",
    buildEnd() {
      const filePath = cwd(appConfig.output.dir, "config.json");
      const content = JSON.stringify(
        {
          client: {
            enabled: appConfig.client.enabled,
          },
        },
        null,
        2
      );
      writeFileSync(filePath, content);
      console.log(`Generated static config file at ${filePath}`);
    },
  };
};

export default bundleStaticConfig;
