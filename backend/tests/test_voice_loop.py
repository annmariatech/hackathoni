"""
Tests for Phase T1: Voice -> Dispatcher Tool Call -> Ledger State Loop.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.db import init_db, seed_initial_data


@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    seed_initial_data()


@pytest.mark.anyio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"


@pytest.mark.anyio
async def test_voice_interact_text_fallback():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "crew_id": "crew-1",
            "text_fallback": "കൈനകരി വടക്ക് ഭാഗത്തുനിന്ന് 350 കിലോ പായൽ ശേഖരിച്ചു"
        }
        resp = await client.post("/api/v1/voice/interact", data=payload)
        assert resp.status_code == 200
        data = resp.json()

        assert "transcript_malayalam" in data
        assert "dispatcher_response_malayalam" in data
        assert "audio_response_url" in data
        assert data["intent"] in ["REPORT_HARVEST", "GENERAL_QUERY"]

        # Check tool execution
        assert len(data["tool_calls"]) > 0
        tool = data["tool_calls"][0]
        assert tool["tool_name"] == "record_harvest"
        assert tool["result"]["status"] == "SUCCESS"

        # Check that simulated ledger has a new transaction
        ledger_resp = await client.get("/api/v1/ledger/transactions")
        assert ledger_resp.status_code == 200
        txs = ledger_resp.json()
        assert len(txs) >= 2  # Seeded + new
        latest = txs[0]
        assert latest["crew_id"] == "crew-1"
        assert latest["status"] == "DISBURSED"
        assert latest["is_simulated"] is True


@pytest.mark.anyio
async def test_geo_patches():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/geo/patches")
        assert resp.status_code == 200
        data = resp.json()
        assert data["type"] == "FeatureCollection"
        assert len(data["features"]) >= 5
        assert data["metadata"]["total_biomass_kg"] > 0


@pytest.mark.anyio
async def test_drying_windows():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/forecast/drying-windows")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["drying_windows"]) == 7
        assert len(data["drying_yards"]) >= 3


@pytest.mark.anyio
async def test_voice_interact_audio_upload():
    from voice.mock_voice import generate_simple_wav
    wav_bytes = generate_simple_wav(duration_sec=1.0)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        files = {
            "audio": ("field_recording.wav", wav_bytes, "audio/wav")
        }
        data = {
            "crew_id": "crew-2"
        }
        resp = await client.post("/api/v1/voice/interact", files=files, data=data)
        assert resp.status_code == 200
        res = resp.json()
        assert "transcript_malayalam" in res
        assert "dispatcher_response_malayalam" in res
        assert res["credit_usage"]["stt_audio_seconds"] > 0
