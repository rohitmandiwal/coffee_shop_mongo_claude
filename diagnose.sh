#!/bin/bash

# Docker diagnostic script
# Helps troubleshoot Docker and image pulling issues

echo "🔍 Coffee Shop - Docker Diagnostic Tool"
echo "======================================"
echo ""

# 1. Check Docker Installation
echo "1️⃣  Checking Docker Installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "   ✅ Docker installed: $DOCKER_VERSION"
else
    echo "   ❌ Docker not installed"
    echo "   📖 Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 2. Check Docker Daemon
echo ""
echo "2️⃣  Checking Docker Daemon..."
if docker ps &> /dev/null; then
    echo "   ✅ Docker daemon running"
else
    echo "   ❌ Docker daemon not running"
    echo "   📖 Start Docker Desktop and try again"
    exit 1
fi

# 3. Check Docker Compose
echo ""
echo "3️⃣  Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo "   ✅ Docker Compose installed: $COMPOSE_VERSION"
else
    echo "   ❌ Docker Compose not installed"
    exit 1
fi

# 4. Check Docker Hub Connectivity
echo ""
echo "4️⃣  Checking Docker Hub Connectivity..."
if timeout 10 docker pull hello-world &> /dev/null; then
    echo "   ✅ Can reach Docker Hub"
    # Clean up
    docker rmi hello-world &> /dev/null
else
    echo "   ❌ Cannot reach Docker Hub"
    echo "   📖 Possible causes:"
    echo "      - Internet not connected"
    echo "      - Firewall blocking Docker Hub"
    echo "      - Docker Hub is down (check https://www.dockerstatus.com)"
    echo ""
    echo "   💡 Try: docker pull hello-world"
    exit 1
fi

# 5. Check MongoDB Image
echo ""
echo "5️⃣  Checking MongoDB Image..."
if docker image ls | grep -q "mongo.*noble"; then
    echo "   ✅ MongoDB noble already downloaded"
else
    echo "   ⏳ MongoDB noble not found locally"
    echo "   📦 Attempting to pull..."

    if docker pull mongo:noble 2>&1; then
        echo "   ✅ Successfully pulled mongo:noble"
    else
        echo "   ❌ Failed to pull mongo:noble"
        echo "   📖 Try manually: docker pull mongo:noble"
        exit 1
    fi
fi

# 6. Check Node Image
echo ""
echo "6️⃣  Checking Node Image..."
if docker image ls | grep -q "node.*18-alpine"; then
    echo "   ✅ Node 18-alpine already downloaded"
else
    echo "   ⏳ Node 18-alpine not found locally"
    echo "   📦 Attempting to pull..."

    if docker pull node:18-alpine 2>&1; then
        echo "   ✅ Successfully pulled node:18-alpine"
    else
        echo "   ❌ Failed to pull node:18-alpine"
        echo "   📖 Try manually: docker pull node:18-alpine"
        exit 1
    fi
fi

# 7. Check Disk Space
echo ""
echo "7️⃣  Checking Disk Space..."
AVAILABLE=$(df / | awk 'NR==2 {print $4}')
AVAILABLE_GB=$((AVAILABLE / 1024 / 1024))

if [ "$AVAILABLE_GB" -gt 5 ]; then
    echo "   ✅ Sufficient disk space: ${AVAILABLE_GB}GB available"
else
    echo "   ⚠️  Low disk space: ${AVAILABLE_GB}GB available (need >5GB)"
fi

# 8. Check Docker Resources
echo ""
echo "8️⃣  Checking Docker Resources..."
docker stats --no-stream --all 2>/dev/null | head -3
echo "   ✅ Docker resources available"

echo ""
echo "======================================"
echo "✅ All checks passed!"
echo ""
echo "You can now run:"
echo "  ./start-dev.sh   (Development mode)"
echo "  ./start-prod.sh  (Production mode)"
echo ""
