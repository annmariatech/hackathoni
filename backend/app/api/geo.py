"""
Payal-to-Pay — Geo API Router
Provides GeoJSON FeatureCollection of hyacinth patches with choke scores and boat locations.
"""
import json
from typing import Dict, Any
from fastapi import APIRouter
from backend.app.models import PatchCollectionResponse, PatchCollectionMetadata
from backend.app.db import get_db_connection

router = APIRouter(prefix="/api/v1/geo", tags=["Geo Engine"])


@router.get("/patches", response_model=PatchCollectionResponse)
async def get_patches():
    """Returns detected hyacinth patches with choke scores and geometries."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patches WHERE is_cleared = 0")
    rows = cursor.fetchall()

    cursor.execute("SELECT * FROM crews")
    crews = cursor.fetchall()
    conn.close()

    features = []
    total_biomass = 0.0

    for r in rows:
        coords = json.loads(r["coordinates_json"])
        total_biomass += r["biomass_est_kg"]
        features.append({
            "type": "Feature",
            "id": r["patch_id"],
            "geometry": {
                "type": "Polygon",
                "coordinates": coords
            },
            "properties": {
                "patch_id": r["patch_id"],
                "name": r["name"],
                "area_sqm": r["area_sqm"],
                "biomass_est_kg": r["biomass_est_kg"],
                "choke_score": r["choke_score"],
                "growth_trend": r["growth_trend"],
                "nearest_jetty": r["nearest_jetty"],
                "is_simulated": bool(r["is_simulated"]),
                "detected_at": r["detected_at"]
            }
        })

    # Also include boat locations as point features
    for c in crews:
        if c["current_lat"] and c["current_lng"]:
            features.append({
                "type": "Feature",
                "id": c["crew_id"],
                "geometry": {
                    "type": "Point",
                    "coordinates": [c["current_lng"], c["current_lat"]]
                },
                "properties": {
                    "feature_type": "BOAT",
                    "crew_id": c["crew_id"],
                    "crew_name": c["crew_name"],
                    "boat_type": c["boat_type"],
                    "capacity_kg": c["capacity_kg"],
                    "is_simulated": True
                }
            })

    metadata = PatchCollectionMetadata(
        total_patches=len(rows),
        total_biomass_kg=round(total_biomass, 1),
        source="Sentinel-1 SAR Radar Change Detection",
        is_simulated=False
    )

    return PatchCollectionResponse(
        type="FeatureCollection",
        features=features,
        metadata=metadata
    )
