/* ================================================================
   ETHAN ECOM — Page-Specific Advanced Animations
   Loaded by: about.html, services.html, portfolio.html,
              blog.html, contact.html

   Effects:
     • Magnetic buttons
     • Mouse-tracking spotlight on cards
     • Typed text headline cycling
     • Parallax tilt on hover cards
     • Particle canvas background
     • Number odometer / glitch counter
     • Cursor custom glow
     • Scroll progress bar
     • Staggered letter reveal
     • SVG path draw
     • Ripple click on buttons
     • Timeline dot activation
   ================================================================ */

(function () {
  'use strict';

  /* ── prefers-reduced-motion guard ── */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── mobile guard (< 768px) — skip heavy GPU effects ── */
  var isMobile = window.innerWidth < 768;

  /* ── UTIL ── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };

  /* ════════════════════════════════════════════
     1. SCROLL PROGRESS BAR
  ════════════════════════════════════════════ */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'height:3px', 'z-index:9999',
      'background:linear-gradient(90deg,#00D4FF,#7B61FF,#F5A623)',
      'width:0%', 'transition:width .1s linear',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0).toFixed(2) + '%';
    }, { passive: true });
  }

  /* ════════════════════════════════════════════
     2. CUSTOM CURSOR GLOW (desktop only)
  ════════════════════════════════════════════ */
  function initCursorGlow() {
    if (window.innerWidth < 1024 || reduced) return;
    var dot = document.createElement('div');
    dot.id = 'pg-cursor';
    dot.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:9998',
      'width:18px', 'height:18px', 'border-radius:50%',
      'background:radial-gradient(circle, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 70%)',
      'transform:translate(-50%,-50%)',
      'top:0', 'left:0', 'opacity:0',
      'transition:opacity .25s',
    ].join(';');
    document.body.appendChild(dot);

    document.addEventListener('mousemove', function (e) {
      dot.style.opacity = '1';
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
    });
  }

  /* ════════════════════════════════════════════
     3. MAGNETIC BUTTONS
  ════════════════════════════════════════════ */
  function initMagneticButtons() {
    if (reduced || window.innerWidth < 768) return;
    $$('.btn, .hero-btn-primary, .hero-btn-ghost').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width  / 2);
        var dy = e.clientY - (r.top  + r.height / 2);
        btn.style.transform = 'translate(' + (dx * 0.22).toFixed(2) + 'px,' + (dy * 0.22).toFixed(2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ════════════════════════════════════════════
     4. RIPPLE CLICK EFFECT ON BUTTONS
  ════════════════════════════════════════════ */
  function initRipple() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn, .fbtn, .proc-num, .nav-cta');
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(r.width, r.height) * 2;
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'background:rgba(255,255,255,.35)',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + (e.clientX - r.left - size / 2) + 'px',
        'top:' + (e.clientY - r.top  - size / 2) + 'px',
        'transform:scale(0)',
        'animation:pg-ripple .55s linear forwards',
        'pointer-events:none',
      ].join(';');
      var style = btn.style.position;
      if (!style || style === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });

    /* inject keyframe once */
    if (!document.getElementById('pg-ripple-style')) {
      var s = document.createElement('style');
      s.id = 'pg-ripple-style';
      s.textContent = '@keyframes pg-ripple{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(s);
    }
  }

  /* ════════════════════════════════════════════
     5. CARD 3D TILT ON HOVER
  ════════════════════════════════════════════ */
  function initCardTilt() {
    if (reduced || isMobile) return;
    var TILT_MAX = 10;
    var selectors = [
      '.val-card', '.dept-card', '.plat-card',
      '.srv-detail-card', '.case-card', '.featured-post',
      '.sidebar-card', '.info-card',
    ];
    $$(selectors.join(',')).forEach(function (card) {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var x  = e.clientX - r.left;
        var y  = e.clientY - r.top;
        var cx = r.width  / 2;
        var cy = r.height / 2;
        var rx = clamp(((y - cy) / cy) * -TILT_MAX, -TILT_MAX, TILT_MAX);
        var ry = clamp(((x - cx) / cx) *  TILT_MAX, -TILT_MAX, TILT_MAX);
        card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(8px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ════════════════════════════════════════════
     6. MOUSE SPOTLIGHT ON DARK CARDS
  ════════════════════════════════════════════ */
  function initSpotlight() {
    if (isMobile) return;
    var selectors = [
      '.section--blue .val-card',
      '.section--blue .dept-card',
      '.section--blue .stat',
      '.newsletter',
    ];
    $$(selectors.join(',')).forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
        var y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
        card.style.background = 'radial-gradient(circle at ' + x + ' ' + y + ', rgba(0,212,255,.07) 0%, transparent 55%)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.background = '';
      });
    });
  }

  /* ════════════════════════════════════════════
     7. FLOATING PARTICLES CANVAS (page-hero sections)
  ════════════════════════════════════════════ */
  function initParticles() {
    if (reduced || isMobile) return;
    var hero = $('.page-hero');
    if (!hero) return;

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.55';
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext('2d');
    var W, H, particles;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35,
        alpha: 0.15 + Math.random() * 0.45,
        color: Math.random() > 0.6 ? '#00D4FF' : (Math.random() > 0.5 ? '#7B61FF' : '#F5A623'),
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 55 }, mkParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0008;

        if (p.y < -10 || p.alpha <= 0.02) {
          Object.assign(p, mkParticle(), { y: H + 10 });
        }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    init();
    draw();
  }

  /* ════════════════════════════════════════════
     8. TYPED / CYCLING TEXT
  ════════════════════════════════════════════ */
  function initTypedText() {
    var el = $('.page-hero-typed');
    if (!el || reduced || isMobile) return;
    var words = (el.dataset.words || '').split('|').map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length < 2) return;

    var idx = 0;
    var charIdx = 0;
    var deleting = false;
    var pause = 0;

    el.style.borderRight = '2px solid #00D4FF';
    el.style.paddingRight = '3px';
    el.style.display = 'inline-block';

    function tick() {
      var word = words[idx];
      if (pause > 0) { pause--; setTimeout(tick, 60); return; }

      if (!deleting) {
        el.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) { pause = 28; deleting = true; }
        setTimeout(tick, 90 + Math.random() * 40);
      } else {
        el.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          idx = (idx + 1) % words.length;
        }
        setTimeout(tick, 45);
      }
    }
    tick();
  }

  /* ════════════════════════════════════════════
     9. STAGGERED LETTER REVEAL ON HEADINGS
  ════════════════════════════════════════════ */
  function initLetterReveal() {
    if (reduced || isMobile) return;
    $$('.letter-reveal').forEach(function (el) {
      var text = el.textContent;
      el.textContent = '';
      el.style.display = 'inline-block';
      text.split('').forEach(function (ch, i) {
        var span = document.createElement('span');
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.cssText = [
          'display:inline-block',
          'opacity:0',
          'transform:translateY(24px) rotate(' + (Math.random() * 8 - 4).toFixed(1) + 'deg)',
          'transition:opacity .5s cubic-bezier(.4,0,.2,1) ' + (i * 0.035).toFixed(3) + 's,transform .5s cubic-bezier(.4,0,.2,1) ' + (i * 0.035).toFixed(3) + 's',
        ].join(';');
        el.appendChild(span);
      });

      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          $$('span', el).forEach(function (s) {
            s.style.opacity = '1';
            s.style.transform = 'none';
          });
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      obs.observe(el);
    });
  }

  /* ════════════════════════════════════════════
     10. TIMELINE DOT ACTIVATION
  ════════════════════════════════════════════ */
  function initTimeline() {
    var dots = $$('.tl-dot');
    if (!dots.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('lit');
      });
    }, { threshold: 0.5 });
    dots.forEach(function (d) { obs.observe(d); });
  }

  /* ════════════════════════════════════════════
     11. PORTFOLIO FILTER ANIMATION
  ════════════════════════════════════════════ */
  function initPortfolioFilter() {
    var btns = $$('.fbtn');
    var items = $$('.port-item');
    if (!btns.length || !items.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var cat = btn.dataset.cat || 'all';
        items.forEach(function (item) {
          var match = cat === 'all' || item.dataset.cat === cat;
          item.style.transition = 'opacity .35s cubic-bezier(.4,0,.2,1), transform .35s cubic-bezier(.4,0,.2,1)';
          if (match) {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.pointerEvents = '';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(.93)';
            item.style.pointerEvents = 'none';
          }
        });
      });
    });
  }

  /* ════════════════════════════════════════════
     12. FAQ ACCORDION
  ════════════════════════════════════════════ */
  function initFAQ() {
    $$('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;

      a.style.cssText = 'max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.4,0,.2,1),opacity .35s;opacity:0;display:block;padding-bottom:0';

      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        $$('.faq-item.open').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            var oa = other.querySelector('.faq-a');
            if (oa) { oa.style.maxHeight = '0'; oa.style.opacity = '0'; }
          }
        });
        if (open) {
          item.classList.remove('open');
          a.style.maxHeight = '0';
          a.style.opacity = '0';
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          a.style.opacity = '1';
        }
      });
    });
  }

  /* ════════════════════════════════════════════
     13. COUNTER ANIMATION (fallback for pages
         that don't load gsap-animations.js)
  ════════════════════════════════════════════ */
  function initCounters() {
    if (typeof gsap !== 'undefined') return; /* GSAP handles it on index.html */
    if (reduced) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el  = e.target;
        var end = parseInt(el.dataset.n, 10);
        var suf = el.dataset.s || '';
        var start = 0;
        var dur = 1400;
        var t0  = null;
        obs.unobserve(el);

        function step(ts) {
          if (!t0) t0 = ts;
          var prog = Math.min((ts - t0) / dur, 1);
          /* ease out quart */
          var ease = 1 - Math.pow(1 - prog, 4);
          el.textContent = Math.round(start + (end - start) * ease) + suf;
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    $$('.stat-num[data-n]').forEach(function (el) { obs.observe(el); });
  }

  /* ════════════════════════════════════════════
     14. PROCESS STEP NUMBER HOVER
  ════════════════════════════════════════════ */
  function initProcessSteps() {
    if (isMobile) return;
    $$('.proc-step').forEach(function (step) {
      var num = step.querySelector('.proc-num');
      if (!num) return;
      step.addEventListener('mouseenter', function () {
        num.style.transform = 'scale(1.18) rotate(-6deg)';
        num.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
      });
      step.addEventListener('mouseleave', function () {
        num.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  /* ════════════════════════════════════════════
     15. CONTACT FORM — FLOATING LABELS
  ════════════════════════════════════════════ */
  function initFloatingLabels() {
    $$('.form-group input, .form-group textarea, .form-group select').forEach(function (inp) {
      var label = inp.closest('.form-group')
        ? inp.closest('.form-group').querySelector('label')
        : null;
      if (!label) return;

      function update() {
        var filled = inp.value.length > 0 || document.activeElement === inp;
        label.style.transition = 'all .25s cubic-bezier(.4,0,.2,1)';
        if (filled) {
          label.style.transform = 'translateY(-22px) scale(.82)';
          label.style.color = '#1D3251';
        } else {
          label.style.transform = '';
          label.style.color = '';
        }
      }
      inp.addEventListener('focus',  update);
      inp.addEventListener('blur',   update);
      inp.addEventListener('input',  update);
      update();
    });
  }

  /* ════════════════════════════════════════════
     16. PLATFORM / VALUE CARDS — GLOW BORDER
  ════════════════════════════════════════════ */
  function initGlowBorder() {
    if (isMobile) return;
    $$('.plat-card, .dept-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var x  = e.clientX - r.left;
        var y  = e.clientY - r.top;
        card.style.setProperty('--gx', x + 'px');
        card.style.setProperty('--gy', y + 'px');
        card.style.boxShadow = 'inset 0 0 0 1.5px rgba(0,212,255,.35), 0 12px 36px rgba(29,50,81,.12)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.boxShadow = '';
      });
    });
  }

  /* ════════════════════════════════════════════
     17. BLOG CARD — IMAGE ZOOM ON HOVER
  ════════════════════════════════════════════ */
  function initBlogImageZoom() {
    if (isMobile) return;
    $$('.bcard .bthumb .img-ph img, .featured-post .feat-thumb .img-ph img').forEach(function (img) {
      var wrap = img.closest('.bcard') || img.closest('.featured-post');
      if (!wrap) return;
      wrap.addEventListener('mouseenter', function () {
        img.style.transition = 'transform .65s cubic-bezier(.4,0,.2,1)';
        img.style.transform = 'scale(1.08)';
      });
      wrap.addEventListener('mouseleave', function () {
        img.style.transform = 'scale(1)';
      });
    });
  }

  /* ════════════════════════════════════════════
     18. SECTION HEADER DIVIDER GROW ANIMATION
  ════════════════════════════════════════════ */
  function initDividerGrow() {
    if (reduced) return;
    $$('.divider').forEach(function (div) {
      div.style.width = '0';
      div.style.transition = 'width .7s cubic-bezier(.4,0,.2,1)';
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          div.style.width = '48px';
          obs.disconnect();
        }
      }, { threshold: 0.8 });
      obs.observe(div);
    });
  }

  /* ════════════════════════════════════════════
     19. AVATAR CARD SHINE SWEEP
  ════════════════════════════════════════════ */
  function initAvatarShine() {
    if (isMobile) return;
    $$('.team-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        var av = card.querySelector('.ph-avatar');
        if (!av) return;
        av.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1), border-color .3s';
        av.style.transform = 'scale(1.1) rotate(3deg)';
      });
      card.addEventListener('mouseleave', function () {
        var av = card.querySelector('.ph-avatar');
        if (!av) return;
        av.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  /* ════════════════════════════════════════════
     20. SCROLL-TRIGGERED SECTION BG PARALLAX BLOBS
  ════════════════════════════════════════════ */
  function initBlobParallax() {
    if (reduced || isMobile) return;
    var style = document.createElement('style');
    style.textContent = [
      '.pg-blob{position:absolute;border-radius:50%;pointer-events:none;will-change:transform}',
    ].join('');
    document.head.appendChild(style);

    var blobs = [];
    $$('.section--gray, .section').forEach(function (sec, i) {
      if (i % 2 !== 0) return;
      sec.style.position = 'relative';
      sec.style.overflow = 'hidden';
      var blob = document.createElement('div');
      var colors = [
        'rgba(29,50,81,.04)', 'rgba(0,212,255,.03)',
        'rgba(123,97,255,.03)', 'rgba(245,166,35,.025)',
      ];
      blob.className = 'pg-blob';
      var sz = 300 + Math.random() * 300;
      blob.style.cssText = [
        'width:' + sz + 'px',
        'height:' + sz + 'px',
        'background:radial-gradient(circle,' + colors[i % colors.length] + ' 0%,transparent 70%)',
        'filter:blur(60px)',
        'top:' + (Math.random() * 60) + '%',
        i % 2 === 0 ? 'left:-80px' : 'right:-80px',
      ].join(';');
      sec.appendChild(blob);
      blobs.push({ el: blob, speed: 0.06 + Math.random() * 0.08 });
    });

    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var sy = window.scrollY;
      var dy = sy - lastY;
      blobs.forEach(function (b) {
        var cur = parseFloat(b.el.style.transform.replace('translateY(', '') || '0') || 0;
        b.el.style.transform = 'translateY(' + (cur + dy * b.speed).toFixed(2) + 'px)';
      });
      lastY = sy;
    }, { passive: true });
  }

  /* ════════════════════════════════════════════
     21. CONTACT INFO-CARD — SLIDE IN FROM LEFT
  ════════════════════════════════════════════ */
  function initInfoCardReveal() {
    var cards = $$('.info-card');
    if (!cards.length || reduced) return;
    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-40px)';
      card.style.transition = 'opacity .6s cubic-bezier(.4,0,.2,1) ' + (i * 0.12) + 's, transform .6s cubic-bezier(.4,0,.2,1) ' + (i * 0.12) + 's';
    });
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        cards.forEach(function (card) {
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
        });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    if (cards[0]) obs.observe(cards[0].closest('section') || cards[0]);
  }

  /* ════════════════════════════════════════════
     22. SERVICE CARD NUMBER HOVER COUNTER
  ════════════════════════════════════════════ */
  function initServiceNumHover() {
    if (isMobile) return;
    $$('.srv-detail-card').forEach(function (card) {
      var numEl = card.querySelector('.srv-num');
      if (!numEl) return;
      var orig = numEl.textContent;
      card.addEventListener('mouseenter', function () {
        numEl.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1), background .3s';
        numEl.style.transform = 'scale(1.25) rotate(-8deg)';
        numEl.style.background = 'rgba(0,212,255,.25)';
        numEl.style.color = '#00D4FF';
        numEl.style.borderColor = 'rgba(0,212,255,.4)';
      });
      card.addEventListener('mouseleave', function () {
        numEl.style.transform = '';
        numEl.style.background = '';
        numEl.style.color = '';
        numEl.style.borderColor = '';
        numEl.textContent = orig;
      });
    });
  }

  /* ════════════════════════════════════════════
     23. SOCIAL BUTTON JIGGLE
  ════════════════════════════════════════════ */
  function initSocialJiggle() {
    if (isMobile) return;
    $$('.tsoc, .fsoc, .soc-btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        btn.style.transition = 'transform .2s cubic-bezier(.34,1.56,.64,1)';
        btn.style.transform = 'scale(1.2) rotate(-5deg)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  /* ════════════════════════════════════════════
     24. PORTFOLIO ITEM — TILT + GLARE
  ════════════════════════════════════════════ */
  function initPortTilt() {
    if (reduced || isMobile) return;
    $$('.port-item').forEach(function (item) {
      var glare = document.createElement('div');
      glare.style.cssText = [
        'position:absolute;inset:0;border-radius:inherit',
        'background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.18) 0%,transparent 55%)',
        'opacity:0;pointer-events:none;z-index:5;transition:opacity .3s',
      ].join(';');
      item.appendChild(glare);

      item.addEventListener('mousemove', function (e) {
        var r  = item.getBoundingClientRect();
        var x  = e.clientX - r.left;
        var y  = e.clientY - r.top;
        var rx = clamp(((y - r.height / 2) / r.height) * -8, -8, 8);
        var ry = clamp(((x - r.width  / 2) / r.width ) *  8, -8, 8);
        item.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(12px)';
        glare.style.opacity = '1';
        glare.style.background = 'radial-gradient(circle at ' + (x / r.width * 100).toFixed(1) + '% ' + (y / r.height * 100).toFixed(1) + '%, rgba(255,255,255,.18) 0%, transparent 55%)';
      });
      item.addEventListener('mouseleave', function () {
        item.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateZ(0)';
        item.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
        glare.style.opacity = '0';
        setTimeout(function () { item.style.transition = ''; }, 500);
      });
    });
  }

  /* ════════════════════════════════════════════
     25. PAGE HERO — STAGGERED CHILDREN ENTRANCE
  ════════════════════════════════════════════ */
  function initHeroEntrance() {
    if (reduced) return;
    var inner = $('.page-hero-inner');
    if (!inner) return;
    var dur = isMobile ? '.35s' : '.7s';
    Array.from(inner.children).forEach(function (child, i) {
      var delay = isMobile ? (i * 0.06 + 0.05) : (i * 0.13 + 0.1);
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'opacity ' + dur + ' ease ' + delay + 's, transform ' + dur + ' ease ' + delay + 's';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ════════════════════════════════════════════
     BOOT — run all on DOMContentLoaded
  ════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initCursorGlow();
    initMagneticButtons();
    initRipple();
    initCardTilt();
    initSpotlight();
    initParticles();
    initTypedText();
    initLetterReveal();
    initTimeline();
    initPortfolioFilter();
    initFAQ();
    initCounters();
    initProcessSteps();
    initFloatingLabels();
    initGlowBorder();
    initBlogImageZoom();
    initDividerGrow();
    initAvatarShine();
    initBlobParallax();
    initInfoCardReveal();
    initServiceNumHover();
    initSocialJiggle();
    initPortTilt();
    initHeroEntrance();
  });

})();
