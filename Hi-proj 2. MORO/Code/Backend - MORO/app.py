# app.py
from pathlib import Path
import os, re
from dotenv import load_dotenv
load_dotenv()

import sqlite3, time  # DB 모듈은 상단에서
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from notion_client import Client
from datetime import datetime

from notion_publish import create_public_child_from_template, update_aside_block
from prompt_config import build_system_prompt
from cleanup_store import (
    log_created_page, get_expired_pages, remove_logged_pages
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://nainju.github.io",
    "https://nainju.github.io/proj-MORO-web/",
]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}},
     supports_credentials=False,
     methods=["GET","POST","OPTIONS"],
     allow_headers=["Content-Type"])

START_TIME = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
APP_VERSION = os.getenv("GIT_SHA", "dev")
BUILD_TIME = os.getenv("BUILD_TIME", "unknown")

# 부팅 실패 방지용
BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = Path(os.getenv("NOTION_TEMPLATE_PATH", BASE_DIR / "data" / "notion_template.md"))

def load_template() -> str:
    try:
        return TEMPLATE_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        # 부팅 실패 막기 위해 안전한 폴백
        return "# Default Notion Template\n"


def make_openai():
    key = os.getenv("OPENAI_API_KEY")
    if not key or not key.startswith("sk-"):
        raise RuntimeError("OPENAI_API_KEY 누락/형식 오류")
    return OpenAI(api_key=key, timeout=float(os.getenv("OPENAI_TIMEOUT", "20")), max_retries=int(os.getenv("OPENAI_RETRIES","2")))

SYSTEM = build_system_prompt()

FEWSHOT = [
  {"role":"user","content":"안녕하세요"},
  {"role":"assistant","content":"반가워요! 우선 여행 분위기부터 알려주세요.(예: 자연, 카페투어, 미니멀)\n\n[NEXT: ask] FILLED: MISSING: style CONF:0.10"},
  {"role":"user","content":"카페투어 좋아해요. 친구랑 둘이요."},
  {"role":"assistant","content":"좋아요! 여유로운 페이스가 좋을까요, 알차게 많이 둘러볼까요? 기간/예산도 대략 알려주시면 맞춤 추천이 쉬워요.\n\n[NEXT: ask] FILLED: style,companions MISSING:pace,days,budget CONF: 0.45"},
]

# --- meta stripper ---
META_BLOCK_RE = re.compile(r"```meta[\s\S]*?```", re.IGNORECASE)
BRACKET_LINE_RE = re.compile(r"\s*\[[^\]\n]*\b(NEXT|다음)\b[^\]\n]*\](?:[^\n]*)?", re.IGNORECASE)
KEY_LINE_RE = re.compile(
    r".*\b(NEXT|OPTIONS?|OPTION|FILLED|MISSING|CONF(?:IDENCE)?)\b\s*[:：].*"
    r"|.*\b(다음|옵션|선택지|채움|부족|확신)\b\s*[:：].*",
    re.IGNORECASE,
)

def strip_meta_py(raw: str) -> str:
    if not isinstance(raw, str):
        return ""
    t = (raw or "").replace("\r\n", "\n").replace("\u00A0", " ").replace("：", ":").replace("—", "-").replace("–", "-")
    t = re.sub(META_BLOCK_RE, "", t)
    t = re.sub(BRACKET_LINE_RE, "", t)
    lines = []
    for line in t.split("\n"):
        if re.search(KEY_LINE_RE, line):
            continue
        lines.append(line)
    t = "\n".join(lines)
    m = re.search(r"\n\s*(?:\[?\s*(NEXT|다음)\s*:|```meta)", t, flags=re.IGNORECASE)
    if m:
        t = t[:m.start()]
    t = re.sub(r"[ \t]+\n", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()

@app.get("/version")
def version():
    return jsonify(ok=True, version=APP_VERSION, build_time=BUILD_TIME, start_time=START_TIME)

@app.get("/health")
def health():
    required = ["OPENAI_API_KEY", "NOTION_API_KEY", "NOTION_TEMPLATE_PAGE_ID", "NOTION_PARENT_ID"]
    missing = [k for k in required if not os.getenv(k)]
    return jsonify(ok=(len(missing)==0), missing=missing)

@app.post("/chat")
def chat():
    try:
        data = request.get_json(force=True) or {}
        raw_messages = data.get("messages", [])
        messages = []
        for m in raw_messages:
            if isinstance(m, dict) and m.get("role") in {"system","user","assistant"} and isinstance(m.get("content"), str):
                messages.append({"role": m["role"], "content": m["content"]})
        MAX_TURNS = 16
        ua = [m for m in messages if m["role"] in {"user","assistant"}]
        messages = [{"role":"system","content":SYSTEM}] + FEWSHOT + ua[-MAX_TURNS:]

        client = make_openai()
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        resp = client.chat.completions.create(
            model=model, messages=messages,
            temperature=0.3, top_p=0.9, frequency_penalty=0.2, max_tokens=900,
        )
        text = (resp.choices[0].message.content or "").strip()
        visible = strip_meta_py(text)
        return jsonify(ok=True, response=visible, meta=text)
    except Exception as e:
        print("CHAT ERROR:", repr(e))
        msg = "챗봇 응답 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
        try:
            from openai import AuthenticationError, RateLimitError
            if isinstance(e, AuthenticationError):
                msg = "API 키 인증에 문제가 있습니다. 관리자에게 문의해 주세요."
            elif isinstance(e, RateLimitError):
                msg = "잠시 요청이 많습니다. 잠시 후 다시 시도해 주세요."
        except Exception:
            pass
        return jsonify(ok=False, error=msg), 500

@app.post("/notion/create")
def notion_create():
    d = request.get_json(force=True) or {}
    title = d.get("title") or d.get("selected_trip") or "여행 계획"
    vars = {
        "style": d.get("style",""),
        "region": d.get("region",""),
        "companions": d.get("companions",""),
        "summary": d.get("summary",""),
    }
    itinerary = d.get("itinerary")
    travel_info = d.get("travel_info")
    try:
        created = create_public_child_from_template(title, vars, itinerary)
        page_id, page_url = created["page_id"], created["page_url"]
        if travel_info:
            try:
                update_aside_block(page_id, travel_info)
            except Exception as e:
                print("ASIDE UPDATE WARN:", repr(e))
        log_created_page(page_id, page_url)
        guide = (
          "노션 페이지가 생성되었습니다.\n"
          "1) 링크 열기 → 2) 우측 상단 'Duplicate'로 내 워크스페이스에 복제\n"
          "3) (선택) 일정 CSV를 노션에서 '가져오기'로 불러오세요"
        )
        return jsonify(ok=True, page_url=page_url, guide=guide)
    except Exception as e:
        return jsonify(ok=False, error=str(e)), 500

# ---- cleanup ----
NOTION_API_KEY = os.getenv("NOTION_API_KEY")

def cleanup_notion_pages() -> dict:
    client = Client(auth=NOTION_API_KEY)
    expired = get_expired_pages()
    archived_ids, failed = [], []
    for pid, _ in expired:
        try:
            client.pages.update(page_id=pid, archived=True)
            archived_ids.append(pid)
        except Exception as e:
            print("ARCHIVE ERROR:", pid, repr(e))
            failed.append(pid)
    remove_logged_pages(archived_ids)
    return {"archived": archived_ids, "failed": failed, "count": len(archived_ids)}

@app.post("/admin/cleanup")
def admin_cleanup():
    admin_token = os.getenv("ADMIN_TOKEN")
    if admin_token and request.headers.get("X-Admin-Token") != admin_token:
        return jsonify(ok=False, error="unauthorized"), 401
    result = cleanup_notion_pages()
    return jsonify(ok=True, **result)

# ---- scheduler ----
from apscheduler.schedulers.background import BackgroundScheduler
if os.getenv("ENABLE_CLEANUP", "1") == "1":
    sched = BackgroundScheduler(timezone="Asia/Seoul")
    sched.add_job(lambda: print("[CLEANUP]", datetime.now(), cleanup_notion_pages()),
                  "cron", hour=3, minute=30)
    sched.start()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    app.run(host="0.0.0.0", port=port, debug=False)