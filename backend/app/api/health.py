"""
Payal-to-Pay — Health Check Endpoint
"""
from datetime import datetime, timezone
from fastapi import APIRouter
from backend.app.models import HealthResponse
from voice.sarvam_client import SarvamClient

router = APIRouter(tags=["Health"])


@router.get("/api/health", response_model=HealthResponse)
async def health_check():
    client = SarvamClient()
    return HealthResponse(
        status="ok",
        timestamp=datetime.now(timezone.utc).isoformat(),
        sarvam_connected=client.is_configured,
        version="1.0.0"
    )
