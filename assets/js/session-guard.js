/* session-guard.js — حارس الجلسة في واجهات المنصة الجديدة (الموظفين والعملاء) على النطاقات الحية فقط.
 * يشغّل مُجمِّع الجلسة وتحديد الموقع (assets/js/session-location.js — v483، منقول من الأرشيف): النبضات، الخمول، إعلان المغادرة، الموقع.
 * ويعرض قرارات سياسة الجلسة في الخادم (sessionpolicy.js) بوضوح:
 *   • الموقع متوقف ← طبقة تحجب الصفحة مع زر التشغيل والتحديد اليدوي، وعدّاد قبل الإنهاء.
 *   • إنهاء الجلسة (خمول · انقطاع · دخول من جهاز آخر · VPN/بروكسي/Tor · Private Relay · الموقع) ← رسالة بالسبب ثم شاشة الدخول.
 * في العيّنة (GitHub Pages) لا يعمل إطلاقًا. لا يقرأ ولا يرسل أي سر سوى رمز الجلسة الذي تستعمله الواجهة نفسها. */
(function () {
  'use strict';
  var HOSTS = ['staging.tera-services.com.sa', 'quotes.tera-services.com.sa'];
  if (HOSTS.indexOf(location.hostname) < 0) return;
  var SESSION_KEY = 'tera.admin.session';
  /* v584: الصفحة الرئيسية عامة — انتهاء الجلسة فيها يمسحها بهدوء دون حجب ولا تحويل إلى بوابة الدخول، ولا يُطلب فيها تحديد الموقع */
  var PUBLIC = !!(window.__TERA && window.__TERA.section === 'home');
  function token() { try { var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); return s && s.access_token ? s.access_token : ''; } catch (e) { return ''; } }
  var TOK0 = (function () { try { return token(); } catch (e) { return ''; } })();

  var ended = false, locEl = null, endEl = null, lastCode = null, lastMsg = null;
  var CSS = 'position:fixed;inset:0;z-index:2147482000;background:rgba(7,18,38,.72);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.8 "IBM Plex Sans Arabic",sans-serif';
  var CARD = 'background:#fff;color:#0b1f3a;border-radius:16px;max-width:420px;width:100%;padding:20px;box-shadow:0 18px 48px rgba(0,0,0,.35);text-align:right';
  var BTN = 'display:block;width:100%;margin-top:10px;padding:10px 12px;border-radius:10px;border:0;font:700 14px "IBM Plex Sans Arabic",sans-serif;cursor:pointer';
  var TITLES = { idle: 'انتهت الجلسة لعدم النشاط', silent: 'انقطع الاتصال', superseded: 'تم الدخول من جهاز آخر', vpn: 'اتصال غير مسموح', hosting: 'اتصال غير مسموح', relay: 'أوقف iCloud Private Relay', location: 'تحديد الموقع متوقف', stolen: 'أُنهيت الجلسة لحمايتك' };

  function card(title, text, buttons) {
    var w = document.createElement('div'); w.setAttribute('dir', 'rtl'); w.setAttribute('role', 'alertdialog'); w.setAttribute('aria-modal', 'true'); w.style.cssText = CSS;
    var c = document.createElement('div'); c.style.cssText = CARD;
    var h = document.createElement('b'); h.textContent = title; h.style.cssText = 'display:block;font-size:17px;margin-bottom:6px';
    var p = document.createElement('div'); p.className = 'sg-text'; p.textContent = text;
    c.appendChild(h); c.appendChild(p);
    buttons.forEach(function (b) { var x = document.createElement('button'); x.type = 'button'; x.textContent = b[0]; x.style.cssText = BTN + (b[2] ? ';background:#0f766e;color:#fff' : ';background:#eef2f7;color:#0b1f3a'); x.addEventListener('click', b[1]); c.appendChild(x); });
    w.appendChild(c); return w;
  }
  function goLogin() { try { localStorage.removeItem(SESSION_KEY); } catch (e) { void e; } location.replace('/portal/'); }
  function showEnded(code, msg) {
    if (ended) return; ended = true;
    if (PUBLIC) { if (locEl && locEl.parentNode) locEl.parentNode.removeChild(locEl); locEl = null; try { if (token() === TOK0) localStorage.removeItem(SESSION_KEY); } catch (e) { void e; } return; } /* لا يُمسح رمز أحدث من دخول جديد في تبويب آخر */
    if (locEl && locEl.parentNode) locEl.parentNode.removeChild(locEl);
    endEl = card(TITLES[code] || 'انتهت الجلسة', msg || 'انتهت جلستك. سجّل الدخول من جديد.', [['تسجيل الدخول', goLogin, true]]);
    (document.body || document.documentElement).appendChild(endEl);
  }
  function showLocation(left) {
    if (ended || PUBLIC) return;
    var t = 'تحديد الموقع شرط لاستمرار الجلسة. شغّل الموقع للمتصفح (أيقونة القفل بجانب العنوان ← الموقع ← سماح)، أو إن تعذّر جلب موقعك فحدّده على الخريطة أو بالعنوان الوطني.'
      + (left > 0 ? ' ستنتهي الجلسة بعد ' + left + ' ثانية إن بقي متوقفًا.' : '');
    if (!locEl) {
      locEl = card(TITLES.location, t, [
        ['إعادة المحاولة', function () { location.reload(); }, true],
        ['حدّد موقعي على الخريطة', function () { try { if (window.TeraSession && window.TeraSession.locate) window.TeraSession.locate(); } catch (e) { void e; } }, false]]);
      (document.body || document.documentElement).appendChild(locEl);
    } else { var p = locEl.querySelector('.sg-text'); if (p) p.textContent = t; }
  }
  function hideLocation() { if (locEl && locEl.parentNode) locEl.parentNode.removeChild(locEl); locEl = null; }

  /* قراءة قرارات الخادم من الردود (بلا تعديل للطلبات):
   *  • مسارات الجلسة: الموقع والإنهاء.
   *  • أي طلب للمنصة (/api · /sb · /admin/api) يُرفض لأن الجلسة أُنهيت (دخول من جهاز آخر…) أو لأن الشبكة محظورة. */
  var F = window.fetch;
  function sameApi(url) { var u = String(url || ''); if (/^https?:/i.test(u) && u.indexOf(location.origin) !== 0) return false; return /\/(api|sb|admin\/api)\//.test(u); }
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var p = F.apply(this, arguments);
    var sess = url.indexOf('/api/account/session/') >= 0 || url.indexOf('/api/security/session-state') >= 0;
    if (!sess && !sameApi(url)) return p;
    return p.then(function (r) {
      if (!sess && r.status !== 401 && r.status !== 403) return r;
      try {
        r.clone().json().then(function (j) {
          if (!j) return;
          if (j.error === 'network_blocked') { if (window.TeraNet) window.TeraNet.show(j.reason_code, j.message); return; }
          if (j.reason_code) { lastCode = j.reason_code; lastMsg = j.message || null; }
          if (j.error === 'session_revoked' || (sess && j.closed)) { showEnded(j.reason_code || lastCode, j.message || lastMsg); return; }
          if (!sess) return;
          if (j.idle_off) IDLE_MIN = Infinity; else if (Number(j.idle_minutes) > 0) IDLE_MIN = Number(j.idle_minutes);
          if (j.location_ok === false) showLocation(Number(j.location_grace_s) || 0);
          else if (j.location_ok === true) hideLocation();
        }).catch(function () {});
      } catch (e) { void e; }
      return r;
    });
  };

  /* حالة الجلسة كل 20 ثانية (وعند ظهور الصفحة أو عودة الاتصال): يعرف الجهاز القديم فورًا أن دخولًا جديدًا أنهى جلسته */
  function stateCheck() {
    if (ended || document.visibilityState !== 'visible') return;
    var t = token(); if (!t) return;
    window.fetch('/api/security/session-state', { headers: { Authorization: 'Bearer ' + t }, cache: 'no-store' }).catch(function () {});
  }
  setInterval(stateCheck, 20000);
  document.addEventListener('visibilitychange', stateCheck);
  window.addEventListener('focus', stateCheck);
  window.addEventListener('online', stateCheck);

  /* v403: تنبيه قبل انتهاء الجلسة بالخمول بدقيقتين — عدّاد تنازلي و«تمديد الجلسة» (يُسجَّل في عمليات الحساب) أو «تسجيل الخروج».
   * المدة من الخادم (idle_minutes في نبضات الجلسة): العميل 30 دقيقة، والفريق 60 دقيقة. */
  var IDLE_MIN = 30, WARN_S = 120, lastAct = Date.now(), warnEl = null, warnT = null;
  ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach(function (ev) { window.addEventListener(ev, function () { if (!warnEl) lastAct = Date.now(); }, { passive: true, capture: true }); });
  function fmtS(n) { n = Math.max(0, Math.ceil(n)); return Math.floor(n / 60) + ':' + ('0' + (n % 60)).slice(-2); }
  function hideWarn() { clearInterval(warnT); warnT = null; if (warnEl && warnEl.parentNode) warnEl.parentNode.removeChild(warnEl); warnEl = null; }
  function extend() {
    var left = IDLE_MIN * 60 - (Date.now() - lastAct) / 1000;
    lastAct = Date.now(); hideWarn();
    var t = token(); if (t) F('/api/account/session/extend', { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify({ left_s: Math.round(left) }), cache: 'no-store' }).catch(function () {});
    try { if (window.TeraNotify && window.TeraNotify.show) window.TeraNotify.show({ force: true, kind: 'ok', icon: 'clock-countdown:teal', title: 'مُدّدت جلستك', text: 'تستمر الجلسة ' + IDLE_MIN + ' دقيقة أخرى من آخر نشاط.' }); } catch (e) { void e; }
  }
  function logout() { hideWarn(); try { if (window.TQ_APP && window.TQ_APP.logout) return window.TQ_APP.logout(function () { location.replace('/portal/'); }); } catch (e) { void e; } goLogin(); }
  function idleTick() {
    if (ended || PUBLIC || !token()) { hideWarn(); return; }
    var left = IDLE_MIN * 60 - (Date.now() - lastAct) / 1000;
    if (left > WARN_S) { if (warnEl) hideWarn(); return; }
    if (warnEl) return;
    warnEl = card('جلستك على وشك الانتهاء', '', [['تمديد الجلسة', extend, true], ['تسجيل الخروج', logout, false]]);
    var p = warnEl.querySelector('.sg-text');
    var paint = function () { var l = IDLE_MIN * 60 - (Date.now() - lastAct) / 1000; if (p) p.textContent = 'لم نرصد نشاطًا منذ مدة. ستنتهي جلستك تلقائيًا لحمايتك خلال ' + fmtS(l) + ' دقيقة. اختر «تمديد الجلسة» للمتابعة.'; if (l <= 0) hideWarn(); };
    paint(); warnT = setInterval(paint, 1000);
    (document.body || document.documentElement).appendChild(warnEl);
  }
  setInterval(idleTick, 5000);

  /* المُجمِّع القائم يستدعي هذا عند انتهاء الجلسة */
  window.TeraAuth = window.TeraAuth || {};
  if (typeof window.TeraAuth.expired !== 'function') window.TeraAuth.expired = function () { showEnded(lastCode, lastMsg); };

  /* v483: تحميل مُجمِّع الجلسة وتحديد الموقع من المستودع الجديد مرة واحدة بعد وجود جلسة (بدل /admin/session-geo.js) */
  var tries = 0;
  var boot = setInterval(function () {
    tries += 1;
    if (window.TeraSession) { clearInterval(boot); return; }
    if (PUBLIC) { clearInterval(boot); return; } /* v585: الصفحة الرئيسية عامة — لا يُحمَّل مُجمِّع الجلسة وتحديد الموقع فيها (كانت تفتح «حدّد موقعك على الخريطة» بجلسة قديمة فلا تعمل الخريطة) */
    if (!token()) { if (tries > 400) clearInterval(boot); return; }
    clearInterval(boot);
    var s = document.createElement('script'); s.src = '/assets/js/session-location.js?v=' + ((window.TQ_VERSION && window.TQ_VERSION.v) || '586'); s.async = true;
    (document.head || document.documentElement).appendChild(s);
  }, 1500);
})();
