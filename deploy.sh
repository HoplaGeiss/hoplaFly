#!/bin/bash

# Deploy script for hoplaFly to Netlify
echo "🚀 Starting deployment process..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Please install it first:"
    echo "npm install -g netlify-cli"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist/hoplaFly

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "Your app is now live on Netlify!"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
