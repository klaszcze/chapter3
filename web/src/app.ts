import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { restElement } from "@babel/types";

export const app = express();
let database:{ [id:number] : ITodo} = {};

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  order: number | null;
  url: string;
}

let setId = function() {
  const lastValue = Object.keys(database)[Object.values(database).length - 1]
  if (lastValue == undefined) {
    return 0
  } else {
    return Number(lastValue) + 1
  }
}

let getToDoKey = function(id: number){
  return database[id]
}

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send();
});

app.get("/todos", (req, res) => {
  res.send(Object.values(database));
});

app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = getToDoKey(id);
  if (todo === undefined) {
    res.status(403);
    res.send();
  } else {
    res.send(todo);
  }
})

app.post<{}, ITodo, { title?: string, order?: number }>("/todos", (req, res) => {
  if (req.body.title === undefined) {
    res.status(403);
    res.send();
  } else {
    const id = setId()
    const order = req.body.order || null
    database[id] = { title: req.body.title, completed: false, id: id,
    url: `http://localhost:3000/todos/${id}`, order: order };
    res.send(database[id]);
  }
});

app.patch<{ id: string }, ITodo, { title?: string, completed: boolean, order?: number }>("/todos/:id", (req, res) => {
  const id = Number(req.params.id)
  const todoKey = getToDoKey(id);
  if (todoKey === undefined) {
    res.status(403);
    res.send();
  } else {
    if (req.body.title != undefined){
      database[id].title = req.body.title
    }
    if (req.body.order != undefined) {
      database[id].order = req.body.order
    }
    if (req.body.completed != undefined) {
      database[id].completed = req.body.completed
    }
    res.send(database[id]);
  }
});

app.delete("/todos", (req, res) => {
  database = {};
  res.status(204);
  res.send(req.body);
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = getToDoKey(id);
  if (todo === undefined) {
    res.status(403);
    res.send();
  } else {
    delete database[id]
    res.status(204);
    res.send();
  }
});