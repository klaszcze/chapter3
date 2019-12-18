import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

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

