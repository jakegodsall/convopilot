from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from ..models.message import MessageType

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1)
    message_type: MessageType

class MessageCreate(MessageBase):
    session_id: int

class MessageResponse(MessageBase):
    id: int
    session_id: int
    detected_errors: Optional[List[Dict[str, Any]]] = None
    corrections: Optional[List[Dict[str, Any]]] = None
    complexity_score: Optional[int] = Field(None, ge=1, le=10)
    word_count: Optional[int] = None
    character_count: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MessageAnalysis(BaseModel):
    """Detailed analysis of a user message"""
    original_message: str
    detected_errors: List[Dict[str, Any]]
    corrections: List[Dict[str, Any]]
    complexity_score: int = Field(..., ge=1, le=10)
    suggestions: List[str]
    grammar_score: float = Field(..., ge=0, le=100)
    vocabulary_level: str

class ChatMessage(BaseModel):
    """Simple message format for chat interface"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    analysis: Optional[MessageAnalysis] = None 