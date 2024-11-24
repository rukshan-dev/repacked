export const getBabelOptions = (isDevelopment: boolean) => {
  return {
    plugins: isDevelopment ? [require.resolve("react-refresh/babel")] : [],
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
