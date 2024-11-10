#!/usr/bin/env node
const fs = require("fs");
const packageJson = require("../package.json");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const manifest = {
  name: `@rukshan-dev/${packageJson.name}`,
  version: packageJson.version,
  main: "./index.js",
  bin: {
    "create-repacked": "./cli.js",
  },
  repository: packageJson.repository,
  author: packageJson.author,
  license: packageJson.license,
  dependencies: packageJson.dependencies,
  publishConfig: {
    registry: "https://npm.pkg.github.com",
  },
};

const exec = () =>
  yargs(hideBin(process.argv))
    .command(
      "generate",
      "generate dist package.json",
      (yargs) => {
        return yargs.option("registry", {
          describe: "npm registry",
          default: "github",
          choices: ["github", "npm"],
        });
      },
      (argv) => {
        if (argv.registry === "npm") {
          manifest.name = packageJson.name;
          manifest.publishConfig.registry = "https://registry.npmjs.org/";
        }
        fs.writeFileSync(
          "./dist/package.json",
          JSON.stringify(manifest, null, 2)
        );
      }
    )
    .strictCommands()
    .demandCommand(1)
    .parse();

exec();
