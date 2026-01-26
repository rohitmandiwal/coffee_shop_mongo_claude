# Coffee Shop Web Application (MongoDB) — Project Scope (MVP)

## 1) Objective
Build a full-stack web application for a small coffee shop that:
- **Manages menu items**
- **Captures guest/customer details**
- **Creates and tracks orders** linked to guests and menu items
- Provides **reports** such as:
  - **Most sold coffee / top selling items**
  - **Most regular customer** (most orders / most spending)

**MongoDB** will be the primary database.  
The solution will include **Frontend (Next.js + shadcn/ui)**, **Backend APIs**, and a **Postman collection**.

---

## 2) In-Scope (MVP Deliverables)

### 2.1 Core Modules
#### A) Menu Management
- Create / update / delete menu items
- List menu items with filters:
  - category, availability, price range, search
- Toggle item availability (Available / Unavailable)
- Item attributes:
  - Name, category (Coffee / Tea / Snacks etc.)
  - Price
  - Description
  - Active/available flag
  - Optional tags: bestseller, seasonal, etc.

#### B) Guest / Customer Management
- Create / update customer profiles
- Search customers (name, phone, email)
- Store customer attributes:
  - Full name
  - Phone (unique recommended)
  - Email (optional)
  - Notes (optional)
- Order-time convenience:
  - If customer doesn’t exist, create customer from order screen.

#### C) Order Management
- Create a new order for a customer
- Add multiple items in one order (line items)
- Order lifecycle (MVP):
  - Created → Paid
- Store:
  - Order date/time
  - Customer reference
  - Items (menuItemId + name snapshot + unit price snapshot + quantity)
  - Subtotal, discount (optional), tax (optional), grand total
  - Payment mode (Cash/UPI/Card) (optional)
- Order listing with filters:
  - date range, customer, status

#### D) Reports / Analytics
- **Top selling items** (by quantity sold)
- **Most sold coffee** (top item within Coffee category)
- **Most regular customer**
  - by number of orders
  - by total spend
- Sales summary:
  - Day/Week bucket totals (orders + revenue)

---

## 3) Frontend Scope (Next.js + shadcn/ui)

### 3.1 Frontend Tech
- **Next.js (App Router)**
- **shadcn/ui components**
  - Initialize via: `npx shadcn@latest init`
- Tailwind (comes with shadcn setup)
- Client-side data fetching:
  - Simple fetch wrappers (or React Query optionally)
- Form validation:
  - Zod recommended (fits shadcn patterns well)

### 3.2 Pages / Screens (MVP)
#### A) Dashboard
- Quick KPIs cards:
  - Today’s orders count
  - Today’s revenue
  - Top selling item (today / date range)
- Quick links to Menu / Customers / Orders / Reports

#### B) Menu
- Menu list table:
  - search + filters (category, availability)
  - actions: edit, delete, toggle availability
- Add/Edit menu item form (Dialog / Sheet)

Recommended shadcn components:
- `Table`, `Badge`, `Button`, `Dialog`/`Sheet`, `Input`, `Select`, `Textarea`, `Switch`, `Toast`

#### C) Customers
- Customer list table with search
- Customer profile page:
  - customer details
  - order history (embedded list/table)
- Add/Edit customer form (Dialog / Sheet)

#### D) Orders
- Order creation screen:
  - Select customer (search dropdown)
  - Add items to cart (quantity adjustment)
  - Auto-calculated totals
  - Submit order
- Orders list page:
  - filter by date range + status + customer
- Order details page:
  - full breakdown
  - mark as Paid

Recommended shadcn components:
- `Command` (customer search), `Popover`, `Calendar` (date filter), `Table`, `Card`, `Separator`

#### E) Reports
- Report page with date range selector:
  - Top selling items (table)
  - Most sold coffee (card)
  - Most regular customer (card/table)
  - Sales summary (table; chart optional later)

---

## 4) Out of Scope (MVP)
- Inventory stock tracking (raw materials)
- Multi-branch support
- Loyalty points / membership program
- Refunds, partial/split payments
- Complex tax rules (GST breakdown)
- External integrations (payment gateway, POS hardware, SMS/WhatsApp)
- Advanced RBAC (Admin/Cashier roles) — can be Phase 2
  - (Optional MVP add: a simple Admin login can be included if needed)

---

## 5) Data Model Scope (MongoDB Collections)

### 5.1 `menu_items`
- `_id`
- `name` (required)
- `category` (required)
- `price` (required)
- `description` (optional)
- `isAvailable` (default true)
- `tags` (optional array)
- `createdAt`, `updatedAt`

Indexes:
- Text index on `name`
- `category`, `isAvailable`

### 5.2 `customers`
- `_id`
- `fullName` (required)
- `phone` (required; unique recommended)
- `email` (optional)
- `notes` (optional)
- `createdAt`, `updatedAt`

Indexes:
- Unique index on `phone`
- Text index on `fullName`

### 5.3 `orders`
- `_id`
- `customerId`
- `orderDate`
- `status` (Created / Paid)
- `items[]`:
  - `menuItemId`
  - `itemNameSnapshot`
  - `unitPriceSnapshot`
  - `quantity`
  - `lineTotal`
- `subTotal`
- `discount` (optional)
- `tax` (optional)
- `grandTotal`
- `paymentMode` (optional)
- `createdAt`, `updatedAt`

Indexes:
- `orderDate`
- `customerId`
- `status`

Note:
- Item name/price snapshots keep historical correctness if menu prices change later.

---

## 6) API Scope (REST)

### 6.1 Menu
- `POST /api/menu-items`
- `GET /api/menu-items` (filters: search, category, isAvailable, minPrice, maxPrice, pagination)
- `GET /api/menu-items/:id`
- `PATCH /api/menu-items/:id`
- `DELETE /api/menu-items/:id`
- `PATCH /api/menu-items/:id/availability`

### 6.2 Customers
- `POST /api/customers`
- `GET /api/customers` (search + pagination)
- `GET /api/customers/:id`
- `PATCH /api/customers/:id`

### 6.3 Orders
- `POST /api/orders`
- `GET /api/orders` (filters: from/to date, customerId, status, pagination)
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### 6.4 Reports
- `GET /api/reports/top-selling-items?from=&to=&limit=`
- `GET /api/reports/most-sold-coffee?from=&to=`
- `GET /api/reports/most-regular-customer?from=&to=&by=orders|spend`
- `GET /api/reports/sales-summary?from=&to=&bucket=day|week`

---

## 7) Postman Collection (Deliverable Scope)

### 7.1 What will be included
- A Postman collection JSON containing:
  - All endpoints above grouped by folder:
    - Menu Items
    - Customers
    - Orders
    - Reports
  - Example request bodies
  - Pre-configured environment variable:
    - `{{baseUrl}}` (e.g., `http://localhost:3001`)
  - Sample query params for filters (date range, search, pagination)
  - Basic tests per request (MVP-level):
    - Status code checks (200/201)
    - Response has `success=true` (if you use standard response envelope)
    - Capture created IDs (menuItemId, customerId, orderId) into variables for chaining

### 7.2 Sample Postman Environment Variables (recommended)
- `baseUrl`
- `menuItemId`
- `customerId`
- `orderId`
- `fromDate`
- `toDate`

---

## 8) Non-Functional Scope
- Validation and clean error messages
- Pagination for list endpoints
- Logging + health endpoint:
  - `GET /health`
- API documentation:
  - Swagger/OpenAPI (optional but recommended even for MVP)

---

## 9) Deliverables
- Full-stack repo:
  - **Next.js frontend** using **shadcn/ui**
  - Backend APIs (Node-based or Next.js API routes)
  - MongoDB schema/models
  - Aggregation-based reports
- **Postman collection JSON**
- README:
  - local setup
  - Mongo connection
  - how to run frontend + backend
  - how to import Postman collection and environment

---

## 10) Acceptance Criteria (MVP)
- Menu can be created/edited/listed with filters and availability toggle
- Customers can be created and searched (phone/name)
- Orders can be created for a customer with multiple items and totals calculated correctly
- Orders can be marked as Paid and listed by date/status/customer
- Reports return correct results for a given date range:
  - Top selling items
  - Most sold coffee
  - Most regular customer (by orders and by spend)
  - Sales summary (day/week)

