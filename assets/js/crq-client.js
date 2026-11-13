/* v861 — منظومة طلبات العقود (crq_) — حساب العميل: «طلب تأجيل دفعة»
* بناء جديد يحلّ محل صفحة التأجيل القديمة: اختيار العقد والدفعة ← الإرسال ← يصلك العرض للموافقة برابط ← ثم الملحق للتوقيع.
* لا يُنشأ عقد تأجيل جديد: الملحق يعدّل عقدك نفسه بعد توقيعك. والمنصة تعطي رمز الجلسة ومكان الصفحة فقط. */
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg';
var IC = { check: 'M5 12.5l4.5 4.5L19 7.5', clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', alert: 'M12 7.5v6M12 16.6v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1' };
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

function page(o) {
o = o || {};
var S = { opts: null, mine: null, err: '', no: '', pids: [], why: '', other: '', ack: false, miss: [], busy: false, done: null };
var root = el('div', { class: 'cc', dir: 'rtl' });
async function api(method, path, body) {
var t = await o.token();
var r = await fetch(path, { method: method, cache: 'no-store', credentials: 'same-origin', headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
var j = null; try { j = await r.json(); } catch (e) { j = null; }
if (!r.ok || !j || j.ok === false) throw new Error((j && j.message) || 'تعذّر تنفيذ الطلب الآن.');
return j;
}
async function load() {
try { var a = await Promise.all([api('GET', '/api/account/crq/options'), api('GET', '/api/account/crq')]); S.opts = a[0].contracts || []; S.mine = (a[1].rows || []).filter(function (r) { return r.kind === 'defer'; }); S.err = ''; }
catch (e) { S.err = e.message; S.opts = S.opts || []; S.mine = S.mine || []; }
if (!S.no && o.cid && S.opts.some(function (c) { return c.no === o.cid; })) S.no = o.cid;
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
return el('option', { value: x.no, selected: S.no === x.no, disabled: !!x.busy, text: x.no + (x.product ? ' · ' + x.product : '') + (x.busy ? ' · عليه طلب قائم ' + x.busy : '') });
}))), S.miss.indexOf('no') >= 0));
if (c) {
out.push(field('الدفعة المراد تأجيلها', el('div', { class: 'cc-picks' }, (c.payments || []).map(function (p) {
var on = S.pids.indexOf(p.pid) >= 0;
return el('label', { class: 'cc-pick' + (on ? ' is-on' : '') }, [el('input', { type: 'checkbox', checked: on, onchange: function (e) { S.pids = S.pids.filter(function (x) { return x !== p.pid; }); if (e.target.checked) S.pids.push(p.pid); S.miss = []; paint(); } }),
el('span', {}, [el('b', { text: 'الدفعة ' + p.seq }), ' · ' + day(p.due) + ' · ', el('bdi', { dir: 'ltr', text: money(p.amount) }), ' ر.س'])]);
})), S.miss.indexOf('pids') >= 0));
out.push(field('سبب التأجيل', el('select', { onchange: function (e) { S.why = e.target.value; S.miss = []; paint(); } }, WHY.map(function (w) { return el('option', { value: w[0], selected: S.why === w[0], text: w[1] }); })), S.miss.indexOf('why') >= 0));
if (S.why === 'other') out.push(field('اكتب السبب', el('input', { type: 'text', value: S.other, maxlength: '300', oninput: function (e) { S.other = e.target.value; } }), S.miss.indexOf('other') >= 0));
out.push(el('div', { class: 'cc-note is-info' }, [icon('clock'), el('span', { text: 'يراجع فريق تيرا طلبك ويحدد رسم التأجيل والجدول الجديد، ويصلك العرض برابط للموافقة أو الاعتذار. لا يتغير عقدك إلا بعد توقيعك على الملحق.' })]));
out.push(el('label', { class: 'cc-ack' + (S.miss.indexOf('ack') >= 0 ? ' is-miss' : '') }, [el('input', { type: 'checkbox', checked: S.ack, onchange: function (e) { S.ack = e.target.checked; S.miss = []; } }),
el('span', { text: 'أطلب تأجيل الدفعة المختارة من العقد ' + c.no + '، وأعلم أن الموافقة على العرض والتوقيع على الملحق يعدّلان عقدي نفسه.' })]));
}
if (S.err) out.push(el('p', { class: 'cc-err', role: 'alert', text: S.err }));
out.push(el('div', { class: 'cc-acts' }, [el('button', { type: 'button', class: 'cc-btn is-pri', disabled: S.busy, 'data-live-ok': '', onclick: submit }, ['إرسال طلب التأجيل']), o.back ? el('button', { type: 'button', class: 'cc-btn', 'data-live-ok': '', onclick: o.back }, ['رجوع']) : null]));
return out;
}
async function submit() {
var m = []; if (!S.no) m.push('no'); if (!S.pids.length) m.push('pids'); if (!S.why) m.push('why'); if (S.why === 'other' && String(S.other).trim().length < 3) m.push('other'); if (!S.ack) m.push('ack');
S.miss = m; if (m.length) { paint(); var f = root.querySelector('.is-miss'); if (f) f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
S.busy = true; S.err = ''; paint();
try {
var j = await api('POST', '/api/account/crq', { kind: 'defer', contract_no: S.no, payment_ids: S.pids, note: S.why === 'other' ? String(S.other).trim() : S.why });
S.done = j; S.busy = false; S.no = ''; S.pids = []; S.why = ''; S.other = ''; S.ack = false; load();
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
window.CRQC = { page: page };
})();
