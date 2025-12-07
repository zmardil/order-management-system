# order-management-system
A small and simple Order Management System

**Development**
- **Start DB:** `npm run start:db` (runs `docker-compose` postgres)
- **Install all workspace deps:** `npm run install:all`
- **Generate Prisma client (root):** `npm run prisma:generate`
- **Or generate locally (backend):** `cd backend && npm install && npx prisma generate`
- **Run both dev servers:** `npm run dev` (runs backend/frontend concurrently)

Additional notes
- Backend runs on `http://localhost:4000` by default.
- Frontend runs on `http://localhost:5173` by default (Vite).

Useful endpoints
- `POST /api/seed-products` — idempotent helper to insert example products (IDs 1..4).
- `GET /api/products` — list available products.
- `GET /api/orders` — list orders (includes product objects).
- `GET /api/orders/:id` — get order by id.
- `POST /api/orders` — create order. Body: `{ orderDescription: string, productIds?: number[] }`.
- `PUT /api/orders/:id` — update order (description and productIds).
- `DELETE /api/orders/:id` — delete order.

Seeding example
1. Start DB and servers (see `SETUP.md`).
2. Seed products (one-time / idempotent):

```bash
curl -X POST http://localhost:4000/api/seed-products
```

Assumptions & tradeoffs
- Product IDs in the SOW are inserted with explicit IDs (1..4) using an idempotent `seed-products` helper rather than relying on auto-increment to match the assignment data.
- The UI uses a simple comma-separated input for product IDs when booking orders to keep the UI small and focused for this exercise.
- Error handling is basic and returns JSON errors from the backend; more sophisticated validation and frontend UX could be added in a real app.

Next steps (if you want):
- Add a product-picker UI when booking orders instead of typing IDs.
- Add unit/integration tests for API routes and components.

