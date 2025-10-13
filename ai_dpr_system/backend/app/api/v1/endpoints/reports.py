from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.db.session import get_db
from app.models.dpr import DPR
from app.models.evaluation import Evaluation
from app.models.risk_assessment import RiskAssessment
from app.schemas.user import User
from app.utils.reports import generate_pdf_report, generate_csv_report

router = APIRouter()


@router.get("/{dpr_id}/pdf")
async def generate_pdf(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Generate a PDF report for a DPR
    """
    # Get the DPR from database
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to access this DPR
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Get evaluation data
    evaluation = db.query(Evaluation).filter(Evaluation.dpr_id == dpr_id).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This DPR has not been evaluated yet",
        )
    
    # Get risk assessment data
    risk_assessment = db.query(RiskAssessment).filter(RiskAssessment.dpr_id == dpr_id).first()
    
    try:
        # Generate PDF report
        pdf_content = await generate_pdf_report(dpr, evaluation, risk_assessment)
        
        # Return the PDF as a downloadable file
        return StreamingResponse(
            iter([pdf_content]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=DPR_Report_{dpr_id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating PDF: {str(e)}",
        )


@router.get("/{dpr_id}/csv")
async def generate_csv(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Generate a CSV report for a DPR
    """
    # Get the DPR from database
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to access this DPR
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Get evaluation data
    evaluation = db.query(Evaluation).filter(Evaluation.dpr_id == dpr_id).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This DPR has not been evaluated yet",
        )
    
    # Get risk assessment data
    risk_assessment = db.query(RiskAssessment).filter(RiskAssessment.dpr_id == dpr_id).first()
    
    try:
        # Generate CSV report
        csv_content = await generate_csv_report(dpr, evaluation, risk_assessment)
        
        # Return the CSV as a downloadable file
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=DPR_Report_{dpr_id}.csv"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating CSV: {str(e)}",
        )