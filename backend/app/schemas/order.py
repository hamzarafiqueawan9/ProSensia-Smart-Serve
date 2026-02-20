from pydantic import BaseModel

class OrderCreate(BaseModel):
    station: str
    item: str
    priority: str

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    status: str
    runner_id: int
    eta_minutes: int

    class Config:
        from_attributes = True
