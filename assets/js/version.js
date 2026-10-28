/* رقم الإصدار — يولّده tools/build.py (VERSION/VDATE) */
window.TQ_VERSION={v:'562',d:'2026-10-28'};
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
    /* v503: لا يُعاد التحميل تلقائيًا بعد أن يبدأ المستخدم التنقّل في الصفحة — يظهر شريط «يتوفر تحديث» بدلًا منه، والعودة بعد غياب طويل (30 دقيقة) تُحدِّث */
    var acted = false; ['pointerdown', 'keydown', 'touchstart'].forEach(function (k) { document.addEventListener(k, function () { acted = true; }, { capture: true, passive: true }); });
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
        if (auto && (auto === 'return' || !acted) && !typing() && !tried(latest.v)) return go(latest.v);
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
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { hid = Date.now(); return; } check(!!hid && Date.now() - hid > 1800000 ? 'return' : false); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) check('return'); });
    window.addEventListener('focus', function () { check(false); });
    setInterval(function () { check(false); }, 300000); setTimeout(function () { check(true); }, 4000);
    /* v387: الضغط على إشعار الجوال/الويب يفتح التطبيق ويعرض الإشعار نفسه (العنوان والنص) — يصل محتواه في #tqn= (لا يُرسل إلى الخادم)،
       ثم «عرض التفاصيل» ينقل إلى القسم المرتبط إن كان العميل داخل حسابه. ويُحفظ آخر 30 إشعارًا على الجهاز. */
    var NK = { ok: /^(offers|member|approved|paid|thanks|qaccepted|qextok|cudok)$/, bad: /^(defaulted|late|rejected|rfrej|qexpired|qrejected|qextno|cudrej)$/, warn: /^(sec|doc|today|fix|refund|qexpire|qmod|cudfix)$/ };
    function pushOpen() {
      /* tqn= (JSON مُرمَّز) أو v402: tqb= (base64url مضغوط — يتسع لنص أطول ضمن حد 2048 حرفًا للرابط) */
      var m = /[#&](tq[nb])=([^&]+)/.exec(location.hash || ''); if (!m) return;
      var n = null;
      try {
        if (m[1] === 'tqb') { var s = m[2].replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; var bin = atob(s), u8 = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); n = JSON.parse(new TextDecoder('utf-8').decode(u8)); }
        else n = JSON.parse(decodeURIComponent(m[2]));
      } catch (e) { n = null; }
      try { var h = location.hash.replace(/[#&]tq[nb]=[^&]+/, '').replace(/^#?&?/, ''); history.replaceState(history.state, '', location.pathname + location.search + (h ? '#' + h : '')); } catch (e) { void e; }
      if (!n || !(n.t || n.b)) return;
      pushShow(n);
    }
    /* v396: عرض إشعار وصل (من الرابط #tqn أو من حدث الضغط في OneSignal أو من مركز الإشعارات) — مرة واحدة للإشعار نفسه خلال دقيقتين */
    var lastShow = { key: '', at: 0 };
    function pushShow(n) {
      if (!n || !(n.t || n.b)) return;
      var key = (n.t || '') + '|' + (n.b || ''); if (key === lastShow.key && Date.now() - lastShow.at < 120000) return; lastShow = { key: key, at: Date.now() };
      try { var L = JSON.parse(localStorage.getItem('tq.push.inbox') || '[]'); L.unshift({ k: n.k || '', t: n.t || '', b: n.b || '', at: Date.now() }); localStorage.setItem('tq.push.inbox', JSON.stringify(L.slice(0, 30))); } catch (e) { void e; }
      var k = String(n.k || ''), kind = NK.ok.test(k) ? 'ok' : NK.bad.test(k) ? 'bad' : NK.warn.test(k) ? 'warn' : 'info';
      var tries = 0;
      (function show() {
        var TN = window.TeraNotify;
        if (!TN || !TN.show || (function () { var w = document.querySelector('.tw'); return !!(w && !w.hidden && !w.classList.contains('is-out') && w.getClientRects().length); })()) { if (tries++ < 40) return setTimeout(show, 500); if (!TN || !TN.show) return alert((n.t || '') + '\n' + (n.b || '')); }
        /* v401: البطاقة تعرض نص الإشعار كاملًا؛ والطويل يظهر مختصرًا مع «عرض النص كاملًا» فيتوسع داخل البطاقة نفسها.
           خياران فقط: «الدخول لحسابك» (أو «فتح حسابك» إن كانت الجلسة قائمة) و«إغلاق». */
        var acts = [], logged = false;
        try { var se = JSON.parse(localStorage.getItem('tera.admin.session') || 'null'); logged = !!(se && se.access_token && (!se.expires_at || se.expires_at * 1000 > Date.now())); } catch (e) { void e; }
        /* v410: رابط دفع — زر «ادفع الآن» يفتح بوابة الدفع مباشرة */
        if (n.p && /^\/api\/pay\/l\/[A-Za-z0-9_-]+$/.test(n.p)) acts.push({ label: 'ادفع الآن', primary: true, run: function () { location.href = n.p; } });
        else if (window.TQ_PUSH_GO && window.TQ_PUSH_GO(k, true)) acts.push({ label: 'عرض التفاصيل', primary: true, run: function () { window.TQ_PUSH_GO(k); } });
        else if (n.p && /^\/(staff|clients)\//.test(n.p) && location.pathname.indexOf(n.p) !== 0) acts.push({ label: logged ? 'فتح حسابك' : 'الدخول لحسابك', primary: true, run: function () { try { sessionStorage.setItem('tq.go', 'notif'); } catch (e) { void e; } location.href = n.p; } });
        acts.push({ label: 'إغلاق' });
        var txt = String(n.b || ''), body = null;
        if (txt) {
          body = document.createElement('div'); body.className = 'tqn-card';
          var pEl = document.createElement('p'); pEl.className = 'tqn-full'; pEl.textContent = txt; body.appendChild(pEl);
          if (n.more) { var mo = document.createElement('small'); mo.className = 'tqn-cut'; mo.textContent = 'تتمة النص في حسابك.'; body.appendChild(mo); }
          if (txt.length > 180) {
            pEl.classList.add('is-clamp');
            var more = document.createElement('button'); more.type = 'button'; more.className = 'tqn-more'; more.textContent = 'عرض النص كاملًا';
            more.addEventListener('click', function () { var on = pEl.classList.toggle('is-clamp'); more.textContent = on ? 'عرض النص كاملًا' : 'عرض أقل'; });
            body.appendChild(more);
          }
        }
        TN.show({ force: true, now: true, kind: kind, icon: 'bell-ringing:gold', title: n.t || 'إشعار من تيرا', text: '', body: body, ms: 0, actions: acts });
      })();
    }
    window.TQ_PUSH_SHOW = pushShow;
    /* v400: هل عُرض هذا الإشعار بطاقةً على هذا الجهاز خلال 24 ساعة (من الضغط عليه)؟ — فلا يُعرض مرة ثانية بعد الدخول */
    window.TQ_PUSH_SEEN = function (t, b) { try { var L = JSON.parse(localStorage.getItem('tq.push.inbox') || '[]'); return L.some(function (x) { return x.t === (t || '') && x.b === (b || '') && Date.now() - x.at < 864e5; }); } catch (e) { return false; } };
    /* v399: عند فتح التطبيق من صفحة خارج المنصة (مثل الرئيسية حين يفتحها الآيفون بدل رابط الإشعار): أحدث إشعار لحسابك لم يُعرض
       خلال 24 ساعة يظهر بطاقةً — من الخادم (/api/push/inbox). داخل المنصة تتولاه المنصة نفسها بحسب دور اللوحة. */
    function inboxFresh() {
      try {
        if (typeof window.dbFresh === 'function' || !/(^|\.)tera-services\.com\.sa$/.test(location.hostname)) return;
        var s = JSON.parse(localStorage.getItem('tera.admin.session') || 'null');
        if (!s || !s.access_token || (s.expires_at && s.expires_at * 1000 < Date.now())) return;
        fetch('/api/push/inbox', { cache: 'no-store', credentials: 'same-origin', headers: { Authorization: 'Bearer ' + s.access_token } })
          .then(function (r) { return r.json(); }).then(function (j) {
            var R = (j && j.ok && j.rows) || [], seen = {}; try { seen = JSON.parse(localStorage.getItem('tq.inbox.seen') || '{}') || {}; } catch (e) { seen = {}; }
            var n = R.filter(function (x) { return !seen['db:' + x.id] && Date.now() - new Date(x.created_at).getTime() < 864e5 && !(window.TQ_PUSH_SEEN && window.TQ_PUSH_SEEN(x.title, x.body)); })[0];
            if (!n) return; seen['db:' + n.id] = seen['db:' + n.id] || 1; try { localStorage.setItem('tq.inbox.seen', JSON.stringify(seen)); } catch (e) { void e; }
            pushShow({ k: 'admin', t: n.title || 'إشعار من تيرا', b: n.body || '' });
          }).catch(function () {});
      } catch (e) { void e; }
    }
    setTimeout(inboxFresh, 3500);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') inboxFresh(); });
    pushOpen(); window.addEventListener('hashchange', pushOpen);
    /* إزالة ?u= من العنوان بعد التحديث (لا يبقى في الرابط) */
    try { var u0 = new URL(location.href); if (u0.searchParams.has('u')) { u0.searchParams.delete('u'); history.replaceState(history.state, '', u0.pathname + (u0.search || '') + u0.hash); } } catch (e) { void e; }
  } catch (e) { void e; }
})();
