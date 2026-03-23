# Ashenbastion Starter

This version includes a first playable milestone flow:

1. A new user registers
2. The backend bootstraps a player profile and bastion
3. The player lands on the Bastion screen
4. The player upgrades the Lumberyard
5. The player opens the Map
6. The player scouts Fallen Ruin
7. The player sends the first raid

## Stack
- Frontend: React + Vite + React Router + React Query
- Backend: Express or Fastify
- Database: PostgreSQL

## Quick start

### 1. Database
Create a PostgreSQL database named `ashenbastion` and set `backend/.env.example` values into your environment.

Run migration:

```bash
cd backend
npm install
npm run migrate
```

### 2. Backend
Start Express API:

```bash
cd backend
npm install
npm run dev:express
```

API runs by default on `http://localhost:3001`.

### 3. Frontend
Start Vite frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs by default on `http://localhost:5173`.

## Auth model in this starter
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

The frontend stores the returned user object in localStorage and sends `x-user-id` on protected API requests.
This is a starter auth approach for local development, not production auth.

## First playable test
- Register with a username, email, password, doctrine, and bastion name
- On the Bastion page, select `Lumberyard` and click `Upgrade`
- Click `Open Map`
- Select `Fallen Ruin`
- Click `Scout`, use `Ravensworn`, then send the scout
- Switch to `Raid`, pick `Reavers` and/or `Pikeguard`, then send the first raid

## Notes
- The backend now uses real route handlers, validation, repositories, and bootstrap logic.
- The frontend now uses real auth pages and API calls instead of mock-only flow.
- Some polish is still intentionally light so the project can move faster into real gameplay systems.


## Reports + march resolution

- Marches now resolve automatically when you open Bastion, Map, or Reports after their ETA expires.
- Travel time is intentionally short in this milestone (roughly 5 seconds per tile) so you can test the loop fast.
- New route: `/game/reports`
- New API endpoints:
  - `GET /api/reports`
  - `GET /api/reports/:reportId`

Test flow:
1. Register or login
2. Open Map
3. Select Fallen Ruin
4. Send Scout with Ravensworn
5. Wait a few seconds, open Reports
6. Send Raid with Reavers/Pikeguard
7. Wait a few seconds, open Reports again
