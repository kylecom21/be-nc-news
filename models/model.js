const { errorMonitor } = require("supertest/lib/test");
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

function fetchArticles(sort_by = "created_at", order_by = "DESC", topic) {
  const validSortBys = [
    `article_id`,
    `title`,
    `topic`,
    `author`,
    `created_at`,
    `votes`,
  ];

  const validOrderBys = [`ASC`, `DESC`];

  if (!validSortBys.includes(sort_by)) {
    sort_by = "created_at";
  }

  if (!validOrderBys.includes(order_by)) {
    order_by = "DESC";
  }

  let sqlString = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, 
  COUNT(comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];

  if (topic) {
    sqlString += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;

  return db
    .query(sqlString, queryValues).then((articles) => {
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

function updateArticleVotes(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article doesn't exist",
        });
      }
      return article.rows[0];
    });
}

function removeCommentById(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment doesn't exist",
        });
      }
    });
}

function fetchUsers() {
  return db.query("SELECT * FROM users").then((users) => {
    return users.rows;
  });
}

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  addArticleComment,
  updateArticleVotes,
  removeCommentById,
  fetchUsers,
};
