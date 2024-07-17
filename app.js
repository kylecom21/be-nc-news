const express = require("express");
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getArticleComments,
  createArticleComment,
  patchArticleVotes,
  deleteCommentByID,
  getUsers,
} = require("./controllers/controller");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", createArticleComment)

app.patch("/api/articles/:article_id", patchArticleVotes )

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.get("/api/users", getUsers)

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
