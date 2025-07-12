declare namespace NodeJS {
  interface ProcessEnv {
    __INTERNAL_REPACKED_SERVER_CONFIG: {
      client: { enabled: boolean };
      development: { port: number };
    };
  }
}
