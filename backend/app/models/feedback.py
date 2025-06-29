from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.database import Base
import enum

class FeedbackType(str, enum.Enum):
    SESSION_SUMMARY = "session_summary"
    GRAMMAR_CORRECTION = "grammar_correction"
    VOCABULARY_SUGGESTION = "vocabulary_suggestion"
    PRONUNCIATION_TIP = "pronunciation_tip"
    FLUENCY_ASSESSMENT = "fluency_assessment"

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("conversation_sessions.id"), nullable=True)
    
    # Feedback details
    feedback_type = Column(Enum(FeedbackType), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    
    # Specific analysis
    original_text = Column(Text, nullable=True)         # Original user text (if applicable)
    corrected_text = Column(Text, nullable=True)        # Corrected version
    explanation = Column(Text, nullable=True)           # Explanation of the correction/tip
    
    # Ratings and scores
    grammar_score = Column(Float, nullable=True)        # 0-100 grammar accuracy
    vocabulary_score = Column(Float, nullable=True)     # 0-100 vocabulary usage
    fluency_score = Column(Float, nullable=True)        # 0-100 fluency rating
    overall_score = Column(Float, nullable=True)        # 0-100 overall performance
    
    # Learning recommendations
    recommended_practice = Column(Text, nullable=True)   # JSON array of practice suggestions
    difficulty_adjustment = Column(String(20), nullable=True)  # "increase", "decrease", "maintain"
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="feedback_records")
    session = relationship("ConversationSession", back_populates="feedback_records") 