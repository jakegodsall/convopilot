from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum
import json

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
    native_language: str = Field(min_length=2, max_length=10)  # ISO 639-1 code
    target_language: str = Field(min_length=2, max_length=10)  # ISO 639-1 code
    proficiency_level: ProficiencyLevel
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
    sessions: list["ConversationSession"] = Relationship(back_populates="user")
    feedback_records: list["Feedback"] = Relationship(back_populates="user")
    
    def set_preferred_topics(self, topics: list[str]):
        """Helper method to set preferred topics as JSON string"""
        self.preferred_topics = json.dumps(topics) if topics else None
    
    def get_preferred_topics(self) -> list[str]:
        """Helper method to get preferred topics as list"""
        if self.preferred_topics:
            try:
                return json.loads(self.preferred_topics)
            except json.JSONDecodeError:
                return []
        return []

# API Models
class UserCreate(UserBase):
    password: str = Field(min_length=8)
    preferred_topics: Optional[List[str]] = None

class UserUpdate(SQLModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    native_language: str | None = Field(default=None, min_length=2, max_length=10)
    target_language: str | None = Field(default=None, min_length=2, max_length=10)
    proficiency_level: ProficiencyLevel | None = None
    preferred_topics: list[str] | None = None
    learning_goals: str | None = None

class UserRead(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: datetime | None = None
    preferred_topics: list[str] | None = None

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