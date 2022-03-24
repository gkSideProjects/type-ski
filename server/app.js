const express = require("express");
const app = express();
const port = 3001;

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

db.one("SELECT * from users")
  .then((data) => {
    console.log("DATA:", data);
  })
  .catch((error) => {
    console.log("ERROR:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
