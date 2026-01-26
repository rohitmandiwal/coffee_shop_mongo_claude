#!/bin/bash

# Production startup script
# This script builds and runs the entire stack with Docker Compose
# Everything is containerized - MongoDB, Backend, and Frontend

echo "🚀 Starting Coffee Shop Management System - Production Mode"
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

# Pull base images with error handling
echo "📦 Pulling base images..."
echo "⏳ This may take a few minutes on first run..."

if ! docker pull node:18-alpine 2>/dev/null; then
    echo "⚠️  Could not pull node:18-alpine"
    echo "   Check: docker pull node:18-alpine"
    exit 1
fi
echo "  ✅ node:18-alpine"

if ! docker pull mongo:noble 2>/dev/null; then
    echo "⚠️  Could not pull mongo:noble"
    echo "   Check: docker pull mongo:noble"
    exit 1
fi
echo "  ✅ mongo:noble"

echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting all services (MongoDB, Backend, Frontend)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ All services are running!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo "  Health Check: http://localhost:3001/health"
echo "  MongoDB: localhost:27017 (username: root, password: password)"
echo ""
echo "📊 View logs:"
echo "  All services: docker-compose logs -f"
echo "  Backend only: docker-compose logs -f backend"
echo "  Frontend only: docker-compose logs -f frontend"
echo "  MongoDB only: docker-compose logs -f mongodb"
echo ""
echo "🛑 To stop all services:"
echo "  docker-compose down"
echo ""
echo "💾 Database data is persisted in named volume: mongo_data"
echo ""
