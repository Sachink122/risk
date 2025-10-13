from datetime import datetime
import uuid
from typing import Any

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base, CRUDBase
from app.core.security import get_password_hash, verify_password


class User(Base):
    """
    User database model
    """
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean(), default=False)
    is_reviewer = Column(Boolean(), default=False)
    is_active = Column(Boolean(), default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CRUDUser(CRUDBase):
    """
    CRUD operations for User model
    """
    def create(self, db, *, obj_in):
        db_obj = User(
            email=obj_in.email,
            full_name=obj_in.full_name,
            hashed_password=get_password_hash(obj_in.password),
            is_admin=obj_in.is_admin if hasattr(obj_in, "is_admin") else False,
            is_reviewer=obj_in.is_reviewer if hasattr(obj_in, "is_reviewer") else False,
            is_active=True,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db, *, db_obj, obj_in):
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def authenticate(self, db, *, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


# Create CRUD instance
user = CRUDUser(User)
