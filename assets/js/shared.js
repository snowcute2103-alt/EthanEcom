/* ================================================================
   ETHAN ECOM — Shared JavaScript
   Injected into every page. Handles: Header/Footer HTML injection,
   active nav detection, scroll animations, counter, parallax.
   ================================================================ */

/* ════════════════════════════════════════════════════════════════
   FORM EMAIL WEBHOOK (Google Apps Script) — NGUỒN URL DUY NHẤT toàn site.
   Dùng chung cho MỌI form gửi mail: 2 popup (chat Liên hệ + Ứng tuyển) và
   2 form inline (Liên hệ trên lien-he + Ứng tuyển modal trên tuyen-dung).
   • Đổi webhook / đổi email nhận: sửa URL dưới đây + HR_EMAIL/SUPPORT_EMAIL
     trong apps-script/Code.gs. KHÔNG sửa rải rác nhiều file.
   • Để trống '' → popup tự fallback FormSubmit; form inline báo lỗi nhẹ.
   ════════════════════════════════════════════════════════════════ */
window.ETHAN_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyfY9EWOodMhurWvfzgid_RB4kulSV95w64-qILoMy8CEZzWAxWqGL1vBTCmZgJubZhvg/exec';

/* Đọc File → chuỗi base64 (bỏ tiền tố "data:...;base64,") để nhét vào JSON */
window.ethanFileToBase64 = function (file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      var res = String(reader.result), c = res.indexOf(',');
      resolve(c >= 0 ? res.slice(c + 1) : res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/* POST payload JSON tới webhook. Không set Content-Type → "simple request",
   tránh CORS preflight (Apps Script không trả OPTIONS). Trả Promise. */
window.ethanSendForm = function (payload) {
  if (!window.ETHAN_WEBHOOK_URL) return Promise.reject(new Error('webhook-not-configured'));
  return fetch(window.ETHAN_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
    .then(function (r) { if (!r || r.ok === false) throw new Error((r && r.error) || 'webhook'); return r; });
};

/* ── NAV PAGES (single source of truth) ── */
const NAV_LINKS = [
  { href: '/',     label: 'Trang chủ',   icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: 'gioi-thieu',     label: 'Giới thiệu',  icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
  { href: 'tam-nhin',    label: 'Tầm nhìn',     icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
  { href: 'cau-chuyen',      label: 'Câu chuyện',   icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' },
  { href: 'tuyen-dung',   label: 'Tuyển dụng',  icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
];

/* ── BUILD HEADER HTML ── */
function buildHeader() {
  /* Logo ở chính giữa: 3 mục bên trái, 3 mục bên phải (Liên hệ khép cuối). */
  const leftItems = NAV_LINKS.slice(0, 3).map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');
  const rightItems = NAV_LINKS.slice(3).map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('') + `<a href="lien-he">Liên hệ</a>`;
  const mobItems = NAV_LINKS.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  return `
<a href="#main" class="skip-link">Bỏ qua tới nội dung</a>
<header class="header" id="hdr">
  <div class="hdr-line"></div>
  <div class="hi hi--center">
    <nav class="nav nav-left" id="mainNav">
      ${leftItems}
    </nav>
    <a href="/" class="logo">
      <img src="assets/images/logo.jpg" alt="Ethan Ecom">
    </a>
    <nav class="nav nav-right">
      ${rightItems}
    </nav>
    <div class="hamburger" id="hbg" role="button" tabindex="0" aria-label="Mở menu" aria-controls="mob" aria-expanded="false">
      <span></span><span></span><span></span>
    </div>
  </div>
</header>
<nav class="mob-nav" id="mob" aria-hidden="true">
  ${mobItems}
  <a href="lien-he" class="mob-cta">Liên hệ →</a>
  <div class="mob-nav-foot">
    <a href="mailto:support@ethanecom.com">support@ethanecom.com</a>
    <span class="sep">·</span>
    <a href="tel:+84967473979">+84 967 473 979</a>
  </div>
</nav>
`;
}

/* ── BUILD FOOTER HTML ── */
function buildFooter() {
  return `
<footer class="site-footer">
  <div class="ft-container">

    <!-- Logo -->
    <div class="ft-logo">
      <a class="ft-logo-badge" href="/" aria-label="Ethan Ecom, về trang chủ">
        <img src="assets/images/logo.png" alt="Ethan Ecom">
      </a>
      <div class="ft-logo-sub">Ecommerce / Print On Demand / Digital Marketing</div>
    </div>

    <!-- Nav -->
    <nav class="ft-nav" aria-label="Điều hướng footer">
      <ul>
        <li><a href="/">Trang chủ</a></li>
        <li><a href="gioi-thieu">Giới thiệu</a></li>
        <li><a href="tam-nhin">Tầm nhìn</a></li>
        <li><a href="cau-chuyen">Câu chuyện</a></li>
        <li><a href="tuyen-dung">Tuyển dụng</a></li>
        <li><a href="lien-he">Liên hệ</a></li>
      </ul>
    </nav>

    <hr class="ft-divider">

    <!-- 4 columns -->
    <div class="ft-columns">

      <div class="ft-col">
        <h3>Về Ethan Ecom</h3>
        <p>Nơi khơi nguồn sáng tạo và hỗ trợ sự phát triển cá nhân. Doanh nghiệp TMĐT xuyên biên giới tự chủ sản xuất. Đồng lòng đồng sức, bứt phá gặt thành công.</p>
      </div>

      <div class="ft-col">
        <h3>Dịch vụ</h3>
        <ul>
          <li><a href="dich-vu">TMĐT xuyên biên giới</a></li>
          <li><a href="dich-vu">Print On Demand (POD)</a></li>
          <li><a href="dich-vu">Thêu công nghiệp</a></li>
          <li><a href="dich-vu">In giấy &amp; Sticker</a></li>
          <li><a href="dich-vu">In nhựa 3D</a></li>
          <li><a href="dich-vu">Digital Marketing</a></li>
        </ul>
      </div>

      <div class="ft-col">
        <h3>Liên hệ</h3>
        <p>
          <span class="ft-label">Địa chỉ</span>
          61/1G Võ Dõng, Gia Kiệm, Đồng Nai
        </p>
        <p>
          <span class="ft-label">Giờ làm việc</span>
          7:30 – 17:00 · Thứ 2 – Thứ 7
        </p>
      </div>

      <div class="ft-col">
        <h3>Tuyển dụng &amp; Kết nối</h3>
        <p>
          <span class="ft-label">Email tuyển dụng</span>
          <a href="mailto:hr@ethanecom.com">hr@ethanecom.com</a>
        </p>
        <p>
          <span class="ft-label">Hotline</span>
          <a href="tel:+84967473979">+84 967 473 979</a>
        </p>
        <p>
          <span class="ft-label">Facebook</span>
          <a href="https://www.facebook.com/ethanecom3979" target="_blank" rel="noopener">facebook.com/ethanecom3979</a>
        </p>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="ft-bottom">
      <div class="ft-social">
        Theo dõi chúng tôi:
        <a href="https://www.facebook.com/ethanecom3979" target="_blank" rel="noopener">Facebook</a>
      </div>
      <div class="ft-copy">
        © 2017–2026 Ethan Ecom · Công Ty TNHH MTV Phát Triển Công Nghệ Ethan. All rights reserved.
      </div>
    </div>

  </div>
</footer>`;
}

/* ── INJECT COMPONENTS ── */
function injectComponents() {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.innerHTML = buildHeader();
  if (footerSlot) footerSlot.innerHTML = buildFooter();
}

/* ── ACTIVE NAV LINK ── */
function setActiveNav() {
  // Chuẩn hoá về "slug" không đuôi để khớp cả URL sạch (/gioi-thieu) lẫn /x.html
  // vd: "/gioi-thieu" → "gioi-thieu", "/dich-vu" → "services", "/" → "index"
  const norm = s => ((s || '').split('/').pop().split('#')[0].split('?')[0]
                      .replace(/\.html$/, '') || 'index');
  const path = norm(window.location.pathname);
  document.querySelectorAll('.nav a, .mob-nav a').forEach(a => {
    if (norm(a.getAttribute('href')) === path) {
      a.classList.add('active');
    }
  });
}

/* ── HEADER SCROLL + THEME DETECTION ── */
function initHeader() {
  const hdr = document.getElementById('hdr');
  const btt = document.getElementById('btt');
  if (!hdr) return;

  /* Detect if page starts on a dark background (hero sections) */
  const hero = document.querySelector('.hero, .page-hero');
  const smh = document.querySelector('.smh');
  /* A light .smh scroll-morph section sitting ABOVE any dark hero → page starts on light bg */
  const smhFirst = !!smh && (!hero || (smh.compareDocumentPosition(hero) & Node.DOCUMENT_POSITION_FOLLOWING));
  const isDarkHero = !smhFirst && hero && !document.body.classList.contains('light-header');
  /* Opt-in theo trang (body.header-always-dark): header luôn dùng style tối
     giống trang chủ, bỏ qua auto-detect nền sáng/tối (vd: tuyen-dung) */
  const alwaysDark = document.body.classList.contains('header-always-dark');
  if (alwaysDark || isDarkHero) {
    hdr.classList.add('on-dark');
  } else {
    hdr.classList.add('on-light');
  }

  /* Opt-in theo trang (body.header-reveal-on-scroll): ẩn header khi ở top,
     chỉ hiện ra khi người dùng cuộn xuống (vd: tuyen-dung) */
  const revealOnScroll = document.body.classList.contains('header-reveal-on-scroll');

  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const scrolled = y > 40;
      const scrolledDown = y > lastY && y > 120;   // đang kéo xuống, đã qua 120px
      const scrolledUp   = y < lastY - 8;           // kéo lên ít nhất 8px

      hdr.classList.toggle('scrolled', scrolled);
      if (btt) btt.classList.toggle('show', y > 300);

      /* Light .smh at top: dark-text header over it, switch to light-text once past it */
      if (smhFirst && !alwaysDark) {
        const overLight = smh.getBoundingClientRect().bottom > 80;
        hdr.classList.toggle('on-light', overLight);
        hdr.classList.toggle('on-dark', !overLight);
      }

      /* When on a dark hero and user scrolls past it */
      if (isDarkHero && hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        hdr.classList.toggle('past-hero', heroBottom < 0);
      }

      if (revealOnScroll) {
        /* Ẩn ở top, hiện khi đã cuộn xuống — và giữ hiện suốt */
        hdr.classList.toggle('nav-hidden', y <= 60);
      } else {
        /* Hide header khi scroll xuống */
        if (scrolledDown) hdr.classList.add('nav-hidden');

        /* Show header khi scroll lên */
        if (scrolledUp) hdr.classList.remove('nav-hidden');

        /* Ở top trang — luôn hiện header */
        if (y <= 40) hdr.classList.remove('nav-hidden');
      }

      lastY = y;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── SKIP-TO-CONTENT LINK ──
   Hidden/revealed via inline styles so it works even if a cached
   stylesheet lacks the .skip-link rule (no stale-CSS flash). */
function initSkipLink() {
  const sk = document.querySelector('.skip-link');
  if (!sk) return;
  const HIDDEN = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;';
  const SHOWN  = 'position:absolute;left:12px;top:10px;z-index:2000;width:auto;height:auto;'
              + 'background:#0F2244;color:#fff;padding:12px 20px;border-radius:0 0 8px 0;'
              + "font-family:'Be Vietnam Pro',sans-serif;font-weight:700;font-size:15px;box-shadow:0 6px 20px rgba(0,0,0,.35);";
  sk.style.cssText = HIDDEN;
  sk.addEventListener('focus', () => { sk.style.cssText = SHOWN; });
  sk.addEventListener('blur',  () => { sk.style.cssText = HIDDEN; });
}

/* ── HAMBURGER MENU ── */
function initHamburger() {
  const hbg = document.getElementById('hbg');
  const mob = document.getElementById('mob');
  if (!hbg || !mob) return;

  function openMenu() {
    mob.classList.add('open');
    mob.setAttribute('aria-hidden', 'false');
    hbg.classList.add('open');
    hbg.setAttribute('aria-expanded', 'true');
    hbg.setAttribute('aria-label', 'Đóng menu');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('mob-open');
    /* Move keyboard focus into the menu */
    const first = mob.querySelector('a');
    if (first) setTimeout(() => first.focus(), 60);
  }

  function closeMenu(returnFocus) {
    mob.classList.remove('open');
    mob.setAttribute('aria-hidden', 'true');
    hbg.classList.remove('open');
    hbg.setAttribute('aria-expanded', 'false');
    hbg.setAttribute('aria-label', 'Mở menu');
    document.body.style.overflow = '';
    document.body.classList.remove('mob-open');
    if (returnFocus) hbg.focus();
  }

  hbg.addEventListener('click', () => {
    mob.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Keyboard: hamburger is a div[role=button] — support Enter/Space */
  hbg.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      mob.classList.contains('open') ? closeMenu(true) : openMenu();
    }
  });

  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));

  /* Close on Escape — return focus to the toggle */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mob.classList.contains('open')) closeMenu(true);
  });

  /* Close when clicking backdrop (outside links) */
  mob.addEventListener('click', e => {
    if (e.target === mob) closeMenu();
  });

  /* Resize về desktop (>1024px) khi menu đang mở → tự đóng, trả lại body scroll */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mob.classList.contains('open')) closeMenu(false);
  });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  if (!('IntersectionObserver' in window)) return; // không IO thì đừng ẩn nội dung
  document.body.classList.add('will-animate');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── COUNTER ANIMATION (noop — handled by gsap-animations.js glitch counter) ── */
function initCounters() {
  const nums = document.querySelectorAll('.eco-num[data-n]');
  if (!nums.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finalText = el => (el.dataset.n + (el.dataset.s || ''));
  if (reduce || !('IntersectionObserver' in window)) {
    nums.forEach(el => { el.textContent = finalText(el); });
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; obs.unobserve(el);
      const end = parseInt(el.dataset.n, 10) || 0;
      const suf = el.dataset.s || '';
      const dur = 1500; let t0 = null;
      const step = ts => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4); // easeOutQuart
        el.textContent = Math.round(end * ease) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => { el.textContent = '0' + (el.dataset.s || ''); obs.observe(el); });
}

/* ── SKILL BAR FILL + PERCENT COUNT-UP (chạy song song thanh bar) ── */
function initSkillBars() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.w, 10) || 0;
      e.target.style.width = target + '%';
      const skillEl = e.target.closest('.skill');
      if (skillEl) setTimeout(() => skillEl.classList.add('animated'), 100);
      // Đếm số % lên đồng bộ với bar (~1.4s, khớp transition width)
      const pct = skillEl && skillEl.querySelector('.skill-pct');
      if (pct) {
        if (reduce) { pct.textContent = target + '%'; }
        else {
          const start = performance.now(), dur = 1400;
          const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            pct.textContent = Math.round(eased * target) + '%';
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill[data-w]').forEach(el => obs.observe(el));
}

/* ── SLIDING PILL cho filter tab (Portfolio / lọc bộ phận) ── */
function initFilterPills() {
  document.querySelectorAll('.filter-row, .pill-tabs').forEach(row => {
    const btns = row.querySelectorAll('.fbtn');
    if (btns.length < 2) return;
    row.classList.add('pill-tabs');
    if (getComputedStyle(row).position === 'static') row.style.position = 'relative';
    const ind = document.createElement('span');
    ind.className = 'pill-ind';
    row.insertBefore(ind, row.firstChild);
    const move = el => {
      if (!el) return;
      const r = row.getBoundingClientRect(), b = el.getBoundingClientRect();
      ind.style.width = b.width + 'px';
      ind.style.transform = `translateX(${b.left - r.left + row.scrollLeft}px)`;
      ind.style.opacity = '1';
    };
    const current = () => row.querySelector('.fbtn.active') || btns[0];
    requestAnimationFrame(() => move(current()));
    btns.forEach(b => {
      b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        move(b);
      });
      b.addEventListener('mouseenter', () => move(b));
    });
    row.addEventListener('mouseleave', () => move(current()));
    window.addEventListener('resize', () => move(current()));
  });
}

/* ── TEAM CARD tap-to-reveal (fallback cho touch, hover đã có CSS) ── */
function initTeamReveal() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return;
  document.querySelectorAll('.team-card .team-quote').forEach(q => {
    const card = q.closest('.team-card');
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => card.classList.toggle('is-open'));
  });
}

/* ── BACK TO TOP ── */
function initBackTop() {
  const btt = document.getElementById('btt');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── SMOOTH ANCHOR SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ════════════════════════════════════════════
   PARALLAX ENGINE
   • Hero layers: absolute scrollY-based speed
   • Section images: viewport-relative (clipped by overflow:hidden)
   • Floating shapes: section-relative
   • Disabled when prefers-reduced-motion is set
   • Mobile: hero-only at 50% strength
   ════════════════════════════════════════════ */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isMobile = () => window.innerWidth < 768;

  /* Hero (homepage) elements */
  const heroBg    = document.getElementById('heroBg');
  const heroDots  = document.getElementById('heroDots');
  const orb1      = document.getElementById('orb1');
  const orb2      = document.getElementById('orb2');
  const orb3      = document.getElementById('orb3');
  const orb4      = document.getElementById('orb4');
  const heroInner = document.querySelector('.hero-inner');

  /* Inner-page hero elements */
  const pgDots = document.querySelector('.page-hero-dots');
  const pgOrbs = document.querySelectorAll('.page-hero-orb');

  /* Section images (overflow:hidden containers clip excess) */
  const sectionImgs = Array.from(document.querySelectorAll('[data-px]'))
    .filter(el => !el.classList.contains('section-float'));

  /* Floating decorative shapes */
  const floats = Array.from(document.querySelectorAll('.section-float[data-px]'));

  let smoothY = window.scrollY;
  let rafId = null;
  let ticking = false;

  const lerp = (a, b, t) => a + (b - a) * t;
  const ty   = (el, y)   => { if (el) el.style.transform = `translateY(${y.toFixed(2)}px)`; };

  function applyParallax(sy) {
    const vh  = window.innerHeight;
    const mob = isMobile();

    /* ── Skip ALL parallax on mobile — saves battery + avoids jank ── */
    if (mob) return;

    /* ── Homepage hero layers ── */
    if (heroBg && sy < vh * 1.8) {
      ty(heroBg,   sy * 0.45);
      ty(heroDots, sy * 0.65);
      if (heroInner) heroInner.style.transform = `translateY(${(sy * -0.08).toFixed(2)}px)`;
      ty(orb1, sy * 0.28);
      ty(orb2, sy * -0.22);
      ty(orb3, sy * 0.18);
      ty(orb4, sy * 0.35);
    }

    /* ── Inner-page hero ── */
    if (pgDots && sy < vh * 1.5) {
      ty(pgDots, sy * 0.5);
      pgOrbs.forEach((orb, i) => ty(orb, sy * (0.2 + i * 0.12)));
    }

    /* ── Section images ── */
    sectionImgs.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return;
      const speed    = parseFloat(el.dataset.px) || 0.2;
      const progress = 1 - rect.top / (vh + rect.height);
      const offset   = (progress - 0.5) * rect.height * speed * 1.6;
      ty(el, offset);
    });

    /* ── Floating shapes ── */
    floats.forEach(el => {
      const rect    = el.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const speed   = parseFloat(el.dataset.px) || 0.15;
      const section = el.closest('section, [class*="stats"]');
      const sRect   = section ? section.getBoundingClientRect() : rect;
      ty(el, -(sRect.top + sRect.height / 2 - vh / 2) * speed);
    });
  }

  function tick() {
    smoothY = lerp(smoothY, window.scrollY, 0.12);
    applyParallax(smoothY);
    rafId = (Math.abs(smoothY - window.scrollY) > 0.1)
      ? requestAnimationFrame(tick)
      : null;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (isMobile() && heroInner) heroInner.style.transform = '';
  }, { passive: true });

  applyParallax(window.scrollY);
}

/* ── NAV MAGNETIC + RIPPLE EFFECTS ── */
function initNavEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const nav = document.getElementById('mainNav');
  if (!nav) return;

  /* Ripple on nav link click */
  nav.querySelectorAll('a:not(.nav-cta)').forEach(link => {
    link.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(34,211,238,.25);
        transform:scale(0);
        animation:nav-ripple .55s linear;
        pointer-events:none;
        width:80px; height:80px;
        top:${e.clientY - rect.top - 40}px;
        left:${e.clientX - rect.left - 40}px;
      `;
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* Magnetic pull on CTA button */
  const cta = nav.querySelector('.nav-cta');
  if (cta) {
    cta.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      this.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
    cta.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  }
}

/* ── HEADER INDICATOR LINE (sliding pill under active item) ── */
function initNavIndicator() {
  const nav = document.getElementById('mainNav');
  if (!nav || window.innerWidth < 768) return;

  const active = nav.querySelector('a.active:not(.nav-cta)');
  if (!active) return;

  const indicator = document.createElement('span');
  indicator.style.cssText = `
    position:absolute;
    bottom:0; height:2px;
    background:linear-gradient(90deg,#22d3ee,#818cf8);
    border-radius:2px;
    box-shadow:0 0 8px rgba(34,211,238,.6);
    transition:left .3s cubic-bezier(.4,0,.2,1),
               width .3s cubic-bezier(.4,0,.2,1),
               opacity .3s;
    pointer-events:none;
    opacity:0;
  `;
  nav.style.position = 'relative';
  nav.appendChild(indicator);

  function moveTo(el) {
    const navRect = nav.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    const left    = elRect.left - navRect.left + 14;
    const width   = elRect.width - 28;
    indicator.style.left    = left + 'px';
    indicator.style.width   = width + 'px';
    indicator.style.opacity = '1';
  }

  moveTo(active);

  nav.querySelectorAll('a:not(.nav-cta)').forEach(a => {
    a.addEventListener('mouseenter', () => moveTo(a));
    a.addEventListener('mouseleave', () => active ? moveTo(active) : (indicator.style.opacity = '0'));
  });
}

/* ── CURSOR FX — bông hoa vàng xoè ra sau con trỏ khi hover phần tử bấm được.
   Giữ nguyên mũi tên chuột gốc (mũi tên nằm trên bông hoa như thiết kế tham khảo).
   Chỉ chạy trên thiết bị có chuột thật (hover + pointer:fine), bỏ qua reduced-motion. ── */
function initCursorFx() {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fx = document.createElement('div');
  fx.className = 'cursor-fx';
  fx.setAttribute('aria-hidden', 'true');
  /* Vòng la bàn mảnh (xanh) + sao 4 cánh kim chỉ nam (vàng) — nautical, tối giản */
  fx.innerHTML =
    `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#2B8FFF" stroke-width="2.5" opacity=".9"/>
      <g stroke="#2B8FFF" stroke-width="2.5" stroke-linecap="round" opacity=".9">
        <line x1="50" y1="13" x2="50" y2="23"/>
        <line x1="50" y1="77" x2="50" y2="87"/>
        <line x1="13" y1="50" x2="23" y2="50"/>
        <line x1="77" y1="50" x2="87" y2="50"/>
      </g>
      <path d="M50 31 L55.5 44.5 L69 50 L55.5 55.5 L50 69 L44.5 55.5 L31 50 L44.5 44.5 Z" fill="#F4B41A"/>
    </svg>`;
  document.body.appendChild(fx);

  /* Vị trí dùng thuộc tính translate (không transition) — scale/opacity transition riêng */
  document.addEventListener('mousemove', e => {
    fx.style.translate = e.clientX + 'px ' + e.clientY + 'px';
  }, { passive: true });

  const HOT = 'a,button,[role="button"],input[type="submit"],input[type="button"],label[for],summary';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOT)) fx.classList.add('is-on');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOT) && !(e.relatedTarget && e.relatedTarget.closest(HOT))) {
      fx.classList.remove('is-on');
    }
  }, { passive: true });
  /* nhấn xuống: hoa nhún nhẹ */
  document.addEventListener('mousedown', () => fx.classList.add('is-press'));
  document.addEventListener('mouseup', () => fx.classList.remove('is-press'));
}

/* ── BOOTSTRAP — runs after DOM is ready ── */
document.addEventListener('DOMContentLoaded', () => {
  injectComponents();
  setActiveNav();
  initSkipLink();
  initHeader();
  initHamburger();
  initReveal();
  initCounters();
  initSkillBars();
  initFilterPills();
  initTeamReveal();
  initBackTop();
  initSmoothScroll();
  initParallax();
  initCursorFx();
  /* minimalist header — nav ripple + sliding glow indicator removed */
});
