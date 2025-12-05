Boilerplate monorepo — Backend + Frontend

Overview
- Backend: `backend` (Express + TypeScript + Prisma)
- Frontend: `frontend` (React + Vite + Tailwind CSS + Storybook)
- DB: PostgreSQL via `docker-compose`

Quick start
1. Install dependencies for all workspaces:

```bash
npm run install:all
```

2. Start Postgres (local via Docker):

```bash
npm run start:db
```

3. Generate Prisma client and run migrations (backend):

```bash
# from repo root
cd backend
npm run prisma:generate
npm run migrate
npm run dev
```

4. Start frontend dev server (in another terminal):

```bash
cd frontend
npm run dev
```

5. Storybook:

```bash
cd frontend
npm run storybook
```

Notes
- Update `backend/.env` or use `backend/.env.example` to point `DATABASE_URL` to your Postgres.
- This is a minimal starter. Install or customize extra packages (ESLint, prettier, CI, etc.) as needed.
