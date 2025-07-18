#!/bin/bash

# CapRover Deployment Script for Medical Data Labeler
# Run this script to deploy to CapRover

echo "🚀 Starting deployment to CapRover..."

# Check if caprover CLI is installed
if ! command -v caprover &> /dev/null; then
    echo "❌ CapRover CLI not found. Installing..."
    npm install -g caprover
fi

# Check if logged in to CapRover
echo "🔐 Please ensure you are logged in to CapRover..."
echo "If not logged in, run: caprover login"
read -p "Press enter to continue after confirming login..."

# Deploy the application from local directory
echo "📦 Deploying application from local directory..."
echo "ℹ️  This will package and upload your local code to CapRover"
caprover deploy --default

echo "✅ Deployment completed!"
echo "📋 Don't forget to:"
echo "   1. Set up environment variables in CapRover dashboard"
echo "   2. Enable HTTPS"
echo "   3. Configure your MongoDB connection"
echo "   4. Test the application"

echo "🌐 Your app should be available at: https://yourapp.yourdomain.com"
