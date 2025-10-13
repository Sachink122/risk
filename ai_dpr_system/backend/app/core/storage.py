import os
from typing import Any, BinaryIO, Optional

import boto3
from fastapi import UploadFile

from app.core.config import settings


async def save_file_to_storage(file: UploadFile) -> str:
    """
    Save a file to the configured storage (S3 or local)
    """
    file_content = await file.read()
    file_id = f"{uuid.uuid4()}-{file.filename}"
    
    # Check if using S3 or local storage
    if settings.S3_BUCKET_NAME and settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
        # Use S3
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=file_id,
            Body=file_content,
            ContentType=file.content_type,
        )
        
        file_path = f"s3://{settings.S3_BUCKET_NAME}/{file_id}"
    else:
        # Use local storage
        storage_dir = os.path.join(os.getcwd(), "storage")
        os.makedirs(storage_dir, exist_ok=True)
        
        file_path = os.path.join(storage_dir, file_id)
        with open(file_path, "wb") as f:
            f.write(file_content)
    
    await file.seek(0)  # Reset file pointer in case it's needed elsewhere
    return file_path


async def get_file_from_storage(file_path: str) -> Optional[BinaryIO]:
    """
    Get a file from the configured storage (S3 or local)
    """
    if file_path.startswith("s3://"):
        # Get from S3
        bucket_name, key = file_path[5:].split("/", 1)
        
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        
        response = s3_client.get_object(Bucket=bucket_name, Key=key)
        return response['Body']
    else:
        # Get from local storage
        if os.path.exists(file_path):
            return open(file_path, "rb")
        else:
            return None
