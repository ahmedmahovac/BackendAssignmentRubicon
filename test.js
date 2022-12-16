const request = require("supertest");
const app = require("./app");

describe("Tests", () => {
  test("Test to getting all tags", () => {
    return request(app)
      .get("/api/tags")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});