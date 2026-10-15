  /* ---------- portal (v232): one identity, 10-minute session on every flow ---------- */
  if ($('#f-login')) (function () {
    var FLOWS = {
      login: { steps: ['بيانات الدخول', 'التحقق', 'الجهاز'], forms: ['login', 'otp', 'device'], ic: ['PiLockKeyFill', 'PiKeyFill', 'PiDesktopFill'],
        t: ['تسجيل الدخول', 'التحقق الثنائي', 'توثيق الجهاز'],
        s: ['حساب واحد لكل خدماتك في منصة تيرا.', 'أدخل رمز تطبيق المصادقة أو الرمز الإضافي.', 'هذا أول دخول من هذا الجهاز. قرّر هل تصرّح له.'] },
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
    function human() { humanOk = false; var h = $('#human'); h.classList.remove('ok'); $('#human-t').textContent = 'جارٍ التحقق البشري…'; setTimeout(function () { humanOk = true; h.classList.add('ok'); $('#human-t').textContent = 'تم التحقق بنجاح'; }, 1400); }
    var boxes = $$('#otp-in input');
    function reset() {
      cur = { flow: '', i: 0 }; go('login', 0); human(); tries = 5; clearInterval(cdId); clearInterval(vId);
      $('#otp-box').hidden = true; $('#otp-go').disabled = true; $('#otp-left').textContent = '5'; boxes.forEach(function (i) { i.value = ''; }); msg('otp-msg'); msg('lg-msg');
      $$('.vc').forEach(vcReset); $$('.pt-yn').forEach(function (y) { ynSet(y, ''); }); mfReset(); $('#done-exit-n').hidden = true;
      $$('.dv').forEach(function (d) { d.hidden = false; d.classList.remove('is-gone'); }); devCount();
    }
    $$('.ts-eye').forEach(function (b) { b.addEventListener('click', function () { var i = b.previousElementSibling, on = i.type === 'password'; i.type = on ? 'text' : 'password'; b.setAttribute('aria-label', on ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'); b.innerHTML = I(on ? 'PiEyeSlashFill' : 'PiEyeFill'); }); });
    $$('.pt [data-flow]').forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.flow, 0); }); });
    $('#pt-back').addEventListener('click', function () { if (cur.i > 0) go(cur.flow, cur.i - 1); else reset(); });
    $('#done-again').addEventListener('click', reset);
    $('#done-login').addEventListener('click', reset);
    $('#done-go').addEventListener('click', function () { post({ tera: 'enter' }); });
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
      send.addEventListener('click', function () {
        var d = vcDest(card); vcPaint(card);
        if (!d) { var el = $('#' + card.dataset.dest); if (el) bad(el, true); return msg(m, 'bad', ch === 'mail' ? 'اكتب بريدًا إلكترونيًا صحيحًا أولًا.' : 'اكتب رقم الجوال بدون صفر في أوله (9 أرقام تبدأ بـ 5).'); }
        send.disabled = true; send.textContent = 'جارٍ الإرسال…';
        setTimeout(function () {
          clearBoxes(ins); $('.vc-code', card).hidden = false; msg(m, 'ok', VCH[ch][0]); send.textContent = 'إعادة إرسال الرمز';
          var n = 60, v = 300, rs = $('.vc-rs', card); rs.hidden = false; $('.vc-cd', card).textContent = fmt(n); $('.vc-valid', card).textContent = fmt(v); clearInterval(st.t);
          st.t = setInterval(function () { n = Math.max(n - 1, 0); v = Math.max(v - 1, 0); $('.vc-cd', card).textContent = fmt(n); $('.vc-valid', card).textContent = fmt(v);
            if (!n) { rs.hidden = true; send.disabled = false; } if (!v) { clearInterval(st.t); msg(m, 'bad', 'انتهت صلاحية الرمز. أعد إرسال رمز جديد.'); } }, 1000);
          setTimeout(function () { ins[0].focus({ preventScroll: true }); }, 30);
        }, 600);
      });
      wireOtp(ins, function () {
        if (st.ok) return; var c = codeOf(ins);
        if (c === '000000') { ins[0].parentNode.classList.add('bad'); return msg(m, 'bad', 'الرمز غير صحيح أو انتهت مدته.'); }
        clearInterval(st.t); st.ok = true; st.d = vcDest(card); card.classList.add('is-ok'); $('.vc-st', card).textContent = VCH[ch][1];
        $('.vc-code', card).hidden = true; send.hidden = true; msg(m, 'ok', VCH[ch][2]); vcChanged();
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
      if (n === 'lg-trust') { $('#lg-dur-w').hidden = v !== 'yes'; $('#lg-devs').hidden = v !== 'yes'; devCount(); }
      if (n === 'rg-trust') { $('#rg-dur-w').hidden = v !== 'yes'; $('#rg6-go').disabled = !v; $('#rg-dn').textContent = (v === 'yes' ? 1 : 0) + ' من 3'; }
    }
    function devName() {
      var ua = navigator.userAgent, br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'متصفح';
      var os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'جهاز';
      $$('.dev-name').forEach(function (b) { b.textContent = br + ' على ' + os; });
    }
    function devCount() {
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
      var b = $('#lg-go'); b.disabled = true; b.textContent = 'جارٍ الدخول…';
      setTimeout(function () { b.disabled = false; b.textContent = 'دخول'; msg('lg-msg'); go('login', 1); paintVia(); }, 700);
    });
    var VIA = { app: ['تطبيق المصادقة · رمز يتجدد كل 30 ثانية', 'PiDeviceMobileFill', 'افتح تطبيق المصادقة وأدخل الرمز الظاهر لحساب Tera', '', ''],
                wa: ['رمز إضافي من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiWhatsappLogoFill', 'يُرسل إلى واتساب', '+966 5• ••• ••74', 'أرسل الرمز عبر واتساب'],
                sms: ['رمز إضافي من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiChatCircleTextFill', 'يُرسل برسالة نصية إلى', '+966 5• ••• ••74', 'أرسل الرمز برسالة نصية'],
                mail: ['رمز إضافي من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiEnvelopeFill', 'يُرسل إلى البريد', 'n•••@example.com', 'أرسل الرمز إلى البريد'] };
    function paintVia() { var v = $('#otp-via').value, c = VIA[v]; $('#otp-hint').textContent = c[0]; $('#otp-dest-i').innerHTML = I(c[1]); $('#otp-dest-t').textContent = c[2]; $('#otp-dest-v').textContent = c[3]; $('#otp-spam').hidden = v !== 'mail'; var s = $('#otp-send'); s.hidden = v === 'app'; s.textContent = c[4]; s.disabled = false; msg('otp-msg'); if (v === 'app') openBox(false); else { $('#otp-box').hidden = true; $('#otp-go').disabled = true; } }
    $('#otp-via').addEventListener('change', function () { clearInterval(cdId); clearInterval(vId); paintVia(); });
    function openBox(withCd) {
      $('#otp-box').hidden = false; $('#otp-go').disabled = false; $('#otp-resend').hidden = !withCd; $('#otp-valid-w').hidden = !withCd;
      if (withCd) { var n = 60, v = 300; clearInterval(cdId); clearInterval(vId); $('#otp-cd').textContent = fmt(n); $('#otp-valid').textContent = fmt(v); var s = $('#otp-send'); s.disabled = true;
        cdId = setInterval(function () { n--; $('#otp-cd').textContent = fmt(n); if (n <= 0) { clearInterval(cdId); s.disabled = false; s.textContent = 'إعادة إرسال الرمز'; $('#otp-resend').hidden = true; } }, 1000);
        vId = setInterval(function () { v--; $('#otp-valid').textContent = fmt(Math.max(v, 0)); if (v <= 0) { clearInterval(vId); msg('otp-msg', 'bad', 'انتهت صلاحية الرمز. أعد إرسال رمز جديد.'); } }, 1000); }
      setTimeout(function () { boxes[0].focus({ preventScroll: true }); }, 30);
    }
    $('#otp-send').addEventListener('click', function () { var b = this, v = $('#otp-via').value; b.disabled = true; b.textContent = 'جارٍ الإرسال…';
      setTimeout(function () { clearBoxes(boxes); msg('otp-msg', 'ok', VCH[v === 'mail' ? 'mail' : v][0]); b.textContent = VIA[v][4]; openBox(true); }, 700); });
    wireOtp(boxes, function () { var f = $('#f-otp'); if (f.requestSubmit) f.requestSubmit(); else $('#otp-go').click(); });
    $('#f-otp').addEventListener('submit', function (e) { e.preventDefault(); var code = codeOf(boxes);
      if (code.length < 6) return msg('otp-msg', 'bad', 'أدخل رمز التحقق المكوّن من 6 أرقام.');
      if (code === '000000') { tries--; $('#otp-left').textContent = String(tries); $('#otp-in').classList.add('bad'); if (tries <= 0) { reset(); return msg('lg-msg', 'bad', 'استُنفدت المحاولات لهذا الرمز. ابدأ الدخول من جديد.'); } return msg('otp-msg', 'bad', 'الرمز غير صحيح أو انتهت مدته.'); }
      clearInterval(cdId); clearInterval(vId); msg('dev-msg'); go('login', 2); devCount(); });
    $('#f-device').addEventListener('submit', function (e) { e.preventDefault(); var v = ynVal('lg-trust'), d = $('#lg-dur').value;
      if (!v) return msg('dev-msg', 'bad', 'اختر هل تصرّح لهذا الجهاز.');
      if (v === 'yes' && $$('#lg-devs .dv').filter(function (x) { return !x.hidden; }).length >= 3) return msg('dev-msg', 'bad', 'ألغِ تصريح جهاز أولًا؛ الحد الأقصى ثلاثة أجهزة.');
      finish('تم الدخول بنجاح', v === 'yes' ? 'صرّحنا لهذا الجهاز لمدة ' + d + ' يومًا، ولن نطلب الرمز الإضافي منه خلالها. يمكنك إلغاء التصريح من مركز الأمان.' : 'لم نصرّح لهذا الجهاز، وسنطلب رمز التحقق في الدخول القادم منه.', { enter: true }); });

    /* ---- password kit: rules + strength + confirm ---- */
    var USED = ['tera2468', 'tera@2025', 'riyadh2580'];
    function cls(c) { return c >= 48 && c <= 57 ? 'd' : c >= 97 && c <= 122 ? 'a' : ''; }
    function hasSeq(v) { var s = v.toLowerCase(); for (var i = 0; i + 2 < s.length; i++) { var a = s.charCodeAt(i), b = s.charCodeAt(i + 1), c = s.charCodeAt(i + 2), k = cls(a);
      if (!k || cls(b) !== k || cls(c) !== k) continue; if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1) || (a === b && b === c)) return true; } return false; }
    var R = { let: function (v) { return (v.match(/[A-Za-z]/g) || []).length >= 4 && /[A-Z]/.test(v); }, dig: function (v) { return (v.match(/\d/g) || []).length >= 4; },
              seq: function (v) { return !!v && !hasSeq(v); }, old: function (v) { return !!v && USED.indexOf(v.toLowerCase()) < 0; } };
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
      finish('تم تعيين كلمة المرور', 'سجّل الدخول الآن بكلمة المرور الجديدة. أنهينا الجلسات المفتوحة وألغينا تصاريح الأجهزة حفاظًا على أمان حسابك.', { login: true }); });

    /* ---- recovery code → new password ---- */
    $('#f-rc1').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#rc-id'), c = $('#rc-code');
      var ik = bad(i, !idOk(i.value)), ck = bad(c, !/^\d{10}$/.test(c.value));
      if (!ik || !ck) return msg('rc1-msg', 'bad', 'أدخل البريد أو الجوال، ورمز الاستعادة المكوّن من 10 أرقام.');
      msg('rc1-msg'); go('recover', 1); });
    $('#f-rc2').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('rc', 'rc2-msg')) return;
      finish('استعدت الوصول إلى حسابك', 'تم تعيين كلمة المرور الجديدة، وأُلغي رمز الاستعادة الذي استخدمته. فعّل وسيلة تحقق جديدة بعد الدخول.', { login: true }); });

    reset();
  })();
})();
