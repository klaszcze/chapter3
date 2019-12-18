import request from "supertest";
import { app } from "./app";

describe("app", () => {
  test("works", () =>
    request(app)
      .get("/")
      .expect(200));
});
