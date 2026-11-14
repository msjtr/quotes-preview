/* v874 — «مكتبة البنود»: المصدر الواحد لبنود المستندات (تبويب في «قوالب المستندات»).
* ملف مستقل: المنصة تعطي المكان (cfg.libPanel) ورمز الجلسة، وهذه الوحدة ترسم وتحفظ عبر /admin/api/clauses،
* والقاعدة تفرض الصلاحيات وتسجّل كل تعديل (doc_clause_*).
* - البنود: بحث وتصفية بالقسم والاستخدام والحالة، تحرير كامل (العنوان والقسم والاستخدامات والصيغ والافتراضية والمرجع)،
*   إخفاء وإظهار، حذف واستعادة، ترتيب، إضافة بند وقسم.
* - المراجع: المكتبة السابقة (127) ونصوص القوالب السابقة (162) مربوطة ببنودها، والفهرس الشامل (398)، والسجل.
* - مصدر رئيسي: بعد التحميل تُستبدل قوائم «إضافة بند» في المحررات (EGLIB · مكتبة المستندات) بالبنود الظاهرة من هنا. */
(function () {
'use strict';
if (!/^\/staff\/next(\/|$)/.test(location.pathname)) return;
var USES = { o: 'عروض الأسعار', f: 'الفواتير والإيصالات', i: 'البيع الآجل', m: 'طلبات التعديل', s: 'الخدمات', a: 'التوكيل بالبيع', h: 'الشركاء', p: 'صفحات العميل' };
var VL = ['رسمية', 'مختصرة', 'إقرار العميل', 'صيغة إضافية'];
var STN = { active: 'ظاهر', hidden: 'مخفي', deleted: 'محذوف' };
var LST = { c: 'مشمول', a: 'أُضيف له بند', u: 'عُدّل ليشمله', r: 'استُبدل بصياغة أدق', x: 'ليس بندًا' };
var ACT = { add: 'أضاف بندًا', edit: 'عدّل', hide: 'أخفى', show: 'أظهر', 'delete': 'حذف', restore: 'استعاد', move: 'غيّر ترتيب', sec_add: 'أضاف قسمًا', sec_edit: 'عدّل قسمًا', sec_move: 'غيّر ترتيب قسم' };
var ICAT = { D: 'نصوص المستندات', M: 'كتالوج الرسائل', T: 'فهرس قوالب الرسائل', E: 'عقود الموظفين' };
var NS = 'http://www.w3.org/2000/svg';
var IC = {
plus: 'M12 5v14M5 12h14', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4', edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', eyeoff: 'M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.6 6.6C3.8 8.3 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2',
trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3', up: 'M12 19V5M6 11l6-6 6 6', down: 'M12 5v14M6 13l6 6 6-6',
x: 'M6 6l12 12M18 6L6 18', check: 'M5 12.5l4.5 4.5L19 7.5', book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7', clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', archive: 'M3 4h18v4H3zM5 8v12h14V8M10 12h4', folder: 'M3 6h6l2 2h10v11H3z', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', alert: 'M12 7.5v6M12 16.6v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', chev: 'M9 6l6 6-6 6', copy: 'M8 8h12v12H8zM4 16V4h12'
};
function icon(n) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'clh-ic'); var p = document.createElementNS(NS, 'path'); p.setAttribute('d', IC[n] || IC.list); s.appendChild(p); return s; }
function el(tag, a, kids) {
var n = document.createElement(tag);
Object.keys(a || {}).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v); else n.setAttribute(k, v === true ? '' : v); });
(kids || []).forEach(function (c) { if (c == null || c === false) return; n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
return n;
}
function btn(label, o) { o = o || {}; return el('button', { type: 'button', class: 'clh-btn' + (o.cls ? ' ' + o.cls : ''), disabled: o.disabled, title: o.title || null, 'aria-label': o.aria || (label ? null : o.title), 'data-live-ok': '', onclick: o.on }, [o.ic ? icon(o.ic) : null, label ? el('span', { text: label }) : null]); }
function at(t) { if (!t) return ''; try { return new Date(t).toLocaleString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return String(t); } }
function norm(s) { return String(s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase(); }
async function api(method, path, body) {
var t = await window.__teraApp.token();
var r = await fetch(path, { method: method, cache: 'no-store', headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
var j = null; try { j = await r.json(); } catch (e) { j = null; }
if (!r.ok || !j || j.ok === false) { var er = new Error((j && j.message) || 'تعذّر تنفيذ الإجراء.'); er.code = j && j.error; er.row = j && j.row; throw er; }
return j;
}

var H = { loaded: false, loading: false, ready: true, err: '', can: false, secs: [], rows: [], ln: {}, view: 'lib', q: '', sec: '', use: '', st: 'live', open: {},
legacy: null, index: null, log: null, sub: { prev: '', tpl: '', idx: '' }, edit: null, secEdit: null, ask: null, flash: null, busy: false, focus: null };
var R = null;

function toast(ok, t) { H.flash = [ok, t]; draw(); setTimeout(function () { if (H.flash && H.flash[1] === t) { H.flash = null; draw(); } }, 4200); }
function secOf(id) { for (var i = 0; i < H.secs.length; i++) if (H.secs[i].id === id) return H.secs[i]; return null; }
function rowOf(id) { for (var i = 0; i < H.rows.length; i++) if (H.rows[i].id === id) return H.rows[i]; return null; }
function vars(c) { return Array.isArray(c && c.vars) ? c.vars : []; }
function main(c) { var v = vars(c); return v[c.pick || 0] || v[0] || { t: '' }; }
function count(st) { return H.rows.filter(function (c) { return st === 'live' ? c.state !== 'deleted' : c.state === st; }).length; }

async function load(force) {
if (H.loading || (H.loaded && !force)) return;
H.loading = true; draw();
try { var j = await api('GET', '/admin/api/clauses'); H.secs = j.secs || []; H.rows = j.rows || []; H.can = !!j.can_edit; H.ln = j.legacy_n || {}; H.ready = true; H.err = ''; H.loaded = true; feed(); }
catch (e) { H.ready = e.code !== 'not_ready'; H.err = H.ready ? e.message : ''; }
H.loading = false; draw();
}
async function loadRef(k) {
try {
if (k === 'log') { var g = await api('GET', '/admin/api/clauses/log'); H.log = g.rows || []; }
else if (k === 'idx') { if (!H.index) { var x = await api('GET', '/admin/api/clauses/index'); H.index = x.rows || []; } }
else if (!H.legacy) { var l = await api('GET', '/admin/api/clauses/legacy'); H.legacy = l.rows || []; }
} catch (e) { toast(false, e.message); }
draw();
}

/* ── المصدر الرئيسي: قوائم «إضافة بند» في المحررات تُستبدل في مكانها بالبنود الظاهرة ── */
function feed() {
if (!H.rows.length) return;
var hidSec = {}; H.secs.forEach(function (s) { if (s.hidden) hidSec[s.id] = 1; });
var so = {}; H.secs.forEach(function (s, i) { so[s.id] = i; });
var groups = H.rows.filter(function (c) { return c.state === 'active' && !hidSec[c.sec]; })
.sort(function (a, b) { return (so[a.sec] - so[b.sec]) || (a.ord - b.ord) || (a.id < b.id ? -1 : 1); })
.map(function (c) { var v = vars(c).map(function (x) { return x.t; }), p = c.pick || 0; if (p && v[p]) v = [v[p]].concat(v.filter(function (_, i) { return i !== p; })); var s = secOf(c.sec); return { i: c.id, t: c.title, g: s ? s.name : '', e: v, u: c.uses || [] }; });
var lists = [window.EGLIB];
try { if (window.__teraApp && window.__teraApp.docx && window.__teraApp.docx.lib) lists.push(window.__teraApp.docx.lib()); } catch (e) { void e; }
lists.forEach(function (L) { if (Array.isArray(L) && L !== groups) { L.splice.apply(L, [0, L.length].concat(groups.map(function (g) { return { i: g.i, t: g.t, g: g.g, e: g.e.slice(), u: g.u }; }))); } });
window.CLHUB.items = groups;
}

/* ── الحفظ ── */
async function run(fn, okMsg) {
if (H.busy) return; H.busy = true; draw();
try { await fn(); if (okMsg) toast(true, okMsg); }
catch (e) { if (e.code === 'conflict' && e.row) { var i = H.rows.findIndex(function (c) { return c.id === e.row.id; }); if (i >= 0) H.rows[i] = e.row; if (H.edit) H.edit.base = e.row.updated_at; } toast(false, e.message); }
H.busy = false; draw();
}
function put(row) { var i = H.rows.findIndex(function (c) { return c.id === row.id; }); if (i >= 0) H.rows[i] = row; else H.rows.push(row); feed(); }
function setState(c, st) {
run(async function () { var j = await api('POST', '/admin/api/clauses/state', { id: c.id, state: st }); put(j.row); H.log = null; },
st === 'hidden' ? 'أُخفي «' + c.title + '» من قوائم الاختيار' : st === 'deleted' ? 'حُذف «' + c.title + '» — تجده في «المحذوفة»' : 'أصبح «' + c.title + '» ظاهرًا');
}
function move(c, dir) { run(async function () { await api('POST', '/admin/api/clauses/move', { id: c.id, dir: dir }); H.loaded = false; H.focus = c.id; await load(true); }); }
function secMove(s, dir) { run(async function () { await api('POST', '/admin/api/clauses/sec-move', { id: s.id, dir: dir }); H.loaded = false; await load(true); }); }

/* ── المحرّر ── */
function openEdit(c, sec) {
var base = c ? JSON.parse(JSON.stringify(c)) : { id: null, sec: sec || (H.sec || (H.secs[0] && H.secs[0].id) || ''), title: '', uses: (secOf(sec || H.sec) || {}).uses || [], vars: [{ l: VL[0], t: '' }, { l: VL[1], t: '' }, { l: VL[2], t: '' }], pick: 0, ref: '', note: '' };
if (!base.vars.length) base.vars = [{ l: VL[0], t: '' }];
H.edit = { d: base, o: JSON.stringify(base), base: c ? c.updated_at : null, err: {} }; draw();
setTimeout(function () { var f = R && R.querySelector('.clh-sheet [data-first]'); if (f) f.focus(); }, 30);
}
function dirty() { return H.edit && JSON.stringify(H.edit.d) !== H.edit.o; }
function closeEdit(force) { if (!force && dirty()) { H.ask = { t: 'تجاهل التعديلات؟', d: 'لم تُحفظ تعديلاتك على هذا البند.', ok: 'تجاهل', danger: true, go: function () { H.edit = null; } }; draw(); return; } H.edit = null; draw(); }
function saveEdit() {
var d = H.edit.d, err = {};
if (!String(d.title || '').trim()) err.title = 'اكتب عنوان البند.';
if (!vars(d).some(function (v) { return String(v.t || '').trim(); })) err.vars = 'اكتب نص صيغة واحدة على الأقل.';
if (!d.sec) err.sec = 'اختر القسم.';
H.edit.err = err; if (Object.keys(err).length) { draw(); return; }
var isNew = !d.id;
run(async function () {
var j = await api('POST', '/admin/api/clauses/save', { id: d.id, sec: d.sec, title: d.title, uses: d.uses, vars: d.vars, pick: d.pick, ref: d.ref, note: d.note, base: H.edit.base });
put(j.row); H.ln[j.row.id] = H.ln[j.row.id] || 0; H.edit = null; H.focus = j.row.id; H.log = null;
}, isNew ? 'أُضيف البند' : 'حُفظ البند');
}
function editor() {
var E = H.edit, d = E.d, ro = !H.can;
var f = function (k, lab, input, err) { return el('label', { class: 'clh-f' + (err ? ' is-err' : '') }, [el('span', { class: 'clh-fl', text: lab }), input, err ? el('small', { class: 'clh-ferr', text: err }) : null]); };
var title = el('input', { class: 'clh-in', value: d.title, maxlength: '200', 'data-first': '', readonly: ro, placeholder: 'مثال: صحة البيانات', oninput: function (e) { d.title = e.target.value; } });
var sec = el('select', { class: 'clh-in', disabled: ro, onchange: function (e) { d.sec = e.target.value; } }, H.secs.map(function (s) { return el('option', { value: s.id, selected: s.id === d.sec }, [s.id + ' · ' + s.name]); }));
var uses = el('div', { class: 'clh-chips', role: 'group', 'aria-label': 'يُستخدم في' }, Object.keys(USES).map(function (k) {
var on = (d.uses || []).indexOf(k) >= 0;
return el('button', { type: 'button', class: 'clh-chip' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false', disabled: ro, onclick: function () { var u = (d.uses || []).slice(), i = u.indexOf(k); if (i >= 0) u.splice(i, 1); else u.push(k); d.uses = u; draw(); } }, [on ? icon('check') : null, USES[k]]);
}));
var vl = el('div', { class: 'clh-vars' }, vars(d).map(function (v, i) {
var ta = el('textarea', { class: 'clh-ta', rows: '3', readonly: ro, placeholder: 'نص الصيغة', oninput: function (e) { v.t = e.target.value; } }); ta.value = v.t || '';
return el('div', { class: 'clh-var' + (i === (d.pick || 0) ? ' is-main' : '') }, [
el('div', { class: 'clh-varh' }, [
el('label', { class: 'clh-radio' }, [el('input', { type: 'radio', name: 'clh-pick', checked: i === (d.pick || 0), disabled: ro, onchange: function () { d.pick = i; draw(); } }), el('span', { text: i === (d.pick || 0) ? 'الافتراضية' : 'اجعلها الافتراضية' })]),
el('input', { class: 'clh-in clh-vlab', value: v.l || VL[Math.min(i, 3)], maxlength: '40', readonly: ro, 'aria-label': 'اسم الصيغة', oninput: function (e) { v.l = e.target.value; } }),
ro ? null : btn('', { cls: 'is-icon', ic: 'up', title: 'أعلى', disabled: i === 0, on: function () { var a = d.vars; a.splice(i - 1, 0, a.splice(i, 1)[0]); if (d.pick === i) d.pick = i - 1; else if (d.pick === i - 1) d.pick = i; draw(); } }),
ro ? null : btn('', { cls: 'is-icon', ic: 'down', title: 'أسفل', disabled: i === d.vars.length - 1, on: function () { var a = d.vars; a.splice(i + 1, 0, a.splice(i, 1)[0]); if (d.pick === i) d.pick = i + 1; else if (d.pick === i + 1) d.pick = i; draw(); } }),
ro || d.vars.length < 2 ? null : btn('', { cls: 'is-icon is-bad', ic: 'trash', title: 'إزالة الصيغة', on: function () { d.vars.splice(i, 1); if ((d.pick || 0) >= d.vars.length || d.pick === i) d.pick = 0; draw(); } })
]), ta]);
}));
var legacy = (H.legacy || []).filter(function (l) { return d.id && (l.codes || []).indexOf(d.id) >= 0; });
return el('div', { class: 'clh-ov', onclick: function (e) { if (e.target === e.currentTarget) closeEdit(); } }, [
el('section', { class: 'clh-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': d.id ? 'تحرير البند' : 'بند جديد' }, [
el('header', { class: 'clh-sh' }, [el('div', {}, [el('small', { text: d.id ? 'تحرير البند' : 'بند جديد' }), el('h3', { text: d.id ? d.id + ' · ' + (d.title || '') : (d.title || 'بند جديد') })]), btn('', { cls: 'is-icon', ic: 'x', title: 'إغلاق', on: function () { closeEdit(); } })]),
el('div', { class: 'clh-sb' }, [
ro ? el('p', { class: 'clh-note', text: 'للاطلاع — التعديل للمشرف العام أو صاحب صلاحية قوالب المستندات.' }) : null,
el('div', { class: 'clh-grid2' }, [f('title', 'عنوان البند', title, E.err.title), f('sec', 'القسم', sec, E.err.sec)]),
el('div', { class: 'clh-f' }, [el('span', { class: 'clh-fl', text: 'يُستخدم في' }), uses, el('small', { class: 'clh-hint', text: 'يظهر البند في قائمة الاختيار للمستندات المحددة هنا.' })]),
el('div', { class: 'clh-f' + (E.err.vars ? ' is-err' : '') }, [el('div', { class: 'clh-flh' }, [el('span', { class: 'clh-fl', text: 'الصيغ' }), el('small', { class: 'clh-hint', text: 'الافتراضية هي التي تُدرج أولًا في المستندات.' })]), vl,
E.err.vars ? el('small', { class: 'clh-ferr', text: E.err.vars }) : null,
ro || d.vars.length >= 8 ? null : btn('صيغة بديلة', { cls: 'is-ghost', ic: 'plus', on: function () { d.vars.push({ l: VL[Math.min(d.vars.length, 3)], t: '' }); draw(); } })]),
el('div', { class: 'clh-grid2' }, [
f('ref', 'المرجع النظامي (اختياري)', el('input', { class: 'clh-in', value: d.ref || '', maxlength: '200', readonly: ro, placeholder: 'مثال: نظام التعاملات الإلكترونية', oninput: function (e) { d.ref = e.target.value; } })),
f('note', 'ملاحظة داخلية (اختياري)', el('input', { class: 'clh-in', value: d.note || '', maxlength: '1000', readonly: ro, placeholder: 'لا تظهر في المستندات', oninput: function (e) { d.note = e.target.value; } }))]),
legacy.length ? el('details', { class: 'clh-leg' }, [el('summary', { text: 'النصوص السابقة المرتبطة بهذا البند (' + legacy.length + ')' }), el('ol', {}, legacy.map(function (l) { return el('li', {}, [l.text, el('small', { text: ' — ' + l.grp_name })]); }))]) : null,
d.id && rowOf(d.id) && rowOf(d.id).updated_by_name ? el('p', { class: 'clh-hint', text: 'آخر تعديل: ' + rowOf(d.id).updated_by_name + ' · ' + at(rowOf(d.id).updated_at) }) : null
]),
el('footer', { class: 'clh-sf' }, ro ? [btn('إغلاق', { on: function () { closeEdit(true); } })] : [
btn(H.busy ? 'جارٍ الحفظ…' : (d.id ? 'حفظ التعديلات' : 'إضافة البند'), { cls: 'is-pri', ic: 'check', disabled: H.busy, on: saveEdit }),
btn('إلغاء', { on: function () { closeEdit(); } })])
])]);
}
function secEditor() {
var S = H.secEdit, d = S.d;
return el('div', { class: 'clh-ov', onclick: function (e) { if (e.target === e.currentTarget) { H.secEdit = null; draw(); } } }, [
el('section', { class: 'clh-sheet is-sm', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'القسم' }, [
el('header', { class: 'clh-sh' }, [el('div', {}, [el('small', { text: d.id ? 'تعديل القسم' : 'قسم جديد' }), el('h3', { text: d.name || 'قسم جديد' })]), btn('', { cls: 'is-icon', ic: 'x', title: 'إغلاق', on: function () { H.secEdit = null; draw(); } })]),
el('div', { class: 'clh-sb' }, [
el('label', { class: 'clh-f' + (S.err ? ' is-err' : '') }, [el('span', { class: 'clh-fl', text: 'اسم القسم' }), el('input', { class: 'clh-in', value: d.name || '', maxlength: '80', 'data-first': '', oninput: function (e) { d.name = e.target.value; } }), S.err ? el('small', { class: 'clh-ferr', text: S.err }) : null]),
el('label', { class: 'clh-f' }, [el('span', { class: 'clh-fl', text: 'وصف قصير' }), el('input', { class: 'clh-in', value: d.note || '', maxlength: '300', oninput: function (e) { d.note = e.target.value; } })]),
el('div', { class: 'clh-f' }, [el('span', { class: 'clh-fl', text: 'الاستخدامات الافتراضية لبنوده الجديدة' }), el('div', { class: 'clh-chips' }, Object.keys(USES).map(function (k) { var on = (d.uses || []).indexOf(k) >= 0; return el('button', { type: 'button', class: 'clh-chip' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: function () { var u = (d.uses || []).slice(), i = u.indexOf(k); if (i >= 0) u.splice(i, 1); else u.push(k); d.uses = u; draw(); } }, [on ? icon('check') : null, USES[k]]); }))]),
d.id ? el('label', { class: 'clh-switch' }, [el('input', { type: 'checkbox', checked: !!d.hidden, onchange: function (e) { d.hidden = e.target.checked; } }), el('span', { text: 'إخفاء القسم كاملًا من قوائم الاختيار' })]) : null
]),
el('footer', { class: 'clh-sf' }, [btn(H.busy ? 'جارٍ الحفظ…' : 'حفظ', { cls: 'is-pri', ic: 'check', disabled: H.busy, on: function () {
if (!String(d.name || '').trim()) { S.err = 'اكتب اسم القسم.'; draw(); return; }
run(async function () { var j = await api('POST', '/admin/api/clauses/sec', d); var i = H.secs.findIndex(function (s) { return s.id === j.sec.id; }); if (i >= 0) H.secs[i] = j.sec; else H.secs.push(j.sec); H.secEdit = null; feed(); }, 'حُفظ القسم');
} }), btn('إلغاء', { on: function () { H.secEdit = null; draw(); } })])
])]);
}
function askBox() {
var A = H.ask;
return el('div', { class: 'clh-ov is-ask', onclick: function (e) { if (e.target === e.currentTarget) { H.ask = null; draw(); } } }, [
el('section', { class: 'clh-ask', role: 'alertdialog', 'aria-modal': 'true', 'aria-label': A.t }, [el('h3', { text: A.t }), el('p', { text: A.d }),
el('div', { class: 'clh-askb' }, [btn(A.ok, { cls: A.danger ? 'is-bad' : 'is-pri', on: function () { var g = A.go; H.ask = null; g(); draw(); } }), btn('تراجع', { on: function () { H.ask = null; draw(); } })])])]);
}

/* ── قائمة البنود ── */
function match(c) {
if (H.st === 'live' ? c.state === 'deleted' : c.state !== H.st) return false;
if (H.sec && c.sec !== H.sec) return false;
if (H.use && (c.uses || []).indexOf(H.use) < 0) return false;
if (H.q) { var q = norm(H.q); if (norm([c.id, c.title, c.ref, c.note].concat(vars(c).map(function (v) { return v.t; })).join(' ')).indexOf(q) < 0) return false; }
return true;
}
function usesChips(u) {
u = u || []; var all = Object.keys(USES);
if (!u.length) return el('span', { class: 'clh-uses' }, [el('span', { class: 'is-none', text: 'لا يظهر في أي مستند' })]);
if (u.length === all.length) return el('span', { class: 'clh-uses' }, [el('span', { text: 'كل المستندات' })]);
var shown = u.slice(0, 3).map(function (k) { return el('span', { text: USES[k] || k }); });
if (u.length > 3) shown.push(el('span', { title: u.slice(3).map(function (k) { return USES[k] || k; }).join('، '), text: '+' + (u.length - 3) }));
return el('span', { class: 'clh-uses' }, shown);
}
function clauseRow(c, i, list) {
var v = main(c), open = !!H.open[c.id], ln = H.ln[c.id] || 0, del = c.state === 'deleted', can = H.can;
var acts = !can ? [btn('عرض', { cls: 'is-ghost', ic: 'eye', on: function () { openEdit(c); } })] : del ? [btn('استعادة', { cls: 'is-pri is-soft', ic: 'undo', disabled: H.busy, on: function () { setState(c, 'active'); } })] : [
btn('تحرير', { cls: 'is-soft', ic: 'edit', on: function () { openEdit(c); if (!H.legacy) loadRef('prev'); } }),
btn('', { cls: 'is-icon', ic: c.state === 'hidden' ? 'eye' : 'eyeoff', title: c.state === 'hidden' ? 'إظهار في قوائم الاختيار' : 'إخفاء من قوائم الاختيار', disabled: H.busy, on: function () { setState(c, c.state === 'hidden' ? 'active' : 'hidden'); } }),
btn('', { cls: 'is-icon', ic: 'up', title: 'أعلى', disabled: H.busy || i === 0 || !!H.q || H.st !== 'live', on: function () { move(c, -1); } }),
btn('', { cls: 'is-icon', ic: 'down', title: 'أسفل', disabled: H.busy || i === list.length - 1 || !!H.q || H.st !== 'live', on: function () { move(c, 1); } }),
btn('', { cls: 'is-icon is-bad', ic: 'trash', title: 'حذف', disabled: H.busy, on: function () { H.ask = { t: 'حذف «' + c.title + '»؟', d: 'يختفي من المكتبة ومن كل قوائم الاختيار، ويبقى في «المحذوفة» ويمكن استعادته. المستندات الصادرة سابقًا لا تتغيّر.', ok: 'حذف', danger: true, go: function () { setState(c, 'deleted'); } }; draw(); } })];
return el('article', { class: 'clh-row is-' + c.state + (H.focus === c.id ? ' is-focus' : ''), 'data-id': c.id }, [
el('div', { class: 'clh-code' }, [el('bdi', { dir: 'ltr', text: c.id })]),
el('div', { class: 'clh-rb' }, [
el('div', { class: 'clh-rh' }, [el('b', { class: 'clh-rt', text: c.title }), c.state !== 'active' ? el('span', { class: 'clh-pill is-' + c.state, text: STN[c.state] }) : null,
usesChips(c.uses)]),
el('p', { class: 'clh-txt' + (open ? ' is-open' : ''), text: v.t }),
open ? el('div', { class: 'clh-alts' }, vars(c).map(function (x, k) { return k === (c.pick || 0) ? null : el('p', {}, [el('small', { text: (x.l || VL[Math.min(k, 3)]) + ': ' }), x.t]); })) : null,
el('div', { class: 'clh-meta' }, [
vars(c).length > 1 ? el('button', { type: 'button', class: 'clh-lnk', 'aria-expanded': open ? 'true' : 'false', onclick: function () { H.open[c.id] = !open; draw(); } }, [open ? 'إخفاء الصيغ' : vars(c).length + ' صيغ — عرضها']) : el('span', { text: 'صيغة واحدة' }),
c.ref ? el('span', { class: 'clh-ref', text: c.ref }) : null,
ln ? el('button', { type: 'button', class: 'clh-lnk', onclick: function () { H.view = 'prev'; H.sub.prev = c.id; loadRef('prev'); draw(); } }, [icon('link'), ln + ' نص سابق']) : null,
c.flag ? el('span', { class: 'clh-flag', text: 'للمراجعة: ' + c.flag }) : null
])]),
el('div', { class: 'clh-acts' }, acts)
]);
}
function libView() {
var lists = {}, total = 0;
H.rows.filter(match).forEach(function (c) { (lists[c.sec] = lists[c.sec] || []).push(c); total++; });
Object.keys(lists).forEach(function (k) { lists[k].sort(function (a, b) { return (a.ord - b.ord) || (a.id < b.id ? -1 : 1); }); });
var bar = el('div', { class: 'clh-tools' }, [
el('label', { class: 'clh-search' }, [icon('search'), el('input', { type: 'search', placeholder: 'ابحث في العناوين والنصوص والرموز', value: H.q, 'aria-label': 'بحث', oninput: function (e) { H.q = e.target.value; H.qf = 1; draw(); } })]),
el('select', { class: 'clh-in clh-sel', 'aria-label': 'القسم', onchange: function (e) { H.sec = e.target.value; draw(); } }, [el('option', { value: '' }, ['كل الأقسام'])].concat(H.secs.map(function (s) { return el('option', { value: s.id, selected: H.sec === s.id }, [s.id + ' · ' + s.name]); }))),
el('select', { class: 'clh-in clh-sel', 'aria-label': 'يُستخدم في', onchange: function (e) { H.use = e.target.value; draw(); } }, [el('option', { value: '' }, ['كل الاستخدامات'])].concat(Object.keys(USES).map(function (k) { return el('option', { value: k, selected: H.use === k }, [USES[k]]); }))),
el('div', { class: 'clh-seg', role: 'group', 'aria-label': 'الحالة' }, [['live', 'الكل'], ['active', 'ظاهر'], ['hidden', 'مخفي'], ['deleted', 'المحذوفة']].map(function (s) {
return el('button', { type: 'button', class: H.st === s[0] ? 'is-on' : '', 'aria-pressed': H.st === s[0] ? 'true' : 'false', onclick: function () { H.st = s[0]; draw(); } }, [s[1], el('b', { text: String(count(s[0])) })]);
}))
]);
var body = [];
H.secs.forEach(function (s, si) {
var list = lists[s.id] || []; if (!list.length && (H.q || H.use || H.st !== 'live' || (H.sec && H.sec !== s.id))) return;
body.push(el('section', { class: 'clh-sec' + (s.hidden ? ' is-hidden' : ''), id: 'clh-s-' + s.id }, [
el('header', { class: 'clh-sech' }, [el('span', { class: 'clh-seck', text: s.id }), el('div', { class: 'clh-secn' }, [el('h3', { text: s.name }), s.note ? el('small', { text: s.note }) : null]),
s.hidden ? el('span', { class: 'clh-pill is-hidden', text: 'قسم مخفي' }) : null, el('span', { class: 'clh-cnt', text: list.length + ' بند' }),
H.can ? el('div', { class: 'clh-acts' }, [btn('', { cls: 'is-icon', ic: 'edit', title: 'تعديل القسم', on: function () { H.secEdit = { d: JSON.parse(JSON.stringify(s)) }; draw(); } }),
btn('', { cls: 'is-icon', ic: 'up', title: 'القسم أعلى', disabled: H.busy || si === 0, on: function () { secMove(s, -1); } }),
btn('', { cls: 'is-icon', ic: 'down', title: 'القسم أسفل', disabled: H.busy || si === H.secs.length - 1, on: function () { secMove(s, 1); } })]) : null]),
el('div', { class: 'clh-list' }, list.length ? list.map(function (c, i) { return clauseRow(c, i, list); }) : [el('p', { class: 'clh-empty', text: 'لا بنود في هذا القسم.' })]),
H.can && H.st === 'live' && !H.q ? el('button', { type: 'button', class: 'clh-add', onclick: function () { openEdit(null, s.id); } }, [icon('plus'), 'إضافة بند إلى «' + s.name + '»']) : null
]));
});
if (!total && (H.q || H.use || H.st !== 'live')) body.push(el('div', { class: 'clh-empty is-big' }, [icon('search'), el('b', { text: H.st === 'deleted' ? 'لا بنود محذوفة' : 'لا نتائج' }), el('span', { text: H.st === 'deleted' ? 'البند المحذوف يظهر هنا ويمكن استعادته.' : 'جرّب كلمة أخرى أو أزل التصفية.' })]));
var rail = el('nav', { class: 'clh-rail', 'aria-label': 'الأقسام' }, H.secs.map(function (s) {
var n = (lists[s.id] || []).length;
return el('a', { href: '#clh-s-' + s.id, class: (H.sec === s.id ? 'is-on' : '') + (s.hidden ? ' is-hidden' : ''), onclick: function (e) { e.preventDefault(); var t = R.querySelector('#clh-s-' + s.id); if (t) t.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }, [el('span', { class: 'k', text: s.id }), el('span', { class: 't', text: s.name }), el('span', { class: 'n', text: String(n) })]);
}));
return [bar, el('div', { class: 'clh-lay' }, [rail, el('div', { class: 'clh-main' }, body)])];
}

/* ── المراجع: النصوص السابقة · الفهرس · السجل ── */
function codeChips(codes) { return (codes || []).map(function (k) { var c = rowOf(k); return el('button', { type: 'button', class: 'clh-cj', title: 'فتح البند', onclick: function () { if (c) { openEdit(c); } } }, [el('bdi', { dir: 'ltr', text: k }), c ? el('span', { text: c.title }) : null]); }); }
function legacyView(kind) {
if (!H.legacy) { loadRef(kind); return [el('div', { class: 'clh-load', text: 'جارٍ تحميل النصوص السابقة…' })]; }
var q = norm(H.sub[kind] || ''), byCode = /^[A-Z][A-Z0-9]{0,2}-[0-9]{2,3}$/.test(H.sub[kind] || '');
var rows = H.legacy.filter(function (l) { return l.kind === kind && (!q || (byCode ? (l.codes || []).indexOf(H.sub[kind]) >= 0 : norm(l.text + ' ' + l.grp_name + ' ' + (l.codes || []).join(' ') + ' ' + l.why).indexOf(q) >= 0)); });
var g = {}, order = []; rows.forEach(function (l) { if (!g[l.grp]) { g[l.grp] = { n: l.grp_name, note: l.grp_note, rows: [] }; order.push(l.grp); } g[l.grp].rows.push(l); });
var all = H.legacy.filter(function (l) { return l.kind === kind; }), secs = {}; all.forEach(function (l) { secs[l.grp] = 1; });
var stat = {}; all.forEach(function (l) { stat[l.st] = (stat[l.st] || 0) + 1; });
return [
el('div', { class: 'clh-intro' }, [el('b', { text: kind === 'prev' ? 'المكتبة السابقة في «قوالب المستندات»: ' + Object.keys(secs).length + ' قسمًا و' + all.length + ' نصًا (' + (Object.keys(secs).length + all.length) + ')' : 'نصوص القوالب السابقة: ' + all.length + ' نصًا من ' + Object.keys(secs).length + ' مصدرًا' }),
el('span', { text: 'محفوظة للمرجع ولا تُعدَّل. كل نص مربوط بالبند المقابل له في المكتبة — اضغط الرمز لفتح البند.' }),
el('div', { class: 'clh-stat' }, Object.keys(LST).filter(function (k) { return stat[k]; }).map(function (k) { return el('span', { class: 'clh-pill is-l' + k }, [LST[k] + ' ', el('b', { text: String(stat[k]) })]); }))]),
el('div', { class: 'clh-tools' }, [el('label', { class: 'clh-search' }, [icon('search'), el('input', { type: 'search', placeholder: 'ابحث في النصوص أو اكتب رمز بند (مثل K-01)', value: H.sub[kind] || '', oninput: function (e) { H.sub[kind] = e.target.value; H.qf = 1; draw(); } })]),
H.sub[kind] ? btn('عرض الكل', { cls: 'is-ghost', on: function () { H.sub[kind] = ''; draw(); } }) : null]),
el('div', { class: 'clh-main is-wide' }, order.length ? order.map(function (k) { var G = g[k]; return el('section', { class: 'clh-sec' }, [
el('header', { class: 'clh-sech' }, [el('div', { class: 'clh-secn' }, [el('h3', { text: G.n }), G.note ? el('small', { text: G.note }) : null]), el('span', { class: 'clh-cnt', text: G.rows.length + ' نص' })]),
el('div', { class: 'clh-list' }, G.rows.map(function (l) { return el('article', { class: 'clh-lrow' }, [el('p', { class: 'clh-ltx s-' + l.st, text: l.text }),
el('div', { class: 'clh-meta' }, [el('span', { class: 'clh-pill is-l' + l.st, text: LST[l.st] || l.st })].concat(codeChips(l.codes))), l.why ? el('small', { class: 'clh-why', text: l.why }) : null]); }))]); })
: [el('div', { class: 'clh-empty is-big' }, [icon('search'), el('b', { text: 'لا نتائج' })])])
];
}
function indexView() {
if (!H.index) { loadRef('idx'); return [el('div', { class: 'clh-load', text: 'جارٍ تحميل الفهرس…' })]; }
var q = norm(H.sub.idx || ''), rows = H.index.filter(function (r) { return !q || norm([r.title, r.body, r.grp_name].concat(r.meta || []).join(' ')).indexOf(q) >= 0; });
var cats = {}; H.index.forEach(function (r) { cats[r.cat] = (cats[r.cat] || 0) + 1; });
var out = [el('div', { class: 'clh-intro' }, [el('b', { text: 'الفهرس الشامل: ' + H.index.length + ' عنصرًا — للمرجع' }), el('span', { text: 'نصوص المستندات والرسائل وقوالب الرسائل وعقود الموظفين. نصوص الرسائل نفسها تُدار من أماكنها في المنصة.' }),
el('div', { class: 'clh-stat' }, ['D', 'M', 'T', 'E'].filter(function (k) { return cats[k]; }).map(function (k) { return el('a', { href: '#clh-i-' + k, class: 'clh-pill', onclick: function (e) { e.preventDefault(); var t = R.querySelector('#clh-i-' + k); if (t) t.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }, [ICAT[k] + ' ', el('b', { text: String(cats[k]) })]); }))]),
el('div', { class: 'clh-tools' }, [el('label', { class: 'clh-search' }, [icon('search'), el('input', { type: 'search', placeholder: 'ابحث في الفهرس: عنوان، نص، رمز، قناة', value: H.sub.idx || '', oninput: function (e) { H.sub.idx = e.target.value; H.qf = 1; draw(); } })])])];
var main = el('div', { class: 'clh-main is-wide' });
['D', 'M', 'T', 'E'].forEach(function (cat) {
var rs = rows.filter(function (r) { return r.cat === cat; }); if (!rs.length) return;
main.appendChild(el('h2', { class: 'clh-cat', id: 'clh-i-' + cat }, [ICAT[cat], el('small', { text: rs.length + ' عنصر' })]));
var g = {}, order = []; rs.forEach(function (r) { if (!g[r.grp]) { g[r.grp] = { n: r.grp_name, note: r.grp_note, rows: [] }; order.push(r.grp); } g[r.grp].rows.push(r); });
order.forEach(function (k) { var G = g[k]; main.appendChild(el('details', { class: 'clh-sec clh-det', open: !!q || cat === 'D' }, [
el('summary', { class: 'clh-sech' }, [el('div', { class: 'clh-secn' }, [el('h3', { text: G.n }), G.note ? el('small', { text: G.note }) : null]), el('span', { class: 'clh-cnt', text: G.rows.length })]),
el('div', { class: 'clh-list' }, G.rows.map(function (r) { return el('article', { class: 'clh-irow' }, [r.title ? el('b', { text: r.title }) : null, r.body ? el('p', { text: r.body }) : null,
(r.meta || []).length ? el('div', { class: 'clh-uses' }, r.meta.map(function (m) { return el('span', { text: m }); })) : null]); }))])); });
});
if (!rows.length) main.appendChild(el('div', { class: 'clh-empty is-big' }, [icon('search'), el('b', { text: 'لا نتائج' })]));
out.push(main); return out;
}
function logView() {
if (!H.log) { loadRef('log'); return [el('div', { class: 'clh-load', text: 'جارٍ تحميل السجل…' })]; }
if (!H.log.length) return [el('div', { class: 'clh-empty is-big' }, [icon('clock'), el('b', { text: 'لا تعديلات بعد' }), el('span', { text: 'كل إضافة أو تعديل أو إخفاء أو حذف يظهر هنا باسم من قام به ووقته.' })])];
return [el('div', { class: 'clh-main is-wide' }, [el('div', { class: 'clh-log' }, H.log.map(function (g) {
var c = g.clause_id ? rowOf(g.clause_id) : null, s = g.sec_id ? secOf(g.sec_id) : null;
return el('div', { class: 'clh-logr' }, [el('span', { class: 'clh-logi' }, [icon(g.action === 'delete' ? 'trash' : g.action === 'hide' ? 'eyeoff' : g.action === 'add' || g.action === 'sec_add' ? 'plus' : g.action === 'restore' ? 'undo' : 'edit')]),
el('div', {}, [el('b', { text: (g.actor_name || 'موظف') + ' ' + (ACT[g.action] || g.action) + ' ' }),
c ? el('button', { type: 'button', class: 'clh-lnk', onclick: function () { openEdit(c); } }, [g.clause_id + ' · ' + c.title]) : el('span', { text: s ? '«' + s.name + '»' : (g.clause_id || '') }),
el('small', { text: at(g.at) })])]);
}))])];
}

/* ── الرسم ── */
function draw() {
if (!R) return;
var ae = document.activeElement, keepQ = ae && ae.type === 'search' && R.contains(ae) ? { v: ae.value, s: ae.selectionStart } : null;
var kids = [];
var tabs = [['lib', 'البنود', count('live')], ['prev', 'المكتبة السابقة', H.legacy ? (function () { var p = H.legacy.filter(function (l) { return l.kind === 'prev'; }), g = {}; p.forEach(function (l) { g[l.grp] = 1; }); return p.length + Object.keys(g).length; })() : 127], ['tpl', 'نصوص القوالب السابقة', H.legacy ? H.legacy.filter(function (l) { return l.kind === 'tpl'; }).length : 162], ['idx', 'الفهرس الشامل', H.index ? H.index.length : 398], ['log', 'السجل', null]];
kids.push(el('header', { class: 'clh-top' }, [
el('div', { class: 'clh-tt' }, [el('span', { class: 'clh-logo' }, [icon('book')]), el('div', {}, [el('h2', { text: 'مكتبة البنود' }), el('p', { text: 'المصدر الواحد لبنود المستندات — منها تُختار البنود في كل القوالب.' })])]),
H.can && H.view === 'lib' && H.loaded ? el('div', { class: 'clh-topa' }, [btn('قسم جديد', { cls: 'is-ghost', ic: 'folder', on: function () { H.secEdit = { d: { id: null, name: '', note: '', uses: [] } }; draw(); } }), btn('بند جديد', { cls: 'is-pri', ic: 'plus', on: function () { openEdit(null); } })]) : null
]));
kids.push(el('div', { class: 'clh-tabs', role: 'tablist' }, tabs.map(function (t) {
return el('button', { type: 'button', role: 'tab', class: H.view === t[0] ? 'is-on' : '', 'aria-selected': H.view === t[0] ? 'true' : 'false', onclick: function () { H.view = t[0]; if (t[0] === 'log') H.log = null; draw(); } }, [t[1], t[2] != null ? el('b', { text: String(t[2]) }) : null]);
})));
if (!H.can && H.loaded) kids.push(el('p', { class: 'clh-note' }, [icon('eye'), ' للاطلاع — الإضافة والتعديل والإخفاء والحذف للمشرف العام أو صاحب صلاحية قوالب المستندات.']));
if (!H.ready) kids.push(el('div', { class: 'clh-empty is-big' }, [icon('alert'), el('b', { text: 'مكتبة البنود لم تُفعَّل بعد' }), el('span', { text: 'تُفعَّل بعد تطبيق الهجرة stf_272. القوائم الحالية تعمل كما هي حتى ذلك.' })]));
else if (H.err) kids.push(el('div', { class: 'clh-empty is-big' }, [icon('alert'), el('b', { text: H.err }), btn('إعادة المحاولة', { cls: 'is-soft', on: function () { H.err = ''; load(true); } })]));
else if (!H.loaded) kids.push(el('div', { class: 'clh-load', text: 'جارٍ تحميل مكتبة البنود…' }));
else kids = kids.concat(H.view === 'lib' ? libView() : H.view === 'idx' ? indexView() : H.view === 'log' ? logView() : legacyView(H.view));
if (H.edit) kids.push(editor());
if (H.secEdit) kids.push(secEditor());
if (H.ask) kids.push(askBox());
if (H.flash) kids.push(el('div', { class: 'clh-toast' + (H.flash[0] ? '' : ' is-bad'), role: 'status' }, [icon(H.flash[0] ? 'check' : 'alert'), H.flash[1]]));
var sheetScroll = R.querySelector('.clh-sb'), ss = sheetScroll ? sheetScroll.scrollTop : 0;
R.replaceChildren.apply(R, kids);
var sb = R.querySelector('.clh-sb'); if (sb && ss) sb.scrollTop = ss;
if (keepQ && H.qf) { var ni = R.querySelector('input[type=search]'); if (ni) { ni.focus(); try { ni.setSelectionRange(keepQ.s, keepQ.s); } catch (e) { void e; } } }
H.qf = 0;
if (H.focus) { var f = R.querySelector('.clh-row[data-id="' + H.focus + '"]'); if (f) { f.scrollIntoView({ block: 'center' }); var id = H.focus; setTimeout(function () { if (H.focus === id) { H.focus = null; var x = R && R.querySelector('.clh-row.is-focus'); if (x) x.classList.remove('is-focus'); } }, 1800); } }
}
document.addEventListener('keydown', function (e) {
if (e.key !== 'Escape' || !R || !R.isConnected) return;
if (H.ask) { H.ask = null; draw(); } else if (H.secEdit) { H.secEdit = null; draw(); } else if (H.edit) closeEdit();
});
window.addEventListener('beforeunload', function (e) { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });

function mount() {
if (!R) R = el('div', { class: 'clh', dir: 'rtl' });
draw(); load(false); return R;
}
/* مكتبة «اختر للاستبدال أو + للإضافة» في محرّر قوالب المستندات (cfg.itemLib) — من هذه المكتبة بدل النصوص المجمّعة من القوالب.
* البنود المناسبة لهذا المستند أولًا (حسب «يُستخدم في»)، ثم بقية الأقسام؛ ولكل بند صيغه كلها. null قبل التحميل فيبقى القديم. */
var DOCUSE = { pq: 'o', sq: 'o', cq: 'o', quote: 'o', si: 'f', purchase: 'f', es: 'f', rc: 'f', pc: 'i', contract: 'i', df: 'm' };
function itemLib(doc, s, it, f) {
if (!H.loaded || !H.rows.length) return null;
var u = DOCUSE[doc] || '', hidSec = {}; H.secs.forEach(function (x) { if (x.hidden) hidSec[x.id] = 1; });
var so = {}; H.secs.forEach(function (x, i) { so[x.id] = i; });
var live = H.rows.filter(function (c) { return c.state === 'active' && !hidSec[c.sec]; }).sort(function (a, b) { return (so[a.sec] - so[b.sec]) || (a.ord - b.ord); });
var mk = function (c) {
var v = vars(c), p = c.pick || 0, ord = [p].concat(v.map(function (_, i) { return i; }).filter(function (i) { return i !== p; }));
return ord.filter(function (i) { return v[i] && v[i].t; }).map(function (i) {
var x = v[i], tag = c.id + (v.length > 1 ? ' · ' + (x.l || VL[Math.min(i, 3)]) : '');
if (s && s.pairs) return f === 'v' ? { label: x.t, sub: c.title + ' · ' + tag, val: x.t, pl: c.title, pv: x.t } : { label: c.title, sub: (x.t.length > 90 ? x.t.slice(0, 89) + '…' : x.t) + ' — ' + tag, val: c.title, pl: c.title, pv: x.t };
return { label: x.t, sub: tag + ' · ' + c.title, val: x.t };
});
};
var G = [], own = u ? live.filter(function (c) { return (c.uses || []).indexOf(u) >= 0; }) : [];
if (own.length) G.push({ t: 'مقترحة لهذا المستند', items: [].concat.apply([], own.map(mk)) });
H.secs.forEach(function (x) { if (hidSec[x.id]) return; var L = live.filter(function (c) { return c.sec === x.id && own.indexOf(c) < 0; }).sort(function (a, b) { return a.ord - b.ord; }); if (L.length) G.push({ t: x.id + ' · ' + x.name, items: [].concat.apply([], L.map(mk)) }); });
return { title: 'من مكتبة البنود — اختر للاستبدال، أو «+» للإضافة تحته', key: s && s.pairs ? 'lib.p' : 'lib.l', groups: G };
}
window.CLHUB = { mount: mount, reload: function () { return load(true); }, items: null, itemLib: itemLib };
/* تحميل صامت عند فتح المنصة: يجعل المكتبة مصدر قوائم «إضافة بند» في المحررات من البداية */
function boot() { if (window.__teraApp && typeof window.__teraApp.token === 'function') { load(false); return true; } return false; }
if (!boot()) { (window.__crqQ = window.__crqQ || []).push(boot); }
})();
