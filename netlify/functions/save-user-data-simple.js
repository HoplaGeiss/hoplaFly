const fs = require('fs');
const path = require('path');

// Simple file-based storage (for demo purposes)
// In production, you should use a proper database
const DATA_FILE = path.join(__dirname, 'user-data.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  }
}

function readUserData() {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return {};
  }
}

function writeUserData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing user data:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { deviceId, hoplaTokens, score } = JSON.parse(event.body);

    // Validate required fields
    if (!deviceId || typeof hoplaTokens !== 'number') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: deviceId and hoplaTokens' }),
      };
    }

    // Read current data
    const userData = readUserData();

    // Update user data
    const existingUser = userData[deviceId] || { totalWins: 0 };
    userData[deviceId] = {
      deviceId,
      hoplaTokens,
      lastUpdated: new Date().toISOString(),
      lastScore: score || 0,
      totalWins: existingUser.totalWins + 1,
    };

    // Write back to file
    const success = writeUserData(userData);

    if (!success) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save user data' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User data saved successfully',
        data: {
          deviceId,
          hoplaTokens,
          totalWins: userData[deviceId].totalWins,
        },
      }),
    };
  } catch (error) {
    console.error('Error saving user data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
