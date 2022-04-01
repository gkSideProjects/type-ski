import { sign } from "jsonwebtoken";

export function createAccessToken(req) {
  return sign({ username: req.body.username }, process.env.ACCESS_TOKEN, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(req) {
  return sign({ username: req.body.username }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
}
