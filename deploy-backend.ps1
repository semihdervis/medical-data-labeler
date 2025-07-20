# Deploy Backend Only - PowerShell Script

Write-Host "Deploying backend to CapRover..." -ForegroundColor Green

# Check if server directory exists
if (-not (Test-Path "server")) {
    Write-Host "Error: server directory not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Create backend deployment structure
$deployDir = "deploy-backend"
Write-Host "Creating deployment structure..." -ForegroundColor Blue

# Clean up any existing deploy directory
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}

# Create deployment structure
New-Item -ItemType Directory -Path $deployDir

# Copy necessary files
Write-Host "Copying backend files..." -ForegroundColor Blue

# Copy backend-specific captain-definition and Dockerfile
Copy-Item "captain-definition" "$deployDir/captain-definition"
Copy-Item "Dockerfile.backend" "$deployDir/Dockerfile"

# Copy entire server directory
Copy-Item -Recurse "server" "$deployDir/"

# Create tarball
$tarballName = "mdl-backend-$(Get-Date -Format 'yyyy-MM-dd-HHmm').tar"
Write-Host "Creating tarball: $tarballName" -ForegroundColor Blue

# Change to deploy directory and create tar
Push-Location $deployDir
tar -cf "../$tarballName" .
Pop-Location

# Clean up temp directory
Remove-Item -Recurse -Force $deployDir

Write-Host "Backend deployment tarball created: $tarballName" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to CapRover Dashboard" -ForegroundColor White
Write-Host "2. Create new app called 'mdlbackend'" -ForegroundColor White
Write-Host "3. Do NOT enable 'Enable as Web App' (keep it NO)" -ForegroundColor White
Write-Host "4. Upload tarball: $tarballName" -ForegroundColor White
Write-Host "5. Configure environment variables (see below)" -ForegroundColor White
Write-Host ""
Write-Host "App Configuration:" -ForegroundColor Cyan
Write-Host "- Enable as Web App: NO (important!)" -ForegroundColor White
Write-Host "- Container HTTP Port: 3001" -ForegroundColor White
Write-Host "- No domain needed (internal service)" -ForegroundColor White
Write-Host ""
Write-Host "Required Environment Variables:" -ForegroundColor Yellow
Write-Host "MONGODB_URI=your_mongodb_connection_string" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "PORT=3001" -ForegroundColor White
Write-Host ""
Write-Host "Optional Environment Variables:" -ForegroundColor Yellow
Write-Host "JWT_SECRET=your_jwt_secret_key" -ForegroundColor White
Write-Host "EMAIL_HOST=your_smtp_host" -ForegroundColor White
Write-Host "EMAIL_PORT=587" -ForegroundColor White
Write-Host "EMAIL_USER=your_email_user" -ForegroundColor White
Write-Host "EMAIL_PASS=your_email_password" -ForegroundColor White
Write-Host ""
Write-Host "Important Notes:" -ForegroundColor Red
Write-Host "- Backend runs as internal service on srv-captain--mdlbackend:3001" -ForegroundColor White
Write-Host "- Frontend nginx config already proxies to this service" -ForegroundColor White
Write-Host "- Make sure MongoDB is accessible from CapRover" -ForegroundColor White
Write-Host "- Health check endpoint: /api/health" -ForegroundColor White
Write-Host ""
Write-Host "After deployment, the backend will be accessible internally at:" -ForegroundColor Green
Write-Host "srv-captain--mdlbackend:3001" -ForegroundColor Cyan
