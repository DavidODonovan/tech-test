#!/bin/bash

# Default number of fake data items
NUM_ITEMS=10

# Parse command-line arguments
while getopts ":n:" opt; do
  case $opt in
    n) NUM_ITEMS=$OPTARG ;;
    \?) echo "Invalid option -$OPTARG" >&2; exit 1 ;;
  esac
done

# Start the backend Docker containers
echo "Starting Docker containers..."
docker compose up -d

# Check if the containers started successfully
if [ $? -ne 0 ]; then
    echo "Failed to start Docker containers. Exiting."
    exit 1
fi

# Run the seed script with the specified number of fake data items
echo "Seeding database with $NUM_ITEMS fake data items..."
sleep 15  # Wait for 15 seconds to ensure the API is ready
docker run --rm --network="host" -v $(pwd)/backend:/backend node:20-alpine sh -c "node /backend/seed.js $NUM_ITEMS"

# Navigate to the frontend directory
cd frontend

# Install dependencies (comment out if frontend deps are up to date)
echo "Installing frontend dependencies..."
npm install

# Start the frontend development server
echo "Starting frontend development server..."
npm run dev

# Function to stop Docker containers
stop_containers() {
    echo "Stopping Docker containers..."
    cd ..  # Navigate back to the root directory
    docker compose down
}

# Set up a trap to catch script termination and stop Docker containers
trap stop_containers EXIT
