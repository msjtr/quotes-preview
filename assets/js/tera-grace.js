/* tera-grace.js (v1157) — رابط «مهلة السداد» بهوية رابط طلبات العقود (crq.css):
   التحقق برمز ← اختيار الموعد ← التوقيع والإقرار ← الاعتماد ← تقييم الخدمة داخل الرابط (وإن لم يقيّم تصله الدعوة بعد 24 ساعة) */
(function () {
  'use strict';
  var app = document.getElementById('app');
  var TOK = (location.pathname.match(/\/api\/grace\/p\/([^/?#]+)/) || [])[1] || '';
  var GK = 'gr.g.' + TOK.slice(0, 16);
  var S = { info: null, v: null, grant: '', ch: '', sent: false, busy: false, err: '', errAt: '', day: '', step: 1, sName: '', sImg: '', ack: false, fm: '' };
  try { S.grant = sessionStorage.getItem(GK) || ''; S.ch = sessionStorage.getItem(GK + '.c') || ''; } catch (e) { void e; }
  var NS = 'http://www.w3.org/2000/svg';
  var IC = { check: 'M5 12.5l4.5 4.5L19 7.5', shield: 'M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3zM9 12l2 2 4-4', chat: 'M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6', alert: 'M12 7.5v6M12 16.6v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    doc: 'M14 3H6v18h12V7l-4-4zM14 3v4h4M9 13h6M9 17h6', pen: 'M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3', star: 'M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z' };
  function icon(n, big) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'cq-ic' + (big ? ' is-big' : '')); var p = document.createElementNS(NS, 'path'); p.setAttribute('d', IC[n]); s.appendChild(p); return s; }
  function el(tag, a, kids) {
    var n = document.createElement(tag);
    Object.keys(a || {}).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v); else if (k === 'value') n.value = v; else if (k === 'checked') n.checked = !!v; else n.setAttribute(k, v === true ? '' : v); });
    (kids || []).forEach(function (c) { if (c == null || c === false) return; n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function tile(n, c) { return el('span', { class: 'cq-tile' + (c ? ' is-' + c : '') }, [icon(n)]); }
  function card(kids, cls) { return el('section', { class: 'cq-card' + (cls ? ' ' + cls : '') }, kids); }
  function box(title, n, kids, c) { return el('section', { class: 'cq-card cq-box' }, [el('div', { class: 'cq-bh' }, [tile(n, c), el('b', { text: title })]), el('div', { class: 'cq-bb' }, kids)]); }
  function money(x) { var n = Math.round((Number(x) || 0) * 100) / 100; return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function day(d) { if (!d) return '—'; try { return new Date(String(d).slice(0, 10) + 'T00:00:00Z').toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return String(d); } }
  function when(t) { try { return new Date(t).toLocaleString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' }); } catch (e) { return String(t); } }
  function dayTxt(n) { n = Number(n) || 0; return n === 1 ? 'يوم واحد' : n === 2 ? 'يومين' : n <= 10 ? n + ' أيام' : n + ' يومًا'; }
  var STEPS = ['التحقق', 'الدفعة والموعد', 'الإقرار والتوقيع', 'الاعتماد'];
  function steps(at) {
    var out = [];
    STEPS.forEach(function (l, i) { if (i) out.push(el('span', { class: 'cq-sep' + (i <= at ? ' is-dn' : '') })); out.push(el('div', { class: 'cq-st' + (i < at ? ' is-dn' : i === at ? ' is-on' : ''), 'aria-current': i === at ? 'step' : null }, [el('i', { text: i < at ? '✓' : String(i + 1) }), el('b', { text: l })])); });
    return el('div', { class: 'cq-steps', role: 'list', 'aria-label': 'المراحل' }, out);
  }
  function paint(nodes, center) { app.innerHTML = ''; app.className = 'cq-main' + (center ? ' is-center' : ''); nodes.forEach(function (n) { if (n) app.appendChild(n); }); window.scrollTo(0, 0); }
  function done(ok, title, text, btn) { paint([card([icon(ok ? 'check' : 'alert', true), el('h1', { class: 'cq-h1', text: title }), el('p', { class: 'cq-muted', text: text }), btn ? el('div', { class: 'cq-btns is-one' }, [btn]) : null], 'cq-done' + (ok ? '' : ' is-off'))], true); }
  /* v1175: المهلة مجانية أو برسوم — الرسوم يحددها فريق تيرا، والعميل يختار طريقة إضافتها */
  function feeTot() { var t = (S.v && S.v.fee_total) || (S.info && S.info.fee_total); return Number(t) || 0; }
  function free() {
    var t = feeTot();
    if (t > 0) return el('div', { class: 'gr-free is-fee', role: 'note' }, [icon('doc'), el('span', {}, [el('b', { text: 'رسوم المهلة ' + money(t) + ' ريال' }), ' — شاملة ضريبة القيمة المضافة، وتختار طريقة إضافتها.'])]);
    return el('div', { class: 'gr-free', role: 'note' }, [icon('check'), el('span', {}, [el('b', { text: 'خدمة مجانية لعملائنا' }), ' — لا تُحتسب أي رسوم على المهلة.'])]);
  }
  function kvT(rows) { return el('table', { class: 'cq-kv' }, [el('tbody', {}, rows.filter(Boolean).map(function (r) { return el('tr', {}, [el('th', { text: r[0] }), el('td', {}, [el('bdi', { text: r[1] })])]); }))]); }
  function planT(P) {
    return el('div', { class: 'gr-plan' }, [el('table', { class: 'gr-pt' }, [el('thead', {}, [el('tr', {}, ['الدفعة', 'الموعد', 'قبل', 'الإضافة', 'بعد'].map(function (h) { return el('th', { text: h }); }))]),
      el('tbody', {}, P.map(function (x) { return el('tr', { class: x.self ? 'is-self' : null }, [el('td', { text: String(x.seq) }), el('td', { text: x.due_t }), el('td', { text: money(x.before) }), el('td', { class: 'is-add', text: '+' + money(x.add) }), el('td', {}, [el('b', { text: money(x.after) })])]); }))])]);
  }
  function feeBox(v) {
    var opts = [['same', 'على هذه الدفعة', 'تُضاف الرسوم كاملة على الدفعة ' + v.seq + '.', v.plan_same], ['spread', 'توزيعها على باقي الدفعات', v.plan_spread ? 'تُقسَّم على ' + v.plan_spread.length + (v.plan_spread.length > 2 ? ' دفعات' : ' دفعة') + ' متبقية.' : 'لا توجد دفعات متبقية غير هذه.', v.plan_spread]];
    var ch = el('div', { class: 'gr-fm' + (S.errAt === 'fee' ? ' is-err' : ''), role: 'radiogroup', 'aria-label': 'طريقة إضافة الرسوم' }, opts.map(function (o) {
      var on = S.fm === o[0], dis = !o[3];
      return el('button', { type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: on ? 'is-on' : '', disabled: dis, onclick: function () { S.fm = o[0]; S.err = ''; S.errAt = ''; form(); } }, [el('b', { text: o[1] }), el('small', { text: o[2] })]);
    }));
    var P = S.fm === 'same' ? v.plan_same : S.fm === 'spread' ? v.plan_spread : null;
    return box('رسوم المهلة وطريقة إضافتها', 'doc', [kvT([['رسوم المهلة', money(v.fee) + ' ريال'], ['ضريبة القيمة المضافة 15%', money(v.vat) + ' ريال'], ['الإجمالي', money(v.fee_total) + ' ريال']]),
      el('p', { class: 'gr-note', style: 'margin:12px 0 8px', text: 'كيف تريد إضافة الرسوم؟' }), ch, ferr('fee'), P ? el('p', { class: 'gr-note', style: 'margin:12px 0 6px', text: 'دفعاتك قبل وبعد إضافة الرسوم:' }) : null, P ? planT(P) : null], 'gd');
  }
  function acctBox(v) {
    var a = v.acct; if (!a) return null;
    return box('ملخص حسابك', 'doc', [kvT([['العقد', v.contract_no], a.total != null ? ['إجمالي العقد', money(a.total) + ' ريال'] : null, ['المدفوع', money(a.paid) + ' ريال'], ['المتبقي', money(a.left) + ' ريال'],
      ['الدفعات', 'سُدد ' + a.paid_n + ' من ' + a.count], Number(a.late_n) > 0 ? ['دفعات متأخرة', String(a.late_n)] : null])], 'nv');
  }
  function ferr(k) { return S.errAt === k && S.err ? el('p', { class: 'cq-ferr', role: 'alert', text: S.err }) : null; }
  function payBtn(href) { return href ? el('a', { class: 'pri', href: href, style: 'display:flex;align-items:center;justify-content:center;text-decoration:none' }, ['ادفع الآن']) : null; }
  function msgOf(j, d) { return (j && (j.message || (j.errors && j.errors[0]))) || d || 'تعذّر تنفيذ الطلب.'; }
  async function api(path, body) {
    var r = await fetch('/api/grace/p/' + TOK + '/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body || {}), cache: 'no-store' });
    var j = null; try { j = await r.json(); } catch (e) { j = null; }
    if (r.status === 410 && j) { done(false, 'الرابط غير متاح', j.message || ''); throw new Error('gone'); }
    if (r.status === 401) { S.grant = ''; try { sessionStorage.removeItem(GK); } catch (e) { void e; } verifyPage(); throw new Error('verify'); }
    return j || { ok: false, message: 'تعذّر الاتصال الآن. حاول مرة أخرى.' };
  }

  /* ── البداية ── */
  async function start() {
    var j; try { j = await api('info'); } catch (e) { return; }
    if (!j || !j.ok) { done(false, 'تعذّر فتح الرابط', msgOf(j)); return; }
    S.info = j;
    if (j.state === 'done') return donePage(j);
    if (j.state === 'link_expired') return done(false, 'انتهت صلاحية الرابط', 'اطلب رابطًا جديدًا من فريق تيرا، أو ادفع الدفعة الآن.', payBtn(j.pay));
    if (j.state === 'paid') return done(true, 'تم سداد هذه الدفعة', 'لا حاجة لأي إجراء. شكرًا لك.');
    if (j.state === 'off') return done(false, 'الخدمة غير متاحة الآن', 'تواصل مع فريق تيرا من حسابك إن احتجت مهلة.', payBtn(j.pay));
    if (j.state === 'early') return done(false, 'موعد دفعتك لم يقترب بعد', 'تتاح المهلة قبل الاستحقاق بـ' + dayTxt(j.window) + '. موعد دفعتك ' + day(j.due) + '.', payBtn(j.pay));
    if (S.grant) return load();
    verifyPage();
  }

  /* ── 1) التحقق برمز ── */
  function verifyPage() {
    var I = S.info || {};
    var head = [el('div', { class: 'cq-vh' }, [tile('shield', 'nv'), el('h1', { class: 'cq-h1', text: 'طلب مهلة سداد' })]),
      el('span', { class: 'cq-no', text: 'الدفعة ' + I.seq + (I.n ? ' من ' + I.n : '') + ' · ' + (I.contract_no || '') }),
      el('p', { class: 'cq-muted', text: (I.name ? 'أهلًا ' + I.name + '، ' : '') + 'للحفاظ على خصوصيتك نرسل رمز تحقق إلى وسيلتك المسجلة قبل عرض دفعتك.' }),
      I.link_expires ? el('p', { class: 'gr-note', text: 'الرابط صالح حتى ' + when(I.link_expires) }) : null];
    if (!S.sent) {
      var F = I.factors || [];
      var ch = el('div', { class: 'cq-ch' }, F.map(function (f) {
        return el('button', { type: 'button', disabled: S.busy, onclick: function () { send(f); } }, [icon(f === 'whatsapp' ? 'chat' : 'mail'), (f === 'whatsapp' ? 'أرسل الرمز إلى واتساب ' : 'أرسل الرمز إلى البريد ') + ((I.masked || {})[f] || '')]);
      }));
      paint([steps(0), free(), card(head.concat([F.length ? ch : el('p', { class: 'cq-err', text: 'لا توجد وسيلة تحقق مرتبطة بحسابك. تواصل مع فريق تيرا.' }), S.err ? el('p', { class: 'cq-err', text: S.err }) : null]))]);
      return;
    }
    var inp = el('input', { class: 'cq-code', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '6', 'aria-label': 'رمز التحقق' });
    paint([steps(0), card(head.concat([el('p', { text: 'أدخل الرمز المرسل إلى ' + (((I.masked || {})[S.ch]) || '') }), inp, S.err ? el('p', { class: 'cq-err', text: S.err }) : null,
      el('div', { class: 'cq-btns' }, [el('button', { type: 'button', class: 'pri', disabled: S.busy, onclick: function () { verify(inp.value); } }, ['تحقق']),
        el('button', { type: 'button', onclick: function () { S.sent = false; S.err = ''; verifyPage(); } }, ['وسيلة أخرى'])])]))]);
    inp.focus();
  }
  async function send(ch) {
    if (S.busy) return; S.busy = true; S.err = ''; S.ch = ch; verifyPage();
    try { var j = await api('send', { channel: ch }); S.busy = false; if (j.ok || j.code === 'RESEND_TOO_SOON') { S.sent = true; if (!j.ok) S.err = msgOf(j); } else S.err = msgOf(j, 'تعذّر إرسال الرمز.'); verifyPage(); } catch (e) { S.busy = false; }
  }
  async function verify(code) {
    if (S.busy) return;
    if (!/^\d{6}$/.test(String(code || '').trim())) { S.err = 'أدخل الرمز المكوّن من 6 أرقام.'; verifyPage(); return; }
    S.busy = true; S.err = '';
    try {
      var j = await api('verify', { channel: S.ch, code: String(code).trim() }); S.busy = false;
      if (!j.ok) { S.err = msgOf(j, 'الرمز غير صحيح.'); verifyPage(); return; }
      S.grant = j.grant; try { sessionStorage.setItem(GK, j.grant); sessionStorage.setItem(GK + '.c', S.ch); } catch (e) { void e; }
      load();
    } catch (e) { S.busy = false; }
  }

  /* ── 2) الموعد والتوقيع ── */
  async function load() {
    var j; try { j = await api('view', { grant: S.grant }); } catch (e) { return; }
    if (!j.ok) { done(false, 'تعذّر عرض الدفعة', msgOf(j)); return; }
    S.v = j.view; form();
  }
  function form() {
    var v = S.v;
    if (S.step === 2) return signStep();
    var kv = el('table', { class: 'cq-kv' }, [el('tbody', {}, [
      ['العقد', v.contract_no], ['الدفعة', 'الدفعة ' + v.seq + (v.n ? ' من ' + v.n : '')], ['قيمة الدفعة', money(v.left) + ' ريال'], ['تاريخ الاستحقاق', v.due_t]
    ].concat(Number(v.late) > 0 ? [['الحالة', 'متأخرة ' + dayTxt(v.late)]] : []).map(function (r) { return el('tr', {}, [el('th', { text: r[0] }), el('td', {}, [el('bdi', { text: r[1] })])]); }))]);
    var days = el('div', { class: 'gr-days' + (S.errAt === 'day' ? ' is-err' : ''), role: 'group', 'aria-label': 'المواعيد المتاحة' }, v.days.map(function (d, i) {
      return el('button', { type: 'button', class: S.day === d.d ? 'is-on' : '', 'aria-pressed': S.day === d.d ? 'true' : 'false', onclick: function () { S.day = d.d; S.err = ''; S.errAt = ''; form(); } },
        [el('small', { text: d.w }), el('b', { text: d.t }), el('small', { text: 'مهلة ' + dayTxt(i + 1) })]);
    }));
    var next = el('button', { type: 'button', class: 'pri', onclick: function () { if (!S.day) { S.err = 'اختر موعد السداد الجديد من المواعيد أعلاه.'; S.errAt = 'day'; form(); return; } if (feeTot() > 0 && !S.fm) { S.err = 'اختر طريقة إضافة رسوم المهلة.'; S.errAt = 'fee'; form(); return; } S.err = ''; S.errAt = ''; S.step = 2; form(); } }, ['التالي: الإقرار والتوقيع']);
    paint([steps(1), free(), acctBox(v),
      box('دفعتك', 'doc', [kv], 'nv'),
      box('اختر موعد السداد الجديد', 'clock', [days, ferr('day'), el('p', { class: 'gr-note', text: 'بناءً على طلبك: مهلة حتى ' + dayTxt(v.max_days) + '، ومرة واحدة لهذه الدفعة. تاريخ الاستحقاق في العقد لا يتغيّر.' })], 'gd'),
      feeTot() > 0 ? feeBox(v) : null,
      card([el('div', { class: 'cq-btns is-one' }, [next])])]);
    var f0 = S.errAt ? app.querySelector('.cq-ferr') : null; if (f0 && f0.scrollIntoView) f0.scrollIntoView({ block: 'center' });
  }
  function signStep() {
    var v = S.v, dd = (v.days.filter(function (d) { return d.d === S.day; })[0] || {});
    var P = feeTot() > 0 ? (S.fm === 'same' ? v.plan_same : v.plan_spread) : null;
    var sum = kvT([['الدفعة', 'الدفعة ' + v.seq + (v.n ? ' من ' + v.n : '') + ' · ' + v.contract_no], ['قيمة الدفعة', money(v.left) + ' ريال'], ['الاستحقاق الأصلي', v.due_t], ['موعد السداد الجديد', day(S.day)],
      P ? ['رسوم المهلة', money(v.fee_total) + ' ريال شاملة الضريبة'] : null, P ? ['طريقة إضافتها', S.fm === 'same' ? 'على هذه الدفعة' : 'موزعة على باقي الدفعات'] : null]);
    var cb = el('input', { type: 'checkbox', checked: S.ack, onchange: function (e) { S.ack = e.target.checked; if (S.errAt === 'ack') { S.err = ''; S.errAt = ''; lab.className = 'cq-ack'; var f = lab.nextSibling; if (f && f.className === 'cq-ferr') f.remove(); } } });
    var lab = el('label', { class: 'cq-ack' + (S.errAt === 'ack' ? ' is-err' : '') }, [cb, el('span', { text: v.ack })]);
    var pad = el('div', {}, [el('canvas', { class: 'cq-pad' + (S.errAt === 'pad' ? ' is-err' : ''), id: 'gr-pad', 'aria-label': 'مكان التوقيع' }),
      el('button', { type: 'button', class: 'lnk', onclick: function () { S.sImg = ''; setupPad(true); } }, ['مسح التوقيع'])]);
    var nm = el('input', { type: 'text', value: S.sName, placeholder: 'اكتب اسمك الكامل', 'aria-label': 'اسمك الكامل', class: S.errAt === 'name' ? 'is-err' : null,
      style: 'width:100%;font:inherit;min-height:48px;border:1px solid ' + (S.errAt === 'name' ? 'var(--red)' : '#D5DBE8') + ';border-radius:12px;padding:8px 12px', oninput: function (e) { S.sName = e.target.value; } });
    var go = el('button', { type: 'button', class: 'pri', disabled: S.busy, onclick: submit }, [S.busy ? 'جارٍ الاعتماد…' : 'اعتماد المهلة']);
    var back = el('button', { type: 'button', disabled: S.busy, onclick: function () { S.step = 1; S.err = ''; S.errAt = ''; form(); } }, ['رجوع لتغيير الموعد']);
    paint([steps(2), free(),
      box('ملخص طلبك', 'doc', [sum, dd.w ? el('p', { class: 'gr-note', text: 'يوم ' + dd.w + ' · مهلة ' + dayTxt(v.days.indexOf(dd) + 1) }) : null, P ? planT(P) : null], 'nv'),
      box('الإقرار', 'shield', [lab, ferr('ack')], 'nv'),
      box('التوقيع', 'pen', [el('p', { class: 'gr-note', style: 'margin:0 0 8px', text: 'وقّع داخل المربع، ثم اكتب اسمك تحته.' }), pad, ferr('pad'), el('div', { style: 'margin-top:10px' }, [nm, ferr('name')])], 'gd'),
      card([S.errAt === 'srv' ? el('p', { class: 'cq-err', role: 'alert', text: S.err }) : null, el('div', { class: 'cq-btns' }, [go, back])])]);
    setupPad(false);
    var f = app.querySelector('.cq-ferr, .cq-err'); if (f && f.scrollIntoView) f.scrollIntoView({ block: 'center' });
  }
  function setupPad(clear) {
    var c = document.getElementById('gr-pad'); if (!c) return;
    var r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; c.width = r.width * dpr; c.height = r.height * dpr;
    var x = c.getContext('2d'); x.scale(dpr, dpr); x.lineWidth = 2.4; x.lineCap = 'round'; x.strokeStyle = '#0B2552';
    if (S.sImg && !clear) { var im = new Image(); im.onload = function () { x.drawImage(im, 0, 0, r.width, r.height); }; im.src = S.sImg; }
    var on = false, any = !!S.sImg && !clear;
    function pt(e) { var b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
    c.onpointerdown = function (e) { on = true; try { c.setPointerCapture(e.pointerId); } catch (er) { void er; } var p = pt(e); x.beginPath(); x.moveTo(p[0], p[1]); e.preventDefault(); };
    c.onpointermove = function (e) { if (!on) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); any = true; e.preventDefault(); };
    c.onpointerup = c.onpointercancel = function () { on = false; if (any) S.sImg = c.toDataURL('image/png'); };
    c.style.touchAction = 'none';
  }
  async function submit() {
    if (S.busy) return;
    if (!S.ack) { S.err = 'وافق على الإقرار قبل الاعتماد.'; S.errAt = 'ack'; form(); return; }
    if (!S.sImg) { S.err = 'وقّع داخل المربع.'; S.errAt = 'pad'; form(); return; }
    if (S.sName.trim().length < 3) { S.err = 'اكتب اسمك الكامل تحت التوقيع.'; S.errAt = 'name'; form(); return; }
    S.busy = true; S.err = ''; S.errAt = ''; form();
    try {
      var j = await api('sign', { grant: S.grant, until: S.day, kind: 'draw', name: S.sName.trim(), img: S.sImg, ack: true, factor: S.ch, fee_mode: feeTot() > 0 ? S.fm : null });
      S.busy = false;
      if (!j.ok) { S.err = msgOf(j, 'تعذّر اعتماد المهلة.'); S.errAt = j.error === 'bad_date' ? 'day' : j.error === 'bad_fee_mode' ? 'fee' : j.error === 'bad_ack' ? 'ack' : j.error === 'bad_sign' ? 'pad' : j.error === 'bad_name' ? 'name' : 'srv'; if (S.errAt === 'day' || S.errAt === 'fee') S.step = 1; form(); return; }
      donePage({ until: j.until, ref_no: j.ref_no, pay: j.pay, survey: j.survey, status: 'active', fresh: true, fee_total: j.fee_total, fee_mode: j.fee_mode });
    } catch (e) { S.busy = false; }
  }

  /* ── 3) الاعتماد والتقييم ── */
  function donePage(j) {
    var st = j.status, broken = st === 'broken';
    var en = document.getElementById('cq-en'); if (en) en.textContent = broken ? 'GRACE ENDED' : 'GRACE APPROVED';
    var main = broken
      ? card([icon('alert', true), el('h1', { class: 'cq-h1', text: 'انتهت مهلة هذه الدفعة' }), el('p', { class: 'cq-muted', text: 'انتهت مهلتك يوم ' + day(j.until) + ' ولم تُسدَّد الدفعة. ادفعها الآن.' }), el('div', { class: 'cq-btns is-one' }, [payBtn(j.pay)])], 'cq-done is-off')
      : card([icon('check', true), el('h1', { class: 'cq-h1', text: 'تم اعتماد مهلة السداد' }),
          el('p', { class: 'cq-muted', text: 'موعد السداد الجديد بناءً على طلبك: ' + day(j.until) + '.' }),
          el('span', { class: 'cq-no', text: 'رقم المرجع ' + (j.ref_no || '') }),
          Number(j.fee_total) > 0 ? el('p', { class: 'cq-muted', text: 'أُضيفت رسوم المهلة ' + money(j.fee_total) + ' ريال ' + (j.fee_mode === 'same' ? 'على هذه الدفعة.' : 'موزعة على باقي دفعاتك.') }) : null,
          el('p', { class: 'cq-muted', text: j.fresh ? 'وصلتك رسالة التأكيد، ونذكّرك قبل الموعد. يمكنك السداد في أي وقت قبله.' : 'نذكّرك قبل الموعد. يمكنك السداد في أي وقت قبله.' }),
          el('div', { class: 'cq-btns is-one' }, [payBtn(j.pay)])], 'cq-done');
    var sv = j.survey, rc = null;
    if (sv && sv.status === 'answered') rc = thanks();
    else if (sv && Array.isArray(sv.q) && sv.q.length && !broken) rc = rateBox(sv.q);
    paint([broken ? null : steps(3), main, rc], true);
  }
  function thanks() { return card([icon('star', true), el('h2', { class: 'cq-h2', text: 'شكرًا لتقييمك' }), el('p', { class: 'cq-muted', text: 'رأيك يساعدنا على تحسين خدماتنا.' })], 'cq-done'); }
  function rateBox(Q) {
    var A = {}, L5 = ['ضعيف', 'مقبول', 'جيد', 'جيد جدًا', 'ممتاز'], err = el('p', { class: 'cq-err', hidden: true }), sent = false;
    var qs = Q.map(function (q, qi) {
      var opts = q.type === 'nps10' ? Array.apply(null, Array(11)).map(function (_, i) { return [String(i), '']; }) : q.type === 'yesno' ? [['yes', 'نعم'], ['no', 'لا']] : q.type === 'scale5' ? L5.map(function (l, i) { return [String(i + 1), l]; }) : null;
      var body;
      if (opts) {
        var bs = opts.map(function (o) { return el('button', { type: 'button', 'aria-pressed': 'false', onclick: function () { A[q.k] = o[0]; bs.forEach(function (b, bi) { var on = opts[bi][0] === o[0]; b.className = on ? 'is-on' : ''; b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); err.hidden = true; } }, [el('b', { text: q.type === 'yesno' ? o[1] : o[0] }), q.type === 'scale5' ? o[1] : null]); });
        body = el('div', { class: 'cq-sc' + (q.type === 'nps10' ? ' is-11' : q.type === 'yesno' ? ' is-2' : ''), role: 'group', 'aria-label': q.t }, bs);
      } else body = el('textarea', { 'aria-label': q.t, oninput: function (e) { A[q.k] = e.target.value; } });
      return el('div', { class: 'cq-q' }, [el('p', {}, [el('i', { text: String(qi + 1) }), q.t]), body]);
    });
    var cm = el('textarea', { placeholder: 'ملاحظاتك (اختياري)', 'aria-label': 'ملاحظاتك' });
    var btn = el('button', { type: 'button', class: 'pri', onclick: async function () {
      if (sent) return;
      var miss = Q.filter(function (q) { return q.type !== 'text' && !A[q.k]; });
      if (miss.length) { err.textContent = 'أجب عن كل الأسئلة.'; err.hidden = false; return; }
      sent = true; btn.disabled = true; btn.textContent = 'جارٍ الإرسال…';
      try {
        var j = await api('survey', { answers: A, comment: cm.value });
        if (!j || !j.ok) { sent = false; btn.disabled = false; btn.textContent = 'إرسال التقييم'; err.textContent = msgOf(j, 'تعذّر حفظ التقييم.'); err.hidden = false; return; }
        wrap.replaceWith(thanks());
      } catch (e) { sent = false; btn.disabled = false; btn.textContent = 'إرسال التقييم'; }
    } }, ['إرسال التقييم']);
    var wrap = el('section', { class: 'cq-card cq-rate cq-sv' }, [el('div', { class: 'cq-rate-h' }, [tile('star', 'gd'), el('div', {}, [el('b', { text: 'قيّم تجربتك مع خدمة مهلة السداد' }), el('p', { class: 'cq-muted', text: 'أسئلة سريعة، والملاحظات اختيارية.' })])]),
      el('div', {}, qs), cm, err, btn, el('p', { class: 'cq-sv-hint', text: 'إن لم تُكمل التقييم الآن تصلك الاستمارة نفسها بعد 24 ساعة.' })]);
    return wrap;
  }

  start();
})();
