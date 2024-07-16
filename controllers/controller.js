const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  addArticleComment,
  updateArticleVotes,
  removeCommentById,
} = require("../models/model");
const endpoints = require("../endpoints.json");

function getTopics(request, response) {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
}

function getEndpoints(request, response) {
  response.status(200).send({ endpoints });
}

function getArticleById(request, response, next) {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(request, response, next) {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleComments(request, response, next) {
  const { article_id } = request.params;
  fetchArticleComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function createArticleComment(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;
  addArticleComment(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleVotes(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteCommentByID(request, response, next) {
  const { commentID } = request.params;
  removeCommentById(commentID).then(() => {
    response.status(204).send()
  }).catch((err) => {
    next(err)
  })
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getArticleComments,
  createArticleComment,
  patchArticleVotes,
  deleteCommentByID,
};
