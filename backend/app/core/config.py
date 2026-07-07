import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # Firebase settings
    FIREBASE_PROJECT_ID: str = "mock-firebase-project-id"
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    
    # Gemini settings
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Intelligence Engine settings
    HOTSPOT_LOOKBACK_DAYS: int = 90   # Look-back window for hotspot detection
    HOTSPOT_THRESHOLD: int = 5        # Min issues in locality+category to flag hotspot

    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
