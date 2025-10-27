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

    const client = await connectToDatabase();
    const db = client.db('hoplaFly');
    const collection = db.collection('users');

    // Upsert user data
    const result = await collection.updateOne(
      { deviceId },
      {
        $set: {
          deviceId,
          hoplaTokens,
          lastUpdated: new Date(),
          lastScore: score || 0,
        },
        $inc: { totalWins: 1 }, // Increment win counter
      },
      { upsert: true }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User data saved successfully',
        data: {
          deviceId,
          hoplaTokens,
          totalWins: result.upsertedCount > 0 ? 1 : undefined,
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
