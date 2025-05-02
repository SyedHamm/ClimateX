#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
chmod +x node_modules/.bin/react-scripts
npx react-scripts build

# Return to root directory
cd ..