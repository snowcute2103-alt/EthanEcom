# CLAUDE.md — Ethan Ecom Corporate Portfolio Website

Trang hồ sơ năng lực (employer branding GĐ1 → B2B → nhà đầu tư) cho **Ethan Ecom** — công ty TMĐT xuyên biên giới, tự chủ sản xuất in-house (POD/thêu/in), thị trường trọng tâm Mỹ. Tone: chuyên nghiệp + truyền cảm hứng. Ngôn ngữ mặc định: **Tiếng Việt** (font phải hỗ trợ đầy đủ dấu).

## Content data — tra khi build section (đừng nạp sẵn)
- **Thông tin công ty** (info, vision, mission, 5 core values, brand story, timeline, 9 dịch vụ, cơ cấu tổ chức, 14 vị trí tuyển dụng, phúc lợi): `@docs/company-content.md`
- **Nội dung Home page** (13 section + animation gợi ý): `@docs/home-content.md`
- **Sitemap + SEO metadata từng trang**: `@docs/sitemap-seo.md`

Không hardcode nội dung/text dài vào JSX — đặt trong data file và reference.

---

## Quy tắc phát triển bắt buộc (không ngoại lệ)

### QT-1: Screenshot sau mỗi thay đổi lớn
Sau mỗi thay đổi lớn (xong 1 section, đổi layout, update design system): chạy dev server → chụp screenshot section vừa đổi → so với design gốc (`mauthietke.jpg`) → ghi nhận chênh lệch & fix trước khi sang task mới.

### QT-2: Mobile-first
- Viết CSS theo thứ tự **mobile → tablet → desktop**; test ở 375 / 768 / 1280px.
- Touch target ≥ 44×44px. Font mobile ≥ 16px (tránh auto-zoom iOS Safari).
- Grid luôn bắt đầu 1 cột. Nav: hamburger ở `md` trở xuống, sticky header + backdrop blur.
- Không dùng `hover:` mà không có fallback cho touch device.

### QT-3: Mọi section có scroll animation
Framer Motion + `whileInView`, `viewport={{ once: true, margin: '-80px' }}`. Wrap `prefers-reduced-motion`. Loại dùng: `fadeInUp / fadeInLeft / fadeInRight / scaleIn / stagger`. **Không** animate above-the-fold (Hero) — load thẳng.
```tsx
const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }
```

### QT-4: Git (bắt buộc khi xong milestone)
Commit & push toàn bộ source lên **https://github.com/Snoww-dev/Ethan.git**. Config `.gitignore` chuẩn Next.js (`node_modules`, `.next`, `.env`…) trước khi push. Không commit ảnh thật — dùng placeholder trong dev.

---

## Tech Stack
> **Hiện trạng:** repo đang là static multi-page HTML (vanilla CSS tokens ở `assets/css/shared.css`, GSAP, footer inject qua `assets/js/shared.js`, puppeteer screenshots). Stack Next.js dưới đây là **target migration**.

Next.js 14+ (App Router) · TypeScript · Tailwind CSS + CSS Modules · Framer Motion · Lucide React · Fonts qua `next/font` · `next/image` · React Hook Form + Zod (form liên hệ & upload CV) · Deploy Vercel. **Không** dùng UI lib ngoài Tailwind (không MUI/Chakra/Ant) để giữ bundle nhỏ.

## Design System
> Source of truth cho token màu/font: `assets/css/shared.css` (`:root`). Không hardcode màu trực tiếp — dùng CSS variable / Tailwind token.

**Palette (nautical corporate):** navy `#16305C` (`--navy-2 #1B2A4A`, `--navy-deep #0F2244`) = structural (header/footer/hero) · blue `#1E7FE0` / CTA `#2B8FFF` = interactive accents · yellow `#F4B41A` / `#FFC107` = highlight sparse (badge, stat) · text `#1A2433` / muted `#5A6B82` · surfaces `#EAF3FB` / `#F5F9FF`.

**Typography — quy ước chính (bắt buộc):** **Tiêu đề/heading = Fahkwang** (`--font-lead`) · **Chữ nhỏ & văn bản/body = Mulish** (`--font-alt`). Áp dụng khi thêm/sửa section mới; các role phụ (Montserrat = UI/label, BaskervilleVN = serif accent cho số/hero, Inter = fallback body) chỉ dùng khi đã có sẵn. Base: h2 25 / h3 23 / h4 20px, body 16px.

**Layout:** max-width `1500px` centered · radius sm 8 / md 14 / lg 20 · shadow `--sh-sm/md/lg` · section padding `py-20` (desktop) / `py-16` (mobile) · grid 12-col, gap 24px.

**Patterns:** section alternating trắng ↔ navy · stat counter đếm khi scroll · service cards 3 cột (icon+title+desc) · portfolio bento grid hover overlay · testimonial grid/carousel · CTA section navy + form inline + button vàng · partner logos grayscale→color on hover.

## Coding Conventions
- Server Components mặc định; `'use client'` chỉ khi cần interactivity.
- Mỗi section = 1 component riêng trong `components/home/`.
- Không `any` trong TS. Không hardcode text/màu vào JSX.
- Tailwind class order: layout → spacing → color → typography → effects.
- Mỗi page export metadata SEO đầy đủ. `next/image` với `sizes` + `priority` cho above-the-fold; ưu tiên `.webp`.

## Cấu trúc thư mục (target)
```
app/(marketing)/{page,about,services,portfolio,blog,careers,contact}  · app/{layout,globals.css}
components/layout/{Header,Footer}  · components/home/*  · components/ui/*  · components/forms/ContactForm
lib/{constants,utils}  · public/{images,icons}  · tailwind.config.ts
```

## Responsive · SEO · A11y
- Breakpoints Tailwind: sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536. Nav full từ `lg`; grid 1→2→3 cột.
- Core Web Vitals: LCP < 2.5s · CLS < 0.1 · FID < 100ms. `generateMetadata` + JSON-LD (Organization/WebSite/BreadcrumbList). `next-sitemap`.
- Semantic HTML (`header/nav/main/section/footer`), mọi ảnh có `alt`, focus ring visible, contrast ≥ 4.5:1, form label liên kết `htmlFor`/`id`.

## Liên hệ (dùng nhất quán toàn trang)
- Email CSKH/contact/footer: **support@ethanecom.com** · Email CV/careers: **hr@ethanecom.com**
- Địa chỉ: **Võ Dõng - Thống Nhất - Đồng Nai** · Phone: **+84 967 473 979**
- Giờ làm việc: 7:30–17:00, T2–T7 · Social: `@EthanEcom` (Dribbble `@EthanEcom_Dev`)
