const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeAll(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe ("/api/topics" , () => {
    test ("GET 200: should return an array of all topic objects" , () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => ({
                description: expect.any(String),
                slug: expect.any(String)
            }))
        })
    })
})