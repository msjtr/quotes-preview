/* net-guard.js — فحص الاتصال في كل صفحات الموقع على النطاقات الحية (الرئيسية · البوابة · المنصة).
 * عند فتح الصفحة، وعند عودة الاتصال أو ظهور الصفحة، وكل دقيقة: يسأل الخادم /api/security/network-check.
 * VPN أو بروكسي أو Tor أو شبكة مركز بيانات أو iCloud Private Relay ← طبقة تحجب الصفحة برسالة عربية وزر «إعادة الفحص».
 * الخادم يرفض الدخول والتحقق نفسه أيضًا؛ هذه الطبقة لإخبار المستخدم من البداية. لا يعمل في العيّنة (GitHub Pages). */
(function () {
  'use strict';
  var HOSTS = ['staging.tera-services.com.sa', 'quotes.tera-services.com.sa'];
  if (HOSTS.indexOf(location.hostname) < 0) return;
  var TITLES = { vpn: 'اتصال غير مسموح', hosting: 'اتصال غير مسموح', relay: 'أوقف iCloud Private Relay' };
  var el = null, busy = false;
  function show(code, msg) {
    if (!el) {
      el = document.createElement('div'); el.setAttribute('dir', 'rtl'); el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-modal', 'true');
      el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(7,18,38,.8);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.8 "IBM Plex Sans Arabic",sans-serif';
      var c = document.createElement('div'); c.style.cssText = 'background:#fff;color:#0b1f3a;border-radius:16px;max-width:420px;width:100%;padding:20px;box-shadow:0 18px 48px rgba(0,0,0,.35);text-align:right';
      var h = document.createElement('b'); h.className = 'ng-t'; h.style.cssText = 'display:block;font-size:17px;margin-bottom:6px';
      var p = document.createElement('div'); p.className = 'ng-m';
      var b = document.createElement('button'); b.type = 'button'; b.textContent = 'إعادة الفحص';
      b.style.cssText = 'display:block;width:100%;margin-top:12px;padding:10px 12px;border-radius:10px;border:0;font:700 14px "IBM Plex Sans Arabic",sans-serif;cursor:pointer;background:#0f766e;color:#fff';
      b.addEventListener('click', function () { check(); });
      c.appendChild(h); c.appendChild(p); c.appendChild(b); el.appendChild(c);
      (document.body || document.documentElement).appendChild(el);
    }
    el.querySelector('.ng-t').textContent = TITLES[code] || 'اتصال غير مسموح';
    el.querySelector('.ng-m').textContent = msg || 'لا يمكن استخدام المنصة من هذا الاتصال.';
  }
  function hide() { if (el && el.parentNode) el.parentNode.removeChild(el); el = null; }
  function check() {
    if (busy) return; busy = true;
    fetch('/api/security/network-check', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.ok === true) { if (j.allowed === false) show(j.reason_code, j.message); else hide(); } })
      .catch(function () {})
      .then(function () { busy = false; });
  }
  window.TeraNet = { show: show, check: check };
  check();
  window.addEventListener('online', check);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(); });
  setInterval(function () { if (document.visibilityState === 'visible') check(); }, 60000);
})();
