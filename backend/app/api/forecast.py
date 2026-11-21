"""
Payal-to-Pay — Weather & Drying Forecast API Router
Fetches Open-Meteo precipitation windows for Alappuzha (9.4981° N, 76.3388° E)
and schedules drying yard capacities.
"""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter
import httpx
from backend.app.models import WeatherDryingForecast, DryingWindow, DryingYardStatus
from backend.app.db import get_db_connection
from backend.app.config import settings

router = APIRouter(prefix="/api/v1/forecast", tags=["Weather & Drying Engine"])


@router.get("/drying-windows", response_model=WeatherDryingForecast)
async def get_drying_windows():
    """
    Returns 7-day hourly rain forecast, harvest safety classification,
    and drying yard slot capacity.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM drying_yards")
    yards_db = cursor.fetchall()
    conn.close()

    yard_statuses = []
    for y in yards_db:
        yard_statuses.append(DryingYardStatus(
            yard_id=y["yard_id"],
            name=y["name"],
            location={"latitude": y["lat"], "longitude": y["lng"]},
            total_capacity_sqm=y["total_capacity_sqm"],
            occupied_sqm=y["occupied_sqm"],
            available_sqm=max(0.0, y["total_capacity_sqm"] - y["occupied_sqm"])
        ))

    # Fetch live Open-Meteo weather
    windows = []
    is_live = False
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={settings.OPEN_METEO_LATITUDE}&longitude={settings.OPEN_METEO_LONGITUDE}&"
            f"daily=precipitation_sum,precipitation_hours,sunshine_duration&"
            f"hourly=relative_humidity_2m&timezone=Asia%2FKolkata"
        )
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                daily = data.get("daily", {})
                times = daily.get("time", [])
                precip = daily.get("precipitation_sum", [])
                sun = daily.get("sunshine_duration", [])

                for idx in range(min(7, len(times))):
                    p_val = precip[idx] if idx < len(precip) else 0.0
                    s_sec = sun[idx] if idx < len(sun) else 21600.0
                    s_hours = round(s_sec / 3600.0, 1)

                    if p_val < 1.0 and s_hours >= 6.0:
                        cond = "OPTIMAL_DRY"
                        safe = True
                    elif p_val <= 5.0:
                        cond = "MARGINAL"
                        safe = True
                    else:
                        cond = "WET_NO_HARVEST"
                        safe = False

                    windows.append(DryingWindow(
                        date=times[idx],
                        condition=cond,
                        precipitation_mm=p_val,
                        sunshine_hours=s_hours,
                        relative_humidity_pct=72.0,
                        is_harvest_safe=safe
                    ))
                is_live = True
    except Exception:
        is_live = False

    # Deterministic fallback if offline
    if not windows:
        today = datetime.now(timezone.utc).date()
        fallback_data = [
            (0, "OPTIMAL_DRY", 0.0, 7.5, 68.0, True),
            (1, "OPTIMAL_DRY", 0.2, 7.0, 70.0, True),
            (2, "MARGINAL", 2.4, 4.5, 78.0, True),
            (3, "WET_NO_HARVEST", 12.0, 1.2, 92.0, False),
            (4, "MARGINAL", 3.8, 5.0, 80.0, True),
            (5, "OPTIMAL_DRY", 0.0, 8.0, 65.0, True),
            (6, "OPTIMAL_DRY", 0.5, 7.2, 69.0, True),
        ]
        for offset, cond, p, s, rh, safe in fallback_data:
            d = (today + timedelta(days=offset)).isoformat()
            windows.append(DryingWindow(
                date=d,
                condition=cond,
                precipitation_mm=p,
                sunshine_hours=s,
                relative_humidity_pct=rh,
                is_harvest_safe=safe
            ))

    return WeatherDryingForecast(
        location={
            "name": "Punnamada / Vembanad Lake, Alappuzha",
            "latitude": settings.OPEN_METEO_LATITUDE,
            "longitude": settings.OPEN_METEO_LONGITUDE
        },
        generated_at=datetime.now(timezone.utc).isoformat(),
        drying_windows=windows,
        drying_yards=yard_statuses,
        is_simulated=not is_live
    )
