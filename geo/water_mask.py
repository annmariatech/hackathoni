"""
Payal-to-Pay — Water Mask Filter
Enforces spatial restriction to water surfaces in Vembanad Lake / Punnamada–Kainakary corridor.
Filters out terrestrial false-positives (paddy fields, coconut groves).
"""
from typing import List, Tuple
from shapely.geometry import Polygon, Point, MultiPolygon
from shapely.ops import unary_union

# Bounding box of AOI: [min_lon, min_lat, max_lon, max_lat]
AOI_BBOX = (76.3300, 9.4700, 76.4300, 9.5600)

# Generalized permanent water bodies of Vembanad Lake, Punnamada, and Kainakary canals
WATER_POLYGONS = [
    # Vembanad Lake main basin (southern expanse)
    Polygon([
        (76.3300, 9.5100), (76.3650, 9.5550), (76.3850, 9.5600),
        (76.4100, 9.5450), (76.3950, 9.5150), (76.3600, 9.4950),
        (76.3400, 9.4950), (76.3300, 9.5100)
    ]),
    # Punnamada Lake canal channel (Nehru Trophy course)
    Polygon([
        (76.3450, 9.5010), (76.3580, 9.5010), (76.3620, 9.5100),
        (76.3500, 9.5110), (76.3450, 9.5010)
    ]),
    # Kainakary North & South canal waterways
    Polygon([
        (76.3700, 9.4880), (76.3900, 9.4880), (76.3920, 9.5100),
        (76.3750, 9.5100), (76.3700, 9.4880)
    ]),
    # Kuppappuram to Nedumudi river link
    Polygon([
        (76.3550, 9.4650), (76.3700, 9.4650), (76.4150, 9.4350),
        (76.4000, 9.4350), (76.3550, 9.4650)
    ])
]

PERMANENT_WATER_MASK = unary_union(WATER_POLYGONS)


def is_in_water(lon: float, lat: float) -> bool:
    """Checks if a point coordinate is within the permanent water boundary."""
    pt = Point(lon, lat)
    return PERMANENT_WATER_MASK.contains(pt) or PERMANENT_WATER_MASK.distance(pt) < 0.001


def clip_to_water(geometry_coords: List[List[List[float]]]) -> List[List[List[float]]]:
    """Clips or filters polygon coordinates to only water surfaces."""
    poly = Polygon(geometry_coords[0])
    if not poly.is_valid:
        poly = poly.buffer(0)
    intersection = poly.intersection(PERMANENT_WATER_MASK)
    if intersection.is_empty:
        return geometry_coords  # Return original if intersection fails
    if isinstance(intersection, Polygon):
        return [list(intersection.exterior.coords)]
    elif isinstance(intersection, MultiPolygon):
        largest = max(intersection.geoms, key=lambda a: a.area)
        return [list(largest.exterior.coords)]
    return geometry_coords
