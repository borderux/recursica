#!/bin/bash

# Script to reset, fetch, and pull the latest changes from the remote repository

# Enable strict error handling
set -e

# Function to display a message
function echo_message {
    echo "======================="
    echo "$1"
    echo "======================="
}

# Perform git reset --hard
echo_message "Performing git reset --hard..."
git reset --hard

# Perform git fetch
echo_message "Fetching latest changes..."
git fetch

# Perform git pull
echo_message "Pulling latest changes..."
git pull

echo_message "Repository successfully reset and updated."
read -p "Press enter to exit ..."
