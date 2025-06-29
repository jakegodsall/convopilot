from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # App settings
    app_name: str = "ConvoPilot"
    debug: bool = False
    version: str = "1.0.0"
    
    # Database settings
    database_url: Optional[str] = None
    mysql_user: str = "root"
    mysql_password: str = "password"
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_database: str = "convopilot"
    
    # JWT settings
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS settings
    backend_cors_origins: list[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # LLM API settings (for future use)
    openai_api_key: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def database_url_sync(self) -> str:
        if self.database_url:
            return self.database_url
        return f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
    
    @property
    def database_url_async(self) -> str:
        if self.database_url:
            # Handle SQLite URLs
            if self.database_url.startswith("sqlite"):
                return self.database_url.replace("sqlite://", "sqlite+aiosqlite://")
            # Handle MySQL URLs
            return self.database_url.replace("mysql://", "mysql+aiomysql://")
        return f"mysql+aiomysql://{self.mysql_user}:{self.mysql_password}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"

settings = Settings() 