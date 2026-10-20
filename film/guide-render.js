// فيديوهات «دليل تيرا» — يصوّر الصفحة film/page/guide/guide.html لقطةً لقطة (30 لقطة/ث) ثم تُرمَّز بـ ffmpeg.
//   V=sec|wa  ORI=l|p  OUT=<مجلد اللقطات>  [A=أول لقطة] [B=ما بعد آخر لقطة]  [Q=جودة jpeg]
// لا شيء يخرج إلى الإنترنت: الصفحة والخطوط وصور المنصة تُقدَّم من نسخة المستودع.
'use strict';
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const DIR = __dirname, REPO = path.join(DIR, '..');
const KIND = process.env.V === 'wa' ? 'wa' : 'sec', ORI = process.env.ORI === 'p' ? 'p' : 'l', OUT = process.env.OUT, FPS = 30, Qj = +(process.env.Q || 92);
const VP = ORI === 'p' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const MT = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const file = (base, rel) => { const f = path.join(base, rel); return f.startsWith(base) && fs.existsSync(f) && !fs.statSync(f).isDirectory() ? f : null; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-background-timer-throttling'] });
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 1 });
  await ctx.route(/.*/, r => { const u = new URL(r.request().url()); const p = decodeURIComponent(u.pathname);
    let f = null;
    if (p.startsWith('/__fonts/')) f = file(path.join(DIR, 'fonts2'), p.slice(9));
    else if (p.startsWith('/a/')) f = file(path.join(REPO, 'assets'), p.slice(3));
    else if (p.startsWith('/g/')) f = file(path.join(DIR, 'page', 'guide'), p.slice(3));
    if (!f) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ body: fs.readFileSync(f), contentType: MT[path.extname(f)] || 'application/octet-stream' }); });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('http://film.local/g/guide.html?v=' + KIND + '&o=' + ORI); await pg.evaluate(() => window.ready);
  const T = await pg.evaluate(() => window.duration);
  if (!process.env.A) fs.writeFileSync(path.join(OUT, 'sfx.json'), JSON.stringify(await pg.evaluate(() => ({ duration: window.duration, sfx: window.sfx })))); const N = Math.round(T * FPS);
  const A = Math.max(0, +(process.env.A || 0)), B = Math.min(N, +(process.env.B || N));
  const cdp = await ctx.newCDPSession(pg); const t1 = Date.now();
  for (let f = A; f < B; f++) {
    await pg.evaluate(t => window.render(t), f / FPS);
    const sh = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: Qj });
    fs.writeFileSync(path.join(OUT, 'f_' + String(f).padStart(5, '0') + '.jpg'), Buffer.from(sh.data, 'base64'));
    if (f % 300 === 0) console.log(KIND, ORI, f + '/' + N, ((Date.now() - t1) / 1000).toFixed(0) + 's');
  }
  console.log('done', KIND, ORI, A + '-' + B, ((Date.now() - t1) / 1000).toFixed(0) + 's', errs.length ? 'errors: ' + errs.slice(0, 3).join(' | ') : '');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
