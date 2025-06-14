type SWCOptions = {
  isProduction: boolean;
  isServer?: boolean;
  tsx?: boolean;
};

export const getSwcOptions = (options: SWCOptions) => {
  return {
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: options.tsx,
      },
      externalHelpers: false,
      transform: {
        react: {
          runtime: "automatic",
          development: !options.isProduction,
          refresh: !options.isProduction && !options.isServer,
        },
      },
    },
    env: {
      targets: "Chrome >= 48",
    },
  };
};
