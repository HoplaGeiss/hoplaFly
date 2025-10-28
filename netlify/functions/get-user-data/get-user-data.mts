import { MongoClient } from 'mongodb';
import type { Context } from '@netlify/functions';

// MongoDB connection string - you'll need to replace this with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoplaFly';
const DB_NAME = 'hoplaFly';
const COLLECTION_NAME = 'users';

interface User {
  deviceId: string;
  hoplaTokens: number;
  lastUpdated?: Date;
}

interface ApiResponse {
  success: boolean;
  data?: {
    deviceId: string;
    hoplaTokens: number;
  };
  error?: string;
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: any }> {
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

export default async (req: Request, context: Context): Promise<Response> => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers,
    });
  }

  if (req.method !== 'GET') {
    const response: ApiResponse = { success: false, error: 'Method not allowed' };
    return new Response(JSON.stringify(response), {
      status: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get('deviceId');

    if (!deviceId) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required parameter: deviceId'
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
    const collection = db.collection<User>(COLLECTION_NAME);

    // Find user by deviceId
    const user = await collection.findOne({ deviceId });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      return new Response(JSON.stringify(response), {
        status: 404,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        deviceId: user.deviceId,
        hoplaTokens: user.hoplaTokens || 0
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error getting user data:', error);
    const response: ApiResponse = {
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
