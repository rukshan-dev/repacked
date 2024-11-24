import { Express } from "express";

const server = (app: Express) => {
  app.get("/hello", (req, res) => {
    res.send("Hello World");
  });
  return app;
};

export default server;
