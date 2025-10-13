import io
import os
from typing import Any, Dict, List, Optional, Union

import pytesseract
from pdf2image import convert_from_path, convert_from_bytes
from PIL import Image


async def process_document(file_path: str) -> str:
    """
    Process a document with OCR if needed
    
    This function handles PDF files by converting them to images
    and then running OCR on each page.
    
    For text files, it simply reads the content.
    """
    # Check if the file is in S3 or local
    if file_path.startswith("s3://"):
        # For S3, we need to download the file first
        from app.core.storage import get_file_from_storage
        file_obj = await get_file_from_storage(file_path)
        if not file_obj:
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if file_path.lower().endswith(".pdf"):
            # Convert PDF to images
            images = convert_from_bytes(file_obj.read())
            return await _process_images(images)
        else:
            # Assume it's a text file
            return file_obj.read().decode("utf-8")
    else:
        # Local file
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if file_path.lower().endswith(".pdf"):
            # Convert PDF to images
            images = convert_from_path(file_path)
            return await _process_images(images)
        else:
            # Assume it's a text file
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()


async def _process_images(images: List[Image.Image]) -> str:
    """
    Process a list of images with OCR
    """
    text_content = []
    
    for i, img in enumerate(images):
        # Run OCR on each image
        page_text = pytesseract.image_to_string(img, lang="eng+hin+asm")
        text_content.append(f"--- Page {i+1} ---\n{page_text}\n")
    
    return "\n".join(text_content)
