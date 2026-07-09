# CLAUDE.md — Ethan Ecom Corporate Portfolio Website

---

## Quy tắc phát triển bắt buộc

> Bốn quy tắc này áp dụng xuyên suốt toàn bộ quá trình build, không có ngoại lệ.

### QT-1: Chụp screenshot sau mỗi thay đổi lớn
Sau mỗi thay đổi lớn (hoàn thành 1 section, thay đổi layout, update design system), **bắt buộc**:
1. Chạy dev server và mở trình duyệt
2. Chụp screenshot trang/section vừa thay đổi
3. Đặt cạnh ảnh design gốc (`mauthietke.jpg`) để so sánh trực quan
4. Ghi nhận các điểm chênh lệch và fix trước khi chuyển sang task tiếp theo

### QT-2: Mobile-first — bắt buộc thân thiện với mobile
- Viết CSS/Tailwind theo thứ tự **mobile → tablet → desktop** (không ngược lại)
- Mọi component phải test ở 3 viewport: 375px (iPhone SE), 768px (iPad), 1280px (Desktop)
- Touch target tối thiểu 44×44px cho mọi button và link
- Navigation: hamburger menu trên mobile, sticky header với backdrop blur
- Font size tối thiểu 16px trên mobile (tránh auto-zoom trên iOS Safari)
- Grid: luôn bắt đầu từ 1 cột, không bao giờ dùng grid cố định trên mobile
- Không dùng `hover:` effect mà không có fallback cho touch device

### QT-3: Mọi section phải có scroll animation
Áp dụng thống nhất bằng **Framer Motion** với `whileInView`:
```tsx
// Pattern chuẩn cho mọi section
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

// Với stagger cho danh sách card
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}
```
- `viewport={{ once: true, margin: '-80px' }}` — chỉ animate 1 lần, trigger sớm 80px
- Luôn wrap bằng `prefers-reduced-motion` check để tôn trọng accessibility
- Các loại animation được dùng: `fadeInUp`, `fadeInLeft`, `fadeInRight`, `scaleIn`, `stagger`
- Không dùng animation cho nội dung above-the-fold (Hero) — load thẳng

### QT-4: Quản lý Source Code & Git (Bắt buộc)
Khi hoàn thiện build dự án hoặc hoàn thành các milestone quan trọng, **bắt buộc** commit và push toàn bộ source code lên repository chính thức:
- **Repository URL:** https://github.com/Snoww-dev/Ethan.git
- Đảm bảo đã config `.gitignore` chuẩn cho Next.js (bỏ qua `node_modules`, `.next`, `.env`, v.v.) trước khi thực hiện lệnh `git push`.

---

## Tổng quan dự án

**Tên dự án:** Ethan Ecom — Corporate Portfolio & Profile Website  
**Website hiện tại:** https://ethanecom.com/  
**Mục tiêu:** Trang hồ sơ năng lực trực tuyến, giới thiệu hình ảnh, văn hóa công ty và dịch vụ công nghệ đến đối tác, khách hàng, đồng thời thu hút ứng viên tiềm năng (với 14 vị trí tuyển dụng đa dạng).

### Ba trụ cột nội dung chính

1. **Tầm nhìn — Sáng tạo:** Ethan Ecom là nơi khơi nguồn sáng tạo và hỗ trợ phát triển cá nhân. Môi trường làm việc lý tưởng để ý tưởng công nghệ toả sáng.
2. **Giá trị cốt lõi — Đồng lòng:** "Đồng lòng đồng sức, bứt phá gặt thành công" — sức mạnh tập thể là chìa khoá vượt giới hạn.
3. **Năng lực — Bứt phá trong Thiết kế & Lập trình:** Kinh nghiệm thực chiến trong thiết kế chuyên dụng và lập trình, mang lại ứng dụng đẳng cấp thế giới cho doanh nghiệp.

---

## Thông tin công ty thực tế

> Nguồn: https://ethanecom.com/ — Dùng làm nội dung chuẩn cho toàn bộ website mới.

### Thông tin cơ bản

| Trường | Giá trị |
|--------|---------|
| Tên công ty | Ethan Ecom |
| Website hiện tại | https://ethanecom.com/ |
| Trụ sở làm việc | Võ Dõng - Thống Nhất - Đồng Nai |
| Thời gian làm việc | 7:30 - 17:00 từ Thứ 2 đến Thứ 7 (Nghỉ trưa 1h30') |
| Email CSKH | support@ethanecom.com |
| Email Tuyển dụng | hr@ethanecom.com |
| Phone | +84 967 473 979 |
| Lĩnh vực | E-commerce Solutions, Software Development, Digital Marketing |
| Thị trường | Quốc tế (Amazon, Etsy, TikTok Shop US), trọng tâm hàng Việt ra toàn cầu |

### Social Media

| Platform | Handle |
|----------|--------|
| Dribbble | @EthanEcom_Dev |
| Twitter / X | @EthanEcom |
| Instagram | @EthanEcom |
| Behance | @EthanEcom |

### Sứ mệnh & Tầm nhìn

Ethan Ecom được thành lập với sứ mệnh **đưa sản phẩm Việt Nam vươn ra thị trường quốc tế** thông qua các giải pháp thương mại điện tử toàn diện trên các sàn giao dịch toàn cầu. Công ty tự định vị là "nơi khơi nguồn sáng tạo và hỗ trợ sự phát triển cá nhân" — môi trường lý tưởng để các ý tưởng công nghệ và thương mại điện tử toả sáng.

### Giá trị cốt lõi (Core Values)

| Giá trị | Tên tiếng Anh | Mô tả |
|---------|---------------|-------|
| Tâm Huyết | Passion | Đặt tâm huyết vào từng chi tiết công việc và sự hài lòng của khách hàng |
| Trách Nhiệm | Trust | Xây dựng niềm tin qua minh bạch, quy trình rõ ràng và cam kết thực hiện đơn hàng ổn định |
| Thấu Hiểu | Communication | Lắng nghe chủ động để đưa ra giải pháp phù hợp với nhu cầu thực tế của sản phẩm và thị trường |
| Minh Bạch | Honesty | Vận hành trung thực mỗi ngày để tạo ra giá trị bền vững, thiết thực cho cộng đồng |

Phương châm đội nhóm: **"Đồng lòng đồng sức, bứt phá gặt thành công"**

### Dịch vụ (9 dịch vụ chính)

| # | Tên dịch vụ | Mô tả ngắn |
|---|-------------|-----------|
| 1 | Web Development | Xây dựng hạ tầng thương mại điện tử chuyên nghiệp, tốc độ tối ưu, trải nghiệm người dùng quốc tế |
| 2 | UI/UX Design | Thiết kế giao diện theo hành vi khách hàng quốc tế, tối đa hoá tỷ lệ chuyển đổi |
| 3 | Graphic Design | Nhận diện thương hiệu và hình ảnh sản phẩm chuẩn thị hiếu thị trường phương Tây |
| 4 | Motion Graphics | Nội dung hình ảnh động cho chiến dịch quảng cáo số |
| 5 | Photography | Chụp ảnh sản phẩm thể hiện chất lượng chi tiết và giá trị hàng hoá |
| 6 | Video Production | Video ngắn (TikTok/Reels) tối ưu hoá cho viral engagement |
| 7 | E-com Solutions | Giải pháp vận hành toàn diện trên Amazon, Etsy, TikTok Shop |
| 8 | Digital Marketing | Chiến dịch quảng cáo đa kênh, tối ưu ngân sách, tăng trưởng doanh thu |
| 9 | Tech Optimization | Cập nhật công nghệ liên tục và nâng cấp hệ thống |

### Cơ cấu tổ chức & Bộ phận

**Cấp lãnh đạo:**
- Founder & CEO — Dẫn dắt tầm nhìn đưa sản phẩm Việt ra toàn cầu
- Co-Founder & Managing Director — Đảm bảo vận hành suôn sẻ và thực hiện cam kết khách hàng

**Các phòng ban:**
- E-commerce Operations (Quản lý dự án, Dropship, POD, TikTok Shop)
- Creative Design (Đồ họa, Thiết kế ấn phẩm)
- Media & Production (Phim, Motion Graphics)
- Online Marketing (Internet Marketing, Chạy Ads)
- Tech & IT (Web Development)
- Production & Workshop (Sản xuất xưởng thêu, in ấn, cắt laser)
- HR & Finance (Nhân sự & Kế toán)

### Vị trí tuyển dụng (Careers — 14 vị trí)

Các vị trí đang tuyển (dùng cho trang `/careers`):

| Vị trí | Bộ phận | SL | Chế độ Lương / Thu nhập cơ bản |
|--------|---------|----|---------------------------------|
| Leader TikTokShop US | E-commerce | Không giới hạn | Up to 20 Triệu + KPI |
| Seller POD & Dropship | E-commerce | Không giới hạn | Up to 15 Triệu + KPI |
| Nhân viên Nhân sự (HR) | HR & Admin | 1 | Từ 9 Triệu + Thưởng |
| Nhân viên Internet Marketing | Online Marketing | 10 | Từ 8 Triệu + Thưởng KPI (tới 30 Tr) |
| Video Creator/Editor | Media & Production | 10 | Từ 8 Triệu + Thưởng KPI (tới 30 Tr) |
| Nhân viên Web Developer | Tech & IT | 3 | 8 - 12 Triệu |
| Graphic Designer | Creative Design | 10 | Từ 8 Triệu + Thưởng KPI (tới 30 Tr) |
| Quản lý xưởng thêu | Production | 1 | Từ 8 Triệu + Bonus |
| Nhân viên kỹ thuật thêu | Production | 4 | Từ 7 Triệu + Bonus |
| Nhân viên kiểm hàng | Production | 2 | Từ 6 Triệu + Bonus |
| Nhân viên QC | Production | 4 | Từ 7 Triệu + Bonus |
| Nhân viên Kỹ thuật máy laser | Production | Không giới hạn | Từ 7 Triệu + Bonus |
| Nhân viên Kế toán tổng hợp | Finance | 2 | Từ 7 Triệu + Thưởng |
| Nhân viên Vận hành máy in | Production | 2 | Từ 8 Triệu + Bonus |

**Văn hoá tuyển dụng:** "Môi trường làm việc sáng tạo và cởi mở là chìa khoá để khai mở mọi tiềm năng." Những ý tưởng khác biệt được tôn trọng và hiện thực hoá.

**Phúc lợi nổi bật:**
- Trợ cấp ăn trưa tại công ty & hỗ trợ máy tính làm việc
- Thưởng KPI, OT, Bonus hiệu quả công việc, thưởng Lễ/Tết, lương tháng 13
- Chế độ BHXH, BHYT đầy đủ theo luật Lao động Việt Nam
- Được đào tạo kỹ năng mềm chuyên sâu hướng tới khách hàng
- Du lịch, team building hàng năm trong môi trường trẻ trung năng động

### Thành tích & Nhận diện

- Top Global Sellers (Amazon/Etsy)
- Hệ thống cơ sở hạ tầng công nghệ hiện đại
- Đội ngũ chuyên gia nhiều kinh nghiệm thực chiến

### Navigation website hiện tại

Home → About Us → Vision → Careers → Stories → Contact

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Modules cho component-level styles
- **Animation:** Framer Motion (scroll animations, counter, transitions)
- **Icons:** Lucide React
- **Fonts:** Google Fonts — Inter (body), Poppins (headings)
- **Image:** next/image với optimization
- **Form:** React Hook Form + Zod validation (Áp dụng cho Form Liên hệ & Upload CV ứng tuyển)
- **Version Control:** Git (Remote origin: https://github.com/Snoww-dev/Ethan.git)
- **Deployment:** Vercel

---

## Design System

### Color Palette

```
Primary Blue:   #1B4FD8   (nền section, CTA button)
Accent Yellow:  #F5A623   (highlight, icon, button secondary)
Dark Navy:      #0D1B3E   (hero overlay, footer)
White:          #FFFFFF   (nền section xen kẽ, text on dark)
Light Gray:     #F8F9FA   (nền section phụ)
Text Primary:   #1A1A2E   (heading)
Text Secondary: #6B7280   (body, caption)
```

### Typography Scale

```
Hero Heading:    56px / 700 weight / Poppins
Section Heading: 36px / 700 weight / Poppins
Sub Heading:     24px / 600 weight / Poppins
Body:            16px / 400 weight / Inter
Caption:         14px / 400 weight / Inter
```

### Spacing & Layout

- Max content width: `1200px`, centered với `auto` margin
- Section padding: `py-20` (80px) mặc định, `py-16` trên mobile
- Grid: 12-column, gap `24px`
- Border radius: `8px` card nhỏ, `16px` card lớn, `4px` button

### Component Patterns (từ design reference)

- **Section alternating:** Nền trắng xen kẽ xanh navy / xanh primary
- **Stat counter:** Số lớn in đậm với animation đếm khi scroll vào viewport
- **Service cards:** Icon màu + tiêu đề + mô tả ngắn, layout 3 cột
- **Portfolio grid:** Masonry / bento grid ảnh công trình, hover overlay
- **Testimonial:** Avatar + tên + chức danh + quote, carousel hoặc grid 2x2
- **CTA section:** Nền xanh đậm, headline lớn, form inline + button vàng
- **Partner logos:** Grayscale → color on hover, flex row centered

---

## Cấu trúc trang (Sitemap)

> Bám sát navigation của ethanecom.com: Home / About Us / Vision / Careers / Stories / Contact

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

**Metadata SEO cho từng trang:**
- Home: "Ethan Ecom — Giải pháp thương mại điện tử toàn cầu cho hàng Việt"
- About: "Về chúng tôi | Ethan Ecom — Đồng lòng đồng sức, bứt phá thành công"
- Vision: "Tầm nhìn | Ethan Ecom — Đưa sản phẩm Việt vươn tầm thế giới"
- Careers: "Tuyển dụng | Ethan Ecom — Môi trường sáng tạo, phát triển bứt phá"
- Stories: "Câu chuyện | Ethan Ecom Blog"
- Contact: "Liên hệ | Ethan Ecom — Trụ sở Võ Dõng, Đồng Nai · +84 967 473 979"

---

## Cấu trúc thư mục

```
ethan-ecom/
├── app/
│   ├── (marketing)/         # Route group — trang public
│   │   ├── page.tsx         # Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── blog/
│   │   ├── careers/
│   │   └── contact/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Sticky nav với mobile menu
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── WhatWeDoSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── VideoSection.tsx
│   │   ├── AboutSnippetSection.tsx
│   │   ├── LatestWorksSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── LatestBlogSection.tsx
│   │   └── ContactCTASection.tsx
│   ├── ui/                  # Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── PortfolioCard.tsx
│   │   ├── BlogCard.tsx
│   │   └── TestimonialCard.tsx
│   └── forms/
│       └── ContactForm.tsx
├── lib/
│   ├── constants.ts         # Nav links, stats data, services data, job listings
│   └── utils.ts
├── public/
│   ├── images/
│   └── icons/
└── tailwind.config.ts
```

---

## Nội dung Home Page (theo thứ tự section)

> Mỗi section phải có scroll animation theo QT-3. Animation type gợi ý ghi kèm từng section.

### 1. Hero Section *(animation: load thẳng — không dùng scroll trigger)*
- Background: ảnh team Ethan Ecom với dark overlay navy `#0D1B3E` opacity 65%
- Badge nhỏ phía trên: "Top Global Sellers on Amazon & Etsy"
- Headline lớn (H1): **"Khơi nguồn sáng tạo — Bứt phá thương mại toàn cầu"**
- Sub-text: "Ethan Ecom — nơi hàng Việt vươn tầm thế giới qua thiết kế đỉnh cao và công nghệ thực chiến."
- CTA button vàng: "Khám phá dịch vụ"  →  `/services`
- CTA text link trắng: "Gia nhập đội ngũ"  →  `/careers`

### 2. What We Do — Dịch vụ *(animation: stagger fadeInUp cho từng card)*
- Nền trắng, tiêu đề section: "Chúng tôi làm gì?"
- 9 service cards (layout 3×3): Web Development / UI/UX Design / Graphic Design / Motion Graphics / Photography / Video Production / E-com Solutions / Digital Marketing / Tech Optimization
- Icon màu + tiêu đề + mô tả 2 dòng (lấy từ bảng dịch vụ ở trên)

### 3. Stats Counter *(animation: count up khi enter viewport)*
- Nền xanh primary full-width
- 4 chỉ số:
  - **Top Sellers** — Amazon & Etsy Global
  - **9+** Dịch vụ chuyên sâu
  - **7** Bộ phận chuyên môn
  - **100%** Cam kết minh bạch

### 4. Video / Culture Section *(animation: scaleIn thumbnail)*
- Thumbnail ảnh team với play button trung tâm
- Modal video công ty khi click
- Caption: "Khám phá văn hoá Ethan Ecom — Ăn trưa & Nghỉ trưa tại văn phòng, Du lịch hàng năm"

### 5. Tầm nhìn — About Snippet *(animation: fadeInLeft text, fadeInRight ảnh)*
- 2 cột: text trái + ảnh team phải
- Headline: **"Đưa sản phẩm Việt vươn tầm thế giới"**
- Body: Sứ mệnh và cam kết đưa hàng Việt ra Amazon, Etsy, TikTok Shop toàn cầu
- 4 core values dạng icon list: Tâm Huyết / Trách Nhiệm / Thấu Hiểu / Minh Bạch
- Button: "Về chúng tôi"  →  `/about`

### 6. Latest Works — Portfolio *(animation: stagger scaleIn cho grid items)*
- Tiêu đề: "Công trình nổi bật"
- Filter tabs: Tất cả / Branding / Web Design / E-commerce / Media
- Grid bento 5–6 ảnh dự án thực tế
- Hover: overlay xanh + tên dự án + icon link
- Button: "Xem tất cả dự án"  →  `/portfolio`

### 7. Team — Đồng lòng *(animation: stagger fadeInUp avatar cards)*
- Nền xanh navy hoặc gradient
- Tiêu đề: **"Đồng lòng đồng sức — Đội ngũ Ethan Ecom"**
- Sub: "Bứt phá gặt thành công"
- Hiển thị các khối bộ phận chủ chốt: E-commerce Ops / Creative Design / Media & Production / Online Marketing / Tech & IT / Production & Workshop / HR & Finance
- Avatar + tên + chức danh từng leader bộ phận

### 8. Skills / Năng lực cốt lõi *(animation: fadeInLeft text + progress bar fill)*
- 2 cột: headline trái + progress bars phải
- Headline: **"Kinh nghiệm thực chiến — Ứng dụng đẳng cấp thế giới"**
- Progress bars: Web Development 95% / UI/UX Design 90% / E-commerce Strategy 92% / Digital Marketing 88% / Video Production 85%

### 9. Careers Preview *(animation: stagger fadeInUp job cards)*
- Tiêu đề: "Gia nhập đội ngũ Ethan Ecom"
- Sub: "Môi trường sáng tạo, cởi mở — Hỗ trợ máy tính, Ăn trưa tại công ty, Lương thưởng hấp dẫn"
- Hiển thị thẻ tuyển dụng nổi bật: Leader TikTokShop US / Web Developer / Video Creator / Graphic Designer / Internet Marketing...
- Tag màu theo bộ phận + tên vị trí + button "Ứng tuyển"
- Button: "Xem tất cả 14 vị trí"  →  `/careers`

### 10. Testimonials — Khách hàng nói gì *(animation: stagger fadeIn cards)*
- Grid 2×2 hoặc carousel auto-slide
- Avatar + tên + chức danh + công ty + quote
- Nhấn mạnh các khách hàng Amazon/Etsy/TikTok Shop

### 11. Stories / Blog *(animation: stagger fadeInUp blog cards)*
- Tiêu đề: "Câu chuyện Ethan Ecom"
- 3 blog card: thumbnail + tag + tiêu đề + excerpt + "Đọc thêm"
- Link →  `/stories`

### 12. Contact CTA *(animation: fadeInUp toàn section)*
- Nền xanh đậm `#0D1B3E` full-width
- Headline: **"Hãy bắt đầu một hành trình mới cùng chúng tôi"**
- Sub: "Võ Dõng - Thống Nhất - Đồng Nai  ·  +84 967 473 979"
- Form inline: Họ tên / Email / Nội dung + button vàng "Gửi tin nhắn"

### 13. Partners / Platforms *(animation: fadeIn row)*
- Row logo: Amazon / Etsy / TikTok Shop / Shopify + logo đối tác
- Grayscale → màu khi hover

---

## Coding Conventions

- Dùng Server Components mặc định, chỉ thêm `'use client'` khi cần interactivity
- Mỗi section là 1 file component riêng trong `components/home/`
- Không hardcode text vào JSX — đặt content vào `lib/constants.ts` hoặc data file (bao gồm toàn bộ text job description dài)
- Tailwind class theo thứ tự: layout → spacing → color → typography → effects
- Không dùng `any` trong TypeScript
- Mỗi page export metadata SEO đầy đủ (title, description, og:image)
- Ảnh dùng `next/image` với `sizes` và `priority` cho above-the-fold; ưu tiên định dạng `.webp`

---

## SEO & Performance

- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Mỗi trang có `generateMetadata` với title + description + og tags
- Structured data (JSON-LD): Organization, WebSite, BreadcrumbList
- Sitemap tự động với `next-sitemap`
- robots.txt: cho phép crawl toàn bộ public pages

---

## Responsive Breakpoints (Tailwind defaults)

```
sm:  640px  — mobile landscape
md:  768px  — tablet
lg:  1024px — tablet landscape / small desktop
xl:  1280px — desktop
2xl: 1536px — large desktop
```

- Mobile-first: viết style mobile trước, override lên các breakpoint lớn hơn
- Navigation: hamburger menu trên `md` trở xuống, full nav từ `lg`
- Grid sections: 1 cột mobile → 2 cột tablet → 3 cột desktop

---

## Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Mọi ảnh có `alt` text mô tả đủ nghĩa
- Focus ring visible cho keyboard navigation
- Color contrast ratio ≥ 4.5:1 cho body text
- Form labels liên kết với input bằng `htmlFor`/`id`

---

## Lưu ý quan trọng

- **Upload Git (QT-4):** Push toàn bộ source code đã hoàn thiện lên https://github.com/Snoww-dev/Ethan.git
- **Form ứng tuyển (`/careers`):** Bắt buộc tạo form có chức năng đính kèm file (PDF/DOC). Ghi rõ yêu cầu ứng viên điền tiêu đề theo cú pháp: `[Tên Vị Trí] - [Họ và Tên]`. Email nhận CV: **hr@ethanecom.com**
- **Email & Liên hệ (`/contact`, Footer):** Dùng email **support@ethanecom.com**. Địa chỉ văn phòng: **Võ Dõng - Thống Nhất - Đồng Nai**
- **Thời gian làm việc:** 7:30 - 17:00 từ Thứ 2 đến Thứ 7 — ghi vào Footer hoặc Contact page để tăng độ uy tín
- Ngôn ngữ mặc định: **Tiếng Việt** cho toàn bộ nội dung. Font chữ phải hỗ trợ tiếng Việt đầy đủ (dấu thanh, dấu mũ)
- Không dùng thư viện UI ngoài Tailwind (không MUI, Chakra, Ant Design) để giữ bundle nhỏ
- Animation (QT-3) phải wrap bằng `prefers-reduced-motion` để tôn trọng accessibility
- Không commit ảnh thật vào repo — dùng placeholder trong dev, nhận ảnh thật từ khách hàng sau
- Phone chính thức: **+84 967 473 979** — format nhất quán toàn trang
- Social media: Dribbble / Twitter / Instagram / Behance — đều handle `@EthanEcom` (trừ Dribbble là `@EthanEcom_Dev`)
- Tất cả hình ảnh sản phẩm/dịch vụ mang tinh thần trẻ trung năng động, chuẩn chất lượng quốc tế (Amazon/Etsy aesthetic), tối ưu định dạng `.webp` với `next/image`
- Không hardcode màu sắc trực tiếp vào component — luôn dùng CSS variable hoặc Tailwind token từ design system
