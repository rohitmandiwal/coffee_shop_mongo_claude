# Coffee Shop Management System - Milestone 1

A full-stack application for managing coffee shop menu items and customers.

## Tech Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Database**: MongoDB 6.0
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Forms**: React Hook Form
- **Deployment**: Docker + Docker Compose

## Features (Milestone 1)

### Menu Management
- ✅ Create, read, update, delete menu items
- ✅ Categories: Coffee, Tea, Pastry, Sandwich, Dessert, Beverage
- ✅ Search functionality
- ✅ Toggle availability status (click badge)
- ✅ Price management
- ✅ Pagination support

### Customer Management
- ✅ Create, read, update, delete customers
- ✅ Unique phone numbers
- ✅ Email validation (optional)
- ✅ Search by name/phone
- ✅ Notes field for additional info
- ✅ Pagination support

### Technical Features
- ✅ API response envelope with metadata
- ✅ Global error handling
- ✅ Request logging
- ✅ MongoDB indexes for performance
- ✅ CORS configuration
- ✅ Health check endpoint
- ✅ Docker containerization

## Project Structure

```
.
├── backend/                           # Express.js backend
│   ├── src/
│   │   ├── config/                   # Database, environment config
│   │   ├── controllers/              # HTTP request handlers
│   │   ├── services/                 # Business logic layer
│   │   ├── repositories/             # Data access layer
│   │   ├── schemas/                  # Zod validation schemas
│   │   ├── models/                   # MongoDB collection accessors
│   │   ├── middleware/               # Express middleware
│   │   ├── types/                    # TypeScript types
│   │   ├── utils/                    # Utility functions
│   │   ├── routes/                   # API routes
│   │   ├── app.ts                    # Express app setup
│   │   └── index.ts                  # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                          # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── menu/page.tsx             # Menu management
│   │   ├── customers/page.tsx        # Customer management
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   ├── menu/MenuDialog.tsx       # Menu form dialog
│   │   └── customer/CustomerDialog.tsx # Customer form dialog
│   ├── lib/
│   │   ├── api/                      # API client and endpoints
│   │   ├── schemas/                  # Zod form schemas
│   │   └── utils/                    # Utility functions
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                 # Multi-container setup
└── README.md
```

## Quick Start

### Prerequisites
- **Docker & Docker Compose** (for any deployment)
- **Node.js 18+** (only if running backend/frontend locally without Docker)

### Option 1: Production Deployment (Recommended) 🐳

Everything in containers - MongoDB, Backend, and Frontend. Database data is persisted automatically.

**Using the startup script:**
```bash
./start-prod.sh
```

**Or manually:**
```bash
docker-compose build
docker-compose up
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

**Database persistence:**
- Data is stored in `mongo_data` volume
- Data persists even if containers are stopped
- View volume: `docker volume inspect mongo_data`

**Stop all services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend       # Backend only
docker-compose logs -f frontend      # Frontend only
docker-compose logs -f mongodb       # MongoDB only
```

---

### Option 2: Local Development Mode 💻

Run backend/frontend locally with `npm run dev`, MongoDB in Docker.

**Using the startup script:**
```bash
./start-dev.sh
```

**Or manually:**

1. **Start MongoDB** (Terminal 1)
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```
   MongoDB runs on `localhost:27017`

2. **Start Backend** (Terminal 2)
   ```bash
   cd backend
   npm install  # First time only
   npm run dev
   ```
   Backend runs on `http://localhost:3001`

3. **Start Frontend** (Terminal 3)
   ```bash
   cd frontend
   npm install  # First time only
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

**Stop MongoDB:**
```bash
docker-compose -f docker-compose.dev.yml down
```

**Database persistence in dev mode:**
- Data is stored in `mongo_data_dev` volume
- Persists between container restarts

## API Endpoints

### Health Check
- `GET /health` - Server health status and DB connection

### Menu Items
- `POST /api/menu-items` - Create menu item
- `GET /api/menu-items` - List menu items (paginated, filterable)
- `GET /api/menu-items/:id` - Get single menu item
- `PATCH /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item
- `PATCH /api/menu-items/:id/availability` - Toggle availability

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers (paginated, searchable)
- `GET /api/customers/:id` - Get single customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

## API Response Format

All API responses follow this envelope structure:

```json
{
  "success": true,
  "data": { /* ... */ },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "timestamp": "2026-01-26T10:30:00.000Z"
}
```

## Testing the Application

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Create Menu Item
```bash
curl -X POST http://localhost:3001/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Espresso",
    "category": "Coffee",
    "description": "Strong Italian coffee",
    "price": 3.50,
    "isAvailable": true
  }'
```

### 3. List Menu Items
```bash
curl http://localhost:3001/api/menu-items
```

### 4. Create Customer
```bash
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com"
  }'
```

### 5. List Customers
```bash
curl http://localhost:3001/api/customers
```

### 6. Toggle Menu Availability
```bash
curl -X PATCH http://localhost:3001/api/menu-items/{id}/availability
```

## Configuration

### Backend Environment Variables
`.env` file in `/backend/`:
```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://root:password@localhost:27017/coffee_shop?authSource=admin
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Frontend Environment Variables
`.env.local` file in `/frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

### Menu Items Collection
```typescript
{
  _id: ObjectId
  name: string
  category: enum('Coffee', 'Tea', 'Pastry', 'Sandwich', 'Dessert', 'Beverage')
  description: string
  price: number
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}
```

**Indexes**:
- Text index on `name` and `description`
- Compound index on `category` and `isAvailable`
- Index on `price` and `isAvailable`
- Descending index on `createdAt`

### Customers Collection
```typescript
{
  _id: ObjectId
  fullName: string
  phone: string (unique)
  email?: string (unique, sparse)
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

**Indexes**:
- Unique index on `phone`
- Text index on `fullName`
- Unique sparse index on `email`
- Descending index on `createdAt`

## Validation Rules

### Menu Items
- Name: 1-100 characters (required)
- Category: Must be one of the defined enum values (required)
- Description: 1-500 characters (required)
- Price: Must be positive number (required)
- isAvailable: Boolean (optional, default: true)

### Customers
- Full Name: 1-100 characters (required)
- Phone: At least 10 characters (required)
- Email: Valid email format (optional)
- Notes: Max 500 characters (optional)

## Error Handling

The application includes:
- Global error handler middleware
- Zod validation error transformation
- Custom error classes (ValidationError, NotFoundError, ConflictError, UnauthorizedError)
- Consistent error response format
- Request logging with timing information

## Performance

- API response target: < 200ms
- Pagination: Default 10 items, max 100 items per page
- MongoDB connection pooling: min 10, max 100 connections
- Text search indexes for fast full-text search
- Compound indexes for filtered queries

## Security

- Helmet.js for HTTP header security
- CORS configuration for frontend origin
- Request body size limits
- Input validation with Zod
- Unique constraints on phone and email fields

## Build & Deploy

### Build Backend
```bash
cd backend
npm run build
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Build Docker Images
```bash
docker-compose build
```

## Docker Files Explained

### docker-compose.yml (Production)
```yaml
Services:
  ├── mongodb          # MongoDB 6.0 Alpine image
  │   ├── Persistent volume: mongo_data
  │   └── Healthcheck enabled
  ├── backend          # Node.js Express API (built from Dockerfile)
  │   ├── Depends on mongodb being healthy
  │   └── Port: 3001
  └── frontend         # Next.js App (built from Dockerfile)
      ├── Depends on backend
      └── Port: 3000

When you run: docker-compose up --build
├── Builds backend Dockerfile
├── Builds frontend Dockerfile
├── Starts MongoDB with persistent storage
├── Starts backend (waits for MongoDB to be healthy)
└── Starts frontend (waits for backend to be ready)
```

**Persistent Volume:**
- Data stored in: `mongo_data` named volume
- Location on host: `/var/lib/docker/volumes/mongo_data/_data/`
- Persists when containers stop/restart
- View all volumes: `docker volume ls`
- Inspect volume: `docker volume inspect mongo_data`
- Remove volume: `docker volume rm mongo_data` (⚠️ deletes data)

### docker-compose.dev.yml (Development)
```yaml
Services:
  └── mongodb          # MongoDB 6.0 Alpine image
      ├── Persistent volume: mongo_data_dev
      └── Healthcheck enabled

When you run: docker-compose -f docker-compose.dev.yml up
└── Only starts MongoDB in Docker
    (Backend & Frontend run locally with npm run dev)
```

---

## Troubleshooting

### MongoDB Connection Issues
1. Check MongoDB is running: `docker ps | grep mongodb`
2. Verify credentials in `.env`
3. Check MongoDB logs: `docker logs coffee_shop_mongodb`

### Backend won't start
1. Ensure Node.js 18+ is installed
2. Check port 3001 is not in use
3. Review backend logs for errors
4. Verify TypeScript build: `npm run build`

### Frontend won't connect to API
1. Ensure backend is running on port 3001
2. Check `NEXT_PUBLIC_API_URL` environment variable
3. Verify CORS configuration in backend
4. Check browser console for CORS errors

## Milestone 1 Checklist

- ✅ Backend folder structure created
- ✅ Backend dependencies installed
- ✅ Backend configuration files set up
- ✅ Core types and utilities defined
- ✅ MongoDB connection with pooling
- ✅ Global error handler middleware
- ✅ Zod validation schemas
- ✅ Menu module (repository, service, controller, routes)
- ✅ Customer module (repository, service, controller, routes)
- ✅ Health check endpoint
- ✅ Express app with middleware chain
- ✅ Backend entry point
- ✅ Frontend initialized with Next.js
- ✅ Frontend dependencies installed
- ✅ UI components created (shadcn-inspired)
- ✅ API client and hooks
- ✅ Frontend pages (home, menu, customers)
- ✅ Form dialogs with validation
- ✅ Backend Dockerfile with multi-stage build
- ✅ Frontend Dockerfile with multi-stage build
- ✅ docker-compose.yml with all services
- ✅ Environment example files
- ✅ README with setup instructions

## Next Steps (Future Milestones)

### Milestone 2: Orders & Authentication
- User authentication (login/signup)
- JWT token management
- Order creation and management
- Order item tracking
- Order status workflow

### Milestone 3: Reports & Analytics
- Sales reports
- Popular items analysis
- Customer analytics
- Inventory management
- Revenue tracking

## Support & Issues

For issues or questions:
1. Check the troubleshooting section above
2. Review API response error messages
3. Check application logs
4. Verify environment configuration

## License

This project is for educational purposes.

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0 - Milestone 1 Complete
