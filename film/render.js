// فيلم التدشين — المخرج: يصوّر الفيلم لقطةً لقطة (30 لقطة/ث) من صفحة الفيلم ومن بطاقات العضوية الحقيقية في المنصة.
// يعمل في GitHub Actions فقط (لا على السيرفر). المدخلات:
//   CLIENT=<ملف JSON>   ORI=l|p (أفقي/طولي)   OUT=<مجلد اللقطات>   [FRAMES=975]  [REPO=<جذر المستودع>]
// الشبكة: لا شيء يخرج إلى الإنترنت — صفحات المنصة تُقدَّم من نسخة المستودع، وواجهات البيانات بيانات العميل نفسه فقط.
'use strict';
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const DIR = __dirname, REPO = process.env.REPO || path.join(DIR, '..');
const C = JSON.parse(fs.readFileSync(process.env.CLIENT, 'utf8'));
const ORI = process.env.ORI === 'p' ? 'p' : 'l', OUT = process.env.OUT, FRAMES = +(process.env.FRAMES || 975), FPS = 30, Q = +(process.env.Q || 95);
const VP = ORI === 'p' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const HOST = 'staging.tera-services.com.sa', SITE = 'https://' + HOST;
const U = '11111111-2222-3333-4444-555555555555';
const MT = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/json' };
const file = (base, rel) => { const f = path.join(base, rel); if (!f.startsWith(base) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return null; return f; };
// page data: what the member page shows on the cards
const PAGE_CLIENT = { generic: !!C.generic, name_ar: C.name_ar, name_en: C.name_en, no: C.member_no || '', since: '', valid: '', tier_en: 'Terra Plus', tier_ar: 'تيرا بلس', points: Number(C.points || 0), launch: C.launched_at || new Date().toISOString() };
const MEMBERSHIP = { ok: true, exists: true, tier: C.tier || 'plus', status: 'active', member_no: C.member_no || 'TP-00000000', name_ar: C.name_ar, name_en: C.name_en, issued_at: C.issued_at || PAGE_CLIENT.launch, expires_at: C.expires_at || PAGE_CLIENT.launch,
  launched_at: PAGE_CLIENT.launch, launch_pending: false, points: { balance: PAGE_CLIENT.points, earned: PAGE_CLIENT.points, redeemed: 0, expiring_30: 0 }, ledger: [] };
const jwt = () => { const b = s => Buffer.from(JSON.stringify(s)).toString('base64url'); return b({ alg: 'HS256' }) + '.' + b({ sub: U }) + '.x'; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-color-profile=srgb', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--font-render-hinting=none'] });
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
  await ctx.route(/.*/, r => { const u = new URL(r.request().url()); const p = decodeURIComponent(u.pathname); const J = o => r.fulfill({ contentType: 'application/json', body: JSON.stringify(o) });
    if (u.host === 'fonts.googleapis.com') return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(path.join(DIR, 'fonts2', 'fonts.css'), 'utf8').replace(/url\(\/__fonts\//g, 'url(' + SITE + '/__fonts/') });
    if (u.host !== HOST) return r.abort();
    if (p.startsWith('/__fonts/')) { const f = file(path.join(DIR, 'fonts2'), p.slice(9)); return f ? r.fulfill({ body: fs.readFileSync(f), contentType: MT[path.extname(f)] || 'application/octet-stream', headers: { 'access-control-allow-origin': '*' } }) : r.fulfill({ status: 404, body: '' }); }
    if (p.startsWith('/__film/')) { const f = file(path.join(DIR, 'page'), p.slice(8)); if (!f) return r.fulfill({ status: 404, body: '' }); let body = fs.readFileSync(f); if (/\.html$/.test(f)) body = body.toString('utf8').replace('__CLIENT_JSON__', JSON.stringify(PAGE_CLIENT)); return r.fulfill({ body, contentType: MT[path.extname(f)] || 'application/octet-stream' }); }
    if (p === '/admin/api/config') return J({ ok: true, supabaseUrl: SITE + '/sb', supabaseAnonKey: 'ANON' });
    if (p === '/sb/rest/v1/users') return J([{ id: U, full_name: C.name_ar, email: 'member@tera-services.com.sa', phone: '966500000000', user_type: 'client', status: 'active', tera_id: 'USR-1', created_at: PAGE_CLIENT.launch }]);
    if (p === '/sb/rest/v1/user_roles') return J([{ role: 'client' }]);
    if (p.endsWith('/rpc/my_membership')) return J(MEMBERSHIP);
    if (/^\/(api|sb|admin\/api)\//.test(p)) return J(p.indexOf('/rpc/') >= 0 ? { ok: true, rows: [] } : (p.startsWith('/sb/rest') ? [] : { ok: true }));
    let q = p.endsWith('/') ? p + 'index.html' : p; const f = file(REPO, q.replace(/^\/+/, '')); if (!f) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ body: fs.readFileSync(f), contentType: MT[path.extname(f)] || 'application/octet-stream' }); });
  const sess = JSON.stringify({ access_token: jwt(), refresh_token: 'R', expires_at: Math.floor(Date.now() / 1000) + 86400 * 400, user: { id: U, email: 'member@tera-services.com.sa' } });
  await ctx.addInitScript(([s, t0]) => { try { if (!location.pathname.startsWith('/__film/')) { localStorage.setItem('tera.admin.session', s); localStorage.setItem('tera-preview-role', 'client'); localStorage.setItem('tera-theme', 'day'); } } catch (e) { } window.__VT_T0 = t0; }, [sess, Date.parse(PAGE_CLIENT.launch) || Date.now()]);
  await ctx.addInitScript(fs.readFileSync(path.join(DIR, 'vt.js'), 'utf8'));
  await ctx.addInitScript(() => { const s = () => { if (!document.head) return setTimeout(s, 5); if (location.pathname.startsWith('/__film/')) return; const st = document.createElement('style'); st.textContent = '.tw,.cx-ban,.tq-upd,.tq-ver,.pv-bar{display:none!important}*{caret-color:transparent!important;scroll-behavior:auto!important}'; document.head.appendChild(st); }; s(); });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(SITE + '/__film/' + (ORI === 'p' ? 'film_p.html' : 'film.html') + '?part=1'); await pg.evaluate(() => window.ready);
  const siteFrames = () => pg.frames().filter(f => f !== pg.mainFrame() && !f.isDetached() && !/\/__film\//.test(f.url()));
  const adv = (ms) => Promise.all(siteFrames().map(f => f.evaluate(ms => window.__vtAdvance ? window.__vtAdvance(ms) : 0, ms).catch(() => 0)));
  for (let i = 0; i < 110; i++) { await adv(100); await pg.waitForTimeout(10); }
  await pg.evaluate(() => window.liveInit()); for (let i = 0; i < 18; i++) { await adv(250); await pg.waitForTimeout(30); }
  await pg.evaluate(() => window.liveReady());
  const cdp = await ctx.newCDPSession(pg); const t1 = Date.now(); const ONLY = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
  for (let f = 0; f < FRAMES; f++) { if (ONLY && !ONLY.includes(f)) continue; await pg.evaluate(t => window.render(t, {}), f / FPS);
    const sh = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: Q }); fs.writeFileSync(path.join(OUT, 'f_' + String(f).padStart(5, '0') + '.jpg'), Buffer.from(sh.data, 'base64'));
    if (f % 150 === 0) console.log(ORI, f, ((Date.now() - t1) / 1000).toFixed(1) + 's'); }
  console.log('done', ORI, FRAMES, ((Date.now() - t1) / 1000).toFixed(1) + 's', errs.length ? 'page errors: ' + [...new Set(errs)].slice(0, 5).join(' | ') : '');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
