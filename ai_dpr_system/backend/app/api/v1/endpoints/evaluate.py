from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.db.session import get_db
from app.ml.compliance import check_compliance
from app.ml.extraction import extract_sections
from app.ml.ocr import process_document
from app.models.dpr import DPR
from app.models.evaluation import Evaluation
from app.schemas.evaluation import EvaluationCreate, EvaluationResponse
from app.schemas.user import User

router = APIRouter()


@router.post("/{dpr_id}", response_model=EvaluationResponse)
async def evaluate_dpr(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Evaluate a DPR document for compliance and quality
    """
    # Get the DPR from database
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to evaluate this DPR
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    try:
        # Process the document with OCR if needed
        text_content = await process_document(dpr.file_path)
        
        # Extract sections from the text content
        sections = await extract_sections(text_content)
        
        # Check compliance against guidelines
        compliance_results = await check_compliance(sections)
        
        # Create evaluation record
        evaluation_in = EvaluationCreate(
            dpr_id=dpr_id,
            evaluated_by=current_user.id,
            compliance_score=compliance_results["overall_score"],
            compliance_details=compliance_results["details"],
            extracted_sections=sections,
            status="completed",
        )
        
        evaluation = Evaluation.create(db, obj_in=evaluation_in)
        
        # Update DPR status
        dpr.status = "evaluated"
        db.add(dpr)
        db.commit()
        
        return evaluation
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error evaluating DPR: {str(e)}",
        )


@router.get("/{dpr_id}", response_model=EvaluationResponse)
async def get_evaluation_results(
    dpr_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get evaluation results for a DPR
    """
    # Get the evaluation from database
    evaluation = db.query(Evaluation).filter(Evaluation.dpr_id == dpr_id).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found for this DPR",
        )
    
    # Get the associated DPR
    dpr = db.query(DPR).filter(DPR.id == dpr_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DPR not found",
        )
    
    # Check if user has permission to view this evaluation
    if not current_user.is_admin and not current_user.is_reviewer and dpr.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return evaluation