import { expressServer } from "../server";
import yargs from "yargs";
import chalk from "chalk";
import externalServer from "virtual:repacked/server";
import { getDevRuntimeConfigs } from "../runtime-config";

const serve = async (port: number) => {
  const config = process.env.__INTERNAL_REPACKED_SERVER_CONFIG;
  const clientEnabled = config.client.enabled;
  const devPort = config.development.port;

  const app = expressServer();
  app.set("trust proxy", true);

  externalServer(app, getDevRuntimeConfigs({ devPort }));

  if (clientEnabled) {
    app.use((req, res) => {
      res.setHeader("x-dev-repacked-route-status", "unhandled");
      res.sendStatus(404);
    });
  }

  app.listen(port, () => {
    console.log(chalk.bgBlue(`Server is restarted.`));
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
