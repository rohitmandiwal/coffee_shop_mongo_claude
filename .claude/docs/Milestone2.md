# Milestone 2 — Orders (Create + List + Details + Status)

## Goal
Enable placing orders against customers and menu items, track status, and show order data in UI.

---

## Backend Scope (MongoDB + API)
### A) Order APIs
- `POST /api/orders`
  - Create order for customer with multiple items
  - Store snapshots (itemNameSnapshot, unitPriceSnapshot)
  - Compute: subTotal, discount(optional), tax(optional), grandTotal
- `GET /api/orders`
  - Filters: from/to date, customerId, status, pagination
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
  - Created → Paid (MVP)
- Optional:
  - `GET /api/customers/:id/orders` (customer purchase history)

### B) Data Model
- Add collection:
  - `orders`
- Indexes:
  - orderDate, customerId, status

### C) Business Rules (MVP)
- Order must have >= 1 item
- Item quantity >= 1
- Prevent ordering items with `isAvailable=false` (recommended)
- Reports should count only `Paid` orders later (Phase 3)

---

## Frontend Scope (Next.js + shadcn/ui)
### A) Orders Page (List)
- Orders table with filters:
  - date range (from/to)
  - status
  - customer search (optional)
- Row action: view details

### B) Create Order Page
- Select customer:
  - searchable control (Command + Popover recommended)
- Add items:
  - searchable menu items list
  - quantity controls
- Totals panel:
  - subTotal + discount/tax (optional input) + grandTotal
- Submit → creates order

### C) Order Details Page
- Order header:
  - customer, date, status, totals
- Items breakdown table
- Action:
  - mark as Paid

Recommended shadcn components:
- `Command`, `Popover`, `Calendar`, `Table`, `Card`, `Badge`, `Separator`, `Button`, `Input`

---

## Postman Collection Scope (Milestone 2)
- Add folder:
  - Orders
- New environment variable:
  - `orderId`
- Requests include:
  - Create order (uses `customerId` + `menuItemId`)
  - List orders (with filters)
  - Order details
  - Update status to Paid
- Basic tests:
  - Save `orderId`
  - Validate totals present

---

## Acceptance Criteria
- Order creation works end-to-end from UI and Postman
- Orders list filters work (date/status/customer)
- Order details view works and status update reflects in DB/UI
