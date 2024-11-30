/**
 * @type {import('repacked').AppConfig}
 */
const config = {
  client: {
    entry: "./src/client.tsx",
  },
  server: {
    enabled: true,
    entry: "./src/server.ts",
  },
  development: {
    open: true,
    port: 3000,
  },
  webpack: (config) => {
    return config;
  },
  jest: (config) => {
    return config;
  },
};

module.exports = config;
