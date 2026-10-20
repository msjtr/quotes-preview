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
  function state() {
    var perm = APP_ID ? S.perm : (S.demoPerm || 'default'); /* العيّنة: معاينة لا تتأثر بإذن المتصفح الفعلي */
    return { live: !!APP_ID, device: device(), browser: browser(), installed: S.installed || standalone(), oneTap: !!S.deferred,
      ios: IOS, needsInstallForPush: IOS && !standalone(), supported: pushSupported() || IOS,
      perm: perm, on: perm === 'granted' && (S.sub || !APP_ID), blocked: perm === 'denied' };
  }

  /* ---------- التثبيت ---------- */
  W.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); S.deferred = e; fire(); });
  W.addEventListener('appinstalled', function () { S.installed = true; S.deferred = null; fire(); (bars || []).forEach(function (x) { x.hidden = true; }); show({ kind: 'ok', icon: 'squares-four:teal', title: 'أُضيفت تيرا إلى جهازك', text: 'تجدها الآن بأيقونتها على ' + (ANDROID ? 'الشاشة الرئيسية' : 'سطح المكتب وقائمة التطبيقات') + '، وتُفتح كتطبيق مستقل.' }); });

  var SHARE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H5v10h14V10h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var ADDSQ = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function steps(list) {
    return el('ol', { class: 'tp-steps' }, list.map(function (x, i) { return el('li', {}, [el('span', { class: 'tp-n' }, [String(i + 1)]), x[0] ? el('span', { class: 'tp-si', html: x[0] }) : null, el('span', { html: x[1] })]); }));
  }
  var arrowEl = null;
  function arrow(on) {
    if (arrowEl) { arrowEl.remove(); arrowEl = null; }
    if (!on) return;
    arrowEl = el('div', { class: 'tp-arrow' + (IPAD ? ' is-top' : ''), 'aria-hidden': 'true', html: '<b>' + SHARE + '</b><i></i>' });
    D.body.appendChild(arrowEl);
  }
  function guide(kind, why) {
    var G = {
      ios: ['أضف تيرا إلى الشاشة الرئيسية', (why ? why + ' ' : '') + 'أبل لا تسمح بالإضافة من زر داخل الموقع، وهي ثلاث لمسات فقط:',
        [[SHARE, 'اضغط زر المشاركة <b>' + (IPAD ? 'أعلى الشاشة' : 'أسفل الشاشة') + '</b> في Safari'], [ADDSQ, 'اختر <b>«إضافة إلى الشاشة الرئيسية»</b> ثم <b>«إضافة»</b>'], ['', 'افتح <b>«تيرا»</b> من أيقونتها، واضغط <b>«تفعيل الإشعارات»</b>']]],
      mac: ['أضف تيرا إلى Dock', 'في Safari على الماك (macOS Sonoma أو أحدث):',
        [['', 'من شريط القوائم اختر <b>«ملف»</b>'], ['', 'ثم <b>«إضافة إلى Dock»</b> واضغط <b>«إضافة»</b>'], ['', 'افتح «تيرا» من Dock وفعّل الإشعارات منها']]],
      firefox: ['ثبّت تيرا من كروم أو إيدج', 'متصفح Firefox على الكمبيوتر لا يدعم تثبيت المواقع كتطبيقات. الإشعارات تعمل فيه، وللتثبيت افتح المنصة في Chrome أو Edge واضغط «ثبّت تيرا».', []],
      menu: ['ثبّت تيرا من قائمة المتصفح', 'إن لم تظهر نافذة التثبيت:',
        [['', EDGE ? 'افتح قائمة <b>«…»</b> أعلى المتصفح' : 'افتح قائمة <b>«⋮»</b> أعلى المتصفح'], ['', EDGE ? '<b>«التطبيقات»</b> ← <b>«تثبيت هذا الموقع كتطبيق»</b>' : ANDROID ? '<b>«إضافة إلى الشاشة الرئيسية»</b> ← <b>«تثبيت»</b>' : '<b>«حفظ ومشاركة»</b> ← <b>«تثبيت الصفحة كتطبيق»</b>'], ['', 'تُفتح تيرا بعدها كتطبيق مستقل بأيقونتها']]]
    }[kind];
    arrow(kind === 'ios');
    return show({ kind: 'info', icon: kind === 'ios' ? 'device-mobile:sky' : 'monitor:teal', title: G[0], text: G[1], body: G[2].length ? steps(G[2]) : null, ms: 0,
      actions: [{ label: 'فهمت', primary: true }], onClose: function () { arrow(false); } });
  }
  function install() {
    if (standalone()) { show({ kind: 'ok', icon: 'squares-four:teal', title: 'تيرا مثبّتة على جهازك', text: 'أنت تستخدمها الآن كتطبيق مستقل.' }); return Promise.resolve('installed'); }
    if (S.deferred) {
      var e = S.deferred; S.deferred = null;
      return e.prompt().then(function () { return e.userChoice; }).then(function (c) {
        fire();
        if (c && c.outcome === 'accepted') return 'accepted';
        show({ kind: 'info', icon: 'squares-four:teal', title: 'لم تُضف تيرا', text: 'يمكنك إضافتها لاحقًا من الزر نفسه أو من قائمة المتصفح.' }); return 'dismissed';
      }).catch(function () { guide('menu'); return 'error'; });
    }
    guide(IOS ? 'ios' : MAC_SAFARI ? 'mac' : FIREFOX ? 'firefox' : 'menu');
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
      .then(function (r) { return r.json().catch(function () { return {}; }); }).then(function (j) { if (j && j.ok) ls('tera.push.reg', key); return !!(j && j.ok); }).catch(function () { return false; });
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
  function panel(opt) {
    opt = opt || {};
    var box = el('section', { class: 'tp-card' });
    function chip(ic, t, v, tone) { return el('span', { class: 'tp-chip is-' + (tone || 'n') }, [el('span', { class: 'tp-ci', html: N().tile(ic) }), el('span', {}, [el('small', {}, [t]), el('b', {}, [v])])]); }
    function btn(t, ic, run, primary) { return el('button', { type: 'button', class: 'tp-btn' + (primary ? ' is-p' : ''), onclick: run }, [el('span', { class: 'tp-bi', html: N().tile(ic) }), t]); }
    function paint() {
      var s = state(); box.textContent = '';
      box.appendChild(el('div', { class: 'tp-h' }, [el('span', { class: 'tp-hi', html: N().tile('device-mobile:teal') }), el('div', {}, [el('b', {}, ['تيرا على هذا الجهاز']), el('small', {}, [s.device + ' · ' + s.browser])])]));
      box.appendChild(el('div', { class: 'tp-chips' }, [
        chip('squares-four:navy', 'التطبيق', s.installed ? 'مثبّت' : 'غير مثبّت', s.installed ? 'ok' : 'n'),
        chip('bell-ringing:teal', 'الإشعارات', s.on ? 'مفعّلة' : s.blocked ? 'محظورة' : s.needsInstallForPush ? 'بعد الإضافة للشاشة' : 'غير مفعّلة', s.on ? 'ok' : s.blocked ? 'bad' : 'n')]));
      var acts = [];
      if (!s.installed) acts.push(btn(s.oneTap ? 'ثبّت تيرا بضغطة' : IOS ? 'أضف تيرا للشاشة الرئيسية' : 'ثبّت تيرا على جهازك', 'download-simple:navy', function () { install(); }, !s.on || s.oneTap));
      if (!s.on) acts.push(btn('فعّل الإشعارات', 'bell-ringing:teal', function () { enable({ demo: opt.demo, onDemo: opt.onDemo }); }, true));
      else { acts.push(btn('أرسل إشعارًا تجريبيًا لي', 'paper-plane-tilt:teal', function () { test({ demo: opt.demo, onDemo: opt.onDemo }); }, true)); acts.push(btn('إيقاف على هذا الجهاز', 'bell:navy', function () { off(); })); }
      box.appendChild(el('div', { class: 'tp-acts' }, acts));
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
    if (IOS) return ['أضف تيرا إلى الشاشة الرئيسية', 'لتُفتح كتطبيق وتصلك الإشعارات على شاشة القفل.', 'كيف؟'];
    if (s.oneTap) return ['ثبّت تيرا على جهازك', 'بضغطة واحدة — تُفتح كتطبيق وتصلك الإشعارات.', 'ثبّت'];
    if (MAC_SAFARI) return ['أضف تيرا إلى Dock', 'لتُفتح كتطبيق وتصلك الإشعارات.', 'كيف؟'];
    return ['ثبّت تيرا على جهازك', 'تُفتح كتطبيق مستقل وتصلك الإشعارات.', 'ثبّت'];
  }
  var bars = [];
  function makeBar(doc) {
    var b = doc.createElement('div'); b.className = 'tp-bar'; b.setAttribute('dir', 'rtl'); b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'تثبيت تيرا');
    b.innerHTML = '<img class="tp-bar-i" src="brand/icon-192.png" alt=""><span class="tp-bar-t"><b></b><small></small></span><button type="button" class="tp-bar-go"></button><button type="button" class="tp-bar-x" aria-label="إغلاق">×</button>';
    function paint() { var t = barText(); b.querySelector('b').textContent = t[0]; b.querySelector('small').textContent = t[1]; b.querySelector('.tp-bar-go').textContent = t[2]; if (barHidden()) b.hidden = true; }
    b.querySelector('.tp-bar-go').addEventListener('click', function () { install().then(function (r) { if (r === 'accepted' || r === 'installed') bars.forEach(function (x) { x.hidden = true; }); }); });
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
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', mountBar); else mountBar();

  W.TeraPush = { state: state, install: install, enable: enable, test: test, off: off, panel: panel, on: on, guide: guide, live: !!APP_ID, LIVE: LIVE };
})(window, document);
