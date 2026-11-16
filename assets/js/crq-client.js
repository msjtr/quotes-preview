/* v861 — منظومة طلبات العقود (crq_) — حساب العميل: «طلب تأجيل دفعة»
* بناء جديد يحلّ محل صفحة التأجيل القديمة: اختيار العقد والدفعة ← الإرسال ← يصلك العرض للموافقة برابط ← ثم الملحق للتوقيع.
* لا يُنشأ عقد تأجيل جديد: الملحق يعدّل عقدك نفسه بعد توقيعك. والمنصة تعطي رمز الجلسة ومكان الصفحة فقط.
* v909: الدفعات المتأخرة بالأحمر والقريبة بالبرتقالي، والدفعة الموجودة في طلب قائم مقفلة حتى يُغلق أو يُنفَّذ، و«اقتراحك» (المدة وطريقة السداد).
*       الجزء نفسه (CRQC.picker) يستعمله الفريق عند إنشاء الطلب من المنصة الجديدة — الشكل والمحتوى واحد. */
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg';
var IC = { check: 'M5 12.5l4.5 4.5L19 7.5', clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', alert: 'M12 7.5v6M12 16.6v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1', lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z' };
function icon(n) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'cc-ic'); var p = document.createElementNS(NS, 'path'); p.setAttribute('d', IC[n]); s.appendChild(p); return s; }
function el(tag, a, kids) {
var n = document.createElement(tag);
Object.keys(a || {}).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v); else if (k === 'value') n.value = v; else if (k === 'checked') n.checked = !!v; else if (k === 'selected') n.selected = !!v; else n.setAttribute(k, v === true ? '' : v); });
(kids || []).forEach(function (c) { if (c == null || c === false) return; n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
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
if (d > 0) return { k: 'late', d: d, t: 'متأخرة ' + daysW(d) };
if (d > -30) return { k: 'soon', t: d === 0 ? 'تستحق اليوم' : 'تستحق بعد ' + daysW(-d) };
return { k: 'open', t: 'قادمة' };
}
function lateOf(c, today) {
var L = (c && c.payments || []).filter(function (p) { return diffDays(p.due, today) > 0; });
return { n: L.length, sum: L.reduce(function (a, p) { return a + (Number(p.amount) || 0); }, 0) };
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
S.pids = (S.pids || []).filter(function (id) { return pays.some(function (p) { return p.pid === id && !p.busy; }); });
var lt = lateOf(c, today), sel = pays.filter(function (p) { return S.pids.indexOf(p.pid) >= 0; });
var out = [];
if (lt.n) out.push(el('div', { class: 'cc-top' }, [icon('alert'), el('span', {}, ['على هذا العقد ', el('b', { text: cntW(lt.n, 'متأخرة', 'متأخرتان') }), ' بقيمة ', el('b', {}, [el('bdi', { dir: 'ltr', text: money(lt.sum) }), ' ريال']), '.'])]));
out.push(el('div', { class: 'cc-legend', 'aria-hidden': 'true' }, [['late', 'متأخرة'], ['soon', 'تستحق قريبًا'], ['open', 'قادمة'], ['busy', 'في طلب قائم']].map(function (x) { return el('span', {}, [el('i', { class: 'is-' + x[0] }), x[1]]); })));
out.push(el('div', { class: 'cc-sh is-a' + (S.miss.indexOf('pids') >= 0 ? ' is-miss' : '') }, [el('b', { text: '١. الدفعة المراد تأجيلها' }), el('span', { text: (sel.length ? cntW(sel.length, 'محددة', 'محددتان') : 'لم تُحدَّد') + ' · حتى ' + MAXP })]));
out.push(el('div', { class: 'cc-pays' + (S.miss.indexOf('pids') >= 0 ? ' is-miss' : ''), role: 'group', 'aria-label': 'الدفعات' }, pays.length ? pays.map(function (p) {
var st = stateOf(p, today), on = S.pids.indexOf(p.pid) >= 0, full = !on && S.pids.length >= MAXP;
var ctl = st.k === 'busy' ? el('span', { class: 'cc-lock', title: 'لا يمكن اختيارها حتى يُغلق الطلب ' + p.busy + ' أو يُنفَّذ' }, [icon('lock')])
: el('input', { type: 'checkbox', checked: on, disabled: full, 'aria-label': 'الدفعة ' + p.seq, onchange: function (e) { S.pids = S.pids.filter(function (x) { return x !== p.pid; }); if (e.target.checked) S.pids.push(p.pid); S.miss = []; paint(); } });
return el('label', { class: 'cc-pay is-' + st.k + (on ? ' is-on' : '') + (full ? ' is-full' : '') }, [el('span', { class: 'cc-pay-n', text: String(p.seq) }),
el('span', { class: 'cc-pay-m' }, [el('b', { text: day(p.due) }), el('span', { class: 'cc-pill is-' + st.k, text: st.t })]),
el('span', { class: 'cc-pay-a' }, [el('bdi', { dir: 'ltr', text: money(p.amount) }), ' ر.س']), ctl]);
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
r.state === 'received' ? el('button', { type: 'button', class: 'cc-btn is-sm', 'data-live-ok': '', onclick: function () { cancel(r); } }, ['إلغاء الطلب']) : null]);
}))]);
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
if (before !== after) f.push('أُعيدت جدولة ' + before + ' ← ' + after + ' دفعة'); else if (mv) f.push('عُدّلت ' + cntW(mv, '', '').trim());
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
return el('table', { class: 'cc-at' }, [el('thead', {}, [el('tr', {}, ['#', 'الاستحقاق', 'القيمة', 'نُقلت إلى'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, R.map(function (x) {
var mv = x.open && !x.merged && (x.due_after !== x.due_before || Number(x.amt_after) !== Number(x.amt_before));
var what = !x.open ? el('span', { class: 'cc-muted0', text: 'مسدَّدة' }) : x.merged ? el('span', { class: 'cc-mv', text: 'دُمجت' }) : mv ? el('span', { class: 'cc-mv' }, [el('bdi', { dir: 'ltr', text: dmy(x.due_after) })]) : el('span', { class: 'cc-muted0', text: 'لم تتغيّر' });
return el('tr', { class: (mv || x.merged) ? 'is-mv' : '' }, [el('td', { text: String(x.seq) }), el('td', {}, [(mv || x.merged) ? el('s', {}, [el('bdi', { dir: 'ltr', text: dmy(x.due_before) })]) : el('bdi', { dir: 'ltr', text: dmy(x.due_before) })]), el('td', {}, [el('bdi', { dir: 'ltr', text: money(x.amt_before) })]), el('td', {}, [what])]);
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
var body = isOpen ? el('div', { class: 'cc-anx-tb' }, [el('div', { class: 'cc-anx-seg', role: 'tablist' }, [['before', 'قبل الملحق'], ['after', 'بعد الملحق']].map(function (s) { return el('button', { type: 'button', role: 'tab', 'aria-selected': sd === s[0] ? 'true' : 'false', class: 'cc-chip' + (sd === s[0] ? ' is-on' : ''), 'data-live-ok': '', onclick: function () { side[k] = s[0]; paint(L); } }, [s[1]]); })),
el('div', { class: 'cc-anx-2' + (sd === 'after' ? ' is-after' : '') }, [el('div', { class: 'cc-anx-c is-b' }, [el('b', { text: 'الجدول قبل الملحق' }), anxTable(a, 'before')]), el('div', { class: 'cc-anx-c is-a' }, [el('b', { text: 'الجدول بعد الملحق' }), anxTable(a, 'after')])])]) : null;
return el('div', { class: 'cc-anx-i' }, [el('span', { class: 'cc-anx-n' }, ['ملحق', el('b', { text: String(a.n) })]), el('div', { class: 'cc-anx-t' }, [el('b', {}, ['تأجيل دفعة · ', el('bdi', { dir: 'ltr', text: a.no })]), el('small', { text: 'نُفّذ ' + day(a.executed_at) + ' · بتوقيعك' }),
el('div', { class: 'cc-anx-f' }, anxFacts(a).map(function (t) { return el('span', { text: t }); })),
el('div', { class: 'cc-anx-a' }, [el('button', { type: 'button', class: 'cc-btn is-sm', 'aria-expanded': isOpen ? 'true' : 'false', 'data-live-ok': '', onclick: function () { open[k] = !isOpen; paint(L); } }, [isOpen ? 'إخفاء الجدول' : 'الجدول قبل وبعد'])]), body])]);
}))]));
}
root.hidden = true;
anxLoad(o.token).then(paint);
return root;
}
window.CRQC = { page: page, picker: picker, check: check, payload: payload, propText: propText, lateOf: lateOf, annexes: annexes };
})();
