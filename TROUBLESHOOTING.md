# Troubleshooting Guide

## Error: "failed to resolve reference docker.io/library/mongo:6.0-alpine"

This error means Docker cannot find or pull the MongoDB image. Here are solutions:

---

## ✅ Solution 1: Run Diagnostic Tool (Easiest)

```bash
chmod +x ./diagnose.sh
./diagnose.sh
```

This will:
- Check Docker installation
- Check Docker daemon
- Test Docker Hub connectivity
- Attempt to pull images automatically
- Show exactly what's wrong

---

## ✅ Solution 2: Manual Steps

### Step 1: Verify Docker is Running
```bash
# Check if Docker daemon is running
docker ps

# Should show something like:
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
# (empty if no containers running)
```

**If that fails:**
- **macOS**: Open `Docker.app` from Applications
- **Windows**: Open `Docker Desktop` from Start Menu
- **Linux**: Run `sudo systemctl start docker`

### Step 2: Test Internet Connection to Docker Hub
```bash
# Try pulling a tiny test image
docker pull hello-world

# If successful, you'll see: Downloaded newer image
# If fails, you have internet/firewall issue
```

**If this fails:**
- Check your internet connection
- Check firewall (may be blocking Docker Hub)
- Check Docker Hub status at https://www.dockerstatus.com

### Step 3: Manually Pull MongoDB Image
```bash
# Pull with verbose output to see what's happening
docker pull mongo:6.0-alpine

# This should show:
# Pulling from library/mongo
# Pulling fs layer...
# Download complete
# Digest: sha256:...
# Status: Downloaded newer image
```

**If this fails:**
```bash
# Try alternative repository
docker pull registry.hub.docker.com/library/mongo:6.0-alpine

# Or try without Alpine (larger, but more compatible)
docker pull mongo:6.0
```

### Step 4: Verify Image is Downloaded
```bash
# List all downloaded images
docker images | grep mongo

# Should show something like:
# REPOSITORY   TAG         IMAGE ID        CREATED       SIZE
# mongo        6.0-alpine  abc123def456    2 weeks ago   172MB
```

### Step 5: Run Start Script
```bash
./start-dev.sh
```

---

## 🔧 Advanced Troubleshooting

### Issue: "Docker daemon is not running"

**macOS with Docker Desktop:**
```bash
# Check if Docker is running
ps aux | grep Docker

# If not, start it
open /Applications/Docker.app

# Wait 30 seconds for it to start, then:
docker ps
```

**Linux:**
```bash
# Start Docker service
sudo systemctl start docker

# Enable auto-start
sudo systemctl enable docker

# Verify
docker ps
```

**Windows:**
```bash
# Open Docker Desktop from Start Menu
# Wait for it to say "Docker is running"
# Then run: docker ps
```

---

### Issue: "Cannot connect to Docker daemon"

```bash
# On macOS/Linux, might need sudo
sudo docker ps

# Or add current user to docker group (Linux only)
sudo usermod -aG docker $USER
newgrp docker

# Then try without sudo
docker ps
```

---

### Issue: "Network timeout when pulling images"

```bash
# Try increasing timeout
docker pull mongo:6.0-alpine --timeout 5m

# Or try different registry
docker pull registry.hub.docker.com/library/mongo:6.0-alpine

# Or pull from GitHub Container Registry
docker pull ghcr.io/docker-library/mongo:6.0-alpine
```

---

### Issue: "Disk space error"

```bash
# Check available disk space
df -h

# MongoDB image is ~170MB, Node is ~150MB
# You need at least 1-2GB free

# If low on space:
# 1. Delete unused Docker images: docker image prune -a
# 2. Delete unused containers: docker container prune
# 3. Delete all: docker system prune -a
```

---

### Issue: "Registry appears to be down"

Check Docker Hub status:
- https://www.dockerstatus.com
- https://status.docker.com

If Docker Hub is down, try alternative registries:

```bash
# Use Aliyun Mirror (faster in Asia)
docker pull registry.aliyuncs.com/library/mongo:6.0-alpine

# Use Tsinghua Mirror (faster in China)
docker pull docker.mirrors.tsinghua.edu.cn/library/mongo:6.0-alpine

# Use Azure Container Registry
docker pull mcr.microsoft.com/windows/servercore:ltsc2019
```

---

### Issue: "Firewall blocking Docker"

**Windows Firewall:**
```
1. Open Windows Defender Firewall
2. Allow Docker Desktop through firewall
3. Restart Docker Desktop
```

**macOS:**
```
System Preferences → Security & Privacy → Firewall
Allow Docker
```

**Linux:**
```bash
# Temporary (just for this session)
sudo ufw allow out to any port 443

# Permanent
sudo ufw allow 443
```

---

### Issue: "Certificate verification failed"

```bash
# This sometimes happens with corporate proxies
# Try without SSL verification (not recommended for production)

docker pull mongo:6.0-alpine --insecure-registry
```

---

## 📋 Diagnostic Commands Reference

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Check Docker daemon status
docker ps

# Check Docker info
docker info

# List downloaded images
docker images

# List running containers
docker ps

# Test connectivity to Docker Hub
docker pull hello-world

# Check disk usage
docker system df

# See recent errors
docker logs

# Check system resources
docker stats
```

---

## 🆘 If Nothing Works

Try this complete reset:

```bash
# 1. Stop Docker Desktop completely
# macOS: Quit Docker.app
# Windows: Exit Docker Desktop
# Linux: sudo systemctl stop docker

# 2. Wait 10 seconds

# 3. Restart Docker
# macOS: open /Applications/Docker.app
# Windows: Start Docker Desktop
# Linux: sudo systemctl start docker

# 4. Wait for Docker to fully start (30 seconds)

# 5. Clear Docker cache
docker system prune -a --volumes

# 6. Try pulling image again
docker pull mongo:6.0-alpine

# 7. Run diagnostic
./diagnose.sh

# 8. Try startup script
./start-dev.sh
```

---

## 📞 Getting More Help

If you're still stuck, provide this information:

```bash
# Your system
uname -a

# Docker version
docker --version
docker-compose --version

# Docker info
docker info

# Try pulling and show error
docker pull mongo:6.0-alpine 2>&1

# Show any existing containers
docker ps -a

# Show any existing volumes
docker volume ls
```

Then check:
- Docker Desktop Discord: https://discord.gg/docker
- Stack Overflow: https://stackoverflow.com/questions/tagged/docker
- Docker Community Forums: https://forums.docker.com

---

## 📌 Common Solutions Summary

| Error | Solution |
|-------|----------|
| `Docker daemon is not running` | Start Docker Desktop |
| `Cannot connect to Docker daemon` | Check Docker is running, might need `sudo` |
| `failed to resolve reference` | Run `docker pull mongo:6.0-alpine` manually |
| `Network timeout` | Check internet, try alternate registry |
| `Disk space error` | Free up space with `docker system prune -a` |
| `Certificate error` | Check corporate firewall/proxy |
| `Image not found` | Docker Hub might be down, check status |

---

## ✅ After Fixing

Once `docker pull mongo:6.0-alpine` works successfully:

```bash
# Run diagnostic to confirm
./diagnose.sh

# Then start dev mode
./start-dev.sh

# Or start production mode
./start-prod.sh
```

---

**Still having issues?** Run:
```bash
./diagnose.sh
```

It will pinpoint the exact problem! 🔍
