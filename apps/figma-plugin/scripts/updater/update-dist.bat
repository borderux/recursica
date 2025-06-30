@echo off
echo ========================================
echo Recursica Plugin - Dist Update Script
echo ========================================
echo.

REM Check if running in WSL (Windows Subsystem for Linux)
where bash >nul 2>nul
if %errorlevel% equ 0 (
    REM Check if we're in a WSL environment
    bash -c "uname -a" >nul 2>nul
    if %errorlevel% equ 0 (
        echo Detected WSL environment, using bash script...
        bash "%~dp0update-dist"
        exit /b %errorlevel%
    )
)

REM Try to use PowerShell first (more reliable)
powershell -ExecutionPolicy Bypass -File "%~dp0update-dist.ps1" 2>nul
if %errorlevel% equ 0 (
    exit /b 0
)

REM Fallback to curl method if PowerShell fails
echo PowerShell execution failed, trying curl method...
echo.

REM Check if curl is available
where curl >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Neither PowerShell nor curl is available.
    echo Please ensure PowerShell is available or install curl from: https://curl.se/windows/
    pause
    exit /b 1
)

REM Create dist directory if it doesn't exist
if not exist "dist" (
    echo Creating dist directory...
    mkdir dist
)

echo Downloading files from GitHub repository...
echo.

REM Download figma-plugin.js
echo Downloading figma-plugin.js...
curl -L -o "dist\figma-plugin.js" "https://raw.githubusercontent.com/borderux/recursica/main/apps/figma-plugin/dist-dev/figma-plugin.js"
if %errorlevel% neq 0 (
    echo ERROR: Failed to download figma-plugin.js
    pause
    exit /b 1
)

REM Download index.html
echo Downloading index.html...
curl -L -o "dist\index.html" "https://raw.githubusercontent.com/borderux/recursica/main/apps/figma-plugin/dist-dev/index.html"
if %errorlevel% neq 0 (
    echo ERROR: Failed to download index.html
    pause
    exit /b 1
)

echo.
echo ========================================
echo Update completed successfully!
echo Files have been downloaded to the dist folder.
echo ========================================
echo.
pause 