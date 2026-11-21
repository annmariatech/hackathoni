"""
Tests for Phase T3: Field Photo Geotag Verification and Credibility Benchmarks.
"""
import io
import pytest
from PIL import Image
from httpx import AsyncClient, ASGITransport
from backend.app.main import app


def create_dummy_jpeg() -> bytes:
    img = Image.new("RGB", (100, 100), color=(73, 109, 137))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


@pytest.mark.anyio
async def test_credibility_benchmarks_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/credibility/benchmarks")
        assert resp.status_code == 200
        data = resp.json()

        assert "radar_evaluation" in data
        assert data["radar_evaluation"]["intersection_over_union"] >= 0.70
        assert data["radar_evaluation"]["precision"] >= 0.80

        assert "speech_evaluation" in data
        assert data["speech_evaluation"]["word_error_rate"] <= 0.10

        assert "optimizer_delta_evaluation" in data
        assert data["optimizer_delta_evaluation"]["metrics"]["distance_saved_pct"] >= 30.0

        assert len(data["assumptions"]) >= 5


@pytest.mark.anyio
async def test_photo_verification_endpoint():
    jpeg_bytes = create_dummy_jpeg()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        files = {
            "photo": ("field_proof.jpg", jpeg_bytes, "image/jpeg")
        }
        data = {
            "patch_id": "patch-1",
            "crew_id": "crew-1",
            "mock_lat": "9.5055",
            "mock_lon": "76.3505"
        }
        resp = await client.post("/api/v1/verify/photo", files=files, data=data)
        assert resp.status_code == 200
        res = resp.json()

        assert res["verified"] is True
        assert res["distance_meters"] <= 250.0
        assert res["staged_payout_inr"] > 0
        assert "tx_hash" in res


@pytest.mark.anyio
async def test_register_digitization_endpoint():
    jpeg_bytes = create_dummy_jpeg()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        files = {
            "photo": ("register_sheet.jpg", jpeg_bytes, "image/jpeg")
        }
        resp = await client.post("/api/v1/verify/register", files=files)
        assert resp.status_code == 200
        res = resp.json()
        assert res["status"] == "DIGITIZED"
        assert res["entries_found"] == 3
