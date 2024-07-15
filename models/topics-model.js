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

function fetchArticles() {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, 
    COUNT(comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`
    )
    .then((articles) => {
      return articles.rows;
    });
}

module.exports = { fetchTopics, fetchArticleById, fetchArticles };
