/**
 * @type {import('repacked').AppConfig}
 */
const config = {
  entry: "./src/index.tsx",
  development: {
    open: true,
    port: 4000,
  },
  webpack: (config) => {
    return config;
  },
  jest: (config) => {
    return config;
  },
};

module.exports = config;
