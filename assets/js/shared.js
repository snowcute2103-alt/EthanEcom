/* ================================================================
   ETHAN ECOM — Shared JavaScript
   Injected into every page. Handles: Header/Footer HTML injection,
   active nav detection, scroll animations, counter, parallax.
   ================================================================ */

/* ── NAV PAGES (single source of truth) ── */
const NAV_LINKS = [
  { href: 'index.html',     label: 'Trang chủ',   icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: 'about.html',     label: 'Về chúng tôi',icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
  { href: 'portfolio.html', label: 'Portfolio',    icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
  { href: 'blog.html',      label: 'Câu chuyện',   icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' },
  { href: 'careers.html',   label: 'Tuyển dụng',  icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
];

/* ── BUILD HEADER HTML ── */
function buildHeader() {
  const navItems = NAV_LINKS.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');
  const mobItems = NAV_LINKS.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  return `
<header class="header" id="hdr">
  <div class="hdr-line"></div>
  <div class="hi">
    <a href="index.html" class="logo">
      <img src="assets/images/logo.jpg" alt="Ethan Ecom">
    </a>
    <nav class="nav" id="mainNav">
      ${navItems}
      <a href="contact.html" class="nav-cta">Liên hệ</a>
    </nav>
    <div class="hamburger" id="hbg" aria-label="Menu" role="button" aria-expanded="false">
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
    'E-commerce Solutions', 'Web Development', 'UI/UX Design',
    'Digital Marketing', 'Motion Graphics', 'TikTok Shop',
    'Amazon & Etsy', 'Graphic Design', 'Video Production',
    'Tech Optimization', 'Photography', 'Brand Identity',
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
          <p>Nơi hàng Việt vươn tầm thế giới qua thiết kế đỉnh cao và công nghệ thực chiến. Đồng lòng đồng sức, bứt phá gặt thành công.</p>
          <div class="foot-soc">
            <a class="fsoc" href="#" aria-label="Dribbble">Dr</a>
            <a class="fsoc" href="#" aria-label="Twitter">𝕏</a>
            <a class="fsoc" href="#" aria-label="Instagram">Ig</a>
            <a class="fsoc" href="#" aria-label="Behance">Be</a>
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
            <a href="about.html">Về chúng tôi</a>
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
            <a href="careers.html#services">Web Development</a>
            <a href="careers.html#services">UI/UX Design</a>
            <a href="careers.html#services">Graphic Design</a>
            <a href="careers.html#services">Motion Graphics</a>
            <a href="careers.html#services">E-com Solutions</a>
            <a href="careers.html#services">Digital Marketing</a>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <h5>Liên hệ</h5>
          <div class="fcon">
            <div class="fcon-item">
              <div class="fcon-ico">📍</div>
              <div class="fcon-txt"><h6>Địa chỉ</h6><p>Võ Dõng - Thống Nhất - Đồng Nai</p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico">🕐</div>
              <div class="fcon-txt"><h6>Giờ làm việc</h6><p>7:30 – 17:00 · Thứ 2 – Thứ 7</p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico">📧</div>
              <div class="fcon-txt"><h6>Email CSKH</h6><p>support@ethanecom.com</p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico">📨</div>
              <div class="fcon-txt"><h6>Email Tuyển dụng</h6><p>hr@ethanecom.com</p></div>
            </div>
            <div class="fcon-item">
              <div class="fcon-ico">📞</div>
              <div class="fcon-txt"><h6>Phone</h6><p>+84 967 473 979</p></div>
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
      <p>© 2025 <a href="index.html">Ethan Ecom</a>. All rights reserved. · Được xây dựng với ❤️ tại Việt Nam</p>
    </div>
  </div>

</footer>
<button class="btt" id="btt" aria-label="Về đầu trang">↑</button>`;
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
  const isDarkHero = hero && !document.body.classList.contains('light-header');
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
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mob.classList.remove('open');
    mob.setAttribute('aria-hidden', 'true');
    hbg.classList.remove('open');
    hbg.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hbg.addEventListener('click', () => {
    mob.classList.contains('open') ? closeMenu() : openMenu();
  });

  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mob.classList.contains('open')) closeMenu();
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
function initCounters() {}

/* ── SKILL BAR FILL ── */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        const skillEl = e.target.closest('.skill');
        if (skillEl) setTimeout(() => skillEl.classList.add('animated'), 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill[data-w]').forEach(el => obs.observe(el));
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
  initHeader();
  initHamburger();
  initReveal();
  initCounters();
  initSkillBars();
  initBackTop();
  initSmoothScroll();
  initParallax();
  initNavEffects();
  initNavIndicator();
});
