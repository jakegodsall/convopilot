from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.database import Base
import enum

class ProficiencyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary"
    INTERMEDIATE = "intermediate"
    UPPER_INTERMEDIATE = "upper_intermediate"
    ADVANCED = "advanced"
    PROFICIENT = "proficient"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    # Language learning specific fields
    native_language = Column(String(10), nullable=False)  # ISO 639-1 code (e.g., 'en', 'es')
    target_language = Column(String(10), nullable=False)  # ISO 639-1 code
    proficiency_level = Column(Enum(ProficiencyLevel), nullable=False)
    
    # User preferences
    preferred_topics = Column(Text, nullable=True)  # JSON string of preferred conversation topics
    learning_goals = Column(Text, nullable=True)   # User's learning objectives
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    sessions = relationship("ConversationSession", back_populates="user")
    feedback_records = relationship("Feedback", back_populates="user") 