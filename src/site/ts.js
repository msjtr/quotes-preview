(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ICON = window.__ICON || {}, PATH = window.__PATH || '/', root = document.documentElement, app = $('.t2-app');
  function I(n, c) { return '<svg class="' + (c || 'ts-i') + '" viewBox="0 0 256 256" aria-hidden="true"><path d="' + (ICON[n] || '') + '"/></svg>'; }
  function post(m) { try { parent.postMessage(m, '*'); } catch (e) {} }
  function go(h) { post({ tera: 'nav', path: h }); }
  window.__go = go;
  function scrollToEl(el, center) { var r = el.getBoundingClientRect(); window.scrollTo({ top: Math.max(0, r.top + window.scrollY - (center ? (innerHeight - r.height) / 2 : 90)), behavior: 'smooth' }); }

  /* ---------- toast ---------- */
  var tEl, tT;
  function toast(text, act) {
    if (!tEl) { tEl = document.createElement('div'); tEl.className = 'ts-toast'; tEl.setAttribute('role', 'status'); document.body.appendChild(tEl); }
    tEl.innerHTML = '<span></span>'; tEl.firstChild.textContent = text;
    if (act) { var b = document.createElement('button'); b.type = 'button'; b.textContent = act[0]; b.onclick = function () { go(act[1]); }; tEl.appendChild(b); tEl.style.pointerEvents = 'auto'; } else tEl.style.pointerEvents = 'none';
    tEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { tEl.classList.remove('on'); tEl.style.pointerEvents = 'none'; }, 3600);
  }
  window.__toast = toast;

  /* ---------- theme ---------- */
  function dark() { return app.classList.contains('is-dark'); }
  function setDark(d) {
    app.classList.toggle('is-dark', d); root.classList.toggle('is-dark', d);
    try { localStorage.setItem('tera-theme', d ? 'night' : 'day'); } catch (e) {}
    $$('[data-act="theme"]').forEach(function (b) { b.setAttribute('aria-pressed', String(d)); });
    post({ tera: 'theme', dark: d });
  }
  var saved = null; try { saved = localStorage.getItem('tera-theme'); } catch (e) {}
  setDark(saved ? saved === 'night' : !!window.__DARK);
  window.__setTheme = setDark;

  /* ---------- clicks ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    var act = t.closest && t.closest('[data-act]');
    if (act) {
      var a = act.dataset.act;
      if (a === 'theme') { ev.preventDefault(); setDark(!dark()); return; }
      if (a === 'login') { ev.preventDefault(); ev.stopPropagation(); toast('سجّل الدخول لإضافة المنتجات إلى السلة والمفضلة وإتمام الطلب.', ['تسجيل الدخول', '/login']); return; }
      if (a === 'top') { ev.preventDefault(); var g = $('.st-grid, .pr-grid'); if (g) scrollToEl(g); return; }
      if (a === 'search') { ev.preventDefault(); openCmd(); return; }
    }
    if (t.closest && t.closest('.pc-fav, .pc-add, .pp-buy-b')) { ev.preventDefault(); ev.stopPropagation(); toast('سجّل الدخول لإضافة المنتجات إلى السلة والمفضلة وإتمام الطلب.', ['تسجيل الدخول', '/login']); return; }
    /* v239: بطاقات المنتجات خارج المتجر (مثل الرئيسية) تفتح صفحة المنتج عند الضغط */
    var pc0 = t.closest && t.closest('article.pc[data-sku]');
    if (pc0 && !pc0.dataset.go && !t.closest('.pc-attrs, button, select, input, a[href]')) { ev.preventDefault(); go('/product/' + pc0.dataset.sku); return; }
    var g2 = t.closest && t.closest('[data-go]');
    if (g2 && !(t.closest('.pc-attrs, .pc-pg'))) { ev.preventDefault(); go(g2.dataset.go); return; }
    var a2 = t.closest && t.closest('a[href]');
    if (a2) {
      var h = a2.getAttribute('href');
      if (h.charAt(0) === '/') { ev.preventDefault(); go(h); return; }
      if (h.charAt(0) === '#') { ev.preventDefault(); var el = document.getElementById(h.slice(1)); if (el) scrollToEl(el); return; }
      if (/^https?:/.test(h)) { a2.target = '_blank'; a2.rel = 'noopener'; }
    }
  });
  document.addEventListener('submit', function (ev) { ev.preventDefault(); if (!ev.target.closest('.pt, .ts-pcard') && !ev.target.id) toast('معاينة: لا تُرسل أي بيانات.'); }, true);

  /* ---------- sidebar v236: rail ⇄ pinned panel, with an overlay "peek" and tooltips ---------- */
  var SIDE_APP = $('.t2.t2-app'), SIDE_BTN = $('.t2-side-t'), SIDE = $('.t2-side');
  function sideMin() { return SIDE_APP.classList.contains('is-side-min'); }
  function sidePeek(on) { SIDE_APP.classList.toggle('is-side-peek', !!on && sideMin()); tipHide(); }
  function sideSet(open) { SIDE_APP.classList.toggle('is-side-min', !open); SIDE_APP.classList.remove('is-side-peek');
    if (SIDE_BTN) { SIDE_BTN.setAttribute('aria-expanded', String(open)); var l = $('.t2-side-tl', SIDE_BTN); if (l) l.textContent = open ? 'طيّ القائمة' : 'توسيع القائمة'; SIDE_BTN.dataset.tip = open ? 'طيّ القائمة' : 'توسيع القائمة'; }
    try { localStorage.removeItem('tera-side'); } catch (e) {} }
  if (SIDE_BTN) { sideSet(!sideMin()); SIDE_BTN.addEventListener('click', function () { sideSet(sideMin()); }); }
  function groupOpen(g, open) { var b = $('.t2-side-gb', g), h = $('.t2-side-gh', g); if (!b || !h) return; b.hidden = !open; h.setAttribute('aria-expanded', String(open)); g.classList.toggle('is-open', open); }
  $$('.t2-side-g').forEach(function (g) {
    var h = $('.t2-side-gh', g), b = $('.t2-side-gb', g);
    var here = $$('.t2-side-i', g).some(function (i) { return i.dataset.go === PATH; });
    if (h && b) {
      groupOpen(g, here); g.classList.toggle('has-on', here);
      h.addEventListener('click', function () {
        if (sideMin() && !SIDE_APP.classList.contains('is-side-peek')) { sidePeek(true); $$('.t2-side-g').forEach(function (o) { if (o !== g) groupOpen(o, false); }); groupOpen(g, true); return; }
        var open = b.hidden; $$('.t2-side-g').forEach(function (o) { if ($('.t2-side-gh', o)) groupOpen(o, false); }); groupOpen(g, open);
      });
    }
  });
  document.addEventListener('click', function (ev) { if (SIDE_APP.classList.contains('is-side-peek') && !ev.target.closest('.t2-side')) sidePeek(false); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') sidePeek(false); });
  /* tooltips for the rail (fixed, so the scrolling rail does not clip them) */
  var tipEl = document.createElement('div'); tipEl.className = 't2-tip'; tipEl.hidden = true; document.body.appendChild(tipEl);
  function tipHide() { tipEl.hidden = true; }
  if (SIDE) {
    SIDE.addEventListener('mouseover', function (ev) { var t = ev.target.closest('[data-tip], .t2-side-gh'); if (!t || !sideMin() || SIDE_APP.classList.contains('is-side-peek')) return tipHide();
      var r = t.getBoundingClientRect(); tipEl.textContent = t.dataset.tip || t.title || ''; if (!tipEl.textContent) return tipHide();
      tipEl.hidden = false; tipEl.style.top = (r.top + r.height / 2) + 'px'; tipEl.style.right = (innerWidth - r.left + 10) + 'px'; });
    SIDE.addEventListener('mouseleave', tipHide); SIDE.addEventListener('scroll', tipHide, { passive: true });
    $$('.t2-side-gh', SIDE).forEach(function (h) { if (h.title) { h.dataset.tip = h.title; h.removeAttribute('title'); } });
  }
  /* v241: في صفحة الدخول يختفي زر «تسجيل الدخول» من القائمة السفلية ويتوزع الزران الآخران */
  $$('.t2-dock').forEach(function (d) { d.classList.toggle('is-auth', /^\/login/.test(PATH)); });
  $$('.t2-side-i, .t2-dock-i').forEach(function (i) { var on = i.dataset.go === PATH || (i.dataset.alt && i.dataset.alt.split(' ').indexOf(window.__GROUP) >= 0); i.classList.toggle('is-on', !!on); });

  /* ---------- search (Ctrl K) ---------- */
  var cmd = null, FIND = window.__FIND || [];
  function openCmd() {
    if (!cmd) {
      cmd = document.createElement('div'); cmd.className = 'ts-cmd'; cmd.hidden = true;
      cmd.innerHTML = '<div class="ts-cmd-b" role="dialog" aria-label="البحث"><div class="ts-cmd-top">' + I('PiMagnifyingGlassFill') + '<input type="text" placeholder="ابحث في الأقسام والمنتجات والسياسات…" aria-label="بحث"><kbd>Esc</kbd></div><div class="ts-cmd-l"></div></div>';
      app.appendChild(cmd);
      var inp = $('input', cmd), list = $('.ts-cmd-l', cmd);
      var paint = function () {
        var q = inp.value.trim().toLowerCase();
        var hits = FIND.filter(function (x) { return !q || (x.t + ' ' + (x.k || '')).toLowerCase().indexOf(q) >= 0; }).slice(0, q ? 40 : 14);
        list.innerHTML = hits.length ? hits.map(function (x) { return '<button type="button" data-go="' + x.h + '">' + (x.i ? '<img src="' + x.i + '" alt="">' : I(x.ic || 'PiCaretLeftBold')) + '<span>' + x.t + '</span><small>' + (x.g || '') + '</small></button>'; }).join('') : '<p class="ts-cmd-none">لا توجد نتائج مطابقة.</p>';
      };
      inp.addEventListener('input', paint);
      cmd.addEventListener('click', function (e) { if (e.target === cmd) cmd.hidden = true; });
      paint();
    }
    cmd.hidden = false; setTimeout(function () { $('input', cmd).focus(); }, 20);
  }
  document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openCmd(); } if (e.key === 'Escape') { if (cmd) cmd.hidden = true; closeCb(); var m = $('.ts-modal:not([hidden])'); if (m) closeFilm(); } });

  /* ---------- filters (hf-row) ---------- */
  $$('.hf-row').forEach(function (row) {
    var chips = $$('.hf-c[data-flt]', row); if (!chips.length) return;
    var scope = row.parentNode;
    function apply(k) {
      chips.forEach(function (c) { var on = c.dataset.flt === k; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', String(on)); });
      $$('[data-f]', scope).forEach(function (s) { if (s.parentNode !== scope) return; s.hidden = !(k === 'all' || s.dataset.f === k); });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.dataset.flt); }); });
    var hk = window.__HASH; var hit = hk && chips.filter(function (c) { return c.dataset.flt === hk; })[0];
    if (hit) apply(hk); else if (chips[0].dataset.flt !== 'all') apply(chips[0].dataset.flt);
  });

  /* ---------- accordions ---------- */
  document.addEventListener('click', function (ev) {
    var h = ev.target.closest && ev.target.closest('.t2-sec-h'); if (!h) return;
    var sec = h.parentNode, b = $('.t2-sec-b', sec), open = h.getAttribute('aria-expanded') !== 'true';
    var grp = sec.parentNode;
    if (open) $$('.t2-sec', grp).forEach(function (o) { if (o !== sec) { var oh = $('.t2-sec-h', o), ob = $('.t2-sec-b', o); if (oh && ob) { oh.setAttribute('aria-expanded', 'false'); ob.hidden = true; } } });
    h.setAttribute('aria-expanded', String(open)); if (b) b.hidden = !open;
  });

  /* ---------- carousels ---------- */
  function carousel(rootEl, slideSel, dotSel, prevSel, nextSel, ms) {
    var slides = $$(slideSel, rootEl), dots = $$(dotSel, rootEl), i = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-on'); })), tm;
    if (slides.length < 2) return;
    function show(k) { i = (k + slides.length) % slides.length; slides.forEach(function (s, j) { s.classList.toggle('is-on', j === i); s.setAttribute('aria-hidden', String(j !== i)); }); dots.forEach(function (d, j) { d.classList.toggle('is-on', j === i); d.setAttribute('aria-selected', String(j === i)); }); }
    function arm() { clearInterval(tm); tm = setInterval(function () { show(i + 1); }, ms); }
    dots.forEach(function (d, j) { d.addEventListener('click', function (e) { e.stopPropagation(); show(j); arm(); }); });
    var p = prevSel && $(prevSel, rootEl), n = nextSel && $$(nextSel, rootEl).pop();
    if (p) p.addEventListener('click', function () { show(i - 1); arm(); });
    if (n && n !== p) n.addEventListener('click', function () { show(i + 1); arm(); });
    rootEl.addEventListener('mouseenter', function () { clearInterval(tm); }); rootEl.addEventListener('mouseleave', arm);
    show(i); arm();
  }
  $$('.ad').forEach(function (a) { carousel(a, '.ad-s', '.ad-dots button', null, null, 6000); });
  $$('.sh').forEach(function (a) { carousel(a, '.sh-slide', '.sh-dots button', '.sh-arrow', '.sh-arrow', 7000); });

  /* ---------- store tabs, brands, search ---------- */
  $$('.st-tab[data-tab]').forEach(function (t) {
    t.addEventListener('click', function () {
      var tpl = $('template[data-tabtpl="' + t.dataset.tab + '"]'), tb = t.closest('.mk-sec') && $('.tb', t.closest('.mk-sec'));
      $$('.st-tab', t.parentNode).forEach(function (o) { o.classList.toggle('is-on', o === t); o.setAttribute('aria-selected', String(o === t)); });
      if (tpl && tb) { var d = document.createElement('div'); d.innerHTML = tpl.innerHTML; var nt = $('.tb', d) || d.firstElementChild; if (nt) tb.replaceWith(nt); }
    });
  });
  var grid = $('.st-grid');
  if (grid) {
    var cards = $$('article.pc', grid), brand = 'all', q = '';
    var paintG = function () { cards.forEach(function (c) { var okb = brand === 'all' || c.dataset.br === brand; var okq = !q || c.textContent.toLowerCase().indexOf(q) >= 0; c.hidden = !(okb && okq); }); };
    $$('.br-c').forEach(function (b) { b.addEventListener('click', function () { $$('.br-c').forEach(function (o) { o.classList.toggle('is-on', o === b); o.setAttribute('aria-selected', String(o === b)); }); brand = b.classList.contains('is-all') ? 'all' : ($('b', b) || {}).textContent; paintG(); }); });
    var si = $('.st-search-i'); if (si) si.addEventListener('input', function () { q = si.value.trim().toLowerCase(); paintG(); });
  }

  /* ---------- product page ---------- */
  var gal = $('.pp-media.is-gal');
  if (gal) {
    var sl = $$('.pg-slide', gal), th = $$('.pg-th'), seg = $$('.pg-segs i'), n = $('.pg-n', gal), gi = 0, gt;
    var gshow = function (k) { gi = (k + sl.length) % sl.length; sl.forEach(function (s, j) { s.classList.toggle('is-on', j === gi); }); th.forEach(function (s, j) { s.classList.toggle('is-on', j === gi); }); seg.forEach(function (s, j) { s.classList.toggle('is-on', j === gi); }); if (n) n.textContent = (gi + 1) + ' / ' + sl.length; };
    th.forEach(function (b, j) { b.addEventListener('click', function () { gshow(j); }); });
    var nv = $$('.pg-nav'); if (nv[0]) nv[0].addEventListener('click', function () { gshow(gi - 1); }); if (nv[1]) nv[1].addEventListener('click', function () { gshow(gi + 1); });
    gt = setInterval(function () { gshow(gi + 1); }, 6000); gal.addEventListener('mouseenter', function () { clearInterval(gt); });
    /* tap the image to open a full-screen viewer (no fixed zoom button or counter on the page) */
    var hint = document.createElement('span'); hint.className = 'pg-hint'; hint.innerHTML = I('PiMagnifyingGlassFill') + '<span>اضغط للتكبير</span>'; gal.appendChild(hint);
    function kbOf(k) { return $('.pg-kb', sl[k]); }
    function openLb(start) {
      clearInterval(gt); var k = start, lb = document.createElement('div'); lb.className = 'ts-lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<div class="ts-lb-bar"><span class="ts-lb-n"></span><button type="button" class="ts-lb-x" aria-label="إغلاق">' + I('PiXBold') + '</button></div><div class="ts-lb-im"></div>' +
        '<div class="ts-lb-foot"><button type="button" class="ts-lb-nav" data-d="1" aria-label="التالي">' + I('PiCaretRightBold') + '</button><span class="ts-lb-dots">' + sl.map(function () { return '<i></i>'; }).join('') + '</span><button type="button" class="ts-lb-nav" data-d="-1" aria-label="السابق">' + I('PiCaretLeftBold') + '</button></div>';
      app.appendChild(lb); document.documentElement.classList.add('ts-noscroll');
      function paint() { var s = kbOf(k), im = $('.ts-lb-im', lb); if (s) { im.style.backgroundImage = s.style.backgroundImage; im.style.backgroundPosition = s.style.backgroundPosition; im.style.backgroundSize = s.style.backgroundSize || '500% 100%'; }
        $('.ts-lb-n', lb).textContent = (k + 1) + ' / ' + sl.length; $$('.ts-lb-dots i', lb).forEach(function (d, j) { d.classList.toggle('is-on', j === k); }); gshow(k); }
      function step(d) { k = (k + d + sl.length) % sl.length; paint(); }
      function close() { lb.remove(); document.documentElement.classList.remove('ts-noscroll'); document.removeEventListener('keydown', key); }
      function key(e) { if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(1); if (e.key === 'ArrowRight') step(-1); }
      document.addEventListener('keydown', key);
      lb.addEventListener('click', function (e) { var n = e.target.closest('.ts-lb-nav'); if (n) return step(+n.dataset.d); if (e.target.closest('.ts-lb-x') || e.target === lb) close(); });
      var x0 = null; lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) step(dx > 0 ? 1 : -1); x0 = null; });
      paint();
    }
    sl.forEach(function (s, j) { s.addEventListener('click', function () { openLb(j); }); });
    var gx = null; gal.addEventListener('touchstart', function (e) { gx = e.touches[0].clientX; clearInterval(gt); }, { passive: true });
    gal.addEventListener('touchend', function (e) { if (gx === null) return; var dx = e.changedTouches[0].clientX - gx; if (Math.abs(dx) > 40) gshow(gi + (dx > 0 ? 1 : -1)); gx = null; });
  }
  var OPT = window.__OPT || {}, sku = (PATH.match(/^\/product\/(.+)$/) || [])[1];
  function closeCb() { $$('.t2-cb.is-open').forEach(function (c) { c.classList.remove('is-open'); var b = $('.t2-cb-btn', c); if (b) b.setAttribute('aria-expanded', 'false'); }); }
  $$('.pp-opts .t2-field').forEach(function (f, k) {
    var cb = $('.t2-cb', f), btn = $('.t2-cb-btn', f), list = $('.t2-cb-l', f), lab = $('.t2-field-k', f);
    var o = (OPT[sku] || [])[k]; if (!cb || !btn || !o) return;
    var name = o[0], vals = o[1], colors = o[2] || {};
    list.innerHTML = vals.map(function (v, j) { return '<li role="option" data-j="' + j + '">' + (colors[v[0]] ? '<i style="width:16px;height:16px;border-radius:50%;background:' + colors[v[0]] + ';box-shadow:inset 0 0 0 1px rgba(0,0,0,.15);flex:none"></i>' : '') + '<span>' + v[0] + '</span>' + (v[1] ? '<small>' + Number(v[1]).toLocaleString('en-US') + ' ر.س</small>' : '') + '</li>'; }).join('');
    btn.addEventListener('click', function (e) { e.stopPropagation(); var op = !cb.classList.contains('is-open'); closeCb(); cb.classList.toggle('is-open', op); btn.setAttribute('aria-expanded', String(op)); });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (!li) return; var v = vals[+li.dataset.j]; $('.t2-cb-v', btn).textContent = v[0] + (v[1] ? ' — ' + Number(v[1]).toLocaleString('en-US') + ' ر.س' : ''); if (lab) lab.textContent = name + ': ' + v[0]; closeCb(); });
    var x = $('.t2-cb-x', f); if (x) x.addEventListener('click', closeCb);
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.t2-cb')) closeCb(); });
  $$('.pp-qty').forEach(function (q) { var v = $('.pp-qty-v', q), b = $$('.pp-qty-b', q); if (b[0]) b[0].addEventListener('click', function () { v.value = Math.min(99, (+v.value || 1) + 1); }); if (b[1]) b[1].addEventListener('click', function () { v.value = Math.max(1, (+v.value || 1) - 1); }); });
  $$('.pp-buy-r2 .t2-btn').forEach(function (b) { b.addEventListener('click', function () { var t = b.textContent; if (t.indexOf('عرض سعر') >= 0) go('/desk'); else toast('المقارنة متاحة بعد تسجيل الدخول.', ['تسجيل الدخول', '/login']); }); });

  /* v242: شعار التذييل — يعمل فقط وهو ظاهر */
  (function () { var f = $('.ts-foot.tf'); if (!f) return; if (!('IntersectionObserver' in window)) { f.classList.add('is-play'); return; }
    new IntersectionObserver(function (en) { en.forEach(function (x) { f.classList.toggle('is-play', x.isIntersecting); }); }, { threshold: .05 }).observe(f); })();
  /* ---------- videos ---------- */
  var vids = $$('video[data-w]');
  function vkind(v) { var b = v.parentNode, w = b.clientWidth || 0, h = b.clientHeight || 1; return (w / h) < 1.4 ? 'm' : 'w'; }
  function vpick(v) { var k = vkind(v); if (v.dataset.k === k) return; v.dataset.k = k; v.poster = v.dataset['p' + k]; if (v.dataset.on) { v.src = v.dataset[k]; v.load(); } }
  function vplay(v) { if (v.dataset.user === 'off') return; if (v.offsetWidth) vpick(v); if (!v.dataset.on) { v.dataset.on = '1'; v.src = v.dataset[v.dataset.k || 'w']; } var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) { en.forEach(function (x) { var v = x.target; if (x.isIntersecting) vplay(v); else if (!v.paused) v.pause(); }); }, { threshold: .15 }) : null;
  /* v238: تحميل مسبق للفيديو قبل الوصول إليه بشاشة تقريبًا، فيبدأ فور المرور دون انتظار */
  function vprep(v) { if (v.dataset.on || v.dataset.user === 'off') return; if (v.offsetWidth) vpick(v); v.dataset.on = '1'; v.preload = 'auto'; v.src = v.dataset[v.dataset.k || 'w']; v.load(); }
  var slow = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  function preCb(en) { en.forEach(function (x) { if (x.isIntersecting) { vprep(x.target); pre.unobserve(x.target); } }); }
  var pre = null;
  if ('IntersectionObserver' in window && !slow) { try { pre = new IntersectionObserver(preCb, { root: document, rootMargin: '110% 0px 110% 0px' }); } catch (e) { pre = new IntersectionObserver(preCb, { rootMargin: '110% 0px 110% 0px' }); } }
  vids.forEach(function (v) { v.muted = true; vpick(v); if (pre) pre.observe(v); if (io) io.observe(v); else vplay(v); });
  var vrt; window.addEventListener('resize', function () { clearTimeout(vrt); vrt = setTimeout(function () { vids.forEach(function (v) { var was = !v.paused; vpick(v); if (was) vplay(v); }); }, 200); });
  $$('.ts-vid-b').forEach(function (b) {
    var v = $('video', b.parentNode);
    b.addEventListener('click', function (e) { e.stopPropagation(); if (v.paused) { v.dataset.user = ''; vplay(v); b.innerHTML = I('PiPauseFill') + '<span>إيقاف</span>'; } else { v.dataset.user = 'off'; v.pause(); b.innerHTML = I('PiPlayFill') + '<span>تشغيل</span>'; } });
  });
  /* ---------- launch film v236: stable player, right variant per screen, above header and dock ---------- */
  var modal = null, filmKey = '';
  function filmPortrait() { return innerHeight > innerWidth * 1.15 || innerWidth < 560; }
  function closeFilm() { if (!modal) return; var v = $('video', modal); try { v.pause(); } catch (e) {} modal.hidden = true; document.documentElement.classList.remove('ts-noscroll'); }
  function buildFilm() {
    var fm = filmPortrait() ? '-m' : ''; if (modal && filmKey === fm) return modal;
    if (modal) modal.remove(); filmKey = fm;
    modal = document.createElement('div'); modal.className = 'ts-modal ts-fm' + (fm ? ' is-m' : ''); modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', 'فيلم تدشين منصة تيرا');
    modal.innerHTML = '<div class="ts-fm-bar"><span class="ts-fm-t">' + I('PiFilmSlateFill') + '<b>فيلم تدشين منصة تيرا</b></span><button type="button" class="ts-modal-x" aria-label="إغلاق">' + I('PiXBold') + '</button></div>' +
      '<div class="ts-fm-box"><video controls playsinline preload="metadata" poster="vid/film-poster' + fm + '.jpg"><source src="vid/film' + fm + '.mp4" type="video/mp4"></video>' +
      '<span class="ts-fm-load"><i></i><b>جارٍ تحميل الفيلم…</b></span><p class="ts-fm-err" hidden>تعذّر تشغيل الفيلم على هذا الجهاز. <a href="vid/film' + fm + '.mp4" target="_blank" rel="noopener">افتحه مباشرة</a></p></div>';
    app.appendChild(modal);
    var v = $('video', modal), ld = $('.ts-fm-load', modal);
    ['playing', 'canplay'].forEach(function (k) { v.addEventListener(k, function () { ld.hidden = true; }); });
    v.addEventListener('waiting', function () { ld.hidden = false; });
    v.addEventListener('error', function () { ld.hidden = true; $('.ts-fm-err', modal).hidden = false; }, true);
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.ts-modal-x')) closeFilm(); });
    return modal;
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal && !modal.hidden) closeFilm(); });
  window.addEventListener('resize', function () { if (modal && !modal.hidden && filmKey !== (filmPortrait() ? '-m' : '')) { var t = $('video', modal).currentTime; buildFilm(); modal.hidden = false; var v = $('video', modal); v.addEventListener('loadedmetadata', function () { v.currentTime = t; }, { once: true }); v.play().catch(function () {}); } });
  $$('[data-film]').forEach(function (b) { b.addEventListener('click', function () {
    var inl = $('.ts-film-p video'), t0 = inl && !inl.paused ? inl.currentTime : 0; if (inl) { inl.dataset.user = 'off'; inl.pause(); }
    buildFilm(); modal.hidden = false; document.documentElement.classList.add('ts-noscroll');
    var v = $('video', modal); $('.ts-fm-load', modal).hidden = false; $('.ts-fm-err', modal).hidden = true;
    try { v.currentTime = t0; } catch (e) {} var p = v.play(); if (p && p.catch) p.catch(function () { $('.ts-fm-load', modal).hidden = true; });
    setTimeout(function () { var x = $('.ts-modal-x', modal); if (x) x.focus({ preventScroll: true }); }, 50);
  }); });

  /* ---------- inline launch film: plays muted when visible; the viewer turns the sound on ---------- */
  $$('.ts-film-snd').forEach(function (b) { var v = $('video', b.closest('.ts-film-p')); if (!v) return;
    b.addEventListener('click', function (e) { e.stopPropagation(); var on = v.muted; v.muted = !on; if (on) { v.dataset.user = ''; if (v.paused) vplay(v); }
      b.setAttribute('aria-pressed', String(on)); b.innerHTML = I(on ? 'PiSpeakerHighFill' : 'PiSpeakerSlashFill') + '<span>' + (on ? 'كتم الصوت' : 'تشغيل الصوت') + '</span>'; }); });

  /* ---------- membership cards: card width drives their scale (replaces costly nested container queries) ---------- */
  (function () { var cards = $$('.mcard'); if (!cards.length) return; var set = function (c) { var w = c.getBoundingClientRect().width; if (w) c.style.setProperty('--mcw', w.toFixed(1) + 'px'); };
    cards.forEach(set); if ('ResizeObserver' in window) { var ro = new ResizeObserver(function (en) { en.forEach(function (x) { var w = x.contentRect.width; if (w) x.target.style.setProperty('--mcw', w.toFixed(1) + 'px'); }); }); cards.forEach(function (c) { ro.observe(c); }); } })();

  /* ---------- category images: gentle rotation of the three product shots ---------- */
  (function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var boxes = $$('.mk-cat-ims, .hc-ims').filter(function (b) { return !b.classList.contains('is-dg') && !b.closest('.is-dg') && $$('img.is-0, img.is-1, img.is-2', b).length === 3; });
    if (!boxes.length) return;
    var vis = new Map(), io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) { en.forEach(function (x) { vis.set(x.target, x.isIntersecting); }); }) : null;
    boxes.forEach(function (b, n) { if (io) io.observe(b); else vis.set(b, true);
      setTimeout(function () { setInterval(function () { if (!vis.get(b) || document.hidden || b.matches(':hover')) return;
        $$('img', b).forEach(function (im) { var m = im.className.match(/is-(\d)/); if (!m) return; var k = (+m[1] + 1) % 3; im.classList.remove('is-' + m[1]); im.classList.add('is-' + k); }); }, 3200); }, 600 + (n % 6) * 450); });
  })();

  /* ---------- stats ---------- */
  var st = $$('[data-count]');
  if (st.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (!x.isIntersecting) return; sio.unobserve(x.target); var el = x.target, raw = el.dataset.count, m = raw.match(/^(\+?)([\d,]+)/); if (!m) return; var tgt = +m[2].replace(/,/g, ''), t0 = performance.now(); (function tick(now) { var k = Math.min(1, (now - t0) / 1800), e2 = 1 - Math.pow(1 - k, 3); el.textContent = m[1] + Math.round(tgt * e2).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(tick); })(t0); }); }, { threshold: .4 });
    st.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- hash ---------- */
  if (window.__HASH) setTimeout(function () { var el = document.getElementById(window.__HASH); if (el && !el.closest('[hidden]')) { scrollToEl(el); var h = $('.t2-sec-h', el); if (h && h.getAttribute('aria-expanded') !== 'true') h.click(); } }, 400);
  if (window.__FOCUS) setTimeout(function () { var a = $('article.pc[data-sku="' + window.__FOCUS + '"]'); if (a) scrollToEl(a, true); }, 500);

  /* ---------- opening ---------- */
  var op = $('.ts-open'); if (op) setTimeout(function () { op.classList.add('is-done'); setTimeout(function () { op.remove(); }, 500); }, window.__OPENMS || 3000);

  /* ---------- desk ---------- */
  if ($('#dk-form')) (function () {
    var TYPES = { request: ['نوع الطلب', ['طلب عرض سعر', 'المنتجات الأكثر طلبًا وتداولًا', 'خدمة حسب الطلب', 'طلب متعلق بخدمة قائمة'], 'تفاصيل الطلب', 'إرسال الطلب'],
                  complaint: ['نوع الشكوى', ['شكوى عن خدمة', 'شكوى عن طلب', 'شكوى عن تعامل'], 'تفاصيل الشكوى', 'إرسال الشكوى'],
                  support: ['نوع الدعم', ['مشكلة في الحساب', 'مشكلة في المنصة', 'مشكلة في الدفع'], 'تفاصيل المشكلة', 'إرسال طلب الدعم'],
                  inquiry: ['نوع الاستفسار', ['عن خدمة', 'عن منتج', 'عن العضوية', 'عن السياسات'], 'نص الاستفسار', 'إرسال الاستفسار'] };
    var form = $('#dk-form'), done = $('#dk-done');
    function msg(id, k, t) { var m = $('#' + id); m.className = 'ts-msg' + (k ? ' ' + k : ''); m.textContent = t || ''; m.hidden = !t; }
    $$('.t2-mp-i[data-kind]').forEach(function (b) { b.addEventListener('click', function () {
      $$('.t2-mp-i[data-kind]').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); o.classList.toggle('is-on', o === b); });
      var c = TYPES[b.dataset.kind]; $('#dk-type-l').textContent = c[0]; $('#dk-type').innerHTML = '<option value="">اختر</option>' + c[1].map(function (x) { return '<option>' + x + '</option>'; }).join('');
      $('#dk-det-l').textContent = c[2]; $('#dk-send').textContent = c[3]; $('#dk-title').textContent = 'بيانات ' + $('.t2-mp-n', b).textContent;
      form.hidden = false; done.hidden = true; msg('dk-msg'); scrollToEl(form);
    }); });
    var reMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, reLocal = /^[1-9]\d{6,11}$/;
    $('#dk-send').addEventListener('click', function () {
      var bad = [['#dk-name', !!$('#dk-name').value.trim()], ['#dk-ph', reLocal.test($('#dk-ph').value.replace(/\s/g, ''))], ['#dk-em', reMail.test($('#dk-em').value.trim())], ['#dk-type', !!$('#dk-type').value], ['#dk-subj', !!$('#dk-subj').value.trim()], ['#dk-det', !!$('#dk-det').value.trim()]];
      bad.forEach(function (x) { $(x[0]).classList.toggle('bad', !x[1]); });
      if (bad.some(function (x) { return !x[1]; })) return msg('dk-msg', 'bad', 'يرجى استكمال البيانات المظللة: الاسم، والجوال بدون صفر في أوله، والبريد، والنوع، والموضوع، والتفاصيل.');
      $('#dk-ref').textContent = '#TERA-' + String(Math.floor(100000 + Math.random() * 899999)); form.hidden = true; done.hidden = false; scrollToEl(done);
    });
    $('#dk-draft').addEventListener('click', function () { msg('dk-msg', 'warn', 'حُفظت مسودة. لا تُسجَّل مراسلة رسمية ولا تبدأ مدة الرد إلا بعد الإرسال.'); });
    $('#dk-again').addEventListener('click', function () { done.hidden = true; $$('.t2-mp-i').forEach(function (o) { o.setAttribute('aria-checked', 'false'); o.classList.remove('is-on'); }); scrollToEl($('.ts-desk-kinds')); });
    $('#fw-go').addEventListener('click', function () {
      var r = $('#fw-ref').value.replace(/\s/g, '').toUpperCase().replace(/^#/, '');
      if (!/^TERA-\d{6}$/.test(r) || !reMail.test($('#fw-em').value.trim())) { $('#fw-out').hidden = true; return msg('fw-msg', 'bad', 'أدخل رقم المراسلة بصيغة TERA-000000 والبريد المسجّل فيها.'); }
      msg('fw-msg'); $('#fw-ref-v').textContent = '#' + r; $('#fw-out').hidden = false;
    });
  })();

  if ($('#dk-form') && window.__HASH) setTimeout(function () { var kb = $('.t2-mp-i[data-kind="' + window.__HASH + '"]'); if (kb) { kb.click(); scrollToEl(kb); } }, 350);
  /* ---------- v262: شريط تقدّم التمرير، والإصدار في التذييل، وزر الدخول ---------- */
  (function () {
    var head = $('.t2-head');
    if (head && !$('.tq-prog', head)) {
      var bar = document.createElement('i'); bar.className = 'tq-prog'; bar.setAttribute('aria-hidden', 'true'); head.appendChild(bar);
      var se = document.scrollingElement || document.documentElement, raf = 0;
      var upd = function () { raf = 0; var max = se.scrollHeight - se.clientHeight; bar.style.width = (max > 0 ? Math.min(100, Math.max(0, se.scrollTop / max * 100)) : 0) + '%'; };
      window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
      window.addEventListener('resize', upd); setTimeout(upd, 300); upd();
    }
    if (window.__PATH === '/login') document.documentElement.classList.add('is-login');
    var cp = $('.tf-copy'), pv = null; try { pv = parent.document.querySelector('.tq-ver'); } catch (e) {}
    if (cp && pv && !$('.tf-ver', cp)) { var v = document.createElement('span'); v.className = 'tf-ver'; v.innerHTML = pv.innerHTML; cp.appendChild(v); }
    var live = false; try { live = /(^|\.)tera-services\.com\.sa$/.test(parent.location.hostname || location.hostname); } catch (e) {}
    if (live) {
      var tok = ''; try { var s0 = JSON.parse(localStorage.getItem('tera.admin.session') || 'null'); if (s0 && s0.access_token && (!s0.expires_at || s0.expires_at * 1000 > Date.now())) tok = s0.access_token; } catch (e) {}
      var inb = $('.t2-hbtn.is-in');
      if (tok && inb) {
        var tt = $('.t2-hbtn-t', inb); if (tt) tt.textContent = 'حسابي'; inb.setAttribute('aria-label', 'حسابي');
        inb.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); try { top.location.href = '/staff/'; } catch (e) { location.href = '/staff/'; } }, true);
      }
    }
  })();

  /* ---------- v263: حقول الجوال ذات مفتاح الدولة لا تقبل صفرًا في أوله ---------- */
  (function () {
    if (window.__tqZero) return; window.__tqZero = true;
    function isCC(el) { return !!(el && el.tagName === 'INPUT' && (el.closest('.ts-tel') || /^5X{6,}$/.test(el.getAttribute('placeholder') || ''))); }
    function note(el) {
      var host = el.closest('.ts-tel') || el, n = host.nextElementSibling;
      if (!n || !n.classList.contains('tq-zero')) { n = document.createElement('small'); n.className = 'tq-zero'; n.setAttribute('role', 'status'); n.textContent = 'اكتب الرقم بدون صفر في أوله؛ مفتاح الدولة محدد.'; host.insertAdjacentElement('afterend', n); }
      n.hidden = false; clearTimeout(n._t); n._t = setTimeout(function () { n.hidden = true; }, 3500);
    }
    document.addEventListener('input', function (ev) {
      var el = ev.target; if (!isCC(el)) return;
      var v = String(el.value || ''), a = v.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); }).replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x6F0); }).replace(/\D/g, ''), z = a.replace(/^0+/, '');
      if (z !== v) { el.value = z; if (z !== a) note(el); }
    }, true);
  })();

  /* ---------- v263: مؤشر تمرير المسار الجانبي حين يخفي الجهاز شريط التمرير (جوال/ماك) ---------- */
  (function () {
    var side = $('.t2-side'), nav = $('.t2-side-n'); if (!side || !nav || $('.tq-rail', side)) return;
    var tr = document.createElement('i'), th = document.createElement('b'); tr.className = 'tq-rail'; tr.setAttribute('aria-hidden', 'true'); tr.appendChild(th); side.appendChild(tr);
    /* بلا MutationObserver: كان يراقب الشريط وهو يغيّره فيدخل في حلقة لا تنتهي (v263) */
    var last = '';
    function upd() {
      var sh = nav.scrollHeight, ch = nav.clientHeight, overlay = nav.offsetWidth === nav.clientWidth, on = overlay && sh > ch + 2;
      if (tr.hidden === on) tr.hidden = !on; if (!on) return;
      var h = Math.max(28, ch * ch / sh), key = nav.offsetTop + '|' + ch + '|' + Math.round(h) + '|' + Math.round((ch - h) * nav.scrollTop / (sh - ch));
      if (key === last) return; last = key; var k = key.split('|');
      tr.style.top = k[0] + 'px'; tr.style.height = k[1] + 'px'; th.style.height = k[2] + 'px'; th.style.transform = 'translateY(' + k[3] + 'px)';
    }
    nav.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd);
    try { new ResizeObserver(upd).observe(nav); } catch (e) {}
    side.addEventListener('click', function () { setTimeout(upd, 320); });
    setTimeout(upd, 300); upd();
  })();

  /* ---------- portal (v232): one identity, 10-minute session on every flow ---------- */
  if ($('#f-login')) (function () {
    var FLOWS = {
      login: { steps: ['بيانات الدخول', 'التحقق', 'الجهاز'], forms: ['login', 'otp', 'device'], ic: ['PiLockKeyFill', 'PiKeyFill', 'PiDesktopFill'],
        t: ['تسجيل الدخول', 'التحقق الثنائي', 'توثيق الجهاز'],
        s: ['حساب واحد لكل خدماتك في منصة تيرا.', 'اختر وسيلة التحقق، ثم أدخل الرمز الذي يصلك.', 'هذا أول دخول من هذا الجهاز. قرّر هل تصرّح له.'] },
      register: { steps: ['بياناتك', 'التواصل', 'كلمة المرور', 'التحقق', 'المصادقة', 'الجهاز'], forms: ['reg1', 'reg2', 'reg3', 'reg4', 'reg5', 'reg6'],
        ic: ['PiUserPlusFill', 'PiPhoneFill', 'PiLockKeyFill', 'PiSealCheckFill', 'PiShieldCheckFill', 'PiDesktopFill'],
        t: ['إنشاء حساب جديد', 'بيانات التواصل', 'كلمة المرور', 'التحقق من البريد والجوال', 'المصادقة الثنائية', 'توثيق الجهاز'],
        s: ['ابدأ باسمك الكامل كما في الهوية.', 'نرسل إليها رموز التحقق وتنبيهات حسابك.', 'اختر كلمة مرور قوية وأكّدها.', 'تأكد من أن البريد والجوال يخصّانك.', 'خطوة إلزامية: فعّل وسيلة واحدة أو الاثنتين.', 'اختر هل تصرّح لهذا الجهاز ومدة التصريح.'] },
      forgot: { steps: ['الجوال', 'البريد', 'التحقق الإضافي', 'كلمة جديدة'], forms: ['fg1', 'fg2', 'fg3', 'fg4'],
        ic: ['PiPhoneFill', 'PiEnvelopeFill', 'PiShieldCheckFill', 'PiLockKeyFill'],
        t: ['نسيت كلمة المرور', 'التحقق من البريد', 'التحقق الإضافي', 'كلمة مرور جديدة'],
        s: ['الخطوة الأولى: تحقق من رقم جوالك المسجّل.', 'الخطوة الثانية: تحقق من بريدك المسجّل.', 'رمز تطبيق المصادقة أو الرمز الإضافي.', 'اختر كلمة مرور قوية وأكّدها.'] },
      recover: { steps: ['رمز الاستعادة', 'كلمة مرور جديدة'], forms: ['rc1', 'rc2'], ic: ['PiShieldCheckFill', 'PiLockKeyFill'],
        t: ['استعادة الوصول', 'كلمة مرور جديدة'], s: ['عند فقدان الجوال أو تطبيق المصادقة.', 'اختر كلمة مرور قوية وأكّدها.'] }
    };
    var ALL = ['login', 'otp', 'device', 'reg1', 'reg2', 'reg3', 'reg4', 'reg5', 'reg6', 'fg1', 'fg2', 'fg3', 'fg4', 'rc1', 'rc2', 'done'];
    var SESSION = 600, cur = { flow: 'login', i: 0 }, timerId, left = SESSION, humanOk = false, cdId, vId, tries = 5;
    /* ---- live gateway: on the platform hosts (staging / quotes) the portal talks to the real server
       (/api/auth/*) with the real human check; everywhere else (GitHub preview) it stays a demo ---- */
    var LIVE = /(^|\.)tera-services\.com\.sa$/.test((function () { try { return parent.location.hostname || location.hostname; } catch (e) { return location.hostname; } })());
    var S = { pending: '', factors: [], ch: {}, fg: '', tok: '', inn: false, reg: {}, dev: null };
    var F2V = { email: 'mail', whatsapp: 'wa', totp: 'app' }, V2F = { mail: 'email', wa: 'whatsapp', app: 'totp' };
    if (LIVE) FLOWS.register = { steps: ['بياناتك', 'التواصل', 'كلمة المرور', 'التحقق'], forms: ['reg1', 'reg2', 'reg3', 'reg4'],
      ic: ['PiUserPlusFill', 'PiPhoneFill', 'PiLockKeyFill', 'PiSealCheckFill'],
      t: ['إنشاء حساب جديد', 'بيانات التواصل', 'كلمة المرور', 'التحقق من البريد والجوال'],
      s: ['ابدأ باسمك الكامل كما في الهوية.', 'نرسل إليها رموز التحقق وتنبيهات حسابك.', 'اختر كلمة مرور قوية وأكّدها.', 'تأكد من أن البريد والجوال يخصّانك، ثم أنشئ الحساب.'] };
    if (LIVE) FLOWS.forgot = { steps: ['الجوال', 'البريد', 'كلمة جديدة'], forms: ['fg1', 'fg2', 'fg4'], ic: ['PiPhoneFill', 'PiEnvelopeFill', 'PiLockKeyFill'],
      t: ['نسيت كلمة المرور', 'التحقق من البريد', 'كلمة مرور جديدة'], s: ['الخطوة الأولى: تحقق من رقم جوالك المسجّل عبر واتساب.', 'الخطوة الثانية: تحقق من بريدك المسجّل.', 'اختر كلمة مرور قوية وأكّدها.'] };
    function tile(ic) { var t = $('#pt-tiles'), s = t && t.content.querySelector('[data-ic="' + ic + '"]'); return s ? s.innerHTML : I(ic); }
    function go(flow, i) {
      if (flow !== cur.flow) startTimer();
      cur = { flow: flow, i: i }; var F = FLOWS[flow];
      ALL.forEach(function (x) { var el = $('#f-' + x); if (el) el.hidden = x !== F.forms[i]; });
      $('#pt-t').textContent = F.t[i]; $('#pt-s').textContent = F.s[i];
      var ic = $('#pt-ic'); ic.innerHTML = tile(F.ic[i]); ic.classList.remove('pop'); void ic.offsetWidth; ic.classList.add('pop');
      var st = $('#pt-steps'); st.dataset.n = F.steps.length;
      st.innerHTML = F.steps.map(function (s, k) { return '<li class="' + (k < i ? 'is-done' : k === i ? 'is-now' : '') + '"><i>' + (k < i ? '✓' : (k + 1)) + '</i><span>' + s + '</span></li>'; }).join('');
      st.hidden = false; $('#pt-back').hidden = flow === 'login' && i === 0; $('#pt-timer').hidden = false;
      $('.pt').dataset.flow = flow;
      var card = $('.pt'); if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (LIVE && (F.forms[i] === 'fg1' || F.forms[i] === 'fg2')) fgHuman(F.forms[i]);
      if (F.forms[i] === 'reg4') reg4Enter(); if (F.forms[i] === 'reg5') mcHint();
      if (F.forms[i] === 'device' || F.forms[i] === 'reg6') devName();
    }
    function finish(h, p, o) {
      o = o || {};
      ALL.forEach(function (x) { var el = $('#f-' + x); if (el) el.hidden = x !== 'done'; });
      $('#pt-steps').querySelectorAll('li').forEach(function (li) { li.className = 'is-done'; li.querySelector('i').textContent = '✓'; });
      $('#pt-t').textContent = h; $('#pt-s').textContent = 'اكتملت جميع الخطوات.'; $('#pt-ic').innerHTML = tile('PiCheckCircleFill'); $('#pt-back').hidden = true;
      clearInterval(timerId); $('#pt-timer').hidden = true;
      $('#done-h').textContent = h; $('#done-p').textContent = p;
      $('#done-ids').hidden = !o.ids; if (o.ids) { $('#done-uid').textContent = o.ids[0]; $('#done-req').textContent = o.ids[1]; }
      $('#done-next').hidden = !o.next; $('#done-exit').hidden = !o.next; $('#done-exit-n').hidden = !o.next;
      var g = $('#done-go'); g.hidden = !(o.enter || o.next); g.textContent = o.next ? 'استمرار' : 'المتابعة إلى حسابك';
      $('#done-login').hidden = !o.login; $('#done-again').hidden = !!o.next;
    }
    function msg(id, k, t) { var m = typeof id === 'string' ? $('#' + id) : id; if (!m) return; m.className = (m.classList.contains('vc-msg') ? 'vc-msg' : m.classList.contains('mf-msg') ? 'mf-msg' : 'ts-msg') + (k ? ' ' + k : ''); m.textContent = t || ''; m.hidden = !t; }
    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
    function tick() { var l = Math.max(left, 0); $('#timer-v').textContent = fmt(l); $('#timer-bar').style.width = (l / SESSION * 100) + '%'; $('#pt-timer').classList.toggle('is-low', l <= 60); }
    function startTimer() { clearInterval(timerId); left = SESSION; tick(); timerId = setInterval(function () { left--; tick(); if (left <= 0) { clearInterval(timerId); reset(); msg('lg-msg', 'bad', 'انتهت مدة الجلسة (10 دقائق) قبل اكتمال الخطوات. ابدأ من جديد.'); } }, 1000); }
    function human() { if (LIVE) { humanOk = true; return; } humanOk = false; var h = $('#human'); h.classList.remove('ok'); $('#human-t').textContent = 'جارٍ التحقق البشري…'; setTimeout(function () { humanOk = true; h.classList.add('ok'); $('#human-t').textContent = 'تم التحقق بنجاح'; }, 1400); }
    var boxes = $$('#otp-in input');
    function reset() {
      cur = { flow: '', i: 0 }; go('login', 0); human(); tries = 5; clearInterval(cdId); clearInterval(vId);
      S.pending = ''; S.factors = []; S.ch = {}; S.fg = ''; S.tok = ''; S.inn = false; boxes.forEach(function (b) { b.hidden = false; });
      $('#otp-box').hidden = true; $('#otp-go').disabled = true; $('#otp-left').textContent = '5'; boxes.forEach(function (i) { i.value = ''; }); msg('otp-msg'); msg('lg-msg');
      $$('.vc').forEach(vcReset); $$('.pt-yn').forEach(function (y) { ynSet(y, ''); }); mfReset(); $('#done-exit-n').hidden = true;
      $$('.dv').forEach(function (d) { d.hidden = false; d.classList.remove('is-gone'); }); devCount();
    }
    $$('.ts-eye').forEach(function (b) { b.addEventListener('click', function () { var i = b.previousElementSibling, on = i.type === 'password'; i.type = on ? 'text' : 'password'; b.setAttribute('aria-label', on ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'); b.innerHTML = I(on ? 'PiEyeSlashFill' : 'PiEyeFill'); }); });
    $$('.pt [data-flow]').forEach(function (b) { b.addEventListener('click', function () {
      go(b.dataset.flow, 0); }); });
    $('#pt-back').addEventListener('click', function () { if (cur.i > 0) go(cur.flow, cur.i - 1); else reset(); });
    $('#done-again').addEventListener('click', reset);
    $('#done-login').addEventListener('click', reset);
    $('#done-go').addEventListener('click', function () { if (LIVE && S.inn) return liveEnter(); post({ tera: 'enter' }); });
    $('#done-exit').addEventListener('click', function () { reset(); msg('lg-msg', 'ok', 'خرجت من البوابة. يمكنك الإكمال لاحقًا بالدخول من البوابة: تسجيل الدخول.'); });
    var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, rePhone = /^(05\d{8}|\+?9665\d{8})$/, reLocal = /^5\d{8}$/;
    function idOk(v) { v = v.replace(/\s/g, ''); return reEmail.test(v) || rePhone.test(v); }
    function bad(el, on) { el.classList.toggle('bad', !!on); return !on; }

    /* ---- 6-box code entry: auto-confirm when complete ---- */
    function wireOtp(inputs, onFull) {
      inputs.forEach(function (inp, i) {
        inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(-1); inp.parentNode.classList.remove('bad'); if (inp.value && inputs[i + 1]) inputs[i + 1].focus(); if (inputs.every(function (b) { return b.value; })) setTimeout(onFull, 150); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); });
        inp.addEventListener('paste', function (e) { var t = ((e.clipboardData && e.clipboardData.getData('text')) || '').replace(/\D/g, '').slice(0, 6); if (t.length) { e.preventDefault(); inputs.forEach(function (b, j) { b.value = t[j] || ''; }); inputs[Math.min(t.length, 5)].focus(); if (t.length === 6) setTimeout(onFull, 150); } });
      });
    }
    function codeOf(inputs) { return inputs.map(function (b) { return b.value; }).join(''); }
    function clearBoxes(inputs) { inputs.forEach(function (b) { b.value = ''; }); if (inputs[0]) inputs[0].parentNode.classList.remove('bad'); }

    /* ---- verification cards (email · SMS · WhatsApp) ---- */
    var VCH = { mail: ['أُرسل الرمز إلى بريدك.', 'تم التحقق', 'تم التحقق من بريدك الإلكتروني.'], sms: ['أُرسل الرمز برسالة نصية.', 'تم التحقق', 'تم التحقق من رقم جوالك.'], wa: ['أُرسل الرمز إلى واتساب.', 'تم الربط', 'تم ربط رقمكم في واتساب.'] };
    function vcDest(card) {
      var id = card.dataset.dest, el = $('#' + id); if (!el) return '';
      if (card.dataset.ch === 'mail') { var v = el.value.trim(); return reEmail.test(v) ? v : ''; }
      var n = el.value.replace(/\s/g, ''), cc = $('#' + id + '-cc'); return reLocal.test(n) ? '+' + (cc ? cc.value : '966') + ' ' + n : '';
    }
    function vcPaint(card) { var d = vcDest(card); $('.vc-d', card).textContent = d || (card.dataset.ch === 'mail' ? 'اكتب البريد أعلاه' : 'اكتب رقم الجوال أعلاه'); }
    function vcReset(card) {
      var s = card._st; if (s) { clearInterval(s.t); s.ok = false; }
      card.classList.remove('is-ok'); $('.vc-st', card).textContent = 'لم يُتحقق'; var b = $('.vc-send', card); b.hidden = false; b.disabled = false; b.textContent = 'أرسل رمز التحقق';
      $('.vc-code', card).hidden = true; clearBoxes($$('.vc-in input', card)); msg($('.vc-msg', card)); vcPaint(card);
    }
    function vcInit(card) {
      var st = card._st = { ok: false, t: null }, ch = card.dataset.ch, send = $('.vc-send', card), ins = $$('.vc-in input', card), m = $('.vc-msg', card);
      var fgLive = LIVE && !!card.closest('#f-fg1, #f-fg2'), rgLive = LIVE && !!card.closest('#f-reg4') && !card.closest('#wa-box');
      function open(n, v, text) {
        clearBoxes(ins); $('.vc-code', card).hidden = false; msg(m, 'ok', text); send.textContent = 'إعادة إرسال الرمز'; send.disabled = true;
        var rs = $('.vc-rs', card); rs.hidden = false; $('.vc-cd', card).textContent = fmt(n); $('.vc-valid', card).textContent = fmt(v); clearInterval(st.t);
        st.t = setInterval(function () { n = Math.max(n - 1, 0); v = Math.max(v - 1, 0); $('.vc-cd', card).textContent = fmt(n); $('.vc-valid', card).textContent = fmt(v);
          if (!n) { rs.hidden = true; send.disabled = false; } if (!v) { clearInterval(st.t); msg(m, 'bad', 'انتهت صلاحية الرمز. أعد إرسال رمز جديد.'); } }, 1000);
        setTimeout(function () { ins[0].focus({ preventScroll: true }); }, 30);
      }
      function done() {
        clearInterval(st.t); st.ok = true; st.d = vcDest(card); card.classList.add('is-ok'); $('.vc-st', card).textContent = VCH[ch][1];
        $('.vc-code', card).hidden = true; send.hidden = true; msg(m, 'ok', (fgLive || rgLive) ? 'تم التحقق.' : VCH[ch][2]); vcChanged();
      }
      send.addEventListener('click', function () {
        var d = vcDest(card); vcPaint(card);
        if (!d) { var el = $('#' + card.dataset.dest); if (el) bad(el, true); return msg(m, 'bad', ch === 'mail' ? 'اكتب بريدًا إلكترونيًا صحيحًا أولًا.' : 'اكتب رقم الجوال بدون صفر في أوله (9 أرقام تبدأ بـ 5).'); }
        send.disabled = true; send.textContent = 'جارٍ الإرسال…';
        if (fgLive) return liveFgSend(card, open, function (t) { send.disabled = false; send.textContent = 'أرسل رمز التحقق'; msg(m, 'bad', t); });
        if (rgLive) return liveRegSend(card, open, function (t) { send.disabled = false; send.textContent = 'أرسل رمز التحقق'; msg(m, 'bad', t); });
        setTimeout(function () { open(60, 300, VCH[ch][0]); }, 600);
      });
      wireOtp(ins, function () {
        if (st.ok) return; var c = codeOf(ins);
        if (fgLive) return liveFgVerify(c, done, function (t) { ins[0].parentNode.classList.add('bad'); msg(m, 'bad', t); });
        if (rgLive) return liveRegVerify(card, c, done, function (t) { ins[0].parentNode.classList.add('bad'); msg(m, 'bad', t); });
        if (c === '000000') { ins[0].parentNode.classList.add('bad'); return msg(m, 'bad', 'الرمز غير صحيح أو انتهت مدته.'); }
        done();
      });
      var el = $('#' + card.dataset.dest); if (el && card.closest('#f-fg1, #f-fg2')) el.addEventListener('input', function () { if (st.ok || !$('.vc-code', card).hidden) vcReset(card); else vcPaint(card); vcChanged(); });
    }
    $$('.vc').forEach(vcInit);
    function vok(sel) { var c = $(sel); return !!(c && c._st && c._st.ok); }
    function vcChanged() {
      var wa = ynVal('wa');
      $('#rg4-go').disabled = !(vok('#f-reg4 .vc[data-ch=mail]') && vok('#f-reg4 .vc[data-ch=sms]') && (wa !== 'yes' || vok('#wa-box .vc')));
      $('#fg1-go').disabled = !vok('#f-fg1 .vc'); $('#fg2-go').disabled = !vok('#f-fg2 .vc');
      mcHint();
    }
    function reg4Enter() { $$('#f-reg4 .vc').forEach(function (c) { if (c._st.ok && vcDest(c) !== c._st.d) vcReset(c); else if (!c._st.ok) vcPaint(c); }); vcChanged(); }

    /* ---- yes / no choice ---- */
    function ynVal(n) { var y = $('.pt-yn[data-yn="' + n + '"]'); return y ? y.dataset.val || '' : ''; }
    function ynSet(y, v) { y.dataset.val = v; $$('button', y).forEach(function (b) { var on = b.dataset.v === v; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.classList.toggle('is-on', on); }); ynChanged(y.dataset.yn, v); }
    $$('.pt-yn').forEach(function (y) { $$('button', y).forEach(function (b) { b.addEventListener('click', function () { ynSet(y, b.dataset.v); }); }); });
    var DUR = { 30: 'مناسبة لجهاز تستخدمه أحيانًا. بعد 30 يومًا نطلب الرمز الإضافي من جديد.', 60: 'مناسبة للاستخدام المنتظم. بعد 60 يومًا نطلب الرمز الإضافي من جديد.', 90: 'لجهازك الشخصي الذي لا يستخدمه غيرك. بعد 90 يومًا نطلب الرمز من جديد.' };
    ['lg', 'rg'].forEach(function (p) { var s = $('#' + p + '-dur'); function h() { $('#' + p + '-dur-h').textContent = DUR[s.value]; } s.addEventListener('change', h); h(); });
    function ynChanged(n, v) {
      if (n === 'wa') { $('#wa-box').hidden = v !== 'yes'; if (v !== 'yes') vcReset($('#wa-box .vc')); else vcPaint($('#wa-box .vc')); vcChanged(); }
      if (n === 'lg-trust') { $('#lg-dur-w').hidden = LIVE || v !== 'yes'; $('#lg-devs').hidden = v !== 'yes'; var lv = $('#lv-dev'); if (lv) lv.hidden = v !== 'yes'; devCount(); }
      if (n === 'rg-trust') { $('#rg-dur-w').hidden = v !== 'yes'; $('#rg6-go').disabled = !v; $('#rg-dn').textContent = (v === 'yes' ? 1 : 0) + ' من 3'; }
    }
    function devName() {
      var ua = navigator.userAgent, br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'متصفح';
      var os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'جهاز';
      $$('.dev-name').forEach(function (b) { b.textContent = br + ' على ' + os; });
    }
    function devCount() {
      if (LIVE && S.dev) return liveDevCount();
      var n = $$('#lg-devs .dv').filter(function (d) { return !d.hidden; }).length, v = ynVal('lg-trust');
      $('#lg-dn').textContent = n + ' من 3'; $('#lg-full').hidden = n < 3;
      $('#dev-go').disabled = !v || (v === 'yes' && n >= 3);
    }
    $$('.dv-x').forEach(function (b) { b.addEventListener('click', function () { var li = b.closest('.dv'); li.classList.add('is-gone'); setTimeout(function () { li.hidden = true; devCount(); msg('dev-msg', 'ok', 'أُلغي تصريح «' + $('b', li).textContent + '». يمكنك الآن التصريح لهذا الجهاز.'); }, 220); }); });

    /* ---- login → verification → device ---- */
    $('#f-login').addEventListener('submit', function (e) {
      e.preventDefault(); var id = $('#lg-id'), pw = $('#lg-pw');
      bad(id, !id.value.trim()); bad(pw, !pw.value);
      if (!id.value.trim() || !pw.value) return msg('lg-msg', 'bad', 'أدخل البريد أو الجوال وكلمة المرور.');
      if (!idOk(id.value)) { bad(id, true); return msg('lg-msg', 'bad', 'اكتب بريدًا صحيحًا أو جوالًا يبدأ بـ 05 ومكوّنًا من 10 أرقام.'); }
      if (!humanOk) return msg('lg-msg', 'bad', 'لم يكتمل التحقق البشري. انتظر لحظة ثم أعد المحاولة.');
      if (LIVE) return liveLogin();
      var b = $('#lg-go'); b.disabled = true; b.textContent = 'جارٍ الدخول…';
      setTimeout(function () { b.disabled = false; b.textContent = 'دخول'; msg('lg-msg'); go('login', 1); paintVia(); }, 700);
    });
    var VIA = { app: ['تطبيق المصادقة · رمز يتجدد كل 30 ثانية', 'PiDeviceMobileFill', 'افتح تطبيق المصادقة وأدخل الرمز الظاهر لحساب Tera', '', ''],
                wa: ['رمز تحقق من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiWhatsappLogoFill', 'يُرسل إلى واتساب', '+966 5• ••• ••74', 'أرسل الرمز عبر واتساب'],
                sms: ['رمز تحقق من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiChatCircleTextFill', 'يُرسل برسالة نصية إلى', '+966 5• ••• ••74', 'أرسل الرمز برسالة نصية'],
                mail: ['رمز تحقق من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiEnvelopeFill', 'يُرسل إلى البريد', 'n•••@example.com', 'أرسل الرمز إلى البريد'] };
    function paintVia() { var v = $('#otp-via').value, c = VIA[v]; $('#otp-hint').textContent = c[0]; $('#otp-dest-i').innerHTML = I(c[1]); $('#otp-dest-t').textContent = c[2]; $('#otp-dest-v').textContent = c[3]; $('#otp-spam').hidden = v !== 'mail'; var s = $('#otp-send'); s.hidden = v === 'app'; s.textContent = c[4]; s.disabled = false; msg('otp-msg'); if (v === 'app') openBox(false); else { $('#otp-box').hidden = true; $('#otp-go').disabled = true; } }
    $('#otp-via').addEventListener('change', function () { clearInterval(cdId); clearInterval(vId); if (LIVE) return livePaint(); paintVia(); });
    function openBox(withCd, n0, v0) {
      $('#otp-box').hidden = false; $('#otp-go').disabled = false; $('#otp-resend').hidden = !withCd; $('#otp-valid-w').hidden = !withCd;
      if (withCd) { var n = n0 || 60, v = v0 || 300; clearInterval(cdId); clearInterval(vId); $('#otp-cd').textContent = fmt(n); $('#otp-valid').textContent = fmt(v); var s = $('#otp-send'); s.disabled = true;
        cdId = setInterval(function () { n--; $('#otp-cd').textContent = fmt(n); if (n <= 0) { clearInterval(cdId); s.disabled = false; s.textContent = 'إعادة إرسال الرمز'; $('#otp-resend').hidden = true; } }, 1000);
        vId = setInterval(function () { v--; $('#otp-valid').textContent = fmt(Math.max(v, 0)); if (v <= 0) { clearInterval(vId); msg('otp-msg', 'bad', 'انتهت صلاحية الرمز. أعد إرسال رمز جديد.'); } }, 1000); }
      setTimeout(function () { boxes[0].focus({ preventScroll: true }); }, 30);
    }
    $('#otp-send').addEventListener('click', function () { if (LIVE) return liveSend(V2F[$('#otp-via').value]); var b = this, v = $('#otp-via').value; b.disabled = true; b.textContent = 'جارٍ الإرسال…';
      setTimeout(function () { clearBoxes(boxes); msg('otp-msg', 'ok', VCH[v === 'mail' ? 'mail' : v][0]); b.textContent = VIA[v][4]; openBox(true); }, 700); });
    wireOtp(boxes, function () { var f = $('#f-otp'); if (f.requestSubmit) f.requestSubmit(); else $('#otp-go').click(); });
    $('#f-otp').addEventListener('submit', function (e) { e.preventDefault(); if (LIVE) return liveVerify(); var code = codeOf(boxes);
      if (code.length < 6) return msg('otp-msg', 'bad', 'أدخل رمز التحقق المكوّن من 6 أرقام.');
      if (code === '000000') { tries--; $('#otp-left').textContent = String(tries); $('#otp-in').classList.add('bad'); if (tries <= 0) { reset(); return msg('lg-msg', 'bad', 'استُنفدت المحاولات لهذا الرمز. ابدأ الدخول من جديد.'); } return msg('otp-msg', 'bad', 'الرمز غير صحيح أو انتهت مدته.'); }
      clearInterval(cdId); clearInterval(vId); msg('dev-msg'); go('login', 2); devCount(); });
    $('#f-device').addEventListener('submit', function (e) { e.preventDefault(); if (LIVE && S.dev) return liveDeviceSubmit(); var v = ynVal('lg-trust'), d = $('#lg-dur').value;
      if (!v) return msg('dev-msg', 'bad', 'اختر هل تصرّح لهذا الجهاز.');
      if (v === 'yes' && $$('#lg-devs .dv').filter(function (x) { return !x.hidden; }).length >= 3) return msg('dev-msg', 'bad', 'ألغِ تصريح جهاز أولًا؛ الحد الأقصى ثلاثة أجهزة.');
      finish('تم الدخول بنجاح', v === 'yes' ? 'صرّحنا لهذا الجهاز لمدة ' + d + ' يومًا، ولن نطلب الرمز الإضافي منه خلالها. يمكنك إلغاء التصريح من مركز الأمان.' : 'لم نصرّح لهذا الجهاز، وسنطلب رمز التحقق في الدخول القادم منه.', { enter: true }); });

    /* ---- password kit: rules + strength + confirm ---- */
    var USED = ['tera2468', 'tera@2025', 'riyadh2580'];
    function cls(c) { return c >= 48 && c <= 57 ? 'd' : c >= 97 && c <= 122 ? 'a' : ''; }
    function hasSeq(v) { var s = v.toLowerCase(); for (var i = 0; i + 2 < s.length; i++) { var a = s.charCodeAt(i), b = s.charCodeAt(i + 1), c = s.charCodeAt(i + 2), k = cls(a);
      if (!k || cls(b) !== k || cls(c) !== k) continue; if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1) || (a === b && b === c)) return true; } return false; }
    /* نفس سياسة الخادم (passwordPolicyError): 11–128 حرفًا، 5 أحرف و5 أرقام ورمز واحد على الأقل، وبلا تتابع أو تكرار ثلاثي */
    var AR_AB = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    function fold(v) { return ascii(v).toLowerCase(); }
    function seqIn(s, ab) { for (var i = 0; i + 2 < s.length; i++) { var a = ab.indexOf(s.charAt(i)), b = ab.indexOf(s.charAt(i + 1)), c = ab.indexOf(s.charAt(i + 2));
      if (a < 0 || b < 0 || c < 0) continue; if ((a === b && b === c) || (b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) return true; } return false; }
    var R = { len: function (v) { return v.length >= 11 && v.length <= 128; },
              let: function (v) { return (v.match(/[A-Za-z\u0621-\u064A]/g) || []).length >= 5; },
              dig: function (v) { return (ascii(v).match(/[0-9]/g) || []).length >= 5; },
              sym: function (v) { return (v.match(/[^0-9A-Za-z\u0621-\u064A\u0660-\u0669\u06F0-\u06F9\s]/g) || []).length >= 1; },
              seq: function (v) { var f = fold(v); return !!v && !seqIn(f, 'abcdefghijklmnopqrstuvwxyz') && !seqIn(f, AR_AB) && !seqIn(f, '0123456789'); },
              old: function (v) { return !!v && (LIVE || USED.indexOf(v.toLowerCase()) < 0); } };
    var LV = [['ضعيفة جدًا', 'w0'], ['ضعيفة', 'w1'], ['مقبولة', 'w2'], ['جيدة', 'w3'], ['قوية', 'w4']];
    function pkState(p) {
      var kit = $('.pk[data-pk="' + p + '"]'), a = $('#' + p + '-pw').value, b = $('#' + p + '-pw2').value;
      var keys = $$('.pk-rules li', kit).map(function (li) { return li.dataset.r; }), ok = keys.filter(function (k) { return R[k](a); }).length, all = ok === keys.length;
      var extra = (a.length >= 10 ? 1 : 0) + (a.length >= 14 ? 1 : 0) + (/[^A-Za-z0-9]/.test(a) ? 1 : 0) + (/[a-z]/.test(a) && /[A-Z]/.test(a) ? 1 : 0);
      var score = !a ? 0 : !all ? (ok >= keys.length - 1 ? 1 : 0) : 2 + (extra >= 2 ? 1 : 0) + (extra >= 4 ? 1 : 0);
      return { a: a, b: b, rules: all, score: score, match: !!b && a === b };
    }
    function pkPaint(p) {
      var kit = $('.pk[data-pk="' + p + '"]'), s = pkState(p), a = s.a;
      $$('.pk-rules li', kit).forEach(function (li) { li.classList.toggle('ok', !!a && R[li.dataset.r](a)); li.classList.toggle('no', !!a && !R[li.dataset.r](a)); });
      kit.dataset.lv = a ? LV[s.score][1] : ''; $('.pk-lv', kit).textContent = a ? 'قوة كلمة المرور: ' + LV[s.score][0] : 'أدخل كلمة مرور';
      var m = $('.pk-match', kit), i2 = $('#' + p + '-pw2');
      if (!s.b) { m.hidden = true; i2.classList.remove('good', 'bad'); }
      else { m.hidden = false; m.className = 'pk-match ' + (s.match ? 'ok' : 'no'); m.innerHTML = I(s.match ? 'PiCheckCircleFill' : 'PiWarningCircleFill') + '<span>' + (s.match ? 'كلمتا المرور متطابقتان' : 'كلمتا المرور غير متطابقتين') + '</span>'; i2.classList.toggle('good', s.match); i2.classList.toggle('bad', !s.match); }
      return s;
    }
    ['rg', 'fg', 'rc'].forEach(function (p) {
      var btn = $('#' + p + '-go');
      function upd() { var s = pkPaint(p); btn.disabled = !(s.rules && s.match && (p !== 'rg' || $('#rg-terms').checked)); }
      $('#' + p + '-pw').addEventListener('input', upd); $('#' + p + '-pw2').addEventListener('input', upd);
      if (p === 'rg') $('#rg-terms').addEventListener('change', upd);
    });
    function pwFail(p, id) { var s = pkState(p); if (!s.rules) { msg(id, 'bad', 'كلمة المرور لا تحقق كل الشروط.'); return true; } if (!s.match) { msg(id, 'bad', 'كلمتا المرور غير متطابقتين.'); return true; } msg(id); return false; }

    /* ---- register ---- */
    $('#f-reg1').addEventListener('submit', function (e) { e.preventDefault(); var n = $('#rg-name'), parts = n.value.trim().split(/\s+/).filter(Boolean);
      if (!bad(n, parts.length < 3 || /\d/.test(n.value))) return msg('rg1-msg', 'bad', 'اكتب الاسم الكامل كما في الهوية، ثلاثيًا على الأقل ومن دون أرقام.');
      msg('rg1-msg'); go('register', 1); });
    $('#f-reg2').addEventListener('submit', function (e) { e.preventDefault(); var p = $('#rg-ph'), m = $('#rg-em');
      var pk = bad(p, !reLocal.test(p.value.replace(/\s/g, ''))), mk = bad(m, !reEmail.test(m.value.trim()));
      if (!pk) return msg('rg2-msg', 'bad', 'اكتب رقم الجوال بدون صفر في أوله (9 أرقام تبدأ بـ 5).');
      if (!mk) return msg('rg2-msg', 'bad', 'اكتب بريدًا إلكترونيًا صحيحًا.');
      msg('rg2-msg'); go('register', 2); });
    $('#f-reg3').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('rg', 'rg3-msg')) return;
      if (!$('#rg-terms').checked) return msg('rg3-msg', 'bad', 'وافق على سياسة الاستخدام والخصوصية للمتابعة.'); go('register', 3); });
    $('#f-reg4').addEventListener('submit', function (e) { e.preventDefault();
      if (!vok('#f-reg4 .vc[data-ch=mail]') || !vok('#f-reg4 .vc[data-ch=sms]')) return msg('rg4-msg', 'bad', 'تحقق من البريد والجوال أولًا.');
      if (ynVal('wa') === 'yes' && !vok('#wa-box .vc')) return msg('rg4-msg', 'bad', 'أكمل ربط واتساب، أو اختر «لا، لاحقًا».');
      if (LIVE) return liveRegister();
      msg('rg4-msg'); go('register', 4); });

    /* 2FA methods: accordion (one open at a time), at least one required */
    var MF = { app: false, code: false };
    function mfOpen(sec, on) { sec.classList.toggle('is-open', on); $('.mf-b', sec).hidden = !on; $('.mf-h', sec).setAttribute('aria-expanded', on ? 'true' : 'false'); }
    $$('.mf').forEach(function (sec) { $('.mf-h', sec).addEventListener('click', function () { var on = !sec.classList.contains('is-open'); $$('.mf').forEach(function (o) { mfOpen(o, false); }); mfOpen(sec, on); if (on) setTimeout(function () { sec.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60); }); });
    function mfOn(m) {
      MF[m] = true; var sec = $('.mf[data-m="' + m + '"]'); sec.classList.add('is-on'); $('.mf-st', sec).textContent = 'مفعّل';
      msg($('.mf-msg', sec), 'ok', m === 'app' ? 'فعّلت تطبيق المصادقة لحسابك.' : 'فعّلت رمز التحقق الإضافي، وستصلك الرموز عبر القناة التي اخترتها.');
      var n = (MF.app ? 1 : 0) + (MF.code ? 1 : 0); $('#mf-n').textContent = n + ' من 2'; $('.pt-must').classList.add('is-ok');
      var rc = $('#rcodes'); if (rc.hidden) { rc.hidden = false; $('#rc-l').innerHTML = rcodes().map(function (c) { return '<li>' + c + '</li>'; }).join(''); }
      mfReady();
    }
    function rcodes() { var out = []; for (var k = 0; k < 8; k++) { var s = ''; for (var j = 0; j < 10; j++) s += Math.floor(Math.random() * 10); out.push(s); } return out; }
    function mfReady() { $('#rg5-go').disabled = !((MF.app || MF.code) && $('#rc-saved').checked); }
    $('#rc-saved').addEventListener('change', mfReady);
    function mfReset() {
      MF = { app: false, code: false }; $$('.mf').forEach(function (s) { s.classList.remove('is-on'); $('.mf-st', s).textContent = 'غير مفعّل'; mfOpen(s, false); msg($('.mf-msg', s)); clearBoxes($$('.ts-otp input', s)); });
      $('.mc-box').hidden = true; $('#mf-n').textContent = '0 من 2'; $('.pt-must').classList.remove('is-ok'); $('#rcodes').hidden = true; $('#rc-saved').checked = false; $('#rg5-go').disabled = true;
    }
    function copy(t, b, done) { try { navigator.clipboard.writeText(t); } catch (e) {} var sp = $('span', b), o = sp.textContent; sp.textContent = done; setTimeout(function () { sp.textContent = o; }, 1600); }
    $('.qr-copy').addEventListener('click', function () { copy($('#qr-key').textContent.replace(/\s/g, ''), this, 'نُسخ المفتاح'); });
    $('.rc-copy').addEventListener('click', function () { copy($$('#rc-l li').map(function (l) { return l.textContent; }).join('\n'), this, 'نُسخت الرموز'); });
    $('.rc-dl').addEventListener('click', function () { try { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['رموز استعادة حساب تيرا\n\n' + $$('#rc-l li').map(function (l) { return l.textContent; }).join('\n') + '\n'], { type: 'text/plain' })); a.download = 'tera-recovery-codes.txt'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {} });
    $$('.gd-tabs button').forEach(function (b) { b.addEventListener('click', function () { var a = b.dataset.app;
      $$('.gd-tabs button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
      $$('.gd[data-app]').forEach(function (o) { o.hidden = o.dataset.app !== a; }); }); });
    var appIn = $$('.mf[data-m=app] .mf-in input');
    wireOtp(appIn, function () { if (MF.app) return; if (codeOf(appIn) === '000000') { appIn[0].parentNode.classList.add('bad'); return msg($('.mf[data-m=app] .mf-msg'), 'bad', 'الرمز غير صحيح. تأكد من أنه الرمز الظاهر الآن في التطبيق.'); } mfOn('app'); });
    var MCH = { sms: 'يُرسل برسالة نصية إلى رقم جوالك الذي تحققت منه.', wa: 'يُرسل إلى رقم واتساب الذي ربطته.', mail: 'يُرسل إلى بريدك الذي تحققت منه. قد تجده في مجلد الرسائل غير المرغوب فيها.' };
    function mcHint() { var c = $('#mc-ch').value, waOk = vok('#wa-box .vc'), h = c === 'wa' && !waOk ? 'لم تربط واتساب بعد. ارجع إلى خطوة التحقق واربطه، أو اختر قناة أخرى.' : MCH[c]; $('#mc-h').textContent = h; $('.mc-send').disabled = c === 'wa' && !waOk; }
    $('#mc-ch').addEventListener('change', function () { $('.mc-box').hidden = true; clearBoxes(mcIn); mcHint(); });
    var mcIn = $$('.mc-in input');
    $('.mc-send').addEventListener('click', function () { var b = this; b.disabled = true; b.textContent = 'جارٍ الإرسال…'; setTimeout(function () { b.disabled = false; b.textContent = 'إعادة إرسال رمز التجربة'; clearBoxes(mcIn); $('.mc-box').hidden = false; msg($('.mf[data-m=code] .mf-msg'), 'ok', 'أرسلنا رمز التجربة. أدخله لتأكيد أن الرموز تصلك.'); mcIn[0].focus({ preventScroll: true }); }, 600); });
    wireOtp(mcIn, function () { if (MF.code) return; if (codeOf(mcIn) === '000000') { mcIn[0].parentNode.classList.add('bad'); return msg($('.mf[data-m=code] .mf-msg'), 'bad', 'الرمز غير صحيح أو انتهت مدته.'); } $('.mc-box').hidden = true; mfOn('code'); });
    $('#f-reg5').addEventListener('submit', function (e) { e.preventDefault();
      if (!MF.app && !MF.code) return msg('rg5-msg', 'bad', 'فعّل وسيلة واحدة على الأقل: تطبيق المصادقة أو رمز التحقق الإضافي.');
      if (!$('#rc-saved').checked) return msg('rg5-msg', 'bad', 'احفظ رموز الاستعادة وأكّد ذلك للمتابعة.');
      msg('rg5-msg'); go('register', 5); });
    function rnd(n) { var s = ''; for (var k = 0; k < n; k++) s += Math.floor(Math.random() * 10); return s; }
    $('#f-reg6').addEventListener('submit', function (e) { e.preventDefault(); var v = ynVal('rg-trust'); if (!v) return msg('rg6-msg', 'bad', 'اختر هل تصرّح لهذا الجهاز.');
      var d = $('#rg-dur').value, y = new Date().getFullYear();
      finish('تم إنشاء حسابكم', 'أهلًا ' + $('#rg-name').value.trim().split(/\s+/)[0] + '، تبدأ عضويتك بمستوى تيرا بلس. ' + (v === 'yes' ? 'صرّحنا لهذا الجهاز لمدة ' + d + ' يومًا.' : 'لم نصرّح لهذا الجهاز، وسنطلب الرمز في الدخول القادم.'),
        { ids: ['TR-' + rnd(8), 'REQ-' + y + '-' + rnd(6)], next: true }); });

    /* ---- forgot: phone → email → additional verification → new password ---- */
    $('#f-fg1').addEventListener('submit', function (e) { e.preventDefault(); if (!vok('#f-fg1 .vc')) return msg('fg1-msg', 'bad', 'تحقق من رقم جوالك أولًا.'); msg('fg1-msg'); go('forgot', 1); });
    $('#f-fg2').addEventListener('submit', function (e) { e.preventDefault(); if (!vok('#f-fg2 .vc')) return msg('fg2-msg', 'bad', 'تحقق من بريدك أولًا.'); msg('fg2-msg'); fg3Paint(); go('forgot', 2); });
    var fg3In = $$('.fg3-in input');
    function fg3Paint() { var m = $('#fg3-m').value; $('#fg3-h').textContent = m === 'app' ? 'افتح تطبيق المصادقة واكتب الرمز الظاهر لحساب Tera.' : 'نرسل رمزًا إضافيًا إلى القناة التي اخترتها عند تفعيله.';
      $('#fg3-send').hidden = m === 'app'; $('#fg3-send').disabled = false; $('#fg3-send').textContent = 'أرسل الرمز الإضافي'; $('#fg3-box').hidden = m !== 'app'; clearBoxes(fg3In); msg('fg3-msg'); }
    $('#fg3-m').addEventListener('change', fg3Paint);
    $('#fg3-send').addEventListener('click', function () { var b = this; b.disabled = true; b.textContent = 'جارٍ الإرسال…'; setTimeout(function () { b.disabled = false; b.textContent = 'إعادة الإرسال'; $('#fg3-box').hidden = false; msg('fg3-msg', 'ok', 'أرسلنا الرمز الإضافي.'); fg3In[0].focus({ preventScroll: true }); }, 600); });
    wireOtp(fg3In, function () { if (codeOf(fg3In) === '000000') { fg3In[0].parentNode.classList.add('bad'); return msg('fg3-msg', 'bad', 'الرمز غير صحيح أو انتهت مدته.'); } msg('fg3-msg'); go('forgot', 3); });
    $('#f-fg3').addEventListener('submit', function (e) { e.preventDefault(); });
    $('#f-fg4').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('fg', 'fg4-msg')) return;
      if (LIVE) return livePassword('fg', 'fg4-msg', 'تم تعيين كلمة المرور', 'سجّل الدخول الآن بكلمة المرور الجديدة.');
      finish('تم تعيين كلمة المرور', 'سجّل الدخول الآن بكلمة المرور الجديدة. أنهينا الجلسات المفتوحة وألغينا تصاريح الأجهزة حفاظًا على أمان حسابك.', { login: true }); });

    /* ---- recovery code → new password ---- */
    $('#f-rc1').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#rc-id'), c = $('#rc-code');
      var ik = bad(i, !idOk(i.value)), ck = bad(c, !/^\d{10}$/.test(c.value));
      if (!ik || !ck) return msg('rc1-msg', 'bad', 'أدخل البريد أو الجوال، ورمز الاستعادة المكوّن من 10 أرقام.');
      msg('rc1-msg'); if (LIVE) return liveRecovery(i.value, c.value); go('recover', 1); });
    $('#f-rc2').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('rc', 'rc2-msg')) return;
      if (LIVE) return livePassword('rc', 'rc2-msg', 'استعدت الوصول إلى حسابك', 'تم تعيين كلمة المرور الجديدة. سجّل الدخول بها، وفعّل وسيلة تحقق جديدة بعد الدخول.');
      finish('استعدت الوصول إلى حسابك', 'تم تعيين كلمة المرور الجديدة، وأُلغي رمز الاستعادة الذي استخدمته. فعّل وسيلة تحقق جديدة بعد الدخول.', { login: true }); });

    /* ---- live gateway functions (real server, same origin) ---- */
    function api(path, body) {
      return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}), credentials: 'same-origin', cache: 'no-store' })
        .then(function (r) { return r.json().catch(function () { return null; }); }).catch(function () { return null; });
    }
    function ascii(v) { return String(v == null ? '' : v).replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); }).replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x6F0); }); }
    function liveId(v) {
      v = ascii(v).trim(); if (v.indexOf('@') >= 0) return v.toLowerCase();
      var d = v.replace(/\D/g, '');
      if (/^05\d{8}$/.test(d)) return '+966' + d.slice(1); if (/^5\d{8}$/.test(d)) return '+966' + d;
      if (/^9665\d{8}$/.test(d)) return '+' + d; if (/^009665\d{8}$/.test(d)) return '+' + d.slice(2); return v;
    }
    /* one human-check slot for the forgot flow, moved into the active stage (as the current gateway does) */
    function fgHuman(form, el) { el = el || $('#forgot-human'); var f = $('#f-' + form), vc = f && $('.vc', f); if (el && vc && el.nextSibling !== vc) vc.parentNode.insertBefore(el, vc); }
    function liveTop(path) { try { top.location.href = path; } catch (e) { location.href = path; } }
    function adopt(s) { if (!s || !s.access_token) return false; try { localStorage.setItem('tera.admin.session', JSON.stringify(s)); return true; } catch (e) { return false; } }
    function liveEnter() { liveTop('/staff/'); }
    function liveIn() { S.inn = true; finish('تم الدخول بنجاح', 'دخلت بحسابك الحقيقي. ننقلك الآن إلى حسابك…', { enter: true }); setTimeout(liveEnter, 1600); }
    function liveLogin() {
      var id = $('#lg-id'), pw = $('#lg-pw'), b = $('#lg-go'); b.disabled = true; b.textContent = 'جارٍ الدخول…'; msg('lg-msg');
      api('/api/auth/login', { identifier: liveId(id.value), password: pw.value }).then(function (r) {
        b.disabled = false; b.textContent = 'دخول'; pw.value = '';
        if (!r) return msg('lg-msg', 'bad', 'تعذّر الاتصال بالخادم. حاول مرة أخرى.');
        if (!r.ok) return msg('lg-msg', 'bad', r.error === 'human_check' ? (r.message || 'لم يكتمل التحقق البشري. أعد المحاولة.')
          : (r.error === 'account_locked' || r.error === 'account_unavailable') ? (r.message || 'تعذّر إتمام الطلب الآن.')
          : r.error === 'unavailable' ? 'تعذّر تسجيل الدخول حاليًا. حاول مرة أخرى.' : 'بيانات الدخول غير صحيحة.');
        if (r.stage === 'password_change_required') return msg('lg-msg', 'bad', r.message || 'يلزم تعيين كلمة مرور جديدة. استخدم «نسيت كلمة المرور».');
        if (r.stage === '2fa_required' || r.stage === 'two_factor' || r.stage === '2fa_enrollment_required') {
          S.pending = r.pending_token || (r.totp && r.totp.pending_token) || ''; S.ch = {};
          S.factors = (r.factors && r.factors.length) ? r.factors.slice() : [r.factor || 'email'];
          go('login', 1); liveVia(); if (r.message) msg('otp-msg', 'ok', r.message); return;
        }
        if (adopt(r.session)) return liveDevice();
        msg('lg-msg', 'bad', 'تعذّر تسجيل الدخول حاليًا. حاول مرة أخرى.');
      });
    }
    function liveLen(n) { boxes.forEach(function (b, i) { var off = i >= n; b.hidden = off; if (off) b.value = '0'; }); var lab = $('#otp-box .pt-lab'); if (lab) lab.textContent = 'أدخل الرمز المكوّن من ' + n + ' أرقام'; }
    function liveCode() { return boxes.filter(function (b) { return !b.hidden; }).map(function (b) { return b.value; }).join(''); }
    function liveVia() {
      var sel = $('#otp-via'), first = '';
      $$('option', sel).forEach(function (o) { var on = S.factors.indexOf(V2F[o.value]) >= 0; o.hidden = !on; o.disabled = !on; if (on && !first) first = o.value; });
      if (first) sel.value = first; livePaint();
    }
    function livePaint() {
      paintVia(); var ch = V2F[$('#otp-via').value], c = S.ch[ch];
      $('#otp-dest-v').textContent = (c && c.dest) || (ch === 'totp' ? '' : 'وسيلتك المسجّلة'); liveLen((c && c.len) || 6);
      if (ch === 'totp') { $('#otp-go').disabled = true; if (c && c.id) { openBox(false); $('#otp-go').disabled = false; } else liveSend('totp'); }
    }
    function liveSend(ch) {
      var c = S.ch[ch], b = $('#otp-send'), label = VIA[F2V[ch]] ? VIA[F2V[ch]][4] : 'أرسل الرمز';
      if (!S.pending && !(c && c.id)) return msg('otp-msg', 'bad', 'انتهت هذه الخطوة. سجّل الدخول من جديد.');
      if (ch !== 'totp') { b.disabled = true; b.textContent = 'جارٍ الإرسال…'; }
      var p = (c && c.id && ch !== 'totp') ? api('/api/auth/2fa/resend', { challenge_id: c.id, channel: ch }) : api('/api/auth/2fa/email', { pending_token: S.pending, channel: ch });
      p.then(function (r) {
        if (!r || r.ok !== true) {
          if (ch !== 'totp') { b.disabled = false; b.textContent = label; }
          return msg('otp-msg', 'bad', (r && r.message) || 'تعذّر إرسال الرمز الآن. اختر وسيلة أخرى أو أعد المحاولة.');
        }
        var len = (r.otp_length === 4 || r.otp_length === 6) ? r.otp_length : ((c && c.len) || 6);
        S.ch[ch] = { id: r.challenge_id || (c && c.id) || '', dest: r.destination || (c && c.dest) || '', len: ch === 'totp' ? 6 : len };
        var exp = Date.parse(String(r.expires_at || '')), vs = !isNaN(exp) ? Math.round((exp - Date.now()) / 1000) : (Number(r.expires_in_seconds) || 300);
        clearBoxes(boxes); liveLen(S.ch[ch].len); if (S.ch[ch].dest) $('#otp-dest-v').textContent = S.ch[ch].dest;
        if (ch === 'totp') { openBox(false); $('#otp-go').disabled = false; return; }
        b.textContent = label; msg('otp-msg', 'ok', r.sent === false ? 'الرمز السابق ما زال صالحًا. لم يُرسل رمز جديد.' : (ch === 'whatsapp' ? 'أُرسل رمز التحقق إلى واتساب.' : 'أُرسل رمز التحقق إلى بريدك.'));
        openBox(true, Number(r.retry_after_seconds) || 60, vs > 0 ? vs : 300);
        if (r.attempts && r.attempts.max) $('#otp-left').textContent = String(Math.max(0, Number(r.attempts.max) - Number(r.attempts.used || 0)));
      });
    }
    function liveVerify() {
      var ch = V2F[$('#otp-via').value], c = S.ch[ch], code = liveCode();
      if (!c || !c.id) return msg('otp-msg', 'bad', ch === 'totp' ? 'جارٍ تجهيز التحقق. أعد المحاولة بعد لحظة.' : 'أرسل الرمز أولًا.');
      if (code.length < (c.len || 6) || /\D/.test(code)) return msg('otp-msg', 'bad', 'أدخل رمز التحقق كاملًا.');
      var g = $('#otp-go'); g.disabled = true;
      api('/api/auth/2fa/verify', { challenge_id: c.id, code: code, factor: ch }).then(function (r) {
        g.disabled = false;
        if (!r || !r.ok) { clearBoxes(boxes); liveLen(c.len); $('#otp-in').classList.add('bad'); return msg('otp-msg', 'bad', (r && r.message) || 'رمز التحقق غير صحيح أو انتهت صلاحيته.'); }
        clearInterval(cdId); clearInterval(vId); S.pending = '';
        if (adopt(r.session)) return liveDevice();
        msg('otp-msg', 'bad', 'تعذّر إكمال الدخول. حاول مرة أخرى.');
      });
    }
    function liveFgSend(card, onOpen, onFail) {
      var one = !!card.closest('#f-fg1'), ch = one ? 'whatsapp' : 'email';
      var ident = one ? '+' + $('#fg-ph-cc').value + ascii($('#fg-ph').value).replace(/\D/g, '').replace(/^0+/, '') : $('#fg-em').value.trim().toLowerCase();
      api('/api/auth/forgot', { identifier: ident, channel: ch }).then(function (r) {
        if (!r) return onFail('تعذّر الاتصال. أعد المحاولة.');
        if (r.ok && r.stage === 'otp' && r.challenge_id) {
          S.fg = r.challenge_id;
          return onOpen(Number(r.retry_after_seconds) || 60, Number(r.expires_in_seconds) || 300,
            r.sent === false ? 'الرمز السابق ما زال صالحًا. لم يُرسل رمز جديد.' : (one ? 'أُرسل الرمز إلى واتساب' : 'أُرسل الرمز إلى بريدك') + (r.destination ? ' ' + r.destination : '') + '.');
        }
        onFail(r.message || 'تعذّر إرسال رمز التحقق. راجع البيانات ثم أعد المحاولة.');
      });
    }
    function liveFgVerify(code, onOk, onFail) {
      if (!S.fg) return onFail('أرسل الرمز أولًا.');
      api('/api/auth/forgot/verify', { challenge_id: S.fg, code: code }).then(function (r) {
        if (!r || !r.ok || !r.recovery_token) return onFail((r && r.message) || 'الرمز غير صحيح أو انتهت مدته.');
        S.fg = ''; S.tok = r.recovery_token; onOk();
      });
    }
    function liveRecovery(ident, code) {
      api('/api/auth/recovery/start', { identifier: liveId(ident), code: ascii(code).replace(/\D/g, '') }).then(function (r) {
        $('#rc-code').value = '';
        if (!r || !r.ok || !r.recovery_token) return msg('rc1-msg', 'bad', (r && r.message) || 'رمز الاستعادة غير صحيح. تأكد من الرمز المكوّن من 10 أرقام.');
        S.tok = r.recovery_token; go('recover', 1);
      });
    }
    function livePassword(p, m, h, t) {
      if (!S.tok) return msg(m, 'bad', 'انتهت مدة هذه الخطوة. ابدأ من جديد.');
      var btn = $('#' + p + '-go'); btn.disabled = true;
      api('/api/auth/recovery/password', { recovery_token: S.tok, new_password: $('#' + p + '-pw').value }).then(function (r) {
        btn.disabled = false;
        if (!r || !r.ok) return msg(m, 'bad', (r && r.message) || 'تعذّر إتمام الطلب الآن. حاول مرة أخرى.');
        S.tok = ''; $('#' + p + '-pw').value = ''; $('#' + p + '-pw2').value = ''; finish(h, t, { login: true });
      });
    }

    /* ---- live: إنشاء الحساب (نفس مسار الخادم: رمز البريد + رمز واتساب ثم /admin/api/register) ---- */
    function regDest(card) {
      if (card.dataset.ch === 'mail') return $('#rg-em').value.trim().toLowerCase();
      return String($('#rg-ph-cc').value || '966').replace(/\D/g, '') + ascii($('#rg-ph').value).replace(/\D/g, '').replace(/^0+/, '');
    }
    function liveRegSend(card, onOpen, onFail) {
      var ch = card.dataset.ch === 'mail' ? 'email' : 'whatsapp', dest = regDest(card);
      api('/admin/api/register/code', { channel: ch, dest: dest }).then(function (r) {
        if (!r) return onFail('تعذّر الاتصال. أعد المحاولة.');
        if (r.error === 'account_exists') return onFail(r.message || 'هذا البريد أو رقم الجوال مرتبط بحساب موجود. سجّل الدخول أو استخدم «نسيت كلمة المرور».');
        if (r.ok === false && !(r.sent === false && Number(r.expires_in_seconds) > 0)) return onFail(r.message || 'تعذّر إرسال الرمز. حاول مرة أخرى.');
        S.reg[ch] = { dest: dest, proof: '' };
        onOpen(Number(r.retry_after_seconds) || 60, Number(r.expires_in_seconds) || 300,
          r.sent === false ? 'الرمز السابق ما زال صالحًا. لم يُرسل رمز جديد.' : (ch === 'email' ? 'أُرسل الرمز إلى بريدك.' : 'أُرسل الرمز إلى واتساب.'));
      });
    }
    function liveRegVerify(card, code, onOk, onFail) {
      var ch = card.dataset.ch === 'mail' ? 'email' : 'whatsapp', st = S.reg[ch];
      if (!st || !st.dest) return onFail('أرسل الرمز أولًا.');
      if (regDest(card) !== st.dest) return onFail('عدّلت القيمة بعد الإرسال. أعد إرسال الرمز.');
      api('/admin/api/register/verify', { channel: ch, dest: st.dest, code: code }).then(function (r) {
        if (!r || r.ok !== true || !r.proof) return onFail((r && r.message) || 'الرمز غير صحيح أو انتهت مدته.');
        st.proof = r.proof; onOk();
      });
    }
    function liveRegister() {
      var em = S.reg.email, ph = S.reg.whatsapp;
      if (!em || !em.proof || !ph || !ph.proof) return msg('rg4-msg', 'bad', 'تحقق من البريد والجوال أولًا.');
      if (em.dest !== $('#rg-em').value.trim().toLowerCase()) return msg('rg4-msg', 'bad', 'عدّلت البريد بعد التحقق. ارجع وأعد التحقق.');
      var b = $('#rg4-go'); b.disabled = true; var t0 = b.textContent; b.textContent = 'جارٍ إنشاء الحساب…'; msg('rg4-msg');
      api('/admin/api/register', { requested_user_type: 'client', invite: null, full_name: $('#rg-name').value.trim().replace(/\s+/g, ' '),
        email: em.dest, phone: ph.dest, password: $('#rg-pw').value, policies_accepted: !!$('#rg-terms').checked,
        email_proof: em.proof, phone_proof: ph.proof }).then(function (r) {
        b.disabled = false; b.textContent = t0;
        if (!r || !r.ok) return msg('rg4-msg', 'bad', (r && r.message) || 'تعذّر إنشاء الحساب حاليًا. أعد المحاولة بعد قليل.');
        var via = []; if (r.email_sent) via.push('بريدك'); if (r.wa_sent) via.push('واتساب');
        $('#rg-pw').value = ''; $('#rg-pw2').value = ''; S.reg = {};
        finish('تم إنشاء حسابكم', 'رقم الطلب المرجعي: ' + (r.request_no || '—') + (via.length ? ' — أُرسل إلى ' + via.join(' وإلى ') + '.' : '.') +
          ' سجّل الدخول الآن ببريدك وكلمة المرور لتفعيل التحقق الثنائي وإكمال استمارة ملفك.', { login: true });
      });
    }

    /* ---- live: توثيق الجهاز (نفس بوابة الجهاز في الخادم: البصمة، ثم كلمة المرور + عامل أمني، ثم الاعتماد) ---- */
    function authApi(method, path, body) {
      var tok = ''; try { tok = (JSON.parse(localStorage.getItem('tera.admin.session') || 'null') || {}).access_token || ''; } catch (e) {}
      return fetch(path, { method: method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin', cache: 'no-store' })
        .then(function (r) { return r.json().catch(function () { return null; }); }).catch(function () { return null; });
    }
    /* نفس خوارزمية fp2.js في الخادم حرفيًا — أي اختلاف يُنشئ سجل جهاز ثانيًا للمتصفح نفسه */
    function devFingerprint() {
      var n = navigator, sc = (top && top.screen) || screen, bits = [n.userAgent || '', n.platform || '', (n.languages || []).join(','), n.hardwareConcurrency || '',
        n.deviceMemory || n.deviceMemoryGB || '', sc.width + 'x' + sc.height + 'x' + (sc.colorDepth || ''), window.devicePixelRatio || '',
        (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })()].join('|');
      if (!window.crypto || !window.crypto.subtle) return Promise.resolve(null);
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(bits)).then(function (buf) {
        return Array.prototype.slice.call(new Uint8Array(buf)).map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      }).catch(function () { return null; });
    }
    var FX_AR = { email_code: 'رمز التحقق عبر البريد الإلكتروني', whatsapp_code: 'رمز التحقق عبر واتساب', totp: 'تطبيق المصادقة', extra_code: 'رمز الاستعادة' };
    function liveDevice() {
      devFingerprint().then(function (fp) {
        if (!fp) return liveIn();
        return authApi('POST', '/api/security/device/current', { fingerprint: fp }).then(function (d) {
          if (!d || d.ok !== true) return liveIn();
          if (d.blocked === true) { try { localStorage.removeItem('tera.admin.session'); } catch (e) {} reset(); return msg('lg-msg', 'bad', d.message || 'هذا الجهاز محظور. راجع مسؤول النظام.'); }
          if (d.authorized === true && d.needs_authorization !== true) return liveIn();
          S.dev = { id: d.device_id, label: d.label || '', factors: ((d.factors && d.factors.factors) || []).map(function (f) { return f.factor; }).filter(function (f) { return FX_AR[f]; }), list: [], rep: null, grant: '', sent: {} };
          return authApi('GET', '/api/security/devices').then(function (l) {
            S.dev.list = ((l && l.devices) || []).filter(function (x) { return x.status === 'authorized' && x.device_id !== S.dev.id; });
            go('login', 2); liveDevPaint();
          });
        });
      });
    }
    function liveDevPaint() {
      var D = S.dev, nm = $$('.dev-name'); if (D.label) nm.forEach(function (b) { b.textContent = D.label; });
      var ul = $('#lg-devs .dv-l');
      if (ul) ul.innerHTML = D.list.map(function (x) {
        var t = [x.label, x.os, x.browser].filter(Boolean).join(' · ') || 'جهاز';
        return '<li class="dv lv-dv' + (D.rep === x.device_id ? ' is-gone' : '') + '" data-id="' + x.device_id + '"><span class="dv-ic">' + I('PiDesktopFill') + '</span><div><b></b><small>' +
          (D.rep === x.device_id ? 'سيُلغى تصريحه ليحل هذا الجهاز محله' : 'جهاز مصرّح له') + '</small></div><button type="button" class="dv-x lv-x">' + I('PiXCircleFill') + '<span>' +
          (D.rep === x.device_id ? 'تراجع' : 'استبداله') + '</span></button></li>';
      }).join('');
      $$('#lg-devs .lv-dv').forEach(function (li, k) { $('b', li).textContent = [D.list[k].label, D.list[k].os, D.list[k].browser].filter(Boolean).join(' · ') || 'جهاز';
        $('.lv-x', li).addEventListener('click', function () { D.rep = D.rep === li.dataset.id ? null : li.dataset.id; liveDevPaint(); }); });
      var sel = $('#lv-fx'); if (sel && !sel.options.length) { sel.innerHTML = D.factors.map(function (f) { return '<option value="' + f + '">' + FX_AR[f] + '</option>'; }).join(''); liveFxPaint(); }
      if (!D.factors.length) msg('dev-msg', 'bad', 'لا توجد وسيلة تحقق مفعّلة في حسابك؛ لا يمكن التصريح لهذا الجهاز الآن. اختر «هذه المرة فقط».');
      devCount();
    }
    function liveDevCount() {
      var D = S.dev, v = ynVal('lg-trust'), n = D.list.length - (D.rep ? 1 : 0);
      $('#lg-dn').textContent = Math.min(n + (v === 'yes' ? 1 : 0), 3) + ' من 3'; $('#lg-full').hidden = !(v === 'yes' && n >= 3);
      $('#dev-go').disabled = !v || (v === 'yes' && (n >= 3 || !D.factors.length));
    }
    function liveFxPaint() {
      var f = $('#lv-fx').value, send = $('#lv-send'), deliver = f === 'email_code' || f === 'whatsapp_code';
      send.hidden = !deliver; send.disabled = false; send.textContent = f === 'whatsapp_code' ? 'أرسل الرمز عبر واتساب' : 'أرسل الرمز إلى البريد';
      $('#lv-code-w').hidden = deliver && !S.dev.sent[f]; msg('lv-msg');
    }
    function liveDeviceSubmit() {
      var D = S.dev, v = ynVal('lg-trust');
      if (!v) return msg('dev-msg', 'bad', 'اختر هل تصرّح لهذا الجهاز.');
      if (v === 'no') return liveIn();
      var pw = $('#lv-pw').value, f = $('#lv-fx').value, code = ascii($('#lv-code').value).replace(/\D/g, '');
      if (!pw) return msg('dev-msg', 'bad', 'أدخل كلمة المرور لتأكيد هويتك.');
      if (!code) return msg('dev-msg', 'bad', (f === 'email_code' || f === 'whatsapp_code') && !D.sent[f] ? 'أرسل رمز التحقق أولًا.' : 'أدخل رمز التحقق.');
      var b = $('#dev-go'); b.disabled = true; msg('dev-msg');
      authApi('POST', '/api/security/gateway/verify', { purpose: 'device_authorize', factor: f, code: code }).then(function (g) {
        if (!g || g.ok !== true || !g.grant_id) { b.disabled = false; $('#lv-code').value = ''; return msg('dev-msg', 'bad', (g && g.message) || 'رمز التحقق غير صحيح أو انتهت صلاحيته.'); }
        var pay = { device_id: D.id, grant_id: g.grant_id, current_password: pw }; if (D.rep) pay.replace_id = D.rep;
        return authApi('POST', '/api/security/devices/authorize', pay).then(function (a) {
          b.disabled = false; $('#lv-pw').value = ''; $('#lv-code').value = '';
          if (a && a.ok === true) { finish('تم التصريح لهذا الجهاز', 'رُبطت جلستك بهذا الجهاز. ننقلك الآن إلى حسابك…', { enter: true }); S.inn = true; return setTimeout(liveEnter, 1600); }
          if (a && a.must_replace === true) { D.rep = null; liveDevPaint(); return msg('dev-msg', 'bad', 'بلغ حسابك الحد الأقصى (3 أجهزة). اختر جهازًا يُستبدل.'); }
          msg('dev-msg', 'bad', (a && a.message) || 'تعذّر اعتماد الجهاز.');
        });
      });
    }
    if (LIVE) {
      /* real human check (Cloudflare Turnstile) in the existing slots, attached to protected requests by /turnstile.js */
      var hu = $('#human'); if (hu) { hu.innerHTML = '<div id="login-human"></div>'; hu.classList.add('ok'); }
      var fh = document.createElement('div'); fh.className = 'ts-human ok'; fh.id = 'forgot-human'; fgHuman('fg1', fh);
      /* إنشاء الحساب: الجوال يُتحقق منه عبر واتساب، وربط واتساب يكون لاحقًا من مركز الأمان */
      var smsCard = $('#f-reg4 .vc[data-ch=sms]'); if (smsCard) { var sb = $('.vc-t b', smsCard); if (sb) sb.textContent = 'الجوال (واتساب)'; }
      var waQ = $('#f-reg4 .pt-wa'); if (waQ) waQ.hidden = true;
      var r4 = $('#rg4-go'); if (r4) r4.textContent = 'إنشاء الحساب';
      /* توثيق الجهاز: بلا مدة (الخادم يعتمد الجهاز حتى يُلغى)، وكلمة المرور + عامل أمني للاعتماد */
      var dw = $('#f-device .pt-why'); if (dw) dw.hidden = true;
      var ynT = $('#f-device .pt-yn'); if (ynT && !$('#lv-dev')) {
        var box = document.createElement('div'); box.id = 'lv-dev'; box.className = 'pt-f'; box.hidden = true;
        box.innerHTML = '<div class="ts-fld"><label for="lv-pw">كلمة المرور</label><span class="ts-pw"><input class="ts-in" id="lv-pw" type="password" dir="ltr" autocomplete="current-password" placeholder="••••••••"></span><span class="hint">لتأكيد هويتك قبل التصريح للجهاز.</span></div>' +
          '<div class="ts-fld"><label for="lv-fx">وسيلة التحقق</label><select class="ts-in" id="lv-fx"></select></div>' +
          '<button type="button" class="t2-btn" id="lv-send">أرسل الرمز</button>' +
          '<div class="ts-fld" id="lv-code-w" hidden><label for="lv-code">رمز التحقق</label><input class="ts-in" id="lv-code" dir="ltr" inputmode="numeric" maxlength="8" autocomplete="one-time-code" placeholder="000000"></div><p class="ts-msg" id="lv-msg" hidden></p>';
        ynT.insertAdjacentElement('afterend', box);
        $('#lv-fx').addEventListener('change', liveFxPaint);
        $('#lv-send').addEventListener('click', function () {
          var f = $('#lv-fx').value, b = this; b.disabled = true; b.textContent = 'جارٍ الإرسال…';
          authApi('POST', f === 'whatsapp_code' ? '/api/security/gateway/whatsapp' : '/api/security/gateway/email', { purpose: 'device_authorize' }).then(function (d) {
            if (!d || d.ok !== true) { b.disabled = false; b.textContent = 'أعد الإرسال'; return msg('lv-msg', 'bad', (d && d.message) || 'تعذّر إرسال الرمز.'); }
            S.dev.sent[f] = true; $('#lv-code-w').hidden = false; b.textContent = 'إعادة الإرسال'; msg('lv-msg', 'ok', d.sent === false ? 'الرمز السابق ما زال صالحًا.' : (f === 'whatsapp_code' ? 'أُرسل الرمز إلى واتساب.' : 'أُرسل الرمز إلى بريدك.'));
            setTimeout(function () { b.disabled = false; }, (Number(d.retry_after_seconds) || 60) * 1000); try { $('#lv-code').focus(); } catch (e) {}
          });
        });
      }
      var w1 = $('#f-fg1 .vc .vc-t b'); if (w1) w1.textContent = 'رمز عبر واتساب';
      $$('.pt-demo').forEach(function (x) { x.hidden = true; });
      var lg = $('.ts-legal'); if (lg) lg.textContent = 'باستخدامك البوابة توافق على سياسة الاستخدام وسياسة الخصوصية.';
      if (!document.getElementById('tqc-turnstile-js')) { var sc = document.createElement('script'); sc.id = 'tqc-turnstile-js'; sc.src = '/turnstile.js'; document.head.appendChild(sc); }
    }

    reset();
  })();
})();
