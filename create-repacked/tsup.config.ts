import { defineConfig } from "tsup";
import copyDirectory from "./src/actions/copyDirectory";
import cwd from "./src/utils/cwd";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/cli.ts"],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: true,
    outDir: "./dist",
    onSuccess: async () => {
      await copyDirectory(cwd("../app-template"), cwd("dist", "templates"));
    },
  },
]);
