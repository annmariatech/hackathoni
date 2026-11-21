---
name: sarvam-ai
description: Guide for the current Sarvam Saaras, Bulbul, Chat Completions, and Document AI APIs used by this project.
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
- **Model:** `saaras:v4`
- **Language Code:** `ml-IN`; set `mode="codemix"` to retain English terms in English script alongside Malayalam.
- **Multipart fields:** `file`, `model`, `language_code`, and `mode`.
- Saaras v4 also supports `transcribe`, `translate`, `verbatim`, and `translit`; v3 is legacy.
- **Output:** Read the `transcript` field from the response.

---

## 3. Text-to-Speech (TTS) — Bulbul v3
- **Endpoint:** `POST https://api.sarvam.ai/text-to-speech`
- **Model:** `bulbul:v3`
- **Language Code:** `ml-IN`
- **Malayalam speakers:** `pooja` or `shubh`.
- **JSON Payload:**
  ```json
  {
    "text": "ഞങ്ങൾ 350 കിലോ പായൽ ശേഖരിച്ചു.",
    "language_code": "ml-IN",
    "speaker": "pooja",
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
- **Model:** `sarvam-105b-conversations` for voice dialogue; `sarvam-105b` for complex reasoning.
- **DO NOT USE:** `sarvam-m` or `sarvam-30b`; both are deprecated.
- **Tool Calling Pattern:**
  Provide function declarations in `tools`, execute returned tool calls in the backend, append the assistant tool-call message and a `role="tool"` result message, then request the spoken reply.
  ```json
  {
    "model": "sarvam-105b-conversations",
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

## 5. Register Digitization — Document AI
- **Extract endpoint:** `POST https://api.sarvam.ai/doc-ai/v1/job/extract`.
- Send the register file, an inline JSON schema string, `language="ml-IN"`, `output_format="json"`, and `mode="basic"`.
- Jobs are asynchronous. Poll `GET /doc-ai/v1/job/{job_id}/status`, then retrieve `GET /doc-ai/v1/job/{job_id}/results` after a terminal status.
- Preserve the returned `annotations` and require human review of register values until handwriting accuracy is validated on real samples.
- The Parse endpoint supports `content_type="handwritten"`; Extract does not document that field.

## 6. Performance & Cost Optimization Rules
1. **Audio Caching:** Compute `hashlib.sha256(text.encode()).hexdigest()` for all static response templates (greetings, confirmations). If the file exists in `voice/cache/<hash>.wav`, serve it locally without calling Bulbul.
2. **Credit Usage Logging:** Every API call logs:
   - STT: audio duration in seconds.
   - TTS: character count of input text.
   - LLM: prompt + completion tokens.
3. **Mock Mode:** If `SARVAM_API_KEY` is unset or offline, fall back to `voice/mock_voice.py` seamlessly.
