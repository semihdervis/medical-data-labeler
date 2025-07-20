# Deploy Frontend Only - PowerShell Script

Write-Host "Deploying frontend to CapRover..." -ForegroundColor Green

# Build frontend first
Write-Host "Building frontend..." -ForegroundColor Blue
Push-Location "frontend"
try {
    npm run build
    Write-Host "Frontend build completed!" -ForegroundColor Green
} catch {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Create frontend deployment structure
$deployDir = "deploy-frontend"
Write-Host "Creating deployment structure..." -ForegroundColor Blue

# Clean up any existing deploy directory
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}

# Create deployment structure
New-Item -ItemType Directory -Path $deployDir
New-Item -ItemType Directory -Path "$deployDir/frontend"

# Copy necessary files
Write-Host "Copying frontend files..." -ForegroundColor Blue

# Copy frontend-specific captain-definition and Dockerfile
Copy-Item "captain-definition" "$deployDir/captain-definition"
Copy-Item "Dockerfile.frontend" "$deployDir/Dockerfile"
Copy-Item "nginx.conf" "$deployDir/"

# Copy built frontend
Copy-Item -Recurse "frontend/dist" "$deployDir/frontend/"

# Create tarball
$tarballName = "mdl-frontend-$(Get-Date -Format 'yyyy-MM-dd-HHmm').tar"
Write-Host "Creating tarball: $tarballName" -ForegroundColor Blue

# Change to deploy directory and create tar
Push-Location $deployDir
tar -cf "../$tarballName" .
Pop-Location

# Clean up temp directory
Remove-Item -Recurse -Force $deployDir

Write-Host "Frontend deployment tarball created: $tarballName" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to CapRover Dashboard" -ForegroundColor White
Write-Host "2. Create new app called 'mdl-frontend'" -ForegroundColor White
Write-Host "3. Set 'Enable as Web App' to YES (important!)" -ForegroundColor White
Write-Host "4. Upload tarball: $tarballName" -ForegroundColor White
Write-Host "5. Enable HTTPS and configure domain" -ForegroundColor White
Write-Host ""
Write-Host "App Configuration:" -ForegroundColor Cyan
Write-Host "- Enable as Web App: YES" -ForegroundColor White
Write-Host "- Port: 80 (default)" -ForegroundColor White
Write-Host "- Force HTTPS: YES" -ForegroundColor White
Write-Host "- Connect your domain if you have one" -ForegroundColor White
Write-Host ""
Write-Host "Environment Variables (Optional):" -ForegroundColor Yellow
Write-Host "No environment variables needed!" -ForegroundColor Green
Write-Host "Frontend uses relative API calls (/api/*) that nginx proxies to backend" -ForegroundColor White
Write-Host ""
Write-Host "The frontend will automatically proxy:" -ForegroundColor Green
Write-Host "- /api/* -> srv-captain--mdlbackend:3001" -ForegroundColor White
Write-Host "- /projects/* -> srv-captain--mdlbackend:3001 (for images)" -ForegroundColor White
