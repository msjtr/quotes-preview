/* v865 (طلبات التأجيل السابقة المنقولة: للسجل) · v862 — منظومة طلبات العقود الموحّدة (crq_) — صفحة الفريق: «طلبات تأجيل دفعة»
* ملف مستقل (لا طبقات فوق platform.js): المنصة تعطي مكان الصفحة ورأسها (المسار والأيقونة والعنوان) ورمز الجلسة،
* وهذه الوحدة ترسم المحتوى بلغة قسم العملاء المعتمدة، والخادم والقاعدة يفرضان كل قاعدة.
* القائمة: بطاقات مؤشرات هي الفلتر الوحيد ← شريط أدوات ← جدول بصفوف.
* صفحة الطلب: بطاقة الحقائق + «الخطوة التالية» جانبًا (المراحل والإجراء الرئيسي وبقية الإجراءات)، ثم ستة تبويبات لكلٍّ عمل واحد:
*   الطلب · الحسبة · المستند · الرابطان · المعاينة (المكان الوحيد للمعاينة) · السجل
* الحفظ تلقائي، وبعد إرسال الرابط تُقفل الحسبة والمستند للقراءة ويُعدَّل بـ«سحب العرض وتعديله». */
(function () {
'use strict';
if (!/^\/staff\/next(\/|$)/.test(location.pathname)) return;
/* المفتاح يبدأ بـ cu- ليُعامل صفحةً من صفحات الإدارة (رأس الصفحة والمسار)، وأصله «العملاء» كطلبات الخدمات */
var KEY = 'cu-crq-defer', UP = 'cu', KIND = 'defer', TITLE = 'طلبات تأجيل دفعة';
var NS = 'http://www.w3.org/2000/svg';
var IC = {
plus: 'M12 5v14M5 12h14', back: 'M15 6l-6 6 6 6', more: 'M5 12h.01M12 12h.01M19 12h.01', check: 'M5 12.5l4.5 4.5L19 7.5',
send: 'M4 12l16-8-6 16-3-7-7-1z', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', file: 'M14 3H6v18h12V7l-4-4zM14 3v4h4',
clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
calc: 'M6 3h12v18H6zM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01', trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
down: 'M12 4v12M7 11l5 5 5-5M5 20h14', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4', gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 1-2-2V4h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 2v2h4l1-2 2-1 2 1 2-4-2-1z',
alert: 'M12 7.5v6M12 16.6v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', phone: 'M8 2h8v20H8zM11 18h2', screen: 'M3 4h18v12H3zM8 20h8M12 16v4', sign: 'M3 17c3-4 5-9 7-9s-2 9 1 9 3-5 5-5 1 4 5 4M3 21h18',
inbox: 'M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6z', team: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0-1-5.8M18 14a6 6 0 0 1 4 6',
wait: 'M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9', ok: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.5l2.7 2.7L16 10', x: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 9l6 6M15 9l-6 6',
sum: 'M18 5H6l6 7-6 7h12', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3', ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8'
};
function icon(n) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'cr-ic'); var p = document.createElementNS(NS, 'path'); p.setAttribute('d', IC[n] || ''); s.appendChild(p); return s; }
function el(tag, a, kids) {
var n = document.createElement(tag);
Object.keys(a || {}).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v); else if (k === 'value') n.value = v; else if (k === 'checked') n.checked = !!v; else if (k === 'selected') n.selected = !!v; else n.setAttribute(k, v === true ? '' : v); });
(kids || []).forEach(function (c) { if (c == null || c === false) return; n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
return n;
}
function btn(label, o) { o = o || {}; var b = el('button', { type: 'button', class: 'cr-btn' + (o.cls ? ' ' + o.cls : ''), disabled: o.disabled, title: o.title, 'data-live-ok': '', onclick: o.on }, [o.ic ? icon(o.ic) : null, label]); return b; }
function money(x) { var n = Math.round((Number(x) || 0) * 100) / 100; return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function day(d) { if (!d) return '—'; try { return new Date(String(d).slice(0, 10) + 'T00:00:00Z').toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return String(d); } }
function at(t) { if (!t) return '—'; try { return new Date(t).toLocaleString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return String(t); } }
function ltr(t) { return el('bdi', { dir: 'ltr', class: 'cr-ltr', text: String(t == null ? '' : t) }); }
function clone(o) { return JSON.parse(JSON.stringify(o || {})); }

/* ── الاتصال بالخادم (رمز جلسة لوحة التحكم من المنصة نفسها) ── */
async function api(method, path, body, raw) {
var t = await window.__teraApp.token();
var r = await fetch(path, { method: method, cache: 'no-store', headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: raw ? '*/*' : 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
if (raw) { if (!r.ok) throw new Error('تعذّر التحميل.'); return r; }
var j = null; try { j = await r.json(); } catch (e) { j = null; }
if (!r.ok || !j || j.ok === false) { var er = new Error((j && j.message) || 'تعذّر تنفيذ الإجراء.'); er.code = j && j.error; throw er; }
return j;
}

var ST = { rows: null, states: [], sup: false, me: '', err: '', ready: true, f: 'open', mine: false, q: '', id: null, x: null, tab: 'req', busy: false, flash: null,
save: { t: null, st: 'idle', err: '' }, pv: { mode: 'consent', dev: 'phone' }, create: null, set: null, ask: null };
var R = el('div', { class: 'crq', dir: 'rtl' });

function toast(ok, t) { ST.flash = [ok, t]; draw(); setTimeout(function () { if (ST.flash && ST.flash[1] === t) { ST.flash = null; draw(); } }, 4500); }
async function loadList() {
try { var j = await api('GET', '/admin/api/crq?kind=' + KIND); ST.rows = j.rows || []; ST.states = j.states || []; ST.settings = j.settings || null; ST.sup = !!j.super; ST.me = j.me; ST.err = ''; ST.ready = true; }
catch (e) { ST.ready = e.code !== 'not_ready'; ST.err = ST.ready ? e.message : ''; ST.rows = ST.rows || []; }
draw();
}
async function open(id) {
ST.id = id; ST.x = null; ST.tab = 'req'; ST.ask = null; draw(); toTop();
try { var j = await api('GET', '/admin/api/crq/' + id); ST.x = j.req; ST.tab = defaultTab(j.req); } catch (e) { ST.err = e.message; ST.id = null; }
draw();
}
function back() { ST.id = null; ST.x = null; ST.ask = null; draw(); toTop(); loadList(); }
function toTop() { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); } }
async function reload() { if (!ST.id) return loadList(); try { var j = await api('GET', '/admin/api/crq/' + ST.id); ST.x = j.req; } catch (e) { toast(false, e.message); } draw(); }
/* طلب تأجيل نُفّذ قبل المنظومة (نُقل بالهجرة stf_269): نُقلت دفعته إلى عقد آخر — لا حسبة ولا ملحق، للسجل فقط */
function legacy(x) { return !!(x && x.executed_ref && x.executed_ref.legacy); }
function defaultTab(x) { if (legacy(x)) return 'req'; return x.state === 'received' || x.state === 'decision' ? (x.result && x.result.ok ? 'calc' : 'req') : x.state === 'done' || x.state === 'closed' ? 'log' : 'links'; }
function editable(x) { return x && (x.state === 'received' || x.state === 'decision') && !x.need_approval; }

/* ═════════ القائمة ═════════ */
/* بطاقات المؤشرات هي الفلتر الوحيد: لا شريط حالات آخر ولا ملخص مكرر */
var KPI = [['open', 'المفتوحة', 'inbox', ''], ['team', 'بانتظار الفريق', 'team', 'warn'], ['client', 'بانتظار العميل', 'wait', 'info'], ['done', 'نُفّذت', 'ok', 'ok'], ['closed', 'مغلقة', 'x', 'g'], ['all', 'كل الطلبات', 'sum', 'g']];
function fit(r, f) {
return f === 'all' ? true : f === 'open' ? r.state !== 'done' && r.state !== 'closed' : f === 'team' ? r.state === 'received' || r.state === 'decision'
: f === 'client' ? r.state === 'consent' || r.state === 'sign' : r.state === f;
}
function initial(s) { var t = String(s || '').trim(); return t ? t.charAt(0) : '؟'; }
function listView() {
var rows = ST.rows || [];
var L = rows.filter(function (r) { return fit(r, ST.f) && (!ST.mine || r.assigned_to === ST.me || (ST.sup && r.need_approval)) && (!ST.q || (r.no + ' ' + r.client + ' ' + r.contract_no).indexOf(ST.q) >= 0); });
if (!ST.ready) return [el('section', { class: 'cr-card' }, [el('div', { class: 'cr-empty is-warn' }, [el('i', {}, [icon('gear')]), el('b', { text: 'منظومة طلبات العقود لم تُفعَّل بعد' }),
el('span', { class: 'cr-hint', text: 'تظهر الطلبات هنا بعد تطبيق هجرة قاعدة البيانات stf_268 — لا يلزم أي إجراء آخر.' }), btn('إعادة المحاولة', { cls: 'is-sm', on: function () { ST.rows = null; draw(); loadList(); } })])])];
var kpis = el('div', { class: 'cr-kpis', role: 'tablist', 'aria-label': 'تصفية الطلبات' }, KPI.map(function (k) {
var n = rows.filter(function (r) { return fit(r, k[0]); }).length;
return el('button', { type: 'button', role: 'tab', 'aria-selected': ST.f === k[0] ? 'true' : 'false', class: 'cr-kpi' + (k[3] ? ' is-' + k[3] : '') + (ST.f === k[0] ? ' is-on' : ''), 'data-live-ok': '', onclick: function () { ST.f = k[0]; draw(); } },
[el('i', {}, [icon(k[2])]), el('span', {}, [el('small', { text: k[1] }), el('b', { text: ST.rows ? String(n) : '—' })])]);
}));
var tools = el('div', { class: 'cr-ltb' }, [
el('label', { class: 'cr-lq' }, [icon('search'), el('input', { type: 'search', value: ST.q, placeholder: 'ابحث برقم الطلب أو اسم العميل أو رقم العقد…', 'aria-label': 'بحث', oninput: function (e) { ST.q = e.target.value.trim(); var p = e.target.selectionStart; draw(); var i = R.querySelector('.cr-lq input'); if (i) { i.focus(); try { i.setSelectionRange(p, p); } catch (er) { void er; } } } })]),
el('div', { class: 'cr-seg', role: 'group', 'aria-label': 'النطاق' }, [['', 'كل الفريق'], ['me', ST.sup ? 'المسند إليّ وبانتظار اعتمادي' : 'المسند إليّ']].map(function (o) {
return el('button', { type: 'button', class: (!!o[0] === ST.mine) ? 'is-on' : '', 'aria-pressed': (!!o[0] === ST.mine) ? 'true' : 'false', 'data-live-ok': '', onclick: function () { ST.mine = !!o[0]; draw(); } }, [o[1]]); })),
ST.sup ? btn('الإعدادات', { ic: 'gear', cls: ST.set ? 'is-on' : '', on: function () { ST.set = ST.set ? null : { load: true }; ST.create = null; draw(); if (ST.set) loadSettings(); } }) : null,
btn('طلب تأجيل جديد', { ic: 'plus', cls: 'is-pri', on: function () { ST.create = ST.create ? null : { q: '', clients: null }; ST.set = null; draw(); if (ST.create) loadClients(); } })]);
var head = el('div', { class: 'cr-lr is-h' }, ['العميل والطلب', 'العقد', 'الدفعة المؤجلة', 'الإضافة', 'الحالة', 'آخر تحديث', ''].map(function (h) { return el('span', { text: h }); }));
var body = !ST.rows ? el('div', { class: 'cr-load', text: 'جارٍ التحميل…' })
: !rows.length ? el('div', { class: 'cr-empty' }, [el('i', {}, [icon('inbox')]), el('b', { text: 'لا طلبات تأجيل بعد' }), el('span', { class: 'cr-hint', text: 'تظهر هنا طلبات العملاء من حساباتهم والطلبات التي ينشئها الفريق.' })])
: !L.length ? el('div', { class: 'cr-empty' }, [el('i', {}, [icon('search')]), el('b', { text: ST.q ? 'لا نتائج لهذا البحث' : 'لا طلبات ' + ({ open: 'مفتوحة', team: 'بانتظار الفريق', client: 'بانتظار العميل', done: 'منفّذة', closed: 'مغلقة' }[ST.f] || '') + ' الآن' }), rows.length && ST.f !== 'all' ? btn('عرض كل الطلبات', { cls: 'is-sm', on: function () { ST.f = 'all'; ST.q = ''; draw(); } }) : null])
: el('div', {}, [head].concat(L.map(function (r) {
var tg = (r.targets || []).map(function (t) { return 'الدفعة ' + t.seq + ' · ' + day(t.due); }).join('، ') || '—';
return el('div', { class: 'cr-lr', role: 'button', tabindex: '0', 'data-live-ok': '', onclick: function () { open(r.id); }, onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(r.id); } } }, [
el('div', { class: 'cr-who' }, [el('span', { class: 'cr-av', 'aria-hidden': 'true', text: initial(r.client) }), el('div', { style: 'min-width:0' }, [el('b', { text: r.client || '—' }), el('small', {}, [ltr(r.no), r.origin === 'staff' ? ' · أنشأه الفريق' : ''])])]),
el('b', {}, [ltr(r.contract_no || '—')]),
el('span', { text: tg }),
el('b', { class: r.total != null ? '' : 'cr-mut' }, [r.total != null ? ltr(money(r.total)) : '—']),
el('div', {}, [badge(r), r.need_approval ? el('small', { class: 'cr-sub is-warn', text: 'بانتظار اعتماد المشرف العام' }) : r.exec_error ? el('small', { class: 'cr-sub is-bad', text: 'تعذّر التنفيذ' }) : r.assigned_t ? el('small', { class: 'cr-sub', text: 'مسند إلى ' + r.assigned_t }) : null]),
el('span', { class: 'cr-mut', text: at(r.updated_at) }),
btn('فتح الطلب', { cls: 'is-pri is-sm', on: function (e) { e.stopPropagation(); open(r.id); } })]);
})));
var foot = ST.rows && rows.length ? el('div', { class: 'cr-lf', text: 'عرض ' + L.length + ' من ' + rows.length + ' طلبًا' }) : null;
return [kpis, tools, ST.set ? settingsPanel() : null, ST.create ? createPanel() : null, ST.err ? note('bad', ST.err) : null, el('div', { class: 'cr-lt' }, [body]), foot];
}
function badge(r) { return el('span', { class: 'cr-badge is-' + (r.tone || 'info'), text: r.state === 'closed' && r.close_t ? 'مغلق · ' + r.close_t : r.state_t }); }
function note(k, t, kids) { return el('div', { class: 'cr-note is-' + k, role: k === 'bad' ? 'alert' : 'status' }, [icon(k === 'ok' ? 'check' : 'alert'), el('div', {}, [el('b', { text: t })].concat(kids || []))]); }

/* إنشاء طلب من الفريق: العميل ← العقد ← الدفعة */
async function loadClients() { try { var j = await api('GET', '/admin/api/clients'); ST.create.clients = (j.reg || []).filter(function (c) { return c.status === 'active'; }); } catch (e) { ST.create.err = e.message; ST.create.clients = []; } draw(); }
async function loadOpts(uid) { ST.create.uid = uid; ST.create.opts = null; draw(); try { var j = await api('GET', '/admin/api/crq-options/' + uid); ST.create.opts = j.contracts || []; } catch (e) { ST.create.err = e.message; } draw(); }
function createPanel() {
var C = ST.create, kids = [el('h2', { text: 'طلب تأجيل جديد لعميل' })];
var cl = (C.clients || []).filter(function (c) { return !C.q || (c.name + ' ' + (c.phone || '') + ' ' + (c.no || '')).indexOf(C.q) >= 0; }).slice(0, 30);
kids.push(field('العميل', C.clients ? el('select', { onchange: function (e) { if (e.target.value) loadOpts(e.target.value); } }, [el('option', { value: '', text: '— اختر العميل —' })].concat(cl.map(function (c) { return el('option', { value: c.id, selected: C.uid === c.id, text: c.name + (c.phone ? ' · ' + c.phone : '') }); }))) : el('span', { text: 'جارٍ تحميل العملاء…' })));
if (C.uid && C.opts) {
if (!C.opts.length) kids.push(note('warn', 'لا عقود مفتوحة بدفعات مستحقة لهذا العميل'));
else {
kids.push(field('العقد', el('select', { onchange: function (e) { C.no = e.target.value; C.pids = []; draw(); } }, [el('option', { value: '', text: '— اختر العقد —' })].concat(C.opts.map(function (o) { return el('option', { value: o.no, selected: C.no === o.no, disabled: !!o.busy, text: o.no + (o.product ? ' · ' + o.product : '') + (o.busy ? ' · عليه طلب ' + o.busy : '') }); })))));
var o = C.opts.filter(function (x) { return x.no === C.no; })[0];
if (o) kids.push(field('الدفعة المراد تأجيلها', el('div', { class: 'cr-picks' }, (o.payments || []).map(function (p) {
var on = (C.pids || []).indexOf(p.pid) >= 0;
return el('label', { class: 'cr-pick' + (on ? ' is-on' : '') }, [el('input', { type: 'checkbox', checked: on, onchange: function (e) { C.pids = (C.pids || []).filter(function (x) { return x !== p.pid; }); if (e.target.checked) C.pids.push(p.pid); draw(); } }), 'الدفعة ' + p.seq + ' · ' + day(p.due) + ' · ', ltr(money(p.amount))]);
}))));
kids.push(field('ملاحظة (اختياري)', el('input', { type: 'text', value: C.note || '', oninput: function (e) { C.note = e.target.value; } })));
}
}
if (C.err) kids.push(note('bad', C.err));
kids.push(el('div', { class: 'cr-acts' }, [btn('إنشاء الطلب', { cls: 'is-pri', disabled: !(C.uid && C.no && C.pids && C.pids.length) || ST.busy, on: async function () {
ST.busy = true; draw();
try { var j = await api('POST', '/admin/api/crq', { user_id: C.uid, contract_no: C.no, payment_ids: C.pids, note: C.note || '', kind: KIND }); ST.create = null; ST.busy = false; await loadList(); open(j.id); }
catch (e) { ST.busy = false; C.err = e.message; draw(); }
} }), btn('إلغاء', { on: function () { ST.create = null; draw(); } })]));
return el('section', { class: 'cr-card' }, kids);
}
function field(label, ctl, hint) { return el('div', { class: 'cr-field' }, [el('label', { text: label }), ctl, hint ? el('small', { text: hint }) : null]); }

/* إعدادات التأجيل (المشرف العام): مدة الرابطين والرسم الافتراضي */
function loadSettings() { ST.set = { s: clone(ST.settings || { consent_hours: 48, sign_hours: 48, defer_fee: 0, defer_fee_label: 'رسم التأجيل', defer_fee_vat: true }) }; draw(); }
function settingsPanel() {
var s = ST.set && ST.set.s; if (!s) return el('section', { class: 'cr-card' }, [el('span', { text: 'جارٍ التحميل…' })]);
function num(k, lab, hint) { return field(lab, el('input', { type: 'number', min: '0', step: k === 'defer_fee' ? '0.01' : '1', value: s[k], oninput: function (e) { s[k] = e.target.value; } }), hint); }
return el('section', { class: 'cr-card' }, [el('h2', { text: 'إعدادات طلبات التأجيل' }), el('div', { class: 'cr-grid' }, [
num('defer_fee', 'رسم التأجيل الافتراضي (ر.س)', 'يظهر بندًا جاهزًا في كل طلب جديد ويُعدَّل لكل طلب.'),
field('اسم البند', el('input', { type: 'text', value: s.defer_fee_label, oninput: function (e) { s.defer_fee_label = e.target.value; } })),
field('الضريبة على الرسم', el('select', { onchange: function (e) { s.defer_fee_vat = e.target.value === '1'; } }, [el('option', { value: '1', selected: s.defer_fee_vat, text: 'تُحتسب' }), el('option', { value: '0', selected: !s.defer_fee_vat, text: 'لا تُحتسب' })])),
num('consent_hours', 'مدة رابط الموافقة (ساعة)', 'بانتهائها يُغلق الطلب «انتهت مدة العرض».'), num('sign_hours', 'مدة رابط التوقيع (ساعة)')]),
el('div', { class: 'cr-acts' }, [btn('حفظ الإعدادات', { cls: 'is-pri', on: async function () { try { await api('POST', '/admin/api/crq-settings', { defer_fee: s.defer_fee, defer_fee_label: s.defer_fee_label, defer_fee_vat: s.defer_fee_vat, consent_hours: s.consent_hours, sign_hours: s.sign_hours }); ST.set = null; loadList(); toast(true, 'حُفظت الإعدادات.'); } catch (e) { toast(false, e.message); } } }), btn('إغلاق', { on: function () { ST.set = null; draw(); } })])]);
}

/* ═════════ صفحة الطلب ═════════ */
var TABS = [['req', 'الطلب', 'user'], ['calc', 'الحسبة', 'calc'], ['doc', 'المستند', 'file'], ['links', 'الرابطان', 'link'], ['pv', 'المعاينة', 'eye'], ['log', 'السجل', 'clock']];
function tabState(x, k) {
if (k === 'req') return (x.payment_ids || []).length ? 'ok' : 'miss';
if (k === 'calc') return x.result && x.result.ok ? 'ok' : 'miss';
if (k === 'doc') return 'ok';
if (k === 'links') return x.state === 'consent' || x.state === 'sign' ? 'live' : 'ok';
return '';
}
/* الإجراء الرئيسي الوحيد في الحالة الحالية */
function primary(x) {
if (legacy(x)) return null;
var sup = x.me && x.me.super, ok = x.result && x.result.ok;
if (x.state === 'received' || x.state === 'decision') {
if (sup) return btn('اعتماد وإرسال رابط الموافقة', { ic: 'send', cls: 'is-pri is-wide', disabled: !ok || ST.busy || ST.save.st === 'saving', title: ok ? '' : 'أكمل الحسبة أولًا', on: function () { ask('اعتماد العرض وإرسال رابط الموافقة', 'يصل العميل رابط الموافقة على واتساب والبريد بمدة صلاحية ' + (x.valid_hours || (x.settings || {}).consent_hours || 48) + ' ساعة. بانتهائها يُغلق الطلب.', 'اعتماد وإرسال', function () { act('approve', { stamp: ST.x.updated_at }); }); } });
if (x.need_approval) return btn('بانتظار اعتماد المشرف العام', { ic: 'clock', cls: 'is-wide', disabled: true });
return btn('رفع للمشرف العام للاعتماد', { ic: 'send', cls: 'is-pri is-wide', disabled: !ok || ST.busy || ST.save.st === 'saving', on: function () { act('submit', null, 'رُفع العرض للاعتماد.'); } });
}
if ((x.state === 'consent' || x.state === 'sign') && !x.signed_at) return btn('إعادة إرسال الرابط', { ic: 'send', cls: 'is-pri is-wide', disabled: ST.busy, on: function () { ask('إعادة إرسال الرابط', 'يُلغى الرابط الحالي ويصل العميل رابط جديد بمدة جديدة.', 'إعادة الإرسال', function () { act('resend', null, 'أُرسل رابط جديد للعميل.'); }); } });
if (x.state === 'sign' && x.signed_at && sup) return btn('إعادة محاولة التنفيذ', { ic: 'check', cls: 'is-pri is-wide', disabled: ST.busy, on: function () { act('exec', null, 'نُفّذ الطلب وعُدّل العقد.'); } });
if (x.state === 'done') return btn('تنزيل الملحق PDF', { ic: 'down', cls: 'is-pri is-wide', disabled: ST.busy, on: pdf });
return null;
}
/* بقية الإجراءات — ظاهرة تحت الإجراء الرئيسي (لا قائمة منسدلة) */
function moreItems(x) {
if (legacy(x)) return [];
var sup = x.me && x.me.super, L = [];
if ((x.state === 'consent' || x.state === 'sign') && (!x.signed_at || x.exec_error)) L.push(['سحب العرض وتعديله', 'undo', function () { askNote('سحب العرض وتعديله', 'يُلغى رابط العميل ويعود الطلب إلى قرار الفريق.', 'سبب السحب (اختياري)', false, function (n) { act('withdraw', { note: n }, 'سُحب العرض — عدّل ثم أعد الاعتماد.'); }); }]);
if (sup && x.state === 'decision' && x.need_approval) L.push(['إعادة للمُعِدّ للتعديل', 'undo', function () { askNote('إعادة للمُعِدّ', 'يعود العرض للمُعِدّ بملاحظتك.', 'الملاحظة', true, function (n) { act('return', { note: n }, 'أُعيد العرض للمُعِدّ.'); }); }]);
if (sup && x.state !== 'done' && x.state !== 'closed') L.push([x.assigned_t ? 'تغيير الإسناد (' + x.assigned_t + ')' : 'إسناد الطلب لموظف', 'user', function () { ST.ask = { kind: 'assign', to: x.assigned_to || '' }; draw(); }]);
if (x.state === 'done') L.push(['إرسال الملحق PDF للعميل', 'send', function () { ask('إرسال الملحق للعميل', 'يصل العميل الملحق PDF مع رسالة «نُفّذ طلبك» على واتساب والبريد.', 'إرسال', function () { act('send-doc', null, 'أُرسل الملحق للعميل.'); }); }]);
if (x.state !== 'done') L.push(['تنزيل المستند PDF', 'down', pdf]);
if (sup && x.state !== 'done' && x.state !== 'closed' && (!x.signed_at || x.exec_error)) L.push(['عدم الاعتماد وإغلاق الطلب', 'ban', function () { askNote('عدم اعتماد الطلب', 'يُغلق الطلب ويصل العميل السبب، ويبقى عقده كما هو.', 'السبب الذي يصل العميل', true, function (n) { act('reject', { note: n }, 'أُغلق الطلب وأُبلغ العميل.'); }); }, 'is-bad']);
return L;
}
async function act(a, body, okMsg) {
ST.busy = true; ST.ask = null; draw();
try {
await flushSave();
var j = await api('POST', '/admin/api/crq/' + ST.x.id + '/' + a, body || {});
ST.busy = false;
var m = a === 'approve' ? (j.msg && j.msg.ok ? 'اعتُمد العرض ووصل العميل رابط الموافقة.' : 'اعتُمد العرض — تعذّر إرسال الرسالة، أعد الإرسال من «إعادة إرسال الرابط».') : (okMsg || 'تم.');
await reload(); loadList(); toast(true, m);
} catch (e) { ST.busy = false; toast(false, e.message); }
}
async function pdf() {
ST.busy = true; draw();
try { var r = await api('GET', '/admin/api/crq/' + ST.x.id + '/pdf', null, true); var b = await r.blob(); var u = URL.createObjectURL(b); var a = el('a', { href: u, download: ST.x.no + '.pdf' }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 30000); }
catch (e) { toast(false, e.message); }
ST.busy = false; draw();
}
function ask(title, text, okT, fn) { ST.ask = { title: title, text: text, ok: okT, fn: fn }; draw(); var n = R.querySelector('.cr-ask'); if (n) n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
function askNote(title, text, ph, need, fn) { ST.ask = { title: title, text: text, ok: 'تأكيد', ph: ph, need: need, note: '', fn: fn }; draw(); var n = R.querySelector('.cr-ask textarea'); if (n) { n.scrollIntoView({ block: 'center', behavior: 'smooth' }); n.focus(); } }
function askView(x) {
var A = ST.ask; if (!A) return null;
if (A.kind === 'assign') {
return el('div', { class: 'cr-ask' }, [el('b', { text: 'إسناد الطلب' }), el('p', { text: 'يظهر الطلب للموظف في «المسند إليّ».' }), el('select', { 'aria-label': 'الموظف', onchange: function (e) { A.to = e.target.value; } }, [el('option', { value: '', text: '— بلا إسناد —' })].concat((x.staff || []).map(function (s) { return el('option', { value: s.id, selected: A.to === s.id, text: s.name }); }))),
el('div', { class: 'cr-acts' }, [btn('حفظ الإسناد', { cls: 'is-pri', on: function () { act('assign', { to: A.to || null }, 'حُفظ الإسناد.'); } }), btn('إلغاء', { on: function () { ST.ask = null; draw(); } })])]);
}
var ta = A.ph ? el('textarea', { placeholder: A.ph, rows: '3', oninput: function (e) { A.note = e.target.value; } }) : null;
return el('div', { class: 'cr-ask', role: 'dialog', 'aria-label': A.title }, [el('b', { text: A.title }), el('p', { text: A.text }), ta,
el('div', { class: 'cr-acts' }, [btn(A.ok, { cls: 'is-pri', on: function () { if (A.need && String(A.note || '').trim().length < 3) { ta.classList.add('is-err'); ta.focus(); return; } A.fn(String(A.note || '').trim()); } }), btn('رجوع', { on: function () { ST.ask = null; draw(); } })])]);
}
function detailView() {
var x = ST.x;
if (!x) return [el('div', { class: 'cr-load', text: 'جارٍ تحميل الطلب…' })];
var notes = [];
if (x.need_approval) notes.push(note('warn', x.me && x.me.super ? 'رُفع العرض لاعتمادك — راجعه ثم اعتمده أو أعده للمُعِدّ.' : 'العرض بانتظار اعتماد المشرف العام — لا يصل العميل قبل اعتماده.'));
if (x.exec_error) notes.push(note('bad', x.state === 'decision' ? 'تغيّر العقد بعد العرض فلم يُنفَّذ — راجع الحسبة وأعد الاعتماد ليصل العميل عرض محدّث.' : 'وقّع العميل وتعذّر التنفيذ الآلي — لم يتغير العقد.', [el('span', { text: x.exec_error })]));
if (!editable(x) && (x.state === 'consent' || x.state === 'sign')) notes.push(note('info', 'الحسبة والمستند للقراءة فقط بعد إرسال الرابط — للتعديل: «سحب العرض وتعديله» من «الخطوة التالية».'));
var body = ST.tab === 'req' ? tabReq(x) : ST.tab === 'calc' ? tabCalc(x) : ST.tab === 'doc' ? tabDoc(x) : ST.tab === 'links' ? tabLinks(x) : ST.tab === 'pv' ? tabPreview(x) : tabLog(x);
return [el('div', { class: 'cr-r1' }, [heroEl(x), nextEl(x)]), askView(x)].concat(notes, [tabsEl(x), el('div', { class: 'cr-body', role: 'tabpanel' }, [].concat(body))]);
}
/* بطاقة الحقائق — كبطاقة ملف العميل: شريط متدرّج بأيقونة الطلب، الرقم والحالة، ثم الحقائق الأساسية */
function heroEl(x) {
var tg = (x.targets || []).map(function (t) { return 'الدفعة ' + t.seq + ' · ' + day(t.due); }).join('، ');
var ok = x.result && x.result.ok;
return el('section', { class: 'cr-hero' }, [
el('div', { class: 'cr-hero-band', 'aria-hidden': 'true' }, [el('span', { class: 'cr-hero-av' }, [icon('clock')])]),
el('div', { class: 'cr-hero-in' }, [
el('div', { class: 'cr-hero-top' }, [el('div', {}, [el('span', { class: 'cr-eye', text: x.kind_t || 'طلب تأجيل دفعة' }), el('h2', {}, [ltr(x.no)])]),
el('button', { type: 'button', class: 'cr-allb', 'data-live-ok': '', onclick: back }, [icon('back'), 'كل الطلبات'])]),
el('div', { class: 'cr-chips' }, [badge(x), x.need_approval ? el('span', { class: 'cr-badge is-warn', text: 'بانتظار اعتماد المشرف العام' }) : null, x.exec_error ? el('span', { class: 'cr-badge is-bad', text: 'تعذّر التنفيذ' }) : null,
el('span', { class: 'cr-badge is-off', text: x.origin === 'client' ? 'من حساب العميل' : 'أنشأه الفريق' })]),
el('div', { class: 'cr-facts' }, [fact('العميل', x.client || '—'), fact('العقد', ltr(x.contract_no || '—')), fact('الدفعة المؤجلة', tg || '—'),
legacy(x) ? fact('نُقلت الدفعة إلى العقد', ltr(x.executed_ref.to || '—'), 'is-hi') : fact('إجمالي الإضافة على العقد', ok ? el('span', {}, [ltr(money(x.result.total)), ' ر.س']) : 'لم تكتمل الحسبة', ok ? 'is-hi' : ''),
x.link ? fact(x.link.step === 'sign' ? 'رابط التوقيع صالح حتى' : 'رابط الموافقة صالح حتى', at(x.link.expires_at)) : fact('تاريخ الطلب', at(x.created_at)),
fact('مسند إلى', x.assigned_t || 'غير مسند')])])]);
}
/* «الخطوة التالية»: أين الطلب الآن، وما المطلوب، وزر واحد لتنفيذه، وبقية الإجراءات ظاهرة تحته */
var STEPS = ['الطلب', 'قرار الفريق', 'موافقة العميل', 'توقيع الملحق', 'التنفيذ'];
function stepAt(x) { return x.state === 'received' ? 0 : x.state === 'decision' ? 1 : x.state === 'consent' ? 2 : x.state === 'sign' ? (x.signed_at ? 4 : 3) : x.state === 'done' ? 5 : -1; }
/* المرحلة التي أُغلق عندها الطلب */
function closedAt(x) { var S = x.signs || []; if (S.some(function (g) { return g.step === 'consent' && g.decision === 'accept'; })) return 3; if (S.some(function (g) { return g.step === 'consent'; }) || x.close_reason === 'expired' || x.close_reason === 'declined') return 2; return x.close_reason === 'cancelled' ? 0 : 1; }
function nextText(x) {
if (legacy(x)) return 'نُفّذ الطلب' + (x.executed_at ? ' في ' + at(x.executed_at) : '') + ' بنقل الدفعة إلى العقد ' + (x.executed_ref.to || '—') + '. للاطلاع فقط — لا حسبة ولا ملحق لهذا الطلب.';
var sup = x.me && x.me.super, ok = x.result && x.result.ok, exp = x.link ? at(x.link.expires_at) : '';
if (x.state === 'received' || x.state === 'decision') {
if (!ok) return 'أكمل الحسبة: الدفعة المؤجلة والرسم والتوزيع والموعد الجديد — يظهر الملخص جانبها أثناء الإدخال.';
if (x.need_approval) return sup ? 'راجع العرض في «المعاينة» ثم اعتمده ليصل العميل رابط الموافقة.' : 'رُفع العرض للمشرف العام — لا يصل العميل قبل اعتماده.';
return sup ? 'الحسبة مكتملة. راجع المستند والمعاينة ثم اعتمد ليصل العميل رابط الموافقة.' : 'الحسبة مكتملة. ارفع العرض للمشرف العام ليعتمده ويُرسَل للعميل.';
}
if (x.state === 'consent') return 'العرض عند العميل للموافقة' + (exp ? ' — الرابط صالح حتى ' + exp : '') + '. بانتهاء المدة يُغلق الطلب تلقائيًا.';
if (x.state === 'sign') return x.signed_at ? 'وقّع العميل وتعذّر التنفيذ الآلي — لم يتغير العقد. أعد المحاولة أو اسحب العرض.' : 'وافق العميل، والملحق عنده للتوقيع' + (exp ? ' — حتى ' + exp : '') + '. بعد توقيعه يُعدَّل العقد آليًا.';
if (x.state === 'done') return 'نُفّذ الطلب وعُدّل العقد' + (x.executed_at ? ' في ' + at(x.executed_at) : '') + '. الملحق جاهز للتنزيل والإرسال.';
if (x.state === 'closed') return 'أُغلق الطلب: ' + (x.close_t || '') + (x.close_note ? ' — ' + x.close_note : '') + '. العقد كما هو.';
return '';
}
function nextEl(x) {
var closed = x.state === 'closed', cur = closed ? closedAt(x) : stepAt(x), bad = closed || !!x.exec_error;
var steps = el('ol', { class: 'cr-steps', 'aria-label': 'مراحل الطلب' }, STEPS.map(function (t, i) {
var done = i < cur, now = i === cur;
return el('li', { class: 'cr-step' + (done ? ' is-done' : '') + (now ? (bad ? ' is-bad' : ' is-cur') : ''), 'aria-current': now ? 'step' : null }, [el('i', { text: done ? '✓' : now && bad ? '!' : String(i + 1) }), t]);
}));
var more = moreItems(x);
return el('aside', { class: 'cr-next', 'aria-label': 'الخطوة التالية' }, [
el('div', { class: 'cr-next-h' }, [el('b', { text: closed ? 'أُغلق الطلب' : x.state === 'done' ? 'اكتمل الطلب' : 'الخطوة التالية' }), ST.save.st !== 'idle' ? saveInd() : el('small', { text: 'آخر تحديث ' + at(x.updated_at) })]),
steps, el('p', { text: nextText(x) }), primary(x),
more.length ? el('div', { class: 'cr-more' }, more.map(function (m) { return el('button', { type: 'button', class: m[3] || '', disabled: ST.busy, 'data-live-ok': '', onclick: m[2] }, [icon(m[1]), m[0]]); })) : null]);
}
function tabsEl(x) {
return el('nav', { class: 'cr-tabs', role: 'tablist', 'aria-label': 'أقسام الطلب' }, TABS.filter(function (t) { return !legacy(x) || t[0] === 'req' || t[0] === 'log'; }).map(function (t) {
var s = tabState(x, t[0]);
return el('button', { type: 'button', role: 'tab', 'aria-selected': ST.tab === t[0] ? 'true' : 'false', class: ST.tab === t[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.tab = t[0]; draw(); } },
[icon(t[2]), t[1], s === 'ok' ? el('i', { class: 'cr-dot is-ok', title: 'مكتمل' }) : s === 'miss' ? el('i', { class: 'cr-dot is-miss', title: 'ينقصه' }) : s === 'live' ? el('i', { class: 'cr-dot is-live', title: 'رابط نشط' }) : null]);
}));
}
function fact(k, v, cls) { return el('div', { class: 'cr-fact' + (cls ? ' ' + cls : '') }, [el('small', { text: k }), el('b', {}, [v])]); }
function saveInd() { var s = ST.save; return el('span', { class: 'cr-save is-' + s.st, 'aria-live': 'polite', text: s.st === 'saving' ? 'جارٍ الحفظ…' : s.st === 'saved' ? 'حُفظ' : s.st === 'err' ? 'تعذّر الحفظ: ' + s.err : '' }); }

/* ── الحفظ التلقائي ── */
function queue(part) {
var x = ST.x; if (!editable(x)) return;
ST.save.pending = Object.assign(ST.save.pending || {}, part); ST.save.st = 'saving'; paintSave();
clearTimeout(ST.save.t); ST.save.t = setTimeout(flushSave, 700);
}
/* الحفظ متسلسل: كل حفظ ينتظر سابقه — فلا يصل الأقدم بعد الأحدث */
var CHAIN = Promise.resolve();
function flushSave() {
clearTimeout(ST.save.t);
CHAIN = CHAIN.then(async function () {
var p = ST.save.pending; if (!p || !ST.x) return;
ST.save.pending = null; ST.save.st = 'saving'; paintSave();
try {
var j = await api('POST', '/admin/api/crq/' + ST.x.id + '/save', p);
ST.x.result = j.result; ST.x.state = 'decision'; ST.x.need_approval = false; ST.x.exec_error = null; if (j.updated_at) ST.x.updated_at = j.updated_at; ST.save.st = ST.save.pending ? 'saving' : 'saved'; ST.save.err = '';
paintCalcOut(); paintHead();
} catch (e) { ST.save.st = 'err'; ST.save.err = e.message; }
paintSave();
});
return CHAIN;
}
function paintSave() { R.querySelectorAll('.cr-save').forEach(function (n) { n.replaceWith(saveInd()); }); }
function paintHead() { var h = R.querySelector('.cr-r1'), t = R.querySelector('.cr-tabs'); if (h) h.replaceWith(el('div', { class: 'cr-r1' }, [heroEl(ST.x), nextEl(ST.x)])); if (t) t.replaceWith(tabsEl(ST.x)); }

/* ── 1) الطلب ── */
function tabReq(x) {
var u = x.user || {}, c = x.contract || {}, ed = editable(x);
var pays = (x.payments || []).filter(function (p) { return ed || (x.payment_ids || []).indexOf(p.pid) >= 0; }).map(function (p) {
var on = (x.payment_ids || []).indexOf(p.pid) >= 0;
return el('label', { class: 'cr-pick' + (on ? ' is-on' : '') + (p.open ? '' : ' is-off') }, [el('input', { type: 'checkbox', checked: on, disabled: !ed || !p.open, onchange: function (e) {
x.payment_ids = (x.payment_ids || []).filter(function (id) { return id !== p.pid; }); if (e.target.checked) x.payment_ids.push(p.pid); queue({ payment_ids: x.payment_ids }); draw(); } }),
el('span', {}, ['الدفعة ' + p.seq + ' · ' + day(p.due) + ' · ', ltr(money(p.amount)), p.open ? null : el('small', { class: 'cr-sub', text: p.paid ? ' مسدَّدة' : p.settle_kind ? ' مسوّاة' : ' مدفوعة جزئيًا' })])]);
});
return [el('div', { class: 'cr-cols' }, [
el('section', { class: 'cr-card' }, [el('h2', { text: 'العميل' }), kvs([['الاسم', u.name], ['الجوال', u.phone ? ltr(u.phone) : '—'], ['البريد', u.email ? ltr(u.email) : '—'], ['رقم العميل', u.tera_id ? ltr(u.tera_id) : '—']])]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'العقد' }), kvs([['رقم العقد', ltr(c.no)], ['المنتج', c.product || '—'], ['قيمة العقد', el('span', {}, [ltr(money(c.total)), ' ر.س'])], ['البداية والنهاية', day(c.start) + ' — ' + day(c.end)]])])]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'الدفعة المطلوب تأجيلها' }), el('p', { class: 'cr-hint', text: ed ? 'يمكن تعديل الاختيار قبل الاعتماد — الدفعات المسددة لا تُختار.' : '' }), el('div', { class: 'cr-picks' }, pays), ed ? saveInd() : null]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'بيانات الطلب' }), kvs([['مصدر الطلب', x.origin === 'client' ? 'قدّمه العميل من حسابه' : 'أنشأه الفريق'], ['تاريخ الطلب', at(x.created_at)], ['ملاحظة العميل', x.client_note || '—'], ['أعدّه', x.prepared_t || '—'], ['اعتمده', x.approved_t ? x.approved_t + ' · ' + at(x.approved_at) : '—']])])];
}
function kvs(L) { return el('dl', { class: 'cr-kv' }, [].concat.apply([], L.map(function (r) { return [el('dt', { text: r[0] }), el('dd', {}, [r[1] == null || r[1] === '' ? '—' : r[1]])]; }))); }

/* ── 2) الحسبة: البنود · التوزيع · الجدولة — والملخص جانبًا أثناء الإدخال ── */
var ERRT = { no_targets: 'اختر الدفعة المطلوب تأجيلها من تبويب «الطلب».', target_not_open: 'الدفعة المختارة لم تعد مستحقة.', bad_line: 'لكل بند اسم من حرفين على الأقل.', bad_amount: 'مبلغ غير صحيح', bad_date: 'تاريخ غير صحيح — الموعد الجديد بعد موعد الدفعة وبعد اليوم', date_required: 'حدد الموعد الجديد للدفعة المؤجلة', dist_sum: 'مجموع التوزيع اليدوي لا يساوي إجمالي الإضافة', no_open: 'لا دفعات مستحقة في العقد', contract_closed: 'العقد مغلق', bad_input: 'بيانات غير صالحة', kind_inactive: 'النوع غير مفعّل' };
function calcOf(x) {
var c = clone(x.calc || {}), s = x.settings || {};
if (!Array.isArray(c.lines) || !c.lines.length) c.lines = [{ id: 'fee', t: s.defer_fee_label || 'رسم التأجيل', amt: String(s.defer_fee || 0), vat: s.defer_fee_vat !== false }];
c.hide = Array.isArray(c.hide) ? c.hide : []; c.dist = c.dist || { mode: 'equal' }; c.sched = c.sched || { mode: 'end' };
c.dist.amounts = c.dist.amounts || {}; c.sched.dates = c.sched.dates || {};
return c;
}
function tabCalc(x) {
var ed = editable(x), c = calcOf(x);
function upd() { x.calc = c; queue({ calc: c }); }
var lines = el('div', { class: 'cr-lines' }, c.lines.map(function (l, i) {
var hid = c.hide.indexOf(l.id) >= 0;
return el('div', { class: 'cr-line' }, [
el('input', { type: 'text', value: l.t, disabled: !ed, 'aria-label': 'اسم البند', oninput: function (e) { l.t = e.target.value; upd(); } }),
el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: l.amt, disabled: !ed, 'aria-label': 'المبلغ', oninput: function (e) { l.amt = e.target.value.replace(/[^\d.]/g, ''); upd(); } }),
el('label', { class: 'cr-chk' }, [el('input', { type: 'checkbox', checked: !!l.vat, disabled: !ed, onchange: function (e) { l.vat = e.target.checked; upd(); } }), 'ضريبة']),
el('label', { class: 'cr-chk', title: 'المخفي يظهر للعميل ضمن «' + (c.svc_label || 'الرسوم الإدارية والخدمة') + '»' }, [el('input', { type: 'checkbox', checked: !hid, disabled: !ed, onchange: function (e) { c.hide = c.hide.filter(function (k) { return k !== l.id; }); if (!e.target.checked) c.hide.push(l.id); upd(); } }), 'ظاهر للعميل']),
ed && c.lines.length > 1 ? el('button', { type: 'button', class: 'cr-x', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { c.lines.splice(i, 1); c.hide = c.hide.filter(function (k) { return k !== l.id; }); upd(); draw(); } }, [icon('trash')]) : null]);
}));
var addLine = ed && c.lines.length < 12 ? btn('إضافة بند', { ic: 'plus', on: function () { var n = 1; while (c.lines.some(function (l) { return l.id === 'b' + n; })) n++; c.lines.push({ id: 'b' + n, t: '', amt: '0', vat: false }); upd(); draw(); } }) : null;
var opts = function (cur, L, on) { return el('select', { disabled: !ed, onchange: function (e) { on(e.target.value); } }, L.map(function (o) { return el('option', { value: o[0], selected: cur === o[0], text: o[1] }); })); };
var setup = el('div', { class: 'cr-grid' }, [
field('توزيع الإضافة على الدفعات', opts(c.dist.mode, [['equal', 'بالتساوي على الدفعات المتبقية'], ['ratio', 'بنسبة قيمة كل دفعة'], ['manual', 'يدويًا لكل دفعة']], function (v) { c.dist.mode = v; upd(); draw(); })),
field('جدولة الدفعة المؤجلة', opts(c.sched.mode, [['end', 'تنتقل إلى نهاية الجدول'], ['shift', 'ترحيل الدفعات منها شهرًا لكل دفعة'], ['manual', 'يدويًا بتاريخ لكل دفعة']], function (v) { c.sched.mode = v; upd(); draw(); })),
field('اسم سطر البنود المخفية', el('input', { type: 'text', value: c.svc_label || '', placeholder: 'الرسوم الإدارية والخدمة', disabled: !ed, oninput: function (e) { c.svc_label = e.target.value; upd(); } }))]);
var main = el('div', { class: 'cr-main' }, [el('section', { class: 'cr-card' }, [el('div', { class: 'cr-h2row' }, [el('h2', { text: 'البنود' }), ed ? saveInd() : null]), lines, addLine]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'التوزيع والجدولة' }), setup]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'جدول الدفع قبل وبعد' }), el('div', { id: 'cr-sched', class: 'cr-tw' }, [schedTable(x, c, ed, upd)])])]);
return [el('div', { class: 'cr-split' }, [main, el('aside', { class: 'cr-side', id: 'cr-sum' }, [summary(x)])])];
}
function summary(x) {
var r = x.result || {};
if (!r.ok) return el('section', { class: 'cr-card is-sum' }, [el('h2', { text: 'الملخص' }), note('warn', ERRT[r.error] || 'أكمل الحسبة', r.seq ? [el('span', { text: 'الدفعة ' + r.seq })] : r.error === 'dist_sum' ? [el('span', { text: 'المطلوب ' + money(r.need) + ' · المدخل ' + money(r.got) })] : [])]);
var L = [['الرسوم', money(r.fees)], ['ضريبة القيمة المضافة (' + r.vat_rate + '%)', money(r.vat)], ['إجمالي الإضافة على العقد', money(r.total), 'is-t'], ['قيمة العقد قبل', money(r.contract && r.contract.total_before)], ['قيمة العقد بعد', money(r.contract && r.contract.total_after), 'is-t'],
['الدفعات المعدّلة', String((r.rows || []).filter(function (z) { return z.open && (Number(z.add) !== 0 || z.due_after !== z.due_before); }).length)]];
return el('section', { class: 'cr-card is-sum' }, [el('h2', { text: 'الملخص' }), el('ul', { class: 'cr-sum' }, L.map(function (z) { return el('li', { class: z[2] || '' }, [el('span', { text: z[0] }), ltr(z[1])]); })),
el('h3', { text: 'ما يراه العميل' }), el('ul', { class: 'cr-sum is-cl' }, (r.client_lines || []).map(function (l) { return el('li', {}, [el('span', { text: l.t }), ltr(money(l.amt))]); }))]);
}
function schedTable(x, c, ed, upd) {
var r = x.result || {}, rows = r.ok ? r.rows : (x.payments || []).map(function (p) { return { pid: p.pid, seq: p.seq, open: p.open, target: (x.payment_ids || []).indexOf(p.pid) >= 0, due_before: p.due, due_after: p.due, amt_before: p.amount, add: 0, amt_after: p.amount }; });
var md = c.sched.mode === 'manual', ma = c.dist.mode === 'manual';
return el('table', { class: 'cr-tbl is-sched' }, [el('thead', {}, [el('tr', {}, ['الدفعة', 'الموعد الحالي', 'الموعد الجديد', 'القيمة', 'الإضافة', 'القيمة الجديدة'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, rows.map(function (z) {
var due = md && z.open && ed ? el('input', { type: 'date', value: c.sched.dates[z.pid] || (z.target ? '' : String(z.due_after).slice(0, 10)), 'aria-label': 'الموعد الجديد للدفعة ' + z.seq, onchange: function (e) { if (e.target.value) c.sched.dates[z.pid] = e.target.value; else delete c.sched.dates[z.pid]; upd(); } }) : el('span', { class: z.due_after !== z.due_before ? 'is-ch' : '', text: day(z.due_after) });
var add = ma && z.open && ed ? el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: c.dist.amounts[z.pid] || '', placeholder: '0', 'aria-label': 'إضافة الدفعة ' + z.seq, oninput: function (e) { var v = e.target.value.replace(/[^\d.]/g, ''); if (v) c.dist.amounts[z.pid] = v; else delete c.dist.amounts[z.pid]; upd(); } }) : ltr(money(z.add));
return el('tr', { class: (z.target ? 'is-t ' : '') + (z.open ? '' : 'is-off'), 'data-pid': z.pid }, [el('td', { 'data-l': 'الدفعة' }, [String(z.seq), z.target ? el('small', { class: 'cr-sub', text: 'مؤجَّلة' }) : null, !z.open ? el('small', { class: 'cr-sub', text: 'مسدَّدة' }) : null]),
el('td', { 'data-l': 'الموعد الحالي', text: day(z.due_before) }), el('td', { 'data-l': 'الموعد الجديد', class: 'c-due' }, [due]), el('td', { 'data-l': 'القيمة' }, [ltr(money(z.amt_before))]),
el('td', { 'data-l': 'الإضافة', class: 'c-add' }, [add]), el('td', { 'data-l': 'القيمة الجديدة', class: 'c-after' }, [ltr(money(z.amt_after))])]);
}))]);
}
/* بعد الحفظ: يُحدَّث الملخص والخلايا المحسوبة فقط — لا يُعاد رسم الحقول فلا يضيع موضع الكتابة */
function paintCalcOut() {
var s = R.querySelector('#cr-sum'); if (s) { s.innerHTML = ''; s.appendChild(summary(ST.x)); }
var r = ST.x.result || {}; if (!r.ok) return;
(r.rows || []).forEach(function (z) {
var tr = R.querySelector('tr[data-pid="' + z.pid + '"]'); if (!tr) return;
var a = tr.querySelector('.c-after'); if (a) { a.innerHTML = ''; a.appendChild(ltr(money(z.amt_after))); }
var d = tr.querySelector('.c-add'); if (d && !d.querySelector('input')) { d.innerHTML = ''; d.appendChild(ltr(money(z.add))); }
var u = tr.querySelector('.c-due'); if (u && !u.querySelector('input')) { u.innerHTML = ''; u.appendChild(el('span', { class: z.due_after !== z.due_before ? 'is-ch' : '', text: day(z.due_after) })); }
});
}

/* ── 3) المستند: أقسام الملحق — إظهار وإخفاء وتعديل النص لهذا العميل ── */
function docOf(x) { var d = Object.assign({}, clone((x.settings || {}).doc), clone(x.doc)); d.show = Object.assign({ rows: true, lines: true, terms: true, note: true, sign: true }, ((x.settings || {}).doc || {}).show || {}, (x.doc || {}).show || {}); d.terms = Array.isArray(d.terms) ? d.terms : []; return d; }
function tabDoc(x) {
var ed = editable(x), d = docOf(x);
function upd() { x.doc = d; queue({ doc: d }); }
function sec(title, k, kids) { return el('section', { class: 'cr-card' }, [el('div', { class: 'cr-h2row' }, [el('h2', { text: title }), k ? el('label', { class: 'cr-chk' }, [el('input', { type: 'checkbox', checked: d.show[k] !== false, disabled: !ed, onchange: function (e) { d.show[k] = e.target.checked; upd(); } }), 'ظاهر']) : null])].concat(kids || [])); }
function txt(k, rows) { return el(rows > 1 ? 'textarea' : 'input', { type: 'text', rows: rows || null, value: d[k] || '', disabled: !ed, 'aria-label': k, oninput: function (e) { d[k] = e.target.value; upd(); } }); }
var terms = el('ol', { class: 'cr-terms' }, d.terms.map(function (t, i) {
return el('li', {}, [el('textarea', { rows: '2', value: t, disabled: !ed, 'aria-label': 'الشرط ' + (i + 1), oninput: function (e) { d.terms[i] = e.target.value; upd(); } }), ed ? el('button', { type: 'button', class: 'cr-x', 'aria-label': 'حذف الشرط', 'data-live-ok': '', onclick: function () { d.terms.splice(i, 1); upd(); draw(); } }, [icon('trash')]) : null]);
}));
return [el('div', { class: 'cr-h2row is-top' }, [el('p', { class: 'cr-hint', text: 'النصوص هنا نسخة هذا العميل — الأصل من إعدادات التأجيل. المعاينة في تبويب «المعاينة».' }), ed ? saveInd() : null]),
sec('العنوان والتمهيد', null, [field('عنوان المستند', txt('title')), field('التمهيد', txt('intro', 3))]),
sec('رسوم التأجيل وقيمة العقد', 'lines'), sec('جدول الدفعات بعد التعديل', 'rows'),
sec('الشروط', 'terms', [terms, ed ? btn('إضافة شرط', { ic: 'plus', on: function () { d.terms.push(''); upd(); draw(); } }) : null]),
sec('إقرار العميل وتوقيعه', 'sign', [field('نص الإقرار', txt('ack', 2))]), sec('التنويه في آخر المستند', 'note', [txt('note', 2)]),
ed && (x.doc && Object.keys(x.doc).length) ? btn('استعادة النص الافتراضي', { on: function () { x.doc = {}; queue({ doc: {} }); draw(); } }) : null,
x.me && x.me.super && ed ? btn('اعتماد هذه النصوص نصًا افتراضيًا لكل الطلبات', { on: async function () { try { await api('POST', '/admin/api/crq-settings', { doc: d }); toast(true, 'اعتُمدت النصوص افتراضيًا.'); } catch (e) { toast(false, e.message); } } }) : null];
}

/* ── 4) الرابطان: مدة الصلاحية ونصوص صفحتي «الموافقة» و«التوقيع» ── */
function tabLinks(x) {
var ed = editable(x), s = x.settings || {};
var pg = { consent: Object.assign({}, clone((s.page || {}).consent), clone((x.page || {}).consent)), sign: Object.assign({}, clone((s.page || {}).sign), clone((x.page || {}).sign)) };
['consent', 'sign'].forEach(function (k) { pg[k].show = Object.assign({ rows: true, lines: true, terms: true }, ((s.page || {})[k] || {}).show || {}, ((x.page || {})[k] || {}).show || {}); });
function upd() { x.page = pg; queue({ page: pg }); }
function page(k, title) {
var p = pg[k];
var inp = function (f, rows) { return el(rows ? 'textarea' : 'input', { type: 'text', rows: rows || null, value: p[f] || '', disabled: !ed, oninput: function (e) { p[f] = e.target.value; upd(); } }); };
var tg = function (f, lab) { return el('label', { class: 'cr-chk' }, [el('input', { type: 'checkbox', checked: p.show[f] !== false, disabled: !ed, onchange: function (e) { p.show[f] = e.target.checked; upd(); } }), lab]); };
return el('section', { class: 'cr-card' }, [el('h2', { text: title }), field('العنوان', inp('title')), field('التمهيد', inp('intro', 2)), field('نص الإقرار', inp('ack', 2)),
el('div', { class: 'cr-chks' }, [tg('lines', 'الرسوم والإجمالي'), tg('rows', 'جدول الدفع'), k === 'sign' ? tg('terms', 'الملحق كاملًا') : null])]);
}
var hrs = x.valid_hours || s.consent_hours || 48;
var links = (x.links || []).slice().reverse();
var ST2 = { active: ['نشط', 'ok'], used: ['استُخدم', 'info'], expired: ['انتهى', 'warn'], locked: ['أُقفل', 'bad'], revoked: ['أُلغي', 'off'] };
return [el('div', { class: 'cr-h2row is-top' }, [el('p', { class: 'cr-hint', text: 'العميل يصله رابطان فقط: الموافقة على العرض، ثم توقيع الملحق. بانتهاء مدة أي رابط يُغلق الطلب تلقائيًا «انتهت مدة العرض».' }), ed ? saveInd() : null]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'مدة رابط الموافقة' }), el('select', { disabled: !ed, onchange: function (e) { x.valid_hours = e.target.value ? Number(e.target.value) : null; queue({ valid_hours: x.valid_hours }); } },
[['', 'الافتراضي (' + (s.consent_hours || 48) + ' ساعة)'], ['24', '24 ساعة'], ['48', '48 ساعة'], ['72', '72 ساعة'], ['168', 'أسبوع']].map(function (o) { return el('option', { value: o[0], selected: String(x.valid_hours || '') === o[0], text: o[1] }); })),
el('small', { class: 'cr-hint', text: 'رابط التوقيع بمدة ' + (s.sign_hours || 48) + ' ساعة من الموافقة. الحالية: ' + hrs + ' ساعة.' })]),
el('div', { class: 'cr-cols' }, [page('consent', 'صفحة الموافقة (الرابط 1)'), page('sign', 'صفحة التوقيع (الرابط 2)')]),
links.length ? el('section', { class: 'cr-card' }, [el('h2', { text: 'الروابط المرسلة' }), el('div', { class: 'cr-tw' }, [el('table', { class: 'cr-tbl' }, [el('thead', {}, [el('tr', {}, ['الرابط', 'الحالة', 'أُرسل', 'صالح حتى', 'فُتح', 'التحقق', 'مرات طلب الرمز'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, links.map(function (l) { var s2 = ST2[l.state] || [l.state, 'info']; return el('tr', {}, [el('td', { 'data-l': 'الرابط', text: l.step === 'sign' ? 'التوقيع' : 'الموافقة' }), el('td', { 'data-l': 'الحالة' }, [el('span', { class: 'cr-badge is-' + s2[1], text: s2[0] })]),
el('td', { 'data-l': 'أُرسل', text: at(l.created_at) }), el('td', { 'data-l': 'صالح حتى', text: at(l.expires_at) }), el('td', { 'data-l': 'فُتح', text: l.opened_at ? at(l.opened_at) : '—' }), el('td', { 'data-l': 'التحقق', text: l.factor === 'whatsapp' ? 'واتساب' : l.factor === 'email' ? 'البريد' : '—' }), el('td', { 'data-l': 'مرات طلب الرمز', text: String(l.sends || 0) })]); }))])])]) : null];
}

/* ── 5) المعاينة: المكان الوحيد — المستند PDF ورابطا العميل بعرض جوال أو شاشة ── */
function tabPreview(x) {
var P = ST.pv;
var seg = el('div', { class: 'cr-seg' }, [['consent', 'رابط الموافقة'], ['sign', 'رابط التوقيع'], ['doc', 'المستند PDF']].map(function (m) { return el('button', { type: 'button', class: P.mode === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { P.mode = m[0]; draw(); } }, [m[1]]); }));
var dev = P.mode === 'doc' ? null : el('div', { class: 'cr-seg is-sm' }, [['phone', 'جوال', 'phone'], ['web', 'شاشة', 'screen']].map(function (m) { return el('button', { type: 'button', class: P.dev === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { P.dev = m[0]; draw(); } }, [icon(m[2]), m[1]]); }));
var frame = el('iframe', { class: 'cr-pv is-' + (P.mode === 'doc' ? 'doc' : P.dev), title: 'المعاينة' });
var wrap = el('div', { class: 'cr-pv-w' }, [frame]);
loadPreview(x, frame);
return [el('div', { class: 'cr-h2row is-top' }, [seg, dev, P.mode === 'doc' ? btn('تنزيل PDF', { ic: 'down', on: pdf }) : null]), ST.save.pending ? note('info', 'تُحفظ آخر تعديلاتك ثم تظهر هنا.') : null, wrap];
}
async function loadPreview(x, frame) {
try {
await flushSave();
if (ST.pv.mode === 'doc') { var r = await api('GET', '/admin/api/crq/' + x.id + '/doc', null, true); frame.setAttribute('sandbox', ''); frame.srcdoc = await r.text(); return; }
var j = await api('GET', '/admin/api/crq/' + x.id + '/view/' + ST.pv.mode);
frame.src = '/crq/?preview=1';
var sendIt = function (e) { if (e.origin !== location.origin || !e.data || e.data.type !== 'crq-preview-ready' || e.source !== frame.contentWindow) return; frame.contentWindow.postMessage({ type: 'crq-preview', view: j.view, doc_html: j.doc_html || '', expires_at: x.link && x.link.expires_at }, location.origin); window.removeEventListener('message', sendIt); };
window.addEventListener('message', sendIt);
} catch (e) { frame.replaceWith(note('bad', e.message)); }
}

/* ── 6) السجل: المراحل بأوقاتها والتوقيعات والتنفيذ ── */
function tabLog(x) {
var L = (x.log || []).slice().reverse();
var tl = el('ol', { class: 'cr-tl' }, L.map(function (g) { return el('li', { class: 'is-' + g.kind }, [el('time', { text: at(g.at) }), el('div', {}, [el('b', { text: g.action }), g.note ? el('p', { text: g.note }) : null, el('small', { text: g.kind === 'client' ? 'العميل' : g.kind === 'system' ? 'النظام' : (g.by || 'الفريق') }), g.client ? el('small', { class: 'cr-cl', text: 'يراه العميل: ' + g.client }) : null])]); }));
var sg = (x.signs || []).map(function (s) {
return el('div', { class: 'cr-sg' }, [el('b', { text: (s.step === 'sign' ? 'التوقيع' : 'الموافقة') + ' · ' + (s.decision === 'accept' ? 'قبول' : 'اعتذار') }),
s.image ? el('img', { src: s.image, alt: 'توقيع العميل' }) : s.method === 'type' ? el('span', { class: 'cr-typed', text: s.name }) : null,
kvs([['الاسم', s.name || '—'], ['الوقت', at(s.at)], ['التحقق', s.factor === 'whatsapp' ? 'واتساب' : s.factor === 'email' ? 'البريد' : '—'], ['السبب', s.reason || '—']])]);
});
var ex = legacy(x) ? el('section', { class: 'cr-card' }, [el('h2', { text: 'التنفيذ' }), kvs([['نُفّذ', at(x.executed_at)], ['نُقلت الدفعة إلى العقد', ltr(x.executed_ref.to || '—')], ['ملاحظة التنفيذ', x.executed_ref.note || '—']])])
: x.executed_ref ? el('section', { class: 'cr-card' }, [el('h2', { text: 'التنفيذ' }), kvs([['نُفّذ', at(x.executed_at)], ['قيمة العقد قبل', ltr(money(x.executed_ref.contract_before))], ['قيمة العقد بعد', ltr(money(x.executed_ref.contract_after))], ['الدفعات المعدّلة', String(x.executed_ref.changed || 0)]]),
x.state === 'done' ? el('div', { class: 'cr-acts' }, [btn('تنزيل الملحق PDF', { ic: 'down', on: pdf }), btn('إرسال الملحق للعميل', { ic: 'send', on: function () { ask('إرسال الملحق للعميل', 'يصل العميل الملحق PDF مع رسالة «نُفّذ طلبك».', 'إرسال', function () { act('send-doc', null, 'أُرسل الملحق للعميل.'); }); } })]) : null]) : null;
return [el('div', { class: 'cr-cols' }, [el('section', { class: 'cr-card' }, [el('h2', { text: 'مراحل الطلب' }), tl]), el('div', { class: 'cr-stack' }, [ex, sg.length ? el('section', { class: 'cr-card' }, [el('h2', { text: 'قرارات العميل وتوقيعه' })].concat(sg)) : null])])];
}

/* ═════════ الرسم ═════════ */
function draw() {
R.innerHTML = '';
var kids = ST.id ? detailView() : listView();
if (ST.flash) kids.unshift(el('div', { class: 'cr-toast is-' + (ST.flash[0] ? 'ok' : 'bad'), role: 'status', text: ST.flash[1] }));
kids.forEach(function (k) { if (k) R.appendChild(k); });
}
function run() { if (!ST.rows && !ST.loading) { ST.loading = true; loadList(); } draw(); return R; }
window.addEventListener('beforeunload', function (e) { if (ST.save.pending) { e.preventDefault(); e.returnValue = ''; } });
function reg() { if (window.__teraApp && typeof window.__teraApp.page === 'function') { window.__teraApp.page(KEY, TITLE, ['clock', 'violet'], run, UP); return true; } return false; }
if (!reg()) { (window.__crqQ = window.__crqQ || []).push(reg); }
})();
