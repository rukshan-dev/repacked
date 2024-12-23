import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/index.ts",
      "src/cli.ts",
      "src/program.ts",
      "src/features/test/transformers",
      "src/features/express/runtimes/runtime.dev.ts",
      "src/features/express/runtimes/runtime.prod.ts",
    ],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: true,
    outDir: "./dist",
    external: ["express"],
  },
]);
