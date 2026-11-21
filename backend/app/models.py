"""
Payal-to-Pay — Pydantic Data Models
Strictly aligns with schemas defined in contracts/schemas/*.json and contracts/openapi.yaml.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# --- Health ---
class HealthResponse(BaseModel):
    status: str = "ok"
    timestamp: str
    sarvam_connected: bool
    version: str = "1.0.0"


# --- Geo & Hyacinth Patch ---
class Geometry(BaseModel):
    type: str = "Polygon"
    coordinates: List[List[List[float]]]


class HyacinthPatch(BaseModel):
    patch_id: str
    name: str
    area_sqm: float
    biomass_est_kg: float
    choke_score: float
    growth_trend: str
    geometry: Geometry
    nearest_jetty: Optional[str] = None
    is_simulated: bool = False
    detected_at: Optional[str] = None


class PatchCollectionMetadata(BaseModel):
    total_patches: int
    total_biomass_kg: float
    source: str = "Sentinel-1 SAR"
    is_simulated: bool = False


class PatchCollectionResponse(BaseModel):
    type: str = "FeatureCollection"
    features: List[Dict[str, Any]]
    metadata: PatchCollectionMetadata


# --- Weather & Drying Yard Forecast ---
class DryingWindow(BaseModel):
    date: str
    condition: str
    precipitation_mm: float
    sunshine_hours: float
    relative_humidity_pct: float
    is_harvest_safe: bool


class DryingYardStatus(BaseModel):
    yard_id: str
    name: str
    location: Dict[str, float]
    total_capacity_sqm: float
    occupied_sqm: float
    available_sqm: float


class WeatherDryingForecast(BaseModel):
    location: Dict[str, Any]
    generated_at: str
    drying_windows: List[DryingWindow]
    drying_yards: List[DryingYardStatus]
    is_simulated: bool = False


# --- Voice Interaction ---
class CreditUsage(BaseModel):
    stt_audio_seconds: float
    tts_characters: int
    llm_tokens: int
    cached_audio_hits: int = 0
    is_cached_audio: bool = False


class ToolCallRecord(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    result: Dict[str, Any]


class VoiceInteractionResponse(BaseModel):
    interaction_id: str
    timestamp: str
    transcript_malayalam: str
    intent: str
    tool_calls: List[ToolCallRecord] = []
    dispatcher_response_malayalam: str
    audio_response_url: str
    audio_response_base64: Optional[str] = None
    credit_usage: CreditUsage
    is_simulated_voice: bool = False


class SpeakRequest(BaseModel):
    text: str
    speaker: str = "meera"


# --- Ledger & Payments ---
class LedgerTransaction(BaseModel):
    tx_hash: str
    timestamp: str
    crew_id: str
    crew_name: str
    patch_id: str
    yard_id: Optional[str] = None
    weight_kg: float
    rate_inr_per_kg: float = 3.50
    base_payout_inr: float
    bonus_inr: float = 0.0
    total_payout_inr: float
    status: str = "DISBURSED"
    bank_reference: str
    is_simulated: bool = True


class PayoutRequest(BaseModel):
    crew_id: str
    patch_id: str
    yard_id: Optional[str] = "yard-kainakary"
    weight_kg: float
