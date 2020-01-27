import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { restElement } from "@babel/types";

export const app = express();
let database:{ [key:string] : ITodo} = {};

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  order: number | null;
  url: string;
}

let setId = function() {
  const lastValue = Object.values(database)[Object.values(database).length - 1]
  if (lastValue == undefined) {
    return 1
  } else {
    return lastValue.id + 1
  }
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
  const todoKey = Object.keys(database).find(key => database[key].id === id);
  if (todoKey === undefined) {
    res.status(403);
    res.send();
  } else {
    const todo = database[todoKey]
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
    database[req.body.title] = { title: req.body.title, completed: false, id: id,
    url: `http://localhost:3000/todos/${id}`, order: order };
    res.send(database[req.body.title]);
  }
});

app.patch<{ id: string }, ITodo, { title?: string, completed: boolean, order?: number }>("/todos/:id", (req, res) => {
  const id = Number(req.params.id)
  const todoKey = Object.keys(database).find(key => database[key].id === id);
  if (todoKey === undefined) {
    res.status(403);
    res.send();
  } else {
    if (req.body.title != undefined){
      database[todoKey].title = req.body.title
    }
    if (req.body.order != undefined) {
      database[todoKey].order = req.body.order
    }
    database[todoKey].completed = req.body.completed
    res.send(database[todoKey]);
  }
});

app.delete("/todos", (req, res) => {
  database = {};
  res.status(204);
  res.send(req.body);
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todoKey = Object.keys(database).find(key => database[key].id === id);
  if (todoKey === undefined) {
    res.status(403);
    res.send();
  } else {
    delete database[todoKey]
    res.status(204);
    res.send();
  }
});