import os

# --- Database Configuration ---
# Docker uses Postgres (via env var). Local dev uses SQLite fallback.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./prosensia.db"
)
