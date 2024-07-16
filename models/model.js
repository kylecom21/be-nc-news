const db = require("../db/connection");

function fetchTopics() {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
}

function fetchArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
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

function fetchArticles() {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, 
    COUNT(comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id ORDER BY articles.created_at DESC `
    )
    .then((articles) => {
      return articles.rows;
    });
}

function fetchArticleComments(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      }
      return db
        .query(
          "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
          [article_id]
        )
        .then((comments) => {
          return comments.rows;
        });
    });
}

function addArticleComment(article_id, username, body) {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body, created_at, votes)
VALUES ($1, $2, $3, NOW(), 0)
RETURNING *`,
      [article_id, username, body]
    )
    .then((comment) => {
      return comment.rows[0];
    });
}

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  addArticleComment,
};
