# Core Engineering & Safety Conventions

## 1. Plan Before Code
- No application code shall be written without an approved plan or explicit task definition.
- When an unexpected architectural change is needed, pause and update the plan.

## 2. Directory Ownership & Modularity
The codebase is partitioned into strict ownership domains:
- `backend/`: FastAPI application, API routes, database models, configuration.
- `geo/`: Sentinel-1 SAR change detection, water masking, OSM choke scoring, geo fixtures.
- `voice/`: Sarvam AI client, STT/TTS integration, tool-calling dispatcher, audio cache, credit tracker.
- `frontend/`: Vite + React + TypeScript + MapLibre GL PWA, UI components, offline storage.
- `contracts/`: OpenAPI specification and JSON Schemas. (Single source of truth).
- `docs/`: Technical specifications, credibility research data, mathematical assumptions.
- `scripts/`: Verification, benchmarking, seed data, and golden-path execution scripts.
- `.agents/`: Rules, agent boundaries, and skill references.

*Rule:* Each agent or sub-task edits ONLY its assigned directory. Cross-cutting changes must be coordinated through `contracts/`.

## 3. No Secrets in Code or Logs
- `SARVAM_API_KEY` and all sensitive tokens MUST live exclusively in `.env` (which is git-ignored).
- Never commit `.env` or hardcode API keys anywhere.
- Never log raw API authorization headers, keys, or sensitive credentials to standard output or error logs.

## 4. Small, Demo-Safe Commits
- Commit frequently with clear conventional commit messages: `feat(voice): ...`, `fix(geo): ...`.
- Tag demo-safe milestones after completing each phase (`v0.1-foundations`, `v0.2-voice-loop`, `v0.3-geo-optimizer`, `v0.4-credibility-verify`, `v1.0-hackathon-demo`).

## 5. Safety & Resource Limits
Always ask the user before:
- Installing large dependencies or packages exceeding 200 MB.
- Downloading external datasets exceeding 200 MB (e.g. raw Sentinel-1 GRD scenes; prefer windowed STAC reads or pre-packaged fixtures).
- Executing destructive filesystem commands (`rm -rf`, disk wipes).
- Modifying files or settings outside this repository.

## 6. Data Honesty Principle
- Every dataset, map layer, and transaction must be marked as `REAL` or `SIMULATED`.
- Never fabricate satellite results. If radar processing is unavailable or offline, use clearly labeled hand-digitized fallback polygons.
- Crews, buyers, and ledger disbursements are simulated and explicitly badged as such in the UI.
