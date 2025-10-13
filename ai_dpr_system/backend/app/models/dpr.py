from datetime import datetime
import uuid
from typing import Any

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base, CRUDBase


class DPR(Base):
    """
    DPR database model
    """
    __tablename__ = "dprs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(String, default="pending")  # pending, evaluated, risk_assessed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="dprs")
    evaluations = relationship("Evaluation", back_populates="dpr")
    risk_assessments = relationship("RiskAssessment", back_populates="dpr")


class CRUDDPR(CRUDBase):
    """
    CRUD operations for DPR model
    """
    pass


# Create CRUD instance
dpr = CRUDDPR(DPR)
