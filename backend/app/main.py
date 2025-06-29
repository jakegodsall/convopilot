from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from .core.config import settings
from .api import auth, users
from .db.database import engine, create_db_and_tables

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup using SQLModel
    create_db_and_tables()
    yield
    # Cleanup on shutdown (if needed)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="A language learning platform for improving conversation skills through AI-powered interactions",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.app_name} API",
        "version": settings.version,
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "app": settings.app_name}

# Global exception handler
@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )