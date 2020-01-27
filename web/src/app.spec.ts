import request from "supertest";
import { app } from "./app";

const getAllToDos = () => request(app).get("/todos");
const getToDo = (id: number) => request(app).get(`/todos/${id}`)
const createToDo = (body: { title: string, order?: number }) => request(app).post("/todos").send(body);
const deleteAllTodos = () => request(app).delete("/todos");
const deleteToDo = (id: number) => request(app).delete(`/todos/${id}`)
const updateToDo = (id: number,
  body: { title?: string, order?: number, completed?: boolean }) => request(app).patch(`/todos/${id}`).send(body);

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
    const subject = getToDo;

    test("GET with reurned url returns proper todo", async () => {
      const todo = await createToDo({title: 'abc'});
      const response = await subject(todo.body.id);
      expect(response.body.title).toEqual('abc')
    })

    test("Creating two todos", async () => {
      const todo1 = await createToDo({title: 'abc'});
      const todo2 = await createToDo({title: 'def'});
      const response1 = await getAllToDos();
      expect(response1.body.length).toEqual(2);
      const response2 = await subject(todo2.body.id);
      expect(response2.body.title).toEqual('def')
    })
  })

  describe("#POST", () => {
    const subject = createToDo
    
    test("#POST returns proper output", async () => {
      const body = { title: "abc", order: 112 };
      const response = await subject({ title: "abc", order: 112 });
      expect(response.body.title).toEqual(body.title);
      expect(response.body.completed).toEqual(false);
      expect(response.body.order).toEqual(body.order);
      expect(typeof response.body.url).toBe("string");
    })

    test("#POST creates new todos", async () => {
      await subject({title: 'abc'});
      const response = await getAllToDos();
      expect(response.body.length).toBe(1);
    }) 

    test("#POST without title returns bad request", async () => {
      const response = await subject({} as { title: string });
      expect(response.status).toBe(403);
    })
  })
  
  describe('#DELETE all', () => {
    const subject = deleteAllTodos;
    test("#DELETE returns status 204", async () => {
      const response = await subject();
      expect(response.status).toBe(204);
    })
    
    test("handles delete", async () => {
      await subject();
      const response = await getAllToDos();
      expect(response.body.length).toBe(0);
    })
  })
  
  describe("#DELETE one", () => {
    const subject = deleteToDo

    test("#delete returns status 204", async () => {
      const todo = await createToDo({ title: "first" })
      const response = await subject(todo.body.id)
      expect(response.status).toBe(204);
    })

    test("handles delete of one todo", async () => {
      await createToDo({ title: "first" })
      const todo = await createToDo({ title: "second" })
      await subject(todo.body.id);
      const response = await getAllToDos();
      expect(response.body.length).toBe(1);
    })

    test("Retrns status 403 in not found", async () => {
      const todo = await createToDo({ title: "first" })
      const response = await subject(todo.body.id + 1)
      expect(response.status).toBe(403);
    })
  });

  describe("#PATCH", () => {
    const subject = updateToDo

    test("#PATCH todo's title", async () => {
      const todo = await createToDo({ title: "first" })
      await subject(todo.body.id, { title: "new" })
      const response = await getToDo(todo.body.id);
      expect(response.body.title).toEqual("new")
    })

    test("#PATCH todo's completance", async () => {
      const todo = await createToDo({ title: "first" })
      await subject(todo.body.id, { completed: true });
      const response = await getToDo(todo.body.id);
      expect(response.body.completed).toEqual(true)
    })

    test("#PATCH todo's order", async () => {
      const todo = await createToDo({ title: "first", order: 99 })
      await subject(todo.body.id, { order: 11 });
      const response = await getToDo(todo.body.id);
      expect(response.body.order).toEqual(11)
    })
  })
});
