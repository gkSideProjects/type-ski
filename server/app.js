const { application } = require("express");
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

app.use(express.json());

//cors
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// postgres
const pgp = require("pg-promise")();

const cn = {
  host: "localhost",
  port: 5432,
  database: "typeski",
  user: "postgres",
  password: "backendgarbage",
  max: 30, // use up to 30 connections
};

const db = pgp(cn);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/createUser", async (req, res) => {
  console.log("body: ", req.body);
  db.one(
    "insert into users(username, password) values($1, $2) returning username",
    [req.body.username, req.body.password]
  )
    .then((data) => {
      console.log("User created:", data.username);
      res.send(data);
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
