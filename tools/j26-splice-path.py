#!/usr/bin/env python3
"""Thay d cua .j26-path trong vision.html bang path moi tu gen_path.py"""
import io, re, subprocess, sys

HTML = '/Users/admin/Downloads/Ethan-main/vision.html'
GEN = '/Users/admin/Downloads/Ethan-main/tools/j26-gen-path.py'

newd = subprocess.check_output(['python3', GEN], text=True).strip()

src = io.open(HTML, encoding='utf-8').read()
pat = re.compile(r'(<path class="j26-path" pathLength="1" d=")[^"]*(")', re.S)
m = pat.search(src)
if not m:
    sys.exit('KHONG tim thay j26-path')
src = src[:m.start()] + m.group(1) + '\n            ' + newd + m.group(2) + src[m.end():]
io.open(HTML, 'w', encoding='utf-8').write(src)
print('path replaced, %d segs' % newd.count('C '))
