from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from datetime import datetime
from enum import Enum
import json

if TYPE_CHECKING:
    from .language import Language

class SessionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

# Base session model
class ConversationSessionBase(SQLModel):
    title: str = Field(max_length=200)
    topic: str = Field(max_length=100)  # e.g., "travel", "business", "casual"
    difficulty_level: DifficultyLevel
    target_language_id: int = Field(foreign_key="languages.id")
    conversation_context: Optional[str] = Field(default=None)  # Initial context/scenario

# Database model
class ConversationSession(ConversationSessionBase, table=True):
    __tablename__ = "conversation_sessions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    
    # Session content
    full_conversation: Optional[str] = Field(default=None)  # JSON string of full conversation
    
    # Session metrics
    duration_minutes: Optional[float] = Field(default=None)
    message_count: int = Field(default=0)
    user_message_count: int = Field(default=0)
    
    # Session status
    status: SessionStatus = Field(default=SessionStatus.ACTIVE)
    
    # Timestamps
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = Field(default=None)
    ended_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="sessions")
    messages: List["Message"] = Relationship(back_populates="session")
    feedback_records: List["Feedback"] = Relationship(back_populates="session")
    target_language: Optional["Language"] = Relationship()
    
    def set_conversation(self, conversation: List[Dict[str, Any]]):
        """Helper method to set full conversation as JSON string"""
        self.full_conversation = json.dumps(conversation) if conversation else None
    
    def get_conversation(self) -> List[Dict[str, Any]]:
        """Helper method to get conversation as list of dicts"""
        if self.full_conversation:
            try:
                return json.loads(self.full_conversation)
            except json.JSONDecodeError:
                return []
        return []

# API Models
class ConversationSessionCreate(ConversationSessionBase):
    # For backward compatibility, accept target language code
    target_language_code: Optional[str] = Field(default=None, max_length=10)

class ConversationSessionUpdate(SQLModel):
    title: Optional[str] = Field(default=None, max_length=200)
    topic: Optional[str] = Field(default=None, max_length=100)
    difficulty_level: Optional[DifficultyLevel] = None
    conversation_context: Optional[str] = None
    status: Optional[SessionStatus] = None
    ended_at: Optional[datetime] = None

class ConversationSessionRead(ConversationSessionBase):
    id: int
    user_id: int
    status: SessionStatus
    duration_minutes: Optional[float] = None
    message_count: int
    user_message_count: int
    created_at: datetime
    updated_at: datetime
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

class ConversationSessionReadWithMessages(ConversationSessionRead):
    messages: List["MessageRead"] = []
    conversation: Optional[List[Dict[str, Any]]] = None

class ConversationSessionSummary(SQLModel):
    id: int
    title: str
    topic: str
    difficulty_level: DifficultyLevel
    status: SessionStatus
    duration_minutes: Optional[float] = None
    message_count: int
    created_at: datetime 