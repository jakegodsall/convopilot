from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from datetime import timedelta

from ..db.database import get_db
from ..models.user import UserCreate, UserLogin, Token, UserRead
from ..services.user_service import UserService
from ..core.security import create_access_token
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserRead)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    user_service = UserService(db)
    
    # Check if email already exists
    if not user_service.check_email_availability(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    if not user_service.check_username_availability(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    try:
        user = user_service.create_user(user_data)
        
        # Return user data with preferred topics as list
        return UserRead(
            id=user.id,
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            native_language=user.native_language,
            target_language=user.target_language,
            proficiency_level=user.proficiency_level,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            last_login=user.last_login,
            preferred_topics=user.get_preferred_topics(),
            learning_goals=user.learning_goals
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    user_service = UserService(db)
    
    # Authenticate user
    user = user_service.authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@router.post("/check-email")
async def check_email_availability(email: str, db: Session = Depends(get_db)):
    """Check if email is available for registration"""
    user_service = UserService(db)
    is_available = user_service.check_email_availability(email)
    return {"email": email, "available": is_available}

@router.post("/check-username")
async def check_username_availability(username: str, db: Session = Depends(get_db)):
    """Check if username is available for registration"""
    user_service = UserService(db)
    is_available = user_service.check_username_availability(username)
    return {"username": username, "available": is_available} 