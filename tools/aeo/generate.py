"""Sinh FAQPage JSON-LD schema cho từng trang mục tiêu.

- Trang đã có sẵn Q&A thật trên page (vd lien-he.html) → đóng gói trực tiếp,
  KHÔNG gọi Claude (tránh bịa nội dung khi đã có nội dung thật).
- Trang chưa có → gọi Claude (structured output, ép JSON hợp lệ) để sinh 3-6
  câu hỏi thường gặp, chỉ dựa trên nội dung đã trích xuất.

Chạy: tools/aeo/.venv/bin/python tools/aeo/generate.py
Output: tools/aeo/output/schema/<slug>.json (JSON-LD FAQPage hoàn chỉnh)
"""
import json

import anthropic

from config import EXTRACTED_DIR, SCHEMA_DIR
from schemas import FAQGeneration

MODEL = "claude-opus-5"

SYSTEM_PROMPT = """Bạn là chuyên gia AEO (Answer Engine Optimization) cho website Ethan Ecom \
— công ty TMĐT xuyên biên giới Việt Nam, sản xuất in-house (POD/thêu/in), thị trường Mỹ.

Nhiệm vụ: đọc nội dung trang được cung cấp, sinh 3-6 câu hỏi thường gặp (FAQ) mà người dùng \
thật sự có thể hỏi về nội dung này, kèm câu trả lời.

Quy tắc bắt buộc:
- Chỉ dùng thông tin CÓ THẬT trong nội dung được cung cấp. Tuyệt đối không bịa số liệu, \
tên người, ngày tháng, hay chi tiết không có trong bài.
- Câu hỏi viết tự nhiên, đúng cách người dùng thật gõ vào công cụ tìm kiếm hoặc hỏi AI \
(không viết kiểu tiêu đề bài báo).
- Câu trả lời tự chứa (đọc một mình vẫn hiểu, không cần đọc phần khác của bài), khoảng 40-90 từ.
- Ưu tiên câu hỏi khai thác thông tin cụ thể, có giá trị tra cứu — tránh câu hỏi chung chung \
kiểu "bài viết này nói về gì".
- Giữ nguyên văn phong tiếng Việt chuyên nghiệp của bài gốc."""


def to_faq_page_jsonld(faq: FAQGeneration) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": qa.question,
                "acceptedAnswer": {"@type": "Answer", "text": qa.answer},
            }
            for qa in faq.questions
        ],
    }


def existing_faq_to_jsonld(existing_faq: list[dict]) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["question"],
                "acceptedAnswer": {"@type": "Answer", "text": item["answer"]},
            }
            for item in existing_faq
        ],
    }


def generate_faq(client: anthropic.Anthropic, page: dict) -> FAQGeneration:
    # Giới hạn độ dài input để tránh vượt cửa sổ ngữ cảnh không cần thiết trên trang quá dài
    content = page["main_text"][:6000]
    response = client.messages.parse(
        model=MODEL,
        max_tokens=2048,
        system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
        messages=[{
            "role": "user",
            "content": f"Tiêu đề trang: {page['title']}\n\nNội dung:\n{content}",
        }],
        output_format=FAQGeneration,
    )
    return response.parsed_output


def main() -> None:
    client = anthropic.Anthropic()
    extracted_files = sorted(EXTRACTED_DIR.glob("*.json"))

    generated, reused, skipped, failed = 0, 0, 0, 0
    for path in extracted_files:
        page = json.loads(path.read_text(encoding="utf-8"))
        out_path = SCHEMA_DIR / path.name

        if out_path.exists():
            skipped += 1
            print(f"{page['file']:45s} → đã có sẵn output, bỏ qua (xoá file trong output/schema/ để sinh lại)")
            continue

        if page.get("existing_faq"):
            jsonld = existing_faq_to_jsonld(page["existing_faq"])
            reused += 1
            print(f"{page['file']:45s} → dùng {len(page['existing_faq'])} Q&A có sẵn (không gọi API)")
        else:
            try:
                faq = generate_faq(client, page)
                jsonld = to_faq_page_jsonld(faq)
                generated += 1
                print(f"{page['file']:45s} → sinh {len(faq.questions)} câu hỏi")
            except anthropic.APIError as exc:
                failed += 1
                print(f"{page['file']:45s} → LỖI: {exc}")
                continue

        out_path.write_text(json.dumps(jsonld, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\nHoàn tất: {generated} trang sinh mới, {reused} trang dùng lại nội dung có sẵn, "
          f"{skipped} trang bỏ qua (đã có output), {failed} lỗi → {SCHEMA_DIR}")


if __name__ == "__main__":
    main()
