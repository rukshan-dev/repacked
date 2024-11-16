#!/usr/bin/env node
import prompts from "prompts";
import { UserOptions } from "./types";
import cwd from "./utils/cwd";
import path from "path";
import createDefaultTemplate from "./template-scripts/createDefaultTemplate";
import validatePackageName from "./actions/validatePackageName";

(async () => {
  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Enter the app name:",
      initial: "repacked-app",
      validate: (name) => validatePackageName(name),
    },
  ]);

  const options: UserOptions = {
    name: response.name,
    directory: cwd(response.name),
    templateDirectory: path.join(__dirname, "templates"),
  };
  await createDefaultTemplate(options);
})();
