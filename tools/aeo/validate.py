"""Validate các file JSON-LD đã sinh trong output/schema/ trước khi inject vào HTML.

Kiểm tra theo yêu cầu bắt buộc của schema.org FAQPage + khuyến nghị Google Rich Results
(không gọi API ngoài — kiểm tra cấu trúc tĩnh).

Chạy: tools/aeo/.venv/bin/python tools/aeo/validate.py
"""
import json

from config import SCHEMA_DIR


def validate_faq_page(data: dict) -> list[str]:
    errors = []
    if data.get("@context") != "https://schema.org":
        errors.append("thiếu hoặc sai @context (phải là https://schema.org)")
    if data.get("@type") != "FAQPage":
        errors.append("thiếu hoặc sai @type (phải là FAQPage)")

    entities = data.get("mainEntity")
    if not entities:
        errors.append("thiếu mainEntity hoặc rỗng")
        return errors

    for i, item in enumerate(entities):
        prefix = f"mainEntity[{i}]"
        if item.get("@type") != "Question":
            errors.append(f"{prefix}: @type phải là Question")
        question = item.get("name", "")
        if not question or not question.strip():
            errors.append(f"{prefix}: thiếu 'name' (câu hỏi)")
        elif len(question) > 300:
            errors.append(f"{prefix}: câu hỏi quá dài ({len(question)} ký tự, nên <300)")

        answer_block = item.get("acceptedAnswer", {})
        if answer_block.get("@type") != "Answer":
            errors.append(f"{prefix}.acceptedAnswer: @type phải là Answer")
        answer = answer_block.get("text", "")
        if not answer or not answer.strip():
            errors.append(f"{prefix}.acceptedAnswer: thiếu 'text' (câu trả lời)")
        elif len(answer.split()) < 10:
            errors.append(f"{prefix}.acceptedAnswer: câu trả lời quá ngắn ({len(answer.split())} từ, nên ≥10)")

    return errors


def main() -> None:
    schema_files = sorted(SCHEMA_DIR.glob("*.json"))
    if not schema_files:
        print(f"Chưa có file nào trong {SCHEMA_DIR} — chạy generate.py trước.")
        return

    ok, bad = 0, 0
    for path in schema_files:
        data = json.loads(path.read_text(encoding="utf-8"))
        errors = validate_faq_page(data)
        n_q = len(data.get("mainEntity", []))
        if errors:
            bad += 1
            print(f"✗ {path.stem:35s} {n_q} câu hỏi — {len(errors)} lỗi:")
            for err in errors:
                print(f"    - {err}")
        else:
            ok += 1
            print(f"✓ {path.stem:35s} {n_q} câu hỏi — hợp lệ")

    print(f"\n{ok} hợp lệ, {bad} có lỗi ({len(schema_files)} tổng)")
    if bad:
        print("→ Sửa lại các file lỗi trong output/schema/ trước khi chạy inject.py")


if __name__ == "__main__":
    main()
