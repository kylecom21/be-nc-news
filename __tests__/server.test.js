const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeAll(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: should return an array of all topic objects with the following properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => ({
          description: expect.any(String),
          slug: expect.any(String),
        }));
      });
  });
});

describe("/api", () => {
  test(" GET 200: Should respond with a list detailing all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Should return the single article passed with the following properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.body).toBe("I find this existence challenging");
        expect(body.article.topic).toBe("mitch");
        expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET 400: Sends an appropriate status and error message when given an invalid id ", () => {
    return request(app)
      .get("/api/articles/not-a-artice_id")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("GET 404: Sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article does not exist");
      });
  });
  test("PATCH 200: Should return an updated article object with the votes increased by the passed amount", () => {
    const updatedVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article.votes).toEqual(110);
      });
  });
  test("PATCH 200: Should return an updated article object with the votes decreased by the passed amount", () => {
    const updatedVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article.votes).toEqual(100);
      });
  });
  test("PATCH 400: Sends an appropriate status and error message when given an invalid id", () => {
    const updatedVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/not-a-artice_id")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("PATCH 404: Sends an appropriate status and error message when given a valid but non-existent id", () => {
    const updatedVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/9999")
      .send(updatedVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article doesn't exist");
      });
  });
  test("PATCH 400: Sends an appropriate status and error message when given no vote to update", () => {
    const updatedVotes = {};
    return request(app)
      .patch("/api/articles/not-a-artice_id")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("PATCH 400: Sends an appropriate status and error message when given an invalid vote", () => {
    const updatedVotes = { inc_votes: "invalid_vote" };
    return request(app)
      .patch("/api/articles/not-a-artice_id")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("GET 200: Should return the single article passed with the added comment count property", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe("2");
      });
  });
  test("GET 200: Should return the comment_count as 0 when passed with an article with no comments", () => {
    return request(app)
      .get("/api/articles/8")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe("0");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Should return an array of all article objects with the following properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => ({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(Number),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        }));
      });
  });
  test("GET 200: Should return all the article objects with all properties sorted by created_at in DESC order as defaults", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("?sort_by=author: Should return all articles objects with all properties sorted by author and ordered by default", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("?sort_by=title: Should return all articles objects with all properties sorted by author and ordered by default", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("?order_by=ASC: Should return all articles objects with all properties sorted by default and ordered by asecending", () => {
    return request(app)
      .get("/api/articles?order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("?sort_by=votes&order_by=ASC: Should return all articles objects with all properties sorted by votes and ordered by asecending", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("?invalid sort_by 200: Should return all articles objects with all properties sorted by and ordered by default", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_valid_sort")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("?invalid order_by 200: Should return all articles objects with all properties sorted by and ordered by default", () => {
    return request(app)
      .get("/api/articles?order_by=not_a_valid-_order")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("?topic=mictch 200: Should return all articles with the topic of mitch with properties sorted and ordered by default", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("?topic=paper 200: Should return an empty array of articles whern passed a topic with no articles associated", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
      });
  });
  test("?topic=not_a_topic 404: Sends an appropriate status and error message when given a valid but non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic does not exist")
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: Should return an array of all comments associated with the passed article id with the following properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => ({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(Number),
          author: expect.any(Number),
          body: expect.any(Number),
          article_id: 1,
        }));
      });
  });
  test("GET 200: Should return an empty array when the article passed has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET 200: Should return all the comments objects sorted by created_at in DESC order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 400: Sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-a-article_id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("GET 404: Sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article does not exist");
      });
  });
  test("POST 201: Inserts a new comment to the db for that article and return the new comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this sucks",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(19);
        expect(body.comment.body).toBe("this sucks");
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.article_id).toBe(2);
        expect(body.comment.votes).toBe(0);
        expect(body.comment.created_at).toEqual(expect.any(String));
      });
  });
  test("POST 400: Sends an appropraite status and error message when given a bad comment (no body)", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("POST 400: Sends an appropriate status and error message when given an invalid id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this sucks",
    };
    return request(app)
      .post("/api/articles/not-a-artice_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("POST 400: Sends an appropriate status and error message when given a valid but non-existent id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this sucks",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("POST 400: Sends an appropraite status and error message when given a bad comment (no username)", () => {
    const newComment = {
      body: "this sucks",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: Should delete the give comment and send nothing back", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("DELETE 400: Sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("DELETE 404: Sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment doesn't exist");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: should return an array of all user objects with the following properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => ({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        }));
      });
  });
});
