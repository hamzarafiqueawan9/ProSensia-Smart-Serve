# ProSensia Smart-Serve: System Hub

A factory logistics and order management system combining a **FastAPI** backend with a **React** frontend for real-time order tracking, admin dashboards, and ML-based ETA predictions.

---

## 📋 Project Overview

**ProSensia Smart-Serve** is an intelligent order orchestration system designed for factory environments. It manages orders from multiple stations, tracks delivery progress in real-time, and uses ML-based models to predict accurate ETAs.

### Key Features

- **Customer Interface**

  - Menu display per station (QR-based station selection via `?station=` query param)
  - Cart-based order placement with priority support (Regular / Urgent)
  - Real-time order tracking with live status polling (every 3 seconds)
  - Tech trivia pop-ups during the preparation phase
  - Customer feedback collection (rating & comments)
- **Admin Dashboard**

  - Real-time order monitoring & management
  - Station performance tracking
  - User/station management
  - Order status updates (Preparing → On Way → Delivered)
- **Backend Services**

  - FastAPI REST API with async SQLAlchemy database operations
  - Automatic runner assignment with load-balancing (min-load, round-robin reset)
  - ETA prediction using a pickled scikit-learn model (with fallback heuristic)
  - Status lifecycle management with runner release on delivery

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 16+** (for frontend)
- **npm** (for frontend package management)

### Full Project Setup

#### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

#### Step 2: Frontend Setup (in a new terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

> **Note:** The Vite dev server is pre-configured to proxy `/api` requests to the backend at `http://localhost:8000`, so there are no CORS issues during development.

#### Step 3: Access the Application

| Interface            | URL                                       |
| -------------------- | ----------------------------------------- |
| Customer Menu        | http://localhost:5173/menu?station=Bay-12 |
| Order Confirmation   | http://localhost:5173/order/:orderId      |
| Live Order Tracker   | http://localhost:5173/track/:orderId      |
| Admin Dashboard      | http://localhost:5173/admin               |
| Admin Orders         | http://localhost:5173/admin/orders        |
| Admin Users/Stations | http://localhost:5173/admin/users         |
| API Documentation    | http://localhost:8000/docs                |

---

## 📁 Project Structure

```
ProSensia Smart-Serve/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point, startup event, router mount
│   │   ├── api/
│   │   │   └── order_routes.py         # REST endpoints: POST /order, GET/PATCH /status/{id}
│   │   ├── core/
│   │   │   └── config.py              # DATABASE_URL config (env var → SQLite fallback)
│   │   ├── db/
│   │   │   ├── database.py            # Async engine & session factory (SQLAlchemy)
│   │   │   └── models.py             # ORM model: Order table
│   │   ├── schemas/
│   │   │   └── order.py              # Pydantic schemas: OrderCreate, OrderResponse, OrderStatusUpdate
│   │   ├── services/
│   │   │   ├── eta_service.py        # ML-based ETA prediction (scikit-learn model)
│   │   │   ├── order_service.py      # Order creation & status update logic
│   │   │   └── runner_service.py     # Runner load-balancing & assignment
│   │   └── utils/                     # (reserved for future utilities)
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Docker image for the API
│   ├── docker-compose.yml             # Docker Compose: API + PostgreSQL
│   ├── .dockerignore                  # Docker build exclusions
│   ├── eta_model.pkl                  # Pre-trained ETA prediction model
│   └── prosensia.db                   # SQLite database (auto-created at runtime)
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                   # React entry point (BrowserRouter)
│   │   ├── App.jsx                    # Route definitions & layout composition
│   │   ├── api.js                     # API client: placeOrder, getStatus, updateStatus, getOrders
│   │   ├── index.css                  # Global styles
│   │   ├── components/
│   │   │   ├── Layout.jsx             # Main layout wrapper
│   │   │   ├── Layout.module.css      # Layout styles
│   │   │   ├── TechTrivia.jsx         # Tech trivia pop-up component
│   │   │   └── TechTrivia.module.css  # TechTrivia styles
│   │   ├── pages/
│   │   │   ├── Menu.jsx               # Station menu & cart page
│   │   │   ├── Menu.module.css        # Menu styles
│   │   │   ├── OrderConfirm.jsx       # Order confirmation page
│   │   │   ├── OrderConfirm.module.css
│   │   │   ├── Tracker.jsx            # Live order tracker with status polling
│   │   │   └── Tracker.module.css
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx     # Admin overview dashboard
│   │   │   ├── AdminLayout.jsx        # Admin layout wrapper & navigation
│   │   │   ├── AdminLayout.module.css
│   │   │   ├── AdminOrders.jsx        # Admin order management
│   │   │   ├── AdminUsers.jsx         # Admin users/station management
│   │   │   └── Admin.module.css       # Shared admin styles
│   │   ├── context/
│   │   │   └── OrderContext.jsx       # Global order state (React Context + localStorage)
│   │   └── data/
│   │       └── trivia.js             # Tech trivia questions & answers
│   ├── package.json                   # Node.js dependencies & scripts
│   ├── vite.config.js                 # Vite config with API proxy
│   └── index.html                     # HTML entry point (DM Sans font)
│
├── scripts/
│   └── show_orders.py                 # Utility: print recent orders from SQLite DB
│
├── .gitignore
└── README.md
```

---

## 💾 Database

### Storage

- **Local Development:** `backend/prosensia.db` (SQLite via `aiosqlite`)
- **Production/Docker:** PostgreSQL (via `DATABASE_URL` environment variable with `asyncpg`)

### Schema

**Orders Table:**

| Column          | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `id`          | Integer  | Primary key, auto-increment                  |
| `station`     | String   | Station name (e.g.,`"Bay-12"`)             |
| `item`        | String   | Ordered item name                            |
| `priority`    | String   | Priority level:`"Regular"` or `"Urgent"` |
| `runner_id`   | Integer  | Assigned runner ID (auto-assigned)           |
| `status`      | String   | Current status (see lifecycle below)         |
| `eta_minutes` | Integer  | Estimated delivery time in minutes           |
| `created_at`  | DateTime | Order creation timestamp (UTC)               |

**Order Status Lifecycle:**

```
Preparing  ──►  On Way  ──►  Delivered
```

- `Preparing` — Order is being prepared in the kitchen
- `On Way` — Order is in transit to the customer station
- `Delivered` — Order has been delivered (runner is released)

---

## 🛠️ API Endpoints

### Base URL: `http://localhost:8000`

| Method | Endpoint         | Description                       | Request Body                  | Response                                                |
| ------ | ---------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------- |
| GET    | `/`            | Health check                      | —                            | `{"message": "Welcome to ProSensia Smart-Serve API"}` |
| POST   | `/order`       | Create a new order                | `{station, item, priority}` | `{id, status, runner_id, eta_minutes}`                |
| GET    | `/status/{id}` | Get order status & ETA            | —                            | `{id, status, runner_id, eta_minutes}`                |
| PATCH  | `/status/{id}` | Update order status               | `{status}`                  | `{id, status, runner_id, eta_minutes}`                |
| GET    | `/orders`       | List all orders (used by staff UIs) | —                          | `[{id, station, item, priority, status, runner_id, eta_minutes, created_at}]` |
| GET    | `/docs`        | Swagger UI (interactive API docs) | —                            | HTML                                                    |

### Example: Create an Order

```bash
curl -X POST "http://localhost:8000/order" \
  -H "Content-Type: application/json" \
  -d '{
    "station": "Bay-12",
    "item": "Double Espresso",
    "priority": "Urgent"
  }'
```

**Response:**

```json
{
  "id": 1,
  "status": "Preparing",
  "runner_id": 1,
  "eta_minutes": 5
}
```

### Example: Update Order Status

```bash
curl -X PATCH "http://localhost:8000/status/1" \
  -H "Content-Type: application/json" \
  -d '{"status": "On Way"}'
```

---

## ⚙️ Backend Services

### Runner Assignment (`runner_service.py`)

- **3 runners** with a max capacity of **5 orders each**
- Uses **minimum-load balancing**: assigns to the runner with fewest active orders
- Auto-resets all loads when all runners reach max capacity
- Releases runner when an order is marked as `Delivered`

### ETA Prediction (`eta_service.py`)

- Loads a pre-trained **scikit-learn** model from `eta_model.pkl`
- Features used: `[current_hour, active_order_count]`
- **Fallback:** If model file is missing, uses heuristic: `5 + active_orders` minutes

### Order Service (`order_service.py`)

- Creates order with auto-assigned runner and predicted ETA
- Manages status transitions and runner lifecycle

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` folder (optional):

```env
DATABASE_URL=postgresql+asyncpg://admin:admin@db:5432/prosensia
```

If `DATABASE_URL` is not set, the app defaults to SQLite:

```
sqlite+aiosqlite:///./prosensia.db
```

### Vite Proxy (Frontend)

The frontend development server proxies API requests to avoid CORS issues:

```
/api/*  →  http://localhost:8000/*
```

This is configured in `frontend/vite.config.js`. The `api.js` client automatically uses `/api` prefix in dev mode and direct URLs in production.

---

## 🐳 Docker Deployment

For production or staging environments:

```bash
# From the backend folder
cd backend
docker-compose up --build
```

This will:

- Start a **PostgreSQL 15** database (`admin:admin@db:5432/prosensia`)
- Build and run the **FastAPI** backend container (Python 3.11)
- Expose the API on port `8000`
- Configure `DATABASE_URL` automatically
- Wait for database health check before starting the API

---

## 🧰 Utility Scripts

### `scripts/show_orders.py`

Quick utility to inspect the SQLite database from the command line:

```bash
cd backend
python ../scripts/show_orders.py
```

Prints the 10 most recent orders as formatted JSON.

---

## 🎨 Frontend Architecture

### Tech Stack

- **React 18** with **Vite 6** (fast HMR, ESM-first bundler)
- **React Router v6** for client-side routing
- **CSS Modules** for scoped, component-level styling
- **DM Sans** (Google Fonts) for typography
- **React Context** (`OrderContext`) for global state management
- **localStorage** for order persistence across tabs/sessions

### State Management

The `OrderContext` provides:

- Order placement via API with multi-item cart support
- Automatic status polling (every 3 seconds) for active orders
- Cross-tab synchronization via `localStorage` events
- Feedback collection (rating & comments)
- Station-based and bulk order deletion

### Routing

| Route               | Component            | Description                |
| ------------------- | -------------------- | -------------------------- |
| `/`               | →`/menu` redirect | Redirects to the menu      |
| `/menu`           | `Menu`             | Station menu & order cart  |
| `/order/:orderId` | `OrderConfirm`     | Order confirmation details |
| `/track/:orderId` | `Tracker`          | Live order tracking        |
| `/admin`          | `AdminDashboard`   | Admin overview dashboard   |
| `/admin/orders`   | `AdminOrders`      | Admin order management     |
| `/admin/users`    | `AdminUsers`       | Admin user/station mgmt    |

---

## 🚨 Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash
uvicorn app.main:app --reload --port 8001
```

**Database locked error:**

- Delete `backend/prosensia.db` and restart the server
- The backend will auto-create a fresh database on startup

**ETA model not found:**

- Ensure `eta_model.pkl` exists in the `backend/` directory
- If missing, the system will fallback to heuristic ETA calculation

### Frontend Issues

**Port 5173 already in use:**

```bash
npm run dev -- --port 5174
```

**Dependencies issues:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Connection Issues

- Ensure backend is running on `http://localhost:8000`
- Check if API is accessible: `http://localhost:8000/docs`
- Verify the `/api` proxy is working: frontend API client uses `/api` prefix in dev mode (handled by `vite.config.js`)

---

## 📊 Load Testing

Target endpoint: `POST http://localhost:8000/order`

Example payload:

```json
{
  "station": "Bay-12",
  "item": "Double Espresso",
  "priority": "Urgent"
}
```

Recommended setup for heavy testing:

- Use **PostgreSQL** (Docker Compose) instead of SQLite
- Adjust connection pool settings in `backend/app/core/config.py`
- Monitor runner capacity (3 runners × 5 orders = 15 concurrent max before reset)

---

## 🎯 Features & Capabilities

### Completed

✅ Order creation and management via REST API
✅ Real-time status tracking with auto-polling
✅ ML-based ETA prediction (scikit-learn)
✅ Automatic runner load-balancing & assignment
✅ Admin dashboard with order & user management
✅ Mobile-first responsive design (CSS Modules)
✅ Station-based order organization (QR-code ready)
✅ Priority-based order handling (Regular / Urgent)
✅ Cross-tab state sync via localStorage
✅ Tech trivia engagement during wait times
✅ Customer feedback system (rating & comments)
✅ Docker deployment with PostgreSQL

---

## 📝 Development Notes

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Backend    | FastAPI, SQLAlchemy (async), Pydantic v2               |
| Frontend   | React 18, Vite 6, React Router v6, CSS Modules         |
| Database   | SQLite + aiosqlite (dev) / PostgreSQL + asyncpg (prod) |
| ML/ETA     | scikit-learn, NumPy, pickle                            |
| Typography | DM Sans (Google Fonts)                                 |
| DevOps     | Docker, Docker Compose                                 |
| Auth       | Currently open API (ready for JWT integration)         |

---

## 🤝 Team Roles

| Role         | Responsibility                                 |
| ------------ | ---------------------------------------------- |
| Frontend     | Customer UI, Admin Dashboard, state management |
| Backend      | API endpoints, order orchestration, services   |
| ML/ETA       | ETA prediction model training & integration    |
| Load Testing | Performance testing & optimization             |

---

**Mission:** Efficiency is everything. Build the system.
