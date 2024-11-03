const fs = require("fs");
const packageJson = require("../package.json");

const manifest = {
  name: `@rukshan-dev/${packageJson.name}`,
  version: packageJson.version,
  main: "./index.js",
  bin: {
    repacked: "./cli.js",
  },
  repository: packageJson.repository,
  author: packageJson.author,
  license: packageJson.license,
  dependencies: packageJson.dependencies,
  publishConfig: {
    registry: "https://npm.pkg.github.com",
  },
};

fs.writeFileSync("./dist/package.json", JSON.stringify(manifest, null, 2));
