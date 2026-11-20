/* v861 — منظومة طلبات العقود (crq_) — حساب العميل: «طلب تأجيل دفعة»
* بناء جديد يحلّ محل صفحة التأجيل القديمة: اختيار العقد والدفعة ← الإرسال ← يصلك العرض للموافقة برابط ← ثم الملحق للتوقيع.
* لا يُنشأ عقد تأجيل جديد: الملحق يعدّل عقدك نفسه بعد توقيعك. والمنصة تعطي رمز الجلسة ومكان الصفحة فقط.
* v909: الدفعات المتأخرة بالأحمر والقريبة بالبرتقالي، والدفعة الموجودة في طلب قائم مقفلة حتى يُغلق أو يُنفَّذ، و«اقتراحك» (المدة وطريقة السداد).
*       الجزء نفسه (CRQC.picker) يستعمله الفريق عند إنشاء الطلب من المنصة الجديدة — الشكل والمحتوى واحد.
* v913: «مطلوب منك» والمراسلة مع الفريق داخل كل طلب، وتفاصيل الملحق (القيمة قبل وبعد وما تغيّر)، وأجزاء الفريق (المراسلات · طلب الاستكمال · ملف العميل · الردود الجاهزة). */
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg';
var IC = { check: 'M5 12.5l4.5 4.5L19 7.5', clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', alert: 'M12 7.5v6M12 16.6v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1', lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z' };
function icon(n) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'cc-ic'); var p = document.createElementNS(NS, 'path'); p.setAttribute('d', IC[n]); s.appendChild(p); return s; }
function el(tag, a, kids) {
var n = document.createElement(tag);
Object.keys(a || {}).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v); else if (k === 'value') n.value = v; else if (k === 'checked') n.checked = !!v; else if (k === 'selected') n.selected = !!v; else n.setAttribute(k, v === true ? '' : v); });
(kids || []).forEach(function (c) { if (c == null || c === false) return; n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
return n;
}
function money(x) { var n = Math.round((Number(x) || 0) * 100) / 100; return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function day(d) { try { return new Date(String(d).slice(0, 10) + 'T00:00:00Z').toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return String(d || ''); } }
var WHY = [['', '— اختر السبب —'], ['تأخر الراتب أو الدخل', 'تأخر الراتب أو الدخل'], ['ظرف طارئ', 'ظرف طارئ'], ['سفر', 'سفر'], ['ظرف صحي', 'ظرف صحي'], ['other', 'سبب آخر']];
var STEPS = ['اختيار الدفعة', 'مراجعة فريق تيرا', 'موافقتك على العرض', 'توقيع الملحق', 'تعديل عقدك'];
var STEP_OF = { received: 1, decision: 1, consent: 2, sign: 3, done: 5, closed: -1 };
var MAXP = 6;
/* v909: اقتراح العميل */
var MONTHS = [['1', 'شهر'], ['2', 'شهران'], ['3', '3 أشهر'], ['6', '6 أشهر'], ['date', 'تاريخ محدد']];
var METHOD = [['end', 'في نهاية العقد'], ['spread', 'توزيعها على الدفعات القادمة'], ['team', 'يحدده الفريق']];
var MONTH_T = { 1: 'شهرًا', 2: 'شهرين', 3: '3 أشهر', 6: '6 أشهر' };

/* ===== أيام التأخر ===== */
function ymd(d) { return String(d || '').slice(0, 10); }
function todayIso(t) { if (t) return ymd(t); var n = new Date(); return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0'); }
function diffDays(a, b) { return Math.round((Date.parse(ymd(b) + 'T00:00:00Z') - Date.parse(ymd(a) + 'T00:00:00Z')) / 86400000); }
function daysW(n) { return n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? n + ' أيام' : n + ' يومًا'; }
function cntW(n, s, d) { return n === 1 ? 'دفعة واحدة ' + s : n === 2 ? 'دفعتان ' + d : n <= 10 ? n + ' دفعات ' + s : n + ' دفعة ' + s; }
function payN(n) { return n === 1 ? 'دفعة واحدة' : n === 2 ? 'دفعتان' : n <= 10 ? n + ' دفعات' : n + ' دفعة'; }
function stateOf(p, today) {
if (p.busy) return { k: 'busy', t: 'في طلب قائم ' + p.busy };
var d = diffDays(p.due, today);
/* v912: المسدَّدة جزئيًا — تُحسب متأخرة كما في «توحيد العقود» وصفحة العقد، ومقفلة: يُسدَّد متبقّيها ولا تُؤجَّل */
if (p.part) return { k: d > 0 ? 'late' : 'open', lock: true, t: d > 0 ? 'متأخرة ' + daysW(d) + ' — مدفوعة جزئيًا' : 'مدفوعة جزئيًا' };
if (d > 0) return { k: 'late', d: d, t: 'متأخرة ' + daysW(d) };
if (d > -30) return { k: 'soon', t: d === 0 ? 'تستحق اليوم' : 'تستحق بعد ' + daysW(-d) };
return { k: 'open', t: 'قادمة' };
}
function lateOf(c, today) {
var L = (c && c.payments || []).filter(function (p) { return diffDays(p.due, today) > 0; });
return { n: L.length, sum: L.reduce(function (a, p) { return a + (Number(p.part ? p.left : p.amount) || 0); }, 0) };
}
function seqList(L) { var s = L.map(function (p) { return String(p.seq); }); return s.length <= 1 ? s.join('') : s.slice(0, -1).join(' و') + ' و' + s[s.length - 1]; }
function propText(pr) {
if (!pr) return '';
var a = [];
if (pr.months) a.push('مدة التأجيل: ' + (MONTH_T[pr.months] || pr.months + ' أشهر'));
if (pr.date) a.push('حتى ' + day(pr.date));
var m = METHOD.filter(function (x) { return x[0] === pr.method; })[0];
if (m) a.push('السداد: ' + m[1]);
return a.join(' · ');
}
function check(S) {
var m = [];
if (!S.pids || !S.pids.length) m.push('pids');
if (!S.months) m.push('months'); else if (S.months === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(String(S.date || ''))) m.push('date');
if (!S.why) m.push('why'); if (S.why === 'other' && String(S.other || '').trim().length < 3) m.push('other');
return m;
}
function payload(S) {
var why = S.why === 'other' ? String(S.other || '').trim() : S.why, nt = String(S.note || '').trim();
var prop = { method: S.method || 'end' }; if (S.months === 'date') prop.date = S.date; else prop.months = S.months;
return { payment_ids: (S.pids || []).slice(0, MAXP), note: why + (nt ? ' — ' + nt : ''), prop: prop };
}

/* ===== الجزء المشترك (العميل والفريق): الدفعات + اقتراحك ===== */
function picker(o) {
var S = o.S, c = o.contract, today = todayIso(o.today), paint = o.paint || function () {};
if (!S.method) S.method = 'end';
S.miss = S.miss || [];
var pays = (c && c.payments || []).slice().sort(function (a, b) { return ymd(a.due) < ymd(b.due) ? -1 : ymd(a.due) > ymd(b.due) ? 1 : a.seq - b.seq; });
S.pids = (S.pids || []).filter(function (id) { return pays.some(function (p) { return p.pid === id && !p.busy && !p.part; }); });
var lt = lateOf(c, today), sel = pays.filter(function (p) { return S.pids.indexOf(p.pid) >= 0; });
var out = [];
if (lt.n) out.push(el('div', { class: 'cc-top' }, [icon('alert'), el('span', {}, ['على هذا العقد ', el('b', { text: cntW(lt.n, 'متأخرة', 'متأخرتان') }), ' بقيمة ', el('b', {}, [el('bdi', { dir: 'ltr', text: money(lt.sum) }), ' ريال']), '.'])]));
out.push(el('div', { class: 'cc-legend', 'aria-hidden': 'true' }, [['late', 'متأخرة'], ['soon', 'تستحق قريبًا'], ['open', 'قادمة'], ['busy', 'في طلب قائم']].map(function (x) { return el('span', {}, [el('i', { class: 'is-' + x[0] }), x[1]]); })));
out.push(el('div', { class: 'cc-sh is-a' + (S.miss.indexOf('pids') >= 0 ? ' is-miss' : '') }, [el('b', { text: '١. الدفعة المراد تأجيلها' }), el('span', { text: (sel.length ? cntW(sel.length, 'محددة', 'محددتان') : 'لم تُحدَّد') + ' · حتى ' + MAXP })]));
out.push(el('div', { class: 'cc-pays' + (S.miss.indexOf('pids') >= 0 ? ' is-miss' : ''), role: 'group', 'aria-label': 'الدفعات' }, pays.length ? pays.map(function (p) {
var st = stateOf(p, today), on = S.pids.indexOf(p.pid) >= 0, full = !on && S.pids.length >= MAXP;
var ctl = st.k === 'busy' || st.lock ? el('span', { class: 'cc-lock', title: st.lock ? 'مدفوعة جزئيًا — يُسدَّد متبقّيها من صفحة الدفعات، ولا تُؤجَّل' : 'لا يمكن اختيارها حتى يُغلق الطلب ' + p.busy + ' أو يُنفَّذ' }, [icon('lock')])
: el('input', { type: 'checkbox', checked: on, disabled: full, 'aria-label': 'الدفعة ' + p.seq, onchange: function (e) { S.pids = S.pids.filter(function (x) { return x !== p.pid; }); if (e.target.checked) S.pids.push(p.pid); S.miss = []; paint(); } });
return el('label', { class: 'cc-pay is-' + st.k + (st.lock ? ' is-lock' : '') + (on ? ' is-on' : '') + (full ? ' is-full' : '') }, [el('span', { class: 'cc-pay-n', text: String(p.seq) }),
el('span', { class: 'cc-pay-m' }, [el('b', { text: day(p.due) }), el('span', { class: 'cc-pill is-' + st.k, text: st.t })]),
el('span', { class: 'cc-pay-a' }, p.part ? [el('bdi', { dir: 'ltr', text: money(p.left) }), ' ر.س', el('small', { text: 'المتبقي' })] : [el('bdi', { dir: 'ltr', text: money(p.amount) }), ' ر.س']), ctl]);
}) : [el('p', { class: 'cc-muted', text: 'لا دفعات مستحقة في هذا العقد.' })]));
/* ٢. اقتراحك */
var chips = function (L, cur, set, key) { return el('div', { class: 'cc-chips' + (S.miss.indexOf(key) >= 0 ? ' is-miss' : ''), role: 'radiogroup' }, L.map(function (x) { var on = cur === x[0]; return el('button', { type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: 'cc-chip' + (on ? ' is-on' : ''), 'data-live-ok': '', onclick: function () { set(x[0]); S.miss = []; paint(); } }, [x[1]]); })); };
var tmw = new Date(Date.parse(today + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10), yr = new Date(Date.parse(today + 'T00:00:00Z') + 366 * 86400000).toISOString().slice(0, 10);
var many = sel.length > 1;
var prop = [el('h4', { text: o.staff ? 'مدة التأجيل التي يقترحها العميل' : 'مدة التأجيل التي تقترحها' }), el('p', { class: 'cc-muted', text: o.staff ? 'يظهر الاقتراح في صفحة الطلب، والقرار للفريق في العرض الذي يصل العميل.' : 'اقتراح يراه الفريق عند دراسة طلبك — القرار النهائي في العرض الذي يصلك للموافقة.' }),
chips(MONTHS, S.months, function (v) { S.months = v; }, 'months')];
if (S.months === 'date') prop.push(el('div', { class: 'cc-field' + (S.miss.indexOf('date') >= 0 ? ' is-miss' : '') }, [el('label', { text: 'التاريخ المقترح' }), el('input', { type: 'date', value: S.date || '', min: tmw, max: yr, onchange: function (e) { S.date = e.target.value; S.miss = []; paint(); } })]));
prop.push(el('div', { class: 'cc-field' }, [el('label', { text: many ? 'طريقة سداد الدفعات المؤجَّلة' : 'طريقة سداد الدفعة المؤجَّلة' }), chips(METHOD, S.method, function (v) { S.method = v; }, 'method')]));
prop.push(el('div', { class: 'cc-field' + (S.miss.indexOf('why') >= 0 ? ' is-miss' : '') }, [el('label', { text: 'سبب التأجيل' }), el('select', { onchange: function (e) { S.why = e.target.value; S.miss = []; paint(); } }, WHY.map(function (w) { return el('option', { value: w[0], selected: S.why === w[0], text: w[1] }); }))]));
if (S.why === 'other') prop.push(el('div', { class: 'cc-field' + (S.miss.indexOf('other') >= 0 ? ' is-miss' : '') }, [el('label', { text: 'اكتب السبب' }), el('input', { type: 'text', value: S.other || '', maxlength: '300', oninput: function (e) { S.other = e.target.value; } })]));
prop.push(el('div', { class: 'cc-field' }, [el('label', { text: 'ملاحظة للفريق (اختياري)' }), el('textarea', { rows: '2', maxlength: '300', placeholder: 'اكتب ما تريد أن يعرفه الفريق…', oninput: function (e) { S.note = e.target.value; } }, [S.note || ''])]));
if (sel.length && S.months && (S.months !== 'date' || S.date)) {
var m = METHOD.filter(function (x) { return x[0] === S.method; })[0];
prop.push(el('div', { class: 'cc-hint' }, ['المقترح: تأجيل ' + (sel.length === 1 ? 'الدفعة ' : sel.length === 2 ? 'الدفعتين ' : 'الدفعات ') + seqList(sel) + ' ' + (S.months === 'date' ? 'حتى ' + day(S.date) : MONTH_T[S.months]) + '، والسداد ' + (m ? m[1] : '') + '.']));
}
out.push(el('div', { class: 'cc-sh is-b' }, [el('b', { text: '٢. اقتراحك' })]));
out.push(el('div', { class: 'cc-prop' }, prop));
return el('div', { class: 'cc cc-pk' + (o.staff ? ' is-staff' : '') }, out);
}

function page(o) {
o = o || {};
var S = { opts: null, mine: null, today: '', err: '', no: '', pids: [], months: '', date: '', method: 'end', why: '', other: '', note: '', ack: false, miss: [], busy: false, done: null };
var root = el('div', { class: 'cc', dir: 'rtl' });
async function api(method, path, body) {
var t = await o.token();
var r = await fetch(path, { method: method, cache: 'no-store', credentials: 'same-origin', headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
var j = null; try { j = await r.json(); } catch (e) { j = null; }
if (!r.ok || !j || j.ok === false) throw new Error((j && j.message) || 'تعذّر تنفيذ الطلب الآن.');
return j;
}
async function load() {
try { var a = await Promise.all([api('GET', '/api/account/crq/options'), api('GET', '/api/account/crq')]); S.opts = a[0].contracts || []; S.today = a[0].today || ''; S.mine = (a[1].rows || []).filter(function (r) { return r.kind === 'defer'; }); S.err = ''; }
catch (e) { S.err = e.message; S.opts = S.opts || []; S.mine = S.mine || []; }
if (!S.no && o.cid && S.opts.some(function (c) { return c.no === o.cid && !c.busy; })) S.no = o.cid;
if (o.pid && !S.pids.length) S.pids = [o.pid];
paint();
}
function stepper(cur) {
return el('ol', { class: 'cc-steps', 'aria-label': 'مراحل طلب التأجيل' }, STEPS.map(function (t, i) { return el('li', { class: i < cur ? 'is-done' : i === cur ? 'is-now' : '' }, [el('span', { text: String(i + 1) }), t]); }));
}
function field(label, ctl, miss) { return el('div', { class: 'cc-field' + (miss ? ' is-miss' : '') }, [el('label', { text: label }), ctl]); }
function form() {
var c = S.opts.filter(function (x) { return x.no === S.no; })[0];
var out = [stepper(0)];
if (!S.opts.length) return out.concat([el('div', { class: 'cc-note' }, [icon('alert'), el('span', { text: 'لا توجد دفعات مستحقة في عقودك يمكن تأجيلها الآن.' })])]);
out.push(field('العقد', el('select', { onchange: function (e) { S.no = e.target.value; S.pids = []; S.miss = []; paint(); } }, [el('option', { value: '', text: '— اختر العقد —' })].concat(S.opts.map(function (x) {
var lt = lateOf(x, todayIso(S.today));
return el('option', { value: x.no, selected: S.no === x.no, disabled: !!x.busy, text: x.no + (x.product ? ' · ' + x.product : '') + (x.busy ? ' · عليه طلب قائم ' + x.busy : lt.n ? ' · ' + cntW(lt.n, 'متأخرة', 'متأخرتان') : '') });
}))), S.miss.indexOf('no') >= 0));
if (c) {
out.push(picker({ S: S, contract: c, today: S.today, paint: paint }));
out.push(el('div', { class: 'cc-note is-info' }, [icon('clock'), el('span', { text: 'يراجع فريق تيرا طلبك ويحدد رسم التأجيل والجدول الجديد، ويصلك العرض برابط للموافقة أو الاعتذار. لا يتغير عقدك إلا بعد توقيعك على الملحق.' })]));
out.push(el('label', { class: 'cc-ack' + (S.miss.indexOf('ack') >= 0 ? ' is-miss' : '') }, [el('input', { type: 'checkbox', checked: S.ack, onchange: function (e) { S.ack = e.target.checked; S.miss = []; } }),
el('span', { text: 'أطلب تأجيل الدفعة المختارة من العقد ' + c.no + '، وأعلم أن الموافقة على العرض والتوقيع على الملحق يعدّلان عقدي نفسه.' })]));
}
if (S.opts.some(function (x) { return x.busy; })) out.push(el('div', { class: 'cc-note is-info' }, [icon('alert'), el('span', { text: 'طلب تأجيل واحد مفتوح لكل عقد: العقد الذي عليه طلب قائم يُتاح بعد إغلاق طلبه، وباقي عقودك متاحة الآن.' })]));
if (S.err) out.push(el('p', { class: 'cc-err', role: 'alert', text: S.err }));
out.push(el('div', { class: 'cc-acts' }, [el('button', { type: 'button', class: 'cc-btn is-pri', disabled: S.busy, 'data-live-ok': '', onclick: submit }, ['إرسال طلب التأجيل']), o.back ? el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: o.back }, ['رجوع']) : null]));
return out;
}
async function submit() {
var m = S.no ? check(S) : ['no']; if (S.no && !S.ack) m.push('ack');
S.miss = m; if (m.length) { paint(); var f = root.querySelector('.is-miss'); if (f) f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
S.busy = true; S.err = ''; paint();
try {
var p = payload(S);
var j = await api('POST', '/api/account/crq', { kind: 'defer', contract_no: S.no, payment_ids: p.payment_ids, note: p.note, prop: p.prop });
S.done = j; S.busy = false; S.no = ''; S.pids = []; S.months = ''; S.date = ''; S.method = 'end'; S.why = ''; S.other = ''; S.note = ''; S.ack = false; load();
} catch (e) { S.busy = false; S.err = e.message; paint(); }
}
function mineList() {
if (!S.mine || !S.mine.length) return null;
return el('section', { class: 'cc-card' }, [el('h3', { text: 'طلبات التأجيل' }), el('div', { class: 'cc-rows' }, S.mine.map(function (r) {
var st = STEP_OF[r.state];
return el('div', { class: 'cc-row is-' + (r.tone || 'info') }, [el('div', { class: 'cc-row-h' }, [el('b', {}, [el('bdi', { dir: 'ltr', text: r.no })]), el('span', { class: 'cc-badge is-' + (r.tone || 'info'), text: r.state === 'closed' && r.close_t ? 'مغلق · ' + r.close_t : r.state_t })]),
el('p', { text: 'العقد ' + r.contract_no + ' · ' + (r.targets || []).map(function (t) { return 'الدفعة ' + t.seq + ' (' + day(t.due) + ')'; }).join('، ') }),
r.total != null ? el('p', { text: 'يُضاف إلى العقد: ' + money(r.total) + ' ر.س' }) : null,
st >= 0 ? stepper(st) : null,
r.state === 'consent' || r.state === 'sign' ? el('div', { class: 'cc-note is-info' }, [icon('link'), el('span', { text: r.state === 'consent' ? 'أرسلنا لك العرض برابط على واتساب والبريد — افتحه للموافقة أو الاعتذار.' : 'أرسلنا لك ملحق العقد للتوقيع برابط على واتساب والبريد.' })]) : null,
r.state === 'received' ? el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { cancel(r); } }, ['إلغاء الطلب']) : null,
chatOf(r)]);
}))]);
}
/* v913: «مطلوب منك» يظهر مفتوحًا، والمراسلة مع الفريق بزر */
function chatOf(r) {
var c = r.chat || {}, need = Number(c.open) > 0 || Number(c.done) > 0;
if (r.state === 'closed' && !Number(c.n)) return null;
if (need || S.chat === r.id) return needCard({ r: r, token: o.token, onChange: load });
return el('button', { type: 'button', class: 'cc-btn is-sm cx-chatb', 'data-live-ok': '', onclick: function () { S.chat = r.id; paint(); } }, [icon('mail'), 'المراسلة مع فريق تيرا' + (Number(c.n) ? ' (' + c.n + ')' : '')]);
}
async function cancel(r) {
var b = root.querySelector('[data-cc-confirm]');
if (!b || b.getAttribute('data-cc-confirm') !== r.id) { S.confirm = r.id; paint(); return; }
try { await api('POST', '/api/account/crq/' + r.id + '/cancel', {}); S.confirm = null; load(); } catch (e) { S.err = e.message; paint(); }
}
function paint() {
root.innerHTML = '';
if (!S.opts) { root.appendChild(el('div', { class: 'cc-card' }, [el('p', { text: 'جارٍ التحميل…' })])); return; }
if (S.done) {
root.appendChild(el('section', { class: 'cc-card cc-done' }, [icon('check'), el('h2', { text: 'أُرسل طلب التأجيل' }), el('p', {}, ['رقم الطلب ', el('bdi', { dir: 'ltr', text: S.done.no })]),
el('p', { text: 'يراجعه فريق تيرا ويصلك العرض برابط للموافقة على واتساب والبريد.' }), el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: function () { S.done = null; paint(); } }, ['طلب آخر'])]));
} else root.appendChild(el('section', { class: 'cc-card' }, [el('h2', { text: 'طلب تأجيل دفعة' })].concat(form())));
var ml = mineList(); if (ml) root.appendChild(ml);
if (S.confirm) {
var r = (S.mine || []).filter(function (x) { return x.id === S.confirm; })[0];
if (r) root.appendChild(el('div', { class: 'cc-card cc-confirm', 'data-cc-confirm': r.id }, [el('p', { text: 'إلغاء الطلب ' + r.no + '؟ لا يمكن التراجع.' }), el('div', { class: 'cc-acts' }, [el('button', { type: 'button', class: 'cc-btn is-pri', 'data-live-ok': '', onclick: function () { cancel(r); } }, ['نعم، ألغِ الطلب']), el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: function () { S.confirm = null; paint(); } }, ['رجوع'])])]));
}
}
paint(); load();
return root;
}

/* ===== v910: ملاحق العقد — كل تأجيل منفَّذ ملحق مرقّم في صفحة العقد، بجدوله قبل وبعد ===== */
var ANX = { at: 0, rows: null, wait: null };
function anxLoad(token) {
if (ANX.rows && Date.now() - ANX.at < 60000) return Promise.resolve(ANX.rows);
if (ANX.wait) return ANX.wait;
ANX.wait = Promise.resolve(token()).then(function (t) { return fetch('/api/account/crq/annexes', { cache: 'no-store', credentials: 'same-origin', headers: { Authorization: 'Bearer ' + t, Accept: 'application/json' } }); })
.then(function (r) { return r.json(); }).then(function (j) { ANX.rows = (j && j.ok && j.rows) || []; ANX.at = Date.now(); ANX.wait = null; return ANX.rows; })
.catch(function () { ANX.wait = null; return ANX.rows || []; });
return ANX.wait;
}
function d10(s) { return String(s || '').slice(0, 10); }
function dmy(s) { var d = d10(s).split('-'); return d.length === 3 ? d[2] + '/' + d[1] + '/' + d[0] : d10(s); }
function anxFacts(a) {
var R = a.rows || [], before = R.filter(function (x) { return x.open && !x.added; }).length, after = R.filter(function (x) { return (x.open || x.added) && !x.merged; }).length;
var mg = R.filter(function (x) { return x.merged; }).length, ad = R.filter(function (x) { return x.added; }).length, mv = R.filter(function (x) { return x.open && !x.merged && !x.added && (x.due_after !== x.due_before || Number(x.amt_after) !== Number(x.amt_before)); }).length;
var f = [];
var mvd = R.filter(function (x) { return x.open && !x.merged && !x.added && x.due_after !== x.due_before; }).length;
if (before !== after) f.push('أُعيدت جدولة ' + before + ' ← ' + after + ' دفعة'); else { if (mvd) f.push('نُقل موعد ' + cntW(mvd, '', '').trim()); if (mv > mvd) f.push('وُزّعت الرسوم على ' + cntW(mv, '', '').trim()); }
if (mg) f.push('دُمجت ' + cntW(mg, '', '').trim());
if (ad) f.push('أُضيفت ' + cntW(ad, 'جديدة', 'جديدتان'));
var first = R.filter(function (x) { return (x.open || x.added) && !x.merged; }).map(function (x) { return d10(x.due_after); }).sort()[0];
if (first) f.push('أول دفعة ' + day(first));
if (a.total != null) f.push('رسوم ' + money(a.total) + ' ريال');
return f;
}
function anxTable(a, side) {
var R = (a.rows || []).slice();
if (side === 'before') {
R = R.filter(function (x) { return !x.added; }).sort(function (p, q) { return d10(p.due_before) < d10(q.due_before) ? -1 : d10(p.due_before) > d10(q.due_before) ? 1 : p.seq - q.seq; });
return el('table', { class: 'cc-at' }, [el('thead', {}, [el('tr', {}, ['#', 'الاستحقاق', 'القيمة', 'بعد الملحق'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, R.map(function (x) {
/* v911: «نُقلت» حين يتغيّر الموعد وحده يُشطب التاريخ، وإن تغيّرت القيمة وحدها تظهر قيمتها الجديدة */
var mvD = x.open && !x.merged && x.due_after !== x.due_before, mvA = x.open && !x.merged && Number(x.amt_after) !== Number(x.amt_before);
var what = !x.open ? el('span', { class: 'cc-muted0', text: 'مسدَّدة' }) : x.merged ? el('span', { class: 'cc-mv', text: 'دُمجت' }) : (mvD || mvA) ? el('span', { class: 'cc-mv' }, mvD ? ['نُقلت ', el('bdi', { dir: 'ltr', text: dmy(x.due_after) })] : ['قيمتها ', el('bdi', { dir: 'ltr', text: money(x.amt_after) })]) : el('span', { class: 'cc-muted0', text: 'لم تتغيّر' });
return el('tr', { class: (mvD || mvA || x.merged) ? 'is-mv' : '' }, [el('td', { text: String(x.seq) }), el('td', {}, [(mvD || x.merged) ? el('s', {}, [el('bdi', { dir: 'ltr', text: dmy(x.due_before) })]) : el('bdi', { dir: 'ltr', text: dmy(x.due_before) })]), el('td', {}, [mvA ? el('s', {}, [el('bdi', { dir: 'ltr', text: money(x.amt_before) })]) : el('bdi', { dir: 'ltr', text: money(x.amt_before) })]), el('td', {}, [what])]);
}))]);
}
R = R.filter(function (x) { return !x.merged && (x.open || x.added || !x.open); }).filter(function (x) { return !x.merged; }).sort(function (p, q) { return d10(p.due_after) < d10(q.due_after) ? -1 : d10(p.due_after) > d10(q.due_after) ? 1 : p.seq - q.seq; });
return el('table', { class: 'cc-at' }, [el('thead', {}, [el('tr', {}, ['#', 'الاستحقاق', 'القيمة', ''].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, R.map(function (x) {
var ch = x.added || (x.open && (x.due_after !== x.due_before || Number(x.amt_after) !== Number(x.amt_before)));
return el('tr', {}, [el('td', { text: String(x.seq) }), el('td', {}, [el('bdi', { dir: 'ltr', text: dmy(x.due_after) })]), el('td', {}, [el('bdi', { dir: 'ltr', text: money(x.amt_after) })]), el('td', {}, [x.added ? el('span', { class: 'cc-ed', text: 'دفعة جديدة' }) : ch ? el('span', { class: 'cc-ed', text: 'بالملحق ' + a.n }) : !x.open ? el('span', { class: 'cc-muted0', text: 'مسدَّدة' }) : null])]);
}))]);
}
function annexes(o) {
var root = el('div', { class: 'cc cc-anx', dir: 'rtl' }), open = {}, side = {};
function paint(L) {
root.innerHTML = '';
var A = (L || []).filter(function (a) { return a.contract_no === o.no; }).sort(function (p, q) { return q.n - p.n; });
if (!A.length) { root.hidden = true; return; }
root.hidden = false;
root.appendChild(el('section', { class: 'cc-card' }, [el('div', { class: 'cc-anx-h' }, [el('h3', { text: 'ملاحق العقد' }), el('span', { class: 'cc-badge is-warn', text: A.length === 1 ? 'ملحق واحد' : A.length === 2 ? 'ملحقان' : A.length + ' ملاحق' })]),
el('div', { class: 'cc-anx-l' }, A.map(function (a) {
var k = a.no, isOpen = !!open[k], sd = side[k] || 'before';
var body = isOpen ? el('div', { class: 'cc-anx-tb cx' }, anxDetail(a)) : null; void sd; /* v913: القيمة قبل وبعد وما تغيّر والجدولان */
return el('div', { class: 'cc-anx-i' }, [el('span', { class: 'cc-anx-n' }, ['ملحق', el('b', { text: String(a.n) })]), el('div', { class: 'cc-anx-t' }, [el('b', {}, ['تأجيل دفعة · ', el('bdi', { dir: 'ltr', text: a.no })]), el('small', { text: 'نُفّذ ' + day(a.executed_at) + ' · بتوقيعك' }),
el('div', { class: 'cc-anx-f' }, anxFacts(a).map(function (t) { return el('span', { text: t }); })),
el('div', { class: 'cc-anx-a' }, [el('button', { type: 'button', class: 'cc-btn is-sm', 'aria-expanded': isOpen ? 'true' : 'false', 'data-live-ok': '', onclick: function () { open[k] = !isOpen; paint(L); } }, [isOpen ? 'إخفاء التفاصيل' : 'تفاصيل الملحق والجدول قبل وبعد'])]), body])]);
}))]));
}
root.hidden = true;
anxLoad(o.token).then(paint);
return root;
}

/* ===== v913: طلب الاستكمال والمراسلة داخل طلب التأجيل — جزء واحد للفريق والعميل =====
 * msgBox: المراسلات والمرفقات (الفريق: رسالة للعميل · ملاحظة داخلية · طلب مرفق + ردود جاهزة · العميل: رسائله)
 * askPanel: «طلب استكمال من العميل» بقوائم منسدلة (سند لأمر · أمر مستديم · شيكات · كفيل غارم · مستندات · إجراء آخر)
 * needCard: «مطلوب منك» عند العميل — رفع كل مطلوب في مكانه
 * staffReqs / staffAnx / annexView: طلبات العميل وملاحق عقوده في ملف العميل عند الفريق
 * listsEditor: الردود الجاهزة وأنواع المطلوبات (الإعدادات) */
var IC2 = { mail: 'M4 6h16v12H4zM4 7l8 6 8-6', clip: 'M21 12l-8.5 8.5a5 5 0 0 1-7-7L14 5a3.3 3.3 0 0 1 4.7 4.7L10 18.4a1.7 1.7 0 0 1-2.4-2.4L15.5 8', x: 'M6 6l12 12M18 6L6 18', note: 'M6 4h12v16H6zM9 9h6M9 13h6M9 17h3', file: 'M14 3H6v18h12V7l-4-4zM14 3v4h4', up: 'M12 19V6M6 12l6-6 6 6M5 21h14', send: 'M4 12l16-8-6 16-3-7-7-1z', bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', plus: 'M12 5v14M5 12h14', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', resched: 'M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5' };
Object.keys(IC2).forEach(function (k) { if (!IC[k]) IC[k] = IC2[k]; });
function apiOf(tokenFn) {
  return async function (method, path, body) {
    var t = await tokenFn();
    var r = await fetch(path, { method: method, cache: 'no-store', credentials: 'same-origin', headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
    var j = null; try { j = await r.json(); } catch (e) { j = null; }
    if (!r.ok || !j || j.ok === false) { var er = new Error((j && j.message) || 'تعذّر تنفيذ الطلب الآن.'); er.code = j && j.error; throw er; }
    return j;
  };
}
function staffApi() { return apiOf(function () { return window.__teraApp.token(); }); }
var SBU = null;
async function sbUrl() { if (SBU !== null) return SBU; try { var r = await fetch('/admin/api/config', { cache: 'no-store' }); var j = await r.json(); SBU = (j && j.supabaseUrl) || ''; } catch (e) { SBU = ''; } return SBU; }
async function putFile(u, f) {
  var s = await sbUrl(), tries = [];
  if (s) tries.push(String(u.url).replace(/^https?:\/\/[^/]+(?:\/sb)?/, s));
  if (tries.indexOf(u.url) < 0) tries.push(u.url);
  for (var i = 0; i < tries.length; i++) { try { var r = await fetch(tries[i], { method: 'PUT', headers: { 'Content-Type': f.type, 'x-upsert': 'false' }, body: f }); if (r.ok) return true; } catch (e) { void e; } }
  return false;
}
async function uploadTo(api, base, f) {
  var u = await api('POST', base + '/url', { type: f.type, size: f.size });
  if (!(await putFile(u, f))) throw new Error('تعذّر رفع الملف إلى المخزن — أعد المحاولة.');
  return api('POST', base + '/done', { path: u.path, name: String(f.name || '').slice(0, 120) });
}
var ACC = { pdf: 'application/pdf', image: 'image/*', any: 'application/pdf,image/*,.doc,.docx,.xls,.xlsx,.rtf,.txt,.csv,.zip' };
var TYPE_T = { pdf: 'PDF', image: 'صورة', any: 'PDF أو صورة أو مستند' };
function pickFile(types, mb, cb) {
  var inp = el('input', { type: 'file', accept: ACC[types] || ACC.any });
  inp.addEventListener('change', function () { var f = inp.files && inp.files[0]; if (!f) return; if (f.size > mb * 1048576) { cb(null, 'حجم الملف أكبر من ' + mb + ' ميجا.'); return; } cb(f, ''); });
  inp.click();
}
function stamp(t) { try { var d = new Date(t); return d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'long' }) + ' · ' + d.toLocaleTimeString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'Asia/Riyadh', hour: 'numeric', minute: '2-digit' }); } catch (e) { return String(t || ''); } }
function kb(n) { n = Number(n) || 0; return n >= 1048576 ? (Math.round(n / 104857.6) / 10) + ' م.ب' : Math.max(1, Math.round(n / 1024)) + ' ك.ب'; }
function fill(body, V) { return String(body || '').replace(/\{(الاسم|رقم الطلب|العقد|المطلوب|المستند|المهلة|الفجوة)\}/g, function (m, k) { var v = V[k]; return v == null || v === '' ? m : String(v); }); }
function extOf(n, mime) { var e = String(n || '').split('.').pop().toUpperCase(); return /^(PDF|JPG|JPEG|PNG|WEBP|GIF|HEIC|DOC|DOCX|XLS|XLSX|CSV|TXT|ZIP|RTF)$/.test(e) ? e.slice(0, 4) : /^image\//.test(mime || '') ? 'IMG' : 'FILE'; }
function fileChip(m, viewFn, from) {
  var f = m.file || {}, isImg = /^image\//.test(f.mime || '') || /\.(jpe?g|png|webp|gif|heic)$/i.test(f.name || '');
  return el('button', { type: 'button', class: 'cx-att' + (isImg ? ' is-img' : ''), 'data-live-ok': '', onclick: function () { viewFn(m.id || m.file_msg); } }, [el('i', { text: extOf(f.name, f.mime) }), el('span', { class: 'cx-att-n' }, [el('bdi', { text: f.name || 'مرفق' })]), el('small', { text: (from ? from + ' · ' : '') + (f.size ? kb(f.size) + ' · ' : '') + 'عرض' })]);
}
function openFile(api, path) {
  var w = null; try { w = window.open('', '_blank'); } catch (e) { w = null; }
  api('GET', path).then(function (j) { if (w) w.location.href = j.url; else window.open(j.url, '_blank', 'noopener'); }, function (e) { if (w) try { w.close(); } catch (er) { void er; } alert((e && e.message) || 'تعذّر فتح المرفق.'); });
}
function hoursT(h) { return h === 24 ? '24 ساعة' : h === 48 ? '48 ساعة' : h === 72 ? '72 ساعة' : h === 120 ? '5 أيام' : 'أسبوع'; }
var HOURS = [24, 48, 72, 120, 168];

/* ── المراسلات والمرفقات ── */
var MB = {};
function msgBox(o) {
  var staff = o.mode === 'staff', api = o.api || (staff ? staffApi() : apiOf(o.token)), id = o.id, x = o.x || {};
  var M = MB[id] || (MB[id] = { rows: null, asks: [], sum: null, lists: null, busy: false, err: '', mode: 'msg', txt: '', tpl: '', file: null, aT: '', aTitle: '', aTypes: 'any', aMb: '5' });
  var root = el('div', { class: 'cc cx', dir: 'rtl' });
  if (M.mode === 'ask') M.mode = 'msg'; /* v940 */
  if (staff && o.ask) { if (o.ask.open) M.askOpen = true; if (o.ask.reset) M.askPre = { items: o.ask.preset || null, reset: true }; if (Number(o.ask.gap)) M.askGap = Number(o.ask.gap); }
  var base = staff ? '/admin/api/crq/' + id : '/api/account/crq/' + id;
  var viewPath = function (mid) { return (staff ? '/admin/api/crq-file/' : '/api/account/crq-file/') + mid; };
  var view = function (mid) { openFile(api, viewPath(mid)); };
  async function load() {
    try { var j = await api('GET', base + '/msgs'); M.rows = j.rows || []; M.asks = j.asks || []; M.sum = j.sum || null; if (j.lists) M.lists = j.lists; M.err = ''; if (o.onSum) o.onSum(M.sum); }
    catch (e) { M.err = e.message; M.rows = M.rows || []; }
    paint();
  }
  var V = function () { var open = (M.asks || []).filter(function (a) { return a.state === 'open'; }), done = (M.asks || []).filter(function (a) { return a.state === 'done'; });
    return { 'الاسم': String(x.client || x.name || '').split(' ')[0], 'رقم الطلب': x.no || '', 'العقد': x.contract_no || '', 'المطلوب': open.map(function (a) { return a.title; }).join('، '), 'المستند': done.length ? done[done.length - 1].title : '', 'المهلة': M.sum && M.sum.due ? stamp(M.sum.due) : '' }; };
  function bubble(m) {
    var mine = staff ? m.who === 'staff' : m.who === 'client';
    var cls = 'cx-m' + (m.internal ? ' is-in' : mine ? ' is-me' : ' is-other');
    var who = m.internal ? '🔒 ملاحظة داخلية — للفريق فقط · ' + m.by : m.who === 'staff' ? (staff ? 'فريق تيرا · ' + m.by : 'فريق تيرا') : m.who === 'client' ? (staff ? m.by : 'أنت') : 'النظام';
    var kids = [el('small', { class: 'cx-who', text: who + ' · ' + stamp(m.at) })];
    if (m.body) kids.push(el('div', { class: 'cx-b', text: m.body }));
    if (m.ask_ids && m.ask_ids.length) kids.push(el('div', { class: 'cx-rqs' }, m.ask_ids.map(function (aid) { var a = (M.asks || []).filter(function (z) { return z.id === aid; })[0]; if (!a) return null;
      return el('div', { class: 'cx-rq is-' + a.state }, [el('span', { text: 'مطلوب: ' + a.title }), el('b', { text: a.state === 'done' ? 'وصل ✓' : staff ? 'بانتظار العميل' : 'بانتظارك' })]); })));
    if (m.file) kids.push(fileChip(m, view));
    return el('li', { class: cls }, kids);
  }
  function composer() {
    var L = (M.lists && M.lists.replies || []).filter(function (r) { return r.active !== false; });
    var out = [];
    if (staff) out.push(el('div', { class: 'cx-seg', role: 'tablist' }, [['msg', 'رسالة للعميل'], ['note', '🔒 ملاحظة داخلية']].map(function (s) { return el('button', { type: 'button', role: 'tab', 'aria-selected': M.mode === s[0] ? 'true' : 'false', class: (M.mode === s[0] ? 'is-on' : '') + (s[0] === 'note' ? ' is-note' : ''), 'data-live-ok': '', onclick: function () { M.mode = s[0]; M.err = ''; paint(); } }, [s[1]]); })));
    /* v940: «طلب مرفق» أُزيل من هنا — الطلب من العميل بنموذج «طلب استكمال من العميل» في القسم الجانبي */
    if (M.mode !== 'note' && L.length && staff) {
      var cats = [['ask', 'طلب الاستكمال'], ['follow', 'الاستلام والمتابعة'], ['decision', 'القرار']];
      out.push(el('label', { class: 'cx-f' }, [el('span', { text: 'رد جاهز' }), el('select', { onchange: function (e) { var r = L.filter(function (z) { return z.k === e.target.value; })[0]; M.tpl = r ? r.k : ''; if (r) M.txt = fill(r.body, V()); paint(); var t = root.querySelector('.cx-ta'); if (t) t.focus(); } },
        [el('option', { value: '', text: '✎ رسالة أخرى — يكتبها الموظف' })].concat(cats.map(function (c) { var Lc = L.filter(function (r) { return r.cat === c[0]; }); return Lc.length ? el('optgroup', { label: c[1] }, Lc.map(function (r) { return el('option', { value: r.k, selected: M.tpl === r.k, text: r.k + ' · ' + r.title }); })) : null; })))]));
    }
    var ta = el('textarea', { class: 'cx-ta' + (M.mode === 'note' ? ' is-note' : ''), rows: '3', maxlength: staff ? '2000' : '1000', placeholder: M.mode === 'note' ? 'ملاحظة للفريق — لا يراها العميل…' : staff ? 'اكتب رسالتك للعميل — تصله في حسابه وواتساب والإشعارات…' : 'اكتب رسالتك لفريق تيرا…', oninput: function (e) { M.txt = e.target.value; } });
    ta.value = M.txt || '';
    out.push(ta);
    var bar = [];
    if (staff && M.mode === 'msg') bar.push(M.file ? el('span', { class: 'cx-pend' }, [icon('clip'), el('bdi', { text: M.file.name }), el('button', { type: 'button', 'aria-label': 'إزالة المرفق', 'data-live-ok': '', onclick: function () { M.file = null; paint(); } }, [icon('x')])])
      : el('button', { type: 'button', class: 'cx-ib', title: 'إرفاق مستند للعميل (PDF أو صورة أو مستند · حتى 10 ميجا)', 'aria-label': 'إرفاق مستند', 'data-live-ok': '', onclick: function () { pickFile('any', 10, function (f, er) { if (er) { M.err = er; paint(); return; } M.file = f; M.err = ''; paint(); }); } }, [icon('clip')]));
    bar.push(el('small', { class: 'cx-hint', text: M.mode === 'note' ? 'تظهر للفريق وحده.' : staff ? 'النص قابل للتعديل قبل الإرسال.' : 'لسؤال أو استفسار عن طلبك — تصل رسالتك لفريق تيرا ويصلك الرد هنا وبإشعار.' }));
    bar.push(el('button', { type: 'button', class: 'cc-btn is-pri cx-send', disabled: M.busy, 'data-live-ok': '', onclick: send }, [icon('send'), M.busy ? 'جارٍ الإرسال…' : M.mode === 'note' ? 'حفظ الملاحظة' : staff ? 'إرسال' : 'إرسال الرسالة']));
    out.push(el('div', { class: 'cx-bar' }, bar));
    if (M.err) out.push(el('p', { class: 'cx-err', role: 'alert', text: M.err }));
    return el('div', { class: 'cx-comp' }, out);
  }
  async function send() {
    if (M.busy) return;
    var body = String(M.txt || '').trim();
    try {
      M.busy = true; M.err = ''; paint();
      if (staff) {
        var file = null;
        if (M.file && M.mode === 'msg') { var u = await uploadTo(api, base + '/team-file', M.file); file = u.file; }
        if (body.length < 2 && !file) throw new Error('اكتب الرسالة.');
        var j = await api('POST', base + '/msgs', { body: body, internal: M.mode === 'note', tpl: M.tpl, file: file });
        M.rows = j.rows; M.sum = j.sum; M.file = null;
        done(M.mode === 'note' ? 'حُفظت الملاحظة الداخلية — يراها الفريق وحده.' : 'أُرسلت الرسالة للعميل — تصله في حسابه وواتساب والإشعارات.');
      } else {
        if (body.length < 2) throw new Error('اكتب رسالتك.');
        var k = await api('POST', base + '/msgs', { body: body }); M.rows = k.rows; M.asks = k.asks || M.asks; M.sum = k.sum;
        done('أُرسلت رسالتك لفريق تيرا.');
      }
    } catch (e) { M.busy = false; M.err = e.message; paint(); }
  }
  function done(msg) { M.busy = false; M.txt = ''; M.tpl = ''; M.err = ''; if (o.onSum) o.onSum(M.sum); if (o.toast) o.toast(true, msg); paint(); }
  function side() {
    var A = M.asks || [], open = A.filter(function (a) { return a.state === 'open'; }), dn = A.filter(function (a) { return a.state === 'done'; });
    var files = (M.rows || []).filter(function (m) { return m.file; });
    var pct = A.length ? Math.round(dn.length / A.length * 100) : 0;
    var kids = [el('h4', { text: 'المطلوب من العميل' })];
    if (staff) kids.push(el('button', { type: 'button', class: 'cc-btn is-sm cx-wide cx-askbtn' + (M.askOpen ? ' is-on' : ''), 'aria-expanded': M.askOpen ? 'true' : 'false', 'data-live-ok': '', onclick: function () { M.askOpen = !M.askOpen; paint(); if (M.askOpen) { var w = root.querySelector('.cx-askw'); if (w) w.scrollIntoView({ block: 'start', behavior: 'smooth' }); } } }, [icon('clip'), M.askOpen ? 'إخفاء نموذج الطلب' : 'طلب استكمال من العميل'])); /* v940: مكان واحد للطلب من العميل */
    if (!A.length) kids.push(el('p', { class: 'cx-hint', text: staff ? 'لا مطلوبات بعد.' : 'لا مطلوبات.' }));
    else {
      if (open.length) kids.push(el('div', { class: 'cx-prog' }, [el('i', { style: 'width:' + pct + '%' })]), el('small', { class: 'cx-hint', text: 'وصل ' + dn.length + ' من ' + A.length + (M.sum && M.sum.due && open.length ? ' · المهلة حتى ' + stamp(M.sum.due) : '') }));
      kids.push(el('ul', { class: 'cx-fl' }, A.map(function (a) { return el('li', { class: 'is-' + a.state }, [el('i', { text: a.state === 'done' ? '✓' : '…' }), el('div', {}, [el('b', { text: a.title }), el('small', { text: a.state === 'done' ? 'وصل ' + stamp(a.done_at) : 'لم يصل بعد' })]),
        a.state === 'done' && a.file_msg ? el('button', { type: 'button', class: 'cx-lnk', 'data-live-ok': '', onclick: function () { view(a.file_msg); } }, ['عرض']) : null,
        a.state === 'open' ? el('button', { type: 'button', class: 'cx-x', title: 'إلغاء هذا المطلوب', 'aria-label': 'إلغاء ' + a.title, 'data-live-ok': '', onclick: function () { cancelAsk(a); } }, [icon('x')]) : null]); })));
      if (open.length) kids.push(el('button', { type: 'button', class: 'cc-btn is-sm cx-wide', disabled: M.busy, 'data-live-ok': '', onclick: remind }, [icon('bell'), 'تذكير العميل بالمطلوب']));
    }
    kids.push(el('h4', { text: 'كل المرفقات' + (files.length ? ' (' + files.length + ')' : '') }));
    kids.push(files.length ? el('div', { class: 'cx-files' }, files.slice().reverse().map(function (m) { return fileChip(m, view, m.who === 'staff' ? 'من الفريق' : 'من العميل'); })) : el('p', { class: 'cx-hint', text: 'لا مرفقات بعد.' }));
    return el('aside', { class: 'cc-card cx-side' }, kids);
  }
  async function remind() { try { M.busy = true; paint(); var j = await api('POST', base + '/remind', {}); M.busy = false; if (o.toast) o.toast(true, 'أُرسل تذكير للعميل بالمطلوب: ' + j.list + '.'); load(); } catch (e) { M.busy = false; M.err = e.message; paint(); if (o.toast) o.toast(false, e.message); } }
  async function cancelAsk(a) {
    if (!window.confirm('إلغاء المطلوب «' + a.title + '»؟ يختفي من صفحة العميل.')) return;
    try { var j = await api('POST', '/admin/api/crq-ask/' + a.id + '/cancel', {}); M.asks = j.asks; M.sum = j.sum; if (o.onSum) o.onSum(M.sum); if (o.toast) o.toast(true, 'أُلغي المطلوب: ' + a.title + '.'); load(); } catch (e) { if (o.toast) o.toast(false, e.message); }
  }
  function paint() {
    root.innerHTML = '';
    if (!M.rows) { root.appendChild(el('div', { class: 'cc-card' }, [el('p', { class: 'cx-hint', text: 'جارٍ تحميل المراسلات…' })])); return; }
    var RW = staff ? M.rows : M.rows.filter(function (m) { return !(m.ask_ids && m.ask_ids.length) && !(M.asks || []).some(function (a) { return a.file_msg === m.id; }) && !/^أرفق[:：]/.test(String(m.body || '')); });
var n = RW.length, nf = RW.filter(function (m) { return m.file; }).length;
    var list = n ? el('ol', { class: 'cx-thread' }, RW.map(bubble)) : el('p', { class: 'cx-hint cx-empty', text: staff ? 'لا رسائل بعد — راسل العميل، أو اكتب ملاحظة داخلية للفريق.' : 'لا رسائل بعد — راسل فريق تيرا عن طلبك من هنا.' });
    var main = el('section', { class: 'cc-card cx-main' }, [el('div', { class: 'cx-h' }, [el('span', { class: 'cx-ic' }, [icon('mail')]), el('h3', { text: staff ? 'المراسلات' : 'المراسلة مع فريق تيرا' }), n ? el('span', { class: 'cc-badge is-info', text: n + (n === 1 ? ' رسالة' : ' رسائل') + (nf ? ' · ' + nf + ' مرفقات' : '') }) : null]), list,
      x.state === 'closed' && !staff ? el('p', { class: 'cx-hint', text: 'أُغلق الطلب — المراسلة للاطلاع.' }) : composer()]);
    if (staff && M.askOpen) { var ap = M.askPre; root.appendChild(el('div', { class: 'cx-askw' }, [askPanel({ x: x, api: api, lists: M.lists, gap: M.askGap || 0, preset: ap ? ap.items : null, reset: !!(ap && ap.reset), toast: o.toast, onClose: function () { M.askOpen = false; paint(); }, onSent: function (j) { M.askOpen = false; M.askPre = null; paint(); load(); if (o.ask && o.ask.onSent) o.ask.onSent(j); } })])); if (ap) ap.reset = false; } /* v940 */
    root.appendChild(staff ? el('div', { class: 'cx-grid' }, [main, side()]) : main);
    var th = root.querySelector('.cx-thread'); if (th) th.scrollTop = th.scrollHeight;
  }
  paint(); if (!M.rows || !o.cached) load();
  root.reload = load;
  return root;
}

/* ── طلب استكمال من العميل (الفريق) ── */
var AK = {};
function askPanel(o) {
  var x = o.x || {}, api = o.api || staffApi(), id = x.id;
  var S = AK[id] || (AK[id] = { items: [], body: '', tpl: '', hours: 48, busy: false, err: '', add: false, pv: false });
  var root = el('div', { class: 'cc cx-ask', dir: 'rtl' });
  var lists = o.lists || (MB[id] && MB[id].lists) || null;
  var R = (x.result && x.result.rows) || [];
  var post = R.filter(function (z) { return (z.open || z.added) && !z.merged; });
  var gap = Number(o.gap) || 0, pay = post.length ? Number(post[0].amt_after) || 0 : 0, cnt = post.length;
  function autoOf(t) { return t.auto === 'gap' ? gap : t.auto === 'pay' ? pay : t.auto === 'count' ? cnt : ''; }
  function titleOf(t, v) { return t.auto === 'gap' && v ? t.title + ' بقيمة ' + money(v) + ' ريال' : t.auto === 'pay' && v ? t.title + ' بمبلغ شهري ' + money(v) + ' ريال' : t.auto === 'count' && v ? t.title + ' (' + v + (v === 1 ? ' شيك' : v === 2 ? ' شيكان' : v <= 10 ? ' شيكات' : ' شيكًا') + ')' : t.title; }
  function itemOf(k) { var t = (lists && lists.types || []).filter(function (z) { return z.k === k; })[0]; if (!t) return { kind: 'other', title: '', detail: '', val: '', types: 'any', mb: '5' }; var v = autoOf(t); return { kind: t.k, title: titleOf(t, v), detail: t.detail, val: v === '' ? '' : String(v), types: t.types, mb: String(t.mb), auto: t.auto }; }
  var preOf = function (p) { var it = itemOf(typeof p === 'string' ? p : p.kind); if (p && p.title && it.kind === 'other' && !it.title) it.title = p.title; return it; };
  if (o.reset) S.items = [];
  if (o.preset && o.preset.length && !S.items.length) { S.items = o.preset.map(preOf); S.fromPre = !lists; }
  async function ensure() { if (lists) return; try { var j = await api('GET', '/admin/api/crq-lists'); lists = j.lists; if (MB[id]) MB[id].lists = lists; if (o.preset && o.preset.length && (S.fromPre || !S.items.length)) { S.items = o.preset.map(preOf); S.fromPre = false; } } catch (e) { S.err = e.message; } paint(); }
  function reply() { var L = (lists && lists.replies || []).filter(function (r) { return r.active !== false; }); return L; }
  function V() { return { 'الاسم': String(x.client || '').split(' ')[0], 'رقم الطلب': x.no || '', 'العقد': x.contract_no || '', 'المطلوب': S.items.map(function (i) { return i.title; }).filter(Boolean).join('، '), 'المهلة': stamp(new Date(Date.now() + S.hours * 3600e3).toISOString()), 'الفجوة': gap ? money(gap) + ' ريال' : '' }; }
  if (!S.tpl && !S.body) { S.tpl = '8.41'; }
  function paint() {
    root.innerHTML = '';
    var T = (lists && lists.types || []).filter(function (t) { return t.active !== false; });
    var ed = x.state === 'received' || x.state === 'decision';
    var kids = [el('div', { class: 'cx-h' }, [el('span', { class: 'cx-ic is-gold' }, [icon('mail')]), el('h3', { text: 'طلب استكمال من العميل' }), el('span', { class: 'cc-badge is-info', text: 'يصل في حسابه وواتساب والإشعار والبريد' }), o.onClose ? el('button', { type: 'button', class: 'cc-btn is-sm cx-close', 'data-live-ok': '', onclick: o.onClose }, ['إغلاق']) : null])];
    if (!ed) kids.push(el('div', { class: 'cc-note is-info' }, [icon('alert'), el('span', { text: 'طلب الاستكمال قبل إرسال العرض — بعده اسحب العرض وعدّله من «الخطوة التالية»، أو راسل العميل من المراسلة أدناه.' })]));
    if (!lists) kids.push(el('p', { class: 'cx-hint', text: 'جارٍ تحميل القوائم…' }));
    S.items.forEach(function (it, i) {
      var t = T.filter(function (z) { return z.k === it.kind; })[0];
      kids.push(el('div', { class: 'cx-it' }, [el('div', { class: 'cx-it-h' }, [el('span', { class: 'cx-n', text: String(i + 1) }),
        el('select', { 'aria-label': 'نوع المطلوب ' + (i + 1), disabled: !ed, onchange: function (e) { S.items[i] = itemOf(e.target.value); paint(); } }, grpOpts(T, it.kind)),
        el('button', { type: 'button', class: 'cx-x', 'aria-label': 'حذف المطلوب ' + (i + 1), disabled: !ed, 'data-live-ok': '', onclick: function () { S.items.splice(i, 1); paint(); } }, [icon('x')])]),
        el('div', { class: 'cx-g3' }, [
          el('label', { class: 'cx-f is-wide' }, [el('span', { text: 'المطلوب كما يراه العميل' }), el('input', { type: 'text', maxlength: '120', value: it.title, disabled: !ed, oninput: function (e) { it.title = e.target.value; } })]),
          t && t.auto ? el('label', { class: 'cx-f' }, [el('span', {}, [t.auto === 'count' ? 'العدد' : 'القيمة (ر.س)', el('em', { class: 'cx-auto', text: t.auto === 'gap' ? 'الفجوة' : t.auto === 'pay' ? 'قيمة الدفعة' : 'الدفعات المتبقية' })]), el('input', { type: 'text', inputmode: 'decimal', value: it.val, disabled: !ed, oninput: function (e) { it.val = e.target.value.replace(/[^\d.]/g, ''); var v = Number(it.val) || 0; it.title = titleOf(t, t.auto === 'count' ? Math.round(v) : v); var ti = e.target.closest('.cx-it').querySelector('.cx-f.is-wide input'); if (ti) ti.value = it.title; } })]) : null,
          el('label', { class: 'cx-f' }, [el('span', { text: 'الملف' }), el('select', { disabled: !ed, onchange: function (e) { var p = e.target.value.split('|'); it.types = p[0]; it.mb = p[1]; } }, [['any|5', 'PDF أو صورة · 5 ميجا'], ['any|10', 'PDF أو صورة · 10 ميجا'], ['pdf|5', 'PDF فقط · 5 ميجا'], ['image|5', 'صورة فقط · 5 ميجا'], ['any|20', 'أي مستند · 20 ميجا']].map(function (z) { return el('option', { value: z[0], selected: it.types + '|' + it.mb === z[0], text: z[1] }); }))]),
          el('label', { class: 'cx-f is-wide' }, [el('span', { text: 'تفاصيل للعميل (اختياري)' }), el('input', { type: 'text', maxlength: '300', value: it.detail, disabled: !ed, oninput: function (e) { it.detail = e.target.value; } })])])]));
    });
    if (lists && ed && S.items.length < 8) kids.push(el('label', { class: 'cx-add' }, [icon('plus'), el('select', { 'aria-label': 'إضافة مطلوب', onchange: function (e) { if (!e.target.value) return; S.items.push(itemOf(e.target.value)); paint(); } }, [el('option', { value: '', text: '+ إضافة مطلوب — اختر النوع' })].concat(grpOpts(T, '')))]));
    var L = reply();
    kids.push(el('label', { class: 'cx-f' }, [el('span', { text: 'الرسالة للعميل — من الردود الجاهزة' }), el('select', { disabled: !ed, onchange: function (e) { S.tpl = e.target.value; var r = L.filter(function (z) { return z.k === S.tpl; })[0]; if (r) S.body = fill(r.body, V()); paint(); } },
      [el('option', { value: '', text: '✎ رسالة أخرى — يكتبها الموظف' })].concat(L.map(function (r) { return el('option', { value: r.k, selected: S.tpl === r.k, text: r.k + ' · ' + r.title }); })))]));
    if (S.tpl && !S.body) { var r0 = L.filter(function (z) { return z.k === S.tpl; })[0]; if (r0) S.body = fill(r0.body, V()); }
    var ta = el('textarea', { class: 'cx-ta', rows: '3', maxlength: '2000', disabled: !ed, placeholder: 'رسالتك للعميل…', oninput: function (e) { S.body = e.target.value; } }); ta.value = S.body || '';
    kids.push(ta);
    kids.push(el('div', { class: 'cx-g2' }, [el('label', { class: 'cx-f' }, [el('span', { text: 'مهلة الاستكمال' }), el('select', { disabled: !ed, onchange: function (e) { S.hours = Number(e.target.value); var r = L.filter(function (z) { return z.k === S.tpl; })[0]; if (r) S.body = fill(r.body, V()); paint(); } }, HOURS.map(function (h) { return el('option', { value: String(h), selected: S.hours === h, text: hoursT(h) }); }))]),
      el('div', { class: 'cx-f' }, [el('span', { text: 'يصل العميل' }), el('div', { class: 'cx-chs' }, ['حسابه', 'واتساب', 'إشعار الجوال', 'البريد'].map(function (c) { return el('span', { class: 'cx-ch', text: c }); }))])]));
    if (S.err) kids.push(el('p', { class: 'cx-err', role: 'alert', text: S.err }));
    kids.push(el('div', { class: 'cx-acts' }, [el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: function () { S.pv = !S.pv; paint(); } }, [icon('eye'), S.pv ? 'إخفاء المعاينة' : 'معاينة كما يراه العميل']),
      el('button', { type: 'button', class: 'cc-btn is-pri', disabled: !ed || S.busy || !S.items.length, 'data-live-ok': '', onclick: send }, [icon('send'), S.busy ? 'جارٍ الإرسال…' : 'إرسال للعميل'])]));
    if (S.pv) kids.push(el('div', { class: 'cx-pv' }, [el('small', { class: 'cx-hint', text: 'معاينة — ما يراه العميل في صفحة طلبه' }), needPreview(S, V())]));
    root.appendChild(el('section', { class: 'cc-card cx-askc' }, kids));
  }
  async function send() {
    var bad = S.items.filter(function (i) { return String(i.title || '').trim().length < 2; });
    if (!S.items.length || bad.length) { S.err = 'حدّد كل مطلوب واكتب اسمه.'; paint(); return; }
    try {
      S.busy = true; S.err = ''; paint();
      var j = await api('POST', '/admin/api/crq/' + id + '/ask', { items: S.items.map(function (i) { return { kind: i.kind, title: i.title, detail: i.detail, val: i.val, types: i.types, mb: i.mb }; }), body: S.body, tpl: S.tpl, hours: S.hours });
      if (MB[id]) { MB[id].rows = j.rows; MB[id].asks = j.asks; MB[id].sum = j.sum; }
      delete AK[id];
      if (o.toast) o.toast(true, 'أُرسل طلب الاستكمال للعميل: ' + j.list + ' — المهلة حتى ' + stamp(j.due) + '.' + (j.msg && j.msg.ok === false ? ' (لم تصل رسالة واتساب — تصله في حسابه)' : ''));
      if (o.onSent) o.onSent(j);
    } catch (e) { S.busy = false; S.err = e.message; paint(); if (o.toast) o.toast(false, e.message); }
  }
  paint(); ensure();
  return root;
}
function grpOpts(T, cur) {
  var g = function (k, lbl) { var L = T.filter(function (t) { return t.grp === k; }); return L.length ? el('optgroup', { label: lbl }, L.map(function (t) { return el('option', { value: t.k, selected: cur === t.k, text: t.title }); })) : null; };
  return [g('guar', 'الضمانات'), g('doc', 'مستندات'), el('option', { value: 'other', selected: cur === 'other', text: '✎ إجراء آخر — يكتبه الموظف' })].filter(Boolean);
}
function needPreview(S, Vv) {
  return el('div', { class: 'cx-need' }, [el('div', { class: 'cx-h' }, [el('span', { class: 'cx-ic is-gold', text: '!' }), el('h3', { text: 'مطلوب منك لإكمال طلبك' })]),
    el('p', { class: 'cx-hint', text: S.body || '' }), el('small', { class: 'cx-hint', text: 'المهلة حتى ' + Vv['المهلة'] })].concat(S.items.map(function (it, i) { return el('div', { class: 'cx-ni' }, [el('span', { class: 'cx-n', text: String(i + 1) }), el('div', {}, [el('b', { text: it.title || '—' }), el('small', { text: (it.detail ? it.detail + ' · ' : '') + (TYPE_T[it.types] || '') + ' · حتى ' + it.mb + ' ميجا' })]), el('span', { class: 'cx-up is-ghost' }, [icon('up'), 'اختر الملف'])]); })));
}

/* ── «مطلوب منك» عند العميل ── */
function needCard(o) {
  var api = apiOf(o.token), r = o.r, root = el('div', { class: 'cx-needw' });
  var M = MB[r.id] || (MB[r.id] = { rows: null, asks: [], sum: null, busy: false, err: '' });
  var view = function (mid) { openFile(api, '/api/account/crq-file/' + mid); };
  async function load() { try { var j = await api('GET', '/api/account/crq/' + r.id + '/msgs'); M.rows = j.rows || []; M.asks = j.asks || []; M.sum = j.sum; } catch (e) { M.err = e.message; M.rows = M.rows || []; } paint(); }
  function up(a) {
    pickFile(a.types, a.mb, async function (f, er) {
      if (er) { M.err = er; paint(); return; }
      try { M.busy = a.id; M.err = ''; paint(); var j = await uploadTo(api, '/api/account/crq/' + r.id + '/ask-file/' + a.id, f); M.busy = false; M.ok = j.all_done ? 'اكتمل المطلوب — أُبلغ فريق تيرا ويكمل دراسة طلبك.' : 'أُرفق «' + a.title + '» وأُبلغ فريق تيرا.'; load(); if (o.onChange) o.onChange(); }
      catch (e) { M.busy = false; M.err = e.message; paint(); }
    });
  }
  function paint() {
    root.innerHTML = '';
    var A = (M.asks || []), open = A.filter(function (a) { return (a.state === 'open' || a.state === 'accepted'); }), dn = A.filter(function (a) { return a.state === 'done'; });
    if (!M.rows) { root.appendChild(el('p', { class: 'cx-hint', text: 'جارٍ التحميل…' })); return; }
    var team = (M.rows || []).filter(function (m) { return m.file && m.who === 'staff'; });
    if (open.length || dn.length) {
      var ask = (M.rows || []).filter(function (m) { return m.ask_ids && m.ask_ids.length; }).pop();
      var kids = [el('div', { class: 'cx-h' }, [el('span', { class: 'cx-ic is-gold', text: open.length ? '!' : '✓' }), el('h3', { text: open.length ? 'مطلوب منك لإكمال طلبك' : (A.some(function (z) { return z.decision === 'decline'; }) ? 'تم الرد على المطلوب' : 'أرفقت كل المطلوب') })])];
      if (ask && ask.body && open.length && !/مطلوب منك/.test(ask.body)) kids.push(el('p', { class: 'cx-b', text: ask.body }));
      if (open.length && M.sum && M.sum.due) kids.push(el('small', { class: 'cx-hint', text: 'المهلة حتى ' + stamp(M.sum.due) }));
      if (open.length) kids.push(el('div', { class: 'cx-prog' }, [el('i', { style: 'width:' + Math.round(dn.length / (A.length || 1) * 100) + '%' })]), el('small', { class: 'cx-hint', text: 'أرفقت ' + dn.length + ' من ' + A.length }));
      A.forEach(function (a, i) {
        if (a.kind === 'guar' && window.CRQG) { kids.push(window.CRQG.item(a, i, { api: api, reload: load, up: up, view: view, canRe: ['received', 'decision'].indexOf(r.state) >= 0 })); return; }
        kids.push(el('div', { class: 'cx-ni is-' + a.state }, [el('span', { class: 'cx-n', text: a.state === 'done' ? '✓' : String(i + 1) }), el('div', {}, [el('b', { text: a.title }), el('small', { text: a.state === 'done' ? ((a.file && a.file.name) || 'مرفق') + ' · أُرسل للفريق' : (a.detail ? a.detail + ' · ' : '') + (TYPE_T[a.types] || '') + ' · حتى ' + a.mb + ' ميجا' })]),
          a.state === 'open' ? el('button', { type: 'button', class: 'cx-up', disabled: !!M.busy, 'data-live-ok': '', onclick: function () { up(a); } }, [icon('up'), M.busy === a.id ? 'جارٍ الرفع…' : 'اختر الملف أو صوّره']) : (a.file_msg ? el('button', { type: 'button', class: 'cx-lnk', 'data-live-ok': '', onclick: function () { view(a.file_msg); } }, ['عرض']) : null)]));
      });
      team.forEach(function (m) { kids.push(fileChip(m, view, 'من فريق تيرا')); });
      if (M.ok) kids.push(el('div', { class: 'cc-note is-ok' }, [icon('check'), el('span', { text: M.ok })]));
      if (M.err) kids.push(el('p', { class: 'cx-err', role: 'alert', text: M.err }));
      root.appendChild(el('div', { class: 'cx-need' + (open.length ? '' : ' is-done') }, kids));
    }
    var ch = el('div', { class: 'cx-chatw' });
    root.appendChild(ch);
    if (o.chat !== false) ch.appendChild(msgBox({ mode: 'client', id: r.id, token: o.token, x: { no: r.no, state: r.state }, cached: true }));
  }
  load();
  return root;
}

/* ── ملف العميل عند الفريق: طلبات التأجيل وملاحق العقود ── */
var SU = {};
function staffUser(uid, paint) {
  var c = SU[uid];
  if (c && (c.st === 'ok' || c.st === 'load') && Date.now() - c.at < 60000) return c;
  c = SU[uid] = { st: 'load', at: Date.now(), reqs: (c && c.reqs) || [], anx: (c && c.anx) || [] };
  staffApi()('GET', '/admin/api/crq-user/' + uid).then(function (j) { var nr = j.reqs || [], na = j.annexes || [], chg = JSON.stringify([nr, na]) !== JSON.stringify([c.reqs, c.anx]); c.st = 'ok'; c.at = Date.now(); c.reqs = nr; c.anx = na; if (chg && paint) paint(); }, function (e) { c.st = 'err'; c.err = e.message; });
  return c;
}
function goReq(id, kind) { try { sessionStorage.setItem('crq.nav', JSON.stringify({ id: id, tab: 'req', nav: 1, kind: kind || 'defer' })); } catch (e) { void e; } if (window.__teraApp && window.__teraApp.go) window.__teraApp.go(kind === 'merge' ? 'cu-crq-merge' : 'cu-crq-defer'); } /* v946 */
function staffReqs(o) {
  var c = staffUser(o.uid, o.paint);
  var L = c.reqs || [];
  if (!L.length) return c.st === 'load' ? el('div', { class: 'cc cx-ur' }, [el('p', { class: 'cx-hint', text: 'جارٍ تحميل طلبات التأجيل…' })]) : null;
  return el('div', { class: 'cc cx-ur', dir: 'rtl' }, L.map(function (r) {
    var an = (c.anx || []).filter(function (a) { return a.no === r.no; })[0];
    return el('div', { class: 'cx-rl' }, [el('span', { class: 'cx-ic is-rs' }, [icon('resched')]), el('div', { class: 'cx-rl-t' }, [el('b', {}, [(r.kind_t || 'تأجيل دفعة') + ' · ', el('bdi', { dir: 'ltr', text: r.no })]),
      el('small', { text: 'العقد ' + r.contract_no + ' · قُدّم ' + day(r.created_at) + (r.executed_at ? ' · نُفّذ ' + day(r.executed_at) : '') + (an ? ' — ملحق ' + an.n : '') + (r.wait ? ' · بانتظار استكمال العميل' : '') })]),
      el('span', { class: 'cc-badge is-' + (r.tone || 'info'), text: r.state === 'closed' && r.close_t ? 'مغلق · ' + r.close_t : r.state_t || r.state }),
      el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { goReq(r.id, r.kind); } }, ['فتح الطلب'])]);
  }));
}
function staffAnx(uid, no, paint) { var c = staffUser(uid, paint); return (c.anx || []).filter(function (a) { return a.contract_no === no; }); }

/* تفاصيل الملحق: القيمة قبل وبعد، وما الذي تغيّر، والجدولان */
function anxDetail(a) {
  var R = a.rows || [];
  var pre = R.filter(function (x) { return x.open && !x.added; }), post = R.filter(function (x) { return (x.open || x.added) && !x.merged; });
  var sum = function (L, k) { return L.reduce(function (s, x) { return s + (Number(x[k]) || 0); }, 0); };
  var vb = a.before != null ? Number(a.before) : sum(pre, 'amt_before'), va = a.after != null ? Number(a.after) : sum(post, 'amt_after');
  var lastB = pre.map(function (x) { return d10(x.due_before); }).sort().pop(), lastA = post.map(function (x) { return d10(x.due_after); }).sort().pop();
  var per = function (L, k) { var v = L.map(function (x) { return Number(x[k]) || 0; }); if (!v.length) return '—'; var lo = Math.min.apply(null, v), hi = Math.max.apply(null, v); return hi - lo < 1 ? money(v[0]) : money(lo) + '–' + money(hi); };
  var mons = lastB && lastA ? Math.round((Date.parse(lastA) - Date.parse(lastB)) / (30.44 * 864e5)) : 0;
  var dn = post.length - pre.length;
  var cards = el('div', { class: 'cx-vv' }, [
    ['قيمة الدفعات المتبقية', money(va) + ' ر.س', 'كانت ' + money(vb) + ((va - vb) > 0.004 ? ' · +' + money(va - vb) + ' رسوم التأجيل' : '')],
    ['عدد الدفعات المتبقية', post.length === 1 ? 'دفعة واحدة' : post.length + ' دفعات', 'كانت ' + pre.length + (dn > 0 ? ' · +' + dn + ' جديدة' : dn < 0 ? ' · ' + (-dn) + ' دُمجت' : '')],
    ['قيمة الدفعة', per(post, 'amt_after') + ' ر.س', 'كانت ' + per(pre, 'amt_before')],
    ['آخر موعد', dmy(lastA), 'كان ' + dmy(lastB) + (mons > 0 ? ' · +' + mons + (mons === 1 ? ' شهر' : mons === 2 ? ' شهران' : mons <= 10 ? ' أشهر' : ' شهرًا') : '')]
  ].map(function (c) { return el('div', {}, [el('small', { text: c[0] }), el('b', {}, [el('bdi', { text: c[1] })]), c[2] ? el('em', {}, [el('bdi', { text: c[2] })]) : null]); }));
  var ch = [];
  R.filter(function (x) { return x.open && !x.merged && !x.added && d10(x.due_after) !== d10(x.due_before); }).forEach(function (x) { ch.push(['mv', '↻', 'الدفعة ' + x.seq + ' نُقلت من ' + dmy(x.due_before) + ' إلى ' + dmy(x.due_after) + '، وصارت قيمتها ' + money(x.amt_after) + ' ر.س.']); });
  var ad = R.filter(function (x) { return x.added; });
  if (ad.length) ch.push(['ad', '+', 'أُضيفت ' + (ad.length === 1 ? 'دفعة جديدة' : ad.length + ' دفعات جديدة') + ': ' + ad.map(function (x) { return x.seq + ' (' + dmy(x.due_after) + ')'; }).join('، ') + '.']);
  var mg = R.filter(function (x) { return x.merged; });
  if (mg.length) ch.push(['mg', '⇣', 'دُمجت ' + (mg.length === 1 ? 'الدفعة ' : 'الدفعات ') + mg.map(function (x) { return x.seq; }).join('، ') + ' في الجدول الجديد.']);
  if (a.total != null && Number(a.total) > 0) ch.push(['fe', '٪', 'رسوم التأجيل ' + (a.fees != null ? money(a.fees) + ' + ضريبة ' + money(a.vat) + ' = ' : '') + money(a.total) + ' ر.س، وُزّعت على ' + (post.length === 1 ? 'الدفعة' : post.length + ' دفعات') + '.']);
  var tb = function (side) { var t = anxTable(a, side); return el('div', { class: 'cx-tw' }, [el('b', { text: side === 'before' ? 'الجدول قبل الملحق' : 'الجدول بعد الملحق' }), t]); };
  return [cards, ch.length ? el('ul', { class: 'cx-chg' }, ch.map(function (c) { return el('li', { class: 'is-' + c[0] }, [el('i', { text: c[1] }), el('span', { text: c[2] })]); })) : null, el('div', { class: 'cx-ba' }, [tb('before'), tb('after')])];
}
function annexView(o) {
  var A = (o.rows || []).slice().sort(function (p, q) { return q.n - p.n; });
  return el('div', { class: 'cc cx-anxv', dir: 'rtl' }, A.map(function (a) {
    return el('section', { class: 'cx-anx1' }, [el('div', { class: 'cx-anx1-h' }, [el('b', { text: 'ملحق ' + a.n + ' — تأجيل دفعة' }), el('span', { class: 'cc-badge is-info' }, [el('bdi', { dir: 'ltr', text: a.no })]), el('small', { class: 'cx-hint', text: 'نُفّذ ' + stamp(a.executed_at) + ' · بتوقيع العميل' }),
      a.id && o.staff ? el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { goReq(a.id); } }, ['فتح الطلب']) : null])].concat(anxDetail(a)));
  }));
}

/* ── الإعدادات: الردود الجاهزة وأنواع المطلوبات ── */
function listsEditor(o) {
  var api = o.api || staffApi(), S = { L: null, busy: false, err: '', msg: '' }, root = el('div', { class: 'cc cx-le', dir: 'rtl' });
  async function load() { try { var j = await api('GET', '/admin/api/crq-lists'); S.L = j.lists || { replies: [], types: [] }; } catch (e) { S.err = e.message; S.L = { replies: [], types: [] }; } paint(); }
  function nextK() { var mx = 40; (S.L.replies || []).forEach(function (r) { var m = /^8\.(\d{2,3})$/.exec(r.k); if (m) mx = Math.max(mx, Number(m[1])); }); return '8.' + String(mx + 1); }
  function paint() {
    root.innerHTML = '';
    if (!S.L) { root.appendChild(el('p', { class: 'cx-hint', text: 'جارٍ التحميل…' })); return; }
    var R = S.L.replies, T = S.L.types;
    var rp = el('div', { class: 'cx-le-l' }, R.map(function (r, i) { return el('div', { class: 'cx-le-r' + (r.active === false ? ' is-off' : '') }, [el('code', { text: r.k }),
      el('div', { class: 'cx-le-f' }, [el('div', { class: 'cx-g2' }, [el('input', { type: 'text', maxlength: '80', value: r.title, 'aria-label': 'العنوان', oninput: function (e) { r.title = e.target.value; } }),
        el('select', { 'aria-label': 'التصنيف', onchange: function (e) { r.cat = e.target.value; } }, [['ask', 'طلب الاستكمال'], ['follow', 'الاستلام والمتابعة'], ['decision', 'القرار']].map(function (c) { return el('option', { value: c[0], selected: r.cat === c[0], text: c[1] }); }))]),
        el('textarea', { rows: '2', maxlength: '1000', 'aria-label': 'النص', oninput: function (e) { r.body = e.target.value; } }, [r.body || ''])]),
      el('button', { type: 'button', class: 'cx-sw' + (r.active === false ? '' : ' is-on'), role: 'switch', 'aria-checked': r.active === false ? 'false' : 'true', 'aria-label': 'مفعّل', 'data-live-ok': '', onclick: function () { r.active = r.active === false; paint(); } }, [el('i', {})])]); }));
    var tp = el('div', { class: 'cx-le-l' }, T.map(function (t) { return el('div', { class: 'cx-le-r' + (t.active === false ? ' is-off' : '') }, [el('code', { text: t.grp === 'guar' ? 'ضمان' : 'مستند' }),
      el('div', { class: 'cx-le-f' }, [el('div', { class: 'cx-g2' }, [el('input', { type: 'text', maxlength: '80', value: t.title, 'aria-label': 'النوع', oninput: function (e) { t.title = e.target.value; } }),
        el('select', { 'aria-label': 'القيمة التلقائية', onchange: function (e) { t.auto = e.target.value; } }, [['', 'بلا قيمة تلقائية'], ['gap', 'القيمة = الفجوة'], ['pay', 'المبلغ = قيمة الدفعة'], ['count', 'العدد = الدفعات المتبقية']].map(function (c) { return el('option', { value: c[0], selected: (t.auto || '') === c[0], text: c[1] }); }))]),
        el('input', { type: 'text', maxlength: '200', value: t.detail || '', 'aria-label': 'ما يُطلب من العميل', placeholder: 'ما يُطلب من العميل', oninput: function (e) { t.detail = e.target.value; } })]),
      el('button', { type: 'button', class: 'cx-sw' + (t.active === false ? '' : ' is-on'), role: 'switch', 'aria-checked': t.active === false ? 'false' : 'true', 'aria-label': 'مفعّل', 'data-live-ok': '', onclick: function () { t.active = t.active === false; paint(); } }, [el('i', {})])]); }));
    root.appendChild(el('div', { class: 'cx-le-g' }, [
      el('section', {}, [el('div', { class: 'cx-h' }, [el('h3', { text: 'الردود الجاهزة' }), el('small', { class: 'cx-hint', text: 'فهرس 8.4x · المتغيرات: {الاسم} {رقم الطلب} {العقد} {المطلوب} {المستند} {المهلة} {الفجوة}' }), el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { R.push({ k: nextK(), cat: 'follow', title: '', body: '', active: true }); paint(); } }, [icon('plus'), 'رد جديد'])]), rp]),
      el('section', {}, [el('div', { class: 'cx-h' }, [el('h3', { text: 'أنواع المطلوبات' }), el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { var k = 'doc' + (T.length + 1); while (T.some(function (z) { return z.k === k; })) k += 'x'; T.push({ k: k, grp: 'doc', title: '', detail: '', auto: '', types: 'any', mb: 5, active: true }); paint(); } }, [icon('plus'), 'نوع جديد'])]), tp])]));
    if (S.err) root.appendChild(el('p', { class: 'cx-err', role: 'alert', text: S.err }));
    root.appendChild(el('div', { class: 'cx-acts' }, [el('button', { type: 'button', class: 'cc-btn is-pri', disabled: S.busy, 'data-live-ok': '', onclick: save }, [icon('check'), S.busy ? 'جارٍ الحفظ…' : 'حفظ الردود والأنواع'])]));
  }
  async function save() {
    var bad = S.L.replies.some(function (r) { return String(r.title || '').trim().length < 2 || String(r.body || '').trim().length < 2; }) || S.L.types.some(function (t) { return String(t.title || '').trim().length < 2; });
    if (bad) { S.err = 'أكمل العنوان والنص لكل رد، واسم كل نوع.'; paint(); return; }
    try { S.busy = true; S.err = ''; paint(); var j = await api('POST', '/admin/api/crq-lists', { replies: S.L.replies, types: S.L.types }); S.L = j.lists; S.busy = false; paint(); if (o.toast) o.toast(true, 'حُفظت الردود الجاهزة وأنواع المطلوبات.'); }
    catch (e) { S.busy = false; S.err = e.message; paint(); if (o.toast) o.toast(false, e.message); }
  }
  paint(); load();
  return root;
}

/* ===== v946: «توحيد عقودي» — طلب توحيد العقود في منظومة طلبات العقود (crq_) =====
* الأجزاء والهوية نفسها في «طلب تأجيل دفعة»: العقود المتأخرة بالأحمر، والعقد الذي عليه طلب قائم مقفل، وسطر واحد للمتبقي بلا تكرار.
* الطلب نوعان: توحيد عقدين أو أكثر، أو توحيد مع منتج إضافي (قيمة المنتج يحددها العميل، والفريق يراجع ويصلك العرض برابط واحد). */
var MG_STEPS = ['اختيار العقود', 'مراجعة فريق تيرا', 'موافقتك على العرض', 'توقيع العقد', 'العقد الموحّد'];
var MG_MONTHS = [['6', '6 أشهر'], ['12', '12 شهرًا'], ['18', '18 شهرًا'], ['24', '24 شهرًا'], ['team', 'يحددها الفريق']];
/* v953: مدة خطة الدفع التي يقترحها العميل — الدورية بأيقونة (يومي · أسبوعي · شهري · نصف سنوي) والعدد في المربع، أو «يحددها الفريق» */
var MG_UNITS = [['day', 'يومي', 'كل يوم'], ['week', 'أسبوعي', 'كل أسبوع'], ['month', 'شهري', 'كل شهر'], ['half', 'نصف سنوي', 'كل 6 أشهر']];
function durCtl(S) { /* v954: حالة صفحة التوحيد تُمرَّر صراحة — كانت خارج نطاقها فتتوقف الصفحة */
var team = S.months === 'team', w = el('div', { class: 'cx-dur' + (S.miss && S.miss.indexOf('months') >= 0 ? ' is-miss' : '') });
var paintD = function () {
w.innerHTML = ''; team = S.months === 'team';
w.appendChild(el('div', { class: 'cx-dur-u', role: 'radiogroup', 'aria-label': 'دورية الدفعات' }, MG_UNITS.map(function (u) { var on = !team && (S.unit || 'month') === u[0]; return el('button', { type: 'button', 'data-live-ok': '', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: 'cx-dur-i' + (on ? ' is-on' : ''), onclick: function () { S.unit = u[0]; if (S.months === 'team') S.months = ''; paintD(); } }, [el('b', { text: u[1] }), el('small', { text: u[2] })]); })));
var inp = el('input', { type: 'number', min: '1', max: '120', inputmode: 'numeric', value: team ? '' : S.months, placeholder: 'العدد', disabled: team, 'aria-label': 'عدد الدفعات', oninput: function (e) { var v = e.target.value.replace(/\D/g, '').slice(0, 3); S.months = v && Number(v) >= 1 && Number(v) <= 120 ? v : ''; } });
w.appendChild(el('div', { class: 'cx-dur-r' }, [el('label', { class: 'cx-dur-n' }, [el('span', { text: 'عدد الدفعات' }), inp]),
el('label', { class: 'cx-dur-t' }, [el('input', { type: 'checkbox', checked: team, onchange: function (e) { S.months = e.target.checked ? 'team' : ''; paintD(); } }), el('span', { text: 'يحددها الفريق' })])]));
};
paintD();
return w;
}
function mgCnt(n) { n = Number(n) || 0; return n === 1 ? 'عقد واحد' : n === 2 ? 'عقدان' : n <= 10 ? n + ' عقود' : n + ' عقدًا'; }
function mgPay(n) { n = Number(n) || 0; return n === 1 ? 'دفعة واحدة' : n === 2 ? 'دفعتان' : n <= 10 ? n + ' دفعات' : n + ' دفعة'; }
var MG_RECV = [['ship', 'شحن إلى عنواني'], ['pickup', 'استلام من مقر المنصة'], ['proxy', 'استلام بالتوكيل (وكيل)'], ['sellproxy', 'توكيل بالبيع لطرف ثالث نيابة عنكم'], ['digital', 'تسليم إلكتروني (للمنتجات الرقمية)']];
var MG_RD = { proxy: 'اسم الوكيل وجواله', ship: 'عنوان الشحن (إن كان غير عنوانك المسجّل)', digital: 'الجوال أو البريد للتسليم (إن كان غير المسجّل)' };
function mergePage(o) {
o = o || {};
var S = { opts: null, mine: null, today: '', note0: '', err: '', sel: [], prod: '', pv: '', pt: '', pk: '', pz: null, det: '', recv: '', rd: '', prods: null, months: '', unit: 'month', note: '', ack: false, miss: [], busy: false, done: null, chat: null, confirm: null };
var root = el('div', { class: 'cc cc-mg', dir: 'rtl' });
async function api(method, path, body) {
var t = await o.token();
var r = await fetch(path, { method: method, cache: 'no-store', credentials: 'same-origin', headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
var j = null; try { j = await r.json(); } catch (e) { j = null; }
if (!r.ok || !j || j.ok === false) throw new Error((j && j.message) || 'تعذّر تنفيذ الطلب الآن.');
return j;
}
async function load() {
if (!S.prods) api('GET', '/api/account/crq/products').then(function (j) { S.prods = j.rows || []; paint(); }).catch(function () { S.prods = []; paint(); }); /* v949: قائمة المنتجات */
try { var a = await Promise.all([api('GET', '/api/account/crq/options'), api('GET', '/api/account/crq')]); S.opts = a[0].contracts || []; S.today = a[0].today || ''; S.note0 = a[0].mg_note || ''; S.mine = (a[1].rows || []).filter(function (r) { return r.kind === 'merge'; }); S.err = ''; }
catch (e) { S.err = e.message; S.opts = S.opts || []; S.mine = S.mine || []; }
S.sel = S.sel.filter(function (n) { return S.opts.some(function (c) { return c.no === n && !c.busy; }); });
paint();
}
function remOf(c) { return (c.payments || []).reduce(function (a, p) { return a + (Number(p.part ? p.left : p.amount) || 0); }, 0); }
function stepper(cur) { return el('ol', { class: 'cc-steps', 'aria-label': 'مراحل طلب التوحيد' }, MG_STEPS.map(function (t, i) { return el('li', { class: i < cur ? 'is-done' : i === cur ? 'is-now' : '' }, [el('span', { text: String(i + 1) }), t]); })); }
function miss(k) { return S.miss.indexOf(k) >= 0 ? ' is-miss' : ''; }
function chips(L, cur, set, key) { return el('div', { class: 'cc-chips' + miss(key), role: 'radiogroup' }, L.map(function (x) { var on = cur === x[0]; return el('button', { type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: 'cc-chip' + (on ? ' is-on' : ''), 'data-live-ok': '', onclick: function () { set(x[0]); S.miss = []; paint(); } }, [x[1]]); })); }
function form() {
var today = todayIso(S.today), out = [stepper(0)];
if (!S.opts.length) return out.concat([el('div', { class: 'cc-note' }, [icon('alert'), el('span', { text: 'لا توجد عقود قائمة بدفعات متبقية يمكن توحيدها الآن.' })])]);
var sel = S.opts.filter(function (c) { return S.sel.indexOf(c.no) >= 0; });
out.push(el('div', { class: 'cc-legend', 'aria-hidden': 'true' }, [['late', 'عليه دفعات متأخرة'], ['open', 'منتظم'], ['busy', 'في طلب قائم']].map(function (x) { return el('span', {}, [el('i', { class: 'is-' + x[0] }), x[1]]); })));
out.push(el('div', { class: 'cc-sh is-a' + miss('sel') }, [el('b', { text: '١. العقود المراد توحيدها' }), el('span', { text: (sel.length ? mgCnt(sel.length) + ' محددة' : 'لم تُحدَّد') + ' · عقدان على الأقل، أو عقد مع منتج' })]));
out.push(el('div', { class: 'cc-pays cc-mgcs' + miss('sel'), role: 'group', 'aria-label': 'العقود' }, S.opts.map(function (c, i) {
var lt = lateOf(c, today), on = S.sel.indexOf(c.no) >= 0, k = c.busy ? 'busy' : lt.n ? 'late' : 'open';
var ctl = c.busy ? el('span', { class: 'cc-lock', title: 'لا يمكن اختياره حتى يُغلق الطلب ' + c.busy + ' أو يُنفَّذ' }, [icon('lock')])
: el('input', { type: 'checkbox', checked: on, 'aria-label': 'العقد ' + c.no, onchange: function (e) { S.sel = S.sel.filter(function (n) { return n !== c.no; }); if (e.target.checked) S.sel.push(c.no); S.miss = []; paint(); } });
return el('label', { class: 'cc-pay cc-mgc is-' + k + (on ? ' is-on' : '') }, [el('span', { class: 'cc-pay-n', text: String(i + 1) }),
el('span', { class: 'cc-pay-m' }, [el('b', {}, [el('bdi', { dir: 'ltr', text: c.no })]), el('small', { class: 'cc-muted', text: (c.product ? c.product + ' · ' : (/^TRA-/.test(c.no) ? 'عقد موحّد · ' : '')) + mgPay((c.payments || []).length) + ' متبقية' }),
el('span', { class: 'cc-pill is-' + k, text: c.busy ? 'في طلب قائم ' + c.busy : lt.n ? cntW(lt.n, 'متأخرة', 'متأخرتان') : 'منتظم' })]),
el('span', { class: 'cc-pay-a' }, [el('bdi', { dir: 'ltr', text: money(remOf(c)) }), ' ر.س', el('small', { text: 'المتبقي' })]), ctl]);
})));
if (sel.length) {
var rem = sel.reduce(function (a, c) { return a + remOf(c); }, 0), late = sel.reduce(function (a, c) { return a + lateOf(c, today).sum; }, 0);
out.push(el('div', { class: 'cc-mg-line' }, [el('span', {}, ['المتبقي على العقود المختارة', late > 0 ? el('em', {}, ['منه متأخر ', el('bdi', { dir: 'ltr', text: money(late) })]) : null]), el('b', {}, [el('bdi', { dir: 'ltr', text: money(rem) }), ' ر.س'])]));
}
var prod = [el('h4', { text: 'هل ترغب بشراء منتج آخر مع التوحيد؟' }), el('p', { class: 'cc-muted', text: 'يُضاف المنتج إلى العقد الموحّد بخطة دفع واحدة.' }), chips([['no', 'لا، توحيد فقط'], ['yes', 'نعم، مع منتج']], S.prod, function (v) { S.prod = v; }, 'prod')];
if (S.prod === 'yes') {
/* v949: المنتج من القائمة (البطاقات · الأجهزة · أخرى) · القيمة · التفاصيل · وسيلة الاستلام */
var PR = S.prods || [], secs = []; PR.forEach(function (z) { if (secs.indexOf(z.section) < 0) secs.push(z.section); });
prod.push(el('div', { class: 'cc-field' + miss('pk') }, [el('label', { text: 'المنتج' }), el('select', { class: 'cc-sel', onchange: function (e) { var z = PR.filter(function (q) { return q.key === e.target.value; })[0]; S.pk = e.target.value; S.pz = z || null; if (z && !(Number(S.pv) > 0) && Number(z.price) > 0) S.pv = String(z.price); S.miss = []; paint(); } },
[el('option', { value: '', selected: !S.pk, text: S.prods ? 'اختر المنتج…' : 'جارٍ تحميل المنتجات…' })].concat(secs.map(function (g) { return el('optgroup', { label: g }, PR.filter(function (z) { return z.section === g; }).map(function (z) { return el('option', { value: z.key, selected: S.pk === z.key, text: z.name }); })); }), [el('option', { value: '__other', selected: S.pk === '__other', text: 'منتج آخر' })]))]));
if (S.pk === '__other') prod.push(el('div', { class: 'cc-field' + miss('pt') }, [el('label', { text: 'اسم المنتج' }), el('input', { type: 'text', value: S.pt || '', maxlength: '80', placeholder: 'اكتب اسم المنتج', oninput: function (e) { S.pt = e.target.value; } })]));
prod.push(el('div', { class: 'cc-field' + miss('pv') }, [el('label', { text: 'قيمة المنتج (ريال، قبل الضريبة)' }), el('input', { type: 'text', inputmode: 'decimal', value: S.pv || '', placeholder: 'مثال: 400', maxlength: '9', oninput: function (e) { S.pv = e.target.value.replace(/[^\d.]/g, ''); e.target.value = S.pv; } })]));
prod.push(el('div', { class: 'cc-field' }, [el('label', { text: 'تفاصيل المنتج (اختياري)' }), el('input', { type: 'text', value: S.det || '', maxlength: '300', placeholder: 'مثال: 4 بطاقات فئة 100 ريال، أو اللون والسعة', oninput: function (e) { S.det = e.target.value; } })]));
prod.push(el('div', { class: 'cc-field' + miss('recv') }, [el('label', { text: 'وسيلة الاستلام' }), chips(MG_RECV, S.recv, function (v) { S.recv = v; }, 'recv')]));
if (MG_RD[S.recv]) prod.push(el('div', { class: 'cc-field' }, [el('label', { text: MG_RD[S.recv] }), el('input', { type: 'text', value: S.rd || '', maxlength: '200', oninput: function (e) { S.rd = e.target.value; } })]));
}
var prop = [el('h4', { text: 'مدة خطة الدفع التي تقترحها' }), el('p', { class: 'cc-muted', text: 'اقتراح يراه الفريق عند دراسة طلبك — القرار النهائي في العرض الذي يصلك للموافقة.' }), durCtl(S),
el('div', { class: 'cc-field' }, [el('label', { text: 'ملاحظة للفريق (اختياري)' }), el('textarea', { rows: '2', maxlength: '300', placeholder: 'اكتب ما تريد أن يعرفه الفريق…', oninput: function (e) { S.note = e.target.value; } }, [S.note || ''])])];
out.push(el('div', { class: 'cc-mg-grid' }, [el('div', {}, [el('div', { class: 'cc-sh is-b' }, [el('b', { text: '٢. منتج إضافي' })]), el('div', { class: 'cc-prop' }, prod)]),
el('div', {}, [el('div', { class: 'cc-sh is-b' }, [el('b', { text: '٣. اقتراحك' })]), el('div', { class: 'cc-prop' }, prop)])]));
out.push(el('div', { class: 'cc-note is-info' }, [icon('clock'), el('span', { text: S.note0 || 'يراجع فريق تيرا طلبك ويحدد خطة الدفع ورسم التوحيد، ويصلك العرض برابط للموافقة قبل أي تغيير على عقودك.' })]));
if (sel.length) out.push(el('label', { class: 'cc-ack' + miss('ack') }, [el('input', { type: 'checkbox', checked: S.ack, onchange: function (e) { S.ack = e.target.checked; S.miss = []; } }),
el('span', { text: 'أطلب توحيد العقود المختارة' + (S.prod === 'yes' ? ' مع المنتج الإضافي' : '') + ' في عقد واحد، وأعلم أن العقود السابقة تُغلق بعد توقيعي على العقد الموحّد.' })]));
if (S.opts.some(function (x) { return x.busy; })) out.push(el('div', { class: 'cc-note is-info' }, [icon('alert'), el('span', { text: 'العقد الذي عليه طلب قائم (تأجيل أو توحيد) يُتاح بعد إغلاق طلبه، وباقي عقودك متاحة الآن.' })]));
if (S.err) out.push(el('p', { class: 'cc-err', role: 'alert', text: S.err }));
out.push(el('div', { class: 'cc-acts' }, [el('button', { type: 'button', class: 'cc-btn is-pri', disabled: S.busy, 'data-live-ok': '', onclick: submit }, ['إرسال طلب التوحيد']), o.back ? el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: o.back }, ['رجوع']) : null]));
return out;
}
function check() {
var m = [], n = S.sel.length;
if (!n || (n < 2 && S.prod !== 'yes')) m.push('sel');
if (!S.prod) m.push('prod');
if (S.prod === 'yes' && !(Number(S.pv) > 0)) m.push('pv');
if (S.prod === 'yes' && !S.pk) m.push('pk');
if (S.prod === 'yes' && S.pk === '__other' && String(S.pt || '').trim().length < 2) m.push('pt');
if (S.prod === 'yes' && !S.recv) m.push('recv');
if (!S.months) m.push('months');
if (n && !S.ack) m.push('ack');
return m;
}
async function submit() {
var m = check(); S.miss = m;
if (m.length) { S.err = m.indexOf('sel') >= 0 ? (S.sel.length === 1 ? 'لتوحيد عقد واحد اختر «نعم، مع منتج»، أو اختر عقدًا آخر.' : 'اختر العقود المراد توحيدها.') : ''; paint(); var f = root.querySelector('.is-miss'); if (f) f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
S.busy = true; S.err = ''; paint();
try {
var j = await api('POST', '/api/account/crq', { kind: 'merge', contract_nos: S.sel.slice(), note: String(S.note || '').trim(), prop: { months: S.months === 'team' ? null : S.months, unit: S.unit || 'month', team: S.months === 'team', product: S.prod === 'yes' ? { on: true, value: S.pv, type: S.pk === '__other' ? String(S.pt || '').trim() : (S.pz ? S.pz.name : ''), sec: S.pz ? S.pz.section : '', pk: S.pk, det: String(S.det || '').trim(), recv: S.recv, rd: String(S.rd || '').trim() } : null } });
S.done = j; S.busy = false; S.sel = []; S.prod = ''; S.pv = ''; S.pt = ''; S.pk = ''; S.pz = null; S.det = ''; S.recv = ''; S.rd = ''; S.months = ''; S.unit = 'month'; S.note = ''; S.ack = false; load();
} catch (e) { S.busy = false; S.err = e.message; paint(); }
}
/* v961: قائمة طلبات التوحيد — صف مضغوط لكل طلب، يُفتح طلب واحد فقط؛ المراسلة عند الطلب؛ السابقة مطويّة */
function mineList(withNew) {
if (!S.mine || !S.mine.length) return null;
var END = ['done', 'closed', 'rejected', 'cancelled', 'withdrawn', 'expired'];
var act = S.mine.filter(function (r) { return END.indexOf(r.state) < 0; }), past = S.mine.filter(function (r) { return END.indexOf(r.state) >= 0; });
if (window.TQ_MG_FOCUS) { var fr = S.mine.filter(function (r) { return r.no === window.TQ_MG_FOCUS; })[0]; if (fr) { S.open = fr.id; if (END.indexOf(fr.state) >= 0) S.past = true; } window.TQ_MG_FOCUS = null; }
if (S.open == null) S.open = act.length ? act[0].id : -1;
function stageT(r) {
var st = STEP_OF[r.state];
if (r.state === 'done') return 'نُفّذ' + (r.new_contract ? ' — عقدك الموحّد ' + r.new_contract : '');
if (r.state === 'closed') return r.close_t ? 'مغلق · ' + r.close_t : 'مغلق';
if (END.indexOf(r.state) >= 0) return r.state_t || '';
return st >= 0 && st < MG_STEPS.length ? 'المرحلة ' + (st + 1) + ' من ' + MG_STEPS.length + ': ' + MG_STEPS[st] : (r.state_t || '');
}
function head(r, on) {
var c = r.chat || {}, need = Number(c.open) > 0;
return el('button', { type: 'button', class: 'cc-row-h mg-rh', 'data-live-ok': '', 'aria-expanded': on ? 'true' : 'false', onclick: function () { S.open = on ? -1 : r.id; S.chat = null; paint(); } }, [
el('span', { class: 'mg-rh-m' }, [el('b', {}, [el('bdi', { dir: 'ltr', text: r.no })]), el('small', { text: stageT(r) })]),
el('span', { class: 'mg-rh-s' }, [need ? el('span', { class: 'cc-badge is-warn', text: 'مطلوب منك' }) : el('span', { class: 'cc-badge is-' + (r.tone || 'info'), text: r.state_t || '' }), el('span', { class: 'mg-rh-c' + (on ? ' is-on' : ''), 'aria-hidden': 'true' })])]);
}
function body(r) {
var pr = r.product && r.product.on ? r.product : null, st = STEP_OF[r.state], c = r.chat || {}, isEnd = END.indexOf(r.state) >= 0, chatOn = S.chat === r.id;
var nos = String(r.contract_no || '').split('+').map(function (s) { return s.trim(); }).filter(Boolean);
var kv = [['العقود المراد توحيدها (' + nos.length + ')', el('ol', { class: 'mg-cts' }, nos.map(function (no, i) { var oc = (S.opts || []).filter(function (q) { return q.no === no; })[0]; return el('li', {}, [el('span', { class: 'mg-ct-i', text: 'العقد ' + (i + 1) }), el('bdi', { dir: 'ltr', text: no }), oc && oc.product ? el('small', { text: oc.product }) : (/^TRA-/.test(no) ? el('small', { text: 'عقد موحّد سابق' }) : null)]); }))]];
if (pr) kv.push(['منتج إضافي', (pr.type || 'منتج') + ' بقيمة ' + money(pr.value) + ' ر.س']);
if (r.total != null) kv.push(['قيمة العقد الموحّد', money(r.total) + ' ر.س']);
if (r.new_contract) kv.push(['عقدك الموحّد', r.new_contract]);
var out = [];
if (!isEnd && st >= 0) out.push(stepper(st));
out.push(el('dl', { class: 'mg-kv' }, [].concat.apply([], kv.map(function (k) { return [el('dt', { text: k[0] }), el('dd', {}, [typeof k[1] === 'string' ? el('bdi', { text: k[1] }) : k[1]])]; }))));
if (r.state === 'consent' || r.state === 'sign') out.push(el('div', { class: 'cc-note is-info' }, [icon('link'), el('span', { text: r.state === 'consent' ? 'أرسلنا لك العرض برابط على واتساب والبريد — افتحه للموافقة أو الاعتذار.' : 'أرسلنا لك عقد التوحيد للتوقيع برابط على واتساب والبريد.' })]));
var asks = Number(c.open) > 0 || (!isEnd && Number(c.done) > 0);
if (asks || chatOn) out.push(needCard({ r: r, token: o.token, onChange: load, chat: chatOn }));
var acts = [];
if (Number(c.n) || !isEnd) acts.push(el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { S.chat = chatOn ? null : r.id; paint(); } }, [icon('mail'), chatOn ? 'إخفاء المراسلة' : 'مراسلة فريق تيرا']));
if (r.state === 'received') acts.push(el('button', { type: 'button', class: 'cc-btn is-sm is-ghost', 'data-live-ok': '', onclick: function () { cancel(r); } }, ['إلغاء الطلب']));
if (acts.length) out.push(el('div', { class: 'mg-acts' }, acts));
return el('div', { class: 'mg-rb' }, out);
}
function row(r) { var on = S.open === r.id; return el('div', { class: 'cc-row mg-r is-' + (r.tone || 'info') + (on ? ' is-on' : '') }, [head(r, on), on ? body(r) : null]); }
var top = el('div', { class: 'mg-lh' }, [el('h3', { text: act.length ? 'طلباتك الحالية' : 'طلبات التوحيد' }), withNew ? el('button', { type: 'button', class: 'cc-btn is-sm is-pri', 'data-live-ok': '', onclick: function () { S.newReq = true; paint(); } }, ['+ طلب توحيد جديد']) : null]);
var kids = [top];
if (act.length) kids.push(el('div', { class: 'mg-rows' }, act.map(row)));
if (past.length) kids.push(el('div', { class: 'mg-past' + (S.past ? ' is-on' : '') }, [el('button', { type: 'button', class: 'mg-past-t', 'data-live-ok': '', 'aria-expanded': S.past ? 'true' : 'false', onclick: function () { S.past = !S.past; paint(); } }, [el('span', { text: 'الطلبات السابقة (' + past.length + ')' }), el('span', { class: 'mg-rh-c' + (S.past ? ' is-on' : ''), 'aria-hidden': 'true' })]), S.past ? el('div', { class: 'mg-rows' }, past.map(row)) : null]));
return el('section', { class: 'cc-card mg-list' }, kids);
}
function chatOf(r) { return null; }
async function cancel(r) {
if (S.confirm !== r.id) { S.confirm = r.id; paint(); return; }
try { await api('POST', '/api/account/crq/' + r.id + '/cancel', {}); S.confirm = null; load(); } catch (e) { S.err = e.message; paint(); }
}
function paint() {
root.innerHTML = '';
if (!S.opts) { root.appendChild(el('div', { class: 'cc-card' }, [el('p', { text: 'جارٍ التحميل…' })])); return; }
if (S.done) {
root.appendChild(el('section', { class: 'cc-card cc-done' }, [icon('check'), el('h2', { text: 'أُرسل طلب التوحيد' }), el('p', {}, ['رقم الطلب ', el('bdi', { dir: 'ltr', text: S.done.no })]),
el('p', { text: 'يراجعه فريق تيرا ويصلك العرض برابط للموافقة على واتساب والبريد.' }), el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: function () { S.done = null; paint(); } }, ['طلب آخر'])]));
} else { /* v956: طلب قائم أولًا — والنموذج الجديد عند الطلب فقط، بلا ازدواجية */
var openR = (S.mine || []).filter(function (q) { return ['done', 'closed', 'rejected', 'cancelled', 'withdrawn', 'expired'].indexOf(q.state) < 0; });
if (openR.length && !S.newReq) { var ml0 = mineList(true); if (ml0) root.appendChild(ml0); }
else { root.appendChild(el('section', { class: 'cc-card' }, [el('h2', { text: 'طلب توحيد العقود' })].concat(form()))); var ml1 = mineList(); if (ml1) root.appendChild(ml1); }
}
if (S.done) { var ml = mineList(); if (ml) root.appendChild(ml); }
if (S.confirm) {
var r = (S.mine || []).filter(function (x) { return x.id === S.confirm; })[0];
if (r) root.appendChild(el('div', { class: 'cc-card cc-confirm' }, [el('p', { text: 'إلغاء الطلب ' + r.no + '؟ لا يمكن التراجع.' }), el('div', { class: 'cc-acts' }, [el('button', { type: 'button', class: 'cc-btn is-pri', 'data-live-ok': '', onclick: function () { cancel(r); } }, ['نعم، ألغِ الطلب']), el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: function () { S.confirm = null; paint(); } }, ['رجوع'])])]));
}
}
paint(); load();
return root;
}


window.CRQC = { page: page, mergePage: mergePage, picker: picker, check: check, payload: payload, propText: propText, lateOf: lateOf, annexes: annexes, msgBox: msgBox, askPanel: askPanel, needCard: needCard, staffReqs: staffReqs, staffAnx: staffAnx, staffUser: staffUser, annexView: annexView, listsEditor: listsEditor, goReq: goReq };
})();

/* ═════════ v953 ═════════
* CRQG: طلب الضمان عند العميل — أوافق / لا أوافق (بسبب)، ثم استمارة البيانات التي حددها الفريق، ثم رفع المستند إن طُلب
* الردود الجاهزة: قائمة بحث بدل القائمة الأصلية ذات الرموز · معاينة الرسالة «كما تصل للعميل» تحت مربع الكتابة عند الفريق */
(function () {
'use strict';
function el(t, a, k) {
var e = document.createElement(t); a = a || {};
Object.keys(a).forEach(function (n) { var v = a[n]; if (v == null || v === false) return; if (n === 'text') e.textContent = v; else if (n === 'class') e.className = v; else if (n === 'value') e.value = v; else if (n === 'checked') e.checked = !!v; else if (n.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(n.slice(2), v); else e.setAttribute(n, v === true ? '' : v); });
(k || []).forEach(function f(c) { if (c == null || c === false) return; if (Array.isArray(c)) return c.forEach(f); e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
return e;
}
function money(v) { var n = Number(v) || 0; return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
var PH = { number: 'أرقام فقط', money: '0.00', phone: '05xxxxxxxx', nid: 'رقم الهوية (10 أرقام)', text: '' };
var IM = { number: 'numeric', money: 'decimal', phone: 'tel', nid: 'numeric' };
function item(a, i, cx) {
var F = Array.isArray(a.fields) ? a.fields : [], data = {}, mode = '', box = el('div', { class: 'cx-ni gx is-' + a.state });
var head = function () { return [el('span', { class: 'cx-n', text: a.state === 'done' ? '✓' : String(i + 1) }), el('div', { class: 'gx-t' }, [el('small', { text: 'المطلوب منك' }), el('b', { text: a.title || a.gtype || 'ضمان' }), Number(a.val) > 0 ? el('span', { class: 'gx-a', text: money(a.val) + ' ريال' }) : null, a.detail ? el('p', { class: 'gx-d', text: a.detail }) : null])]; };
var err = el('p', { class: 'cx-err', role: 'alert' });
var call = async function (body) {
err.textContent = '';
try {
var j = await cx.api('POST', '/api/account/crq/ask/' + a.id + '/reply', body);
if (j && j.ok === false) throw new Error(j.message || 'تعذّر الإرسال — أعد المحاولة.');
if (j && j.need_file) { a.state = 'accepted'; a.decision = 'accept'; }
if (cx.reload) cx.reload(); else paint();
} catch (e) { err.textContent = e.message || 'تعذّر الإرسال — أعد المحاولة.'; Array.prototype.forEach.call(box.querySelectorAll('button'), function (b) { b.disabled = false; }); }
};
function form() {
var rows = F.filter(function (z) { return z.type !== 'file'; }).map(function (z) {
var lab = el('span', {}, [z.t, z.req !== false ? el('i', { class: 'gx-req', text: ' *' }) : null]);
if (z.type === 'ack') return el('label', { class: 'gx-f is-ack' }, [el('input', { type: 'checkbox', onchange: function (e) { data[z.k] = e.target.checked ? 'true' : ''; } }), lab]);
if (z.type === 'select') return el('label', { class: 'gx-f' }, [lab, el('select', { onchange: function (e) { data[z.k] = e.target.value; } }, [el('option', { value: '', text: 'اختر' })].concat((z.opts || []).map(function (o) { return el('option', { value: o, text: o }); })))]);
return el('label', { class: 'gx-f' }, [lab, el('input', { type: z.type === 'date' ? 'date' : 'text', inputmode: IM[z.type] || null, dir: /number|money|phone|nid|date/.test(z.type) ? 'ltr' : null, placeholder: PH[z.type] || null, maxlength: '200', oninput: function (e) { data[z.k] = e.target.value.trim(); } })]);
});
var files = F.filter(function (z) { return z.type === 'file'; });
return [rows.length ? el('div', { class: 'gx-form' }, rows) : null, files.length ? el('p', { class: 'cx-hint', text: 'بعد الإرسال ترفع: ' + files.map(function (z) { return z.t; }).join('، ') + '.' }) : null];
}
function paint() {
box.innerHTML = ''; box.className = 'cx-ni gx is-' + a.state;
var kids = head();
if (a.state === 'done' || a.state === 'cancelled' || a.state === 'expired') {
kids.push(el('div', { class: 'gx-res ' + (a.decision === 'decline' ? 'is-no' : 'is-ok'), text: a.decision === 'decline' ? 'اعتذرت' + (a.reason ? ': ' + a.reason : '') : a.state === 'done' ? (a.file_msg ? 'تم الإرفاق — يراجعه فريق تيرا' : 'أكملت المطلوب — شكرًا لك') : a.state === 'expired' ? 'انتهت المهلة' : 'أُلغي الطلب' }));
if (a.state === 'done' && a.file_msg && a.decision !== 'decline') kids.push(el('div', { class: 'gx-file' }, [el('span', { class: 'gx-file-n' }, [el('b', { text: 'المرفق: ' }), el('bdi', { text: (a.file && a.file.name) || 'ملف مرفق' })]), el('span', { class: 'gx-file-a' }, [cx.view ? el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-ghost', onclick: function () { cx.view(a.file_msg); } }, ['عرض']) : null, cx.canRe && cx.up ? el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-ghost', onclick: function () { cx.up(a); } }, ['استبدال']) : null])]));
} else if (a.state === 'accepted') {
kids.push(el('div', { class: 'gx-res is-ok', text: 'وافقت — بقي رفع: ' + (F.filter(function (z) { return z.type === 'file'; }).map(function (z) { return z.t; }).join('، ') || 'المستند') }), el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-pri', onclick: function () { if (cx.up) cx.up(a); } }, ['ارفع صورة أو PDF']));
} else if (mode === 'no') {
var ta = el('textarea', { class: 'gx-ta', rows: '3', maxlength: '300', placeholder: 'اكتب سببًا مختصرًا' });
kids.push(el('label', { class: 'gx-f' }, [el('span', { text: 'سبب عدم الموافقة' }), ta]), err, el('div', { class: 'gx-bs' }, [
el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-no', onclick: function (e) { if (ta.value.trim().length < 3) { err.textContent = 'اكتب سببًا مختصرًا.'; return; } e.target.disabled = true; call({ decision: 'decline', reason: ta.value.trim() }); } }, ['إرسال الرد']),
el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn', onclick: function () { mode = ''; paint(); } }, ['رجوع'])]));
} else if (mode === 'yes') {
kids.push(el('h5', { class: 'gx-h', text: 'أكمل البيانات' + (a.gtype ? ' — ' + a.gtype : '') }), form(), err, el('div', { class: 'gx-bs' }, [
el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-pri', onclick: function (e) {
var miss = F.filter(function (z) { return z.type !== 'file' && z.req !== false && !data[z.k]; })[0];
if (miss) { err.textContent = 'أكمل: ' + miss.t; return; }
e.target.disabled = true; call({ decision: 'accept', data: data }); } }, ['إرسال البيانات']),
el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn', onclick: function () { mode = ''; paint(); } }, ['رجوع'])]));
} else {
kids.push(el('div', { class: 'gx-bs' }, [
el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-pri', onclick: function () { mode = 'yes'; paint(); } }, ['أوافق']),
el('button', { type: 'button', 'data-live-ok': '', class: 'gx-btn is-no', onclick: function () { mode = 'no'; paint(); } }, ['لا أوافق'])]),
el('small', { class: 'cx-hint', text: 'عند «لا أوافق» يُطلب سبب مختصر، ويصل ردك للفريق.' }));
}
kids.forEach(function (k) { if (k) [].concat(k).forEach(function (q) { if (q) box.appendChild(q); }); });
}
paint();
return box;
}
window.CRQG = { item: item };

/* الردود الجاهزة: زر بحث بدل القائمة الأصلية (تبقى مخفية وتُحدَّث كما كانت) */
var CODE = /^\s*\d+(\.\d+)*\s*·\s*/;
function isReady(s) { if (!s.querySelector('optgroup')) return false; if (s.classList.contains('cc-sel') && s.closest('.cc-mg')) { s.__gxT = 'اختيار المنتج'; s.__gxQ = 'ابحث باسم المنتج…'; return true; } var o = s.options; for (var i = 0; i < o.length; i++) if (CODE.test(o[i].text)) return true; return false; }
function nm(t) { return String(t || '').replace(CODE, ''); }
function closePop() { var p = document.querySelector('.gx-pop'); if (p) p.remove(); document.removeEventListener('keydown', escK, true); }
function escK(e) { if (e.key === 'Escape') closePop(); }
function openPop(s, b) {
closePop();
var q = el('input', { type: 'search', class: 'gx-q', placeholder: s.__gxQ || 'ابحث في الردود الجاهزة…', 'aria-label': s.__gxQ || 'بحث في الردود الجاهزة' });
var list = el('div', { class: 'gx-l', role: 'listbox' });
var pop = el('div', { class: 'gx-pop', role: 'dialog', 'aria-label': 'الردود الجاهزة' }, [el('div', { class: 'gx-pop-in' }, [el('div', { class: 'gx-pop-h' }, [el('b', { text: s.__gxT || 'الردود الجاهزة' }), el('button', { type: 'button', 'data-live-ok': '', class: 'gx-x', 'aria-label': 'إغلاق', onclick: closePop }, ['✕'])]), q, list])]);
pop.addEventListener('click', function (e) { if (e.target === pop) closePop(); });
var draw = function () {
list.innerHTML = ''; var t = q.value.trim(), n = 0;
Array.prototype.forEach.call(s.children, function (g) {
var opts = g.tagName === 'OPTGROUP' ? Array.prototype.slice.call(g.children) : [g];
var hit = opts.filter(function (o) { return (o.value || o.text.trim()) && (!t || nm(o.text).indexOf(t) >= 0 || (g.label || '').indexOf(t) >= 0); });
if (!hit.length) return;
if (g.tagName === 'OPTGROUP') list.appendChild(el('div', { class: 'gx-g', text: g.label }));
hit.forEach(function (o) { n++; list.appendChild(el('button', { type: 'button', 'data-live-ok': '', role: 'option', class: 'gx-o' + (o.value === s.value ? ' is-on' : ''), onclick: function () { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); s.dispatchEvent(new Event('input', { bubbles: true })); sync(s, b); closePop(); } }, [nm(o.text)])); });
});
if (!n) list.appendChild(el('p', { class: 'gx-0', text: 'لا نتائج — جرّب كلمة أخرى.' }));
};
q.addEventListener('input', draw); draw();
document.body.appendChild(pop); document.addEventListener('keydown', escK, true); setTimeout(function () { q.focus(); }, 0);
}
function sync(s, b) { var o = s.options[s.selectedIndex]; b.querySelector('span').textContent = o && o.value ? nm(o.text) : (s.__gxT ? 'اختر المنتج من القائمة' : 'اختر ردًا جاهزًا'); }
function enhSel(s) {
if (s.__gx) return; s.__gx = 1;
var b = el('button', { type: 'button', 'data-live-ok': '', class: 'gx-pick', 'aria-haspopup': 'dialog', onclick: function () { openPop(s, b); } }, [el('span'), el('i', { class: 'gx-ar', text: '▾' })]);
s.classList.add('gx-hid'); s.setAttribute('tabindex', '-1'); s.setAttribute('aria-hidden', 'true');
s.parentNode.insertBefore(b, s.nextSibling); sync(s, b);
s.addEventListener('change', function () { sync(s, b); });
}
/* معاينة الرسالة كما تصل للعميل — عند الفريق فقط */
var STAFF = /^\/(staff|admin)/.test(location.pathname) || !!document.querySelector('[data-staff], .crq-staff');
function fmt(t) {
var d = el('div', { class: 'gx-wa-t' });
String(t || '').split(/(https?:\/\/\S+)/).forEach(function (p, i) { if (i % 2) d.appendChild(el('span', { class: 'gx-wa-l', text: p })); else p.split(/(\*[^*\n]+\*)/).forEach(function (q, j) { d.appendChild(j % 2 ? el('b', { text: q.slice(1, -1) }) : document.createTextNode(q)); }); });
return d;
}
function enhTa(ta) {
if (ta.__gx || !STAFF) return; ta.__gx = 1;
var body = el('div', { class: 'gx-wa-b' }), last = null;
var pv = el('div', { class: 'gx-wa', 'aria-live': 'polite' }, [el('div', { class: 'gx-wa-h' }, [el('b', { text: 'معاينة — كما تصل للعميل' }), el('small', { text: 'في حسابه وعلى واتساب' })]), body]);
ta.parentNode.insertBefore(pv, ta.nextSibling);
var up = function () { if (!ta.isConnected) { clearInterval(tm); return; } if (ta.value === last) return; last = ta.value; body.innerHTML = ''; pv.hidden = !ta.value.trim(); if (ta.value.trim()) body.appendChild(el('div', { class: 'gx-wa-m' }, [fmt(ta.value), el('small', { class: 'gx-wa-s', text: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) })])); };
var tm = setInterval(up, 400); ta.addEventListener('input', up); up();
}
function scan(r) {
if (!r || !r.querySelectorAll) return;
Array.prototype.forEach.call(r.querySelectorAll('select'), function (s) { if (isReady(s)) enhSel(s); });
Array.prototype.forEach.call(r.querySelectorAll('textarea.cx-ta'), enhTa);
}
var pend = false;
new MutationObserver(function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; scan(document.body); }); }).observe(document.documentElement, { childList: true, subtree: true });
if (document.body) scan(document.body);
})();

/* ═════════ v956: توحيد العقود من داخل «عقودي» — بطاقة واحدة أعلى صفحة العقود تفتح طلب التوحيد (مع منتج جديد إن رغب العميل) ═════════ */
(function () {
'use strict';
function el(t, a, k) { var e = document.createElement(t); Object.keys(a || {}).forEach(function (n) { var v = a[n]; if (v == null || v === false) return; if (n === 'text') e.textContent = v; else if (n === 'class') e.className = v; else if (n.slice(0, 2) === 'on') e.addEventListener(n.slice(2), v); else e.setAttribute(n, v === true ? '' : v); }); (k || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }); return e; }
function host() {
var hs = [].slice.call(document.querySelectorAll('h1, h2, .tq-ph-t, [class*="title"]')).filter(function (x) { return x.children.length === 0 && x.textContent.trim() === 'عقودي'; });
if (!hs.length) return null;
var h = hs[0], card = h.closest('section, header, .tq-card, .card') || h.parentElement;
if (!card || !/العقود القائمة/.test(card.textContent)) return null;
return card;
}
function card() {
return el('section', { class: 'gx-mgent', role: 'region', 'aria-label': 'توحيد العقود' }, [
el('div', { class: 'gx-mgent-t' }, [el('b', { text: 'توحيد عقودك في عقد واحد' }), el('span', { text: 'اختر عقدين أو أكثر من عقودك — ويمكنك إضافة منتج جديد معها — بخطة دفع واحدة يراجعها فريق تيرا.' })]),
el('button', { type: 'button', class: 'gx-mgent-b', 'data-live-ok': '', onclick: function () { try { window.__teraApp.go('merge'); } catch (e) { void e; } } }, ['توحيد عقودي'])]);
}
var pend = false;
function scan() {
if (!window.__teraApp || typeof window.__teraApp.go !== 'function') return;
var c = host(), ex = [].slice.call(document.querySelectorAll('.gx-mgent')); /* v957: البطاقة في «عقودي» فقط — تُزال عند مغادرتها */
ex.forEach(function (x) { if (!c || x !== c.nextElementSibling) x.remove(); });
if (!c || (c.nextElementSibling && c.nextElementSibling.classList && c.nextElementSibling.classList.contains('gx-mgent'))) return;
c.parentNode.insertBefore(card(), c.nextSibling);
}
new MutationObserver(function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; scan(); }); }).observe(document.documentElement, { childList: true, subtree: true });
})();
