#!/bin/bash

# Start the backend Docker containers
echo "Starting Docker containers..."
docker compose up -d

# Check if the containers started successfully
if [ $? -ne 0 ]; then
    echo "Failed to start Docker containers. Exiting."
    exit 1
fi

# Navigate to the frontend directory
cd frontend

# Install dependencies (comment out if frontend deps are up to date)
echo "Installing frontend dependencies..."
npm install

# Start the frontend development server
echo "Starting frontend development server..."
npm run dev

# This script will keep running until you stop the frontend server (usually with Ctrl+C)
# When the frontend server is stopped, we'll stop the Docker containers

# Function to stop Docker containers
stop_containers() {
    echo "Stopping Docker containers..."
    cd ..  # Navigate back to the root directory
    docker compose down
}

# Set up a trap to catch script termination and stop Docker containers
trap stop_containers EXIT