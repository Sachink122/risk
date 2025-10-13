from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.db.session import get_db
from app.models.dpr import DPR
from app.schemas.dpr import DPRResponse
from app.schemas.user import User

router = APIRouter()


@router.get("/", response_model=List[DPRResponse])
async def read_dprs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve DPRs
    """
    # If user is admin or reviewer, they can see all DPRs
    if current_user.is_admin or current_user.is_reviewer:
        dprs = db.query(DPR).offset(skip).limit(limit).all()
    else:
        # Regular users can only see their own DPRs
        dprs = db.query(DPR).filter(DPR.uploaded_by == current_user.id).offset(skip).limit(limit).all()
    
    return dprs


@router.get("/{dpr_id}", response_model=DPRResponse)
async def read_dpr(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific DPR by ID
    """
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to view this DPR
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return dpr


@router.get("/dashboard/stats", response_model=dict)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get dashboard statistics
    """
    if current_user.is_admin or current_user.is_reviewer:
        # Get stats for all DPRs for admins/reviewers
        total_dprs = db.query(DPR).count()
        pending_dprs = db.query(DPR).filter(DPR.status == "pending").count()
        evaluated_dprs = db.query(DPR).filter(DPR.status == "evaluated").count()
        risk_assessed_dprs = db.query(DPR).filter(DPR.status == "risk_assessed").count()
    else:
        # Get stats only for user's own DPRs
        total_dprs = db.query(DPR).filter(DPR.uploaded_by == current_user.id).count()
        pending_dprs = db.query(DPR).filter(
            DPR.status == "pending", DPR.uploaded_by == current_user.id
        ).count()
        evaluated_dprs = db.query(DPR).filter(
            DPR.status == "evaluated", DPR.uploaded_by == current_user.id
        ).count()
        risk_assessed_dprs = db.query(DPR).filter(
            DPR.status == "risk_assessed", DPR.uploaded_by == current_user.id
        ).count()
    
    return {
        "total_dprs": total_dprs,
        "pending_dprs": pending_dprs,
        "evaluated_dprs": evaluated_dprs,
        "risk_assessed_dprs": risk_assessed_dprs,
    }