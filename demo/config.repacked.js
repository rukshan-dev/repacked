/**
 * @type {Partial<import('repacked').AppConfig>}
 */
const config = {
  devServer: {
    open: true,
    port: 4000,
  },
  moduleFederation: {
    runtime: false,
    remoteType: "script",
    name: "remote",
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
    remotes: {
      remote: "remote@/remoteEntry.js",
    },
    shareStrategy: "loaded-first",
    experiments: {
      federationRuntime: "hoisted",
    },
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = config;
