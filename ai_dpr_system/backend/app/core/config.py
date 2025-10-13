import os
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "DPR-AI"
    API_V1_STR: str = "/api/v1"
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecuresecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://frontend:3000"]
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Database settings
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/dprai"
    )
    
    # File storage settings
    S3_BUCKET_NAME: Optional[str] = os.getenv("S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: Optional[str] = os.getenv("AWS_REGION")
    
    # Identity and Authentication settings
    AUTH_PROVIDER: str = os.getenv("AUTH_PROVIDER", "jwt")  # Options: jwt, oauth, keycloak, azure_ad
    OAUTH_ISSUER_URL: Optional[str] = os.getenv("OAUTH_ISSUER_URL")
    OAUTH_CLIENT_ID: Optional[str] = os.getenv("OAUTH_CLIENT_ID")
    OAUTH_CLIENT_SECRET: Optional[str] = os.getenv("OAUTH_CLIENT_SECRET")
    
    # Platform as a Service settings
    PAAS_PROVIDER: Optional[str] = os.getenv("PAAS_PROVIDER")  # Options: aws, azure, gcp, nic
    PAAS_PROJECT_ID: Optional[str] = os.getenv("PAAS_PROJECT_ID")
    PAAS_REGION: Optional[str] = os.getenv("PAAS_REGION")
    PAAS_DEPLOY_ENV: str = os.getenv("PAAS_DEPLOY_ENV", "dev")
    
    # OCR and NLP settings
    OCR_ENGINE: str = "tesseract"
    NLP_MODEL_PATH: Optional[str] = os.getenv("NLP_MODEL_PATH")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()