import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/index.ts",
      "src/cli.ts",
      "src/features/express/runtime.ts",
      "src/features/test/transformers",
    ],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: true,
    outDir: "./dist",
    external: ["express"],
  },
]);
