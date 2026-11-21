"""
Payal-to-Pay — Voice API Router
Handles Push-to-Talk audio interactions, dynamic TTS synthesis, audio streaming, and credit tracking.
"""
import io
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from fastapi.responses import FileResponse

from backend.app.models import VoiceInteractionResponse, SpeakRequest
from backend.app.db import db_state_executor
from voice.dispatcher import VoiceDispatcher
from voice.sarvam_client import SarvamClient
from voice.credit_tracker import usage_tracker
from voice.cache_manager import audio_cache

router = APIRouter(prefix="/api/v1/voice", tags=["Voice Desk"])

dispatcher = VoiceDispatcher()
AUDIO_STORAGE_DIR = Path(__file__).resolve().parent.parent.parent / "audio_out"
AUDIO_STORAGE_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/interact", response_model=VoiceInteractionResponse)
async def voice_interaction(
    audio: Optional[UploadFile] = File(None),
    crew_id: str = Form("crew-1"),
    text_fallback: Optional[str] = Form(None)
):
    """
    Push-to-Talk endpoint:
    Accepts audio recording or text fallback, passes to Sarvam Saaras STT,
    executes tool-calling dispatcher against SQLite state, and generates Bulbul v3 TTS response.
    """
    audio_bytes = None
    if audio:
        audio_bytes = await audio.read()

    interaction_id = str(uuid.uuid4())
    result = await dispatcher.process_interaction(
        audio_bytes=audio_bytes,
        text_input=text_fallback,
        crew_id=crew_id,
        state_executor=db_state_executor
    )

    # Save audio response to disk so client can stream it
    audio_filename = f"{interaction_id}.wav"
    audio_path = AUDIO_STORAGE_DIR / audio_filename
    audio_bytes_out = result.get("audio_bytes", b"")
    audio_path.write_bytes(audio_bytes_out)

    audio_url = f"/api/v1/voice/audio/{audio_filename}"

    return VoiceInteractionResponse(
        interaction_id=interaction_id,
        timestamp=datetime.now(timezone.utc).isoformat(),
        transcript_malayalam=result["transcript_malayalam"],
        intent=result["intent"],
        tool_calls=result.get("tool_calls", []),
        dispatcher_response_malayalam=result["dispatcher_response_malayalam"],
        audio_response_url=audio_url,
        credit_usage=result["credit_usage"],
        is_simulated_voice=result.get("is_mock", False)
    )


@router.get("/audio/{filename}")
async def get_audio_file(filename: str):
    """Streams synthesized or cached audio to browser."""
    path = AUDIO_STORAGE_DIR / filename
    if not path.exists():
        # Check cache manager directory
        cached_path = audio_cache.cache_dir / filename
        if cached_path.exists():
            return FileResponse(str(cached_path), media_type="audio/wav")
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(str(path), media_type="audio/wav")


@router.post("/speak")
async def speak_text(req: SpeakRequest):
    """Generates Malayalam speech audio for dynamic text using Bulbul v3."""
    client = SarvamClient()
    if not client.is_configured:
        from voice.mock_voice import MockSarvamClient
        client = MockSarvamClient()

    audio_bytes = await client.text_to_speech(
        text=req.text,
        speaker=req.speaker,
        model="bulbul:v3"
    )
    return Response(content=audio_bytes, media_type="audio/wav")


@router.get("/credits")
async def get_credit_stats():
    """Returns real-time credit consumption metrics for the credibility panel and UI badges."""
    return usage_tracker.get_stats()
