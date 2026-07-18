# Sitemap & SEO metadata

> `@`-reference khi làm routing / metadata. Bám sát navigation ethanecom.com: Home / About Us / Vision / Careers / Stories / Contact.

## Sitemap

```
/                     → Home (trang chủ)
/about                → About Us — Giới thiệu công ty, đội ngũ, core values
/vision               → Vision — Tầm nhìn chiến lược, sứ mệnh đưa hàng Việt ra thế giới
/services             → Dịch vụ (thêm vào nav nếu cần)
  /services/[slug]    → Chi tiết từng dịch vụ (9 dịch vụ)
/portfolio            → Portfolio / Công trình (có thể gộp vào About hoặc riêng)
  /portfolio/[slug]   → Chi tiết dự án
/careers              → Tuyển dụng — Danh sách 14 vị trí, văn hoá công ty
  /careers/[id]       → Chi tiết vị trí + form ứng tuyển (Gửi CV về hr@ethanecom.com)
/stories              → Stories / Blog — Câu chuyện, tin tức công ty
  /stories/[slug]     → Bài viết chi tiết
/contact              → Liên hệ — Form (support@ethanecom.com) + Địa chỉ Võ Dõng, Đồng Nai
```

## Metadata SEO cho từng trang

Mỗi trang export metadata đầy đủ (title, description, og:image) + JSON-LD (Organization, WebSite, BreadcrumbList).

- **Home:** "Ethan Ecom — Giải pháp thương mại điện tử toàn cầu cho hàng Việt"
- **About:** "Về chúng tôi | Ethan Ecom — Đồng lòng đồng sức, bứt phá thành công"
- **Vision:** "Tầm nhìn | Ethan Ecom — Đưa sản phẩm Việt vươn tầm thế giới"
- **Careers:** "Tuyển dụng | Ethan Ecom — Môi trường sáng tạo, phát triển bứt phá"
- **Stories:** "Câu chuyện | Ethan Ecom Blog"
- **Contact:** "Liên hệ | Ethan Ecom — Trụ sở Võ Dõng, Đồng Nai · +84 967 473 979"

## Core Web Vitals & kỹ thuật
- LCP < 2.5s · CLS < 0.1 · FID < 100ms
- Sitemap tự động (`next-sitemap`); robots.txt cho phép crawl toàn bộ public pages
