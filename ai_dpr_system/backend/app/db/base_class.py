from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from pydantic import BaseModel
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class CRUDBase:
    """
    Base class for CRUD operations
    """
    def __init__(self, model):
        self.model = model
    
    def get(self, db, id: Any):
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(self, db, *, skip=0, limit=100):
        return db.query(self.model).offset(skip).limit(limit).all()
    
    def create(self, db, *, obj_in):
        if isinstance(obj_in, dict):
            obj_in_data = obj_in
        else:
            obj_in_data = obj_in.dict(exclude_unset=True)
            
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db, *, db_obj, obj_in):
        obj_data = db_obj.__dict__
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def remove(self, db, *, id: int):
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj