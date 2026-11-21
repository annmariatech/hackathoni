"""
Payal-to-Pay — Backend Configuration
Reads settings from environment variables and .env file.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DATABASE_URL: str = "sqlite:///./payal.db"

    # Sarvam AI
    SARVAM_API_KEY: Optional[str] = None
    MOCK_VOICE: bool = False

    # Open-Meteo
    OPEN_METEO_LATITUDE: float = 9.4981
    OPEN_METEO_LONGITUDE: float = 76.3388

    # Geo AOI
    AOI_BBOX: str = "76.33,9.47,76.43,9.56"
    USE_OFFLINE_RADAR_FIXTURE: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
