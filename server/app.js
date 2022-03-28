import express from "express";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import "dotenv/config";

const app = express();
const port = 3001;
import cors from "cors";

app.use(express.json());
console.log(process.env.ACCESS_TOKEN);
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

app.post("/login", (req, res) => {
  db.any("select * from users where username = $1", [req.body.username])
    .then(async (data) => {
      const valid = await compare(req.body.password, data[0].password);
      if (!valid) {
        res.status(401);
        res.json({ error: "wrong password" });
      } else {
        const token = sign(
          { username: req.body.username },
          process.env.ACCESS_TOKEN,
          {
            expiresIn: "15m",
          }
        );
        console.log(token);
        res.status(200);
        res.json({ message: `${data[0].username} successfully logged in` });
      }
    })
    .catch((error) => {
      console.log("ERROR: ", error);
    });
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
