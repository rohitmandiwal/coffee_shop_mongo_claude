# Quick Start - Coffee Shop Management System

## TL;DR - Get Running in 30 Seconds

### Production (Everything in Docker)
```bash
./start-prod.sh
```
Then open: http://localhost:3000

### Development (MongoDB in Docker, App local)
```bash
./start-dev.sh
# Then run in separate terminals:
cd backend && npm run dev
cd frontend && npm run dev
```
Then open: http://localhost:3000

---

## What You Get

| Component | Type | Port | Status |
|-----------|------|------|--------|
| Frontend | Web App | 3000 | React + Next.js |
| Backend API | REST API | 3001 | Node.js + Express |
| MongoDB | Database | 27017 | Persistent volume |

---

## File Explanations

### For Production Deployment
```bash
# Option 1: Automatic setup (Recommended)
./start-prod.sh

# Option 2: Manual
docker-compose build
docker-compose up -d

# Option 3: Manual one-liner
docker-compose up --build -d
```

**Result:**
- MongoDB container running with persistent `mongo_data` volume
- Backend API container running
- Frontend container running
- All data persists if you stop/restart containers

### For Local Development
```bash
# Option 1: Automatic setup (Recommended)
./start-dev.sh

# Option 2: Manual - Just MongoDB in Docker
docker-compose -f docker-compose.dev.yml up -d

# Then run locally:
cd backend && npm run dev    # Terminal 2
cd frontend && npm run dev   # Terminal 3
```

**Result:**
- MongoDB container with persistent `mongo_data_dev` volume
- Backend running locally on localhost:3001
- Frontend running locally on localhost:3000
- Hot reload for development

---

## Database Persistence

### ✅ Data is Saved When
- Stopping containers: `docker-compose down`
- Restarting containers: `docker-compose restart`
- Rebuilding containers: `docker-compose up --build`

### ⚠️ Data is Lost When
```bash
docker volume rm mongo_data        # Removes production data
docker volume rm mongo_data_dev    # Removes dev data
```

### Check Your Data
```bash
# List all volumes
docker volume ls

# Enter MongoDB CLI
docker exec -it coffee_shop_mongodb mongosh -u root -p password --authenticationDatabase admin

# View databases
db.adminCommand('listDatabases')

# Switch to coffee_shop and view collections
use coffee_shop
show collections
db.menu_items.find()
db.customers.find()
```

---

## Common Commands

### View Status
```bash
docker-compose ps              # All services in production
docker-compose -f docker-compose.dev.yml ps  # MongoDB in dev mode
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services
```bash
docker-compose restart          # All services
docker-compose restart backend   # Just backend
```

### Stop Everything
```bash
docker-compose down             # Stops containers, saves data
docker-compose down -v          # ⚠️ Also removes volumes (deletes data)
```

### Clean Rebuild
```bash
docker-compose down
docker volume rm mongo_data
docker-compose build --no-cache
docker-compose up -d
```

---

## Access Points

### Once Running

| Access Point | URL | Purpose |
|---|---|---|
| Frontend | http://localhost:3000 | Coffee Shop UI |
| Backend API | http://localhost:3001/api | API endpoints |
| Health Check | http://localhost:3001/health | API health status |
| MongoDB | localhost:27017 | Direct database access |

### Testing the API
```bash
# Check health
curl http://localhost:3001/health

# Create menu item
curl -X POST http://localhost:3001/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Espresso",
    "category": "Coffee",
    "description": "Strong Italian coffee",
    "price": 3.50,
    "isAvailable": true
  }'

# List menu items
curl http://localhost:3001/api/menu-items

# Create customer
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com"
  }'

# List customers
curl http://localhost:3001/api/customers
```

---

## Docker Compose Files

### `docker-compose.yml` (Production)
- Builds backend from Dockerfile
- Builds frontend from Dockerfile
- Starts MongoDB
- All 3 services in one network
- Persistent `mongo_data` volume
- **Use for production deployment**

### `docker-compose.dev.yml` (Development)
- Only MongoDB service
- Persistent `mongo_data_dev` volume
- **Use when running backend/frontend locally**

---

## Environment Variables

### Production (in docker-compose.yml)
```yaml
MONGO_URI: mongodb://root:password@mongodb:27017/coffee_shop?authSource=admin
NODE_ENV: production
JWT_SECRET: super-secret-jwt-key-change-in-production
CORS_ORIGIN: http://localhost:3000
```

### Development (in backend/.env)
```env
MONGO_URI: mongodb://root:password@localhost:27017/coffee_shop?authSource=admin
NODE_ENV: development
JWT_SECRET: your-super-secret-jwt-key-change-in-production
CORS_ORIGIN: http://localhost:3000
```

Note: Different hostnames because development uses `localhost`, production uses Docker service name `mongodb`

---

## Troubleshooting

### Port Already in Use
```bash
# Port 3000 in use?
lsof -i :3000
kill -9 <PID>

# Port 3001 in use?
lsof -i :3001
kill -9 <PID>

# Port 27017 in use?
lsof -i :27017
kill -9 <PID>

# Or change ports in docker-compose.yml
```

### MongoDB Won't Start
```bash
docker-compose logs mongodb
# Check if port 27017 is available
# Check if docker daemon is running
# Try: docker volume rm mongo_data && docker-compose up
```

### Backend Can't Connect to MongoDB
```bash
docker-compose logs backend
# Check MONGO_URI environment variable
# Wait longer - MongoDB takes time to start
# Try: docker-compose restart backend
```

### Can't Access Frontend/Backend
```bash
# Check if containers are running
docker-compose ps

# Check if ports are exposed correctly
docker port coffee_shop_frontend
docker port coffee_shop_backend

# View logs
docker-compose logs
```

---

## Performance Tips

1. **First run is slower** (building images)
2. **Multi-stage builds** reduce image size
3. **Docker caches layers** - rebuilds are faster
4. **Named volumes** are optimized for performance
5. **MongoDB indexes** auto-created on startup

---

## Next Steps

1. **Deploy**: `./start-prod.sh`
2. **Access**: http://localhost:3000
3. **Add Data**: Use the web UI to add menu items and customers
4. **Develop**: `./start-dev.sh` + `npm run dev` in backend and frontend
5. **Deploy to Production**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Files Reference

```
/mongo_app/
├── README.md                  # Full documentation
├── QUICKSTART.md             # This file
├── DEPLOYMENT.md             # Production deployment guide
├── DOCKER_SETUP.md           # Docker detailed explanation
├── docker-compose.yml        # Production config
├── docker-compose.dev.yml    # Development config
├── start-prod.sh             # Production startup script
├── start-dev.sh              # Development startup script
├── backend/                  # Node.js API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── frontend/                 # Next.js App
    ├── Dockerfile
    ├── package.json
    └── app/
```

---

**Questions?** Check the [DOCKER_SETUP.md](./DOCKER_SETUP.md) or [README.md](./README.md) for more details.
