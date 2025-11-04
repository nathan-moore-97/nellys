param(
    [Parameter(Mandatory=$true)]
    [string]$IpAddress,
    
    [Parameter(Mandatory=$true)]
    [string]$DockerUser
)

Write-Host "🚀 Creating images for Droplet IP: $IpAddress" -ForegroundColor Green
Write-Host "🐳 Docker Hub user: $DockerUser" -ForegroundColor Green
Write-Host ""

# Login to Docker Hub
Write-Host "📦 Logging into Docker Hub..." -ForegroundColor Cyan
docker login

Set-Location "..\..\"

# Build and push backend
Write-Host ""
Write-Host "🔨 Building backend..." -ForegroundColor Cyan
Set-Location ".\api"
docker build -t "$DockerUser/nellys-backend:latest" --no-cache .

Write-Host ""
Write-Host "⬆️  Pushing backend..." -ForegroundColor Cyan
docker push "$DockerUser/nellys-backend:latest"

Set-Location "..\"

# Build and push frontend
Write-Host ""
Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
Set-Location ".\client"
docker build -t "$DockerUser/nellys-frontend:latest" --no-cache .

Write-Host ""
Write-Host "⬆️  Pushing frontend..." -ForegroundColor Cyan
docker push "$DockerUser/nellys-frontend:latest"

Set-Location "..\"

Write-Host ""
Write-Host "✅ Build and push complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. SSH into your server: ssh root@$IpAddress"
Write-Host "2. cd /opt/nellys"
Write-Host "3. docker compose pull"
Write-Host "4. docker compose up -d"
Write-Host ""
Write-Host "Visit: http://$IpAddress" -ForegroundColor Cyan