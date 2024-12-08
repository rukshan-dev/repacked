export const getBabelOptions = (
  isDevelopment: boolean,
  isServer: boolean = false
) => {
  return {
    plugins:
      isDevelopment && !isServer
        ? [require.resolve("react-refresh/babel")]
        : [],
    presets: [
      "@babel/preset-env",
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
      "@babel/preset-typescript",
    ],
  };
};
