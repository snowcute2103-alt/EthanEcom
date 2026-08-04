#!/usr/bin/env node
/*
 * Sinh bản .min.css / .min.js từ source gốc trong assets/css và assets/js.
 * Luôn sửa file GỐC (không có .min) khi code — chạy `node tools/build-assets.js`
 * (hoặc `npm run build:min`) để cập nhật lại bản minify trước khi deploy.
 */
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');

const ROOT = path.join(__dirname, '..');

const CSS_FILES = ['assets/css/shared.css'];
const JS_FILES = [
  'assets/js/shared.js',
  'assets/js/contact-popup.js',
  'assets/js/page-animations.js',
  'assets/js/gsap-animations.js',
  'assets/js/world-map-paths.js',
];

async function buildCss(relPath) {
  const srcPath = path.join(ROOT, relPath);
  const outPath = srcPath.replace(/\.css$/, '.min.css');
  const input = fs.readFileSync(srcPath, 'utf8');
  // level 1 (an toàn): chỉ gỡ whitespace/comment/khoảng trắng thừa — không gộp/sắp
  // xếp lại rule (level 2), tránh rủi ro đổi thứ tự cascade trên CSS phức tạp nhiều
  // animation/media query như site này.
  const result = new CleanCSS({ level: 1 }).minify(input);
  if (result.errors.length) {
    throw new Error(`CleanCSS error in ${relPath}: ${result.errors.join('; ')}`);
  }
  fs.writeFileSync(outPath, result.styles);
  console.log(`CSS  ${relPath} -> ${path.relative(ROOT, outPath)}  (${input.length} -> ${result.styles.length} bytes)`);
}

async function buildJs(relPath) {
  const srcPath = path.join(ROOT, relPath);
  const outPath = srcPath.replace(/\.js$/, '.min.js');
  const input = fs.readFileSync(srcPath, 'utf8');
  const result = await minifyJs(input, { mangle: false, compress: true, format: { comments: false } });
  if (!result.code) {
    throw new Error(`Terser produced empty output for ${relPath}`);
  }
  fs.writeFileSync(outPath, result.code);
  console.log(`JS   ${relPath} -> ${path.relative(ROOT, outPath)}  (${input.length} -> ${result.code.length} bytes)`);
}

(async () => {
  for (const f of CSS_FILES) await buildCss(f);
  for (const f of JS_FILES) await buildJs(f);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
