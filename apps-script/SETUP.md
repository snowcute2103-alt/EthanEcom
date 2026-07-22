# Gửi email form qua Google Apps Script (miễn phí, đính kèm CV)

Sơ đồ: **Website** → POST JSON (kèm CV base64) → **Webhook Apps Script** → `MailApp.sendEmail()` gửi từ Gmail của bạn → **HR / Support**.

Mật khẩu Gmail không bao giờ nằm trong website — nó ở trên máy chủ Google.

## Bước 1 — Deploy webhook (làm 1 lần, ~10 phút)
1. Tạo 1 Gmail riêng để làm người gửi (vd `tuyendung.ethan@gmail.com`) — hoặc dùng Gmail sẵn có.
2. Vào <https://script.google.com> → **New project**.
3. Xoá code mẫu, dán toàn bộ [`Code.gs`](Code.gs).
4. Sửa 2 dòng đầu `HR_EMAIL` / `SUPPORT_EMAIL`:
   - **Khi test:** để `snowcute2103@gmail.com` (đã đặt sẵn) để tự nhận thử.
   - **Production:** đổi thành `hr@ethanecom.com` / `support@ethanecom.com`.
5. **Deploy ▸ New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Bấm **Deploy** → **Authorize access** → chọn Gmail → *Advanced ▸ Go to project (unsafe)* → **Allow**. (Cảnh báo "unsafe" là bình thường vì app do chính bạn tạo.)
7. Copy **Web app URL** (kết thúc bằng `/exec`).

## Bước 2 — Nối vào website
Mở [`assets/js/contact-popup.js`](../assets/js/contact-popup.js), dán URL vào:
```js
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfy.../exec';
```
Để trống `''` thì website tự chạy FormSubmit như cũ (không đính kèm file).

## Bước 3 — Test
- Chạy site qua web server (không mở file:// ): `python3 -m http.server 8000` → <http://localhost:8000/tuyen-dung>.
- Bấm **Ứng tuyển ngay**, đính kèm 1 file PDF, gửi → kiểm tra hộp thư `HR_EMAIL`.
- Kiểm tra mở URL webhook trên trình duyệt thấy `{"ok":true,...}` là webhook còn sống.

## Gửi đồng thời cho HR và mail của bạn
Trong `Code.gs`:
- **Cả hai nhận ngang nhau** (thấy địa chỉ của nhau): ghi nhiều email ngăn cách dấu phẩy —
  `var HR_EMAIL = 'hr@ethanecom.com, snowcute2103@gmail.com';`
- **Bạn nhận bản sao ngầm (BCC)** để theo dõi, HR không thấy mail của bạn:
  `var BCC_ALL = 'snowcute2103@gmail.com';` (áp dụng cho cả 2 form; để `''` nếu không cần).

## Ghi chú
- Quota Gmail thường: ~100 email/ngày (dư cho form tuyển dụng).
- Sửa `Code.gs` sau này: **Deploy ▸ Manage deployments ▸ Edit ▸ Version: New version ▸ Deploy** (giữ nguyên URL).
- CV tối đa nên ≤ 5 MB (frontend đã chặn); Gmail cho tổng đính kèm tới ~25 MB.
