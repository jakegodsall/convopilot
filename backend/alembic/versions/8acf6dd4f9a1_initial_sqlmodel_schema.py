"""Initial SQLModel schema

Revision ID: 8acf6dd4f9a1
Revises: 
Create Date: 2025-06-30 11:35:17.543542

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision: str = '8acf6dd4f9a1'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create languages table first (no dependencies)
    op.create_table('languages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(10), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('native_name', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    
    # Create users table (depends on languages)
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=True),
        sa.Column('last_name', sa.String(100), nullable=True),
        sa.Column('native_language_id', sa.Integer(), nullable=False),
        sa.Column('preferred_topics', sa.Text(), nullable=True),
        sa.Column('learning_goals', sa.Text(), nullable=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['native_language_id'], ['languages.id'], name='fk_users_native_language'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    
    # Create indexes for users
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_username', 'users', ['username'])
    
    # Create user_languages junction table (depends on users and languages)
    op.create_table('user_languages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('language_id', sa.Integer(), nullable=False),
        sa.Column('proficiency_level', sa.Enum('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient', name='proficiencylevel'), nullable=False),
        sa.Column('is_current', sa.Boolean(), nullable=False, default=False),
        sa.Column('started_learning_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.Column('last_practiced_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_user_languages_user'),
        sa.ForeignKeyConstraint(['language_id'], ['languages.id'], name='fk_user_languages_language'),
        sa.UniqueConstraint('user_id', 'language_id', name='uq_user_language')
    )
    
    # Create conversation_sessions table (depends on users and languages)
    op.create_table('conversation_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('topic', sa.String(100), nullable=False),
        sa.Column('difficulty_level', sa.Enum('easy', 'medium', 'hard', name='difficultylevel'), nullable=False),
        sa.Column('target_language_id', sa.Integer(), nullable=False),
        sa.Column('conversation_context', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('full_conversation', sa.Text(), nullable=True),
        sa.Column('duration_minutes', sa.Float(), nullable=True),
        sa.Column('message_count', sa.Integer(), nullable=False, default=0),
        sa.Column('user_message_count', sa.Integer(), nullable=False, default=0),
        sa.Column('status', sa.Enum('active', 'completed', 'paused', 'cancelled', name='sessionstatus'), nullable=False, default='active'),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('ended_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_conversation_sessions_user'),
        sa.ForeignKeyConstraint(['target_language_id'], ['languages.id'], name='fk_conversation_sessions_language')
    )
    
    # Create messages table (depends on conversation_sessions)
    op.create_table('messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('message_type', sa.Enum('user', 'assistant', 'system', name='messagetype'), nullable=False),
        sa.Column('word_count', sa.Integer(), nullable=True),
        sa.Column('character_count', sa.Integer(), nullable=True),
        sa.Column('session_id', sa.Integer(), nullable=False),
        sa.Column('detected_errors', sa.Text(), nullable=True),
        sa.Column('corrections', sa.Text(), nullable=True),
        sa.Column('complexity_score', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['session_id'], ['conversation_sessions.id'], name='fk_messages_session'),
        sa.CheckConstraint('complexity_score >= 1 AND complexity_score <= 10', name='ck_messages_complexity_score')
    )
    
    # Create feedback table (depends on users and conversation_sessions)
    op.create_table('feedback',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('feedback_type', sa.Enum('session_summary', 'grammar_correction', 'vocabulary_suggestion', 'pronunciation_tip', 'fluency_assessment', name='feedbacktype'), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('original_text', sa.Text(), nullable=True),
        sa.Column('corrected_text', sa.Text(), nullable=True),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=True),
        sa.Column('grammar_score', sa.Float(), nullable=True),
        sa.Column('vocabulary_score', sa.Float(), nullable=True),
        sa.Column('fluency_score', sa.Float(), nullable=True),
        sa.Column('overall_score', sa.Float(), nullable=True),
        sa.Column('recommended_practice', sa.Text(), nullable=True),
        sa.Column('difficulty_adjustment', sa.String(20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=sa.func.current_timestamp()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_feedback_user'),
        sa.ForeignKeyConstraint(['session_id'], ['conversation_sessions.id'], name='fk_feedback_session'),
        sa.CheckConstraint('grammar_score >= 0 AND grammar_score <= 100', name='ck_feedback_grammar_score'),
        sa.CheckConstraint('vocabulary_score >= 0 AND vocabulary_score <= 100', name='ck_feedback_vocabulary_score'),
        sa.CheckConstraint('fluency_score >= 0 AND fluency_score <= 100', name='ck_feedback_fluency_score'),
        sa.CheckConstraint('overall_score >= 0 AND overall_score <= 100', name='ck_feedback_overall_score')
    )
    
    # Insert default languages
    languages_table = sa.table('languages',
        sa.column('code', sa.String),
        sa.column('name', sa.String),
        sa.column('native_name', sa.String),
        sa.column('is_active', sa.Boolean),
        sa.column('created_at', sa.DateTime)
    )
    
    now = datetime.utcnow()
    languages_data = [
        {'code': 'en', 'name': 'English', 'native_name': 'English', 'is_active': True, 'created_at': now},
        {'code': 'es', 'name': 'Spanish', 'native_name': 'Español', 'is_active': True, 'created_at': now},
        {'code': 'fr', 'name': 'French', 'native_name': 'Français', 'is_active': True, 'created_at': now},
        {'code': 'de', 'name': 'German', 'native_name': 'Deutsch', 'is_active': True, 'created_at': now},
        {'code': 'it', 'name': 'Italian', 'native_name': 'Italiano', 'is_active': True, 'created_at': now},
        {'code': 'pt', 'name': 'Portuguese', 'native_name': 'Português', 'is_active': True, 'created_at': now},
        {'code': 'ru', 'name': 'Russian', 'native_name': 'Русский', 'is_active': True, 'created_at': now},
        {'code': 'ja', 'name': 'Japanese', 'native_name': '日本語', 'is_active': True, 'created_at': now},
        {'code': 'ko', 'name': 'Korean', 'native_name': '한국어', 'is_active': True, 'created_at': now},
        {'code': 'zh', 'name': 'Chinese', 'native_name': '中文', 'is_active': True, 'created_at': now},
        {'code': 'ar', 'name': 'Arabic', 'native_name': 'العربية', 'is_active': True, 'created_at': now},
        {'code': 'hi', 'name': 'Hindi', 'native_name': 'हिन्दी', 'is_active': True, 'created_at': now},
        {'code': 'nl', 'name': 'Dutch', 'native_name': 'Nederlands', 'is_active': True, 'created_at': now},
        {'code': 'pl', 'name': 'Polish', 'native_name': 'Polski', 'is_active': True, 'created_at': now},
        {'code': 'sv', 'name': 'Swedish', 'native_name': 'Svenska', 'is_active': True, 'created_at': now},
        {'code': 'da', 'name': 'Danish', 'native_name': 'Dansk', 'is_active': True, 'created_at': now},
        {'code': 'no', 'name': 'Norwegian', 'native_name': 'Norsk', 'is_active': True, 'created_at': now},
        {'code': 'fi', 'name': 'Finnish', 'native_name': 'Suomi', 'is_active': True, 'created_at': now},
    ]
    
    op.bulk_insert(languages_table, languages_data)


def downgrade() -> None:
    # Drop tables in reverse order to respect foreign key constraints
    op.drop_table('feedback')
    op.drop_table('messages')
    op.drop_table('conversation_sessions')
    op.drop_table('user_languages')
    
    # Drop indexes before dropping users table
    op.drop_index('ix_users_username', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
    
    op.drop_table('languages')