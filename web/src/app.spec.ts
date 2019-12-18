import request from "supertest";
import { app } from "./app";
import { read } from "fs";

describe("todos", () => {
  beforeEach(() => request(app).delete("/todos"))

  describe("#GET", () => {
    test("handles get on index", () =>
      request(app)
        .get("/")
        .expect(200));
  
    test("handles get on index", async () => {
      const response = await request(app).get("/todos");
      expect(response.status).toBe(200);
    })
  })

  describe("#POST", () => {
    test("#POST returns proper output", async () => {
      const body = { title: "abc", completed: false};
      const response = await request(app)
      .post("/todos")
      .send(body);
      expect(response.body).toEqual(body);
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

    test("#POST without title returns bad request", async () => {
      const response = await request(app).post("/todos")
      expect(response.status).toBe(403);
    })
  })
    
  describe('#DELETE all', () => {
    test("#DELETE returns status 200", async () => {
      const response = await request(app).delete("/todos");
      expect(response.status).toBe(204);
    })
  
    test("handles delete", async () => {
      await request(app).delete("/todos");
      const response = await request(app).get("/todos");
      expect(response.body.length).toBe(0);
    })
  })
});