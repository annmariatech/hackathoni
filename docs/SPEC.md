# System Specification: Payal-to-Pay (പായൽ)
**Satellite-to-Wages Water Hyacinth Supply Chain with Malayalam Voice Desk**

---

## 1. Domain Background & Problem Statement

Vembanad Lake in Alappuzha, Kerala, is a Ramsar wetland and the heart of Kerala's backwater tourism and inland fishing economy. Water hyacinth (*Eichhornia crassipes*, locally known as *Payal* / പായൽ or *African Payal*) infests the lake at alarming rates:
- **Navigation Hazard:** Dense mats block passenger ferries, shikara boats, houseboats, and emergency water ambulances. Jetties become impassable within hours due to wind and tidal currents.
- **Ecological Damage:** Hyacinth mats block sunlight, deplete dissolved oxygen, kill indigenous fish species, and choke paddy irrigation inlets in Kuttanad.
- **The Broken Supply Chain:** Hyacinth stalks can be dried into high-tensile craft fibre used by women's cooperatives (Kudumbashree) for making bags, mats, handicrafts, and biodegradable packaging. However:
  1. Collection is sporadic and uncoordinated.
  2. Drying is severely bottlenecked during monsoon and humid coastal weather (fresh stalks are ~90% water and rot within 24–48 hours if not dried).
  3. Artisans frequently suffer from supply shortages and import dried stalks from neighboring states at high cost.
  4. Harvesters lack predictable income and easy communication channels.

**Payal-to-Pay** orchestrates the physical supply chain through:
1. **Satellite Radar (Sentinel-1 SAR):** Penetrates clouds and rain to detect biomass build-up and prioritize clearance of choke points near public boat jetties and ferry routes.
2. **Weather-Aware Drying Forecast (Open-Meteo):** Matches harvesting operations with rain-free drying windows and drying-yard space.
3. **Optimized Logistics (OR-Tools):** Schedules harvester boats, capacity limits, and yard delivery points, outperforming baseline heuristics.
4. **Malayalam Voice Desk (Sarvam AI):** Delivers an accessible, spoken-Malayalam interface for boat crews using push-to-talk to report harvest weights and receive navigation assignments.
5. **Simulated Fair-Wage Ledger:** Releases transparent, verifiable wage credits directly to harvester accounts upon geotagged photo verification.
6. **Credibility & Transparency:** Provides side-by-side accuracy metrics, optimizer baselines, and clear honesty labeling for every data stream.

---

## 2. System Architecture & Component Interactions

```
+-----------------------------------------------------------------------------------+
|                                  USER / BOAT CREW                                 |
+-------------------+-------------------------------------------+-------------------+
                    | (Spoken Malayalam Audio / PTT)            | (Photo Geotag)
                    v                                           v
+-------------------+-------------------------------------------+-------------------+
|                        FRONTEND PWA (React + MapLibre GL)                         |
|  - Real/Simulated Honesty Badges                                                  |
|  - Offline Caching via Service Worker & IndexedDB                                 |
+-----------------------------------+-----------------------------------------------+
                                    | REST API Calls
                                    v
+-----------------------------------+-----------------------------------------------+
|                            FASTAPI BACKEND SERVICE                                |
|  +------------------------+-----------------------+----------------------------+  |
|  |     Voice Router       |       Geo Router      |      Optimizer Router      |  |
|  +-----------+------------+-----------+-----------+-------------+--------------+  |
|              |                        |                         |                 |
|              v                        v                         v                 |
|     +--------+--------+      +--------+--------+       +--------+--------+        |
|     | Sarvam AI Client|      | Sentinel-1 SAR  |       | Google OR-Tools |        |
|     | - Saaras (STT)  |      | Water Mask &    |       | CVRPTW Solver   |        |
|     | - Bulbul v3(TTS)|      | Choke Scorer    |       | Baseline Engine |        |
|     | - Sarvam-30b/105b      |                 |       +-----------------+        |
|     +-----------------+      +-----------------+                                  |
|                                       | Open-Meteo API                            |
|                                       v                                           |
|                              +--------+--------+                                  |
|                              | Drying Window   |                                  |
|                              | Capacity Model  |                                  |
|                              +-----------------+                                  |
|                                       |                                           |
|                                       v                                           |
|                              +--------+--------+                                  |
|                              | SQLite Ledger & |                                  |
|                              | State Store     |                                  |
|                              +-----------------+                                  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Data Models & Constants

### 3.1 Geographic Area of Interest (AOI)
- **Bounding Box:** `[76.3300, 9.4700, 76.4300, 9.5600]` (WGS84 EPSG:4326)
- **Center:** Punnamada Lake, Alappuzha (`9.4981° N, 76.3388° E`)
- **Key Waterways:** Punnamada Finishing Point, Kainakary North Canal, Kainakary South Canal, Kuppappuram River, Nedumudi Link.

### 3.2 Physical & Economic Assumptions
| Parameter | Value | Reference / Justification |
| :--- | :--- | :--- |
| **Wet Biomass Density** | $18.5\text{ kg/m}^2$ | Kerala Agricultural University (KAU) backwater studies |
| **Moisture Content** | $90.5\%$ | 10 kg wet hyacinth yields ~0.95–1.0 kg dried fibre |
| **Drying Time Required** | 48–72 hours | Direct solar radiation with relative humidity $< 75\%$ |
| **Harvester Wage Rate** | ₹3.50 / kg wet | Standard Kudumbashree collection wage incentive |
| **Waterway Choke Clearance Bonus** | ₹500 flat | Awarded for clearing critical navigation routes |
| **Artisan Fibre Purchase Price** | ₹45.00 / kg dry | Market procurement rate for craft weaving units |
| **Country Boat Payload Capacity** | 600 kg per boat | Traditional wooden Vanchi / FRP canal vessel |
| **Boat Cruising Speed** | 10 km/h | Navigational speed limit in inland canals |

---

## 4. API Endpoints Specification

All endpoints adhere to `contracts/openapi.yaml`.

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and upstream connectivity |
| `GET` | `/api/v1/geo/patches` | Returns detected hyacinth patches with choke scores (GeoJSON) |
| `GET` | `/api/v1/forecast/drying-windows` | 7-day hourly rain forecast and drying-yard slot status |
| `POST` | `/api/v1/routes/optimize` | Runs OR-Tools CVRPTW optimizer and compares against baseline |
| `POST` | `/api/v1/voice/interact` | Uploads audio clip, returns transcript, tool dispatch, and TTS audio |
| `POST` | `/api/v1/voice/speak` | Dynamic Malayalam TTS generation using Bulbul v3 |
| `GET` | `/api/v1/voice/credits` | Reports Sarvam character and audio second credit consumption |
| `POST` | `/api/v1/verify/photo` | Verifies geotagged photo against patch coordinates |
| `GET` | `/api/v1/ledger/transactions` | Lists simulated wage transactions and disbursement receipts |
| `POST` | `/api/v1/ledger/payout` | Creates a simulated wage disbursement transaction |
| `GET` | `/api/v1/credibility/benchmarks` | Returns IoU, WER, and optimizer delta benchmark metrics |

---

## 5. Module Details

### 5.1 Module 1: DETECT (Sentinel-1 SAR)
- Dual-pol (VV/VH) radar backscatter change detection.
- Water masking to eliminate false positives from terrestrial vegetation.
- Choke scoring algorithm computes spatial proximity to OSM jetties (150m buffer) and ferry paths.
- Fallback GeoJSON provided in `geo/fixtures/punnamada_radar_fallback.geojson`.

### 5.2 Module 2: FORECAST (Open-Meteo Drying Engine)
- Hourly precipitation probability and rainfall amount (mm).
- Drying window classification: `OPTIMAL_DRY` (<1mm rain, >6h sun), `MARGINAL` (1–5mm rain), `WET_NO_HARVEST` (>5mm rain).
- Yard capacity tracker: dynamically adjusts remaining drying area ($m^2$) as batches progress through 48h drying cycles.

### 5.3 Module 3: OPTIMIZE (OR-Tools vs Baseline)
- Multi-boat CVRPTW formulation in `ortools.constraint_solver`.
- Constraints: boat capacity (600 kg), operating hours (07:00–17:00), yard opening times, rain cutoffs.
- Objective: maximize total cleared choke score while minimizing distance.
- Baseline: Greedy nearest-patch-first heuristic.
- Emits delta metrics: $\Delta \text{km}$ saved, $\Delta \text{choke clearance}$ percentage.

### 5.4 Module 4: VOICE DESK (Sarvam AI)
- ASR: Saaras (`ml-IN` codemix) transcribing Malayalam speech.
- Dispatcher: `sarvam-30b` or `sarvam-105b` tool-calling LLM.
- TTS: Bulbul v3 (`bulbul:v3`) generating spoken Malayalam.
- Disk caching for fixed audio phrases using SHA-256 hash.
- Full credit usage tracking (characters, audio seconds).

### 5.5 Module 5: VERIFY & PAY
- EXIF extraction for latitude, longitude, and timestamp from uploaded photos.
- Geofence verification against target patch ($\le 200\text{ m}$).
- Simulated ledger with cryptographically chained SHA-256 hashes.
- Honest labelling: prominent `[SIMULATED LEDGER]` UI indicators.

### 5.6 Module 6: CREDIBILITY PANEL
- 4-tab evaluation interface:
  1. Radar IoU, Precision, Recall against 10 ground-truth patches.
  2. Speech accuracy: WER, CER, entity extraction over 20 Malayalam field clips.
  3. Optimizer vs Baseline delta performance table.
  4. Mathematical and economic assumptions table.
