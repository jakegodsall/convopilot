from fastapi import HTTPException
from sqlmodel import Session, select
from typing import Optional, List
from datetime import datetime
import json

from ..models.user import User, UserCreate, UserUpdate
from ..models.language import Language, UserLanguage
from ..core.security import get_password_hash, verify_password

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Hash the password
        hashed_password = get_password_hash(user_data.password)

        # Look up languages by code
        native_lang = self.db.exec(
            select(Language).where(Language.code == user_data.native_language)
        ).first()
        target_lang = self.db.exec(
            select(Language).where(Language.code == user_data.target_language)
        ).first()
        
        if not native_lang:
            raise HTTPException(status_code=400, detail=f"Invalid native language code: {user_data.native_language}")
        if not target_lang:
            raise HTTPException(status_code=400, detail=f"Invalid target language code: {user_data.target_language}")
        
        # Handle preferred topics
        preferred_topics_json = None
        if user_data.preferred_topics:
            preferred_topics_json = user_data.preferred_topics
        
        # Create user instance
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            native_language_id=native_lang.id,
            preferred_topics=preferred_topics_json,
            learning_goals=user_data.learning_goals,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        # Create user-language relationship for the target language
        user_language = UserLanguage(
            user_id=db_user.id,
            language_id=target_lang.id,
            proficiency_level=user_data.proficiency_level,
            is_current=True,
            started_learning_at=datetime.utcnow()
        )
        
        self.db.add(user_language)
        self.db.commit()
        self.db.refresh(user_language)
        
        # Refresh user to load relationships
        self.db.refresh(db_user)
        
        return db_user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        statement = select(User).where(User.email == email)
        return self.db.exec(statement).first()
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        statement = select(User).where(User.username == username)
        return self.db.exec(statement).first()
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.get(User, user_id)
    
    def check_email_availability(self, email: str) -> bool:
        """Check if email is available for registration"""
        user = self.get_user_by_email(email)
        return user is None
    
    def check_username_availability(self, username: str) -> bool:
        """Check if username is available for registration"""
        user = self.get_user_by_username(username)
        return user is None
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        
        # Update last login
        user.last_login = datetime.utcnow()
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        update_data = user_data.model_dump(exclude_unset=True)
        
        # Handle preferred_topics separately
        if "preferred_topics" in update_data:
            preferred_topics = update_data.pop("preferred_topics")
            if preferred_topics is not None:
                db_user.set_preferred_topics(preferred_topics)
        
        # Update other fields
        for field, value in update_data.items():
            if hasattr(db_user, field):
                setattr(db_user, field, value)
        
        db_user.updated_at = datetime.utcnow()
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def deactivate_user(self, user_id: int) -> Optional[User]:
        """Deactivate a user account"""
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        db_user.is_active = False
        db_user.updated_at = datetime.utcnow()
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def get_user_statistics(self, user_id: int) -> dict:
        """Get user statistics including session counts, etc."""
        user = self.get_user_by_id(user_id)
        if not user:
            return {}
        
        # Count sessions and messages
        session_count = len(user.sessions) if user.sessions else 0
        
        total_messages = 0
        total_duration = 0
        completed_sessions = 0
        
        if user.sessions:
            for session in user.sessions:
                total_messages += session.message_count
                if session.duration_minutes:
                    total_duration += session.duration_minutes
                if session.status.value == "completed":
                    completed_sessions += 1
        
        avg_duration = total_duration / max(completed_sessions, 1) if completed_sessions > 0 else 0
        
        return {
            "session_count": session_count,
            "total_messages": total_messages,
            "completed_sessions": completed_sessions,
            "average_session_duration": avg_duration,
            "account_created": user.created_at,
            "last_login": user.last_login,
            "proficiency_level": user.proficiency_level.value,
            "target_language": user.target_language
        } 