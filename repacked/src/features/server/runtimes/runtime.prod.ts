import { expressServer } from "../server";
import express from "express";
import path from "path";
import history from "connect-history-api-fallback";
import yargs from "yargs";
import externalServer from "virtual:repacked/server";
import { getProdRuntimeConfigs } from "../runtime-config";

const serve = async (port: number) => {
  const config = process.env.__INTERNAL_REPACKED_SERVER_CONFIG;
  const clientEnabled = config.client.enabled;
  const app = expressServer();

  externalServer(app, getProdRuntimeConfigs());

  if (clientEnabled) {
    app.use(history());
    const publicAssets = path.join(__dirname, "client");
    app.use(express.static(publicAssets));
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

const exec = async () => {
  const argv = await yargs
    .option("port", {
      alias: "p",
      description: "Port to run the server on",
      type: "number",
      default: 3000,
    })
    .help().argv;
  serve(argv.port);
};

exec();
