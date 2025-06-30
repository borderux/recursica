#!/bin/bash

# Recursica Plugin - Dist Update Script (Cross-platform)
echo "========================================"
echo "Recursica Plugin - Dist Update Script"
echo "========================================"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Create dist directory if it doesn't exist
if [ ! -d "dist" ]; then
    echo "Creating dist directory..."
    mkdir -p dist
fi

echo "Downloading files from GitHub repository..."
echo ""

# GitHub repository URLs
BASE_URL="https://raw.githubusercontent.com/borderux/recursica/main/dist-dev"
FILES=("figma-plugin.js" "index.html")

# Try different download methods
if command_exists curl; then
    DOWNLOAD_CMD="curl -L -o"
elif command_exists wget; then
    DOWNLOAD_CMD="wget -O"
else
    echo "ERROR: Neither curl nor wget is available."
    echo "Please install curl or wget:"
    echo "  macOS: brew install curl"
    echo "  Ubuntu/Debian: sudo apt-get install curl"
    echo "  CentOS/RHEL: sudo yum install curl"
    read -p "Press Enter to exit..."
    exit 1
fi

# Download each file
for file in "${FILES[@]}"; do
    url="$BASE_URL/$file"
    output_path="dist/$file"
    
    echo "Downloading $file..."
    
    if $DOWNLOAD_CMD "$output_path" "$url"; then
        echo "✓ Successfully downloaded $file"
    else
        echo "✗ ERROR: Failed to download $file"
        echo ""
        read -p "Press Enter to exit..."
        exit 1
    fi
done

echo ""
echo "========================================"
echo "Update completed successfully!"
echo "Files have been downloaded to the dist folder."
echo "========================================"
echo ""
read -p "Press Enter to exit..." 