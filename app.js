const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");

app.get("/api/topics" , getTopics)

app.use((err,request,response,next) => {
    response.status(500).send({message: "Internal Server Error"})
})


module.exports = app;
