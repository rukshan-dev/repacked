#!/usr/bin/env node
import prompts from "prompts";
import { UserOptions } from "./types";
import cwd from "./utils/cwd";
import path from "path";
import createDefaultTemplate from "./template-scripts/createDefaultTemplate";
import validatePackageName from "./actions/validatePackageName";
import getTemplates from "./template-scripts/getTemplates";

(async () => {
  const templates = await getTemplates(path.join(__dirname, "templates"));
  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Enter the app name:",
      initial: "repacked-app",
      validate: (name) => validatePackageName(name),
    },
    {
      type: "select",
      name: "template",
      message: "Select template",
      initial: 0,
      choices: templates.map((template, index) => ({
        value: index,
        title: template.name,
        description: template.description,
      })),
    },
  ]);

  const options: UserOptions = {
    name: response.name,
    directory: cwd(response.name),
    templateDirectory: templates[response.template].path,
  };
  await createDefaultTemplate(options);
})();
