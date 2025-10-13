from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


class EvaluationBase(BaseModel):
    dpr_id: UUID
    compliance_score: float
    compliance_details: Dict
    extracted_sections: Dict
    status: str = "completed"


class EvaluationCreate(EvaluationBase):
    evaluated_by: UUID


class EvaluationUpdate(BaseModel):
    compliance_score: Optional[float] = None
    compliance_details: Optional[Dict] = None
    extracted_sections: Optional[Dict] = None
    status: Optional[str] = None


class EvaluationResponse(EvaluationBase):
    id: UUID
    evaluated_by: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
