import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { restElement } from "@babel/types";

export const app = express();
let database:{ [key:string] : ITodo} = {};

interface ITodo {
  title: string;
}

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send();
});

app.get("/todos", (req, res) => {
  res.send(Object.values(database));
});

app.post("/todos", (req, res) => {
  database[req.body.title] = req.body;
  res.send(req.body);
});

app.delete("/todos", (req, res) => {
  database = {};
  res.status(204);
  res.send(req.body);
});

