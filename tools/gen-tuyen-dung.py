#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sinh 14 trang chi tiết tuyển dụng (tuyen-dung-*.html) từ tools/tuyen-dung-jobs.json.

Chạy:  python3 tools/gen-tuyen-dung.py
Sửa nội dung JD → sửa tools/tuyen-dung-jobs.json rồi chạy lại script.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "tools", "tuyen-dung-jobs.json")
DATE_POSTED = "2026-07-28"
BASE_URL = "https://ethanecom.com"

DEPT_TAG = {"kd": "de", "design": "dm", "sx": "df", "office": "dt"}

with open(DATA, encoding="utf-8") as f:
    payload = json.load(f)
SHARED = payload["shared"]
JOBS = payload["jobs"]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def lis(items):
    return "\n".join("            <li>%s</li>" % esc(i) for i in items)


def perk_lis(items):
    check = '<svg width="14" height="14" fill="none" stroke="#15803d" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>'
    return "\n".join("            <li>%s %s</li>" % (check, esc(i)) for i in items)


def fit_lis(pairs, idx):
    return "\n".join("            <li class=\"compare-card__item\">%s</li>" % esc(p[idx]) for p in pairs)


def hours_text(job):
    if job["hours"] == "night":
        return "%s (%s)" % (SHARED["hours_night"], SHARED["hours_night_note"])
    return "%s (%s)" % (SHARED["hours_day"], SHARED["hours_day_note"])


def hours_html(job):
    if job["hours"] == "night":
        return '%s<br><span class="v-note">%s</span>' % (esc(SHARED["hours_night"]), esc(SHARED["hours_night_note"]))
    return '%s<br><span class="v-note">%s</span>' % (esc(SHARED["hours_day"]), esc(SHARED["hours_day_note"]))


def jsonld(job):
    desc = "%s %s" % (job["context"], job["objective"])
    jp = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job["title"],
        "description": desc,
        "datePosted": DATE_POSTED,
        "employmentType": "FULL_TIME",
        "workHours": hours_text(job),
        "directApply": True,
        "url": "%s/%s" % (BASE_URL, job["slug"]),
        "hiringOrganization": {"@type": "Organization", "name": "Ethan Ecom",
                               "sameAs": BASE_URL + "/"},
        "jobLocation": {"@type": "Place", "address": {
            "@type": "PostalAddress",
            "streetAddress": "61/1G Võ Dõng",
            "addressLocality": "Thống Nhất",
            "addressRegion": "Đồng Nai",
            "addressCountry": "VN"}},
    }
    if job.get("salaryMin"):
        value = {"@type": "QuantitativeValue", "minValue": job["salaryMin"], "unitText": "MONTH"}
        if job.get("salaryMax"):
            value["maxValue"] = job["salaryMax"]
        jp["baseSalary"] = {"@type": "MonetaryAmount", "currency": "VND", "value": value}
    bc = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Trang chủ", "item": BASE_URL + "/"},
            {"@type": "ListItem", "position": 2, "name": "Tuyển dụng", "item": BASE_URL + "/tuyen-dung"},
            {"@type": "ListItem", "position": 3, "name": job["title"]},
        ],
    }
    dump = lambda o: json.dumps(o, ensure_ascii=False, indent=1)
    return ('<script type="application/ld+json">\n%s\n</script>\n'
            '<script type="application/ld+json">\n%s\n</script>') % (dump(jp), dump(bc))


def apply_line(job):
    if job["applyChannel"] == "zalo":
        return ('Gửi CV về <strong style="color:#fff">hr@ethanecom.com</strong> hoặc gọi/Zalo '
                '<a href="tel:+84967473979" style="color:var(--yellow);text-decoration:none;font-weight:var(--fw-bold)">0967 473 979</a>')
    cv = "CV/portfolio" if job.get("portfolio") else "CV"
    return ('Gửi %s về <strong style="color:#fff">hr@ethanecom.com</strong> hoặc inbox '
            '<a href="https://www.facebook.com/EthanEcom" target="_blank" rel="noopener" '
            'style="color:var(--yellow);text-decoration:none;font-weight:var(--fw-bold)">fanpage Ethan Ecom</a>') % cv


TEMPLATE = r"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-C5QPQHHMR1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-C5QPQHHMR1');
</script>

  <link rel="icon" type="image/png" href="assets/images/favicon.png">
  <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
<title>%%META_TITLE%%</title>
<meta name="description" content="%%META_DESC%%">
<meta name="keywords" content="Ethan tuyển dụng, %%DISPLAY%%, việc làm Đồng Nai, việc làm Thống Nhất, việc làm e-commerce, Ethan Ecom careers">
<link rel="canonical" href="%%CANONICAL%%">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Ethan Ecom">
<meta property="og:locale" content="vi_VN">
<meta property="og:title" content="%%META_TITLE%%">
<meta property="og:description" content="%%META_DESC%%">
<meta property="og:url" content="%%CANONICAL%%">
<meta property="og:image" content="https://ethanecom.com/assets/images/og/og-default.jpg">
<meta property="og:image:secure_url" content="https://ethanecom.com/assets/images/og/og-default.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="%%META_TITLE%%">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="%%META_TITLE%%">
<meta name="twitter:description" content="%%META_DESC%%">
<meta name="twitter:image" content="https://ethanecom.com/assets/images/og/og-default.jpg">

%%JSONLD%%
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Inter:wght@400;500;600;700&family=Fahkwang:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Mulish:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Inter:wght@400;500;600;700&family=Fahkwang:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Mulish:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Inter:wght@400;500;600;700&family=Fahkwang:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Mulish:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"></noscript>
<link rel="stylesheet" href="assets/css/shared.css?v=housef09">
<style>
/* ── JOB DETAIL PAGE (generated — sửa template trong tools/gen-tuyen-dung.py) ── */

/* Facts strip */
.jd-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.jd-fact{background:#fff;border:1.5px solid #eaeff5;padding:20px 22px;transition:border-color .3s}
.jd-fact:hover{border-color:var(--blue)}
.jd-fact .k{display:block;font-size:var(--fs-caption);font-weight:var(--fw-bold);letter-spacing:.18em;text-transform:uppercase;color:#9ca3af;margin-bottom:7px}
.jd-fact .v{font-family:var(--font-lead);font-size:var(--fs-base);font-weight:var(--fw-semibold);color:var(--navy);line-height:1.5}
.jd-fact .v-note{display:inline-block;margin-top:4px;font-family:var(--font-alt);font-size:var(--fs-small);font-weight:var(--fw-regular,400);color:#8a95a6}
.jd-fact--hl .v-note{color:rgba(255,255,255,.65)}
.jd-fact--hl{background:var(--navy);border-color:var(--navy)}
.jd-fact--hl .k{color:rgba(255,255,255,.55)}
.jd-fact--hl .v{color:var(--yellow)}

/* About (ảnh + bối cảnh) */
.jd-about{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:center}
body.typo-eco .jd-about .sl{font-size:32px;font-weight:var(--fw-light,300);letter-spacing:3px}
.jd-about-img{overflow:hidden;background:#EAF3FB}
.jd-about-img img{width:100%;height:100%;min-height:320px;max-height:460px;object-fit:cover;display:block}
.jd-about h3{font-family:var(--font-heading);font-size:var(--fs-h3);font-weight:var(--fw-medium,500);text-transform:uppercase;color:var(--navy);margin:0 0 12px}
.jd-about p{font-size:var(--fs-base);color:var(--text);line-height:1.8;margin-bottom:22px}
.jd-about p:last-child{margin-bottom:0}

/* Lists 2 cột */
.jd-cols{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.jd-col-title{font-size:var(--fs-base);font-weight:var(--fw-medium,500);letter-spacing:.22em;text-transform:uppercase;color:#1A2433;margin:0 0 12px}
.jdetail-list{list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:9px}
.jdetail-list li{font-size:var(--fs-base);color:var(--text);line-height:1.65;padding-left:16px;position:relative}
.jdetail-list li::before{content:'–';position:absolute;left:0;color:var(--blue)}
.jperks-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
.jperks-list li{display:flex;align-items:flex-start;gap:9px;font-size:var(--fs-base);color:var(--text);line-height:1.6}
.jperks-list li svg{flex-shrink:0;margin-top:4px}

/* FIT / NOT FIT — 2 thẻ so sánh Navy & Cream */
.compare{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}
.compare-card{position:relative;background:#FBF9F4;padding:40px 32px 50px;overflow:hidden}
.compare-card--muted{border:10px solid #DCE6F0}
.compare-card--brand{border:10px solid #CBBA95}
.compare-card::before{content:"";position:absolute;top:-90px;width:240px;height:240px;border-radius:50%;z-index:0}
.compare-card--muted::before{right:-90px;background:#DCE6F0}
.compare-card--brand::before{left:-90px;background:#E0D5BC}
.compare-card__head{position:relative;z-index:1;display:flex;flex-direction:column;gap:12px;margin-bottom:36px}
.compare-card--brand .compare-card__head{align-items:flex-end;text-align:right}
.compare-card__head svg{width:56px;height:56px}
.compare-card__title{font-family:var(--font-heading);font-weight:var(--fw-semibold,600);font-size:20px;line-height:1.2;letter-spacing:1px;text-transform:uppercase;margin:0}
.compare-card--muted .compare-card__title{color:#35618D}
.compare-card--brand .compare-card__title{color:#142E4A}
.compare-card__list{position:relative;z-index:1;list-style:none;display:flex;flex-direction:column;gap:22px;margin:0;padding:0}
.compare-card__item{position:relative;font-family:var(--font-text);font-size:16px;line-height:1.55;color:#3E5A78}
.compare-card__item::before{content:"";position:absolute;top:4px;width:18px;height:18px;border-radius:50%}
.compare-card--muted .compare-card__item{padding-left:40px;text-align:left}
.compare-card--muted .compare-card__item::before{left:0;background:#8FADC9;box-shadow:0 0 0 5px #DCE6F0}
.compare-card--brand .compare-card__item{padding-right:40px;text-align:right;color:#142E4A}
.compare-card--brand .compare-card__item::before{right:0;background:#CBBA95;box-shadow:0 0 0 5px #F5F0E6}

/* Lộ trình 30/60/90 */
.jd-road{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:44px}
.jd-road-step{background:#fff;border:1.5px solid #eaeff5;padding:28px 24px;transition:border-color .3s,box-shadow .3s,transform .3s}
.jd-road-step:hover{border-color:var(--blue);box-shadow:0 14px 40px rgba(27,79,216,.1);transform:translateY(-4px)}
.jd-road-num{font-family:var(--font-numeral,var(--font-lead));font-size:44px;font-weight:var(--fw-bold);color:var(--blue);line-height:1;margin-bottom:6px}
.jd-road-num span{font-size:var(--fs-base);color:#9ca3af;font-family:var(--font-text);font-weight:var(--fw-semibold)}
.jd-road-step p{font-size:var(--fs-base);color:var(--text);line-height:1.65;margin:10px 0 0}

/* KPI */
.jd-kpi{background:#fff;border:1.5px solid #eaeff5;padding:28px 30px}
.jd-kpi .jd-col-title{margin-bottom:14px}

/* CTA */
.jd-cta-info{color:rgba(255,255,255,.78);margin:18px auto 10px;max-width:560px;font-size:var(--fs-base);line-height:1.8}
.jd-cta-mail{color:rgba(255,255,255,.78);margin:0 auto 32px;max-width:560px;font-size:var(--fs-base);line-height:1.8}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .jd-facts{grid-template-columns:repeat(2,1fr)}
  .jd-about{grid-template-columns:1fr;gap:32px}
  .jd-about-img img{min-height:0;max-height:340px}
  .compare{grid-template-columns:1fr;gap:32px}
  .compare-card{padding:32px 24px 40px}
  .compare-card__item{font-size:14px}
  .compare-card--brand .compare-card__head{align-items:flex-start;text-align:left}
  .compare-card--brand .compare-card__item{text-align:left;padding:0 0 0 40px}
  .compare-card--brand .compare-card__item::before{right:auto;left:0}
  .jd-road{grid-template-columns:1fr}
}
@media(max-width:768px){
  .jd-cols{grid-template-columns:1fr;gap:28px}
}
@media(max-width:560px){
  .jd-facts{grid-template-columns:1fr}
}
</style>
</head>
<body class="typo-eco">

<!-- HEADER (injected by shared.js) -->
<div id="site-header"></div>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="page-hero-dots"></div>
  <div class="page-hero-orb page-hero-orb-1"></div>
  <div class="page-hero-orb page-hero-orb-2"></div>
  <div class="container page-hero-inner">
    <nav class="breadcrumb">
      <a href="./">Trang chủ</a>
      <span class="breadcrumb-sep">/</span>
      <a href="tuyen-dung">Tuyển dụng</a>
      <span class="breadcrumb-sep">/</span>
      <span>%%DISPLAY%%</span>
    </nav>
    <div class="page-hero-badge">★ Đang tuyển · Mã %%CODE%% · Số lượng: %%COUNT%%</div>
    <h1 class="page-hero-title">%%HERO_HTML%%</h1>
    <p class="page-hero-sub">%%OBJECTIVE%%</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:28px">
      <button type="button" class="btn btn--yellow" onclick="window.ethanOpenApply && window.ethanOpenApply('%%SLUG%%')">Ứng tuyển ngay →</button>
      <a href="tuyen-dung#jobs" class="btn btn--outline" style="background:rgba(255,255,255,.12);color:#fff">Xem vị trí khác</a>
    </div>
  </div>
</section>

<!-- MAIN CONTENT -->
<main id="main">

  <!-- THÔNG TIN NHANH -->
  <section class="section" style="padding-bottom:0">
    <div class="container">
      <div class="jd-facts reveal">
        <div class="jd-fact jd-fact--hl"><span class="k">Mức lương</span><span class="v">%%SALARY%%</span></div>
        <div class="jd-fact"><span class="k">Số lượng</span><span class="v">%%COUNT%%</span></div>
        <div class="jd-fact"><span class="k">Khối / Bộ phận</span><span class="v">%%BLOCK%%</span></div>
        <div class="jd-fact"><span class="k">Báo cáo cho</span><span class="v">%%REPORT_TO%%</span></div>
        <div class="jd-fact"><span class="k">Giờ làm việc</span><span class="v">%%HOURS%%</span></div>
        <div class="jd-fact"><span class="k">Địa điểm</span><span class="v">%%LOCATION%%</span></div>
        <div class="jd-fact"><span class="k">Thử việc</span><span class="v">%%PROBATION%%</span></div>
        <div class="jd-fact"><span class="k">Loại hình</span><span class="v">%%TYPE%%</span></div>
      </div>
    </div>
  </section>

  <!-- BỐI CẢNH & MỤC TIÊU -->
  <section class="section">
    <div class="container">
      <div class="jd-about">
        <div class="jd-about-img reveal rl">
          <img loading="lazy" decoding="async" src="%%IMG%%" alt="%%IMG_ALT%%" onerror="this.style.visibility='hidden'">
        </div>
        <div class="reveal rr">
          <div class="sl">Về vị trí này</div>
          <h3>Bối cảnh vị trí</h3>
          <p>%%CONTEXT%%</p>
          <h3>Mục tiêu vị trí</h3>
          <p>%%OBJECTIVE%%</p>
        </div>
      </div>
    </div>
  </section>

  <!-- TRÁCH NHIỆM & YÊU CẦU -->
  <section class="section section--gray">
    <div class="container">
      <div class="sh c reveal">
        <div class="sl">Chi tiết công việc</div>
        <h2 class="st">Bạn sẽ làm gì ở Ethan?</h2>
        <div class="divider c"></div>
      </div>
      <div class="jd-cols">
        <div class="reveal d1">
          <p class="jd-col-title">Trách nhiệm chính</p>
          <ul class="jdetail-list">
%%DUTIES%%
          </ul>
        </div>
        <div class="reveal d2">
          <p class="jd-col-title">Yêu cầu bắt buộc</p>
          <ul class="jdetail-list">
%%REQUIREMENTS%%
          </ul>
          <p class="jd-col-title">Ưu tiên (lợi thế)</p>
          <ul class="jdetail-list">
%%PREFERRED%%
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- FIT / NOT FIT -->
  <section class="section">
    <div class="container">
      <div class="sh c reveal">
        <div class="sl">Văn hoá Ethan</div>
        <h2 class="st">Bạn có hợp với vị trí này?</h2>
        <div class="divider c"></div>
        <p class="ss">Chúng tôi viết thật, để cả hai bên không mất thời gian của nhau.</p>
      </div>
      <div class="compare">
        <div class="compare-card compare-card--muted reveal rl">
          <div class="compare-card__head">
            <svg viewBox="0 0 24 24" fill="#5D84AB" aria-hidden="true">
              <circle cx="12" cy="7.5" r="3.5"/>
              <path d="M12 12.5c-4 0-6.5 2.2-6.5 5.5h13c0-3.3-2.5-5.5-6.5-5.5z"/>
            </svg>
            <p class="compare-card__title">Có thể chưa hợp nếu</p>
          </div>
          <ul class="compare-card__list">
%%FIT_NO%%
          </ul>
        </div>
        <div class="compare-card compare-card--brand reveal rr">
          <div class="compare-card__head">
            <svg viewBox="0 0 24 24" fill="#142E4A" aria-hidden="true">
              <circle cx="12" cy="6.5" r="3"/>
              <path d="M12 10.5c-3.4 0-5.5 1.9-5.5 4.7h11c0-2.8-2.1-4.7-5.5-4.7z"/>
              <circle cx="5.5" cy="8" r="2.3"/>
              <path d="M5.5 11c-2.6 0-4.2 1.5-4.2 3.7h4.2c0-1.5 .5-2.7 1.4-3.4-.5-.2-1-.3-1.4-.3z"/>
              <circle cx="18.5" cy="8" r="2.3"/>
              <path d="M18.5 11c2.6 0 4.2 1.5 4.2 3.7h-4.2c0-1.5-.5-2.7-1.4-3.4 .5-.2 1-.3 1.4-.3z"/>
            </svg>
            <p class="compare-card__title">Bạn sẽ phát triển ở Ethan nếu</p>
          </div>
          <ul class="compare-card__list">
%%FIT_YES%%
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- LỘ TRÌNH & KPI -->
  <section class="section section--gray">
    <div class="container">
      <div class="sh c reveal">
        <div class="sl">90 ngày đầu tiên</div>
        <h2 class="st">Lộ trình 30 / 60 / 90 ngày</h2>
        <div class="divider c"></div>
        <p class="ss">Bạn luôn biết mình cần đạt gì ở từng chặng — không mơ hồ, không tự bơi.</p>
      </div>
      <div class="jd-road">
        <div class="jd-road-step reveal d1">
          <div class="jd-road-num">30 <span>ngày</span></div>
          <p>%%ROAD_30%%</p>
        </div>
        <div class="jd-road-step reveal d2">
          <div class="jd-road-num">60 <span>ngày</span></div>
          <p>%%ROAD_60%%</p>
        </div>
        <div class="jd-road-step reveal d3">
          <div class="jd-road-num">90 <span>ngày</span></div>
          <p>%%ROAD_90%%</p>
        </div>
      </div>
      <div class="jd-kpi reveal">
        <p class="jd-col-title">Cách đo lường thành công (KPI)</p>
        <ul class="jdetail-list" style="margin-bottom:0">
%%KPIS%%
        </ul>
      </div>
    </div>
  </section>

  <!-- QUYỀN LỢI -->
  <section class="section">
    <div class="container">
      <div class="sh c reveal">
        <div class="sl">Quyền lợi</div>
        <h2 class="st">Ethan mang lại gì cho bạn?</h2>
        <div class="divider c"></div>
      </div>
      <div class="jd-kpi reveal" style="max-width:760px;margin:0 auto">
        <ul class="jperks-list">
%%PERKS%%
        </ul>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section section--blue" style="text-align:center">
    <div class="container">
      <div class="reveal">
        <div class="sl" style="color:var(--yellow)">Ứng tuyển %%DISPLAY%%</div>
        <h2 class="st" style="color:#fff;margin-top:10px">Sẵn sàng gia nhập<br>đội ngũ Ethan Ecom?</h2>
        <p class="jd-cta-info">%%APPLY_LINE%%</p>
        <p class="jd-cta-mail">Tiêu đề email: <strong style="color:#fff">%%EMAIL_TITLE%%</strong></p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn btn--yellow" onclick="window.ethanOpenApply && window.ethanOpenApply('%%SLUG%%')">Ứng tuyển ngay →</button>
          <a href="tuyen-dung#jobs" class="btn btn--outline" style="background:rgba(255,255,255,.12);color:#fff">← Xem tất cả vị trí</a>
        </div>
      </div>
    </div>
  </section>

</main>

<!-- FOOTER (injected by shared.js) -->
<div id="site-footer"></div>

<!-- Shared JS (must be last) -->
<script src="assets/js/shared.js?v=housef07"></script>

<!-- Contact popup (chứa popup "Kiến Tạo Tương Lai" dùng chung cho mọi nút Ứng tuyển) + dock 2 nút gim -->
<div id="contact-popup-root"></div>
<script src="assets/js/contact-popup.js?v=housef07"></script>
</body>
</html>
"""


def render(job):
    meta_title = "Tuyển dụng %s | Ethan Ecom" % job["display"]
    html = TEMPLATE
    reps = {
        "%%META_TITLE%%": esc(meta_title),
        "%%META_DESC%%": esc(job["metaDesc"]),
        "%%CANONICAL%%": "%s/%s" % (BASE_URL, job["slug"]),
        "%%JSONLD%%": jsonld(job),
        "%%DISPLAY%%": esc(job["display"]),
        "%%SLUG%%": job["slug"],
        "%%HERO_HTML%%": job["heroHtml"],
        "%%CODE%%": esc(job["code"]),
        "%%COUNT%%": esc(job["count"]),
        "%%OBJECTIVE%%": esc(job["objective"]),
        "%%SALARY%%": esc(job["salary"]),
        "%%BLOCK%%": esc(job["block"]),
        "%%REPORT_TO%%": esc(job["reportTo"]),
        "%%HOURS%%": hours_html(job),
        "%%LOCATION%%": esc(job["location"]),
        "%%PROBATION%%": esc(SHARED["probation"]),
        "%%TYPE%%": esc(job["type"]),
        "%%IMG%%": job["img"],
        "%%IMG_ALT%%": esc(job["imgAlt"]),
        "%%CONTEXT%%": esc(job["context"]),
        "%%DUTIES%%": lis(job["duties"]),
        "%%REQUIREMENTS%%": lis(job["requirements"]),
        "%%PREFERRED%%": lis(job["preferred"]),
        "%%FIT_YES%%": fit_lis(job["fitPairs"], 0),
        "%%FIT_NO%%": fit_lis(job["fitPairs"], 1),
        "%%ROAD_30%%": esc(job["roadmap"][0]),
        "%%ROAD_60%%": esc(job["roadmap"][1]),
        "%%ROAD_90%%": esc(job["roadmap"][2]),
        "%%KPIS%%": lis(job["kpis"]),
        "%%PERKS%%": perk_lis(job["perks"]),
        "%%APPLY_LINE%%": apply_line(job),
        "%%EMAIL_TITLE%%": esc(job["emailTitle"]),
    }
    for k, v in reps.items():
        html = html.replace(k, v)
    return html


def main():
    for job in JOBS:
        out = os.path.join(ROOT, job["slug"] + ".html")
        with open(out, "w", encoding="utf-8") as f:
            f.write(render(job))
        print("✓", job["slug"] + ".html")
    print("Done — %d trang." % len(JOBS))


if __name__ == "__main__":
    sys.exit(main())
