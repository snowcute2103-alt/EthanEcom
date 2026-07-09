/* ================================================================
   ETHAN ECOM — GSAP Scroll & Hover Animations (index.html only)

   Spring physics reference: stiffness:100, damping:10
   Damping ratio ζ = damping / (2 × √stiffness) = 10/(2×10) = 0.5
   → Underdamped spring (visible bounce, settles quickly)

   GSAP approximation:
     Scroll-in : elastic.out(1, 0.5)  — spring bounce on entry
     Hover in  : back.out(2)          — single overshoot, snappy feel
     Hover out : power2.out           — smooth release
   ================================================================ */
(function () {
  'use strict';

  // Bail if GSAP didn't load (CDN failure → CSS fallback handles animations)
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Respect user accessibility preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var isMobile = window.innerWidth < 768;

  gsap.registerPlugin(ScrollTrigger);

  /* ── EASE CONSTANTS ──────────────────────────────────────────────
     elastic.out(amplitude, period)
       amplitude=1 : overshoot exactly equals the animation distance
       period=0.5  : oscillation period 0.5s → matches ζ=0.5 spring
  ─────────────────────────────────────────────────────────────────── */
  var EASE_SPRING  = 'elastic.out(1, 0.5)';
  var EASE_HOVER   = 'back.out(2)';
  var EASE_RELEASE = 'power2.out';

  /* ── STAGGER SCROLL REVEAL ───────────────────────────────────────
     Cards start at opacity:0, y:+N, scale:~0.94
     Then spring into place one by one as the section scrolls in.
  ─────────────────────────────────────────────────────────────────── */
  function springReveal(selector, triggerSelector, overrides) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;

    var defaults = {
      opacity         : 0,
      y               : 48,
      scale           : 0.94,
      duration        : 0.85,
      ease            : EASE_SPRING,
      stagger         : 0.10,
      clearProps      : 'all',
      immediateRender : false,
      scrollTrigger   : {
        trigger            : document.querySelector(triggerSelector),
        start              : 'top 82%',
        once               : true,
        invalidateOnRefresh: true,
      },
    };

    // Merge overrides (shallow, scrollTrigger nested separately)
    var params = Object.assign({}, defaults, overrides || {});
    gsap.from(els, params);
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* ── SCROLL-IN STAGGER ANIMATIONS ──────────────────────────── */

    // Services — 9 cards, 3 columns
    springReveal('.srv-card',  '#services .srv-grid');

    // Stats counter row — shorter y travel, slight scale
    springReveal('.stat',      '.stats-wrap',  { y: 32, scale: 0.96, duration: 0.65 });

    // Portfolio avant-garde list rows
    springReveal('.port-row',  '.port-list',   { y: 36 });

    // Team cards
    springReveal('.team-card', '.team-grid');

    // Testimonial cards — each column as container for stagger
    springReveal('.tcard',     '.testi-col',   { y: 40 });

    // Job cards (3×2 grid)
    springReveal('.jcard',     '.jobs-grid',   { y: 36, scale: 0.96 });

    // Blog cards
    springReveal('.bcard',     '.blog-grid',   { y: 40 });

    // Partner logos — subtle wave left-to-right
    gsap.from('.partner', {
      opacity       : 0,
      y             : 20,
      duration      : 0.5,
      ease          : 'power3.out',
      stagger       : 0.07,
      clearProps    : 'transform',
      scrollTrigger : {
        trigger : document.querySelector('.partners'),
        start   : 'top 90%',
        once    : true,
      },
    });

    /* ── HOVER EFFECTS — desktop only ── */
    if (isMobile) return;

    var hoverMap = [
      { sel: '.srv-card',  yIn: -8, s: 1.05 },
      { sel: '.tcard',     yIn: -7, s: 1.05 },
      { sel: '.jcard',     yIn: -5, s: 1.05 },
      { sel: '.bcard',     yIn: -7, s: 1.05 },
      { sel: '.team-card', yIn: -6, s: 1.04 },
    ];

    hoverMap.forEach(function (cfg) {
      document.querySelectorAll(cfg.sel).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          gsap.to(el, {
            y         : cfg.yIn,
            scale     : cfg.s,
            duration  : 0.40,
            ease      : EASE_HOVER,
            overwrite : 'auto',
          });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, {
            y         : 0,
            scale     : 1,
            duration  : 0.35,
            ease      : EASE_RELEASE,
            overwrite : 'auto',
          });
        });
      });
    });

    /* ── TCARD DARK — mouse spotlight ── */
    document.querySelectorAll('.tcard-dark').forEach(function (card) {
      var spotlight = card.querySelector('.tcard-spotlight');
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        if (spotlight) {
          spotlight.style.background = 'radial-gradient(circle at ' + x + ' ' + y + ', rgba(0,212,255,.08) 0%, transparent 55%)';
        }
      });
    });

    /* ── TESTI SECTION — floating particle dots (desktop only) ── */
    var dotsWrap = !isMobile && document.getElementById('tea-dots');
    if (dotsWrap) {
      for (var i = 0; i < 18; i++) {
        var dot = document.createElement('div');
        dot.className = 'tea-dot';
        dot.style.cssText = [
          'left:'  + (Math.random() * 100).toFixed(1) + '%',
          'top:'   + (Math.random() * 100).toFixed(1) + '%',
          '--dur:' + (6 + Math.random() * 8).toFixed(1) + 's',
          '--del:' + (Math.random() * 8).toFixed(1) + 's',
          'width:' + (Math.random() > 0.6 ? 4 : 2) + 'px',
          'height:'+ (Math.random() > 0.6 ? 4 : 2) + 'px',
          'background:' + (Math.random() > 0.5 ? '#00D4FF' : '#7B61FF'),
        ].join(';');
        dotsWrap.appendChild(dot);
      }
    }


    /* ── STATS — 3D Tilt + Glitch counter ── */
    (function initStats() {
      var cards = document.querySelectorAll('.stat');
      if (!cards.length) return;

      // 3D tilt on mousemove (desktop only)
      if (!isMobile) cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var cx = rect.width  / 2;
          var cy = rect.height / 2;
          var rx = ((y - cy) / cy) * -14;
          var ry = ((x - cx) / cx) *  14;
          card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.04,1.04,1.04)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        });
      });

      // Glitch counter — replaces existing simple counter
      function glitchCount(el) {
        var endVal  = parseInt(el.dataset.n, 10);
        var suffix  = el.dataset.s || '';
        var glitchT, countT;
        var glitchMs = 700;
        var step = 0;

        // Phase 1: random glitch
        glitchT = setInterval(function () {
          el.classList.add('glitching');
          el.textContent = Math.floor(Math.random() * 999) + suffix;
        }, 40);

        setTimeout(function () {
          clearInterval(glitchT);
          el.classList.remove('glitching');
          // Phase 2: count up
          var current = 0;
          countT = setInterval(function () {
            var increment = Math.ceil((endVal - current) / 10);
            current = Math.min(current + increment, endVal);
            el.textContent = current + suffix;
            if (current >= endVal) {
              el.textContent = endVal + suffix;
              clearInterval(countT);
            }
          }, 28);
        }, glitchMs);
      }

      // Trigger when card enters viewport (IntersectionObserver)
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var numEl = entry.target.querySelector('.stat-num');
            if (numEl && !numEl.dataset.done) {
              numEl.dataset.done = '1';
              if (isMobile) {
                /* simple count-up on mobile, skip glitch phase */
                var endVal = parseInt(numEl.dataset.n, 10);
                var suf = numEl.dataset.s || '';
                var cur = 0;
                var t = setInterval(function () {
                  cur = Math.min(cur + Math.ceil((endVal - cur) / 8), endVal);
                  numEl.textContent = cur + suf;
                  if (cur >= endVal) clearInterval(t);
                }, 32);
              } else {
                glitchCount(numEl);
              }
            }
            io.unobserve(entry.target);
          });
        }, { threshold: 0.4 });
        cards.forEach(function (c) { io.observe(c); });
      }
    })();

  });

})();

/* ── PORTFOLIO — Avant-Garde interactive list ──────────────────────────────
   Runs independently of GSAP so hover/click always works regardless of
   whether the CDN loaded or the prefers-reduced-motion bail fired.
─────────────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  var rows       = document.querySelectorAll('.port-row');
  var portalImgs = document.querySelectorAll('.port-portal-img');
  var ambLayers  = document.querySelectorAll('.port-amb-layer');
  var numEl      = document.getElementById('portNum');
  if (!rows.length) return;

  function activate(pid) {
    rows.forEach(function (r) {
      r.classList.toggle('active', r.dataset.pid === pid);
    });
    portalImgs.forEach(function (img) {
      img.classList.toggle('active', img.dataset.pid === pid);
    });
    ambLayers.forEach(function (l) {
      l.classList.toggle('active', l.dataset.pid === pid);
    });
    if (numEl) numEl.textContent = pid.padStart(2, '0');
  }

  rows.forEach(function (row) {
    row.addEventListener('mouseenter', function () { activate(row.dataset.pid); });
    row.addEventListener('click',      function () { activate(row.dataset.pid); });
  });
});
