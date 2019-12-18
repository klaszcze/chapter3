import request from "supertest";
import { app } from "./app";

describe("todos", () => {
  test("handles get on index", () =>
    request(app)
      .get("/")
      .expect(200));

  test("handles get on index", async () => {
    const response = await request(app).get("/todos");
    expect(response.status).toBe(200);
  })

  test("#POST returns wthat ste", async () => {
    const body = { title: "abc"};
    const response = await request(app)
      .post("/todos")
      .send(body);
    expect(response.body).toEqual(body);
  })
});