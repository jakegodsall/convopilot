from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from ..models.session import SessionStatus, DifficultyLevel

class SessionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    topic: str = Field(..., min_length=1, max_length=100)
    difficulty_level: DifficultyLevel
    conversation_context: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class SessionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    topic: Optional[str] = Field(None, min_length=1, max_length=100)
    difficulty_level: Optional[DifficultyLevel] = None
    conversation_context: Optional[str] = None
    status: Optional[SessionStatus] = None

class SessionResponse(SessionBase):
    id: int
    user_id: int
    target_language: str
    status: SessionStatus
    duration_minutes: Optional[float] = None
    message_count: int
    user_message_count: int
    created_at: datetime
    updated_at: datetime
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SessionWithMessages(SessionResponse):
    """Session with full conversation data"""
    full_conversation: Optional[List[Dict[str, Any]]] = None

class SessionSummary(BaseModel):
    """Brief session information for lists"""
    id: int
    title: str
    topic: str
    difficulty_level: DifficultyLevel
    status: SessionStatus
    message_count: int
    duration_minutes: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True 