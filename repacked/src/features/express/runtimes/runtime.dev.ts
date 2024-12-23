import { expressServer } from "../server";
import yargs from "yargs";
import importJson from "../utils/importJson";
import path from "path";
import chalk from "chalk";

const serve = async (port: number) => {
  const appPath = "./app.js";
  const configPath = "./config.json";
  const config = importJson<{ client: { enabled: boolean } }>(
    path.join(__dirname, configPath)
  );

  const clientEnabled = config.client.enabled;

  const externalApp = (await import(/* webpackIgnore: true */ appPath)) as {
    default: {
      default: (
        app: ReturnType<typeof expressServer>
      ) => ReturnType<typeof expressServer>;
    };
  };
  const app = expressServer();

  externalApp.default.default(app);

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
