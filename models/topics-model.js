const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
}

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      }
      return article.rows[0];
    });
}

module.exports = { fetchTopics, fetchArticleById };
