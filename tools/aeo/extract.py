"""Trích xuất nội dung chính + cấu trúc + schema hiện có từ các trang HTML mục tiêu.

Chạy: tools/aeo/.venv/bin/python tools/aeo/extract.py
Output: tools/aeo/output/extracted/<slug>.json (1 file/trang)
"""
import json
import re
from dataclasses import asdict, dataclass, field

import trafilatura
from bs4 import BeautifulSoup

from config import BASE_URL, EXTRACTED_DIR, ROOT, TARGET_PAGES


@dataclass
class Heading:
    level: int
    text: str


@dataclass
class QAPair:
    question: str
    answer: str


@dataclass
class ExtractedPage:
    file: str
    url: str
    title: str
    meta_description: str
    headings: list[Heading]
    main_text: str
    word_count: int
    existing_schema_types: list[str]
    existing_schema: list[dict] = field(default_factory=list)
    existing_faq: list[QAPair] = field(default_factory=list)


def slug_from_filename(filename: str) -> str:
    if filename == "index.html":
        return ""
    return filename.removesuffix(".html")


def extract_existing_schema(soup: BeautifulSoup) -> list[dict]:
    """Đọc mọi block <script type="application/ld+json"> đã có trên trang."""
    blocks = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "{}")
        except json.JSONDecodeError:
            continue
        blocks.append(data if isinstance(data, list) else [data])
    return [item for group in blocks for item in group]


def extract_existing_faq(soup: BeautifulSoup) -> list[QAPair]:
    """Phát hiện FAQ đã có sẵn trên trang, thử lần lượt các pattern đang dùng trong site:
    1. Accordion .faq-item__q/.faq-item__a (trang lien-he.html)
    2. Section "Câu hỏi thường gặp": <h2> theo sau bởi cặp <h3>câu hỏi</h3><p>trả lời</p>
       (nhiều bài blog đã viết tay sẵn, xem blog-amazon-ppc.html)
    3. <details><summary> chuẩn HTML
    Dùng lại nội dung thật có sẵn, tránh sinh trùng lặp bằng AI."""
    pairs = []

    for q_tag in soup.select(".faq-item__q"):
        item = q_tag.find_parent(class_="faq-item")
        a_tag = item.select_one(".faq-item__a") if item else None
        if a_tag:
            pairs.append(QAPair(q_tag.get_text(strip=True), a_tag.get_text(strip=True)))
    if pairs:
        return pairs

    faq_heading = next(
        (t for t in soup.find_all(["h2", "h3"]) if "câu hỏi thường gặp" in t.get_text(strip=True).lower()),
        None,
    )
    if faq_heading:
        question, answer_parts = None, []
        for sibling in faq_heading.find_next_siblings():
            if sibling.name in ("h1", "h2"):
                break
            if sibling.name == "h3":
                if question and answer_parts:
                    pairs.append(QAPair(question, " ".join(answer_parts).strip()))
                question, answer_parts = sibling.get_text(strip=True), []
            elif sibling.name == "p" and question:
                answer_parts.append(sibling.get_text(strip=True))
        if question and answer_parts:
            pairs.append(QAPair(question, " ".join(answer_parts).strip()))
    if pairs:
        return pairs

    for details in soup.find_all("details"):
        summary = details.find("summary")
        if not summary:
            continue
        answer = details.get_text(strip=True).replace(summary.get_text(strip=True), "", 1).strip()
        if answer:
            pairs.append(QAPair(summary.get_text(strip=True), answer))
    return pairs


def extract_headings(soup: BeautifulSoup) -> list[Heading]:
    headings = []
    for level in (1, 2, 3):
        for tag in soup.find_all(f"h{level}"):
            text = tag.get_text(strip=True)
            if text:
                headings.append(Heading(level=level, text=text))
    return headings


def extract_page(filename: str) -> ExtractedPage:
    path = ROOT / filename
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "lxml")

    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = meta_desc_tag.get("content", "").strip() if meta_desc_tag else ""

    main_text = trafilatura.extract(html, include_comments=False, include_tables=False) or ""
    main_text = re.sub(r"\n{3,}", "\n\n", main_text).strip()

    existing_schema = extract_existing_schema(soup)
    existing_schema_types = sorted({
        item.get("@type") for item in existing_schema if isinstance(item.get("@type"), str)
    })

    slug = slug_from_filename(filename)
    url = f"{BASE_URL}/{slug}" if slug else BASE_URL

    return ExtractedPage(
        file=filename,
        url=url,
        title=title,
        meta_description=meta_description,
        headings=extract_headings(soup),
        main_text=main_text,
        word_count=len(main_text.split()),
        existing_schema_types=existing_schema_types,
        existing_schema=existing_schema,
        existing_faq=extract_existing_faq(soup),
    )


def main() -> None:
    results = []
    for filename in TARGET_PAGES:
        page = extract_page(filename)
        out_path = EXTRACTED_DIR / f"{slug_from_filename(filename) or 'index'}.json"
        out_path.write_text(
            json.dumps(asdict(page), ensure_ascii=False, indent=2), encoding="utf-8"
        )
        results.append(page)
        faq_note = f"  faq={len(page.existing_faq)}" if page.existing_faq else ""
        print(
            f"{filename:45s} words={page.word_count:5d}  "
            f"headings={len(page.headings):2d}  schema={page.existing_schema_types or '—'}{faq_note}"
        )

    print(f"\nĐã trích xuất {len(results)} trang → {EXTRACTED_DIR}")


if __name__ == "__main__":
    main()
