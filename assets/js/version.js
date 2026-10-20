/* رقم الإصدار — يولّده tools/build.py (VERSION/VDATE) */
window.TQ_VERSION={v:'386',d:'2026-10-21'};
(function(){var V=window.TQ_VERSION;function fill(){document.querySelectorAll('[data-tq-ver]').forEach(function(el){el.innerHTML='الإصدار '+V.v+' · <bdi dir="ltr">'+V.d+'</bdi>'});document.querySelectorAll('.pv-rel').forEach(function(el){el.innerHTML='<i>الإصدار</i> '+V.v+' <small>'+V.d+'</small>'})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fill);else fill()})();
/* v383 (v386: شريط التحديث تحت الهيدر، و«حسابك»): تحديث التطبيق — يُضمَّن في assets/js/version.js (tools/build.py). يعمل في كل الصفحات ومنها التطبيق المثبّت على الشاشة الرئيسية.
 * • يفحص رقم الإصدار عند الفتح، وعند العودة للتطبيق، وكل 5 دقائق.
 * • إصدار أحدث: يُحدَّث تلقائيًا عند الفتح/العودة ما لم يكن العميل يكتب (مرة لكل إصدار)، وإلا شريط «حدّث واحصل على آخر إصدار».
 * • «تحديث التطبيق» (أيقونة الهيدر أو [data-tq-app]): رقم الإصدار وتاريخه، وهل يوجد تحديث، وزر التحديث، وتفعيل الإشعارات.
 * • التحديث يفتح الصفحة برابط جديد (?u=) فلا يعرض المتصفح أو التطبيق المثبّت نسخة محفوظة. */
(function () {
  try {
    if (!window.fetch || window.__tqUpd) return; window.__tqUpd = 1;
    var V = window.TQ_VERSION, s = document.currentScript, src = ((s && s.src) || '').split('?')[0]; if (!src) return;
    var last = 0, hid = 0, latest = null, bar = null;
    function typing() {
      var on = false;
      try {
        var ds = [document], f = document.getElementById('pv-site-f'); if (f && f.contentDocument) ds.push(f.contentDocument);
        ds.forEach(function (d) { d.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),textarea').forEach(function (i) { if (i.value && !i.readOnly && i.offsetParent !== null) on = true; }); });
      } catch (e) { void e; }
      return on;
    }
    function tried(v) { try { return sessionStorage.getItem('tq.upd') === v; } catch (e) { return true; } }
    function mark(v) { try { sessionStorage.setItem('tq.upd', v); } catch (e) { void e; } }
    function go(v) {
      mark(v || '');
      try { var u = new URL(location.href); u.searchParams.set('u', v || String(Date.now())); location.replace(u.toString()); } catch (e) { location.reload(); }
    }
    function btn(t, cls, fn) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t; if (cls) b.className = cls; b.setAttribute('data-live-ok', ''); b.addEventListener('click', fn); return b; }
    /* v386: شريط «يتوفر تحديث» تحت الهيدر (المنصة أو صفحة الموقع داخل الإطار) — وإلا أسفل الشاشة */
    var dis = '';
    function heads() {
      var L = [], h = document.querySelector('#pv-host .t2-head') || document.querySelector('.t2-head');
      if (h && h.getClientRects().length) L.push(h);
      try { var f = document.getElementById('pv-site-f'), d = f && f.contentDocument, h2 = d && d.querySelector('.t2-head'); if (h2) L.push(h2); } catch (e) { void e; }
      return L;
    }
    function strip(d, v) {
      var s = d.createElement('div'); s.className = 'tq-hupd'; s.setAttribute('role', 'status'); s.setAttribute('dir', 'rtl');
      var t = d.createElement('span'); t.innerHTML = '<b>يتوفر تحديث</b> — الإصدار ' + v;
      var a = d.createElement('button'); a.type = 'button'; a.textContent = 'حدّث الآن'; a.setAttribute('data-live-ok', '');
      a.addEventListener('click', function () { a.disabled = true; a.textContent = 'جارٍ التحديث…'; go(v); });
      var x = d.createElement('button'); x.type = 'button'; x.className = 'is-x'; x.setAttribute('aria-label', 'إخفاء'); x.setAttribute('data-live-ok', ''); x.textContent = '×';
      x.addEventListener('click', function () { dis = v; paintBar(); });
      s.appendChild(t); s.appendChild(a); s.appendChild(x); return s;
    }
    function paintBar() {
      var v = newer() && dis !== latest.v ? latest.v : '';
      var H = v ? heads() : [];
      [document].concat(H.map(function (h) { return h.ownerDocument; })).forEach(function (d) {
        d.querySelectorAll('.tq-hupd').forEach(function (n) { if (!v || H.indexOf(n.parentNode) < 0 || n.getAttribute('data-v') !== v) n.parentNode.removeChild(n); });
      });
      if (bar && (!v || H.length)) { if (bar.parentNode) bar.parentNode.removeChild(bar); bar = null; }
      if (!v) return;
      H.forEach(function (h) { if (!h.querySelector(':scope > .tq-hupd')) { try { if ((h.ownerDocument.defaultView || window).getComputedStyle(h).position === 'static') h.style.position = 'relative'; } catch (e) { void e; } var s = strip(h.ownerDocument, v); s.setAttribute('data-v', v); h.appendChild(s); } });
      if (!H.length) banner(v);
    }
    function banner(v) {
      if (bar || document.querySelector('.tq-upd')) return;
      bar = document.createElement('div'); bar.className = 'tq-upd'; bar.setAttribute('role', 'status'); bar.setAttribute('dir', 'rtl');
      var t = document.createElement('span'); t.textContent = 'يتوفر الإصدار ' + v + ' — حدّث الآن لتحصل على آخر إصدار.';
      var a = btn('حدّث الآن', '', function () { a.disabled = true; a.textContent = 'جارٍ التحديث…'; go(v); });
      var x = btn('لاحقًا', 'is-x', function () { dis = v; if (bar && bar.parentNode) bar.parentNode.removeChild(bar); bar = null; });
      bar.appendChild(t); bar.appendChild(a); bar.appendChild(x); document.body.appendChild(bar);
    }
    function fetchV() {
      return fetch(src + '?chk=' + Date.now(), { cache: 'no-store', credentials: 'omit' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
        var m = /v:'(\d+)',d:'([^']*)'/.exec(t || ''); if (m) latest = { v: m[1], d: m[2] }; return latest;
      });
    }
    function newer() { return !!(latest && Number(latest.v) > Number(V.v)); }
    function check(auto) {
      var n = Date.now(); if (n - last < 20000) return; last = n;
      fetchV().then(function () {
        if (!newer()) return;
        if (auto && !typing() && !tried(latest.v)) return go(latest.v);
        paintBar();
      }).catch(function () { /* بلا اتصال — يُعاد الفحص لاحقًا */ });
    }
    /* نافذة «تحديث التطبيق» — بالإشعار الموحّد (هوية المنصة نفسها) */
    function row(k, v) { var r = document.createElement('div'); r.className = 'tq-app-r'; var a = document.createElement('span'); a.textContent = k; var b = document.createElement('b'); b.textContent = v; r.appendChild(a); r.appendChild(b); return r; }
    function open() {
      var TN = window.TeraNotify, TP = window.TeraPush;
      var body = document.createElement('div'); body.className = 'tq-app';
      body.appendChild(row('الإصدار الحالي', V.v)); body.appendChild(row('تاريخ الإصدار', V.d));
      var st = row('الحالة', 'جارٍ البحث عن تحديث…'); body.appendChild(st);
      function acts() {
        var L = [];
        if (newer()) L.push({ label: 'حدّث الآن', primary: true, run: function () { go(latest.v); } });
        else L.push({ label: 'ابحث عن تحديث', keep: true, run: function () { last = 0; paint(true); } });
        try { var ps = TP && TP.state && TP.state(); if (ps && !ps.on && !ps.blocked) L.push({ label: 'تفعيل الإشعارات', run: function () { TP.enable(); } }); } catch (e) { void e; }
        return L;
      }
      var h = null;
      function paint(again) {
        st.querySelector('b').textContent = 'جارٍ البحث عن تحديث…';
        fetchV().then(function () {
          st.querySelector('b').textContent = newer() ? ('يحتاج إلى تحديث — الإصدار ' + latest.v + ' (' + latest.d + ')') : 'لديك آخر إصدار ✓'; paintBar();
        }).catch(function () { st.querySelector('b').textContent = 'تعذّر الفحص الآن — تحقق من الاتصال.'; }).then(function () {
          if (h && h.set) h.set({ kind: newer() ? 'warn' : 'ok', icon: 'arrows-clockwise:teal', actions: acts() }); void again;
        });
      }
      if (TN && TN.show) h = TN.show({ force: true, now: true, kind: 'info', icon: 'arrows-clockwise:teal', title: 'آخر إصدار', body: body, ms: 0, actions: acts() });
      else { alert('الإصدار ' + V.v + ' · ' + V.d); return; }
      paint();
    }
    /* v384: «إغلاق التطبيق» — في التطبيق المثبّت على الشاشة الرئيسية فقط. لا يسمح النظام لتطبيق الويب أن يغلق نفسه،
       فتُنهى الجلسة (الخروج نفسه) وتظهر شاشة إغلاق بالهوية، ويُغلق التطبيق نهائيًا بالسحب للأعلى. */
    var SA = false; try { SA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch (e) { void e; }
    if (SA) document.documentElement.classList.add('is-standalone');
    function bye() {
      var o = document.createElement('div'); o.className = 'tq-bye'; o.setAttribute('dir', 'rtl'); o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'خرجت من التطبيق');
      var im = document.createElement('img'); im.src = src.replace(/js\/version\.js$/, 'vid/logo-dark.webp'); im.alt = 'تيرا';
      var h = document.createElement('b'); h.textContent = 'خرجت من التطبيق وأُنهيت جلستك';
      var p = document.createElement('p'); p.textContent = 'لإغلاقه نهائيًا اسحب الشاشة للأعلى. وتفتحه من جديد من أيقونة تيرا متى شئت.';
      var a = btn('فتح التطبيق من جديد', '', function () { location.replace(location.origin + '/home/?app=1'); });
      o.appendChild(im); o.appendChild(h); o.appendChild(p); o.appendChild(a); document.body.appendChild(o);
      try { window.close(); } catch (e) { void e; }
    }
    /* v386: «تسجيل الخروج من حسابك» من صفحة «حسابك» (الموقع أو المنصة) — الخروج نفسه، ثم after() */
    function logout(after) {
      var fin = function () { try { localStorage.removeItem('tera.admin.session'); localStorage.removeItem('tera.admin.absolute_until'); } catch (e) { void e; } if (typeof after === 'function') after(); };
      if (window.TQ_LIVE_LOGOUT) return window.TQ_LIVE_LOGOUT(after);
      var t = null; try { t = (JSON.parse(localStorage.getItem('tera.admin.session') || 'null') || {}).access_token; } catch (e) { void e; }
      if (!t) return fin();
      Promise.race([fetch('/api/account/session/close', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: '{"kind":"logout"}' }).catch(function () {}), new Promise(function (r) { setTimeout(r, 3000); })]).then(fin, fin);
    }
    function closeApp() {
      var TN = window.TeraNotify;
      function go2() { logout(bye); }
      if (TN && TN.show) TN.show({ force: true, now: true, kind: 'warn', icon: 'x-circle:navy', title: 'تسجيل الخروج من التطبيق؟', text: 'تُنهى جلستك على هذا الجهاز، وتفتح التطبيق من جديد من أيقونته متى شئت.', ms: 0,
        actions: [{ label: 'تسجيل الخروج', primary: true, run: go2 }, { label: 'إلغاء' }] });
      else if (window.confirm('تسجيل الخروج من التطبيق؟')) go2();
    }
    /* v386: حالة الإصدار لصفحة «حسابك» */
    function info() { return fetchV().then(function () { return { v: V.v, d: V.d, latest: latest, newer: newer() }; }, function () { return { v: V.v, d: V.d, latest: null, newer: false }; }); }
    window.TQ_APP = { open: open, close: closeApp, logout: logout, info: info, update: function () { if (newer()) go(latest.v); else open(); }, standalone: SA, check: function () { last = 0; check(false); }, version: V };
    setInterval(function () { if (newer()) paintBar(); }, 1500);
    document.addEventListener('click', function (e) {
      var c = e.target && e.target.closest && e.target.closest('[data-tq-close]'); if (c) { e.preventDefault(); closeApp(); return; }
      var t = e.target && e.target.closest && e.target.closest('[data-tq-app]'); if (t) { e.preventDefault(); open(); }
    });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { hid = Date.now(); return; } check(!!hid && Date.now() - hid > 20000); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) check(true); });
    window.addEventListener('focus', function () { check(false); });
    setInterval(function () { check(false); }, 300000); setTimeout(function () { check(true); }, 4000);
    /* إزالة ?u= من العنوان بعد التحديث (لا يبقى في الرابط) */
    try { var u0 = new URL(location.href); if (u0.searchParams.has('u')) { u0.searchParams.delete('u'); history.replaceState(history.state, '', u0.pathname + (u0.search || '') + u0.hash); } } catch (e) { void e; }
  } catch (e) { void e; }
})();
