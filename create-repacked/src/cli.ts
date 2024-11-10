import prompts from "prompts";
import { UserOptions } from "./types";
import cwd from "./utils/cwd";
import path from "path";
import createDefaultTemplate from "./template-scripts/createDefaultTemplate";

(async () => {
  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Enter the app name:",
      initial: "repacked-app",
    },
  ]);

  const options: UserOptions = {
    name: response.name,
    directory: cwd(response.name),
    templateDirectory: path.join(__dirname, "templates"),
  };
  await createDefaultTemplate(options);
})();
