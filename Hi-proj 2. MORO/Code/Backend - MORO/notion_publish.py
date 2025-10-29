# notion_publish.py
import os
from typing import Dict, List, Optional
from notion_client import Client

# -----------------------------
# Utilities
# -----------------------------

def _children_all(notion: Client, block_id: str) -> List[dict]:
    """Fetch ALL children blocks under a block (recursively)."""
    out, cur = [], None
    while True:
        r = notion.blocks.children.list(block_id=block_id, start_cursor=cur)
        out += r.get("results", [])
        if not r.get("has_more"):
            break
        cur = r.get("next_cursor")

    # ✅ 각 블록의 children도 재귀적으로 불러오기
    for b in out:
        bid = b.get("id")
        if bid:
            kids = _children_all(notion, bid)
            if kids:
                b[b["type"]]["children"] = kids
    return out

def _replace_rich_text(rts: Optional[List[dict]], vars: Dict[str, str]) -> List[dict]:
    """Replace {{placeholders}} inside rich_text array safely."""
    if not isinstance(rts, list):
        return []
    def sub(s: str) -> str:
        if not isinstance(s, str):
            return s
        for k, v in vars.items():
            s = s.replace(f"{{{{{k}}}}}", v or "")
        return s
    new = []
    for rt in rts:
        if not isinstance(rt, dict):
            continue
        if rt.get("type") == "text":
            text = rt.get("text", {}) or {}
            content = text.get("content", "")
            text = {**text, "content": sub(content)}
            rt = {**rt, "text": text}
        new.append(rt)
    return new

def _deep_clean_none(x):
    """Remove only None values. Empty lists/dicts는 유지."""
    if isinstance(x, dict):
        return {k: _deep_clean_none(v) for k, v in x.items() if v is not None}
    if isinstance(x, list):
        return [_deep_clean_none(v) for v in x]
    return x

def _serialize_for_append(node: dict) -> dict:
    """
    column_list / table 은 생성 시점에 children이 인라인으로 필요하다.
    그 외 블록은 children을 제거하고, 생성 후 별도 append로 붙인다.
    """
    t = node["type"]
    data = dict(node.get(t, {}) or {})

    if t == "column_list":
        # column_list는 최소 2개의 column children이 필수.
        # 이때 column 자체의 children은 비우고(나중에 재귀 append)
        cols = data.get("children")
        if not isinstance(cols, list) or len(cols) < 2:
            cols = [
                {"object": "block", "type": "column", "column": {"children": []}},
                {"object": "block", "type": "column", "column": {"children": []}},
            ]
        else:
            # 각 column의 children은 생성 단계에선 비워둬야 함
            norm_cols = []
            for c in cols:
                if c.get("type") != "column":
                    continue
                col = dict(c.get("column", {}) or {})
                col["children"] = []  # ← 비워두고, 나중에 해당 column ID 아래로 붙임
                norm_cols.append({"object": "block", "type": "column", "column": col})
            # 최소 2개 보장
            while len(norm_cols) < 2:
                norm_cols.append({"object": "block", "type": "column", "column": {"children": []}})
            cols = norm_cols
        data["children"] = cols
        return {"object": "block", "type": t, t: data}

    if t == "table":
        # table은 생성 시 table_row children이 있어야 함.
        rows = data.get("children")
        if not isinstance(rows, list) or len(rows) == 0:
            rows = [{
                "object": "block",
                "type": "table_row",
                "table_row": {"cells": [[{"type": "text", "text": {"content": " "}}]]},
            }]
        data["children"] = rows
        return {"object": "block", "type": t, t: data}

    # 그 외 모든 블록은 children 제거 (생성 후 별도 append)
    data.pop("children", None)
    return {"object": "block", "type": t, t: data}

def _list_children(notion: Client, block_id: str) -> List[dict]:
    """지정 블록의 직속 children을 조회."""
    out, cur = [], None
    while True:
        r = notion.blocks.children.list(block_id=block_id, start_cursor=cur)
        out += r.get("results", [])
        if not r.get("has_more"):
            break
        cur = r.get("next_cursor")
    return out

def _append_tree(notion: Client, parent_id: str, nodes: List[dict], chunk_size: int = 50) -> None:
    """
    1) parent 아래에 nodes(최상위)만 먼저 append (children 제거 상태)
    2) parent의 children을 재조회해 방금 추가된 블록 ID들을 tail에서 매칭
    3) 각 노드에 children이 있으면 해당 블록 ID로 재귀적으로 append
    """
    if not nodes:
        return

    created_ids: List[str] = []
    # 1) 최상위 append
    for i in range(0, len(nodes), chunk_size):
        batch = nodes[i:i+chunk_size]
        payload = [_serialize_for_append(n) for n in batch]
        notion.blocks.children.append(block_id=parent_id, children=payload)

        # 2) parent children 재조회 후 tail로 매칭
        cur_children = _list_children(notion, parent_id)
        take = len(batch)
        tail = cur_children[-take:] if len(cur_children) >= take else cur_children
        created_ids.extend([b["id"] for b in tail])

    # 3) 각 노드의 children을 해당 블록 아래에 재귀 append
    for node, new_id in zip(nodes, created_ids):
        t = node["type"]
        node_data = node.get(t, {}) or {}

        if t == "column_list":
            # 방금 생성된 column_list 아래에 실제 column들의 children을 붙여야 한다.
            # 1) 생성된 column_list의 직속 children(=columns) ID 조회
            created_columns = _list_children(notion, new_id)
            # 2) 노드에 있던 columns와 매칭하여 각 column의 children을 append
            node_columns = node_data.get("children", [])
            for idx, node_col in enumerate(node_columns):
                if node_col.get("type") != "column":
                    continue
                # 매칭 대상 column block id
                if idx < len(created_columns):
                    col_id = created_columns[idx]["id"]
                    col_kids = (node_col.get("column", {}) or {}).get("children", [])
                    if col_kids:
                        _append_tree(notion, col_id, col_kids, chunk_size=chunk_size)
            continue  # column_list는 여기서 처리 끝

        # 일반 블록은 평소처럼 children을 해당 블록 아래에 붙인다.
        kids = node_data.get("children", [])
        if kids:
            _append_tree(notion, new_id, kids, chunk_size=chunk_size)

# DB 처리 유틸 함수
def _collect_child_databases(blocks: List[dict]) -> List[str]:
    """템플릿 블록 트리에서 child_database id들을 수집"""
    out = []
    def walk(bs):
        for b in bs or []:
            if not isinstance(b, dict):
                continue
            t = b.get("type")
            if t == "child_database":
                did = b.get("id")
                if did and did not in out:
                    out.append(did)
            # children 재귀 탐색
            data = b.get(t, {}) or {}
            kids = data.get("children", [])
            if kids:
                walk(kids)
    walk(blocks)
    return out

def _clone_database(notion: Client, src_db_id: str, parent_page_id: str, title: str = "Cloned Database") -> str:
    """원본 DB 스키마를 복제해서 parent 아래에 새 DB 생성"""
    src = notion.databases.retrieve(src_db_id)
    props = src.get("properties", {})

    new_db = notion.databases.create(
        parent={"type": "page_id", "page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": title}}],
        properties=props
    )
    return new_db["id"]

def _clone_database_rows(notion: Client, src_db_id: str, dst_db_id: str):
    cur = None
    while True:
        r = notion.databases.query(database_id=src_db_id, start_cursor=cur)
        for row in r.get("results", []):
            props = row.get("properties", {})
            notion.pages.create(parent={"database_id": dst_db_id}, properties=props)
        if not r.get("has_more"):
            break
        cur = r.get("next_cursor")



# -----------------------------
# Schema fixer
# -----------------------------

MIN_SCHEMAS = {
    "paragraph": {"rich_text": []},
    "heading_1": {"rich_text": []},
    "heading_2": {"rich_text": []},
    "heading_3": {"rich_text": []},
    "quote": {"rich_text": []},
    "callout": {"rich_text": []},
    "to_do": {"rich_text": [], "checked": False},
    "toggle": {"rich_text": []},
    "bulleted_list_item": {"rich_text": []},
    "numbered_list_item": {"rich_text": []},

    "column_list": {
        "children": [
            {"object": "block", "type": "column", "column": {"children": []}},
            {"object": "block", "type": "column", "column": {"children": []}},
        ]
    },
    "column": {"children": []},

    "table": {
        "table_width": 2,
        "has_column_header": False,
        "has_row_header": False,
        "children": [
            {
                "object": "block",
                "type": "table_row",
                "table_row": {"cells": [[{"type": "text", "text": {"content": " "}}]]},
            }
        ],
    },
    "table_row": {"cells": [[{"type": "text", "text": {"content": " "}}]]},
}

UNSUPPORTED_TYPES = {
    "child_page", "unsupported"
}

RESOURCE_TYPES_REQUIRE_URL = {
    "embed", "bookmark", "image", "video", "pdf", "file", "audio"
}

def _apply_min_schema(block_type: str, data: dict) -> dict:
    base = MIN_SCHEMAS.get(block_type, {})
    return {**base, **(data or {})}

def fix_block(b: dict, vars: Dict[str, str]) -> Optional[dict]:
    """한 블록을 API 친화적으로 보정"""
    if not isinstance(b, dict):
        return None
    t = b.get("type")
    if not t :
        return None
    
    if t == "child_database":
        # 자리 표시 문단으로 치환
        name = (b.get("child_database", {}) or {}).get("title", "Database")
        return {
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [
                    {"type": "text", "text": {"content": f"[{name}] 데이터베이스는 별도 복제됩니다."}}
                ]
            }
        }

    data = b.get(t, {}) or {}

    # children 있으면 재귀 보정
    kids = data.get("children", [])
    if kids:
        fixed_kids = []
        for child in kids:
            fc = fix_block(child, vars)
            if fc:
                fixed_kids.append(fc)
        data["children"] = fixed_kids

    # 최소 스키마 적용
    data = _apply_min_schema(t, data)

    # 텍스트 계열 보정
    if "rich_text" in data:
        data["rich_text"] = _replace_rich_text(data.get("rich_text", []), vars)

    if t == "to_do" and not isinstance(data.get("checked"), bool):
        data["checked"] = False

    if t == "callout" and not isinstance(data.get("icon"), dict):
        data.pop("icon", None)

    if t in RESOURCE_TYPES_REQUIRE_URL:
        # url이 없으면 더미라도 넣어줌
        if not isinstance(data.get("url"), str) or not data["url"]:
            data["url"] = "https://example.com/placeholder"

    data = _deep_clean_none(data)

    return {"object": "block", "type": t, t: data}

# -----------------------------
# Hydration
# -----------------------------

def _hydrate(blocks: List[dict], vars: Dict[str, str]) -> List[dict]:
    hs: List[dict] = []
    for b in blocks:
        fixed = fix_block(b, vars)
        if fixed:
            hs.append(fixed)
    return hs

# -----------------------------
# Update
# -----------------------------

def update_aside_block(page_id: str, travel_info: dict):
    notion = Client(auth=os.getenv("NOTION_API_KEY"))

    # 페이지 내 첫 블록 조회
    children = notion.blocks.children.list(block_id=page_id)
    first_block = children["results"][0]

    if first_block["type"] not in ("quote", "callout", "paragraph"):
        print("⚠️ 첫 블록이 aside 형태가 아닐 수 있습니다.")
        return None

    new_text = f"""🌏

## MORO 여행 플래너

📧 [contact@moro.com](mailto:contact@moro.com) | 📷 Instagram | 💻 GitHub

---

여행 기간 : {travel_info['start_date']} ~ {travel_info['end_date']}

공항 : {travel_info['from_airport']} → {travel_info['to_airport']}

총 예산 : {travel_info['budget']}원
"""

    notion.blocks.update(
        block_id=first_block["id"],
        **{
            first_block["type"]: {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {"content": new_text},
                        "plain_text": new_text
                    }
                ],
            }
        }
    )
    return True


# -----------------------------
# Public API
# -----------------------------

def create_public_child_from_template(
    title: str,
    vars: Dict[str, str],
    itinerary: Optional[List[str]] = None
) -> dict:
    NOTION_API_KEY = os.getenv("NOTION_API_KEY")
    TEMPLATE_ID = os.getenv("NOTION_TEMPLATE_PAGE_ID")
    PARENT_ID = os.getenv("NOTION_PARENT_ID")
    if not (NOTION_API_KEY and TEMPLATE_ID and PARENT_ID):
        raise RuntimeError(f"Missing Notion env vars: {', '.join([k for k,v in {'NOTION_API_KEY':NOTION_API_KEY, 'NOTION_TEMPLATE_PAGE_ID':TEMPLATE_ID, 'NOTION_PARENT_ID':PARENT_ID}.items() if not v])}")

    notion = Client(auth=NOTION_API_KEY)

    # 템플릿 블록 전체 로드 (재귀)
    tpl_blocks = _children_all(notion, TEMPLATE_ID)

    # 보정 + 치환
    blocks = _hydrate(tpl_blocks, vars)

    # 일정 추가
    if itinerary:
        for line in itinerary:
            blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": line}}]
                }
            })

        # 새 페이지 생성
    page = notion.pages.create(
        parent={"type": "page_id", "page_id": PARENT_ID},
        properties={"title": [{"type": "text", "text": {"content": title}}]},
    )
    pid = page["id"]

    # 4) 트리 업로드: 중첩(children)은 재귀적으로 별도 append
    _append_tree(notion, pid, blocks, chunk_size=50)

    # 5) child_database 복제 (템플릿에서 수집한 DB들을 새 페이지 하단에 복제)
    db_ids = _collect_child_databases(tpl_blocks)
    for i, dbid in enumerate(db_ids, start=1):
        try:
            # 필요하면 제목 커스터마이즈 가능
            new_db_id = _clone_database(
                notion,
                src_db_id=dbid,
                parent_page_id=pid,
                title=f"Cloned DB #{i}"
            )
            _clone_database_rows(notion, src_db_id=dbid, dst_db_id=new_db_id)
        except Exception as e:
            print("DB clone error:", e)

    # 6) URL 반환
    page_url = f"https://www.notion.so/{pid.replace('-', '')}"
    return {"page_id": pid, "page_url": page_url}