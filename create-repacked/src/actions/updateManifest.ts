import { readFileSync, writeFileSync } from "fs";
import { UserOptions } from "../types";
import path from "path";
import getLatestDependencies, { Deps } from "./getLatestDependencies";

const updateManifest = async (options: UserOptions) => {
  const manifestPath = path.join(options.directory, "package.json");
  const manifestRaw = readFileSync(manifestPath).toString();
  const manifest = JSON.parse(manifestRaw) as { name: string } & Deps;
  const deps = await getLatestDependencies();
  manifest.name = options.name;
  manifest.devDependencies = {
    ...manifest.devDependencies,
    ...deps.devDependencies,
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
};

export default updateManifest;
