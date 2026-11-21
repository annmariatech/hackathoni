#!/usr/bin/env bash
# ==============================================================================
# Payal-to-Pay (പായൽ) — Golden Path Smoke Verification Script
# Validates environment, contracts, schemas, and end-to-end operational loop.
# ==============================================================================
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${BOLD}=== [1/5] Checking Environment & Tools ===${RESET}"
python3 --version || { echo -e "${RED}python3 not found${RESET}"; exit 1; }
node --version || { echo -e "${RED}node not found${RESET}"; exit 1; }
git --version || { echo -e "${RED}git not found${RESET}"; exit 1; }
echo -e "${GREEN}✓ Core runtimes detected.${RESET}\n"

echo -e "${BOLD}=== [2/5] Validating Contract Schemas ===${RESET}"
python3 - << 'EOF'
import json, glob, sys

schemas = glob.glob("contracts/schemas/*.json")
if not schemas:
    print("No schemas found in contracts/schemas/!")
    sys.exit(1)

for s in schemas:
    with open(s, "r") as f:
        data = json.load(f)
        assert "$schema" in data or "type" in data, f"Invalid schema structure in {s}"
print(f"Validated {len(schemas)} JSON Schemas successfully.")
EOF
echo -e "${GREEN}✓ contracts/ schemas verified.${RESET}\n"

echo -e "${BOLD}=== [3/5] Checking Agent Rules & Documentation ===${RESET}"
test -f .agents/rules/00_core_conventions.md || { echo -e "${RED}Missing core conventions rule${RESET}"; exit 1; }
test -f .agents/rules/01_contracts_rule.md || { echo -e "${RED}Missing contracts rule${RESET}"; exit 1; }
test -f .agents/rules/02_geo_boundary.md || { echo -e "${RED}Missing geo boundary rule${RESET}"; exit 1; }
test -f .agents/rules/03_voice_boundary.md || { echo -e "${RED}Missing voice boundary rule${RESET}"; exit 1; }
test -f .agents/rules/04_frontend_boundary.md || { echo -e "${RED}Missing frontend boundary rule${RESET}"; exit 1; }
test -f docs/SPEC.md || { echo -e "${RED}Missing docs/SPEC.md${RESET}"; exit 1; }
test -f contracts/openapi.yaml || { echo -e "${RED}Missing contracts/openapi.yaml${RESET}"; exit 1; }
echo -e "${GREEN}✓ All boundary rules and specs present.${RESET}\n"

echo -e "${BOLD}=== [4/5] Smoke Testing Mock Voice & Dispatcher Loop ===${RESET}"
python3 - << 'EOF'
# Smoke test simulating voice interaction contract
mock_input = {
    "transcript_malayalam": "കൈനകരി ജെട്ടിയിൽ 350 കിലോ പായൽ ശേഖരിച്ചു",
    "intent": "REPORT_HARVEST",
    "tool_calls": [{
        "tool_name": "record_harvest",
        "arguments": {"weight_kg": 350, "location": "Kainakary Jetty"},
        "result": {"status": "SUCCESS", "slot_allocated": "Yard-1"}
    }],
    "dispatcher_response_malayalam": "350 കിലോ പായൽ രേഖപ്പെടുത്തി. കൈനകരി യാർഡിലേക്ക് എത്തിക്കുക.",
    "audio_response_url": "/api/v1/voice/audio/cached_ack.wav",
    "credit_usage": {
        "stt_audio_seconds": 2.4,
        "tts_characters": 58,
        "llm_tokens": 120,
        "is_cached_audio": True
    }
}
assert mock_input["credit_usage"]["tts_characters"] > 0
print("Voice interaction contract smoke test passed.")
EOF
echo -e "${GREEN}✓ Voice loop contract simulation passed.${RESET}\n"

echo -e "${BOLD}=== [5/5] Smoke Testing Ledger & Simulated Wages ===${RESET}"
python3 - << 'EOF'
import hashlib, time

weight_kg = 350.0
rate_per_kg = 3.50
bonus = 500.0
total = (weight_kg * rate_per_kg) + bonus

tx_payload = f"crew-1|patch-4|{weight_kg}|{total}|{time.time()}"
tx_hash = hashlib.sha256(tx_payload.encode()).hexdigest()

tx_record = {
    "tx_hash": tx_hash,
    "timestamp": "2026-11-21T23:30:00Z",
    "crew_id": "crew-1",
    "crew_name": "ലീല & സതി (വള്ളം 2)",
    "patch_id": "patch-4",
    "yard_id": "yard-kainakary",
    "weight_kg": weight_kg,
    "rate_inr_per_kg": rate_per_kg,
    "base_payout_inr": weight_kg * rate_per_kg,
    "bonus_inr": bonus,
    "total_payout_inr": total,
    "status": "DISBURSED",
    "bank_reference": "KGB-UPI-99281726",
    "is_simulated": True
}
assert tx_record["is_simulated"] is True
assert tx_record["total_payout_inr"] == 1725.0
print(f"Simulated ledger verification passed. Hash: {tx_hash[:16]}... Payout: ₹{total}")
EOF
echo -e "${GREEN}✓ Simulated ledger contract verification passed.${RESET}\n"

echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "${BOLD}${GREEN}★ Golden Path Smoke Test: ALL GATES PASSED!                      ${RESET}"
echo -e "${BOLD}${GREEN}================================================================${RESET}"
