"""
Payal-to-Pay — Audio Cache Manager
Caches synthesized Malayalam TTS audio on disk to minimize Sarvam API credit
usage, avoid latency for standard phrases, and support offline operation.
"""
import os
import hashlib
from pathlib import Path
from typing import Optional


class AudioCacheManager:
    def __init__(self, cache_dir: Optional[str] = None):
        if cache_dir is None:
            # Default to voice/cache relative to repo root
            base_dir = Path(__file__).resolve().parent
            self.cache_dir = base_dir / "cache"
        else:
            self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _get_key(self, text: str, speaker: str, model: str) -> str:
        clean_text = text.strip()
        raw = f"{model}:{speaker}:{clean_text}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def get_audio(self, text: str, speaker: str = "meera", model: str = "bulbul:v3") -> Optional[bytes]:
        key = self._get_key(text, speaker, model)
        file_path = self.cache_dir / f"{key}.wav"
        if file_path.exists():
            return file_path.read_bytes()
        return None

    def put_audio(self, text: str, audio_bytes: bytes, speaker: str = "meera", model: str = "bulbul:v3") -> str:
        key = self._get_key(text, speaker, model)
        file_path = self.cache_dir / f"{key}.wav"
        file_path.write_bytes(audio_bytes)
        return str(file_path)

    def has(self, text: str, speaker: str = "meera", model: str = "bulbul:v3") -> bool:
        key = self._get_key(text, speaker, model)
        file_path = self.cache_dir / f"{key}.wav"
        return file_path.exists()

    def get_cached_path(self, text: str, speaker: str = "meera", model: str = "bulbul:v3") -> Optional[str]:
        key = self._get_key(text, speaker, model)
        file_path = self.cache_dir / f"{key}.wav"
        if file_path.exists():
            return str(file_path)
        return None


# Global singleton instance
audio_cache = AudioCacheManager()
