"""
Payal-to-Pay — Route Optimization API Router
Runs Google OR-Tools CVRPTW optimizer and compares against baseline heuristic.
"""
from fastapi import APIRouter
from typing import Optional
from pydantic import BaseModel
from geo.optimizer import optimizer_engine
from geo.s1_detector import s1_detector

router = APIRouter(prefix="/api/v1/routes", tags=["Route Optimization"])


class OptimizeRequest(BaseModel):
    max_boats: Optional[int] = 3
    cutoff_hour: Optional[int] = 17


@router.post("/optimize")
async def optimize_routes(req: Optional[OptimizeRequest] = None):
    """
    Computes optimal harvester boat routes minimizing travel distance,
    maximizing choke clearance, and avoiding monsoon rain cutoffs.
    Compares against a greedy nearest-patch baseline.
    """
    # Fetch patches from Sentinel-1 detector
    patch_data = s1_detector.detect_patches()
    features = patch_data.get("features", [])

    patch_nodes = []
    for f in features:
        props = f.get("properties", {})
        geom = f.get("geometry", {})
        coords = geom.get("coordinates", [[]])[0]
        # Calculate centroid lon, lat
        if coords:
            avg_lon = sum(c[0] for c in coords) / len(coords)
            avg_lat = sum(c[1] for c in coords) / len(coords)
        else:
            avg_lon = 76.36
            avg_lat = 9.49

        patch_nodes.append({
            "patch_id": props.get("patch_id", f.get("id")),
            "name": props.get("name", "Hyacinth Patch"),
            "lat": avg_lat,
            "lon": avg_lon,
            "biomass_est_kg": props.get("biomass_est_kg", 50000),
            "choke_score": props.get("choke_score", 0.8)
        })

    plan = optimizer_engine.solve(patch_nodes)
    return plan
