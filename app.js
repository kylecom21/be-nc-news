const express = require("express");
const app = express();
const routeIndex = require('./routes');


app.use(express.json());

app.use('/api', routeIndex);


app.use((err, request, response, next) => {
  if (err.code === "22P02" ||err.code === '23502'|| err.code === "23503" ) {
    response.status(400).send({ message: "Bad Request" });
  }
  next(err);
});
//custom error
app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  }
  next(err);
});
//server error
app.use((err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
