#!/usr/bin/env python3
"""
Seed script to reinitialize SQLite database and seed initial test fixtures.
"""
from backend.app.db import init_db, seed_initial_data

if __name__ == "__main__":
    print("Initializing Payal-to-Pay SQLite database...")
    init_db()
    seed_initial_data()
    print("Database successfully initialized and seeded with Alappuzha/Vembanad fixtures.")
