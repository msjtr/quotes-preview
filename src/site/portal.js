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
        s: ['الخطوة الأولى: تحقق من رقم جوالك المسجّل.', 'الخطوة الثانية: تحقق من بريدك المسجّل.', 'رمز تطبيق المصادقة أو الرقم الإضافي الذي أنشأته.', 'اختر كلمة مرور قوية وأكّدها.'] },
      recover: { steps: ['الرقم الإضافي', 'كلمة مرور جديدة'], forms: ['rc1', 'rc2'], ic: ['PiShieldCheckFill', 'PiLockKeyFill'],
        t: ['استعادة الوصول', 'كلمة مرور جديدة'], s: ['بالرقم الإضافي الذي أنشأته وحفظته بنفسك.', 'اختر كلمة مرور قوية وأكّدها.'] }
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
      if (UX2 && flow === cur.flow && i > cur.i) {
        var from = FLOWS[flow].forms[cur.i], c = TN.current(), F2 = FLOWS[flow];
        if (!c || c.closed || c.o.kind === 'run' || c.o.kind === 'bad') TN.show({ kind: 'ok', title: DONE_T[from] || 'اكتملت الخطوة', text: 'التالي: ' + F2.t[i] + ' — ' + F2.s[i] });
        return TN.hold(function () { go0(flow, i); });
      }
      go0(flow, i);
    }
    function go0(flow, i) {
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
      if (F.forms[i] === 'reg4') reg4Enter();
      if (F.forms[i] === 'device' || F.forms[i] === 'reg6') devName();
    }
    function finish(h, p, o) {
      if (UX2) { var c = TN.current(); if (!c || c.closed || c.o.kind === 'run' || c.o.kind === 'bad') TN.show({ kind: 'ok', title: h, text: p }); return TN.hold(function () { finish0(h, p, o); }); }
      finish0(h, p, o);
    }
    function finish0(h, p, o) {
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
      if (o.after) o.after();
    }
    function msg(id, k, t) { var m = typeof id === 'string' ? $('#' + id) : id; if (!m) return; m.className = (m.classList.contains('vc-msg') ? 'vc-msg' : m.classList.contains('mf-msg') ? 'mf-msg' : 'ts-msg') + (k ? ' ' + k : ''); m.textContent = t || ''; m.hidden = !t;
      /* v356: كل رسالة تظهر إشعارًا في منتصف الشاشة (8 ثوانٍ أو يغلقه المستخدم) */
      if (t && UX2) { m.hidden = true; var sp = String(t).match(/^(.+?[.؟!])\s+(.+)$/); TN.show({ kind: k === 'bad' ? 'bad' : k === 'ok' ? 'ok' : 'info', title: sp ? sp[1] : t, text: sp ? sp[2] : '' }); } }
    var TN = window.TeraNotify || { show: function () {}, hold: function (f) { f(); }, current: function () { return null; } }, UX2 = !!(window.TeraNotify && window.TeraNotify.enabled);
    /* عنوان الإشعار عند إكمال كل خطوة (يظهر 5 ثوانٍ قبل الانتقال) */
    var DONE_T = { login: 'تم التحقق من بياناتك', otp: 'تم التحقق من الرمز بنجاح', device: 'تم حفظ اختيارك للجهاز', reg1: 'حُفظ اسمك', reg2: 'حُفظت بيانات التواصل', reg3: 'حُفظت كلمة المرور',
      reg4: 'تم التحقق من البريد والجوال', reg5: 'فُعّلت المصادقة الثنائية', fg1: 'تم التحقق من رقم جوالك', fg2: 'تم التحقق من بريدك', fg3: 'تم التحقق الإضافي', rc1: 'تم قبول رمز الاستعادة' };
    var RUN_T = { 'f-login': ['جارٍ تسجيل الدخول…', 'نتحقق من بياناتك بأمان.'], 'f-otp': ['جارٍ التحقق من الرمز…', 'ثوانٍ ويكتمل التحقق.'], 'f-device': ['جارٍ فتح حسابك…', 'نجهّز جلستك.'],
      'f-reg1': ['جارٍ الحفظ…', ''], 'f-reg2': ['جارٍ الحفظ…', ''], 'f-reg3': ['جارٍ فحص كلمة المرور…', 'نتأكد أنها قوية وغير مسرّبة.'], 'f-reg4': ['جارٍ التحقق…', ''], 'f-reg5': ['جارٍ تفعيل المصادقة…', ''], 'f-reg6': ['جارٍ إنشاء حسابك…', 'لحظات ويصبح حسابك جاهزًا.'],
      'f-fg1': ['جارٍ التحقق من جوالك…', ''], 'f-fg2': ['جارٍ التحقق من بريدك…', ''], 'f-fg3': ['جارٍ التحقق الإضافي…', ''], 'f-fg4': ['جارٍ حفظ كلمة المرور…', ''], 'f-rc1': ['جارٍ التحقق من الرقم الإضافي…', ''], 'f-rc2': ['جارٍ حفظ كلمة المرور…', ''] };
    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
    function tick() { var l = Math.max(left, 0); $('#timer-v').textContent = fmt(l); $('#timer-bar').style.width = Math.min(100, l / SESSION * 100) + '%'; $('#pt-timer').classList.toggle('is-low', l <= 60); }
    /* v403: قبل انتهاء مدة الخطوات بدقيقة: «تمديد الوقت» (5 دقائق، مرتين على الأكثر) بدل البدء من جديد */
    var ext = 0, extAsked = false;
    function askExtend() {
      if (extAsked || ext >= 2 || !window.TeraNotify || !window.TeraNotify.show) return; extAsked = true;
      window.TeraNotify.show({ force: true, now: true, kind: 'warn', icon: 'clock-countdown:gold', title: 'قاربت مدة الخطوات على الانتهاء', text: 'بقيت دقيقة لإكمال الدخول. تحتاج وقتًا أطول؟', ms: 0,
        actions: [{ label: 'تمديد 5 دقائق', primary: true, run: function () { if (left > 0) { ext++; left += 300; tick(); extAsked = false; } } }, { label: 'لا، أكمل' }] });
    }
    function startTimer() { clearInterval(timerId); left = SESSION; ext = 0; extAsked = false; tick(); timerId = setInterval(function () { left--; tick(); if (left === 60) askExtend(); if (left <= 0) { clearInterval(timerId); reset(); msg('lg-msg', 'bad', 'انتهت مدة الجلسة قبل اكتمال الخطوات. ابدأ من جديد.'); } }, 1000); }
    function human() { if (LIVE) { humanOk = true; return; } humanOk = false; var h = $('#human'); h.classList.remove('ok'); $('#human-t').textContent = 'جارٍ التحقق البشري…'; setTimeout(function () { humanOk = true; h.classList.add('ok'); $('#human-t').textContent = 'تم التحقق بنجاح'; }, 1400); }
    var boxes = $$('#otp-in input');
    function reset() {
      cur = { flow: '', i: 0 }; go('login', 0); human(); tries = 5; clearInterval(cdId); clearInterval(vId);
      S.pending = ''; S.factors = []; S.ch = {}; S.fg = ''; S.tok = ''; S.inn = false; S.going = false; S.vBusy = false; S.vDone = false; boxes.forEach(function (b) { b.hidden = false; });
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
    function idOk(v) { v = ascii(v).replace(/\s/g, ''); return reEmail.test(v) || rePhone.test(v) || (/^(\+|00)/.test(v) && /^\+\d{8,15}$/.test(liveId(v))); }
    function bad(el, on) { el.classList.toggle('bad', !!on); return !on; }

    /* ---- 6-box code entry: auto-confirm when complete ---- */
    function wireOtp(inputs, onFull) {
      /* v356: الإدخال التلقائي للرمز (اقتراح لوحة المفاتيح في iOS/Android أو اللصق) يضع الرمز كاملًا في خانة واحدة — يُوزَّع على الخانات */
      var fired = false;
      function full() { return inputs.every(function (b) { return b.value; }); }
      function fire() { if (fired) return; fired = true; setTimeout(function () { fired = false; }, 1200); setTimeout(onFull, 250); }
      function spread(from, digits) { for (var j = 0; j < digits.length && from + j < inputs.length; j++) inputs[from + j].value = digits[j]; var nx = inputs[Math.min(from + digits.length, inputs.length - 1)]; if (nx && !full()) nx.focus(); else if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }
      inputs.forEach(function (inp, i) {
        inp.setAttribute('autocomplete', i === 0 ? 'one-time-code' : 'off'); inp.setAttribute('inputmode', 'numeric'); if (i === 0) inp.removeAttribute('maxlength');
        inp.addEventListener('input', function () {
          var d = ascii(inp.value).replace(/\D/g, ''); inp.parentNode.classList.remove('bad');
          if (d.length > 1) { inp.value = ''; spread(i === 0 || d.length >= inputs.length ? (d.length >= inputs.length ? 0 : i) : i, d.slice(0, inputs.length)); }
          else { inp.value = d; if (d && inputs[i + 1]) inputs[i + 1].focus(); }
          if (full()) fire();
        });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); });
        inp.addEventListener('paste', function (e) { var t = ascii((e.clipboardData && e.clipboardData.getData('text')) || '').replace(/\D/g, '').slice(0, inputs.length); if (t.length) { e.preventDefault(); inputs.forEach(function (b) { b.value = ''; }); spread(0, t); if (full()) fire(); } });
      });
    }
    function codeOf(inputs) { return inputs.map(function (b) { return b.value; }).join(''); }
    function clearBoxes(inputs) { inputs.forEach(function (b) { b.value = ''; }); if (inputs[0]) inputs[0].parentNode.classList.remove('bad'); }

    /* ---- verification cards (email · SMS · WhatsApp) ---- */
    var VCH = { mail: ['أُرسل الرمز إلى بريدك.', 'تم التحقق', 'تم التحقق من بريدك الإلكتروني.'], sms: ['أُرسل الرمز برسالة نصية.', 'تم التحقق', 'تم التحقق من رقم جوالك.'], wa: ['أُرسل الرمز إلى واتساب من الرقم الرسمي.', 'تم التحقق', 'تم التحقق من رقمك — بقي أن تنشئ رمز التعريف.'] };
    function vcDest(card) {
      var id = card.dataset.dest, el = $('#' + id); if (!el) return '';
      if (card.dataset.ch === 'mail') { var v = el.value.trim(); return reEmail.test(v) ? v : ''; }
      if (window.TQ_TEL) return TQ_TEL.show(id);
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
        if (!d) { var el = $('#' + card.dataset.dest); if (el) bad(el, true); return msg(m, 'bad', ch === 'mail' ? 'اكتب بريدًا إلكترونيًا صحيحًا أولًا.' : (window.TQ_TEL ? TQ_TEL.err(card.dataset.dest) : 'اكتب رقم الجوال بدون صفر في أوله (9 أرقام تبدأ بـ 5).')); }
        send.disabled = true; send.textContent = 'جارٍ الإرسال…';
        if (fgLive) return liveFgSend(card, open, function (t) { send.disabled = false; send.textContent = 'أرسل رمز التحقق'; msg(m, 'bad', t); });
        if (rgLive) return liveRegSend(card, open, function (t) { send.disabled = false; send.textContent = 'أرسل رمز التحقق'; msg(m, 'bad', t); });
        setTimeout(function () { open(60, 300, VCH[ch][0]); }, 600);
      });
      wireOtp(ins, function () {
        if (st.ok || st.busy) return; var c = codeOf(ins);
        /* v380: طلب تحقق واحد في كل مرة (اللصق قد يطلقه مرتين) */
        var ok1 = function () { st.busy = false; done(); }, no1 = function (t) { st.busy = false; ins[0].parentNode.classList.add('bad'); msg(m, 'bad', t); };
        if (fgLive) { st.busy = true; return liveFgVerify(c, ok1, no1); }
        if (rgLive) { st.busy = true; return liveRegVerify(card, c, ok1, no1); }
        if (c === '000000') { ins[0].parentNode.classList.add('bad'); return msg(m, 'bad', 'الرمز غير صحيح أو انتهت مدته.'); }
        done();
      });
      var el = $('#' + card.dataset.dest); if (el && card.closest('#f-fg1, #f-fg2')) el.addEventListener('input', function () { if (st.ok || !$('.vc-code', card).hidden) vcReset(card); else vcPaint(card); vcChanged(); });
    }
    $$('.vc').forEach(vcInit);
    function vok(sel) { var c = $(sel); return !!(c && c._st && c._st.ok); }
    /* v375: ربط واتساب بالخطوات المعتمدة — رمز تحقق على واتساب ← «تم التحقق» ← رمز التعريف (4 أرقام) وتأكيده ← حفظ ← رسالة الاعتماد */
    var WAID = { ok: false };
    /* v379: في المنفذين الحيّين الجوال يُتحقَّق منه برمز واتساب في بطاقة الجوال نفسها (/admin/api/register/code)،
       فلا بطاقة تحقق ثانية لربط الواتساب؛ ورمز التعريف يُعتمد من الخادم (/admin/api/register/wa-link) ويُحفظ مع إنشاء الحساب (wa_link_proof). */
    function waVer() { return LIVE ? vok('#f-reg4 .vc[data-ch=sms]') : vok('#wa-box .vc'); }
    if (LIVE) { var wv0 = $('#wa-box .vc'); if (wv0) wv0.hidden = true; }
    function pinErr(p) {
      if (!/^\d{4}$/.test(p)) return 'أدخل رمز تعريف من 4 أرقام.';
      var d = p.split('').map(Number), up = true, dn = true;
      if (d.every(function (x) { return x === d[0]; })) return 'لا يُقبل رمز متكرر مثل 1111.';
      for (var i = 0; i < 3; i++) { if (d[i + 1] !== (d[i] + 1) % 10) up = false; if (d[i + 1] !== (d[i] + 9) % 10) dn = false; }
      if (up || dn) return 'لا يُقبل رمز متسلسل مثل 1234 أو 4321.';
      var ph = (String($('#rg-ph-cc') ? $('#rg-ph-cc').value : '') + ascii($('#rg-ph') ? $('#rg-ph').value : '')).replace(/\D/g, '');
      if (ph.length >= 4 && ph.slice(-4) === p) return 'لا تستخدم آخر 4 أرقام من رقم جوالك.';
      return '';
    }
    function waIdPaint() {
      var box = $('#wa-id'), done = $('#wa-done'); if (!box) return;
      var on = ynVal('wa') === 'yes', ver = waVer();
      box.hidden = !(on && ver && !WAID.ok); done.hidden = !(on && ver && WAID.ok);
    }
    (function () {
      var box = $('#wa-id'); if (!box) return;
      function boxes(sel) { var ins = $$(sel + ' input', box); ins.forEach(function (x, i) { x.addEventListener('input', function () { x.value = x.value.replace(/\D/g, '').slice(-1); if (x.value && ins[i + 1]) ins[i + 1].focus(); }); x.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !x.value && ins[i - 1]) ins[i - 1].focus(); }); }); return function () { return ins.map(function (x) { return x.value; }).join(''); }; }
      var A = boxes('.wid-a'), B = boxes('.wid-b'), m = $('#wid-msg');
      $('.wid-go', box).addEventListener('click', function () {
        var a = A(), b = B(), er = pinErr(a), go = this;
        if (er) return msg(m, 'bad', er);
        if (a !== b) return msg(m, 'bad', 'الرمزان غير متطابقين.');
        function ok() { msg(m); WAID.ok = true; waIdPaint(); vcChanged(); var dn = $('#wa-done'); if (dn && dn.scrollIntoView) dn.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
        if (!LIVE) return ok();
        var em = S.reg && S.reg.email, ph = S.reg && S.reg.whatsapp;
        if (!em || !em.proof) return msg(m, 'bad', 'تحقق من بريدك الإلكتروني أولًا، ثم أكّد رمز التعريف.');
        if (!ph || !ph.proof) return msg(m, 'bad', 'تحقق من رقم جوالك برمز واتساب أولًا.');
        go.disabled = true; var t0 = go.textContent; go.textContent = 'جارٍ الحفظ…'; msg(m);
        api('/admin/api/register/wa-link', { email: em.dest, phone: ph.dest, email_proof: em.proof, phone_proof: ph.proof, wa_pin: a }).then(function (r) {
          go.disabled = false; go.textContent = t0;
          if (!r || r.ok !== true || !r.link_proof) return msg(m, 'bad', (r && r.message) || 'تعذّر حفظ رمز التعريف. تأكد أنه ليس آخر 4 أرقام من جوالك، ثم أعد المحاولة.');
          S.reg.walink = r.link_proof; $$('#wa-id input').forEach(function (x) { x.value = ''; }); ok();
        });
      });
    })();
    function vcChanged() {
      var wa = ynVal('wa'); if (LIVE && WAID.ok && !waVer()) { WAID.ok = false; if (S.reg) S.reg.walink = ''; } waIdPaint();
      $('#rg4-go').disabled = !(vok('#f-reg4 .vc[data-ch=mail]') && vok('#f-reg4 .vc[data-ch=sms]') && (wa !== 'yes' || (waVer() && WAID.ok)));
      $('#fg1-go').disabled = !vok('#f-fg1 .vc'); $('#fg2-go').disabled = !vok('#f-fg2 .vc');
    }
    function reg4Enter() { $$('#f-reg4 .vc').forEach(function (c) { if (c._st.ok && vcDest(c) !== c._st.d) vcReset(c); else if (!c._st.ok) vcPaint(c); }); vcChanged(); }

    /* ---- yes / no choice ---- */
    function ynVal(n) { var y = $('.pt-yn[data-yn="' + n + '"]'); return y ? y.dataset.val || '' : ''; }
    function ynSet(y, v) { y.dataset.val = v; $$('button', y).forEach(function (b) { var on = b.dataset.v === v; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.classList.toggle('is-on', on); }); ynChanged(y.dataset.yn, v); }
    $$('.pt-yn').forEach(function (y) { $$('button', y).forEach(function (b) { b.addEventListener('click', function () { ynSet(y, b.dataset.v); }); }); });
    var DUR = { 30: 'مناسبة لجهاز تستخدمه أحيانًا. بعد 30 يومًا نطلب رمز التحقق من جديد.', 60: 'مناسبة للاستخدام المنتظم. بعد 60 يومًا نطلب رمز التحقق من جديد.', 90: 'لجهازك الشخصي الذي لا يستخدمه غيرك. بعد 90 يومًا نطلب الرمز من جديد.' };
    ['lg', 'rg'].forEach(function (p) { var s = $('#' + p + '-dur'); function h() { $('#' + p + '-dur-h').textContent = DUR[s.value]; } s.addEventListener('change', h); h(); });
    function ynChanged(n, v) {
      if (n === 'wa') { $('#wa-box').hidden = v !== 'yes'; if (v !== 'yes') { vcReset($('#wa-box .vc')); WAID.ok = false; $$('#wa-id input').forEach(function (x) { x.value = ''; }); } else vcPaint($('#wa-box .vc')); vcChanged(); }
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
      if (!idOk(id.value)) { bad(id, true); return msg('lg-msg', 'bad', 'اكتب بريدًا صحيحًا، أو جوالًا سعوديًا يبدأ بـ 05، أو رقمًا دوليًا بمفتاح دولته مثل \u200E+20 1XXXXXXXXX.'); }
      if (!humanOk) return msg('lg-msg', 'bad', 'لم يكتمل التحقق البشري. انتظر لحظة ثم أعد المحاولة.');
      if (LIVE) return liveLogin();
      var b = $('#lg-go'); b.disabled = true; b.textContent = 'جارٍ الدخول…';
      setTimeout(function () { b.disabled = false; b.textContent = 'دخول'; msg('lg-msg'); go('login', 1); paintVia(); }, 700);
    });
    var VIA = { app: ['تطبيق المصادقة · رمز يتجدد كل 30 ثانية', 'PiDeviceMobileFill', 'افتح تطبيق المصادقة وأدخل الرمز الظاهر لحساب Tera', '', ''],
                wa: ['رمز تحقق من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiWhatsappLogoFill', 'يُرسل إلى واتساب', '+966 5• ••• ••74', 'أرسل الرمز عبر واتساب'],
                sms: ['رمز تحقق من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiChatCircleTextFill', 'يُرسل برسالة نصية إلى', '+966 5• ••• ••74', 'أرسل الرمز برسالة نصية'],
                mail: ['رمز تحقق من 6 أرقام · صالح خمس دقائق · خمس محاولات', 'PiEnvelopeFill', 'يُرسل إلى البريد', 'n•••@example.com', 'أرسل الرمز إلى البريد'],
                xc: ['الرقم الذي أنشأته وحفظته بنفسك — 10 أرقام على الأقل · لا يُرسل إليك', 'PiKeyFill', 'تكتبه من حفظك', '', ''] };
    function paintVia() { var v = $('#otp-via').value, c = VIA[v]; $('#otp-hint').textContent = c[0]; $('#otp-dest-i').innerHTML = I(c[1]); $('#otp-dest-t').textContent = c[2]; $('#otp-dest-v').textContent = c[3]; $('#otp-spam').hidden = v !== 'mail'; var s = $('#otp-send'); s.hidden = v === 'app' || v === 'xc'; s.textContent = c[4]; s.disabled = false; msg('otp-msg'); var x = $('#otp-xc'); if (x) { x.hidden = v !== 'xc'; $('#otp-xc-in').value = ''; } $('.ts-dest').hidden = v === 'xc';
      if (v === 'app') openBox(false); else if (v === 'xc') { $('#otp-box').hidden = true; $('#otp-go').disabled = false; setTimeout(function () { $('#otp-xc-in').focus({ preventScroll: true }); }, 30); } else { $('#otp-box').hidden = true; $('#otp-go').disabled = true; } }
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
    $('#f-otp').addEventListener('submit', function (e) { e.preventDefault(); if (LIVE) return liveVerify();
      if ($('#otp-via').value === 'xc') { var xi = $('#otp-xc-in'), xd = xcDigits(xi.value);
        if (!/^\d{10,20}$/.test(xd)) { xi.classList.add('bad'); return msg('otp-msg', 'bad', 'اكتب رقمك الإضافي كاملًا (10 أرقام على الأقل).'); }
        if (/^0+$/.test(xd)) { xi.classList.add('bad'); tries--; $('#otp-left').textContent = String(tries); if (tries <= 0) { reset(); return msg('lg-msg', 'bad', 'استُنفدت المحاولات. ابدأ الدخول من جديد.'); } return msg('otp-msg', 'bad', 'الرقم الإضافي غير صحيح.'); }
        xi.classList.remove('bad'); xi.value = ''; msg('dev-msg'); go('login', 2); return devCount(); }
      var code = codeOf(boxes);
      if (code.length < 6) return msg('otp-msg', 'bad', 'أدخل رمز التحقق المكوّن من 6 أرقام.');
      if (code === '000000') { tries--; $('#otp-left').textContent = String(tries); $('#otp-in').classList.add('bad'); if (tries <= 0) { reset(); return msg('lg-msg', 'bad', 'استُنفدت المحاولات لهذا الرمز. ابدأ الدخول من جديد.'); } return msg('otp-msg', 'bad', 'الرمز غير صحيح أو انتهت مدته.'); }
      clearInterval(cdId); clearInterval(vId); msg('dev-msg'); go('login', 2); devCount(); });
    $('#f-device').addEventListener('submit', function (e) { e.preventDefault(); if (LIVE && S.dev) return liveDeviceSubmit(); var v = ynVal('lg-trust'), d = $('#lg-dur').value;
      if (!v) return msg('dev-msg', 'bad', 'اختر هل تصرّح لهذا الجهاز.');
      if (v === 'yes' && $$('#lg-devs .dv').filter(function (x) { return !x.hidden; }).length >= 3) return msg('dev-msg', 'bad', 'ألغِ تصريح جهاز أولًا؛ الحد الأقصى ثلاثة أجهزة.');
      finish('تم الدخول بنجاح', v === 'yes' ? 'صرّحنا لهذا الجهاز لمدة ' + d + ' يومًا، ولن نطلب رمز التحقق منه خلالها. يمكنك إلغاء التصريح من مركز الأمان.' : 'لم نصرّح لهذا الجهاز، وسنطلب رمز التحقق في الدخول القادم منه.', { enter: true }); });

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
      var pk = bad(p, !(window.TQ_TEL ? TQ_TEL.ok('rg-ph') : reLocal.test(p.value.replace(/\s/g, '')))), mk = bad(m, !reEmail.test(m.value.trim()));
      if (!pk) return msg('rg2-msg', 'bad', window.TQ_TEL ? TQ_TEL.err('rg-ph') : 'اكتب رقم الجوال بدون صفر في أوله (9 أرقام تبدأ بـ 5).');
      if (!mk) return msg('rg2-msg', 'bad', 'اكتب بريدًا إلكترونيًا صحيحًا.');
      msg('rg2-msg'); go('register', 2); });
    $('#f-reg3').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('rg', 'rg3-msg')) return;
      if (!$('#rg-terms').checked) return msg('rg3-msg', 'bad', 'وافق على سياسة الاستخدام والخصوصية للمتابعة.'); go('register', 3); });
    $('#f-reg4').addEventListener('submit', function (e) { e.preventDefault();
      if (!vok('#f-reg4 .vc[data-ch=mail]') || !vok('#f-reg4 .vc[data-ch=sms]')) return msg('rg4-msg', 'bad', 'تحقق من البريد والجوال أولًا.');
      if (ynVal('wa') === 'yes' && !(waVer() && WAID.ok)) return msg('rg4-msg', 'bad', 'أكمل ربط واتساب: رمز التحقق ثم رمز التعريف — أو اختر «لا، لاحقًا».');
      if (LIVE) return liveRegister();
      msg('rg4-msg'); go('register', 4); });

    /* 2FA methods: accordion (one open at a time), at least one required */
    var MF = { app: false, code: false };
    function mfOpen(sec, on) { sec.classList.toggle('is-open', on); $('.mf-b', sec).hidden = !on; $('.mf-h', sec).setAttribute('aria-expanded', on ? 'true' : 'false'); }
    $$('.mf').forEach(function (sec) { $('.mf-h', sec).addEventListener('click', function () { var on = !sec.classList.contains('is-open'); $$('.mf').forEach(function (o) { mfOpen(o, false); }); mfOpen(sec, on); if (on) setTimeout(function () { sec.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60); }); });
    function mfOn(m) {
      MF[m] = true; var sec = $('.mf[data-m="' + m + '"]'); sec.classList.add('is-on'); $('.mf-st', sec).textContent = 'مفعّل';
      msg($('.mf-msg', sec), 'ok', m === 'app' ? 'فعّلت تطبيق المصادقة لحسابك.' : 'فعّلت رقمك الإضافي. احفظه في مكان آمن — المنصة لا تعرضه ولا تسترجعه.');
      var n = (MF.app ? 1 : 0) + (MF.code ? 1 : 0); $('#mf-n').textContent = n + ' من 2'; $('.pt-must').classList.add('is-ok');
      if (m === 'code') $('#xc-saved-w').hidden = false;
      mfReady();
    }
    function mfReady() { $('#rg5-go').disabled = !((MF.app || MF.code) && (!MF.code || $('#rc-saved').checked)); }
    $('#rc-saved').addEventListener('change', mfReady);
    function mfReset() {
      MF = { app: false, code: false }; $$('.mf').forEach(function (s) { s.classList.remove('is-on'); $('.mf-st', s).textContent = 'غير مفعّل'; mfOpen(s, false); msg($('.mf-msg', s)); clearBoxes($$('.ts-otp input', s)); });
      $('#mf-n').textContent = '0 من 2'; $('.pt-must').classList.remove('is-ok'); $('#xc-saved-w').hidden = true; $('#rc-saved').checked = false; $('#rg5-go').disabled = true; xcClear();
    }
    function copy(t, b, done) { try { navigator.clipboard.writeText(t); } catch (e) {} var sp = $('span', b), o = sp.textContent; sp.textContent = done; setTimeout(function () { sp.textContent = o; }, 1600); }
    $('.qr-copy').addEventListener('click', function () { copy($('#qr-key').textContent.replace(/\s/g, ''), this, 'نُسخ المفتاح'); });
    $$('.gd-tabs button').forEach(function (b) { b.addEventListener('click', function () { var a = b.dataset.app;
      $$('.gd-tabs button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
      $$('.gd[data-app]').forEach(function (o) { o.hidden = o.dataset.app !== a; }); }); });
    var appIn = $$('.mf[data-m=app] .mf-in input');
    wireOtp(appIn, function () { if (MF.app) return; if (codeOf(appIn) === '000000') { appIn[0].parentNode.classList.add('bad'); return msg($('.mf[data-m=app] .mf-msg'), 'bad', 'الرمز غير صحيح. تأكد من أنه الرمز الظاهر الآن في التطبيق.'); } mfOn('app'); });
    /* v364: الرقم الإضافي — ينشئه العميل ويحفظه (سياسة الخادم نفسها: 10 أرقام+ · بلا تكرار · بلا تسلسل · 4 أرقام مختلفة) */
    function xcDigits(v) { return ascii(v).replace(/\s/g, ''); }
    function xcRules(v) {
      var d = xcDigits(v), only = /^\d*$/.test(d), up = d.length > 1, down = d.length > 1, dbl = d.length > 1 && d.length % 2 === 0;
      for (var k = 1; k < d.length; k++) { var st = (Number(d[k]) - Number(d[k - 1]) + 10) % 10; if (st !== 1) up = false; if (st !== 9) down = false; }
      for (var j = 0; j + 1 < d.length && dbl; j += 2) if (d[j] !== d[j + 1]) dbl = false;
      return { len: only && d.length >= 10 && d.length <= 20, rep: !!d && !/^(\d)\1+$/.test(d) && !/^(\d\d)\1+$/.test(d) && !dbl, seq: !!d && !up && !down, 'var': new Set(d.split('')).size >= 4 };
    }
    function xcOk(v) { var r = xcRules(v); return r.len && r.rep && r.seq && r['var']; }
    function xcPaint() {
      var v = $('#xc1').value, r = xcRules(v), v2 = $('#xc2').value, m = $('#xc-match');
      $$('#xc-rules li').forEach(function (li) { li.classList.toggle('is-ok', !!v && !!r[li.dataset.r]); li.classList.toggle('is-bad', !!v && !r[li.dataset.r]); });
      if (!v2) { m.hidden = true; return; }
      var same = xcDigits(v) === xcDigits(v2); m.hidden = false; m.className = 'xc-match ' + (same ? 'is-ok' : 'is-bad'); m.textContent = same ? 'الرقمان متطابقان ✓' : 'الرقمان غير متطابقين';
    }
    function xcClear() { ['#xc1', '#xc2'].forEach(function (q) { var i = $(q); if (i) { i.value = ''; i.classList.remove('bad'); } }); xcPaint(); }
    ['#xc1', '#xc2'].forEach(function (q) { $(q).addEventListener('input', function () { $(q).classList.remove('bad'); xcPaint(); }); });
    $('.xc-set').addEventListener('click', function () {
      if (MF.code) return; var a = $('#xc1'), b = $('#xc2'), box = $('.mf[data-m="code"] .mf-msg');
      if (!xcOk(a.value)) { a.classList.add('bad'); return msg(box, 'bad', 'الرقم لا يحقق الشروط الموضحة. اختر رقمًا من 10 أرقام أو أكثر بلا تكرار ولا تسلسل.'); }
      if (xcDigits(a.value) !== xcDigits(b.value)) { b.classList.add('bad'); return msg(box, 'bad', 'تأكيد الرقم غير مطابق. أعد كتابته.'); }
      a.value = ''; b.value = ''; xcPaint(); mfOn('code');
    });
    $('#f-reg5').addEventListener('submit', function (e) { e.preventDefault();
      if (!MF.app && !MF.code) return msg('rg5-msg', 'bad', 'فعّل وسيلة واحدة على الأقل: تطبيق المصادقة أو الرقم الإضافي.');
      if (MF.code && !$('#rc-saved').checked) return msg('rg5-msg', 'bad', 'أكّد أنك حفظت رقمك الإضافي في مكان آمن للمتابعة.');
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
    function fg3Paint() { var m = $('#fg3-m').value; $('#fg3-h').textContent = m === 'app' ? 'افتح تطبيق المصادقة واكتب الرمز الظاهر لحساب Tera.' : 'اكتب الرقم الإضافي الذي أنشأته وحفظته (10 أرقام على الأقل). لا نرسله إليك.';
      $('#fg3-box').hidden = m !== 'app'; $('#fg3-xc').hidden = m === 'app'; $('#fg3-xc-in').value = ''; clearBoxes(fg3In); msg('fg3-msg'); }
    $('#fg3-m').addEventListener('change', fg3Paint);
    $('#fg3-xc-go').addEventListener('click', function () { var i = $('#fg3-xc-in'), d = xcDigits(i.value);
      if (!/^\d{10,20}$/.test(d)) { i.classList.add('bad'); return msg('fg3-msg', 'bad', 'اكتب رقمك الإضافي كاملًا (10 أرقام على الأقل).'); }
      if (/^0+$/.test(d)) { i.classList.add('bad'); return msg('fg3-msg', 'bad', 'الرقم الإضافي غير صحيح.'); }
      i.classList.remove('bad'); i.value = ''; msg('fg3-msg'); go('forgot', 3); });
    wireOtp(fg3In, function () { if (codeOf(fg3In) === '000000') { fg3In[0].parentNode.classList.add('bad'); return msg('fg3-msg', 'bad', 'الرمز غير صحيح أو انتهت مدته.'); } msg('fg3-msg'); go('forgot', 3); });
    $('#f-fg3').addEventListener('submit', function (e) { e.preventDefault(); });
    $('#f-fg4').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('fg', 'fg4-msg')) return;
      if (LIVE) return livePassword('fg', 'fg4-msg', 'تم تعيين كلمة المرور', 'سجّل الدخول الآن بكلمة المرور الجديدة.');
      finish('تم تعيين كلمة المرور', 'سجّل الدخول الآن بكلمة المرور الجديدة. أنهينا الجلسات المفتوحة وألغينا تصاريح الأجهزة حفاظًا على أمان حسابك.', { login: true }); });

    /* ---- recovery code → new password ---- */
    $('#f-rc1').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#rc-id'), c = $('#rc-code');
      var ik = bad(i, !idOk(i.value)), ck = bad(c, !/^\d{10,20}$/.test(xcDigits(c.value)));
      if (!ik || !ck) return msg('rc1-msg', 'bad', 'أدخل البريد أو الجوال، ورقمك الإضافي (10 أرقام على الأقل).');
      msg('rc1-msg'); if (LIVE) return liveRecovery(i.value, c.value); go('recover', 1); });
    $('#f-rc2').addEventListener('submit', function (e) { e.preventDefault(); if (pwFail('rc', 'rc2-msg')) return;
      if (LIVE) return livePassword('rc', 'rc2-msg', 'استعدت الوصول إلى حسابك', 'تم تعيين كلمة المرور الجديدة. سجّل الدخول بها، وفعّل وسيلة تحقق جديدة بعد الدخول.');
      finish('استعدت الوصول إلى حسابك', 'تم تعيين كلمة المرور الجديدة. سجّل الدخول بها، ثم أنشئ رقمًا إضافيًا جديدًا من مركز الأمان.', { login: true }); });

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
      if (/^9665\d{8}$/.test(d)) return '+' + d; if (/^009665\d{8}$/.test(d)) return '+' + d.slice(2);
      /* v421: رقم دولي بمفتاح دولة مدعومة (+971 · +965 · +973 · +974 · +968 · +20) يُقبل للدخول والاستعادة */
      if (window.TQ_TEL && /^(\+|00)/.test(v.replace(/\s/g, ''))) { var x = d.replace(/^00/, ''), D = TQ_TEL.D; for (var k in D) if (x.indexOf(k) === 0 && D[k][3].test(x.slice(k.length).replace(/^0+/, ''))) return '+' + k + x.slice(k.length).replace(/^0+/, ''); }
      return v;
    }
    /* one human-check slot for the forgot flow, moved into the active stage (as the current gateway does) */
    function fgHuman(form, el) { el = el || $('#forgot-human'); var f = $('#f-' + form), vc = f && $('.vc', f); if (el && vc && el.nextSibling !== vc) vc.parentNode.insertBefore(el, vc); }
    function liveTop(path) { try { top.location.href = path; } catch (e) { location.href = path; } }
    function adopt(s) { if (!s || !s.access_token) return false; try { localStorage.setItem('tera.admin.session', JSON.stringify(s)); return true; } catch (e) { return false; } }
    function liveEnter() { liveTop('/staff/'); }
    /* v380: الانتقال إلى الحساب بعد أن يُقرأ إشعار «تم الدخول بنجاح» كاملًا (أو يضغط العميل «متابعة الآن»/يغلقه) — لا قبله */
    /* v383: صفحة نجاح واحدة (بلا إشعار مكرر فوقها) تبقى 3 ثوانٍ ثم الانتقال، أو «المتابعة إلى حسابك» فورًا */
    function liveGoIn() { if (S.going) return; S.going = true; setTimeout(liveEnter, 3000); }
    function liveDone(h, p) { var c = TN.current && TN.current(); if (c && !c.closed && c.close) c.close(); finish0(h, p, { enter: true }); liveGoIn(); }
    function liveIn() { if (S.inn) return; S.inn = true; liveDone('تم الدخول بنجاح', 'أهلًا بك في منصة تيرا — ننقلك الآن إلى حسابك…'); }
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
          S.pending = r.pending_token || (r.totp && r.totp.pending_token) || ''; S.ch = {}; S.vBusy = false; S.vDone = false;
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
      /* v380: طلب تحقق واحد فقط — اللصق أو اقتراح لوحة المفاتيح قد يطلق الإرسال مرتين، فيُستهلك الرمز في الأول ويظهر خطأ من الثاني قبل الدخول */
      if (S.vBusy || S.vDone) return; S.vBusy = true;
      var g = $('#otp-go'); g.disabled = true;
      api('/api/auth/2fa/verify', { challenge_id: c.id, code: code, factor: ch }).then(function (r) {
        S.vBusy = false;
        if (!r || !r.ok) { g.disabled = false; clearBoxes(boxes); liveLen(c.len); $('#otp-in').classList.add('bad'); return msg('otp-msg', 'bad', (r && r.message) || 'رمز التحقق غير صحيح أو انتهت صلاحيته.'); }
        S.vDone = true; clearInterval(cdId); clearInterval(vId); S.pending = '';
        if (adopt(r.session)) return liveDevice();
        S.vDone = false; g.disabled = false; msg('otp-msg', 'bad', 'تعذّر إكمال الدخول. حاول مرة أخرى.');
      });
    }
    function liveFgSend(card, onOpen, onFail) {
      var one = !!card.closest('#f-fg1'), ch = one ? 'whatsapp' : 'email';
      var ident = one ? (window.TQ_TEL ? TQ_TEL.e164('fg-ph') : '+' + $('#fg-ph-cc').value + ascii($('#fg-ph').value).replace(/\D/g, '').replace(/^0+/, '')) : $('#fg-em').value.trim().toLowerCase();
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
        if (!r || !r.ok || !r.recovery_token) return msg('rc1-msg', 'bad', (r && r.message) || 'الرقم الإضافي غير صحيح. تأكد منه ثم أعد المحاولة.');
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
        email_proof: em.proof, phone_proof: ph.proof, wa_link_proof: (ynVal('wa') === 'yes' && WAID.ok && S.reg.walink) ? S.reg.walink : null }).then(function (r) {
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
    /* v518: مفتاح جهاز ثابت — تُحفظ أوّل بصمة محسوبة على هذا المتصفح (tq.devk) وتُستعمل بعدها دائمًا،
       فلا يتغيّر «الجهاز» بتحديث المتصفح أو تكبير الصفحة أو تغيير الشاشة فيُطلب التصريح من جديد. */
    function devFingerprint() {
      var K = 'tq.devk', v = null;
      try { v = localStorage.getItem(K); } catch (e) { v = null; }
      if (v && /^[0-9a-f]{64}$/.test(v)) return Promise.resolve(v);
      return devFingerprintRaw().then(function (fp) {
        if (fp && /^[0-9a-f]{64}$/.test(fp)) { try { localStorage.setItem(K, fp); } catch (e) { void e; } }
        return fp;
      });
    }
    function devFingerprintRaw() {
      var n = navigator, sc = (top && top.screen) || screen, bits = [n.userAgent || '', n.platform || '', (n.languages || []).join(','), n.hardwareConcurrency || '',
        n.deviceMemory || n.deviceMemoryGB || '', sc.width + 'x' + sc.height + 'x' + (sc.colorDepth || ''), window.devicePixelRatio || '',
        (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })()].join('|');
      if (!window.crypto || !window.crypto.subtle) return Promise.resolve(null);
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(bits)).then(function (buf) {
        return Array.prototype.slice.call(new Uint8Array(buf)).map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      }).catch(function () { return null; });
    }
    var LV_BOX = [], LV_T = null;
    var FX_HINT = { email_code: ['PiEnvelopeSimpleFill', 'يصل رمز من 6 أرقام إلى بريد الحساب.'], whatsapp_code: ['PiWhatsappLogoFill', 'يصل رمز من 6 أرقام عبر واتساب إلى جوالك الموثّق.'], totp: ['PiDeviceMobileFill', 'افتح تطبيق المصادقة وأدخل الرمز الظاهر.'], extra_code: ['PiKeyFill', 'أدخل رمز الاستعادة الذي حفظته.'] };
    var FX_AR = { email_code: 'رمز التحقق عبر البريد الإلكتروني', whatsapp_code: 'رمز التحقق عبر واتساب', totp: 'تطبيق المصادقة', extra_code: 'الرقم الإضافي' };
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
      var h = FX_HINT[f] || ['PiShieldCheckFill', '']; $('#lv-hint').textContent = h[1]; $('#lv-dest-i').innerHTML = I(h[0]); $('#lv-dest-t').textContent = FX_AR[f] || '';
      var xc = f === 'extra_code'; $('#lv-otp').hidden = xc; $('#lv-xc-w').hidden = !xc; if (xc) $('#lv-code-w').hidden = false;
      var lab = $('#lv-code-w .pt-lab'); if (lab) lab.textContent = xc ? 'اكتب الرقم الإضافي الذي أنشأته (10 أرقام على الأقل)' : 'أدخل الرمز المكوّن من 6 أرقام';
    }
    function liveDeviceSubmit() {
      var D = S.dev, v = ynVal('lg-trust');
      if (!v) return msg('dev-msg', 'bad', 'اختر هل تصرّح لهذا الجهاز.');
      if (v === 'no') return liveIn();
      var pw = $('#lv-pw').value, f = $('#lv-fx').value, code = ascii(f === 'extra_code' ? $('#lv-xc').value : codeOf(LV_BOX)).replace(/\D/g, '');
      if (!pw) return msg('dev-msg', 'bad', 'أدخل كلمة المرور لتأكيد هويتك.');
      if (!code) return msg('dev-msg', 'bad', (f === 'email_code' || f === 'whatsapp_code') && !D.sent[f] ? 'أرسل رمز التحقق أولًا.' : 'أدخل رمز التحقق.');
      var b = $('#dev-go'); b.disabled = true; msg('dev-msg');
      authApi('POST', '/api/security/gateway/verify', { purpose: 'device_authorize', factor: f, code: code }).then(function (g) {
        if (!g || g.ok !== true || !g.grant_id) { b.disabled = false; clearBoxes(LV_BOX); return msg('dev-msg', 'bad', (g && g.message) || 'رمز التحقق غير صحيح أو انتهت صلاحيته.'); }
        var pay = { device_id: D.id, grant_id: g.grant_id, current_password: pw }; if (D.rep) pay.replace_id = D.rep;
        return authApi('POST', '/api/security/devices/authorize', pay).then(function (a) {
          b.disabled = false; $('#lv-pw').value = ''; clearBoxes(LV_BOX);
          if (a && a.ok === true) { S.inn = true; return liveDone('تم التصريح لهذا الجهاز', 'رُبطت جلستك بهذا الجهاز. ننقلك الآن إلى حسابك…'); }
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
        /* نفس هوية شاشة رمز التحقق: كلمة المرور بزر الإظهار، الوسيلة ووجهتها، خانات الرمز الست، والعدّاد */
        var why = function (ic, t, x) { return '<li>' + I(ic) + '<div><b>' + t + '</b><span>' + x + '</span></div></li>'; };
        var box = document.createElement('div'); box.id = 'lv-dev'; box.className = 'pt-f'; box.hidden = true;
        box.innerHTML = '<div class="ts-fld"><label for="lv-pw">كلمة المرور</label><span class="ts-pw"><input class="ts-in" id="lv-pw" type="password" dir="ltr" autocomplete="current-password" placeholder="••••••••">' +
            '<button type="button" class="ts-eye" id="lv-eye" aria-label="إظهار كلمة المرور">' + I('PiEyeFill') + '</button></span><span class="hint">لتأكيد هويتك قبل التصريح للجهاز.</span></div>' +
          '<div class="ts-fld"><label for="lv-fx">وسيلة التحقق</label><select class="ts-in" id="lv-fx"></select><span class="hint" id="lv-hint"></span></div>' +
          '<div class="ts-dest" id="lv-dest"><span id="lv-dest-i">' + I('PiEnvelopeSimpleFill') + '</span><span id="lv-dest-t"></span></div>' +
          '<button type="button" class="t2-btn" id="lv-send">أرسل الرمز</button>' +
          '<div id="lv-code-w" hidden class="pt-f"><span class="pt-lab">أدخل الرمز المكوّن من 6 أرقام</span><div class="ts-otp" id="lv-otp">' +
            [1, 2, 3, 4, 5, 6].map(function (k) { return '<input inputmode="numeric" maxlength="1" aria-label="الخانة ' + k + '">'; }).join('') + '</div>' +
            '<span class="ts-pw" id="lv-xc-w" hidden><input class="ts-in xc-in" id="lv-xc" type="password" dir="ltr" inputmode="numeric" autocomplete="off" maxlength="20" placeholder="••••••••••"></span>' +
            '<p class="ts-meta"><span>صلاحية الرمز <b dir="ltr">5:00</b></span><span id="lv-rs" hidden>إعادة الإرسال بعد <b id="lv-cd" dir="ltr">0:60</b></span></p></div>' +
          '<p class="ts-msg" id="lv-msg" hidden></p>' +
          '<div class="pt-why"><p class="pt-why-h">' + I('PiInfoFill') + '<b>ما معنى التصريح للجهاز؟</b></p><ul>' +
            why('PiTargetFill', 'لماذا التصريح؟', 'الجهاز المصرّح له يُعرف عند دخولك القادم، فلا تتكرر خطوات التوثيق مع بقاء حسابك محميًا.') +
            why('PiDevicesFill', 'حد الأجهزة', 'يحق لك التصريح لثلاثة أجهزة كحد أقصى. لإضافة جهاز رابع اختر جهازًا يُستبدل من القائمة أعلاه.') +
            why('PiShieldCheckFill', 'إلى متى؟', 'يبقى التصريح حتى تلغيه من مركز الأمان أو تغيّر كلمة المرور.') +
            why('PiWarningCircleFill', 'متى لا تصرّح؟', 'لا تصرّح لجهاز عام أو مشترك — اختر «هذه المرة فقط».') + '</ul></div>';
        ynT.insertAdjacentElement('afterend', box);
        LV_BOX = [].slice.call(box.querySelectorAll('#lv-otp input'));
        wireOtp(LV_BOX, function () { var g = $('#dev-go'); if (g && !g.disabled) g.click(); });
        $('#lv-eye').addEventListener('click', function () { var i = $('#lv-pw'), on = i.type === 'password'; i.type = on ? 'text' : 'password'; this.setAttribute('aria-label', on ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'); this.innerHTML = I(on ? 'PiEyeSlashFill' : 'PiEyeFill'); });
        $('#lv-fx').addEventListener('change', liveFxPaint);
        $('#lv-send').addEventListener('click', function () {
          var f = $('#lv-fx').value, b = this; b.disabled = true; b.textContent = 'جارٍ الإرسال…';
          authApi('POST', f === 'whatsapp_code' ? '/api/security/gateway/whatsapp' : '/api/security/gateway/email', { purpose: 'device_authorize' }).then(function (d) {
            if (!d || d.ok !== true) { b.disabled = false; b.textContent = 'أعد الإرسال'; return msg('lv-msg', 'bad', (d && d.message) || 'تعذّر إرسال الرمز.'); }
            S.dev.sent[f] = true; $('#lv-code-w').hidden = false; b.textContent = 'إعادة الإرسال'; msg('lv-msg', 'ok', d.sent === false ? 'الرمز السابق ما زال صالحًا.' : (f === 'whatsapp_code' ? 'أُرسل الرمز إلى واتساب.' : 'أُرسل الرمز إلى بريدك.'));
            var left = Number(d.retry_after_seconds) || 60, rs = $('#lv-rs'), cd = $('#lv-cd'); rs.hidden = false;
            clearInterval(LV_T); LV_T = setInterval(function () { left--; cd.textContent = '0:' + ('0' + Math.max(left, 0)).slice(-2); if (left <= 0) { clearInterval(LV_T); rs.hidden = true; b.disabled = false; } }, 1000);
            try { LV_BOX[0].focus(); } catch (e) {}
          });
        });
      }
      $$('small, span, p').forEach(function (x) { if (!x.children.length && /تختار مدة التصريح/.test(x.textContent)) x.textContent = 'يبقى التصريح حتى تلغيه من مركز الأمان، وتلغيه متى شئت.'; });
      var w1 = $('#f-fg1 .vc .vc-t b'); if (w1) w1.textContent = 'رمز عبر واتساب';
      $$('.pt-demo').forEach(function (x) { x.hidden = true; });
      var lg = $('.ts-legal'); if (lg) lg.textContent = 'باستخدامك البوابة توافق على سياسة الاستخدام وسياسة الخصوصية.';
      if (!document.getElementById('tqc-turnstile-js')) { var sc = document.createElement('script'); sc.id = 'tqc-turnstile-js'; sc.src = '/turnstile.js'; document.head.appendChild(sc); }
    }

    /* v357: تحقق إضافي بعملية جمع قبل: الدخول · بدء التسجيل · نسيت كلمة المرور (قبل إرسال الرمز) · رمز الاستعادة — صالح 10 دقائق لكل مسار */
    var MATH_AT = {}, MATH_FORMS = { 'f-login': ['login', 'تحقق إضافي قبل الدخول'], 'f-reg1': ['register', 'تحقق إضافي قبل إنشاء الحساب'], 'f-fg1': ['forgot', 'تحقق إضافي قبل استعادة الحساب'], 'f-rc1': ['recover', 'تحقق إضافي قبل استعادة الوصول'] };
    function mathGate(e, form, again) {
      var m = MATH_FORMS[form.id]; if (!UX2 || !m || !window.TeraNotify || !TeraNotify.math) return;
      if (MATH_AT[m[0]] && Date.now() - MATH_AT[m[0]] < 600000) return;
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      TeraNotify.math({ title: m[1] }).then(function (ok) { if (!ok) return; MATH_AT[m[0]] = Date.now(); again(); });
    }
    var PT = $('.pt');
    if (PT) {
      PT.addEventListener('submit', function (e) { var f = e.target; if (f && f.classList && f.classList.contains('pt-f')) mathGate(e, f, function () { if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event('submit', { cancelable: true })); }); }, true);
      PT.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#f-fg1 .vc-send'); if (b) mathGate(e, $('#f-fg1'), function () { b.click(); }); }, true);
    }
    if (UX2) $$('.pt-f').forEach(function (f) {
      f.addEventListener('submit', function () { var r = RUN_T[f.id]; if (r) TN.show({ kind: 'run', title: r[0], text: r[1] }); setTimeout(function () { var c = TN.current(); if (c && !c.closed && c.o.kind === 'run') c.close(); }, 15000); }, true);
    });
    /* v356: تذكّر البريد أو الجوال على هذا الجهاز (لا تُحفظ كلمة المرور، ويبقى التحقق مطلوبًا) */
    (function () {
      var RK = 'tera.remember.id', id = $('#lg-id'), rem = $('#lg-rem'), who = $('#lg-who'); if (!id || !rem) return;
      if (!UX2) { var rl = rem.closest('label'); if (rl) rl.hidden = true; if (who) who.hidden = true; return; } /* على المنفذين الحيّين بعد الاعتماد */
      function get() { try { return localStorage.getItem(RK) || ''; } catch (e) { return ''; } }
      function mask(v) { return v.indexOf('@') > 0 ? v.replace(/^(.{2}).*(.{2})@/, '$1•••$2@') : v.replace(/^(\+?\d{3,5}).*(\d{2})$/, '$1 ••• ••$2'); }
      function paint() { var v = get(); if (v && !id.value) id.value = v; rem.checked = !!v || rem.checked; if (who) { who.hidden = !v; var b = who.querySelector('b'); if (b) b.textContent = mask(v); } }
      if (who) who.querySelector('button').addEventListener('click', function () { try { localStorage.removeItem(RK); } catch (e) { void e; } id.value = ''; who.hidden = true; rem.checked = false; id.focus(); if (UX2) TN.show({ kind: 'ok', title: 'أُزيل بريدك من هذا الجهاز', text: 'سيُطلب البريد أو الجوال في الدخول القادم.' }); });
      $('#f-login').addEventListener('submit', function () { try { if (rem.checked && id.value.trim()) localStorage.setItem(RK, id.value.trim()); else if (!rem.checked) localStorage.removeItem(RK); } catch (e) { void e; } }, true);
      paint();
    })();

    reset();
  })();
})();
