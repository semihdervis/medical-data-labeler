# CapRover Deployment Script for Medical Data Labeler (PowerShell)
# Run this script to deploy to CapRover

Write-Host "🚀 Starting deployment to CapRover..." -ForegroundColor Green

# Check if caprover CLI is installed
try {
    caprover --version | Out-Null
} catch {
    Write-Host "❌ CapRover CLI not found. Installing..." -ForegroundColor Red
    npm install -g caprover
}

# Check if logged in to CapRover
Write-Host "🔐 Please ensure you are logged in to CapRover..." -ForegroundColor Yellow
Write-Host "If not logged in, run: caprover login" -ForegroundColor Yellow
Read-Host "Press enter to continue after confirming login"

# Deploy the application from local directory
Write-Host "📦 Deploying application from local directory..." -ForegroundColor Blue
Write-Host "ℹ️  This will package and upload your local code to CapRover" -ForegroundColor Cyan
caprover deploy --default

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "📋 Don't forget to:" -ForegroundColor Yellow
Write-Host "   1. Set up environment variables in CapRover dashboard" -ForegroundColor White
Write-Host "   2. Enable HTTPS" -ForegroundColor White
Write-Host "   3. Configure your MongoDB connection" -ForegroundColor White
Write-Host "   4. Test the application" -ForegroundColor White

Write-Host "🌐 Your app should be available at: https://yourapp.yourdomain.com" -ForegroundColor Cyan
