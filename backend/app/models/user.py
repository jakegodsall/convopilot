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
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    native_language: str = Field(min_length=2, max_length=10)  # ISO 639-1 code
    target_language: str = Field(min_length=2, max_length=10)  # ISO 639-1 code
    proficiency_level: ProficiencyLevel
    preferred_topics: Optional[str] = Field(default=None)  # JSON string
    learning_goals: Optional[str] = Field(default=None)

# Database model
class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(max_length=255)
    
    # Account status
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    
    # Timestamps
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = Field(default=None)
    
    # Relationships
    sessions: List["ConversationSession"] = Relationship(back_populates="user")
    feedback_records: List["Feedback"] = Relationship(back_populates="user")
    
    def set_preferred_topics(self, topics: List[str]):
        """Helper method to set preferred topics as JSON string"""
        self.preferred_topics = json.dumps(topics) if topics else None
    
    def get_preferred_topics(self) -> List[str]:
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
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    native_language: Optional[str] = Field(default=None, min_length=2, max_length=10)
    target_language: Optional[str] = Field(default=None, min_length=2, max_length=10)
    proficiency_level: Optional[ProficiencyLevel] = None
    preferred_topics: Optional[List[str]] = None
    learning_goals: Optional[str] = None

class UserRead(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    preferred_topics: Optional[List[str]] = None

class UserReadWithStats(UserRead):
    """Extended user information with statistics"""
    session_count: Optional[int] = None
    total_messages: Optional[int] = None
    average_session_duration: Optional[float] = None

# Authentication schemas
class UserLogin(SQLModel):
    email: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(SQLModel):
    email: Optional[str] = None 