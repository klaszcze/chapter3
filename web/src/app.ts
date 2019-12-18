import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { restElement } from "@babel/types";

export const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send();
});

app.get("/todos", (req, res) => {
  res.send([]);
});

app.post("/todos", (req, res) => {
  res.send(req.body);
});

app.delete("/todos", (req, res) => {
  res.status(204);
  res.send(req.body);
});

