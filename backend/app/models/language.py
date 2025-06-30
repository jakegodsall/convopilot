from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from .user import ProficiencyLevel

# Base Language model
class LanguageBase(SQLModel):
    code: str = Field(max_length=10, description="ISO 639-1 or custom language code")
    name: str = Field(max_length=100, description="Display name of the language")
    native_name: str = Field(max_length=100, description="Name in the language itself")
    is_active: bool = Field(default=True, description="Whether this language is available for learning")

# Database model
class Language(LanguageBase, table=True):
    __tablename__ = "languages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user_languages: List["UserLanguage"] = Relationship(back_populates="language")

# Junction table for User-Language many-to-many relationship
class UserLanguage(SQLModel, table=True):
    __tablename__ = "user_languages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    language_id: int = Field(foreign_key="languages.id")
    proficiency_level: ProficiencyLevel
    is_current: bool = Field(default=False, description="Is this the currently selected language for the user")
    
    # Timestamps
    started_learning_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    last_practiced_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="user_languages")
    language: Optional[Language] = Relationship(back_populates="user_languages")

# API Models
class LanguageCreate(LanguageBase):
    pass

class LanguageRead(LanguageBase):
    id: int
    created_at: datetime

class UserLanguageRead(SQLModel):
    id: int
    user_id: int
    language: LanguageRead
    proficiency_level: ProficiencyLevel
    is_current: bool
    started_learning_at: datetime
    last_practiced_at: Optional[datetime] = None 