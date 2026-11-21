#!/usr/bin/env bash
# ==============================================================================
# Payal-to-Pay (പായൽ) — One-Click Hackathon Live Demo Launcher
# Starts FastAPI backend (port 8000) and Vite frontend (port 5173).
# ==============================================================================
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[0;32m"
SKY="\033[0;36m"
YELLOW="\033[0;33m"
RESET="\033[0m"

echo -e "${BOLD}${SKY}================================================================${RESET}"
echo -e "${BOLD}${GREEN}  Payal-to-Pay (പായൽ) — The Houseboat Hackathon, Alappuzha     ${RESET}"
echo -e "${BOLD}${SKY}  Satellite-to-Wages Water Hyacinth Supply Chain               ${RESET}"
echo -e "${BOLD}${SKY}================================================================${RESET}\n"

# Step 1: Ensure virtualenv & database seeded
echo -e "${BOLD}▶ [1/3] Preparing backend & seeding database...${RESET}"
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi
PYTHONPATH=. python3 scripts/seed_data.py
echo -e "${GREEN}✓ SQLite database initialized & seeded.${RESET}\n"

# Step 2: Start Backend
echo -e "${BOLD}▶ [2/3] Starting FastAPI Backend on http://localhost:8000 ...${RESET}"
PYTHONPATH=. uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend running (PID: ${BACKEND_PID}).${RESET}\n"

# Step 3: Start Frontend
echo -e "${BOLD}▶ [3/3] Starting Vite Frontend on http://localhost:5173 ...${RESET}"
cd frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend running (PID: ${FRONTEND_PID}).${RESET}\n"

echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "${BOLD}★ LIVE DEMO READY:${RESET}"
echo -e "  - Frontend PWA:    ${SKY}http://localhost:5173${RESET}"
echo -e "  - Backend API:     ${SKY}http://localhost:8000/docs${RESET}"
echo -e "  - Push-to-Talk:    Active (Sarvam Saaras STT & Bulbul v3 TTS)"
echo -e "  - Sentinel-1 SAR:  Punnamada–Kainakary AOI Loaded"
echo -e "  - CVRPTW Solver:   Google OR-Tools Ready"
echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "Press Ctrl+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM
wait
