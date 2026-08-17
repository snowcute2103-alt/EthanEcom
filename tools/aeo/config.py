"""Cấu hình chung cho pipeline AEO: danh sách trang mục tiêu, đường dẫn output."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent  # thư mục gốc repo (Ethan-main)
OUTPUT_DIR = Path(__file__).resolve().parent / "output"
EXTRACTED_DIR = OUTPUT_DIR / "extracted"
SCORED_DIR = OUTPUT_DIR / "scored"
SCHEMA_DIR = OUTPUT_DIR / "schema"

BASE_URL = "https://ethanecom.com"

# 17 bài blog — ứng viên Article + FAQ
BLOG_PAGES = [
    "blog-academy-digital-emb.html",
    "blog-amazon-ppc.html",
    "blog-amazon-seo.html",
    "blog-amazon-top-seller.html",
    "blog-christmas-party-2025.html",
    "blog-digitizing-la-gi.html",
    "blog-etsy-guide.html",
    "blog-mua-cao-diem-q4.html",
    "blog-nghien-cuu-niche-pod.html",
    "blog-over-limitation-2025.html",
    "blog-pod-la-gi.html",
    "blog-tet-2026.html",
    "blog-theu-vs-in.html",
    "blog-thiet-ke-thuong-hieu.html",
    "blog-tiktok-shop-la-gi.html",
    "blog-tiktok-video-pod.html",
    "blog-trung-thu-2025.html",
]

# Trang chính — ứng viên FAQ (không phải Article, không có datePublished)
MAIN_PAGES = [
    "index.html",
    "gioi-thieu.html",
    "dich-vu.html",
    "tam-nhin.html",
    "cau-chuyen.html",
    "lien-he.html",
]

# Loại trừ rõ ràng: _template.html (demo), hero-parallax-demo.html (demo),
# google*.html (verification file), tuyen-dung*.html (JobPosting — khác phạm vi FAQ/Article)
TARGET_PAGES = BLOG_PAGES + MAIN_PAGES

for _d in (OUTPUT_DIR, EXTRACTED_DIR, SCORED_DIR, SCHEMA_DIR):
    _d.mkdir(parents=True, exist_ok=True)
