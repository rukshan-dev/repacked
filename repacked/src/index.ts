import type { ConsumerAppConfig } from "./features/app-config/types";
export { runTest as test } from "./features/test/test";
export { default as serve } from "./features/serve";
export { default as build } from "./features/build";

export type AppConfig = ConsumerAppConfig;
