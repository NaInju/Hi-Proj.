# cleanup_store.py
import os, sqlite3, time, threading

DB_PATH = os.getenv("CLEANUP_DB_PATH", "created_pages.db")
RETENTION_DAYS = int(os.getenv("NOTION_RETENTION_DAYS", "14"))

_DB_LOCK = threading.Lock()

def _db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.execute("""
    CREATE TABLE IF NOT EXISTS created_pages (
      page_id TEXT PRIMARY KEY,
      page_url TEXT,
      created_ts INTEGER
    )
    """)
    return conn

def log_created_page(page_id: str, page_url: str):
    with _DB_LOCK:
        conn = _db()
        conn.execute(
            "REPLACE INTO created_pages (page_id, page_url, created_ts) VALUES (?,?,?)",
            (page_id, page_url, int(time.time()))
        )
        conn.commit()
        conn.close()

def get_expired_pages() -> list[tuple[str, str]]:
    cutoff = int(time.time()) - RETENTION_DAYS * 24 * 3600
    with _DB_LOCK:
        conn = _db()
        rows = conn.execute(
            "SELECT page_id, page_url FROM created_pages WHERE created_ts < ?",
            (cutoff,)
        ).fetchall()
        conn.close()
    return rows

def remove_logged_pages(page_ids: list[str]):
    if not page_ids:
        return
    with _DB_LOCK:
        conn = _db()
        q = "DELETE FROM created_pages WHERE page_id IN (%s)" % ",".join(["?"] * len(page_ids))
        conn.execute(q, page_ids)
        conn.commit()
        conn.close()