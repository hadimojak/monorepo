#!/bin/bash

echo "Starting NestJS Monorepo (Windows Bash compatible)..."
echo ""

# Start services and capture real PIDs (not job PIDs)
npm run start:dev auth > logs-auth.txt 2>&1 &
AUTH_PID=$!

npm run start:dev api-gateway > logs-gateway.txt 2>&1 &
GATEWAY_PID=$!

echo "AUTH PID: $AUTH_PID"
echo "API-GATEWAY PID: $GATEWAY_PID"
echo ""

echo "Both services started."
echo "----------------------------------------"
echo "Stop services with:"
echo "kill $AUTH_PID $GATEWAY_PID"
echo ""

# Keep script alive so jobs table stays valid
# Prevents Git Bash from throwing errors
wait $AUTH_PID
wait $GATEWAY_PID
