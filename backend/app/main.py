"""
Payal-to-Pay (പായൽ) — FastAPI Main Application Entry Point
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from backend.app.config import settings
from backend.app.db import init_db, seed_initial_data
from backend.app.api import health, voice, ledger, geo, forecast, optimize, verify, credibility

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend.app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Payal-to-Pay Database...")
    init_db()
    seed_initial_data()
    logger.info("Database initialized and seeded.")
    yield


app = FastAPI(
    title="Payal-to-Pay (പായൽ) API",
    description="Satellite-to-wages water hyacinth supply chain with Malayalam voice interface for Vembanad Lake, Alappuzha.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(health.router)
app.include_router(voice.router)
app.include_router(ledger.router)
app.include_router(geo.router)
app.include_router(forecast.router)
app.include_router(optimize.router)
app.include_router(verify.router)
app.include_router(credibility.router)

# Mount audio directory for streaming audio files
AUDIO_DIR = Path(__file__).resolve().parent.parent.parent / "audio_out"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/audio_out", StaticFiles(directory=str(AUDIO_DIR)), name="audio_out")
