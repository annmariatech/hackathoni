"""
Payal-to-Pay — SQLite Database & State Store
Maintains state for harvester crews, hyacinth patches, drying yards, harvest records,
and the simulated fair-wage ledger.
"""
import sqlite3
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).resolve().parent.parent.parent / "payal.db"


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_db_connection()
    cursor = conn.cursor()

    # Enable WAL mode for high performance concurrent reads
    cursor.execute("PRAGMA journal_mode=WAL;")

    # Crews / Boats
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crews (
        crew_id TEXT PRIMARY KEY,
        crew_name TEXT NOT NULL,
        boat_type TEXT NOT NULL,
        capacity_kg REAL NOT NULL,
        home_jetty TEXT NOT NULL,
        current_lat REAL,
        current_lng REAL,
        status TEXT DEFAULT 'ACTIVE'
    );
    """)

    # Hyacinth Patches
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patches (
        patch_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        area_sqm REAL NOT NULL,
        biomass_est_kg REAL NOT NULL,
        choke_score REAL NOT NULL,
        growth_trend TEXT NOT NULL,
        nearest_jetty TEXT NOT NULL,
        coordinates_json TEXT NOT NULL,
        is_cleared INTEGER DEFAULT 0,
        is_simulated INTEGER DEFAULT 0,
        detected_at TEXT NOT NULL
    );
    """)

    # Drying Yards
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS drying_yards (
        yard_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        total_capacity_sqm REAL NOT NULL,
        occupied_sqm REAL DEFAULT 0.0
    );
    """)

    # Harvest Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS harvest_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        crew_id TEXT NOT NULL,
        weight_kg REAL NOT NULL,
        location TEXT NOT NULL,
        patch_id TEXT,
        yard_id TEXT,
        FOREIGN KEY(crew_id) REFERENCES crews(crew_id)
    );
    """)

    # Simulated Ledger Transactions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ledger_transactions (
        tx_hash TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        crew_id TEXT NOT NULL,
        crew_name TEXT NOT NULL,
        patch_id TEXT NOT NULL,
        yard_id TEXT,
        weight_kg REAL NOT NULL,
        rate_inr_per_kg REAL NOT NULL,
        base_payout_inr REAL NOT NULL,
        bonus_inr REAL NOT NULL,
        total_payout_inr REAL NOT NULL,
        status TEXT NOT NULL,
        bank_reference TEXT NOT NULL,
        is_simulated INTEGER DEFAULT 1
    );
    """)

    conn.commit()
    conn.close()


def seed_initial_data() -> None:
    """Populates initial deterministic fixtures for Alappuzha/Vembanad."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM crews")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # Seed Harvester Crews
    crews = [
        ("crew-1", "ലീല & സതി (Kudumbashree Unit 1)", "Wooden Country Boat (വള്ളം)", 600.0, "Kainakary Jetty", 9.4965, 76.3812, "ACTIVE"),
        ("crew-2", "അനിത & മിനി (Kudumbashree Unit 2)", "FRP Motorized Vanchi", 750.0, "Punnamada Finish Jetty", 9.5080, 76.3520, "ACTIVE"),
        ("crew-3", "ഷീല & രാധ (Kudumbashree Unit 3)", "Country Boat (വള്ളം)", 500.0, "Nedumudi Jetty", 9.4410, 76.4020, "ACTIVE"),
    ]
    cursor.executemany("INSERT INTO crews VALUES (?, ?, ?, ?, ?, ?, ?, ?)", crews)

    # Seed Drying Yards
    yards = [
        ("yard-kainakary", "കൈനകരി വടക്ക് യാർഡ് (Kainakary North Yard)", 9.5010, 76.3850, 1200.0, 350.0),
        ("yard-punnamada", "പുന്നമട സൗത്ത് യാർഡ് (Punnamada Yard)", 9.5040, 76.3480, 2000.0, 600.0),
        ("yard-nedumudi", "നെടുമുടി കമ്മ്യൂണിറ്റി യാർഡ് (Nedumudi Yard)", 9.4380, 76.4050, 1500.0, 420.0),
    ]
    cursor.executemany("INSERT INTO drying_yards VALUES (?, ?, ?, ?, ?, ?)", yards)

    # Seed Hyacinth Patches (Punnamada–Kainakary AOI)
    patches = [
        (
            "patch-1",
            "Punnamada Jetties Choke (പുന്നമട ജെട്ടി തടസ്സം)",
            4200.0,
            77700.0,
            0.92,
            "EXPANDING",
            "Punnamada Finishing Point",
            '[[[76.3480, 9.5030], [76.3530, 9.5030], [76.3530, 9.5080], [76.3480, 9.5080], [76.3480, 9.5030]]]',
            0,
            0,
            datetime.now(timezone.utc).isoformat()
        ),
        (
            "patch-2",
            "Kainakary North Canal Bottleneck (കൈനകരി വടക്ക് തടസ്സം)",
            3100.0,
            57350.0,
            0.88,
            "EXPANDING",
            "Kainakary Ferry Jetty",
            '[[[76.3780, 9.4970], [76.3840, 9.4970], [76.3840, 9.5020], [76.3780, 9.5020], [76.3780, 9.4970]]]',
            0,
            0,
            datetime.now(timezone.utc).isoformat()
        ),
        (
            "patch-3",
            "Kuppappuram River Junction (കുപ്പപ്പുറം നദീസംഗമം)",
            5500.0,
            101750.0,
            0.75,
            "STABLE",
            "Kuppappuram Jetty",
            '[[[76.3620, 9.4890], [76.3690, 9.4890], [76.3690, 9.4950], [76.3620, 9.4950], [76.3620, 9.4890]]]',
            0,
            0,
            datetime.now(timezone.utc).isoformat()
        ),
        (
            "patch-4",
            "Pallathuruthy Bridge Channel (പള്ളാത്തുരുത്തി ചാനൽ)",
            2800.0,
            51800.0,
            0.64,
            "RECEDING",
            "Pallathuruthy Jetty",
            '[[[76.3550, 9.4720], [76.3610, 9.4720], [76.3610, 9.4770], [76.3550, 9.4770], [76.3550, 9.4720]]]',
            0,
            0,
            datetime.now(timezone.utc).isoformat()
        ),
        (
            "patch-5",
            "Nedumudi Shikkara Channel (നെടുമുടി ശിക്കാര ചാനൽ)",
            3600.0,
            66600.0,
            0.81,
            "EXPANDING",
            "Nedumudi Boat Jetty",
            '[[[76.3980, 9.4420], [76.4050, 9.4420], [76.4050, 9.4480], [76.3980, 9.4480], [76.3980, 9.4420]]]',
            0,
            0,
            datetime.now(timezone.utc).isoformat()
        )
    ]
    cursor.executemany("INSERT INTO patches VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", patches)

    # Seed baseline simulated ledger transactions
    now_iso = datetime.now(timezone.utc).isoformat()
    t1_hash = hashlib.sha256(b"seed_tx_crew_1_yesterday").hexdigest()
    cursor.execute("""
    INSERT INTO ledger_transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        t1_hash,
        now_iso,
        "crew-1",
        "ലീല & സതി (Kudumbashree Unit 1)",
        "patch-2",
        "yard-kainakary",
        420.0,
        3.50,
        1470.0,
        500.0,
        1970.0,
        "DISBURSED",
        "KGB-UPI-88492019",
        1
    ))

    conn.commit()
    conn.close()


class DatabaseStateExecutor:
    """State executor passed to Voice Dispatcher to mutate database upon tool calls."""

    def record_harvest(self, crew_id: str, weight_kg: float, location: str) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Find crew details
        cursor.execute("SELECT crew_name FROM crews WHERE crew_id = ?", (crew_id,))
        row = cursor.fetchone()
        crew_name = row[0] if row else "Kudumbashree Harvester"

        # Log harvest
        now_iso = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
        INSERT INTO harvest_logs (timestamp, crew_id, weight_kg, location, patch_id, yard_id)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (now_iso, crew_id, weight_kg, location, "patch-2", "yard-kainakary"))

        # Update boat location to the harvest location
        lat = 9.4975 if "കൈനകരി" in location or "Kainakary" in location else 9.5050
        lng = 76.3820 if "കൈനകരി" in location or "Kainakary" in location else 76.3500
        cursor.execute("UPDATE crews SET current_lat = ?, current_lng = ? WHERE crew_id = ?", (lat, lng, crew_id))

        # Create simulated ledger transaction immediately
        rate = 3.50
        base = round(weight_kg * rate, 2)
        bonus = 500.0  # Choke clearance bonus
        total = round(base + bonus, 2)

        tx_raw = f"{crew_id}|{weight_kg}|{time.time()}"
        tx_hash = hashlib.sha256(tx_raw.encode()).hexdigest()
        bank_ref = f"KGB-UPI-{int(time.time()) % 100000000}"

        cursor.execute("""
        INSERT INTO ledger_transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tx_hash,
            now_iso,
            crew_id,
            crew_name,
            "patch-2",
            "yard-kainakary",
            weight_kg,
            rate,
            base,
            bonus,
            total,
            "DISBURSED",
            bank_ref,
            1  # is_simulated
        ))

        # Update yard occupancy
        cursor.execute("""
        UPDATE drying_yards SET occupied_sqm = MIN(total_capacity_sqm, occupied_sqm + ?)
        WHERE yard_id = 'yard-kainakary'
        """, (weight_kg * 0.15,))

        conn.commit()
        conn.close()

        return {
            "status": "SUCCESS",
            "tx_hash": tx_hash,
            "payout_total_inr": total,
            "bank_ref": bank_ref,
            "assigned_yard": "Kainakary North Yard",
            "updated_lat": lat,
            "updated_lng": lng
        }

    def get_assignment(self, crew_id: str) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT patch_id, name, choke_score, nearest_jetty FROM patches WHERE is_cleared = 0 ORDER BY choke_score DESC LIMIT 1")
        patch = cursor.fetchone()
        conn.close()

        if patch:
            return {
                "patch_id": patch["patch_id"],
                "name": patch["name"],
                "choke_score": patch["choke_score"],
                "nearest_jetty": patch["nearest_jetty"]
            }
        return {"destination": "Punnamada Finish Jetty", "eta": "20 mins"}


db_state_executor = DatabaseStateExecutor()
