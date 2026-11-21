# Frontend Agent Boundary & Guidelines

## 1. Ownership Scope
The Frontend agent owns and edits only files inside `frontend/`:
- `frontend/src/components/`: React UI components (MapView, PushToTalk, SimulatedLedger, CredibilityPanel, RouteComparison, DryingYardSlots).
- `frontend/src/types/`: TypeScript definitions aligned with `contracts/schemas/`.
- `frontend/src/services/`: API clients calling the backend.
- `frontend/public/`: Static assets, icons, manifest for PWA.

## 2. Offline-Tolerant PWA Requirement
- The Houseboat Hackathon takes place on the backwaters where mobile network coverage may be intermittent.
- The frontend must be an offline-tolerant Progressive Web App (PWA) with service worker caching for application shell, styles, and static map tiles.
- Local state (harvest logs, active routes, cached audio) should be persisted in browser `localStorage` or IndexedDB.

## 3. Data Honesty Badges
- Every data view, metric card, and map polygon must prominently display an honesty badge:
  - `[REAL]` (Emerald / Green) for live Sentinel-1 radar data, Open-Meteo forecasts, and live Sarvam voice transcripts.
  - `[SIMULATED]` (Amber / Orange) for simulated boat crews, drying yards, artisan buyer demand, and ledger disbursements.
  - `[FALLBACK DIGITIZED]` (Yellow) if radar change detection defaulted to hand-digitized polygons.

## 4. Voice Interaction UX
- Provide a clear, accessible Push-to-Talk button with microphone permissions handling and active audio waveform animation.
- Include a fallback text input modal so users can test or demonstrate the conversational dispatcher in noisy environments.
