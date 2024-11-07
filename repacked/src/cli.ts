#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { build, serve } from "./features/webpack/webpack";
import { BuildMode } from "./features/webpack/types";
import "dotenv/config";

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
      (argv) => {
        serve(argv.mode as BuildMode);
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
      (argv) => {
        build(argv.mode as BuildMode);
      }
    )
    .strictCommands()
    .demandCommand(1)
    .parse();

exec();
