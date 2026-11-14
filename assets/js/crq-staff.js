/* v872: «تغطية الضمانات» بطاقة بعرض العمود الرئيسي (جدولا الالتزام والضمانات، العقود الخمسة الأولى ثم «عرض الكل»).
* v871: «تغطية الضمانات» في تبويب البنود والحسبة — تنبيه للموظف غير إلزامي (crq_svc_guar).
* v867: مصدر واحد — «المستند» ملحق من «قوالب المستندات» (df) و«صفحة العميل» صفحتا الرابط من «صفحات الرابط» (lp.js)،
* لكلٍّ القالب العام أو نسخة لهذا العميل بالمحرّر نفسه ومعاينته الحقيقية، والبنود من القائمة الجاهزة («الرسوم والضرائب والعمولات»).
* v865 (طلبات التأجيل السابقة المنقولة: للسجل) · v862 — منظومة طلبات العقود الموحّدة (crq_) — صفحة الفريق: «طلبات تأجيل دفعة»
* ملف مستقل (لا طبقات فوق platform.js): المنصة تعطي مكان الصفحة ورأسها (المسار والأيقونة والعنوان) ورمز الجلسة،
* وهذه الوحدة ترسم المحتوى بلغة قسم العملاء المعتمدة، والخادم والقاعدة يفرضان كل قاعدة.
* القائمة: بطاقات مؤشرات هي الفلتر الوحيد ← شريط أدوات ← جدول بصفوف.
* صفحة الطلب: بطاقة الحقائق + «الخطوة التالية» جانبًا (المراحل والإجراء الرئيسي وبقية الإجراءات)، ثم ستة تبويبات لكلٍّ عمل واحد:
*   الطلب · البنود والحسبة · المستند · صفحة العميل · السجل
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
function defaultTab(x) { if (legacy(x)) return 'req'; return x.state === 'received' || x.state === 'decision' ? (x.result && x.result.ok ? 'calc' : 'req') : x.state === 'done' || x.state === 'closed' ? 'log' : 'page'; }
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

/* إعدادات التأجيل (المشرف العام): مدة الرابطين — النصوص والألوان والبنود من مصادرها الواحدة */
function loadSettings() { ST.set = { s: clone(ST.settings || { consent_hours: 48, sign_hours: 48 }) }; draw(); }
function settingsPanel() {
var s = ST.set && ST.set.s; if (!s) return el('section', { class: 'cr-card' }, [el('span', { text: 'جارٍ التحميل…' })]);
function num(k, lab, hint) { return field(lab, el('input', { type: 'number', min: '1', max: '720', step: '1', value: s[k], oninput: function (e) { s[k] = e.target.value; } }), hint); }
return el('section', { class: 'cr-card' }, [el('h2', { text: 'إعدادات طلبات التأجيل' }), el('div', { class: 'cr-grid' }, [
num('consent_hours', 'مدة رابط الموافقة (ساعة)', 'بانتهائها يُغلق الطلب «انتهت مدة العرض».'), num('sign_hours', 'مدة رابط التوقيع (ساعة)')]),
el('ul', { class: 'cr-src' }, [el('li', {}, [el('b', { text: 'المستند (ملحق تأجيل الدفعة): ' }), 'الإعدادات ← قوالب المستندات ← ملحق تأجيل الدفعة.']),
el('li', {}, [el('b', { text: 'صفحتا الرابط (الألوان والنصوص والأقسام): ' }), 'الإعدادات ← قوالب المستندات ← عقد الشركاء ← صفحات الرابط.']),
el('li', {}, [el('b', { text: 'بنود الرسوم الجاهزة: ' }), 'الإعدادات ← الرسوم والضرائب والعمولات ← بنود رسوم طلبات العقود.'])]),
el('div', { class: 'cr-acts' }, [btn('حفظ الإعدادات', { cls: 'is-pri', on: async function () { try { await api('POST', '/admin/api/crq-settings', { consent_hours: s.consent_hours, sign_hours: s.sign_hours }); ST.set = null; loadList(); toast(true, 'حُفظت الإعدادات.'); } catch (e) { toast(false, e.message); } } }), btn('إغلاق', { on: function () { ST.set = null; draw(); } })])]);
}

/* ═════════ صفحة الطلب ═════════ */
var TABS = [['req', 'الطلب', 'user'], ['calc', 'البنود والحسبة', 'calc'], ['doc', 'المستند', 'file'], ['page', 'صفحة العميل', 'phone'], ['msg', 'رسائل العميل', 'send'], ['log', 'السجل', 'clock']];
function tabState(x, k) {
if (k === 'req') return (x.payment_ids || []).length ? 'ok' : 'miss';
if (k === 'calc') return x.result && x.result.ok ? 'ok' : 'miss';
if (k === 'doc') return 'ok';
if (k === 'page') return x.state === 'consent' || x.state === 'sign' ? 'live' : 'ok';
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
var body = ST.tab === 'req' ? tabReq(x) : ST.tab === 'calc' ? tabCalc(x) : ST.tab === 'doc' ? tabDoc(x) : ST.tab === 'page' ? tabPage(x) : ST.tab === 'msg' ? tabMsg(x) : tabLog(x);
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
if (!ok) return 'أكمل «البنود والحسبة»: البنود من القائمة الجاهزة والتوزيع والموعد الجديد — يظهر الملخص المالي جانبها أثناء الإدخال.';
if (x.need_approval) return sup ? 'راجع «المستند» و«صفحة العميل» ثم اعتمد ليصل العميل رابط الموافقة.' : 'رُفع العرض للمشرف العام — لا يصل العميل قبل اعتماده.';
return sup ? 'الحسبة مكتملة. راجع «المستند» و«صفحة العميل» ثم اعتمد ليصل العميل رابط الموافقة.' : 'الحسبة مكتملة. ارفع العرض للمشرف العام ليعتمده ويُرسَل للعميل.';
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

/* ── 2) البنود والحسبة: البنود من القائمة الجاهزة («+ إضافة بند ▾») بضريبة لكل بند وظهوره للعميل، ثم التوزيع والجدولة — والملخص المالي جانبًا ── */
var ERRT = { no_targets: 'اختر الدفعة المطلوب تأجيلها من تبويب «الطلب».', target_not_open: 'الدفعة المختارة لم تعد مستحقة.', bad_line: 'لكل بند اسم من حرفين على الأقل.', bad_amount: 'مبلغ غير صحيح', bad_date: 'تاريخ غير صحيح — الموعد الجديد بعد موعد الدفعة وبعد اليوم', date_required: 'حدد الموعد الجديد للدفعة المؤجلة', dist_sum: 'مجموع التوزيع اليدوي لا يساوي إجمالي الإضافة', no_open: 'لا دفعات مستحقة في العقد', contract_closed: 'العقد مغلق', bad_input: 'بيانات غير صالحة', kind_inactive: 'النوع غير مفعّل' };
var CALC_T = { fixed: 'مبلغ ثابت', pct: 'نسبة من الدفعة المؤجلة', manual: 'يُدخل لكل طلب' };
function rate(x) { var r = x.result && x.result.vat_rate != null ? Number(x.result.vat_rate) : Number(x.vat_rate); return isFinite(r) ? r : 15; }
function tgSum(x) { return (x.payments || []).filter(function (p) { return (x.payment_ids || []).indexOf(p.pid) >= 0; }).reduce(function (s, p) { return s + (Number(p.amount) || 0); }, 0); }
function readyAmt(x, f) { return f.calc === 'fixed' ? Number(f.value) || 0 : f.calc === 'pct' ? Math.round(tgSum(x) * (Number(f.value) || 0)) / 100 : 0; }
function readyOf(x, id) { return (x.ready || []).filter(function (f) { return f.k === id; })[0] || null; }
function calcOf(x) {
var c = clone(x.calc || {});
if (!Array.isArray(c.lines) || !c.lines.length) c.lines = (x.ready || []).filter(function (f) { return f.auto; }).map(function (f) { var a = readyAmt(x, f); return { id: f.k, t: f.name, amt: a ? String(a) : '0', vat: f.taxable !== false }; });
c.hide = Array.isArray(c.hide) ? c.hide : []; c.dist = c.dist || { mode: 'equal' }; c.sched = c.sched || { mode: 'end' };
c.dist.amounts = c.dist.amounts || {}; c.sched.dates = c.sched.dates || {};
return c;
}
function svcOf(c) { return String(c.svc_label || '').trim() || 'الرسوم الإدارية والخدمة'; }
/* قائمة منسدلة بجانب الزر — بحث وأقسام وبند جديد */
var POP = null;
function popClose() { if (POP) { POP.remove(); POP = null; document.removeEventListener('mousedown', popOut, true); } }
function popOut(e) { if (POP && !POP.contains(e.target) && !(POP.__a && POP.__a.contains(e.target))) popClose(); }
function pop(anchor, build) {
if (POP && POP.__a === anchor) { popClose(); return; } popClose();
var p = el('div', { class: 'cr-pop', role: 'dialog' }); p.__a = anchor; build(p);
document.body.appendChild(p); POP = p;
/* يتبع الزر عند التمرير أو تغيّر ارتفاع المعاينة — لا يُغلق */
p.__place = function () { if (!anchor.isConnected) { popClose(); return; } var r = anchor.getBoundingClientRect(), w = Math.min(380, innerWidth - 24);
p.style.width = w + 'px'; p.style.top = Math.max(12, Math.min(r.bottom + 6, innerHeight - p.offsetHeight - 12)) + 'px';
p.style.left = Math.max(12, Math.min(r.right - w, innerWidth - w - 12)) + 'px'; };
p.__place();
setTimeout(function () { document.addEventListener('mousedown', popOut, true); var q = p.querySelector('input'); if (q) q.focus(); }, 0);
}
window.addEventListener('scroll', function (e) { if (POP && !(e.target && e.target.nodeType === 1 && POP.contains(e.target))) POP.__place(); }, true); window.addEventListener('resize', function () { if (POP) POP.__place(); });
/* o: { groups:[[عنوان، [[نص، وصف، معطّل؟، قيمة]]]], pick(v), free: عنوان «كتابة جديد» } */
function picker(anchor, o) {
pop(anchor, function (p) {
var q = el('input', { type: 'search', placeholder: o.ph || 'ابحث…', 'aria-label': 'بحث' }), L = el('div', { class: 'cr-pop-l' }), F = el('div', { class: 'cr-pop-f' });
function paintL() {
var t = q.value.trim(); L.innerHTML = '';
o.groups.forEach(function (g) {
var it = g[1].filter(function (z) { return !t || String(z[0]).indexOf(t) >= 0 || String(z[1] || '').indexOf(t) >= 0; }); if (!it.length) return;
L.appendChild(el('div', { class: 'cr-pop-g', text: g[0] }));
it.forEach(function (z) { L.appendChild(el('button', { type: 'button', class: 'cr-pop-i', disabled: !!z[2], 'data-live-ok': '', onclick: function () { popClose(); o.pick(z[3] !== undefined ? z[3] : z[0]); } }, [el('span', {}, [el('b', { text: z[0] }), z[1] ? el('small', { text: z[1] }) : null]), el('i', { text: z[2] ? 'مضاف' : '+' })])); });
});
if (!L.children.length) L.appendChild(el('p', { class: 'cr-hint', text: 'لا نتائج.' }));
}
q.addEventListener('input', paintL); paintL();
if (o.free) F.appendChild(btn(o.free, { cls: 'is-sm', ic: 'plus', on: function () { var t = el('textarea', { rows: '2', placeholder: o.freePh || 'اكتب النص' }); F.innerHTML = ''; F.appendChild(t); F.appendChild(el('div', { class: 'cr-acts' }, [btn('إضافة', { cls: 'is-pri is-sm', on: function () { var v = t.value.trim(); if (v.length < 2) { t.focus(); return; } popClose(); o.pick({ free: v }); } }), btn('إلغاء', { cls: 'is-sm', on: popClose })])); t.focus(); } }));
p.appendChild(el('div', { class: 'cr-pop-h' }, [q])); p.appendChild(L); if (o.free) p.appendChild(F);
});
}
function tabCalc(x) {
var ed = editable(x), c = calcOf(x), R0 = rate(x);
function upd() { c.lines.forEach(function (l) { l.amt = String(l.amt || '').replace(/[^\d.]/g, '') || '0'; }); x.calc = c; queue({ calc: c }); paintSide(x); }
var tb = el('tbody', {}, c.lines.map(function (l, i) {
var f = readyOf(x, l.id), hid = c.hide.indexOf(l.id) >= 0;
var nm = f ? el('div', { class: 'cr-it-n' }, [el('b', { text: l.t }), el('small', { text: f.calc === 'pct' ? Number(f.value) + '٪ من الدفعة المؤجلة' : f.calc === 'fixed' ? 'بند جاهز · ثابت ' + money(f.value) : 'بند جاهز · يُدخل لكل طلب' })])
: el('input', { type: 'text', value: l.t, maxlength: '80', disabled: !ed, placeholder: 'مسمّى البند', 'aria-label': 'اسم البند', oninput: function (e) { l.t = e.target.value; upd(); } });
var am = el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: l.amt === '0' ? '' : l.amt, placeholder: '0', disabled: !ed, 'aria-label': 'المبلغ', oninput: function (e) { l.amt = e.target.value.replace(/[^\d.]/g, ''); upd(); var t = e.target.closest('tr').querySelector('.cr-it-tax'); if (t) t.textContent = l.vat && Number(l.amt) > 0 ? '+ ' + money(Number(l.amt) * R0 / 100) : ''; } });
return el('tr', {}, [
el('td', { 'data-l': 'البند' }, [nm]),
el('td', { 'data-l': 'المبلغ (ر.س)' }, [am, el('small', { class: 'cr-it-tax', text: l.vat && Number(l.amt) > 0 ? '+ ' + money(Number(l.amt) * R0 / 100) : '' })]),
el('td', { 'data-l': 'الضريبة' }, [el('select', { disabled: !ed, 'aria-label': 'الضريبة', onchange: function (e) { l.vat = e.target.value === '1'; upd(); draw(); } }, [el('option', { value: '1', selected: !!l.vat, text: 'خاضع ' + R0 + '٪' }), el('option', { value: '0', selected: !l.vat, text: 'غير خاضع' })])]),
el('td', { 'data-l': 'كيف يظهر للعميل' }, [el('select', { disabled: !ed, 'aria-label': 'الظهور للعميل', onchange: function (e) { c.hide = c.hide.filter(function (k) { return k !== l.id; }); if (e.target.value === 'h') c.hide.push(l.id); upd(); draw(); } }, [el('option', { value: 's', selected: !hid, text: 'سطر مستقل' }), el('option', { value: 'h', selected: hid, text: 'ضمن «' + svcOf(c) + '»' })])]),
el('td', { class: 'c-del' }, [ed ? el('button', { type: 'button', class: 'cr-x', title: 'حذف البند', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { c.lines.splice(i, 1); c.hide = c.hide.filter(function (k) { return k !== l.id; }); upd(); draw(); } }, [icon('trash')]) : null])]);
}));
var tbl = el('div', { class: 'cr-tw' }, [el('table', { class: 'cr-tbl is-items' }, [el('thead', {}, [el('tr', {}, ['البند', 'المبلغ (ر.س)', 'الضريبة', 'كيف يظهر للعميل', ''].map(function (h) { return el('th', { text: h }); }))]), tb])]);
var add = ed && c.lines.length < 12 ? el('div', { class: 'cr-addrow' }, [(function () {
var b = btn('إضافة بند ▾', { ic: 'plus', on: function () {
var have = c.lines.map(function (l) { return l.id; });
picker(b, { ph: 'ابحث في البنود الجاهزة…', groups: [['القائمة الجاهزة — «الرسوم والضرائب والعمولات»', (x.ready || []).map(function (f) { return [f.name, CALC_T[f.calc] + (f.calc === 'manual' ? '' : ' · ' + (f.calc === 'pct' ? Number(f.value) + '٪' : money(f.value))) + (f.taxable ? ' · خاضع للضريبة' : ' · غير خاضع'), have.indexOf(f.k) >= 0, f]; })]],
free: 'بند جديد لهذا الطلب', freePh: 'مسمّى البند',
pick: function (v) {
if (v && v.free) { var n = 1; while (c.lines.some(function (l) { return l.id === 'b' + n; })) n++; c.lines.push({ id: 'b' + n, t: v.free.slice(0, 80), amt: '0', vat: true }); }
else { var a = readyAmt(x, v); c.lines.push({ id: v.k, t: v.name, amt: a ? String(a) : '0', vat: v.taxable !== false }); }
upd(); draw(); var ins = R.querySelectorAll('.is-items tbody tr'); var last = ins[ins.length - 1]; if (last) { var i2 = last.querySelector('input.cr-num'); if (i2) i2.focus(); } } });
} }); return b; })(), el('small', { class: 'cr-hint', text: 'البنود الجاهزة تُدار من «الإعدادات ← الرسوم والضرائب والعمولات».' })]) : null;
var svc = c.hide.length ? field('اسم السطر الذي يراه العميل للبنود المدمجة', el('input', { type: 'text', value: c.svc_label || '', placeholder: 'الرسوم الإدارية والخدمة', maxlength: '60', disabled: !ed, oninput: function (e) { c.svc_label = e.target.value; upd(); } })) : null;
var opts = function (cur, L, on) { return el('select', { disabled: !ed, onchange: function (e) { on(e.target.value); } }, L.map(function (o) { return el('option', { value: o[0], selected: cur === o[0], text: o[1] }); })); };
var setup = el('div', { class: 'cr-grid' }, [
field('توزيع الإضافة على الدفعات', opts(c.dist.mode, [['equal', 'بالتساوي على الدفعات المتبقية'], ['ratio', 'بنسبة قيمة كل دفعة'], ['manual', 'يدويًا لكل دفعة']], function (v) { c.dist.mode = v; upd(); draw(); })),
field('جدولة الدفعة المؤجلة', opts(c.sched.mode, [['end', 'تنتقل إلى نهاية الجدول'], ['shift', 'ترحيل الدفعات منها شهرًا لكل دفعة'], ['manual', 'يدويًا بتاريخ لكل دفعة']], function (v) { c.sched.mode = v; upd(); draw(); }))]);
var main = el('div', { class: 'cr-main' }, [el('section', { class: 'cr-card' }, [el('div', { class: 'cr-h2row' }, [el('h2', { text: 'البنود والرسوم' }), ed ? saveInd() : null]), tbl, add, svc]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'التوزيع والجدولة' }), setup]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'جدول الدفع قبل وبعد' }), el('div', { id: 'cr-sched', class: 'cr-tw' }, [schedTable(x, c, ed, upd)])])]);
main.appendChild(el('div', { id: 'cr-guar' }, [guarCard(x)]));
return [el('div', { class: 'cr-split' }, [main, el('aside', { class: 'cr-side', id: 'cr-sum' }, [sidePanel(x)])])];
}
/* ── تغطية الضمانات (v871): تنبيه للموظف — غير إلزامي ──
* يقارن التزام العميل بعد التعديل (المتبقي في كل عقوده المفتوحة + رسوم الطلب) بضماناته القائمة:
* السندات لأمر (الساري والمهلة؛ المحكمة يُعرض ولا يُحسب) والشيكات غير المصروفة والأمر المستديم.
* الحساب كله في القاعدة (crq_svc_guar)، وقرار الموظف يُسجَّل في سجل الطلب فقط ولا يمنع الإكمال. */
var GST_T = { active: 'ساري', grace: 'في المهلة' };
function guarKey(x) { var r = x.result || {}; return x.id + '|' + (r.ok ? r.total + '|' + (r.rows || []).map(function (z) { return z.due_after + ':' + z.amt_after; }).join(',') : 'x'); }
async function loadGuar(x, force) {
var k = guarKey(x); if (!force && ST.guar && ST.guar.key === k && (ST.guar.d || ST.guar.busy)) return;
var me = ST.guar = { key: k, busy: true, d: null, err: '', code: '', pick: (ST.guar && ST.guar.key && ST.guar.key.split('|')[0] === x.id) ? ST.guar.pick : {}, note: (ST.guar && ST.guar.note) || '' };
paintGuar();
try { var j = await api('GET', '/admin/api/crq/' + x.id + '/guar'); if (ST.guar !== me) return; me.d = j.guar; }
catch (e) { if (ST.guar !== me) return; me.err = e.message; me.code = e.code || ''; }
me.busy = false; paintGuar();
}
function paintGuar() { var g = R.querySelector('#cr-guar'); if (g && ST.x) { g.innerHTML = ''; g.appendChild(guarCard(ST.x)); } }
function guarSugs(d) {
var S = [];
(d.alerts || []).forEach(function (a) {
if (a.k === 'gap') S.push(['bond', 'طلب سند لأمر إضافي بقيمة ' + money(a.gap) + ' ر.س']);
else if (a.k === 'ck_moved') S.push(['ck_' + a.no, 'طلب شيك بديل للشيك رقم ' + a.no + ' بتاريخ الموعد الجديد']);
else if (a.k === 'dd_short') S.push(['dd_end', 'تمديد الأمر المستديم حتى ' + day(a.last)]);
else if (a.k === 'dd_low') S.push(['dd_per', 'رفع مبلغ الأمر المستديم إلى ' + money(a.need) + ' ر.س شهريًا']);
});
return S;
}
function guarAlert(a) {
if (a.k === 'gap') return ['bad', 'الضمانات أقل من الالتزام بعد التعديل بـ ' + money(a.gap) + ' ر.س.'];
if (a.k === 'ck_moved') return ['warn', 'الشيك رقم ' + a.no + ' بتاريخ ' + day(a.due) + ' مرتبط بموعد تغيّر في هذا الطلب.'];
if (a.k === 'dd_short') return ['warn', 'الأمر المستديم ينتهي ' + day(a.end) + '، وآخر موعد في الجدول المعدّل ' + day(a.last) + '.'];
if (a.k === 'dd_low') return ['warn', 'مبلغ الأمر المستديم ' + money(a.per) + ' أقل من مبلغ الشهر الجديد ' + money(a.need) + '.'];
if (a.k === 'court') return ['info', 'لدى العميل ' + a.n + ' سند في المحكمة — يُعرض ولا يُحسب في التغطية.'];
return null;
}
function guarCard(x) {
var g = ST.guar;
var head = function (badge) { return el('div', { class: 'cr-gv-h' }, [el('span', { class: 'cr-gv-ic' }, [icon('sign')]), el('div', { class: 'cr-gv-t' }, [el('h2', { text: 'تغطية الضمانات' }), el('small', { text: 'تنبيه للموظف — القرار لك ولا يمنع إكمال الطلب' })]), badge || null]); };
var shell = function (kids) { return el('section', { class: 'cr-card cr-gv' }, [head(kids.badge)].concat(kids.body)); };
if (!g || g.key !== guarKey(x)) { setTimeout(function () { loadGuar(ST.x); }, 0); return shell({ body: [el('p', { class: 'cr-hint', text: 'جارٍ حساب التغطية…' })] }); }
if (g.busy && !g.d) return shell({ body: [el('p', { class: 'cr-hint', text: 'جارٍ حساب التغطية…' })] });
if (g.err) return shell({ body: [g.code === 'not_ready' ? el('p', { class: 'cr-hint', text: 'تعمل بعد تطبيق تحديث قاعدة البيانات stf_271.' }) : note('warn', 'تعذّر حساب التغطية', [el('span', { text: g.err })]), el('div', {}, [btn('إعادة المحاولة', { cls: 'is-sm', on: function () { loadGuar(ST.x, true); } })])] });
var d = g.d, st = d.state, ed = editable(x);
var badge = el('span', { class: 'cr-badge is-' + (st === 'covered' ? 'ok' : st === 'partial' ? 'warn' : 'bad'), text: st === 'covered' ? 'مغطّى' : st === 'partial' ? 'تغطية جزئية' : 'لا توجد ضمانات' });
var pct = Math.max(0, Math.min(100, Number(d.pct) || 0));
var cell = function (t, v, cls, extra) { return el('div', { class: 'cr-gv-k' + (cls ? ' ' + cls : '') }, [el('small', { text: t }), el('b', {}, [ltr(v)]), extra || null]); };
var band = el('div', { class: 'cr-gv-band' }, [
cell('الالتزام بعد التعديل', money(d.obligation)),
cell('الضمانات المحسوبة', money(d.cover)),
cell('الفارق', money(d.gap), Number(d.gap) > 0 ? 'is-bad' : 'is-ok'),
cell('نسبة التغطية', (Number(d.pct) || 0) + '٪', st === 'covered' ? 'is-ok' : 'is-warn', el('span', { class: 'cr-gv-bar', role: 'img', 'aria-label': 'نسبة التغطية ' + pct + '٪' }, [el('i', { style: 'width:' + pct + '%' })]))]);
/* الالتزام: عقود العميل المفتوحة + رسوم الطلب */
var C = d.contracts || [], LIM = 5, more = C.length > LIM && !g.allC;
var cr = (more ? C.slice(0, LIM) : C).map(function (c) { return el('tr', { class: c.this ? 'is-this' : '' }, [el('td', {}, [ltr(c.no || '—'), c.this ? el('span', { class: 'cr-gv-tag', text: 'هذا الطلب' }) : null]), el('td', { class: 'n' }, [ltr(money(c.left))])]); });
if (more) cr.push(el('tr', { class: 'is-more' }, [el('td', { colspan: '2' }, [el('button', { type: 'button', class: 'cr-gv-link', 'data-live-ok': '', onclick: function () { g.allC = true; paintGuar(); } }, ['عرض كل العقود (' + C.length + ')'])])]));
var tA = el('table', { class: 'cr-gv-tbl' }, [el('thead', {}, [el('tr', {}, [el('th', { text: 'العقد المفتوح' }), el('th', { class: 'n', text: 'المتبقي (ر.س)' })])]),
el('tbody', {}, cr.length ? cr : [el('tr', {}, [el('td', { colspan: '2', class: 'cr-gv-empty', text: 'لا مبالغ متبقية في عقود مفتوحة.' })])]),
el('tfoot', {}, [el('tr', {}, [el('td', { text: 'المتبقي في ' + C.length + ' ' + (C.length === 1 ? 'عقد' : 'عقود') }), el('td', { class: 'n' }, [ltr(money(d.now))])]),
el('tr', {}, [el('td', { text: d.calc_ok ? 'رسوم هذا الطلب (شاملة الضريبة)' : 'رسوم هذا الطلب — الحسبة لم تكتمل' }), el('td', { class: 'n' }, [ltr(money(d.fees))])]),
el('tr', { class: 'is-total' }, [el('td', { text: 'الالتزام بعد التعديل' }), el('td', { class: 'n' }, [ltr(money(d.obligation))])])])]);
/* الضمانات */
var G = [];
(d.bonds || []).forEach(function (b) { G.push(['سند لأمر', b.no, b.status === 'grace' ? 'في المهلة' : 'ساري' + (b.date ? ' · ' + day(b.date) : ''), b.value, 'ok', 'يُحسب']); });
(d.cheques || []).forEach(function (c) { G.push(['شيك', c.no, day(c.due) + (c.this ? '' : ' · عقد ' + c.contract), c.amount, c.moved ? 'warn' : 'ok', c.moved ? 'يحتاج بديل' : 'يُحسب']); });
(d.dd || []).forEach(function (o) { G.push(['أمر مستديم', o.bank, money(o.per) + ' شهريًا حتى ' + day(o.end) + (o.this ? '' : ' · عقد ' + o.contract), o.cap, o.short_end || o.low_per ? 'warn' : 'ok', o.short_end ? 'يحتاج تمديد' : o.low_per ? 'مبلغ أقل' : 'يُحسب']); });
(d.court || []).forEach(function (b) { G.push(['سند لأمر', b.no, 'في المحكمة', b.value, 'mut', 'لا يُحسب']); });
var gr = G.map(function (r) { return el('tr', { class: r[4] === 'mut' ? 'is-mut' : '' }, [el('td', {}, [el('b', { text: r[0] }), r[1] ? el('small', {}, [ltr(r[1])]) : null]), el('td', { class: 'cr-gv-d', text: r[2] }), el('td', { class: 'n' }, [ltr(money(r[3]))]), el('td', {}, [el('span', { class: 'cr-gv-st is-' + r[4], text: r[5] })])]); });
var tB = el('table', { class: 'cr-gv-tbl is-g' }, [el('thead', {}, [el('tr', {}, [el('th', { text: 'الضمان' }), el('th', { text: 'التفاصيل' }), el('th', { class: 'n', text: 'المبلغ (ر.س)' }), el('th', { text: 'الحالة' })])]),
el('tbody', {}, gr.length ? gr : [el('tr', {}, [el('td', { colspan: '4', class: 'cr-gv-empty', text: 'لا توجد ضمانات مسجّلة في الملف الشخصي للعميل.' })])]),
el('tfoot', {}, [el('tr', { class: 'is-total' }, [el('td', { colspan: '2', text: 'المحسوب في التغطية' }), el('td', { class: 'n' }, [ltr(money(d.cover))]), el('td', {})])])]);
var cols = el('div', { class: 'cr-gv-cols' }, [el('div', { class: 'cr-gv-col' }, [el('h3', { text: 'الالتزام' }), el('div', { class: 'cr-gv-tw' }, [tA])]), el('div', { class: 'cr-gv-col is-wide' }, [el('h3', { text: 'الضمانات القائمة' }), el('div', { class: 'cr-gv-tw' }, [tB])])]);
var al = (d.alerts || []).map(guarAlert).filter(Boolean);
var alerts = al.length ? el('ul', { class: 'cr-gv-al' }, al.map(function (a) { return el('li', { class: 'is-' + a[0] }, [icon('alert'), el('span', { text: a[1] })]); })) : null;
var foot;
if (st === 'covered') foot = note('ok', 'الضمانات القائمة تغطي الالتزام بعد التعديل — لا حاجة لضمان إضافي.');
else { var sg = guarSugs(d);
foot = el('div', { class: 'cr-gv-dec' }, [el('h3', { text: 'الإجراء المقترح — اختر ما يناسب' }),
el('div', { class: 'cr-gv-sg' }, sg.map(function (s) { return el('label', { class: 'cr-gv-opt' + (g.pick[s[0]] ? ' is-on' : '') }, [el('input', { type: 'checkbox', checked: !!g.pick[s[0]], disabled: !ed, onchange: function (e) { g.pick[s[0]] = e.target.checked; e.target.closest('label').classList.toggle('is-on', e.target.checked); } }), el('span', { text: s[1] })]); })),
ed ? el('div', { class: 'cr-gv-row' }, [el('input', { type: 'text', class: 'cr-gv-note', maxlength: '300', value: g.note, placeholder: 'ملاحظة على القرار (اختياري)', 'aria-label': 'ملاحظة على القرار', oninput: function (e) { g.note = e.target.value; } }),
btn('تسجيل المختار', { ic: 'check', cls: 'is-pri', on: function () { guarDecide(x, false); } }), btn('متابعة دون ضمان إضافي', { on: function () { guarDecide(x, true); } })]) : null]); }
return el('section', { class: 'cr-card cr-gv' }, [head(badge), band, cols, alerts, foot]);
}
async function guarDecide(x, skip) {
var g = ST.guar, d = g && g.d; if (!d) return;
var ch = skip ? [] : guarSugs(d).filter(function (s) { return g.pick[s[0]]; }).map(function (s) { return s[1]; });
if (!skip && !ch.length) { toast(false, 'اختر اقتراحًا واحدًا على الأقل، أو اختر «متابعة دون ضمان إضافي».'); return; }
try { await api('POST', '/admin/api/crq/' + x.id + '/guar-note', { skip: !!skip, choice: ch, note: g.note || '' }); g.note = ''; toast(true, 'سُجّل القرار في سجل الطلب'); reload(); }
catch (e) { toast(false, e.message); }
}

/* اللوحة الجانبية: الملخص المالي أو الملحق نفسه */
function sidePanel(x) {
var seg = el('div', { class: 'cr-seg is-sm' }, [['sum', 'الملخص المالي'], ['doc', 'المستند']].map(function (m) { return el('button', { type: 'button', class: (ST.side || 'sum') === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.side = m[0]; paintSide(x); } }, [m[1]]); }));
var body = (ST.side || 'sum') === 'sum' ? summary(x) : docFrame(x, null, 'is-mini');
return el('div', { class: 'cr-sidein' }, [seg, body]);
}
function paintSide(x) { var s = R.querySelector('#cr-sum'); if (s) { s.innerHTML = ''; s.appendChild(sidePanel(x)); } }
function summary(x) {
var r = x.result || {}, c = calcOf(x), R0 = rate(x);
if (!r.ok) return el('section', { class: 'cr-card is-sum' }, [el('div', { class: 'cr-sum-h' }, [el('h2', { text: 'الملخص المالي' }), saveInd()]), note('warn', ERRT[r.error] || 'أكمل الحسبة', r.seq ? [el('span', { text: 'الدفعة ' + r.seq })] : r.error === 'dist_sum' ? [el('span', { text: 'المطلوب ' + money(r.need) + ' · المدخل ' + money(r.got) })] : [])]);
var ln = function (t, v, cls, tag) { return el('li', { class: cls || '' }, [el('span', {}, [t, tag ? el('small', { class: 'cr-tg', text: tag }) : null]), ltr(v)]); };
var L = [];
c.lines.forEach(function (l) { if (String(l.t || '').trim()) L.push(ln(l.t, money(l.amt), Number(l.amt) > 0 ? 'is-it' : 'is-it is-z', c.hide.indexOf(l.id) >= 0 ? 'مدمج' : !l.vat ? 'غير خاضع' : null)); });
var taxb = c.lines.reduce(function (s, l) { return s + (l.vat ? Number(l.amt) || 0 : 0); }, 0);
L.push(ln('مجموع البنود', money(r.fees), 'is-sub'), ln('الخاضع للضريبة', money(taxb), 'is-mut'), ln('ضريبة القيمة المضافة ' + R0 + '٪', money(r.vat)));
var adm = c.lines.reduce(function (s, l) { return s + (c.hide.indexOf(l.id) >= 0 ? Number(l.amt) || 0 : 0); }, 0);
return el('section', { class: 'cr-card is-sum' }, [el('div', { class: 'cr-sum-h' }, [el('h2', { text: 'الملخص المالي' }), saveInd()]),
el('ul', { class: 'cr-sum' }, L), el('div', { class: 'cr-grand' }, [el('span', { text: 'إجمالي الإضافة على العقد' }), el('b', {}, [ltr(money(r.total)), ' ر.س'])]),
el('ul', { class: 'cr-sum' }, [ln('قيمة العقد قبل', money(r.contract && r.contract.total_before), 'is-mut'), ln('قيمة العقد بعد', money(r.contract && r.contract.total_after), 'is-t'),
ln('الدفعات المعدّلة', String((r.rows || []).filter(function (z) { return z.open && (Number(z.add) !== 0 || z.due_after !== z.due_before); }).length), 'is-mut'), adm > 0 ? ln('يراه العميل سطرًا واحدًا «' + svcOf(c) + '»', money(adm), 'is-mut') : null].filter(Boolean)),
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
/* بعد الحفظ: تُحدَّث اللوحة الجانبية والخلايا المحسوبة فقط — لا يُعاد رسم الحقول فلا يضيع موضع الكتابة */
function paintCalcOut() {
if (ST.tab === 'calc') { paintSide(ST.x); loadGuar(ST.x); }
if (ST.tab === 'doc') docPv(ST.x);
var r = ST.x.result || {}; if (!r.ok) return;
(r.rows || []).forEach(function (z) {
var tr = R.querySelector('tr[data-pid="' + z.pid + '"]'); if (!tr) return;
var a = tr.querySelector('.c-after'); if (a) { a.innerHTML = ''; a.appendChild(ltr(money(z.amt_after))); }
var d = tr.querySelector('.c-add'); if (d && !d.querySelector('input')) { d.innerHTML = ''; d.appendChild(ltr(money(z.add))); }
var u = tr.querySelector('.c-due'); if (u && !u.querySelector('input')) { u.innerHTML = ''; u.appendChild(el('span', { class: z.due_after !== z.due_before ? 'is-ch' : '', text: day(z.due_after) })); }
});
}

/* ── 3) المستند: «ملحق تأجيل الدفعة» من «قوالب المستندات» — القالب العام أو نسخة لهذا العميل بالمحرّر نفسه (أقسام القالب ومفاتيح إظهارها)،
* والمعاينة هي الملحق نفسه (HTML الذي يُطبع PDF) بقالب المحرّر قبل حفظه ── */
function DX() { return window.__teraApp && window.__teraApp.docx ? window.__teraApp.docx : null; }
function gp(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
function sp(o, p, v) { var k = p.split('.'), L = k.pop(); var t = k.reduce(function (a, z) { if (!a[z] || typeof a[z] !== 'object') a[z] = {}; return a[z]; }, o); t[L] = v; }
function own(part) { return !!(part && part.tpl && typeof part.tpl === 'object' && part.own !== false); }
function docTpl(x) { var D = DX(); var base = own(x.doc) ? x.doc.tpl : (x.tpl && x.tpl.df) || {}; return D ? D.tpl(base) : clone(base); }
var DOC_LIB = ['يُعدّ هذا الملحق جزءًا لا يتجزأ من العقد الأصلي، وتبقى بقية بنود العقد سارية دون تغيير.', 'تُضاف رسوم التأجيل إلى قيمة العقد وتوزَّع على الدفعات المتبقية وفق الجدول الوارد في هذا الملحق.', 'يلتزم الطرف الثاني بسداد الدفعات في مواعيدها الجديدة الواردة في الجدول.', 'لا يسري هذا الملحق إلا بعد توقيع الطرف الثاني عليه إلكترونيًا.', 'تُعدّ الدفعة متأخرة من اليوم الأول بعد موعدها الجديد.', 'لا يُقبل تأجيل الدفعة نفسها مرة أخرى إلا بموافقة المنصة.', 'يحق للطرف الثاني سداد الدفعة المؤجلة قبل موعدها الجديد دون رسوم إضافية.'];
/* v870: مكتبة البنود الموحّدة — مكتبة طلبات الخدمات الجديدة (EGLIB في staff-next.js) وفيها «تأجيل الدفعة»، مجمّعة حسب مجموعتها */
function LIB() { var L = Array.isArray(window.EGLIB) && window.EGLIB.length ? window.EGLIB : [{ i: 'defer', t: 'تأجيل الدفعة', g: 'طلبات العقود', e: DOC_LIB }]; var d = L.filter(function (x) { return /^defer/.test(x.i); }); return d.concat(L.filter(function (x) { return d.indexOf(x) < 0; })); }
function libGroups(have) { return LIB().map(function (x) { return [x.t + ' · ' + x.g, x.e.map(function (t) { return [t, '', have.indexOf(t) >= 0]; })]; }); }
function libSecs() { return [['أقسام المكتبة', [['قسم فارغ', 'عنوان تكتبه وبنود تضيفها', false, { blank: true }]].concat(LIB().map(function (x) { return [x.t, x.g + ' · ' + x.e.length + ' بند', false, x]; }))]]; }
/* الأقسام المضافة — { t, lines[], on }: عنوان يُعدَّل، وإظهار، وترتيب، وبنود من المكتبة، وحذف */
function addsEditor(arr, ro, onCh, label) {
var out = arr.map(function (x, i) {
var L = x.lines;
var kids = L.map(function (t, j) { return el('div', { class: 'cr-ed-ln' }, [el('span', { class: 'cr-ed-n', text: String(j + 1) }), el('textarea', { rows: '2', value: t, disabled: ro, 'aria-label': 'البند ' + (j + 1), oninput: function (e) { L[j] = e.target.value; onCh(false); } }),
ro ? null : el('div', { class: 'cr-ed-ops' }, [el('button', { type: 'button', class: 'cr-x', title: 'حذف البند', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { L.splice(j, 1); onCh(true); } }, [icon('trash')])])]); });
if (!ro) kids.push((function () { var b = btn('إضافة بند ▾', { ic: 'plus', cls: 'is-sm', on: function () { picker(b, { ph: 'ابحث في كل البنود…', groups: libGroups(L), free: 'كتابة بند جديد', freePh: 'نص البند', pick: function (v) { L.push(v && v.free ? v.free : v); onCh(true); } }); } }); return el('div', { class: 'cr-addrow' }, [b]); })());
var on = x.on !== false;
return el('section', { class: 'cr-ed-sec is-add' + (on ? '' : ' is-off') }, [el('div', { class: 'cr-ed-h' }, [el('input', { type: 'text', class: 'cr-ed-t', value: x.t, disabled: ro, 'aria-label': 'عنوان القسم', oninput: function (e) { x.t = e.target.value; onCh(false); } }),
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'أعلى', 'aria-label': 'نقل القسم لأعلى', disabled: !i, 'data-live-ok': '', onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); onCh(true); } }, ['↑']),
el('button', { type: 'button', class: 'cr-sw' + (on ? ' is-on' : ''), role: 'switch', 'aria-checked': on ? 'true' : 'false', disabled: ro, 'aria-label': 'إظهار القسم', 'data-live-ok': '', onclick: function () { x.on = !on; onCh(true); } }, [el('i', {})]),
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'حذف القسم', 'aria-label': 'حذف القسم', 'data-live-ok': '', onclick: function () { arr.splice(i, 1); onCh(true); } }, [icon('trash')])]), on ? el('div', { class: 'cr-ed-b' }, kids) : null]);
});
if (!ro && arr.length < 12) out.push((function () { var b = btn('إضافة قسم ▾', { ic: 'plus', on: function () { picker(b, { ph: 'ابحث عن قسم…', groups: libSecs(), pick: function (v) { arr.push(v && v.blank ? { t: 'قسم جديد', lines: [], on: true } : { t: v.t, lines: v.e.slice(), on: true }); onCh(true); } }); } }); return el('div', { class: 'cr-addrow is-sec' }, [b, el('small', { class: 'cr-hint', text: label || 'من مكتبة البنود الموحّدة أو قسم فارغ.' })]); })());
return out;
}
/* محرّر قالب بمواصفة «قوالب المستندات»: الترويسة ثم الأقسام (حقول · مفاتيح · أسطر · نص · معلومة) — مشترك بين نسخة الطلب وأي قالب بالمواصفة نفسها */
function specEditor(spec, T, ro, onCh) {
var sw = function (p, lab) { var on = gp(T, p) !== false; return el('button', { type: 'button', class: 'cr-sw' + (on ? ' is-on' : ''), role: 'switch', 'aria-checked': on ? 'true' : 'false', title: on ? 'ظاهر — اضغط للإخفاء' : 'مخفي — اضغط للإظهار', 'aria-label': (on ? 'إخفاء ' : 'إظهار ') + (lab || ''), disabled: ro, 'data-live-ok': '', onclick: function () { sp(T, p, !on); onCh(true); } }, [el('i', {})]); };
var inp = function (p, lab, area) { var n = el(area ? 'textarea' : 'input', { type: area ? null : 'text', rows: area ? '3' : null, value: gp(T, p) || '', disabled: ro, 'aria-label': lab, oninput: function (e) { sp(T, p, e.target.value); onCh(false); } }); return n; };
var row = function (lab, ctl, hp) { return el('div', { class: 'cr-ed-row' + (hp && gp(T, hp) === false ? ' is-off' : '') }, [el('label', { text: lab }), ctl, hp ? sw(hp, lab) : null]); };
var out = [];
out.push(el('section', { class: 'cr-ed-sec is-open' }, [el('div', { class: 'cr-ed-h' }, [el('b', { text: 'الترويسة' })]), el('div', { class: 'cr-ed-b' }, (spec.hdr || []).map(function (h) { return row(h.l, inp(h.p, h.l)); }))]));
(spec.secs || []).forEach(function (s) {
var on = !s.show || gp(T, s.show) !== false, kids = [];
if (s.kind === 'fields') (s.fields || []).forEach(function (f) { kids.push(row(f.l, inp(f.p, f.l, String(gp(T, f.p) || '').length > 60), f.hp)); });
else if (s.kind === 'toggles') (s.items || []).forEach(function (f) { kids.push(el('div', { class: 'cr-ed-row is-tg' }, [el('label', { text: f.l }), sw(f.p, f.l)])); });
else if (s.kind === 'text') kids.push(inp(s.p, s.title, true));
else if (s.kind === 'info') kids.push(el('p', { class: 'cr-hint', text: s.info || '' }));
else if (s.kind === 'lines') {
var L = Array.isArray(gp(T, s.p)) ? gp(T, s.p) : []; sp(T, s.p, L);
L.forEach(function (t, i) {
kids.push(el('div', { class: 'cr-ed-ln' }, [el('span', { class: 'cr-ed-n', text: String(i + 1) }), el('textarea', { rows: '2', value: t, disabled: ro, 'aria-label': 'البند ' + (i + 1), oninput: function (e) { L[i] = e.target.value; onCh(false); } }),
ro ? null : el('div', { class: 'cr-ed-ops' }, [i ? el('button', { type: 'button', class: 'cr-x', title: 'أعلى', 'aria-label': 'نقل لأعلى', 'data-live-ok': '', onclick: function () { L.splice(i - 1, 0, L.splice(i, 1)[0]); onCh(true); } }, ['↑']) : null,
el('button', { type: 'button', class: 'cr-x', title: 'حذف', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { L.splice(i, 1); onCh(true); } }, [icon('trash')])])]));
});
if (!ro) kids.push((function () { var b = btn('إضافة بند ▾', { ic: 'plus', cls: 'is-sm', on: function () { picker(b, { ph: 'ابحث في كل البنود…', groups: libGroups(L), free: 'كتابة بند جديد', freePh: 'نص البند', pick: function (v) { L.push(v && v.free ? v.free : v); onCh(true); } }); } }); return el('div', { class: 'cr-addrow' }, [b]); })());
}
if (s.hint) kids.push(el('small', { class: 'cr-hint', text: s.hint }));
var title = s.titleP ? el('input', { type: 'text', class: 'cr-ed-t', value: gp(T, s.titleP) || s.title, disabled: ro, 'aria-label': 'عنوان القسم', oninput: function (e) { sp(T, s.titleP, e.target.value); onCh(false); } }) : el('b', { text: s.title });
out.push(el('section', { class: 'cr-ed-sec' + (on ? '' : ' is-off') }, [el('div', { class: 'cr-ed-h' }, [title, s.show ? sw(s.show, s.title) : null]), on ? el('div', { class: 'cr-ed-b' }, kids) : null]));
});
return out;
}
function tabDoc(x) {
var D = DX(), ed = editable(x), mine = own(x.doc);
if (!D) return [note('warn', 'تعذّر تحميل محرّر المستندات — حدّث الصفحة.')];
var T = docTpl(x);
var setSrc = function (k) { if (k === 'own' && !mine) { x.doc = { tpl: clone(docTpl(x)), own: true }; queue({ doc: x.doc }); } else if (k === 'def' && mine) { x.doc = {}; queue({ doc: {} }); } draw(); };
var onCh = function (redraw) { if (!ed) return; if (!own(x.doc)) { x.doc = { tpl: T, own: true }; mine = true; var b0 = R.querySelector('.cr-srcbar'); if (b0) b0.replaceWith(mkBar()); } else x.doc.tpl = T; queue({ doc: x.doc }); if (redraw) draw(); else docPv(x); };
var mkBar = function () { return el('div', { class: 'cr-srcbar' }, [el('div', {}, [el('b', { text: 'ملحق تأجيل الدفعة' }), el('small', { class: 'cr-hint', text: mine ? 'نسخة لهذا العميل — لا تغيّر القالب العام.' : 'القالب العام من «قوالب المستندات». أي تعديل هنا ينشئ نسخة لهذا العميل.' })]),
el('div', { class: 'cr-seg', role: 'group', 'aria-label': 'مصدر المستند' }, [['def', 'القالب العام'], ['own', 'نسخة لهذا العميل']].map(function (m) { var on = (m[0] === 'own') === mine; return el('button', { type: 'button', class: on ? 'is-on' : '', 'aria-pressed': on ? 'true' : 'false', disabled: !ed, 'data-live-ok': '', onclick: function () { setSrc(m[0]); } }, [m[1]]); })),
D.open ? btn('فتح القالب العام', { cls: 'is-sm', ic: 'file', on: function () { D.open(); } }) : null, ed ? saveInd() : null]); };
var bar = mkBar();
if (!Array.isArray(T.adds)) T.adds = [];
var edv = el('div', { class: 'cr-ed' }, specEditor(D.spec(), T, !ed, onCh).concat([el('div', { class: 'cr-ed-sep', text: 'أقسام مضافة إلى الملحق' })], addsEditor(T.adds, !ed, onCh, 'تظهر في الملحق بعد بنوده — من مكتبة البنود الموحّدة أو قسم فارغ.')));
var pv = el('div', { class: 'cr-pvcol' }, [el('div', { class: 'cr-h2row' }, [el('b', { text: 'المعاينة — الملحق كما يُطبع ويصل العميل' }), el('div', { class: 'cr-seg is-sm' }, [[false, 'قبل التوقيع'], [true, 'بعد التوقيع (نموذج)']].map(function (m) { return el('button', { type: 'button', class: !!ST.docAfter === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.docAfter = m[0]; draw(); } }, [m[1]]); })), btn('تنزيل PDF', { cls: 'is-sm', ic: 'down', on: pdf })]), docFrame(x, T, '')]);
return [bar, el('div', { class: 'cr-split is-ed' }, [edv, pv])];
}
/* الملحق نفسه من الخادم بقالب المحرّر (قبل الحفظ) — المعاينة الحقيقية */
var PVT = null;
function docFrame(x, T, cls) {
var f = el('iframe', { class: 'cr-docf ' + (cls || ''), title: 'معاينة الملحق', sandbox: 'allow-same-origin' });
var w = el('div', { class: 'cr-docw ' + (cls || ''), 'data-docpv': '' }, [f]);
setTimeout(function () { loadDoc(x, f, T); }, 0);
return w;
}
function docPv(x) { clearTimeout(PVT); PVT = setTimeout(function () { var f = R.querySelector('[data-docpv] iframe'); if (f) loadDoc(x, f, ST.tab === 'doc' ? docTpl(x) : null); }, 500); }
async function loadDoc(x, f, T) {
try {
var t = await window.__teraApp.token();
var r = await fetch('/admin/api/crq/' + x.id + '/doc-html', { method: 'POST', cache: 'no-store', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify({ tpl: T || (own(x.doc) ? x.doc.tpl : null), after: !!ST.docAfter && ST.tab === 'doc' }) });
if (!r.ok) throw new Error('تعذّرت المعاينة.');
var h = await r.text();
f.srcdoc = h.replace('</head>', '<style>html,body{background:#e9edf3;margin:0}.axp-page{margin:0 auto 14px!important;box-shadow:0 6px 24px rgba(11,37,82,.15)}</style></head>');
f.onload = function () { try { var w = f.parentNode, k = w.clientWidth / 794; f.style.transform = 'scale(' + Math.min(1, k) + ')'; f.style.width = '794px'; var hh = f.contentDocument ? f.contentDocument.body.scrollHeight : 1123; f.style.height = hh + 'px'; w.style.height = Math.ceil(hh * Math.min(1, k)) + 'px'; } catch (e) { void e; } };
} catch (e) { f.replaceWith(note('bad', e.message)); }
}

/* ── 4) صفحة العميل: صفحتا الرابط (الموافقة ثم التوقيع) من «صفحات الرابط» — القالب العام أو نسخة لهذا العميل،
* بمحرّر كامل (الألوان والهوية والنصوص والأقسام والأزرار والنوافذ)، والمعاينة صفحة العميل نفسها حيّة ── */
function LPX() { return window.CRQLP || null; }
function lpTpl(x) { var L = LPX(); var base = own(x.page) ? x.page.tpl : (x.tpl && x.tpl.lp) || {}; return L.tpl(base); }
/* المحرّر: أقسام lp.js — لون · نص · مفتاح إظهار — مشترك بين نسخة الطلب والقالب العام */
function lpEditor(T, ro, onCh, step) {
var L = LPX();
return L.SECS.map(function (s) {
var openK = 'lp:' + s.id, open = ST.lpOpen ? ST.lpOpen === s.id : s.id === 'look';
var rows = open ? s.f.map(function (f) {
var p = f[0], lab = f[1], kd = f[2], hp = f[3], v = L.get(T, p), ctl;
if (kd === 'c') ctl = el('span', { class: 'cr-col' }, [el('input', { type: 'color', value: v, disabled: ro, 'aria-label': lab, oninput: function (e) { L.set(T, p, e.target.value); e.target.nextSibling.value = e.target.value; onCh(false); } }), el('input', { type: 'text', value: v, maxlength: '7', dir: 'ltr', disabled: ro, 'aria-label': lab + ' (رمز)', onchange: function (e) { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { L.set(T, p, e.target.value); onCh(true); } } })]);
else if (kd === 'b') { var on = v !== false; ctl = el('button', { type: 'button', class: 'cr-sw' + (on ? ' is-on' : ''), role: 'switch', 'aria-checked': on ? 'true' : 'false', disabled: ro, 'aria-label': lab, 'data-live-ok': '', onclick: function () { L.set(T, p, !on); onCh(true); } }, [el('i', {})]); }
else if (kd === 'n') ctl = el('input', { type: 'number', min: '0', max: '28', value: v, disabled: ro, 'aria-label': lab, oninput: function (e) { L.set(T, p, String(e.target.value)); onCh(false); } });
else ctl = el(kd === 'a' ? 'textarea' : 'input', { type: kd === 'a' ? null : 'text', rows: kd === 'a' ? '2' : null, value: v, disabled: ro, 'aria-label': lab, oninput: function (e) { L.set(T, p, e.target.value); onCh(false); } });
var hon = hp ? L.get(T, hp) !== false : true;
var eye = hp ? el('button', { type: 'button', class: 'cr-sw' + (hon ? ' is-on' : ''), role: 'switch', 'aria-checked': hon ? 'true' : 'false', title: hon ? 'ظاهر — اضغط للإخفاء' : 'مخفي — اضغط للإظهار', disabled: ro, 'aria-label': (hon ? 'إخفاء ' : 'إظهار ') + lab, 'data-live-ok': '', onclick: function () { L.set(T, hp, !hon); onCh(true); } }, [el('i', {})]) : null;
return el('div', { class: 'cr-ed-row' + (kd === 'c' ? ' is-c' : '') + (hon ? '' : ' is-off') }, [el('label', { text: lab }), ctl, eye]);
}) : [];
return el('section', { class: 'cr-ed-sec' + (open ? ' is-open' : '') }, [el('button', { type: 'button', class: 'cr-ed-h is-btn', 'aria-expanded': open ? 'true' : 'false', 'data-live-ok': '', onclick: function () { ST.lpOpen = open ? '-' : s.id; if (s.step && step) step(s.step); onCh(true, true); } }, [el('b', { text: s.t }), el('small', { text: s.f.length + ' عنصر' }), el('i', { class: 'cr-chev', text: open ? '−' : '+' })]), open ? el('div', { class: 'cr-ed-b' }, rows) : null]);
}).concat(['consent', 'sign'].map(function (st) {
/* v870: أقسام مضافة لكل صفحة — من مكتبة البنود الموحّدة أو قسم فارغ */
var id = 'adds_' + st, open = ST.lpOpen === id, P = T[st]; if (!Array.isArray(P.adds)) P.adds = [];
return el('section', { class: 'cr-ed-sec' + (open ? ' is-open' : '') }, [el('button', { type: 'button', class: 'cr-ed-h is-btn', 'aria-expanded': open ? 'true' : 'false', 'data-live-ok': '', onclick: function () { ST.lpOpen = open ? '-' : id; if (step) step(st); onCh(true, true); } }, [el('b', { text: 'أقسام مضافة — صفحة ' + (st === 'sign' ? 'التوقيع' : 'الموافقة') }), el('small', { text: P.adds.length + ' قسم' }), el('i', { class: 'cr-chev', text: open ? '−' : '+' })]),
open ? el('div', { class: 'cr-ed-b' }, addsEditor(P.adds, ro, onCh, 'تظهر بعد ملخص الطلب في صفحة العميل.')) : null]);
}));
}
/* المعاينة الحية: صفحة العميل الحقيقية (/crq/?preview=1) والقالب يصلها مع كل تعديل */
function lpFrame(getView, getTpl) {
var P = ST.lpv || (ST.lpv = { step: 'consent', screen: 'page', dev: 'phone' });
var f = el('iframe', { class: 'cr-pv is-' + P.dev, title: 'معاينة صفحة العميل', src: '/crq/?preview=1' });
var send = function () { var v = getView(P.step); if (!v || !f.contentWindow) return; f.contentWindow.postMessage({ type: 'crq-preview', view: v.view, doc_html: v.doc_html || '', expires_at: v.exp || null, tpl: getTpl(), screen: P.screen }, location.origin); };
var ready = function (e) { if (e.origin !== location.origin || !e.data || e.data.type !== 'crq-preview-ready' || e.source !== f.contentWindow) return; f.__ok = true; send(); };
window.addEventListener('message', ready);
f.__send = send;
var seg = function (L, k) { return el('div', { class: 'cr-seg is-sm' }, L.map(function (m) { return el('button', { type: 'button', class: P[k] === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function (e) { P[k] = m[0]; [].forEach.call(e.currentTarget.parentNode.children, function (b) { b.className = b === e.currentTarget ? 'is-on' : ''; }); if (k === 'dev') f.className = 'cr-pv is-' + P.dev; else send(); } }, [m[1]]); })); };
var bar = el('div', { class: 'cr-pvbar' }, [seg([['consent', 'الموافقة'], ['sign', 'التوقيع']], 'step'), seg([['verify', 'رمز التحقق'], ['page', 'الصفحة'], ['done', 'بعد القرار'], ['declined', 'الاعتذار']], 'screen'), seg([['phone', 'جوال'], ['web', 'شاشة']], 'dev')]);
return el('div', { class: 'cr-pvcol' }, [bar, el('div', { class: 'cr-pv-w' }, [f])]);
}
var LPV = {};
async function lpViews(x) {
if (LPV.id === x.id && LPV.at === x.updated_at) return LPV;
var out = { id: x.id, at: x.updated_at };
for (var s of ['consent', 'sign']) { try { var j = await api('GET', '/admin/api/crq/' + x.id + '/view/' + s); out[s] = { view: j.view, doc_html: j.doc_html || '', exp: x.link && x.link.expires_at }; } catch (e) { out[s] = null; out.err = e.message; } }
LPV = out; return out;
}
function tabPage(x) {
var L = LPX();
if (!L) { loadLp(); return [el('div', { class: 'cr-load', text: 'جارٍ تحميل محرّر صفحة العميل…' })]; }
var ed = editable(x), mine = own(x.page), T = lpTpl(x), s = x.settings || {};
var frameBox = el('div', { class: 'cr-pvhost' }, [el('div', { class: 'cr-load', text: 'جارٍ تجهيز المعاينة…' })]);
var fr = null;
var push = function () { if (fr && fr.querySelector('iframe').__send) fr.querySelector('iframe').__send(); };
var onCh = function (redraw, keepOwn) {
if (!ed && !keepOwn) return;
if (!keepOwn) { if (!own(x.page)) { x.page = { tpl: T, own: true }; mine = true; var b0 = R.querySelector('.cr-srcbar'); if (b0) b0.replaceWith(mkBar()); } else x.page.tpl = T; queue({ page: x.page }); }
if (redraw) { draw(); return; }
push();
};
lpViews(x).then(function (V) {
fr = lpFrame(function (st) { return V[st]; }, function () { return T; });
frameBox.innerHTML = ''; frameBox.appendChild(fr); if (V.err) frameBox.insertBefore(note('warn', V.err), fr);
});
var setSrc = function (k) { if (k === 'own' && !mine) { x.page = { tpl: clone(T), own: true }; queue({ page: x.page }); } else if (k === 'def' && mine) { x.page = {}; queue({ page: {} }); } draw(); };
var mkBar = function () { return el('div', { class: 'cr-srcbar' }, [el('div', {}, [el('b', { text: 'صفحتا الرابط: الموافقة ثم التوقيع' }), el('small', { class: 'cr-hint', text: mine ? 'نسخة لهذا العميل — لا تغيّر القالب العام.' : 'القالب العام من «قوالب المستندات ← عقد الشركاء ← صفحات الرابط». أي تعديل هنا ينشئ نسخة لهذا العميل.' })]),
el('div', { class: 'cr-seg', role: 'group', 'aria-label': 'مصدر الصفحة' }, [['def', 'القالب العام'], ['own', 'نسخة لهذا العميل']].map(function (m) { var on = (m[0] === 'own') === mine; return el('button', { type: 'button', class: on ? 'is-on' : '', 'aria-pressed': on ? 'true' : 'false', disabled: !ed, 'data-live-ok': '', onclick: function () { setSrc(m[0]); } }, [m[1]]); })),
ed ? saveInd() : null]); };
var bar = mkBar();
var hrs = x.valid_hours || s.consent_hours || 48;
var links = (x.links || []).slice().reverse();
var ST2 = { active: ['نشط', 'ok'], used: ['استُخدم', 'info'], expired: ['انتهى', 'warn'], locked: ['أُقفل', 'bad'], revoked: ['أُلغي', 'off'] };
var lk = el('section', { class: 'cr-card' }, [el('h2', { text: 'الرابطان ومدة الصلاحية' }), el('div', { class: 'cr-grid' }, [field('مدة رابط الموافقة', el('select', { disabled: !ed, onchange: function (e) { x.valid_hours = e.target.value ? Number(e.target.value) : null; queue({ valid_hours: x.valid_hours }); } },
[['', 'الافتراضي (' + (s.consent_hours || 48) + ' ساعة)'], ['24', '24 ساعة'], ['48', '48 ساعة'], ['72', '72 ساعة'], ['168', 'أسبوع']].map(function (o) { return el('option', { value: o[0], selected: String(x.valid_hours || '') === o[0], text: o[1] }); })), 'رابط التوقيع بمدة ' + (s.sign_hours || 48) + ' ساعة من الموافقة. الحالية: ' + hrs + ' ساعة. بانتهاء أي رابط يُغلق الطلب تلقائيًا.')]),
links.length ? el('div', { class: 'cr-tw' }, [el('table', { class: 'cr-tbl' }, [el('thead', {}, [el('tr', {}, ['الرابط', 'الحالة', 'أُرسل', 'صالح حتى', 'فُتح', 'التحقق', 'مرات طلب الرمز'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, links.map(function (l) { var s2 = ST2[l.state] || [l.state, 'info']; return el('tr', {}, [el('td', { 'data-l': 'الرابط', text: l.step === 'sign' ? 'التوقيع' : 'الموافقة' }), el('td', { 'data-l': 'الحالة' }, [el('span', { class: 'cr-badge is-' + s2[1], text: s2[0] })]),
el('td', { 'data-l': 'أُرسل', text: at(l.created_at) }), el('td', { 'data-l': 'صالح حتى', text: at(l.expires_at) }), el('td', { 'data-l': 'فُتح', text: l.opened_at ? at(l.opened_at) : '—' }), el('td', { 'data-l': 'التحقق', text: l.factor === 'whatsapp' ? 'واتساب' : l.factor === 'email' ? 'البريد' : '—' }), el('td', { 'data-l': 'مرات طلب الرمز', text: String(l.sends || 0) })]); }))])]) : null]);
var edv = el('div', { class: 'cr-ed' }, lpEditor(T, !ed, onCh, function (st) { (ST.lpv || (ST.lpv = { step: 'consent', screen: 'page', dev: 'phone' })).step = st; }));
return [bar, el('div', { class: 'cr-split is-ed' }, [edv, frameBox]), lk];
}
function loadLp() { if (window.CRQLP || document.getElementById('crq-lp-js')) return; var sc = document.createElement('script'); sc.id = 'crq-lp-js'; sc.src = '/crq/lp.js?v=870'; /* v870: رقم جديد مع كل تغيير في القالب — النسخة القديمة محفوظة في الشبكة برقمها */ sc.onload = function () { draw(); }; document.head.appendChild(sc); }

/* ── القالب العام لصفحتي الرابط («صفحات الرابط» في الإعدادات) — المحرّر نفسه بمعاينة نموذجية ── */
function sampleView(step) {
var d = function (n) { return new Date(Date.now() + n * 864e5).toISOString().slice(0, 10); };
var rows = [{ seq: 3, target: true, open: true, due_before: d(5), due_after: d(185), amt_before: 500, add: 0, amt_after: 500 }, { seq: 4, open: true, due_before: d(35), due_after: d(35), amt_before: 500, add: 57.5, amt_after: 557.5 }, { seq: 5, open: true, due_before: d(65), due_after: d(65), amt_before: 500, add: 57.5, amt_after: 557.5 }];
return { view: { no: 'DF-261114-000001', kind: 'defer', kind_t: 'تأجيل دفعة', step: step, name: 'عميل منصة تيرا', contract_no: 'TRA-26-000123', product: 'iPhone 17 Pro · 256GB',
calc: { client_lines: [{ t: 'رسم التأجيل', amt: 100, tax: 15 }], fees: 100, vat: 15, vat_rate: 15, total: 115, contract: { total_before: 3000, total_after: 3115 }, rows: rows } }, doc_html: '', exp: new Date(Date.now() + 2 * 864e5).toISOString() };
}
function lpSettings() {
var box = el('div', { class: 'crq crq-embed', dir: 'rtl' });
var S2 = { T: null, err: '', busy: false, dirty: false };
var paint = function () {
box.innerHTML = '';
if (!LPX()) { loadLp(); setTimeout(paint, 400); box.appendChild(el('div', { class: 'cr-load', text: 'جارٍ التحميل…' })); return; }
if (!S2.T) { box.appendChild(el('div', { class: 'cr-load', text: S2.err || 'جارٍ تحميل القالب…' })); return; }
var fr = lpFrame(function (st) { return sampleView(st); }, function () { return S2.T; });
var onCh = function (redraw, keep) { if (!keep) S2.dirty = true; if (redraw) paint(); else { var f = fr.querySelector('iframe'); if (f.__send) f.__send(); var b = box.querySelector('[data-lpsave]'); if (b) b.disabled = false; } };
var save = btn(S2.busy ? 'جارٍ الحفظ…' : 'حفظ القالب العام', { cls: 'is-pri', ic: 'check', disabled: S2.busy || !S2.dirty, on: async function () {
S2.busy = true; paint();
try { await api('POST', '/admin/api/crq-tpl', { key: 'crqlp', value: S2.T }); S2.dirty = false; S2.msg = 'حُفظ — يُطبَّق على كل طلب جديد وكل طلب لم يُعتمد بعد، والطلبات المرسلة تبقى كما اعتُمدت.'; } catch (e) { S2.msg = e.message; }
S2.busy = false; paint(); } });
save.setAttribute('data-lpsave', '');
box.appendChild(el('div', { class: 'cr-srcbar' }, [el('div', {}, [el('b', { text: 'صفحتا رابط طلبات تأجيل الدفعة: الموافقة ثم التوقيع' }), el('small', { class: 'cr-hint', text: 'القالب العام لكل الطلبات — ولكل طلب نسخته الخاصة من تبويب «صفحة العميل» داخل الطلب. المعاينة ببيانات نموذجية.' })]), save,
btn('استعادة الافتراضي', { cls: 'is-sm', on: function () { S2.T = LPX().tpl({}); S2.dirty = true; paint(); } })]));
if (S2.msg) box.appendChild(note(/تعذّر|صلاحية/.test(S2.msg) ? 'bad' : 'ok', S2.msg));
box.appendChild(el('div', { class: 'cr-split is-ed' }, [el('div', { class: 'cr-ed' }, lpEditor(S2.T, false, onCh, function (st) { (ST.lpv || (ST.lpv = { step: 'consent', screen: 'page', dev: 'phone' })).step = st; })), fr]));
};
api('GET', '/admin/api/crq-tpl').then(function (j) { S2.T = (LPX() ? LPX().tpl(j.lp) : null); if (!S2.T) { var w = setInterval(function () { if (LPX()) { clearInterval(w); S2.T = LPX().tpl(j.lp); paint(); } }, 300); } paint(); }, function (e) { S2.err = e.message; paint(); });
loadLp(); paint();
return box;
}

/* ── القائمة الجاهزة لبنود رسوم الطلبات («الرسوم والضرائب والعمولات») ── */
function feesSettings() {
var box = el('div', { class: 'crq crq-embed', dir: 'rtl' });
var S2 = { L: null, can: false, err: '', msg: '', busy: false };
var key = function (t, L) { var b = 'f', n = 1; while (L.some(function (z) { return z.k === b + n; })) n++; return b + n; };
var paint = function () {
box.innerHTML = '';
if (!S2.L) { box.appendChild(el('div', { class: 'cr-load', text: S2.err || 'جارٍ التحميل…' })); return; }
var ro = !S2.can;
var tb = el('tbody', {}, S2.L.map(function (f, i) {
return el('tr', { class: f.active ? '' : 'is-off' }, [
el('td', { 'data-l': 'البند' }, [el('input', { type: 'text', value: f.name, maxlength: '80', disabled: ro, 'aria-label': 'اسم البند', oninput: function (e) { f.name = e.target.value; } })]),
el('td', { 'data-l': 'طريقة الحساب' }, [el('select', { disabled: ro, onchange: function (e) { f.calc = e.target.value; paint(); } }, [['fixed', 'مبلغ ثابت'], ['pct', 'نسبة من الدفعة المؤجلة'], ['manual', 'يُدخل لكل طلب']].map(function (o) { return el('option', { value: o[0], selected: f.calc === o[0], text: o[1] }); }))]),
el('td', { 'data-l': f.calc === 'pct' ? 'النسبة (%)' : 'المبلغ (ر.س)' }, [f.calc === 'manual' ? el('span', { class: 'cr-hint', text: '—' }) : el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: String(f.value), disabled: ro, oninput: function (e) { f.value = e.target.value.replace(/[^\d.]/g, ''); } })]),
el('td', { 'data-l': 'الضريبة' }, [el('select', { disabled: ro, onchange: function (e) { f.taxable = e.target.value === '1'; } }, [el('option', { value: '1', selected: f.taxable, text: 'خاضع' }), el('option', { value: '0', selected: !f.taxable, text: 'غير خاضع' })])]),
el('td', { 'data-l': 'في كل طلب جديد' }, [el('select', { disabled: ro, onchange: function (e) { f.auto = e.target.value === '1'; } }, [el('option', { value: '1', selected: f.auto, text: 'يُضاف تلقائيًا' }), el('option', { value: '0', selected: !f.auto, text: 'يُختار من القائمة' })])]),
el('td', { 'data-l': 'الحالة' }, [el('select', { disabled: ro, onchange: function (e) { f.active = e.target.value === '1'; paint(); } }, [el('option', { value: '1', selected: f.active, text: 'مفعّل' }), el('option', { value: '0', selected: !f.active, text: 'موقوف' })])]),
el('td', { class: 'c-del' }, [ro ? null : el('button', { type: 'button', class: 'cr-x', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { S2.L.splice(i, 1); paint(); } }, [icon('trash')])])]);
}));
box.appendChild(el('div', { class: 'cr-tw' }, [el('table', { class: 'cr-tbl is-items' }, [el('thead', {}, [el('tr', {}, ['البند', 'طريقة الحساب', 'القيمة', 'الضريبة', 'في كل طلب جديد', 'الحالة', ''].map(function (h) { return el('th', { text: h }); }))]), tb])]));
if (S2.msg) box.appendChild(note(/تعذّر|راجع|صلاحية/.test(S2.msg) ? 'bad' : 'ok', S2.msg));
if (!ro) box.appendChild(el('div', { class: 'cr-acts' }, [btn('إضافة بند', { ic: 'plus', cls: 'is-sm', on: function () { S2.L.push({ k: key('', S2.L), name: '', calc: 'fixed', value: '0', taxable: true, auto: false, active: true }); paint(); } }),
btn(S2.busy ? 'جارٍ الحفظ…' : 'حفظ القائمة', { cls: 'is-pri is-sm', ic: 'check', disabled: S2.busy, on: async function () {
S2.busy = true; S2.msg = ''; paint();
try { await api('POST', '/admin/api/crq-fees', { items: S2.L }); S2.msg = 'حُفظت القائمة — تظهر في «+ إضافة بند» داخل كل طلب، والتلقائية تُضاف للطلبات الجديدة.'; } catch (e) { S2.msg = e.message; }
S2.busy = false; paint(); } })]));
else box.appendChild(el('p', { class: 'cr-hint', text: 'للعرض فقط — التعديل لمن يملك صلاحية المالية.' }));
};
api('GET', '/admin/api/crq-fees').then(function (j) { S2.L = (j.items || []).map(function (f) { return Object.assign({}, f, { value: String(f.value) }); }); S2.can = !!j.can; paint(); }, function (e) { S2.err = e.message; paint(); });
paint();
return box;
}
window.CRQS = { lpSettings: lpSettings, feesSettings: feesSettings };

/* ── 5) رسائل العميل: الرسائل الخمس من «قوالب الرسائل» (القسم 21) برقم فهرسها، كل رسالة كما تصل في واتساب والبريد وإشعار الجوال وإشعار المنصة
* ببيانات هذا الطلب، و«إرسال معاينة لجوالي» اختياري — يصل صاحب الجلسة وحده، ولا يصل العميل شيء. النص نفسه يُعدَّل من «قوالب الرسائل». ── */
var CRQ_MSGS = [['crq_received', 'عند تقديم الطلب'], ['crq_offer', 'عند اعتماد العرض وإرسال رابط الموافقة'], ['crq_sign', 'بعد موافقة العميل — رابط التوقيع'], ['crq_done', 'بعد التنفيذ'], ['crq_closed', 'عند إغلاق الطلب']];
var MS = { rows: null, err: '', pv: {}, busy: '' };
function MX() { return window.__teraApp && window.__teraApp.docx && window.__teraApp.docx.msg; }
function msgVars(x) { var exp = x.link && x.link.expires_at ? at(x.link.expires_at) : 'بعد ' + ((x.settings || {}).consent_hours || 48) + ' ساعة من الإرسال';
return { '{service}': x.kind_t || 'تأجيل دفعة', '{req}': x.no, '{contract}': x.contract_no || '', '{link}': location.origin + '/crq/?t=…', '{valid}': exp, '{reason}': x.close_t || 'انتهت مدة العرض', '{name}': x.client || '' }; }
function msgFill(t, V) { return String(t || '').replace(/\{[a-z_]+\}/g, function (m) { return V[m] != null ? V[m] : m; }); }
function msgRow(r, x) { var V = msgVars(x); return { title: msgFill(r.title, V), status: msgFill(r.status, V), l1: msgFill(r.l1, V), l2: msgFill(r.l2, V), l3: msgFill(r.l3, V), l4: msgFill(r.l4, V), btn_label: r.btn_label, btn_path: r.btn_path, img: r.img, attach: r.attach, channels: (r.channels || []).slice(), state: r.state }; }
function tabMsg(x) {
var M = MX();
if (!M) return [note('warn', 'تعذّر الوصول إلى «قوالب الرسائل» — حدّث الصفحة.')];
if (!MS.rows && !MS.load) { MS.load = true; Promise.resolve(M.list()).then(function (j) { MS.rows = (j && j.rows) || []; MS.load = false; draw(); }, function (e) { MS.err = (e && e.message) || 'تعذّر التحميل.'; MS.rows = []; MS.load = false; draw(); }); }
if (!MS.rows) return [el('div', { class: 'cr-load', text: 'جارٍ قراءة «قوالب الرسائل»…' })];
var sel = ST.msgK || CRQ_MSGS[0][0], r = MS.rows.filter(function (z) { return z.key === sel; })[0];
var list = el('nav', { class: 'cr-msgl', 'aria-label': 'الرسائل' }, CRQ_MSGS.map(function (m) { var z = MS.rows.filter(function (q) { return q.key === m[0]; })[0];
return el('button', { type: 'button', class: sel === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.msgK = m[0]; draw(); } }, [el('span', { class: 'cr-code', text: z ? z.code : '—' }), el('span', {}, [el('b', { text: z ? z.title : m[0] }), el('small', { text: m[1] })])]); }));
var kids = [];
if (!r) kids.push(note('warn', 'لا قالب لهذه الرسالة في «قوالب الرسائل».'));
else {
var row = msgRow(r, x), K = sel + ':' + x.id + ':' + x.updated_at, P = MS.pv[K];
if (!P) { MS.pv[K] = P = { st: 'load' }; Promise.resolve(M.preview(sel, row, x.client || '')).then(function (j) { P.st = 'ok'; P.d = j && j.preview; P.err = j && j.ok === false ? (j.message || 'تعذّرت المعاينة.') : ''; draw(); }, function (e) { P.st = 'ok'; P.err = (e && e.message) || 'تعذّرت المعاينة.'; draw(); }); }
var d = P.d || {}, wa = d.wa || {}, ml = d.mail || d.email || {}, pu = d.push || {}, ib = d.inbox || {};
var lines = [row.l1, row.l2, row.l3, row.l4].filter(Boolean);
var waText = wa.text || [row.title, ''].concat(lines).join('\n');
var send = function (ch, lab) { return btn(MS.busy === ch ? 'جارٍ الإرسال…' : lab, { cls: 'is-sm', ic: 'send', disabled: !!MS.busy, on: async function () { MS.busy = ch; draw(); try { var j = await M.test(sel, row, ch); toast(!(j && j.ok === false), (j && j.message) || 'أُرسلت المعاينة إليك.'); } catch (e) { toast(false, e.message); } MS.busy = ''; draw(); } }); };
kids.push(el('div', { class: 'cr-msgh' }, [el('div', {}, [el('span', { class: 'cr-code is-lg', text: r.code || '' }), el('b', { text: r.title }), el('small', { class: 'cr-hint', text: 'النص من «قوالب الرسائل» — نص واحد لكل القنوات، والمتغيرات معبّأة من هذا الطلب.' })]),
el('div', { class: 'cr-acts' }, [send('whatsapp', 'إرسال معاينة لجوالي'), send('email', 'إلى بريدي'), send('push', 'إشعار لأجهزتي')])]));
if (P.st === 'load') kids.push(el('div', { class: 'cr-load', text: 'جارٍ تجهيز المعاينة…' }));
if (P.err) kids.push(note('warn', P.err));
var mailH = ml.html || '';
kids.push(el('div', { class: 'cr-msgg' }, [
el('section', { class: 'cr-card' }, [el('h2', { text: 'واتساب' }), el('div', { class: 'cr-wa' }, [wa.img ? el('img', { src: wa.img, alt: '' }) : null, el('p', { text: waText }), wa.button || row.btn_label ? el('span', { class: 'cr-wa-b', text: (wa.button && (wa.button.text || wa.button)) || row.btn_label }) : null]), wa.template ? el('small', { class: 'cr-hint', text: 'قالب Meta: ' + wa.template + (wa.approved ? ' · معتمد' : ' · بانتظار الاعتماد') }) : null]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'البريد الإلكتروني' }), el('small', { class: 'cr-hint', text: 'الموضوع: ' + (ml.subject || row.title) }), mailH ? (function () { var f = el('iframe', { class: 'cr-mailf', title: 'معاينة البريد', sandbox: '' }); f.srcdoc = mailH; return f; })() : el('div', { class: 'cr-mailt' }, lines.map(function (l) { return el('p', { text: l }); }))]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'إشعار الجوال' }), el('div', { class: 'cr-push' }, [el('b', { text: pu.title || row.title }), el('span', { text: pu.body || lines[0] || '' })])]),
el('section', { class: 'cr-card' }, [el('h2', { text: 'إشعار المنصة' }), el('div', { class: 'cr-push is-in' }, [el('b', { text: ib.title || row.title }), el('span', { text: ib.body || lines.join(' ') }), row.status ? el('small', { class: 'cr-badge is-info', text: row.status }) : null])])]));
}
if (MS.err) kids.unshift(note('bad', MS.err));
return [el('div', { class: 'cr-split is-msg' }, [list, el('div', { class: 'cr-msgb' }, kids)])];
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
function run() { loadLp(); if (!ST.rows && !ST.loading) { ST.loading = true; loadList(); } draw(); return R; }
window.addEventListener('beforeunload', function (e) { if (ST.save.pending) { e.preventDefault(); e.returnValue = ''; } });
function reg() { if (window.__teraApp && typeof window.__teraApp.page === 'function') { window.__teraApp.page(KEY, TITLE, ['clock', 'violet'], run, UP); return true; } return false; }
if (!reg()) { (window.__crqQ = window.__crqQ || []).push(reg); }
})();
