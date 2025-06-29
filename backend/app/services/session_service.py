from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from typing import Optional, List
from datetime import datetime, timedelta
import json

from ..models.session import ConversationSession, SessionStatus
from ..models.user import User
from ..schemas.session import SessionCreate, SessionUpdate

class SessionService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_session(self, user_id: int, session_data: SessionCreate) -> ConversationSession:
        """Create a new conversation session"""
        # Get user to determine target language
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        db_session = ConversationSession(
            user_id=user_id,
            title=session_data.title,
            topic=session_data.topic,
            difficulty_level=session_data.difficulty_level,
            target_language=user.target_language,
            conversation_context=session_data.conversation_context,
            status=SessionStatus.ACTIVE,
            started_at=datetime.utcnow()
        )
        
        self.db.add(db_session)
        self.db.commit()
        self.db.refresh(db_session)
        return db_session
    
    def get_session_by_id(self, session_id: int) -> Optional[ConversationSession]:
        """Get session by ID"""
        return self.db.query(ConversationSession).filter(
            ConversationSession.id == session_id
        ).first()
    
    def get_user_session(self, session_id: int, user_id: int) -> Optional[ConversationSession]:
        """Get session by ID for a specific user"""
        return self.db.query(ConversationSession).filter(
            and_(
                ConversationSession.id == session_id,
                ConversationSession.user_id == user_id
            )
        ).first()
    
    def get_user_sessions(self, user_id: int, limit: int = 50, offset: int = 0) -> List[ConversationSession]:
        """Get all sessions for a user"""
        return self.db.query(ConversationSession).filter(
            ConversationSession.user_id == user_id
        ).order_by(desc(ConversationSession.created_at)).offset(offset).limit(limit).all()
    
    def get_active_sessions(self, user_id: int) -> List[ConversationSession]:
        """Get active sessions for a user"""
        return self.db.query(ConversationSession).filter(
            and_(
                ConversationSession.user_id == user_id,
                ConversationSession.status == SessionStatus.ACTIVE
            )
        ).order_by(desc(ConversationSession.updated_at)).all()
    
    def update_session(self, session_id: int, user_id: int, session_data: SessionUpdate) -> Optional[ConversationSession]:
        """Update session information"""
        db_session = self.get_user_session(session_id, user_id)
        if not db_session:
            return None
        
        update_data = session_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_session, field, value)
        
        self.db.commit()
        self.db.refresh(db_session)
        return db_session
    
    def end_session(self, session_id: int, user_id: int) -> Optional[ConversationSession]:
        """End a session and calculate duration"""
        db_session = self.get_user_session(session_id, user_id)
        if not db_session:
            return None
        
        now = datetime.utcnow()
        db_session.status = SessionStatus.COMPLETED
        db_session.ended_at = now
        
        # Calculate duration if started_at is available
        if db_session.started_at:
            duration = now - db_session.started_at
            db_session.duration_minutes = duration.total_seconds() / 60
        
        self.db.commit()
        self.db.refresh(db_session)
        return db_session
    
    def pause_session(self, session_id: int, user_id: int) -> Optional[ConversationSession]:
        """Pause a session"""
        db_session = self.get_user_session(session_id, user_id)
        if not db_session:
            return None
        
        db_session.status = SessionStatus.PAUSED
        self.db.commit()
        self.db.refresh(db_session)
        return db_session
    
    def resume_session(self, session_id: int, user_id: int) -> Optional[ConversationSession]:
        """Resume a paused session"""
        db_session = self.get_user_session(session_id, user_id)
        if not db_session:
            return None
        
        db_session.status = SessionStatus.ACTIVE
        self.db.commit()
        self.db.refresh(db_session)
        return db_session
    
    def update_conversation(self, session_id: int, conversation_data: List[dict]) -> bool:
        """Update the full conversation data for a session"""
        db_session = self.get_session_by_id(session_id)
        if not db_session:
            return False
        
        db_session.full_conversation = json.dumps(conversation_data)
        self.db.commit()
        return True
    
    def increment_message_count(self, session_id: int, is_user_message: bool = False) -> bool:
        """Increment message counters for a session"""
        db_session = self.get_session_by_id(session_id)
        if not db_session:
            return False
        
        db_session.message_count += 1
        if is_user_message:
            db_session.user_message_count += 1
        
        self.db.commit()
        return True
    
    def get_session_statistics(self, user_id: int, days: int = 30) -> dict:
        """Get session statistics for a user over a period"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        sessions = self.db.query(ConversationSession).filter(
            and_(
                ConversationSession.user_id == user_id,
                ConversationSession.created_at >= start_date
            )
        ).all()
        
        total_sessions = len(sessions)
        completed_sessions = len([s for s in sessions if s.status == SessionStatus.COMPLETED])
        total_messages = sum(s.message_count for s in sessions)
        total_duration = sum(s.duration_minutes or 0 for s in sessions)
        
        # Topic distribution
        topics = {}
        for session in sessions:
            topics[session.topic] = topics.get(session.topic, 0) + 1
        
        return {
            "total_sessions": total_sessions,
            "completed_sessions": completed_sessions,
            "total_messages": total_messages,
            "total_duration_minutes": total_duration,
            "average_session_duration": total_duration / max(completed_sessions, 1),
            "topic_distribution": topics,
            "period_days": days
        }
    
    def parse_conversation(self, session: ConversationSession) -> List[dict]:
        """Parse conversation JSON data"""
        if not session.full_conversation:
            return []
        try:
            return json.loads(session.full_conversation)
        except json.JSONDecodeError:
            return [] 