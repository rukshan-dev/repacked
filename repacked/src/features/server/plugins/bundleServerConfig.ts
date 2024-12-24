import { Compiler, sources } from "webpack";
import { AppConfig } from "../../app-config/types";

export class BundleServerConfig {
  private fileName: string = "config.json";
  constructor(private appConfig: AppConfig) {}

  getSource() {
    const content = JSON.stringify(
      {
        client: {
          enabled: this.appConfig.client.enabled,
        },
      },
      null,
      2
    );
    return content;
  }

  apply(compiler: Compiler) {
    const pluginName = BundleServerConfig.name;
    compiler.hooks.make.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(pluginName, () => {
        const source = this.getSource();
        compilation.emitAsset(
          this.fileName,
          new sources.RawSource(source, false)
        );
      });
    });
  }
}
