/* v1194: «المطلوب من العميل» و«مسار الرحلة» داخل صفحة «طلبات التحقق من الأهلية» الأصلية (platform.js eg9–eg13) — بقرار المشرف:
 * نفس قوالب المنصة وألوانها وأيقوناتها، والتغيير في الترتيب فقط. هذا الملف لا يرسم صفحة؛ يعطي المنصة محتوى تبويبين:
 *   __teraApp.eligAsk(x, sub, paint)  → الطلب الحالي · الطلبات السابقة · أسباب السحب
 *   __teraApp.eligLnk(x, sub, paint)  → مسار الرحلة · الروابط · الرسائل المرسلة
 * (v1152–v1193 كان صفحة مستقلة بتصميم eln-* — أُلغي.) */
(function () {
'use strict';
if (!/^\/staff\/next(\/|$)/.test(location.pathname)) return;
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
function pad(n) { return (n < 10 ? '0' : '') + n; }
function when(s) { if (!s) return '—'; var d = new Date(s); if (isNaN(d)) return '—'; var h = d.getHours(), ap = h < 12 ? 'ص' : 'م'; h = h % 12 || 12; return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' · ' + h + ':' + pad(d.getMinutes()) + ' ' + ap; }
function fx(x) { return (x && x.meta && x.meta.fix) || null; }
function isOpen(x) { return x && ['submitted', 'in_review', 'approved', 'rejected'].indexOf(x.status) >= 0 && !x.executed_at; }
function ic(n, s) { try { return A().ic ? A().ic(n, s || 17) : null; } catch (e) { return null; } }
/* قوالب المنصة نفسها: بطاقة eg13-blk · زر eg9-btn · شارة eg9-pill · حقل eg11-in */
var TONE = { ok: 'ok', warn: 'warn', bad: 'danger', danger: 'danger', info: 'info', off: 'un' };
function pill(t, tone) { return el('span', { class: 'eg9-pill is-' + (TONE[tone] || 'info') }, [t]); }
function blk(title, icon, kids, tag) { return el('section', { class: 'eg13-blk' }, [title ? el('h4', {}, [ic(icon), el('span', { text: title }), tag || null]) : null].concat(kids)); }
function btn(label, o) { o = o || {}; return el('button', { class: 'eg9-btn' + (o.cls ? ' ' + o.cls : ''), disabled: o.disabled ? true : null, onclick: o.on || null, 'aria-label': o.aria || null }, [o.ic ? ic(o.ic, 16) : null, label]); }
function acts(L) { return el('div', { class: 'eg9-acts eg11-acts' }, L.filter(Boolean)); }
function fld(label, ctl, hint) { return el('div', { class: 'eg11-fld' }, [el('label', {}, [label, hint ? el('em', { text: ' — ' + hint }) : null]), ctl]); }
function hint(t) { return el('small', { class: 'eg9-hint', text: t }); }
function warnBox(t) { return el('div', { class: 'eg10-warn', role: 'alert', text: t }); }
function info(t) { return el('div', { class: 'eg12-info' }, [ic('info', 17), el('span', { text: t })]); }
function wait(t) { return el('div', { class: 'eg12-empty' }, [el('span', { text: t || 'جارٍ القراءة…' })]); }
var KEY_L = { elig_new: 'وصلنا طلبك', elig_received: 'بدأنا مراجعة طلبك', elig_fix: 'طلبك يحتاج استكمالًا (برابط مباشر)', elig_back: 'وصلنا استكمالك', elig_ok: 'نتيجة الأهلية: مؤهَّل', elig_less: 'نتيجة الأهلية: مؤهَّل بمبلغ أقل', elig_no: 'نتيجة الأهلية: غير مؤهَّل حاليًا',
  elig_accepted: 'وافق على الأهلية', elig_declined: 'اعتذر عن الأهلية', elig_quote: 'صدر عرض السعر', elig_purchase: 'صدرت فاتورة المنتج', elig_reclaim: 'أعدنا طلبك للمراجعة' };
var WA_L = { queued: 'في الطابور', sending: 'يُرسل', sent: 'أُرسل', delivered: 'وصل', read: 'قُرئ', failed: 'فشل', cancelled: 'أُلغي' };

/* ── الحالة ── */
var ST = { D: {}, ed: {}, rc: {}, busy: '', paint: null, modal: null, why: null };
function repaint() { try { if (ST.paint) ST.paint(); } catch (e) { void e; } }
function D(id) { return ST.D[id] || (ST.D[id] = {}); }
function lazy(id, k, fn) {
  var d = D(id); if (d[k]) return d[k];
  d[k] = { st: 'load', v: null };
  Promise.resolve().then(fn).then(function (v) { d[k] = { st: v && v.ok === false ? 'err' : 'ok', v: v, err: v && v.ok === false ? (v.message || v.error || '') : '' }; repaint(); })
    .catch(function (e) { d[k] = { st: 'err', v: null, err: (e && e.message) || 'تعذّر التحميل.' }; repaint(); });
  return d[k];
}
function job(x) { return lazy(x.id, 'job', function () { return A().rpc('admin_client_job', { p_user: x.user_id }); }); }
function replies() { return lazy('_', 'rep', function () { return A().rpc('admin_elig_replies', {}); }); }
function journey(x) { return lazy(x.id, 'jr', function () { return A().rpc('adm_elig_journey', { p_sr: x.id }); }); }
function note(t, lines, tone) { try { A().eligNote(t, [].concat(lines || []), tone === 'bad' ? 'warn' : tone || 'ok'); } catch (e) { void e; } }
/* الإجراء: نداء القاعدة ثم تحديث الطلبات وشاشة التأكيد (eg9Note) — كباقي الصفحة */
async function act(x, key, fn, okTitle, okLines) {
  if (ST.busy) return null; ST.busy = key; ST.modal = null; closeModal(); repaint();
  try {
    var r = await fn(); if (r && r.ok === false) throw new Error(r.message || r.error || 'تعذّر تنفيذ الإجراء.');
    ST.busy = ''; ST.D[x.id] = {}; await A().eligAfter(x.id, okTitle, okLines); repaint(); return r || true;
  } catch (e) { ST.busy = ''; repaint(); note('لم يُنفَّذ الإجراء', [(e && e.message) || 'تعذّر تنفيذ الإجراء.'], 'bad'); return null; }
}

/* ── نافذة التأكيد (نفس هوية نوافذ المنصة) ── */
var OV = null;
function closeModal() { if (OV) { OV.remove(); OV = null; } ST.modal = null; }
function modal(M) {
  ST.modal = M; if (OV) OV.remove();
  var body = el('div', { class: 'ela-dlg-b' });
  var paintBody = function () { body.innerHTML = ''; [M.text ? el('p', { class: 'eg9-hint', text: M.text }) : null, M.body ? M.body(paintBody) : null, M.err ? warnBox(M.err) : null].forEach(function (n) { if (n) body.appendChild(n); }); };
  paintBody();
  OV = el('div', { class: 'ela-ov', role: 'dialog', 'aria-modal': 'true', 'aria-label': M.title, onclick: function (ev) { if (ev.target === OV) closeModal(); } }, [el('div', { class: 'ela-dlg' + (M.wide ? ' is-wide' : '') }, [
    el('h3', { text: M.title }), body,
    acts([btn(M.ok || 'تأكيد', { cls: M.tone === 'bad' ? 'is-danger' : 'is-pri', on: function () { M.err = ''; M.go(function (m) { M.err = m; paintBody(); }); } }), btn('تراجع', { on: closeModal })])])]);
  document.body.appendChild(OV);
  setTimeout(function () { var b = OV && OV.querySelector('select,textarea,.eg9-btn'); if (b) try { b.focus(); } catch (e) { void e; } }, 20);
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && OV) closeModal(); });

/* ══════════ المطلوب من العميل ══════════ */
function itemDone(it, f, docs) {
  var at = f && f.at ? new Date(f.at).getTime() : 0;
  if (it.type === 'doc') return (docs || []).some(function (d) { return d.doc_type === it.doc_type && new Date(d.uploaded_at).getTime() > at; });
  if (it.type === 'field') return !!(it.changed_at && new Date(it.changed_at).getTime() > at); return true;
}
var TY = { doc: 'مرفق', field: 'تصحيح حقل', note: 'ملاحظة' };
function itemsList(items, f, docs, withState) {
  return el('ol', { class: 'ela-items' }, (items || []).map(function (it, i) {
    var dn = withState ? itemDone(it, f, docs) : null;
    return el('li', { class: dn ? 'is-done' : '' }, [el('span', { class: 'ela-n', text: dn ? '✓' : String(i + 1) }), el('div', { class: 'ela-b' }, [el('b', { text: it.label }), el('small', { text: TY[it.type] + (it.type === 'doc' && it.max_mb ? ' · حتى ' + it.max_mb + ' م.ب' : '') + (it.note ? ' · ' + it.note : '') + (it.changed_at ? ' · ' + (it.confirmed ? 'أكّده العميل: ' + (it.val || '') : 'صحّحه العميل: ' + (it.prev || '—') + ' ← ' + (it.val || '')) : '') }), it.reply ? el('p', { class: 'ela-reply', text: 'ردّ العميل: ' + it.reply }) : null]),
      withState ? (it.type === 'note' ? pill('للعلم', 'off') : pill(dn ? 'تم' : 'لم يكتمل', dn ? 'ok' : 'warn')) : null]);
  }));
}
function quote(label, text) { return el('div', { class: 'ela-quote' }, [el('small', { text: label }), el('p', { text: text })]); }
/* ما رفعه العميل لهذا الطلب — داخل بطاقته، ولا يظهر إن لم يرفع شيئًا */
function gotBlock(x, f, J) {
  if (!f || !J || J.st !== 'ok' || !J.v) return null;
  var at = f.at ? new Date(f.at).getTime() : 0, docs = (J.v.docs || []).filter(function (d) { return new Date(d.uploaded_at).getTime() > at; });
  if (!docs.length) return null;
  return el('div', { class: 'ela-got' }, [el('b', { text: 'ما رفعه العميل لهذا الطلب' }), el('div', { class: 'ela-rows' }, docs.map(function (d) { return el('div', { class: 'ela-row' }, [el('div', { class: 'ela-b' }, [el('b', { text: d.label || d.doc_type }), el('small', { text: (d.name || '') + ' · ' + when(d.uploaded_at) })]), btn('عرض', { on: function () { A().doc(d); } })]); }))]);
}
function linkInfo(x) {
  var J = journey(x); if (J.st !== 'ok' || !J.v) return null;
  var L = (J.v.links || []).filter(function (l) { return l.purpose === 'journey' && !l.preview; }).slice(-1)[0]; if (!L) return hint('لم يُرسل رابط مباشر لهذا الطلب بعد.');
  var S = (J.v.sends || []).filter(function (s) { return s.key === 'elig_fix' && s.kind === 'send'; }).slice(-1)[0];
  return el('dl', { class: 'eg13-dl is-4' }, [['الرابط', L.decision === 'replaced' ? 'مُغلق' : new Date(L.expires_at) < new Date() ? 'منتهي' : 'صالح حتى ' + when(L.expires_at)], ['فتحه العميل', L.opened_at ? when(L.opened_at) + (L.factor ? ' · ' + (L.factor === 'whatsapp' ? 'واتساب' : 'البريد') : '') : 'لم يفتحه بعد'],
    ['واتساب', S ? (WA_L[S.wa_status] || S.wa_status || '—') : '—'], ['البريد', S ? (WA_L[S.mail_status] || S.mail_status || '—') : '—']].map(function (r) { return el('div', {}, [el('dt', { text: r[0] }), el('dd', { text: r[1] })]); }));
}
function cleanItems(items) { return (items || []).map(function (it) { var o = { type: it.type, label: it.label, note: it.note || '' }; if (it.doc_type) o.doc_type = it.doc_type; if (it.max_mb) o.max_mb = it.max_mb; return o; }); }

function askNow(x) {
  var f = fx(x), J = job(x), docs = J.st === 'ok' && J.v ? J.v.docs : [];
  if (f && f.open) {
    journey(x);
    return [blk('طلب الاستكمال عند العميل', 'hourglass-medium', [hint('أُرسل ' + when(f.at) + ' برابط مباشر — يكمله العميل من الرابط أو من حسابه. لا يوقف هذا القرار ولا بقية المراحل؛ إن لم يُكمله العميل اسحبه من هنا.'),
      itemsList(f.items, f, docs, true), f.note ? quote('رسالة الفريق', f.note) : null, gotBlock(x, f, J), linkInfo(x),
      acts([btn('إعادة إرسال الرابط', { cls: 'is-pri', ic: 'paper-plane-tilt', disabled: !!ST.busy, on: function () { modal({ title: 'إعادة إرسال رابط الاستكمال؟', text: 'يصل العميلَ الرابط نفسه برسالة «طلبك يحتاج استكمالًا» (واتساب والبريد والإشعار)، ويُغلق الرابط السابق.', ok: 'إعادة الإرسال', go: function () { act(x, 'ntf', function () { return A().rpc('admin_sr_notify', { p_id: x.id }); }, 'أُعيد إرسال الرابط', ['وصل العميلَ رابط الاستكمال من جديد على واتساب والبريد والإشعار.']); } }); } }),
        btn('سحب الطلب من العميل', { cls: 'is-danger', ic: 'arrow-u-up-left', disabled: !!ST.busy, on: function () { reclaimDlg(x); } })])], pill('بانتظار العميل', 'warn'))];
  }
  if (f && f.done_at && !f.open && !f.draft && !ST.ed[x.id]) {
    return [blk('أكمل العميل المطلوب وأعاد الطلب', 'check-circle', [hint('أعاده ' + when(f.done_at) + ' — انتهى رابط الاستكمال.'),
      itemsList(f.items, f, docs, true), f.client_note ? quote('ملاحظة العميل مع الإرسال', f.client_note) : null, gotBlock(x, f, J),
      isOpen(x) ? acts([btn('طلب استكمال جديد', { ic: 'plus', on: function () { ST.ed[x.id] = { items: [], note: '' }; repaint(); } })]) : null], pill('مكتمل', 'ok'))];
  }
  return editor(x, f);
}
function editor(x, f) {
  if (!isOpen(x)) return [blk('المطلوب من العميل', 'list-checks', [hint('الطلب مغلق — لا استكمال.')])];
  var draft = f && f.draft, E = ST.ed[x.id] || (ST.ed[x.id] = { items: draft ? cleanItems(f.items) : [], note: draft ? (f.note || '') : '' });
  var J = job(x), rules = J.st === 'ok' && J.v ? (J.v.rules || []) : [];
  var N = E.n || (E.n = { type: J.st === 'ok' && !rules.length ? 'field' : 'doc', doc: '', field: '', label: '', note: '', mb: '10' });
  var fields = (x.fields || []).map(function (y) { return String(y[0] || ''); }).filter(function (l) { return l && !/^(الاسم|الجوال|البريد الإلكتروني|ملاحظة)$/.test(l); });
  var sel = function (aria, opts, val, on) { return el('select', { class: 'eg11-in', 'aria-label': aria, onchange: function (e) { on(e.target.value); } }, opts.map(function (o) { return el('option', { value: o[0], selected: val === o[0] ? true : null, text: o[1] }); })); };
  var typeSel = sel('نوع البند', [['doc', 'مرفق'], ['field', 'تصحيح حقل'], ['note', 'ملاحظة']], N.type, function (v) { N.type = v; repaint(); });
  var what;
  if (N.type === 'doc') what = rules.length ? sel('المرفق', [['', '— اختر المرفق —']].concat(rules.map(function (r) { return [r.doc_type, r.label]; })), N.doc, function (v) { N.doc = v; })
    : hint(J.st === 'load' ? 'جارٍ تحميل المرفقات…' : 'لا مرفقات معرّفة لحالته الوظيفية في ملفه — اطلب «تصحيح حقل» أو «ملاحظة».');
  else if (N.type === 'field') what = sel('الحقل', [['', '— اختر الحقل —']].concat(fields.map(function (l) { return [l, l]; })), N.field, function (v) { N.field = v; });
  else what = el('input', { class: 'eg11-in', type: 'text', maxlength: '80', placeholder: 'عنوان الملاحظة', value: N.label, oninput: function (e) { N.label = e.target.value; } });
  var noteIn = el('input', { class: 'eg11-in', type: 'text', maxlength: '400', placeholder: N.type === 'doc' ? 'ما المطلوب في المرفق (اختياري)' : 'المطلوب تصحيحه أو نص الملاحظة (إلزامي)', value: N.note, oninput: function (e) { N.note = e.target.value; } });
  var mb = N.type === 'doc' ? sel('الحد', ['5', '10', '20'].map(function (v) { return [v, 'حتى ' + v + ' م.ب']; }), N.mb, function (v) { N.mb = v; }) : null;
  var add = btn('إضافة البند', { ic: 'plus', on: function () {
    var it;
    if (N.type === 'doc') { var r = rules.filter(function (y) { return y.doc_type === N.doc; })[0]; if (!r) { note('تنبيه', ['اختر المرفق.'], 'bad'); return; } it = { type: 'doc', label: r.label, doc_type: r.doc_type, note: N.note.trim(), max_mb: Number(N.mb) }; }
    else if (N.type === 'field') { if (!N.field) { note('تنبيه', ['اختر الحقل.'], 'bad'); return; } if (N.note.trim().length < 2) { note('تنبيه', ['اكتب المطلوب تصحيحه.'], 'bad'); return; } it = { type: 'field', label: N.field, note: N.note.trim() }; }
    else { if (N.label.trim().length < 2 || N.note.trim().length < 2) { note('تنبيه', ['اكتب عنوان الملاحظة ونصها.'], 'bad'); return; } it = { type: 'note', label: N.label.trim(), note: N.note.trim() }; }
    if (E.items.some(function (y) { return y.type === it.type && y.label === it.label; })) { note('تنبيه', ['هذا البند في القائمة.'], 'bad'); return; }
    E.items.push(it); E.n = null; repaint(); } });
  var R3 = replies(), asks = R3.st === 'ok' && R3.v ? (R3.v.rows || []).filter(function (r) { return r.cat === 'ask' && r.active; }) : [];
  var msg = el('textarea', { class: 'eg11-in is-ta', rows: '3', maxlength: '600', placeholder: 'رسالة للعميل تصل مع الطلب (اختياري)', oninput: function (e) { E.note = e.target.value; } }); msg.value = E.note || '';
  var cancel = (f && f.done_at && !draft) || E.fromHist ? btn('إلغاء', { on: function () { ST.ed[x.id] = null; repaint(); } }) : null;
  return [blk(draft ? 'طلب استكمال — مسودة' : 'طلب استكمال جديد', 'list-checks', [
    draft ? warnBox('سُحب من العميل ' + when(f.reclaimed_at) + ' وعاد إليك مسودة · السبب: ' + (f.reclaim_note || '—') + (f.notified ? ' · أُبلغ العميل' : ' · بلا إبلاغ') + '. عدّل البنود أو احذفها ثم أرسلها، أو احذف المسودة.') : null,
    E.fromHist ? info('بنود الطلب السابق — عدّلها ثم أرسلها.') : null,
    E.items.length ? el('ol', { class: 'ela-items' }, E.items.map(function (it, i) { return el('li', {}, [el('span', { class: 'ela-n', text: String(i + 1) }), el('div', { class: 'ela-b' }, [el('b', { text: it.label }), el('small', { text: TY[it.type] + (it.max_mb ? ' · حتى ' + it.max_mb + ' م.ب' : '') + (it.note ? ' · ' + it.note : '') })]),
      btn('حذف', { cls: 'is-danger', aria: 'حذف البند ' + it.label, on: function () { E.items.splice(i, 1); repaint(); } })]); })) : hint('لا بنود بعد — أضف ما تطلبه من العميل.'),
    el('div', { class: 'ela-add' }, [el('b', { text: 'إضافة بند' }), el('div', { class: 'ela-add-g' }, [typeSel, what, mb, noteIn, add])]),
    fld('رسالة للعميل', msg, 'اختياري'),
    asks.length ? sel('رد جاهز', [['', 'رد جاهز…']].concat(asks.map(function (r) { return [r.k, r.title]; })), '', function (v) { var r = asks.filter(function (y) { return y.k === v; })[0]; if (r) { E.note = r.body; repaint(); } }) : null,
    acts([btn('إرسال للعميل برابط مباشر', { cls: 'is-pri is-main', ic: 'paper-plane-tilt', disabled: !E.items.length || !!ST.busy, on: function () {
        modal({ title: 'إرسال طلب الاستكمال للعميل؟', text: 'يصله برابط مباشر برمز تحقق على واتساب والبريد والإشعار، ويستطيع الإكمال من الرابط أو من حسابه. ينتهي الرابط بعد إعادته الطلب.', ok: 'إرسال', go: function () {
          act(x, 'ret', function () { return A().rpc('admin_elig_return', { p_sr: x.id, p_items: E.items, p_note: String(E.note || '').trim() }); }, 'أُرسل طلب الاستكمال', ['وصل العميلَ ' + E.items.length + ' بند برابط مباشر.', 'تتابع حالته من «الطلب الحالي» ومسار الرحلة في «الروابط والموافقات».']).then(function (r) { if (r) ST.ed[x.id] = null; }); } }); } }),
      draft ? btn('حذف المسودة', { cls: 'is-danger', ic: 'trash', disabled: !!ST.busy, on: function () { modal({ title: 'حذف المسودة؟', text: 'تُحذف البنود من الطلب الحالي وتبقى في «الطلبات السابقة».', ok: 'حذف المسودة', tone: 'bad', go: function () { act(x, 'dis', function () { return A().rpc('admin_elig_fix_discard', { p_sr: x.id }); }, 'حُذفت المسودة', ['البنود محفوظة في «الطلبات السابقة».']).then(function (r) { if (r) ST.ed[x.id] = null; }); } }); } }) : cancel])], draft ? pill('مسودة', 'warn') : null)];
}
function reclaimDlg(x) {
  var W = { k: '', other: '', notify: true }, rs = [];
  modal({ title: 'سحب الطلب من العميل', wide: true, ok: 'تأكيد السحب', tone: 'bad', body: function (rp) {
    var R3 = replies(); rs = R3.st === 'ok' && R3.v ? (R3.v.rows || []).filter(function (r) { return r.cat === 'reclaim' && r.active; }) : [];
    if (R3.st === 'load' || !R3.st) { setTimeout(rp, 400); return hint('جارٍ تحميل أسباب السحب…'); }
    if (!W.k) W.k = rs[0] ? rs[0].k : '__o';
    var s = el('select', { class: 'eg11-in', 'aria-label': 'سبب السحب', onchange: function (e) { W.k = e.target.value; rp(); } }, rs.map(function (r) { return el('option', { value: r.k, selected: W.k === r.k ? true : null, text: r.title }); }).concat([el('option', { value: '__o', selected: W.k === '__o' ? true : null, text: 'أخرى…' })]));
    var r = rs.filter(function (y) { return y.k === W.k; })[0];
    var oth = el('textarea', { class: 'eg11-in is-ta', rows: '2', maxlength: '300', placeholder: 'اكتب السبب', oninput: function (e) { W.other = e.target.value; } }); oth.value = W.other;
    var opt = function (v, t, d) { return el('label', { class: 'eg11-chk ela-opt' + (W.notify === v ? ' is-on' : '') }, [el('input', { type: 'radio', name: 'ela-ntf', checked: W.notify === v, onchange: function () { W.notify = v; rp(); } }), el('div', {}, [el('b', { text: t }), el('small', { text: d })])]); };
    return el('div', { class: 'ela-dlg-f' }, [fld('سبب السحب', s), W.k === '__o' ? oth : r ? quote('يصل العميل', 'السبب: ' + r.body) : null,
      opt(true, 'إبلاغ العميل', 'يصله «أعدنا طلبك للمراجعة» مع السبب على واتساب والبريد والإشعار.'), opt(false, 'سحب بدون إبلاغ', 'لا يصل العميلَ شيء.'),
      hint('يُغلق رابط الاستكمال فورًا، وتعود البنود إليك مسودة تعدّلها أو تحذفها.')]);
  }, go: function (err) {
    var r = rs.filter(function (y) { return y.k === W.k; })[0], why = W.k === '__o' ? String(W.other || '').trim() : r ? r.body : '';
    if (why.length < 3) { err('اختر السبب أو اكتبه.'); return; }
    act(x, 'rcl', function () { return A().rpc('admin_elig_reclaim2', { p_sr: x.id, p_reason: why, p_notify: W.notify }); }, 'سُحب الطلب من العميل', [W.notify ? 'وصل العميلَ «أعدنا طلبك للمراجعة» مع السبب.' : 'لم يُبلَّغ العميل.', 'أُغلق رابط الاستكمال، والبنود عندك مسودة في «الطلب الحالي».']);
  } });
}
function hist(x) {
  var H = ((x.meta && x.meta.fix_hist) || []).slice(), f = fx(x);
  if (f && !f.draft && !H.some(function (h) { return h.at === f.at; })) H.push(f);
  return H;
}
function askHist(x) {
  var H = hist(x), f = fx(x), J = job(x);
  if (!H.length) return [blk('الطلبات السابقة', 'clock-counter-clockwise', [hint('لم يُرسل للعميل طلب استكمال على هذا الطلب بعد. كل طلب يُرسل أو يُسحب يبقى هنا بسببه وبنوده.')])];
  return [blk('الطلبات السابقة', 'clock-counter-clockwise', [el('div', { class: 'ela-rows' }, H.slice().reverse().map(function (h, i) {
    var st = h.open ? ['عند العميل', 'warn'] : h.reclaimed_at ? ['سحبه الفريق', 'warn'] : h.done_at ? ['أكمله العميل', 'ok'] : ['مغلق', 'off'];
    var canEd = !h.open && isOpen(x) && !(f && f.open) && (h.items || []).length;
    return el('div', { class: 'ela-hist' }, [el('div', { class: 'ela-hist-h' }, [el('b', { text: 'طلب ' + (H.length - i) + ' · ' + (h.items || []).length + ' بند' }), pill(st[0], st[1])]),
      el('small', { class: 'eg9-hint', text: 'أُرسل ' + when(h.at) + (h.done_at ? ' · أعاده العميل ' + when(h.done_at) : '') + (h.reclaimed_at ? ' · سُحب ' + when(h.reclaimed_at) + (h.notified ? ' · أُبلغ العميل' : ' · بلا إبلاغ') : '') }),
      h.reclaimed_at ? quote('سبب السحب', h.reclaim_note || '—') : null,
      itemsList(h.items, h, null, false), h.client_note ? quote('ملاحظة العميل', h.client_note) : null, h.done_at ? gotBlock(x, h, J) : null,
      canEd ? acts([btn('تعديل وإعادة الإرسال', { ic: 'note-pencil', on: function () { ST.ed[x.id] = { items: cleanItems(h.items), note: h.note || '', fromHist: true }; A().eligGo(x.id, 'ask', 'now'); } })]) : null]);
  }))])];
}
function askWhy() {
  var R3 = replies(); if (R3.st !== 'ok') return [blk('أسباب السحب', 'list-bullets', [R3.st === 'err' ? warnBox('تعذّرت القراءة.') : wait()])];
  var all = (R3.v && R3.v.rows) || [], rs = all.filter(function (r) { return r.cat === 'reclaim'; }), sup = !!(R3.v && R3.v.super);
  var W = ST.why || (ST.why = { t: '', b: '' });
  var save = function (rows, msg) { act({ id: '_' }, 'why', function () { return A().rpc('admin_elig_replies_save', { p_rows: rows }); }, 'حُفظت أسباب السحب', [msg]).then(function () { delete ST.D._; W.t = ''; W.b = ''; repaint(); }); };
  var free = function () { for (var n = 61; n < 100; n++) { var k = '8.' + n; if (!all.some(function (r) { return r.k === k; })) return k; } return ''; };
  return [blk('أسباب السحب', 'list-bullets', [hint('عند سحب طلب استكمال من العميل (زر «سحب الطلب من العميل» في «الطلب الحالي» وهو عنده) يختار الموظف سببًا منها، ونصه يصل العميل بعد «السبب:». ' + (sup ? '' : 'التعديل للمشرف العام.')),
    el('div', { class: 'ela-rows' }, rs.map(function (r) { return el('div', { class: 'ela-row' + (r.active ? '' : ' is-off') }, [el('div', { class: 'ela-b' }, [el('b', { text: r.title }), el('small', { text: r.body })]), pill(r.active ? 'مفعّل' : 'موقوف', r.active ? 'ok' : 'off'),
      sup ? btn(r.active ? 'إيقاف' : 'تفعيل', { on: function () { save([Object.assign({}, r, { active: !r.active })], r.active ? 'أُوقف «' + r.title + '».' : 'فُعّل «' + r.title + '».'); } }) : null]); })),
    sup ? el('div', { class: 'ela-add' }, [el('b', { text: 'سبب جديد' }), el('div', { class: 'ela-add-g' }, [el('input', { class: 'eg11-in', type: 'text', maxlength: '80', placeholder: 'العنوان (يراه الموظف)', value: W.t, oninput: function (e) { W.t = e.target.value; } }),
      el('input', { class: 'eg11-in', type: 'text', maxlength: '300', placeholder: 'النص الذي يصل العميل', value: W.b, oninput: function (e) { W.b = e.target.value; } }),
      btn('إضافة', { ic: 'plus', on: function () { var k = free(); if (String(W.t).trim().length < 2 || String(W.b).trim().length < 2) { note('تنبيه', ['اكتب العنوان والنص.'], 'bad'); return; } if (!k) { note('تنبيه', ['لا مكان لسبب جديد.'], 'bad'); return; } save([{ k: k, cat: 'reclaim', title: W.t.trim(), body: W.b.trim(), sort: Number(k.split('.')[1]), active: true }], 'أُضيف «' + W.t.trim() + '».'); } })])]) : null])];
}

/* ══════════ الروابط والموافقات: مسار الرحلة · الروابط · الرسائل ══════════ */
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
function lnkView(x, s) {
  var J = journey(x); if (J.st === 'load') return [wait()]; if (J.st === 'err' || !J.v || J.v.ok === false) return [warnBox('تعذّرت قراءة الرحلة.')];
  var v = J.v;
  if (s === 'links') {
    var L = (v.links || []).filter(function (l) { return !l.preview; });
    return [blk('الروابط', 'link', [L.length ? el('div', { class: 'eg12-tw' }, [el('table', { class: 'eg11-tbl' }, [el('thead', {}, [el('tr', {}, ['الرابط', 'أُنشئ', 'فتحه العميل', 'التحقق', 'الحالة'].map(function (h) { return el('th', { scope: 'col', text: h }); }))]),
      el('tbody', {}, L.slice().reverse().map(function (l) { return el('tr', {}, [el('td', { text: ({ journey: 'الرابط الواحد', elig: 'الأهلية', quote: 'عرض السعر', purchase: 'الفاتورة', contract: 'العقد' })[l.purpose] || l.purpose }), el('td', { text: when(l.created_at) }), el('td', { text: l.opened_at ? when(l.opened_at) : 'لم يُفتح' }), el('td', { text: l.factor === 'whatsapp' ? 'واتساب' : l.factor === 'email' ? 'البريد' : '—' }),
        el('td', {}, [l.decision === 'replaced' ? pill('مُغلق', 'off') : l.used_at ? pill('استُخدم', 'ok') : new Date(l.expires_at) < new Date() ? pill('منتهي', 'off') : pill('صالح', 'info')])]); }))])]) : hint('لا روابط بعد.')])];
  }
  if (s === 'sends') {
    var S = (v.sends || []).slice().reverse();
    return [blk('الرسائل المرسلة', 'envelope-simple', [S.length ? el('div', { class: 'ela-rows' }, S.map(function (m) { return el('div', { class: 'ela-row' }, [el('div', { class: 'ela-b' }, [el('b', { text: (KEY_L[m.key] || m.key) + (m.kind === 'preview' ? ' (معاينة' + (m.by ? ' — ' + m.by : '') + ')' : m.kind === 'held' ? ' (محجوزة)' : '') }),
      el('small', { text: when(m.at) + ' · واتساب: ' + (WA_L[m.wa_status] || m.wa_status || (m.info && m.info.wa) || '—') + ' · البريد: ' + (m.mail_status === 'sent' ? 'أُرسل' : m.mail_status || '—') })])]); })) : hint('لم تُرسل رسائل بعد.')])];
  }
  var E = events(x, v);
  return [blk('مسار رحلة العميل', 'path', [el('ol', { class: 'eg12-tl ela-tl' }, E.map(function (e) { return el('li', { class: 'is-d is-' + e.tone }, [el('b', { text: e.t }), el('small', { text: when(e.at) + (e.sub ? ' · ' + e.sub : '') })]); }))])];
}

/* ── الواجهة للمنصة ── */
function safe(fn) { try { return fn(); } catch (e) { try { console.warn('[elig-ask]', e); } catch (y) { void y; } return [warnBox('تعذّر عرض هذا القسم — حدّث الصفحة.')]; } }
function bind() {
  var T = window.__teraApp; if (!T) return false;
  T.eligAsk = function (x, sub, paint) { ST.paint = paint; return safe(function () { return sub === 'hist' ? askHist(x) : sub === 'why' ? askWhy() : askNow(x); }); };
  T.eligLnk = function (x, sub, paint) { ST.paint = paint; return safe(function () { return lnkView(x, sub); }); };
  T.eligAskN = function (x) { return hist(x).length; };
  return true;
}
if (!bind()) { var n = 0, t = setInterval(function () { if (bind() || ++n > 60) clearInterval(t); }, 250); }
})();
