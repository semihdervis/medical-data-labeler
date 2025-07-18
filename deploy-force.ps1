# Force Rebuild Deployment Script for CapRover (PowerShell)
# Use this when you need to bypass Docker cache

Write-Host "🚀 Starting FORCE deployment to CapRover..." -ForegroundColor Green
Write-Host "⚠️  This will force a complete rebuild (bypassing Docker cache)" -ForegroundColor Yellow

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

# Add a cache-busting comment to Dockerfile
$timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
$dockerfilePath = ".\Dockerfile"
$dockerfileContent = Get-Content $dockerfilePath

# Add cache-busting comment after the first line
$newContent = @()
$newContent += $dockerfileContent[0]
$newContent += "# Cache bust: $timestamp"
$newContent += $dockerfileContent[1..($dockerfileContent.Length-1)]

$newContent | Set-Content $dockerfilePath

Write-Host "🔄 Added cache-busting comment to Dockerfile" -ForegroundColor Blue

# Deploy the application
Write-Host "📦 Deploying application with forced rebuild..." -ForegroundColor Blue
caprover deploy --default

# Restore original Dockerfile (remove cache-busting comment)
$dockerfileContent | Set-Content $dockerfilePath
Write-Host "🔧 Restored original Dockerfile" -ForegroundColor Green

Write-Host "✅ Force deployment completed!" -ForegroundColor Green
Write-Host "📋 Don't forget to:" -ForegroundColor Yellow
Write-Host "   1. Set up environment variables in CapRover dashboard" -ForegroundColor White
Write-Host "   2. Enable HTTPS" -ForegroundColor White
Write-Host "   3. Configure your MongoDB connection" -ForegroundColor White
Write-Host "   4. Test the application" -ForegroundColor White

Write-Host "🌐 Your app should be available at: https://yourapp.yourdomain.com" -ForegroundColor Cyan
