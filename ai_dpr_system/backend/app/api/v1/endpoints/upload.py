from typing import Any, List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.core.storage import save_file_to_storage
from app.db.session import get_db
from app.models.dpr import DPR
from app.schemas.dpr import DPRCreate, DPRResponse
from app.schemas.user import User
from app.utils.file import validate_file_type

router = APIRouter()


@router.post("/", response_model=DPRResponse)
async def upload_dpr_file(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    title: str,
    description: str = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Upload a DPR file (PDF/Text)
    """
    # Validate file type (PDF, TXT, DOC, DOCX)
    if not validate_file_type(file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF, TXT, DOC, DOCX files are accepted.",
        )
    
    try:
        # Save file to storage (S3, local, etc.)
        file_location = await save_file_to_storage(file)
        
        # Create DPR entry in database
        dpr_in = DPRCreate(
            title=title,
            description=description,
            file_path=file_location,
            uploaded_by=current_user.id,
            status="pending",  # Initial status is pending
        )
        
        # Save to database
        dpr = DPR.create(db, obj_in=dpr_in)
        
        # Queue the DPR for processing (this could be done asynchronously)
        # queue_dpr_for_processing(dpr.id)
        
        return dpr
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}",
        )


@router.get("/status/{upload_id}", response_model=DPRResponse)
async def check_upload_status(
    upload_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Check the status of a DPR upload
    """
    dpr = db.query(DPR).filter(DPR.id == upload_id).first()
    if not dpr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found",
        )
    
    # Check if user has permission to view this DPR
    if dpr.uploaded_by != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return dpr