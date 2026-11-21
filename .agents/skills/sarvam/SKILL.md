---
name: sarvam-ai
description: Guide and specifications for interacting with Sarvam AI APIs for Indic Speech (Saaras STT), Voice Synthesis (Bulbul TTS), and Agentic LLMs (sarvam-30b/105b).
---

# Sarvam AI Integration Guide

## 1. Authentication
All requests to `api.sarvam.ai` require the header:
```http
api-subscription-key: <SARVAM_API_KEY>
```
*Rule:* Store `SARVAM_API_KEY` strictly in backend `.env`. Never send the key to client browsers.

---

## 2. Speech-to-Text (STT) — Saaras
- **Endpoint:** `POST https://api.sarvam.ai/speech-to-text`
- **Model:** `saaras:v3` (or `saaras:v2`)
- **Language Code:** `ml-IN` (Malayalam)
- **Supported Formats:** WAV, MP3, AAC, WebM (16kHz mono recommended).
- **Multipart Form Payload:**
  - `file`: Audio binary.
  - `model`: `"saaras:v3"`
  - `language_code`: `"ml-IN"`
  - `with_diacritics`: `false`
- **Output:** Returns JSON with `transcript` string. Handles English/Malayalam code-mixed speech (e.g., numbers, "kg", "jetty").

---

## 3. Text-to-Speech (TTS) — Bulbul v3
- **Endpoint:** `POST https://api.sarvam.ai/text-to-speech`
- **Model:** `bulbul:v3` (Do NOT use deprecated models)
- **Language Code:** `ml-IN`
- **Voices / Speakers:** `meera` (female), `pavithra` (female), `mahesh` (male), `arvind` (male).
- **JSON Payload:**
  ```json
  {
    "inputs": ["ഞങ്ങൾ 350 കിലോ പായൽ ശേഖരിച്ചു."],
    "target_language_code": "ml-IN",
    "speaker": "meera",
    "pitch": 0,
    "pace": 1.0,
    "loudness": 1.5,
    "speech_sample_rate": 22050,
    "enable_preprocessing": true,
    "model": "bulbul:v3"
  }
  ```
- **Output:** Returns Base64-encoded audio array or audio binary.

---

## 4. Conversational Dispatcher & Tool Calling — Sarvam LLM
- **Endpoint:** `POST https://api.sarvam.ai/v1/chat/completions` (OpenAI-compatible)
- **Model:** `sarvam-30b` or `sarvam-105b` (MoE reasoning model).
- **DO NOT USE:** `sarvam-m` (deprecated).
- **Tool Calling Pattern:**
  Provide function declarations in `tools` parameter:
  ```json
  {
    "model": "sarvam-30b",
    "messages": [
      {
        "role": "system",
        "content": "You are the Alappuzha Water Hyacinth Supply Chain Dispatcher (പായൽ കൺട്രോൾ റൂം). You receive Malayalam harvest reports from boat crews and assign them drop-off drying yards."
      },
      {
        "role": "user",
        "content": "ഞങ്ങൾ കൈനകരിയിൽ 400 കിലോ പായൽ എടുത്തു, ഇനി എങ്ങോട്ട് പോണം?"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "record_harvest",
          "description": "Log collected hyacinth weight and location",
          "parameters": {
            "type": "object",
            "properties": {
              "weight_kg": { "type": "number" },
              "location_name": { "type": "string" }
            },
            "required": ["weight_kg", "location_name"]
          }
        }
      }
    ]
  }
  ```

---

## 5. Performance & Cost Optimization Rules
1. **Audio Caching:** Compute `hashlib.sha256(text.encode()).hexdigest()` for all static response templates (greetings, confirmations). If the file exists in `voice/cache/<hash>.wav`, serve it locally without calling Bulbul.
2. **Credit Usage Logging:** Every API call logs:
   - STT: audio duration in seconds.
   - TTS: character count of input text.
   - LLM: prompt + completion tokens.
3. **Mock Mode:** If `SARVAM_API_KEY` is unset or offline, fall back to `voice/mock_voice.py` seamlessly.
