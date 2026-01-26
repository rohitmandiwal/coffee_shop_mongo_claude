# Milestone 1 — Foundations (Menu + Customers)

## Goal
Deliver a working full-stack foundation with MongoDB, and complete CRUD for **Menu** and **Customers**, with basic UI pages and a Postman collection to validate APIs.

---

## Backend Scope (MongoDB + API)
### A) Setup & Infrastructure
- Node/Next backend setup (monorepo recommended)
- MongoDB connection (local/Atlas)
- Common API patterns:
  - Standard response envelope: `success`, `data`, `error`, `meta`
  - Validation (Zod/Joi)
  - Error handling middleware
  - Logging
- Health check:
  - `GET /health`

### B) Menu APIs
- `POST /api/menu-items`
- `GET /api/menu-items` (search, category, isAvailable, minPrice, maxPrice, pagination)
- `GET /api/menu-items/:id`
- `PATCH /api/menu-items/:id`
- `DELETE /api/menu-items/:id`
- `PATCH /api/menu-items/:id/availability`

### C) Customer APIs
- `POST /api/customers`
- `GET /api/customers` (search + pagination)
- `GET /api/customers/:id`
- `PATCH /api/customers/:id`

### D) Data Models
- Collections:
  - `menu_items`
  - `customers`
- Indexes:
  - Menu: text index on name, category + isAvailable
  - Customer: unique phone, text index on fullName

---

## Frontend Scope (Next.js + shadcn/ui)
### A) Setup
- Next.js (App Router)
- shadcn/ui init:
  - `npx shadcn@latest init`
- Shared layout + navigation
- Toast notifications for actions

### B) Screens
#### 1) Dashboard (Basic)
- Navigation cards/links to:
  - Menu
  - Customers
  - Orders (disabled/coming soon)
  - Reports (disabled/coming soon)

#### 2) Menu Page
- Table list with:
  - search + filters (category, availability)
  - actions: edit, delete, toggle availability
- Add/Edit Menu Item (Dialog/Sheet form)

#### 3) Customers Page
- Table list with search (name/phone)
- Add/Edit Customer (Dialog/Sheet form)

Recommended shadcn components:
- `Table`, `Card`, `Button`, `Input`, `Select`, `Textarea`, `Dialog/Sheet`, `Switch`, `Toast`

---

## Postman Collection Scope (Milestone 1)
- Collection folders:
  - Health
  - Menu Items
  - Customers
- Environment variables:
  - `baseUrl`, `menuItemId`, `customerId`
- Basic tests:
  - Validate status codes
  - Store created IDs into env vars

---

## Acceptance Criteria
- Menu CRUD works end-to-end (UI + API + Mongo)
- Customer CRUD works end-to-end (UI + API + Mongo)
- Postman collection can create/list/update entities successfully
