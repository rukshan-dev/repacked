import fs from "fs";

const createDirectory = async (path: string) => {
  fs.mkdirSync(path, { recursive: true });
};
export default createDirectory;
