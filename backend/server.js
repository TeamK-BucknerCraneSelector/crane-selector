const express = require("express");
const jsforce = require('jsforce');
const cors = require("cors");
const app = express();


// CORS
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// JSForce
const conn = new jsforce.Connection();

// Generic AXIOS request w/ dummy data
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "lemon", "strawberry", "pineapple"] });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
