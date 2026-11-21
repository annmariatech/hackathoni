// Types corresponding strictly to contracts/schemas/*.json

export interface PatchFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Polygon" | "Point";
    coordinates: any;
  };
  properties: {
    feature_type?: "BOAT" | "PATCH";
    patch_id?: string;
    name?: string;
    area_sqm?: number;
    biomass_est_kg?: number;
    choke_score?: number;
    growth_trend?: "EXPANDING" | "STABLE" | "RECEDING";
    nearest_jetty?: string;
    is_simulated?: boolean;
    detected_at?: string;
    // Boat properties
    crew_id?: string;
    crew_name?: string;
    boat_type?: string;
    capacity_kg?: number;
  };
}

export interface PatchCollection {
  type: "FeatureCollection";
  features: PatchFeature[];
  metadata: {
    total_patches: number;
    total_biomass_kg: number;
    source: string;
    is_simulated: boolean;
  };
}

export interface CreditUsage {
  stt_audio_seconds: number;
  tts_characters: number;
  llm_tokens: number;
  cached_audio_hits: number;
  is_cached_audio: boolean;
}

export interface ToolCall {
  tool_name: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
}

export interface VoiceInteractionResponse {
  interaction_id: string;
  timestamp: string;
  transcript_malayalam: string;
  intent: string;
  tool_calls: ToolCall[];
  dispatcher_response_malayalam: string;
  audio_response_url: string;
  credit_usage: CreditUsage;
  is_simulated_voice: boolean;
}

export interface LedgerTransaction {
  tx_hash: string;
  timestamp: string;
  crew_id: string;
  crew_name: string;
  patch_id: string;
  yard_id?: string;
  weight_kg: number;
  rate_inr_per_kg: number;
  base_payout_inr: number;
  bonus_inr: number;
  total_payout_inr: number;
  status: "PENDING" | "VERIFIED" | "DISBURSED";
  bank_reference: string;
  is_simulated: boolean;
}
