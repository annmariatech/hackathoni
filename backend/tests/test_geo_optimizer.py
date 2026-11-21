"""
Tests for Phase T2: Sentinel-1 Radar Detection, Choke Scorer, and OR-Tools Optimizer.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from geo.s1_detector import s1_detector
from geo.choke_scorer import calculate_choke_score
from geo.water_mask import is_in_water


def test_water_mask():
    # Punnamada canal center
    assert is_in_water(76.350, 9.505) is True
    # Far inland dry land outside Vembanad basin
    assert is_in_water(76.200, 9.300) is False


def test_choke_scorer():
    # Coordinates near Punnamada finish point jetty
    coords = [[76.350, 9.505], [76.353, 9.505], [76.353, 9.508], [76.350, 9.508], [76.350, 9.505]]
    choke, jetty = calculate_choke_score(coords)
    assert choke >= 0.80
    assert "Punnamada" in jetty


def test_s1_detector():
    res = s1_detector.detect_patches()
    assert res["type"] == "FeatureCollection"
    assert len(res["features"]) >= 5
    assert res["metadata"]["total_biomass_kg"] > 0
    assert "aoi" in res["metadata"]


@pytest.mark.anyio
async def test_route_optimizer_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/v1/routes/optimize", json={"max_boats": 3})
        assert resp.status_code == 200
        plan = resp.json()

        assert "plan_id" in plan
        assert len(plan["routes"]) == 3
        assert "baseline_comparison" in plan

        cmp = plan["baseline_comparison"]
        assert cmp["distance_saved_km"] > 0
        assert cmp["distance_saved_pct"] > 0
        assert cmp["optimizer_choke_cleared"] > 0
