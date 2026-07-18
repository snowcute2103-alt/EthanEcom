/* ================================================================
   ETHAN ECOM — Shared JavaScript
   Injected into every page. Handles: Header/Footer HTML injection,
   active nav detection, scroll animations, counter, parallax.
   ================================================================ */

/* ── NAV PAGES (single source of truth) ── */
const NAV_LINKS = [
  { href: 'index.html',     label: 'Trang chủ',   icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: 'about.html',     label: 'Giới thiệu',  icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
  { href: 'portfolio.html', label: 'Portfolio',    icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
  { href: 'blog.html',      label: 'Câu chuyện',   icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' },
  { href: 'careers.html',   label: 'Tuyển dụng',  icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
];

/* ── BUILD HEADER HTML ── */
function buildHeader() {
  /* Logo ở chính giữa: 3 mục bên trái, 3 mục bên phải (Liên hệ khép cuối). */
  const leftItems = NAV_LINKS.slice(0, 3).map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');
  const rightItems = NAV_LINKS.slice(3).map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('') + `<a href="contact.html">Liên hệ</a>`;
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
    <a href="index.html" class="logo">
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
  <a href="contact.html">Liên hệ →</a>
</nav>
`;
}

/* ── BUILD FOOTER HTML ── */
function buildFooter() {
  const tickerItems = [
    'Cross-border E-commerce', 'Print On Demand', 'Thêu công nghiệp',
    'TikTok Shop US', 'Etsy', 'Amazon', 'eBay',
    'In giấy & Nhựa 3D', 'Tự chủ sản xuất', 'Đồng lòng đồng sức',
    'Bứt phá gặt thành công', 'Made in Đồng Nai',
  ];
  const tickerHTML = [...tickerItems, ...tickerItems].map(t =>
    `<span class="foot-ticker-item"><span class="foot-ticker-sep"></span>${t}</span>`
  ).join('');

  return `
<footer class="footer">

  <!-- Aurora bg -->
  <div class="foot-aurora" aria-hidden="true">
    <div class="foot-orb-1"></div>
    <div class="foot-orb-2"></div>
    <div class="foot-orb-3"></div>
    <div class="foot-dots"></div>
    <div class="foot-scan"></div>
  </div>

  <!-- Ticker marquee -->
  <div class="foot-ticker-wrap">
    <div class="foot-ticker-track">${tickerHTML}</div>
  </div>

  <!-- Main content -->
  <div class="foot-main">
    <div class="container">
      <div class="foot-grid">

        <!-- Brand -->
        <div class="foot-brand">
          <a href="index.html" class="logo">
            <img src="assets/images/logo.jpg" alt="Ethan Ecom">
          </a>
          <p>Nơi khơi nguồn sáng tạo và hỗ trợ sự phát triển cá nhân. Doanh nghiệp TMĐT xuyên biên giới tự chủ sản xuất — Đồng lòng đồng sức, bứt phá gặt thành công.</p>
          <div class="foot-soc">
            <a class="fsoc fsoc--fb" href="https://facebook.com/ethanecom3979" target="_blank" rel="noopener" aria-label="Facebook">f</a>
            <span class="fsoc" aria-hidden="true" title="Dribbble (sắp ra mắt)">Dr</span>
            <span class="fsoc" aria-hidden="true" title="Twitter (sắp ra mắt)">𝕏</span>
            <span class="fsoc" aria-hidden="true" title="Instagram (sắp ra mắt)">Ig</span>
            <span class="fsoc" aria-hidden="true" title="Behance (sắp ra mắt)">Be</span>
          </div>
          <div class="foot-status">
            <span class="foot-status-dot"></span>
            Đang nhận dự án mới
          </div>
        </div>

        <!-- Nav -->
        <div>
          <h5>Điều hướng</h5>
          <div class="flinks">
            <a href="index.html">Trang chủ</a>
            <a href="about.html">Giới thiệu</a>
            <a href="portfolio.html">Portfolio</a>
            <a href="blog.html">Câu chuyện</a>
            <a href="careers.html">Tuyển dụng</a>
            <a href="contact.html">Liên hệ</a>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h5>Dịch vụ</h5>
          <div class="flinks">
            <a href="services.html">TMĐT xuyên biên giới</a>
            <a href="services.html">Print On Demand (POD)</a>
            <a href="services.html">Thêu công nghiệp</a>
            <a href="services.html">In giấy &amp; Sticker</a>
            <a href="services.html">In nhựa 3D</a>
            <a href="services.html">Digital Marketing</a>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <h5>Liên hệ</h5>
          <div class="fcon">
            <div class="fcon-item">
              <div class="fcon-ico" aria-hidden="true">📍</div>
              <div class="fcon-txt"><h6>Địa chỉ</h6><p>61/1G Võ Dõng, Gia Kiệm, Đồng Nai</p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico" aria-hidden="true">🕐</div>
              <div class="fcon-txt"><h6>Giờ làm việc</h6><p>7:30 – 17:00 · Thứ 2 – Thứ 7</p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico" aria-hidden="true">📨</div>
              <div class="fcon-txt"><h6>Email Tuyển dụng</h6><p><a href="mailto:hr@ethanecom.com">hr@ethanecom.com</a></p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico" aria-hidden="true">📞</div>
              <div class="fcon-txt"><h6>Hotline</h6><p><a href="tel:+84967473979">+84 967 473 979</a></p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico" aria-hidden="true">📘</div>
              <div class="fcon-txt"><h6>Facebook</h6><p><a href="https://facebook.com/ethanecom3979" target="_blank" rel="noopener">facebook.com/ethanecom3979</a></p></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Divider -->
  <div class="foot-divider"></div>

  <!-- Bottom bar -->
  <div class="foot-bot">
    <div class="container">
      <p>© 2017–2026 <a href="index.html">Ethan Ecom</a> — Công Ty TNHH MTV Phát Triển Công Nghệ Ethan. All rights reserved. · Được xây dựng với ❤️ tại Đồng Nai, Việt Nam</p>
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
  // Get current filename (e.g. "about.html" or "" for root)
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mob-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === path || (path === '' && href === 'index.html')) {
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
  if (isDarkHero) {
    hdr.classList.add('on-dark');
  } else {
    hdr.classList.add('on-light');
  }

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
      if (smhFirst) {
        const overLight = smh.getBoundingClientRect().bottom > 80;
        hdr.classList.toggle('on-light', overLight);
        hdr.classList.toggle('on-dark', !overLight);
      }

      /* When on a dark hero and user scrolls past it */
      if (isDarkHero && hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        hdr.classList.toggle('past-hero', heroBottom < 0);
      }

      /* Hide header khi scroll xuống */
      if (scrolledDown) hdr.classList.add('nav-hidden');

      /* Show header khi scroll lên */
      if (scrolledUp) hdr.classList.remove('nav-hidden');

      /* Ở top trang — luôn hiện header */
      if (y <= 40) hdr.classList.remove('nav-hidden');

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
}

/* ── SCROLL REVEAL ── */
function initReveal() {
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
  /* minimalist header — nav ripple + sliding glow indicator removed */
});
