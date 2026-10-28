import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.config import DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Safety inspections table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS safety_inspections (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        image_url TEXT,
        safety_score INTEGER,
        risk_level TEXT,
        compliance_status TEXT,
        data_json TEXT
    )
    """)

    # Structural cracks table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crack_analyses (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        image_url TEXT,
        crack_type TEXT,
        severity TEXT,
        risk_score INTEGER,
        structural_element TEXT,
        data_json TEXT
    )
    """)

    # Real estate valuations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS real_estate_valuations (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        property_type TEXT,
        built_up_area_sqft REAL,
        estimated_fair_value REAL,
        price_per_sqft REAL,
        data_json TEXT
    )
    """)

    # Project plans table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS project_plans (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        project_name TEXT,
        building_type TEXT,
        total_area_sqft REAL,
        total_estimated_budget REAL,
        data_json TEXT
    )
    """)

    # Daily site reports table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_site_reports (
        id TEXT PRIMARY KEY,
        date TEXT,
        location_name TEXT,
        weather_condition TEXT,
        site_safety_index INTEGER,
        data_json TEXT
    )
    """)

    # Knowledge queries table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_queries (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        domain TEXT,
        query TEXT,
        data_json TEXT
    )
    """)

    conn.commit()
    conn.close()

# Auto-initialize on module load so tables exist for all workers and test runners
init_db()

def save_record(table: str, id_val: str, summary_fields: Dict[str, Any], full_data: Dict[str, Any]):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    columns = ["id", "data_json"] + list(summary_fields.keys())
    placeholders = ", ".join(["?"] * len(columns))
    values = [id_val, json.dumps(full_data)] + list(summary_fields.values())

    query = f"INSERT OR REPLACE INTO {table} ({', '.join(columns)}) VALUES ({placeholders})"
    cursor.execute(query, values)
    conn.commit()
    conn.close()

def get_records(table: str, limit: int = 50) -> List[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        item = dict(r)
        if "data_json" in item and item["data_json"]:
            try:
                item["details"] = json.loads(item["data_json"])
            except Exception:
                item["details"] = {}
        results.append(item)
    conn.close()
    return results

def get_dashboard_stats() -> Dict[str, Any]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    stats = {
        "total_safety_inspections": 0,
        "avg_safety_score": 0,
        "total_crack_analyses": 0,
        "critical_crack_count": 0,
        "total_valuations": 0,
        "total_project_plans": 0,
        "total_daily_reports": 0,
        "total_knowledge_queries": 0,
    }

    try:
        cursor.execute("SELECT COUNT(*), AVG(safety_score) FROM safety_inspections")
        r = cursor.fetchone()
        stats["total_safety_inspections"] = r[0] or 0
        stats["avg_safety_score"] = round(r[1] or 0, 1)

        cursor.execute("SELECT COUNT(*) FROM crack_analyses")
        stats["total_crack_analyses"] = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM crack_analyses WHERE severity = 'Critical' OR severity = 'High'")
        stats["critical_crack_count"] = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM real_estate_valuations")
        stats["total_valuations"] = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM project_plans")
        stats["total_project_plans"] = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM daily_site_reports")
        stats["total_daily_reports"] = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM knowledge_queries")
        stats["total_knowledge_queries"] = cursor.fetchone()[0] or 0
    except Exception as e:
        print(f"Error fetching stats: {e}")
    finally:
        conn.close()

    return stats
