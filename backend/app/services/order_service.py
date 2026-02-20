from sqlalchemy import select
from app.db.models import Order
from app.services.runner_service import assign_runner, release_runner
from app.services.eta_service import predict_eta

async def create_order(db, order_data):
    result = await db.execute(select(Order))
    active_orders = len(result.scalars().all())

    runner = await assign_runner()
    eta = predict_eta(active_orders)

    order = Order(
        station=order_data.station,
        item=order_data.item,
        priority=order_data.priority,
        runner_id=runner,
        eta_minutes=eta,
        status="Preparing"
    )

    db.add(order)
    await db.commit()
    await db.refresh(order)

    return order

async def update_order_status(db, order_id: int, new_status: str):
    order = await db.get(Order, order_id)
    if not order:
        return None
    
    # If moving to Delivered, release the runner
    if new_status == "Delivered" and order.status != "Delivered":
        await release_runner(order.runner_id)
        order.eta_minutes = 0
    
    order.status = new_status
    await db.commit()
    await db.refresh(order)
    return order


# new helper for listing orders (used by kitchen/runner/admin UIs)
async def list_orders(db):
    """Return all orders, newest first."""
    result = await db.execute(select(Order).order_by(Order.id.desc()))
    return result.scalars().all()
