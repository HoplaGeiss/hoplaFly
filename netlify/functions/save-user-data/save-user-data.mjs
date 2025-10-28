import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env['MONGODB_URI'];
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

export default async (req, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers,
    });
  }

  if (req.method !== 'POST') {
    const response = { success: false, error: 'Method not allowed' };
    return new Response(JSON.stringify(response), {
      status: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const body = await req.json();
    const { deviceId, hoplaTokens } = body;

    if (!deviceId || hoplaTokens === undefined) {
      const response = {
        success: false,
        error: 'Missing required fields: deviceId and hoplaTokens'
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });
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

    const response = {
      success: true,
      message: 'User data saved successfully',
      data: { deviceId, hoplaTokens }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error saving user data:', error);
    const response = {
      success: false,
      error: 'Internal server error'
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
  }
};
