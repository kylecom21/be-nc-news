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
  test("?sort_by = created_at: Should return all the article objects with all properties sorted by created_at ", () => {
    request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
});