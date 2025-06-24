# Next.js Development Server Startup Script
Write-Host "Starting Next.js Development Server..." -ForegroundColor Green

# Change to the frontend directory
Set-Location $PSScriptRoot

# Clean up any existing build artifacts
Write-Host "Cleaning up build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "Removed .next directory" -ForegroundColor Yellow
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
    Write-Host "Removed node_modules cache" -ForegroundColor Yellow
}

# Clear any temporary files
Get-ChildItem -Path "." -Include "*tmp*", "*.tmp" -Recurse -Force | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "Starting development server..." -ForegroundColor Green

# Start the development server without turbopack first
try {
    npm run dev
} catch {
    Write-Host "Failed to start with regular mode, trying with turbopack..." -ForegroundColor Red
    npm run dev:turbo
}
