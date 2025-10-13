from datetime import datetime
import uuid
from typing import Any

from sqlalchemy import Column, DateTime, ForeignKey, Float, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base, CRUDBase


class RiskAssessment(Base):
    """
    Risk Assessment database model
    """
    __tablename__ = "risk_assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dpr_id = Column(UUID(as_uuid=True), ForeignKey("dprs.id"))
    evaluated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    overall_risk_score = Column(Float, nullable=False)
    risk_factors = Column(JSONB, nullable=False)  # Dictionary of risk factors and their scores
    risk_details = Column(JSONB, nullable=False)  # Detailed risk assessment results
    recommendations = Column(JSONB, nullable=True)  # Recommendations to mitigate risks
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    dpr = relationship("DPR", back_populates="risk_assessments")
    user = relationship("User")


class CRUDRiskAssessment(CRUDBase):
    """
    CRUD operations for RiskAssessment model
    """
    pass


# Create CRUD instance
risk_assessment = CRUDRiskAssessment(RiskAssessment)
