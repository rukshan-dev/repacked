import { expressServer } from "./server";
import express from "express";
import path from "path";
import history from "connect-history-api-fallback";
import yargs from "yargs";

const serve = async (port: number) => {
  const appPath = "./app.js";
  const configPath = "./config.json";
  const config = (await import(configPath)) as { client: { enabled: boolean } };
  const clientEnabled = config.client.enabled;

  const externalApp = (await import(appPath)) as {
    default: (
      app: ReturnType<typeof expressServer>
    ) => ReturnType<typeof expressServer>;
  };
  const app = expressServer();

  externalApp.default(app);

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
