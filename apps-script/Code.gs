/**
 * ============================================================================
 * ETHAN ECOM — Webhook nhận form website & gửi email (Google Apps Script)
 * ----------------------------------------------------------------------------
 * Nhận dữ liệu từ 2 form trên website (Ứng tuyển + Liên hệ), gửi email từ
 * chính Gmail đang chạy script này. Hỗ trợ ĐÍNH KÈM CV (file thật).
 *
 * CÁCH DEPLOY (làm 1 lần):
 *   1. Vào https://script.google.com  → New project (đăng nhập bằng Gmail
 *      bạn muốn dùng làm người gửi, vd tuyendung.ethan@gmail.com).
 *   2. Xoá code mẫu, dán TOÀN BỘ file này vào.
 *   3. Sửa HR_EMAIL / SUPPORT_EMAIL bên dưới (khi TEST để gmail của bạn).
 *   4. Bấm "Deploy" (Triển khai) ▸ "New deployment" (Tùy chọn triển khai mới)
 *        • Select type / Chọn loại: "Web app" (Ứng dụng web)
 *        • Execute as / Thực thi bằng:  Me (Tôi)
 *        • Who has access / Ai có quyền: Anyone (Bất kỳ ai)
 *      ▸ Deploy ▸ cấp quyền (Authorize) cho tài khoản Gmail của bạn.
 *   5. Copy "Web app URL" (kết thúc bằng /exec) → dán vào WEBHOOK_URL trong
 *      assets/js/contact-popup.js.
 *
 * Cập nhật code sau này: Deploy ▸ Manage deployments ▸ Edit ▸ New version.
 * Quota Gmail thường: ~100 email/ngày (dư sức cho form tuyển dụng).
 * ============================================================================
 */

// ── CÁCH 2: HR/Support nhận chính + Gmail của bạn nhận bản sao ngầm (BCC) ──
// Người nhận CHÍNH của từng form (có thể ghi nhiều email cách nhau dấu phẩy).
var HR_EMAIL      = 'hr@ethanecom.com';        // form Ứng tuyển
var SUPPORT_EMAIL = 'support@ethanecom.com';   // form Liên hệ

// Bạn nhận BẢN SAO NGẦM (BCC) MỌI email của cả 2 form để theo dõi — người nhận
// chính KHÔNG thấy địa chỉ này. Để trống '' nếu không cần.
var BCC_ALL       = 'snowcute2103@gmail.com';

// ⓘ TEST đầu tiên: nếu hr@/support@ chưa có hộp thư thật, bạn vẫn nhận được
//   bản BCC ở Gmail trên (đủ để xác nhận luồng chạy). Muốn test gọn hơn thì
//   tạm đổi HR_EMAIL/SUPPORT_EMAIL = 'snowcute2103@gmail.com', xong đổi lại.

var SENDER_NAME   = 'Website Ethan Ecom';       // tên hiển thị người gửi

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.formType === 'careers') {
      sendCareers_(data);
    } else {
      sendContact_(data);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// GET chỉ để kiểm tra webhook còn sống (mở URL trên trình duyệt)
function doGet() {
  return json_({ ok: true, service: 'Ethan Ecom form webhook' });
}

function sendCareers_(d) {
  var pos = d.position || d.experience || '(không rõ vị trí)';
  var subject = 'Hồ sơ ứng tuyển mới — ' + pos;
  var rows = filterRows_([
    ['Họ và tên', d.name],
    ['Email liên lạc', d.email],
    ['Số điện thoại', d.phone],
    ['Vị trí ứng tuyển', d.position],
    ['Kinh nghiệm', d.experience],
    ['Lời nhắn', d.message]
  ]);
  var options = {
    htmlBody: buildTable_('Hồ sơ ứng tuyển mới', rows),
    name: SENDER_NAME,
    replyTo: d.email || HR_EMAIL
  };
  if (BCC_ALL) options.bcc = BCC_ALL;
  if (d.cv && d.cv.data) {
    var bytes = Utilities.base64Decode(d.cv.data);
    var blob = Utilities.newBlob(bytes, d.cv.mime || 'application/octet-stream', d.cv.name || 'CV');
    options.attachments = [blob];
  }
  MailApp.sendEmail(HR_EMAIL, subject, plain_(rows), options);
}

function sendContact_(d) {
  var subject = d.subject ? ('Liên hệ: ' + d.subject) : 'Liên hệ mới từ website Ethan Ecom';
  var rows = filterRows_([
    ['Tên', d.name],
    ['Email', d.email],
    ['Số điện thoại', d.phone],
    ['Dịch vụ quan tâm', d.service],
    ['Chủ đề', d.subject],
    ['Nội dung', d.message]
  ]);
  var options = {
    htmlBody: buildTable_('Tin nhắn liên hệ', rows),
    name: SENDER_NAME,
    replyTo: d.email || SUPPORT_EMAIL
  };
  if (BCC_ALL) options.bcc = BCC_ALL;
  MailApp.sendEmail(SUPPORT_EMAIL, subject, plain_(rows), options);
}

// Bỏ các dòng có giá trị trống để email gọn (form inline có nhiều field tuỳ chọn)
function filterRows_(rows) {
  return rows.filter(function (r) { return r[1] != null && String(r[1]).trim() !== ''; });
}

function buildTable_(title, rows) {
  var html = '<div style="font-family:Arial,Helvetica,sans-serif;color:#1A2433;max-width:640px">';
  html += '<h2 style="color:#16305C;margin:0 0 16px">' + escape_(title) + '</h2>';
  html += '<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%">';
  for (var i = 0; i < rows.length; i++) {
    var label = escape_(rows[i][0]);
    var value = escape_(rows[i][1] || '—').replace(/\n/g, '<br>');
    html += '<tr>' +
      '<td style="background:#EAF3FB;font-weight:bold;padding:10px 14px;border:1px solid #DCE6F0;width:180px;vertical-align:top">' + label + '</td>' +
      '<td style="padding:10px 14px;border:1px solid #DCE6F0;vertical-align:top">' + value + '</td>' +
      '</tr>';
  }
  html += '</table></div>';
  return html;
}

function plain_(rows) {
  return rows.map(function (r) { return r[0] + ': ' + (r[1] || '—'); }).join('\n');
}

function escape_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
