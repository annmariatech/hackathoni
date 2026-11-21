"""
Payal-to-Pay — Simulated Ledger API Router
Transparently displays harvester wage payments with cryptographic transaction hashes.
"""
from typing import List
from datetime import datetime, timezone
import hashlib
import time
from fastapi import APIRouter, HTTPException
from backend.app.models import LedgerTransaction, PayoutRequest
from backend.app.db import get_db_connection

router = APIRouter(prefix="/api/v1/ledger", tags=["Simulated Ledger"])


@router.get("/transactions", response_model=List[LedgerTransaction])
async def list_transactions():
    """Returns full history of simulated wage payments."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ledger_transactions ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(LedgerTransaction(
            tx_hash=r["tx_hash"],
            timestamp=r["timestamp"],
            crew_id=r["crew_id"],
            crew_name=r["crew_name"],
            patch_id=r["patch_id"],
            yard_id=r["yard_id"],
            weight_kg=r["weight_kg"],
            rate_inr_per_kg=r["rate_inr_per_kg"],
            base_payout_inr=r["base_payout_inr"],
            bonus_inr=r["bonus_inr"],
            total_payout_inr=r["total_payout_inr"],
            status=r["status"],
            bank_reference=r["bank_reference"],
            is_simulated=True
        ))
    return results


@router.post("/payout", response_model=LedgerTransaction, status_code=201)
async def create_payout(payout: PayoutRequest):
    """Manually stages and releases a simulated wage payment."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT crew_name FROM crews WHERE crew_id = ?", (payout.crew_id,))
    row = cursor.fetchone()
    crew_name = row["crew_name"] if row else "Kudumbashree Boat Harvester"

    rate = 3.50
    base = round(payout.weight_kg * rate, 2)
    bonus = 500.0  # Choke point clearance incentive
    total = round(base + bonus, 2)
    now_iso = datetime.now(timezone.utc).isoformat()

    tx_raw = f"{payout.crew_id}|{payout.patch_id}|{payout.weight_kg}|{time.time()}"
    tx_hash = hashlib.sha256(tx_raw.encode()).hexdigest()
    bank_ref = f"KGB-UPI-{int(time.time() * 1000) % 100000000}"

    cursor.execute("""
    INSERT INTO ledger_transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tx_hash,
        now_iso,
        payout.crew_id,
        crew_name,
        payout.patch_id,
        payout.yard_id,
        payout.weight_kg,
        rate,
        base,
        bonus,
        total,
        "DISBURSED",
        bank_ref,
        1
    ))
    conn.commit()
    conn.close()

    return LedgerTransaction(
        tx_hash=tx_hash,
        timestamp=now_iso,
        crew_id=payout.crew_id,
        crew_name=crew_name,
        patch_id=payout.patch_id,
        yard_id=payout.yard_id,
        weight_kg=payout.weight_kg,
        rate_inr_per_kg=rate,
        base_payout_inr=base,
        bonus_inr=bonus,
        total_payout_inr=total,
        status="DISBURSED",
        bank_reference=bank_ref,
        is_simulated=True
    )
