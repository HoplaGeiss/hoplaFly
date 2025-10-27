# Backend Setup for hoplaFly

This document explains how to set up the backend for secure user balance tracking.

## Overview

The backend consists of Netlify Functions that securely store user data when they win hoplaTokens. The system includes:

- **Device-based tracking**: Each user is identified by a unique device ID
- **Secure balance storage**: User balances are stored on the backend
- **Offline support**: Local storage fallback when backend is unavailable
- **Real-time sync**: Balance updates are sent to backend immediately

## Backend Options

### Option 1: Simple File-based Storage (Recommended for Demo)

The simple version uses JSON file storage and is easier to deploy:

- **Files**: `save-user-data-simple.js`, `get-user-data-simple.js`
- **Storage**: JSON file in Netlify Functions directory
- **Pros**: Easy to deploy, no external dependencies
- **Cons**: Not suitable for high traffic, data not persistent across deployments

### Option 2: MongoDB Storage (Production Ready)

The MongoDB version uses a proper database:

- **Files**: `save-user-data.js`, `get-user-data.js`
- **Storage**: MongoDB database
- **Pros**: Scalable, persistent, production-ready
- **Cons**: Requires MongoDB setup

## Deployment Instructions

### For Simple File-based Storage

1. **Deploy to Netlify**:
   ```bash
   # Build and deploy
   npm run build
   # Deploy to Netlify (via Netlify CLI or Git integration)
   ```

2. **No additional setup required** - the functions will work immediately.

### For MongoDB Storage

1. **Set up MongoDB**:
   - Create a MongoDB Atlas account (free tier available)
   - Create a new cluster
   - Get your connection string

2. **Set Environment Variables in Netlify**:
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Environment variables
   - Add: `MONGODB_URI` with your MongoDB connection string

3. **Update API Service**:
   - Change the API endpoints in `src/app/services/api.service.ts`:
     - `save-user-data-simple` → `save-user-data`
     - `get-user-data-simple` → `get-user-data`

4. **Deploy**:
   ```bash
   npm run build
   # Deploy to Netlify
   ```

## API Endpoints

### POST /.netlify/functions/save-user-data-simple
Saves user data when they win.

**Request Body**:
```json
{
  "deviceId": "device_abc123",
  "hoplaTokens": 5,
  "score": 5
}
```

**Response**:
```json
{
  "success": true,
  "message": "User data saved successfully",
  "data": {
    "deviceId": "device_abc123",
    "hoplaTokens": 5,
    "totalWins": 1
  }
}
```

### GET /.netlify/functions/get-user-data-simple
Retrieves user data.

**Query Parameters**:
- `deviceId`: User's device ID

**Response**:
```json
{
  "success": true,
  "data": {
    "deviceId": "device_abc123",
    "hoplaTokens": 5,
    "totalWins": 1,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

## Security Features

1. **Device-based Authentication**: Users are identified by unique device IDs
2. **CORS Protection**: Only allows requests from your domain
3. **Input Validation**: Validates all incoming data
4. **Error Handling**: Graceful fallback to local storage
5. **Offline Support**: Game continues to work without backend

## Testing

1. **Local Testing**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Start local development server
   netlify dev
   ```

2. **Test the API**:
   ```bash
   # Test save endpoint
   curl -X POST http://localhost:8888/.netlify/functions/save-user-data-simple \
     -H "Content-Type: application/json" \
     -d '{"deviceId":"test123","hoplaTokens":1,"score":5}'

   # Test get endpoint
   curl "http://localhost:8888/.netlify/functions/get-user-data-simple?deviceId=test123"
   ```

## Monitoring

- Check Netlify Functions logs in your dashboard
- Monitor API calls in browser developer tools
- User data is logged for debugging (remove in production)

## Production Considerations

1. **Use MongoDB** for production deployments
2. **Add rate limiting** to prevent abuse
3. **Implement proper logging** and monitoring
4. **Add data validation** and sanitization
5. **Consider caching** for better performance
6. **Set up alerts** for failed API calls

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is allowed in the function headers
2. **Function Timeout**: Check Netlify function timeout settings
3. **Data Not Persisting**: Verify environment variables are set correctly
4. **API Not Found**: Ensure functions are deployed and accessible

### Debug Steps

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check Netlify function logs
4. Test with curl or Postman
5. Verify environment variables

## Next Steps

1. Deploy the simple version first to test
2. Set up MongoDB for production
3. Add monitoring and alerting
4. Implement additional security measures
5. Consider adding user authentication
