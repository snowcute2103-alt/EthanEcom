#!/usr/bin/env python3
"""Hải trình 2026 — kiểu 'thước cong': mỗi đoạn dài = MỘT cubic Bezier.
Anchor = (x, y, góc tiếp tuyến độ, handle_vào, handle_ra).
Tiếp tuyến dùng chung cho đoạn vào + ra => trơn G1 tuyệt đối tại mọi anchor.
Góc: 0 = sang phải, 90 = xuống dưới (y hướng xuống). viewBox 1000x750.
"""
import math

#         x      y     θ°    vào   ra
A = [
    ( 461,  83,  -11,    0,  125),   # d1 Mới — ĐIỂM BẮT ĐẦU của đường

    # cung TRÒN thật: tâm (807,201) r≈155 đi qua đúng 2 chấm; handle = r·4/3·tan(α/4)
    ( 807,  46,    0,  125,   41),   # d2 Đột Phá — vào cung, tiếp tuyến ngang
    ( 916,  91,   45,   41,   46),   # A1 điểm 1/4 cung (φ=-45°)
    ( 961, 216,   96,   46,   60),   # d5 Như Ý — cuối cung (tiếp tuyến dọc), sau đó cuộn về trái
    ( 584, 245,  180,  135,  105),   # d4 Thấu Hiểu (đáy võng, nằm ngang)
    ( 304, 166,  182,  110,  150),   # d3 Tiến bước (đỉnh gợn tròn)
    (  59, 315,   90,  125,   48),   # d6 Đỉnh cao — cực trái, tiếp tuyến DỌC → từ d3 cong đều một mạch, hết phình
    # vòng xoắn kiểu NÉT VIẾT TAY (theo ảnh gốc): lượn xuống đáy → dâng lên sườn phải
    # → qua chóp → sườn trái đổ xuống CẮT CHÉO nét dâng → thoát xuống dưới về d7
    ( 150, 402,   12,   48,   22),   # T0 đáy lượn trước vòng (thấp)
    ( 233, 380,  -62,   22,   17),   # U  nét dâng lên sườn phải vòng
    ( 201, 350,  180,   17,   16),   # C  chóp vòng — sang trái
    ( 171, 378,   90,   16,   16),   # L  sườn trái đổ xuống (cắt nét dâng)
    ( 209, 408,   12,   17,   60),   # X  thoát đáy vòng — xuống dưới về phải
    ( 444, 432,    0,   95,  115),   # d7 áp lực — lượn êm, phẳng dần về chấm
    # khúc quành phải dưới: chấm Vươn xa LÀ đỉnh cung tròn (tâm 739,527 r=215) → cong tròn xuống luôn
    ( 739, 312,    0,  110,   62),   # d8 Vươn xa — đỉnh cung tròn (tiếp tuyến ngang), cong xuống luôn
    ( 900, 385,   49,   62,   62),   # Mid giữa cung tròn (φ=-41°) — không tạo móc ở chấm
    ( 952, 554,  120,   70,  110),   # d10 để đi xa — lượn mềm về d9
    ( 494, 511,  180,  165,  150),   # d9 Nhiệt huyết (đỉnh gợn nhẹ)
    (  81, 540,  163,  140,   34),   # d11 Phát triển
    (  20, 607,   95,   32,   36),   # BL1 mép trái vòng đáy
    (  75, 686,   20,   34,  120),   # BLb đáy vòng, bẻ sang ngang
    ( 423, 724,    0,  130,    0),   # d12 Rực rỡ — ĐIỂM KẾT THÚC của đường
]

def f(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s

d = [f'M {f(A[0][0])},{f(A[0][1])}']
for i in range(len(A) - 1):
    x1, y1, t1, _, o1 = A[i]
    x2, y2, t2, i2, _ = A[i + 1]
    r1, r2 = math.radians(t1), math.radians(t2)
    c1 = (x1 + o1 * math.cos(r1), y1 + o1 * math.sin(r1))
    c2 = (x2 - i2 * math.cos(r2), y2 - i2 * math.sin(r2))
    d.append(f'C {f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(x2)},{f(y2)}')

print('\n            '.join(d))
