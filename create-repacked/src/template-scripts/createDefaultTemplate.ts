import copyDirectory from "../actions/copyDirectory";
import createDirectory from "../actions/createDirectory";
import updateManifest from "../actions/updateManifest";
import { UserOptions } from "../types";

const createDefaultTemplate = async (options: UserOptions) => {
  await createDirectory(options.directory);
  await copyDirectory(options.templateDirectory, options.directory);
  await updateManifest(options);
};

export default createDefaultTemplate;
