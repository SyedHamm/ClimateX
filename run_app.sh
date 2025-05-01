#!/bin/bash

echo "==============================================="
echo " Starting ClimateX Weather Forecast Application"
echo "==============================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python not found! Please install Python 3.7 or newer."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found! Please install Node.js and npm."
    exit 1
fi

echo "Installing Python dependencies..."
cd backend
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install Python dependencies!"
    exit 1
fi

echo
echo "Starting Flask backend server..."
python3 app.py &
BACKEND_PID=$!
echo "Backend server starting on http://localhost:5000"

echo
echo "Installing Node.js dependencies (this might take a few minutes on first run)..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install Node.js dependencies!"
    # Kill backend server on failure
    kill $BACKEND_PID
    exit 1
fi

echo
echo "Starting React frontend..."
echo "When the React server starts, a browser window should open automatically."
echo "If it doesn't, please open http://localhost:3000 in your browser."
echo
echo "Press Ctrl+C to stop the application."
echo

# Set up cleanup function for graceful shutdown
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    exit 0
}

# Trap Ctrl+C to call cleanup function
trap cleanup INT

# Start the frontend and wait
npm start
