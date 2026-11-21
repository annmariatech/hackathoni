"""
Payal-to-Pay — Conversational Voice Dispatcher (പായൽ കൺട്രോൾ റൂം)
Orchestrates Speech-to-Text -> Sarvam LLM with Tool Calling -> State Update -> Bulbul v3 Malayalam TTS.
"""
import json
import logging
from typing import Dict, Any, Optional
import os

from voice.sarvam_client import SarvamClient
from voice.mock_voice import MockSarvamClient

logger = logging.getLogger("voice.dispatcher")

# Dispatcher system prompt
DISPATCHER_SYSTEM_PROMPT = """You are the Alappuzha Water Hyacinth Supply Chain Dispatcher (പായൽ കൺട്രോൾ റൂം / Payal Operations Desk) operating over Vembanad Lake.
You communicate with rural women harvester boat crews (Kudumbashree units) and canal transport boats.
The user speaks to you in Malayalam (or Malayalam-English code-mix).

Your tasks:
1. When harvesters report collected hyacinth (e.g. "ഞങ്ങൾ കൈനകരിയിൽ 300 കിലോ പായൽ ശേഖരിച്ചു"), call the `record_harvest` tool with `weight_kg` and `location`.
2. When harvesters ask where to navigate or drop off biomass, call `get_next_destination` or `check_yard_slot`.
3. When harvesters ask about rain or drying feasibility, call `check_weather`.
4. Always produce a polite, encouraging response in natural, respectful Malayalam (e.g. "നന്ദി ലീല. നിങ്ങളുടെ 350 കിലോ പായൽ വിജയകരമായി രേഖപ്പെടുത്തി...").

Available drying yards:
- Kainakary North Yard (കൈനകരി വടക്ക് യാർഡ്)
- Punnamada South Yard (പുന്നമട തെക്ക് യാർഡ്)
- Nedumudi Link Yard (നെടുമുടി യാർഡ്)
"""

DISPATCHER_TOOLS = [
    {
        "type": "function",
        "function": {
          "name": "record_harvest",
          "description": "Log hyacinth collection weight (kg) and location from harvester boat",
          "parameters": {
            "type": "object",
            "properties": {
              "crew_id": {
                "type": "string",
                "description": "Unique identifier of the boat crew (e.g. 'crew-1')"
              },
              "weight_kg": {
                "type": "number",
                "description": "Harvested hyacinth weight in kilograms"
              },
              "location": {
                "type": "string",
                "description": "Location name or jetty reported by harvester (e.g. 'Kainakary', 'Punnamada')"
              }
            },
            "required": ["weight_kg", "location"]
          }
        }
    },
    {
        "type": "function",
        "function": {
          "name": "get_next_destination",
          "description": "Retrieve the next assigned harvest patch or drying yard drop-off point",
          "parameters": {
            "type": "object",
            "properties": {
              "crew_id": {
                "type": "string",
                "description": "Unique identifier of the boat crew"
              }
            },
            "required": ["crew_id"]
          }
        }
    },
    {
        "type": "function",
        "function": {
          "name": "check_yard_slot",
          "description": "Check real-time drying yard space and rain coverage",
          "parameters": {
            "type": "object",
            "properties": {
              "yard_id": {
                "type": "string",
                "description": "Identifier of drying yard"
              }
            },
            "required": ["yard_id"]
          }
        }
    }
]


class VoiceDispatcher:
    def __init__(self, sarvam_client: Optional[SarvamClient] = None):
        real_client = sarvam_client or SarvamClient()
        if real_client.is_configured:
            self.client = real_client
            self.is_mock = False
        else:
            self.client = MockSarvamClient()
            self.is_mock = True

    async def process_interaction(
        self,
        audio_bytes: Optional[bytes] = None,
        audio_filename: str = "recording.wav",
        audio_content_type: str = "audio/wav",
        text_input: Optional[str] = None,
        crew_id: str = "crew-1",
        state_executor: Optional[Any] = None,
    ) -> Dict[str, Any]:
        """
        Full round trip:
        Audio -> STT -> LLM with Tool Calls -> State Execution -> TTS -> Output dict
        """
        # Step 1: STT or Text Input
        if audio_bytes and len(audio_bytes) > 0:
            transcript = await self.client.speech_to_text(
                audio_bytes,
                filename=audio_filename,
                content_type=audio_content_type,
            )
        elif text_input:
            transcript = text_input.strip()
        else:
            transcript = "കൈനകരി ജെട്ടിയിൽ 350 കിലോ പായൽ ശേഖരിച്ചു"

        # Step 2: Sarvam Dispatcher Agent
        messages = [
            {"role": "system", "content": DISPATCHER_SYSTEM_PROMPT},
            {"role": "user", "content": f"ഹാർവെസ്റ്റർ ക്രൂ: {crew_id}\nസന്ദേശം: {transcript}"}
        ]

        dispatcher_model = "sarvam-105b-conversations"
        llm_response = await self.client.chat_completion(
            messages=messages,
            tools=DISPATCHER_TOOLS,
            model=dispatcher_model
        )

        choice = llm_response.get("choices", [{}])[0].get("message", {})
        tool_calls = choice.get("tool_calls", [])

        executed_tools = []
        tool_result_messages = []
        dispatcher_reply = ""
        intent = "GENERAL_QUERY"

        if tool_calls:
            for tc in tool_calls:
                func = tc.get("function", {})
                fn_name = func.get("name")
                try:
                    args = json.loads(func.get("arguments", "{}"))
                except Exception:
                    args = {}

                # Execute action on database / state
                result = {}
                if fn_name == "record_harvest":
                    intent = "REPORT_HARVEST"
                    weight = args.get("weight_kg", 300)
                    loc = args.get("location", "കൈനകരി")
                    if state_executor:
                        result = state_executor.record_harvest(crew_id=crew_id, weight_kg=weight, location=loc)
                    else:
                        result = {"status": "SUCCESS", "slot_allocated": "Kainakary North Yard", "payout_staged_inr": weight * 3.5}

                elif fn_name == "get_next_destination":
                    intent = "GET_ASSIGNMENT"
                    if state_executor:
                        result = state_executor.get_assignment(crew_id=crew_id)
                    else:
                        result = {"destination": "Patch-4 (Punnamada Choke)", "eta": "25 mins"}
                elif fn_name == "check_yard_slot":
                    intent = "CHECK_YARD_SLOT"
                    result = {"available_sqm": 400}

                else:
                    result = {"error": "Unknown dispatcher tool"}

                executed_tools.append({
                    "tool_name": fn_name,
                    "arguments": args,
                    "result": result
                })
                tool_result_messages.append({
                    "role": "tool",
                    "tool_call_id": tc.get("id", f"tool_{len(tool_result_messages)}"),
                    "content": json.dumps(result, ensure_ascii=False, default=str),
                })

            # Give the dispatcher the actual tool results so it can answer from live state.
            messages.append({
                "role": "assistant",
                "content": choice.get("content"),
                "tool_calls": tool_calls,
            })
            messages.extend(tool_result_messages)
            try:
                final_response = await self.client.chat_completion(
                    messages=messages,
                    model=dispatcher_model,
                )
                final_choice = final_response.get("choices", [{}])[0].get("message", {})
                dispatcher_reply = final_choice.get("content") or "ശരി, നിങ്ങളുടെ റിപ്പോർട്ട് ലഭിച്ചു. കൂടുതൽ വിവരങ്ങൾ സ്ക്രീനിൽ പരിശോധിക്കുക."
            except Exception:
                logger.warning("Sarvam follow-up completion failed; using a short fallback reply")
                dispatcher_reply = "ശരി, നിങ്ങളുടെ റിപ്പോർട്ട് ലഭിച്ചു. കൂടുതൽ വിവരങ്ങൾ സ്ക്രീനിൽ പരിശോധിക്കുക."
        else:
            dispatcher_reply = choice.get("content") or "ശരി, നിങ്ങളുടെ സന്ദേശം ലഭിച്ചു. കൂടുതൽ വിവരങ്ങൾ മാപ്പിൽ പരിശോധിക്കുക."

        # Step 3: Malayalam TTS Synthesis
        tts_audio = await self.client.text_to_speech(
            text=dispatcher_reply,
            speaker="pooja",
            model="bulbul:v3"
        )

        # Import usage tracker for credit reporting
        from voice.credit_tracker import usage_tracker
        stats = usage_tracker.get_stats()

        return {
            "transcript_malayalam": transcript,
            "intent": intent,
            "tool_calls": executed_tools,
            "dispatcher_response_malayalam": dispatcher_reply,
            "audio_bytes": tts_audio,
            "is_mock": self.is_mock,
            "credit_usage": {
                "stt_audio_seconds": stats.get("total_stt_seconds", 0.0),
                "tts_characters": stats.get("total_tts_chars", 0),
                "llm_tokens": stats.get("total_llm_tokens", 0),
                "cached_audio_hits": stats.get("cached_audio_hits", 0),
                "is_cached_audio": False
            }
        }
