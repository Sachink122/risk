import os
from typing import List

from fastapi import UploadFile

# List of allowed file extensions
ALLOWED_EXTENSIONS = {"pdf", "txt", "doc", "docx"}


def validate_file_type(file: UploadFile) -> bool:
    """
    Validate that the file is of an allowed type
    """
    # Extract the file extension from the filename
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower().replace(".", "")
    
    return ext in ALLOWED_EXTENSIONS
