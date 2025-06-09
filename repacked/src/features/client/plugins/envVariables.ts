import { DefinePlugin } from "@rspack/core";

type FilterCallbackFn = (key: string, value?: string) => boolean;

const getEnvValues = (filterCallback: FilterCallbackFn) => {
  const envs = process.env || {};
  const filteredEnvs: Record<string, string | undefined> = {};

  Object.entries(envs).forEach(([key, value]) => {
    if (filterCallback(key, value)) {
      filteredEnvs[key] = value;
    }
  });

  return filteredEnvs;
};

export const EnvVariablesPlugin = (filterCallback: FilterCallbackFn) => {
  return new DefinePlugin({
    "process.env": JSON.stringify({
      ...getEnvValues(filterCallback),
    }),
  });
};
