# Deployment Guide

## Production Deployment with Docker

This guide explains how to deploy the Coffee Shop Management System in production.

### Prerequisites

- Docker installed
- Docker Compose installed
- Docker daemon running

### Quick Deployment

**Option 1: Using startup script (Easiest)**
```bash
chmod +x start-prod.sh
./start-prod.sh
```

**Option 2: Manual commands**
```bash
# Build Docker images
docker-compose build

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### What Gets Deployed

When you run `docker-compose up --build`, the following happens:

1. **MongoDB Container**
   - Image: `mongo:6.0-alpine`
   - Database: `coffee_shop`
   - Credentials: root / password (changeable in docker-compose.yml)
   - Persistent Storage: Named volume `mongo_data`
   - Port: 27017 (internal, accessible only to backend by default)

2. **Backend Container**
   - Image: Built from `backend/Dockerfile`
   - Multi-stage build (optimized)
   - Environment: Configured in docker-compose.yml
   - Port: 3001
   - Automatically waits for MongoDB to be healthy before starting

3. **Frontend Container**
   - Image: Built from `frontend/Dockerfile`
   - Multi-stage build (optimized Next.js)
   - Environment: Configured in docker-compose.yml
   - Port: 3000
   - Automatically waits for Backend to be ready before starting

### Database Persistence

All database data is automatically persisted in a Docker named volume.

**View persistent data:**
```bash
# List all volumes
docker volume ls

# Inspect mongo_data volume
docker volume inspect mongo_data

# View volume location on host
docker volume inspect mongo_data | grep Mountpoint
```

**Data persists when:**
- Containers are stopped: `docker-compose down`
- Containers are restarted: `docker-compose restart`
- Services are updated: `docker-compose up --build`

**Data is lost only when:**
```bash
# ⚠️ This deletes the persistent volume and ALL data
docker volume rm mongo_data
```

### Accessing the Application

Once deployed:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **MongoDB**: localhost:27017 (internal only)

### Managing Services

**View service status:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend       # Backend only
docker-compose logs -f frontend      # Frontend only
docker-compose logs -f mongodb       # MongoDB only
```

**Restart services:**
```bash
docker-compose restart              # All
docker-compose restart backend       # Backend only
docker-compose restart frontend      # Frontend only
```

**Stop services (data persists):**
```bash
docker-compose down
```

**Stop services and remove volumes (⚠️ deletes data):**
```bash
docker-compose down -v
```

### Configuration

All configuration is in `docker-compose.yml`:

```yaml
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_USERNAME: root           # Change this
      MONGO_INITDB_ROOT_PASSWORD: password       # Change this
    volumes:
      - mongo_data:/data/db                      # Persistent storage

  backend:
    environment:
      NODE_ENV: production
      PORT: 3001
      MONGO_URI: mongodb://root:password@mongodb:27017/coffee_shop?authSource=admin
      JWT_SECRET: super-secret-jwt-key-change-in-production  # Change this!
      CORS_ORIGIN: http://localhost:3000
      LOG_LEVEL: info

  frontend:
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
```

**To change configuration:**

1. Edit `docker-compose.yml`
2. Rebuild and restart:
   ```bash
   docker-compose up --build
   ```

### Production Best Practices

1. **Change JWT Secret**
   ```yaml
   JWT_SECRET: your-very-secure-random-string-at-least-32-chars
   ```

2. **Change MongoDB Credentials**
   ```yaml
   MONGO_INITDB_ROOT_USERNAME: secure_username
   MONGO_INITDB_ROOT_PASSWORD: secure_password
   ```

3. **Set appropriate CORS origin**
   ```yaml
   CORS_ORIGIN: https://yourdomain.com
   ```

4. **Use environment variables from file**
   Create `.env.prod`:
   ```env
   JWT_SECRET=your-secret
   MONGO_PASSWORD=your-password
   CORS_ORIGIN=https://yourdomain.com
   ```

   Then reference in docker-compose.yml:
   ```yaml
   backend:
     environment:
      JWT_SECRET: ${JWT_SECRET}
   ```

5. **Enable HTTPS**
   - Use a reverse proxy (nginx, Traefik)
   - Install SSL certificates (Let's Encrypt)
   - Forward port 443 to backend/frontend

6. **Backup MongoDB data**
   ```bash
   # Backup
   docker exec coffee_shop_mongodb mongodump \
     -u root -p password --authenticationDatabase admin \
     --out /backup

   # Restore
   docker exec coffee_shop_mongodb mongorestore \
     -u root -p password --authenticationDatabase admin \
     /backup
   ```

### Monitoring

**Check service health:**
```bash
# MongoDB health check
docker exec coffee_shop_mongodb mongosh -u root -p password \
  --authenticationDatabase admin --eval "db.adminCommand('ping')"

# Backend health check
curl http://localhost:3001/health

# View Docker resource usage
docker stats
```

### Troubleshooting

**MongoDB won't start:**
```bash
docker-compose logs mongodb
# Check permissions on volume, ensure Docker daemon is running
```

**Backend won't connect to MongoDB:**
```bash
docker-compose logs backend
# Verify MONGO_URI in docker-compose.yml
# Ensure mongodb is healthy first: docker-compose ps
```

**Frontend won't load:**
```bash
docker-compose logs frontend
# Check NEXT_PUBLIC_API_URL environment variable
# Ensure backend is running on port 3001
```

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Or kill the process using the port
lsof -i :3000   # Find process using port 3000
kill -9 <PID>   # Kill the process
```

### Cleanup

**Remove all containers and volumes:**
```bash
docker-compose down -v
```

**Remove all images:**
```bash
docker-compose down --rmi all
```

**Full cleanup (⚠️ removes everything):**
```bash
docker-compose down -v --rmi all
docker volume prune -f
docker image prune -f
```

### Performance Tips

1. **Multi-stage Docker builds** - Already implemented, reduces image size
2. **MongoDB indexes** - Auto-created on startup
3. **Connection pooling** - Configured (min: 10, max: 100)
4. **Response caching** - Can be added with Redis
5. **Load balancing** - Use Docker Swarm or Kubernetes for production

---

**For local development**, see [README.md](./README.md) for instructions on using `docker-compose.dev.yml`.
