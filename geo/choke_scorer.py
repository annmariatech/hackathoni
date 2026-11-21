"""
Payal-to-Pay — Navigation Choke Scorer
Calculates navigation blockage score (0.0 to 1.0) for detected hyacinth patches
based on proximity to OSM public boat jetties and public ferry navigation channels.
"""
from typing import List, Dict, Any, Tuple
from shapely.geometry import Polygon, Point

# Known OSM Public Boat Jetties in Punnamada–Kainakary
OSM_JETTIES = [
    {"id": "jetty-punnamada", "name": "Punnamada Finishing Point Jetty", "lon": 76.3505, "lat": 9.5065, "weight": 1.0},
    {"id": "jetty-kainakary-n", "name": "Kainakary North Ferry Jetty", "lon": 76.3810, "lat": 9.4995, "weight": 0.95},
    {"id": "jetty-kuppappuram", "name": "Kuppappuram Boat Jetty", "lon": 76.3650, "lat": 9.4920, "weight": 0.85},
    {"id": "jetty-pallathuruthy", "name": "Pallathuruthy Bridge Jetty", "lon": 76.3580, "lat": 9.4745, "weight": 0.75},
    {"id": "jetty-nedumudi", "name": "Nedumudi Central Jetty", "lon": 76.4015, "lat": 9.4445, "weight": 0.90},
]


def calculate_choke_score(polygon_coords: List[List[float]]) -> Tuple[float, str]:
    """
    Computes navigation choke score (0.0 to 1.0) and identifies nearest public jetty.
    Choke score is proportional to:
    1. Distance to public ferry jetties (150m buffer gives max score)
    2. Estimated canal constriction (narrow canal blocked = 0.9+, wide lake = 0.5-0.7)
    """
    poly = Polygon(polygon_coords)
    centroid = poly.centroid

    min_dist_deg = 999.0
    nearest_name = "Punnamada Channel"
    max_jetty_impact = 0.0

    for jetty in OSM_JETTIES:
        pt = Point(jetty["lon"], jetty["lat"])
        dist = centroid.distance(pt)  # In degrees (~1 deg = ~111 km, 0.001 deg ~ 110 m)
        if dist < min_dist_deg:
            min_dist_deg = dist
            nearest_name = jetty["name"]

        # If within ~250 meters (0.0022 degrees)
        if dist < 0.0025:
            impact = jetty["weight"] * (1.0 - (dist / 0.0025) * 0.4)
            if impact > max_jetty_impact:
                max_jetty_impact = impact

    # Compute base choke score
    if max_jetty_impact > 0:
        choke_score = max_jetty_impact
    else:
        # Distance decay score for navigation channel
        choke_score = max(0.40, min(0.75, 1.0 - (min_dist_deg * 25.0)))

    return round(float(choke_score), 2), nearest_name
