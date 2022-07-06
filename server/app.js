import express from "express";
import { compare } from "bcryptjs";
import { createRefreshToken, createAccessToken } from "./auth";
import "dotenv/config";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const app = express();
const port = 3001;
import cors from "cors";

app.use(express.json());
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// postgres
const pgp = require("pg-promise")();

const cn = {
  host: "localhost",
  port: 5432,
  database: "typeski",
  user: "postgres",
  password: "postgres",
  max: 30, // use up to 30 connections
};

const db = pgp(cn);

app.get("/cookieAuth", async (req, res) => {
  const access = req.cookies.access;
  // const refresh = req.cookies.refresh;
  if (access !== undefined) {
    try {
      const data = jwt.verify(access, process.env.ACCESS_TOKEN);
      res.status(200).send(data);
    } catch (err) {
      res.status(401).send("Invalid access token");
    }
  }
});

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
        const access = createAccessToken(req);
        const refresh = createRefreshToken(req);
        res.set("Access-Control-Allow-Origin", "http://localhost:3000");
        res.cookie("refresh", refresh, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.cookie("access", access, {
          httpOnly: true,
          maxAge: 1000 * 60 * 15,
        });
        res.status(200);
        res.send({ message: "logged in" });
      }
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      res.status(500).send("Something broke!");
    });
});

app.post("/getTopTen", async (req, res) => {
  db.many("select * from scores order by wpm desc limit 10").then((data) => {
    // console.log(data);
    res.send(data);
  });
});

app.post("/sendResult", async (req, res) => {
  db.one("insert into scores(owner, wpm) values($1, $2)" + " returning owner", [
    req.body.username,
    req.body.wpm,
  ])
    .then((data) => {
      console.log("data sent", data.owner);
      res.send(data);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Something broke!");
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
      if (error.code === "23505") {
        res.status(500).send({ errorMsg: "Duplicate username" });
      } else {
        res.status(500).send("Something broke!");
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
