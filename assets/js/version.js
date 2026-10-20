/* رقم الإصدار — يولّده tools/build.py (VERSION/VDATE) */
window.TQ_VERSION={v:'383',d:'2026-10-20'};
(function(){var V=window.TQ_VERSION;function fill(){document.querySelectorAll('[data-tq-ver]').forEach(function(el){el.innerHTML='الإصدار '+V.v+' · <bdi dir="ltr">'+V.d+'</bdi>'});document.querySelectorAll('.pv-rel').forEach(function(el){el.innerHTML='<i>الإصدار</i> '+V.v+' <small>'+V.d+'</small>'})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fill);else fill()})();
/* v383: تحديث التطبيق — يُضمَّن في assets/js/version.js (tools/build.py). يعمل في كل الصفحات ومنها التطبيق المثبّت على الشاشة الرئيسية.
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
    function banner(v) {
      if (bar || document.querySelector('.tq-upd')) return;
      bar = document.createElement('div'); bar.className = 'tq-upd'; bar.setAttribute('role', 'status'); bar.setAttribute('dir', 'rtl');
      var t = document.createElement('span'); t.textContent = 'يتوفر الإصدار ' + v + ' — حدّث الآن لتحصل على آخر إصدار.';
      var a = btn('حدّث الآن', '', function () { a.disabled = true; a.textContent = 'جارٍ التحديث…'; go(v); });
      var x = btn('لاحقًا', 'is-x', function () { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); bar = null; });
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
        banner(latest.v);
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
          st.querySelector('b').textContent = newer() ? ('يتوفر الإصدار ' + latest.v + ' (' + latest.d + ')') : 'لديك آخر إصدار ✓';
        }).catch(function () { st.querySelector('b').textContent = 'تعذّر الفحص الآن — تحقق من الاتصال.'; }).then(function () {
          if (h && h.set) h.set({ kind: newer() ? 'warn' : 'ok', icon: 'arrows-clockwise:teal', actions: acts() }); void again;
        });
      }
      if (TN && TN.show) h = TN.show({ force: true, now: true, kind: 'info', icon: 'arrows-clockwise:teal', title: 'تحديث التطبيق', body: body, ms: 0, actions: acts() });
      else { alert('الإصدار ' + V.v + ' · ' + V.d); return; }
      paint();
    }
    window.TQ_APP = { open: open, check: function () { last = 0; check(false); }, version: V };
    document.addEventListener('click', function (e) { var t = e.target && e.target.closest && e.target.closest('[data-tq-app],.t2-hupd'); if (t) { e.preventDefault(); open(); } });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { hid = Date.now(); return; } check(!!hid && Date.now() - hid > 20000); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) check(true); });
    window.addEventListener('focus', function () { check(false); });
    setInterval(function () { check(false); }, 300000); setTimeout(function () { check(true); }, 4000);
    /* إزالة ?u= من العنوان بعد التحديث (لا يبقى في الرابط) */
    try { var u0 = new URL(location.href); if (u0.searchParams.has('u')) { u0.searchParams.delete('u'); history.replaceState(history.state, '', u0.pathname + (u0.search || '') + u0.hash); } } catch (e) { void e; }
  } catch (e) { void e; }
})();
