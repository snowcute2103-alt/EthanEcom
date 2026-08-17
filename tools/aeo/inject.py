"""Chèn FAQPage JSON-LD (đã validate) vào <head> của file HTML tương ứng.

An toàn theo mặc định: KHÔNG ghi đè file trừ khi truyền --write.
Không chèn trùng nếu HTML đã có sẵn FAQPage schema (tự phát hiện qua @type).

Chạy xem trước (không ghi):
    tools/aeo/.venv/bin/python tools/aeo/inject.py

Chạy ghi thật vào HTML:
    tools/aeo/.venv/bin/python tools/aeo/inject.py --write
"""
import argparse
import json
import re

from config import ROOT, SCHEMA_DIR


def slug_to_filename(slug: str) -> str:
    return "index.html" if slug == "index" else f"{slug}.html"


def already_has_faq_schema(html: str) -> bool:
    for match in re.finditer(
        r'<script type="application/ld\+json">(.*?)</script>', html, re.S
    ):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        types = {data.get("@type")} if isinstance(data, dict) else set()
        if "FAQPage" in types:
            return True
    return False


def build_script_tag(jsonld: dict) -> str:
    body = json.dumps(jsonld, ensure_ascii=False, indent=2)
    return f'<script type="application/ld+json">\n{body}\n</script>'


def inject_into_html(html: str, jsonld: dict) -> str:
    tag = build_script_tag(jsonld)
    # Chèn ngay trước </head> — sau mọi schema khác đã có, giữ nguyên thứ tự hiện tại
    return html.replace("</head>", f"{tag}\n</head>", 1)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Ghi thật vào file HTML (mặc định chỉ xem trước)")
    args = parser.parse_args()

    schema_files = sorted(SCHEMA_DIR.glob("*.json"))
    if not schema_files:
        print(f"Chưa có file nào trong {SCHEMA_DIR} — chạy generate.py trước.")
        return

    applied, skipped_existing, previewed = 0, 0, 0
    for path in schema_files:
        jsonld = json.loads(path.read_text(encoding="utf-8"))
        filename = slug_to_filename(path.stem)
        html_path = ROOT / filename

        if not html_path.exists():
            print(f"✗ {filename:35s} — không tìm thấy file HTML, bỏ qua")
            continue

        html = html_path.read_text(encoding="utf-8")

        if already_has_faq_schema(html):
            skipped_existing += 1
            print(f"— {filename:35s} — đã có FAQPage schema, bỏ qua (tránh chèn trùng)")
            continue

        n_q = len(jsonld.get("mainEntity", []))

        if args.write:
            new_html = inject_into_html(html, jsonld)
            html_path.write_text(new_html, encoding="utf-8")
            applied += 1
            print(f"✓ {filename:35s} — đã chèn {n_q} câu hỏi vào <head>")
        else:
            previewed += 1
            print(f"→ {filename:35s} — sẽ chèn {n_q} câu hỏi (chạy lại với --write để ghi thật)")

    if args.write:
        print(f"\nĐã ghi vào {applied} file, bỏ qua {skipped_existing} (đã có sẵn schema).")
        print("Kiểm tra lại bằng: git diff -- '*.html'")
    else:
        print(f"\nXem trước: {previewed} file sẽ được chèn, {skipped_existing} bỏ qua (đã có sẵn).")
        print("Không có gì được ghi. Chạy `inject.py --write` để áp dụng thật.")


if __name__ == "__main__":
    main()
