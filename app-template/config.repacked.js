/**
 * @type {import('repacked').AppConfig}
 */
const config = {
  entry: "./src/index.tsx",
  devServer: {
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
