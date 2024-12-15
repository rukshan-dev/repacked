import { ChildProcess, fork } from "child_process";
import { ChildProcessEvents } from "../../types";

export const createChildProcess = (programPath: string) => {
  let child: ChildProcess;
  let restartRequested = false;

  const exitHandler = () => {
    child.kill();
  };
  const sigintHandler = () => {
    child.kill();
  };
  const exceptionHandler = (err: Error) => {
    console.error("Uncaught exception occurred:", err);
    child.kill(1);
    process.exit(1);
  };

  const restart = () => {
    const interval = setInterval(() => {
      if (child.killed) {
        program();
        restartRequested = false;
        clearInterval(interval);
        return;
      }
    }, 100);
  };

  const killProcess = () => {
    child.removeAllListeners();
    process.removeListener("exit", exitHandler);
    process.removeListener("SIGINT", sigintHandler);
    process.removeListener("uncaughtException", exceptionHandler);
    child.kill();
  };

  const program = () => {
    child = fork(programPath, process.argv);

    child.on("message", (message) => {
      if (message === ChildProcessEvents.Reload) {
        if (restartRequested) {
          return;
        }
        restartRequested = true;
        killProcess();
        restart();
      }
    });

    child.on("exit", (code) => {
      if (restartRequested) {
        return;
      }
      process.exit(code);
    });

    process.on("exit", exitHandler);
    process.on("SIGINT", sigintHandler);
    process.on("uncaughtException", exceptionHandler);
  };
  program();
};
