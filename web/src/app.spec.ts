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

  test("#POST returns proper output", async () => {
    const body = { title: "abc", completed: false};
    const response = await request(app)
      .post("/todos")
      .send(body);
    expect(response.body).toEqual(body);
  })
  
  test("#DELETE returns status 200", async () => {
    const response = await request(app).delete("/todos");
    expect(response.status).toBe(204);
  })

  test("handles delete", async () => {
    await request(app).delete("/todos");
    const response = await request(app).get("/todos");
    expect(response.body.length).toBe(0);
  })
  
  test("#POST creates new todos", async () => {
    await request(app).post("/todos").send({ title: "new"})
    const response = await request(app).get("/todos");
    expect(response.body.length).toBe(1);
  })  

  test("#POST without title returns bad request", async () => {
    const response = await request(app).post("/todos").send({})
    expect(response.status).toBe(403);
  })
});