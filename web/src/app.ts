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

app.post<{}, ITodo, { title?: string }>("/todos", (req, res) => {
  if (req.body.title === undefined) {
    res.status(403);
    res.send();
  } else {
    const id = setId()
    database[req.body.title] = { title: req.body.title, completed: false, id: id,
    url: `http://localhost:3000/todos/${id}` };
    res.send(database[req.body.title]);
  }
});

app.delete("/todos", (req, res) => {
  database = {};
  res.status(204);
  res.send(req.body);
});

