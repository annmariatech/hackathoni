#!/usr/bin/env bash
# ==============================================================================
# Payal-to-Pay (പായൽ) — Golden Path Smoke Verification Script
# Validates environment, contracts, schemas, backend tests, and frontend build.
# ==============================================================================
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${BOLD}=== [1/6] Checking Environment & Tools ===${RESET}"
python3 --version || { echo -e "${RED}python3 not found${RESET}"; exit 1; }
node --version || { echo -e "${RED}node not found${RESET}"; exit 1; }
git --version || { echo -e "${RED}git not found${RESET}"; exit 1; }
echo -e "${GREEN}✓ Core runtimes detected.${RESET}\n"

echo -e "${BOLD}=== [2/6] Validating Contract Schemas ===${RESET}"
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

echo -e "${BOLD}=== [3/6] Checking Agent Rules & Documentation ===${RESET}"
test -f .agents/rules/00_core_conventions.md || { echo -e "${RED}Missing core conventions rule${RESET}"; exit 1; }
test -f .agents/rules/01_contracts_rule.md || { echo -e "${RED}Missing contracts rule${RESET}"; exit 1; }
test -f .agents/rules/02_geo_boundary.md || { echo -e "${RED}Missing geo boundary rule${RESET}"; exit 1; }
test -f .agents/rules/03_voice_boundary.md || { echo -e "${RED}Missing voice boundary rule${RESET}"; exit 1; }
test -f .agents/rules/04_frontend_boundary.md || { echo -e "${RED}Missing frontend boundary rule${RESET}"; exit 1; }
test -f docs/SPEC.md || { echo -e "${RED}Missing docs/SPEC.md${RESET}"; exit 1; }
test -f contracts/openapi.yaml || { echo -e "${RED}Missing contracts/openapi.yaml${RESET}"; exit 1; }
echo -e "${GREEN}✓ All boundary rules and specs present.${RESET}\n"

echo -e "${BOLD}=== [4/6] Running Backend Pytest Suite ===${RESET}"
if [ -d ".venv" ]; then
    source .venv/bin/activate
    PYTHONPATH=. pytest backend/tests/ -v
else
    echo -e "${YELLOW}Warning: .venv not found, running with system python${RESET}"
    PYTHONPATH=. pytest backend/tests/ -v
fi
echo -e "${GREEN}✓ Backend pytest test suite passed.${RESET}\n"

echo -e "${BOLD}=== [5/6] Building Frontend React PWA ===${RESET}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend TypeScript and Vite build passed.${RESET}\n"

echo -e "${BOLD}=== [6/6] Smoke Testing Ledger & Voice State Mutation ===${RESET}"
python3 - << 'EOF'
import sqlite3, hashlib, time

conn = sqlite3.connect("payal.db")
cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM ledger_transactions")
count = cursor.fetchone()[0]
assert count > 0, "No transactions found in payal.db"

cursor.execute("SELECT * FROM ledger_transactions WHERE is_simulated = 1 LIMIT 1")
tx = cursor.fetchone()
assert tx is not None, "Simulated transaction check failed"
print(f"Verified live SQLite database state: {count} transactions recorded.")
conn.close()
EOF
echo -e "${GREEN}✓ Database state and simulated ledger verified.${RESET}\n"

echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "${BOLD}${GREEN}★ Golden Path Smoke Test: ALL 6 GATES PASSED!                    ${RESET}"
echo -e "${BOLD}${GREEN}================================================================${RESET}"
