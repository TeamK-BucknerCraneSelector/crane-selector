const express = require("express");
const jsforce = require('jsforce');
const cors = require("cors");
const app = express();

// CORS
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// Serve images statically
app.use('/images', express.static('images'));

// JSForce
const loginUrl = process.env.LOGIN_URL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const conn = new jsforce.Connection({
  loginUrl : loginUrl,
});
// const userInfo = await conn.login(username, password);

const cranes = require('./cranes.json');

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2], p2[2], 2));
}

// Generic AXIOS request w/ dummy data
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "lemon", "strawberry", "pineapple"] });
});

app.get("/api/recommendation", (req, res) => {
  const weight = parseInt(req.query.weight) || 0;
  const height = parseInt(req.query.height) || 0;
  const radius = parseInt(req.query.radius) || 0;

  const suitable = cranes.filter((crane, index) => {
    return crane.max_load >= weight && crane.max_height >= height && crane.max_radius >= radius;
  });

  suitable.sort((a, b) => {
    const a_list = [a.max_load, a.max_height, a.max_radius];
    const b_list = [b.max_load, b.max_height, b.max_radius];
    const c_list = [weight, height, radius];
    return distance(a_list, c_list) - distance(b_list, c_list);
  });

  res.status(200).json(suitable.slice(0, 3));
})

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
