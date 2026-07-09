const puppeteer = require('c:/Users/pottr/ethan/node_modules/puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 1});
  await page.goto('file:///c:/Users/pottr/ethan/index.html', {waitUntil: 'networkidle0', timeout: 30000});

  // Scroll through entire page to trigger IntersectionObserver animations
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < pageHeight; y += 500) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await new Promise(r => setTimeout(r, 120));
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({path: 'c:/Users/pottr/ethan/screenshot_full.png', fullPage: true});
  await browser.close();
  console.log('Done - screenshot saved');
})();
