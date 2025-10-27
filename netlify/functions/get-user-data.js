const { MongoClient } = require('mongodb');

// MongoDB connection string - you'll need to set this as an environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoplaFly';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
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

    const client = await connectToDatabase();
    const db = client.db('hoplaFly');
    const collection = db.collection('users');

    // Find user data
    const userData = await collection.findOne({ deviceId });

    if (!userData) {
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
          deviceId: userData.deviceId,
          hoplaTokens: userData.hoplaTokens || 0,
          totalWins: userData.totalWins || 0,
          lastUpdated: userData.lastUpdated,
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
