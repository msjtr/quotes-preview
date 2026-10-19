/* session-guard.js — حارس الجلسة في واجهات المنصة الجديدة (الموظفين والعملاء) على النطاقات الحية فقط.
 * يشغّل مُجمِّع الجلسة القائم في النظام (/admin/session-geo.js): النبضات، الخمول، إعلان المغادرة، الموقع.
 * ويعرض قرارات سياسة الجلسة في الخادم (sessionpolicy.js) بوضوح:
 *   • الموقع متوقف ← طبقة تحجب الصفحة مع زر التشغيل والتحديد اليدوي، وعدّاد قبل الإنهاء.
 *   • إنهاء الجلسة (خمول · انقطاع · دخول من جهاز آخر · VPN/بروكسي/Tor · Private Relay · الموقع) ← رسالة بالسبب ثم شاشة الدخول.
 * في العيّنة (GitHub Pages) لا يعمل إطلاقًا. لا يقرأ ولا يرسل أي سر سوى رمز الجلسة الذي تستعمله الواجهة نفسها. */
(function () {
  'use strict';
  var HOSTS = ['staging.tera-services.com.sa', 'quotes.tera-services.com.sa'];
  if (HOSTS.indexOf(location.hostname) < 0) return;
  var SESSION_KEY = 'tera.admin.session';
  function token() { try { var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); return s && s.access_token ? s.access_token : ''; } catch (e) { return ''; } }

  var ended = false, locEl = null, endEl = null, lastCode = null, lastMsg = null;
  var CSS = 'position:fixed;inset:0;z-index:2147482000;background:rgba(7,18,38,.72);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.8 "IBM Plex Sans Arabic",sans-serif';
  var CARD = 'background:#fff;color:#0b1f3a;border-radius:16px;max-width:420px;width:100%;padding:20px;box-shadow:0 18px 48px rgba(0,0,0,.35);text-align:right';
  var BTN = 'display:block;width:100%;margin-top:10px;padding:10px 12px;border-radius:10px;border:0;font:700 14px "IBM Plex Sans Arabic",sans-serif;cursor:pointer';
  var TITLES = { idle: 'انتهت الجلسة لعدم النشاط', silent: 'انقطع الاتصال', superseded: 'دخول من جهاز آخر', vpn: 'اتصال غير مسموح', hosting: 'اتصال غير مسموح', relay: 'أوقف iCloud Private Relay', location: 'تحديد الموقع متوقف' };

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
    if (locEl && locEl.parentNode) locEl.parentNode.removeChild(locEl);
    endEl = card(TITLES[code] || 'انتهت الجلسة', msg || 'انتهت جلستك. سجّل الدخول من جديد.', [['تسجيل الدخول', goLogin, true]]);
    (document.body || document.documentElement).appendChild(endEl);
  }
  function showLocation(left) {
    if (ended) return;
    var t = 'تحديد الموقع شرط لاستمرار الجلسة. شغّل الموقع للمتصفح (أيقونة القفل بجانب العنوان ← الموقع ← سماح)، أو حدّد موقعك بالعنوان الوطني أو على الخريطة.'
      + (left > 0 ? ' ستنتهي الجلسة بعد ' + left + ' ثانية إن بقي متوقفًا.' : '');
    if (!locEl) {
      locEl = card(TITLES.location, t, [
        ['إعادة المحاولة', function () { location.reload(); }, true],
        ['تحديد موقعي يدويًا', function () { try { if (window.TeraSession && window.TeraSession.locate) window.TeraSession.locate(); } catch (e) { void e; } }, false]]);
      (document.body || document.documentElement).appendChild(locEl);
    } else { var p = locEl.querySelector('.sg-text'); if (p) p.textContent = t; }
  }
  function hideLocation() { if (locEl && locEl.parentNode) locEl.parentNode.removeChild(locEl); locEl = null; }

  /* قراءة قرارات الخادم من ردود مسارات الجلسة (بلا تعديل للطلبات) */
  var F = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var p = F.apply(this, arguments);
    if (url.indexOf('/api/account/session/') < 0) return p;
    return p.then(function (r) {
      try {
        r.clone().json().then(function (j) {
          if (!j) return;
          if (j.reason_code) { lastCode = j.reason_code; lastMsg = j.message || null; }
          if (j.error === 'session_revoked' || j.closed) { showEnded(j.reason_code || lastCode, j.message || lastMsg); return; }
          if (j.location_ok === false) showLocation(Number(j.location_grace_s) || 0);
          else if (j.location_ok === true) hideLocation();
        }).catch(function () {});
      } catch (e) { void e; }
      return r;
    });
  };

  /* المُجمِّع القائم يستدعي هذا عند انتهاء الجلسة */
  window.TeraAuth = window.TeraAuth || {};
  if (typeof window.TeraAuth.expired !== 'function') window.TeraAuth.expired = function () { showEnded(lastCode, lastMsg); };

  /* تحميل مُجمِّع الجلسة القائم مرة واحدة بعد وجود جلسة */
  var tries = 0;
  var boot = setInterval(function () {
    tries += 1;
    if (window.TeraSession) { clearInterval(boot); return; }
    if (!token()) { if (tries > 400) clearInterval(boot); return; }
    clearInterval(boot);
    var s = document.createElement('script'); s.src = '/admin/session-geo.js'; s.async = true;
    (document.head || document.documentElement).appendChild(s);
  }, 1500);
})();
