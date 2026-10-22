/* v416 — بوابة دفع تيرا: الحركة (العدّ · الغبار الذهبي · ميل البطاقة وبريقها) ونموذج البطاقة الآمن من Paymob (Pixel).
   بيانات البطاقة تُدخل داخل إطار Paymob الآمن فقط — هذا الملف لا يقرأها ولا يرسلها. */
(function () {
  'use strict';
  var CS = {
          /* v420: حقول البطاقة باتجاه LTR حتى تظهر الأرقام بترتيبها الصحيح ومجمّعة كل 4 أرقام بمسافة، وبلا أيقونات داخل الحقل حتى لا تتداخل مع الرقم
             (شعارات مدى وفيزا وماستركارد وApple Pay ظاهرة خارج النموذج) */
          Direction: 'ltr', HideCardIcons: true, HideCardLabel: true,
          Label_Text: { cardLabel: 'بيانات البطاقة', savedCardsLabel: 'بطاقاتك المحفوظة', saveCardConsentLabel: 'احفظ البطاقة للدفعات القادمة', cardEndingLabel: 'تنتهي بـ' },
          Placeholder_Text: { holderName: 'الاسم على البطاقة', cardNumber: 'رقم البطاقة', expiryDate: 'الشهر / السنة', securityCode: 'رمز التحقق CVV' },
          Error_Text: { cardNumber: { required: 'أدخل رقم البطاقة', invalid: 'رقم البطاقة غير صحيح' }, expiryDate: { required: 'أدخل تاريخ الانتهاء', invalid: 'تاريخ الانتهاء غير صحيح' }, securityCode: 'أدخل رمز التحقق (CVV)', holderName: 'أدخل الاسم كما في البطاقة' },
          Button_Text: { viewSavedCardsBtn: 'بطاقاتي المحفوظة', addNewCardBtn: 'بطاقة جديدة', payBtn: 'ادفع' },
          Hint_Text: { saveCardConsentHint: 'تُحفظ البطاقة لدى Paymob بأمان لاستخدامها لاحقًا.', cvvModalTitle: 'رمز التحقق CVV', cvvVisaMastercardQuestion: 'بطاقة مدى أو فيزا أو ماستركارد؟', cvvVisaMastercardHint: 'رمز من 3 أرقام على ظهر البطاقة.', cvvAmexQuestion: 'بطاقة أمريكان إكسبريس؟', cvvAmexHint: 'رمز من 4 أرقام على وجه البطاقة.' },
          Font_Size_Label: '14', Font_Size_Input_Fields: '16', Font_Weight_Label: 700, Font_Weight_Input_Fields: 400,
          Color_Container: '#FFFFFF', Color_Border_Input_Fields: '#E7DFCC', Radius_Border: '14', Color_Primary: '#B8892F', Color_Error: '#B3262F', Color_Disabled: '#D9D2C2',
          Color_Input_Fields: '#FFFFFF', Text_Color_For_Label: '#5E6B7C', Text_Color_For_Input_Fields: '#0B1B3A', Color_For_Text_Placeholder: '#A3ADBA'
        };
  var R = document.getElementById('tp');
  if (!R) return;
  var D = R.dataset, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* v437: الإطار الفرعي — نموذج Paymob وحده، ويتواصل مع صفحة تيرا الأم. انتقال Pixel إلى صفحة البنك يحدث هنا داخل الإطار لا في الصفحة كلها */
  if (D.px === '1') { childPixel(D); return; }
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var money = function (n) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  /* العدّ التصاعدي للمبلغ */
  var A = $('.tp-amt b');
  if (A && D.amount) {
    var to = Number(D.amount) || 0, t0 = 0;
    if (reduce) A.textContent = money(to);
    else requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 4); A.textContent = money(to * e); if (p < 1) requestAnimationFrame(step); });
  }

  /* الغبار الذهبي في اللوحة الكحلية */
  var DU = $('.tp-dust');
  if (DU && !reduce) {
    for (var i = 0; i < 18; i++) {
      var s = 3 + (i * 7) % 6, x = document.createElement('i');
      x.style.left = ((i * 37) % 100) + '%'; x.style.width = x.style.height = s + 'px';
      x.style.animationDuration = (9 + (i * 5) % 9) + 's'; x.style.animationDelay = '-' + ((i * 3) % 11) + 's';
      DU.appendChild(x);
    }
  }

  /* ميل البطاقة وبريقها مع المؤشر أو اللمس */
  var C = $('.tp-card'), F = C && $('.fo', C);
  function foil(mx, my, ry) {
    if (!F) return;
    F.style.background = 'radial-gradient(circle at ' + mx + '% ' + my + '%, rgba(255,236,190,.38), rgba(241,216,148,.10) 28%, transparent 55%),'
      + 'linear-gradient(' + Math.round(110 + ry * 3) + 'deg, transparent 35%, rgba(130,220,210,.10) 48%, rgba(241,216,148,.14) 55%, transparent 66%)';
  }
  if (C && !reduce) {
    foil(50, 30, 0);
    C.addEventListener('pointermove', function (ev) {
      var r = C.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height, ry = (x - 0.5) * 22, rx = -(y - 0.5) * 16;
      C.style.transform = 'rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg)'; foil(Math.round(x * 100), Math.round(y * 100), ry);
    });
    C.addEventListener('pointerleave', function () { C.style.transform = ''; foil(50, 30, 0); });
  }

  /* ---------- الدفع: نموذج Paymob الآمن ---------- */
  var box = document.getElementById('tp-pixel');
  if (!box) return;
  var payBtn = document.getElementById('tp-pay'), err = document.getElementById('tp-err'), alt = document.getElementById('tp-alt');
  var form = document.getElementById('tp-form'), proc = document.getElementById('tp-proc'), res = document.getElementById('tp-res');
  var started = false, ready = false, seen = false;
  function show(el, on) { if (el) el.hidden = !on; if (el === form) place(); }
  /* v427: تشخيص مراحل الدفع (بلا أي بيانات بطاقة) */
  function ev(stage, data) { try { if (!D.status) return; fetch(D.status.replace(/\/status$/, '/ev'), { method: 'POST', keepalive: true, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: stage, data: data || {} }) }); } catch (e) { void e; } }
  window.addEventListener('error', function (e) { ev('js_error', { m: String(e.message || '').slice(0, 200) }); });
  function fail(msg) { if (err) { err.textContent = msg; show(err, true); } if (alt && alt.getAttribute('href') !== '#') show(alt, true); }
  function step(n) {
    document.querySelectorAll('.tp-steps li[data-s]').forEach(function (li) {
      var s = Number(li.getAttribute('data-s')); li.className = s < n ? 'done' : s === n ? 'on' : '';
      var i = li.querySelector('i'); if (i) i.textContent = s < n ? '✓' : String(s);
    });
  }
  function result(st, rc, info) {
    info = info || {};
    var T = {
      paid: { c: '#0E7C70', l: 'مدفوع', t: 'تم الدفع بنجاح', s: D.okmsg || 'وصلتنا دفعتك، وأُرسل الإيصال إلى بريدك وواتساب وإشعار التطبيق.' },
      failed: { c: '#B3262F', l: 'فشل', t: 'لم تكتمل العملية', s: 'لم يُخصم أي مبلغ من بطاقتك. يمكنك المحاولة مرة أخرى.' },
      pending: { c: '#8A6A1F', l: 'قيد التأكيد', t: 'العملية قيد التأكيد', s: 'ننتظر تأكيد البنك. ستصلك النتيجة على بريدك وواتساب خلال دقائق.' }
    }[st] || null;
    if (!T || !res) return;
    show(form, false); show(proc, false); step(3);
    res.style.setProperty('--c', T.c);
    $('.lb', res).textContent = T.l; $('h2', res).textContent = T.t; $('p.s', res).textContent = T.s;
    $('[data-v="st"]', res).textContent = T.l; $('[data-v="st"]', res).style.color = T.c;
    var seal = $('.tp-seal', res);
    if (seal && !reduce) for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r = 110 + (i % 3) * 22, b = document.createElement('i'); b.className = 'bt'; b.style.setProperty('--dx', Math.round(Math.cos(a) * r) + 'px'); b.style.setProperty('--dy', Math.round(Math.sin(a) * r) + 'px'); if (st === 'paid') seal.appendChild(b); }
    show($('[data-rate]', res), st === 'paid');
    var retry = $('[data-retry]', res); show(retry, st === 'failed');
    var dl = document.getElementById('tp-rcpt'); if (dl && rc) { dl.href = rc; dl.textContent = st === 'paid' ? 'تحميل الإيصال PDF' : 'تحميل إشعار العملية PDF'; show(dl, true); }
    var sh = document.getElementById('tp-share');
    if (sh && rc) { show(sh, true); sh.onclick = function () {
      var u = new URL(rc, location.href).href, t = (st === 'paid' ? 'إيصال السداد' : 'إشعار العملية') + ' — منصة تيرا';
      if (navigator.share) navigator.share({ title: t, text: t, url: u }).catch(function () {});
      else location.href = 'https://wa.me/?text=' + encodeURIComponent(t + '\n' + u);
      ev('share'); }; }
    var mv = $('[data-v="method"]', res), av = $('[data-v="at"]', res);
    if (mv && info.method) {
      mv.textContent = info.method;
      /* v439: شعار الشبكة كما سجّلها Paymob (لا حسب الزر الذي اختاره العميل) */
      var NL = { mada: 'mada.png', visa: 'visa.svg', mastercard: 'mastercard.svg', applepay: 'applepay-b.png' }[info.net];
      if (NL) { var im = document.createElement('img'); im.src = '/assets/brand/pay/' + NL; im.alt = ''; im.className = 'tp-net'; mv.insertBefore(im, mv.firstChild); }
      show($('[data-row="method"]', res), true);
    }
    if (av && info.at) { av.textContent = info.at; show($('[data-row="at"]', res), true); }
    R.classList.add('is-done'); /* النتيجة وحدها — بلا تكرار لتفاصيل الملخص */
    show(res, true);
    try { res.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } catch (e) { void e; }
  }
  function poll(n) {
    fetch(D.status, { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) {
      var s = j && j.status;
      if (s === 'paid' || s === 'failed') return result(s, j.receipt, j);
      if (n > 0) setTimeout(function () { poll(n - 1); }, 2500); else result('pending');
    }).catch(function () { if (n > 0) setTimeout(function () { poll(n - 1); }, 3000); else result('pending'); });
  }
  /* v429: التحقق من البنك (3-D Secure) داخل إطار تيرا — صفحة البنك نفسها فقط، وما قبلها وبعدها بهوية تيرا */
  function secure3d(url) {
    ev('3ds_start');
    var wrap = document.createElement('div'); wrap.className = 'tp-3ds'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'التحقق من البنك');
    wrap.innerHTML = '<div class="tp-3ds-in"><div class="tp-3ds-h"><img src="/assets/brand/pay/logo-white.png" alt="منصة تيرا"><span>التحقق الآمن من بنكك · <bdi dir="ltr">3-D Secure</bdi></span></div>'
      + '<div class="tp-3ds-b"><iframe title="صفحة البنك للتحقق" referrerpolicy="origin"></iframe><div class="tp-3ds-cover"><div class="tp-spin"><i></i><i></i><img src="/assets/brand/logo-hd.png" alt=""></div><b>نحوّلك إلى بنكك للتحقق…</b><span class="tp-pulse">لا تغلق هذه الصفحة</span></div></div></div>';
    document.body.appendChild(wrap); document.documentElement.style.overflow = 'hidden';
    var ifr = wrap.querySelector('iframe'), cov = wrap.querySelector('.tp-3ds-cover'), loads = 0, done = false;
    function finish(st) {
      if (done) return; done = true; clearInterval(pi);
      try { wrap.remove(); } catch (e) { void e; } document.documentElement.style.overflow = '';
      ev('3ds_end', { st: st || '' }); processing();
    }
    ifr.addEventListener('load', function () {
      loads++; ev('3ds_load', { n: loads });
      try { var h = ifr.contentWindow.location.href; if (h && h.indexOf(location.origin) === 0) return finish('return'); } catch (e) { void e; }
      if (loads >= 2) cov.hidden = true;
    });
    /* إن لم تنتقل الصفحة إلى البنك داخل الإطار (حجب من البنك) ننتقل إليه مباشرة */
    setTimeout(function () { if (!done && loads < 2) { ev('3ds_fallback', { n: loads }); location.href = url; } }, 9000);
    var pi = setInterval(function () {
      fetch(D.status, { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) { if (j && (j.status === 'paid' || j.status === 'failed')) finish(j.status); }).catch(function () {});
    }, 3000);
    ifr.src = url;
  }
  function processing() { show(form, false); show(proc, true); step(2); poll(24); }

  /* v437: نموذج البطاقة في إطار فرعي من تيرا فوق مكانه في النموذج؛ وعند التحقق من البنك يتحوّل الإطار نفسه نافذةً بهوية تيرا (لا تغادر الصفحة) */
  var PXF = null, in3ds = false, BD = null, P3 = 0, PK = '';
  function place() {
    if (!PXF || in3ds) return;
    if (!box || box.offsetParent === null || (form && form.hidden)) { PXF.style.display = 'none'; return; }
    var r = box.getBoundingClientRect();
    PXF.style.display = 'block'; PXF.style.top = Math.round(r.top + window.scrollY) + 'px'; PXF.style.left = Math.round(r.left + window.scrollX) + 'px'; PXF.style.width = Math.round(r.width) + 'px';
  }
  function fit3ds() { if (!in3ds || !BD) return; var b = BD.querySelector('.tp-3ds-b').getBoundingClientRect(); PXF.style.top = b.top + 'px'; PXF.style.left = b.left + 'px'; PXF.style.width = b.width + 'px'; PXF.style.height = b.height + 'px'; }
  function enter3ds() {
    if (in3ds || !PXF) return; in3ds = true; ev('3ds_start');
    BD = document.createElement('div'); BD.className = 'tp-3ds'; BD.setAttribute('role', 'dialog'); BD.setAttribute('aria-label', 'التحقق من البنك');
    BD.innerHTML = '<div class="tp-3ds-in"><div class="tp-3ds-h"><img src="/assets/brand/pay/logo-white.png" alt="منصة تيرا"><span>التحقق الآمن من بنكك · <bdi dir="ltr">3-D Secure</bdi></span></div>'
      + '<div class="tp-3ds-b"><div class="tp-3ds-cover"><div class="tp-spin"><i></i><i></i><img src="/assets/brand/logo-hd.png" alt=""></div><b>نحوّلك إلى بنكك للتحقق…</b><span class="tp-pulse">لا تغلق هذه الصفحة</span></div></div></div>';
    document.body.appendChild(BD); document.documentElement.style.overflow = 'hidden';
    PXF.classList.add('is-3ds'); PXF.style.display = 'block'; fit3ds();
    P3 = setInterval(function () {
      fetch(D.status, { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) { if (j && (j.status === 'paid' || j.status === 'failed')) { exit3ds(true); processing(); } }).catch(function () {});
    }, 3000);
  }
  function exit3ds(hide) {
    clearInterval(P3);
    if (BD) { try { BD.remove(); } catch (e) { void e; } BD = null; }
    document.documentElement.style.overflow = '';
    if (PXF) { PXF.classList.remove('is-3ds'); PXF.style.height = (box.offsetHeight || 170) + 'px'; if (hide) PXF.style.display = 'none'; }
    in3ds = false; if (!hide) place();
  }
  function mountFrame() {
    PK = ((D.status || '').match(/^\/api\/pay\/c\/([A-Za-z0-9_-]{32})\/status$/) || [])[1] || '';
    if (!PK) return false;
    ready = true; clearTimeout(timer);
    PXF = document.createElement('iframe'); PXF.className = 'tp-pxf'; PXF.title = 'نموذج البطاقة الآمن'; PXF.setAttribute('allow', 'payment'); PXF.setAttribute('scrolling', 'no');
    PXF.src = '/api/pay/c/' + PK + '/px';
    document.body.appendChild(PXF);
    PXF.addEventListener('load', function () {
      var path = null; try { path = PXF.contentWindow.location.pathname; } catch (e) { path = null; }
      if (path === '/api/pay/c/' + PK + '/px') { if (in3ds) exit3ds(); return; }
      if (path !== null) { if (path === 'blank' || path === '') return; ev('3ds_end', { st: 'return' }); exit3ds(true); processing(); return; }
      /* صفحة البنك أو Paymob داخل الإطار */
      if (!in3ds) enter3ds(); var cv = BD && BD.querySelector('.tp-3ds-cover'); if (cv) cv.hidden = true; ev('3ds_load');
    });
    place(); var n = 0, iv = setInterval(function () { place(); if (++n > 40) { clearInterval(iv); setInterval(place, 700); } }, 100);
    window.addEventListener('resize', function () { place(); fit3ds(); }); window.addEventListener('scroll', place, { passive: true });
    return true;
  }
  window.addEventListener('message', function (e) {
    if (!PXF || e.origin !== location.origin || e.source !== PXF.contentWindow || !e.data || typeof e.data.tp !== 'string') return;
    var t = e.data.tp, x = e.data.x || {};
    if (t === 'h') { if (!in3ds) { var h = Math.max(120, Math.min(900, x.h | 0)); box.style.height = h + 'px'; PXF.style.height = h + 'px'; box.classList.remove('wait'); place(); } }
    else if (t === 'mounted') box.classList.remove('wait');
    else if (t === 'ready') { seen = true; box.classList.remove('wait'); }
    else if (t === 'valid') { if (payBtn) payBtn.classList.toggle('is-ready', !!x.ok); if (x.ok) show(err, false); }
    else if (t === 'before') { started = true; if (payBtn) { payBtn.disabled = true; payBtn.textContent = 'جارٍ الدفع…'; } }
    else if (t === 'nav') { if (started) enter3ds(); }
    else if (t === 'after') {
      if (x.status >= 400) { started = false; if (payBtn) { payBtn.disabled = false; payBtn.textContent = D.cta || 'ادفع'; } if (err) { err.textContent = x.msg || 'لم تكتمل العملية. تأكد من بيانات البطاقة وحاول مرة أخرى.'; show(err, true); } }
      else { PXF.style.display = 'none'; processing(); }
    }
    else if (t === 'error') fail('تعذّر تشغيل نموذج البطاقة. أعد تحميل الصفحة.');
  });

  var timer = null;
  function mount() {
    if (ready) return false;
    if (D.status && mountFrame()) return true;
    if (typeof window.Pixel !== 'function') return false;
    if (!D.cs) return false;
    ready = true; clearTimeout(timer); box.classList.remove('wait');
    /* v425: البطاقة فقط — إضافة apple-pay قبل توثيق النطاق لدى Paymob عطّلت إرسال الدفع */
    var PM = ['card'];
    try {
      new window.Pixel({
        publicKey: D.pub, clientSecret: D.cs, paymentMethods: PM, elementId: 'tp-pixel',
        disablePay: true, showSaveCard: D.save === '1',
        cardValidationChanged: function (ok) { if (!seen) ev('fields_ready'); seen = true; ev('valid', { ok: !!ok }); if (payBtn) payBtn.classList.toggle('is-ready', !!ok); if (ok) show(err, false); },
        beforePaymentComplete: async function () { ev('before'); started = true; if (payBtn) { payBtn.disabled = true; payBtn.textContent = 'جارٍ الدفع…'; } return true; },
        afterPaymentComplete: async function (r) {
          /* التحقق الآمن من البنك (3-D Secure) أو صفحة العودة: ننتقل إليها، وصفحة العودة في تيرا تعرض النتيجة بالختم */
          var d = (r && r.data) || {}, url = d.redirection_url || d.redirect_url;
          ev('after', { status: r && r.status, keys: Object.keys(d || {}).slice(0, 20), success: d.success, pending: d.pending, msg: String(d.message || d.msg || d.detail || d.data_message || '').slice(0, 200), redirect: url ? String(url).replace(/\?.*$/, '').slice(0, 120) : '' });
          if (typeof url === 'string' && /^https:\/\//i.test(url)) { secure3d(url); return; }
          if (r && r.status >= 400) {
            started = false; if (payBtn) { payBtn.disabled = false; payBtn.textContent = D.cta || 'ادفع'; }
            var m = (d && (d.message || d.msg || d.detail)) || (Array.isArray(d) && d[0]) || 'لم تكتمل العملية. تأكد من بيانات البطاقة وحاول مرة أخرى.';
            if (err) { err.textContent = String(m); show(err, true); }
            return;
          }
          processing();
        },
        customStyle: CS
      });
      ev('mounted');
    } catch (e) { ev('mount_error', { m: String(e && e.message || e).slice(0, 200) }); fail('تعذّر تشغيل نموذج البطاقة. أعد تحميل الصفحة.'); }
    return true;
  }
  function boot() {
    timer = setTimeout(function () { if (!ready) { box.classList.remove('wait'); fail('تعذّر تحميل نموذج البطاقة الآمن. أعد تحميل الصفحة أو حاول من متصفح آخر.'); } }, 15000);
    /* إن لم يظهر نموذج البطاقة (حجب شبكة أو متصفح قديم) يظهر رابط بديل احتياطي فقط */
    setTimeout(function () { if (!seen && !started && alt && alt.getAttribute('href') !== '#') { alt.textContent = 'لم يظهر نموذج البطاقة؟ أكمل الدفع من الواجهة البديلة'; show(alt, true); } }, 25000);
    if (!mount()) {
      var tries = 0, iv = setInterval(function () { if (mount() || ++tries > 80) clearInterval(iv); }, 250);
      window.addEventListener('load', mount);
    }
  }
  /* v424: رابط الدفع صفحة واحدة — تُفتح العملية من هنا (لا من فتح الرابط) ثم يظهر نموذج البطاقة في المكان نفسه */
  /* v437: العودة من البنك بالصفحة كلها ← النتيجة في إطار تيرا نفسه */
  var DN = null; try { DN = D.done ? JSON.parse(D.done) : null; } catch (e) { DN = null; }
  if (DN && DN.st) { box.classList.remove('wait'); result(DN.st, DN.receipt, DN); }
  else if (D.open && !D.cs) {
    if (payBtn) payBtn.disabled = true;
    fetch(D.open, { method: 'POST', cache: 'no-store', credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return null; }); })
      .then(function (j) {
        if (!j) throw new Error('x');
        if (j.ok && j.redirect) { location.href = j.redirect; return; }
        if (!j.ok) {
          box.classList.remove('wait');
          if (j.state === 'paid') return result('paid');
          if (err) { err.textContent = j.message || 'تعذّر تجهيز الدفع الآن.'; show(err, true); }
          if (payBtn) payBtn.hidden = true;
          return;
        }
        D.pub = j.pub; D.cs = j.cs; D.status = j.status; D.save = j.save || '0';
        if (j.ref) document.querySelectorAll('[data-ref]').forEach(function (el) { el.textContent = j.ref; });
        if (payBtn) payBtn.disabled = false;
        boot();
      })
      .catch(function () { box.classList.remove('wait'); if (err) { err.textContent = 'تعذّر الاتصال الآن. أعد تحميل الصفحة.'; show(err, true); } });
  } else boot();
  /* v427: اختيار طريقة الدفع — مدى أو فيزا/ماستركارد (نموذج البطاقة) · Apple Pay داخل الصفحة نفسها */
  var cardBox = document.getElementById('tp-cardbox'), appleBox = document.getElementById('tp-applebox'), apMounted = false;
  function mountApple() {
    if (apMounted || !D.cs || typeof window.Pixel !== 'function') return;
    apMounted = true;
    try {
      new window.Pixel({ publicKey: D.pub, clientSecret: D.cs, paymentMethods: ['apple-pay'], elementId: 'tp-apple',
        beforePaymentComplete: async function () { ev('ap_before'); started = true; return true; },
        afterPaymentComplete: async function (r) { var d = (r && r.data) || {}; ev('ap_after', { status: r && r.status, success: d.success, pending: d.pending }); if (r && r.status >= 400) { started = false; return; } processing(); },
        onPaymentCancel: function () { ev('ap_cancel'); started = false; } });
      ev('ap_mounted');
    } catch (e) { ev('ap_error', { m: String(e && e.message || e).slice(0, 200) }); }
    setTimeout(function () { var el = document.getElementById('tp-apple'), n = document.getElementById('tp-apnote');
      if (el && el.getBoundingClientRect().height < 20 && n) n.textContent = 'Apple Pay متاح على iPhone وأجهزة Mac من متصفح Safari. على هذا الجهاز ادفع بمدى أو البطاقة.'; }, 4000);
  }
  var MG = {}; try { MG = JSON.parse(D.mg || '{}'); } catch (e) { MG = {}; }
  function cardMark(m) { document.querySelectorAll('.tp-card [data-mk] img').forEach(function (im) { var on = im.getAttribute('data-mk') === m; im.hidden = !on; if (on) { im.classList.remove('pop'); void im.offsetWidth; im.classList.add('pop'); } });
    var cc = document.querySelector('.tp-card'); if (cc) { cc.classList.remove('swap'); void cc.offsetWidth; cc.classList.add('swap'); } }
  /* v432: قلب البطاقة باللمس (وجه خلفي برمز التحقق) */
  var FL = document.getElementById('tp-flip');
  var flipT = 0;
  function flipBack() { if (FL) FL.classList.remove('is-flip'); clearTimeout(flipT); }
  if (FL) FL.addEventListener('click', function (e) { e.stopPropagation(); FL.classList.toggle('is-flip'); clearTimeout(flipT); if (FL.classList.contains('is-flip')) flipT = setTimeout(flipBack, 4000); });
  /* تعود البطاقة لواجهتها عند لمس أي مكان آخر أو بعد ثوانٍ */
  document.addEventListener('click', function () { if (FL && FL.classList.contains('is-flip')) flipBack(); });
  window.addEventListener('blur', function () { setTimeout(flipBack, 2500); });
  /* v432: إلغاء العملية بتأكيد، ثم الخروج أو البدء من جديد */
  var ask = document.getElementById('tp-ask'), cxl = document.getElementById('tp-cancel');
  document.querySelectorAll('[data-cancel]').forEach(function (b) { b.addEventListener('click', function () { if (started) return; show(ask, true); var y = ask && ask.querySelector('[data-ask="no"]'); if (y) y.focus(); }); });
  if (ask) ask.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-ask]'); if (!a && e.target !== ask) return;
    show(ask, false); if (!a || a.getAttribute('data-ask') !== 'yes') return;
    ev('cancel');
    if (D.status) fetch(D.status.replace(/\/status$/, '/cancel'), { method: 'POST', credentials: 'same-origin' }).catch(function () {});
    show(form, false); show(proc, false); show(res, false); show(cxl, true); R.classList.add('is-done');
    try { cxl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } catch (x) { void x; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ask && !ask.hidden) show(ask, false); });
  var again2 = document.querySelector('[data-again]'); if (again2) again2.addEventListener('click', function () { location.href = D.retry || location.pathname; });
  (function fitName() { var n = document.querySelector('.tp-card .hn'); if (!n) return; if (/[\u0600-\u06FF]/.test(n.textContent)) n.style.letterSpacing = '0';
    var box = n.parentElement, w = box.clientWidth || 200, fs = parseFloat(getComputedStyle(n).fontSize) || 13; n.style.whiteSpace = 'nowrap';
    while (n.scrollWidth > w && fs > 10) { fs -= 0.5; n.style.fontSize = fs + 'px'; } })();
  function setM(m) {
    cardMark(m);
    document.querySelectorAll('.tp-meth [data-m]').forEach(function (x) { var on = x.getAttribute('data-m') === m; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
    show(cardBox, m !== 'apple'); show(appleBox, m === 'apple');
    if (m === 'apple') mountApple();
  }
  setM(D.m || 'mada');
  document.querySelectorAll('.tp-meth [data-m]').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-m'); ev('method', { m: m });
      /* كل وسيلة برقمها في Paymob: إن اختلف رقم الوسيلة تُفتح عملية لها */
      if (m !== 'apple' && D.open && MG[m] && MG[D.m] && MG[m] !== MG[D.m] && !started) { location.replace((D.retry || location.pathname) + '?m=' + m); return; }
      if (m !== 'apple') D.m = m;
      setM(m);
    });
  });
  if (payBtn) payBtn.addEventListener('click', function () {
    if (payBtn.disabled || started) return;
    show(err, false); flipBack();
    if (PXF && PXF.contentWindow) { PXF.contentWindow.postMessage({ tp: 'pay' }, location.origin); return; }
    ev('pay_click'); window.dispatchEvent(new Event('payFromOutside'));
  });
  var again = document.querySelector('button[data-retry]'); /* v426: الزر نفسه — لا الإطار #tp الذي يحمل data-retry */
  if (again) again.addEventListener('click', function () { location.href = D.retry || '/clients/'; });
  function childPixel(D) {
    var O = location.origin, P = window.parent;
    function up(t, x) { try { P.postMessage({ tp: t, x: x || {} }, O); } catch (e) { void e; } }
    function ev(stage, data) { try { fetch(D.status.replace(/\/status$/, '/ev'), { method: 'POST', keepalive: true, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: stage, data: data || {} }) }); } catch (e) { void e; } }
    var h0 = 0;
    function size() { var h = Math.ceil(document.documentElement.scrollHeight); if (h !== h0) { h0 = h; up('h', { h: h }); } }
    try { new ResizeObserver(size).observe(document.body); } catch (e) { setInterval(size, 400); }
    window.addEventListener('message', function (e) {
      if (e.origin !== O || e.source !== P || !e.data || e.data.tp !== 'pay') return;
      ev('pay_click'); window.dispatchEvent(new Event('payFromOutside'));
    });
    var done = false;
    function mount() {
      if (done || typeof window.Pixel !== 'function') return false;
      done = true; var seen = false;
      try {
        new window.Pixel({
          publicKey: D.pub, clientSecret: D.cs, paymentMethods: ['card'], elementId: 'tp-pixel', disablePay: true, showSaveCard: D.save === '1',
          cardValidationChanged: function (ok) { if (!seen) { seen = true; ev('fields_ready'); up('ready'); } up('valid', { ok: !!ok }); size(); },
          beforePaymentComplete: async function () { ev('before'); up('before'); return true; },
          afterPaymentComplete: async function (r) {
            var d = (r && r.data) || {}, url = d.redirection_url || d.redirect_url;
            ev('after', { status: r && r.status, success: d.success, pending: d.pending, redirect: url ? String(url).replace(/\?.*$/, '').slice(0, 120) : '' });
            if (typeof url === 'string' && /^https:\/\//i.test(url)) { up('nav'); location.href = url; return; }
            up('after', { status: r && r.status, msg: String((d && (d.message || d.msg || d.detail)) || '').slice(0, 200) });
          },
          customStyle: CS
        });
        ev('mounted'); up('mounted'); setTimeout(size, 300);
      } catch (e) { ev('mount_error', { m: String(e && e.message || e).slice(0, 200) }); up('error'); }
      return true;
    }
    /* الإطار الفرعي يغادر إلى صفحة البنك ← الأم تكبّره نافذةً بهوية تيرا */
    window.addEventListener('pagehide', function () { up('nav'); });
    if (!mount()) { var n = 0, iv = setInterval(function () { if (mount() || ++n > 80) clearInterval(iv); }, 250); window.addEventListener('load', mount); }
  }
})();
