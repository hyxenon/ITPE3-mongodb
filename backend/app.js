const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

require("dotenv").config();

// Routes

const movieRoutes = require("./routes/movies");

const app = express();

url = process.env.SECRET_KEY;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection Failed, " + err.message);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api", movieRoutes);

module.exports = app;
