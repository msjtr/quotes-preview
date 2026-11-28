/* v1179: تصميم صفحة «طلبات التحقق من الأهلية» (cu-elig) نفسها — يستبدل عرض platform.js عند تحميله، ولا صفحة ثانية (بدأ v1152 صفحةً مستقلة cu-elig2 ثم دُمج بقرار المشرف):
 * رأس واحد للحقائق ومسار الرحلة · تسعة تبويبات لكلٍّ مهمة واحدة · وكل شاشة ثانية داخل التبويب تبويب فرعي.
 * المنصة تعطي المكان والجلسة ونداء الدوال (window.__teraApp)، والقاعدة تفرض كل قاعدة.
 * التبويبات: الطلب · المطلوب من العميل · قرار الأهلية · عرض السعر · الفاتورة · العقد · الروابط والموافقات · الإدارة والتنفيذ · المراسلات والسجل.
 * المبنيّ هنا بالكامل: الطلب · المطلوب من العميل (الإنشاء والإرسال برابط مباشر والسحب بسبب والمسودة والسجل وأسباب السحب) · الروابط والموافقات (مسار الرحلة)
 * · المراسلات والسجل. مراحل المستندات (القرار · العرض · الفاتورة · العقد · الإدارة) تعرض حالتها هنا وتُدار من الصفحة الحالية حتى نقلها. */
(function () {
'use strict';
if (!/^\/staff\/next(\/|$)/.test(location.pathname)) return;
var KEY = 'cu-elig', TITLE = 'طلبات التحقق من الأهلية'; /* v1179: تصميم الصفحة نفسها — لا صفحة جديدة */
function A() { return window.__teraApp || {}; }

/* ── أدوات ── */
function el(tag, at, kids) {
  var n = document.createElement(tag);
  at = at || {};
  Object.keys(at).forEach(function (k) {
    var v = at[k]; if (v === null || v === undefined || v === false) return;
    if (k === 'text') n.textContent = v; else if (k === 'class') n.className = v; else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value') n.value = v; else if (k === 'checked') n.checked = !!v; else n.setAttribute(k, v === true ? '' : v);
  });
  if (tag === 'button') { if (!at.type) n.type = 'button'; n.setAttribute('data-live-ok', ''); }
  [].concat(kids || []).forEach(function (c) { if (c === null || c === undefined || c === false) return; n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
  return n;
}
function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem('eln:' + k) || ''; if (v) sessionStorage.setItem('eln:' + k, v); else sessionStorage.removeItem('eln:' + k); } catch (e) { void e; } return ''; }
function num(t) { var m = String(t == null ? '' : t).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }).replace(/[٬,]/g, '').match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : null; }
function money(n) { n = Number(n); return isFinite(n) ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'; }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function when(s) { if (!s) return '—'; var d = new Date(s); if (isNaN(d)) return '—'; var h = d.getHours(), ap = h < 12 ? 'ص' : 'م'; h = h % 12 || 12; return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' · ' + h + ':' + pad(d.getMinutes()) + ' ' + ap; }
function ltr(t) { return el('bdi', { dir: 'ltr' }, [String(t == null ? '' : t)]); }
function fv(x, re) { var f = (x && Array.isArray(x.fields) ? x.fields : []).filter(function (y) { return y && re.test(String(y[0] || '')); })[0]; return f ? String(f[1] == null ? '' : f[1]) : ''; }
function nameOf(x) { var n = ''; try { n = A().who ? A().who(x.user_id) : ''; } catch (e) { n = ''; } if (!n || n === '—' || n === 'عميل') n = fv(x, /^(الاسم الكامل|الاسم)$/); return n || '—'; }
function fx(x) { return (x && x.meta && x.meta.fix) || null; }
function fixOpen(x) { var f = fx(x); return !!(f && f.open); }
function fixDraft(x) { var f = fx(x); return !!(f && !f.open && f.draft); }
function isOpen(x) { return x && ['submitted', 'in_review', 'approved', 'rejected'].indexOf(x.status) >= 0 && !x.executed_at; }
var ST_L = { submitted: ['جديد — لم يُستلم', 'info'], in_review: ['قيد المراجعة', 'info'], approved: ['معتمد', 'ok'], rejected: ['غير مؤهَّل', 'bad'], cancelled: ['ملغى', 'off'] };
function stOf(x) { if (fixOpen(x)) return ['بانتظار العميل — استكمال', 'warn']; if (fixDraft(x)) return ['مسودة استكمال بعد السحب', 'warn']; if (x.executed_at) return ['اكتمل', 'ok']; return ST_L[x.status] || [x.status, 'info']; }
function pill(t, tone) { return el('span', { class: 'eln-pill is-' + (tone || 'info') }, [t]); }
var KEY_L = { req_done: 'تم تنفيذ طلبك (8.06)', elig_new: 'وصلنا طلبك', elig_received: 'بدأنا مراجعة طلبك', elig_fix: 'طلبك يحتاج استكمالًا (برابط مباشر)', elig_back: 'وصلنا استكمالك', elig_ok: 'نتيجة الأهلية: مؤهَّل', elig_less: 'نتيجة الأهلية: مؤهَّل بمبلغ أقل', elig_no: 'نتيجة الأهلية: غير مؤهَّل حاليًا',
  elig_accepted: 'وافقت على الأهلية', elig_declined: 'اعتذرت عن الأهلية', elig_quote: 'صدر عرض السعر', elig_purchase: 'صدرت فاتورة المنتج', elig_reclaim: 'أعدنا طلبك للمراجعة' };
var WA_L = { queued: 'في الطابور', sending: 'يُرسل', sent: 'أُرسل', delivered: 'وصل', read: 'قُرئ', failed: 'فشل', cancelled: 'أُلغي' };

/* ── الحالة ── */
var ST = { rows: null, loading: false, id: ss('id'), tab: ss('tab') || 'req', sub: {}, f: 'open', q: '', tests: ss('tests') === '1', busy: '', note: null, modal: null, ed: {}, D: {} };
var R = el('div', { class: 'eln', dir: 'rtl' });
function D(id) { return ST.D[id] || (ST.D[id] = {}); }
function lazy(id, k, fn) {
  var d = D(id); if (d[k]) return d[k]; /* الخطأ يبقى حتى «تحديث» أو إجراء — لا إعادة طلب في كل رسم */
  d[k] = { st: 'load', v: null };
  Promise.resolve().then(fn).then(function (v) { d[k] = { st: v && v.ok === false ? 'err' : 'ok', v: v, err: v && v.ok === false ? (v.message || v.error || '') : '' }; draw(); })
    .catch(function (e) { d[k] = { st: 'err', v: null, err: (e && e.message) || 'تعذّر التحميل.' }; draw(); });
  return d[k];
}
function wait(t) { return el('div', { class: 'eln-wait' }, [t || 'جارٍ التحميل…']); }
async function reload(id) { if (id) ST.D[id] = {}; ST.rows = (await A().srs(true)).filter(function (x) { return x && x.kind === 'elig'; }); draw(); }
function rowsAll() { return (ST.rows || []).filter(function (x) { return x && x.kind === 'elig' && !(x.status === 'cancelled' && x.internal) && (ST.tests || !/^SR-TEST/i.test(String(x.req_no || ''))); }); }
function cur() { return (ST.rows || []).filter(function (x) { return x && x.id === ST.id; })[0] || null; }

/* ── شاشة التأكيد بعد كل إجراء + نافذة التأكيد قبل الإجراءات المهمة (داخل الصفحة لا نافذة المتصفح) ── */
function note(title, lines, tone) { ST.note = { t: title, l: [].concat(lines || []), tone: tone || 'ok' }; draw(); }
function ask(o) { ST.modal = o; draw(); }
async function act(key, fn, okTitle, okLines) {
  if (ST.busy) return; ST.busy = key; ST.modal = null; draw();
  try { var r = await fn(); if (r && r.ok === false) throw new Error(r.message || r.error || 'تعذّر تنفيذ الإجراء.'); ST.busy = ''; await reload(ST.id); note(okTitle, typeof okLines === 'function' ? okLines(r) : okLines, 'ok'); return r; }
  catch (e) { ST.busy = ''; draw(); if (e && e.message === 'auth') return null; note('لم يُنفَّذ الإجراء', [(e && e.message) || 'تعذّر تنفيذ الإجراء.'], 'bad'); return null; }
}
function layers() {
  var out = [];
  if (ST.modal) {
    var M = ST.modal;
    out.push(el('div', { class: 'eln-ov', role: 'dialog', 'aria-modal': 'true', 'aria-label': M.title }, [el('div', { class: 'eln-dlg' + (M.wide ? ' is-wide' : '') }, [
      el('h2', { text: M.title }), M.text ? el('p', { class: 'eln-mute', text: M.text }) : null, M.body ? M.body() : null,
      M.err ? el('p', { class: 'eln-err', role: 'alert', text: M.err }) : null,
      el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn is-' + (M.tone || 'pri'), disabled: !!ST.busy, onclick: function () { M.go(); } }, [ST.busy ? 'جارٍ التنفيذ…' : M.ok || 'تأكيد']),
        el('button', { class: 'eln-btn', onclick: function () { ST.modal = null; draw(); } }, ['تراجع'])])])]));
  }
  if (ST.note) {
    var N = ST.note;
    out.push(el('div', { class: 'eln-ov', role: 'alertdialog', 'aria-modal': 'true', 'aria-label': N.t, onclick: function (ev) { if (ev.target === ev.currentTarget) { ST.note = null; draw(); } } }, [el('div', { class: 'eln-dlg eln-note is-' + N.tone }, [
      el('span', { class: 'eln-note-i', 'aria-hidden': 'true', text: N.tone === 'ok' ? '✓' : '!' }), el('h2', { text: N.t }),
      el('div', {}, N.l.map(function (t) { return el('p', { text: t }); })), el('button', { class: 'eln-btn is-pri is-wide', onclick: function () { ST.note = null; draw(); } }, ['حسنًا'])])]));
  }
  return out;
}

/* ══════════ القائمة ══════════ */
var FILTERS = [['open', 'المفتوحة', function (x) { return isOpen(x); }], ['cl', 'بانتظار العميل', fixOpen], ['draft', 'مسودات استكمال', fixDraft], ['all', 'الكل', function () { return true; }]];
function listView() {
  if (!ST.rows) return [wait()];
  var all = rowsAll(), F = FILTERS.filter(function (f) { return f[0] === ST.f; })[0] || FILTERS[0];
  var q = ST.q.trim(), rows = all.filter(F[2]).filter(function (x) { return !q || (nameOf(x) + ' ' + x.req_no).indexOf(q) >= 0; })
    .sort(function (a, b) { return String(b.updated_at || b.created_at).localeCompare(String(a.updated_at || a.created_at)); });
  var chips = el('div', { class: 'eln-chips', role: 'group', 'aria-label': 'تصفية' }, FILTERS.map(function (f) {
    return el('button', { class: 'eln-chip' + (f[0] === F[0] ? ' is-on' : ''), 'aria-pressed': f[0] === F[0] ? 'true' : 'false', onclick: function () { ST.f = f[0]; draw(); } }, [f[1], el('b', { text: String(all.filter(f[2]).length) })]);
  }));
  var tools = el('div', { class: 'eln-tools' }, [chips, el('label', { class: 'eln-ck' }, [el('input', { type: 'checkbox', checked: ST.tests, onchange: function (e) { ST.tests = e.target.checked; ss('tests', ST.tests ? '1' : ''); draw(); } }), ' طلبات الاختبار']),
    el('input', { class: 'eln-in eln-q', type: 'search', placeholder: 'بحث بالاسم أو رقم الطلب', 'aria-label': 'بحث', value: ST.q, oninput: function (e) { ST.q = e.target.value; clearTimeout(ST.qt); ST.qt = setTimeout(draw, 250); } })]);
  var body = rows.length ? el('div', { class: 'eln-tblw' }, [el('table', { class: 'eln-tbl' }, [el('thead', {}, [el('tr', {}, ['العميل', 'رقم الطلب', 'الحالة', 'المطلوب من العميل', 'آخر تحديث'].map(function (h) { return el('th', { scope: 'col', text: h }); }))]),
    el('tbody', {}, rows.map(function (x) { var s = stOf(x), f = fx(x);
      return el('tr', { tabindex: '0', onclick: function () { openReq(x.id); }, onkeydown: function (e) { if (e.key === 'Enter') openReq(x.id); } }, [
        el('td', {}, [el('b', { text: nameOf(x) })]), el('td', {}, [ltr(x.req_no)]), el('td', {}, [pill(s[0], s[1])]),
        el('td', { text: f && f.open ? (f.items || []).length + ' بند عند العميل' : f && f.draft ? 'مسودة بعد السحب' : f && f.reclaimed_at ? 'سُحب من العميل' : f && f.done_at ? 'أكمل العميل' : '—' }), el('td', { text: when(x.updated_at || x.created_at) })]); }))])])
    : el('div', { class: 'eln-empty' }, [el('b', { text: 'لا طلبات هنا' }), el('span', { class: 'eln-mute', text: 'غيّر التصفية أو البحث.' })]);
  return [el('div', { class: 'eln-lhead' }, [null]),
    el('section', { class: 'eln-card' }, [tools, body])];
}
var OLD2NEW = { req: ['req'], dec: ['dec'], qt: ['qt'], inv: ['inv'], ct: ['ct'], lnk: ['lnk', 'send'], tpl: ['lnk', 'tpl'], adm: ['adm'], log: ['log', 'chat'] };
function goTab(t, sub) { var m = OLD2NEW[t] || [t]; ST.tab = m[0]; ss('tab', m[0]); if (m[1] || sub) ST.sub[m[0]] = m[1] || sub; window.scrollTo(0, 0); draw(); }
A().eligOpen = function (id, tab) { if (!id) return; ST.id = id; ss('id', id); var m = OLD2NEW[tab || 'req'] || ['req']; ST.tab = m[0]; ss('tab', m[0]); if (m[1]) ST.sub[m[0]] = m[1]; };
function openReq(id) { ST.id = id; ss('id', id); ST.tab = 'req'; ss('tab', 'req'); window.scrollTo(0, 0); draw(); }

/* ══════════ صفحة الطلب ══════════ */
var TABS = [['req', 'الطلب'], ['ask', 'المطلوب من العميل'], ['dec', 'قرار الأهلية'], ['qt', 'عرض سعر المنتج'], ['inv', 'فاتورة المنتج'], ['ct', 'عقد بيع المنتج'], ['lnk', 'الروابط والموافقات'], ['adm', 'الإدارة والتنفيذ'], ['log', 'المراسلات والسجل']];
var SUBS = { req: [['data', 'بيانات الطلب'], ['docs', 'المستندات']], ask: [['now', 'الطلب الحالي'], ['hist', 'الطلبات السابقة'], ['why', 'أسباب السحب']],
  log: [['chat', 'المحادثة'], ['sends', 'الرسائل المرسلة'], ['notes', 'ملاحظات داخلية'], ['log', 'السجل']] }; /* v1226: «الروابط والموافقات» بلا تبويبات فرعية — لا تكرار مع «المراسلات والسجل» */
function reach(x, k) {
  var rp = (x.meta && x.meta.report) || {}, ok = x.status === 'approved' && (rp.rec === 'eligible' || rp.rec === 'eligible_less');
  if (k === 'qt') return ok; if (k === 'inv') return ok && !!(x.meta && (x.meta.purchase || x.meta.accept)); if (k === 'ct') return ok && !!(x.meta && x.meta.purchase && x.meta.purchase.decision === 'accept');
  if (k === 'adm') return ok && !!(x.meta && x.meta.purchase && x.meta.purchase.decision === 'accept'); return true;
}
function badge(x, k) { var f = fx(x); if (k === 'ask') return f && f.open ? 'عند العميل' : f && f.draft ? 'مسودة' : ''; if (k === 'dec') { var rp = x.meta && x.meta.report; return rp && rp.rec ? ({ eligible: 'مؤهَّل', eligible_less: 'مؤهَّل بمبلغ أقل', not_eligible: 'غير مؤهَّل' })[rp.rec] || '' : ''; } return ''; }
function head(x) {
  var I = A().eligInfo ? A().eligInfo(x.id, draw) : null; /* v1227: الحالة وعلامات المراحل من لوحة الأهلية */
  var s = I && I.lbl && !fixOpen(x) && !fixDraft(x) ? [I.lbl[0], ({ danger: 'bad', warn: 'warn', ok: 'ok', info: 'info' })[I.lbl[1]] || 'info'] : stOf(x), N = nums(x);
  var facts = [['المطلوب', money(num(fv(x, /^القيمة الإجمالية/))) + ' ريال'], ['مدة السداد', fv(x, /^مدة السداد/) || '—'], ['الصافي الشهري', N.inc ? money(N.net) + ' ريال' : '—'], ['المسند إليه', x.assigned_to ? (A().staff ? A().staff(x.assigned_to) : '') || 'موظف' : 'غير مسنَد'], ['رقم الطلب', ltr(x.req_no)]];
  var tabs = el('nav', { class: 'eln-tabs', 'aria-label': 'تبويبات الطلب' }, TABS.map(function (t, i) {
    var on = ST.tab === t[0], can = reach(x, t[0]), b = badge(x, t[0]), d = I && I.dots && I.dots[t[0]]; if (d && !b) b = (d[0] === 'ok' ? '✓ ' : '') + (d[1] || ''); /* v1227 */
    return el('button', { class: 'eln-tab' + (on ? ' is-on' : '') + (can ? '' : ' is-off'), 'aria-current': on ? 'page' : null, disabled: can ? null : true, title: can ? null : 'لم تصل هذه المرحلة بعد',
      onclick: function () { ST.tab = t[0]; ss('tab', t[0]); draw(); } }, [el('span', { class: 'eln-tab-n', text: String(i + 1) }), el('span', {}, [t[1]]), b ? el('small', { class: 'eln-tab-b' + (d && d[0] === 'ok' && !badge(x, t[0]) ? ' is-ok' : ''), text: b }) : null]);
  }));
  return el('section', { class: 'eln-card eln-head' }, [
    el('div', { class: 'eln-head-t' }, [el('div', { class: 'eln-av', 'aria-hidden': 'true', text: nameOf(x).charAt(0) }), el('div', { class: 'eln-head-n' }, [el('small', { class: 'eln-mute', text: 'أهلية شراء منتج · أُرسل ' + when(x.created_at) }), el('h1', { text: nameOf(x) })]),
      el('div', { class: 'eln-head-a' }, [pill(s[0], s[1])])]),
    el('dl', { class: 'eln-facts' }, facts.map(function (f) { return el('div', {}, [el('dt', { text: f[0] }), el('dd', {}, [f[1]])]); })),
    pathMini(x), tabs]);
}
function nums(x) {
  var g = function (re) { return num(fv(x, re)) || 0; };
  var inc = g(/^إجمالي الدخل الشهري المستلم/) || g(/^إجمالي الدخل الشهري/), exp = g(/^إجمالي المصاريف الشهرية/) || (g(/^قيمة الالتزامات/) + g(/^المصروفات الشهرية/));
  return { inc: inc, exp: exp, net: Math.round((inc - exp) * 100) / 100 };
}
function subTabs(k) {
  var L = SUBS[k]; if (!L) return null; var on = ST.sub[k] || L[0][0];
  return el('div', { class: 'eln-sub', role: 'tablist', 'aria-label': 'شاشات التبويب' }, L.map(function (s) {
    return el('button', { role: 'tab', class: 'eln-subt' + (s[0] === on ? ' is-on' : ''), 'aria-selected': s[0] === on ? 'true' : 'false', onclick: function () { ST.sub[k] = s[0]; draw(); } }, [s[1]]);
  }));
}
function subOf(k) { return ST.sub[k] || (SUBS[k] ? SUBS[k][0][0] : ''); }
function card(title, kids, extra) { return el('section', { class: 'eln-card' + (extra ? ' ' + extra : '') }, [title ? el('h2', { class: 'eln-h2', text: title }) : null].concat(kids)); }
function detail(x) {
  var t = ST.tab, body;
  try { body = t === 'req' ? tabReq(x) : t === 'ask' ? tabAsk(x) : t === 'lnk' ? tabLnk(x) : t === 'log' ? tabLog(x) : tabStage(x, t); }
  catch (e) { try { console.warn('[eln]', e); } catch (y) { void y; } body = [card('', [el('p', { class: 'eln-err', text: 'تعذّر عرض هذا التبويب — حدّث الصفحة.' })])]; }
  return [el('div', { class: 'eln-back' }, [el('button', { class: 'eln-btn', onclick: function () { ST.id = ''; ss('id', ''); draw(); } }, ['‹ كل الطلبات'])]), head(x), subTabs(t)].concat(body);
}

/* ── 1) الطلب ── */
var GROUPS = [['الطلب', /القيمة الإجمالية|المبلغ|مدة السداد|موعد الدفع|طريقة الاستلام|المنتج|الكمية/], ['الدخل والالتزامات', /الراتب|الدخل|التزام|المصروف|المصاريف|الصافي|البنك/], ['العمل', /وظيف|المسمى|^الجهة|القطاع|الإدارة|منطقة العمل|الالتحاق|التقاعد|الخدمة|المهنة/]];
function tabReq(x) {
  if (subOf('req') === 'docs') return tabDocs(x);
  var F = (x.fields || []).filter(function (y) { return y && y[0] && !/^(الاسم|الجوال|البريد الإلكتروني)$/.test(String(y[0])); }), used = {};
  var blocks = GROUPS.map(function (g) { var L = F.filter(function (y, i) { if (used[i] || !g[1].test(String(y[0]))) return false; used[i] = 1; return true; }); return [g[0], L]; });
  blocks.push(['أخرى', F.filter(function (y, i) { return !used[i]; })]);
  var N = nums(x);
  return [el('div', { class: 'eln-grid3' }, blocks.filter(function (b) { return b[1].length; }).map(function (b) {
    return card(b[0], [el('dl', { class: 'eln-dl' }, b[1].map(function (y) { return el('div', {}, [el('dt', { text: y[0] }), el('dd', { text: String(y[1] == null ? '' : y[1]) })]); }).concat(b[0] === 'الدخل والالتزامات' && N.inc ? [el('div', { class: 'is-hi' }, [el('dt', { text: 'الصافي الشهري' }), el('dd', { text: money(N.net) + ' ريال' })])] : []))]);
  }))];
}
function job(x) { return lazy(x.id, 'job', function () { return A().rpc('admin_client_job', { p_user: x.user_id }); }); }
var DST = { accepted: ['مقبول', 'ok'], pending: ['بانتظار المراجعة', 'warn'], rejected: ['مرفوض', 'bad'], replaced: ['مستبدل', 'off'] };
function tabDocs(x) {
  var J = job(x); if (J.st === 'load') return [card('المستندات', [wait()])];
  if (J.st === 'err') return [card('المستندات', [el('p', { class: 'eln-mute', text: /not_client/.test(J.err || '') ? 'هذا الحساب ليس حساب عميل — لا مرفقات وظيفة.' : 'تعذّر قراءة المستندات.' })])];
  var v = J.v || {}, rules = v.rules || [], docs = v.docs || [], open = isOpen(x);
  if (!rules.some(function (r) { return r.requirement === 'required'; }) && !docs.length) return [card('المستندات', [el('p', { class: 'eln-mute', text: 'لا مستندات وظيفة في ملف العميل' + (v.work_type ? '' : ' — لم تُحدَّد حالته الوظيفية') + '.' })])];
  /* v1193: تظهر المستندات المطلوبة في الطلب وما رفعه العميل فقط — «عند الطلب» يُطلب من «المطلوب من العميل» */
  var types = rules.filter(function (r) { return r.requirement === 'required'; }).map(function (r) { return r.doc_type; }); docs.forEach(function (d) { if (types.indexOf(d.doc_type) < 0) types.push(d.doc_type); });
  var R2 = ST.rej || (ST.rej = {});
  return [card('المستندات', [el('div', { class: 'eln-rows' }, types.map(function (t) {
    var r = rules.filter(function (y) { return y.doc_type === t; })[0] || {}, d = docs.filter(function (y) { return y.doc_type === t; })[0], st = d ? (DST[d.status] || [d.status, 'info']) : ['لم يُرفع', 'bad'];
    var lbl = r.label || (d && d.label) || t, acts = [];
    if (d && d.path) acts.push(el('button', { class: 'eln-btn is-sm', onclick: function () { A().doc(Object.assign({ label: lbl }, d)); } }, ['عرض']));
    if (d && open && d.status !== 'accepted') acts.push(el('button', { class: 'eln-btn is-sm is-ok', disabled: !!ST.busy, onclick: function () { act('doc' + d.id, function () { return A().post('/admin/api/cjob/doc/' + encodeURIComponent(d.id) + '/decide', { verdict: 'accepted', reason: '' }); }, 'تم قبول المستند', ['«' + lbl + '» صار مقبولًا.']); } }, ['قبول']));
    if (d && open && d.status !== 'rejected') acts.push(el('button', { class: 'eln-btn is-sm is-bad', onclick: function () { R2[d.id] = R2[d.id] === undefined ? '' : undefined; draw(); } }, ['رفض بسبب']));
    var row = el('div', { class: 'eln-row' }, [el('span', { class: 'eln-dot is-' + st[1], 'aria-hidden': 'true' }), el('div', { class: 'eln-row-b' }, [el('b', { text: lbl }), el('small', { class: 'eln-mute', text: d ? (d.name || '') + (d.uploaded_at ? ' · رُفع ' + when(d.uploaded_at) : '') + (d.reject_reason ? ' · السبب: ' + d.reject_reason : '') : (r.requirement === 'required' ? 'مطلوب' : 'عند الطلب') })]), pill(st[0], st[1]), el('div', { class: 'eln-row-a' }, acts)]);
    if (!d || R2[d.id] === undefined) return row;
    var ta = el('input', { class: 'eln-in', type: 'text', maxlength: '300', placeholder: 'سبب الرفض — يصل العميل', value: R2[d.id], oninput: function (e) { R2[d.id] = e.target.value; } });
    return el('div', { class: 'eln-rowx' }, [row, el('div', { class: 'eln-inl' }, [ta, el('button', { class: 'eln-btn is-bad', disabled: !!ST.busy, onclick: function () { var why = String(R2[d.id] || '').trim(); if (why.length < 3) { note('تنبيه', ['اكتب سبب الرفض.'], 'bad'); return; } act('doc' + d.id, function () { return A().post('/admin/api/cjob/doc/' + encodeURIComponent(d.id) + '/decide', { verdict: 'rejected', reason: why }); }, 'تم رفض المستند', ['«' + lbl + '» مرفوض — وصل العميلَ السبب.']).then(function () { delete R2[d.id]; }); } }, ['تأكيد الرفض'])])]);
  }))])];
}

/* ── 2) المطلوب من العميل ── */
function replies() { return lazy('_', 'rep', function () { return A().rpc('admin_elig_replies', {}); }); }
function journey(x) { return lazy(x.id, 'jr', function () { return A().rpc('adm_elig_journey', { p_sr: x.id }); }); }
function itemDone(it, f, docs) {
  var at = f && f.at ? new Date(f.at).getTime() : 0;
  if (it.type === 'doc') return (docs || []).some(function (d) { return d.doc_type === it.doc_type && new Date(d.uploaded_at).getTime() > at; });
  if (it.type === 'field') return !!(it.changed_at && new Date(it.changed_at).getTime() > at); return true;
}
var TY = { doc: 'مرفق', field: 'تصحيح حقل', note: 'ملاحظة' };
function itemsList(items, f, docs, withState) {
  return el('ol', { class: 'eln-items' }, (items || []).map(function (it, i) {
    var dn = withState ? itemDone(it, f, docs) : null;
    return el('li', { class: dn ? 'is-done' : '' }, [el('span', { class: 'eln-items-n', text: dn ? '✓' : String(i + 1) }), el('div', {}, [el('b', { text: it.label }), el('small', { class: 'eln-mute', text: TY[it.type] + (it.type === 'doc' && it.max_mb ? ' · حتى ' + it.max_mb + ' م.ب' : '') + (it.note ? ' · ' + it.note : '') + (it.changed_at ? ' · ' + (it.confirmed ? 'أكّده العميل: ' + (it.val || '') : 'صحّحه العميل: ' + (it.prev || '—') + ' ← ' + (it.val || '')) : '') }), it.reply ? el('p', { class: 'eln-reply', text: 'ردّ العميل: ' + it.reply }) : null]),
      withState ? (it.type === 'note' ? pill('للعلم', 'off') : pill(dn ? 'تم' : 'لم يكتمل', dn ? 'ok' : 'warn')) : null]);
  }));
}
function linkInfo(x) {
  var J = journey(x); if (J.st !== 'ok' || !J.v) return null;
  var L = (J.v.links || []).filter(function (l) { return l.purpose === 'journey' && !l.preview; }).slice(-1)[0]; if (!L) return el('p', { class: 'eln-mute', text: 'لم يُرسل رابط مباشر لهذا الطلب بعد.' });
  var S = (J.v.sends || []).filter(function (s) { return s.key === 'elig_fix' && s.kind === 'send'; }).slice(-1)[0];
  return el('dl', { class: 'eln-facts is-sm' }, [['الرابط', L.decision === 'replaced' ? 'مُغلق' : new Date(L.expires_at) < new Date() ? 'منتهي' : 'صالح حتى ' + when(L.expires_at)], ['فتحه العميل', L.opened_at ? when(L.opened_at) + (L.factor ? ' · تحقق ب' + (L.factor === 'whatsapp' ? 'واتساب' : 'البريد') : '') : 'لم يفتحه بعد'],
    ['واتساب', S ? (WA_L[S.wa_status] || S.wa_status || '—') : '—'], ['البريد', S ? (WA_L[S.mail_status] || S.mail_status || '—') : '—']].map(function (f) { return el('div', {}, [el('dt', { text: f[0] }), el('dd', { text: f[1] })]); }));
}
function tabAsk(x) {
  var s = subOf('ask');
  if (s === 'hist') return askHist(x); if (s === 'why') return askWhy();
  var f = fx(x), J = job(x), docs = J.st === 'ok' && J.v ? J.v.docs : [];
  if (f && f.open) {
    journey(x);
    return [card('', [el('div', { class: 'eln-ttl' }, [el('div', {}, [el('h2', { class: 'eln-h2', text: 'طلب الاستكمال عند العميل' }), el('p', { class: 'eln-mute', text: 'أُرسل ' + when(f.at) + ' برابط مباشر — يكمله العميل من الرابط أو من حسابه.' })]), pill('بانتظار العميل', 'warn')]),
      itemsList(f.items, f, docs, true), f.note ? el('div', { class: 'eln-quote' }, [el('small', { text: 'رسالة الفريق' }), el('p', { text: f.note })]) : null, gotBlock(x, f, J), linkInfo(x),
      el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn is-pri', disabled: !!ST.busy, onclick: function () { ask({ title: 'إعادة إرسال رابط الاستكمال؟', text: 'يصل العميلَ الرابط نفسه برسالة «طلبك يحتاج استكمالًا» (واتساب والبريد والإشعار)، ويُغلق الرابط السابق.', ok: 'إعادة الإرسال', go: function () { act('ntf', function () { return A().rpc('admin_sr_notify', { p_id: x.id }); }, 'أُعيد إرسال الرابط', ['وصل العميلَ رابط الاستكمال من جديد على واتساب والبريد والإشعار.']); } }); } }, ['إعادة إرسال الرابط']),
        el('button', { class: 'eln-btn is-bad', disabled: !!ST.busy, onclick: function () { reclaimDlg(x); } }, ['سحب الطلب من العميل'])])])];
  }
  if (f && f.done_at && !f.open && !f.draft && !ST.ed[x.id]) {
    return [card('', [el('div', { class: 'eln-ttl' }, [el('div', {}, [el('h2', { class: 'eln-h2', text: 'أكمل العميل المطلوب وأعاد الطلب' }), el('p', { class: 'eln-mute', text: 'أعاده ' + when(f.done_at) + ' — انتهى رابط الاستكمال.' })]), pill('مكتمل', 'ok')]),
      itemsList(f.items, f, docs, true), f.client_note ? el('div', { class: 'eln-quote' }, [el('small', { text: 'ملاحظة العميل مع الإرسال' }), el('p', { text: f.client_note })]) : null, gotBlock(x, f, J), el('p', { class: 'eln-mute', text: 'القرار بعدها في «قرار الأهلية».' }),
      isOpen(x) ? el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn', onclick: function () { ST.ed[x.id] = { items: [], note: '' }; draw(); } }, ['طلب استكمال جديد'])]) : null])];
  }
  return editor(x, f);
}
function editor(x, f) {
  var draft = f && f.draft, E = ST.ed[x.id] || (ST.ed[x.id] = { items: draft ? JSON.parse(JSON.stringify(f.items || [])) : [], note: draft ? (f.note || '') : '' });
  if (!isOpen(x)) return [card('المطلوب من العميل', [el('p', { class: 'eln-mute', text: 'الطلب مغلق — لا استكمال.' })])];
  var J = job(x), rules = J.st === 'ok' && J.v ? (J.v.rules || []) : [];
  var N = E.n || (E.n = { type: J.st === 'ok' && !rules.length ? 'field' : 'doc', doc: '', field: '', label: '', note: '', mb: '10' });
  var fields = (x.fields || []).map(function (y) { return String(y[0] || ''); }).filter(function (l) { return l && !/^(الاسم|الجوال|البريد الإلكتروني|ملاحظة)$/.test(l); });
  var typeSel = el('select', { class: 'eln-in', 'aria-label': 'نوع البند', onchange: function (e) { N.type = e.target.value; draw(); } }, [['doc', 'مرفق'], ['field', 'تصحيح حقل'], ['note', 'ملاحظة']].map(function (o) { return el('option', { value: o[0], selected: N.type === o[0] ? true : null, text: o[1] }); }));
  var what;
  if (N.type === 'doc') what = rules.length ? el('select', { class: 'eln-in', 'aria-label': 'المرفق', onchange: function (e) { N.doc = e.target.value; } }, [el('option', { value: '', text: '— اختر المرفق —' })].concat(rules.map(function (r) { return el('option', { value: r.doc_type, selected: N.doc === r.doc_type ? true : null, text: r.label }); })))
    : el('p', { class: 'eln-mute', text: J.st === 'load' ? 'جارٍ تحميل المرفقات…' : 'لا مرفقات معرّفة لحالته الوظيفية في ملفه — اطلب «تصحيح حقل» أو «ملاحظة».' });
  else if (N.type === 'field') what = el('select', { class: 'eln-in', 'aria-label': 'الحقل', onchange: function (e) { N.field = e.target.value; } }, [el('option', { value: '', text: '— اختر الحقل —' })].concat(fields.map(function (l) { return el('option', { value: l, selected: N.field === l ? true : null, text: l }); })));
  else what = el('input', { class: 'eln-in', type: 'text', maxlength: '80', placeholder: 'عنوان الملاحظة', value: N.label, oninput: function (e) { N.label = e.target.value; } });
  var noteIn = el('input', { class: 'eln-in', type: 'text', maxlength: '400', placeholder: N.type === 'doc' ? 'ما المطلوب في المرفق (اختياري)' : 'المطلوب تصحيحه أو نص الملاحظة (إلزامي)', value: N.note, oninput: function (e) { N.note = e.target.value; } });
  var mb = N.type === 'doc' ? el('select', { class: 'eln-in is-s', 'aria-label': 'الحد', onchange: function (e) { N.mb = e.target.value; } }, ['5', '10', '20'].map(function (v) { return el('option', { value: v, selected: N.mb === v ? true : null, text: 'حتى ' + v + ' م.ب' }); })) : null;
  var add = el('button', { class: 'eln-btn', onclick: function () {
    var it;
    if (N.type === 'doc') { var r = rules.filter(function (y) { return y.doc_type === N.doc; })[0]; if (!r) { note('تنبيه', ['اختر المرفق.'], 'bad'); return; } it = { type: 'doc', label: r.label, doc_type: r.doc_type, note: N.note.trim(), max_mb: Number(N.mb) }; }
    else if (N.type === 'field') { if (!N.field) { note('تنبيه', ['اختر الحقل.'], 'bad'); return; } if (N.note.trim().length < 2) { note('تنبيه', ['اكتب المطلوب تصحيحه.'], 'bad'); return; } it = { type: 'field', label: N.field, note: N.note.trim() }; }
    else { if (N.label.trim().length < 2 || N.note.trim().length < 2) { note('تنبيه', ['اكتب عنوان الملاحظة ونصها.'], 'bad'); return; } it = { type: 'note', label: N.label.trim(), note: N.note.trim() }; }
    if (E.items.some(function (y) { return y.type === it.type && y.label === it.label; })) { note('تنبيه', ['هذا البند في القائمة.'], 'bad'); return; }
    E.items.push(it); E.n = null; draw(); } }, ['+ إضافة البند']);
  var R3 = replies(), asks = R3.st === 'ok' && R3.v ? (R3.v.rows || []).filter(function (r) { return r.cat === 'ask' && r.active; }) : [];
  var msg = el('textarea', { class: 'eln-in', rows: '3', maxlength: '600', placeholder: 'رسالة للعميل تصل مع الطلب (اختياري)', oninput: function (e) { E.note = e.target.value; } }); msg.value = E.note || '';
  var tops = draft ? el('div', { class: 'eln-banner is-warn' }, [el('b', { text: 'سُحب من العميل ' + when(f.reclaimed_at) + ' وعاد إليك مسودة' }), el('span', { text: 'السبب: ' + (f.reclaim_note || '—') + (f.notified ? ' · أُبلغ العميل' : ' · بلا إبلاغ') + '. عدّل البنود أو احذفها ثم أرسلها، أو احذف المسودة.' })]) : null;
  return [card('', [el('div', { class: 'eln-ttl' }, [el('h2', { class: 'eln-h2', text: draft ? 'طلب استكمال — مسودة' : 'طلب استكمال جديد' }), draft ? pill('مسودة', 'warn') : null]), tops,
    E.items.length ? el('ol', { class: 'eln-items' }, E.items.map(function (it, i) { return el('li', {}, [el('span', { class: 'eln-items-n', text: String(i + 1) }), el('div', {}, [el('b', { text: it.label }), el('small', { class: 'eln-mute', text: TY[it.type] + (it.max_mb ? ' · حتى ' + it.max_mb + ' م.ب' : '') + (it.note ? ' · ' + it.note : '') })]),
      el('button', { class: 'eln-btn is-sm is-bad', 'aria-label': 'حذف البند ' + it.label, onclick: function () { E.items.splice(i, 1); draw(); } }, ['حذف'])]); })) : el('p', { class: 'eln-mute', text: 'لا بنود بعد — أضف ما تطلبه من العميل.' }),
    el('div', { class: 'eln-add' }, [el('b', { text: 'إضافة بند' }), el('div', { class: 'eln-add-g' }, [typeSel, what, mb, noteIn, add])]),
    el('label', { class: 'eln-fld' }, [el('span', {}, ['رسالة للعميل', asks.length ? el('select', { class: 'eln-in is-s', 'aria-label': 'رد جاهز', onchange: function (e) { var r = asks.filter(function (y) { return y.k === e.target.value; })[0]; if (r) { E.note = r.body; draw(); } } }, [el('option', { value: '', text: 'رد جاهز…' })].concat(asks.map(function (r) { return el('option', { value: r.k, text: r.title }); }))) : null]), msg]),
    el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn is-pri', disabled: !E.items.length || !!ST.busy, onclick: function () {
        ask({ title: 'إرسال طلب الاستكمال للعميل؟', text: 'يصله برابط مباشر برمز تحقق على واتساب والبريد والإشعار، ويستطيع الإكمال من الرابط أو من حسابه. ينتهي الرابط بعد إعادته الطلب.', ok: 'إرسال', go: function () {
          act('ret', function () { return A().rpc('admin_elig_return', { p_sr: x.id, p_items: E.items, p_note: String(E.note || '').trim() }); }, 'أُرسل طلب الاستكمال', ['وصل العميلَ ' + E.items.length + ' بند برابط مباشر.', 'تتابع حالته من «الطلب الحالي» ومسار الرحلة في «الروابط والموافقات».']).then(function (r) { if (r) ST.ed[x.id] = null; }); } }); } }, ['إرسال للعميل برابط مباشر']),
      draft ? el('button', { class: 'eln-btn is-bad', disabled: !!ST.busy, onclick: function () { ask({ title: 'حذف المسودة؟', text: 'تُحذف البنود من الطلب الحالي وتبقى في «الطلبات السابقة».', ok: 'حذف المسودة', tone: 'bad', go: function () { act('dis', function () { return A().rpc('admin_elig_fix_discard', { p_sr: x.id }); }, 'حُذفت المسودة', ['البنود محفوظة في «الطلبات السابقة».']).then(function (r) { if (r) ST.ed[x.id] = null; }); } }); } }, ['حذف المسودة'])
        : ST.ed[x.id] && (f && f.done_at) ? el('button', { class: 'eln-btn', onclick: function () { ST.ed[x.id] = null; draw(); } }, ['إلغاء']) : null])])];
}
function reclaimDlg(x) {
  /* v1172: الأسباب تُقرأ عند كل رسم — كانت تُقرأ مرة عند فتح النافذة، فإن لم تكن حُمّلت بعد ظهرت «أخرى…» وحدها */
  var W = { k: '', other: '', notify: true }, rs = [];
  var M = { title: 'سحب الطلب من العميل', wide: true, ok: 'تأكيد السحب', tone: 'bad', body: function () {
    var R3 = replies(); rs = R3.st === 'ok' && R3.v ? (R3.v.rows || []).filter(function (r) { return r.cat === 'reclaim' && r.active; }) : [];
    if (!W.k && rs[0]) W.k = rs[0].k; if (!W.k && R3.st && R3.st !== 'load') W.k = '__o';
    if (R3.st === 'load' || !R3.st) return el('p', { class: 'eln-mute', text: 'جارٍ تحميل أسباب السحب…' });
    var sel = el('select', { class: 'eln-in', 'aria-label': 'سبب السحب', onchange: function (e) { W.k = e.target.value; draw(); } }, rs.map(function (r) { return el('option', { value: r.k, selected: W.k === r.k ? true : null, text: r.title }); }).concat([el('option', { value: '__o', selected: W.k === '__o' ? true : null, text: 'أخرى…' })]));
    var r = rs.filter(function (y) { return y.k === W.k; })[0];
    var oth = el('textarea', { class: 'eln-in', rows: '2', maxlength: '300', placeholder: 'اكتب السبب', oninput: function (e) { W.other = e.target.value; } }); oth.value = W.other;
    var opt = function (v, t, d) { return el('label', { class: 'eln-opt' + (W.notify === v ? ' is-on' : '') }, [el('input', { type: 'radio', name: 'eln-ntf', checked: W.notify === v, onchange: function () { W.notify = v; draw(); } }), el('div', {}, [el('b', { text: t }), el('small', { class: 'eln-mute', text: d })])]); };
    return el('div', { class: 'eln-dlg-b' }, [el('label', { class: 'eln-fld' }, [el('span', { text: 'سبب السحب' }), sel]), W.k === '__o' ? oth : r ? el('div', { class: 'eln-quote' }, [el('small', { text: 'يصل العميل' }), el('p', { text: 'سبب الإلغاء: ' + r.body })]) : null,
      opt(true, 'إبلاغ العميل', 'يصله «أعدنا طلبك للمراجعة» مع السبب على واتساب والبريد والإشعار.'), opt(false, 'سحب بدون إبلاغ', 'لا يصل العميلَ شيء.'),
      el('p', { class: 'eln-mute', text: 'يُغلق رابط الاستكمال فورًا، وتعود البنود إليك مسودة تعدّلها أو تحذفها.' })]);
  }, go: function () {
    var r = rs.filter(function (y) { return y.k === W.k; })[0], why = W.k === '__o' ? String(W.other || '').trim() : r ? r.body : '';
    if (why.length < 3) { M.err = 'اختر السبب أو اكتبه.'; draw(); return; }
    act('rcl', function () { return A().rpc('admin_elig_reclaim2', { p_sr: x.id, p_reason: why, p_notify: W.notify }); }, 'سُحب الطلب من العميل', [W.notify ? 'وصل العميلَ «أعدنا طلبك للمراجعة» مع السبب.' : 'لم يُبلَّغ العميل.', 'أُغلق رابط الاستكمال، والبنود عندك مسودة في «الطلب الحالي».']);
  } };
  ask(M);
}
/* v1193: ما رفعه العميل يظهر داخل بطاقة الطلب نفسه (لا تبويب مستقل) — ولا يظهر إن لم يرفع شيئًا */
function gotBlock(x, f, J) {
  if (!f || !J || J.st !== 'ok' || !J.v) return null;
  var at = f.at ? new Date(f.at).getTime() : 0, docs = (J.v.docs || []).filter(function (d) { return new Date(d.uploaded_at).getTime() > at; });
  if (!docs.length) return null;
  return el('div', { class: 'eln-got' }, [el('b', { text: 'ما رفعه العميل لهذا الطلب' }), el('div', { class: 'eln-rows' }, docs.map(function (d) { return el('div', { class: 'eln-row' }, [el('span', { class: 'eln-dot is-ok', 'aria-hidden': 'true' }), el('div', { class: 'eln-row-b' }, [el('b', { text: d.label || d.doc_type }), el('small', { class: 'eln-mute', text: (d.name || '') + ' · ' + when(d.uploaded_at) })]), el('button', { class: 'eln-btn is-sm', onclick: function () { A().doc(d); } }, ['عرض'])]); }))]);
}
function cleanItems(items) { return (items || []).map(function (it) { var o = { type: it.type, label: it.label, note: it.note || '' }; if (it.doc_type) o.doc_type = it.doc_type; if (it.max_mb) o.max_mb = it.max_mb; return o; }); }
function askHist(x) {
  var H = ((x.meta && x.meta.fix_hist) || []).slice(), f = fx(x);
  if (f && !f.draft && !H.some(function (h) { return h.at === f.at; })) H.push(f);
  if (!H.length) return [card('الطلبات السابقة', [el('p', { class: 'eln-mute', text: 'لا طلبات استكمال سابقة.' })])];
  return [card('الطلبات السابقة', H.reverse().map(function (h, i) {
    var st = h.open ? ['عند العميل', 'warn'] : h.reclaimed_at ? ['سحبه الفريق', 'warn'] : h.done_at ? ['أكمله العميل', 'ok'] : ['مغلق', 'off'];
    var canEd = !h.open && isOpen(x) && !(f && f.open) && (h.items || []).length;
    return el('div', { class: 'eln-hist' }, [el('div', { class: 'eln-ttl' }, [el('b', { text: 'طلب ' + (H.length - i) + ' · ' + (h.items || []).length + ' بند' }), pill(st[0], st[1])]),
      el('small', { class: 'eln-mute', text: 'أُرسل ' + when(h.at) + (h.done_at ? ' · أعاده العميل ' + when(h.done_at) : '') + (h.reclaimed_at ? ' · سُحب ' + when(h.reclaimed_at) + (h.notified ? ' · أُبلغ العميل' : ' · بلا إبلاغ') : '') }),
      h.reclaimed_at ? el('div', { class: 'eln-banner is-warn' }, [el('b', { text: 'سبب السحب' }), el('span', { text: h.reclaim_note || '—' })]) : null,
      itemsList(h.items, h, null, false),
      canEd ? el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn', onclick: function () { ST.ed[x.id] = { items: cleanItems(h.items), note: h.note || '' }; ST.sub.ask = 'now'; window.scrollTo(0, 0); draw(); } }, ['تعديل وإعادة الإرسال'])]) : null]);
  }))];
}
function askWhy() {
  var R3 = replies(); if (R3.st !== 'ok') return [card('أسباب السحب', [R3.st === 'err' ? el('p', { class: 'eln-err', text: 'تعذّر القراءة.' }) : wait()])];
  var all = (R3.v && R3.v.rows) || [], rs = all.filter(function (r) { return r.cat === 'reclaim'; }), sup = !!(R3.v && R3.v.super);
  var W = ST.why || (ST.why = { t: '', b: '' });
  var save = function (rows, msg) { act('why', function () { return A().rpc('admin_elig_replies_save', { p_rows: rows }); }, 'حُفظت أسباب السحب', [msg]).then(function () { delete ST.D._; W.t = ''; W.b = ''; }); };
  var free = function () { for (var n = 61; n < 100; n++) { var k = '8.' + n; if (!all.some(function (r) { return r.k === k; })) return k; } return ''; };
  return [card('أسباب السحب', [el('p', { class: 'eln-mute', text: 'تظهر في نافذة «سحب الطلب من العميل»، ونصها يصل العميل بعد «السبب:». ' + (sup ? '' : 'التعديل للمشرف العام.') }),
    el('div', { class: 'eln-rows' }, rs.map(function (r) { return el('div', { class: 'eln-row' }, [el('span', { class: 'eln-dot is-' + (r.active ? 'ok' : 'off'), 'aria-hidden': 'true' }), el('div', { class: 'eln-row-b' }, [el('b', { text: r.title }), el('small', { class: 'eln-mute', text: r.body })]),
      sup ? el('button', { class: 'eln-btn is-sm', onclick: function () { save([Object.assign({}, r, { active: !r.active })], r.active ? 'أُوقف «' + r.title + '».' : 'فُعّل «' + r.title + '».'); } }, [r.active ? 'إيقاف' : 'تفعيل']) : null]); })),
    sup ? el('div', { class: 'eln-add' }, [el('b', { text: 'سبب جديد' }), el('div', { class: 'eln-add-g' }, [el('input', { class: 'eln-in', type: 'text', maxlength: '80', placeholder: 'العنوان (يراه الموظف)', value: W.t, oninput: function (e) { W.t = e.target.value; } }),
      el('input', { class: 'eln-in', type: 'text', maxlength: '300', placeholder: 'النص الذي يصل العميل', value: W.b, oninput: function (e) { W.b = e.target.value; } }),
      el('button', { class: 'eln-btn', onclick: function () { var k = free(); if (String(W.t).trim().length < 2 || String(W.b).trim().length < 2) { note('تنبيه', ['اكتب العنوان والنص.'], 'bad'); return; } if (!k) { note('تنبيه', ['لا مكان لسبب جديد.'], 'bad'); return; } save([{ k: k, cat: 'reclaim', title: W.t.trim(), body: W.b.trim(), sort: Number(k.split('.')[1]), active: true }], 'أُضيف «' + W.t.trim() + '».'); } }, ['+ إضافة'])])]) : null])];
}

/* ── 7) الروابط والموافقات: مسار الرحلة ── */
function events(x, J) {
  var E = [], m = x.meta || {}, add = function (at, t, tone, sub) { if (at) E.push({ at: at, t: t, tone: tone || 'ok', sub: sub || '' }); };
  add(x.created_at, 'أرسل العميل الطلب', 'info');
  (J.sends || []).forEach(function (s) { if (s.kind !== 'send') return; add(s.at, 'أُرسل: ' + (KEY_L[s.key] || s.key), 'info', [s.wa_status ? 'واتساب: ' + (WA_L[s.wa_status] || s.wa_status) : '', s.mail_status ? 'البريد: ' + (s.mail_status === 'sent' ? 'أُرسل' : s.mail_status) : ''].filter(Boolean).join(' · ')); });
  (J.links || []).forEach(function (l) { if (l.preview) return; add(l.opened_at, 'فتح العميل الرابط', 'ok', l.factor ? 'تحقق برمز ' + (l.factor === 'whatsapp' ? 'واتساب' : 'البريد') : ''); });
  ((m.fix_hist || []).concat(m.fix && !m.fix.draft ? [m.fix] : [])).forEach(function (h) { add(h.done_at, 'أكمل العميل المطلوب وأعاد الطلب', 'ok'); add(h.reclaimed_at, 'سحب الفريق طلب الاستكمال', 'warn', (h.reclaim_note || '') + (h.notified ? ' · أُبلغ العميل' : ' · بلا إبلاغ')); });
  if (m.fix && m.fix.draft) add(m.fix.reclaimed_at, 'سحب الفريق طلب الاستكمال', 'warn', (m.fix.reclaim_note || '') + (m.fix.notified ? ' · أُبلغ العميل' : ' · بلا إبلاغ'));
  if (J.accept) add(J.accept.at, 'وافق العميل على الأهلية', 'ok');
  if (J.decline) add(J.decline.at, 'اعتذر العميل عن الأهلية', 'bad', J.decline.reason || '');
  (J.quotes || []).forEach(function (q) { if (q.decided_at) add(q.decided_at, q.status === 'accepted' ? 'قبل العميل عرض السعر ' + q.no : q.status === 'declined' ? 'رفض العميل عرض السعر ' + q.no : 'قرار على العرض ' + q.no, q.status === 'declined' ? 'bad' : 'ok'); });
  if (J.purchase) add(J.purchase.at, J.purchase.decision === 'accept' ? 'اعتمد العميل فاتورة المنتج' : 'اعتذر العميل عن الشراء', J.purchase.decision === 'accept' ? 'ok' : 'bad', J.purchase.reason || '');
  if (J.contract && J.contract.signed_at) add(J.contract.signed_at, 'وقّع العميل العقد ' + J.contract.no, 'ok');
  add(x.executed_at, 'اكتمل التنفيذ وأُغلق الطلب', 'ok');
  return E.sort(function (a, b) { return new Date(a.at) - new Date(b.at); });
}
function pathMini(x) {
  var J = journey(x); if (J.st !== 'ok' || !J.v || J.v.ok === false) return null;
  var E = events(x, J.v).slice(-4); if (!E.length) return null;
  return el('ol', { class: 'eln-path', 'aria-label': 'آخر خطوات الرحلة' }, E.map(function (e) { return el('li', { class: 'is-' + e.tone }, [e.t, el('small', { text: ' · ' + when(e.at) })]); }));
}
function tabLnk(x) { /* v1226: الإرسال ومسار موافقات العميل في شاشة واحدة؛ «القوالب والمعاينة» من زر «المعاينة» */
  return [card('', stage(x, ST.sub.lnk === 'tpl' ? 'tpl' : 'lnk'))];
}
function sendsCard(x) {
  var J = journey(x); if (J.st === 'load') return [card('', [wait()])]; if (J.st === 'err' || !J.v || J.v.ok === false) return [card('', [el('p', { class: 'eln-err', text: 'تعذّر قراءة الرسائل.' })])];
  var v = J.v, s = 'sends';
  if (s === 'sends') { var S = (v.sends || []).slice().reverse(); return [card('الرسائل المرسلة', S.length ? S.map(function (m) { return el('div', { class: 'eln-row' }, [el('span', { class: 'eln-dot is-' + (m.kind === 'send' ? 'info' : 'off'), 'aria-hidden': 'true' }), el('div', { class: 'eln-row-b' }, [el('b', { text: (KEY_L[m.key] || m.key) + (m.kind === 'preview' ? ' (معاينة' + (m.by ? ' — ' + m.by : '') + ')' : m.kind === 'held' ? ' (محجوزة)' : m.kind === 'release' ? ' — ضغط الموظف «إرسال الرابط»' : '') }),
    el('small', { class: 'eln-mute', text: when(m.at) + (m.kind === 'release' || m.kind === 'held' ? ' · إجراء داخلي — ليست رسالة للعميل' : ' · واتساب: ' + (WA_L[m.wa_status] || m.wa_status || (m.info && WA_L[m.info.wa]) || (m.info && m.info.wa) || '—') + ' · البريد: ' + ((m.mail_status || (m.info && m.info.mail)) === 'sent' ? 'أُرسل' : m.mail_status || (m.info && m.info.mail) || '—')) })])]); }) : [el('p', { class: 'eln-mute', text: 'لم تُرسل رسائل بعد.' })])]; }
  return [];
}

/* ── 9) المراسلات والسجل ── */
function tabLog(x) {
  var s = subOf('log');
  if (s === 'sends') return sendsCard(x); /* v1226 */
  if (s === 'log') { var L = (x.log || []).slice().reverse(); return [card('السجل', L.length ? [el('ol', { class: 'eln-tl' }, L.map(function (e) { return el('li', { class: 'is-info' }, [el('b', { text: e.t || '' }), el('small', { class: 'eln-mute', text: when(e.at) + (e.by ? ' · ' + ((A().staff && A().staff(e.by)) || '') : '') })]); }))] : [el('p', { class: 'eln-mute', text: 'لا سجل.' })])]; }
  if (s === 'notes') {
    var N = lazy(x.id, 'notes', function () { return A().rpc('admin_elig_notes', { p_sr: x.id }); }); var W = ST.nt || (ST.nt = {});
    var ta = el('textarea', { class: 'eln-in', rows: '2', maxlength: '2000', placeholder: 'ملاحظة داخلية — لا يراها العميل', oninput: function (e) { W[x.id] = e.target.value; } }); ta.value = W[x.id] || '';
    return [card('ملاحظات داخلية', [N.st === 'load' ? wait() : el('div', { class: 'eln-chat' }, ((N.v && N.v.rows) || []).map(function (m) { return el('div', { class: 'eln-msg is-staff' }, [el('small', { text: (m.by || 'فريق تيرا') + ' · ' + when(m.at) }), el('p', { text: m.body })]); })),
      ta, el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn is-pri', disabled: !!ST.busy, onclick: function () { var b = String(W[x.id] || '').trim(); if (b.length < 2) { note('تنبيه', ['اكتب الملاحظة.'], 'bad'); return; } act('note', function () { return A().rpc('admin_elig_note_add', { p_sr: x.id, p_body: b }); }, 'حُفظت الملاحظة', ['ملاحظة داخلية لا يراها العميل.']).then(function (r) { if (r) W[x.id] = ''; }); } }, ['حفظ الملاحظة'])])])];
  }
  var M = lazy(x.id, 'msgs', function () { return A().rpc('admin_sr_msgs', { p_sr: x.id }); }); var C = ST.ch || (ST.ch = {});
  var tb = el('textarea', { class: 'eln-in', rows: '2', maxlength: '1000', placeholder: 'رسالة للعميل — تصله في حسابه وبإشعار', oninput: function (e) { C[x.id] = e.target.value; } }); tb.value = C[x.id] || '';
  return [card('المحادثة مع العميل', [M.st === 'load' ? wait() : el('div', { class: 'eln-chat' }, ((M.v && M.v.rows) || []).length ? M.v.rows.map(function (m) { return el('div', { class: 'eln-msg is-' + (m.who === 'staff' ? 'staff' : 'cl') }, [el('small', { text: m.by + ' · ' + when(m.at) }), el('p', { text: m.body || (m.ask ? 'طلب مرفق: ' + m.ask.label : '') }), m.file ? el('small', { class: 'eln-mute', text: 'مرفق: ' + m.file.name }) : null]); }) : [el('p', { class: 'eln-mute', text: 'لا رسائل بعد.' })]),
    tb, el('div', { class: 'eln-acts' }, [el('button', { class: 'eln-btn is-pri', disabled: !!ST.busy || !isOpen(x), onclick: function () { var b = String(C[x.id] || '').trim(); if (b.length < 2) { note('تنبيه', ['اكتب الرسالة.'], 'bad'); return; } act('msg', function () { return A().rpc('admin_sr_msg_send', { p_sr: x.id, p_body: b, p_ask: null }); }, 'أُرسلت الرسالة', ['وصلت العميلَ في حسابه وبإشعار.']).then(function (r) { if (r) C[x.id] = ''; }); } }, ['إرسال للعميل'])])])];
}

/* ── v1184: مراحل المستندات (القرار · العرض · الفاتورة · العقد · الإدارة) داخل تبويبها — منطقها من platform.js (eg11/eg12/eg13) ── */
function stage(x, k) { var f = A().eligStage; return f ? f(x.id, k, draw, goTab) : [el('p', { class: 'eln-err', text: 'تعذّر عرض هذا القسم — أعد تحميل الصفحة.' })]; }
function tabStage(x, k) { return [card('', stage(x, k))]; }

/* ══════════ الرسم ══════════ */
function draw() {
  var y = window.scrollY; R.innerHTML = '';
  var x = ST.id ? cur() : null;
  if (ST.id && ST.rows && !x) { ST.id = ''; ss('id', ''); }
  var kids = ST.id && x ? detail(x) : listView();
  kids.concat(layers()).forEach(function (k) { if (k) R.appendChild(k); });
  if (ST.note || ST.modal) { var b = R.querySelector('.eln-dlg .eln-btn'); if (b) setTimeout(function () { try { b.focus(); } catch (e) { void e; } }, 20); }
  window.scrollTo(0, y);
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (ST.note || ST.modal) && R.isConnected) { ST.note = null; ST.modal = null; draw(); } });
function run() {
  if (!ST.rows && !ST.loading) { ST.loading = true; A().srs(false).then(function (a) { ST.rows = (a || []).filter(function (x) { return x && x.kind === 'elig'; }); ST.loading = false; draw(); }).catch(function () { ST.loading = false; ST.rows = []; draw(); }); }
  draw(); return R;
}
function reg() { if (window.__teraApp && typeof window.__teraApp.page === 'function' && typeof window.__teraApp.rpc === 'function') { window.__teraApp.page(KEY, TITLE, ['identification-badge', 'violet'], run, 'cu'); return true; } return false; }
if (!reg()) { var n = 0, t = setInterval(function () { if (reg() || ++n > 60) clearInterval(t); }, 250); }
})();
