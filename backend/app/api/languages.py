from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from app.db.database import get_db
from app.models.language import Language, LanguageRead

router = APIRouter(prefix="/api/languages", tags=["languages"])

@router.get("/", response_model=List[LanguageRead])
async def get_languages(db: Session = Depends(get_db)):
    """Get all active languages available for learning"""
    statement = select(Language).where(Language.is_active == True)
    languages = db.exec(statement).all()
    return languages