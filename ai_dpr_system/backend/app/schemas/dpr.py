from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


class DPRBase(BaseModel):
    title: str
    description: Optional[str] = None


class DPRCreate(DPRBase):
    file_path: str
    uploaded_by: UUID
    status: str = "pending"


class DPRUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class DPRResponse(DPRBase):
    id: UUID
    file_path: str
    uploaded_by: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
