from fastapi import FastAPI
from app.api.order_routes import router
from app.db.database import engine
from app.db.models import Base

app = FastAPI(title="ProSensia Smart-Serve API")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Welcome to ProSensia Smart-Serve API"}

