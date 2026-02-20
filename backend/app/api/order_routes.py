from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.order_service import create_order, update_order_status
from app.db.models import Order

router = APIRouter()

@router.post("/order", response_model=OrderResponse)
async def place_order(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    return await create_order(db, order)

@router.get("/status/{order_id}", response_model=OrderResponse)
async def get_status(order_id: int, db: AsyncSession = Depends(get_db)):
    order = await db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/status/{order_id}", response_model=OrderResponse)
async def update_status(order_id: int, status_update: OrderStatusUpdate, db: AsyncSession = Depends(get_db)):
    order = await update_order_status(db, order_id, status_update.status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
