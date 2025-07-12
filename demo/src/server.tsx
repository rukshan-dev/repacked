import { Server } from "repacked";

const server: Server = async (app) => {
  app.get("/hello", (req, res) => {
    res.send("Hello World");
  });
  return app;
};

export default server;
