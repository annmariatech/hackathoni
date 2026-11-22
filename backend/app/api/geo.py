"""
Payal-to-Pay — Geo API Router
Provides recent Sentinel-1 RTC scenes and only validated water-hyacinth detections.
"""
from datetime import date, datetime, timezone
from typing import Any, Dict

import httpx
from fastapi import APIRouter, HTTPException, Query
from backend.app.models import PatchCollectionResponse, PatchCollectionMetadata
from geo.water_mask import AOI_BBOX

router = APIRouter(prefix="/api/v1/geo", tags=["Geo Engine"])
PLANETARY_COMPUTER_STAC = "https://planetarycomputer.microsoft.com/api/stac/v1/search"


def _month_start(month_offset: int, current: date) -> date:
    month_index = current.year * 12 + current.month - 1 - month_offset
    return date(month_index // 12, month_index % 12 + 1, 1)


@router.get("/sentinel-1/scenes")
async def get_sentinel_1_scenes(months: int = Query(default=6, ge=3, le=12)):
    """Returns real, map-ready RTC scenes from the Planetary Computer STAC catalog."""
    now = datetime.now(timezone.utc)
    start = _month_start(months - 1, now.date())
    bbox = ",".join(str(value) for value in AOI_BBOX)

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0)) as client:
            response = await client.get(
                PLANETARY_COMPUTER_STAC,
                params={
                    "collections": "sentinel-1-rtc",
                    "bbox": bbox,
                    "datetime": f"{start.isoformat()}T00:00:00Z/{now.isoformat()}",
                    "limit": 100,
                },
            )
            response.raise_for_status()
            items = response.json().get("features", [])
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Sentinel-1 scene catalog is unavailable.") from exc

    by_orbit: Dict[str, Dict[str, Dict[str, Any]]] = {}
    for item in items:
        properties = item.get("properties", {})
        acquired = properties.get("datetime")
        assets = item.get("assets", {})
        tilejson = assets.get("tilejson", {}).get("href")
        if not acquired or not tilejson:
            continue
        orbit = str(properties.get("sat:relative_orbit", "unknown"))
        month_key = acquired[:7]
        existing = by_orbit.setdefault(orbit, {}).get(month_key)
        if existing is None or acquired > existing["acquired_at"]:
            by_orbit[orbit][month_key] = {
                "id": item.get("id"),
                "acquired_at": acquired,
                "tilejson_url": tilejson,
                "preview_url": assets.get("rendered_preview", {}).get("href"),
                "item_url": next(
                    (link.get("href") for link in item.get("links", []) if link.get("rel") == "self"),
                    None,
                ),
            }

    selected_orbit = None
    if by_orbit:
        # Compare the same relative orbit where possible to reduce view-angle changes.
        selected_orbit = max(
            by_orbit,
            key=lambda orbit: (len(by_orbit[orbit]), max(s["acquired_at"] for s in by_orbit[orbit].values())),
        )
        selected_scenes = by_orbit[selected_orbit]
    else:
        selected_scenes = {}

    scenes = [
        {
            **scene,
            "month": month,
            "relative_orbit": selected_orbit,
            "source": "Copernicus Sentinel-1 RTC · Microsoft Planetary Computer",
        }
        for month, scene in sorted(selected_scenes.items())
    ]
    return {
        "scenes": scenes,
        "aoi": "Vembanad Lake · Punnamada–Kainakary",
        "source": "Copernicus Sentinel-1 RTC · Microsoft Planetary Computer",
        "retrieved_at": now.isoformat(),
    }


@router.get("/patches", response_model=PatchCollectionResponse)
async def get_patches():
    """Does not expose seed polygons as if they were satellite detections."""
    return PatchCollectionResponse(
        type="FeatureCollection",
        features=[],
        metadata=PatchCollectionMetadata(
            total_patches=0,
            total_biomass_kg=0,
            source="No validated current detections",
            is_simulated=False,
        ),
    )
