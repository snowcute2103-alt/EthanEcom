"""Chấm điểm mức độ thân thiện với LLM/AEO cho từng trang, dựa trên checklist rule-based
(không gọi API — nhanh, miễn phí, chạy lại bao nhiêu lần cũng được).

Chạy: tools/aeo/.venv/bin/python tools/aeo/score.py
Output: tools/aeo/output/scored/<slug>.json + bảng tổng hợp ra stdout
"""
import json
import re
import urllib.request
from dataclasses import asdict, dataclass, field
from functools import lru_cache
from urllib.robotparser import RobotFileParser

from config import BASE_URL, EXTRACTED_DIR, SCORED_DIR

AI_BOTS = ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "anthropic-ai", "Google-Extended"]

# Trọng số từng tiêu chí (tổng = 100)
WEIGHTS = {
    "ai_bots_allowed": 20,       # liệt = chặn hết điểm còn lại vô nghĩa
    "has_schema": 15,
    "has_faq_content": 15,
    "heading_structure": 10,
    "answer_block_length": 15,
    "meta_description": 10,
    "freshness_date": 10,
    "readability": 5,
}


@dataclass
class ScoreBreakdown:
    criterion: str
    points: float
    max_points: float
    note: str


@dataclass
class PageScore:
    file: str
    url: str
    total_score: float
    breakdown: list[ScoreBreakdown] = field(default_factory=list)


@lru_cache(maxsize=1)
def _robots_allows_ai_bots() -> tuple[bool, str]:
    """Kiểm tra 1 lần cho cả site (robots.txt áp dụng site-wide, không phải per-page)."""
    try:
        req = urllib.request.Request(f"{BASE_URL}/robots.txt", headers={"User-Agent": "aeo-checker"})
        raw = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", errors="ignore")
    except Exception as exc:  # noqa: BLE001 — best-effort network check, không chặn pipeline
        return True, f"không kiểm tra được robots.txt ({exc}), giả định cho phép"

    parser = RobotFileParser()
    parser.parse(raw.splitlines())
    blocked = [bot for bot in AI_BOTS if not parser.can_fetch(bot, "/")]
    if blocked:
        return False, f"robots.txt CHẶN: {', '.join(blocked)}"
    return True, "robots.txt cho phép tất cả AI bot chính (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)"


def score_ai_bots_allowed() -> ScoreBreakdown:
    allowed, note = _robots_allows_ai_bots()
    points = WEIGHTS["ai_bots_allowed"] if allowed else 0
    return ScoreBreakdown("AI bot được phép crawl (robots.txt)", points, WEIGHTS["ai_bots_allowed"], note)


def score_has_schema(page: dict) -> ScoreBreakdown:
    types = page["existing_schema_types"]
    max_pts = WEIGHTS["has_schema"]
    if not types:
        return ScoreBreakdown("Có schema markup", 0, max_pts, "chưa có JSON-LD nào")
    rich_types = {"Article", "BlogPosting", "FAQPage", "Product", "HowTo"}
    has_rich = bool(rich_types & set(types))
    points = max_pts if has_rich else max_pts * 0.5
    return ScoreBreakdown("Có schema markup", points, max_pts, f"đã có: {', '.join(types)}")


def score_has_faq_content(page: dict) -> ScoreBreakdown:
    max_pts = WEIGHTS["has_faq_content"]
    existing_faq = len(page.get("existing_faq", []))
    faq_headings = sum(1 for h in page["headings"] if h["text"].rstrip().endswith("?"))
    if "FAQPage" in page.get("existing_schema_types", []):
        return ScoreBreakdown("Có nội dung FAQ", max_pts, max_pts, "đã có FAQPage schema")
    if existing_faq:
        return ScoreBreakdown(
            "Có nội dung FAQ", max_pts, max_pts, f"{existing_faq} cặp Q&A sẵn có (chưa đánh dấu FAQPage)"
        )
    if faq_headings >= 2:
        points = max_pts * 0.6
        return ScoreBreakdown(
            "Có nội dung FAQ", points, max_pts, f"{faq_headings} heading dạng câu hỏi — ứng viên tốt cho FAQPage"
        )
    return ScoreBreakdown("Có nội dung FAQ", 0, max_pts, "chưa có nội dung dạng hỏi-đáp rõ ràng")


def score_heading_structure(page: dict) -> ScoreBreakdown:
    max_pts = WEIGHTS["heading_structure"]
    headings = page["headings"]
    h1_count = sum(1 for h in headings if h["level"] == 1)
    has_h2 = any(h["level"] == 2 for h in headings)
    if h1_count == 1 and has_h2:
        return ScoreBreakdown("Cấu trúc heading", max_pts, max_pts, "đúng 1 H1 + có H2 phân đoạn")
    if h1_count == 1:
        return ScoreBreakdown("Cấu trúc heading", max_pts * 0.6, max_pts, "có H1 nhưng thiếu H2 phân đoạn")
    note = f"{h1_count} thẻ H1 (nên đúng 1)" if h1_count != 1 else "thiếu H1"
    return ScoreBreakdown("Cấu trúc heading", max_pts * 0.3, max_pts, note)


def _normalize_for_heading_match(text: str) -> str:
    return re.sub(r"^[\d.\s]+", "", text).strip().lower()


def score_answer_block_length(page: dict) -> ScoreBreakdown:
    """Đoạn trả lời tự-chứa lý tưởng dài 40-60 từ (theo nghiên cứu GEO) để AI dễ trích snippet.
    Loại heading (H1-H3, kể cả câu hỏi FAQ) ra khỏi phép đếm — heading ngắn là đúng chuẩn,
    không phải đoạn trả lời thiếu ý; đếm chung sẽ phạt oan mọi trang có nhiều heading/FAQ."""
    max_pts = WEIGHTS["answer_block_length"]
    heading_norms = {_normalize_for_heading_match(h["text"]) for h in page["headings"]}
    paragraphs = []
    for raw in page["main_text"].split("\n"):
        p = raw.strip()
        if not p:
            continue
        p_norm = _normalize_for_heading_match(p)
        if p_norm in heading_norms:
            continue
        if len(p.split()) < 20 and any(hn and p_norm.startswith(hn) for hn in heading_norms):
            continue  # trafilatura đôi khi dính heading vào mảnh câu kế tiếp
        paragraphs.append(p)
    if not paragraphs:
        return ScoreBreakdown("Độ dài đoạn trả lời", 0, max_pts, "không tách được đoạn văn")
    lengths = [len(p.split()) for p in paragraphs]
    in_range = sum(1 for length in lengths if 25 <= length <= 90)
    ratio = in_range / len(lengths)
    return ScoreBreakdown(
        "Độ dài đoạn trả lời",
        max_pts * ratio,
        max_pts,
        f"{in_range}/{len(lengths)} đoạn trong khoảng 25-90 từ (tối ưu snippet)",
    )


def score_meta_description(page: dict) -> ScoreBreakdown:
    max_pts = WEIGHTS["meta_description"]
    desc = page["meta_description"]
    length = len(desc)
    if 70 <= length <= 160:
        return ScoreBreakdown("Meta description", max_pts, max_pts, f"{length} ký tự — độ dài tốt")
    if desc:
        return ScoreBreakdown("Meta description", max_pts * 0.5, max_pts, f"{length} ký tự — nên 70-160")
    return ScoreBreakdown("Meta description", 0, max_pts, "thiếu meta description")


def score_freshness(page: dict) -> ScoreBreakdown:
    max_pts = WEIGHTS["freshness_date"]
    for item in page.get("existing_schema", []):
        if isinstance(item, dict) and (item.get("datePublished") or item.get("dateModified")):
            return ScoreBreakdown("Tín hiệu ngày cập nhật", max_pts, max_pts, "có datePublished/dateModified trong schema")
    return ScoreBreakdown("Tín hiệu ngày cập nhật", 0, max_pts, "thiếu datePublished/dateModified")


def score_readability(page: dict) -> ScoreBreakdown:
    """Ước lượng đơn giản: câu quá dài (>35 từ) làm giảm khả năng trích xuất của AI."""
    max_pts = WEIGHTS["readability"]
    sentences = re.split(r"(?<=[.!?])\s+", page["main_text"])
    sentences = [s for s in sentences if s.strip()]
    if not sentences:
        return ScoreBreakdown("Readability (độ dài câu)", 0, max_pts, "không có nội dung để đo")
    long_ratio = sum(1 for s in sentences if len(s.split()) > 35) / len(sentences)
    points = max_pts * (1 - long_ratio)
    return ScoreBreakdown(
        "Readability (độ dài câu)", points, max_pts, f"{long_ratio:.0%} câu dài quá 35 từ"
    )


def score_page(page: dict) -> PageScore:
    breakdown = [
        score_ai_bots_allowed(),
        score_has_schema(page),
        score_has_faq_content(page),
        score_heading_structure(page),
        score_answer_block_length(page),
        score_meta_description(page),
        score_freshness(page),
        score_readability(page),
    ]
    total = round(sum(b.points for b in breakdown), 1)
    return PageScore(file=page["file"], url=page["url"], total_score=total, breakdown=breakdown)


def main() -> None:
    extracted_files = sorted(EXTRACTED_DIR.glob("*.json"))
    results = []
    for path in extracted_files:
        page = json.loads(path.read_text(encoding="utf-8"))
        result = score_page(page)
        out_path = SCORED_DIR / path.name
        out_path.write_text(json.dumps(asdict(result), ensure_ascii=False, indent=2), encoding="utf-8")
        results.append(result)

    results.sort(key=lambda r: r.total_score)
    print(f"{'Trang':45s} {'Điểm':>6s}  Yếu nhất")
    print("-" * 90)
    for r in results:
        weakest = min(r.breakdown, key=lambda b: b.points / b.max_points if b.max_points else 1)
        print(f"{r.file:45s} {r.total_score:5.1f}/100  {weakest.criterion}: {weakest.note}")

    avg = sum(r.total_score for r in results) / len(results)
    print(f"\nĐiểm trung bình: {avg:.1f}/100  ({len(results)} trang)  → {SCORED_DIR}")


if __name__ == "__main__":
    main()
