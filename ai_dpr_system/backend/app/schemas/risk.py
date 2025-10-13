from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


class RiskAssessmentBase(BaseModel):
    dpr_id: UUID
    overall_risk_score: float
    risk_factors: Dict
    risk_details: Dict
    recommendations: Optional[Dict] = None


class RiskAssessmentCreate(RiskAssessmentBase):
    evaluated_by: UUID


class RiskAssessmentUpdate(BaseModel):
    overall_risk_score: Optional[float] = None
    risk_factors: Optional[Dict] = None
    risk_details: Optional[Dict] = None
    recommendations: Optional[Dict] = None


class RiskAssessmentResponse(RiskAssessmentBase):
    id: UUID
    evaluated_by: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
