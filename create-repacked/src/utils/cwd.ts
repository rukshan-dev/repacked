import path from "path";

const cwd = (...paths: string[]) => {
  return path.join(process.cwd(), ...paths);
};

export default cwd;
