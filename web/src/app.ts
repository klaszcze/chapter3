import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { restElement } from "@babel/types";

export const app = express();
let database:{ [key:string] : ITodo} = {};

interface ITodo {
  title: string;
  completed: boolean;
  url: string;
}

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send();
});

app.get("/todos", (req, res) => {
  res.send(Object.values(database));
});

app.post<{}, ITodo, { title?: string }>("/todos", (req, res) => {
  if (req.body.title === undefined) {
    res.status(403);
    res.send();
  } else {
    database[req.body.title] = { title: req.body.title, completed: false, url: ""} ;
    res.send(database[req.body.title]);
  }
});

app.delete("/todos", (req, res) => {
  database = {};
  res.status(204);
  res.send(req.body);
});

