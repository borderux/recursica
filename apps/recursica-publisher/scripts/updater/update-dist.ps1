# Recursica Publisher - Dist Update Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Recursica Publisher - Dist Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create dist directory if it doesn't exist
if (-not (Test-Path "dist")) {
    Write-Host "Creating dist directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "dist" | Out-Null
}

Write-Host "Downloading files from GitHub repository..." -ForegroundColor Green
Write-Host ""

# GitHub repository URLs
$baseUrl = "https://raw.githubusercontent.com/borderux/recursica/main/apps/recursica-publisher/dist"
$files = @("recursica-publisher.js", "index.html", "vite.svg")

# Download each file
foreach ($file in $files) {
    $url = "$baseUrl/$file"
    $outputPath = "dist/$file"
    
    Write-Host "Downloading $file..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
        Write-Host "Successfully downloaded $file" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: Failed to download $file" -ForegroundColor Red
        Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Yellow
        Read-Host
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update completed successfully!" -ForegroundColor Green
Write-Host "Files have been downloaded to the dist folder." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
Read-Host