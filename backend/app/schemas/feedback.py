from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from ..models.feedback import FeedbackType

class FeedbackBase(BaseModel):
    feedback_type: FeedbackType
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)

class FeedbackCreate(FeedbackBase):
    session_id: Optional[int] = None
    original_text: Optional[str] = None
    corrected_text: Optional[str] = None
    explanation: Optional[str] = None

class FeedbackResponse(FeedbackBase):
    id: int
    user_id: int
    session_id: Optional[int] = None
    original_text: Optional[str] = None
    corrected_text: Optional[str] = None
    explanation: Optional[str] = None
    grammar_score: Optional[float] = Field(None, ge=0, le=100)
    vocabulary_score: Optional[float] = Field(None, ge=0, le=100)
    fluency_score: Optional[float] = Field(None, ge=0, le=100)
    overall_score: Optional[float] = Field(None, ge=0, le=100)
    recommended_practice: Optional[List[str]] = None
    difficulty_adjustment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SessionFeedback(BaseModel):
    """Comprehensive feedback for a completed session"""
    session_id: int
    overall_performance: Dict[str, float]  # scores for different aspects
    key_improvements: List[str]
    areas_to_focus: List[str]
    grammar_analysis: Dict[str, Any]
    vocabulary_analysis: Dict[str, Any]
    fluency_analysis: Dict[str, Any]
    recommended_next_steps: List[str]
    difficulty_recommendation: str  # "increase", "maintain", "decrease"

class LearningProgress(BaseModel):
    """User's learning progress over time"""
    user_id: int
    period_start: datetime
    period_end: datetime
    total_sessions: int
    total_messages: int
    average_session_duration: float
    grammar_trend: List[float]  # scores over time
    vocabulary_trend: List[float]
    fluency_trend: List[float]
    most_common_errors: List[Dict[str, Any]]
    improvement_areas: List[str] 