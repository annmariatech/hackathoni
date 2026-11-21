"""
Payal-to-Pay — Offline Mock Voice Client
Provides deterministic Malayalam responses and valid audio bytes when:
1. SARVAM_API_KEY is not set or invalid
2. Network connectivity fails (e.g. on a houseboat)
3. Fast offline unit tests / golden path are running
"""
import io
import math
import struct
import wave
import logging
from typing import Dict, Any, List, Optional
from voice.credit_tracker import usage_tracker
from voice.cache_manager import audio_cache

logger = logging.getLogger("voice.mock_voice")


def generate_simple_wav(duration_sec: float = 1.0, freq_hz: float = 440.0) -> bytes:
    """Generates a clean PCM WAV tone so browser HTML5 audio element can play it."""
    sample_rate = 16000
    num_samples = int(sample_rate * duration_sec)
    buffer = io.BytesIO()

    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)

        samples = []
        for i in range(num_samples):
            # Gentle bell curve decay
            decay = math.exp(-3.0 * (i / num_samples))
            val = int(32767.0 * 0.3 * math.sin(2.0 * math.pi * freq_hz * (i / sample_rate)) * decay)
            samples.append(struct.pack("<h", val))

        wav_file.writeframes(b"".join(samples))

    return buffer.getvalue()


class MockSarvamClient:
    """Mock client that mimics SarvamClient interface with realistic Alappuzha voice responses."""

    def __init__(self, *args, **kwargs):
        self.is_configured = True
        self._sample_wav = generate_simple_wav(duration_sec=1.5, freq_hz=520.0)

    async def speech_to_text(
        self,
        audio_bytes: bytes,
        filename: str = "recording.wav",
        model: str = "saaras:v3",
        language_code: str = "ml-IN",
        approx_duration_sec: float = 2.5,
    ) -> str:
        usage_tracker.log_stt(approx_duration_sec)
        # Return standard harvester message in Malayalam
        return "ഞങ്ങൾ കൈനകരി ജെട്ടിയിൽ 350 കിലോ പായൽ ശേഖരിച്ചു, ഇനി എങ്ങോട്ട് പോകണം?"

    async def text_to_speech(
        self,
        text: str,
        speaker: str = "meera",
        model: str = "bulbul:v3",
        language_code: str = "ml-IN",
    ) -> bytes:
        cached = audio_cache.get_audio(text, speaker=speaker, model=model)
        if cached:
            usage_tracker.log_tts(len(text), from_cache=True)
            return cached

        audio_bytes = generate_simple_wav(duration_sec=2.0, freq_hz=480.0)
        audio_cache.put_audio(text, audio_bytes, speaker=speaker, model=model)
        usage_tracker.log_tts(len(text), from_cache=False)
        return audio_bytes

    async def chat_completion(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        model: str = "sarvam-30b",
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        usage_tracker.log_llm(110)

        # Look at the latest user message
        user_msg = messages[-1].get("content", "") if messages else ""

        # Check if user mentioned weight / kg or location
        weight = 350
        location = "കൈനകരി"
        if "400" in user_msg:
            weight = 400
        elif "250" in user_msg:
            weight = 250

        # Construct simulated tool call
        return {
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": None,
                        "tool_calls": [
                            {
                                "id": "call_mock_12345",
                                "type": "function",
                                "function": {
                                    "name": "record_harvest",
                                    "arguments": f'{{"crew_id": "crew-1", "weight_kg": {weight}, "location": "{location}"}}'
                                }
                            }
                        ]
                    }
                }
            ],
            "usage": {
                "prompt_tokens": 75,
                "completion_tokens": 35,
                "total_tokens": 110
            }
        }
