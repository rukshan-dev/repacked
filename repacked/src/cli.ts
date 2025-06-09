#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import build from "./features/build";
import { BuildMode } from "./features/rspack/types";
import "dotenv/config";
import { runTest } from "./features/test/test";
import serve from "./features/serve";
import getAppConfig from "./features/app-config/getAppConfig";

const exec = () =>
  yargs(hideBin(process.argv))
    .command(
      "serve",
      "start the server",
      (yargs) => {
        return yargs.option("mode", {
          describe: "serve mode",
          default: "development",
          choices: ["production", "development"],
        });
      },
      async (argv) => {
        const appConfig = await getAppConfig();
        serve(argv.mode as BuildMode, appConfig);
      }
    )
    .command(
      "build",
      "build the app",
      (yargs) => {
        return yargs.option("mode", {
          describe: "build mode",
          default: "production",
          choices: ["production", "development"],
        });
      },
      async (argv) => {
        const appConfig = await getAppConfig();
        build(argv.mode as BuildMode, appConfig);
      }
    )
    .command(
      "test",
      "test the app",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        const jestArgv = process.argv.slice(2);
        const appConfig = await getAppConfig();
        runTest(jestArgv, appConfig);
      }
    )
    .strictCommands()
    .demandCommand(1)
    .parse();

exec();
