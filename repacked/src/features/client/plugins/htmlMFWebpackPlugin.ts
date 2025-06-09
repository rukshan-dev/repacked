import { Compiler, Compilation, HtmlRspackPlugin } from "@rspack/core";

class HtmlMFRspackPlugin {
  constructor(private entryFile: string = "remoteEntry.js") {}

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      "HtmlMFRspackPlugin",
      (compilation: Compilation) => {
        HtmlRspackPlugin.getCompilationHooks(
          compilation
        ).alterAssetTags.tapAsync("HtmlMFRspackPlugin", (data, cb) => {
          const entryFile = `${
            data.publicPath.toLowerCase() === "auto" ? "" : data.publicPath
          }${this.entryFile}`;
          data.assetTags.scripts = data.assetTags.scripts.filter(
            (script) => script.attributes.src !== entryFile
          );
          cb(null, data);
        });
      }
    );
  }
}

export default HtmlMFRspackPlugin;
