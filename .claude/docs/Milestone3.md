# Milestone 3 — Reports + Dashboard KPIs

## Goal
Deliver analytics endpoints and UI reports for:
- Most sold coffee / top selling items
- Most regular customer
- Sales summary
Also upgrade dashboard to show meaningful KPIs.

---

## Backend Scope (MongoDB Aggregations + API)
### A) Report APIs
- `GET /api/reports/top-selling-items?from=&to=&limit=`
  - Group by menuItemId + itemNameSnapshot
  - Sort by quantity desc
- `GET /api/reports/most-sold-coffee?from=&to=`
  - Filter to menu category = Coffee (via join/lookup or snapshot strategy)
  - Return top 1
- `GET /api/reports/most-regular-customer?from=&to=&by=orders|spend`
  - orders: highest order count
  - spend: highest total spend
- `GET /api/reports/sales-summary?from=&to=&bucket=day|week`
  - date bucket + total orders + total revenue

### B) Reporting Rules
- Reports should count only orders with `status=Paid`
- Date filtering should be inclusive and timezone-safe
- Performance:
  - Ensure indexes support orderDate + status

---

## Frontend Scope (Next.js + shadcn/ui)
### A) Dashboard (Enhanced)
- KPI Cards:
  - Today’s orders (Paid)
  - Today’s revenue (Paid)
  - Top selling item (today / selected range)
  - Most regular customer (month-to-date optional)
- Quick navigation shortcuts

### B) Reports Page
- Date range selector (from/to)
- Sections:
  1) Top Selling Items (table)
  2) Most Sold Coffee (card)
  3) Most Regular Customer (card/table)
  4) Sales Summary (table)
- Optional (still MVP-safe):
  - Simple chart later (Phase 4). For now keep table-based reporting.

Recommended shadcn components:
- `Card`, `Table`, `Calendar`, `Popover`, `Badge`, `Separator`, `Tabs` (optional)

---

## Postman Collection Scope (Milestone 3)
- Add folder:
  - Reports
- Variables:
  - `fromDate`, `toDate`
- Requests:
  - Each report endpoint with sample query params
- Basic tests:
  - Ensure arrays returned for list-type reports
  - Ensure non-empty results when data exists

---

## Acceptance Criteria
- Reports return correct values for a given date range and only include Paid orders
- Dashboard shows correct KPI values
- Reports UI is usable and matches API results
- Postman collection fully validates all report endpoints
