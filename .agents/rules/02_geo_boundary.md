# Geo Agent Boundary & Guidelines

## 1. Ownership Scope
The Geo agent owns and edits only files inside `geo/`:
- `geo/s1_detector.py`: Sentinel-1 SAR change detection and thresholding.
- `geo/water_mask.py`: Permanent water masking (OSM/water occurrence) to exclude land vegetation.
- `geo/choke_scorer.py`: Navigation choke scoring against OSM boat jetties and ferry channels.
- `geo/fixtures/`: Pre-processed radar GeoJSON and GeoTIFF fixtures.
- `geo/data/`: OSM canal, jetty, and route GeoJSON extracts.

## 2. Area of Interest (AOI)
- Focus exclusively on the Punnamada–Kainakary canal corridor in Vembanad Lake:
  - Bounding Box: `[76.3300, 9.4700, 76.4300, 9.5600]` (approx. 10x10 km).
  - Key landmarks: Punnamada Lake (Nehru Trophy finish), Kainakary North/South canals, Kuppappuram, Nedumudi junction.

## 3. SAR Detection Principles
- Smooth open water exhibits specular reflection (low backscatter, typically -22 dB to -28 dB).
- Dense water hyacinth canopy produces high volumetric backscatter (-12 dB to -6 dB in dual-pol VV/VH).
- Isolate water first using the water mask; do not classify paddy fields or inland coconut groves as hyacinth.

## 4. Fallback Requirement
- Raw satellite STAC queries and raster downloads can exceed network limits on hackathon Wi-Fi.
- Always provide a deterministic, pre-computed fallback fixture (`geo/fixtures/punnamada_radar_fallback.geojson`).
- If STAC query fails or times out (>10s), automatically load fallback data and set `is_simulated: true` or `is_fallback: true` in the output GeoJSON.
