# Coffee Shop Management Application - Architecture Design Document

**Project**: Coffee Shop Management System
**Tech Stack**: Node.js (Backend), Next.js (Frontend), MongoDB (Database)
**Last Updated**: January 26, 2026
**Status**: Approved for Implementation

---

## TABLE OF CONTENTS

1. [System Architecture Overview](#1-system-architecture-overview)
2. [MongoDB Data Model](#2-mongodb-data-model)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Authentication & Security](#5-authentication--security)
6. [API Design Patterns](#6-api-design-patterns)
7. [Database Optimization](#7-database-optimization)
8. [Report Aggregations](#8-report-aggregations)
9. [Docker & Deployment](#9-docker--deployment)
10. [Performance Targets](#10-performance-targets)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Next.js Frontend)           │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐ │
│ │  Dashboard  │ │  Menu Mgmt   │ │  Customer    │ │ Orders │ │
│ └─────────────┘ └──────────────┘ │  Management  │ └────────┘ │
│                                    │              │            │
│ ┌─────────────────────────────────┴──────────────┴───────────┐ │
│ │         Reports & Analytics UI (Charts, Tables)            │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │  API Client Layer (Fetch + Error Handling + Auth Headers)   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (JWT Token)
┌─────────────────────────────────────────────────────────────┐
│                  API GATEWAY / MIDDLEWARE LAYER              │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ • JWT Authentication & Authorization Middleware          │ │
│ │ • CORS & Security Headers (Helmet)                       │ │
│ │ • Request Validation & Sanitization                      │ │
│ │ • Rate Limiting & Logging                                │ │
│ │ • Error Handling & Response Envelope Standardization     │ │
│ └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (Validated Request)
┌─────────────────────────────────────────────────────────────┐
│              BACKEND APPLICATION LAYER (Node.js)             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐   │
│ │ CONTROLLERS     │  │  SERVICES    │  │ REPOSITORIES  │   │
│ │                 │  │              │  │               │   │
│ │ • Menu          │  │ • MenuSvc    │  │ • MenuRepo    │   │
│ │ • Customer      │  │ • CustomerSvc│  │ • CustomerRepo│   │
│ │ • Order         │  │ • OrderSvc   │  │ • OrderRepo   │   │
│ │ • Report        │  │ • ReportSvc  │  │ • ReportRepo  │   │
│ │ • Auth          │  │ • AuthSvc    │  │ • AuthRepo    │   │
│ │ • Health        │  │              │  │               │   │
│ └─────────────────┘  └──────────────┘  └───────────────┘   │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ UTILITIES & HELPERS                                     │ │
│ │ • Validation (Zod schemas)                              │ │
│ │ • Error Classes & Handlers                              │ │
│ │ • JWT Token Generation & Verification                   │ │
│ │ • Aggregation Pipeline Builders                         │ │
│ │ • Logger & Observability                                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ (Queries & Aggregations)
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER (MongoDB)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌──────────────┐  ┌──────────────┐  ┌───────────────┐       │
│ │ menu_items   │  │  customers   │  │    orders     │       │
│ │ collection   │  │ collection   │  │  collection   │       │
│ └──────────────┘  └──────────────┘  └───────────────┘       │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Indexes (Performance Layer)                             │ │
│ │ • Text indexes for search                               │ │
│ │ • Compound indexes for filters                          │ │
│ │ • TTL indexes (if applicable)                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Aggregation Pipelines (Reports Layer)                   │ │
│ │ • $match, $group, $lookup, $sort, $limit               │ │
│ │ • Date bucketing for sales summary                      │ │
│ │ • Multi-stage transformations                           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Layers Explanation

| Layer | Purpose | Key Components |
|-------|---------|----------------|
| **Presentation** | User interface | Pages, Components, Forms |
| **API Gateway** | Cross-cutting concerns | Auth, CORS, Logging, Error Handling |
| **Application** | Business logic | Controllers, Services, Repositories |
| **Data Access** | Database operations | MongoDB Collections, Indexes |

---

## 2. MONGODB DATA MODEL

### Collection: `menu_items`

**Purpose**: Store coffee shop menu items with pricing and availability.

**Schema**:
```javascript
{
  _id: ObjectId,                    // Unique identifier
  name: String (required),           // Item name (e.g., "Espresso")
  category: String (required),       // enum: [Coffee, Tea, Snacks, Desserts]
  description: String (optional),    // Item description
  price: Number (required, >= 0),    // Price in currency units
  isAvailable: Boolean (default: true), // Availability status
  tags: [String] (optional),         // e.g., ["bestseller", "seasonal"]
  createdAt: ISODate,               // Server-generated timestamp
  updatedAt: ISODate                // Last modification timestamp
}
```

**Indexes**:
```javascript
// Text search on name and description
db.menu_items.createIndex({ name: "text", description: "text" });

// Compound index for filtering
db.menu_items.createIndex({ category: 1, isAvailable: 1 });

// Price range queries
db.menu_items.createIndex({ price: 1, isAvailable: 1 });

// Sorting by creation date
db.menu_items.createIndex({ createdAt: -1 });
```

---

### Collection: `customers`

**Purpose**: Store customer contact information and metadata.

**Schema**:
```javascript
{
  _id: ObjectId,                    // Unique identifier
  fullName: String (required),       // Customer name
  phone: String (required, unique),  // Phone number (unique constraint)
  email: String (optional, unique),  // Email address (unique if provided)
  notes: String (optional),          // Internal notes
  createdAt: ISODate,               // Server-generated timestamp
  updatedAt: ISODate                // Last modification timestamp
}
```

**Indexes**:
```javascript
// Unique index on phone for fast lookup
db.customers.createIndex({ phone: 1 }, { unique: true });

// Text search on full name
db.customers.createIndex({ fullName: "text" });

// Unique email index (sparse for optional field)
db.customers.createIndex({ email: 1 }, { unique: true, sparse: true });

// Sorting by creation date
db.customers.createIndex({ createdAt: -1 });
```

---

### Collection: `orders`

**Purpose**: Store order transactions with item snapshots and customer references.

**Schema**:
```javascript
{
  _id: ObjectId,                    // Unique identifier
  customerId: ObjectId (required),   // Reference to customer
  orderDate: ISODate,               // Server-set order timestamp
  status: String (enum: ["Created", "Paid"], default: "Created"),

  items: [
    {
      menuItemId: ObjectId,         // Reference to menu item
      itemNameSnapshot: String,     // Item name at order time (immutable)
      unitPriceSnapshot: Number,    // Item price at order time (immutable)
      quantity: Number (>= 1),      // Quantity ordered
      lineTotal: Number             // quantity * unitPriceSnapshot (calculated)
    }
  ],

  subTotal: Number,                 // Sum of all line totals
  discount: Number (optional, default: 0),  // Discount amount
  tax: Number (optional, default: 0),       // Tax amount
  grandTotal: Number,               // subTotal - discount + tax (calculated)
  paymentMode: String (optional),   // enum: [Cash, UPI, Card]

  createdAt: ISODate,               // Order creation timestamp
  updatedAt: ISODate                // Last update timestamp
}
```

**Indexes**:
```javascript
// Fast order date lookups (reverse chronological)
db.orders.createIndex({ orderDate: -1 });

// Customer order history lookup
db.orders.createIndex({ customerId: 1, orderDate: -1 });

// Status-based queries
db.orders.createIndex({ status: 1, orderDate: -1 });

// Customer spending calculations
db.orders.createIndex({ customerId: 1, status: 1 });
```

### Why Snapshots in Orders?

Order items store `itemNameSnapshot` and `unitPriceSnapshot` to maintain historical accuracy. If menu prices change later, existing orders show the price customers actually paid.

---

## 3. BACKEND ARCHITECTURE

### Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── menu.controller.ts          # Menu CRUD endpoint handlers
│   │   ├── customer.controller.ts      # Customer CRUD handlers
│   │   ├── order.controller.ts         # Order CRUD handlers
│   │   ├── report.controller.ts        # Report endpoint handlers
│   │   ├── auth.controller.ts          # Authentication handlers
│   │   └── health.controller.ts        # Health check handler
│   │
│   ├── services/
│   │   ├── menu.service.ts             # Menu business logic
│   │   ├── customer.service.ts         # Customer business logic
│   │   ├── order.service.ts            # Order business logic
│   │   ├── report.service.ts           # Report calculations
│   │   └── auth.service.ts             # Authentication logic
│   │
│   ├── repositories/
│   │   ├── base.repository.ts          # Base CRUD operations
│   │   ├── menu.repository.ts          # Menu data access
│   │   ├── customer.repository.ts      # Customer data access
│   │   └── order.repository.ts         # Order data access & aggregations
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts          # JWT verification
│   │   ├── errorHandler.middleware.ts  # Global error handling
│   │   ├── validation.middleware.ts    # Request validation
│   │   ├── logging.middleware.ts       # Request/response logging
│   │   └── cors.middleware.ts          # CORS configuration
│   │
│   ├── routes/
│   │   ├── index.ts                    # Route registration
│   │   ├── menu.routes.ts              # Menu endpoints
│   │   ├── customer.routes.ts          # Customer endpoints
│   │   ├── order.routes.ts             # Order endpoints
│   │   ├── report.routes.ts            # Report endpoints
│   │   ├── auth.routes.ts              # Auth endpoints
│   │   └── health.routes.ts            # Health check
│   │
│   ├── schemas/
│   │   ├── menu.schema.ts              # Zod validation schemas
│   │   ├── customer.schema.ts          # Customer validation schemas
│   │   ├── order.schema.ts             # Order validation schemas
│   │   └── common.schema.ts            # Shared validation schemas
│   │
│   ├── models/
│   │   ├── menu.model.ts               # Menu MongoDB model
│   │   ├── customer.model.ts           # Customer MongoDB model
│   │   └── order.model.ts              # Order MongoDB model
│   │
│   ├── types/
│   │   ├── index.ts                    # Type exports
│   │   ├── entities.types.ts           # Entity type definitions
│   │   ├── api.types.ts                # API request/response types
│   │   └── errors.types.ts             # Error type definitions
│   │
│   ├── utils/
│   │   ├── jwt.util.ts                 # JWT token operations
│   │   ├── response.util.ts            # Response envelope builder
│   │   ├── error.util.ts               # Error handling utilities
│   │   ├── logger.util.ts              # Logging utilities
│   │   └── aggregation.util.ts         # Aggregation helpers
│   │
│   ├── config/
│   │   ├── database.ts                 # MongoDB connection setup
│   │   ├── environment.ts              # Environment variables
│   │   └── constants.ts                # Application constants
│   │
│   └── app.ts                          # Express app initialization
│
├── index.ts                            # Entry point
├── package.json
├── tsconfig.json
└── .env.example                        # Environment template
```

### Design Patterns

#### Controller Responsibility
- Parse HTTP request (params, query, body)
- Delegate to service layer
- Catch errors and pass to error handler
- Return standardized API response

**Example**:
```typescript
export const createMenuItem = async (req, res, next) => {
  try {
    const body = createMenuItemSchema.parse(req.body);
    const menuItem = await menuService.create(body);
    res.status(201).json(success(menuItem));
  } catch (error) {
    next(error);
  }
};
```

#### Service Responsibility
- Implement business logic
- Validate domain rules
- Coordinate repositories
- No HTTP concerns, pure logic

**Example**:
```typescript
export const createMenuItem = async (data) => {
  // Validate business rules
  if (data.price < 0) throw new ValidationError("Price must be positive");

  // Delegate to repository
  const menuItem = await menuRepository.create(data);
  return menuItem;
};
```

#### Repository Responsibility
- Abstract MongoDB operations
- Build queries and aggregations
- No business logic
- Return raw data only

**Example**:
```typescript
export const create = async (data) => {
  const result = await MenuModel.insertOne(data);
  return { _id: result.insertedId, ...data };
};

export const findByIdWithAvailability = async (id) => {
  return MenuModel.findOne({ _id: id, isAvailable: true });
};
```

---

## 4. FRONTEND ARCHITECTURE

### Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with navigation
│   │   ├── page.tsx                  # Dashboard page
│   │   ├── menu/
│   │   │   ├── page.tsx              # Menu list page
│   │   │   └── [id]/page.tsx         # Menu detail/edit page
│   │   ├── customers/
│   │   │   ├── page.tsx              # Customer list page
│   │   │   └── [id]/page.tsx         # Customer detail page
│   │   ├── orders/
│   │   │   ├── page.tsx              # Orders list page
│   │   │   ├── create/page.tsx       # Create order page
│   │   │   └── [id]/page.tsx         # Order detail page
│   │   └── reports/
│   │       └── page.tsx              # Reports & analytics page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── Sidebar.tsx           # Left sidebar navigation
│   │   │   └── Footer.tsx            # Footer
│   │   │
│   │   ├── menu/
│   │   │   ├── MenuTable.tsx         # Menu items table
│   │   │   ├── MenuForm.tsx          # Menu item form
│   │   │   └── MenuDialog.tsx        # Add/Edit menu dialog
│   │   │
│   │   ├── customer/
│   │   │   ├── CustomerTable.tsx     # Customers table
│   │   │   ├── CustomerForm.tsx      # Customer form
│   │   │   └── CustomerDialog.tsx    # Add/Edit customer dialog
│   │   │
│   │   ├── order/
│   │   │   ├── OrderTable.tsx        # Orders table
│   │   │   ├── OrderForm.tsx         # Order creation form
│   │   │   └── OrderSummary.tsx      # Order summary display
│   │   │
│   │   ├── report/
│   │   │   ├── TopSellingItems.tsx   # Top items report
│   │   │   ├── MostRegularCustomer.tsx # Customer metrics
│   │   │   └── SalesSummary.tsx      # Sales summary
│   │   │
│   │   └── common/
│   │       ├── DataTable.tsx         # Reusable table
│   │       ├── DateRangePicker.tsx   # Date filter
│   │       ├── SearchInput.tsx       # Search component
│   │       └── ConfirmDialog.tsx     # Delete confirmation
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # Fetch wrapper with auth
│   │   │   ├── menu.ts               # Menu API calls
│   │   │   ├── customer.ts           # Customer API calls
│   │   │   ├── order.ts              # Order API calls
│   │   │   └── report.ts             # Report API calls
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Auth context hook
│   │   │   ├── useMenu.ts            # Menu data hook
│   │   │   ├── useCustomer.ts        # Customer data hook
│   │   │   ├── useOrder.ts           # Order data hook
│   │   │   └── useToast.ts           # Toast notifications
│   │   │
│   │   ├── schemas/
│   │   │   ├── menu.schema.ts        # Menu form validation
│   │   │   ├── customer.schema.ts    # Customer form validation
│   │   │   └── order.schema.ts       # Order form validation
│   │   │
│   │   ├── utils/
│   │   │   ├── format.ts             # Date/currency formatting
│   │   │   ├── validation.ts         # Validation helpers
│   │   │   └── constants.ts          # Frontend constants
│   │   │
│   │   └── types/
│   │       └── index.ts              # TypeScript types
│   │
│   └── styles/
│       └── globals.css               # Global styles
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local.example
```

### Component Architecture

**Page Components** (Server Components):
- Data fetching at page level
- Layout rendering
- Server-side rendering for SEO

**Form Components** (Client Components):
- Client-side Zod validation
- Form state management
- Submit handlers

**Table Components** (Client Components):
- shadcn/ui Table with sorting/filtering
- Pagination controls
- Action buttons (edit, delete)

**Dialog Components** (Client Components):
- Modal for CRUD operations
- Form integration
- Success/error handling

### State Management Strategy

**Global State**:
- Auth context: `useAuth()` → user, token, logout
- Optional: React Query for server state caching

**Component State**:
- Form validation: Zod + React Hook Form
- UI state: useState for dialogs, filters
- Loading states: useTransition or manual state

---

## 5. AUTHENTICATION & SECURITY

### JWT Authentication Flow

```
1. LOGIN REQUEST
   └─> POST /api/auth/login
       ├─ Email/Phone + Password
       └─ Response: { token, user }

2. TOKEN STORAGE
   └─> Frontend stores in:
       ├─ Option A: httpOnly cookie (recommended)
       └─ Option B: localStorage

3. API REQUEST WITH TOKEN
   └─> Authorization: Bearer <jwt-token>
       ├─ Headers: { Authorization: "Bearer eyJ..." }
       └─ Request reaches middleware

4. JWT VERIFICATION (Middleware)
   └─> Verify signature with secret key
       ├─ Valid: Extract claims, inject user context
       └─ Invalid: Return 401 Unauthorized

5. REQUEST PROCESSING
   └─> Controller has access to req.user
       ├─ Proceed with authenticated operation
       └─ Return response

6. LOGOUT
   └─> POST /api/auth/logout
       └─> Frontend clears token from storage
```

### JWT Token Structure

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "admin@coffeeshop.com",
  "role": "admin",
  "iat": 1706275200,
  "exp": 1706361600
}
```

**Signature**: HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)

### Security Middleware Stack

```
Request
  ↓
[CORS Middleware] → Check origin
  ↓
[Security Headers] → Helmet (CSP, HSTS, etc.)
  ↓
[Body Parser] → JSON parsing with size limits
  ↓
[JWT Middleware] → Token verification
  ↓
[Request Logging] → Log authenticated user
  ↓
[Request Validation] → Zod schema validation
  ↓
[Authorization] → Role/permission checks (if needed)
  ↓
[Controller/Route Handler]
  ↓
[Error Handler Middleware] → Catch & standardize errors
  ↓
Response
```

### Validation Strategy with Zod

**Schema Example** (Menu Item):
```typescript
export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['Coffee', 'Tea', 'Snacks', 'Desserts']),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  isAvailable: z.boolean().default(true),
  tags: z.array(z.string()).optional()
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
```

**Application in Controller**:
```typescript
const body = createMenuItemSchema.parse(req.body);
// If validation fails, ZodError is thrown
// Caught by error middleware
```

### Error Handling Classes

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

class ValidationError extends AppError {
  constructor(details: Record<string, any>) {
    super(400, "VALIDATION_ERROR", "Invalid request parameters", details);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, "NOT_FOUND", `${resource} with ID ${id} not found`);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, "UNAUTHORIZED", message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, "FORBIDDEN", message);
  }
}
```

---

## 6. API DESIGN PATTERNS

### Standard Response Envelope

**TypeScript Interface**:
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    timestamp: string;
  };
}
```

### Success Response Examples

**Single Resource (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Espresso",
    "category": "Coffee",
    "price": 3.50,
    "isAvailable": true,
    "createdAt": "2026-01-26T10:30:00Z",
    "updatedAt": "2026-01-26T10:30:00Z"
  },
  "meta": {
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

**List with Pagination (200 OK)**:
```json
{
  "success": true,
  "data": [
    { "_id": "507f1f77bcf86cd799439011", "name": "Espresso", ... },
    { "_id": "507f1f77bcf86cd799439012", "name": "Americano", ... }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    },
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

**Create Resource (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Cappuccino",
    "category": "Coffee",
    ...
  },
  "meta": {
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

**Delete Resource (204 No Content)**:
```
Status: 204
Body: (empty)
```

### Error Response Examples

**Validation Error (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "price": ["Price must be a positive number"],
      "name": ["Name is required"]
    }
  },
  "meta": {
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

**Authentication Error (401 Unauthorized)**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  },
  "meta": {
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

**Resource Not Found (404 Not Found)**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Menu item with ID 507f1f77bcf86cd799439011 not found"
  },
  "meta": {
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

**Server Error (500 Internal Server Error)**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  },
  "meta": {
    "timestamp": "2026-01-26T10:30:00Z"
  }
}
```

### HTTP Status Code Mapping

| Status | Scenario | Response |
|--------|----------|----------|
| `200` | GET successful | Resource data |
| `201` | POST successful | Created resource with ID |
| `204` | DELETE successful | No content |
| `400` | Validation failed | Error details with field names |
| `401` | Missing/invalid JWT | Unauthorized error |
| `403` | Insufficient permissions | Forbidden error |
| `404` | Resource not found | Not found error |
| `409` | Resource conflict (duplicate) | Conflict error |
| `500` | Unexpected server error | Generic error message (no details) |

### Pagination Pattern

**Query Parameters**:
```
GET /api/menu-items?page=1&limit=10&search=coffee&category=Coffee&isAvailable=true
```

**Calculation**:
```typescript
const skip = (page - 1) * limit;
const limit = Math.min(limit, 100); // Max 100 items per page

const items = await MenuModel.find(filters)
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

const total = await MenuModel.countDocuments(filters);
const pages = Math.ceil(total / limit);
```

**Response Meta**:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

---

## 7. DATABASE OPTIMIZATION

### Index Strategy

**Index Types**:

1. **Text Index**: For full-text search
   ```javascript
   db.menu_items.createIndex({ name: "text", description: "text" })
   // Query: db.menu_items.find({ $text: { $search: "espresso" } })
   ```

2. **Single Field Index**: For equality and sorting
   ```javascript
   db.orders.createIndex({ orderDate: -1 })
   // Query: db.orders.find().sort({ orderDate: -1 })
   ```

3. **Compound Index**: For multi-field filters
   ```javascript
   db.menu_items.createIndex({ category: 1, isAvailable: 1 })
   // Query: db.menu_items.find({ category: "Coffee", isAvailable: true })
   ```

4. **Unique Index**: For enforcing uniqueness
   ```javascript
   db.customers.createIndex({ phone: 1 }, { unique: true })
   // Prevents duplicate phone numbers
   ```

5. **Sparse Index**: For optional fields
   ```javascript
   db.customers.createIndex({ email: 1 }, { unique: true, sparse: true })
   // Only indexes documents with email field
   ```

### Query Performance Targets

| Operation | Target | Strategy |
|-----------|--------|----------|
| List (with filters) | < 100ms | Compound index on filter fields |
| Get by ID | < 50ms | Primary key (automatic) |
| Search | < 150ms | Text index |
| Date range query | < 100ms | Index on orderDate |
| Report aggregation | < 500ms | Early $match with indexes |
| Complex multi-stage | < 1000ms | allowDiskUse if needed |

### Aggregation Pipeline Best Practices

**Order of Stages** (for optimal performance):
```
$match     ← First (uses indexes)
$lookup    ← After filtering (if needed)
$unwind    ← Normalize arrays
$group     ← Aggregation
$sort      ← Ordering
$skip      ← Pagination skip
$limit     ← Pagination limit
$project   ← Field selection
```

**Example - Optimized Pipeline**:
```javascript
db.orders.aggregate([
  // Stage 1: Match first (index usage)
  {
    $match: {
      status: "Paid",
      orderDate: { $gte: startDate, $lte: endDate }
    }
  },

  // Stage 2: Unwind items
  { $unwind: "$items" },

  // Stage 3: Group for aggregation
  {
    $group: {
      _id: "$items.menuItemId",
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { $sum: "$items.lineTotal" }
    }
  },

  // Stage 4: Sort
  { $sort: { totalQuantity: -1 } },

  // Stage 5: Limit
  { $limit: 10 }
]);
```

### Connection Pooling

**MongoDB Driver Configuration**:
```typescript
const client = new MongoClient(MONGO_URI, {
  maxPoolSize: 100,          // Max connections in pool
  minPoolSize: 10,           // Min connections to maintain
  maxIdleTimeMS: 45000,      // Close idle connections after 45s
  serverSelectionTimeoutMS: 5000
});
```

**Reuse Client**:
```typescript
// Create once at startup
export const mongoClient = new MongoClient(MONGO_URI);
export const db = mongoClient.db('coffee_shop');

// Reuse throughout application
export const menuCollection = db.collection('menu_items');
```

---

## 8. REPORT AGGREGATIONS

### Report 1: Top Selling Items

**Endpoint**: `GET /api/reports/top-selling-items?from=&to=&limit=10`

**Aggregation Pipeline**:
```javascript
db.orders.aggregate([
  {
    $match: {
      status: "Paid",
      orderDate: {
        $gte: ISODate(fromDate),
        $lte: ISODate(toDate)
      }
    }
  },
  { $unwind: "$items" },
  {
    $group: {
      _id: {
        menuItemId: "$items.menuItemId",
        name: "$items.itemNameSnapshot"
      },
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { $sum: "$items.lineTotal" }
    }
  },
  { $sort: { totalQuantity: -1 } },
  { $limit: 10 },
  {
    $project: {
      _id: 0,
      menuItemId: "$_id.menuItemId",
      itemName: "$_id.name",
      totalQuantity: 1,
      totalRevenue: 1
    }
  }
])
```

### Report 2: Most Sold Coffee

**Endpoint**: `GET /api/reports/most-sold-coffee?from=&to=`

**Note**: Requires menu category info. Use $lookup to filter by Coffee category:

```javascript
db.orders.aggregate([
  {
    $match: {
      status: "Paid",
      orderDate: { $gte: ISODate(fromDate), $lte: ISODate(toDate) }
    }
  },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu_items",
      localField: "items.menuItemId",
      foreignField: "_id",
      as: "menuInfo"
    }
  },
  { $match: { "menuInfo.category": "Coffee" } },
  {
    $group: {
      _id: "$items.menuItemId",
      itemName: { $first: "$items.itemNameSnapshot" },
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { $sum: "$items.lineTotal" }
    }
  },
  { $sort: { totalQuantity: -1 } },
  { $limit: 1 }
])
```

### Report 3: Most Regular Customer

**By Order Count**:
```javascript
db.orders.aggregate([
  {
    $match: {
      status: "Paid",
      orderDate: { $gte: ISODate(fromDate), $lte: ISODate(toDate) }
    }
  },
  {
    $group: {
      _id: "$customerId",
      orderCount: { $sum: 1 },
      totalSpend: { $sum: "$grandTotal" }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customerInfo"
    }
  },
  { $sort: { orderCount: -1 } },
  { $limit: 1 },
  {
    $project: {
      _id: 0,
      customerId: "$_id",
      customerName: { $arrayElemAt: ["$customerInfo.fullName", 0] },
      customerPhone: { $arrayElemAt: ["$customerInfo.phone", 0] },
      orderCount: 1,
      totalSpend: 1
    }
  }
])
```

**By Total Spend**:
```javascript
// Same as above but change sort:
// { $sort: { totalSpend: -1 } }
```

### Report 4: Sales Summary

**By Day**:
```javascript
db.orders.aggregate([
  {
    $match: {
      status: "Paid",
      orderDate: { $gte: ISODate(fromDate), $lte: ISODate(toDate) }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$orderDate",
          timezone: "UTC"
        }
      },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$grandTotal" },
      avgOrderValue: { $avg: "$grandTotal" }
    }
  },
  { $sort: { _id: 1 } }
])
```

**By Week**:
```javascript
db.orders.aggregate([
  {
    $match: {
      status: "Paid",
      orderDate: { $gte: ISODate(fromDate), $lte: ISODate(toDate) }
    }
  },
  {
    $group: {
      _id: {
        $week: "$orderDate"  // or use $dateToString with week format
      },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$grandTotal" }
    }
  },
  { $sort: { _id: 1 } }
])
```

---

## 9. DOCKER & DEPLOYMENT

### Docker Strategy

#### Dockerfile - Backend (Node.js)

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build if needed (TypeScript compilation)
RUN npm run build


# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
```

#### Dockerfile - Frontend (Next.js)

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build Next.js
RUN npm run build


# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built Next.js from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Docker Compose (Local Development)

```yaml
version: '3.9'

services:
  # MongoDB Database
  mongodb:
    image: mongo:6.0-alpine
    container_name: coffee_shop_db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: coffee_shop
    volumes:
      - mongo_data:/data/db
    networks:
      - coffee-app
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: coffee_shop_api
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      MONGO_URI: mongodb://root:password@mongodb:27017/coffee_shop?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key-change-in-production
      JWT_EXPIRATION: 24h
      LOG_LEVEL: debug
      CORS_ORIGIN: http://localhost:3000
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - coffee-app
    restart: unless-stopped

  # Frontend Application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: coffee_shop_web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NODE_ENV: development
    depends_on:
      - backend
    networks:
      - coffee-app
    restart: unless-stopped

volumes:
  mongo_data:
    driver: local

networks:
  coffee-app:
    driver: bridge
```

### Environment Variables

**Backend (.env)**:
```
NODE_ENV=development
PORT=3001

# Database
MONGO_URI=mongodb://root:password@localhost:27017/coffee_shop?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 10. PERFORMANCE TARGETS

### API Response Times (p95)

| Endpoint Type | Target | Strategy |
|---------------|--------|----------|
| Single resource GET | < 50ms | Primary key lookup, no aggregation |
| List with filters | < 100ms | Compound index on filter fields |
| Create/Update | < 100ms | Validation + insert/update |
| Delete | < 50ms | Single document delete |
| Search (text) | < 150ms | Text index + $text operator |
| Report aggregation | < 500ms | Early $match, indexed fields, allowDiskUse |
| Complex multi-stage | < 1000ms | Optimized pipeline, pagination |

### Page Load Times

| Metric | Target | Optimization |
|--------|--------|--------------|
| First Contentful Paint (FCP) | < 1.5s | Code splitting, image optimization |
| Largest Contentful Paint (LCP) | < 2.5s | Lazy load components, optimize images |
| Cumulative Layout Shift (CLS) | < 0.1 | Fixed dimensions, preload fonts |
| Time to Interactive (TTI) | < 3.0s | Defer non-critical JS, minimize bundle |

### Scalability Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Concurrent Users | 100 | Initial MVP target |
| Database Connections | 100 | MongoDB pool size |
| Request Rate | 1,000 RPS | Across all endpoints |
| Database Connections per User | 1 | Reuse pool connections |

### Database Optimization Checklist

- ✓ Indexes on all filter fields
- ✓ Text indexes for search
- ✓ Compound indexes for multi-field queries
- ✓ Early $match in aggregation pipelines
- ✓ Query result projection (only needed fields)
- ✓ Pagination limits (max 100 items)
- ✓ Connection pooling enabled
- ✓ allowDiskUse for large aggregations

---

## DEPLOYMENT CHECKLIST

Before moving to production:

- [ ] Environment variables configured securely
- [ ] JWT secret rotated and stored in secure vault
- [ ] MongoDB authentication enabled
- [ ] HTTPS/TLS enabled
- [ ] CORS whitelist configured for frontend domain
- [ ] Database backups configured
- [ ] Logging and monitoring setup
- [ ] Error tracking (Sentry/DataDog) configured
- [ ] Rate limiting enabled on API
- [ ] Security headers configured (Helmet)
- [ ] Database indexes created
- [ ] Load testing completed
- [ ] Documentation up to date

---

## TECHNOLOGY DECISIONS SUMMARY

| Decision | Why | Trade-offs |
|----------|-----|-----------|
| **JWT Auth** | Stateless, scalable, no session store | Token size, refresh complexity |
| **MongoDB** | Document model for order snapshots, flexible | Transactions for multi-doc writes |
| **Aggregation Pipelines** | Complex reports in DB, efficient | Learning curve, harder to debug |
| **Controller-Service-Repository** | Clean separation, testable | Extra layers, more files |
| **Zod Validation** | Type-safe, runtime validation | Performance overhead (negligible) |
| **shadcn/ui** | Accessible, Tailwind-based, ecosystem | Limited customization vs custom UI |
| **Next.js App Router** | Modern, server components, built-in API | Opinionated, different from Pages Router |
| **Docker Compose** | Local parity, easy onboarding | Extra complexity for simple apps |

---

## CRITICAL IMPLEMENTATION FILES

**Priority 1** (Core Infrastructure):
1. `/backend/src/config/database.ts` - MongoDB connection with pooling
2. `/backend/src/types/entities.types.ts` - Entity type definitions
3. `/backend/src/utils/response.util.ts` - Response envelope builder
4. `/backend/src/middleware/auth.middleware.ts` - JWT verification

**Priority 2** (Base Patterns):
5. `/backend/src/repositories/base.repository.ts` - Base CRUD operations
6. `/backend/src/schemas/common.schema.ts` - Shared validation schemas
7. `/backend/src/utils/error.util.ts` - Error handling utilities

**Priority 3** (Feature Implementation):
8. Menu module (controller, service, repository, routes)
9. Customer module (controller, service, repository, routes)
10. Frontend components and pages

---

**Document Version**: 1.0
**Last Updated**: January 26, 2026
**Status**: Approved & Ready for Implementation
