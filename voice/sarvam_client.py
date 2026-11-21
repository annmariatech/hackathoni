"""
Payal-to-Pay — Sarvam AI Async Client Wrapper
Wraps Saaras v4 STT, Bulbul v3 TTS, and Sarvam-105B Conversations with tool-calling.
Never exposes API key to client; tracks all credit usage and leverages disk audio cache.
"""
import os
import base64
import logging
from typing import Optional, Dict, Any, List
import httpx

from backend.app.config import settings
from voice.credit_tracker import usage_tracker
from voice.cache_manager import audio_cache

logger = logging.getLogger("voice.sarvam_client")


class SarvamClient:
    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.sarvam.ai"):
        self.api_key = api_key if api_key is not None else (
            os.getenv("SARVAM_API_KEY") or settings.SARVAM_API_KEY or ""
        )
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "api-subscription-key": self.api_key,
        }

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key != "your_sarvam_api_key_here")

    async def speech_to_text(
        self,
        audio_bytes: bytes,
        filename: str = "recording.wav",
        model: str = "saaras:v4",
        language_code: str = "ml-IN",
        approx_duration_sec: float = 3.0,
        mode: str = "codemix",
        content_type: str = "audio/wav",
    ) -> str:
        """
        Transcribes Malayalam audio to text using Saaras v4.
        Supports Malayalam-English code-mixing (numbers, jetty, kg).
        """
        if not self.is_configured:
            raise ValueError("SARVAM_API_KEY is not configured")

        url = f"{self.base_url}/speech-to-text"
        files = {
            "file": (filename, audio_bytes, content_type.split(";", 1)[0])
        }
        data = {
            "model": model,
            "language_code": language_code,
            "mode": mode,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=self.headers, files=files, data=data)
            resp.raise_for_status()
            res_json = resp.json()
            transcript = res_json.get("transcript", "")

            # Log STT usage
            usage_tracker.log_stt(approx_duration_sec)
            return transcript

    async def text_to_speech(
        self,
        text: str,
        speaker: str = "pooja",
        model: str = "bulbul:v3",
        language_code: str = "ml-IN",
    ) -> bytes:
        """
        Synthesizes Malayalam speech using Bulbul v3.
        Checks audio disk cache first.
        """
        # Check cache first
        cached = audio_cache.get_audio(text, speaker=speaker, model=model)
        if cached:
            usage_tracker.log_tts(len(text), from_cache=True)
            return cached

        if not self.is_configured:
            raise ValueError("SARVAM_API_KEY is not configured")

        url = f"{self.base_url}/text-to-speech"
        payload = {
            "text": text,
            "language_code": language_code,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": model,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers={**self.headers, "Content-Type": "application/json"}, json=payload)
            resp.raise_for_status()
            res_json = resp.json()

            # Sarvam returns an array of base64 encoded audio strings in "audios"
            audios = res_json.get("audios", [])
            if not audios:
                raise ValueError("No audio returned from Bulbul API")

            audio_bytes = base64.b64decode(audios[0])

            # Save to disk cache
            audio_cache.put_audio(text, audio_bytes, speaker=speaker, model=model)
            usage_tracker.log_tts(len(text), from_cache=False)
            return audio_bytes

    async def chat_completion(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        model: str = "sarvam-105b-conversations",
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        """
        Calls Sarvam-105B Conversations with OpenAI-compatible tool calling.
        """
        if not self.is_configured:
            raise ValueError("SARVAM_API_KEY is not configured")

        url = f"{self.base_url}/v1/chat/completions"
        payload: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"

        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, headers={**self.headers, "Content-Type": "application/json"}, json=payload)
            resp.raise_for_status()
            res_json = resp.json()

            usage = res_json.get("usage", {})
            total_tokens = usage.get("total_tokens", 100)
            usage_tracker.log_llm(total_tokens)

            return res_json
