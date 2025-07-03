from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from enum import Enum
from typing import List, Optional, TYPE_CHECKING
import json

if TYPE_CHECKING:
    from .language import Language, LanguageRead, UserLanguage, UserLanguageRead

class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary"
    INTERMEDIATE = "intermediate"
    UPPER_INTERMEDIATE = "upper_intermediate"
    ADVANCED = "advanced"
    PROFICIENT = "proficient"

# Base User model (shared fields)
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, min_length=3, max_length=50)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    native_language_id: int = Field(foreign_key="languages.id")
    preferred_topics: str | None = Field(default=None)  # JSON string
    learning_goals: str | None = Field(default=None)

# Database model
class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field(max_length=255)
    
    # Account status
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime | None = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = Field(default_factory=datetime.utcnow)
    last_login: datetime | None = Field(default=None)
    
    # Relationships
    sessions: List["ConversationSession"] = Relationship(back_populates="user")
    feedback_records: List["Feedback"] = Relationship(back_populates="user")
    native_language: Optional["Language"] = Relationship()
    user_languages: List["UserLanguage"] = Relationship(back_populates="user")
    
    def get_preferred_topics(self) -> list[str]:
        """Helper method to get preferred topics as list"""
        if self.preferred_topics:
            try:
                return json.loads(self.preferred_topics)
            except json.JSONDecodeError:
                return []
        return []

# API Models
class UserCreate(SQLModel):
    # Account details
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, min_length=3, max_length=50)
    password: str = Field(min_length=8)
    
    # Personal details (optional for now)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    
    # Language details (using codes, will be converted to IDs)
    native_language: str = Field(min_length=2, max_length=10, description="Language code like 'en', 'es'")
    target_language: str = Field(min_length=2, max_length=10, description="Language code like 'en', 'es'")
    proficiency_level: ProficiencyLevel
    
    # Optional fields
    preferred_topics: str | None = Field(default=None, description="JSON string of preferred topics")
    learning_goals: str | None = Field(default=None)

class UserUpdate(SQLModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    native_language_id: int | None = None
    preferred_topics: List[str] | None = None
    learning_goals: str | None = None

class UserRead(SQLModel):
    id: int
    email: str
    username: str
    first_name: str | None = None
    last_name: str | None = None
    native_language: Optional["LanguageRead"] = None
    current_language: Optional["UserLanguageRead"] = None
    learning_languages: List["UserLanguageRead"] = []
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: datetime | None = None
    preferred_topics: List[str] | None = None
    learning_goals: str | None = None

class UserReadWithStats(UserRead):
    """Extended user information with statistics"""
    session_count: int | None = None
    total_messages: int | None = None
    average_session_duration: float | None = None

# Authentication schemas
class UserLogin(SQLModel):
    email: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(SQLModel):
    email: str | None = None 