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

if (require.main === module) {
  // Verify environment variables are loaded
  if (!loginUrl || !username || !password) {
    console.error('ERROR: Missing Salesforce environment variables!');
    console.error('Please check your .env file contains:');
    console.error('- LOGIN_URL');
    console.error('- USERNAME');
    console.error('- PASSWORD');
    process.exit(1);
  } else {
    // Start server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Salesforce Login URL: ${loginUrl}`);
    console.log(`Salesforce Username: ${username}`);
    });
  }
}

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
    console.log('Attempting to login to Salesforce...');
    await conn.login(username, password);
    sfConnection = conn;
    console.log('✓ Connected to Salesforce successfully');
    return conn;
  } catch (err) {
    console.error('✗ Salesforce login error:', err.message);
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
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) + 
    Math.pow(p1[1] - p2[1], 2) + 
    Math.pow(p1[2] - p2[2], 2)
  );
}

function recommendation(cranes, weight, height, radius) {
  // STEP 1: FILTER SUITABLE CRANES
  // Only include cranes that meet or exceed ALL requirements
  const suitable = cranes.filter((crane) => {
    return crane.max_load >= weight && 
           crane.max_height >= height && 
           crane.max_radius >= radius;
  });

  // STEP 2: SORT BY BEST MATCH
  // Sort cranes by "distance" from requirements
  // Lower distance = closer match = better recommendation
  suitable.sort((a, b) => {
    const a_list = [a.max_load, a.max_height, a.max_radius];
    const b_list = [b.max_load, b.max_height, b.max_radius];
    const c_list = [weight, height, radius];
    return distance(a_list, c_list) - distance(b_list, c_list);
  });

  // STEP 3: RETURN TOP 3 RECOMMENDATIONS
  return suitable.slice(0,3);
}

// Get all available cranes
app.get("/api/cranes", (req, res) => {
  res.status(200).json(cranes);
});

// RECOMMENDATION ENDPOINT
app.get("/api/recommendation", (req, res) => {
  // Extract user requirements from query parameters
  const weight = parseInt(req.query.weight) || 0;  // Required lifting capacity in tons
  const height = parseInt(req.query.height) || 0;  // Required lifting height in feet
  const radius = parseInt(req.query.radius) || 0;  // Required horizontal reach in feet

  res.status(200).json(recommendation(cranes, weight, height, radius));
});

/**
 * SUBMIT QUOTE TO SALESFORCE
 * Creates a new Crane Quote Request record in Salesforce
 */
app.post("/api/submit-quote", async (req, res) => {
  try {
    const { crane, name, email, phone, company, projectDetails, sourceFlow } = req.body;
    
    // Validate required fields
    if (!crane || !name || !email || !phone || !projectDetails) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['crane', 'name', 'email', 'phone', 'projectDetails']
      });
    }
    
    // Get Salesforce connection
    const conn = await getSalesforceConnection();
    
    // Create quote record in Salesforce
    // Note: Replace these field API names with  field names from Salesforce
    const quoteRecord = {
      Name: `Quote - ${name} - ${crane}`, // Record name/title
      Crane_Model__c: crane,
      Customer_Name__c: name,
      Email__c: email,
      Phone__c: phone,
      Company__c: company || '',
      Project_Details__c: projectDetails,
      Quote_Status__c: 'New',
      Source_Flow__c: sourceFlow || ''
    };
    
    console.log('Submitting quote to Salesforce:', quoteRecord);
    
    const result = await conn.sobject('Crane_Quote_Request__c').create(quoteRecord);
    
    if (result.success) {
      console.log('✓ Quote created successfully with ID:', result.id);
      res.status(200).json({ 
        success: true, 
        id: result.id,
        message: 'Quote submitted successfully to Salesforce'
      });
    } else {
      console.error('Failed to create Salesforce record:', result.errors);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create record in Salesforce',
        details: result.errors
      });
    }
    
  } catch (error) {
    console.error('Error submitting quote to Salesforce:', error);
    res.status(500).json({ 
      error: 'Failed to submit quote',
      details: error.message
    });
  }
});

module.exports = {
  recommendation,
  getSalesforceConnection,
  __setConnection: (c) => sfConnection = c,
  app
}