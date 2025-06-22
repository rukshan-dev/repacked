import { Express } from "express";

const server = (app: Express) => {
  app.get("/hello", (req, res) => {
    res.send({
      h1: "Welcome to Your New React App!",
      h2: "(configured with express js backend server)",
    });
  });
};

export default server;
