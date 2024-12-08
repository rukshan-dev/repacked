#!/usr/bin/env node
import { ChildProcess, fork } from "child_process";
import path from "path";
import { ChildProcessEvents } from "./types";

process.argv.splice(0, 2);
const programPath = path.join(__dirname, "program.js");

let child: ChildProcess;
let restarted = false;

const program = () => {
  child = fork(programPath, process.argv);

  child.on("message", (message) => {
    if (message === ChildProcessEvents.Reload) {
      child.kill();
      program();
      restarted = true;
      return;
    }
    if (message === ChildProcessEvents.ShouldOpenTab) {
      !restarted && child.send(ChildProcessEvents.OpenTab);
    }
  });

  child.on("exit", (code) => {
    if (code === null) {
      return;
    }
    process.exit(code);
  });
};

program();
