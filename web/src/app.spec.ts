import request from "supertest";
import { app } from "./app";
import { read } from "fs";

const getAllToDos = () => request(app).get("/todos");
const createToDo = (body: { title: string }) => request(app).post("/todos").send(body);
const deleteAllTodos = () => request(app).delete("/todos")

describe("todos", () => {
  beforeEach(() => deleteAllTodos())

  describe("#GET all", () => {
    const subject = getAllToDos;

    test("handles get on index", async () => {
      const response = await subject();
      expect(response.status).toBe(200);
    })
  })

  describe("#GET one", () => {
    const subject = createToDo;

    test("GET with reurned url returns proper todo", async () => {
      const todo = await subject({title: 'abc'});
      const response = await request(app).get(`/todos/${todo.body.id}`); 
      expect(response.body.title).toEqual('abc')
    })

    test("Creating two todos", async () => {
      const todo1 = await subject({title: 'abc'});
      const todo2 = await subject({title: 'def'});
      const response1 = await getAllToDos();
      expect(response1.body.length).toEqual(2);
      const response2 = await request(app).get(`/todos/${todo2.body.id}`); 
      expect(response2.body.title).toEqual('def')
    })
    
  })

  describe("#POST", () => {
    const subject = createToDo
    
    test("#POST returns proper output", async () => {
      const body = { title: "abc"};
      const response = await subject({ title: "abc" });
      expect(response.body.title).toEqual(body.title);
      expect(response.body.completed).toEqual(false);
      expect(typeof response.body.url).toBe("string");
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
