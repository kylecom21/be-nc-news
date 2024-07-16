const express = require("express");
const app = express();
const { getTopics, getEndpoints, getArticleById, getArticles } = require("./controllers/topics-controller");

app.get("/api", getEndpoints)

app.get("/api/topics" , getTopics)

app.get("/api/articles/:article_id" , getArticleById)

app.get("/api/articles" , getArticles)

app.use((err,request,response,next) => {
  if(err.code === '22P02'){
    response.status(400).send({message: 'Bad Request'})
  }
  next(err)
})

app.use((err,request,response,next) => {
    if(err.status && err.message){
        response.status(err.status).send({message: err.message})
    }
    next(err)
})

app.use((err,request,response,next) => {
    response.status(500).send({message: "Internal Server Error"})
})


module.exports = app;
