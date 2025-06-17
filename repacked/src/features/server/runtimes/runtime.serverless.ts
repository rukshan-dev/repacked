import { expressServer } from "../server";
import express from "express";
import path from "path";
import history from "connect-history-api-fallback";
import externalServer from "virtual:repacked/server";

const config = process.env.__INTERNAL_REPACKED_SERVER_CONFIG;
const clientEnabled = config.client.enabled;
const app = expressServer();

externalServer(app);

if (clientEnabled) {
  app.use(history());
  const publicAssets = path.join(__dirname, "client");
  app.use(express.static(publicAssets));
}

export default app;
