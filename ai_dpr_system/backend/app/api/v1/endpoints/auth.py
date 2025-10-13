from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from pydantic import BaseModel, ValidationError

from app.core.auth import authenticate_user, create_access_token, create_refresh_token, get_current_active_user
from app.core.config import settings
from app.schemas.token import Token, TokenPayload
from app.schemas.user import User, UserCreate

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Print debug info
    print(f"Login attempt: {form_data.username}")
    
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    return {
        "access_token": create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        ),
        "refresh_token": create_refresh_token(
            subject=str(user.id), expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


class LoginInput(BaseModel):
    email: str
    password: str


@router.post("/login-json", response_model=Token)
async def login_json(
    login_data: LoginInput,
) -> Any:
    """
    JSON-based login endpoint for frontend clients
    """
    # Print debug info
    print(f"JSON Login attempt: {login_data.email}")
    
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    return {
        "access_token": create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        ),
        "refresh_token": create_refresh_token(
            subject=str(user.id), expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str) -> Any:
    """
    Refresh token endpoint
    """
    try:
        payload = TokenPayload.parse_obj(
            jwt.decode(
                refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
        )
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid refresh token",
        )
    
    # Here you would typically check if the refresh token is in your blacklist/database
    # and also update the refresh token in the database if needed
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    return {
        "access_token": create_access_token(
            subject=payload.sub, expires_delta=access_token_expires
        ),
        "refresh_token": create_refresh_token(
            subject=payload.sub, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/register", response_model=User)
async def register_user(user_in: UserCreate) -> Any:
    """
    Register a new user
    """
    # Print debug info
    print(f"Register attempt for: {user_in.email}, {user_in.full_name}")
    
    # Check if email already exists
    from app.core.user_store import get_registered_user, register_user as store_user
    
    if get_registered_user(user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Register the user in our simple in-memory store
    user_data = store_user(
        email=user_in.email,
        password=user_in.password,  # In production, this would be hashed!
        full_name=user_in.full_name,
        department=user_in.department,
        is_admin=user_in.is_admin if hasattr(user_in, 'is_admin') else False,
        is_reviewer=user_in.is_reviewer if hasattr(user_in, 'is_reviewer') else False
    )
    
    # Return the user object
    return User(
        id=user_data['id'],
        email=user_data['email'],
        full_name=user_data['full_name'],
        department=user_data['department'],
        is_admin=user_data['is_admin'],
        is_active=True
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Logout endpoint - typically would blacklist the token
    """
    # Implementation will depend on your token management system
    return {"detail": "Successfully logged out"}