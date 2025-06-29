from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional, Union
import os

class Settings(BaseSettings):
    # App settings
    app_name: str = "ConvoPilot"
    debug: bool = False
    version: str = "1.0.0"
    
    # Database settings - Default to Docker MySQL settings
    database_url: Optional[str] = None
    mysql_user: str = "convopilot_user"
    mysql_password: str = "convopilot_pass"
    mysql_host: str = "localhost"  # Use localhost when connecting from host, mysql when from container
    mysql_port: int = 3306
    mysql_database: str = "convopilot"
    
    # JWT settings
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS settings
    backend_cors_origins: list[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    @field_validator('backend_cors_origins', mode='before')
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> Union[str, list[str]]:
        if isinstance(v, str) and not v.startswith('['):
            return [i.strip() for i in v.split(',')]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
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
            # Handle MySQL URLs
            if self.database_url.startswith("mysql://"):
                return self.database_url.replace("mysql://", "mysql+aiomysql://")
            elif self.database_url.startswith("mysql+pymysql://"):
                return self.database_url.replace("mysql+pymysql://", "mysql+aiomysql://")
            return self.database_url
        return f"mysql+aiomysql://{self.mysql_user}:{self.mysql_password}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"

settings = Settings() 