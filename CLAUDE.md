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

> Nguồn: https://ethanecom.com/ + **"Bộ câu hỏi phỏng vấn ban lãnh đạo"** (Google Docs, bản chỉnh sửa) — nội dung thật đã xác nhận bởi ban lãnh đạo, dùng làm chuẩn cho toàn bộ website.
>
> **Quy tắc phân loại nội dung từ tài liệu phỏng vấn (bắt buộc tuân thủ khi lấy nội dung):**
> - 🟩 **Highlight XANH** = nội dung nhấn mạnh đặc biệt → đưa lên web VÀ làm nổi bật (hero, quote lớn, callout).
> - ⬜ **Highlight XÁM** hoặc tag 🏷️ **[Đối ngoại]** / **[Cả hai]** = được đưa lên web (thể hiện bình thường).
> - ❌ Tag **[Đối nội]** không highlight = KHÔNG đưa lên web (chỉ phục vụ vận hành nội bộ: số máy xưởng, công suất, P&L, SOP, lương từng vị trí, công cụ nội bộ…).

### Thông tin cơ bản

| Trường | Giá trị |
|--------|---------|
| Tên thương hiệu | Ethan Ecom |
| Tên pháp lý | Công Ty TNHH MTV Phát Triển Công Nghệ Ethan |
| Năm thành lập | 2017 (vận hành công ty bài bản từ 2024) · footer ghi "2017 – 2026" |
| Website hiện tại | https://ethanecom.com/ |
| Trụ sở làm việc | 61/1G Võ Dõng 2, Thống Nhất, Đồng Nai |
| Thời gian làm việc | 7:30 - 17:00 từ Thứ 2 đến Thứ 7 (Nghỉ trưa 1h30') |
| Email CSKH | support@ethanecom.com |
| Email Tuyển dụng | hr@ethanecom.com |
| Phone | +84 967 473 979 |
| Quy mô | 88 nhân sự (report 18/06/2026) — 56 nữ / 32 nam |
| Lĩnh vực | TMĐT xuyên biên giới (cross-border) — POD, thêu, in giấy, in nhựa 3D |
| Thị trường | Quốc tế, trọng tâm **Mỹ (~90%)** qua TikTok Shop US, Etsy (+ Amazon, eBay, Temu, Shopify) |
| Sản phẩm chủ lực | Áo thun · Mũ · Cốc · Poster · Sticker |
| USP | Tự chủ sản xuất in-house + tinh thần đồng đội & tư duy phát triển dài hạn |
| Rating sàn | 4–5 sao (TikTok Shop / Etsy / Amazon) |

### Social Media

| Platform | Handle |
|----------|--------|
| Dribbble | @EthanEcom_Dev |
| Twitter / X | @EthanEcom |
| Instagram | @EthanEcom |
| Behance | @EthanEcom |

### Tầm nhìn (Vision) 🟩 *nhấn mạnh*

> Trong 3–5 năm tới, Ethan không chỉ là một team MMO hay bán hàng online, mà trở thành một **công ty e-commerce có hệ thống vận hành bài bản** — từ nghiên cứu sản phẩm, marketing, bán hàng đến sản xuất. Mục tiêu là xây dựng một đội ngũ đủ mạnh, **tự chủ về sản phẩm và sản xuất** để phát triển bền vững, thành công trên thị trường quốc tế.

### Sứ mệnh (Mission)

> Tạo ra những sản phẩm chất lượng, có giá trị thật cho khách hàng quốc tế; và xây dựng một môi trường để mỗi thành viên đều có cơ hội phát triển năng lực và cùng nhau đi lên. Mỗi ngày, ngoài doanh số, Ethan muốn tạo ra một môi trường làm việc chất lượng, văn hoá con người tốt hơn — nơi mỗi người học hỏi, phát triển và nhìn thấy tương lai của mình.

### Nguyên tắc bất di bất dịch 🟩 *nhấn mạnh*

> **"Không đánh đổi sự tử tế và uy tín để lấy doanh số."**

### Giá trị cốt lõi (Core Values) 🟩 *5 giá trị — thay bộ 4 giá trị cũ*

| # | Giá trị | Ý nghĩa (hành vi) |
|---|---------|-------------------|
| 1 | **Đồng lòng** | Sẵn sàng hỗ trợ đồng đội; không bè phái, không "việc ai người đó lo"; cùng cố gắng vì mục tiêu chung |
| 2 | **Tử tế** | Đối xử tôn trọng ở mọi cấp; không dùng chức vụ lấn lướt; góp ý thẳng thắn tinh thần xây dựng |
| 3 | **Trách nhiệm** | Không đổ lỗi; cam kết với công việc và với những người đi cùng mình |
| 4 | **Cải tiến** | Chủ động tìm cách mới khi cách cũ hết hiệu quả; xem AI là công cụ, dùng mỗi ngày |
| 5 | **Bền bỉ** | Đủ chắc, đủ lì để vượt sóng gió và phát triển dài hạn |

Phương châm đội nhóm: **"Đồng lòng đồng sức, bứt phá gặt thành công"**
Mô tả ngắn thương hiệu: *"Ethan Ecom – nơi khơi nguồn sáng tạo và hỗ trợ sự phát triển cá nhân."*

### Câu chuyện thương hiệu (About)

- **Tên "Ethan":** khởi nguồn từ team nhỏ lập 2017 tên **"Eagle"** (founder có vết bớt đỏ hình đại bàng trên trán) — biểu tượng mạnh mẽ, bản lĩnh, kiên cường, luôn bay lên đối mặt thử thách. Sau ~2 năm đổi thành **"Ethan Ecom"** — mang ý nghĩa vững chắc, bền bỉ, đoàn kết: một đội ngũ "đủ chắc, đủ lì, đủ đồng lòng".
- **Bước ngoặt 2018–2019:** mất gần hết tài khoản Merch by Amazon; 2 đồng đội từ chối rời đi → bài học sâu sắc về hai chữ "đồng đội", founder quyết không bỏ cuộc.
- **Câu chuyện khách hàng (2022):** bộ sản phẩm "Nhận thức ung thư" — review nhận về là lời cảm ơn từ người thân bệnh nhân; bài học "giá trị nhân văn lớn hơn mọi chỉ số kinh doanh".

### Cột mốc / Timeline
2017 (team "Eagle") → 2018–2019 (bước ngoặt Merch, đổi tên Ethan Ecom) → 2024 (vận hành công ty bài bản) → 2026 (88 nhân sự, sản xuất in-house + đa sàn).

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

**Cấp lãnh đạo (tên thật — mô hình chuẩn 14/06/2026):**
- **Nguyễn Đình Duy (Duy Nguyễn)** — Founder — đồng điều hành, định hướng & điều hành chung
- **Đoàn Thị Minh Nguyệt** — CEO — đồng điều hành
- **Trần Vũ Quốc Bảo** — CPO — đứng đầu Khối Sản Xuất

**Các khối / phòng ban (88 nhân sự):**
- Kinh Doanh (32) — nguồn thu chính, 6 đội KD (Manager + Team Leader + Seller)
- Sản Xuất (49) — SX1 Thêu · SX2 Giấy · SX3 Nhựa 3D · Design (EMB 21, POD 8) · R&D · Tồn kho/NVL
- Fulfillment (2) — đơn nguồn ngoài (Printify, Gearment…)
- IT / Development (3)
- *Đang xây/tuyển:* Marketing & Thương hiệu, Kế toán, HR, Logistics US (hiện BGĐ tạm gánh)

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

**Văn hoá tuyển dụng (thông điệp thật):** **"ETHAN KHÔNG PHẢI NƠI DÀNH CHO TẤT CẢ MỌI NGƯỜI."**
- *Bạn sẽ phát triển ở Ethan nếu:* học vì thích chứ không vì bị ép; tự tìm cách mới khi cách cũ hết hiệu quả; chấp nhận KPI tính theo **lợi nhuận thực**; nhạy cảm với xu hướng thị trường Mỹ; xem **AI là công cụ, dùng mỗi ngày**.
- *Bạn có thể chưa hợp nếu:* làm tốt việc mình nhưng ít chủ động; cần sự ổn định, ngại thay đổi (6 tháng qua Ethan tái cơ cấu, đổi sản phẩm, đổi KPI); giỏi nhưng khó thay đổi cách làm.

**Triết lý nhân sự 🟩 (nhấn mạnh):**
- **Con người là tài sản lớn nhất** — không ngừng đào tạo, tạo điều kiện để mỗi cá nhân phát triển cùng tổ chức.
- **Cơ hội thăng tiến luôn mở với tất cả** — mọi quản lý cấp cao đều xuất phát từ vị trí đầu tiên; đánh giá theo năng lực, thái độ và 5 giá trị cốt lõi.
- **Quan hệ gia đình/bạn bè không phải yếu tố** được xem xét trong tuyển dụng & đánh giá.
- Lộ trình: 2 mốc thăng tiến/năm (kết thúc Q2 & Q4); BGĐ quan sát & đề xuất trực tiếp.

**Phúc lợi nổi bật:**
- BHXH đầy đủ theo luật Lao động Việt Nam
- Thưởng lễ/Tết, lương tháng 13, KPI/Bonus theo hiệu suất
- Hỗ trợ ăn trưa tại công ty & hỗ trợ đi lại
- Du lịch, team building hàng năm (biển / Đà Lạt), tiệc Christmas, sinh nhật hàng tháng

### Thành tích & Nhận diện

- Rating 4–5 sao trên TikTok Shop / Etsy / Amazon
- 88 nhân sự · vận hành từ 2017 · tự chủ sản xuất in-house (thêu / in giấy / in nhựa 3D)
- Bán đa sàn quốc tế: TikTok Shop US, Etsy, Amazon, eBay

### Định hướng thương hiệu & Website (từ tài liệu phỏng vấn)

- **Đối tượng theo 3 giai đoạn:** GĐ1 (hiện tại) = **ứng viên tuyển dụng / employer branding** → GĐ2 = khách hàng & đối tác B2B → GĐ3 = giá trị công ty & nhà đầu tư.
- **Thông điệp nhân văn:** xây dựng doanh nghiệp **tại địa phương**, tạo cơ hội cho **các bạn trẻ tài năng đang phải sống xa quê** — "công ty địa phương vẫn có thể vươn ra thế giới"; kể câu chuyện Ethan lớn lên từng ngày (year over year).
- **Tone:** Chuyên nghiệp / formal + Truyền cảm hứng.
- **SEO keywords:** Văn hoá Ethan · Ethan tuyển dụng · Ethan Cross-border.

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
