from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.db.session import get_db
from app.ml.risk import predict_risk
from app.models.dpr import DPR
from app.models.evaluation import Evaluation
from app.models.risk_assessment import RiskAssessment
from app.schemas.risk import RiskAssessmentCreate, RiskAssessmentResponse
from app.schemas.user import User

router = APIRouter()


@router.post("/{dpr_id}", response_model=RiskAssessmentResponse)
async def predict_dpr_risk(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Predict risk factors for a DPR
    """
    # Get the DPR from database
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to perform risk assessment
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Get evaluation data (needed for risk prediction)
    evaluation = db.query(Evaluation).filter(Evaluation.dpr_id == dpr_id).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR must be evaluated before risk prediction",
        )
    
    try:
        # Predict risk using ML model
        risk_results = await predict_risk(evaluation.extracted_sections)
        
        # Create risk assessment record
        risk_in = RiskAssessmentCreate(
            dpr_id=dpr_id,
            evaluated_by=current_user.id,
            overall_risk_score=risk_results["overall_risk"],
            risk_factors=risk_results["risk_factors"],
            risk_details=risk_results["details"],
            recommendations=risk_results["recommendations"],
        )
        
        risk_assessment = RiskAssessment.create(db, obj_in=risk_in)
        
        # Update DPR status
        dpr.status = "risk_assessed"
        db.add(dpr)
        db.commit()
        
        return risk_assessment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error predicting risk: {str(e)}",
        )


@router.get("/{dpr_id}", response_model=RiskAssessmentResponse)
async def get_risk_assessment(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get risk assessment for a DPR
    """
    # Get the risk assessment from database
    risk_assessment = db.query(RiskAssessment).filter(RiskAssessment.dpr_id == dpr_id).first()
    if not risk_assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk assessment not found for this DPR",
        )
    
    # Get the associated DPR
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to view this risk assessment
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return risk_assessment
