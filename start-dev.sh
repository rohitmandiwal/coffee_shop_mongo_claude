#!/bin/bash

# Development startup script
# This script starts MongoDB in Docker and then runs backend and frontend

echo "🚀 Starting Coffee Shop Management System - Development Mode"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Docker daemon is running
if ! docker ps &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    echo ""
    echo "📖 How to fix:"
    echo "  macOS: Open 'Docker.app' from Applications folder"
    echo "  Windows: Open 'Docker Desktop' from Start menu"
    echo "  Linux: Run 'sudo systemctl start docker'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check Docker info
echo "📋 Checking Docker configuration..."
docker info > /dev/null 2>&1

# Try to pull MongoDB image with timeout
echo "📦 Pulling MongoDB image (mongo:noble)..."
echo "⏳ This may take a minute or two on first run..."

if docker pull mongo:noble 2>/dev/null; then
    echo "✅ MongoDB image pulled successfully"
else
    echo ""
    echo "⚠️  Could not pull MongoDB image automatically."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "  1. Check internet connection"
    echo "  2. Try pulling manually:"
    echo "     docker pull mongo:noble"
    echo ""
    echo "  3. If that fails, try alternative registries:"
    echo "     docker pull registry.hub.docker.com/library/mongo:noble"
    echo ""
    echo "  4. Or check Docker Hub status at:"
    echo "     https://www.docker.com/products/docker-desktop"
    echo ""
    exit 1
fi

# Start MongoDB in the background
echo ""
echo "📦 Starting MongoDB container..."
docker-compose -f docker-compose.dev.yml up -d mongodb 2>&1 | tail -5

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3

# Check MongoDB health
MAX_ATTEMPTS=30
ATTEMPT=0
until docker exec coffee_shop_mongodb_dev mongosh -u root -p password --authenticationDatabase admin --eval "db.adminCommand('ping')" > /dev/null 2>&1 || [ $ATTEMPT -eq $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  echo "⏳ Attempting to connect to MongoDB... ($ATTEMPT/$MAX_ATTEMPTS)"
  sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
  echo "❌ MongoDB failed to start"
  exit 1
fi

echo "✅ MongoDB is ready!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm install  # Only needed first time"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm install  # Only needed first time"
echo "  npm run dev"
echo ""
echo "Then open:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo "  Health Check: http://localhost:3001/health"
echo ""
echo "To stop MongoDB:"
echo "  docker-compose -f docker-compose.dev.yml down"
echo ""
