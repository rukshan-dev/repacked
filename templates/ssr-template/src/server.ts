import { Express } from "express";
import * as bodyParser from "body-parser";
import ssrMiddleware from "@repacked-tools/react-router-ssr/express";
import routes from "./routes";

const server = (app: Express) => {
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(ssrMiddleware(routes));
};

export default server;
