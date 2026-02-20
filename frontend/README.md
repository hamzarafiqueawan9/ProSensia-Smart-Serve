# STC Order Tracker (Frontend)

React website for the Game Plan: **mobile-first**, responsive, with customer flow and **admin panel** to monitor users and orders.

## Features

- **Customer site**
  - **Menu** — Station comes from URL: `/menu?station=Bay-12` (QR logic).
  - **Order** — Place order, then confirm and go to tracker.
  - **Live tracker** — Progress: Kitchen → On the way → Delivered (updates without refresh).
  - **Tech Trivia** — Pop-up while status is "Preparing".

- **Admin panel** (`/admin`)
  - **Dashboard** — Orders today, total orders, stations, recent orders.
  - **Orders** — All orders with status (live).
  - **Users** — Stations that placed orders (monitor by station).

- **Staff role panels (protected)**
  - **Kitchen** (`/kitchen`) and **Runner** (`/runner`) are blocked for normal users.
  - Use **Staff login** (`/staff-login`) to unlock role access.
  - Default passcodes: `kitchen123` and `runner123`.
  - You can override using env vars: `VITE_KITCHEN_PASSCODE`, `VITE_RUNNER_PASSCODE`.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).  
Try the menu with a station: [http://localhost:5173/menu?station=Bay-12](http://localhost:5173/menu?station=Bay-12).  
Admin: [http://localhost:5173/admin](http://localhost:5173/admin).

## Tech

- React 18, Vite, React Router
- CSS modules, mobile-first responsive
- Order state in context + `localStorage` (ready to swap for your API: `POST /order`, `GET /status/{order_id}`)
