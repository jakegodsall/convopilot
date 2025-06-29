from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import json

class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

# Base message model
class MessageBase(SQLModel):
    content: str
    message_type: MessageType
    word_count: Optional[int] = Field(default=None)
    character_count: Optional[int] = Field(default=None)

# Database model
class Message(MessageBase, table=True):
    __tablename__ = "messages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="conversation_sessions.id")
    
    # Message analysis (for user messages)
    detected_errors: Optional[str] = Field(default=None)  # JSON string of errors
    corrections: Optional[str] = Field(default=None)      # JSON string of corrections
    complexity_score: Optional[int] = Field(default=None, ge=1, le=10)  # 1-10 rating
    
    # Timestamps
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Relationships
    session: Optional["ConversationSession"] = Relationship(back_populates="messages")
    
    def set_detected_errors(self, errors: List[Dict[str, Any]]):
        """Helper method to set detected errors as JSON string"""
        self.detected_errors = json.dumps(errors) if errors else None
    
    def get_detected_errors(self) -> List[Dict[str, Any]]:
        """Helper method to get detected errors as list"""
        if self.detected_errors:
            try:
                return json.loads(self.detected_errors)
            except json.JSONDecodeError:
                return []
        return []
    
    def set_corrections(self, corrections: List[Dict[str, Any]]):
        """Helper method to set corrections as JSON string"""
        self.corrections = json.dumps(corrections) if corrections else None
    
    def get_corrections(self) -> List[Dict[str, Any]]:
        """Helper method to get corrections as list"""
        if self.corrections:
            try:
                return json.loads(self.corrections)
            except json.JSONDecodeError:
                return []
        return []

# API Models
class MessageCreate(MessageBase):
    session_id: int

class MessageUpdate(SQLModel):
    content: Optional[str] = None
    detected_errors: Optional[List[Dict[str, Any]]] = None
    corrections: Optional[List[Dict[str, Any]]] = None
    complexity_score: Optional[int] = Field(default=None, ge=1, le=10)

class MessageRead(MessageBase):
    id: int
    session_id: int
    complexity_score: Optional[int] = None
    created_at: datetime
    detected_errors: Optional[List[Dict[str, Any]]] = None
    corrections: Optional[List[Dict[str, Any]]] = None

class MessageAnalysis(SQLModel):
    """Separate model for message analysis results"""
    message_id: int
    detected_errors: List[Dict[str, Any]]
    corrections: List[Dict[str, Any]]
    complexity_score: int
    suggestions: Optional[List[str]] = None 