import { Compiler, Compilation } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

class HtmlMFWebpackPlugin {
  constructor(private entryFile: string = "remoteEntry.js") {}

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      "HtmlMFWebpackPlugin",
      (compilation: Compilation) => {
        HtmlWebpackPlugin.getCompilationHooks(
          compilation
        ).alterAssetTags.tapAsync("HtmlMFWebpackPlugin", (data, cb) => {
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

export default HtmlMFWebpackPlugin;
