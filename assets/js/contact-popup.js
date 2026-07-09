/* ================================================================
   ETHAN ECOM — ContactPopup Module  (Dark Edition)
   Self-contained: injects its own CSS, HTML, and logic.

   Features:
   • Auto-opens immediately on page load (0 s delay)
   • Animated gradient title "Kiến Tạo Tương Lai"
   • Dark mode: #111116 background, cyan accent
   • Overlay fade-in + popup slide-up + scale entrance
   • Input glow on focus
   • Submit: hover lift + gradient shift, active press
   • Close X: rotate 90° + red on hover
   • Fields: Họ tên / Email / Vị trí ứng tuyển / Lời nhắn / Upload CV
   • Scroll-lock while open
   • Click-outside + ESC + X to close
   • prefers-reduced-motion respected
   ================================================================ */

(function () {

  /* ── INJECT CSS ── */
  const css = `

  /* ── Overlay ── */
  @keyframes cp-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes cp-dialog-in {
    from { opacity: 0; transform: translateY(36px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0)   scale(1);   }
  }
  @keyframes cp-gradient-flow {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes cp-btn-pulse {
    0%   { box-shadow: 0 0 0 0   rgba(0,212,255,.5); }
    60%  { box-shadow: 0 0 0 14px rgba(0,212,255,0); }
    100% { box-shadow: 0 0 0 0   rgba(0,212,255,0); }
  }

  .cp-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .cp-overlay.cp-open {
    display: flex;
    animation: cp-overlay-in 0.35s ease forwards;
  }

  /* ── Dialog ── */
  .cp-dialog {
    background: #111116;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 20px;
    width: 100%;
    max-width: 800px;
    max-height: 92vh;
    overflow-y: auto;
    padding: 40px 36px 32px;
    position: relative;
    box-shadow:
      0 0 0 1px rgba(0,212,255,.07),
      0 40px 100px rgba(0,0,0,.7),
      0 0 80px rgba(0,212,255,.04);
    animation: cp-dialog-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,.12) transparent;
  }
  .cp-dialog::-webkit-scrollbar { width: 4px; }
  .cp-dialog::-webkit-scrollbar-track { background: transparent; }
  .cp-dialog::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 4px; }

  /* subtle cyan top line */
  .cp-dialog::before {
    content: '';
    position: absolute;
    top: 0; left: 36px; right: 36px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00D4FF 40%, #7B61FF 60%, transparent);
    border-radius: 0 0 4px 4px;
  }

  /* ── Close button ── */
  .cp-close {
    position: absolute;
    top: 14px; right: 14px;
    width: 34px; height: 34px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 50%;
    color: rgba(255,255,255,.45);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.3s;
    font-family: 'Inter', sans-serif;
  }
  .cp-close:hover {
    background: rgba(239,68,68,.18);
    border-color: rgba(239,68,68,.45);
    color: #ef4444;
    transform: rotate(90deg);
  }

  /* ── Eyebrow ── */
  .cp-eyebrow {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #00D4FF;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
    opacity: 0.85;
  }

  /* ── Animated gradient title ── */
  .cp-title {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: clamp(22px, 5vw, 30px);
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 14px;
    background: linear-gradient(270deg, #00D4FF, #7B61FF, #FF6B6B, #00D4FF);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: cp-gradient-flow 5s ease infinite;
  }

  /* ── Description ── */
  .cp-desc {
    font-size: 16px;
    color: rgba(255,255,255,.5);
    line-height: 1.75;
    margin: 0 0 20px;
    font-family: 'Inter', sans-serif;
  }

  /* ── Contact info strip ── */
  .cp-contact-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
    margin-bottom: 24px;
    padding: 12px 14px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 10px;
  }
  .cp-contact-strip a {
    font-size: 16px;
    color: rgba(255,255,255,.55);
    font-family: 'Inter', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    transition: color 0.2s;
  }
  .cp-contact-strip a:hover { color: #00D4FF; }
  .cp-contact-strip a span { font-size: 16px; }

  /* ── 2-col grid ── */
  .cp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 14px;
  }
  .cp-grid .cp-field:first-child { grid-column: 1; }
  .cp-grid .cp-field:last-child  { grid-column: 2; }

  /* ── Field ── */
  .cp-field { margin-bottom: 14px; }
  .cp-field label {
    display: block;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,.4);
    margin-bottom: 7px;
    font-family: 'Inter', sans-serif;
  }

  .cp-field input,
  .cp-field textarea,
  .cp-field select {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,.05);
    border: 1.5px solid rgba(255,255,255,.1);
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    -webkit-appearance: none;
    appearance: none;
  }
  .cp-field input::placeholder,
  .cp-field textarea::placeholder { color: rgba(255,255,255,.22); }
  .cp-field select { cursor: pointer; color: rgba(255,255,255,.6); }
  .cp-field select option { background: #1a1a22; color: #fff; }

  .cp-field input:focus,
  .cp-field textarea:focus,
  .cp-field select:focus {
    border-color: #00D4FF;
    background: rgba(0,212,255,.06);
    box-shadow:
      0 0 0 3px rgba(0,212,255,.15),
      0 4px 20px rgba(0,212,255,.08);
  }
  .cp-field input:hover:not(:focus),
  .cp-field textarea:hover:not(:focus),
  .cp-field select:hover:not(:focus) {
    border-color: rgba(255,255,255,.22);
  }
  .cp-field input.cp-error,
  .cp-field textarea.cp-error,
  .cp-field select.cp-error {
    border-color: rgba(239,68,68,.6);
    box-shadow: 0 0 0 3px rgba(239,68,68,.1);
  }
  .cp-field textarea {
    resize: none;
    height: 90px;
  }

  /* ── Error message ── */
  .cp-err-msg {
    font-size: 16px;
    color: #f87171;
    margin-top: 4px;
    min-height: 14px;
    font-family: 'Inter', sans-serif;
  }

  /* ── File upload zone ── */
  .cp-file-zone {
    border: 1.5px dashed rgba(255,255,255,.15);
    border-radius: 10px;
    padding: 16px 14px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    position: relative;
    margin-bottom: 14px;
    background: rgba(255,255,255,.03);
  }
  .cp-file-zone:hover,
  .cp-file-zone.cp-drag {
    border-color: #00D4FF;
    background: rgba(0,212,255,.05);
  }
  .cp-file-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .cp-file-icon {
    font-size: 22px;
    margin-bottom: 6px;
    display: block;
  }
  .cp-file-label {
    font-size: 16px;
    color: rgba(255,255,255,.45);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
  }
  .cp-file-label strong {
    color: #00D4FF;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .cp-file-name {
    font-size: 16px;
    color: #00D4FF;
    margin-top: 6px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    display: none;
  }
  .cp-file-name.visible { display: block; }

  /* ── Section label above file ── */
  .cp-field-label {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,.4);
    margin-bottom: 7px;
    font-family: 'Inter', sans-serif;
    display: block;
  }

  /* ── Submit button ── */
  .cp-submit {
    width: 100%;
    background: linear-gradient(135deg, #00D4FF 0%, #0099cc 100%);
    color: #000;
    border: none;
    border-radius: 10px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.3px;
    padding: 15px 24px;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.25s, transform 0.18s, box-shadow 0.25s;
    animation: cp-btn-pulse 2.4s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  }
  .cp-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.2) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .cp-submit:hover {
    background: linear-gradient(135deg, #22e5ff 0%, #00D4FF 100%);
    transform: translateY(-2px);
    animation: none;
    box-shadow:
      0 10px 30px rgba(0,212,255,.4),
      0 4px 12px rgba(0,212,255,.3);
  }
  .cp-submit:hover::after { transform: translateX(100%); }
  .cp-submit:active {
    transform: scale(0.98) translateY(0);
    box-shadow: 0 4px 12px rgba(0,212,255,.25);
  }

  /* ── Success state ── */
  .cp-success {
    text-align: center;
    padding: 24px 0 12px;
  }
  .cp-success-icon { font-size: 56px; margin-bottom: 16px; }
  .cp-success h4 {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 10px;
  }
  .cp-success p {
    font-size: 16px;
    color: rgba(255,255,255,.45);
    line-height: 1.75;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }

  /* ── Mobile ── */
  @media (max-width: 540px) {
    /* Overlay: căn trên thay vì giữa, tránh bị đẩy khi bàn phím ảo bật */
    .cp-overlay {
      align-items: flex-start;
      padding: 0;
    }
    .cp-dialog {
      padding: 56px 18px 28px;
      border-radius: 0 0 20px 20px;
      max-height: 100svh;
      width: 100%;
      max-width: 100%;
      border-top: none;
      border-left: none;
      border-right: none;
    }
    .cp-dialog::before { left: 0; right: 0; }
    /* Nút X: sticky trong dialog để luôn thấy được */
    .cp-close {
      position: sticky;
      top: 0;
      float: right;
      width: 44px; height: 44px;
      font-size: 18px;
      margin: -52px -2px 8px auto;
      z-index: 10;
    }
    .cp-grid   { grid-template-columns: 1fr; }
    .cp-grid .cp-field:first-child,
    .cp-grid .cp-field:last-child { grid-column: 1; }
  }

  /* ── prefers-reduced-motion ── */
  @media (prefers-reduced-motion: reduce) {
    .cp-overlay.cp-open { animation: none; }
    .cp-dialog  { animation: none; }
    .cp-submit  { animation: none; }
    .cp-title   { animation: none; }
  }

  /* ── Mobile: tắt mọi animation lặp vô hạn ── */
  @media (max-width: 768px) {
    .cp-title  { animation: none !important; background-position: 0% 50% !important; }
    .cp-submit { animation: none !important; }
  }

  /* ── Floating trigger tab ── */
  @keyframes cp-tab-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cp-tab-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,.5), 0 8px 32px rgba(0,0,0,.5); }
    50%       { box-shadow: 0 0 0 8px rgba(0,212,255,0), 0 8px 32px rgba(0,0,0,.5); }
  }
  .cp-trigger {
    position: fixed;
    bottom: 80px;
    right: 0;
    z-index: 9000;
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%);
    color: #000;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.3px;
    padding: 13px 16px 13px 20px;
    border-radius: 12px 0 0 12px;
    border: none;
    cursor: pointer;
    animation: cp-tab-in 0.6s 1s cubic-bezier(0.34,1.56,0.64,1) both,
               cp-tab-pulse 2.8s 2s ease-in-out infinite;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s;
    white-space: nowrap;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
  }
  .cp-trigger:hover {
    transform: translateX(-4px);
    filter: brightness(1.1);
    animation: none;
    box-shadow: 0 0 0 3px rgba(0,212,255,.35), 0 12px 36px rgba(0,0,0,.55);
  }
  .cp-trigger-icon {
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
  }
  .cp-trigger-icon-img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
    filter: brightness(0);
  }
  .cp-trigger-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    text-align: left;
  }
  .cp-trigger-label {
    font-size: 16px;
    font-weight: 700;
    opacity: 0.7;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .cp-trigger-main {
    font-size: 16px;
    font-weight: 800;
  }
  @media (max-width: 768px) {
    .cp-trigger {
      animation: none !important;
      box-shadow: 0 8px 32px rgba(0,0,0,.5) !important;
    }
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
        <button class="cp-close" id="cpClose" aria-label="Đóng popup">✕</button>

        <p class="cp-eyebrow">Ethan Ecom</p>
        <h2 class="cp-title" id="cpTitle">Kiến Tạo Tương Lai</h2>
        <p class="cp-desc">Tại Ethan Ecom, chúng tôi không chỉ tìm kiếm nhân viên — chúng tôi tìm kiếm những cộng sự có cùng đam mê và khát vọng bứt phá giới hạn. Hãy để lại thông tin ngay.</p>

        <div class="cp-contact-strip">
          <a href="tel:+84967473979"><span>📞</span> +84 967 473 979</a>
          <a href="mailto:support@ethanecom.com"><span>✉</span> support@ethanecom.com</a>
        </div>

        <form id="cpForm" novalidate>

          <div class="cp-grid">
            <div class="cp-field">
              <label for="cpName">Họ và tên</label>
              <input id="cpName" type="text" placeholder="Nguyễn Văn A" autocomplete="name">
              <div class="cp-err-msg" id="cpNameErr" aria-live="polite"></div>
            </div>
            <div class="cp-field">
              <label for="cpEmail">Email liên lạc</label>
              <input id="cpEmail" type="email" placeholder="you@example.com" autocomplete="email">
              <div class="cp-err-msg" id="cpEmailErr" aria-live="polite"></div>
            </div>
          </div>

          <div class="cp-field">
            <label for="cpPosition">Vị trí ứng tuyển</label>
            <select id="cpPosition">
              <option value="" disabled selected>-- Chọn vị trí --</option>
              <option value="quality-control">Quality Control — Operations</option>
              <option value="accountant">General Accountant — Finance</option>
              <option value="seller-pod">Seller POD — E-commerce</option>
              <option value="embroidery">Embroidery Technician — Production</option>
              <option value="graphic-designer">Graphic Designer — Creative Design</option>
              <option value="web-developer">Web Developer — Tech</option>
              <option value="video-creator">Video Creator — Media &amp; Production</option>
              <option value="leader-tiktok">Leader TikTokShop US — E-commerce</option>
              <option value="marketing">Internet Marketing — Online Marketing</option>
              <option value="other">Khác</option>
            </select>
            <div class="cp-err-msg" id="cpPositionErr" aria-live="polite"></div>
          </div>

          <div class="cp-field">
            <label for="cpMsg">Lời nhắn</label>
            <textarea id="cpMsg" placeholder="Giới thiệu ngắn về bản thân và lý do bạn muốn gia nhập Ethan…"></textarea>
            <div class="cp-err-msg" id="cpMsgErr" aria-live="polite"></div>
          </div>

          <div>
            <span class="cp-field-label">Upload CV (PDF / DOC)</span>
            <div class="cp-file-zone" id="cpFileZone">
              <input type="file" id="cpFile" accept=".pdf,.doc,.docx" aria-label="Chọn file CV">
              <span class="cp-file-icon">📎</span>
              <p class="cp-file-label">Kéo thả file vào đây hoặc <strong>Chọn tệp</strong><br><span style="font-size:16px;opacity:.6">PDF, DOC, DOCX — tối đa 5 MB</span></p>
              <p class="cp-file-name" id="cpFileName"></p>
            </div>
            <div class="cp-err-msg" id="cpFileErr" aria-live="polite"></div>
          </div>

          <button type="submit" class="cp-submit">Gửi thông tin →</button>
        </form>
      </div>
    </div>
  `;

  /* ── TRIGGER BUTTON HTML ── */
  const TRIGGER_HTML = `
    <button class="cp-trigger" id="cpTrigger" aria-label="Mở form ứng tuyển">
      <img src="assets/images/user.png" alt="" class="cp-trigger-icon-img">
      <span class="cp-trigger-text">
        <span class="cp-trigger-label">Tuyển dụng</span>
        <span class="cp-trigger-main">Ứng tuyển ngay</span>
      </span>
    </button>
  `;

  /* ── MOUNT ── */
  function mount() {
    const root = document.getElementById('contact-popup-root');
    if (!root) return;
    root.innerHTML = HTML + TRIGGER_HTML;
    initPopup();
  }

  /* ── CONTROLLER ── */
  function initPopup() {
    const overlay   = document.getElementById('cpOverlay');
    const closeBtn  = document.getElementById('cpClose');
    const form      = document.getElementById('cpForm');
    const fileInput = document.getElementById('cpFile');
    const fileZone  = document.getElementById('cpFileZone');
    const fileName  = document.getElementById('cpFileName');

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

    /* File input display */
    fileInput.addEventListener('change', function () {
      const f = this.files[0];
      if (f) {
        fileName.textContent = '✓ ' + f.name;
        fileName.classList.add('visible');
        document.getElementById('cpFileErr').textContent = '';
      } else {
        fileName.classList.remove('visible');
      }
    });

    /* Drag-over highlight */
    fileZone.addEventListener('dragover', function (e) { e.preventDefault(); fileZone.classList.add('cp-drag'); });
    fileZone.addEventListener('dragleave', function ()  { fileZone.classList.remove('cp-drag'); });
    fileZone.addEventListener('drop',      function (e) {
      e.preventDefault();
      fileZone.classList.remove('cp-drag');
      const f = e.dataTransfer.files[0];
      if (f) {
        const dt = new DataTransfer();
        dt.items.add(f);
        fileInput.files = dt.files;
        fileName.textContent = '✓ ' + f.name;
        fileName.classList.add('visible');
      }
    });

    /* Form submit */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validate()) showSuccess(close);
    });
  }

  /* ── VALIDATION ── */
  function validate() {
    let ok = true;

    function field(id, errId, msg) {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (msg) {
        el.classList.add('cp-error');
        if (err) err.textContent = msg;
        ok = false;
      } else {
        el.classList.remove('cp-error');
        if (err) err.textContent = '';
      }
    }

    const name     = document.getElementById('cpName');
    const email    = document.getElementById('cpEmail');
    const position = document.getElementById('cpPosition');
    const msg      = document.getElementById('cpMsg');

    field('cpName', 'cpNameErr',
      name.value.trim() ? '' : 'Vui lòng nhập họ và tên');

    const emailVal = email.value.trim();
    if (!emailVal) {
      field('cpEmail', 'cpEmailErr', 'Vui lòng nhập email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      field('cpEmail', 'cpEmailErr', 'Email không hợp lệ');
    } else {
      field('cpEmail', 'cpEmailErr', '');
    }

    field('cpPosition', 'cpPositionErr',
      position.value ? '' : 'Vui lòng chọn vị trí ứng tuyển');

    field('cpMsg', 'cpMsgErr',
      msg.value.trim() ? '' : 'Vui lòng nhập lời nhắn');

    return ok;
  }

  /* ── SUCCESS ── */
  function showSuccess(closeFn) {
    const dialog = document.getElementById('cpDialog');
    dialog.innerHTML = `
      <button class="cp-close" id="cpCloseSuccess" aria-label="Đóng">✕</button>
      <div class="cp-success">
        <div class="cp-success-icon">🎉</div>
        <h4>Đã nhận thông tin!</h4>
        <p>Đội ngũ Ethan Ecom sẽ liên hệ với bạn<br>trong vòng 24 giờ làm việc.</p>
      </div>
    `;
    document.getElementById('cpCloseSuccess').addEventListener('click', closeFn);
    setTimeout(closeFn, 4500);
  }

  /* ── BOOTSTRAP ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
