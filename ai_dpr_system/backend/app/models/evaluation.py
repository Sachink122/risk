from datetime import datetime
import uuid
from typing import Any

from sqlalchemy import Column, DateTime, ForeignKey, Float, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base, CRUDBase


class Evaluation(Base):
    """
    Evaluation database model
    """
    __tablename__ = "evaluations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dpr_id = Column(UUID(as_uuid=True), ForeignKey("dprs.id"))
    evaluated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    compliance_score = Column(Float, nullable=False)
    compliance_details = Column(JSONB, nullable=False)
    extracted_sections = Column(JSONB, nullable=False)
    status = Column(String, default="completed")  # completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    dpr = relationship("DPR", back_populates="evaluations")
    user = relationship("User")


class CRUDEvaluation(CRUDBase):
    """
    CRUD operations for Evaluation model
    """
    pass


# Create CRUD instance
evaluation = CRUDEvaluation(Evaluation)
