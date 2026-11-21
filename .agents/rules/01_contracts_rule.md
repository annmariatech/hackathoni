# Contracts & Schema Governance Rule

## 1. Single Source of Truth
The `contracts/` directory contains the authoritative API specification and JSON Schemas:
- `contracts/openapi.yaml`: OpenAPI 3.0.3 specification for all REST endpoints.
- `contracts/schemas/*.json`: Canonical JSON Schemas for domain objects (`patch`, `weather`, `route`, `voice_interaction`, `ledger_transaction`).

## 2. Immutable Without Approval
- No agent may alter `contracts/openapi.yaml` or any schema in `contracts/schemas/` without explicit approval from the lead / user.
- If a new field or endpoint is required, propose the contract amendment first.

## 3. Backend & Frontend Conformance
- Every FastAPI response model in `backend/` must strictly conform to the OpenAPI schema.
- Frontend TypeScript interfaces in `frontend/src/types/` must be generated or mirror the schemas in `contracts/schemas/`.
- Automated test scripts (`scripts/golden_path.sh`) will validate API payloads against these schemas.
