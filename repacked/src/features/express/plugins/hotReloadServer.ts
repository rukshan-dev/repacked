import { Compiler } from "webpack";
import { AppConfig } from "../../app-config/types";
import cluster, { Worker } from "node:cluster";
import path from "path";
import cwd from "../../../utils/cwd";

export class HotReloadServer {
  private callback: () => void = () => {};
  private workers: Worker[] = [];

  constructor(private appConfig: AppConfig) {
    cluster.setupPrimary({
      exec: path.resolve(cwd(appConfig.output.dir, "index.js")),
      args: [`--port=${appConfig.development.port + 1}`],
    });
    cluster.on("online", (worker) => {
      this.workers.push(worker);
      this.callback();
    });
  }

  apply(compiler: Compiler) {
    const pluginName = HotReloadServer.name;
    compiler.hooks.afterEmit.tapAsync(pluginName, (compilation, callback) => {
      this.callback = callback;
      this.workers.forEach((worker) => {
        try {
          worker.process.kill("SIGTERM");
        } catch (e) {
          console.warn(`Unable to kill worker ${worker.process.pid}`);
        }
      });
      this.workers = [];
      cluster.fork();
    });
  }
}
