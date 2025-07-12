import { Server } from "repacked";

const server: Server = async (app) => {
  app.get("/hello", (req, res) => {
    res.send({
      h1: "Welcome to Your New React App!",
      h2: "(configured with express js backend server)",
    });
  });
  return app;
};

export default server;
