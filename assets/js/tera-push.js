/* tera-push.js — تيرا على جهازك: التثبيت بضغطة + إشعارات الجوال والويب (تصل حتى والمنصة مغلقة)
 *  • التثبيت: كروم وإيدج وسامسونج على أندرويد والكمبيوتر = ضغطة واحدة ثم «تثبيت» في نافذة المتصفح.
 *    آيفون وآيباد وسفاري الماك لا تسمح بالتثبيت من زر داخل الموقع (قيد من أبل) — فنعرض الخطوات مع سهم إلى زر المشاركة.
 *  • الإشعارات: OneSignal على المنفذين الحيّين فقط (معرّف التطبيق لكل نطاق أدناه — معرّف عام وليس سرًا).
 *    ربط الجهاز بالحساب يتم من الخادم (/api/push/register) لا من المتصفح. في العيّنة كل شيء معاينة.
 *  • بلا أنماط أو سكربتات مضمّنة (CSP) — الأنماط في tera-notify.css.
 *  API: TeraPush.state() · install() · enable() · test() · off() · panel(opt) · on(fn) */
(function (W, D) {
  'use strict';
  if (W.TeraPush) return;
  var APPS = { 'staging.tera-services.com.sa': '79ac623c-a2c1-42ec-a839-af47dacaedd3' };
  var HOST = W.location.hostname, APP_ID = APPS[HOST] || '';
  var LIVE = /(^|\.)tera-services\.com\.sa$/.test(HOST);
  var SDK = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  var UA = navigator.userAgent || '';
  var IOS = /iPad|iPhone|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var IPAD = IOS && !/iPhone|iPod/.test(UA);
  var ANDROID = /Android/i.test(UA);
  var MAC_SAFARI = !IOS && /Macintosh/.test(UA) && /Safari\//.test(UA) && !/Chrome|Chromium|CriOS|Edg\//.test(UA);
  var FIREFOX = /Firefox\//.test(UA) && !ANDROID;
  var EDGE = /Edg\//.test(UA);
  function standalone() { try { return W.matchMedia('(display-mode: standalone)').matches || W.navigator.standalone === true; } catch (e) { return false; } }
  var S = { deferred: null, installed: standalone(), perm: ('Notification' in W) ? Notification.permission : 'unsupported', sub: false, busy: false, demoPerm: null };
  var subs = [];
  function fire() { subs.slice().forEach(function (f) { try { f(state()); } catch (e) { void e; } }); }
  function N() { return W.TeraNotify || { show: function (o) { W.alert((o.title || '') + '\n' + (o.text || '')); return { close: function () {} }; }, tile: function () { return ''; } }; }
  function el(tag, attrs, kids) {
    var n = D.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'class') n.className = attrs[k]; else if (k === 'html') n.innerHTML = attrs[k]; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]); else if (attrs[k] != null) n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? D.createTextNode(c) : c); });
    return n;
  }
  function show(o) { o.force = true; var h = N().show(o); return h || { close: function () {}, set: function () {} }; }
  function ls(k, v) { try { if (v === undefined) return W.localStorage.getItem(k); if (v === null) W.localStorage.removeItem(k); else W.localStorage.setItem(k, v); } catch (e) { return null; } return null; }
  function session() { try { var s = JSON.parse(ls('tera.admin.session') || 'null'); if (!s || !s.access_token || (s.expires_at && s.expires_at * 1000 < Date.now())) return null; return { token: s.access_token, uid: (s.user && s.user.id) || '' }; } catch (e) { return null; } }

  /* ---------- الجهاز ---------- */
  function device() {
    if (IOS) return IPAD ? 'آيباد' : 'آيفون';
    if (ANDROID) return 'أندرويد';
    if (/Windows/.test(UA)) return 'ويندوز';
    if (/Macintosh/.test(UA)) return 'ماك';
    return 'هذا الجهاز';
  }
  function browser() { return EDGE ? 'Edge' : /SamsungBrowser/.test(UA) ? 'Samsung Internet' : /CriOS|Chrome\//.test(UA) ? 'Chrome' : /Firefox|FxiOS/.test(UA) ? 'Firefox' : /Safari\//.test(UA) ? 'Safari' : 'المتصفح'; }
  function pushSupported() { return 'Notification' in W && 'serviceWorker' in navigator && 'PushManager' in W; }
  /* v395: هل هذا الجهاز مربوط بحساب الجلسة على الخادم (external_id)؟ — بدونه لا يصل الإشعار الموجَّه لهذا الحساب */
  function linked() { if (!APP_ID) return true; var se = session(); if (!se || !se.uid) return false; return String(ls('tera.push.reg') || '').indexOf(se.uid + ':') === 0; }
  function state() {
    var perm = APP_ID ? S.perm : (S.demoPerm || 'default'); /* العيّنة: معاينة لا تتأثر بإذن المتصفح الفعلي */
    return { live: !!APP_ID, device: device(), browser: browser(), installed: S.installed || standalone(), oneTap: !!S.deferred,
      ios: IOS, needsInstallForPush: IOS && !standalone(), supported: pushSupported() || IOS,
      perm: perm, on: perm === 'granted' && (S.sub || !APP_ID), blocked: perm === 'denied', linked: linked() };
  }

  /* ---------- التثبيت ---------- */
  W.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); S.deferred = e; fire(); });
  W.addEventListener('appinstalled', function () { S.installed = true; S.deferred = null; fire(); (bars || []).forEach(function (x) { x.hidden = true; }); show({ kind: 'ok', icon: 'squares-four:teal', title: 'تم تثبيت تطبيق تيرا', text: 'تجده بأيقونته على ' + (ANDROID ? 'الشاشة الرئيسية' : 'سطح المكتب وقائمة التطبيقات') + '، ويُفتح كتطبيق مستقل.' }); });

  var SHARE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H5v10h14V10h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var ADDSQ = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function steps(list) {
    return el('ol', { class: 'tp-steps' }, list.map(function (x, i) { return el('li', {}, [el('span', { class: 'tp-n' }, [String(i + 1)]), x[0] ? el('span', { class: 'tp-si', html: x[0] }) : null, el('span', { html: x[1] })]); }));
  }
  var arrowEl = null;
  function arrow(on) {
    if (arrowEl) { arrowEl.remove(); arrowEl = null; }
    if (!on) return;
    arrowEl = el('div', { class: 'tp-arrow' + (IPAD ? ' is-top' : ' is-left'), 'aria-hidden': 'true', html: '<b>' + (IPAD ? SHARE : '<span class="tp-d3">•••</span>') + '</b><i></i>' });
    D.body.appendChild(arrowEl);
  }
  /* ---------- دليل آيفون المصوّر: قبل وبعد + 6 خطوات بصور حقيقية من iOS (Safari) ---------- */
  var GI = 'guide/ios/';
  /* Safari ما لم يظهر توقيع متصفح آخر أو متصفح داخل تطبيق (لا نشترط كلمة Safari في المعرّف: «طلب موقع سطح المكتب» وبعض إصدارات iOS تغيّرها) */
  function inSafari() { return IOS && !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|GSA\/|YaBrowser|DuckDuckGo|Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|Twitter|TikTok|musical_ly|Telegram|WhatsApp|LinkedInApp|Pinterest/.test(UA); }
  /* منذ iOS 16.4 يضيف Chrome (وEdge وFirefox) المواقع إلى الشاشة الرئيسية كتطبيق — ويستقبل الإشعارات بعدها مثل Safari */
  var I_CHROME = IOS && /CriOS/.test(UA), I_OTHER = IOS && /EdgiOS|FxiOS/.test(UA);
  function iosOk() { return inSafari() || I_CHROME || I_OTHER; }
  var CHROME_STORE = 'https://apps.apple.com/app/google-chrome/id535886823';
  function img(src, alt, cls) { return el('img', { class: cls || 'tg-img', src: GI + src + '.webp', alt: alt, loading: 'lazy', decoding: 'async' }); }
  var HELP_WA = 'https://wa.me/966555698774?text=' + encodeURIComponent('مرحبًا فريق تيرا، أحتاج مساعدة في إضافة تيرا إلى جهازي.');
  var HELP_MAIL = 'mailto:support@tera-services.com.sa?subject=' + encodeURIComponent('مساعدة في إضافة تيرا إلى جهازي');
  function helpBox(slug) {
    return el('div', { class: 'tg-help' }, [el('span', {}, ['إذا واجهتك مشكلة، فريقنا جاهز لمساعدتك وإرشادك.']),
      el('span', { class: 'tg-hl' }, [el('button', { type: 'button', class: 'tg-hb is-g', onclick: function () { openGuide(slug == null ? 'app' : slug); } }, ['الدليل الكامل']),
        el('a', { class: 'tg-hb', href: HELP_WA, target: '_blank', rel: 'noopener' }, ['واتساب']), el('a', { class: 'tg-hb', href: HELP_MAIL }, ['البريد'])])]);
  }
  /* «دليل تيرا»: صفحات حقيقية داخل الموقع (/guide و /guide/<طريقة>) — من أي مكان في المنصة أو البوابة */
  var GUIDES = ['app', 'authenticator', 'extra', 'whatsapp', 'email', 'notifications', 'devices', 'session', 'recovery'];
  function openGuide(slug) {
    slug = GUIDES.indexOf(slug) >= 0 ? slug : ''; var p = '/guide' + (slug ? '/' + slug : '');
    if (tgOpen) tgOpen.close();
    try { var c = N().current && N().current(); if (c && c.close) c.close('guide'); } catch (e) { void e; }
    if (W.__teraSite && D.getElementById('pv-site-f')) { W.__teraSite.go(p); return p; }
    W.location.href = new URL('../home/#' + p, D.baseURI).href; return p;
  }
  var tgOpen = null;
  function iosGuide(why) {
    if (tgOpen) tgOpen.close();
    var i = iosOk() ? 0 : 1, wrap, card, body, dots, prev, next;
    function ttl(t, sub) { return [el('b', { class: 'tg-t' }, [t]), sub ? el('p', { class: 'tg-p' }, [sub]) : null]; }
    var SCR = [
      function () {
        return [el('div', { class: 'tg-hero' }, [el('img', { class: 'tg-app', src: 'brand/icon-192.png', alt: '' }), el('div', {}, ttl('احصل على تطبيق تيرا', (why ? why + ' ' : '') + 'اتبع الدليل خطوة بخطوة — أسهل في الاستخدام ووصول أسرع، في دقيقة واحدة.'))]),
          el('ul', { class: 'tg-ben' }, ['تطبيق تيرا بأيقونته على شاشتك الرئيسية — يُفتح بلمسة', 'يعمل بملء الشاشة كأي تطبيق — مساحة أكبر وتركيز أعلى', 'إشعارات السداد والقبول والأمان على شاشة القفل', 'أسرع في إنجاز أعمالك ومتابعتها في أي وقت'].map(function (t) { return el('li', {}, [t]); })),
          el('div', { class: 'tg-ba' }, [
            el('figure', {}, [img('before', 'المنصة داخل المتصفح'), el('figcaption', {}, [el('b', {}, ['قبل']), ' الموقع داخل المتصفح'])]),
            el('figure', { class: 'is-after' }, [img('after', 'تطبيق تيرا بملء الشاشة'), el('figcaption', {}, [el('b', {}, ['بعد']), ' تطبيق تيرا على جوالك'])])])];
      },
    ];
    function shot(src, alt) { return el('img', { class: 'tg-shot', src: GI + src + '.webp', alt: alt, loading: 'lazy', decoding: 'async' }); }
    function fig(src, alt, cap) { return el('figure', {}, [shot(src, alt), el('figcaption', {}, [cap])]); }
    var STEPS = [];
    if (!iosOk()) STEPS.push(function (k) {
      var link = W.location.origin + '/home/';
      return [el('div', { class: 'tg-row' }, [img('safari', 'Safari', 'tg-saf'), img('chrome', 'Chrome', 'tg-saf'), el('div', {}, ttl(k + 'افتح تيرا في Safari أو Chrome', 'أنت الآن داخل تطبيق آخر. الحصول على تطبيق تيرا والإشعارات يعمل من Safari أو Chrome.'))]),
        el('div', { class: 'tg-warn' }, [el('span', {}, ['افتح تيرا في Chrome مباشرة، أو انسخ الرابط والصقه في Safari.']),
          el('a', { class: 'tg-btn', href: 'googlechromes://' + W.location.host + '/home/' }, ['افتح في Chrome']),
          el('button', { type: 'button', class: 'tg-btn is-o', onclick: function (e) { var bt = e.currentTarget; (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { bt.textContent = 'نُسخ الرابط ✓'; }, function () { bt.textContent = link; }); } }, ['نسخ رابط المنصة'])]),
        el('div', { class: 'tg-store' }, [el('span', {}, ['لا يوجد المتصفح في جوالك؟ حمّله مجانًا من App Store:']),
          img('appstore-safari', 'Safari في App Store'), el('a', { class: 'tg-btn', href: 'https://apps.apple.com/app/safari/id1146562112', target: '_blank', rel: 'noopener' }, ['Safari في App Store']),
          img('appstore-chrome', 'Google Chrome في App Store'), el('a', { class: 'tg-btn', href: CHROME_STORE, target: '_blank', rel: 'noopener' }, ['Chrome في App Store'])])];
    });
    STEPS.push(function (k) { return (I_CHROME ? ttl(k + 'اضغط «•••» أسفل Chrome، ثم «مشاركة…»', 'أو اضغط زر المشاركة ⬆︎ في شريط العنوان أعلى الصفحة.').concat([shot('c1-more', 'زر النقاط الثلاث أسفل Chrome')])
      : I_OTHER ? ttl(k + 'افتح قائمة المتصفح، ثم «مشاركة»', 'زر القائمة في شريط المتصفح.')
      : ttl(k + 'اضغط «•••» أسفل الشاشة، ثم «مشاركة»', 'الزر بجانب شريط العنوان في أسفل Safari.').concat([shot('f1-more', 'زر النقاط الثلاث أسفل Safari')])).concat([
      el('button', { type: 'button', class: 'tg-link', onclick: function () { close(); arrow(true); setTimeout(function () { arrow(false); }, 9000); } }, ['أغلق الدليل وأرني الزر'])]); });
    STEPS.push(function (k) { return ttl(k + 'اختر «إضافة إلى الصفحة الرئيسية»', 'اسحب نافذة المشاركة للأعلى تجدها في القائمة مباشرة.').concat([el('div', { class: 'tg-two' }, [
      fig('f2-add', 'إضافة إلى الصفحة الرئيسية في نافذة المشاركة', 'تجدها هنا مباشرة'), fig('f2b-more', 'زر عرض المزيد في نافذة المشاركة', 'إن لم تجدها: اضغط «عرض المزيد»')])]); });
    STEPS.push(function (k) { return ttl(k + 'اضغط «إضافة»', (I_CHROME || I_OTHER ? 'إن ظهر «فتح كتطبيق ويب» فاتركه مفعّلًا. ' : '«فتح كتطبيق ويب» مفعّل تلقائيًا، ') + 'والاسم «تيرا» والأيقونة جاهزان — فقط وافق.').concat([shot('f3-confirm', 'نافذة الإضافة إلى الصفحة الرئيسية')]); });
    STEPS.push(function (k) { return [el('div', { class: 'tg-row is-c' }, [img('s5-icon', 'أيقونة تيرا على الشاشة الرئيسية', 'tg-ico')]), el('div', {}, ttl(k + 'افتح تطبيق تيرا من الشاشة الرئيسية', 'مبروك! تطبيق تيرا جاهز على جوالك. فعّل منه الإشعارات لتصلك على شاشة القفل حتى والتطبيق مغلق.'))]; });
    STEPS.forEach(function (f, j) { SCR.push(function () { return f('١٢٣٤٥٦'.charAt(j) + '. '); }); });
    function paint() {
      body.textContent = ''; SCR[i]().forEach(function (n) { if (n) body.appendChild(n); }); body.appendChild(helpBox()); body.scrollTop = 0;
      dots.textContent = ''; SCR.forEach(function (_, k) { dots.appendChild(el('i', { class: k === i ? 'is-on' : '' })); });
      prev.hidden = i === 0; next.textContent = i === 0 ? 'ابدأ الخطوات' : i === SCR.length - 1 ? 'تم' : 'التالي';
    }
    function close() { if (!wrap) return; wrap.remove(); wrap = null; tgOpen = null; D.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    body = el('div', { class: 'tg-body' }); dots = el('div', { class: 'tg-dots', 'aria-hidden': 'true' });
    prev = el('button', { type: 'button', class: 'tg-nav' }, ['السابق']); next = el('button', { type: 'button', class: 'tg-nav is-p' }, ['التالي']);
    prev.addEventListener('click', function () { if (i > 0) { i--; paint(); } });
    next.addEventListener('click', function () { if (i < SCR.length - 1) { i++; paint(); } else close(); });
    card = el('div', { class: 'tg-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'احصل على تطبيق تيرا' }, [el('button', { type: 'button', class: 'tg-x', 'aria-label': 'إغلاق', onclick: close }, ['×']), body, el('div', { class: 'tg-foot' }, [prev, dots, next])]);
    wrap = el('div', { class: 'tg-wrap', dir: 'rtl' }, [card]);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    D.addEventListener('keydown', esc);
    D.body.appendChild(wrap); paint(); card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true });
    tgOpen = { close: close };
    return tgOpen;
  }

  /* ---------- أندرويد: نتعرّف على المتصفح عند الدخول ونعرض الطريق المناسب ----------
   *  Chrome / Edge / Samsung Internet = تثبيت بضغطة (نافذة المتصفح) أو من القائمة إن لم تظهر.
   *  المتصفح داخل التطبيقات (واتساب، إنستغرام…) لا يثبّت المواقع ← نفتح الرابط في Chrome مباشرة. */
  var A_INAPP = ANDROID && /; wv\)|FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|TikTok|musical_ly|WhatsApp|Telegram|LinkedInApp|Pinterest|GSA\//.test(UA);
  var A_SAMSUNG = ANDROID && /SamsungBrowser/.test(UA);
  var A_FIREFOX = ANDROID && /Firefox\//.test(UA);
  function chromeIntent() { return 'intent://' + W.location.host + '/home/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(W.location.origin + '/home/') + ';end'; }
  function wizard(label, SCR, start) {
    if (tgOpen) tgOpen.close();
    var i = start || 0, wrap, card, body, dots, prev, next;
    function paint() {
      body.textContent = ''; SCR[i]().forEach(function (n) { if (n) body.appendChild(n); }); body.appendChild(helpBox('app')); body.scrollTop = 0;
      dots.textContent = ''; SCR.forEach(function (_, k) { dots.appendChild(el('i', { class: k === i ? 'is-on' : '' })); });
      prev.hidden = i === 0; next.textContent = i === 0 ? 'ابدأ الخطوات' : i === SCR.length - 1 ? 'تم' : 'التالي';
    }
    function close() { if (!wrap) return; wrap.remove(); wrap = null; tgOpen = null; D.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    body = el('div', { class: 'tg-body' }); dots = el('div', { class: 'tg-dots', 'aria-hidden': 'true' });
    prev = el('button', { type: 'button', class: 'tg-nav' }, ['السابق']); next = el('button', { type: 'button', class: 'tg-nav is-p' }, ['التالي']);
    prev.addEventListener('click', function () { if (i > 0) { i--; paint(); } });
    next.addEventListener('click', function () { if (i < SCR.length - 1) { i++; paint(); } else close(); });
    card = el('div', { class: 'tg-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': label }, [el('button', { type: 'button', class: 'tg-x', 'aria-label': 'إغلاق', onclick: close }, ['×']), body, el('div', { class: 'tg-foot' }, [prev, dots, next])]);
    wrap = el('div', { class: 'tg-wrap', dir: 'rtl' }, [card]);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    D.addEventListener('keydown', esc);
    D.body.appendChild(wrap); paint(); card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true });
    tgOpen = { close: close, go: function (k) { i = k; paint(); } };
    return tgOpen;
  }
  /* رسوم توضيحية مبسّطة (ليست لقطات) لشاشات أندرويد */
  function aMock(kind) {
    var host = W.location.host || 'tera-services.com.sa', ic = '<img src="brand/icon-192.png" alt="">';
    var M = {
      bar: A_SAMSUNG
        ? '<div class="ag-ph"><div class="ag-url">' + host + '</div><div class="ag-page"></div><div class="ag-nav"><i>‹</i><i>›</i><i>⌂</i><i>▢</i><b class="ag-hit">≡</b></div></div>'
        : '<div class="ag-ph"><div class="ag-top"><span class="ag-url">' + host + '</span><b class="ag-hit">⋮</b></div><div class="ag-page"></div></div>',
      menu: '<div class="ag-ph"><div class="ag-top"><span class="ag-url">' + host + '</span><b>⋮</b></div><ul class="ag-menu' + (A_SAMSUNG ? ' is-bottom' : '') + '">' +
        (A_SAMSUNG ? '<li>الإشارات المرجعية</li><li>السجل</li><li class="ag-hit">إضافة صفحة إلى ← الشاشة الرئيسية</li><li>الإعدادات</li>'
                   : '<li>علامة تبويب جديدة</li><li>السجل</li><li>التنزيلات</li><li class="ag-hit">تثبيت التطبيق</li><li>مشاركة…</li><li>الإعدادات</li>') + '</ul></div>',
      dialog: '<div class="ag-ph is-dim"><div class="ag-dlg"><b>تثبيت التطبيق؟</b><div class="ag-app">' + ic + '<span><b>تيرا</b><small>' + host + '</small></span></div><div class="ag-btns"><span>إلغاء</span><span class="ag-hit">تثبيت</span></div></div></div>',
      home: '<div class="ag-ph is-home"><div class="ag-grid">' + ['#3DDC84', '#1DA1F2', '#F4B400', '#E1306C', '#25D366', '#5865F2', '#FF6F00', '#9C27B0'].map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join('') + '<span class="ag-me">' + ic + '<small>تيرا</small></span></div></div>'
    };
    return el('div', { class: 'ag-fig', 'aria-hidden': 'true', html: M[kind] + '<small class="ag-note">رسم توضيحي — قد يختلف شكل القائمة قليلًا حسب جهازك</small>' });
  }
  function androidGuide(why) {
    function ttl(t, sub) { return [el('b', { class: 'tg-t' }, [t]), sub ? el('p', { class: 'tg-p' }, [sub]) : null]; }
    var browser = A_SAMSUNG ? 'Samsung Internet' : A_FIREFOX ? 'Firefox' : EDGE ? 'Edge' : 'Chrome';
    var SCR = [function () {
      var out = [el('div', { class: 'tg-hero' }, [el('img', { class: 'tg-app', src: 'brand/icon-192.png', alt: '' }), el('div', {}, ttl('احصل على تطبيق تيرا', (why ? why + ' ' : '') + 'جهازك أندرويد' + (A_INAPP ? '' : ' · ' + browser) + ' — أسهل في الاستخدام ووصول أسرع، في دقيقة واحدة.'))]),
        el('ul', { class: 'tg-ben' }, ['تطبيق تيرا بأيقونته على شاشتك الرئيسية وفي قائمة التطبيقات', 'يُفتح بملء الشاشة كأي تطبيق — بلا شريط المتصفح', 'إشعارات السداد والقبول والأمان فورًا حتى والتطبيق مغلق', 'لا يحتاج متجرًا ولا مساحة تُذكر، ويتحدّث تلقائيًا'].map(function (t) { return el('li', {}, [t]); }))];
      if (S.deferred) out.push(el('button', { type: 'button', class: 'tg-btn ag-now', onclick: function () { if (tgOpen) tgOpen.close(); install(); } }, ['ثبّت الآن بضغطة واحدة']), el('p', { class: 'tg-p' }, ['تظهر نافذة المتصفح فتضغط «تثبيت». لم تظهر؟ اضغط «ابدأ الخطوات».']));
      if (A_INAPP) out.push(el('div', { class: 'tg-warn' }, [el('span', {}, ['أنت تتصفح من داخل تطبيق (مثل واتساب أو إنستغرام) — والتثبيت يتم من Chrome.']), el('a', { class: 'tg-btn', href: chromeIntent() }, ['افتح تيرا في Chrome'])]));
      return out;
    }];
    var ST = [];
    if (A_INAPP) ST.push(function (k) { var link = W.location.origin + '/home/'; return ttl(k + 'افتح تيرا في Chrome', 'المتصفح داخل التطبيقات لا يدعم تثبيت التطبيقات.').concat([
      el('a', { class: 'tg-btn', href: chromeIntent() }, ['افتح في Chrome']),
      el('button', { type: 'button', class: 'tg-link', onclick: function (e) { var bt = e.currentTarget; (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { bt.textContent = 'نُسخ الرابط ✓ — الصقه في Chrome'; }, function () { bt.textContent = link; }); } }, ['أو انسخ الرابط والصقه في Chrome'])]); });
    ST.push(function (k) { return ttl(k + (A_SAMSUNG ? 'اضغط «≡» أسفل الشاشة' : 'اضغط «⋮» أعلى الشاشة'), A_SAMSUNG ? 'زر القائمة في الشريط السفلي لـ Samsung Internet.' : 'زر النقاط الثلاث بجانب شريط العنوان في ' + browser + '.').concat([aMock('bar')]); });
    ST.push(function (k) { return ttl(k + (A_SAMSUNG ? 'اختر «إضافة صفحة إلى» ثم «الشاشة الرئيسية»' : 'اختر «تثبيت التطبيق»'), A_SAMSUNG ? '' : 'في بعض الأجهزة تظهر باسم «إضافة إلى الشاشة الرئيسية».').concat([aMock('menu')]); });
    ST.push(function (k) { return ttl(k + 'اضغط «تثبيت»', 'الاسم «تيرا» والأيقونة جاهزان — فقط وافق.').concat([aMock('dialog')]); });
    ST.push(function (k) { return ttl(k + 'افتح تطبيق تيرا من الشاشة الرئيسية', 'مبروك! تطبيق تيرا جاهز على جوالك. فعّل منه الإشعارات لتصلك فورًا.').concat([aMock('home')]); });
    ST.forEach(function (f, j) { SCR.push(function () { return f('١٢٣٤٥٦'.charAt(j) + '. '); }); });
    return wizard('احصل على تطبيق تيرا — أندرويد', SCR, 0);
  }
  function guide(kind, why) {
    if (kind === 'ios') return iosGuide(why);
    if (kind === 'android') return androidGuide(why);
    var G = {
      ios: ['احصل على تطبيق تيرا', (why ? why + ' ' : '') + 'أبل لا تسمح بالإضافة من زر داخل الموقع، وهي ثلاث لمسات فقط:',
        [[SHARE, 'اضغط زر المشاركة <b>' + (IPAD ? 'أعلى الشاشة' : 'أسفل الشاشة') + '</b> في Safari'], [ADDSQ, 'اختر <b>«إضافة إلى الشاشة الرئيسية»</b> ثم <b>«إضافة»</b>'], ['', 'افتح <b>«تيرا»</b> من أيقونتها، واضغط <b>«تفعيل الإشعارات»</b>']]],
      mac: ['احصل على تطبيق تيرا على الماك', 'من Safari على الماك (macOS Sonoma أو أحدث):',
        [['', 'من شريط القوائم اختر <b>«ملف»</b>'], ['', 'ثم <b>«إضافة إلى Dock»</b> واضغط <b>«إضافة»</b>'], ['', 'افتح تطبيق تيرا من Dock وفعّل الإشعارات منه']]],
      firefox: ['احصل على تطبيق تيرا من Chrome أو Edge', 'متصفح Firefox على الكمبيوتر لا يدعم تثبيت المواقع كتطبيقات. الإشعارات تعمل فيه، وللتثبيت افتح المنصة في Chrome أو Edge واضغط «ثبّت تيرا».', []],
      menu: ['احصل على تطبيق تيرا من قائمة المتصفح', 'إن لم تظهر نافذة التثبيت:',
        [['', EDGE ? 'افتح قائمة <b>«…»</b> أعلى المتصفح' : 'افتح قائمة <b>«⋮»</b> أعلى المتصفح'], ['', EDGE ? '<b>«التطبيقات»</b> ← <b>«تثبيت هذا الموقع كتطبيق»</b>' : ANDROID ? '<b>«إضافة إلى الشاشة الرئيسية»</b> ← <b>«تثبيت»</b>' : '<b>«حفظ ومشاركة»</b> ← <b>«تثبيت الصفحة كتطبيق»</b>'], ['', 'تُفتح تيرا بعدها كتطبيق مستقل بأيقونتها']]]
    }[kind];
    return show({ kind: 'info', icon: kind === 'ios' ? 'device-mobile:sky' : 'monitor:teal', title: G[0], text: G[1], body: (function () { var b = el('div', { class: 'tg-gb' }, [G[2].length ? steps(G[2]) : null, helpBox()]); return b; })(), ms: 0,
      actions: [{ label: 'فهمت', primary: true }], onClose: function () { arrow(false); } });
  }
  function install() {
    if (standalone()) { show({ kind: 'ok', icon: 'squares-four:teal', title: 'تطبيق تيرا مثبّت على جهازك', text: 'أنت تستخدم تطبيق تيرا الآن.' }); return Promise.resolve('installed'); }
    if (S.deferred) {
      var e = S.deferred; S.deferred = null;
      return e.prompt().then(function () { return e.userChoice; }).then(function (c) {
        fire();
        if (c && c.outcome === 'accepted') return 'accepted';
        show({ kind: 'info', icon: 'squares-four:teal', title: 'لم يُثبَّت تطبيق تيرا', text: 'يمكنك تثبيته لاحقًا من الزر نفسه أو من قائمة المتصفح.' }); return 'dismissed';
      }).catch(function () { guide(ANDROID ? 'android' : 'menu'); return 'error'; });
    }
    guide(IOS ? 'ios' : ANDROID ? 'android' : MAC_SAFARI ? 'mac' : FIREFOX ? 'firefox' : 'menu');
    return Promise.resolve('guide');
  }

  /* ---------- الإشعارات (OneSignal) ---------- */
  var sdkP = null;
  function sdk() {
    if (!APP_ID) return Promise.reject(new Error('no_app'));
    if (sdkP) return sdkP;
    sdkP = new Promise(function (ok, bad) {
      W.OneSignalDeferred = W.OneSignalDeferred || [];
      W.OneSignalDeferred.push(function (OS) {
        return OS.init({ appId: APP_ID, serviceWorkerPath: 'assets/push/OneSignalSDKWorker.js', serviceWorkerParam: { scope: '/assets/push/' },
          notifyButton: { enable: false }, autoResubscribe: true }).then(function () {
          try { OS.User.PushSubscription.addEventListener('change', function () { S.sub = !!OS.User.PushSubscription.optedIn; fire(); register(OS); }); } catch (e) { void e; }
          /* v396: الضغط على الإشعار والتطبيق مفتوح في الخلفية (الآيفون يكتفي بإظهار التطبيق) — نعرض الإشعار نفسه */
          try { OS.Notifications.addEventListener('click', function (ev) { var n = ev && ev.notification; if (!n || !W.TQ_PUSH_SHOW) return; var d = n.additionalData || {}; W.TQ_PUSH_SHOW({ k: d.k || '', t: n.title || '', b: n.body || '' }); }); } catch (e) { void e; }
          S.sub = !!(OS.User && OS.User.PushSubscription && OS.User.PushSubscription.optedIn); fire(); ok(OS);
        }, bad);
      });
      var s = D.createElement('script'); s.src = SDK; s.defer = true; s.onerror = function () { bad(new Error('sdk')); }; D.head.appendChild(s);
    });
    return sdkP;
  }
  function register(OS) {
    var se = session(); if (!se || !OS || !OS.User || !OS.User.PushSubscription) return Promise.resolve(false);
    var sid = OS.User.PushSubscription.id; if (!sid || !OS.User.PushSubscription.optedIn) return Promise.resolve(false);
    var key = se.uid + ':' + sid; if (ls('tera.push.reg') === key) return Promise.resolve(true);
    return fetch('/api/push/register', { method: 'POST', cache: 'no-store', credentials: 'same-origin', headers: { Authorization: 'Bearer ' + se.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription_id: sid }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); }).then(function (j) { if (j && j.ok) { ls('tera.push.reg', key); fire(); } return !!(j && j.ok); }).catch(function () { return false; });
  }
  function enable(opt) {
    opt = opt || {};
    if (IOS && !standalone() && !opt.demo) { guide('ios', 'في الآيفون تصل الإشعارات بعد إضافة تيرا إلى الشاشة الرئيسية.'); return Promise.resolve('ios'); }
    if (!APP_ID || opt.demo) {
      S.demoPerm = 'granted'; fire();
      show({ kind: 'ok', icon: 'bell-ringing:teal', title: 'فُعّلت الإشعارات على هذا الجهاز', text: 'ستصلك تذكيرات السداد والقبول والأمان حتى والمنصة مغلقة. (معاينة في العيّنة)' });
      if (opt.onDemo) opt.onDemo();
      return Promise.resolve('demo');
    }
    if (!pushSupported()) { show({ kind: 'warn', title: 'المتصفح لا يدعم الإشعارات', text: 'حدّث المتصفح أو استخدم Chrome أو Edge أو Safari الحديث.' }); return Promise.resolve('unsupported'); }
    if (S.perm === 'denied') { show({ kind: 'warn', icon: 'bell:saffron', title: 'الإشعارات محظورة لهذا الموقع', text: 'اسمح بها من إعدادات الموقع في المتصفح (رمز القفل بجانب العنوان ← الإشعارات ← السماح)، ثم أعد المحاولة.', ms: 0, actions: [{ label: 'فهمت', primary: true }] }); return Promise.resolve('denied'); }
    var h = show({ kind: 'run', title: 'جارٍ تفعيل الإشعارات…', text: 'اختر «السماح» في نافذة المتصفح.', ms: 0 });
    return sdk().then(function (OS) {
      return OS.Notifications.requestPermission().then(function () { S.perm = Notification.permission; if (S.perm === 'granted') return OS.User.PushSubscription.optIn().then(function () { return OS; }); return null; });
    }).then(function (OS) {
      if (h && h.close) h.close('replaced');
      if (!OS) { fire(); show({ kind: 'warn', icon: 'bell:saffron', title: 'لم تُفعَّل الإشعارات', text: 'لم يُسمح بالإشعارات. يمكنك تفعيلها لاحقًا من «تفضيلات الإشعارات».' }); return 'denied'; }
      return waitId(OS).then(function () { return register(OS); }).then(function (ok) {
        S.sub = true; fire();
        show({ kind: 'ok', icon: 'bell-ringing:teal', title: 'فُعّلت الإشعارات على هذا الجهاز', text: ok ? 'رُبط الجهاز بحسابك — ستصلك التنبيهات حتى والمنصة مغلقة.' : 'فُعّلت الإشعارات، وتُربط بحسابك عند تسجيل الدخول.' });
        return 'on';
      });
    }).catch(function () { if (h && h.close) h.close('replaced'); show({ kind: 'bad', title: 'تعذّر تفعيل الإشعارات', text: 'تحقق من الاتصال ثم أعد المحاولة.' }); return 'error'; });
  }
  function waitId(OS) { return new Promise(function (ok) { var n = 0; (function t() { if ((OS.User.PushSubscription.id) || n++ > 20) return ok(); setTimeout(t, 250); })(); }); }
  function test(opt) {
    opt = opt || {};
    if (!APP_ID || opt.demo) { if (opt.onDemo) opt.onDemo(); show({ kind: 'ok', icon: 'paper-plane-tilt:teal', title: 'أُرسل إشعار تجريبي', text: 'يظهر على شاشة القفل وسطح المكتب. (معاينة)' }); return Promise.resolve(true); }
    var se = session(); if (!se) { show({ kind: 'warn', title: 'سجّل الدخول أولًا' }); return Promise.resolve(false); }
    return fetch('/api/push/test-me', { method: 'POST', cache: 'no-store', credentials: 'same-origin', headers: { Authorization: 'Bearer ' + se.token } })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { show(j && j.ok ? { kind: 'ok', icon: 'paper-plane-tilt:teal', title: 'أُرسل إشعار تجريبي', text: 'يصل خلال ثوانٍ إلى كل أجهزتك المفعّلة.' } : { kind: 'bad', title: 'لم يُرسل الإشعار', text: (j && j.message) || 'تعذّر الإرسال.' }); return !!(j && j.ok); });
  }
  function off() {
    if (!APP_ID) { S.demoPerm = 'default'; fire(); show({ kind: 'info', icon: 'bell:navy', title: 'أُوقفت الإشعارات على هذا الجهاز', text: 'تبقى الإشعارات داخل المنصة والبريد وواتساب كما هي. (معاينة)' }); return Promise.resolve(); }
    return sdk().then(function (OS) { return OS.User.PushSubscription.optOut(); }).then(function () { S.sub = false; ls('tera.push.reg', null); fire(); show({ kind: 'info', icon: 'bell:navy', title: 'أُوقفت الإشعارات على هذا الجهاز', text: 'تبقى الإشعارات داخل المنصة والبريد وواتساب كما هي.' }); });
  }

  /* ---------- لوحة «تيرا على هذا الجهاز» ---------- */
  var DEV = { list: null, busy: false };
  function devName(d) {
    var m = String(d.model || ''), t = String(d.type || ''), b = /Chrome/.test(t) ? 'Chrome' : /Firefox/.test(t) ? 'Firefox' : /Edge/.test(t) ? 'Edge' : /Safari/.test(t) ? 'Safari' : '';
    if (/iPhone/i.test(m)) return 'آيفون' + (d.os ? ' · iOS ' + d.os : '');
    if (/iPad/i.test(m)) return 'آيباد' + (d.os ? ' · iPadOS ' + d.os : '');
    if (/Android/i.test(m)) return 'جوال أندرويد' + (b ? ' · ' + b : '');
    if (/Win/i.test(m)) return 'حاسب ويندوز' + (b ? ' · ' + b : '');
    if (/Mac/i.test(m)) return 'حاسب ماك' + (b ? ' · ' + b : '');
    if (/Linux/i.test(m)) return 'حاسب لينكس' + (b ? ' · ' + b : '');
    return (m || 'جهاز') + (b ? ' · ' + b : '');
  }
  function devices() {
    var se = session(); if (!APP_ID || !se) return Promise.resolve([]);
    DEV.busy = true;
    return fetch('/api/push/my-devices', { cache: 'no-store', credentials: 'same-origin', headers: { Authorization: 'Bearer ' + se.token } })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { DEV.list = (j && j.ok && Array.isArray(j.devices)) ? j.devices : []; DEV.busy = false; return DEV.list; })
      .catch(function () { DEV.list = []; DEV.busy = false; return []; });
  }
  function panel(opt) {
    opt = opt || {};
    var box = el('section', { class: 'tp-card' });
    function chip(ic, t, v, tone) { return el('span', { class: 'tp-chip is-' + (tone || 'n') }, [el('span', { class: 'tp-ci', html: N().tile(ic) }), el('span', {}, [el('small', {}, [t]), el('b', {}, [v])])]); }
    function btn(t, ic, run, primary) { return el('button', { type: 'button', class: 'tp-btn' + (primary ? ' is-p' : ''), onclick: run }, [el('span', { class: 'tp-bi', html: N().tile(ic) }), t]); }
    function paint() {
      var s = state(); box.textContent = '';
      box.appendChild(el('div', { class: 'tp-h' }, [el('span', { class: 'tp-hi', html: N().tile('device-mobile:teal') }), el('div', {}, [el('b', {}, ['تيرا على هذا الجهاز']), el('small', {}, [s.device + ' · ' + s.browser])])]));
      box.appendChild(el('div', { class: 'tp-chips' }, [
        chip('squares-four:navy', 'التطبيق على هذا الجهاز', s.installed ? 'مثبّت' : 'غير مثبّت', s.installed ? 'ok' : 'n'),
        chip('bell-ringing:teal', 'الإشعارات', s.on ? 'مفعّلة' : s.blocked ? 'محظورة' : s.needsInstallForPush ? 'بعد الإضافة للشاشة' : 'غير مفعّلة', s.on ? 'ok' : s.blocked ? 'bad' : 'n')]));
      var acts = [];
      if (!s.installed) acts.push(btn(s.oneTap ? 'تثبيت تطبيق تيرا' : 'احصل على تطبيق تيرا', 'download-simple:navy', function () { install(); }, !s.on || s.oneTap));
      if (!s.on) acts.push(btn('فعّل الإشعارات', 'bell-ringing:teal', function () { enable({ demo: opt.demo, onDemo: opt.onDemo }); }, true));
      else { acts.push(btn('أرسل إشعارًا تجريبيًا لي', 'paper-plane-tilt:teal', function () { test({ demo: opt.demo, onDemo: opt.onDemo }); }, true)); acts.push(btn('إيقاف على هذا الجهاز', 'bell:navy', function () { off(); })); }
      box.appendChild(el('div', { class: 'tp-acts' }, acts));
      /* v397: كل أجهزة الحساب المربوطة (من الخادم) — عددها ونوع كل جهاز وحالته، وتمييز هذا الجهاز */
      if (APP_ID && session()) {
        if (DEV.list === null && !DEV.busy) { devices().then(function () { paint(); }); }
        var L = DEV.list || [], me = (String(ls('tera.push.reg') || '').split(':')[1] || '').slice(-8);
        box.appendChild(el('div', { class: 'tp-devs' }, [el('b', { class: 'tp-devs-h' }, [DEV.list === null ? 'أجهزتك المربوطة بحسابك…' : L.length ? 'أجهزتك المربوطة بحسابك: ' + L.length : 'لا أجهزة مربوطة بحسابك بعد'])].concat(L.map(function (d) {
          return el('div', { class: 'tp-dev' + (d.on ? '' : ' is-off') }, [el('span', { class: 'tp-dev-i', html: N().tile(/iPhone|iPad|Android/i.test(d.model) || /Safari/.test(d.type) && /iP/.test(d.model) ? 'device-mobile:teal' : 'monitor:navy') }),
            el('span', { class: 'tp-dev-t' }, [el('b', {}, [devName(d) + (d.ref === me ? ' — هذا الجهاز' : '')]), el('small', {}, [d.on ? 'الإشعارات مفعّلة' : 'الإشعارات موقوفة على هذا الجهاز'])])]);
        }))));
      }
      box.appendChild(el('p', { class: 'tp-hint' }, [s.needsInstallForPush ? 'في الآيفون والآيباد تصل الإشعارات إلى شاشة القفل بعد إضافة تيرا إلى الشاشة الرئيسية وفتحها منها — شرط من أبل لكل المواقع.'
        : s.oneTap ? 'التثبيت بضغطة واحدة: تظهر نافذة المتصفح فتضغط «تثبيت»، وتصبح تيرا بأيقونتها على جهازك.'
        : 'تصل الإشعارات حتى والمنصة مغلقة: تذكيرات السداد، القبول، تحديثات الطلبات، وتنبيهات الأمان.']));
    }
    paint(); on(paint);
    return box;
  }
  function on(fn) { subs.push(fn); }

  /* ---------- تلقائي على المنفذ الحي: ربط الجهاز المفعّل + اقتراح لطيف مرة كل 7 أيام ---------- */
  function boot() {
    if (!APP_ID) return;
    var se = session();
    if (S.perm === 'granted' && (!IOS || standalone())) { sdk().then(register).catch(function () {}); return; }
    if (!se || S.perm !== 'default' || !D.getElementById('pv-host')) return;
    var last = Number(ls('tera.push.ask') || 0); if (Date.now() - last < 7 * 864e5) return;
    setTimeout(function () {
      if (N().current && N().current()) return;
      ls('tera.push.ask', String(Date.now()));
      show({ kind: 'info', icon: 'bell-ringing:navy', title: 'فعّل إشعارات منصة تيرا', text: 'لتصلك تذكيرات السداد، وطلبات القبول، وتحديثات طلباتك، وتنبيهات الأمان — حتى والمنصة مغلقة.' + (IOS && !standalone() ? ' في الآيفون: أضف تيرا إلى الشاشة الرئيسية أولًا.' : ''), ms: 0,
        actions: [{ label: IOS && !standalone() ? 'كيف أضيفها؟' : 'تفعيل الإشعارات', primary: true, run: function () { setTimeout(function () { enable(); }, 50); } }, { label: 'لاحقًا' }] });
    }, 6000);
  }

  /* ---------- شريط «ثبّت تيرا» أعلى الصفحة الرئيسية وبعد الدخول (يختفي إن كانت مثبّتة أو أُغلق — 3 أيام) ---------- */
  var BAR_K = 'tera.app.bar';
  function barHidden() {
    if (standalone() || S.installed) return true;
    if (D.documentElement.classList.contains('pv-embed')) return true;
    try { var t = Number((APP_ID ? W.localStorage : W.sessionStorage).getItem(BAR_K) || 0); return Date.now() - t < 3 * 864e5; } catch (e) { return false; }
  }
  function barText() {
    var s = state();
    if (IOS && !iosOk()) return ['احصل على تطبيق تيرا من Safari أو Chrome', 'انسخ الرابط وافتحه في Safari أو Chrome', 'انسخ الرابط'];
    if (I_CHROME) return ['احصل على تطبيق تيرا', 'آيفون · Chrome — اتبع الدليل: أسهل وأسرع', 'ابدأ الدليل'];
    if (IOS) return ['احصل على تطبيق تيرا', 'آيفون — اتبع الدليل: أسهل وأسرع', 'ابدأ الدليل'];
    if (A_INAPP) return ['احصل على تطبيق تيرا من Chrome', 'أندرويد — افتح الرابط في Chrome ثم ثبّته', 'افتح في Chrome'];
    if (ANDROID) return s.oneTap ? ['احصل على تطبيق تيرا', 'أندرويد — ثبّته بضغطة واحدة', 'تثبيت التطبيق'] : ['احصل على تطبيق تيرا', 'أندرويد — اتبع الدليل: أسهل وأسرع', 'ابدأ الدليل'];
    if (s.oneTap) return ['احصل على تطبيق تيرا', 'بضغطة واحدة — أسهل في الاستخدام ووصول أسرع.', 'تثبيت التطبيق'];
    if (MAC_SAFARI) return ['احصل على تطبيق تيرا', 'اتبع الدليل — أسهل في الاستخدام ووصول أسرع.', 'ابدأ الدليل'];
    return ['احصل على تطبيق تيرا', 'أسهل في الاستخدام ووصول أسرع، وإشعاراتك فورًا.', 'تثبيت التطبيق'];
  }
  var bars = [];
  function makeBar(doc) {
    var b = doc.createElement('div'); b.className = 'tp-bar'; b.setAttribute('dir', 'rtl'); b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'تثبيت تيرا');
    b.innerHTML = '<img class="tp-bar-i" src="brand/icon-192.png" alt=""><span class="tp-bar-t"><b></b><small></small></span><button type="button" class="tp-bar-go"></button><button type="button" class="tp-bar-x" aria-label="إغلاق">×</button>';
    function paint() { var t = barText(); b.querySelector('b').textContent = t[0]; b.querySelector('small').textContent = t[1]; b.querySelector('.tp-bar-go').textContent = t[2]; if (barHidden()) b.hidden = true; }
    b.querySelector('.tp-bar-go').addEventListener('click', function (e) {
      if (IOS && !iosOk()) { var bt = e.currentTarget, link = W.location.origin + '/home/'; (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { bt.textContent = 'نُسخ ✓'; }, function () { iosGuide(); }); return; }
      if (A_INAPP) { W.location.href = chromeIntent(); return; }
      install().then(function (r) { if (r === 'accepted' || r === 'installed') bars.forEach(function (x) { x.hidden = true; }); }); });
    b.querySelector('.tp-bar-x').addEventListener('click', function () { try { (APP_ID ? W.localStorage : W.sessionStorage).setItem(BAR_K, String(Date.now())); } catch (e) { void e; } bars.forEach(function (x) { x.hidden = true; }); });
    paint(); on(paint); bars.push(b);
    return b;
  }
  function mountBar() {
    if (barHidden() || FIREFOX) return;
    var cfg = W.__TERA || {}, sec = cfg.section;
    if (sec === 'home') {
      /* الموقع داخل إطار (نفس الأصل): الشريط أعلى صفحته، ويُعاد إن أُعيد رسم الصفحة */
      var tick = function () {
        var f = D.getElementById('pv-site-f'), d = null;
        try { d = f && f.contentDocument; } catch (e) { d = null; }
        if (d && d.body && !d.querySelector('.tp-bar')) d.body.insertBefore(makeBar(d), d.body.firstChild);
      };
      tick(); setInterval(tick, 1500);
    } else if (sec === 'clients' || sec === 'staff') {
      /* بعد الدخول: في المنفذ الحي لمن سجّل الدخول، وفي العيّنة دائمًا للمراجعة */
      if (APP_ID && !session()) return;
      var host = D.getElementById('pv-host'); if (!host || D.querySelector('body > .tp-bar')) return;
      D.body.insertBefore(makeBar(D), host);
    }
  }

  /* ---------- دليل الحماية: تفعيل كل وسائل التحقق ---------- */
  function secGuide() {
    var list = [['', 'سجّل الدخول إلى حسابك، ثم افتح <b>«مركز الأمان»</b>'],
      ['', 'فعّل <b>تطبيق المصادقة</b>: ثبّت Google Authenticator أو Microsoft Authenticator وامسح رمز QR'],
      ['', 'أنشئ <b>رقمك الإضافي</b>: 10 أرقام على الأقل بلا تكرار ولا تسلسل — تختاره وتحفظه أنت'],
      ['', 'اربط <b>واتساب</b> لتصلك رموز التحقق والتنبيهات فورًا'],
      ['', 'احصل على <b>تطبيق تيرا</b> وفعّل الإشعارات على جوالك']];
    return show({ kind: 'info', icon: 'shield-check:teal', title: 'فعّل حماية حسابك كاملة', text: 'خمس خطوات تجعل حسابك أكثر أمانًا وخدماتك أقرب إليك:',
      body: el('div', { class: 'tg-gb' }, [steps(list), helpBox('')]), ms: 0,
      actions: [{ label: 'الدخول إلى حسابي', primary: true, run: function () { W.location.href = new URL('../portal/', D.baseURI).href; } }, { label: 'فهمت' }] });
  }
  /* بنر «دليل استخدام تيرا» في الرئيسية (داخل إطار الموقع): أزراره تعمل من هنا */
  function mountPromo() {
    if (!D.getElementById('pv-site-f')) return;
    setInterval(function () {
      var f = D.getElementById('pv-site-f'), d = null; try { d = f && f.contentDocument; } catch (e) { d = null; }
      if (!d || d.__tpPromo) return; d.__tpPromo = true;
      /* صفحات الدليل: نتعرّف على جهازك فنقدّم خطواته أولًا ونعلّمها «جهازك» */
      var os = I_CHROME ? 'ios-chrome' : IOS ? 'ios' : ANDROID ? 'android' : 'desktop';
      var mine = d.querySelectorAll('.gd-plat[data-os="' + os + '"]'); if (!mine.length && os === 'ios-chrome') mine = d.querySelectorAll('.gd-plat[data-os="ios"]');
      Array.prototype.forEach.call(mine, function (p) {
        p.classList.add('is-mine'); var h = p.querySelector('.gd-plat-h b'); if (h && !h.querySelector('.gd-mine')) { var m = d.createElement('span'); m.className = 'gd-mine'; m.textContent = 'جهازك'; h.appendChild(m); }
        if (p.parentNode && p.parentNode.firstElementChild !== p) p.parentNode.insertBefore(p, p.parentNode.firstElementChild);
      });
      d.addEventListener('click', function (e) {
        var b = e.target && e.target.closest && e.target.closest('[data-tp]'); if (!b) return;
        var k = b.getAttribute('data-tp'); if (k === 'app') { e.preventDefault(); install(); } else if (k === 'sec') { e.preventDefault(); secGuide(); }
      });
    }, 1200);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', mountPromo); else mountPromo();
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', mountBar); else mountBar();

  function link() { if (!APP_ID) return Promise.resolve(true); return sdk().then(register).catch(function () { return false; }); }
  W.TeraPush = { secGuide: secGuide, state: state, link: link, devices: function () { DEV.list = null; return devices(); }, install: install, enable: enable, test: test, off: off, panel: panel, on: on, guide: guide, androidGuide: androidGuide, openGuide: openGuide, GUIDES: GUIDES, live: !!APP_ID, LIVE: LIVE };
})(window, document);
