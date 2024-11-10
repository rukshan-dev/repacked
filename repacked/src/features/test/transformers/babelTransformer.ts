import { createTransformer } from "babel-jest";

const babelTransformer = createTransformer({
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
});

export default babelTransformer;
