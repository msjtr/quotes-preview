/* net-guard.js — فحص الاتصال في كل صفحات الموقع على النطاقات الحية (الرئيسية · البوابة · المنصة).
 * عند فتح الصفحة، وعند عودة الاتصال أو ظهور الصفحة، وكل دقيقة: يسأل الخادم /api/security/network-check.
 * VPN أو بروكسي أو Tor أو شبكة مركز بيانات أو iCloud Private Relay ← طبقة تحجب الصفحة برسالة عربية وزر «إعادة الفحص».
 * الخادم يرفض الدخول والتحقق نفسه أيضًا؛ هذه الطبقة لإخبار المستخدم من البداية. لا يعمل في العيّنة (GitHub Pages). */
(function () {
  'use strict';
  var HOSTS = ['staging.tera-services.com.sa', 'quotes.tera-services.com.sa'];
  if (HOSTS.indexOf(location.hostname) < 0) return;
  var TITLES = { vpn: 'اتصال غير مسموح', hosting: 'اتصال غير مسموح', relay: 'أوقف iCloud Private Relay' };
  var el = null, busy = false, wasBlocked = false;
  function show(code, msg, info) {
    wasBlocked = true;
    if (!el) {
      el = document.createElement('div'); el.setAttribute('dir', 'rtl'); el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-modal', 'true');
      el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(7,18,38,.8);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.8 "IBM Plex Sans Arabic",sans-serif';
      var c = document.createElement('div'); c.style.cssText = 'background:#fff;color:#0b1f3a;border-radius:16px;max-width:420px;width:100%;padding:20px;box-shadow:0 18px 48px rgba(0,0,0,.35);text-align:right';
      var h = document.createElement('b'); h.className = 'ng-t'; h.style.cssText = 'display:block;font-size:17px;margin-bottom:6px';
      var p = document.createElement('div'); p.className = 'ng-m';
      var n = document.createElement('div'); n.className = 'ng-n'; n.style.cssText = 'margin-top:8px;font-size:12.5px;color:#475569;direction:rtl';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'ng-b'; b.textContent = 'إعادة الفحص';
      b.style.cssText = 'display:block;width:100%;margin-top:12px;padding:10px 12px;border-radius:10px;border:0;font:700 14px "IBM Plex Sans Arabic",sans-serif;cursor:pointer;background:#0f766e;color:#fff';
      b.addEventListener('click', function () { check(true); });
      c.appendChild(h); c.appendChild(p); c.appendChild(n); c.appendChild(b); el.appendChild(c);
      (document.body || document.documentElement).appendChild(el);
    }
    el.querySelector('.ng-t').textContent = TITLES[code] || 'اتصال غير مسموح';
    el.querySelector('.ng-m').textContent = msg || 'لا يمكن استخدام المنصة من هذا الاتصال.';
    var t = new Date(); var hm = t.getHours() + ':' + ('0' + t.getMinutes()).slice(-2) + ':' + ('0' + t.getSeconds()).slice(-2);
    el.querySelector('.ng-n').textContent = 'آخر فحص ' + hm + (info && info.network ? ' · شبكتك: ' + info.network : '') + (info && info.ip ? ' · عنوانك: ' + info.ip : '')
      + '. إن أوقفت VPN أو البروكسي اضغط إعادة الفحص.';
  }
  function busyBtn(on) { if (!el) return; var b = el.querySelector('.ng-b'); if (b) { b.disabled = on; b.textContent = on ? 'جارٍ الفحص…' : 'إعادة الفحص'; b.style.opacity = on ? '.7' : '1'; } }
  function hide() { if (el && el.parentNode) el.parentNode.removeChild(el); el = null; }
  function check(manual) {
    if (busy) return; busy = true; busyBtn(true);
    fetch('/api/security/network-check' + (manual ? '?fresh=1&t=' : '?t=') + Date.now(), { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || j.ok !== true) return;
        if (j.allowed === false) { show(j.reason_code, j.message, j); return; }
        hide();
        /* زال المنع: تُعاد الصفحة لتعمل من جديد بعد الطلبات التي رُفضت */
        if (wasBlocked) { wasBlocked = false; location.reload(); }
      })
      .catch(function () { if (el) el.querySelector('.ng-n').textContent = 'تعذّر الفحص — تحقّق من اتصالك ثم أعد المحاولة.'; })
      .then(function () { busy = false; busyBtn(false); });
  }
  window.TeraNet = { show: show, check: check };
  check();
  window.addEventListener('online', function () { check(false); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(false); });
  setInterval(function () { if (document.visibilityState === 'visible') check(false); }, 60000);
})();
