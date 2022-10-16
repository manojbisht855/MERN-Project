/** @format */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" });

require("./db/com");

app.use(express.json());

app.use(require("./router/auth"));

// const User = r9equire("./model/userScehma");

const PORT = process.env.PORT;

// Middleware
const middleware = (req, resp, next) => {
  console.log("hello middleware");
  next();
};

app.get("/", (req, resp) => {
  resp.send("Helllo Home World from the Server");
});

app.get("/about", middleware, (req, resp) => {
  resp.send("Helllo About World from the Server");
});

app.get("/contact", (req, resp) => {
  resp.send("Helllo Contact World from the Server");
});

app.get("/signin", (req, resp) => {
  resp.send("Helllo Login World from the Server");
});

app.get("/signup", (req, resp) => {
  resp.send("Helllo Registration World from the Server");
});

app.get("/", (req, resp) => {
  resp.send("Helllo World");
});

app.listen(PORT, () => {
  console.log(`Server is running at port no ${PORT}`);
});
