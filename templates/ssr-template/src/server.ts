import * as bodyParser from "body-parser";
import ssrMiddleware from "@repacked-tools/react-router-ssr/express";
import routes from "./routes";
import { Server } from "repacked";

const server: Server = async (app, configs) => {
  // Expose client manifest for dynamic asset loading (e.g., chunk preloading)
  app.get("/manifest", async (_, res) => {
    const manifest = await configs.getClientManifest();
    res.send(manifest);
  });

  // Middleware for parsing request bodies
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  // Server-side rendering middleware for React Router
  app.use(ssrMiddleware(routes, configs));

  return app;
};

export default server;
