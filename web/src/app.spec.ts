import request from "supertest";
import { app } from "./app";
import { read } from "fs";

const getAllToDos = () => request(app).get("/todos");
const createToDo = (body: { title: string }) => request(app).post("/todos").send(body);
const deleteAllTodos = () => request(app).delete("/todos")

describe("todos", () => {
  beforeEach(() => deleteAllTodos())

  describe("#GET", () => {
    const subject = getAllToDos;

    test("handles get on index", async () => {
      const response = await subject();
      expect(response.status).toBe(200);
    })
  })

  describe("#POST", () => {
    const subject = createToDo
    
    test("#POST returns proper output", async () => {
      const body = { title: "abc", completed: false};
      const response = await subject({ title: "abc" });
      expect(response.body).toEqual(body);
    })

    test("#POST creates new todos", async () => {
      await subject({title: 'abc'});
      const response = await getAllToDos();
      expect(response.body.length).toBe(1);
    }) 

    test("#POST without title returns bad request", async () => {
      const response = await subject({} as { title: string});
      expect(response.status).toBe(403);
    })
  })
    
  describe('#DELETE all', () => {
    test("#DELETE returns status 200", async () => {
      const response = await deleteAllTodos();
      expect(response.status).toBe(204);
    })
  
    test("handles delete", async () => {
      await deleteAllTodos();
      const response = await getAllToDos();
      expect(response.body.length).toBe(0);
    })
  })
});
