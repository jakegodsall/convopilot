from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..db.database import get_db
from ..schemas.user import UserResponse, UserUpdate, UserProfile
from ..services.user_service import UserService
from ..core.dependencies import get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's profile"""
    user_service = UserService(None)  # We already have the user object
    preferred_topics = user_service.parse_preferred_topics(current_user)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        native_language=current_user.native_language,
        target_language=current_user.target_language,
        proficiency_level=current_user.proficiency_level,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        last_login=current_user.last_login,
        preferred_topics=preferred_topics,
        learning_goals=current_user.learning_goals
    )

@router.put("/me", response_model=UserProfile)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    user_service = UserService(db)
    
    updated_user = user_service.update_user(current_user.id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    preferred_topics = user_service.parse_preferred_topics(updated_user)
    
    return UserProfile(
        id=updated_user.id,
        email=updated_user.email,
        username=updated_user.username,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        native_language=updated_user.native_language,
        target_language=updated_user.target_language,
        proficiency_level=updated_user.proficiency_level,
        is_active=updated_user.is_active,
        is_verified=updated_user.is_verified,
        created_at=updated_user.created_at,
        last_login=updated_user.last_login,
        preferred_topics=preferred_topics,
        learning_goals=updated_user.learning_goals
    )

@router.get("/profile-completion")
async def get_profile_completion(
    current_user: User = Depends(get_current_active_user)
):
    """Get profile completion percentage"""
    completion_score = 0
    total_fields = 8
    
    # Required fields (already have these from registration)
    completion_score += 6  # email, username, first_name, last_name, native_language, target_language
    
    # Optional fields
    if current_user.preferred_topics:
        completion_score += 1
    
    if current_user.learning_goals:
        completion_score += 1
    
    percentage = (completion_score / total_fields) * 100
    
    return {
        "completion_percentage": percentage,
        "completed_fields": completion_score,
        "total_fields": total_fields,
        "missing_fields": {
            "preferred_topics": not current_user.preferred_topics,
            "learning_goals": not current_user.learning_goals
        }
    }

@router.post("/deactivate")
async def deactivate_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Deactivate current user's account"""
    user_service = UserService(db)
    
    success = user_service.deactivate_user(current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deactivate account"
        )
    
    return {"message": "Account deactivated successfully"}

@router.get("/language-peers")
async def get_language_peers(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get other users learning the same target language"""
    user_service = UserService(db)
    
    peers = user_service.get_users_by_target_language(current_user.target_language)
    # Filter out current user
    peers = [peer for peer in peers if peer.id != current_user.id]
    
    # Return basic info only (privacy)
    return [
        {
            "id": peer.id,
            "username": peer.username,
            "proficiency_level": peer.proficiency_level,
            "native_language": peer.native_language,
            "created_at": peer.created_at
        }
        for peer in peers[:20]  # Limit to 20 peers
    ]

@router.get("/statistics")
async def get_user_statistics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's learning statistics"""
    from ..services.session_service import SessionService
    
    session_service = SessionService(db)
    stats = session_service.get_session_statistics(current_user.id)
    
    return {
        "user_id": current_user.id,
        "member_since": current_user.created_at,
        "last_activity": current_user.last_login,
        "session_stats": stats
    }
