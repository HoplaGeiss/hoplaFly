const { MongoClient } = require('mongodb');

// MongoDB connection string - you'll need to replace this with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoplaFly';
const DB_NAME = 'hoplaFly';
const COLLECTION_NAME = 'users';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const { deviceId, hoplaTokens } = JSON.parse(event.body);

    if (!deviceId || hoplaTokens === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: deviceId and hoplaTokens'
        }),
      };
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);

    // Upsert user data
    const result = await collection.updateOne(
      { deviceId },
      {
        $set: {
          deviceId,
          hoplaTokens,
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User data saved successfully',
        data: { deviceId, hoplaTokens }
      }),
    };

  } catch (error) {
    console.error('Error saving user data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
    };
  }
};
