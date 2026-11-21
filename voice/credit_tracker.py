"""
Payal-to-Pay — Voice Credit & Usage Tracker
Tracks API usage (audio seconds, TTS character count, LLM tokens, cache hits)
to enforce cost-control and provide complete transparency in the UI.
"""
from dataclasses import dataclass, asdict
import threading
from typing import Dict, Any


@dataclass
class UsageStats:
    total_stt_seconds: float = 0.0
    total_tts_chars: int = 0
    total_llm_tokens: int = 0
    cached_audio_hits: int = 0
    total_requests: int = 0


class CreditTracker:
    def __init__(self):
        self._lock = threading.Lock()
        self._stats = UsageStats()

    def log_stt(self, duration_seconds: float) -> None:
        with self._lock:
            self._stats.total_stt_seconds += round(duration_seconds, 2)
            self._stats.total_requests += 1

    def log_tts(self, char_count: int, from_cache: bool = False) -> None:
        with self._lock:
            if from_cache:
                self._stats.cached_audio_hits += 1
            else:
                self._stats.total_tts_chars += char_count
            self._stats.total_requests += 1

    def log_llm(self, tokens: int) -> None:
        with self._lock:
            self._stats.total_llm_tokens += tokens

    def log_cache_hit(self) -> None:
        with self._lock:
            self._stats.cached_audio_hits += 1

    def get_stats(self) -> Dict[str, Any]:
        with self._lock:
            return asdict(self._stats)

    def reset(self) -> None:
        with self._lock:
            self._stats = UsageStats()


# Global singleton instance for backend
usage_tracker = CreditTracker()
