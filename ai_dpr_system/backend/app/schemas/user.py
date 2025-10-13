from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_admin: bool = False
    is_reviewer: bool = False
    is_active: bool = True


class UserCreate(UserBase):
    password: str
    department: str
    
    @validator('password')
    def password_min_length(cls, v):
        if len(v) < 6:  # Changed to match frontend validation
            raise ValueError('Password must be at least 6 characters long')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None
    is_reviewer: Optional[bool] = None
    is_active: Optional[bool] = None


class User(UserBase):
    id: int  # Changed from UUID to int for our temporary implementation
    department: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
