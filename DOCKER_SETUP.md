# Docker Setup Guide

## Overview

The Coffee Shop Management System is fully containerized with Docker. No manual MongoDB setup required - everything is configured in Docker Compose files.

### Key Points

✅ **No manual MongoDB setup** - Just run docker-compose
✅ **Persistent volumes** - Data survives container restarts
✅ **Multi-stage builds** - Optimized container images
✅ **Health checks** - Services only start when dependencies are ready
✅ **Two configurations** - Production and development

---

## File Structure

```
/mongo_app/
├── docker-compose.yml           # Production: All 3 services
├── docker-compose.dev.yml       # Development: MongoDB only
├── backend/Dockerfile           # Backend build config
├── frontend/Dockerfile          # Frontend build config
├── start-prod.sh               # Convenience script for production
├── start-dev.sh                # Convenience script for development
└── DEPLOYMENT.md               # Detailed deployment guide
```

---

## Production Setup (docker-compose.yml)

**What it does:**
- Starts MongoDB with persistent storage
- Builds and starts Backend API
- Builds and starts Frontend
- Backend waits for MongoDB to be healthy
- Frontend waits for Backend to be ready

**Persistent Volume:**
```
mongo_data (named volume)
├── Stores: /data/db inside MongoDB container
├── Host: /var/lib/docker/volumes/mongo_data/_data/
└── Survives: Container stop, restart, rebuild
```

**Services Configuration:**

### MongoDB Service
```yaml
mongodb:
  image: mongo:6.0-alpine
  environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: password
    MONGO_INITDB_DATABASE: coffee_shop
  ports:
    - "27017:27017"  # Accessible from backend & host
  volumes:
    - mongo_data:/data/db  # ← Persistent storage
  healthcheck:
    test: [mongosh health check]
```

### Backend Service
```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile  # Multi-stage build
  environment:
    MONGO_URI: mongodb://root:password@mongodb:27017/coffee_shop?authSource=admin
    # Note: Uses service name 'mongodb' (Docker DNS resolves it)
  depends_on:
    mongodb:
      condition: service_healthy  # ← Waits for MongoDB
```

### Frontend Service
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile  # Multi-stage build
  depends_on:
    - backend  # ← Waits for Backend to be running
```

---

## Development Setup (docker-compose.dev.yml)

**What it does:**
- Starts ONLY MongoDB in Docker
- You run Backend & Frontend locally with `npm run dev`
- Perfect for rapid development

**Persistent Volume:**
```
mongo_data_dev (named volume)
├── Stores: /data/db inside MongoDB container
└── Survives: Container stop, restart
```

**Services Configuration:**

```yaml
mongodb:
  image: mongo:6.0-alpine
  environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: password
  ports:
    - "27017:27017"  # Accessible from localhost
  volumes:
    - mongo_data_dev:/data/db  # ← Persistent storage
```

---

## Usage Examples

### Production Deployment

```bash
# Method 1: Using script (easiest)
./start-prod.sh

# Method 2: Manual commands
docker-compose build
docker-compose up -d

# Access applications
curl http://localhost:3001/health  # Backend health
open http://localhost:3000          # Frontend
```

**What happens:**
1. Builds backend from `backend/Dockerfile`
2. Builds frontend from `frontend/Dockerfile`
3. Starts MongoDB with mongo_data volume
4. Starts Backend (waits for MongoDB health check)
5. Starts Frontend (waits for Backend)
6. All running in containers

**Database data is persisted:**
```bash
# Stop containers (data remains)
docker-compose down

# Restart (data still there)
docker-compose up -d
```

### Development Mode

```bash
# Method 1: Using script
./start-dev.sh

# Method 2: Manual commands
docker-compose -f docker-compose.dev.yml up -d

# Then in separate terminals:
cd backend && npm run dev
cd frontend && npm run dev
```

**What happens:**
1. Starts ONLY MongoDB in Docker container
2. Backend runs on your machine (npm run dev)
3. Frontend runs on your machine (npm run dev)
4. MongoDB data persisted in mongo_data_dev volume

---

## Persistent Volume Management

### View volumes
```bash
docker volume ls
```

Output:
```
DRIVER    VOLUME NAME
local     mongo_data
local     mongo_data_dev
```

### Inspect volume
```bash
docker volume inspect mongo_data
```

Output:
```json
[
    {
        "Name": "mongo_data",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/mongo_data/_data",
        "Labels": {},
        "Scope": "local"
    }
]
```

### Backup MongoDB data
```bash
# Create backup directory
mkdir -p backups

# Backup entire database
docker exec coffee_shop_mongodb mongodump \
  -u root \
  -p password \
  --authenticationDatabase admin \
  --out /tmp/backup

# Copy from container
docker cp coffee_shop_mongodb:/tmp/backup ./backups/
```

### Access MongoDB data directly
```bash
# Connect to MongoDB CLI
docker exec -it coffee_shop_mongodb mongosh \
  -u root \
  -p password \
  --authenticationDatabase admin

# List databases
db.adminCommand('listDatabases')

# Switch to coffee_shop database
use coffee_shop

# List collections
show collections

# View data
db.menu_items.find()
db.customers.find()
```

### Delete volume (⚠️ DELETES ALL DATA)
```bash
# Stop containers first
docker-compose down

# Remove the volume
docker volume rm mongo_data

# ⚠️ All database data is gone!
```

---

## Docker Dockerfile Details

### Backend Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
RUN npm run build  # TypeScript → JavaScript

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # Only production deps
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

**Benefits:**
- Final image only contains: Runtime + Node modules + Built JS
- Reduces image size significantly
- No source code or build tools in production

### Frontend Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # Next.js build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
CMD ["npm", "start"]
```

**Benefits:**
- Next.js build artifacts optimized
- Production image is lean
- Code is never exposed in final image

---

## Environment Configuration

### In Production (docker-compose.yml)
```yaml
backend:
  environment:
    NODE_ENV: production
    PORT: 3001
    MONGO_URI: mongodb://root:password@mongodb:27017/coffee_shop?authSource=admin
    JWT_SECRET: super-secret-jwt-key-change-in-production
    CORS_ORIGIN: http://localhost:3000
    LOG_LEVEL: info
```

Note: `mongodb` resolves to the MongoDB service via Docker DNS

### In Development (.env)
```
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://root:password@localhost:27017/coffee_shop?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

Note: `localhost` because MongoDB runs on your machine

---

## Networking

### Production (docker-compose.yml)
```
┌─────────────────────────────────────────────┐
│         coffee-app network (bridge)         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐   ┌──────────────────┐  │
│  │  frontend    │   │  nginx reverse   │  │
│  │  :3000       │   │  proxy (optional)│  │
│  └──────────────┘   └──────────────────┘  │
│         ↓                                  │
│  ┌──────────────────────────────────────┐ │
│  │  backend                             │ │
│  │  :3001                               │ │
│  └──────────────────────────────────────┘ │
│         ↓                                  │
│  ┌──────────────────────────────────────┐ │
│  │  mongodb                             │ │
│  │  :27017                              │ │
│  └──────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

All services can communicate using service names (DNS):
- Backend → MongoDB: `mongodb://root:password@mongodb:27017/coffee_shop`
- Frontend → Backend: `http://localhost:3001` (external access) or `http://backend:3001` (internal)

---

## Common Tasks

### Check service status
```bash
docker-compose ps
```

### View logs
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend       # Backend only
docker-compose logs -f mongodb       # MongoDB only
```

### Restart a service
```bash
docker-compose restart backend
docker-compose restart mongodb
```

### Rebuild images
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Enter a container
```bash
docker exec -it coffee_shop_backend sh
docker exec -it coffee_shop_mongodb mongosh -u root -p password --authenticationDatabase admin
```

### Clean everything
```bash
docker-compose down -v --rmi all
```

---

## Troubleshooting

### MongoDB won't start
```bash
docker-compose logs mongodb

# Common issues:
# 1. Port 27017 already in use
#    → Change port in docker-compose.yml
# 2. Volume permission issues
#    → Run: docker volume rm mongo_data (loses data)
# 3. Corrupt database
#    → Docker volume rm mongo_data && docker-compose up
```

### Backend can't connect to MongoDB
```bash
docker-compose logs backend

# Common issues:
# 1. MONGO_URI has wrong service name
#    → Should be: mongodb://root:password@mongodb:27017/...
# 2. MongoDB not healthy yet
#    → Backend depends on service_healthy condition
# 3. Authentication failed
#    → Check MONGO_INITDB_ROOT_USERNAME/PASSWORD
```

### Frontend can't reach backend
```bash
docker-compose logs frontend

# Common issues:
# 1. NEXT_PUBLIC_API_URL is wrong
#    → Check docker-compose.yml NEXT_PUBLIC_API_URL
# 2. Backend not running
#    → Run: docker-compose restart backend
# 3. CORS not configured
#    → Check CORS_ORIGIN in backend environment
```

---

## Performance Considerations

1. **Multi-stage builds** - Reduces image size by ~70%
2. **Alpine images** - Lightweight base images
3. **Layer caching** - Docker caches layers for faster rebuilds
4. **Volume performance** - Named volumes are optimized
5. **Network isolation** - Services on private network

---

## Security Considerations

1. ✅ Credentials in docker-compose.yml (fine for dev)
2. ⚠️ Change credentials for production
3. ⚠️ Use .env files for sensitive data in production
4. ✅ Services isolated on private network
5. ✅ Only necessary ports exposed

---

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
