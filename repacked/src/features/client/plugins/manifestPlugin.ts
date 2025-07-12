import { Chunk, Compiler, sources } from "@rspack/core";

type Options = {
  fileName: string;
};

const defaultOptions: Options = {
  fileName: 'client-assets.json',
};

export class ManifestPlugin {
  private options: Options;
  constructor(options?: Partial<Options>) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      ManifestPlugin.name,
      (compilation, callback) => {
        const manifest: Record<string, { js: string[]; css: string[] }> = {};
        for (const [entryName, entrypoint] of compilation.entrypoints) {
          const chunks: Chunk[] = entrypoint.chunks.filter((chunk) =>
            chunk.canBeInitial?.()
          );

          const jsFiles = new Set<string>();
          const cssFiles = new Set<string>();

          for (const chunk of chunks) {
            for (const file of chunk.files) {
              if (file.endsWith(".js")) {
                jsFiles.add(file);
              } else if (file.endsWith(".css")) {
                cssFiles.add(file);
              }
            }
          }
          manifest[entryName] = {
            js: Array.from(jsFiles),
            css: Array.from(cssFiles),
          };
        }

        const json = JSON.stringify(manifest, null, 2);
        compilation.emitAsset(
          this.options.fileName,
          new sources.RawSource(json)
        );

        callback();
      }
    );
  }
}
