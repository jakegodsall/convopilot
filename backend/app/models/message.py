from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.database import Base
import enum

class MessageType(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("conversation_sessions.id"), nullable=False)
    
    # Message content
    content = Column(Text, nullable=False)
    message_type = Column(Enum(MessageType), nullable=False)
    
    # Message analysis (for user messages)
    detected_errors = Column(Text, nullable=True)       # JSON string of grammar/vocabulary errors
    corrections = Column(Text, nullable=True)           # JSON string of suggested corrections
    complexity_score = Column(Integer, nullable=True)   # 1-10 complexity rating
    
    # Metadata
    word_count = Column(Integer, nullable=True)
    character_count = Column(Integer, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("ConversationSession", back_populates="messages") 