# Voice Agent Boundary & Guidelines (Sarvam AI)

## 1. Ownership Scope
The Voice agent owns and edits only files inside `voice/`:
- `voice/sarvam_client.py`: Client wrapper for Sarvam AI REST API.
- `voice/dispatcher.py`: Conversational dispatcher and tool-calling agent.
- `voice/cache_manager.py`: Local SHA-256 disk cache for audio files.
- `voice/credit_tracker.py`: Real-time counter of API character and audio second consumption.
- `voice/fixtures/`: Benchmark Malayalam test audio clips (.wav/.mp3).
- `voice/mock_voice.py`: Offline simulation client for testing without internet or API key.

## 2. Model Specifications (Strict)
- **STT (Speech-to-Text):** Use Saaras v4 (`saaras:v4`) with language code `ml-IN` and `mode="codemix"` for Malayalam-English field reports. Saaras v3 is legacy.
- **TTS (Text-to-Speech):** Use Bulbul v3 (`bulbul:v3`) with language code `ml-IN` and a supported Malayalam speaker such as `pooja` or `shubh`. Send the current REST fields `text` and `language_code`.
- **Dispatcher / LLM:** Use `sarvam-105b-conversations` for voice dialogue or `sarvam-105b` for more complex reasoning with tool-calling via `/v1/chat/completions`.
- **PROHIBITED:** Never use `sarvam-m` or `sarvam-30b`; both are deprecated. Pass all model names explicitly in API payloads.

## 3. Security & Architecture
- Sarvam API is called **ONLY** from backend code. Never expose `SARVAM_API_KEY` to the frontend or browser.
- The API key must be read from the environment variable `SARVAM_API_KEY`.
- Never log raw audio bytes or print authentication tokens.

## 4. Performance & Credit Guard
- Fixed system phrases (e.g., initial greeting, harvest logged acknowledgement, error warnings) must be cached on disk (`voice/cache/`) keyed by SHA-256 hash of the Malayalam text.
- Every call to Sarvam must record characters processed and audio duration in SQLite to display live credit tracking in the UI.
- Provide a full mock mode in `voice/mock_voice.py` that mimics all responses with pre-recorded/synthetic audio.
