from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    station = Column(String, nullable=False)
    item = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    runner_id = Column(Integer)
    status = Column(String, default="Preparing")
    eta_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
