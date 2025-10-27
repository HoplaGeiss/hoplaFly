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

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { deviceId } = event.queryStringParameters || {};

    if (!deviceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing deviceId parameter' }),
      };
    }

    // Read user data
    const userData = readUserData();
    const user = userData[deviceId];

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          deviceId: user.deviceId,
          hoplaTokens: user.hoplaTokens || 0,
          totalWins: user.totalWins || 0,
          lastUpdated: user.lastUpdated,
        },
      }),
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
