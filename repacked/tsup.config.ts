import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/index.ts",
      "src/cli.ts",
      "src/program.ts",
      "src/features/test/transformers",
      "src/features/server/runtimes/runtime.dev.ts",
      "src/features/server/runtimes/runtime.prod.ts",
      "src/features/server/loaders/loadServer.ts",
    ],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: true,
    outDir: "./dist",
    external: ["express", "virtual:repacked/server"],
  },
]);
