from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..core.config import settings

# Sync database setup
engine = create_engine(settings.database_url_sync, echo=True)

# Async database setup
async_engine = create_async_engine(settings.database_url_async, echo=True)
AsyncSessionLocal = sessionmaker(
    bind=async_engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base class for all models
Base = declarative_base()

# Function to create all tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependency to get database session
def get_db():
    with Session(engine) as session:
        yield session

# Async dependency to get database session
async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session 