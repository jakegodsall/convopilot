from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.database import Base
import enum

class SessionStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class DifficultyLevel(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class ConversationSession(Base):
    __tablename__ = "conversation_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session details
    title = Column(String(200), nullable=False)
    topic = Column(String(100), nullable=False)  # e.g., "travel", "business", "casual"
    difficulty_level = Column(Enum(DifficultyLevel), nullable=False)
    target_language = Column(String(10), nullable=False)  # ISO 639-1 code
    
    # Session content
    conversation_context = Column(Text, nullable=True)  # Initial context/scenario
    full_conversation = Column(Text, nullable=True)     # JSON string of the full conversation
    
    # Session metrics
    duration_minutes = Column(Float, nullable=True)     # Session duration
    message_count = Column(Integer, default=0)          # Number of messages exchanged
    user_message_count = Column(Integer, default=0)     # User messages only
    
    # Session status
    status = Column(Enum(SessionStatus), default=SessionStatus.ACTIVE)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session")
    feedback_records = relationship("Feedback", back_populates="session") 