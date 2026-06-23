# database.py
import sqlite3
import json
from datetime import datetime, timezone, timedelta
from contextlib import contextmanager

DB_PATH = "predictive_maintenance.db"
IST = timezone(timedelta(hours=5, minutes=30))   

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            source TEXT NOT NULL,
            machine_unit TEXT,
            machine_type TEXT,
            input_data TEXT NOT NULL,
            prediction_type TEXT NOT NULL,
            result TEXT NOT NULL,
            shap_values TEXT NOT NULL,
            ai_explanation TEXT,
            risk_level TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def insert_prediction(record: dict):
    ist_now = datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S")   # NAYA — IST time banaya
    with get_db() as conn:
        conn.execute("""
            INSERT INTO predictions
            (id, created_at, source, machine_unit, machine_type, input_data, prediction_type, result, shap_values, ai_explanation, risk_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record["id"],
            ist_now,
            record["source"],
            record.get("machine_unit"),
            record.get("machine_type"),
            json.dumps(record["input_data"]),
            record["prediction_type"],
            json.dumps(record["result"]),
            json.dumps(record["shap_values"]),
            record.get("ai_explanation"),
            record["risk_level"],
        ))
        conn.commit()

def get_history(risk_level: str | None = None, prediction_type: str | None = None, limit: int = 50) -> list[dict]:
    query = "SELECT * FROM predictions WHERE 1=1"
    params = []
    if risk_level:
        query += " AND risk_level = ?"
        params.append(risk_level)
    if prediction_type:
        query += " AND prediction_type = ?"
        params.append(prediction_type)
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    with get_db() as conn:
        rows = conn.execute(query, params).fetchall()
        return [_row_to_dict(r) for r in rows]

def _row_to_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    d["input_data"] = json.loads(d["input_data"])
    d["result"] = json.loads(d["result"])
    d["shap_values"] = json.loads(d["shap_values"])
    return d