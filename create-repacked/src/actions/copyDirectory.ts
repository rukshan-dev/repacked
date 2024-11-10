import fs from "fs";
import path from "path";
import createDirectory from "./createDirectory";

const copyDirectory = async (source: string, destination: string) => {
  if (!fs.existsSync(destination)) {
    createDirectory(destination);
  }
  const files = fs.readdirSync(source);
  files.forEach((file) => {
    if (["node_modules", "yarn.lock"].includes(file)) return;
    const sourcePath = path.join(source, file);
    const targetPath = path.join(destination, file);
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
};

export default copyDirectory;
