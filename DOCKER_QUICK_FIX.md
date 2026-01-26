# Docker Quick Fix - Image Pull Error

## The Problem

You got this error:
```
Error response from daemon: failed to resolve reference "docker.io/library/mongo:6.0-alpine":
docker.io/library/mongo:6.0-alpine: not found
```

## Quick Solution (Copy-Paste These)

### Step 1: Make sure Docker is running
```bash
# Check Docker is running
docker ps

# If error: Docker daemon is not running
# → Open Docker Desktop and wait 30 seconds for it to start
```

### Step 2: Test if you can reach Docker Hub
```bash
# Try pulling a test image
docker pull hello-world

# If this works, skip to Step 3
# If fails → Check your internet connection or firewall
```

### Step 3: Pull MongoDB manually
```bash
# Pull the MongoDB image
docker pull mongo:noble

# Wait for it to complete (2-5 minutes depending on internet)
# You'll see: "Status: Downloaded newer image for mongo:noble"
```

### Step 4: Verify it worked
```bash
# Check if image is now available
docker images | grep mongo

# You should see: mongo    6.0-alpine    ...
```

### Step 5: Now run the startup script
```bash
./start-dev.sh
```

---

## If Steps 1-3 Didn't Work

Check which step is failing:

### ❌ Step 1 Failed: Docker not running
- **macOS**: Open `Docker.app` from Applications folder
- **Windows**: Open `Docker Desktop` from Start Menu
- **Linux**: Run `sudo systemctl start docker`
- Wait 30 seconds for it to fully start
- Try again: `docker ps`

### ❌ Step 2 Failed: Can't reach Docker Hub
This means internet issue:
1. Check your internet connection: `ping 8.8.8.8`
2. Check firewall/VPN
3. Try alternate mirror:
   ```bash
   docker pull mongo:6.0-alpine --registry-mirror https://mirror.aliyuncs.com
   ```
4. Or skip Docker Hub, build locally instead

### ❌ Step 3 Failed: Can't pull mongo image
Try these alternatives:

**Option A: Use older Node version (more compatible)**
```bash
docker pull mongo:5.0-alpine
```

**Option B: Use without Alpine (larger but more universal)**
```bash
docker pull mongo:8.0
```

**Option C: Use different registry**
```bash
docker pull registry.hub.docker.com/library/mongo:noble
```

**Option D: Check Docker Hub is online**
- Visit: https://www.dockerstatus.com
- If shows "Operational", it's available
- If shows incidents, Docker Hub might be down

**Option E: Try the alternative we're using instead**
```bash
# mongo:noble is based on Ubuntu Noble and is more stable
docker pull mongo:noble
```

---

## Run This to Diagnose Automatically

```bash
chmod +x ./diagnose.sh
./diagnose.sh
```

This will automatically:
- ✅ Check Docker installation
- ✅ Test Docker daemon
- ✅ Test Docker Hub connectivity
- ✅ Try to pull images
- ✅ Tell you exactly what's wrong

---

## Most Likely Cause

**Docker Desktop is not running** → Open Docker Desktop

---

## After Fixing

Once `docker pull mongo:noble` succeeds:

```bash
# Development mode
./start-dev.sh
cd backend && npm run dev    # Terminal 2
cd frontend && npm run dev   # Terminal 3

# Or production mode
./start-prod.sh
```

---

## Need More Help?

See: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
