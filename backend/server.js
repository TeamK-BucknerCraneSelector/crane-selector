require('dotenv').config();
const express = require("express");
const jsforce = require('jsforce');
const cors = require("cors");
const app = express();

// CORS
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// Body parser middleware for JSON
app.use(express.json());

// Serve images statically
app.use('/images', express.static('images'));

// Salesforce Configuration
const loginUrl = process.env.LOGIN_URL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Salesforce connection instance
let sfConnection = null;

/**
 * Get or create Salesforce connection
 * Reuses existing connection if valid, otherwise creates new one
 */
async function getSalesforceConnection() {
  if (sfConnection && sfConnection.accessToken) {
    return sfConnection;
  }
  
  const conn = new jsforce.Connection({
    loginUrl: loginUrl
  });
  
  try {
    await conn.login(username, password);
    sfConnection = conn;
    console.log('Connected to Salesforce successfully');
    return conn;
  } catch (err) {
    console.error('Salesforce login error:', err);
    throw err;
  }
}

// Load crane data
const cranes = require('./cranes.json');

/**
 * Calculate Euclidean distance between two 3D points
 * Used for finding closest matching crane to requirements
 */
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
}

// Generic test endpoint
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "lemon", "strawberry", "pineapple"] });
});

// Get all available cranes
app.get("/api/cranes", (req, res) => {
  res.status(200).json(cranes);
});

// RECOMMENDATION ENDPOINT
app.get("/api/recommendation", (req, res) => {
  // Extract user requirements from query parameters
  // Example: /api/recommendation?weight=300&height=400&radius=200
  const weight = parseInt(req.query.weight) || 0;  // Required lifting capacity in tons
  const height = parseInt(req.query.height) || 0;  // Required lifting height in feet
  const radius = parseInt(req.query.radius) || 0;  // Required horizontal reach in feet

  // STEP 1: FILTER SUITABLE CRANES
  // Only include cranes that meet or exceed ALL requirements
  // A crane is suitable if:
  //   - Its max_load is >= the required weight
  //   - Its max_height is >= the required height
  //   - Its max_radius is >= the required radius
  const suitable = cranes.filter((crane) => {
    return crane.max_load >= weight && 
           crane.max_height >= height && 
           crane.max_radius >= radius;
  });

  // STEP 2: SORT BY BEST MATCH
  // Sort cranes by "distance" from requirements
  // The crane with the smallest distance is the best match
  // 
  // Distance calculation:
  //   - Treat each crane's specs as 3 dimensional vector
  //   - Treat user requirements as another point: (weight, height, radius)
  //   - Calculate Euclidean distance between these points
  //   - Lower distance = closer match = better recommendation
  suitable.sort((a, b) => {
    const a_list = [a.max_load, a.max_height, a.max_radius];
    const b_list = [b.max_load, b.max_height, b.max_radius];
    const c_list = [weight, height, radius];
    return distance(a_list, c_list) - distance(b_list, c_list);
  });

  // STEP 3: RETURN TOP 3 RECOMMENDATIONS
  // Return the 3 best-matching cranes
  // This can be edited to return more or fewer recommendations, clarification during next standup
  res.status(200).json(suitable.slice(0, 3));
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});