const fs = require("fs");

const manifest = `//npm.pkg.github.com/:_authToken=\${GH_TOKEN}
@rukshan-dev:registry=https://npm.pkg.github.com
always-auth=true
`;

fs.writeFileSync("./dist/.npmrc", manifest, "utf-8");
