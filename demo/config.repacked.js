/**
 * @type {import('repacked').AppConfig}
 */
const config = {
  entry: "./src/index.tsx",
  development: {
    open: true,
    port: 4000,
  },
  server: {
    enabled: true,
    entry: "./src/server.tsx",
  },
  moduleFederation: {
    runtime: false,
    name: "demo",
    filename: "remoteEntry.js",
    shared: {
      react: {
        singleton: true,
      },
      "react-dom": {
        singleton: true,
      },
    },
    exposes: {
      "./HelloWorld": "./src/components/HelloWorld/HelloWorld.tsx",
    },
    shareStrategy: "loaded-first",
    experiments: {
      federationRuntime: "hoisted",
    },
    dts: false,
  },
  webpack: (config) => {
    return config;
  },
  jest: (config) => {
    return config;
  },
};

module.exports = config;
