#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
# Fix permissions explicitly
chmod +x node_modules/.bin/react-scripts
# Use npx to run react-scripts directly
npx react-scripts build

# Return to root directory
cd ..

# Start the backend server
cd backend
export PORT=5000
exec gunicorn app:app