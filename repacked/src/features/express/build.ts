import { AppConfig } from "../app-config/types";
import { BuildMode } from "../webpack/types";
import { build as tsupBuild, Options } from "tsup";
import { transformAsync } from "@babel/core";
import cwd from "../../utils/cwd";
import path from "path";
import fs from "fs";
import { getBabelOptions } from "../babel/babelOptions";

const build = async (mode: BuildMode, appConfig: AppConfig) => {
  const babelOptions = getBabelOptions(false);
  const buildOptions: Options = {
    entry: {
      app: cwd(appConfig.apiServer?.entry as string),
      runtime: path.resolve(__dirname, "./features/express/runtime.js"),
    },
    format: ["cjs"],
    dts: false,
    sourcemap: false,
    external: ["*"],
    minify: true,
    esbuildPlugins: [
      {
        name: "babel",
        setup(build) {
          build.onLoad({ filter: /\.(ts|tsx|js|jsx)$/ }, async (args) => {
            const source = await fs.promises.readFile(args.path, "utf8");
            const result = await transformAsync(source, {
              filename: args.path,
              babelrc: true,
              ...babelOptions,
              plugins: [
                ...babelOptions.plugins,
                "@babel/plugin-transform-modules-commonjs",
              ],
            });
            return {
              contents: result?.code as string,
              loader: /\.(ts|tsx)$/i.test(args.path) ? "ts" : "js",
            };
          });
        },
      },
    ],
  };

  await tsupBuild(buildOptions);
};

export default build;
