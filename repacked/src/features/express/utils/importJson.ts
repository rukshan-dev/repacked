import { readFileSync } from "fs";

const importJson = <T extends Object>(path: string): T => {
  const file = readFileSync(path, { encoding: "utf-8" });
  return JSON.parse(file.toString());
};

export default importJson;
