from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import json

class FeedbackType(str, Enum):
    SESSION_SUMMARY = "session_summary"
    GRAMMAR_CORRECTION = "grammar_correction"
    VOCABULARY_SUGGESTION = "vocabulary_suggestion"
    PRONUNCIATION_TIP = "pronunciation_tip"
    FLUENCY_ASSESSMENT = "fluency_assessment"

# Base feedback model
class FeedbackBase(SQLModel):
    feedback_type: FeedbackType
    title: str = Field(max_length=200)
    content: str
    original_text: Optional[str] = Field(default=None)
    corrected_text: Optional[str] = Field(default=None)
    explanation: Optional[str] = Field(default=None)

# Database model
class Feedback(FeedbackBase, table=True):
    __tablename__ = "feedback"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    session_id: Optional[int] = Field(foreign_key="conversation_sessions.id", default=None)
    
    # Ratings and scores
    grammar_score: Optional[float] = Field(default=None, ge=0, le=100)
    vocabulary_score: Optional[float] = Field(default=None, ge=0, le=100)
    fluency_score: Optional[float] = Field(default=None, ge=0, le=100)
    overall_score: Optional[float] = Field(default=None, ge=0, le=100)
    
    # Learning recommendations
    recommended_practice: Optional[str] = Field(default=None)  # JSON array
    difficulty_adjustment: Optional[str] = Field(default=None, max_length=20)  # "increase", "decrease", "maintain"
    
    # Timestamps
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="feedback_records")
    session: Optional["ConversationSession"] = Relationship(back_populates="feedback_records")
    
    def set_recommended_practice(self, practices: List[str]):
        """Helper method to set recommended practice as JSON string"""
        self.recommended_practice = json.dumps(practices) if practices else None
    
    def get_recommended_practice(self) -> List[str]:
        """Helper method to get recommended practice as list"""
        if self.recommended_practice:
            try:
                return json.loads(self.recommended_practice)
            except json.JSONDecodeError:
                return []
        return []

# API Models
class FeedbackCreate(FeedbackBase):
    user_id: int
    session_id: Optional[int] = None
    grammar_score: Optional[float] = Field(default=None, ge=0, le=100)
    vocabulary_score: Optional[float] = Field(default=None, ge=0, le=100)
    fluency_score: Optional[float] = Field(default=None, ge=0, le=100)
    overall_score: Optional[float] = Field(default=None, ge=0, le=100)
    recommended_practice: Optional[List[str]] = None
    difficulty_adjustment: Optional[str] = None

class FeedbackUpdate(SQLModel):
    title: Optional[str] = Field(default=None, max_length=200)
    content: Optional[str] = None
    corrected_text: Optional[str] = None
    explanation: Optional[str] = None
    grammar_score: Optional[float] = Field(default=None, ge=0, le=100)
    vocabulary_score: Optional[float] = Field(default=None, ge=0, le=100)
    fluency_score: Optional[float] = Field(default=None, ge=0, le=100)
    overall_score: Optional[float] = Field(default=None, ge=0, le=100)
    recommended_practice: Optional[List[str]] = None
    difficulty_adjustment: Optional[str] = None

class FeedbackRead(FeedbackBase):
    id: int
    user_id: int
    session_id: Optional[int] = None
    grammar_score: Optional[float] = None
    vocabulary_score: Optional[float] = None
    fluency_score: Optional[float] = None
    overall_score: Optional[float] = None
    recommended_practice: Optional[List[str]] = None
    difficulty_adjustment: Optional[str] = None
    created_at: datetime

class FeedbackSummary(SQLModel):
    """Summary model for dashboard/analytics"""
    feedback_type: FeedbackType
    count: int
    average_grammar_score: Optional[float] = None
    average_vocabulary_score: Optional[float] = None
    average_fluency_score: Optional[float] = None
    average_overall_score: Optional[float] = None 