const { fetchTopics, fetchArticleById } = require("../models/topics-model");
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
  fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article });
  }).catch((err) => {
    next(err)
  })
}

module.exports = { getTopics, getEndpoints, getArticleById };
