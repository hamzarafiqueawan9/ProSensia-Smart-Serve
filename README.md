# ProSensia Smart-Serve: System Hub

Welcome Team Alpha. This is the **Core Foundation** of the ProSensia mission. This backend acts as the orchestrator for all factory logistics tasks.

---

## 🚀 Quick Start Guide

**Step 1: Get the Code**

```bash
git clone https://github.com/1Khizar/ProSensia-Smart-Serve.git
cd ProSensia-Smart-Serve/backend
```

**Step 2: Install & Run**

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

**Step 3: Verify**

- **API Terminal:** Runs at `http://localhost:8000`
- **Interactive Docs:** 👉 [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🤝 Team Alpha: Integration Handshakes

### 1. For Hamza (Lead Frontend)

**Your Goal:** Build the "Engineer's Interface" and Live Tracker.

- **Connection Point:** `http://localhost:8000/docs`
- **Order Placement:** Use `POST /order`.
- **Live Tracking:** Use `GET /status/{order_id}` to update your progress bar.
- **Status Strings:** Your UI must handle these exact strings:
  - `Preparing` (Kitchen phase)
  - `On Way` (Runner moving)
  - `Delivered` (Reached station)
- **Action:** When a runner finishes, call `PATCH /status/{id}` with `{"status": "Delivered"}` to reset the tracker.

### 2. For Mohib (Automation & Chaos)

**Your Goal:** Stress test the system with 100+ requests.

- **Target Endpoint:** `POST /order`
- **JSON Payload Required:**
  ```json
  {
    "station": "Bay-12",
    "item": "Double Espresso",
    "priority": "Urgent"
  }
  ```
- **Challenge:** The backend is optimized with PostgreSQL to handle your "Chaos Script." If you scale up to 1,000 records, the database is ready for Team Beta's audit.

### 3. For Eman (AI & Prediction)

**Your Goal:** Provide the ETA model for the users.

- **The Integration:**
  - Train your model on `Active Orders` + `Time of Day`.
  - Export as `eta_model.pkl`.
  - **Drop-off:** Place the `.pkl` file in the `/backend` root folder.
- **Functionality:** The system automatically picks up your file and replaces our static timer with your AI prediction.

---

## 🛠️ API Definition

| Method    | Endpoint         | Description                                       |
| :-------- | :--------------- | :------------------------------------------------ |
| `POST`  | `/order`       | Place a new order from a station.                 |
| `GET`   | `/status/{id}` | Get real-time status & ETA for a specific order.  |
| `PATCH` | `/status/{id}` | Update status (Preparing -> On Way -> Delivered). |
| `GET`   | `/docs`        | Interactive Swagger UI (Recommended for Testing). |

---

*Mission: Efficiency is everything. Build the System.*
