/* v416 — بوابة دفع تيرا: الحركة (العدّ · الغبار الذهبي · ميل البطاقة وبريقها) ونموذج البطاقة الآمن من Paymob (Pixel).
   بيانات البطاقة تُدخل داخل إطار Paymob الآمن فقط — هذا الملف لا يقرأها ولا يرسلها. */
(function () {
  'use strict';
  var R = document.getElementById('tp');
  if (!R) return;
  var D = R.dataset, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  function show(el, on) { if (el) el.hidden = !on; }
  function fail(msg) { if (err) { err.textContent = msg; show(err, true); } if (alt && alt.getAttribute('href') !== '#') show(alt, true); }
  function step(n) {
    document.querySelectorAll('.tp-steps li[data-s]').forEach(function (li) {
      var s = Number(li.getAttribute('data-s')); li.className = s < n ? 'done' : s === n ? 'on' : '';
      var i = li.querySelector('i'); if (i) i.textContent = s < n ? '✓' : String(s);
    });
  }
  function result(st, rc) {
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
    show(res, true);
    try { res.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } catch (e) { void e; }
  }
  function poll(n) {
    fetch(D.status, { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) {
      var s = j && j.status;
      if (s === 'paid' || s === 'failed') return result(s, j.receipt);
      if (n > 0) setTimeout(function () { poll(n - 1); }, 2500); else result('pending');
    }).catch(function () { if (n > 0) setTimeout(function () { poll(n - 1); }, 3000); else result('pending'); });
  }
  function processing() { show(form, false); show(proc, true); step(2); poll(24); }

  var timer = null;
  function mount() {
    if (ready || typeof window.Pixel !== 'function') return false;
    if (!D.cs) return false;
    ready = true; clearTimeout(timer); box.classList.remove('wait');
    /* v425: البطاقة فقط — إضافة apple-pay قبل توثيق النطاق لدى Paymob عطّلت إرسال الدفع */
    var PM = ['card'];
    try {
      new window.Pixel({
        publicKey: D.pub, clientSecret: D.cs, paymentMethods: PM, elementId: 'tp-pixel',
        disablePay: true, showSaveCard: D.save === '1',
        cardValidationChanged: function (ok) { seen = true; if (payBtn) payBtn.classList.toggle('is-ready', !!ok); if (ok) show(err, false); },
        beforePaymentComplete: async function () { started = true; if (payBtn) { payBtn.disabled = true; payBtn.textContent = 'جارٍ الدفع…'; } return true; },
        afterPaymentComplete: async function (r) {
          /* التحقق الآمن من البنك (3-D Secure) أو صفحة العودة: ننتقل إليها، وصفحة العودة في تيرا تعرض النتيجة بالختم */
          var d = (r && r.data) || {}, url = d.redirection_url || d.redirect_url;
          if (typeof url === 'string' && /^https:\/\//i.test(url)) { show(form, false); show(proc, true); location.href = url; return; }
          if (r && r.status >= 400) {
            started = false; if (payBtn) { payBtn.disabled = false; payBtn.textContent = D.cta || 'ادفع'; }
            var m = (d && (d.message || d.msg || d.detail)) || (Array.isArray(d) && d[0]) || 'لم تكتمل العملية. تأكد من بيانات البطاقة وحاول مرة أخرى.';
            if (err) { err.textContent = String(m); show(err, true); }
            return;
          }
          processing();
        },
        customStyle: {
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
        }
      });
    } catch (e) { fail('تعذّر تشغيل نموذج البطاقة. يمكنك إكمال الدفع من واجهة Paymob البديلة.'); }
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
  if (D.open && !D.cs) {
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
        if (alt && j.hosted) alt.setAttribute('href', j.hosted);
        var apl = document.getElementById('tp-apay'); if (apl && j.hosted) apl.setAttribute('href', j.hosted);
        if (j.ref) document.querySelectorAll('[data-ref]').forEach(function (el) { el.textContent = j.ref; });
        if (payBtn) payBtn.disabled = false;
        boot();
      })
      .catch(function () { box.classList.remove('wait'); if (err) { err.textContent = 'تعذّر الاتصال الآن. أعد تحميل الصفحة.'; show(err, true); } });
  } else boot();
  /* v426: اختيار طريقة الدفع — مدى · فيزا/ماستركارد (نموذج البطاقة) · Apple Pay (نافذة Apple Pay الآمنة) */
  var cardBox = document.getElementById('tp-cardbox'), appleBox = document.getElementById('tp-applebox');
  var MN = { mada: 'بمدى', card: 'بالبطاقة الائتمانية' };
  document.querySelectorAll('.tp-meth [data-m]').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-m');
      document.querySelectorAll('.tp-meth [data-m]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
      show(cardBox, m !== 'apple'); show(appleBox, m === 'apple');
      if (payBtn && !started && MN[m]) payBtn.textContent = 'ادفع ' + money(Number(D.amount) || 0) + ' ر.س ' + MN[m];
    });
  });
  var apl0 = document.getElementById('tp-apay');
  if (apl0) apl0.addEventListener('click', function (ev) { if (apl0.getAttribute('href') === '#') { ev.preventDefault(); if (err) { err.textContent = 'لحظة… نجهّز Apple Pay.'; } } });
  if (payBtn && MN.mada) payBtn.textContent = 'ادفع ' + money(Number(D.amount) || 0) + ' ر.س ' + MN.mada;
  if (payBtn) payBtn.addEventListener('click', function () {
    if (payBtn.disabled || started) return;
    show(err, false); window.dispatchEvent(new Event('payFromOutside'));
  });
  var again = document.querySelector('button[data-retry]'); /* v426: الزر نفسه — لا الإطار #tp الذي يحمل data-retry */
  if (again) again.addEventListener('click', function () { location.href = D.retry || '/clients/'; });
})();
