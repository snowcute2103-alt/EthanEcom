/* ================================================================
   ETHAN ECOM — ContactPopup Module  (Navy & Cream — maritime luxury)
   Self-contained: injects its own CSS, HTML, and logic.

   Design:
   • Khung ngoài popup: nền TRẮNG (viền trắng 10px bao quanh)
   • Khung trong (panel nội dung): nền NAVY #16305C + viền brass kép
   • Field/upload/strip: thẻ kem (cream) nổi trên nền navy
   • Typography: Fahkwang (display) + Mulish (body) — token shared.css

   Features:
   • Trigger dock "Ứng tuyển ngay / Liên hệ ngay"
   • Ứng tuyển: popup modal + upload CV (kéo-thả, PDF/DOC/DOCX ≤ 5 MB)
   • Liên hệ: CHAT WIDGET nổi (không dùng popup) — gửi thẳng về email
     Ethan qua FormSubmit AJAX, Enter gửi / Shift+Enter xuống dòng,
     đếm ký tự 0/2000, fallback mailto khi dịch vụ lỗi
   • Validation inline · ESC + X để đóng · prefers-reduced-motion
   ================================================================ */

(function () {

  /* ── INJECT CSS ── */
  const css = `

  /* ── Animations ── */
  @keyframes cp-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes cp-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Tokens (scoped) ── */
  .cp-overlay {
    --cp-panel:     #16305C;   /* nền khung trong (yêu cầu) */
    --cp-navy-50:   #F0F4F8;
    --cp-navy-100:  #DCE6F0;
    --cp-navy-200:  #B8CCE0;
    --cp-navy-300:  #8FADC9;
    --cp-navy-400:  #5D84AB;
    --cp-navy-500:  #35618D;
    --cp-navy-600:  #274E76;
    --cp-navy-700:  #1D3D5F;
    --cp-navy-800:  #142E4A;
    --cp-navy-900:  #0D2036;
    --cp-cream-50:  #FBF9F4;
    --cp-cream-100: #F5F0E6;
    --cp-cream-200: #F1ECE2;
    --cp-cream-300: #E0D5BC;
    --cp-cream-400: #CBBA95;
    --cp-cream-500: #B49F73;
    --cp-border:    #DFD8C8;
    --cp-error:     #B4533E;
    --cp-error-light: #E9A08F;
    --cp-success:   #3F7A5E;
    --cp-font-display: var(--font-heading, 'Fahkwang', serif);
    --cp-font-body:    var(--font-text, 'Mulish', sans-serif);
  }

  /* ── Overlay ── */
  .cp-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(13, 32, 54, 0.62);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .cp-overlay.cp-open {
    display: flex;
    animation: cp-overlay-in 0.35s ease forwards;
  }

  /* ── Dialog: khung ngoài NỀN TRẮNG ── */
  .cp-dialog {
    background: #fff;
    padding: 10px;                 /* viền trắng bao quanh khung navy */
    width: 100%;
    max-width: 860px;
    max-height: 92vh;
    overflow-y: auto;
    box-shadow: 0 30px 80px -30px rgba(13, 32, 54, 0.5);
    animation: cp-rise 0.6s cubic-bezier(0.22, 0.8, 0.3, 1) both;
    scrollbar-width: thin;
    scrollbar-color: rgba(22, 48, 92, 0.3) transparent;
  }
  .cp-dialog::-webkit-scrollbar { width: 4px; }
  .cp-dialog::-webkit-scrollbar-track { background: transparent; }
  .cp-dialog::-webkit-scrollbar-thumb { background: rgba(22, 48, 92, 0.3); border-radius: 4px; }

  /* ── Khung trong: nền NAVY #16305C + viền brass kép ── */
  .cp-inner {
    position: relative;
    background: var(--cp-panel);
    border: 1px solid var(--cp-cream-400);
    padding: 52px 56px;
  }
  .cp-inner::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(241, 236, 226, 0.18);
    pointer-events: none;
  }

  /* ── Close button ── */
  .cp-close {
    position: absolute;
    top: 22px; right: 22px;
    width: 44px; height: 44px;
    background: transparent;
    border: 1px solid rgba(241, 236, 226, 0.35);
    border-radius: 50%;
    color: var(--cp-cream-200);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.25s, color 0.25s, border-color 0.25s;
    z-index: 3;
  }
  .cp-close:hover {
    background: var(--cp-cream-100);
    color: var(--cp-navy-800);
    border-color: var(--cp-cream-100);
  }
  .cp-close:focus-visible { outline: 2px solid var(--cp-cream-400); outline-offset: 2px; }

  /* ── Header ── */
  .cp-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-family: var(--cp-font-display);
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cp-cream-500);
  }
  .cp-eyebrow::after {
    content: '';
    flex: 0 0 56px;
    height: 1px;
    background: var(--cp-cream-400);
  }

  .cp-title {
    font-family: var(--cp-font-display);
    font-weight: 400;
    font-size: 50px;
    line-height: 130%;
    text-transform: uppercase;
    color: #fff;
    margin: 8px 0 0;
  }

  .cp-lead {
    font-family: var(--cp-font-body);
    font-weight: 400;
    font-size: 18px;
    line-height: 155%;
    color: var(--cp-navy-100);
    margin: 12px 0 0;
    max-width: 60ch;
  }

  /* ── Contact strip (thẻ kem trên nền navy) ── */
  .cp-contact-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 32px;
    margin-top: 24px;
    padding: 12px 24px;
    background: var(--cp-cream-50);
    border: 1px solid var(--cp-border);
  }
  .cp-contact-strip a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--cp-font-body);
    font-size: 15px;
    line-height: 150%;
    color: var(--cp-navy-600);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .cp-contact-strip a:hover { color: var(--cp-navy-400); }
  .cp-contact-strip svg { width: 15px; height: 15px; stroke: var(--cp-cream-500); flex: none; }
  .cp-contact-strip span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--cp-font-body);
    font-size: 15px;
    line-height: 150%;
    color: var(--cp-navy-600);
  }

  /* ── Form ── */
  .cp-form { margin-top: 34px; }

  .cp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 20px;
  }

  .cp-field { margin-bottom: 22px; }

  .cp-field label,
  .cp-label {
    display: block;
    font-family: var(--cp-font-display);
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--cp-cream-100);
    margin-bottom: 8px;
  }
  .cp-field label .cp-req { color: var(--cp-error-light); }

  .cp-field input[type=text],
  .cp-field input[type=email],
  .cp-field input[type=tel],
  .cp-field select,
  .cp-field textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--cp-font-body);
    font-size: 16px;
    line-height: 150%;
    color: var(--cp-navy-800);
    background: var(--cp-cream-50);
    border: 1px solid var(--cp-border);
    padding: 14px 16px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 0;
    outline: none;
  }
  .cp-field ::placeholder { color: var(--cp-navy-300); }
  .cp-field input:hover,
  .cp-field select:hover,
  .cp-field textarea:hover { border-color: var(--cp-cream-400); }
  .cp-field input:focus,
  .cp-field select:focus,
  .cp-field textarea:focus {
    border-color: var(--cp-navy-400);
    box-shadow: 0 0 0 3px rgba(220, 230, 240, 0.35);
  }
  .cp-field textarea { min-height: 110px; resize: vertical; }
  .cp-field select { cursor: pointer; }

  /* Select với mũi tên riêng */
  .cp-select-wrap { position: relative; }
  .cp-select-wrap::after {
    content: '';
    position: absolute;
    right: 18px; top: 50%;
    width: 8px; height: 8px;
    border-right: 1.5px solid var(--cp-navy-500);
    border-bottom: 1.5px solid var(--cp-navy-500);
    transform: translateY(-70%) rotate(45deg);
    pointer-events: none;
  }

  /* Thông báo lỗi */
  .cp-msg {
    display: none;
    font-family: var(--cp-font-body);
    font-size: 14px;
    line-height: 150%;
    color: var(--cp-error-light);
    margin: 6px 0 0;
  }
  .cp-field.is-invalid .cp-msg { display: block; }
  .cp-msg.is-visible { display: block; }
  .cp-field.is-invalid input,
  .cp-field.is-invalid select { border-color: var(--cp-error); }

  /* ── Upload CV ── */
  .cp-upload {
    border: 1px dashed var(--cp-cream-400);
    background: var(--cp-cream-50);
    padding: 32px 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.25s ease, background 0.25s ease;
  }
  .cp-upload:hover,
  .cp-upload.cp-drag {
    border-color: var(--cp-navy-500);
    background: var(--cp-navy-50);
  }
  .cp-upload:focus-visible { outline: 2px solid var(--cp-cream-400); outline-offset: 2px; }
  .cp-upload svg { width: 28px; height: 28px; stroke: var(--cp-cream-500); margin-bottom: 8px; }
  .cp-upload p {
    font-family: var(--cp-font-body);
    font-size: 16px;
    line-height: 150%;
    color: #3E5A78;
    margin: 0;
  }
  .cp-upload p strong {
    font-family: var(--cp-font-display);
    font-weight: 500;
    color: var(--cp-navy-500);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .cp-upload small {
    display: block;
    font-family: var(--cp-font-body);
    font-size: 14px;
    line-height: 150%;
    color: var(--cp-navy-300);
    margin-top: 6px;
  }
  .cp-upload input { display: none; }

  /* Trạng thái đã chọn file */
  .cp-upload-file {
    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    padding: 12px 24px;
    background: var(--cp-navy-100);
    border: 1px solid var(--cp-navy-200);
  }
  .cp-upload-file.is-visible { display: flex; }
  .cp-upload-file span {
    font-family: var(--cp-font-body);
    font-size: 15px;
    line-height: 150%;
    color: var(--cp-navy-700);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cp-upload-file button {
    font-family: var(--cp-font-display);
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background: none;
    border: none;
    color: var(--cp-error);
    cursor: pointer;
    flex: none;
    padding: 8px 0;
  }

  /* ── Submit ── */
  .cp-actions { margin-top: 32px; }

  .cp-submit {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--cp-font-display);
    font-weight: 400;
    font-size: 20px;
    line-height: 100%;
    text-transform: uppercase;
    padding: 15px 38px;
    background: var(--cp-cream-100);
    color: var(--cp-navy-800);
    border: 1px solid var(--cp-cream-100);
    cursor: pointer;
    transition: background 0.25s ease, border-color 0.25s ease;
  }
  .cp-submit .cp-arrow { transition: transform 0.25s ease; }
  .cp-submit:hover { background: #fff; border-color: #fff; }
  .cp-submit:hover .cp-arrow { transform: translateX(4px); }
  .cp-submit:focus-visible { outline: 2px solid var(--cp-cream-400); outline-offset: 3px; }
  .cp-submit:disabled { opacity: 0.55; cursor: default; }

  .cp-form-note {
    font-family: var(--cp-font-body);
    font-size: 14px;
    line-height: 150%;
    color: var(--cp-navy-200);
    margin: 12px 0 0;
  }

  /* ── Success ── */
  .cp-success {
    display: none;
    margin-top: 28px;
    padding: 20px 24px;
    border: 1px solid var(--cp-success);
    background: #EDF3EF;
    color: var(--cp-success);
    font-family: var(--cp-font-body);
    font-size: 16px;
    line-height: 150%;
  }
  .cp-success.is-visible { display: block; }
  .cp-success strong { font-family: var(--cp-font-display); font-weight: 500; }

  /* ── Tablet / mobile ── */
  @media (max-width: 1024px) {
    .cp-inner { padding: 40px 24px; }
    .cp-title { font-size: 27px; }
    .cp-lead { font-size: 15px; }
    .cp-grid { grid-template-columns: 1fr; }
    .cp-submit { font-size: 17px; width: 100%; justify-content: center; }
  }

  @media (max-width: 540px) {
    /* Căn trên thay vì giữa, tránh bị đẩy khi bàn phím ảo bật */
    .cp-overlay {
      align-items: flex-start;
      padding: 0;
    }
    .cp-dialog {
      max-height: 100svh;
      max-width: 100%;
      padding: 8px;
    }
    .cp-inner { padding: 34px 18px 28px; }
    .cp-eyebrow { padding-right: 48px; }
    .cp-eyebrow::after { flex: 0 0 24px; }
    .cp-eyebrow-extra { display: none; }
    /* Nút X: sticky trong dialog để luôn thấy được */
    .cp-close {
      position: sticky;
      top: 6px;
      float: right;
      margin: -18px -4px 6px auto;
      background: var(--cp-panel);
      z-index: 10;
    }
  }

  /* ── prefers-reduced-motion ── */
  @media (prefers-reduced-motion: reduce) {
    .cp-overlay.cp-open { animation: none; }
    .cp-dialog { animation: none; }
    .cp-submit .cp-arrow { transition: none; }
  }

  /* ── Floating trigger tab ── */
  @keyframes cp-tab-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Dock holds the two stacked rectangular buttons (design ref) */
  .cp-dock {
    position: fixed;
    bottom: 28px;
    right: 22px;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .cp-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 168px;
    padding: 12px 22px;
    font-family: 'Fahkwang', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    border-radius: 0;
    border: 2px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s;
  }
  /* 1 — Ứng tuyển ngay: khung viền sáng (nền trắng, chữ navy) */
  .cp-trigger--apply {
    background: #fff;
    color: var(--navy, #16305C);
    border-color: var(--navy, #16305C);
    box-shadow: 0 12px 30px rgba(15,34,68,.20);
    animation: cp-tab-in 0.6s 1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .cp-trigger--apply:hover {
    background: var(--yellow, #F4B41A);
    color: var(--navy-deep, #0F2244);
    border-color: var(--yellow, #F4B41A);
    transform: translateY(-3px);
    box-shadow: 0 16px 38px rgba(244,180,26,.38);
  }
  /* 2 — Liên hệ ngay: khung nền đậm (navy đặc, chữ trắng) */
  .cp-trigger--contact {
    background: linear-gradient(135deg, var(--navy, #16305C) 0%, var(--navy-deep, #0F2244) 100%);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 12px 30px rgba(15,34,68,.35);
    animation: cp-tab-in 0.6s 1.12s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .cp-trigger--contact:hover {
    background: #fff;
    color: var(--text, #1A2433);
    border-color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 16px 38px rgba(0,0,0,.28);
  }
  .cp-trigger:focus-visible {
    outline: 3px solid var(--yellow, #F4B41A);
    outline-offset: 3px;
  }
  @media (max-width: 768px) {
    .cp-dock { bottom: 20px; right: 14px; gap: 8px; }
    .cp-trigger {
      min-width: 148px;
      padding: 12px 18px;
      font-size: 11px;
      letter-spacing: 1.2px;
      animation: none !important;
    }
  }

  /* ════════ CHAT WIDGET — Liên hệ ngay (thay popup) ════════ */
  @keyframes cw-pop {
    from { opacity: 0; transform: translateY(16px) scale(.97); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes cw-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.45); }
    50%     { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
  }
  .cw-panel {
    position: fixed;
    right: 22px;
    bottom: 138px;
    z-index: 9500;
    width: min(400px, calc(100vw - 32px));
    background: linear-gradient(160deg, #14294a 0%, var(--navy-deep, #0F2244) 55%, #0b1a35 100%);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 0;
    box-shadow: 0 30px 80px -20px rgba(5,15,35,.75);
    font-family: var(--font-text, 'Mulish', sans-serif);
    animation: cw-pop .35s cubic-bezier(.22,.8,.3,1) both;
    overflow: hidden;
  }
  .cw-panel[hidden] { display: none; }
  .cw-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 18px 14px;
    border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .cw-status {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #22c55e;
    flex: none;
    animation: cw-pulse 2s ease infinite;
  }
  .cw-title {
    font-family: var(--font-heading, 'Fahkwang', sans-serif);
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    letter-spacing: .04em;
  }
  .cw-badge {
    margin-left: auto;
    padding: 4px 12px;
    border-radius: 0;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.75);
    font-size: 11px;
    letter-spacing: .06em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .cw-badge--accent {
    margin-left: 0;
    background: rgba(244,180,26,.12);
    border-color: rgba(244,180,26,.35);
    color: var(--yellow, #F4B41A);
  }
  .cw-close {
    margin-left: 4px;
    width: 32px; height: 32px;
    flex: none;
    background: transparent;
    border: none;
    border-radius: 0;
    color: rgba(255,255,255,.6);
    font-size: 15px;
    cursor: pointer;
    transition: background .2s, color .2s;
  }
  .cw-close:hover { background: rgba(255,255,255,.1); color: #fff; }
  .cw-close:focus-visible { outline: 2px solid var(--yellow, #F4B41A); outline-offset: 2px; }
  .cw-body { padding: 16px 18px 14px; }
  .cw-bubble {
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 0;
    padding: 12px 14px;
    color: rgba(255,255,255,.88);
    font-size: 14px;
    line-height: 1.65;
    margin-bottom: 14px;
  }
  .cw-bubble--ok {
    border-color: rgba(34,197,94,.4);
    background: rgba(34,197,94,.1);
    color: #b7f0cd;
  }
  .cw-row { display: flex; gap: 8px; margin-bottom: 8px; }
  .cw-row input,
  .cw-form textarea {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 0;
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px 12px;
    outline: none;
    transition: border-color .2s, background .2s;
    -webkit-appearance: none;
    appearance: none;
  }
  .cw-row input::placeholder,
  .cw-form textarea::placeholder { color: rgba(255,255,255,.42); }
  .cw-row input:focus,
  .cw-form textarea:focus {
    border-color: var(--blue-cta, #2B8FFF);
    background: rgba(255,255,255,.09);
  }
  .cw-form textarea {
    resize: none;
    min-height: 86px;
    max-height: 180px;
    font-size: 16px; /* tránh iOS auto-zoom */
  }
  .cw-form .cw-invalid { border-color: #e0705c !important; }
  .cw-err {
    display: none;
    color: #f0a99b;
    font-size: 13px;
    line-height: 1.5;
    margin: 8px 0 0;
  }
  .cw-err.is-visible { display: block; }
  .cw-err a { color: #ffd28a; }
  .cw-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 10px;
  }
  .cw-count {
    color: rgba(255,255,255,.5);
    font-size: 13px;
    letter-spacing: .03em;
  }
  .cw-send {
    width: 46px; height: 46px;
    flex: none;
    border: none;
    border-radius: 0;
    background: linear-gradient(135deg, var(--blue-cta, #2B8FFF), var(--blue, #1E7FE0));
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .2s, box-shadow .2s, opacity .2s;
    box-shadow: 0 8px 22px rgba(43,143,255,.35);
  }
  .cw-send svg { width: 20px; height: 20px; }
  .cw-send:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(43,143,255,.45); }
  .cw-send:disabled { opacity: .55; cursor: default; transform: none; }
  .cw-send:focus-visible { outline: 2px solid var(--yellow, #F4B41A); outline-offset: 2px; }
  .cw-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 18px 14px;
    border-top: 1px solid rgba(255,255,255,.08);
    color: rgba(255,255,255,.5);
    font-size: 12px;
  }
  .cw-hint kbd {
    font-family: inherit;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 0;
    padding: 2px 7px;
    color: rgba(255,255,255,.75);
  }
  .cw-online { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .cw-online i {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
  }
  @media (max-width: 768px) {
    .cw-panel { right: 14px; bottom: 122px; width: calc(100vw - 28px); }
    .cw-hint span:first-child { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cw-panel { animation: none; }
    .cw-status { animation: none; }
  }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'contact-popup-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML TEMPLATE ── */
  const HTML = `
    <div class="cp-overlay" id="cpOverlay" role="dialog" aria-modal="true" aria-labelledby="cpTitle">
      <div class="cp-dialog" id="cpDialog">
        <div class="cp-inner">
          <button class="cp-close" id="cpClose" type="button" aria-label="Đóng popup">✕</button>

          <p class="cp-eyebrow">Ethan Ecom<span class="cp-eyebrow-extra"> · Tuyển dụng</span></p>
          <h2 class="cp-title" id="cpTitle">Kiến Tạo Tương Lai</h2>
          <p class="cp-lead">Tại Ethan Ecom, chúng tôi không chỉ tìm kiếm nhân viên, chúng tôi tìm kiếm những cộng sự có cùng đam mê và khát vọng bứt phá giới hạn. Hãy để lại thông tin ngay.</p>

          <div class="cp-contact-strip">
            <a href="tel:+84967473979">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
              +84 967 473 979
            </a>
            <a href="mailto:support@ethanecom.com">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
              support@ethanecom.com
            </a>
          </div>

          <form class="cp-form" id="cpForm" novalidate>

            <div class="cp-grid">
              <div class="cp-field" data-field>
                <label for="cpName">Họ và tên <span class="cp-req">*</span></label>
                <input id="cpName" type="text" placeholder="Nguyễn Văn A" required autocomplete="name">
                <p class="cp-msg">Vui lòng nhập họ và tên của bạn.</p>
              </div>
              <div class="cp-field" data-field>
                <label for="cpEmail">Email liên lạc <span class="cp-req">*</span></label>
                <input id="cpEmail" type="email" placeholder="you@example.com" required autocomplete="email">
                <p class="cp-msg">Email chưa hợp lệ. Vui lòng kiểm tra lại.</p>
              </div>
            </div>

            <div class="cp-field" data-field>
              <label for="cpPosition">Vị trí ứng tuyển <span class="cp-req">*</span></label>
              <div class="cp-select-wrap">
                <select id="cpPosition" required>
                  <option value="" disabled selected>Chọn vị trí</option>
                  <option value="quality-control">Quality Control · Operations</option>
                  <option value="accountant">General Accountant · Finance</option>
                  <option value="seller-pod">Seller POD · E-commerce</option>
                  <option value="embroidery">Embroidery Technician · Production</option>
                  <option value="graphic-designer">Graphic Designer · Creative Design</option>
                  <option value="web-developer">Web Developer · Tech</option>
                  <option value="video-creator">Video Creator · Media &amp; Production</option>
                  <option value="leader-tiktok">Leader TikTokShop US · E-commerce</option>
                  <option value="marketing">Internet Marketing · Online Marketing</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <p class="cp-msg">Vui lòng chọn vị trí bạn muốn ứng tuyển.</p>
            </div>

            <div class="cp-field">
              <label for="cpMsg">Lời nhắn</label>
              <textarea id="cpMsg" placeholder="Giới thiệu ngắn về bản thân và lý do bạn muốn gia nhập Ethan…"></textarea>
            </div>

            <div class="cp-field">
              <span class="cp-label" id="cpCvLabel">Upload CV (PDF / DOC)</span>
              <div class="cp-upload" id="cpFileZone" role="button" tabindex="0" aria-labelledby="cpCvLabel">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" aria-hidden="true"><path d="M21.4 11.05 12.25 20.2a6 6 0 0 1-8.49-8.49l9.2-9.19a4 4 0 0 1 5.65 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.49-8.48"/></svg>
                <p>Kéo thả file vào đây hoặc <strong>chọn tệp</strong></p>
                <small>PDF, DOC, DOCX, tối đa 5 MB</small>
                <input type="file" id="cpFile" accept=".pdf,.doc,.docx" aria-label="Chọn file CV">
              </div>
              <div class="cp-upload-file" id="cpFileChip">
                <span id="cpFileName"></span>
                <button type="button" id="cpFileRemove">Xoá</button>
              </div>
              <p class="cp-msg" id="cpFileMsg">File vượt quá 5 MB hoặc sai định dạng. Chỉ nhận PDF, DOC, DOCX.</p>
            </div>

            <div class="cp-actions">
              <button type="submit" class="cp-submit" id="cpSubmit">Gửi thông tin <span class="cp-arrow" aria-hidden="true">→</span></button>
              <p class="cp-form-note">Thông tin của bạn được bảo mật và chỉ dùng cho mục đích tuyển dụng.</p>
              <p class="cp-msg" id="cpFormErr" style="margin-top:10px"></p>
            </div>

            <div class="cp-success" id="cpSuccess" role="status">
              <strong>Đã nhận hồ sơ của bạn.</strong> Đội ngũ Ethan Ecom sẽ liên hệ trong vòng 3–5 ngày làm việc. Cảm ơn bạn đã tin tưởng đồng hành.
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  /* ── HTML TEMPLATE: CHAT WIDGET LIÊN HỆ (thay popup cũ) ── */
  const CONTACT_HTML = `
    <div class="cw-panel" id="cwPanel" role="dialog" aria-labelledby="cwTitle" hidden>
      <div class="cw-head">
        <span class="cw-status" aria-hidden="true"></span>
        <span class="cw-title" id="cwTitle">Ethan Ecom</span>
        <span class="cw-badge">Hỗ trợ</span>
        <span class="cw-badge cw-badge--accent">24h</span>
        <button class="cw-close" id="cwClose" type="button" aria-label="Đóng khung chat">✕</button>
      </div>
      <div class="cw-body">
        <div class="cw-bubble" id="cwWelcome">Xin chào 👋 Bạn cần tư vấn điều gì? Để lại tin nhắn kèm email, Ethan sẽ phản hồi trong 24 giờ làm việc.</div>
        <form class="cw-form" id="cwForm" novalidate>
          <div class="cw-row">
            <input id="cwName" type="text" placeholder="Tên của bạn" autocomplete="name" aria-label="Tên của bạn">
            <input id="cwEmail" type="email" placeholder="Email nhận phản hồi *" required autocomplete="email" inputmode="email" aria-label="Email của bạn">
          </div>
          <textarea id="cwMsg" maxlength="2000" placeholder="Nhập tin nhắn của bạn…" required aria-label="Nội dung tin nhắn"></textarea>
          <p class="cw-err" id="cwErr"></p>
          <div class="cw-foot">
            <span class="cw-count" id="cwCount">0/<strong>2000</strong></span>
            <button type="submit" class="cw-send" id="cwSend" aria-label="Gửi tin nhắn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </form>
      </div>
      <div class="cw-hint">
        <span>Nhấn <kbd>Shift + Enter</kbd> để xuống dòng</span>
        <span class="cw-online"><i aria-hidden="true"></i>Phản hồi trong 24h làm việc</span>
      </div>
    </div>
  `;

  /* ── TRIGGER BUTTON HTML ── */
  const TRIGGER_HTML = `
    <div class="cp-dock">
      <button class="cp-trigger cp-trigger--apply" id="cpTrigger" aria-label="Ứng tuyển ngay">Ứng tuyển ngay</button>
      <button class="cp-trigger cp-trigger--contact" id="cpTriggerContact" aria-label="Liên hệ ngay">Liên hệ ngay</button>
    </div>
  `;

  /* ════════════════════════════════════════════════════════════
     EMAIL ĐÍCH — gửi qua FormSubmit (https://formsubmit.co, KHÔNG cần backend)

     ⚠ ĐANG Ở CHẾ ĐỘ TEST: cả 2 form gửi về Gmail cá nhân để kiểm tra
        luồng thật. Khi bàn giao production, đổi 2 dòng dưới về email công ty:
          CONTACT_EMAIL → 'support@ethanecom.com'   (chat "Liên hệ ngay")
          CAREERS_EMAIL → 'hr@ethanecom.com'         (popup "Ứng tuyển ngay")

     ⓘ FormSubmit yêu cầu KÍCH HOẠT 1 lần cho MỖI email đích: lần gửi ĐẦU
       TIÊN, FormSubmit gửi 1 mail "Activate Form" tới hộp thư đó — mở mail,
       bấm link kích hoạt; từ lần sau các submit tự động về inbox.
     ════════════════════════════════════════════════════════════ */
  const TEST_EMAIL    = 'snowcute2103@gmail.com';
  const CONTACT_EMAIL = TEST_EMAIL;   // production: 'support@ethanecom.com'
  const CAREERS_EMAIL = TEST_EMAIL;   // production: 'hr@ethanecom.com'

  /* ════════════════════════════════════════════════════════════
     WEBHOOK (Google Apps Script) — cách gửi TỐI ƯU, miễn phí, đính kèm CV.
     URL lấy từ NGUỒN CHUNG window.ETHAN_WEBHOOK_URL (khai báo trong shared.js —
     nạp trước file này trên mọi trang). Đổi URL → sửa ở shared.js, KHÔNG sửa đây.
     • Để trống '' → tự động fallback về FormSubmit như cũ (không đính kèm file).
     • Khi dùng webhook, EMAIL ĐÍCH do chính Apps Script quy định
       (HR_EMAIL / SUPPORT_EMAIL trong Code.gs), KHÔNG dùng 2 const phía trên.
     ════════════════════════════════════════════════════════════ */
  const WEBHOOK_URL = (typeof window !== 'undefined' && window.ETHAN_WEBHOOK_URL) || '';

  /* Đọc file → chuỗi base64 (bỏ tiền tố "data:...;base64,") để nhét vào JSON */
  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        const res = String(reader.result);
        const comma = res.indexOf(',');
        resolve(comma >= 0 ? res.slice(comma + 1) : res);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* POST JSON tới webhook Apps Script.
     Không set header Content-Type → là "simple request", tránh CORS preflight
     (Apps Script Web App không trả lời OPTIONS). Apps Script đọc e.postData.contents. */
  function postWebhook(payload) {
    return fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (r) { if (!r || r.ok === false) throw new Error((r && r.error) || 'webhook'); return r; });
  }

  /* ── MOUNT ── */
  function mount() {
    const root = document.getElementById('contact-popup-root');
    if (!root) return;
    root.innerHTML = HTML + CONTACT_HTML + TRIGGER_HTML;
    initPopup();
    initContactPopup();
  }

  /* ── CONTROLLER ── */
  function initPopup() {
    const overlay    = document.getElementById('cpOverlay');
    const closeBtn   = document.getElementById('cpClose');
    const form       = document.getElementById('cpForm');
    const fileInput  = document.getElementById('cpFile');
    const fileZone   = document.getElementById('cpFileZone');
    const fileChip   = document.getElementById('cpFileChip');
    const fileName   = document.getElementById('cpFileName');
    const fileMsg    = document.getElementById('cpFileMsg');
    const submitBtn  = document.getElementById('cpSubmit');
    const successBox = document.getElementById('cpSuccess');
    const errBox     = document.getElementById('cpFormErr');

    const MAX_SIZE = 5 * 1024 * 1024;
    const OK_EXT   = /\.(pdf|doc|docx)$/i;

    function open() {
      overlay.classList.add('cp-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const first = overlay.querySelector('input');
        if (first) first.focus();
      }, 460);
    }

    function close() {
      overlay.classList.remove('cp-open');
      document.body.style.overflow = '';
    }

    function resetForm() {
      form.reset();
      fileChip.classList.remove('is-visible');
      fileMsg.classList.remove('is-visible');
      successBox.classList.remove('is-visible');
      if (errBox) errBox.classList.remove('is-visible');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Gửi thông tin <span class="cp-arrow" aria-hidden="true">→</span>';
      form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
    }

    /* Trigger button opens popup */
    const triggerBtn = document.getElementById('cpTrigger');
    if (triggerBtn) triggerBtn.addEventListener('click', open);

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('cp-open')) close();
    });

    /* ── Upload CV ── */
    function setFile(file) {
      fileMsg.classList.remove('is-visible');
      if (!file) return;
      if (file.size > MAX_SIZE || !OK_EXT.test(file.name)) {
        fileMsg.classList.add('is-visible');
        fileInput.value = '';
        fileChip.classList.remove('is-visible');
        return;
      }
      fileName.textContent = file.name + ' · ' + (file.size / 1024 / 1024).toFixed(2) + ' MB';
      fileChip.classList.add('is-visible');
    }

    fileZone.addEventListener('click', function (e) {
      if (e.target === fileInput) return;
      fileInput.click();
    });
    fileZone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () { setFile(fileInput.files[0]); });

    ['dragenter', 'dragover'].forEach(function (ev) {
      fileZone.addEventListener(ev, function (e) { e.preventDefault(); fileZone.classList.add('cp-drag'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      fileZone.addEventListener(ev, function (e) { e.preventDefault(); fileZone.classList.remove('cp-drag'); });
    });
    fileZone.addEventListener('drop', function (e) {
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        setFile(e.dataTransfer.files[0]);
      }
    });

    document.getElementById('cpFileRemove').addEventListener('click', function () {
      fileInput.value = '';
      fileChip.classList.remove('is-visible');
    });

    /* ── Validation & submit → gửi email thật qua FormSubmit ──
       Lưu ý: endpoint AJAX của FormSubmit KHÔNG đính kèm file được, nên CV
       chỉ gửi kèm TÊN FILE; ứng viên gửi file thật khi HR reply. Muốn đính
       kèm file thẳng vào mail cần đổi sang dịch vụ hỗ trợ attachment (vd
       Web3Forms) — báo mình nếu cần. */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let ok = true;

      form.querySelectorAll('[data-field]').forEach(function (f) {
        const ctrl = f.querySelector('input, select');
        let valid = ctrl.value.trim() !== '';
        if (valid && ctrl.type === 'email') {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ctrl.value.trim());
        }
        f.classList.toggle('is-invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;

      const name    = document.getElementById('cpName').value.trim();
      const email   = document.getElementById('cpEmail').value.trim();
      const posEl   = document.getElementById('cpPosition');
      const posText = posEl.selectedOptions.length ? posEl.selectedOptions[0].text : posEl.value;
      const message = document.getElementById('cpMsg').value.trim();
      const cvFile  = fileInput.files[0];
      const cvNote  = cvFile
        ? cvFile.name + ' — ứng viên gửi kèm file khi HR phản hồi'
        : 'Chưa đính kèm CV';

      if (errBox) errBox.classList.remove('is-visible');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Đang gửi…';

      /* Webhook (đính kèm CV thật) nếu có WEBHOOK_URL, ngược lại fallback FormSubmit */
      const sendCareers = WEBHOOK_URL
        ? (cvFile ? fileToBase64(cvFile) : Promise.resolve(null)).then(function (cvData) {
            return postWebhook({
              formType: 'careers',
              name: name,
              email: email,
              position: posText,
              message: message,
              cv: cvData ? { name: cvFile.name, mime: cvFile.type || 'application/octet-stream', data: cvData } : null
            });
          })
        : fetch('https://formsubmit.co/ajax/' + CAREERS_EMAIL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              'Họ và tên': name,
              'Email liên lạc': email,
              'Vị trí ứng tuyển': posText,
              'Lời nhắn': message || '—',
              'CV đính kèm': cvNote,
              _subject: 'Hồ sơ ứng tuyển mới — ' + posText,
              _template: 'table',
              _captcha: 'false',
              _replyto: email
            })
          }).then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); });

      sendCareers
        .then(function () {
          submitBtn.innerHTML = 'Đã gửi ✓';
          successBox.classList.add('is-visible');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(function () { close(); resetForm(); }, 5000);
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Gửi thông tin <span class="cp-arrow" aria-hidden="true">→</span>';
          if (errBox) {
            const subject = encodeURIComponent('Hồ sơ ứng tuyển — ' + posText);
            const body = encodeURIComponent(
              'Họ và tên: ' + name + '\nEmail: ' + email + '\nVị trí: ' + posText +
              '\n\n' + (message || '') +
              (cvFile ? '\n\n(CV: ' + cvFile.name + ' — vui lòng đính kèm khi gửi)' : '')
            );
            errBox.innerHTML = 'Không gửi được lúc này. Bạn có thể ' +
              '<a href="mailto:' + CAREERS_EMAIL + '?subject=' + subject + '&body=' + body +
              '" style="color:var(--cp-cream-300);text-decoration:underline">gửi trực tiếp qua email</a> ' +
              'hoặc thử lại sau.';
            errBox.classList.add('is-visible');
          }
        });
    });

    /* Xoá lỗi khi người dùng sửa */
    form.querySelectorAll('[data-field] input, [data-field] select').forEach(function (ctrl) {
      const evName = ctrl.tagName === 'SELECT' ? 'change' : 'input';
      ctrl.addEventListener(evName, function () {
        ctrl.closest('[data-field]').classList.remove('is-invalid');
      });
    });
  }

  /* ── CONTROLLER: CHAT WIDGET LIÊN HỆ ──
     Gửi thẳng về email Ethan qua FormSubmit (https://formsubmit.co) —
     endpoint AJAX, không cần backend. Lần gửi ĐẦU TIÊN FormSubmit sẽ
     email xác nhận tới support@ethanecom.com; chủ hộp thư bấm Activate
     một lần là các tin sau tự động về inbox. Nếu dịch vụ lỗi → fallback
     mở mail client với nội dung điền sẵn.
     (Email đích CONTACT_EMAIL khai báo ở block config phía trên.) */

  function initContactPopup() {
    const panel   = document.getElementById('cwPanel');
    const closeBtn = document.getElementById('cwClose');
    const form    = document.getElementById('cwForm');
    const nameEl  = document.getElementById('cwName');
    const emailEl = document.getElementById('cwEmail');
    const msgEl   = document.getElementById('cwMsg');
    const countEl = document.getElementById('cwCount');
    const sendBtn = document.getElementById('cwSend');
    const errEl   = document.getElementById('cwErr');
    const welcome = document.getElementById('cwWelcome');
    if (!panel || !form) return;

    function open() {
      panel.hidden = false;
      setTimeout(() => msgEl.focus(), 300);
    }
    function close() { panel.hidden = true; }
    function toggle() { panel.hidden ? open() : close(); }

    const triggerBtn = document.getElementById('cpTriggerContact');
    if (triggerBtn) triggerBtn.addEventListener('click', toggle);

    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) close();
    });

    /* Đếm ký tự */
    msgEl.addEventListener('input', function () {
      countEl.innerHTML = msgEl.value.length + '/<strong>2000</strong>';
    });

    /* Enter gửi — Shift+Enter xuống dòng */
    msgEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    [nameEl, emailEl, msgEl].forEach(function (ctrl) {
      ctrl.addEventListener('input', function () {
        ctrl.classList.remove('cw-invalid');
        errEl.classList.remove('is-visible');
      });
    });

    function showError(html) {
      errEl.innerHTML = html;
      errEl.classList.add('is-visible');
    }

    function mailtoFallback(name, email, msg) {
      const subject = encodeURIComponent('Liên hệ từ website Ethan Ecom');
      const body = encodeURIComponent('Tên: ' + (name || '—') + '\nEmail: ' + email + '\n\n' + msg);
      return 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name  = nameEl.value.trim();
      const email = emailEl.value.trim();
      const msg   = msgEl.value.trim();

      let ok = true;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailEl.classList.add('cw-invalid'); ok = false; }
      if (!msg) { msgEl.classList.add('cw-invalid'); ok = false; }
      if (!ok) {
        showError('Vui lòng nhập email hợp lệ và nội dung tin nhắn.');
        return;
      }

      sendBtn.disabled = true;
      errEl.classList.remove('is-visible');

      /* Webhook nếu có WEBHOOK_URL, ngược lại fallback FormSubmit */
      const sendContact = WEBHOOK_URL
        ? postWebhook({ formType: 'contact', name: name || 'Khách website', email: email, message: msg })
        : fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: name || 'Khách website',
              email: email,
              message: msg,
              _subject: 'Liên hệ mới từ website Ethan Ecom',
              _template: 'table',
              _captcha: 'false',
              _replyto: email
            })
          }).then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); });

      sendContact
      .then(function () {
        welcome.classList.add('cw-bubble--ok');
        welcome.innerHTML = '<strong>Đã gửi thành công!</strong> Cảm ơn bạn, Ethan sẽ phản hồi qua email <em>' + email.replace(/</g, '&lt;') + '</em> trong vòng 24 giờ làm việc.';
        form.reset();
        countEl.innerHTML = '0/<strong>2000</strong>';
        sendBtn.disabled = false;
      })
      .catch(function () {
        sendBtn.disabled = false;
        showError('Không gửi được lúc này. Bạn có thể <a href="' + mailtoFallback(name, email, msg) + '">gửi trực tiếp qua email</a> hoặc thử lại sau.');
      });
    });
  }

  /* ── BOOTSTRAP ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
