/* v913: مسار الطلب تحت اسم العميل · التحديث يبقي الطلب والتبويب · الطلب يفتح على «الطلب» · الطيّ يثبت · تبويبات ثابتة بلا تداخل ·
 * تبويبا «الضمانات» (مع طلب الاستكمال) و«المراسلات والمرفقات» (ردود جاهزة · ملاحظة داخلية · مرفقات) · الردود الجاهزة وأنواع المطلوبات في الإعدادات. */
/* v893: محرّر صفحة العميل للرابط وحده — العنوان والتمهيد والإقرار والأقسام والمنشأة من «المستند» (تُعرض للقراءة في بطاقة «المحتوى من المستند»)، وأُزيلت «الأقسام المضافة» وخطوة «الهوية». */
/* v892: رقم جديد لقالب الرابط — نسخة 891 حُفظت في الشبكة قديمةً أثناء النشر. */
/* v891: ألوان صفحة العميل ثابتة من هوية المستند — خطوة «الهوية» تعرض العيّنات للقراءة فقط. */
/* v890: «صفحة العميل» رحلة واحدة — شريط الخطوات (رمز التحقق ← العرض ← تأكيد الموافقة ← الملحق والتوقيع ← تأكيد التوقيع ← التنفيذ والتقييم · الاعتذار · الهوية)، إعدادات الخطوة فقط، والمحتوى من «المستند»، والمعاينة تفاعلية. */
/* v876: «البنود والحسبة» بتصميم جديد — البنود بطاقات تتكيّف مع العرض (مفاتيح بدل القوائم المنسدلة)، قائمة «إضافة بند» بأيقونات وحالة «مُضاف»، والملخص المالي بلا تكرار.
* v873: تبويب «البنود والحسبة» — جدول بنود بأعمدة الضريبة والإجمالي والمجموع، التوزيع والجدولة خيارات واضحة، الملخص المالي وحده جانبًا،
* و«إضافة بند» تعرض أيضًا البنود المالية العامة (fee_charge_items).
* v872: «تغطية الضمانات» بطاقة بعرض العمود الرئيسي (جدولا الالتزام والضمانات، العقود الخمسة الأولى ثم «عرض الكل»).
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
/* v946: الوحدة نفسها لنوعين — «طلبات تأجيل دفعة» و«طلبات توحيد العقود» — بالمكوّنات نفسها، ولكل نوع ما يخصه فقط (MG) */
function BOOT(KEY, KIND, TITLE, PICON) {
/* المفتاح يبدأ بـ cu- ليُعامل صفحةً من صفحات الإدارة (رأس الصفحة والمسار)، وأصله «العملاء» كطلبات الخدمات */
var UP = 'cu', SK = KIND === 'defer' ? 'crq.at' : 'crq.at.' + KIND;
/* v946: نصوص الوحدة نفسها لطلبات التوحيد — تُبدَّل كلمات التأجيل والملحق عند الرسم (W)، وقالب «عقد توحيد العقود» الافتراضي (mgT) */
var MGW = [[/ملحق تأجيل الدفعة/g, 'عقد توحيد العقود'], [/طلبات تأجيل دفعة/g, 'طلبات توحيد العقود'], [/طلب تأجيل دفعة/g, 'طلب توحيد العقود'], [/طلب تأجيل جديد/g, 'طلب توحيد جديد'], [/جدول الدفعات قبل التأجيل/g, 'العقود المُوحَّدة'], [/قيمة العقد قبل التأجيل وبعده/g, 'قيمة العقد الموحّد'], [/جدول الدفعات الجديد بعد التأجيل/g, 'جدول الدفعات الجديد'], [/رسوم التأجيل/g, 'رسوم التوحيد'], [/رسم التأجيل/g, 'رسم التوحيد'], [/مدة التأجيل/g, 'مدة خطة الدفع'], [/تأجيل الدفعة/g, 'توحيد العقود'], [/تأجيل دفعة/g, 'توحيد العقود'], [/التأجيل/g, 'التوحيد'], [/تأجيل/g, 'توحيد'], [/الملحقات/g, 'العقود'], [/الملحق/g, 'عقد التوحيد'], [/ملحق/g, 'عقد توحيد'], [/المؤجَّلة/g, 'المُوحَّدة'], [/المؤجلة/g, 'المُوحَّدة']];
function W(t) { if (KIND !== 'merge' || typeof t !== 'string' || !/تأجيل|ملحق|المؤج/.test(t)) return t; MGW.forEach(function (m) { t = t.replace(m[0], m[1]); }); return t; }
var MGD = { title: 'عقد توحيد العقود', pill: 'عقد توحيد', en: 'CONTRACTS CONSOLIDATION',
intro: 'يوحّد هذا المستند العقودَ المذكورة فيه في عقد واحد بخطة دفع واحدة، وفق ما وافق عليه الطرف الثاني.',
ack: 'أقرّ أنا الطرف الثاني بأنني اطّلعت على هذا المستند ووافقت على توحيد العقود المذكورة فيه، وعلى قيمة العقد الموحّد وخطة الدفع الواردة فيه، وأن العقود السابقة تُغلق بعد توقيعي وتُسجَّل دفعاتها المتبقية مسدَّدة بالتوحيد.',
terms: ['يحلّ العقد الموحّد محل العقود المذكورة في هذا المستند، وتُغلق تلك العقود بعد توقيعه وتُسجَّل دفعاتها المتبقية «مسدَّدة بالتوحيد».', 'تتكوّن قيمة العقد الموحّد من المتبقي على العقود السابقة، وقيمة المنتج الإضافي وضريبته إن وُجد، ورسوم التوحيد الواردة في هذا المستند.', 'يلتزم الطرف الثاني بسداد الدفعات في مواعيدها الواردة في جدول الدفعات الجديد.', 'تُعدّ الدفعة متأخرة من اليوم الأول بعد موعد استحقاقها.', 'لا يسري هذا المستند إلا بعد توقيع الطرف الثاني عليه إلكترونيًا.'],
tt: { parties: 'أطراف العقد', summary: 'موضوع العقد', decision: 'طلبك وقرار الفريق', defer: 'تفاصيل قيمة العقد الموحّد', fees: 'خطة الدفع', contract: 'قبل التوحيد وبعده', sched: 'جدول الدفعات', terms: 'الشروط والأحكام', sign: 'إقرار الطرف الثاني وتوقيعه' } };
function mgT(t) { t = t && typeof t === 'object' ? t : {}; return Object.assign({}, MGD, t, { tt: Object.assign({}, MGD.tt, t.tt || {}), show: Object.assign({ ids: false }, t.show || {}) }); }

var NS = 'http://www.w3.org/2000/svg';
var IC = {
mvUp: 'M12 19V5M6 11l6-6 6 6', mvDn: 'M12 5v14M6 13l6 6 6-6',
plus: 'M12 5v14M5 12h14', lt: 'M15 6l-6 6 6 6', minus: 'M5 12h14', chev: 'M6 9l6 6 6-6', mail: 'M4 6h16v12H4zM4 7l8 6 8-6', idc: 'M4 5h16v14H4zM8 10h.01M12 10h4M8 14h8', cal: 'M5 6h14v14H5zM5 10h14M9 4v4M15 4v4', note: 'M6 4h12v16H6zM9 9h6M9 13h6M9 17h3', box: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8', back: 'M15 6l-6 6 6 6', more: 'M5 12h.01M12 12h.01M19 12h.01', check: 'M5 12.5l4.5 4.5L19 7.5',
send: 'M4 12l16-8-6 16-3-7-7-1z', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', file: 'M14 3H6v18h12V7l-4-4zM14 3v4h4',
clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', eyeOff: 'M3 3l18 18M10.6 5.1A10.7 10.7 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.2 3.9M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7a9.8 9.8 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2', list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
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
Object.keys(a || {}).forEach(function (k) { var v = a[k]; if (v == null || v === false) return; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = W(v); else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v); else if (k === 'value') n.value = v; else if (k === 'checked') n.checked = !!v; else if (k === 'selected') n.selected = !!v; else n.setAttribute(k, v === true ? '' : k === 'title' || k === 'aria-label' ? W(v) : v); });
(kids || []).forEach(function add(c) { if (c == null || c === false) return; if (Array.isArray(c)) { c.forEach(add); return; } /* v1142 */ n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(W(String(c))) : c); });
return n;
}
function btn(label, o) { o = o || {}; var b = el('button', { type: 'button', class: 'cr-btn' + (o.cls ? ' ' + o.cls : ''), disabled: o.disabled, title: o.title, 'data-live-ok': '', onclick: o.on }, [o.ic ? icon(o.ic) : null, label]); return b; }
function money(x) { var n = Math.round((Number(x) || 0) * 100) / 100; return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function day(d) { if (!d) return '—'; try { var s0 = String(d); if (s0.length > 10 && !isNaN(Date.parse(s0))) s0 = new Date(s0).toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' }); /* v1000: تاريخ الحدث بتوقيت الرياض */ return new Date(s0.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return String(d); } }
function at(t) { if (!t) return '—'; try { return new Date(t).toLocaleString('ar-SA-u-ca-gregory-nu-latn', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return String(t); } }
function rel(t) { if (!t) return '—'; var d = (Date.now() - new Date(t).getTime()) / 6e4; if (!(d >= 0)) return at(t); if (d < 1) return 'الآن'; if (d < 60) { var m = Math.round(d); return 'قبل ' + (m === 1 ? 'دقيقة' : m === 2 ? 'دقيقتين' : m <= 10 ? m + ' دقائق' : m + ' دقيقة'); }
var h = Math.round(d / 60); if (h < 24) return 'قبل ' + (h === 1 ? 'ساعة' : h === 2 ? 'ساعتين' : h <= 10 ? h + ' ساعات' : h + ' ساعة'); var n = Math.round(h / 24); if (n < 7) return n === 1 ? 'أمس' : 'قبل ' + (n === 2 ? 'يومين' : n + ' أيام'); return day(t); }
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

/* v912: شاشة تأكيد واضحة لكل إجراء (تم · تعذّر) في وسط الشاشة فوق كل شيء — كانت رسالة صغيرة أعلى الصفحة لا يراها الموظف وهو أسفلها.
 * النجاح يُغلق وحده بعد 4 ثوانٍ أو بـ«حسنًا»، والخطأ يبقى حتى يُغلقه الموظف. */
function toast(ok, t) {
/* v1125: 'warn' — نُفّذ الإجراء ولم تصل الرسالة عبر كل الوسائل: عنوان «تم — مع تنبيه» بلون التنبيه، ولا يُغلق تلقائيًا */
var wn = ok === 'warn'; if (wn) ok = false;
var old = document.getElementById('cr-pop'); if (old && old.parentNode) old.parentNode.removeChild(old);
var box, esc = function (e) { if (e.key === 'Escape') close(); };
var close = function () { document.removeEventListener('keydown', esc); if (box && box.parentNode) { box.style.opacity = '0'; setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 160); } };
var okB = el('button', { type: 'button', 'data-live-ok': '', style: 'margin-top:14px;min-width:120px;padding:10px 22px;border:0;border-radius:12px;font:inherit;font-weight:800;font-size:14px;cursor:pointer;color:#fff;background:' + (ok ? '#0b2552' : wn ? '#B45309' : '#B42318'), onclick: function () { close(); } }, ['حسنًا']);
box = el('div', { id: 'cr-pop', dir: 'rtl', role: ok ? 'status' : 'alertdialog', 'aria-live': 'assertive', 'aria-label': ok ? 'تم' : wn ? 'تم — مع تنبيه' : 'تعذّر الإجراء', style: 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(11,37,82,.38);transition:opacity .16s;font-family:inherit', onclick: function (e) { if (e.target === box) close(); } },
[el('div', { style: 'width:min(400px,100%);padding:26px 22px 22px;border-radius:20px;background:#fff;color:#0b2552;text-align:center;box-shadow:0 24px 60px -20px rgba(11,37,82,.55)' }, [
el('span', { 'aria-hidden': 'true', style: 'display:inline-grid;place-items:center;width:58px;height:58px;border-radius:50%;font-size:30px;font-weight:900;color:#fff;background:' + (ok ? '#1F9D6B' : wn ? '#B45309' : '#B42318'), text: ok ? '✓' : '!' }),
el('b', { style: 'display:block;margin-top:12px;font-size:19px;font-weight:900', text: ok ? 'تم' : wn ? 'تم — مع تنبيه' : 'تعذّر الإجراء' }),
el('p', { style: 'margin:8px 0 0;font-size:14.5px;line-height:1.8;color:#33415c', text: t }), okB])]);
document.body.appendChild(box); document.addEventListener('keydown', esc); try { okB.focus({ preventScroll: true }); } catch (e) { }
if (ok) setTimeout(function () { if (document.getElementById('cr-pop') === box) close(); }, 4000);
}
async function loadList() {
try { var j = await api('GET', '/admin/api/crq?kind=' + KIND); ST.rows = j.rows || []; navBack(ST.rows.filter(function (r) { return r.back; }).length); ST.states = j.states || []; ST.settings = j.settings || null; ST.sup = !!j.super; ST.me = j.me; ST.err = ''; ST.ready = true; }
catch (e) { ST.ready = e.code !== 'not_ready'; ST.err = ST.ready ? e.message : ''; ST.rows = ST.rows || []; }
draw();
}
/* v913: يفتح الطلب على «الطلب» دائمًا (أو على التبويب المحفوظ بعد التحديث)، ويُحفظ الطلب والتبويب والدرج المفتوح فلا يُخرج التحديث الموظف منها */
async function open(id, tab) {
ST.id = id; ST.x = null; ST.tab = tab || 'req'; ST.ask = null; keep(); draw(); toTop();
try { var j = await api('GET', '/admin/api/crq/' + id); ST.x = j.req; } catch (e) { ST.err = e.message; ST.id = null; keep(); }
draw();
}
function keep() { try { if (ST.id) sessionStorage.setItem(SK, JSON.stringify({ id: ST.id, tab: ST.tab, doc: ST.docOpen || '', lpk: ST.lpk || '' })); else sessionStorage.removeItem(SK); } catch (e) { void e; } }
function restore() {
try {
var n = JSON.parse(sessionStorage.getItem('crq.nav') || 'null');
if (n && n.id && (n.kind || 'defer') === KIND) { sessionStorage.removeItem('crq.nav'); ST.rows = ST.rows || null; open(n.id, n.tab || 'req'); return true; }
if (ST.id) return false;
var s = JSON.parse(sessionStorage.getItem(SK) || 'null');
if (s && s.id) { if (s.doc) ST.docOpen = s.doc; if (s.lpk) ST.lpk = s.lpk; open(s.id, s.tab || 'req'); return true; }
} catch (e) { void e; }
return false;
}
function back() { ST.id = null; ST.x = null; ST.ask = null; keep(); draw(); toTop(); loadList(); }
function toTop() { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); } }
async function reload() { if (!ST.id) return loadList(); try { var j = await api('GET', '/admin/api/crq/' + ST.id); ST.x = j.req; } catch (e) { toast(false, e.message); } draw(); }
/* طلب تأجيل نُفّذ قبل المنظومة (نُقل بالهجرة stf_269): نُقلت دفعته إلى عقد آخر — لا حسبة ولا ملحق، للسجل فقط */
function legacy(x) { return !!(x && x.executed_ref && x.executed_ref.legacy); }
function defaultTab(x) { if (legacy(x)) return 'req'; return x.state === 'received' || x.state === 'decision' ? (x.result && x.result.ok ? 'calc' : 'req') : x.state === 'done' || x.state === 'closed' ? 'log' : 'page'; }
function editable(x) { return x && (x.state === 'received' || x.state === 'decision') && !x.need_approval; }

/* ═════════ القائمة ═════════ */
/* بطاقات المؤشرات هي الفلتر الوحيد: لا شريط حالات آخر ولا ملخص مكرر */
/* ═════════ v1127: أين وقفت المعاملة ومن عليه الدور — مصدر واحد للقائمة والرأس
* المراحل: الطلب · قرار الفريق · موافقة العميل · التوقيع · التنفيذ — والدور: الفريق · المشرف العام · العميل ═════════ */
function stageOf(r) { return r.state === 'received' ? 0 : r.state === 'decision' ? 1 : r.state === 'consent' ? 2 : r.state === 'sign' ? (r.signed_at ? 4 : 3) : r.state === 'done' ? 5 : -1; }
function turnOf(r) {
var sup = ST.sup || (r.me && r.me.super), w = r.wait || (r.chat && r.chat.wait);
if (r.state === 'closed') return ['off', 'مغلق', r.close_t || ''];
if (r.state === 'done') return ['ok', 'نُفّذ', 'اكتمل الطلب'];
if (r.exec_error && r.exec_error !== 'await_admin') return ['bad', 'دور الفريق', 'تعذّر التنفيذ — راجعه'];
if (r.exec_error === 'await_admin') return ['boss', 'دور المشرف العام', 'تنفيذ التوحيد وإغلاق العقود'];
if ((r.state === 'received' || r.state === 'decision') && w) return ['cli', 'دور العميل', 'استكمال المطلوب منه'];
if (r.back) return ['me', 'دور الفريق', 'أكمل العميل المطلوب — راجعه'];
if (r.state === 'received' || r.state === 'decision') return r.need_approval ? (sup ? ['me', 'دورك', 'اعتماد العرض'] : ['boss', 'دور المشرف العام', 'اعتماد العرض']) : ['me', 'دور الفريق', r.state === 'received' ? 'دراسة الطلب' : 'إكمال الحسبة والقرار'];
if (r.state === 'consent') return ['cli', 'دور العميل', 'الموافقة على العرض'];
if (r.state === 'sign') return ['cli', 'دور العميل', 'توقيع الملحق'];
return ['off', r.state_t || '', ''];
}
var PIPE = [['open', 'المفتوحة', 'inbox'], ['team', 'دور الفريق', 'team'], ['appr', 'بانتظار الاعتماد', 'sign'], ['client', 'دور العميل', 'wait'], ['done', 'نُفّذت', 'ok'], ['closed', 'مغلقة', 'x'], ['all', 'الكل', 'sum']];
function fit(r, f) {
var t = turnOf(r)[0];
return f === 'all' ? true : f === 'open' ? r.state !== 'done' && r.state !== 'closed' : f === 'team' ? t === 'me' || t === 'bad' : f === 'appr' ? !!r.need_approval && (r.state === 'received' || r.state === 'decision') : f === 'client' ? t === 'cli' : r.state === f;
}
/* شريط المراحل المصغّر في صف القائمة — النقطة الحالية بلون الدور */
function miniPath(r) { var cur = r.state === 'closed' ? -1 : stageOf(r), t = turnOf(r);
return el('div', { class: 'q-mp is-' + t[0] }, [el('ol', { 'aria-hidden': 'true' }, STEPS.map(function (s, i) { return el('li', { class: i < cur ? 'is-done' : i === cur ? 'is-cur' : '' }); })),
el('div', { class: 'q-mp-t' }, [el('b', { text: r.state === 'closed' ? 'مغلق' : r.state === 'done' ? 'نُفّذ' : STEPS[Math.max(0, Math.min(cur, 4))] }), el('span', { text: t[0] === 'off' || t[0] === 'ok' ? (t[2] || '') : t[1] + (t[2] ? ' · ' + t[2] : '') })])]); }
function initial(s) { var t = String(s || '').trim(); return t ? t.charAt(0) : '؟'; }
function listView() {
var rows = ST.rows || [];
var L = rows.filter(function (r) { return fit(r, ST.f) && (!ST.mine || r.assigned_to === ST.me || (ST.sup && r.need_approval)) && (!ST.q || (r.no + ' ' + r.client + ' ' + r.contract_no).indexOf(ST.q) >= 0); });
if (!ST.ready) return [el('section', { class: 'cr-card' }, [el('div', { class: 'cr-empty is-warn' }, [el('i', {}, [icon('gear')]), el('b', { text: 'منظومة طلبات العقود لم تُفعَّل بعد' }),
el('span', { class: 'cr-hint', text: 'تظهر الطلبات هنا بعد تطبيق هجرة قاعدة البيانات stf_268 — لا يلزم أي إجراء آخر.' }), btn('إعادة المحاولة', { cls: 'is-sm', on: function () { ST.rows = null; draw(); loadList(); } })])])];
var kpis = el('nav', { class: 'q-pipe', role: 'tablist', 'aria-label': 'تصفية الطلبات حسب المرحلة والدور' }, PIPE.map(function (k) { /* v1127: شريط سير بدل البطاقات */
var n = rows.filter(function (r) { return fit(r, k[0]); }).length;
return el('button', { type: 'button', role: 'tab', 'aria-selected': ST.f === k[0] ? 'true' : 'false', class: 'q-pipe-i is-' + k[0] + (ST.f === k[0] ? ' is-on' : '') + (n ? '' : ' is-0'), 'data-live-ok': '', onclick: function () { ST.f = k[0]; draw(); } },
[icon(k[2]), el('span', { text: k[1] }), el('b', { text: ST.rows ? String(n) : '—' })]); }));
var tools = el('div', { class: 'cr-ltb' }, [
el('label', { class: 'cr-lq' }, [icon('search'), el('input', { type: 'search', value: ST.q, placeholder: 'ابحث برقم الطلب أو اسم العميل أو رقم العقد…', 'aria-label': 'بحث', oninput: function (e) { ST.q = e.target.value.trim(); var p = e.target.selectionStart; draw(); var i = R.querySelector('.cr-lq input'); if (i) { i.focus(); try { i.setSelectionRange(p, p); } catch (er) { void er; } } } })]),
el('div', { class: 'cr-seg', role: 'group', 'aria-label': 'النطاق' }, [['', 'كل الفريق'], ['me', ST.sup ? 'المسند إليّ وبانتظار اعتمادي' : 'المسند إليّ']].map(function (o) {
return el('button', { type: 'button', class: (!!o[0] === ST.mine) ? 'is-on' : '', 'aria-pressed': (!!o[0] === ST.mine) ? 'true' : 'false', 'data-live-ok': '', onclick: function () { ST.mine = !!o[0]; draw(); } }, [o[1]]); })),
ST.sup ? btn('الإعدادات', { ic: 'gear', cls: ST.set ? 'is-on' : '', on: function () { ST.set = ST.set ? null : { load: true }; ST.create = null; draw(); if (ST.set) loadSettings(); } }) : null,
btn('طلب تأجيل جديد', { ic: 'plus', cls: 'is-pri', on: function () { ST.create = ST.create ? null : { q: '', clients: null }; ST.set = null; draw(); if (ST.create) loadClients(); } })]);
/* v1127: صف الطلب — العميل والأرقام · أين وقفت المعاملة ومن عليه الدور · المسند إليه · آخر تحديث */
var head = el('div', { class: 'q-lr is-h' }, ['العميل', 'أين وقف الطلب', 'المسند إليه', 'آخر تحديث', ''].map(function (h) { return el('span', { text: h }); }));
var body = !ST.rows ? el('div', { class: 'cr-load', text: 'جارٍ التحميل…' })
: !rows.length ? el('div', { class: 'cr-empty' }, [el('i', {}, [icon('inbox')]), el('b', { text: 'لا طلبات بعد' }), el('span', { class: 'cr-hint', text: 'تظهر هنا طلبات العملاء من حساباتهم والطلبات التي ينشئها الفريق.' })])
: !L.length ? el('div', { class: 'cr-empty' }, [el('i', {}, [icon('search')]), el('b', { text: ST.q ? 'لا نتائج لهذا البحث' : 'لا طلبات في «' + (PIPE.filter(function (k) { return k[0] === ST.f; })[0] || ['', ''])[1] + '» الآن' }), rows.length && ST.f !== 'all' ? btn('عرض كل الطلبات', { cls: 'is-sm', on: function () { ST.f = 'all'; ST.q = ''; draw(); } }) : null])
: el('div', { class: 'q-lt' }, [head].concat(L.map(function (r) {
var t = turnOf(r);
return el('div', { class: 'q-lr is-' + t[0], role: 'button', tabindex: '0', 'aria-label': 'فتح طلب ' + (r.client || '') + ' ' + (r.no || ''), 'data-live-ok': '', onclick: function () { open(r.id); }, onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(r.id); } } }, [
el('div', { class: 'q-who' }, [el('span', { class: 'cr-av', 'aria-hidden': 'true', text: initial(r.client) }), el('div', {}, [el('b', { text: r.client || '—', title: r.client || '' }), el('small', {}, [r.contract_no ? el('span', {}, ['العقد ', ltr(r.contract_no)]) : null, el('span', {}, [ltr(r.no)])])])]),
miniPath(r),
el('span', { class: 'q-lr-as' + (r.assigned_t ? '' : ' is-0'), text: r.assigned_t || 'غير مسند' }),
el('span', { class: 'q-lr-at', title: at(r.updated_at) }, [rel(r.updated_at)]),
el('span', { class: 'q-lr-go', 'aria-hidden': 'true' }, [icon('lt')])]);
})));
var foot = ST.rows && rows.length ? el('div', { class: 'cr-lf', text: 'عرض ' + L.length + ' من ' + rows.length + ' طلبًا' }) : null;
return [kpis, tools, ST.set ? settingsPanel() : null, ST.create ? createPanel() : null, ST.err ? note('bad', ST.err) : null, body, foot];
}
function badge(r) { return el('span', { class: 'cr-badge is-' + (r.tone || 'info'), text: r.state === 'closed' && r.close_t ? 'مغلق · ' + r.close_t : r.state_t }); }
function note(k, t, kids) { return el('div', { class: 'cr-note is-' + k, role: k === 'bad' ? 'alert' : 'status' }, [icon(k === 'ok' || k === 'back' ? 'check' : 'alert'), el('div', {}, [el('b', { text: t })].concat(kids || []))]); }

/* إنشاء طلب من الفريق: العميل ← العقد ← الدفعة */
async function loadClients() { try { var j = await api('GET', '/admin/api/clients'); ST.create.clients = (j.reg || []).filter(function (c) { return c.status === 'active'; }); } catch (e) { ST.create.err = e.message; ST.create.clients = []; } draw(); }
async function loadOpts(uid) { ST.create.uid = uid; ST.create.opts = null; draw(); try { var j = await api('GET', '/admin/api/crq-options/' + uid); ST.create.opts = j.contracts || []; } catch (e) { ST.create.err = e.message; } draw(); }
/* v880: إنشاء طلب — ثلاث خطوات واضحة: العميل (بحث) ← العقد ← الدفعة */
function createPanel() { return KIND === 'merge' ? MG.createPanel() : createPanel0(); } /* v946 */
function createPanel0() {
var C = ST.create, cl = C.clients || [], cur = cl.filter(function (c) { return c.id === C.uid; })[0];
var o = (C.opts || []).filter(function (x) { return x.no === C.no; })[0], step = !cur ? 1 : !o ? 2 : 3;
var stp = el('ol', { class: 'cr-nw-st' }, [['العميل', 1], ['العقد', 2], ['الدفعة', 3]].map(function (t) { return el('li', { class: step > t[1] ? 'is-done' : step === t[1] ? 'is-cur' : '' }, [el('i', {}, [step > t[1] ? icon('check') : ltr(String(t[1]))]), t[0]]); }));
var sec = function (n, title, kids, done) { return el('div', { class: 'cr-nw-s' + (done ? ' is-done' : '') }, [el('div', { class: 'cr-nw-sh' }, [el('span', { class: 'cr-nw-n' }, [done ? icon('check') : ltr(String(n))]), el('b', { text: title })])].concat(kids)); };
var parts = [];
/* 1) العميل */
if (cur) parts.push(sec(1, 'العميل', [el('div', { class: 'cr-nw-pk' }, [el('span', { class: 'cr-av', text: initial(cur.name) }), el('div', {}, [el('b', { text: cur.name }), el('small', {}, [cur.phone ? ltr(cur.phone) : '', cur.no ? el('span', {}, [' · ', ltr(cur.no)]) : null])]),
el('button', { type: 'button', class: 'cr-nw-ch', 'data-live-ok': '', onclick: function () { C.uid = null; C.opts = null; C.no = null; C.pids = []; draw(); var i = R.querySelector('.cr-nw-q input'); if (i) i.focus(); } }, ['تغيير'])])], true));
else {
var q = String(C.q || '').trim(), hits = cl.filter(function (c) { return !q || (c.name + ' ' + (c.phone || '') + ' ' + (c.no || '')).indexOf(q) >= 0; });
parts.push(sec(1, 'اختر العميل', [
el('label', { class: 'cr-lq cr-nw-q' }, [icon('search'), el('input', { type: 'search', value: C.q || '', placeholder: 'ابحث بالاسم أو الجوال أو رقم العميل…', 'aria-label': 'بحث عن عميل', oninput: function (e) { C.q = e.target.value; var p = e.target.selectionStart; draw(); var i = R.querySelector('.cr-nw-q input'); if (i) { i.focus(); try { i.setSelectionRange(p, p); } catch (er) { void er; } } } })]),
!C.clients ? el('div', { class: 'cr-load', text: 'جارٍ تحميل العملاء…' })
: el('div', { class: 'cr-nw-l', role: 'listbox', 'aria-label': 'العملاء' }, hits.length ? hits.slice(0, 40).map(function (c) {
return el('button', { type: 'button', role: 'option', class: 'cr-nw-c', 'data-live-ok': '', onclick: function () { C.q = ''; C.no = null; C.pids = []; loadOpts(c.id); } }, [el('span', { class: 'cr-av', text: initial(c.name) }), el('span', { class: 'cr-nw-ct' }, [el('b', { text: c.name }), el('small', {}, [c.phone ? ltr(c.phone) : '—', c.no ? el('span', {}, [' · ', ltr(c.no)]) : null])]), icon('lt')]); })
: [el('p', { class: 'cr-pop-0', text: 'لا عميل بهذا البحث.' })]),
C.clients && hits.length > 40 ? el('small', { class: 'cr-hint', text: 'يظهر أول 40 — دقّق البحث لتضييق النتائج.' }) : null]));
}
/* 2) العقد */
if (cur) {
if (!C.opts) parts.push(sec(2, 'اختر العقد', [el('div', { class: 'cr-load', text: 'جارٍ تحميل العقود…' })]));
else if (!C.opts.length) parts.push(sec(2, 'العقد', [note('warn', 'لا عقود مفتوحة بدفعات مستحقة لهذا العميل.')]));
else parts.push(sec(2, o ? 'العقد' : 'اختر العقد', [el('div', { class: 'cr-nw-k', role: 'radiogroup', 'aria-label': 'العقود' }, C.opts.map(function (k) {
var on = C.no === k.no, n = (k.payments || []).length;
return el('label', { class: 'cr-opt cr-nw-o' + (on ? ' is-on' : '') + (k.busy ? ' is-ro' : '') }, [el('input', { type: 'radio', name: 'crq-nw-k', value: k.no, checked: on, disabled: !!k.busy, onchange: function () { C.no = k.no; C.pids = []; draw(); } }),
el('span', {}, [el('b', {}, [ltr(k.no)]), el('small', { text: (k.product || 'عقد') + ' · ' + n + (n === 1 ? ' دفعة مستحقة' : ' دفعات مستحقة') }), k.busy ? el('em', { class: 'cr-py-s is-warn', text: 'عليه طلب مفتوح ' + k.busy }) : null])]); }))], !!o));
}
/* 3) الدفعة واقتراح العميل — الجزء نفسه في حساب العميل (CRQC.picker)، فلا يختلف الشكل ولا المحتوى (v909) */
if (o) {
var selP = (o.payments || []).filter(function (p) { return (C.pids || []).indexOf(p.pid) >= 0; }), selAmt = selP.reduce(function (a, p) { return a + (Number(p.amount) || 0); }, 0);
parts.push(sec(3, 'الدفعة واقتراح العميل', [window.CRQC && window.CRQC.picker ? window.CRQC.picker({ S: C, contract: o, today: C.today, paint: draw, staff: true }) : note('warn', 'تعذّر تحميل جزء الدفعات — حدّث الصفحة.')], selP.length > 0));
}
var ready = !!(cur && o && C.pids && C.pids.length);
return el('section', { class: 'cr-card cr-nw' }, [
el('div', { class: 'cr-nw-h' }, [el('span', { class: 'cr-nw-ic' }, [icon('plus')]), el('div', {}, [el('h2', { text: 'طلب تأجيل جديد' }), el('small', { text: 'يُنشأ باسم الفريق ثم يُكمَل من صفحة الطلب.' })]),
el('button', { type: 'button', class: 'cr-pop-x', 'aria-label': 'إغلاق', 'data-live-ok': '', onclick: function () { ST.create = null; draw(); } }, [icon('x')])]),
stp].concat(parts, [C.err ? note('bad', C.err) : null,
el('div', { class: 'cr-nw-f' }, [ready ? el('span', { class: 'cr-nw-sum' }, [el('small', { text: selP.length === 1 ? 'دفعة واحدة' : selP.length + ' دفعات' }), el('b', {}, [ltr(money(selAmt)), ' ر.س'])]) : el('small', { class: 'cr-hint', text: step === 1 ? 'ابدأ باختيار العميل.' : step === 2 ? 'اختر العقد.' : 'حدّد دفعة واحدة على الأقل.' }),
el('div', { class: 'cr-acts' }, [btn('إلغاء', { on: function () { ST.create = null; draw(); } }), btn(ST.busy ? 'جارٍ الإنشاء…' : 'إنشاء الطلب', { ic: 'check', cls: 'is-pri', disabled: !ready || ST.busy, on: async function () {
var m = window.CRQC && window.CRQC.check ? window.CRQC.check(C) : []; if (m.length) { C.miss = m; draw(); var f = R.querySelector('.cr-nw .is-miss'); if (f) f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
var pl = window.CRQC.payload(C);
ST.busy = true; draw();
try { var j = await api('POST', '/admin/api/crq', { user_id: C.uid, contract_no: C.no, payment_ids: pl.payment_ids, note: pl.note, prop: pl.prop, kind: KIND }); ST.create = null; ST.busy = false; await loadList(); open(j.id); toast(true, 'أُنشئ الطلب ' + (j.no || '') + ' وأُضيف إلى القائمة.'); }
catch (e) { ST.busy = false; C.err = e.message; draw(); }
} })])])]));
}
function field(label, ctl, hint) { return el('div', { class: 'cr-field' }, [el('label', { text: label }), ctl, hint ? el('small', { text: hint }) : null]); }

/* إعدادات التأجيل (المشرف العام): مدة الرابطين — النصوص والألوان والبنود من مصادرها الواحدة */
function loadSettings() { ST.set = { s: clone(ST.settings || { consent_hours: 48, sign_hours: 48 }) }; draw(); }
/* v880: الإعدادات — مدتا الرابطين بعدّاد وخيارات سريعة، ومصادر بقية الإعدادات */
function settingsPanel() {
var s = ST.set && ST.set.s; if (!s) return el('section', { class: 'cr-card' }, [el('div', { class: 'cr-load', text: 'جارٍ التحميل…' })]);
var o0 = ST.settings || {}, valid = function (v) { v = Number(v); return v >= 1 && v <= 720 && Math.floor(v) === v; };
var ok = valid(s.consent_hours) && valid(s.sign_hours), dirty = String(s.consent_hours) !== String(o0.consent_hours) || String(s.sign_hours) !== String(o0.sign_hours);
var hrs = function (k, title, desc) { var v = s[k], set = function (n) { s[k] = String(Math.max(1, Math.min(720, n))); draw(); };
var bad = !valid(v), dd = valid(v) ? (Number(v) % 24 === 0 ? (Number(v) / 24 === 1 ? 'يوم واحد' : Number(v) / 24 === 2 ? 'يومان' : Number(v) / 24 + ' أيام') : '') : '';
return el('div', { class: 'cr-set-r' + (bad ? ' is-bad' : '') }, [el('div', { class: 'cr-set-t' }, [el('b', { text: title }), el('small', { text: desc })]),
el('div', { class: 'cr-set-c' }, [el('div', { class: 'cr-stp' }, [
el('button', { type: 'button', 'aria-label': 'إنقاص', 'data-live-ok': '', disabled: Number(v) <= 1, onclick: function () { set((Number(v) || 0) - 1); } }, [icon('minus')]),
el('label', {}, [el('input', { type: 'number', inputmode: 'numeric', min: '1', max: '720', step: '1', value: v, 'aria-label': title, oninput: function (e) { s[k] = e.target.value; var p = e.target.selectionStart; draw(); var i = R.querySelector('.cr-set-r[data-k="' + k + '"] input'); if (i) i.focus(); } }), el('span', { text: 'ساعة' })]),
el('button', { type: 'button', 'aria-label': 'زيادة', 'data-live-ok': '', disabled: Number(v) >= 720, onclick: function () { set((Number(v) || 0) + 1); } }, [icon('plus')])]),
el('div', { class: 'cr-set-q' }, [24, 48, 72, 168].map(function (n) { return el('button', { type: 'button', class: Number(v) === n ? 'is-on' : '', 'data-live-ok': '', onclick: function () { set(n); } }, [n === 168 ? 'أسبوع' : n + ' س']); })),
el('small', { class: 'cr-set-m', text: bad ? 'أدخل رقمًا صحيحًا من 1 إلى 720 ساعة.' : dd ? '= ' + dd : '' })])]); };
var src = function (ic, t, path) { return el('li', {}, [el('span', { class: 'cr-pf-ic' }, [icon(ic)]), el('div', {}, [el('b', { text: t }), el('span', { class: 'cr-set-p' }, path.map(function (x, i) { return el('span', {}, [i ? el('i', { text: '‹' }) : null, x]); }))])]); };
var r1 = hrs('consent_hours', 'مدة رابط الموافقة', 'المدة المتاحة للعميل ليوافق على العرض. بانتهائها يُغلق الطلب «انتهت مدة العرض».'), r2 = hrs('sign_hours', 'مدة رابط التوقيع', 'المدة المتاحة للعميل ليوقّع الملحق بعد موافقته.');
r1.setAttribute('data-k', 'consent_hours'); r2.setAttribute('data-k', 'sign_hours');
return el('section', { class: 'cr-card cr-set' }, [
el('div', { class: 'cr-nw-h' }, [el('span', { class: 'cr-nw-ic' }, [icon('gear')]), el('div', {}, [el('h2', { text: 'إعدادات طلبات التأجيل' }), el('small', { text: 'تُطبَّق على الروابط التي تُرسل بعد الحفظ.' })]),
el('button', { type: 'button', class: 'cr-pop-x', 'aria-label': 'إغلاق', 'data-live-ok': '', onclick: function () { ST.set = null; ST.lsEd = null; draw(); } }, [icon('x')])]),
el('div', { class: 'cr-set-g' }, [r1, r2]),
el('div', { class: 'cr-set-ls' }, [el('b', { class: 'cr-rp-sh', text: 'الردود الجاهزة وأنواع المطلوبات' }), el('small', { class: 'cr-hint', text: 'قوائم منسدلة يختار منها الموظف في «المراسلات والمرفقات» عند مراسلة العميل أو طلب الاستكمال منه.' }), window.CRQC && window.CRQC.listsEditor ? (ST.lsEd || (ST.lsEd = window.CRQC.listsEditor({ toast: toast }))) : null]),
el('div', { class: 'cr-set-src' }, [el('b', { class: 'cr-rp-sh', text: 'بقية الإعدادات تُدار من مصادرها' }), el('ul', {}, [
src('file', 'المستند — ملحق تأجيل الدفعة', ['الإعدادات', 'قوالب المستندات', 'ملحق تأجيل الدفعة']),
src('phone', 'صفحتا الرابط — الألوان والنصوص والأقسام', ['الإعدادات', 'قوالب المستندات', 'عقد الشركاء', 'صفحات الرابط']),
src('list', 'بنود الرسوم الجاهزة', ['الإعدادات', 'الرسوم والضرائب والعمولات', 'بنود رسوم طلبات العقود'])])]),
el('div', { class: 'cr-nw-f' }, [el('small', { class: 'cr-hint', text: !ok ? 'صحّح القيم قبل الحفظ.' : dirty ? 'لديك تغييرات غير محفوظة.' : 'لا تغييرات.' }),
el('div', { class: 'cr-acts' }, [btn('إلغاء', { on: function () { ST.set = null; draw(); } }), btn(ST.busy ? 'جارٍ الحفظ…' : 'حفظ الإعدادات', { ic: 'check', cls: 'is-pri', disabled: !ok || !dirty || ST.busy, on: async function () {
ST.busy = true; draw(); try { await api('POST', '/admin/api/crq-settings', { consent_hours: Number(s.consent_hours), sign_hours: Number(s.sign_hours) }); ST.busy = false; ST.set = null; loadList(); toast(true, 'حُفظت الإعدادات.'); } catch (e) { ST.busy = false; toast(false, e.message); } } })])])]);
}

/* ═════════ صفحة الطلب ═════════ */
var TABS = [['req', 'الطلب', 'user'], ['calc', 'القرار والحسبة', 'calc'], ['guar', 'الضمانات', 'sign'], ['doc', 'المستند', 'file'], ['page', 'صفحة العميل', 'phone'], ['chat', 'المراسلات', 'inbox'], ['log', 'السجل', 'clock']];
/* v913: عدّاد على التبويب — ردود العميل ومرفقاته، والمطلوب المفتوح */
function tabCnt(x, k) { var c = x.chat || {}, n = k === 'chat' ? (Number(c.client_n) || 0) + (Number(c.open) || 0) : 0; /* v940: المطلوب من العميل في «المراسلات والمرفقات» */ return n ? el('em', { class: 'cr-tcnt', text: String(n) }) : null; }
function tabState(x, k) {
if (KIND === 'merge') { var mgs = MG.state(x, k); if (mgs !== undefined) return mgs; } /* v949: أقسام التوحيد */
if (k === 'req') return (KIND === 'merge' ? x.sel || [] : x.payment_ids || []).length ? 'ok' : 'miss';
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
var np = KIND === 'defer' && cliWant(x).has && !(x.calc && x.calc.pick); /* v1125: لا اعتماد قبل حسم تاريخ العميل */ if (np) ok = false;
if (sup) return btn('اعتماد وإرسال رابط الموافقة', { ic: 'send', cls: 'is-pri is-wide', disabled: !ok || ST.busy || ST.save.st === 'saving', title: np ? 'اختر الموعد الجديد أولًا في «القرار والحسبة»' : ok ? '' : 'أكمل الحسبة أولًا', on: function () { ask('اعتماد العرض وإرسال رابط الموافقة', 'يصل العميل رابط الموافقة على واتساب والبريد بمدة صلاحية ' + (x.valid_hours || (x.settings || {}).consent_hours || 48) + ' ساعة. بانتهائها يُغلق الطلب.', 'اعتماد وإرسال', function () { act('approve', { stamp: ST.x.updated_at }); }); } });
if (x.need_approval) return btn('بانتظار اعتماد المشرف العام', { ic: 'clock', cls: 'is-wide', disabled: true });
return btn('رفع للمشرف العام للاعتماد', { ic: 'send', cls: 'is-pri is-wide', disabled: !ok || ST.busy || ST.save.st === 'saving', title: np ? 'اختر الموعد الجديد أولًا في «القرار والحسبة»' : '', on: function () { act('submit', null, 'رُفع العرض للاعتماد.'); } });
}
if ((x.state === 'consent' || x.state === 'sign') && !x.signed_at) return btn('إعادة إرسال الرابط', { ic: 'send', cls: 'is-pri is-wide', disabled: ST.busy, on: function () { ask('إعادة إرسال الرابط', 'يُلغى الرابط الحالي ويصل العميل رابط جديد بمدة جديدة.', 'إعادة الإرسال', function () { act('resend', null, 'أُرسل رابط جديد للعميل.'); }); } });
if (x.state === 'sign' && x.signed_at && sup) return btn(x.exec_error === 'await_admin' ? 'تنفيذ التوحيد وإغلاق العقود' : 'إعادة محاولة التنفيذ', { ic: 'check', cls: 'is-pri is-wide', disabled: ST.busy, on: function () { var aw = x.exec_error === 'await_admin'; ask(aw ? 'تنفيذ التوحيد وإغلاق العقود' : 'إعادة محاولة التنفيذ', aw ? 'وقّع العميل عقد التوحيد مع منتج. بالتنفيذ يُنشأ العقد الموحّد وتُغلق العقود السابقة — لا يمكن التراجع.' : 'سيُعاد تنفيذ الطلب على العقد.', aw ? 'تنفيذ وإغلاق العقود' : 'إعادة التنفيذ', function () { act('exec', null, 'نُفّذ الطلب وعُدّل العقد.'); }); } });
if (x.state === 'closed' && x.close_reason === 'rejected') return btn('إعادة إرسال رسالة الاعتذار', { ic: 'send', cls: 'is-wide', disabled: ST.busy, on: function () { ask('إعادة إرسال رسالة الاعتذار', 'تصل العميل رسالة «لم يُعتمد طلبك» بالسبب نفسه' + (x.close_note ? ' («' + x.close_note + '»)' : '') + ' على واتساب والبريد والإشعار — استخدمها إن لم تصله.', 'إعادة الإرسال', function () { act('notify', null, 'أُعيدت رسالة الاعتذار.'); }); } }); /* v1125 */
if (x.state === 'done') return x.kind === 'merge' ? btn('إعادة إرسال رسالة التنفيذ', { ic: 'send', cls: 'is-wide', disabled: ST.busy, on: function () { ask('إعادة إرسال رسالة التنفيذ', 'تُعاد رسالة «تم تنفيذ طلبك» نفسها على واتساب والبريد، ومعها عقد التوحيد PDF إن اخترت «يُرفق» في المستند — استخدمها فقط إن لم تصله.', 'إعادة الإرسال', function () { act('send-doc', null, 'أُعيدت رسالة التنفيذ للعميل.'); }); } }) /* v996 */ : btn('إرسال الملحق للعميل', { ic: 'send', cls: 'is-pri is-wide', disabled: ST.busy, on: function () { ask('إرسال الملحق للعميل', 'يصل العميل الملحق PDF مع رسالة «نُفّذ طلبك» على واتساب والبريد.', 'إرسال', function () { act('send-doc', null, 'أُرسل الملحق للعميل.'); }); } });
return null;
}
/* بقية الإجراءات — ظاهرة تحت الإجراء الرئيسي (لا قائمة منسدلة) */
function moreItems(x) {
if (legacy(x)) return [];
var sup = x.me && x.me.super, L = [];
if ((x.state === 'consent' || x.state === 'sign') && (!x.signed_at || x.exec_error)) L.push(['سحب العرض وتعديله', 'undo', function () { askNote('سحب العرض وتعديله', 'يُلغى رابط العميل ويعود الطلب إلى قرار الفريق.', 'سبب السحب (اختياري)', false, function (n) { act('withdraw', { note: n }, 'سُحب العرض — عدّل ثم أعد الاعتماد.'); }); }]);
if (sup && x.state === 'decision' && x.need_approval) L.push(['إعادة للمُعِدّ للتعديل', 'undo', function () { askNote('إعادة للمُعِدّ', 'يعود العرض للمُعِدّ بملاحظتك.', 'الملاحظة', true, function (n) { act('return', { note: n }, 'أُعيد العرض للمُعِدّ.'); }); }]);
/* v882: الإسناد سطر في اللوحة (asgEl) */
/* v882: إرسال الملحق هو الإجراء الرئيسي بعد التنفيذ */
/* v882: تنزيل PDF في تبويب «المستند» وحده */
if (sup && x.state !== 'done' && x.state !== 'closed' && (!x.signed_at || x.exec_error)) L.push(['عدم الاعتماد وإغلاق الطلب', 'ban', function () { askNote('عدم اعتماد الطلب', 'يُغلق الطلب ويصل العميل السبب، ويبقى عقده كما هو.', 'السبب الذي يصل العميل', true, function (n) { act('reject', { note: n }, 'أُغلق الطلب.'); }, 280, 'اكتب السبب وحده — التحية والتوقيع في رسالة الاعتذار نفسها، وتصل العميل على واتساب والبريد وحسابه.'); }, 'is-bad']);
return L;
}
/* v1125: نتيجة الرسالة لكل وسيلة من الخادم — لا يُكتب «أُبلغ العميل» إلا إن وصلت فعلًا، وسبب ما لم يصل ظاهر (ومسجّل في «السجل») */
var CH_AR = { whatsapp: 'واتساب', email: 'البريد', push: 'إشعار الجوال', inbox: 'داخل المنصة' };
function msgFail(m) {
if (!m) return '';
var ch = m.ch || {}, ks = Object.keys(ch);
if (!m.ok) return 'لم تصل الرسالة للعميل' + (m.why ? ': ' + m.why : (ch.whatsapp && ch.whatsapp.why ? ': ' + ch.whatsapp.why : '.'));
var bad = ks.filter(function (k) { return !ch[k].ok && (k === 'whatsapp' || k === 'email'); });
return bad.length ? 'لم تصل عبر ' + bad.map(function (k) { return CH_AR[k]; }).join(' و') + (ch.whatsapp && !ch.whatsapp.ok && ch.whatsapp.why ? ' (' + ch.whatsapp.why + ')' : '') + '.' : '';
}
async function act(a, body, okMsg) {
ST.busy = true; ST.ask = null; draw();
try {
await flushSave();
var j = await api('POST', '/admin/api/crq/' + ST.x.id + '/' + a, body || {});
ST.busy = false;
var m = a === 'approve' ? 'اعتُمد العرض.' : (okMsg || 'تم.'), mf = msgFail(j.msg);
await reload(); loadList();
if (j.msg && mf) toast('warn', m + ' — ' + mf + (a === 'approve' ? ' أعد الإرسال من «إعادة إرسال الرابط».' : a === 'reject' || a === 'notify' ? ' أعد الإرسال من «إعادة إرسال رسالة الاعتذار».' : ''));
else toast(true, m + (j.msg ? ' وصلت الرسالة للعميل' + (j.msg.wa ? ' على واتساب' : '') + '.' : ''));
} catch (e) { ST.busy = false; toast(false, e.message); }
}
async function pdf() {
ST.busy = true; draw();
try { var r = await api('GET', '/admin/api/crq/' + ST.x.id + '/pdf', null, true); var b = await r.blob(); var u = URL.createObjectURL(b); var a = el('a', { href: u, download: ST.x.no + '.pdf' }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 30000); }
catch (e) { toast(false, e.message); }
ST.busy = false; draw();
}
function ask(title, text, okT, fn) { ST.ask = { title: title, text: text, ok: okT, fn: fn }; draw(); var n = R.querySelector('.cr-ask'); if (n) n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
function askNote(title, text, ph, need, fn, max, hint) { ST.ask = { title: title, text: text, ok: 'تأكيد', ph: ph, need: need, note: '', fn: fn, max: max || 0, hint: hint || '' }; draw(); var n = R.querySelector('.cr-ask textarea'); if (n) { n.scrollIntoView({ block: 'center', behavior: 'smooth' }); n.focus(); } }
function askView(x) {
var A = ST.ask; if (!A) return null;
if (A.kind === 'assign') {
return el('div', { class: 'cr-ask' }, [el('b', { text: 'إسناد الطلب' }), el('p', { text: 'يظهر الطلب للموظف في «المسند إليّ».' }), el('select', { 'aria-label': 'الموظف', onchange: function (e) { A.to = e.target.value; } }, [el('option', { value: '', text: '— بلا إسناد —' })].concat((x.staff || []).map(function (s) { return el('option', { value: s.id, selected: A.to === s.id, text: s.name }); }))),
el('div', { class: 'cr-acts' }, [btn('حفظ الإسناد', { cls: 'is-pri', on: function () { act('assign', { to: A.to || null }, 'حُفظ الإسناد.'); } }), btn('إلغاء', { on: function () { ST.ask = null; draw(); } })])]);
}
var cnt = A.max ? el('small', { class: 'cr-ask-n', text: (A.note || '').length + ' / ' + A.max }) : null; /* v1143: السبب يصل كما هو في واتساب والبريد — حدّ واضح حتى لا يُقص في واتساب */
var ta = A.ph ? el('textarea', { placeholder: A.ph, rows: '3', maxlength: A.max ? String(A.max) : null, oninput: function (e) { A.note = e.target.value; if (cnt) cnt.textContent = e.target.value.length + ' / ' + A.max; } }) : null;
return el('div', { class: 'cr-ask', role: 'dialog', 'aria-label': A.title }, [el('b', { text: A.title }), el('p', { text: A.text }), ta, A.hint || cnt ? el('div', { class: 'cr-ask-h' }, [A.hint ? el('small', { text: A.hint }) : null, cnt]) : null,
el('div', { class: 'cr-acts' }, [btn(A.ok, { cls: 'is-pri', on: function () { if (A.need && String(A.note || '').trim().length < 3) { ta.classList.add('is-err'); ta.focus(); return; } A.fn(String(A.note || '').trim()); } }), btn('رجوع', { on: function () { ST.ask = null; draw(); } })])]);
}
function detailView() {
var x = ST.x;
if (!x) return [el('div', { class: 'cr-load', text: 'جارٍ تحميل الطلب…' })];
var notes = [];
if (x.back) notes.push(note('back', 'أكمل العميل كل المطلوب — راجع ما أرسله ثم تابع القرار.', [el('button', { type: 'button', class: 'cr-btn is-sm', 'data-live-ok': '', onclick: function () { ST.tab = 'msg'; draw(); } }, ['فتح المراسلات والمرفقات'])]));
if (x.need_approval) notes.push(note('warn', x.me && x.me.super ? 'رُفع العرض لاعتمادك — راجعه ثم اعتمده أو أعده للمُعِدّ.' : 'العرض بانتظار اعتماد المشرف العام — لا يصل العميل قبل اعتماده.'));
if (x.exec_error) notes.push(note(x.exec_error === 'await_admin' ? 'warn' : 'bad', x.state === 'decision' ? 'تغيّر العقد بعد العرض فلم يُنفَّذ — راجع الحسبة وأعد الاعتماد ليصل العميل عرض محدّث.' : (x.exec_error === 'await_admin' ? 'وقّع العميل عقد التوحيد — التنفيذ وإغلاق العقود السابقة بيد المشرف العام، والعميل يرى «بانتظار تنفيذ الإدارة».' : 'وقّع العميل وتعذّر التنفيذ الآلي — لم يتغير العقد.'), [x.exec_error === 'await_admin' ? null : el('span', { text: x.exec_error })]));
if (!editable(x) && (x.state === 'consent' || x.state === 'sign')) notes.push(note('info', 'الحسبة والمستند للقراءة فقط بعد إرسال الرابط — للتعديل: «سحب العرض وتعديله» من «الخطوة التالية».'));
var body = KIND === 'merge' && MG.TABK.indexOf(ST.tab) >= 0 ? MG.tab(x, ST.tab) : ST.tab === 'req' ? tabReq(x) : ST.tab === 'calc' ? tabCalc(x) : ST.tab === 'guar' ? tabGuar(x) : ST.tab === 'chat' || ST.tab === 'msg' ? tabChat(x) : ST.tab === 'doc' ? tabDoc(x) : ST.tab === 'page' ? tabPage(x) : ST.tab === 'msg' ? tabMsg(x) : tabLog(x);
return [headEl(x), askView(x)].concat(notes, [tabsEl(x), el('div', { class: 'cr-body', role: 'tabpanel' }, [].concat(body))]); /* v1126: رأس واحد مضغوط بدل بطاقتي الهوية و«الخطوة التالية» */
}
/* ═════════ v1126: رأس الطلب — سطر واحد للهوية والإجراء، ومسار مضغوط تحته
* العودة ورقم الطلب وآخر تحديث والحفظ · العميل (سطر واحد لا ينكسر) والعقد والدفعات والإسناد كرقائق · الإجراء الرئيسي وبقية الإجراءات بجانبه
* المراحل خط واحد، و«الآن» سطر واحد — بلا بطاقة «الخطوة التالية» المنفصلة ولا تكرار للحالة ═════════ */
function payT(x) { if (KIND !== 'defer') return ''; var T = tgPays(x).map(function (p) { return p.seq; }); return T.length ? (T.length === 1 ? 'الدفعة ' : 'الدفعات ') + T.join('، ') : ''; }
function headEl(x) {
var closed = x.state === 'closed', cur = closed ? closedAt(x) : stepAt(x), bad = closed || (!!x.exec_error && x.exec_error !== 'await_admin'), c = x.chat || {}, sup = x.me && x.me.super;
var whenOf = [x.created_at, x.approved_at || x.sent_at, x.consented_at, x.signed_at, x.executed_at], more = moreItems(x), pt = payT(x);
var asgB = sup && !legacy(x) && x.state !== 'done' && x.state !== 'closed' ? el('button', { type: 'button', class: 'cr-hd-chip is-btn', 'data-live-ok': '', disabled: ST.busy, title: 'تغيير الإسناد', onclick: function () { ST.ask = { kind: 'assign', to: x.assigned_to || '' }; draw(); } }, [icon('team'), x.assigned_t ? x.assigned_t : 'غير مسند']) : x.assigned_t ? el('span', { class: 'cr-hd-chip' }, [icon('team'), x.assigned_t]) : null;
var steps = legacy(x) ? null : el('ol', { class: 'cr-hd-steps', 'aria-label': 'مسار الطلب' }, STEPS.map(function (t, i) { var done = i < cur, now = i === cur;
return el('li', { class: (done ? 'is-done' : '') + (now ? (bad ? ' is-bad' : ' is-cur') : ''), 'aria-current': now ? 'step' : null, title: done && whenOf[i] ? day(whenOf[i]) : '' }, [el('i', { text: done ? '✓' : now && bad ? '!' : String(i + 1) }), el('span', { text: t })]); }));
var nowT = c.wait && ['done', 'closed'].indexOf(x.state) < 0 ? 'بانتظار العميل: وصل ' + (Number(c.done) || 0) + ' من ' + ((Number(c.done) || 0) + (Number(c.open) || 0)) + (c.due ? ' · المهلة حتى ' + at(c.due) : '') : nextText(x);
return el('section', { class: 'cr-hd' }, [
el('div', { class: 'cr-hd-top' }, [el('button', { type: 'button', class: 'cr-hd-back', 'data-live-ok': '', onclick: back }, [icon('back'), 'كل الطلبات']), el('span', { class: 'cr-hd-no' }, [(x.kind_t || TITLE) + ' · ', ltr(x.no)]), el('span', { class: 'cr-hd-sp' }), saveInd(), el('span', { class: 'cr-hd-up', title: at(x.updated_at) }, [icon('clock'), rel(x.updated_at)])]),
el('div', { class: 'cr-hd-main' }, [
el('span', { class: 'cr-av cr-hd-av', 'aria-hidden': 'true', text: initial(x.client) }),
el('div', { class: 'cr-hd-id' }, [el('h1', { class: 'cr-hd-name', title: x.client || '', text: x.client || '—' }),
el('div', { class: 'cr-hd-meta' }, [x.contract_no ? el('span', { class: 'cr-hd-chip' }, [icon('file'), KIND === 'merge' ? 'العقود ' : 'العقد ', ltr(x.contract_no)]) : null, pt ? el('span', { class: 'cr-hd-chip is-t' }, [icon('cal'), pt]) : null, asgB, x.badge_t || x.state_t ? el('span', { class: 'cr-badge is-' + (bad ? 'bad' : x.tone || 'info'), text: x.state_t || x.badge_t }) : null])]),
el('div', { class: 'cr-hd-acts' }, more.map(function (m) { return el('button', { type: 'button', class: 'cr-hd-mb ' + (m[3] || ''), disabled: ST.busy, 'data-live-ok': '', onclick: m[2] }, [icon(m[1]), m[0]]); }).concat([primary(x)]))]),
steps ? el('div', { class: 'cr-hd-path' }, [steps]) : null,
/* v1127: «المطلوب الآن» سطر مستقل تحت المسار بلون صاحب الدور — ماذا يفعل الموظف الآن */
(function () { var t = turnOf(x), ic = t[0] === 'cli' ? 'wait' : t[0] === 'boss' ? 'sign' : t[0] === 'bad' ? 'alert' : t[0] === 'ok' ? 'ok' : t[0] === 'off' ? 'x' : 'user';
return [el('div', { class: 'q-now is-' + t[0], role: 'status' }, [el('span', { class: 'q-now-ic' }, [icon(ic)]), el('div', { class: 'q-now-t' }, [el('b', { text: t[0] === 'me' ? 'المطلوب منك الآن' : t[0] === 'cli' ? 'بانتظار العميل' : t[0] === 'boss' ? 'بانتظار المشرف العام' : t[0] === 'bad' ? 'يحتاج تدخلك' : t[0] === 'ok' ? 'اكتمل الطلب' : 'أُغلق الطلب' }), el('span', { text: nowT })]),
c.wait ? el('div', { class: 'q-now-a' }, [btn('فتح المطلوب من العميل', { ic: 'list', cls: 'is-sm', on: function () { ST.tab = 'chat'; ST.sub = ST.sub || {}; ST.sub.chat = 'asks'; keep(); draw(); } })]) /* v1128: التذكير في «المطلوب من العميل» وحده */
: x.back && (x.state === 'received' || x.state === 'decision') ? el('div', { class: 'q-now-a' }, [btn('فتح ما أرسله العميل', { ic: 'inbox', cls: 'is-sm', on: function () { ST.tab = 'chat'; ST.sub = ST.sub || {}; ST.sub.chat = 'asks'; keep(); draw(); } })]) : null]), t[0] === 'cli' ? cliTrack(x) : null]; })()]);
}
/* v1142: «مسار العميل» — يظهر مع «بانتظار العميل» وحده: ماذا فعل العميل وأين وقف، بخطوات بأوقاتها
 * العرض: أُرسل ← وصلته الرسالة (حالة واتساب الحقيقية: أُرسلت · وصلت · قرأها) ← فتح الرابط ← وافق ← وقّع
 * الاستكمال: طُلب منه ← وصلته الرسالة ← رفع المطلوب — مع صلاحية الرابط أو المهلة. المصدر: السجل وتواريخ الطلب وسجل واتساب (wa_trace). */
function cliTrack(x) {
var L = x.log || [], T = x.wa_trace || [], c = x.chat || {};
var logAt = function (re, after) { var g = L.filter(function (z) { return re.test(String(z.action || '')) && (!after || Date.parse(z.at) >= Date.parse(after) - 60000); }); return g.length ? g[g.length - 1].at : null; };
var logOf = function (re) { var g = L.filter(function (z) { return re.test(String(z.action || '')); }); return g.length ? g[g.length - 1] : null; };
var waOf = function (re, after) { var g = T.filter(function (m) { return re.test(m.tpl || '') && (!after || Date.parse(m.at) >= Date.parse(after) - 120000); }); return g.length ? g[g.length - 1] : null; };
var waStep = function (m, mailLog) { var ml = mailLog && /البريد ✓/.test(mailLog.action) ? ' · البريد ✓' : mailLog && /البريد ✗/.test(mailLog.action) ? ' · البريد ✗' : '';
if (!m) return { t: 'وصلته الرسالة', done: null, sub: mailLog ? (ml ? ml.slice(3) : '') || 'لا سجل لواتساب' : 'لا سجل لواتساب' };
var st = m.st; return st === 'read' ? { t: 'قرأ الرسالة', done: true, at: m.sat || m.at, sub: 'على واتساب' + ml } : st === 'delivered' ? { t: 'وصلت الرسالة', done: true, at: m.sat || m.at, sub: 'وصلت جواله ولم يقرأها' + ml } : st === 'failed' ? { t: 'لم تصل واتساب', done: false, bad: true, at: m.at, sub: (m.err || 'رفضتها Meta') + ml } : { t: 'وصلته الرسالة', done: false, at: m.at, sub: 'أُرسلت ولم تصل جواله بعد' + ml }; };
var S = [], foot = null, cur = -1;
if (x.state === 'consent' || x.state === 'sign') {
var sent = x.sent_at || x.approved_at, w = waOf(/req_offer|tera_update/, sent), wm = logOf(/^رسالة «رابط العرض»/);
var open = logAt(/فتح العميل رابط الموافقة/, sent) || (x.link && x.link.step === 'consent' ? x.link.opened_at : null);
var ok = x.consented_at || logAt(/وافق العميل على العرض/, sent), sOpen = logAt(/فتح العميل رابط التوقيع|عاد العميل من رابط الموافقة/, sent) || (x.link && x.link.step === 'sign' ? x.link.opened_at : null);
S = [{ t: 'أُرسل العرض', done: true, at: sent }, waStep(w, wm), { t: 'فتح رابط العرض', done: !!open, at: open }, { t: 'وافق على العرض', done: !!ok, at: ok }, { t: 'وقّع الملحق', done: !!x.signed_at, at: x.signed_at, sub: !x.signed_at && sOpen ? 'فتح رابط التوقيع ' + at(sOpen) : '' }];
var lk = logAt(/أُقفل الرابط/, sent);
if (x.link && x.link.expires_at) { var left = (Date.parse(x.link.expires_at) - Date.now()) / 36e5; foot = left > 0 ? ['', 'الرابط صالح حتى ' + at(x.link.expires_at) + ' — يبقى ' + (left < 1 ? 'أقل من ساعة' : Math.round(left) + ' ساعة')] : ['bad', 'انتهت صلاحية الرابط ' + at(x.link.expires_at)]; }
if (lk) foot = ['bad', 'أُقفل الرابط لتجاوز محاولات رمز التحقق ' + at(lk) + ' — أعد إرسال الرابط'];
} else if (c.wait) {
var n = (Number(c.done) || 0) + (Number(c.open) || 0), wf = waOf(/req_fix|tera_update/), up = logAt(/أرفق العميل/), fm = logOf(/^رسالة «مطلوب منك»/);
S = [{ t: 'طُلب منه', done: true, at: wf ? wf.at : null, sub: n ? n + (n === 1 ? ' مطلوب' : n === 2 ? ' مطلوبان' : ' مطلوبات') : '' }, waStep(wf, fm), { t: 'رفع المطلوب', done: !Number(c.open), at: up, sub: n ? 'وصل ' + (Number(c.done) || 0) + ' من ' + n : '' }];
if (c.due) { var lf = (Date.parse(c.due) - Date.now()) / 36e5; foot = lf > 0 ? ['', 'المهلة حتى ' + at(c.due) + ' — يبقى ' + (lf < 1 ? 'أقل من ساعة' : Math.round(lf) + ' ساعة')] : ['bad', 'انتهت المهلة ' + at(c.due)]; }
} else return null;
for (var i = S.length - 1; i >= 0; i--) if (S[i].done) { for (var j = 0; j < i; j++) if (!S[j].done && !S[j].bad) { S[j].done = true; S[j].t = S[j].t === 'وصلته الرسالة' ? 'وصلته الرسالة' : S[j].t; S[j].sub = ''; } break; } /* خطوة لاحقة تمت ⇒ ما قبلها تمّ وإن غاب سجله أو تأخر تحديث حالته */
for (var k = 0; k < S.length; k++) if (!S[k].done) { cur = k; break; }
var lastAt = null, lastT = ''; S.forEach(function (z) { if (z.done && z.at && (!lastAt || Date.parse(z.at) >= Date.parse(lastAt))) { lastAt = z.at; lastT = z.t; } });
var since = lastAt ? String(rel(lastAt)) : '';
if (foot && !foot[0]) foot = null; /* صلاحية الرابط والمهلة في سطر «بانتظار العميل» فوقه — لا تكرار؛ يبقى هنا التنبيه وحده (انتهى · أُقفل) */
return el('section', { class: 'q-cj', 'aria-label': 'مسار العميل' }, [
el('div', { class: 'q-cj-h' }, [icon('user'), el('b', { text: 'مسار العميل' }), lastT ? el('span', { class: 'q-cj-at' + (cur >= 0 && S[cur].bad ? ' is-bad' : '') }, ['آخر ما تمّ: ', el('b', { text: lastT }), since ? ' · ' + since : '']) : null]),
el('ol', { class: 'q-cj-s' }, S.map(function (z, i) { var st = z.bad ? 'is-bad' : z.done ? 'is-done' : i === cur ? 'is-cur' : '';
return el('li', { class: st, 'aria-current': i === cur ? 'step' : null }, [el('i', { 'aria-hidden': 'true' }, [z.bad ? '!' : z.done ? '✓' : String(i + 1)]), el('div', {}, [el('b', { text: z.t }), el('small', { text: z.at && (z.done || z.bad) ? at(z.at) : i === cur ? 'بانتظاره' : '—' }), z.sub ? el('small', { class: 'q-cj-sub', text: z.sub }) : null])]); })),
foot ? el('p', { class: 'q-cj-f' + (foot[0] ? ' is-' + foot[0] : '') }, [icon(foot[0] ? 'alert' : 'clock'), foot[1]]) : null]);
}
/* «الخطوة التالية»: أين الطلب الآن، وما المطلوب، وزر واحد لتنفيذه، وبقية الإجراءات ظاهرة تحته */
var STEPS = ['الطلب', 'قرار الفريق', 'موافقة العميل', 'توقيع الملحق', 'التنفيذ'];
function stepAt(x) { return x.state === 'received' ? 0 : x.state === 'decision' ? 1 : x.state === 'consent' ? 2 : x.state === 'sign' ? (x.signed_at ? 4 : 3) : x.state === 'done' ? 5 : -1; }
/* المرحلة التي أُغلق عندها الطلب */
function closedAt(x) { var S = x.signs || []; if (S.some(function (g) { return g.step === 'consent' && g.decision === 'accept'; })) return 3; if (S.some(function (g) { return g.step === 'consent'; }) || x.close_reason === 'expired' || x.close_reason === 'declined') return 2; return x.close_reason === 'cancelled' ? 0 : 1; }
function nextText(x) {
if (legacy(x)) return 'نُفّذ الطلب' + (x.executed_at ? ' في ' + at(x.executed_at) : '') + ' بنقل الدفعة إلى العقد ' + (x.executed_ref.to || '—') + '. للاطلاع فقط — لا حسبة ولا ملحق لهذا الطلب.';
var sup = x.me && x.me.super, ok = x.result && x.result.ok, exp = x.link ? at(x.link.expires_at) : '';
if ((x.state === 'received' || x.state === 'decision') && x.chat && x.chat.wait) return 'بانتظار العميل: طُلب منه استكمال ' + (Number(x.chat.open) === 1 ? 'مطلوب واحد' : (x.chat.open || 0) + ' مطلوبات') + (x.chat.due ? ' حتى ' + at(x.chat.due) : '') + '. يصلك إشعار عند كل مرفق، ثم تكمل الحسبة والاعتماد.';
if (x.state === 'received' || x.state === 'decision') {
if (!ok) return 'أكمل «القرار والحسبة»: الموعد الجديد والرسوم — الملخص المالي بجانبها.';
if (KIND === 'defer' && cliWant(x).has && !(x.calc && x.calc.pick)) return 'اختر الموعد الجديد في «القرار والحسبة»: تاريخ العميل أو حسبة الفريق أو تاريخ آخر — ثم يُفتح الاعتماد.'; /* v1126 */
if (x.need_approval) return sup ? 'راجع «المستند» و«صفحة العميل» ثم اعتمد ليصل العميل رابط الموافقة.' : 'رُفع العرض للمشرف العام — لا يصل العميل قبل اعتماده.';
return sup ? 'الحسبة مكتملة. راجع «المستند» و«صفحة العميل» ثم اعتمد ليصل العميل رابط الموافقة.' : 'الحسبة مكتملة. ارفع العرض للمشرف العام ليعتمده ويُرسَل للعميل.';
}
if (x.state === 'consent') return 'العرض عند العميل للموافقة' + (exp ? ' — الرابط صالح حتى ' + exp : '') + '. بانتهاء المدة يُغلق الطلب تلقائيًا.';
if (x.state === 'sign') return x.signed_at ? (x.exec_error === 'await_admin' ? 'وقّع العميل — بانتظار تنفيذ المشرف العام (توحيد مع منتج).' : 'وقّع العميل وتعذّر التنفيذ الآلي — لم يتغير العقد. أعد المحاولة أو اسحب العرض.') : 'وافق العميل، والملحق عنده للتوقيع' + (exp ? ' — حتى ' + exp : '') + '. بعد توقيعه يُعدَّل العقد آليًا.';
if (x.state === 'done') return 'نُفّذ الطلب وعُدّل العقد' + (x.executed_at ? ' في ' + at(x.executed_at) : '') + '. الملحق جاهز للتنزيل والإرسال.';
if (x.state === 'closed') return 'أُغلق الطلب: ' + (x.close_t || '') + (x.close_note ? ' — ' + x.close_note : '') + '. العقد كما هو.';
return '';
}
/* v1127: تبويبات فرعية داخل القسم — مهمة واحدة في كل شاشة (المحادثة · المطلوب · المرفقات · الرسائل الجاهزة …) */
function subOf(k, def) { ST.sub = ST.sub || {}; return ST.sub[k] || def; }
function subNav(k, items, cur) { return el('nav', { class: 'q-sub', role: 'tablist', 'aria-label': 'أقسام فرعية' }, items.map(function (it) { return el('button', { type: 'button', role: 'tab', 'aria-selected': cur === it[0] ? 'true' : 'false', class: cur === it[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.sub = ST.sub || {}; ST.sub[k] = it[0]; keep(); draw(); } }, [icon(it[2]), it[1], it[3] ? el('em', { class: 'cr-tcnt', text: String(it[3]) }) : null]); })); }
function tabsEl(x) {
return el('nav', { class: 'cr-tabs', role: 'tablist', 'aria-label': 'أقسام الطلب' }, (KIND === 'merge' ? MG.TABS : TABS).filter(function (t) { return !legacy(x) || t[0] === 'req' || t[0] === 'log'; }).map(function (t) {
var s = tabState(x, t[0]);
return el('button', { type: 'button', role: 'tab', 'aria-selected': ST.tab === t[0] ? 'true' : 'false', class: ST.tab === t[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.tab = t[0]; keep(); draw(); } },
[icon(t[2]), t[1], tabCnt(x, t[0]), s === 'ok' ? el('i', { class: 'cr-dot is-ok', title: 'مكتمل' }) : s === 'miss' ? el('i', { class: 'cr-dot is-miss', title: 'ينقصه' }) : s === 'live' ? el('i', { class: 'cr-dot is-live', title: 'رابط نشط' }) : null]);
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
function paintHead() { var h = R.querySelector('.cr-hd'), t = R.querySelector('.cr-tabs'); if (h && !h.contains(document.activeElement)) h.replaceWith(headEl(ST.x)); if (t) t.replaceWith(tabsEl(ST.x)); } /* v1126 */

/* ── 1) الطلب — v879: بطاقتا العميل والعقد، الدفعات صفوفًا واضحة بحالتها، وبيانات الطلب بطاقات صغيرة ── */
/* ═════════ v1127: «الطلب» — ما أرسله العميل فقط، للقراءة (القرار كله في «القرار والحسبة»)
* العميل والعقد بطاقة واحدة بعمودين · ما طلبه العميل: الدفعات بتواريخها ومبالغها، والمدة أو التاريخ، وطريقة السداد، وملاحظته ═════════ */
function dueTag(p) { if (!p || !p.due) return null; var t = new Date(Date.now() + 3 * 3600 * 1000); t = new Date(t.toISOString().slice(0, 10) + 'T00:00:00Z'); var n = Math.round((new Date(String(p.due).slice(0, 10) + 'T00:00:00Z') - t) / 864e5);
return n === 0 ? ['تستحق اليوم', 'warn'] : n > 0 ? ['بعد ' + dWord(n), 'info'] : ['متأخرة ' + dWord(-n), 'bad']; }
function kvq(L) { return el('dl', { class: 'q-kv' }, [].concat.apply([], L.filter(Boolean).map(function (r) { return [el('dt', { text: r[0] }), el('dd', { class: r[2] || '' }, [r[1] == null || r[1] === '' ? '—' : r[1]])]; }))); }
function tabReq(x) {
var u = x.user || {}, c = x.contract || {}, P = (x.payments || []).slice().sort(function (a, b) { return a.seq - b.seq; }), W = cliWant(x);
var cp = x.calc && Array.isArray(x.calc.client_pids) ? x.calc.client_pids : (x.payment_ids || []), CP = P.filter(function (p) { return cp.indexOf(p.pid) >= 0; });
var open = P.filter(function (p) { return p.open; }), rest = open.reduce(function (s2, p) { return s2 + (Number(p.amount) || 0) - (Number(p.paid_amount) || 0); }, 0), paidN = P.filter(function (p) { return p.paid; }).length;
var sar = function (v) { return el('span', {}, [ltr(money(v)), el('small', { text: ' ر.س' })]); };
var changed = (x.payment_ids || []).join() !== cp.join();
var party = el('section', { class: 'q-card' }, [el('div', { class: 'q-card-h' }, [el('h2', { text: 'العميل والعقد' })]),
el('div', { class: 'q-2c' }, [
el('div', {}, [el('h3', { class: 'q-sh' }, [icon('user'), 'العميل']), kvq([['الاسم', u.name || x.client], ['الجوال', u.phone ? ltr(u.phone) : ''], ['البريد', u.email ? ltr(u.email) : ''], ['رقم العميل', u.tera_id ? ltr(u.tera_id) : '']])]),
el('div', {}, [el('h3', { class: 'q-sh' }, [icon('file'), 'العقد ', c.no ? ltr(c.no) : '', c.closed ? el('span', { class: 'cr-badge is-off', text: 'مغلق' }) : null]), kvq([['المنتج', c.product], ['قيمة العقد', sar(c.total)], ['المتبقي', sar(rest), 'is-hi'], ['الدفعات', paidN + ' مسدَّدة من ' + P.length], ['المدة', c.start ? el('span', {}, [day(c.start), ' — ', day(c.end)]) : '']])])])]);
var ed = editable(x), sel = x.payment_ids || [], SP = P.filter(function (p) { return sel.indexOf(p.pid) >= 0; }), all = ed && (ST.reqAll === x.id || !sel.length);
/* v1128: الدفعات ومدة التأجيل هنا وحدها (طلب العميل) — الفريق يعدّلها من المكان نفسه، والتعديل يظهر بجانب طلب العميل */
var asks = el('section', { class: 'q-card' }, [el('div', { class: 'q-card-h' }, [el('h2', { text: 'ما طلبه العميل' }), el('small', { text: (x.origin === 'client' ? 'قدّمه العميل من حسابه' : 'أنشأه الفريق') + ' · ' + at(x.created_at) })]),
KIND === 'defer' ? monthsEl(x, ed, P, sel) : null,
el('div', { class: 'q-card-sh' }, [el('b', { text: SP.length > 1 ? 'الدفعات المطلوب تأجيلها' : 'الدفعة المطلوب تأجيلها' }), changed ? el('span', { class: 'q-pill is-warn', text: 'عدّلها الفريق — طلب العميل: ' + (CP.map(function (p) { return p.seq; }).join('، ') || '—') }) : null,
ed && P.some(function (p) { return p.open; }) ? el('button', { type: 'button', class: 'cr-link', 'data-live-ok': '', 'aria-pressed': all ? 'true' : 'false', onclick: function () { ST.reqAll = all ? null : x.id; draw(); } }, [all ? 'إنهاء التغيير' : 'تغيير الدفعة']) : null]),
all ? el('div', { class: 'q-chips', role: 'group', 'aria-label': 'دفعات العقد' }, P.map(function (p) { var on = sel.indexOf(p.pid) >= 0, dis = !p.open;
return el('label', { class: 'q-chip' + (on ? ' is-on' : '') + (p.open ? '' : ' is-off') }, [el('input', { type: 'checkbox', checked: on, disabled: dis, 'aria-label': 'الدفعة ' + p.seq, onchange: function (e) { var ids = (x.payment_ids || []).filter(function (id) { return id !== p.pid; }); if (e.target.checked) ids.push(p.pid); setPids(x, ids); } }),
el('b', { text: 'الدفعة ' + p.seq }), el('span', { text: day(p.due) }), el('span', {}, [ltr(money(p.amount))]), !p.open ? el('em', { text: 'مسدَّدة' }) : null]); }))
: SP.length ? el('div', { class: 'q-pays' }, SP.map(function (p) { var t = dueTag(p);
return el('div', { class: 'q-pay' }, [el('span', { class: 'q-pay-n' }, [el('small', { text: 'الدفعة' }), el('b', { text: String(p.seq) })]), el('div', { class: 'q-pay-d' }, [el('small', { text: 'تاريخ الاستحقاق' }), el('b', { text: day(p.due) })]), el('div', { class: 'q-pay-a' }, [el('small', { text: 'القيمة' }), el('b', {}, [sar(p.amount)])]), t ? el('span', { class: 'q-pill is-' + t[1], text: t[0] }) : null]); }))
: el('p', { class: 'q-empty', text: 'لم تُحدَّد دفعة.' }),
kvq([KIND === 'defer' && W.date ? ['التاريخ الذي طلبه', day(W.date)] : null, KIND === 'defer' ? ['طريقة السداد', W.method_t || '—'] : null]),
String(x.client_note || '').trim() ? el('blockquote', { class: 'q-quote' }, [el('small', { text: 'ملاحظة العميل' }), el('p', { text: String(x.client_note).trim() })]) : null]);
return [party, asks];
}
/* v898: مدة التأجيل — يزيدها الموظف أو ينقصها بالأشهر: تبدأ من أول دفعة طلبها العميل وتشمل ما بعدها، والحسبة كما هي.
* طلب العميل الأصلي يُحفظ مرة واحدة في calc.client_pids، وكل تغيير في العدد يُسجَّل في سجل الطلب (stf_279). */
function monthWord(n) { return n === 1 ? 'شهر واحد' : n === 2 ? 'شهران' : n <= 10 ? n + ' أشهر' : n + ' شهرًا'; }
function setPids(x, ids) {
var c = x.calc && typeof x.calc === 'object' && !Array.isArray(x.calc) ? x.calc : {}; x.calc = c;
if (!Array.isArray(c.client_pids)) c.client_pids = (x.payment_ids || []).slice();
var gone = (x.payment_ids || []).filter(function (id) { return ids.indexOf(id) < 0; });
if (c.sched && c.sched.dates) gone.forEach(function (id) { delete c.sched.dates[id]; });
x.payment_ids = ids; queue({ payment_ids: ids, calc: c }); draw();
}
function monthsEl(x, ed, P, sel) {
var open = P.filter(function (p) { return p.open; }).sort(function (a, b) { return a.seq - b.seq; });
var cl = x.calc && Array.isArray(x.calc.client_pids) ? x.calc.client_pids : sel;
var from = open.filter(function (p) { return cl.indexOf(p.pid) >= 0 || sel.indexOf(p.pid) >= 0; })[0];
if (!from || !sel.length || (x.calc && x.calc.sched && x.calc.sched.mode === 'resched')) return null; /* v899: في إعادة الجدولة العدد من «البنود والحسبة» */
var chain = open.filter(function (p) { return p.seq >= from.seq; }), n = sel.length, clN = cl.length, max = Math.min(6, chain.length);
var go = function (m) { if (!ed || m < 1 || m > max) return; setPids(x, chain.slice(0, m).map(function (p) { return p.pid; })); };
return el('div', { class: 'cr-mo' }, [
el('div', { class: 'cr-mo-t' }, [el('b', { text: 'مدة التأجيل' }), el('small', {}, [(x.origin === 'client' ? 'طلب العميل: ' : 'عند إنشاء الطلب: ') + monthWord(clN), n !== clN ? el('em', { text: ' · ' + (n > clN ? 'زادها الفريق' : 'خفّضها الفريق') }) : null])]),
el('div', { class: 'cr-mo-s', role: 'group', 'aria-label': 'مدة التأجيل بالأشهر' }, [
ed ? el('button', { type: 'button', class: 'cr-mo-b', 'aria-label': 'إنقاص شهر', 'data-live-ok': '', disabled: n <= 1, onclick: function () { go(n - 1); } }, [icon('minus')]) : null,
el('output', { class: 'cr-mo-v', 'aria-live': 'polite', text: monthWord(n) }),
ed ? el('button', { type: 'button', class: 'cr-mo-b', 'aria-label': 'إضافة شهر', 'data-live-ok': '', disabled: n >= max, onclick: function () { go(n + 1); } }, [icon('plus')]) : null])]);
}
/* v899: إعادة جدولة كاملة — عدد دفعات جديد بلا حد أعلى يحدده الموظف، وتاريخ أول دفعة، والمتبقي مع الرسوم يُوزَّع شهريًا (الحساب في القاعدة crq_calc_defer) */
/* v901: صفوف إعادة الجدولة من العدد وتاريخ أول دفعة — تُعرض حين لا تكتمل الحسبة بعد (التوزيع اليدوي للرسوم يحتاج خانة لكل دفعة جديدة) */
function rsRows(x, c) {
var P = (x.payments || []).slice().sort(function (a, b) { return a.seq - b.seq; }), open = P.filter(function (p) { return p.open; });
var n = Math.max(1, Number(c.sched.count) || open.length || 1), mx = P.reduce(function (m, p) { return Math.max(m, Number(p.seq) || 0); }, 0), A = c.dist.amounts || {};
var st = /^\d{4}-\d{2}-\d{2}$/.test(String(c.sched.start || '')) ? new Date(c.sched.start + 'T00:00:00') : null;
var dt = function (i) { if (!st) return null; var d = new Date(st.getFullYear(), st.getMonth() + i, st.getDate()); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
var out = P.filter(function (p) { return !p.open; }).map(function (p) { return { pid: p.pid, seq: p.seq, open: false, due_before: p.due, due_after: p.due, amt_before: p.amount, add: 0, amt_after: p.amount }; });
open.forEach(function (p, i) { out.push(i < n ? { pid: p.pid, k: '#' + (i + 1), seq: p.seq, open: true, due_before: p.due, due_after: dt(i), amt_before: p.amount, add: Number(A['#' + (i + 1)]) || 0, amt_after: null }
: { pid: p.pid, seq: p.seq, open: true, merged: true, due_before: p.due, due_after: p.due, amt_before: p.amount, add: 0, amt_after: 0 }); });
for (var i = open.length; i < n; i++) out.push({ pid: null, k: '#' + (i + 1), seq: mx + i - open.length + 1, open: true, added: true, due_before: null, due_after: dt(i), amt_before: 0, add: Number(A['#' + (i + 1)]) || 0, amt_after: null });
return out.sort(function (a, b) { return a.seq - b.seq; });
}
function rsInit(x, c) {
var open = (x.payments || []).filter(function (p) { return p.open; }).sort(function (a, b) { return a.seq - b.seq; });
if (!Number(c.sched.count)) c.sched.count = open.length || 1;
if (!c.sched.start) { var t = new Date(); t.setHours(0, 0, 0, 0); var f = open[0] && open[0].due ? new Date(String(open[0].due).slice(0, 10) + 'T00:00:00') : null; if (f && (c.client_pids || x.payment_ids || []).map(String).indexOf(String(open[0].pid)) >= 0) f = new Date(f.getFullYear(), f.getMonth() + 1, f.getDate()); /* v907: الدفعة التي طلب العميل تأجيلها تتأجل فعلًا — أول دفعة بعد موعدها بشهر */ var d = f && f > t ? f : new Date(t.getFullYear(), t.getMonth() + 1, t.getDate());
c.sched.start = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
}
function rsCtl(x, c, ed, upd) {
var open = (x.payments || []).filter(function (p) { return p.open; }), n = Math.max(1, Number(c.sched.count) || open.length || 1);
var left = open.reduce(function (s, p) { return s + (Number(p.amount) || 0); }, 0);
var setN = function (v) { v = Math.max(1, Math.floor(Number(v) || 1)); c.sched.count = v; upd(); draw(); };
var pw = function (k) { return k === 1 ? 'دفعة واحدة' : k === 2 ? 'دفعتان' : k <= 10 ? k + ' دفعات' : k + ' دفعة'; };
return el('div', { class: 'cr-ds-g cr-rs' }, [el('h3', { text: 'إعادة الجدولة' }),
el('div', { class: 'cr-mo' }, [el('div', { class: 'cr-mo-t' }, [el('b', { text: 'عدد الدفعات الجديد' }), el('small', {}, ['الحالي: ' + pw(open.length) + ' مفتوحة · المتبقي ', ltr(money(left)), ' ر.س', n !== open.length ? el('em', { text: ' · ' + (n > open.length ? 'زيادة ' + pw(n - open.length) : 'نقص ' + pw(open.length - n)) }) : null])]),
el('div', { class: 'cr-mo-s', role: 'group', 'aria-label': 'عدد الدفعات الجديد' }, [
ed ? el('button', { type: 'button', class: 'cr-mo-b', 'aria-label': 'إنقاص دفعة', 'data-live-ok': '', disabled: n <= 1, onclick: function () { setN(n - 1); } }, [icon('minus')]) : null,
el('input', { type: 'number', class: 'cr-mo-n', min: '1', step: '1', inputmode: 'numeric', value: String(n), disabled: !ed, 'aria-label': 'عدد الدفعات الجديد', onchange: function (e) { setN(e.target.value); } }),
ed ? el('button', { type: 'button', class: 'cr-mo-b', 'aria-label': 'إضافة دفعة', 'data-live-ok': '', onclick: function () { setN(n + 1); } }, [icon('plus')]) : null])]),
el('label', { class: 'cr-field cr-rs-d' }, [el('span', { text: 'تاريخ أول دفعة' }), el('input', { type: 'date', value: c.sched.start || '', disabled: !ed, 'aria-label': 'تاريخ أول دفعة', onchange: function (e) { c.sched.start = e.target.value; upd(); draw(); } })]),
el('small', { class: 'cr-hint', text: 'المتبقي مع رسوم الطلب يُوزَّع على الدفعات شهريًا من تاريخ أول دفعة. عند النقص تُدمج الدفعات الزائدة ولا تُحذف، وعند الزيادة تُضاف دفعات جديدة بعد آخر دفعة.' })]);
}
function kvs(L) { return el('dl', { class: 'cr-kv' }, [].concat.apply([], L.map(function (r) { return [el('dt', { text: r[0] }), el('dd', {}, [r[1] == null || r[1] === '' ? '—' : r[1]])]; }))); }

/* ── 2) البنود والحسبة: البنود من القائمة الجاهزة («+ إضافة بند ▾») بضريبة لكل بند وظهوره للعميل، ثم التوزيع والجدولة — والملخص المالي جانبًا ── */
var ERRT = { bad_count: 'أدخل عدد الدفعات الجديد — دفعة واحدة على الأقل.', start_required: 'حدّد تاريخ أول دفعة في إعادة الجدولة.', no_targets: 'اختر الدفعة المطلوب تأجيلها من تبويب «الطلب».', target_not_open: 'الدفعة المختارة لم تعد مستحقة.', bad_line: 'لكل بند اسم من حرفين على الأقل.', bad_amount: 'قيمة غير صحيحة', bad_date: 'تاريخ غير صحيح — الموعد الجديد بعد موعد الدفعة وبعد اليوم', date_required: 'حدد الموعد الجديد للدفعة المؤجلة', dist_sum: 'مجموع التوزيع اليدوي لا يساوي إجمالي الإضافة', no_open: 'لا دفعات مستحقة في العقد', contract_closed: 'العقد مغلق', bad_input: 'بيانات غير صالحة', kind_inactive: 'النوع غير مفعّل' };
var CALC_T = { fixed: 'قيمة ثابتة', pct: 'نسبة من الدفعة المؤجلة', manual: 'يُدخل لكل طلب' };
function rate(x) { var r = x.result && x.result.vat_rate != null ? Number(x.result.vat_rate) : Number(x.vat_rate); return isFinite(r) ? r : 15; }
function tgSum(x) { return (x.payments || []).filter(function (p) { return (x.payment_ids || []).indexOf(p.pid) >= 0; }).reduce(function (s, p) { return s + (Number(p.amount) || 0); }, 0); }
function readyAmt(x, f) { return f.calc === 'fixed' ? Number(f.value) || 0 : f.calc === 'pct' ? Math.round(tgSum(x) * (Number(f.value) || 0)) / 100 : 0; }
function readyOf(x, id) { return (x.ready || []).concat(ST.charges || []).filter(function (f) { return f.k === id; })[0] || null; }
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
/* v878: القائمة تُلحق بالصفحة خارج .crq — تحمل ألوان الوضع الحالي (فاتح/ليلي) */
var k = anchor.closest('.crq'); if (k) { var cs = getComputedStyle(k); ['ink', 'mut', 'line', 'card', 'soft', 'soft2', 'brand', 'brand2', 'acc', 'tint', 'tint2', 'ok', 'okw', 'warn', 'warnw', 'bad', 'badw'].forEach(function (n) { var v = cs.getPropertyValue('--k-' + n); if (v) p.style.setProperty('--k-' + n, v.trim()); }); }
p.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); if (p.__back) p.__back(); else { popClose(); anchor.focus(); } } });
document.body.appendChild(p); POP = p;
/* يتبع الزر عند التمرير أو تغيّر ارتفاع المعاينة — لا يُغلق */
p.__place = function () { if (!anchor.isConnected) { popClose(); return; } var r = anchor.getBoundingClientRect();
/* الجوال: لوح سفلي بعرض الشاشة · غير ذلك: تحت الزر، أو فوقه إن كان المكان أوسع */
if (innerWidth < 560) { p.classList.add('is-sheet'); p.style.width = innerWidth + 'px'; p.style.left = '0px'; p.style.top = Math.max(8, innerHeight - p.offsetHeight) + 'px'; return; }
p.classList.remove('is-sheet'); var w = Math.min(400, innerWidth - 24), h = p.offsetHeight, below = innerHeight - r.bottom - 12, above = r.top - 12;
p.style.width = w + 'px'; p.style.top = Math.max(12, Math.min(below >= h || below >= above ? r.bottom + 6 : r.top - 6 - h, innerHeight - h - 12)) + 'px';
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
L.appendChild(el('div', { class: 'cr-pop-g' }, [el('span', { text: g[0] }), el('i', { text: String(it.length) })]));
it.forEach(function (z) {
var chips = String(z[1] || '').split(' · ').filter(Boolean);
L.appendChild(el('button', { type: 'button', class: 'cr-pop-i' + (z[2] ? ' is-had' : ''), disabled: !!z[2], 'data-live-ok': '', onclick: function () { popClose(); o.pick(z[3] !== undefined ? z[3] : z[0]); } }, [
el('span', { class: 'cr-pop-ic' }, [icon(z[2] ? 'check' : 'plus')]),
el('span', { class: 'cr-pop-tx' }, [el('b', { text: z[0] }), chips.length ? el('span', { class: 'cr-pop-ch' }, chips.map(function (c) { return el('small', { class: /غير خاضع/.test(c) ? 'is-n' : '', text: c }); })) : null]),
el('em', { text: z[2] ? (o.hadT || 'مُضاف') : (o.actT || 'إضافة') })]));
});
});
if (!L.children.length) L.appendChild(el('p', { class: 'cr-pop-0', text: 'لا نتائج — جرّب كلمة أخرى.' }));
}
q.addEventListener('input', paintL); paintL();
/* v878: «بند جديد» يفتح نموذجًا كاملًا داخل القائمة (لا يُقصّ أسفلها) — رجوع للقائمة أو إضافة */
function freeForm() {
var t = o.freeLine ? el('input', { type: 'text', maxlength: '80', placeholder: o.freePh || 'اكتب النص', 'aria-label': o.freePh || 'النص' }) : el('textarea', { rows: '5', placeholder: o.freePh || 'اكتب النص', 'aria-label': o.freePh || 'النص' }), er = el('small', { class: 'cr-pop-er', hidden: true, text: 'اكتب مسمّى من حرفين على الأقل.' });
var go = function () { var v = t.value.trim(); if (v.length < 2) { er.hidden = false; t.focus(); return; } popClose(); o.pick({ free: v }); };
var back = function () { p.__back = null; p.classList.remove('is-form'); V.remove(); q.focus(); p.__place(); };
t.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (o.freeLine || e.ctrlKey || e.metaKey)) { e.preventDefault(); go(); } });
t.addEventListener('input', function () { er.hidden = true; });
var V = el('div', { class: 'cr-pop-fm' }, [
el('div', { class: 'cr-pop-fh' }, [el('button', { type: 'button', class: 'cr-pop-x', 'aria-label': 'رجوع للقائمة', title: 'رجوع للقائمة', 'data-live-ok': '', onclick: back }, [icon('back')]), el('b', { text: o.free })]),
el('label', { class: 'cr-pop-lb' }, [el('span', { text: o.freePh || 'النص' }), el('span', { class: 'cr-pop-in' }, [t])]), er,
o.freeNote ? el('p', { class: 'cr-pop-nt', text: o.freeNote }) : null,
el('div', { class: 'cr-pop-ac' }, [el('button', { type: 'button', class: 'cr-pop-ok', 'data-live-ok': '', onclick: go }, [icon('plus'), el('span', { text: o.freeOk || 'إضافة' })]), el('button', { type: 'button', class: 'cr-pop-bk', 'data-live-ok': '', onclick: back }, [el('span', { text: 'رجوع' })])])]);
p.__back = back; p.classList.add('is-form'); p.appendChild(V); p.__place(); t.focus();
}
if (o.free) F.appendChild(el('button', { type: 'button', class: 'cr-pop-new', 'data-live-ok': '', onclick: freeForm }, [icon('plus'), el('span', { text: o.free })]));
p.appendChild(el('div', { class: 'cr-pop-h' }, [o.title ? el('div', { class: 'cr-pop-tt' }, [el('b', { text: o.title }), el('button', { type: 'button', class: 'cr-pop-x', 'aria-label': 'إغلاق', 'data-live-ok': '', onclick: popClose }, [icon('x')])]) : null, el('label', { class: 'cr-pop-q' }, [icon('search'), q])])); p.appendChild(L); if (o.free) p.appendChild(F);
});
}
/* v873: بنود عامة من «الرسوم والضرائب والعمولات» (fee_charge_items) — تُجلب مرة وتُضاف للقائمة الجاهزة */
var CH_T = { fixed: 'قيمة ثابتة', pct: 'نسبة', manual: 'يُدخل لكل طلب' };
function loadCharges() {
if (ST.chargesP) return ST.chargesP;
return (ST.chargesP = api('GET', '/admin/api/crq-charges').then(function (j) { ST.charges = (j.items || []).map(function (f) { return { k: 'fc_' + String(f.k || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 21), name: f.name, calc: f.kind === 'pct' ? 'pct' : f.kind === 'fixed' ? 'fixed' : 'manual', value: Number(f.value) || 0, taxable: f.taxable !== false, gen: true }; }); })
.catch(function () { ST.charges = []; }));
}
/* ═════════ v1125: «طلب العميل وقرار الفريق» — تاريخ العميل بجانب تاريخ الحسبة، والقرار ثلاثة: اعتماد تاريخ العميل · تعديله · اعتماد حسبة الفريق
* تاريخ العميل: التاريخ المحدد الذي اقترحه، أو استحقاق الدفعة + المدة التي طلبها (شهر · شهران · 3 · 6).
* «اعتماد تاريخ العميل» و«التعديل» يجعلان الموعد يدويًا (sched.manual) والدفعات التالية المطلوبة شهرًا بعد شهر؛ والقرار يُحفظ في calc.pick ويظهر في «الطلب». ═════════ */
function isoAdd(iso, n) { var d = new Date(String(iso).slice(0, 10) + 'T00:00:00Z'), dd = d.getUTCDate(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n); var last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate(); d.setUTCDate(Math.min(dd, last)); return d.toISOString().slice(0, 10); }
function isoDiff(a, b) { return Math.round((Date.parse(String(a).slice(0, 10) + 'T00:00:00Z') - Date.parse(String(b).slice(0, 10) + 'T00:00:00Z')) / 864e5); }
function todayIso() { return new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10); }
function dWord(n) { n = Math.abs(n); return n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? n + ' أيام' : n + ' يومًا'; }
function tgPays(x) { var ids = x.payment_ids || []; return (x.payments || []).filter(function (p) { return ids.indexOf(p.pid) >= 0 && p.open; }).sort(function (a, b) { return a.seq - b.seq; }); }
function cliWant(x) {
var P = x.proposal || {}, T = tgPays(x), first = T[0], m = P.months && P.months !== 'date' ? Number(P.months) || 0 : 0;
var date = P.date && /^\d{4}-\d{2}-\d{2}$/.test(String(P.date)) ? String(P.date) : (m && first && first.due ? isoAdd(first.due, m) : '');
var mt = P.method === 'spread' ? 'توزيعها على الدفعات القادمة' : P.method === 'team' ? 'يحددها الفريق' : P.method === 'end' ? 'في نهاية العقد' : '';
return { has: !!(P.months || P.date || P.method), date: date, exact: !!P.date, months: m, method: P.method || '', method_t: mt, first: first, T: T };
}
function teamDue(x) { var r = x.result || {}; if (!r.ok || !Array.isArray(r.rows)) return null; var t = r.rows.filter(function (w) { return w.target; }).sort(function (a, b) { return a.seq - b.seq; }); return t.length ? t : null; }
function applyDate(x, c, d0, by, upd) {
var T = tgPays(x); if (!T.length || !d0) return;
c.sched = c.sched || {}; c.sched.mode = 'manual'; c.sched.dates = c.sched.dates || {};
T.forEach(function (p, i) { c.sched.dates[p.pid] = i ? isoAdd(d0, i) : d0; });
c.pick = { by: by, date: d0, at: new Date().toISOString() }; ST.pickEd = false;
upd(); draw();
}
function dateBad(x, d) { var f = tgPays(x)[0]; if (!d) return 'لا يوجد تاريخ.'; if (d <= todayIso()) return 'التاريخ يجب أن يكون بعد اليوم.'; if (f && f.due && d <= String(f.due).slice(0, 10)) return 'التاريخ يجب أن يكون بعد استحقاق الدفعة (' + day(f.due) + ').'; return ''; }
/* ═════════ v1126: «الموعد الجديد» — قرار واحد بدل بطاقة المقارنة وخيارات الجدولة والتواريخ اليدوية في الجدول
* الخيارات قائمة واحدة: تاريخ العميل · إلى نهاية الجدول · ترحيل ما بعده · إعادة جدولة كاملة · تاريخ آخر
* الاختيار يحفظ الموعد (sched) والقرار (calc.pick) معًا، والنتيجة ومقارنتها بطلب العميل سطر واحد تحت القائمة ═════════ */
function dueSel(x, c) { var pick = c && c.pick && typeof c.pick === 'object' ? c.pick : null, m = (c.sched || {}).mode || 'end';
if (ST.pickEd === x.id) return 'other';
if (pick) return pick.by === 'client' ? 'cli' : pick.by === 'edit' || m === 'manual' ? 'other' : m;
return cliWant(x).has ? '' : m === 'manual' ? 'other' : m; }
function dueCard(x, c, ed, upd) {
var W = cliWant(x), tm = teamDue(x), sel = dueSel(x, c), cd = W.date, bad = cd ? dateBad(x, cd) : 'لم يحدد العميل تاريخًا.', T = W.T, f0 = T[0];
var td = tm ? String(tm[0].due_after).slice(0, 10) : '';
var choose = function (v) { if (!ed) return;
if (v === 'cli') { applyDate(x, c, cd, 'client', upd); return; }
if (v === 'other') { ST.pickEd = x.id; draw(); var i = R.querySelector('#cr-due-d'); if (i) i.focus(); return; }
ST.pickEd = false; c.sched = c.sched || {}; c.sched.mode = v; if (v === 'resched') rsInit(x, c); c.pick = { by: 'team', date: '', at: new Date().toISOString() }; upd(); draw(); };
var dIn = el('input', { type: 'date', id: 'cr-due-d', dir: 'ltr', value: (c.pick && c.pick.by === 'edit' && c.pick.date) || (ST.pickD && ST.pickD[x.id]) || '', min: todayIso(), disabled: !ed, 'aria-label': 'التاريخ الجديد',
onchange: function (e) { var v = e.target.value, b2 = dateBad(x, v), er = R.querySelector('#cr-due-er'); if (er) { er.textContent = b2; er.hidden = !b2; } if (!b2) applyDate(x, c, v, 'edit', upd); } });
var O = [
['cli', 'تاريخ العميل', cd ? (W.exact ? 'التاريخ الذي حدده' : 'استحقاق الدفعة + ' + (W.months === 1 ? 'شهر' : W.months === 2 ? 'شهران' : W.months + ' أشهر')) : 'لم يحدد العميل تاريخًا', cd ? day(cd) : '', !cd || !!bad],
['end', 'إلى نهاية الجدول', 'بعد آخر دفعة في الجدول', '', false],
['shift', 'ترحيل ما بعده', 'تتأخر المواعيد التالية شهرًا لكل دفعة مؤجَّلة', '', false],
['resched', 'إعادة جدولة كاملة', 'توزيع المتبقي على عدد دفعات جديد', '', false],
['other', 'تاريخ آخر', T.length > 1 ? 'تحدده أنت — والدفعات التالية شهرًا بعد شهر' : 'تحدده أنت', '', false]];
var list = el('div', { class: 'cr-du-l', role: 'radiogroup', 'aria-label': 'الموعد الجديد' }, O.map(function (o) {
var on = sel === o[0], dis = !ed || o[4];
return el('label', { class: 'cr-du-o' + (on ? ' is-on' : '') + (dis ? ' is-dis' : '') + (o[0] === 'cli' ? ' is-cli' : ''), title: o[0] === 'cli' && cd && bad ? bad : '' }, [
el('input', { type: 'radio', name: 'crq-due-' + x.id, value: o[0], checked: on, disabled: dis, onchange: function () { choose(o[0]); } }),
el('span', { class: 'cr-du-t' }, [el('b', { text: o[1] }), el('small', { text: o[0] === 'cli' && cd && bad && ed ? 'لا يُعتمد كما هو: ' + bad : o[2] })]),
on && o[0] === 'other' ? el('span', { class: 'cr-du-v' }, [dIn]) : on && td && o[0] !== 'cli' ? el('span', { class: 'cr-du-v is-r', text: day(td) }) : o[3] ? el('span', { class: 'cr-du-v' + (on ? ' is-r' : ''), text: o[3] }) : null]); }));
var diff = td && cd && sel ? isoDiff(td, cd) : null;
var res = !sel ? el('p', { class: 'cr-du-r is-wait' }, [icon('alert'), el('span', { text: 'اختر الموعد الجديد — ' + (cd ? 'العميل طلب ' + day(cd) + '.' : 'لم يحدد العميل تاريخًا.') })])
: sel === 'resched' ? el('p', { class: 'cr-du-r' }, [icon('cal'), el('span', {}, ['إعادة جدولة على ', el('b', { text: String(Math.max(1, Number(c.sched.count) || 1)) }), ' دفعات — أولها ', el('b', { text: day(c.sched.start) })])])
: !tm ? el('p', { class: 'cr-du-r' }, [icon('clock'), el('span', { text: 'جارٍ الحساب…' })])
: el('p', { class: 'cr-du-r ' + (diff === null ? '' : diff === 0 ? 'is-ok' : 'is-warn') }, [icon(diff === 0 ? 'check' : 'cal'), el('span', {}, [(tm.length > 1 ? 'الدفعات ' + tm.map(function (z) { return z.seq; }).join('، ') + ' — أولها ' : 'الدفعة ' + tm[0].seq + ' ') + 'من ' + day(tm[0].due_before) + ' إلى ', el('b', { text: day(td) }), diff === null ? '' : diff === 0 ? ' · مطابق لطلب العميل' : ' · ' + (diff > 0 ? 'بعد' : 'قبل') + ' طلب العميل بـ' + dWord(diff)])]);
return el('section', { class: 'cr-card cr-du', id: 'cr-due' }, [
el('div', { class: 'cr-du-h' }, [el('h2', { text: 'الموعد الجديد' }), f0 ? el('span', { class: 'cr-du-cur' }, ['الاستحقاق الحالي ', el('b', { text: day(f0.due) }), W.method_t ? ' · اقتراح العميل للسداد: ' + W.method_t : '']) : null]),
list, el('small', { class: 'cr-du-er', id: 'cr-due-er', role: 'alert', hidden: true }), sel === 'resched' ? rsCtl(x, c, ed, upd) : null, res]);
}
function tabCalc(x) {
var ed = editable(x), c = calcOf(x), R0 = rate(x);
loadCharges();
function tax(l) { return l.vat ? Math.round((Number(l.amt) || 0) * R0) / 100 : 0; }
ST.cc = c; ST.cu = upd; /* v899: لإعادة رسم جدول إعادة الجدولة بعد الحفظ */
function upd() { c.lines.forEach(function (l) { l.amt = String(l.amt || '').replace(/[^\d.]/g, '') || '0'; }); x.calc = c; queue({ calc: c }); paintSide(x); }
/* تحديث خلايا الضريبة والإجمالي والمجاميع دون إعادة رسم الحقول */
function paintRow(tr, l) { var a = tr.querySelector('.c-tax'), b = tr.querySelector('.c-tot'); if (a) { a.innerHTML = ''; a.appendChild(ltr(l.vat ? money(tax(l)) : '—')); } if (b) { b.innerHTML = ''; b.appendChild(ltr(money((Number(l.amt) || 0) + tax(l)))); } }
function foot() { var s = 0, t = 0; c.lines.forEach(function (l) { s += Number(l.amt) || 0; t += tax(l); }); return [s, t, s + t]; }
function paintFoot() { var f = foot(), r = R.querySelector('.cr-li-foot'); if (!r) return; ['.f-sum', '.f-tax', '.f-tot'].forEach(function (k, i) { var n = r.querySelector(k); if (n) { n.innerHTML = ''; n.appendChild(ltr(money(f[i]))); } }); }
/* v876: مفتاح من خيارين بدل القائمة المنسدلة — يُقرأ كاملًا في أي عرض */
function sw(opts, cur, on, label) { return el('div', { class: 'cr-seg2', role: 'group', 'aria-label': label }, opts.map(function (o) { return el('button', { type: 'button', class: cur === o[0] ? 'is-on' : '', 'aria-pressed': cur === o[0] ? 'true' : 'false', disabled: !ed, title: o[2] || null, 'data-live-ok': '', onclick: function () { if (cur !== o[0]) on(o[0]); } }, [o[1]]); })); }
var rows = c.lines.map(function (l, i) {
var f = readyOf(x, l.id), hid = c.hide.indexOf(l.id) >= 0;
var nm = f ? el('div', { class: 'cr-it-n' }, [el('b', { text: l.t }), el('small', { text: (f.gen ? 'بند عام' : 'بند طلبات العقود') + ' · ' + (f.calc === 'pct' ? Number(f.value) + '٪ من المؤجَّل' : f.calc === 'fixed' ? 'قيمة ثابتة ' + money(f.value) : 'يُدخل لكل طلب') })])
: el('input', { type: 'text', class: 'cr-li-in', value: l.t, maxlength: '80', disabled: !ed, placeholder: 'مسمّى البند', 'aria-label': 'اسم البند', oninput: function (e) { l.t = e.target.value; upd(); } });
var am = el('label', { class: 'cr-money' }, [el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: l.amt === '0' ? '' : l.amt, placeholder: '0.00', disabled: !ed, 'aria-label': 'القيمة',
oninput: function (e) { l.amt = e.target.value.replace(/[^\d.]/g, ''); paintRow(e.target.closest('.cr-li'), l); paintFoot(); upd(); } }), el('span', { text: 'ر.س' })]);
return el('div', { class: 'cr-li' + (hid ? ' is-hid' : '') }, [
el('div', { class: 'cr-li-n' }, [nm]),
el('div', { class: 'cr-li-f is-amt' }, [el('span', { class: 'cr-li-l', text: 'القيمة' }), am]),
el('div', { class: 'cr-li-f is-vat' }, [el('span', { class: 'cr-li-l', text: 'ضريبة القيمة المضافة' }), sw([['1', R0 + '٪'], ['0', 'غير خاضع']], l.vat ? '1' : '0', function (v) { l.vat = v === '1'; upd(); draw(); }, 'ضريبة القيمة المضافة')]),
el('div', { class: 'cr-li-f is-show' }, [el('span', { class: 'cr-li-l', text: 'يظهر للعميل' }), sw([['s', 'سطر مستقل'], ['h', 'مدمج', 'يظهر ضمن سطر «' + svcOf(c) + '»']], hid ? 'h' : 's', function (v) { c.hide = c.hide.filter(function (k) { return k !== l.id; }); if (v === 'h') c.hide.push(l.id); upd(); draw(); }, 'الظهور للعميل')]),
el('div', { class: 'cr-li-t' }, [el('span', { class: 'cr-li-tx' }, ['الضريبة ', el('span', { class: 'c-tax' }, [ltr(l.vat ? money(tax(l)) : '—')])]), el('span', { class: 'cr-li-tt' }, [el('small', { text: 'الإجمالي' }), el('b', { class: 'c-tot' }, [ltr(money((Number(l.amt) || 0) + tax(l)))])])]),
ed ? el('button', { type: 'button', class: 'cr-x cr-li-d', title: 'حذف البند', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { c.lines.splice(i, 1); c.hide = c.hide.filter(function (k) { return k !== l.id; }); upd(); draw(); } }, [icon('trash')]) : el('span', { class: 'cr-li-d' })]);
});
var F = foot();
var tbl = el('div', { class: 'cr-li-wrap' }, [
el('div', { class: 'cr-li-hd', 'aria-hidden': 'true' }, ['البند', 'القيمة', 'الضريبة', 'يظهر للعميل', 'الإجمالي', ''].map(function (h) { return el('span', { text: h }); })),
el('div', { class: 'cr-li-list' }, rows.length ? rows : [el('div', { class: 'cr-li-empty' }, [icon('list'), el('b', { text: 'لا بنود بعد' }), el('span', { text: 'أضف بندًا من القائمة أو بندًا جديدًا لهذا الطلب.' })])]),
rows.length ? el('div', { class: 'cr-li-foot' }, [el('div', {}, [el('small', { text: 'مجموع البنود' }), el('b', { class: 'f-sum' }, [ltr(money(F[0]))])]), el('div', {}, [el('small', { text: 'ضريبة القيمة المضافة' }), el('b', { class: 'f-tax' }, [ltr(money(F[1]))])]), el('div', { class: 'is-tot' }, [el('small', { text: 'الإجمالي' }), el('b', {}, [el('span', { class: 'f-tot' }, [ltr(money(F[2]))]), ' ر.س'])])]) : null]);
var add = ed && c.lines.length < 12 ? el('div', { class: 'cr-addrow' }, [(function () {
var b = btn('إضافة بند', { ic: 'plus', on: async function () { await loadCharges();
var have = c.lines.map(function (l) { return l.id; }), names = c.lines.map(function (l) { return String(l.t || '').trim(); }), crqNames = (x.ready || []).map(function (f) { return f.name; });
var row = function (f) { return [f.name, [CH_T[f.calc] + (f.calc === 'manual' ? '' : ' ' + (f.calc === 'pct' ? Number(f.value) + '٪' : money(f.value) + ' ر.س')), f.taxable ? 'خاضع للضريبة' : 'غير خاضع'].join(' · '), have.indexOf(f.k) >= 0 || names.indexOf(String(f.name || '').trim()) >= 0, f]; };
var gen = (ST.charges || []).filter(function (f) { return crqNames.indexOf(f.name) < 0 && !/توحيد/.test(f.name); }); /* v951: بنود التوحيد لا تظهر في التأجيل */
picker(b, { title: 'إضافة بند', ph: 'ابحث باسم البند…', groups: [['بنود طلبات العقود', (x.ready || []).map(row)], ['البنود المالية العامة', gen.map(row)]],
free: 'بند جديد لهذا الطلب فقط', freePh: 'مسمّى البند', freeLine: true, freeOk: 'إضافة البند', freeNote: 'يُضاف إلى هذا الطلب وحده، ثم تحدّد قيمته وضريبته وظهوره للعميل من بطاقته.',
pick: function (v) {
if (v && v.free) { var n = 1; while (c.lines.some(function (l) { return l.id === 'b' + n; })) n++; c.lines.push({ id: 'b' + n, t: v.free.slice(0, 80), amt: '0', vat: true }); }
else if (v) { var a = readyAmt(x, v); c.lines.push({ id: v.k, t: v.name, amt: a ? String(a) : '0', vat: v.taxable !== false }); }
else return;
upd(); draw(); var ins = R.querySelectorAll('.cr-li-list .cr-li'); var last = ins[ins.length - 1]; if (last) { var i2 = last.querySelector('input.cr-num'); if (i2) i2.focus(); } } });
} }); return b; })(), el('small', { class: 'cr-hint', text: 'القائمتان تُداران من «الإعدادات ← الرسوم والضرائب والعمولات».' })]) : null;
var svc = c.hide.length ? field('اسم السطر الذي يراه العميل للبنود المدمجة', el('input', { type: 'text', value: c.svc_label || '', placeholder: 'الرسوم الإدارية والخدمة', maxlength: '60', disabled: !ed, oninput: function (e) { c.svc_label = e.target.value; upd(); } })) : null;
var distB = c.lines.length ? el('div', { class: 'cr-fe-dist' }, [el('span', { text: 'توزيع الرسوم على الدفعات' }), sw([['equal', 'بالتساوي', 'تُقسم بالتساوي على الدفعات المتبقية'], ['ratio', 'بنسبة كل دفعة', 'كل دفعة بقدر قيمتها'], ['manual', 'يدويًا', 'تحدد إضافة كل دفعة في الجدول']], c.dist.mode, function (v) { c.dist.mode = v; upd(); draw(); }, 'توزيع الرسوم')]) : null;
var allP = ST.allPay === x.id;
var main = el('div', { class: 'cr-main' }, [dueCard(x, c, ed, upd), el('section', { class: 'cr-card cr-fe' }, [el('div', { class: 'cr-card-h' }, [el('h2', { text: 'الرسوم' }), el('small', { text: 'تُضاف على العقد وتوزّع على الدفعات' })]), tbl, add, svc, distB]),
el('section', { class: 'cr-card' }, [el('div', { class: 'cr-card-h' }, [el('h2', { text: 'الجدول قبل وبعد' }), el('button', { type: 'button', class: 'cr-link', 'data-live-ok': '', 'aria-pressed': allP ? 'true' : 'false', onclick: function () { ST.allPay = allP ? null : x.id; var w = R.querySelector('#cr-sched'); if (w) { w.innerHTML = ''; w.appendChild(schedTable(x, c, ed, upd)); } this.textContent = ST.allPay ? 'المتغيّر فقط' : 'كل الدفعات'; } }, [allP ? 'المتغيّر فقط' : 'كل الدفعات'])]), el('div', { id: 'cr-sched', class: 'cr-tw' }, [schedTable(x, c, ed, upd)])])]); /* v1126 */
/* v878: الترتيب حتى الإجراء — البنود ← التوزيع ← الجدول ← الملخص ← الضمانات والإجراء */
return [el('div', { class: 'cr-split' }, [main, el('aside', { class: 'cr-side', id: 'cr-sum' }, [sidePanel(x)])])]; /* v1126: الضمانات تبويبها — بلا تنبيه مكرر */
}
/* v913: تبويب «الضمانات» — تغطية الضمانات وبجانبها «طلب استكمال من العميل» */
/* ═════════ v953: «طلب ضمان من العميل» في تبويب «الضمانات» — ظاهر دائمًا
* الغرض · أساس المبلغ (يحسب المبلغ آليًا) · نوع الضمان: قوائم منسدلة يحررها المشرف العام من «الإعدادات»
* المبلغ · مهلة الرد · العنوان · الملاحظة · البيانات التي يعبّئها العميل (المسمّى · نوع الإدخال · إلزامي · الترتيب · إضافة · حذف · حفظها نموذجًا للنوع)
* معاينة حيّة كما تصل للعميل · «معاينة الرسالة» · «إرسال» بتأكيد في الوسط · قائمة المرسَل وحالته وردّ العميل ═════════ */
var GQ = (function () {
var Q = { cfg: null, can: false, busy: false, err: '', f: null, fid: null, sent: null, sentId: null, sentBusy: false, edit: false };
var TY = [['text', 'نص'], ['number', 'رقم'], ['money', 'مبلغ'], ['date', 'تاريخ'], ['phone', 'جوال'], ['nid', 'رقم هوية'], ['select', 'اختيار من قائمة'], ['file', 'مرفق (PDF أو صورة)'], ['ack', 'إقرار (مربع موافقة)']];
var HRS = [['24', '24 ساعة'], ['48', '48 ساعة'], ['72', '72 ساعة'], ['168', '7 أيام']];
var STT = { open: ['بانتظار رد العميل', 'is-wait'], accepted: ['وافق — بانتظار المرفق', 'is-wait'], done: ['اكتمل', 'is-ok'], cancelled: ['أُلغي', 'is-off'], expired: ['انتهت المهلة', 'is-bad'] };
function seg(opts, cur, on, dis) { return el('div', { class: 'cr-seg2', role: 'group' }, opts.map(function (o) { return el('button', { type: 'button', class: cur === o[0] ? 'is-on' : '', 'aria-pressed': cur === o[0] ? 'true' : 'false', disabled: dis, 'data-live-ok': '', onclick: function () { if (cur !== o[0]) on(o[0]); } }, [o[1]]); })); }
function tyT(k) { for (var i = 0; i < TY.length; i++) if (TY[i][0] === k) return TY[i][1]; return 'نص'; }
function num(v) { var n = Number(String(v == null ? '' : v).replace(/[^\d.]/g, '')); return isFinite(n) ? Math.round(n * 100) / 100 : 0; }
async function loadCfg() {
if (Q.busy) return; Q.busy = true; Q.err = '';
try { var j = await api('GET', '/admin/api/crq-guar-cfg'); if (j && j.ok === false) throw new Error(j.message || 'تعذّر تحميل قوائم الضمان.'); Q.cfg = (j && j.cfg) || { purposes: [], bases: [], gtypes: [] }; Q.can = !!(j && j.can_edit); }
catch (e) { Q.err = e.message || 'تعذّر تحميل قوائم الضمان.'; }
Q.busy = false; draw();
}
function asksOf(j) {
var hit = null;
(function walk(o, d) { if (hit || !o || typeof o !== 'object' || d > 3) return; if (Array.isArray(o)) { if (o.length && o[0] && typeof o[0] === 'object' && 'kind' in o[0] && 'state' in o[0] && 'title' in o[0] && !('body' in o[0] && !('types' in o[0]))) hit = o; return; } Object.keys(o).forEach(function (k) { if (/ask/.test(k) && Array.isArray(o[k])) { if (!hit) hit = o[k]; } }); Object.keys(o).forEach(function (k) { walk(o[k], d + 1); }); })(j, 0);
return hit || [];
}
async function loadSent(x) {
if (Q.sentBusy) return; Q.sentBusy = true;
try { var j = await api('GET', '/admin/api/crq/' + x.id + '/msgs'); Q.sent = asksOf(j).filter(function (a) { return a.kind === 'guar'; }); Q.sentId = x.id; }
catch (e) { Q.sent = []; Q.sentId = x.id; }
Q.sentBusy = false; draw();
}
function baseAmt(x, k) {
var r = x.result || {}, pr = r.product || {}, pl = r.plan || {}, f = Q.f;
if (k === 'remain') return num(r.remain) || Math.round((x.contracts || []).filter(function (c) { return (x.sel || []).indexOf(c.no) >= 0; }).reduce(function (a, c) { return a + num(c.remain); }, 0) * 100) / 100;
if (k === 'total') return num(r.total);
if (k === 'gap') return ST.guar && ST.guar.d && ST.guar.key && String(ST.guar.key).split('|')[0] === x.id ? num(ST.guar.d.gap) : 0;
if (k === 'product') return pr.on ? num(pr.value) + num(pr.vat) : 0;
if (k === 'late') return (r.contracts || []).reduce(function (a, c) { return a + num(c.late_amt || c.late_sum || 0); }, 0);
if (k === 'per') return Math.round(num(pl.per) * (Number(f.perN) || 1) * 100) / 100;
return null;
}
function gtOf(t) { var L = (Q.cfg && Q.cfg.gtypes) || []; for (var i = 0; i < L.length; i++) if (L[i].t === t) return L[i]; return null; }
function fieldsOf(g) { return ((g && g.fields) || []).map(function (z, i) { return { k: 'f' + (i + 1), t: z.t || '', type: z.type || 'text', req: z.req !== false, opts: Array.isArray(z.opts) ? z.opts.slice() : [] }; }); }
function reKey() { Q.f.fields.forEach(function (z, i) { z.k = 'f' + (i + 1); }); }
function init(x) {
if (Q.f && Q.fid === x.id) return;
var c = Q.cfg || {}, g = (c.gtypes || [])[0] || null, P = (c.purposes || [])[0] || '', B = (c.bases || [])[0] || ['remain', ''];
Q.fid = x.id; Q.f = { purpose: P, basis: B[0], gtype: g ? g.t : '', amt: '', hours: '48', title: '', note: '', perN: 1, fields: fieldsOf(g), tdirty: false };
var a = baseAmt(x, Q.f.basis); Q.f.amt = a ? String(a) : '';
Q.f.title = autoTitle();
}
function autoTitle() { var f = Q.f; return (f.gtype || 'ضمان') + (f.purpose ? ' — ' + f.purpose : ''); }
function bName(k) { var L = (Q.cfg && Q.cfg.bases) || []; for (var i = 0; i < L.length; i++) if (L[i][0] === k) return L[i][1]; return k; }
function client(x) { var p = x.party || {}; return p.name || x.client_name || x.user_name || x.name || 'العميل'; }
function msgText(x) { /* v956: نص قصير — لا يتكرر في بطاقة «مطلوب منك» والمراسلة */
var f = Q.f, h = HRS.filter(function (z) { return z[0] === f.hours; })[0];
return 'مطلوب منك لإكمال ' + (x.kind_t ? 'طلب ' + x.kind_t + ' ' : 'طلبك ') + (x.no || '') + ': ' + (f.title || f.gtype) + (num(f.amt) > 0 ? ' بقيمة ' + money(num(f.amt)) + ' ريال' : '') + ' — المهلة ' + (h ? h[1] : f.hours + ' ساعة') + '. افتح طلبك في حسابك للرد.';
}
/* المعاينة الحيّة — بطاقة العميل كما يراها: المطلوب · المبلغ · الملاحظة · المهلة · أوافق / لا أوافق، ثم البيان بعد الموافقة */
function preview(x) {
var f = Q.f, h = HRS.filter(function (z) { return z[0] === f.hours; })[0];
return el('div', { class: 'gq-pv' }, [
el('div', { class: 'gq-pv-h' }, [icon('phone'), el('b', { text: 'المعاينة الحيّة — كما يراها العميل' })]),
el('div', { class: 'gq-cc' }, [
el('div', { class: 'gq-cc-t' }, [el('b', { text: 'مطلوب لإكمال طلبك' }), el('small', { text: (x.kind_t || 'طلب') + ' · ' + (x.no || '') })]),
el('div', { class: 'gq-cc-m' }, [el('small', { text: 'المطلوب منك' }), el('b', { text: f.title || f.gtype || '—' }), num(f.amt) > 0 ? el('span', { class: 'gq-cc-a' }, [ltr(money(num(f.amt))), ' ريال']) : null]),
f.note ? el('p', { class: 'gq-cc-n', text: f.note }) : null,
el('div', { class: 'gq-cc-d' }, [icon('clock'), 'يُرجى الرد خلال ' + (h ? h[1] : f.hours + ' ساعة')]),
el('div', { class: 'gq-cc-b' }, [el('span', { class: 'gq-ok', text: 'أوافق' }), el('span', { class: 'gq-no', text: 'لا أوافق' })]),
el('small', { class: 'gq-cc-s', text: 'عند «لا أوافق» يُطلب سبب مختصر ويصل الرد للفريق.' })]),
f.fields.length ? el('div', { class: 'gq-cc gq-cc-2' }, [el('div', { class: 'gq-cc-t' }, [el('b', { text: 'بعد «أوافق» — أكمل البيانات' }), el('small', { text: (f.gtype || '') + (num(f.amt) > 0 ? ' · ' + money(num(f.amt)) + ' ريال' : '') })]),
el('div', { class: 'gq-cc-f' }, f.fields.map(function (z) {
var lab = el('span', {}, [z.t || '—', z.req ? el('i', { class: 'gq-req', text: ' *' }) : null]);
if (z.type === 'ack') return el('label', { class: 'gq-cf is-ack' }, [el('input', { type: 'checkbox', disabled: true }), lab]);
if (z.type === 'file') return el('div', { class: 'gq-cf' }, [lab, el('div', { class: 'gq-cf-up' }, [icon('file'), 'ارفع صورة أو PDF'])]);
var ph = { number: '0000', money: '0.00', date: 'يوم/شهر/سنة', phone: '05xxxxxxxx', nid: '1xxxxxxxxx', select: (z.opts || []).join(' / ') || 'اختر' }[z.type] || '';
return el('div', { class: 'gq-cf' }, [lab, el('div', { class: 'gq-cf-in', text: ph })]);
})), el('span', { class: 'gq-ok is-w', text: 'إرسال البيانات' })]) : null]);
}
function refreshPv(x) { var w = R.querySelector('#gq-pvw'); if (w) { w.innerHTML = ''; w.appendChild(preview(x)); } }
function sel(label, val, opts, on, dis) {
return el('label', { class: 'cr-fld gq-sel' }, [el('span', { text: label }), el('select', { disabled: dis, onchange: function (e) { on(e.target.value); } }, opts.map(function (o) { return el('option', { value: o[0], selected: o[0] === val, text: o[1] }); }))]);
}
function fieldRow(x, z, i, ed) {
var f = Q.f, n = f.fields.length;
var mv = function (d) { var j = i + d; if (j < 0 || j >= n) return; var t = f.fields[i]; f.fields[i] = f.fields[j]; f.fields[j] = t; reKey(); draw(); };
return el('div', { class: 'gq-fr' }, [
el('div', { class: 'gq-fr-o' }, [el('button', { type: 'button', class: 'gq-mv', title: 'لأعلى', 'aria-label': 'نقل البند لأعلى', disabled: !ed || i === 0, 'data-live-ok': '', onclick: function () { mv(-1); } }, ['▲']), el('button', { type: 'button', class: 'gq-mv', title: 'لأسفل', 'aria-label': 'نقل البند لأسفل', disabled: !ed || i === n - 1, 'data-live-ok': '', onclick: function () { mv(1); } }, ['▼'])]),
el('input', { type: 'text', class: 'gq-in', value: z.t, maxlength: '80', placeholder: 'مسمّى البند', disabled: !ed, 'aria-label': 'مسمّى البند ' + (i + 1), oninput: function (e) { z.t = e.target.value; refreshPv(x); } }),
el('select', { class: 'gq-in', disabled: !ed, 'aria-label': 'نوع الإدخال', onchange: function (e) { z.type = e.target.value; if (z.type !== 'select') z.opts = []; draw(); } }, TY.map(function (o) { return el('option', { value: o[0], selected: o[0] === z.type, text: o[1] }); })),
el('label', { class: 'gq-rq' }, [el('input', { type: 'checkbox', checked: z.req, disabled: !ed, onchange: function (e) { z.req = e.target.checked; refreshPv(x); } }), 'إلزامي']),
el('button', { type: 'button', class: 'cr-x', title: 'حذف البند', 'aria-label': 'حذف البند ' + (z.t || ''), disabled: !ed, 'data-live-ok': '', onclick: function () { f.fields.splice(i, 1); reKey(); draw(); } }, [icon('x')]),
z.type === 'select' ? el('input', { type: 'text', class: 'gq-in gq-opts', value: (z.opts || []).join('، '), placeholder: 'الخيارات مفصولة بفاصلة: نافذ، ورقي', disabled: !ed, oninput: function (e) { z.opts = e.target.value.split(/[،,]/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 12); refreshPv(x); } }) : null]);
}
async function saveTpl(x) {
var f = Q.f, c = JSON.parse(JSON.stringify(Q.cfg || {}));
c.gtypes = (c.gtypes || []).map(function (g) { return g.t === f.gtype ? { t: g.t, fields: f.fields.map(function (z) { return { t: z.t, type: z.type, req: z.req, opts: z.opts }; }) } : g; });
try { var j = await api('POST', '/admin/api/crq-guar-cfg', { cfg: c }); if (j && j.ok === false) throw new Error(j.error === 'super_only' ? 'حفظ النماذج للمشرف العام فقط.' : 'تعذّر الحفظ.'); Q.cfg = null; toast(true, 'حُفظت البنود نموذجًا لـ«' + f.gtype + '».'); await loadCfg(); }
catch (e) { toast(false, e.message); }
}
function send(x) {
var f = Q.f;
var bad = !f.gtype ? 'اختر نوع الضمان.' : !String(f.title || '').trim() ? 'اكتب عنوان الطلب للعميل.' : f.fields.some(function (z) { return !String(z.t || '').trim(); }) ? 'أكمل مسمّى كل بند أو احذفه.' : f.fields.some(function (z) { return z.type === 'select' && !(z.opts || []).length; }) ? 'أضف خيارات لبند «اختيار من قائمة».' : '';
if (bad) { toast(false, bad); return; }
ask('إرسال طلب الضمان للعميل', 'سيصل للعميل في حسابه وعلى واتساب: «' + f.title + '»' + (num(f.amt) > 0 ? ' بقيمة ' + money(num(f.amt)) + ' ريال' : '') + '، ويرد خلال ' + (HRS.filter(function (z) { return z[0] === f.hours; })[0] || ['', f.hours + ' ساعة'])[1] + '.', 'إرسال للعميل', async function () {
ST.busy = true; draw();
try {
var j = await api('POST', '/admin/api/crq/' + x.id + '/ask', { hours: Number(f.hours), body: msgText(x), items: [{ kind: 'guar', title: String(f.title).trim().slice(0, 120), detail: String(f.note || '').trim().slice(0, 300), val: num(f.amt) > 0 ? String(num(f.amt)) : '', types: 'any', mb: 10, gtype: f.gtype, purpose: f.purpose, basis: bName(f.basis), fields: f.fields.map(function (z) { return { t: z.t.trim(), type: z.type, req: z.req, opts: z.opts }; }) }] });
if (j && j.ok === false) throw new Error(j.message || 'تعذّر الإرسال.');
ST.busy = false; Q.f = null; Q.sent = null; var mf2 = msgFail(j && j.msg); toast(mf2 ? 'warn' : true, 'سُجّل طلب الضمان' + (mf2 ? ' — ' + mf2 : ' ووصل العميل.')); draw();
} catch (e) { ST.busy = false; draw(); toast(false, e.message); }
});
}
function viewMsg(x) {
var close = function () { m.remove(); document.removeEventListener('keydown', esc, true); }, esc = function (e) { if (e.key === 'Escape') close(); };
var m = el('div', { class: 'gq-mod crq', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'معاينة الرسالة', onclick: function (e) { if (e.target === m) close(); } }, [el('div', { class: 'gq-mod-in' }, [el('b', { text: 'معاينة الرسالة — كما تصل للعميل على واتساب' }),
el('div', { class: 'gx-wa' }, [el('div', { class: 'gx-wa-m' }, [el('div', { class: 'gx-wa-t', text: msgText(x) })])]), el('p', { class: 'cr-hint', text: 'وتظهر له في حسابه بطاقة «مطلوب لإكمال طلبك» كما في المعاينة الحيّة.' }),
el('div', { class: 'gq-act' }, [btn('إغلاق', { cls: 'is-sm', on: close }), btn('إرسال للعميل', { ic: 'send', cls: 'is-pri', on: function () { close(); send(x); } })])])]);
document.body.appendChild(m); document.addEventListener('keydown', esc, true);
}
function sentList(x) {
if (Q.sentId !== x.id || Q.sent == null) { loadSent(x); return el('p', { class: 'cr-hint', text: 'جارٍ تحميل المرسَل…' }); }
if (!Q.sent.length) return el('p', { class: 'cr-hint', text: 'لم يُرسل طلب ضمان في هذا الطلب بعد.' });
return el('div', { class: 'gq-sl' }, Q.sent.slice().reverse().map(function (a) {
var s = a.decision === 'decline' ? ['لم يوافق', 'is-bad'] : a.decision === 'accept' && a.state === 'done' ? ['وافق وأكمل البيانات', 'is-ok'] : STT[a.state] || [a.state, ''];
var resp = a.resp && typeof a.resp === 'object' ? a.resp : {}, fl = Array.isArray(a.fields) ? a.fields : [];
return el('div', { class: 'gq-si' }, [
el('div', { class: 'gq-si-h' }, [el('b', { text: a.gtype || a.title }), el('span', { class: 'gq-st ' + s[1], text: s[0] })]),
el('small', { text: [a.title !== a.gtype ? a.title : '', Number(a.val) > 0 ? money(a.val) + ' ريال' : '', (a.at || a.created_at) ? 'أُرسل ' + at(a.at || a.created_at) : '', a.responded_at ? 'ردّ ' + at(a.responded_at) : ''].filter(Boolean).join(' · ') }),
a.reason ? el('p', { class: 'gq-si-r', text: 'السبب: ' + a.reason }) : null,
Object.keys(resp).length ? el('dl', { class: 'gq-si-d' }, fl.filter(function (z) { return resp[z.k] != null; }).map(function (z) { return el('div', {}, [el('dt', { text: z.t }), el('dd', { text: z.type === 'ack' ? 'أقرّ ✓' : String(resp[z.k]) })]); })) : null]);
}));
}
function cfgEditor() {
var c = Q.cfg, P = (c.purposes || []).join('\n'), G = (c.gtypes || []).map(function (g) { return g.t; }).join('\n');
var tP = el('textarea', { class: 'gq-ta', rows: '6', value: P }), tG = el('textarea', { class: 'gq-ta', rows: '6', value: G });
tP.value = P; tG.value = G;
return el('div', { class: 'gq-ce' }, [el('p', { class: 'cr-hint', text: 'سطر لكل عنصر. الأنواع الجديدة تبدأ بلا بنود — اختر النوع ثم أضف بنوده واحفظها نموذجًا.' }),
el('div', { class: 'gq-g2' }, [el('label', { class: 'cr-fld' }, [el('span', { text: 'الغرض من الضمان' }), tP]), el('label', { class: 'cr-fld' }, [el('span', { text: 'أنواع الضمان' }), tG])]),
el('div', { class: 'gq-act' }, [btn('حفظ القوائم', { cls: 'is-pri is-sm', ic: 'check', on: function () {
var lines = function (t) { return t.value.split('\n').map(function (s) { return s.trim(); }).filter(function (s) { return s.length >= 2; }); };
var gs = lines(tG).map(function (t) { return gtOf(t) || { t: t, fields: [] }; });
ask('حفظ قوائم الضمان', 'تُحدَّث القوائم لكل الفريق في كل الطلبات.', 'حفظ', async function () {
try { var j = await api('POST', '/admin/api/crq-guar-cfg', { cfg: { purposes: lines(tP), gtypes: gs } }); if (j && j.ok === false) throw new Error('تعذّر الحفظ.'); Q.edit = false; Q.cfg = null; toast(true, 'حُفظت القوائم.'); loadCfg(); } catch (e) { toast(false, e.message); }
}); } }), btn('إلغاء', { cls: 'is-sm', on: function () { Q.edit = false; draw(); } })])]);
}
function panel(x, onClose) {
if (!Q.cfg) { if (!Q.busy && !Q.err) loadCfg(); return el('section', { class: 'cr-card gq' }, [el('h2', { text: 'طلب ضمان من العميل' }), Q.err ? note('warn', Q.err) : el('p', { class: 'cr-hint', text: 'جارٍ تحميل القوائم…' })]); }
init(x);
var f = Q.f, c = Q.cfg, ed = !ST.busy && ['closed', 'done', 'rejected', 'withdrawn', 'cancelled'].indexOf(x.state) < 0;
var bases = (c.bases || []).filter(function (b) { return x.kind === 'merge' || ['remain', 'total', 'gap', 'manual', 'late', 'per'].indexOf(b[0]) >= 0; });
var setAmt = function () { var a = baseAmt(x, f.basis); if (a != null) f.amt = a ? String(a) : ''; };
if (!f.adirty && f.basis !== 'manual') setAmt();
var head = el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'طلب ضمان من العميل' }), el('small', { class: 'cr-hint', text: 'المطلوب الآن من العميل لإكمال الطلب' }),
Q.can ? btn(Q.edit ? 'إغلاق تحرير القوائم' : 'تحرير القوائم', { cls: 'is-sm', ic: 'gear', on: function () { Q.edit = !Q.edit; draw(); } }) : null, onClose ? btn('إلغاء', { cls: 'is-sm', ic: 'x', on: onClose }) : null]);
var form = el('div', { class: 'gq-form' }, [
Q.edit && Q.can ? cfgEditor() : null,
el('h4', { text: '١. الضمان المطلوب' }),
el('div', { class: 'gq-g3' }, [
sel('الغرض من الضمان', f.purpose, (c.purposes || []).map(function (p) { return [p, p]; }), function (v) { f.purpose = v; if (!f.tdirty) f.title = autoTitle(); draw(); }, !ed),
sel('أساس المبلغ', f.basis, bases.map(function (b) { return [b[0], b[1]]; }), function (v) { f.basis = v; f.adirty = false; setAmt(); draw(); }, !ed),
sel('نوع الضمان', f.gtype, (c.gtypes || []).map(function (g) { return [g.t, g.t]; }), function (v) { f.gtype = v; f.fields = fieldsOf(gtOf(v)); if (!f.tdirty) f.title = autoTitle(); draw(); }, !ed)]),
el('h4', { text: '٢. تفاصيل الطلب' }),
el('div', { class: 'gq-g3' }, [
el('label', { class: 'cr-fld' }, [el('span', { text: f.basis === 'manual' ? 'المبلغ المطلوب' : 'المبلغ المطلوب (محسوب — يمكن تعديله)' }), el('span', { class: 'cr-money' }, [el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: f.amt, placeholder: '0.00', disabled: !ed, oninput: function (e) { f.amt = e.target.value.replace(/[^\d.]/g, ''); f.adirty = true; refreshPv(x); } }), el('span', { text: 'ر.س' })])]),
f.basis === 'per' ? el('label', { class: 'cr-fld' }, [el('span', { text: 'عدد الدفعات' }), el('input', { type: 'number', min: '1', max: '120', value: String(f.perN), disabled: !ed, onchange: function (e) { f.perN = Math.max(1, Number(e.target.value) || 1); setAmt(); draw(); } })]) : null,
el('div', { class: 'cr-fld' }, [el('span', { text: 'مهلة الرد' }), seg(HRS, f.hours, function (v) { f.hours = v; draw(); }, !ed)])]),
el('label', { class: 'cr-fld' }, [el('span', { text: 'عنوان الطلب للعميل' }), el('input', { type: 'text', maxlength: '120', value: f.title, disabled: !ed, oninput: function (e) { f.title = e.target.value; f.tdirty = true; refreshPv(x); } })]),
el('label', { class: 'cr-fld' }, [el('span', { text: 'ملاحظة للعميل (اختياري)' }), el('textarea', { rows: '2', maxlength: '300', disabled: !ed, oninput: function (e) { f.note = e.target.value; refreshPv(x); } }, [f.note])]),
el('h4', {}, ['٣. البيانات التي يعبّئها العميل', el('small', { text: 'عدّل المسمّى والنوع والترتيب · أضف أو احذف' })]),
el('div', { class: 'gq-fb' }, [el('div', { class: 'gq-fh' }, [el('span', { text: 'الترتيب' }), el('span', { text: 'مسمّى البند' }), el('span', { text: 'نوع الإدخال' }), el('span', { text: 'إلزامي' }), el('span', {})])].concat(f.fields.length ? f.fields.map(function (z, i) { return fieldRow(x, z, i, ed); }) : [el('p', { class: 'cr-hint gq-0', text: 'لا بنود — يوافق العميل أو يعتذر فقط.' })]).concat([
el('div', { class: 'gq-add' }, [btn('إضافة بند', { cls: 'is-sm', ic: 'plus', disabled: !ed || f.fields.length >= 15, on: function () { f.fields.push({ k: '', t: '', type: 'text', req: true, opts: [] }); reKey(); draw(); var L = R.querySelectorAll('.gq-fr .gq-in'); if (L.length) L[L.length - 2 > 0 ? L.length - 2 : 0].focus(); } }),
Q.can && f.gtype ? btn('حفظ هذه البنود نموذجًا لـ«' + f.gtype + '»', { cls: 'is-sm', ic: 'check', disabled: !ed, on: function () { ask('حفظ نموذج البنود', 'تصبح هذه البنود الافتراضية لنوع «' + f.gtype + '» في كل الطلبات.', 'حفظ النموذج', function () { saveTpl(x); }); } }) : null])])),
el('div', { class: 'gq-act' }, [btn('معاينة الرسالة', { ic: 'eye', cls: 'is-sm', on: function () { viewMsg(x); } }), btn('إرسال للعميل', { ic: 'send', cls: 'is-pri', disabled: !ed, on: function () { send(x); } })])]);
return el('section', { class: 'cr-card gq' }, [head, el('div', { class: 'gq-split' }, [form, el('div', { id: 'gq-pvw', class: 'gq-pvw' }, [preview(x)])])]); /* v1127: المرسَل في شاشته */
}
/* v1128: فتح النموذج من قرار التغطية — أساس المبلغ «الفرق» إن وُجد */
function prep(x, basis) { if (!Q.cfg) return; init(x); if (basis && (Q.cfg.bases || []).some(function (b) { return b[0] === basis; })) { Q.f.basis = basis; Q.f.adirty = false; var a = baseAmt(x, basis); if (a != null) Q.f.amt = a ? String(a) : ''; } }
return { panel: panel, sent: sentList, prep: prep, ready: function () { return !!Q.cfg; } };
})();
/* v1128: الضمانات صفحة واحدة بلا تكرار — التغطية وقرارها، ثم نموذج «طلب ضمان من العميل» يُفتح من القرار نفسه، ثم المرسَل */
function gqOpen(x, basis) { ST.gqOpen = x.id; GQ.prep(x, basis); draw(); setTimeout(function () { var p = R.querySelector('#q-gq'); if (p) p.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 60); }
function tabGuar(x) {
var open = ST.gqOpen === x.id;
return [el('div', { id: 'cr-guar', class: 'cr-guarw' }, [guarCard(x)]),
open ? el('div', { id: 'q-gq' }, [GQ.panel(x, function () { ST.gqOpen = null; draw(); })]) : null,
el('section', { class: 'q-card' }, [el('div', { class: 'q-card-h' }, [el('h2', { text: 'المرسَل للعميل' }), el('small', { text: 'طلبات الضمان في هذا الطلب وردّ العميل عليها' })]), GQ.sent(x)])];
}
/* v913: تبويب «المراسلات والمرفقات» */
function tabChat(x) {
if (!window.CRQC || !window.CRQC.msgBox) return [note('warn', 'تعذّر تحميل المراسلات — حدّث الصفحة.')];
var pre = ST.askPre && ST.askPre.id === x.id ? ST.askPre : null; if (pre && pre.open) { ST.sub = ST.sub || {}; ST.sub.chat = 'asks'; }
var c = x.chat || {}, v = subOf('chat', 'chat');
var nav = subNav('chat', [['chat', 'المحادثة', 'mail', Number(c.client_n) || 0], ['asks', 'المطلوب من العميل', 'list', Number(c.open) || 0], ['files', 'المرفقات', 'file'], ['tpl', 'رسائل العميل الجاهزة', 'send']], v);
if (v === 'tpl') return [nav].concat(tabMsg(x));
var gd = ST.guar && ST.guar.d && ST.guar.key && ST.guar.key.split('|')[0] === x.id ? Number(ST.guar.d.gap) || 0 : 0;
var box = window.CRQC.msgBox({ mode: 'staff', view: v, id: x.id, x: x, toast: toast, onSum: function (s) { if (ST.x && ST.x.id === x.id && s) { ST.x.chat = s; paintHead(); } },
ask: { gap: gd, preset: pre ? pre.items : null, reset: !!(pre && pre.reset), open: !!(pre && pre.open), onSent: function () { ST.askPre = null; reload(); } } });
if (pre) { pre.reset = false; pre.open = false; }
return [nav, box];
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
var head = function (badge) { return el('div', { class: 'cr-gv-h' }, [el('span', { class: 'cr-gv-ic' }, [icon('sign')]), el('div', { class: 'cr-gv-t' }, [el('h2', { text: 'تغطية الضمانات' }), el('small', { text: 'ما على العميل مقابل ما لدى المنصة من ضمانات' })]), badge || null]); };
var shell = function (kids) { return el('section', { class: 'cr-card cr-gv' }, [head(kids.badge)].concat(kids.body)); };
if (!g || g.key !== guarKey(x)) { setTimeout(function () { loadGuar(ST.x); }, 0); return shell({ body: [el('p', { class: 'cr-hint', text: 'جارٍ حساب التغطية…' })] }); }
if (g.busy && !g.d) return shell({ body: [el('p', { class: 'cr-hint', text: 'جارٍ حساب التغطية…' })] });
if (g.err) return shell({ body: [g.code === 'not_ready' ? el('p', { class: 'cr-hint', text: 'تعمل بعد تطبيق تحديث قاعدة البيانات stf_271.' }) : note('warn', 'تعذّر حساب التغطية', [el('span', { text: g.err })]), el('div', {}, [btn('إعادة المحاولة', { cls: 'is-sm', on: function () { loadGuar(ST.x, true); } })])] });
var d = g.d, st = d.state, ed = editable(x);
/* v940: عرض مبسّط — النتيجة أولًا، ثم ما على العميل مقابل ما لدى المنصة، ثم القرار عند النقص فقط */
var cov = st === 'covered', obl = Number(d.obligation) || 0, cvr = Number(d.cover) || 0, gapN = Number(d.gap) || 0, pct = Math.max(0, Math.round(Number(d.pct) || 0));
var badge = el('span', { class: 'cr-badge is-' + (cov ? 'ok' : st === 'partial' ? 'warn' : 'bad'), text: cov ? 'مغطّى' : st === 'partial' ? 'تغطية جزئية' : 'لا توجد ضمانات' });
var mx = Math.max(obl, cvr, 1);
var bar = function (t, v, cls) { return el('div', { class: 'cr-g2-bar ' + cls }, [el('span', { text: t }), el('div', { class: 'cr-g2-tr' }, [el('i', { style: 'width:' + (Math.round(v / mx * 1000) / 10) + '%' })]), el('b', {}, [ltr(money(v))])]); };
var extra = cvr - obl;
var verdict = el('div', { class: 'cr-g2-vd is-' + (cov ? 'ok' : 'wr') }, [
el('div', { class: 'cr-g2-vh' }, [el('span', { class: 'cr-g2-vi', 'aria-hidden': 'true', text: cov ? '✓' : '!' }), el('div', {}, [el('h3', { text: cov ? 'الضمانات تغطي الالتزام' : cvr > 0 ? 'ينقص ' + money(gapN) + ' ر.س لتغطية الالتزام' : 'لا توجد ضمانات محسوبة لهذا العميل' }), el('small', { text: cov ? 'لا حاجة لضمان إضافي — يمكنك إكمال الطلب.' : 'تنبيه لك — القرار لك ولا يمنع إكمال الطلب.' })])]),
el('div', { class: 'cr-g2-bars' }, [bar('على العميل', obl, 'is-o'), bar('لدى المنصة', cvr, 'is-c')]),
el('p', { class: 'cr-g2-sum' }, [cov && extra > 0.004 ? 'زيادة في الضمانات ' + money(extra) + ' ر.س · ' : '', 'التغطية ' + pct + '٪'])]);
var row = function (kids, v, cls) { return el('div', { class: 'cr-g2-r' + (cls ? ' ' + cls : '') }, [el('span', { class: 'cr-g2-n' }, kids), el('b', {}, [ltr(money(v))])]); };
/* على العميل: عقوده الفعلية المفتوحة + رسوم هذا الطلب */
var C = d.contracts || [], LIM = 5, more = C.length > LIM && !g.allC;
var oR = (more ? C.slice(0, LIM) : C).map(function (k) { return row([ltr(k.no || '—'), (k.this || (x.sel || []).indexOf(k.no) >= 0) ? el('span', { class: 'cr-gv-tag', text: 'هذا الطلب' }) : null], k.left, k.this ? 'is-this' : ''); });
if (more) oR.push(el('button', { type: 'button', class: 'cr-gv-link', 'data-live-ok': '', onclick: function () { g.allC = true; paintGuar(); } }, ['عرض كل العقود (' + C.length + ')']));
if (!C.length) oR.push(el('p', { class: 'cr-g2-empty', text: 'لا مبالغ متبقية في عقود مفتوحة.' }));
oR.push(row(['رسوم هذا الطلب', el('em', { text: d.calc_ok === false ? 'الحسبة لم تكتمل' : 'شاملة الضريبة' })], d.fees));
/* لدى المنصة: الضمانات */
var gR = [];
(d.bonds || []).forEach(function (b) { gR.push(row(['سند لأمر', el('em', { text: (b.status === 'grace' ? 'في المهلة' : 'ساري') + (b.date ? ' · ' + day(b.date) : '') })], b.value)); });
(d.cheques || []).forEach(function (q) { gR.push(row(['شيك', el('em', { text: day(q.due) + (q.this ? '' : ' · عقد ' + q.contract) }), q.moved ? el('span', { class: 'cr-g2-w', text: 'يحتاج بديل' }) : null], q.amount)); });
(d.dd || []).forEach(function (o) { gR.push(row(['أمر مستديم', el('em', { text: money(o.per) + ' شهريًا حتى ' + day(o.end) }), o.short_end ? el('span', { class: 'cr-g2-w', text: 'يحتاج تمديد' }) : o.low_per ? el('span', { class: 'cr-g2-w', text: 'مبلغ أقل' }) : null], o.cap)); });
(d.court || []).forEach(function (b) { gR.push(row(['سند لأمر', el('em', { text: 'في المحكمة — لا يُحسب' })], b.value, 'is-mut')); });
if (!gR.length) gR.push(el('p', { class: 'cr-g2-empty', text: 'لا توجد ضمانات مسجّلة في ملف العميل.' }));
var lst = function (t, sub, rows, tot) { return el('div', { class: 'cr-g2-l' }, [el('h4', {}, [t, el('small', { text: sub })])].concat(rows, [el('div', { class: 'cr-g2-t' }, [el('span', { text: 'المجموع' }), el('b', {}, [ltr(money(tot))])])])); };
var two = el('div', { class: 'cr-g2-two' }, [lst('على العميل', 'بعد هذا الطلب', oR, obl), lst('لدى المنصة', 'المحسوب في التغطية', gR, cvr)]);
var al = (d.alerts || []).filter(function (a) { return a.k !== 'gap'; }).map(guarAlert).filter(Boolean);
var alerts = al.length ? el('ul', { class: 'cr-gv-al' }, al.map(function (a) { return el('li', { class: 'is-' + a[0] }, [icon('alert'), el('span', { text: a[1] })]); })) : null;
var act = null;
if (cov) act = ed && ST.gqOpen !== x.id ? el('div', { class: 'cr-g2-more' }, [el('button', { type: 'button', class: 'cr-gv-link', 'data-live-ok': '', onclick: function () { gqOpen(x); } }, ['+ طلب ضمان من العميل'])]) : null;
else { var sg = guarSugs(d); sg.forEach(function (s) { if (g.pick[s[0]] === undefined) g.pick[s[0]] = true; });
act = el('div', { class: 'cr-g2-act' }, [el('h3', { text: 'ماذا تريد أن تفعل؟' }), guarLast(x),
sg.length ? el('div', { class: 'cr-gv-sg' }, sg.map(function (s) { return el('label', { class: 'cr-gv-opt' + (g.pick[s[0]] ? ' is-on' : '') }, [el('input', { type: 'checkbox', checked: !!g.pick[s[0]], disabled: !ed, onchange: function (e) { g.pick[s[0]] = e.target.checked; e.target.closest('label').classList.toggle('is-on', e.target.checked); } }), el('span', { text: s[1] })]); })) : null,
ed ? el('input', { type: 'text', class: 'cr-gv-note', maxlength: '300', value: g.note, placeholder: 'ملاحظة على القرار (اختياري)', 'aria-label': 'ملاحظة على القرار', oninput: function (e) { g.note = e.target.value; } }) : null,
ed ? el('div', { class: 'cr-g2-btns' }, [btn(ST.gqOpen === x.id ? 'النموذج مفتوح أدناه' : 'طلب ضمان من العميل', { ic: 'send', cls: 'is-pri', disabled: ST.gqOpen === x.id, on: function () { gqOpen(x, 'gap'); } }), btn('تسجيل قراري فقط', { ic: 'check', on: function () { guarDecide(x, false); } }), btn('متابعة دون ضمان إضافي', { on: function () { guarDecide(x, true); } })]) : null]); }
return el('section', { class: 'cr-card cr-gv cr-g2' }, [head(badge), verdict, two, alerts, act]);
}
/* v912: آخر قرار مسجَّل على تغطية الضمانات — ظاهر في البطاقة نفسها بعد التسجيل */
function guarLast(x) {
var L = (x.log || []).filter(function (g) { return /^تغطية الضمانات/.test(g.action || ''); }).sort(function (a, b) { return String(a.at || '') < String(b.at || '') ? -1 : 1; });
var g = L[L.length - 1]; if (!g) return null;
return note('ok', 'آخر قرار مسجَّل: ' + String(g.action).replace(/^تغطية الضمانات:\s*/, '') + ' — ' + (g.by || 'الفريق') + ' · ' + at(g.at) + (g.note ? ' · ' + g.note : ''));
}
async function guarDecide(x, skip) {
var g = ST.guar, d = g && g.d; if (!d) return;
var ch = skip ? [] : guarSugs(d).filter(function (s) { return g.pick[s[0]]; }).map(function (s) { return s[1]; });
if (!skip && !ch.length) { toast(false, 'اختر اقتراحًا واحدًا على الأقل، أو اختر «متابعة دون ضمان إضافي».'); return; }
try { await api('POST', '/admin/api/crq/' + x.id + '/guar-note', { skip: !!skip, choice: ch, note: g.note || '' }); g.note = ''; toast(true, skip ? 'سُجّل القرار: متابعة دون ضمان إضافي.' : 'سُجّل القرار: ' + ch.join(' · ') + '.'); reload(); }
catch (e) { toast(false, e.message); }
}

/* اللوحة الجانبية: الملخص المالي أو الملحق نفسه */
/* اللوحة الجانبية: الملخص المالي فقط — المستند له تبويبه (v873) */
function sidePanel(x) { return el('div', { class: 'cr-sidein' }, [KIND === 'merge' ? MG.summary(x) : summary(x)]); }
function paintSide(x) { var s = R.querySelector('#cr-sum'); if (s) { s.innerHTML = ''; s.appendChild(sidePanel(x)); } }
/* v1128: الملخص المالي بمسميات الملحق نفسها وأرقامه — ما يراه الموظف هو ما يصل العميل:
* رسوم التأجيل (كل بند كما يظهر للعميل) · المجموع قبل الضريبة · الضريبة · الإجمالي شامل الضريبة ·
* قيمة العقد قبل التأجيل وبعده (المواعيد والقيم المتغيرة في جدول قبل/بعد وحده) */
function summary(x) {
var r = x.result || {}, R0 = rate(x);
if (!r.ok) return el('section', { class: 'q-sum' }, [el('h2', { text: 'الملخص المالي' }), el('div', { class: 'q-sum-err' }, [icon('alert'), el('span', { text: (ERRT[r.error] || 'اختر الموعد الجديد وأضف الرسوم لتظهر الحسبة.') + (r.seq ? ' — الدفعة ' + r.seq : '') + (r.error === 'dist_sum' ? ' — المطلوب ' + money(r.need) + ' · المدخل ' + money(r.got) : '') })])]);
var L = (r.client_lines || []).filter(function (l) { return l && Math.abs(Number(l.amt) || 0) > 0.005; }), sub = L.reduce(function (s2, l) { return s2 + (Number(l.amt) || 0); }, 0);
var sar = function (v, cls) { return el('b', { class: cls || '' }, [ltr(money(v)), el('small', { text: ' ر.س' })]); };
var li = function (k, v, cls) { return el('li', { class: cls || '' }, [el('span', { text: k }), v]); };
var sec = function (t, kids) { return el('div', { class: 'q-sum-s' }, [el('h3', { text: t }), el('ul', {}, kids.filter(Boolean))]); };
return el('section', { class: 'q-sum' }, [el('h2', { text: 'الملخص المالي' }),
sec('رسوم التأجيل', (L.length ? L.map(function (l) { return li(l.t, sar(l.amt)); }) : [li('لا رسوم', sar(0))]).concat([
L.length > 1 ? li('المجموع قبل الضريبة', sar(sub), 'is-sub') : null,
li('ضريبة القيمة المضافة (' + R0 + '%)', sar(r.vat)),
li('الإجمالي شامل الضريبة', sar(r.total, 'is-big'), 'is-tot')])),
r.contract ? sec('قيمة العقد', [li('قبل التأجيل', sar(r.contract.total_before)), li('بعد التأجيل', sar(r.contract.total_after, 'is-hi'), 'is-tot')]) : null]); /* v1134: الدفعة المؤجَّلة والدفعات المتغيرة في جدول «قبل/بعد» وحده — لا تكرار في الملخص */
}
function schedTable(x, c, ed, upd) {
var r = x.result || {}, rs0 = c.sched.mode === 'resched', rows = r.ok && (!rs0 || r.sched === 'resched') ? r.rows : rs0 ? rsRows(x, c) : (x.payments || []).map(function (p) { return { pid: p.pid, seq: p.seq, open: p.open, target: (x.payment_ids || []).indexOf(p.pid) >= 0, due_before: p.due, due_after: p.due, amt_before: p.amount, add: 0, amt_after: p.amount }; }); /* v901: في إعادة الجدولة قبل اكتمال الحسبة (مثل التوزيع اليدوي) تظهر الدفعات الجديدة بعددها لتُدخل رسومها */
var md = false /* v1126: التاريخ اليدوي من «الموعد الجديد» وحده — لا حقول تواريخ مكررة في الجدول */, ma = c.dist.mode === 'manual', rs = c.sched.mode === 'resched';
if (ST.allPay !== x.id && !rs && !ma) { var ch = rows.filter(function (z) { return z.target || z.added || z.merged || String(z.due_after) !== String(z.due_before) || Number(z.add) > 0; }); if (ch.length) rows = ch; } /* v1126: المتغيّر فقط افتراضيًا */
return el('table', { class: 'cr-tbl is-sched' }, [el('thead', {}, [el('tr', {}, ['الدفعة', 'الموعد الحالي', 'الموعد الجديد', 'القيمة', 'الإضافة', 'القيمة الجديدة'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, rows.map(function (z) {
var due = md && z.open && ed ? el('input', { type: 'date', value: c.sched.dates[z.pid] || (z.target ? '' : String(z.due_after).slice(0, 10)), 'aria-label': 'الموعد الجديد للدفعة ' + z.seq, onchange: function (e) { if (e.target.value) c.sched.dates[z.pid] = e.target.value; else delete c.sched.dates[z.pid]; upd(); } }) : el('span', { class: z.due_after !== z.due_before ? 'is-ch' : '', text: day(z.due_after) });
var ak = rs ? z.k : z.pid; /* v899: في إعادة الجدولة تُحفظ رسوم كل دفعة بترتيبها (#1…#n) */
var add = ma && z.open && ed && !z.merged && ak ? el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: c.dist.amounts[ak] || '', placeholder: '0', 'aria-label': 'إضافة الدفعة ' + z.seq, oninput: function (e) { var v = e.target.value.replace(/[^\d.]/g, ''); if (v) c.dist.amounts[ak] = v; else delete c.dist.amounts[ak]; upd(); } }) : ltr(money(z.add));
return el('tr', { class: (z.target && !rs ? 'is-t ' : '') + (z.added ? 'is-new ' : '') + (z.open && !z.merged ? '' : 'is-off'), 'data-pid': z.pid || z.k }, [el('td', { 'data-l': 'الدفعة' }, [String(z.seq), z.target && !rs ? el('small', { class: 'cr-sub', text: 'مؤجَّلة' }) : null, z.added ? el('small', { class: 'cr-sub', text: 'جديدة' }) : null, z.merged ? el('small', { class: 'cr-sub', text: 'أُدمجت' }) : null, !z.open ? el('small', { class: 'cr-sub', text: 'مسدَّدة' }) : null]),
el('td', { 'data-l': 'الموعد الحالي', text: day(z.due_before) }), el('td', { 'data-l': 'الموعد الجديد', class: 'c-due' }, [due]), el('td', { 'data-l': 'القيمة' }, [ltr(money(z.amt_before))]),
el('td', { 'data-l': 'الإضافة', class: 'c-add' }, [add]), el('td', { 'data-l': 'القيمة الجديدة', class: 'c-after' }, [z.amt_after == null ? '—' : ltr(money(z.amt_after))])]);
}))]);
}
/* بعد الحفظ: تُحدَّث اللوحة الجانبية والخلايا المحسوبة فقط — لا يُعاد رسم الحقول فلا يضيع موضع الكتابة */
function paintCalcOut() {
if (KIND === 'merge') { if (ST.tab === 'calc') { paintSide(ST.x); loadGuar(ST.x); MG.repaint(ST.x); } if (ST.tab === 'doc') docPv(ST.x); return; } /* v946 */
if (ST.tab === 'calc') { paintSide(ST.x); loadGuar(ST.x); var ak = R.querySelector('#cr-due'); if (ak && ST.cc && !ak.contains(document.activeElement)) ak.replaceWith(dueCard(ST.x, ST.cc, editable(ST.x), ST.cu)); } /* v1126 */
if (ST.tab === 'doc') docPv(ST.x);
var r = ST.x.result || {}; if (!r.ok) return;
/* v899: إعادة الجدولة يتغيّر فيها عدد الصفوف — يُعاد رسم الجدول ما لم يكن الموظف يكتب فيه */
if (ST.tab === 'calc' && ST.cc && (r.sched === 'resched' || R.querySelectorAll('#cr-sched tbody tr').length !== (r.rows || []).length)) { /* v900: وعند الخروج من إعادة الجدولة يتغيّر عدد الصفوف أيضًا */ var w = R.querySelector('#cr-sched'); if (w && !w.contains(document.activeElement)) { w.innerHTML = ''; w.appendChild(schedTable(ST.x, ST.cc, editable(ST.x), ST.cu)); } return; }
(r.rows || []).forEach(function (z) {
var tr = R.querySelector('tr[data-pid="' + (z.pid || z.k) + '"]'); if (!tr) return;
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
function docTpl(x) { var D = DX(); var base = own(x.doc) ? x.doc.tpl : KIND === 'merge' ? mgT((x.tpl && x.tpl.df) || {}) : (x.tpl && x.tpl.df) || {}; var T = D ? D.tpl(base) : clone(base); if (T.tt) { var NT = { terms: [['بنود الملحق'], 'الشروط والأحكام'], defer: [['تفاصيل التأجيل'], 'جدول الدفعات قبل التأجيل'], contract: [['أثر التأجيل على قيمة العقد'], 'قيمة العقد قبل التأجيل وبعده'], sched: [['جدول الدفعات بعد التعديل'], 'جدول الدفعات الجديد بعد التأجيل'], summary: [[], 'ملخص الطلب'] }; Object.keys(NT).forEach(function (k) { if (!T.tt[k] || NT[k][0].indexOf(T.tt[k]) >= 0) T.tt[k] = NT[k][1]; }); } return T; }
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
/* v883: محرّر القالب بأدراج — درج واحد مفتوح، لكل قسم إخفاء كامل ولكل عنصر إخفاء، و«بيانات المنشأة» مسمّى وقيمة قابلان للتعديل والإضافة (القيمة الفارغة من الإعدادات) */
var DOC_OG = { 'السجل التجاري': 'cr', 'رقم السجل التجاري': 'cr', 'س.ت': 'cr', 'الرقم الضريبي': 'vat', 'رقم ضريبة القيمة المضافة': 'vat', 'الرقم الموحّد': 'unified', 'الرقم الموحد': 'unified', 'رقم وثيقة العمل الحر': 'freelance', 'وثيقة العمل الحر': 'freelance', 'العنوان': 'address', 'المدينة': 'city', 'المنطقة': 'region', 'الدولة': 'country', 'الجوال': 'mobile', 'الهاتف': 'phone', 'رقم التواصل': 'phone', 'واتساب': 'whatsapp', 'رقم الواتساب': 'whatsapp', 'البريد الإلكتروني': 'email', 'البريد': 'email', 'الموقع الإلكتروني': 'website', 'الموقع': 'website', 'الاسم النظامي': 'legal', 'الاسم التجاري': 'brand', 'النشاط الرئيسي': 'activity', 'النشاط': 'activity', 'الكيان': 'entity' };
var DOC_IDS = ['السجل التجاري', 'الرقم الضريبي', 'الرقم الموحّد', 'رقم وثيقة العمل الحر', 'العنوان', 'المدينة', 'المنطقة', 'الجوال', 'واتساب', 'البريد الإلكتروني', 'الموقع الإلكتروني', 'النشاط الرئيسي', 'الكيان', 'الاسم النظامي', 'الاسم التجاري'];
/* v885: صف قابل للتحريك — رقم · محتوى · أعلى · أسفل · إظهار/إخفاء */
function mvRow(i, n, body, on, onEye, onMove, lab) {
return el('div', { class: 'cr-mv' + (on ? '' : ' is-off') }, [el('span', { class: 'cr-mv-n', text: String(i + 1) }), body,
onMove ? el('button', { type: 'button', class: 'cr-x', title: 'نقل لأعلى', 'aria-label': 'نقل ' + lab + ' لأعلى', disabled: !i, 'data-live-ok': '', onclick: function () { onMove(-1); } }, [icon('mvUp')]) : el('span'),
onMove ? el('button', { type: 'button', class: 'cr-x', title: 'نقل لأسفل', 'aria-label': 'نقل ' + lab + ' لأسفل', disabled: i >= n - 1, 'data-live-ok': '', onclick: function () { onMove(1); } }, [icon('mvDn')]) : el('span'),
onEye && !mvRow.ro ? el('button', { type: 'button', class: 'cr-x' + (on ? ' is-show' : ''), title: on ? 'ظاهر — اضغط للإخفاء' : 'مخفي — اضغط للإظهار', 'aria-label': (on ? 'إخفاء ' : 'إظهار ') + lab, 'aria-pressed': on ? 'true' : 'false', 'data-live-ok': '', onclick: onEye }, [icon(on ? 'eye' : 'eyeOff')]) : el('span')]);
}
function specEditor(spec, T, ro, onCh, org, dat, extra, below) {
org = org || {}; dat = dat || {}; mvRow.ro = !!ro;
var sw = function (p, lab) { var on = gp(T, p) !== false; return el('button', { type: 'button', class: 'cr-sw' + (on ? ' is-on' : ''), role: 'switch', 'aria-checked': on ? 'true' : 'false', title: on ? 'ظاهر — اضغط للإخفاء' : 'مخفي — اضغط للإظهار', 'aria-label': (on ? 'إخفاء ' : 'إظهار ') + (lab || ''), disabled: ro, 'data-live-ok': '', onclick: function () { sp(T, p, !on); onCh(true); } }, [el('i', {})]); };
var inp = function (p, lab, area) { var n = el(area ? 'textarea' : 'input', { type: area ? null : 'text', rows: area ? '3' : null, value: gp(T, p) || '', disabled: ro, 'aria-label': lab, oninput: function (e) { sp(T, p, e.target.value); onCh(false); } }); return n; };
var row = function (lab, ctl, hp) { return el('div', { class: 'cr-ed-row' + (hp && gp(T, hp) === false ? ' is-off' : '') }, [el('label', { text: lab }), ctl, hp ? sw(hp, lab) : el('span', { class: 'cr-sw-gap', 'aria-hidden': 'true' })]); };
var cur = ST.docOpen || 'hdr';
/* v1125: بلا أدراج — كل قسم عنصر في «فهرس الأقسام» (الاسم ومفتاح الإخفاء) ومحتواه في لوحة واحدة بجانبه؛ التبديل بلا إعادة رسم */
var acc = function (id, title, sub, on, swEl, body) { return { id: id, title: title, sub: sub, on: on, swEl: swEl, body: body }; };
var out = [];
out.push(acc('hdr', 'الترويسة', 'العنوان واسم المنشأة والشارة', true, null, (spec.hdr || []).map(function (h) { return row(h.l, inp(h.p, h.l), h.hp); })));
(spec.secs || []).forEach(function (s) {
var on = !s.show || gp(T, s.show) !== false, kids = [], sub = '';
if (s.titleP) kids.push(row('عنوان القسم', el('input', { type: 'text', value: gp(T, s.titleP) || s.title, disabled: ro, 'aria-label': 'عنوان القسم', oninput: function (e) { sp(T, s.titleP, e.target.value); onCh(false); } })));
var one = function (s) {
if (s.kind === 'fields') (s.fields || []).forEach(function (f) { kids.push(row(f.l, inp(f.p, f.l, String(gp(T, f.p) || '').length > 60), f.hp)); });
else if (s.kind === 'toggles') { (s.items || []).forEach(function (f) { kids.push(el('div', { class: 'cr-ed-row is-tg' }, [el('label', { text: f.l }), sw(f.p, f.l)])); }); }
else if (s.kind === 'text') kids.push(inp(s.p, s.title, true));
else if (s.kind === 'info') kids.push(el('p', { class: 'cr-hint', text: s.info || '' }));
else if (s.kind === 'pairs') {
/* مسمّى وقيمة لكل سطر — المخفي يُحفظ في _hid ليعود في مكانه */
var P = Array.isArray(gp(T, s.p)) ? gp(T, s.p) : []; sp(T, s.p, P);
if (!T._hid || typeof T._hid !== 'object') T._hid = {}; var HP = Array.isArray(T._hid[s.p]) ? T._hid[s.p] : (T._hid[s.p] = []);
sub = P.length + (P.length === 1 ? ' حقل ظاهر' : ' حقول ظاهرة') + (HP.length ? ' · ' + HP.length + ' مخفي' : '');
P.forEach(function (x, i) {
if (!Array.isArray(x)) return; var dv = org[DOC_OG[String(x[0] || '').trim()]] || '';
kids.push(el('div', { class: 'cr-ed-pr' + (ro ? '' : ' is-mv') }, [
el('input', { type: 'text', class: 'cr-ed-pl', value: x[0] || '', disabled: ro, maxlength: '40', placeholder: 'المسمّى', 'aria-label': 'مسمّى الحقل', oninput: function (e) { x[0] = e.target.value; var v = e.target.parentNode.querySelector('.cr-ed-pv'); if (v) v.placeholder = org[DOC_OG[e.target.value.trim()]] || 'القيمة'; onCh(false); } }),
el('input', { type: 'text', class: 'cr-ed-pv', value: x[1] || '', disabled: ro, maxlength: '120', placeholder: dv || 'القيمة', 'aria-label': 'قيمة ' + (x[0] || 'الحقل'), title: dv ? 'فارغ = من «بيانات المنشأة»: ' + dv : '', oninput: function (e) { x[1] = e.target.value; onCh(false); } }),
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'نقل لأعلى', 'aria-label': 'نقل ' + (x[0] || 'الحقل') + ' لأعلى', disabled: !i, 'data-live-ok': '', onclick: function () { P.splice(i - 1, 0, P.splice(i, 1)[0]); onCh(true); } }, [icon('mvUp')]), /* v944: ترتيب حقول بيانات المنشأة */
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'نقل لأسفل', 'aria-label': 'نقل ' + (x[0] || 'الحقل') + ' لأسفل', disabled: i >= P.length - 1, 'data-live-ok': '', onclick: function () { P.splice(i + 1, 0, P.splice(i, 1)[0]); onCh(true); } }, [icon('mvDn')]),
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'إخفاء من المستند', 'aria-label': 'إخفاء ' + (x[0] || 'الحقل'), 'data-live-ok': '', onclick: function () { HP.push({ t: x[0] || '', v: x[1] || '', at: i }); P.splice(i, 1); onCh(true); } }, [icon('eye')]),
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'حذف', 'aria-label': 'حذف ' + (x[0] || 'الحقل'), 'data-live-ok': '', onclick: function () { P.splice(i, 1); onCh(true); } }, [icon('trash')])]));
});
HP.forEach(function (h, j) {
kids.push(el('div', { class: 'cr-ed-pr is-off' }, [el('span', { class: 'cr-ed-pl', text: h.t || '—' }), el('span', { class: 'cr-ed-pv', text: h.v || org[DOC_OG[String(h.t || '').trim()]] || 'من الإعدادات' }),
ro ? null : el('button', { type: 'button', class: 'cr-x is-show', title: 'إظهار في المستند', 'aria-label': 'إظهار ' + (h.t || 'الحقل'), 'data-live-ok': '', onclick: function () { P.splice(Math.min(+h.at || 0, P.length), 0, [h.t || '', h.v || '']); HP.splice(j, 1); onCh(true); } }, [icon('eye')]),
ro ? null : el('button', { type: 'button', class: 'cr-x', title: 'حذف', 'aria-label': 'حذف ' + (h.t || 'الحقل'), 'data-live-ok': '', onclick: function () { HP.splice(j, 1); onCh(true); } }, [icon('trash')])]));
});
if (!ro) kids.push((function () { var b = btn('إضافة حقل ▾', { ic: 'plus', cls: 'is-sm', on: function () {
var have = P.concat(HP.map(function (h) { return [h.t]; })).map(function (x) { return String(x[0] || '').trim(); });
picker(b, { title: 'إضافة حقل', ph: 'ابحث…', groups: [['حقول المنشأة', DOC_IDS.map(function (l) { var v = org[DOC_OG[l]]; return [l, v ? 'من الإعدادات · ' + v : 'تكتب قيمته هنا', have.indexOf(l) >= 0, l]; })]],
free: 'حقل مخصص', freePh: 'مسمّى الحقل', freeLine: true, freeOk: 'إضافة الحقل', freeNote: 'يظهر في الترويسة بالمسمّى الذي تكتبه، وتكتب قيمته بعد الإضافة.',
pick: function (v) { P.push([v && v.free ? v.free : v, '']); onCh(true); } }); } }); return b; })());
}
else if (s.kind === 'lines') {
var L = Array.isArray(gp(T, s.p)) ? gp(T, s.p) : []; sp(T, s.p, L);
sub = L.length ? L.length + (L.length === 1 ? ' بند' : ' بنود') : 'فارغ — أضف من المكتبة';
if (!L.length) kids.push(el('div', { class: 'cr-ed-empty' }, [icon('list'), el('span', { text: 'لا بنود بعد — أضف من مكتبة البنود، ولا يظهر القسم في المستند وهو فارغ.' })]));
L.forEach(function (t, i) {
kids.push(el('div', { class: 'cr-ed-ln' }, [el('span', { class: 'cr-ed-n', text: String(i + 1) }), el('textarea', { rows: '2', value: t, disabled: ro, 'aria-label': 'البند ' + (i + 1), oninput: function (e) { L[i] = e.target.value; onCh(false); } }),
ro ? null : el('div', { class: 'cr-ed-ops' }, [i ? el('button', { type: 'button', class: 'cr-x', title: 'أعلى', 'aria-label': 'نقل لأعلى', 'data-live-ok': '', onclick: function () { L.splice(i - 1, 0, L.splice(i, 1)[0]); onCh(true); } }, ['↑']) : null,
el('button', { type: 'button', class: 'cr-x', title: 'حذف', 'aria-label': 'حذف البند', 'data-live-ok': '', onclick: function () { L.splice(i, 1); onCh(true); } }, [icon('trash')])])]));
});
if (!ro) kids.push((function () { var b = btn('إضافة بند ▾', { ic: 'plus', cls: 'is-sm', on: function () { picker(b, { title: 'إضافة بند', ph: 'ابحث في كل البنود…', groups: libGroups(L), free: 'كتابة بند جديد', freePh: 'نص البند', pick: function (v) { L.push(v && v.free ? v.free : v); onCh(true); } }); } }); return b; })());
}
/* v885: ترتيب الصفحة — كل قسم بسهمي التحريك ومفتاح الإخفاء */
else if (s.kind === 'order') {
var K0 = (s.items || []).map(function (i) { return i.k; });
var O = (Array.isArray(T.order) ? T.order : []).map(String).filter(function (k, i, a) { return K0.indexOf(k) >= 0 && a.indexOf(k) === i; });
K0.forEach(function (k, i) { if (O.indexOf(k) >= 0) return; var pv = i ? O.indexOf(K0[i - 1]) : -1; O.splice(pv + 1, 0, k); }); /* v905 */ T.order = O;
O.forEach(function (k, i) {
var it = (s.items || []).filter(function (q) { return q.k === k; })[0] || { l: k };
var lab = it.tp ? String(gp(T, it.tp) || it.l) : it.l, onv = !it.show || gp(T, it.show) !== false;
kids.push(mvRow(i, O.length, el('b', { class: 'cr-mv-l', text: lab }), onv, it.show ? function () { sp(T, it.show, !onv); onCh(true); } : null, ro ? null : function (d) { O.splice(i + d, 0, O.splice(i, 1)[0]); onCh(true); }, lab));
});
sub = O.length + ' أقسام';
}
/* v885: أعمدة الجدول — ترتيب وتسمية وإخفاء، والظاهر يتوزّع بعرض متساوٍ */
else if (s.kind === 'cols') {
if (!T.cols || typeof T.cols !== 'object') T.cols = {};
var D0 = s.defs || [], SV = (Array.isArray(T.cols[s.key]) ? T.cols[s.key] : []).filter(function (x) { return x && D0.some(function (d) { return d.k === x.k; }); });
var CL = SV.map(function (x) { return { k: x.k, l: String(x.l || ''), on: x.on !== false }; });
D0.forEach(function (d, i) { if (!CL.some(function (x) { return x.k === d.k; })) CL.splice(Math.min(i, CL.length), 0, { k: d.k, l: '', on: d.on !== false }); });
T.cols[s.key] = CL;
CL.forEach(function (x, i) {
var d = D0.filter(function (q) { return q.k === x.k; })[0] || { l: x.k };
var ip = el('input', { type: 'text', class: 'cr-mv-in', value: x.l, placeholder: d.l, disabled: ro, maxlength: '40', 'aria-label': 'عنوان العمود ' + d.l, oninput: function (e) { x.l = e.target.value; onCh(false); } });
kids.push(mvRow(i, CL.length, ip, x.on, function () { x.on = !x.on; onCh(true); }, ro ? null : function (dd) { CL.splice(i + dd, 0, CL.splice(i, 1)[0]); onCh(true); }, d.l));
});
}
/* v943: حقول القسم — لكل حقل اسمه (يُغيَّر) وترتيبه وإظهاره، كالأعمدة */
else if (s.kind === 'items') {
var I0 = (s.items || []).map(function (f) { return { k: f.k || String(f.p || '').replace(/^show\./, ''), l: f.l, p: f.p, nl: !!f.nl }; });
var IL = (Array.isArray(T.cols[s.fx]) ? T.cols[s.fx] : []).filter(function (q) { return q && I0.some(function (d) { return d.k === q.k; }); }).map(function (q) { return { k: q.k, l: String(q.l || '') }; });
I0.forEach(function (d, i) { if (!IL.some(function (q) { return q.k === d.k; })) IL.splice(Math.min(i, IL.length), 0, { k: d.k, l: '' }); });
var keepIL = function () { if (!T.cols || typeof T.cols !== 'object') T.cols = {}; T.cols[s.fx] = IL; }; /* v945: يُكتب في المستند عند التعديل فقط — لا كتابة عند الفتح */
IL.forEach(function (q, i) {
var d = I0.filter(function (z) { return z.k === q.k; })[0], on = gp(T, d.p) !== false;
var ip = d.nl ? el('span', { class: 'cr-mv-tx', text: d.l }) : el('input', { type: 'text', class: 'cr-mv-in', value: q.l, placeholder: d.l, disabled: ro, maxlength: '60', 'aria-label': 'اسم الحقل ' + d.l, title: 'اكتب اسمًا جديدًا، أو اتركه فارغًا للاسم الافتراضي', oninput: function (e) { q.l = e.target.value; keepIL(); onCh(false); } });
kids.push(mvRow(i, IL.length, ip, on, function () { sp(T, d.p, !on); onCh(true); }, ro ? null : function (dd) { IL.splice(i + dd, 0, IL.splice(i, 1)[0]); keepIL(); onCh(true); }, d.l));
});
}
/* v885: إخفاء صفوف بعينها (دفعة أو بند رسوم) */
else if (s.kind === 'rowsHide') {
if (!T._hid || typeof T._hid !== 'object') T._hid = {};
var HR = Array.isArray(T._hid[s.p]) ? T._hid[s.p].map(String) : []; T._hid[s.p] = HR;
var SRC = s.src === 'fees' ? (Array.isArray(dat.client_lines) ? dat.client_lines : []).map(function (l) { return [String(l.t), String(l.t)]; })
: (Array.isArray(dat.rows) ? dat.rows : []).slice().sort(function (a, b) { return (+a.seq || 0) - (+b.seq || 0); }).map(function (r) { return [String(r.seq), 'الدفعة ' + r.seq + (r.target ? ' · المؤجَّلة' : '')]; });
if (!SRC.length) kids.push(el('p', { class: 'cr-hint', text: 'لا صفوف بعد.' }));
else kids.push(el('div', { class: 'cr-chips' }, SRC.map(function (q) {
var off = HR.indexOf(q[0]) >= 0;
return el('button', { type: 'button', class: 'cr-chip' + (off ? ' is-off' : ''), disabled: ro, 'aria-pressed': off ? 'false' : 'true', title: off ? 'مخفي — اضغط للإظهار' : 'ظاهر — اضغط للإخفاء', 'data-live-ok': '', onclick: function () { if (off) HR.splice(HR.indexOf(q[0]), 1); else HR.push(q[0]); onCh(true); } }, [icon(off ? 'eyeOff' : 'eye'), el('span', { text: q[1] })]);
})));
}
};
(s.parts || [s]).forEach(function (q) { if (q.sub) kids.push(el('div', { class: 'cr-ed-subh', text: q.sub })); one(q); });
if (s.hint) kids.push(el('small', { class: 'cr-hint', text: s.hint }));
var title = s.titleP ? String(gp(T, s.titleP) || s.title) : s.title;
out.push(acc(s.id || title, title, on ? sub : 'مخفي من المستند', on, s.show ? sw(s.show, title) : null, kids));
});
if (extra) out.push(acc(extra.id, extra.title, extra.sub, true, null, extra.body));
if (!out.some(function (o) { return o.id === cur; })) cur = out.length ? out[0].id : '';
var panes = {}, items = {};
var pick = function (id) { cur = id; ST.docOpen = id; keep(); Object.keys(panes).forEach(function (k) { panes[k].hidden = k !== id; items[k].classList.toggle('is-on', k === id); var t = items[k].querySelector('.cr-sx-t'); if (t) t.setAttribute('aria-selected', k === id ? 'true' : 'false'); }); };
var nav = el('div', { class: 'cr-sx-nav', role: 'tablist', 'aria-label': 'أقسام المستند' }, out.map(function (o, n) {
items[o.id] = el('div', { class: 'cr-sx-i' + (o.id === cur ? ' is-on' : '') + (o.on ? '' : ' is-off') }, [
el('button', { type: 'button', role: 'tab', class: 'cr-sx-t', 'aria-selected': o.id === cur ? 'true' : 'false', 'data-live-ok': '', onclick: function () { pick(o.id); } }, [el('span', { class: 'cr-sx-n', text: String(n + 1) }), el('span', { class: 'cr-sx-l' }, [el('b', { text: o.title }), o.sub ? el('small', { text: o.sub }) : null])]),
o.swEl || el('span', { class: 'cr-acc-sw0', 'aria-hidden': 'true' })]);
return items[o.id]; }));
var body = el('div', { class: 'cr-sx-ps' }, out.map(function (o) { panes[o.id] = el('section', { class: 'cr-sx-p' + (o.on ? '' : ' is-off'), role: 'tabpanel', hidden: o.id !== cur, 'aria-label': o.title }, [el('div', { class: 'cr-sx-ph' }, [el('b', { text: o.title }), o.on ? (o.sub ? el('small', { text: o.sub }) : null) : el('span', { class: 'cr-badge is-off', text: 'مخفي من المستند' })]), el('div', { class: 'cr-ed-b' }, o.body)]); return panes[o.id]; }));
return [el('div', { class: 'cr-sx' + (below ? ' has-pv' : '') }, [nav, below ? el('div', { class: 'cr-sx-main' }, [body, below]) : body])]; /* v1128: المعاينة تحت القسم المختار */
}
/* v885: صفوف الدفعات وبنود الرسوم لمحرّر الملحق (إخفاء صف بعينه) — من الحسبة، أو من دفعات العقد قبلها */
function docDat(x) { var r = x.result || {}; return { rows: r.ok && Array.isArray(r.rows) ? r.rows : (x.payments || []).map(function (p) { return { seq: p.seq, open: p.open, target: (x.payment_ids || []).indexOf(p.pid) >= 0 }; }), client_lines: Array.isArray(r.client_lines) ? r.client_lines : [] }; }
function tabDoc(x) {
var D = DX(), ed = editable(x), mine = own(x.doc);
if (!D) return [note('warn', 'تعذّر تحميل محرّر المستندات — حدّث الصفحة.')];
var T = docTpl(x);
var setSrc = function (k) { if (k === 'own' && !mine) { x.doc = { tpl: clone(docTpl(x)), own: true }; queue({ doc: x.doc }); } else if (k === 'def' && mine) { x.doc = {}; queue({ doc: {} }); } draw(); };
var onCh = function (redraw) { if (!ed) return; if (!own(x.doc)) { x.doc = { tpl: T, own: true }; mine = true; var b0 = R.querySelector('.cr-srcbar'); if (b0) b0.replaceWith(mkBar()); } else x.doc.tpl = T; queue({ doc: x.doc }); if (redraw) draw(); else docPv(x); };
var mkBar = function () { return el('div', { class: 'cr-srcbar' }, [el('div', {}, [el('b', { text: 'ملحق تأجيل الدفعة' }), el('small', { class: 'cr-hint', text: mine ? 'نسخة لهذا العميل — لا تغيّر القالب العام.' : 'القالب العام من «قوالب المستندات». أي تعديل هنا ينشئ نسخة لهذا العميل.' })]),
el('div', { class: 'cr-seg', role: 'group', 'aria-label': 'مصدر المستند' }, [['def', 'القالب العام'], ['own', 'نسخة لهذا العميل']].map(function (m) { var on = (m[0] === 'own') === mine; return el('button', { type: 'button', class: on ? 'is-on' : '', 'aria-pressed': on ? 'true' : 'false', disabled: !ed, 'data-live-ok': '', onclick: function () { setSrc(m[0]); } }, [m[1]]); })),
KIND === 'merge' ? MG.tplBtn(T) : D.open ? btn('فتح القالب العام', { cls: 'is-sm', ic: 'file', on: function () { D.open(); } }) : null]); }; /* v948 */
var bar = mkBar();
if (!Array.isArray(T.adds)) T.adds = [];
var pv = el('div', { class: 'cr-pvcol' }, [el('div', { class: 'cr-h2row' }, [el('b', { text: 'المعاينة كما يصل العميل' }), el('div', { class: 'cr-seg is-sm' }, [[false, 'قبل التوقيع'], [true, 'بعد التوقيع (نموذج)']].map(function (m) { return el('button', { type: 'button', class: !!ST.docAfter === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { ST.docAfter = m[0]; draw(); } }, [m[1]]); })), btn('ملء الشاشة', { cls: 'is-sm', ic: 'eye', on: function () { docModal(x, T, pdf); } }), btn('PDF', { cls: 'is-sm', ic: 'down', on: pdf })]), docFrame(x, T, '')]); /* v1128: بلا زر «صفحة العميل» المكرر — لها تبويبها */ /* v943: زر «معاينة» بالحجم الكامل */
return [bar, el('div', { class: 'cr-ed q-doc' }, specEditor(D.spec(), T, !ed, onCh, x.org, docDat(x), { id: 'adds', title: 'أقسام مضافة', sub: 'تظهر بعد بنود الملحق', body: addsEditor(T.adds, !ed, onCh, 'من مكتبة البنود الموحّدة أو قسم فارغ.') }, pv))]; /* v1128: فهرس الأقسام بجانب القسم المختار ومعاينته الحية تحته — شاشة واحدة */
}
/* v943: معاينة الملحق بحجمه الكامل في وسط الشاشة — تنزيل · طباعة · إغلاق */
function docModal(x, T, pdf) {
var ov = el('div', { class: 'cr-dm crq', dir: 'rtl', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'معاينة الملحق' }); /* v945: داخل نطاق الألوان والأزرار */
var f = el('iframe', { class: 'cr-dm-f', title: 'معاينة الملحق' }), inner = el('div', { class: 'cr-dm-in' }, [f]);
var onKey = function (e) { if (e.key === 'Escape') close(); };
var close = function () { ov.remove(); document.removeEventListener('keydown', onKey); };
ov.appendChild(el('div', { class: 'cr-dm-box' }, [el('div', { class: 'cr-dm-h' }, [el('b', { text: 'معاينة الملحق' + (x.no ? ' — ' + x.no : '') }),
btn('تنزيل PDF', { cls: 'is-sm', ic: 'down', on: pdf }), btn('طباعة', { cls: 'is-sm', on: function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { void e; } } }), btn('إغلاق', { cls: 'is-sm', ic: 'x', on: close })]),
el('div', { class: 'cr-dm-b' }, [inner])]));
ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
document.body.appendChild(ov); document.addEventListener('keydown', onKey);
loadDoc(x, f, T);
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
f.srcdoc = h.replace('</head>', '<style>html,body{background:#e9edf3;margin:0}html body .axp-page.axp-page.axp-page.axp-page{margin:0 auto 22px!important;box-shadow:0 6px 24px rgba(11,37,82,.18)!important}html body{padding:14px 0 0!important}</style></head>'); /* v943: فاصل وظل بين الصفحات */
f.onload = function () { try { var w = f.parentNode, k = w.clientWidth / 794; f.style.transform = 'scale(' + Math.min(1, k) + ')'; f.style.width = '794px'; var hh = f.contentDocument ? f.contentDocument.body.scrollHeight : 1123; f.style.height = hh + 'px'; w.style.height = Math.ceil(hh * Math.min(1, k)) + 'px'; } catch (e) { void e; } };
} catch (e) { f.replaceWith(note('bad', e.message)); }
}

/* ── 4) صفحة العميل (v890): رابط واحد من الموافقة حتى التنفيذ — رحلة العميل خطوةً خطوة، وفي كل خطوة إعدادات الرابط فقط
* (النصوص والأزرار والنوافذ والإظهار)؛ أما المحتوى (أقسام الملحق وعناوينها وجداولها وشروطها) فمن «المستند».
* المعاينة صفحة العميل نفسها وتفاعلية: يمرّ الموظف بالمسار كما يفعل العميل، والمحرّر يتبع الخطوة. القالب العام أو نسخة لهذا العميل. ── */
function LPX() { return window.CRQLP || null; }
function lpTpl(x) { var L = LPX(); var base = own(x.page) ? x.page.tpl : (x.tpl && x.tpl.lp) || {}; return L.tpl(base); }
/* أقسام الملحق كما في «المستند ← الملحق في الرابط» */
var LP_DOC = [['summary', 'ملخص الطلب'], ['decision', 'قرار الفريق'], ['defer', 'جدول الدفعات قبل التأجيل'], ['fees', 'رسوم التأجيل'], ['contract', 'قيمة العقد قبل التأجيل وبعده'], ['sched', 'جدول الدفعات الجديد'], ['terms', 'الشروط والأحكام'], ['adds', 'الأقسام المضافة'], ['parties', 'أطراف الملحق'], ['ids', 'بيانات المنشأة'], ['note', 'التنويه']];
/* v953: معاينة PDF — إطار واحد بلا شريط تمرير داخلي */
(function () { function fit(f) { try { var d = f.contentDocument; if (!d || !d.body) return; d.documentElement.style.overflow = 'hidden'; d.body.style.overflow = 'hidden'; var h = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight), cur = parseFloat(f.style.height) || 0; if (h > cur) f.style.height = h + 'px'; } catch (e) {} }
new MutationObserver(function () { document.querySelectorAll('.cr-dm iframe').forEach(function (f) { if (f.__fit) return; f.__fit = 1; f.addEventListener('load', function () { fit(f); setTimeout(function () { fit(f); }, 500); }); fit(f); }); }).observe(document.documentElement, { childList: true, subtree: true }); })();
var LP_MG = [['parties', 'أطراف العقد'], ['summary', 'موضوع العقد'], ['decision', 'طلبك وقرار الفريق'], ['defer', 'تفاصيل قيمة العقد الموحّد'], ['fees', 'خطة الدفع'], ['contract', 'قبل التوحيد وبعده'], ['sched', 'جدول الدفعات'], ['terms', 'الشروط والأحكام'], ['adds', 'الأقسام المضافة'], ['ids', 'بيانات المنشأة'], ['note', 'التنويه']];
/* صفوف خطوة واحدة: نص · نص طويل · لون · مفتاح · رقم، ومفتاح الإظهار بجانب العنصر */
/* v1129: حقول شاشة الرابط مجمّعة — النصوص · الأزرار · الإظهار · الألوان — كل حقل تسميته فوقه ومفتاح إظهاره بجانب التسمية */
function lpRows(L, T, s, ro, onCh) {
var fld = function (f) {
var p = f[0], lab = f[1], kd = f[2], hp = f[3], v = L.get(T, p), ctl;
if (kd === 'c') ctl = el('span', { class: 'cr-col' }, [el('input', { type: 'color', value: v, disabled: ro, 'aria-label': lab, oninput: function (e) { L.set(T, p, e.target.value); e.target.nextSibling.value = e.target.value; onCh(false); } }), el('input', { type: 'text', value: v, maxlength: '7', dir: 'ltr', disabled: ro, 'aria-label': lab + ' (رمز)', onchange: function (e) { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { L.set(T, p, e.target.value); onCh(true); } } })]);
else if (kd === 'b') { var on = v !== false; return el('label', { class: 'q-tg' + (on ? ' is-on' : '') }, [el('span', { text: lab }), el('button', { type: 'button', class: 'cr-sw' + (on ? ' is-on' : ''), role: 'switch', 'aria-checked': on ? 'true' : 'false', disabled: ro, 'aria-label': lab, 'data-live-ok': '', onclick: function () { L.set(T, p, !on); onCh(true); } }, [el('i', {})])]); }
else if (kd === 'n') ctl = el('input', { type: 'number', min: '0', max: '28', value: v, disabled: ro, 'aria-label': lab, oninput: function (e) { L.set(T, p, String(e.target.value)); onCh(false); } });
else ctl = el(kd === 'a' ? 'textarea' : 'input', { type: kd === 'a' ? null : 'text', rows: kd === 'a' ? '3' : null, value: v, disabled: ro, 'aria-label': lab, oninput: function (e) { L.set(T, p, e.target.value); onCh(false); } });
var hon = hp ? L.get(T, hp) !== false : true;
var eye = hp ? el('button', { type: 'button', class: 'cr-sw' + (hon ? ' is-on' : ''), role: 'switch', 'aria-checked': hon ? 'true' : 'false', title: hon ? 'ظاهر — اضغط للإخفاء' : 'مخفي — اضغط للإظهار', disabled: ro, 'aria-label': (hon ? 'إخفاء ' : 'إظهار ') + lab, 'data-live-ok': '', onclick: function () { L.set(T, hp, !hon); onCh(true); } }, [el('i', {})]) : null;
return el('div', { class: 'q-f' + (kd === 'a' ? ' is-wide' : '') + (hon ? '' : ' is-off') }, [el('div', { class: 'q-f-l' }, [el('label', { text: lab }), eye ? el('span', { class: 'q-f-sw' }, [el('small', { text: hon ? 'ظاهر' : 'مخفي' }), eye]) : null]), ctl]);
};
var G = [['نصوص الشاشة', []], ['الأزرار', []], ['ما يظهر للعميل', []], ['الألوان', []]];
s.f.forEach(function (f) { var k = f[2] === 'c' ? 3 : f[2] === 'b' ? 2 : /^زر /.test(f[1]) ? 1 : 0; G[k][1].push(fld(f)); });
return G.filter(function (g) { return g[1].length; }).map(function (g) { return el('div', { class: 'q-fg' }, [el('h4', { text: g[0] }), el('div', { class: 'q-fg-b' + (g[0] === 'ما يظهر للعميل' ? ' is-tg' : '') }, g[1])]); });
}
/* الاستوديو: شريط الرحلة + إعدادات الخطوة + المعاينة التفاعلية — مشترك بين الطلب والقالب العام
* o: { T, ro, views() → Promise({consent, sign}), onT(), doc: function (V) → عقدة بطاقة المحتوى, msg: function () (الانتقال للرسائل) } */
function lpStudio(o) {
var L = LPX(), T = o.T, ro = !!o.ro;
var P = ST.lpv || (ST.lpv = { dev: 'phone' }), seen = ST.lpSeen || (ST.lpSeen = {});
var ALL = L.J.concat(L.JS), cur = ALL.some(function (s) { return s.k === ST.lpk; }) ? ST.lpk : 'v1';
var V = null, f = null;
var jr = el('nav', { class: 'q-steps', 'aria-label': 'رحلة العميل' }), ed = el('div', { class: 'cr-ed q-lp-ed' });
var post = function (m) { if (!V || !f || !f.contentWindow || !f.__ok) return; f.contentWindow.postMessage(Object.assign({ type: 'crq-preview', views: V, tpl: T }, m), location.origin); };
var go = function (k) { cur = k; ST.lpk = k; keep(); paintJr(); paintEd(); post({ go: k }); };
var onCh = function (redraw) { if (o.onT) o.onT(); if (redraw) paintEd(); post({ keep: true }); };
var stp = function (s, i, all) { var on = s.k === cur, sn = seen[s.k] && !on;
return el('button', { type: 'button', class: 'cr-stp' + (on ? ' is-on' : '') + (sn ? ' is-seen' : ''), 'aria-current': on ? 'step' : null, 'data-live-ok': '', onclick: function () { go(s.k); } }, [el('em', { text: sn ? '✓' : all ? String(i + 1) : '•' }), s.t]); };
function paintJr() { /* v1128: رحلة العميل قائمة رأسية مرقّمة بجانب الحقول — بلا أسهم ولا شرائط أفقية مزدحمة، وبلا رابط «الرسائل» المكرر */
jr.innerHTML = '';
var item = function (s, i, num) { var on = s.k === cur, sn = seen[s.k] && !on;
return el('button', { type: 'button', class: 'q-st' + (on ? ' is-on' : '') + (sn ? ' is-seen' : ''), 'aria-current': on ? 'step' : null, 'data-live-ok': '', onclick: function () { go(s.k); } }, [el('i', { text: sn ? '✓' : num ? String(i + 1) : '•' }), el('span', { text: s.t })]); };
jr.appendChild(el('h3', { class: 'q-st-h', text: 'رحلة العميل في الرابط' }));
L.J.forEach(function (s, i) { jr.appendChild(item(s, i, true)); });
if (L.JS.length) { jr.appendChild(el('h3', { class: 'q-st-h', text: 'شاشات مشتركة' })); L.JS.forEach(function (s, i) { jr.appendChild(item(s, i, false)); }); }
}
function paintEd() {
ed.innerHTML = '';
var s = ALL.filter(function (z) { return z.k === cur; })[0] || L.J[0];
ed.appendChild(el('section', { class: 'cr-ed-sec is-open' }, [el('div', { class: 'cr-ed-h' }, [el('b', { text: s.t })]),
el('div', { class: 'cr-ed-b' }, [s.hint ? el('p', { class: 'cr-hint', text: s.hint }) : null].concat(lpRows(L, T, s, ro, onCh)))]));
/* v891: ألوان هوية المستند — للعرض فقط */
if (s.sw && L.IDL) ed.appendChild(el('section', { class: 'cr-ed-sec is-open is-doc' }, [el('div', { class: 'cr-ed-h' }, [el('b', { text: 'ألوان الهوية' }), el('small', { text: 'من هوية المستند (الـ PDF) — ثابتة' })]),
el('div', { class: 'cr-ed-b cr-sws' }, L.IDL.map(function (c) { return el('div', { class: 'cr-swc' }, [el('i', { style: 'background:' + L.IDC[c[0]] }), el('span', { text: c[1] }), el('code', { dir: 'ltr', text: L.IDC[c[0]] })]); }))]));
if (s.doc && o.doc) ed.appendChild(o.doc(V, s));
}
f = el('iframe', { class: 'cr-pv is-' + P.dev, title: 'معاينة صفحة العميل', src: '/crq/?preview=1' });
var lis = function (e) {
if (e.origin !== location.origin || !e.data || e.source !== f.contentWindow) return;
if (!document.body.contains(f)) { window.removeEventListener('message', lis); return; }
if (e.data.type === 'crq-preview-ready') { f.__ok = true; post({ go: cur }); return; }
if (e.data.type === 'crq-preview-at') { var k = e.data.k === 'xd' ? 'x' : e.data.k; seen[k] = true; if (k !== cur) { cur = k; ST.lpk = k; paintJr(); paintEd(); } else paintJr(); }
};
window.addEventListener('message', lis);
var dev = el('div', { class: 'cr-seg is-sm' }, [['phone', 'جوال'], ['web', 'شاشة']].map(function (m) { return el('button', { type: 'button', class: P.dev === m[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function (e) { P.dev = m[0]; [].forEach.call(e.currentTarget.parentNode.children, function (b) { b.className = b === e.currentTarget ? 'is-on' : ''; }); f.className = 'cr-pv is-' + P.dev; fit(); } }, [m[1]]); }));
/* v943: مقاسات حقيقية — الجوال 390×844 والشاشة 1280×800 — مصغّرة لتناسب المساحة دون قص */
var pvin = el('div', { class: 'cr-pv-in' }, [f]), pvw = el('div', { class: 'cr-pv-w' }, [pvin]);
var fit = function () { var W = pvw.clientWidth - 36; if (W <= 0) return; var ph = P.dev === 'phone', dw = ph ? 390 : 1280, dh = ph ? 844 : 800, k = Math.min(1, W / dw); if (ph) k = Math.min(k, Math.max(.6, (window.innerHeight - 200) / dh)); f.style.width = dw + 'px'; f.style.height = dh + 'px'; f.style.maxWidth = 'none'; f.style.minHeight = '0'; f.style.transform = 'scale(' + k + ')'; pvin.style.width = Math.round(dw * k) + 'px'; pvin.style.height = Math.round(dh * k) + 'px'; };
setTimeout(fit, 0); if (window.ResizeObserver) new ResizeObserver(function () { fit(); }).observe(pvw);
var pv = el('div', { class: 'cr-pvcol' }, [el('div', { class: 'cr-pvbar' }, [el('b', { class: 'cr-pvt', text: 'المعاينة التفاعلية' }), dev, btn('من البداية', { cls: 'is-sm', ic: 'undo', on: function () { ST.lpSeen = seen = {}; go('v1'); } })]),
pvw, el('p', { class: 'cr-hint', text: 'جرّب داخل المعاينة كما يفعل العميل: اختر الوسيلة، أدخل أي رمز من 6 أرقام، أقرّ ووافق فتنتقل مباشرة إلى الملحق والتوقيع، ثم التنفيذ والتقييم. لا يُرسل شيء ولا يُحفظ قرار.' })]);
paintJr(); paintEd();
Promise.resolve(o.views()).then(function (v) { V = v; paintEd(); post({ go: cur }); }, function (e) { pv.insertBefore(note('warn', (e && e.message) || 'تعذّر تجهيز المعاينة.'), pv.firstChild); });
return [el('div', { class: 'q-lp' }, [jr, ed, pv])]; /* v1128: ثلاثة أعمدة — الرحلة · حقول الشاشة · المعاينة */
}
var LPV = {};
async function lpViews(x) {
if (LPV.id === x.id && LPV.at === x.updated_at) return LPV;
var out = { id: x.id, at: x.updated_at };
for (var s of ['consent', 'sign']) { try { var j = await api('GET', '/admin/api/crq/' + x.id + '/view/' + s); out[s] = { view: j.view, doc_html: j.doc_html || '', secs: j.secs || null, link: j.link || null, dc: j.dc || null, exp: x.link && x.link.expires_at }; } catch (e) { out[s] = null; out.err = e.message; } }
if (out.err && !out.consent) throw new Error(out.err);
LPV = out; return out;
}
/* المحتوى من المستند: الأقسام التي تظهر في الرابط — للقراءة هنا، وتُعدَّل في «المستند» */
function lpDocCard(V, s, jump) {
var x = V && (V[s.st] || V.consent), lk = (x && x.link) || null, dc = (x && x.dc) || null;
var rows = lk ? (KIND === 'merge' ? LP_MG : LP_DOC).map(function (d, i) { var on = !!(x && Array.isArray(x.secs) && x.secs.some(function (q) { return q.k === d[0]; })); /* v939: الرابط يعرض ما يظهر في الملحق */ return el('div', { class: 'cr-dl' + (on ? '' : ' is-off') }, [el('i', { text: String(i + 1) }), el('span', { text: d[1] }), el('span', { class: 'cr-badge is-' + (on ? 'ok' : 'off'), text: on ? 'في الملحق والرابط' : 'مخفي في الملحق' })]); })
: [el('p', { class: 'cr-hint', text: 'جارٍ قراءة أقسام المستند…' })];
var pdf = lk ? el('p', { class: 'cr-hint' }, [el('b', { text: 'الـ PDF هو الأساس' }), ' — يرى العميل في الرابط أقسام الملحق نفسها في العرض وفي التوقيع. لإخفاء قسم أخفِه من «المستند».']) : null;
/* v893: نصوص الصفحة من المستند نفسه — للقراءة هنا */
var tx = dc ? [['المنشأة في الرأس', dc.org], ['العنوان', dc.title], ['التمهيد', dc.intro || '— مخفي في المستند'], ['الإقرار قبل القرار', dc.ack], ['عنوان التوقيع', dc.sign_t]].map(function (r) { return el('div', { class: 'cr-dtx' }, [el('small', { text: r[0] }), el('span', { text: r[1] || '—' })]); }) : [];
return el('section', { class: 'cr-ed-sec is-open is-doc' }, [el('div', { class: 'cr-ed-h' }, [el('b', { text: 'المحتوى من المستند' }), el('small', { text: 'لا يُكتب هنا' }), jump ? btn('تعديله في «المستند»', { cls: 'is-sm', ic: 'file', on: jump }) : null]),
el('div', { class: 'cr-ed-b' }, tx.concat(rows, [pdf, el('p', { class: 'cr-hint', text: 'العناوين والأعمدة والجداول والشروط تأتي من المستند كما هي — أي تعديل فيه يظهر في الرابط وفي الـ PDF معًا.' })]))]);
}
function tabPage(x) {
var L = LPX();
if (!L || !L.J) { loadLp(); return [el('div', { class: 'cr-load', text: 'جارٍ تحميل محرّر صفحة العميل…' })]; }
var ed = editable(x), mine = own(x.page), T = lpTpl(x), s = x.settings || {};
var mkBar = function () { return el('div', { class: 'cr-srcbar' }, [el('div', {}, [el('b', { text: 'صفحة العميل — رابط واحد من الموافقة حتى التنفيذ' }), el('small', { class: 'cr-hint', text: (mine ? 'نسخة لهذا العميل — لا تغيّر القالب العام. ' : 'القالب العام من «قوالب المستندات ← عقد الشركاء ← صفحات الرابط» — أي تعديل هنا ينشئ نسخة لهذا العميل. ') + 'هنا إعدادات الرابط فقط، والمحتوى من «المستند».' })]),
el('div', { class: 'cr-seg', role: 'group', 'aria-label': 'مصدر الصفحة' }, [['def', 'القالب العام'], ['own', 'نسخة لهذا العميل']].map(function (m) { var on = (m[0] === 'own') === mine; return el('button', { type: 'button', class: on ? 'is-on' : '', 'aria-pressed': on ? 'true' : 'false', disabled: !ed, 'data-live-ok': '', onclick: function () { setSrc(m[0]); } }, [m[1]]); }))]); };
var onT = function () { if (!ed) return; if (!own(x.page)) { x.page = { tpl: T, own: true }; mine = true; var b0 = R.querySelector('.cr-srcbar'); if (b0) b0.replaceWith(mkBar()); } else x.page.tpl = T; queue({ page: x.page }); };
var setSrc = function (k) { if (k === 'own' && !mine) { x.page = { tpl: clone(T), own: true }; queue({ page: x.page }); } else if (k === 'def' && mine) { x.page = {}; queue({ page: {} }); } draw(); };
var hrs = x.valid_hours || s.consent_hours || 48;
var links = (x.links || []).slice().reverse();
var ST2 = { active: ['نشط', 'ok'], used: ['استُخدم', 'info'], expired: ['انتهى', 'warn'], locked: ['أُقفل', 'bad'], revoked: ['أُلغي', 'off'] };
var lk = el('section', { class: 'cr-card' }, [el('h2', { text: 'مدة الرابط وسجله' }), el('div', { class: 'cr-grid' }, [field('مدة الموافقة على العرض', el('select', { disabled: !ed, onchange: function (e) { x.valid_hours = e.target.value ? Number(e.target.value) : null; queue({ valid_hours: x.valid_hours }); } },
[['', 'الافتراضي (' + (s.consent_hours || 48) + ' ساعة)'], ['24', '24 ساعة'], ['48', '48 ساعة'], ['72', '72 ساعة'], ['168', 'أسبوع']].map(function (o) { return el('option', { value: o[0], selected: String(x.valid_hours || '') === o[0], text: o[1] }); })), 'الحالية: ' + hrs + ' ساعة. بعد الموافقة يكمل العميل إلى التوقيع في الرابط نفسه، ومدته ' + (s.sign_hours || 48) + ' ساعة من الموافقة. بانتهاء المدة يُغلق الطلب تلقائيًا.')]),
links.length ? el('div', { class: 'cr-tw' }, [el('table', { class: 'cr-tbl' }, [el('thead', {}, [el('tr', {}, ['المرحلة', 'الحالة', 'أُنشئت', 'صالحة حتى', 'فُتح', 'التحقق', 'مرات طلب الرمز'].map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, links.map(function (l) { var s2 = ST2[l.state] || [l.state, 'info']; return el('tr', {}, [el('td', { 'data-l': 'المرحلة', text: l.step === 'sign' ? 'التوقيع' : 'الموافقة' }), el('td', { 'data-l': 'الحالة' }, [el('span', { class: 'cr-badge is-' + s2[1], text: s2[0] })]),
el('td', { 'data-l': 'أُنشئت', text: at(l.created_at) }), el('td', { 'data-l': 'صالحة حتى', text: at(l.expires_at) }), el('td', { 'data-l': 'فُتح', text: l.opened_at ? at(l.opened_at) : '—' }), el('td', { 'data-l': 'التحقق', text: l.factor === 'whatsapp' ? 'واتساب' : l.factor === 'email' ? 'البريد' : '—' }), el('td', { 'data-l': 'مرات طلب الرمز', text: String(l.sends || 0) })]); }))])]) : null]);
var S = lpStudio({ T: T, ro: !ed, views: function () { return lpViews(x); }, onT: onT, doc: function (V, st) { return lpDocCard(V, st, function () { ST.tab = 'doc'; draw(); }); } });
var pvw = subOf('page', 'page'); /* v1127: الصفحة وإعدادات الرابط شاشتان */
return [mkBar(), subNav('page', [['page', 'صفحة العميل ومعاينتها', 'phone'], ['link', 'مدة الرابط وسجله', 'link', links.length]], pvw)].concat(pvw === 'link' ? [lk] : S);
}
/* v890: رقم الإصدار نفسه — فلا تُحمَّل نسخة قديمة من القالب محفوظة في الشبكة */
function loadLp() { if ((window.CRQLP && window.CRQLP.J) || document.getElementById('crq-lp-js')) return; var sc = document.createElement('script'); sc.id = 'crq-lp-js'; sc.src = '/crq/lp.js?v=1143'; sc.onload = function () { draw(); }; document.head.appendChild(sc); }

/* ── القالب العام لصفحة العميل («صفحات الرابط» في الإعدادات) — الاستوديو نفسه بمعاينة نموذجية ── */
function sampleView(step) {
var d = function (n) { return new Date(Date.now() + n * 864e5).toISOString().slice(0, 10); };
var rows = [{ seq: 3, target: true, open: true, due_before: d(5), due_after: d(185), amt_before: 500, add: 0, amt_after: 500 }, { seq: 4, open: true, due_before: d(35), due_after: d(35), amt_before: 500, add: 57.5, amt_after: 557.5 }, { seq: 5, open: true, due_before: d(65), due_after: d(65), amt_before: 500, add: 57.5, amt_after: 557.5 }];
return { view: { no: 'DF-261114-000001', kind: 'defer', kind_t: 'تأجيل دفعة', step: step, name: 'عميل منصة تيرا', contract_no: 'TRA-26-000123', product: 'iPhone 17 Pro · 256GB',
calc: { client_lines: [{ t: 'رسم التأجيل', amt: 100, tax: 15 }], fees: 100, vat: 15, vat_rate: 15, total: 115, contract: { total_before: 3000, total_after: 3115 }, rows: rows } }, doc_html: '', exp: new Date(Date.now() + 2 * 864e5).toISOString() };
}
/* v912: المعاينة النموذجية من الخادم بأقسام قالب الملحق العام ونصوصه (كما يصل العميل) — كانت بيانات ثابتة لا تطابق المحتوى */
var SVW = null;
async function sampleViews() {
if (SVW) return SVW; var out = {};
for (var s of ['consent', 'sign']) { try { var j = await api('GET', '/admin/api/crq-tpl/sample/' + s); out[s] = { view: j.view, doc_html: j.doc_html || '', secs: j.secs || null, link: j.link || null, dc: j.dc || null, exp: j.view && j.view.exp }; } catch (e) { out[s] = sampleView(s); } }
SVW = out; return out;
}
function lpSettings() {
var box = el('div', { class: 'crq crq-embed', dir: 'rtl' });
var S2 = { T: null, err: '', busy: false, dirty: false };
var paint = function () {
box.innerHTML = '';
if (!LPX() || !LPX().J) { loadLp(); setTimeout(paint, 400); box.appendChild(el('div', { class: 'cr-load', text: 'جارٍ التحميل…' })); return; }
if (!S2.T) { box.appendChild(el('div', { class: 'cr-load', text: S2.err || 'جارٍ تحميل القالب…' })); return; }
var save = btn(S2.busy ? 'جارٍ الحفظ…' : 'حفظ القالب العام', { cls: 'is-pri', ic: 'check', disabled: S2.busy || !S2.dirty, on: async function () {
S2.busy = true; paint();
try { await api('POST', '/admin/api/crq-tpl', { key: 'crqlp', value: S2.T }); S2.dirty = false; S2.msg = 'حُفظ — يُطبَّق على كل طلب جديد وكل طلب لم يُعتمد بعد، والطلبات المرسلة تبقى كما اعتُمدت.'; toast(true, S2.msg); } catch (e) { S2.msg = e.message; toast(false, e.message); }
S2.busy = false; paint(); } });
save.setAttribute('data-lpsave', '');
box.appendChild(el('div', { class: 'cr-srcbar' }, [el('div', {}, [el('b', { text: 'صفحة العميل — رابط واحد من الموافقة حتى التنفيذ' }), el('small', { class: 'cr-hint', text: 'القالب العام لكل الطلبات — ولكل طلب نسخته من تبويب «صفحة العميل» داخل الطلب. هنا إعدادات الرابط فقط، والمحتوى من قالب الملحق. المعاينة بطلب نموذجي وبمحتوى قالب الملحق الحالي كما يصل العميل.' })]), save,
btn('استعادة الافتراضي', { cls: 'is-sm', on: function () { S2.T = LPX().tpl({}); S2.dirty = true; paint(); } })]));
if (S2.msg) box.appendChild(note(/تعذّر|صلاحية/.test(S2.msg) ? 'bad' : 'ok', S2.msg));
var docC = function () { return el('section', { class: 'cr-ed-sec is-open is-doc' }, [el('div', { class: 'cr-ed-h' }, [el('b', { text: 'المحتوى من المستند' }), el('small', { text: 'لا يُكتب هنا' })]),
el('div', { class: 'cr-ed-b' }, [el('p', { class: 'cr-hint', text: 'أقسام الملحق التي تظهر في الرابط تُختار من «قوالب المستندات ← ملحق التأجيل ← الملحق في الرابط»، ولكل طلب من تبويب «المستند». والـ PDF لا يظهر للعميل إلا إذا فُعّل هناك.' })])]); };
lpStudio({ T: S2.T, ro: false, views: sampleViews, onT: function () { S2.dirty = true; var b = box.querySelector('[data-lpsave]'); if (b) b.disabled = false; }, doc: function (V, st) { return V ? lpDocCard(V, st, null) : docC(); } }).forEach(function (n) { box.appendChild(n); });
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
el('td', { 'data-l': 'طريقة الحساب' }, [el('select', { disabled: ro, onchange: function (e) { f.calc = e.target.value; paint(); } }, [['fixed', 'قيمة ثابتة'], ['pct', 'نسبة من الدفعة المؤجلة'], ['manual', 'يُدخل لكل طلب']].map(function (o) { return el('option', { value: o[0], selected: f.calc === o[0], text: o[1] }); }))]),
el('td', { 'data-l': f.calc === 'pct' ? 'النسبة (%)' : 'القيمة (ر.س)' }, [f.calc === 'manual' ? el('span', { class: 'cr-hint', text: '—' }) : el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: String(f.value), disabled: ro, oninput: function (e) { f.value = e.target.value.replace(/[^\d.]/g, ''); } })]),
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
try { await api('POST', '/admin/api/crq-fees', { items: S2.L }); S2.msg = 'حُفظت القائمة — تظهر في «+ إضافة بند» داخل كل طلب، والتلقائية تُضاف للطلبات الجديدة.'; toast(true, S2.msg); } catch (e) { S2.msg = e.message; toast(false, e.message); }
S2.busy = false; paint(); } })]));
else box.appendChild(el('p', { class: 'cr-hint', text: 'للعرض فقط — التعديل لمن يملك صلاحية المالية.' }));
};
api('GET', '/admin/api/crq-fees').then(function (j) { S2.L = (j.items || []).map(function (f) { return Object.assign({}, f, { value: String(f.value) }); }); S2.can = !!j.can; paint(); }, function (e) { S2.err = e.message; paint(); });
paint();
return box;
}
if (KIND === 'defer') window.CRQS = { lpSettings: lpSettings, feesSettings: feesSettings };

/* ── 5) رسائل العميل: رسائل القسم 8 «الطلبات» من «قوالب الرسائل» (v894) برقم فهرسها، كل رسالة كما تصل في واتساب والبريد وإشعار الجوال وإشعار المنصة
* ببيانات هذا الطلب، و«إرسال معاينة لجوالي» اختياري — يصل صاحب الجلسة وحده، ولا يصل العميل شيء. النص نفسه يُعدَّل من «قوالب الرسائل». ── */
var CRQ_MSGS = [['sr_received', 'عند تقديم الطلب'], ['req_offer', 'عند اعتماد العرض وإرسال الرابط (الموافقة والتوقيع)'], ['req_done', 'بعد التنفيذ'], ['sr_rejected', 'عند عدم اعتماد الطلب'], ['req_declined', 'عند اعتذار العميل عن العرض'], ['req_expired', 'بانتهاء مدة الرابط'], ['req_cancelled', 'عند إلغاء العميل طلبه']]; /* v894: القسم 8 «الطلبات» */
var MS = { rows: null, err: '', pv: {}, busy: '' };
function MX() { return window.__teraApp && window.__teraApp.docx && window.__teraApp.docx.msg; }
function msgVars(x) { var exp = x.link && x.link.expires_at ? at(x.link.expires_at) : 'بعد ' + ((x.settings || {}).consent_hours || 48) + ' ساعة من الإرسال';
return { '{product}': x.kind_t || '', '{service}': x.kind_t || 'تأجيل دفعة', '{req}': x.no, '{contract}': x.contract_no || '', '{link}': location.origin + '/crq/?t=…', '{valid}': exp, '{reason}': x.close_t || 'انتهت مدة العرض', '{name}': x.client || '' }; }
function msgFill(t, V) { return String(t || '').replace(/\{[a-z_]+\}/g, function (m) { return V[m] != null ? V[m] : m; }); }
function msgRow(r, x) { var V = msgVars(x); return { title: msgFill(r.title, V), status: msgFill(r.status, V), l1: msgFill(r.l1, V), l2: msgFill(r.l2, V), l3: msgFill(r.l3, V), l4: msgFill(r.l4, V), btn_label: r.btn_label, btn_path: r.btn_path, img: r.img, attach: r.attach, channels: (r.channels || []).slice(), state: r.state }; }
/* v1134: «رسائل العميل الجاهزة» — بناء جديد: قائمة الرسائل · رأس الرسالة (متى تُرسل وأين تصل) · قناة واحدة في كل مرة بمعاينتها الحقيقية
 * (واتساب بتنسيقه، والبريد بارتفاعه الكامل، وإشعار الجوال والمنصة بنصهما من الخادم) · تجربة الإرسال لنفسك من القناة المعروضة */
var MCH = [['wa', 'واتساب', 'whatsapp'], ['mail', 'البريد', 'email'], ['push', 'إشعار الجوال', 'push'], ['app', 'إشعار المنصة', 'inbox']];
function waRich(t) { return String(t || '').split('\n').map(function (ln) { var parts = ln.split(/(\*[^*\n]+\*)/g); return el('span', { class: 'q-wa-l' }, parts.map(function (z) { return /^\*[^*]+\*$/.test(z) ? el('b', { text: z.slice(1, -1) }) : z; })); }); }
function tabMsg(x) {
var M = MX();
if (!M) return [note('warn', 'تعذّر الوصول إلى «قوالب الرسائل» — حدّث الصفحة.')];
if (!MS.rows && !MS.load) { MS.load = true; Promise.resolve(M.list()).then(function (j) { MS.rows = (j && j.rows) || []; MS.load = false; draw(); }, function (e) { MS.err = (e && e.message) || 'تعذّر التحميل.'; MS.rows = []; MS.load = false; draw(); }); }
if (!MS.rows) return [el('div', { class: 'cr-load', text: 'جارٍ قراءة «قوالب الرسائل»…' })];
var sel = ST.msgK || CRQ_MSGS[0][0], r = MS.rows.filter(function (z) { return z.key === sel; })[0], when = (CRQ_MSGS.filter(function (m) { return m[0] === sel; })[0] || [])[1] || '';
var list = el('nav', { class: 'q-ml', 'aria-label': 'رسائل الطلب' }, CRQ_MSGS.map(function (m) { var z = MS.rows.filter(function (q) { return q.key === m[0]; })[0];
return el('button', { type: 'button', class: sel === m[0] ? 'is-on' : '', 'aria-current': sel === m[0] ? 'true' : null, 'data-live-ok': '', onclick: function () { ST.msgK = m[0]; draw(); } }, [el('span', { class: 'q-ml-c', text: z ? z.code : '—' }), el('span', { class: 'q-ml-t' }, [el('b', { text: z ? z.title : m[0] }), el('small', { text: m[1] })]), z && z.state !== 'approved' ? el('em', { class: 'q-tag is-warn', text: 'مسودة' }) : null]); }));
var body = [];
if (!r) body.push(note('warn', 'لا قالب لهذه الرسالة في «قوالب الرسائل».'));
else {
var row = msgRow(r, x), K = sel + ':' + x.id + ':' + x.updated_at, P = MS.pv[K];
if (!P) { MS.pv[K] = P = { st: 'load' }; Promise.resolve(M.preview(sel, row, x.client || '', x.no || '')).then(function (j) { P.st = 'ok'; P.d = j && j.preview; P.err = j && j.ok === false ? (j.message || 'تعذّرت المعاينة.') : ''; draw(); }, function (e) { P.st = 'ok'; P.err = (e && e.message) || 'تعذّرت المعاينة.'; draw(); }); }
var d = P.d || {}, wa = d.wa || {}, ml = d.email || d.mail || {}, pu = d.push || {}, ib = d.app || d.inbox || {};
var chs = (r.channels || []), on = function (k) { return chs.indexOf(k === 'mail' ? 'email' : k) >= 0; };
var cur = subOf('msgch', 'wa'); if (!on(cur)) cur = (MCH.filter(function (c) { return on(c[0]); })[0] || MCH[0])[0];
var lines = [row.l1, row.l2, row.l3, row.l4].filter(Boolean);
body.push(el('header', { class: 'q-mh' }, [el('div', { class: 'q-mh-t' }, [el('span', { class: 'q-ml-c is-lg', text: r.code || '' }), el('div', {}, [el('h2', { text: r.title }), el('small', { text: 'تُرسل ' + when + ' — النص من «قوالب الرسائل»، والبيانات من هذا الطلب.' })])])]));
var tabs = el('div', { class: 'q-seg', role: 'tablist', 'aria-label': 'القناة' }, MCH.map(function (c) { return el('button', { type: 'button', role: 'tab', 'aria-selected': cur === c[0] ? 'true' : 'false', class: cur === c[0] ? 'is-on' : '', disabled: !on(c[0]), title: on(c[0]) ? null : 'موقوفة لهذه الرسالة في «قوالب الرسائل»', 'data-live-ok': '', onclick: function () { ST.sub = ST.sub || {}; ST.sub.msgch = c[0]; keep(); draw(); } }, [c[1]]); }));
var chn = MCH.filter(function (c) { return c[0] === cur; })[0];
var test = btn(MS.busy ? 'جارٍ الإرسال…' : 'أرسل تجربة لي عبر ' + chn[1], { cls: 'is-sm', ic: 'send', disabled: !!MS.busy || !on(cur), on: async function () { MS.busy = chn[2]; draw(); try { var j = await M.test(sel, row, chn[2]); toast(!(j && j.ok === false), (j && j.message) || 'أُرسلت التجربة إليك.'); } catch (e) { toast(false, e.message); } MS.busy = ''; draw(); } });
body.push(el('div', { class: 'q-mbar' }, [tabs, test]));
var pv;
if (P.st === 'load') pv = el('div', { class: 'cr-load', text: 'جارٍ تجهيز المعاينة…' });
else if (cur === 'wa') pv = el('div', { class: 'q-pv-wa' }, [el('div', { class: 'q-wa' }, [wa.img ? el('img', { src: wa.img, alt: '' }) : null, el('div', { class: 'q-wa-t' }, waRich(wa.text || [row.title, ''].concat(lines).join('\n'))), wa.button ? el('span', { class: 'q-wa-b', text: wa.button.text || wa.button }) : null]),
  el('small', { class: 'q-pv-n', text: (wa.key_template || wa.template) ? 'قالب Meta: ' + (wa.key_template || wa.template) + (wa.approved || wa.key_ready ? ' · معتمد' : ' · بانتظار اعتماد Meta') : '' })]);
else if (cur === 'mail') pv = el('div', { class: 'q-pv-mail' }, [el('div', { class: 'q-mail-s' }, [el('small', { text: 'الموضوع' }), el('b', { text: ml.subject || row.title })]),
  ml.html ? (function () { var f = el('iframe', { class: 'q-mail-f', title: 'معاينة البريد', sandbox: 'allow-same-origin', loading: 'lazy' }); f.srcdoc = ml.html; f.addEventListener('load', function () { try { f.style.height = (f.contentDocument.documentElement.scrollHeight + 4) + 'px'; } catch (e) { f.style.height = '900px'; } }); return f; })() : el('div', { class: 'q-mail-t' }, lines.map(function (l) { return el('p', { text: l }); }))]);
else if (cur === 'push') pv = el('div', { class: 'q-pv-ph' }, [el('div', { class: 'q-push' }, [el('div', { class: 'q-push-h' }, [el('i', { text: 'ت' }), el('span', { text: 'منصة تيرا · الآن' })]), el('b', { text: pu.title || row.title }), el('p', { text: pu.text || pu.body || lines.join('\n') })])]);
else pv = el('div', { class: 'q-pv-ph' }, [el('div', { class: 'q-push is-in' }, [el('b', { text: ib.title || row.title }), el('p', { text: ib.text || ib.body || lines.join('\n') }), row.status ? el('span', { class: 'q-tag is-info', text: row.status }) : null])]);
if (P.err) body.push(note('warn', P.err));
body.push(el('div', { class: 'q-pvbox' }, [pv]));
}
if (MS.err) body.unshift(note('bad', MS.err));
return [el('div', { class: 'q-msgs' }, [list, el('section', { class: 'q-card q-mb' }, body)])];
}

/* ── 6) السجل: المراحل بأوقاتها والتوقيعات والتنفيذ ── */
/* v1127: السجل — مرشّحات (الكل · الفريق · العميل · الرسائل · النظام) وخط زمني مجمّع باليوم؛ رسائل النتيجة بعلامة الوصول */
function tabLog(x) {
var f0 = subOf('log', 'all'), K = function (g) { var k = g.kind || g.actor_kind || 'staff'; return /^رسالة «/.test(String(g.action || '')) ? 'msg' : k === 'client' ? 'client' : k === 'system' ? 'system' : 'staff'; };
var A = (x.log || []).slice().reverse(), L = A.filter(function (g) { return f0 === 'all' || K(g) === f0; });
var cnt = function (k) { return A.filter(function (g) { return K(g) === k; }).length; };
var dayK = function (t) { try { return new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return String(t).slice(0, 10); } };
var tm = function (t) { try { return new Date(t).toLocaleTimeString('ar-SA-u-nu-latn', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } };
var groups = [], last = null;
L.forEach(function (g) { var d = dayK(g.at); if (d !== last) { groups.push({ d: d, L: [] }); last = d; } groups[groups.length - 1].L.push(g); });
var who = function (g) { var k = K(g); return k === 'client' ? 'العميل' : k === 'system' || k === 'msg' ? 'النظام' : (g.by || g.actor_t || 'الفريق'); };
var tl = el('div', { class: 'q-tl' }, groups.length ? groups.map(function (G) { return el('section', { class: 'q-tl-d' }, [el('h3', { text: G.d }), el('ol', {}, G.L.map(function (g) { var k = K(g), bad = k === 'msg' && /✗/.test(g.action);
return el('li', { class: 'is-' + k + (bad ? ' is-bad' : '') }, [el('time', { text: tm(g.at), title: at(g.at) }), el('span', { class: 'q-tl-dot', 'aria-hidden': 'true' }), el('div', { class: 'q-tl-b' }, [el('div', { class: 'q-tl-h' }, [el('b', { text: g.action }), el('span', { class: 'q-tl-who', text: who(g) })]), g.note ? el('p', { text: g.note }) : null, g.client ? el('small', { class: 'q-tl-cl', text: 'يراه العميل: ' + g.client }) : null])]); }))]); })
: [el('p', { class: 'q-empty', text: 'لا أحداث في هذا التصنيف.' })]);
var nav = subNav('log', [['all', 'الكل', 'list', A.length], ['staff', 'الفريق', 'team', cnt('staff')], ['client', 'العميل', 'user', cnt('client')], ['msg', 'الرسائل', 'send', cnt('msg')], ['system', 'النظام', 'gear', cnt('system')]], f0);
var ex = legacy(x) ? el('section', { class: 'cr-card' }, [el('h2', { text: 'التنفيذ' }), kvs([['نُفّذ', at(x.executed_at)], ['نُقلت الدفعة إلى العقد', ltr(x.executed_ref.to || '—')], ['ملاحظة التنفيذ', x.executed_ref.note || '—']])])
: x.executed_ref ? el('section', { class: 'cr-card' }, [el('h2', { text: 'التنفيذ' }), (KIND === 'merge' ? MG.execCard(x) : kvs([['نُفّذ', at(x.executed_at)], ['قيمة العقد قبل', ltr(money(x.executed_ref.contract_before))], ['قيمة العقد بعد', ltr(money(x.executed_ref.contract_after))], ['الدفعات المعدّلة', String(x.executed_ref.changed || 0)]])),
null]) : null;
/* v882: السجل — الأحداث، وبطاقة التنفيذ إن وُجدت (التوقيع في «المستند»، والأسباب داخل الأحداث) */
/* v1128: مراحل الطلب بتواريخها أعلى السجل — بلمحة: متى قُدّم ومتى اعتُمد ووافق العميل ووقّع ونُفّذ */
var wh = [x.created_at, x.approved_at || x.sent_at, x.consented_at, x.signed_at, x.executed_at], cur = x.state === 'closed' ? closedAt(x) : stageOf(x);
var ms = el('ol', { class: 'q-ms' }, STEPS.map(function (t, i) { var done = !!wh[i] || i < cur; return el('li', { class: done ? 'is-done' : i === cur ? 'is-cur' : '' }, [el('b', { text: t }), el('span', { text: wh[i] ? at(wh[i]) : i === cur ? (x.state === 'closed' ? 'أُغلق هنا' : 'الآن') : '—' })]); }));
return [ms, nav].concat(ex ? [ex] : [], [el('section', { class: 'q-card' }, [tl])]);
}

/* ═════════ v946: «طلبات توحيد العقود» — الأجزاء الخاصة بالتوحيد: الطلب · الحسبة · الملخص · الإنشاء · التنفيذ ═════════
* بقية الصفحة (القائمة · الخطوة التالية · الضمانات · المستند · صفحة العميل · المراسلات · السجل) مشتركة مع «طلبات تأجيل دفعة» بالمكوّنات نفسها،
* فلا تختلف الفكرة ولا المحتوى. الحسبة على الخادم (crq_calc_merge): المتبقي على العقود + المنتج الإضافي وضريبته + رسوم التوحيد = قيمة العقد الموحّد، ثم خطة الدفع. */
var MG = (function () {
if (KIND !== 'merge') return {};
/* v953: الدورية (يومي · أسبوعي · شهري · نصف سنوي) وتوزيع البنود (بالتساوي · على دفعات تختارها · يدويًا) — المراسلات تبويب واحد
* v952: ضريبة واحدة في الحسبة والملخص (على المنتج والبنود) — قبل الضريبة ثم الضريبة ثم الإجمالي
* v951: الملخص أعلى الحسبة · جدول البنود بأعمدة · «إضافة بند» قائمة واحدة بلا تكرار · اختيار المنتج بقائمة بحث
* v949: صفحة طلب التوحيد بأقسام منفصلة — الطلب (ملخص فقط) · توحيد العقود · طلب المنتج (من قائمة المنتجات مع وسيلة الاستلام) · الحسبة (جدول واحد و«إضافة بند» من البنود الجاهزة) */
var MGE = { no_pick: 'اختر دفعة واحدة على الأقل تحمل البنود في جدول الخطة.', need_two: 'اختر عقدين أو أكثر، أو عقدًا واحدًا مع منتج إضافي.', bad_product: 'اكتب قيمة المنتج في تبويب «طلب المنتج».', no_contracts: 'اختر العقود من تبويب «توحيد العقود».', contract_mismatch: 'أحد العقود لم يعد متاحًا — راجع تبويب «توحيد العقود».', no_open: 'لا دفعات متبقية على العقود المختارة.', bad_count: 'أدخل عدد الدفعات — من 1 إلى 120.', bad_date: 'تاريخ أول دفعة يكون بعد اليوم.', dist_sum: 'مجموع التوزيع اليدوي لا يساوي قيمة العقد الموحّد', contract_closed: 'أحد العقود مغلق', bad_line: 'مسمّى البند حرفان على الأقل.', bad_amount: 'قيمة البند غير صحيحة.' };
var TABS = [['req', 'الطلب', 'user'], ['mgc', 'توحيد العقود', 'list'], ['prod', 'طلب المنتج', 'box'], ['calc', 'الحسبة', 'calc'], ['guar', 'الضمانات', 'sign'], ['doc', 'المستند', 'file'], ['page', 'صفحة العميل', 'phone'], ['chat', 'المراسلات', 'inbox'], ['log', 'السجل', 'clock']];
var TABK = ['req', 'mgc', 'prod', 'calc'];
/* وسائل الاستلام — الوسائل القائمة في طلبات الأهلية و«تسليم إلكتروني» للمنتجات الرقمية */
var RCV = [['ship', 'شحن إلى العنوان', 'العنوان الوطني المسجّل للعميل'], ['pickup', 'استلام من مقر المنصة', 'مقر منصة تيرا — بموعد بعد التوقيع'], ['proxy', 'استلام بالتوكيل (وكيل)', 'بوكالة سارية تتضمن الاستلام'], ['sellproxy', 'توكيل بالبيع لطرف ثالث', 'يُنسَّق مع الفريق بعد التوقيع'], ['digital', 'تسليم إلكتروني', 'للمنتجات الرقمية — إلى الجوال أو البريد']];
var RD_L = { ship: 'عنوان الشحن (إن كان غير العنوان المسجّل)', proxy: 'اسم الوكيل وجواله', digital: 'الجوال أو البريد للتسليم (إن كان غير المسجّل)' };
function rcvName(k) { var o = RCV.filter(function (z) { return z[0] === k; })[0]; return o ? o[1] : ''; }
var PRD = { rows: null, p: null };
function loadProds() { if (PRD.p) return PRD.p; PRD.p = api('GET', '/admin/api/crq-products').then(function (j) { PRD.rows = j.rows || []; draw(); }).catch(function () { PRD.rows = []; PRD.p = null; draw(); }); return PRD.p; }
function rs(x) { return x && x.result && x.result.ok ? x.result : null; }
function cnW(n) { n = Number(n) || 0; return n === 1 ? 'عقد واحد' : n === 2 ? 'عقدان' : n <= 10 ? n + ' عقود' : n + ' عقدًا'; }
function pW(n) { n = Number(n) || 0; return n === 1 ? 'دفعة واحدة' : n === 2 ? 'دفعتان' : n <= 10 ? n + ' دفعات' : n + ' دفعة'; }
function mW(n) { n = Number(n) || 0; return n === 1 ? 'شهر واحد' : n === 2 ? 'شهران' : n <= 10 ? n + ' أشهر' : n + ' شهرًا'; }
function errT(x) { var e = (x && x.result && x.result.error) || ''; return MGE[e] || ERRT[e] || (x && x.kind === 'merge' ? 'أكمل الحسبة — حدّد عدد الدفعات وتاريخ أول دفعة في «خطة الدفع».' : 'أكمل الحسبة'); }
function seg(opts, cur, on, dis) { return el('div', { class: 'cr-seg2', role: 'group' }, opts.map(function (o) { return el('button', { type: 'button', class: cur === o[0] ? 'is-on' : '', 'aria-pressed': cur === o[0] ? 'true' : 'false', disabled: dis, 'data-live-ok': '', onclick: function () { if (cur !== o[0]) on(o[0]); } }, [o[1]]); })); }
function lateTag(n) { return n ? el('span', { class: 'cr-py-s is-bad', text: n === 1 ? 'دفعة متأخرة' : n === 2 ? 'دفعتان متأخرتان' : n + ' دفعات متأخرة' }) : el('span', { class: 'cr-py-s is-ok', text: 'منتظم' }); }
function goTab(k) { ST.tab = k; keep(); draw(); toTop(); }
/* المنتج: قرار الفريق (في الحسبة) فوق طلب العميل (في الاقتراح) — حقلًا حقلًا */
var PK = ['on', 'value', 'type', 'vat', 'sec', 'pk', 'det', 'recv', 'rd'];
function prodOf(x) { var c0 = x.calc && typeof x.calc === 'object' ? x.calc : {}, pr = c0.product || {}, pp = (x.proposal || {}).product || {}, o = {}; PK.forEach(function (k) { o[k] = pr[k] != null ? pr[k] : pp[k]; }); o.on = o.on === true; if (o.vat == null) o.vat = true; return o; }
function setP(x, patch, redraw) { var cc = x.calc && typeof x.calc === 'object' ? x.calc : {}; cc.product = Object.assign(prodOf(x), patch); x.calc = cc; queue({ calc: cc }); if (redraw) draw(); }
function tabState(x, k) {
if (k === 'req') return '';
if (k === 'mgc') return (x.sel || []).length ? 'ok' : 'miss';
if (k === 'prod') { var p = prodOf(x); return !p.on ? '' : Number(p.value) > 0 && String(p.type || '').trim() && p.recv ? 'ok' : 'miss'; }
return undefined;
}

/* ── 1) الطلب: ملخص فقط — طلب العميل كما قدّمه (لا يتغيّر) · قرار الفريق حتى الآن · بيانات الطلب ── */
function tile(k, v, sub, go) {
var kids = [el('small', { text: k }), el('b', {}, [v || '—']), sub ? el('span', { class: 'cr-mgs-s', text: sub }) : null, go ? el('i', { class: 'cr-mgs-go' }, [icon('lt')]) : null];
return go ? el('button', { type: 'button', class: 'cr-mgs-t is-go', 'data-live-ok': '', 'aria-label': k + ' — فتح التبويب', onclick: function () { goTab(go); } }, kids) : el('div', { class: 'cr-mgs-t' }, kids);
}
function tabReq(x) {
var P = x.proposal || {}, pp = P.product || {}, rq = Array.isArray(P.contracts) ? P.contracts : [], r = rs(x), p = prodOf(x), S0 = x.sel || [], cli = x.origin === 'client';
var nos = function (L) { return el('span', { class: 'cr-mgs-nos' }, L.map(function (n, i) { return el('span', {}, [i ? ' + ' : '', ltr(n)]); })); };
var cn = String(x.client_note || '').trim();
var reqCard = el('section', { class: 'cr-card' }, [el('div', { class: 'cr-mgs-h' }, [el('h2', { text: cli ? 'طلب العميل كما قدّمه' : 'الطلب كما أنشأه الفريق' }), el('small', { class: 'cr-hint', text: 'لا يتغيّر بقرار الفريق' })]),
el('div', { class: 'cr-mgs' }, [
tile('العقود المطلوب توحيدها', rq.length ? nos(rq) : '—', rq.length ? cnW(rq.length) : ''),
tile('المنتج المطلوب', pp.on ? (pp.type || 'منتج إضافي') : 'لا', pp.on ? [money(pp.value) + ' ر.س', pp.recv ? 'الاستلام: ' + rcvName(pp.recv) : ''].filter(Boolean).join(' · ') : (cli ? 'لم يطلب منتجًا في طلبه' : 'توحيد فقط')),
tile('مدة خطة الدفع المقترحة', P.team ? 'يحددها الفريق' : P.months ? (P.unit && P.unit !== 'month' && UW[P.unit] ? pW(P.months) + ' ' + UW[P.unit] : mW(P.months)) : '—', '')]),
cn ? el('p', { class: 'cr-mgs-n' }, [el('b', { text: (cli ? 'ملاحظة العميل' : 'ملاحظة') + ': ' }), cn]) : null]);
var added = S0.filter(function (n) { return cli && rq.length && rq.indexOf(n) < 0; });
var pl = r && r.plan || {};
var decCard = el('section', { class: 'cr-card' }, [el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'قرار الفريق حتى الآن' }), el('small', { class: 'cr-hint', text: 'التفاصيل في تبويباتها' })]),
el('div', { class: 'cr-mgs' }, [
tile('توحيد العقود', S0.length ? cnW(S0.length) : 'لم تُحدَّد العقود', added.length ? 'أضاف الفريق ' + added.join('، ') : r ? 'المتبقي ' + money(r.remain) + ' ر.س' : '', 'mgc'),
tile('طلب المنتج', p.on ? (String(p.type || '').trim() || 'لم يُختر المنتج') + (Number(p.value) > 0 ? ' · ' + money(p.value) : '') : 'توحيد فقط', p.on ? (p.recv ? 'الاستلام: ' + rcvName(p.recv) : 'لم تُحدَّد وسيلة الاستلام') : '', 'prod'),
tile('قيمة العقد الموحّد', r ? el('span', {}, [ltr(money(r.total)), ' ر.س']) : '—', r ? pW(pl.count) + ' · قيمة الدفعة ' + money(pl.per) : errT(x), 'calc')])]);
var mt = function (ic, k, v, cls) { return el('div', { class: 'cr-mt' + (cls ? ' ' + cls : '') }, [el('span', { class: 'cr-pf-ic' }, [icon(ic)]), el('div', {}, [el('small', { text: k }), el('b', {}, [v || '—'])])]); };
var meta = el('section', { class: 'cr-card' }, [el('h2', { text: 'بيانات الطلب' }),
el('div', { class: 'cr-mts' }, [mt(cli ? 'user' : 'team', 'مصدر الطلب', cli ? 'قدّمه العميل من حسابه' : 'أنشأه الفريق'), mt('clock', 'تاريخ الطلب', at(x.created_at)),
mt('sign', 'أعدّه', x.prepared_t || 'لم يُعدّ بعد', x.prepared_t ? '' : 'is-mut'), mt('ok', 'اعتمده', x.approved_t ? el('span', {}, [x.approved_t, el('small', { text: ' · ' + at(x.approved_at) })]) : 'لم يُعتمد بعد', x.approved_t ? '' : 'is-mut')])]);
return [reqCard, decCard, meta];
}

/* ── 2) توحيد العقود: العقود فقط — يضيف الفريق عقدًا أو يحذفه، والمتأخر بالأحمر ── */
function tabCts(x) {
var ed = editable(x), S0 = (x.sel || []).slice(), all = x.contracts || [], P = x.proposal || {}, rq = Array.isArray(P.contracts) ? P.contracts : [], r = rs(x);
var rows = all.map(function (c) {
var on = S0.indexOf(c.no) >= 0, dis = !ed || (!!c.busy && !on), byTeam = on && x.origin === 'client' && rq.length && rq.indexOf(c.no) < 0;
return el('label', { class: 'cr-py cr-mg-c' + (on ? ' is-on' : '') + (c.late_n ? ' is-late' : '') + (dis ? ' is-ro' : '') }, [
el('input', { type: 'checkbox', checked: on, disabled: dis, 'aria-label': 'العقد ' + c.no, onchange: function (e) { var L = S0.filter(function (n) { return n !== c.no; }); if (e.target.checked) L.push(c.no); x.sel = L; queue({ contract_nos: L }); draw(); } }),
el('span', { class: 'cr-py-ck', 'aria-hidden': 'true' }, [icon('check')]),
el('span', { class: 'cr-py-n' }, [icon('file')]),
el('span', { class: 'cr-py-d' }, [el('b', {}, [ltr(c.no)]), el('small', { text: (c.product || 'عقد') + ' · ' + pW(c.open_n) + ' متبقية' + (c.next_due ? ' · التالية ' + day(c.next_due) : '') })]),
el('span', { class: 'cr-py-a' }, [ltr(money(c.remain)), el('small', { text: ' ر.س' })]),
c.busy && !on ? el('span', { class: 'cr-py-s is-warn', text: 'في طلب قائم ' + c.busy }) : byTeam ? el('span', { class: 'cr-py-s is-sel', text: 'أضافه الفريق' }) : lateTag(Number(c.late_n) || 0)]);
});
return [el('section', { class: 'cr-card' }, [el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'العقود المطلوب توحيدها' }), el('small', { class: 'cr-hint', text: 'عقدان أو أكثر، أو عقد واحد مع منتج' })]),
rq.length && x.origin === 'client' ? el('p', { class: 'cr-hint', text: 'طلب العميل: ' + rq.join(' + ') + (ed ? ' — يضيف الفريق عقدًا أو يحذفه من هنا.' : '') }) : null,
el('div', { class: 'cr-pys', role: 'group', 'aria-label': 'عقود العميل' }, rows.length ? rows : [el('p', { class: 'cr-hint', text: 'لا عقود قائمة بدفعات متبقية.' })]),
el('div', { class: 'cr-mg-bar' }, [el('span', {}, [el('b', { text: cnW(S0.length) }), ' محددة']), r ? el('span', {}, ['المتبقي عليها ', ltr(money(r.remain)), ' ر.س', Number(r.late) > 0 ? el('em', { text: ' · منه متأخر ' + money(r.late) }) : null]) : el('span', { class: 'cr-mg-err', text: errT(x) })])])];
}

/* ── 3) طلب المنتج: المنتج من القائمة (البطاقات · أجهزة المتجر · أخرى) وقيمته وتفاصيله · وسيلة الاستلام ── */
function tabProd(x) {
var ed = editable(x), p = prodOf(x), pp = (x.proposal || {}).product || {}, R0 = Number(x.vat_rate) || 15;
if (!PRD.rows) loadProds();
var set = function (o, redraw) { setP(x, o, redraw); };
var head = el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'المنتج' }), el('small', { class: 'cr-hint', text: pp.on ? 'طلب العميل: ' + (pp.type || 'منتج إضافي') + ' بقيمة ' + money(pp.value) + ' ر.س' : x.origin === 'client' ? 'لم يطلب العميل منتجًا في طلبه' : 'من قائمة المنتجات أو «أخرى»' })]);
var parts = [head, seg([['0', 'توحيد فقط'], ['1', 'توحيد مع منتج']], p.on ? '1' : '0', function (v) { set({ on: v === '1' }, true); }, !ed)];
if (p.on) {
var curK = p.pk || (String(p.type || '').trim() ? '__other' : '');
var sel = prodBtn(p.type, curK, !ed, function (v) {
if (v.free) { set({ pk: '__other', sec: '', type: v.free.slice(0, 80) }, true); return; }
set({ pk: v.key, sec: v.section, type: v.name, value: Number(p.value) > 0 ? String(p.value) : Number(v.price) > 0 ? String(v.price) : '' }, true);
});
var v = Number(p.value) || 0;
parts.push(el('div', { class: 'cr-mgp' }, [
el('div', { class: 'cr-fld is-wide' + (String(p.type || '').trim() ? '' : ' is-miss') }, [el('span', { text: 'المنتج' }), sel]),
curK === '__other' ? el('label', { class: 'cr-fld is-wide' }, [el('span', { text: 'اسم المنتج' }), el('input', { type: 'text', maxlength: '80', value: p.type || '', disabled: !ed, placeholder: 'مثال: بطاقات قوقل بلاي', oninput: function (e) { set({ type: e.target.value }); } })]) : null,
el('label', { class: 'cr-fld' + (v > 0 ? '' : ' is-miss') }, [el('span', { text: 'قيمة المنتج (قبل الضريبة)' }), el('span', { class: 'cr-money' }, [el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: p.value != null ? String(p.value) : '', placeholder: '0.00', disabled: !ed, oninput: function (e) { set({ value: e.target.value.replace(/[^\d.]/g, '') }); } }), el('span', { text: 'ر.س' })])]),
el('div', { class: 'cr-fld' }, [el('span', { text: 'ضريبة المنتج' }), seg([['1', R0 + '٪'], ['0', 'غير خاضع']], p.vat === false ? '0' : '1', function (q) { set({ vat: q === '1' }, true); }, !ed)]),
el('label', { class: 'cr-fld is-wide' }, [el('span', { text: 'تفاصيل المنتج — تظهر في فاتورة المنتج والعقد' }), el('textarea', { rows: '2', maxlength: '300', disabled: !ed, placeholder: 'مثال: 4 بطاقات فئة 100 ريال', oninput: function (e) { set({ det: e.target.value }); } }, [p.det || ''])])]));
}
var cards = [el('section', { class: 'cr-card' }, parts)];
if (p.on) {
var cur = p.recv || '';
var hint = pp.recv ? 'اختار العميل: ' + rcvName(pp.recv) + (cur && cur !== pp.recv ? ' — وغيّرها الفريق إلى «' + rcvName(cur) + '»' : ' — للفريق تغييرها') : 'لم يحدّد العميل وسيلة الاستلام — يحدّدها الفريق.';
cards.push(el('section', { class: 'cr-card' }, [el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'وسيلة الاستلام' }), el('small', { class: 'cr-hint', text: hint })]),
el('div', { class: 'cr-rcv' + (cur ? '' : ' is-miss'), role: 'radiogroup', 'aria-label': 'وسيلة الاستلام' }, RCV.map(function (o) {
return el('label', { class: 'cr-rcv-i' + (cur === o[0] ? ' is-on' : '') + (ed ? '' : ' is-ro') }, [el('input', { type: 'radio', name: 'cr-rcv', value: o[0], checked: cur === o[0], disabled: !ed, onchange: function () { set({ recv: o[0] }, true); } }), el('b', { text: o[1] }), el('small', { text: o[2] }), pp.recv === o[0] ? el('em', { text: 'اختيار العميل' }) : null]);
})),
cur ? el('label', { class: 'cr-fld cr-rcv-d' }, [el('span', { text: RD_L[cur] || 'ملاحظة الاستلام (اختياري)' }), el('input', { type: 'text', maxlength: '200', value: p.rd || '', disabled: !ed, oninput: function (e) { set({ rd: e.target.value }); } })]) : null,
el('p', { class: 'cr-hint', text: 'تظهر وسيلة الاستلام في «فاتورة المنتج» والعقد، ويُسجَّل تسليم المنتج بعد التنفيذ من «السجل».' })]));
}
return cards;
}

/* ── اختيار المنتج: قائمة منسدلة بالبحث (البطاقات · أجهزة المتجر) أو منتج غير موجود في القائمة — كقائمة «إضافة بند» ── */
function prodBtn(name, curK, dis, pick) {
var b = el('button', { type: 'button', class: 'cr-pbtn' + (name ? '' : ' is-0'), disabled: dis, 'aria-haspopup': 'listbox', 'data-live-ok': '', onclick: function () {
if (!PRD.rows) { loadProds(); toast(false, 'جارٍ تحميل قائمة المنتجات — أعد المحاولة بعد لحظة.'); return; }
var rows = PRD.rows, secs = [];
rows.forEach(function (z) { if (secs.indexOf(z.section) < 0) secs.push(z.section); });
picker(b, { title: 'اختيار المنتج', ph: 'ابحث باسم المنتج…', actT: 'اختيار', hadT: 'المختار',
groups: secs.map(function (s) { return [s, rows.filter(function (z) { return z.section === s; }).map(function (z) { return [z.name, Number(z.price) > 0 ? 'يبدأ من ' + money(z.price) + ' ر.س' : '', z.key === curK, z]; })]; }),
free: 'منتج غير موجود في القائمة', freePh: 'اسم المنتج', freeLine: true, freeOk: 'اعتماد الاسم', freeNote: 'يظهر الاسم كما كتبته في فاتورة المنتج والعقد.',
pick: function (v) { if (v) pick(v); } });
} }, [el('span', { class: 'cr-pbtn-t', text: name || 'اختر المنتج من القائمة' }), icon('down')]);
return b;
}

/* ── 4) الحسبة: الملخص أعلاها · جدول واحد بأعمدة (البند · الضريبة · يظهر للعميل · القيمة) ومجموعات (العقود · المنتج · البنود) · «إضافة بند» من البنود الجاهزة · خطة الدفع ── */
function planTbl(x) {
/* v953: جدول الخطة — «البنود عليها» لاختيار الدفعات التي تحمل البنود، وقيمة كل دفعة يدويًا في التوزيع اليدوي */
var r = rs(x), c = x.calc || {}, pl = c.plan || {}, ed = editable(x), man = pl.mode === 'manual', pick = !man && pl.fdist === 'pick', fp = Array.isArray(pl.fpick) ? pl.fpick.map(Number) : [];
if (!r) return note('warn', errT(x));
var upd = function () { c.plan = pl; x.calc = c; queue({ calc: c }); };
return el('table', { class: 'cr-mg-t' }, [el('thead', {}, [el('tr', {}, (pick ? ['البنود عليها'] : []).concat(['الدفعة', 'تاريخ الاستحقاق', 'قيمة الدفعة']).map(function (h) { return el('th', { text: h }); }))]),
el('tbody', {}, (r.rows || []).map(function (z) { var on = fp.indexOf(Number(z.seq)) >= 0; return el('tr', { 'data-k': z.k, class: pick && on ? 'is-pick' : '' }, (pick ? [el('td', { class: 'cr-mg-pk' }, [el('input', { type: 'checkbox', checked: on, disabled: !ed, 'aria-label': 'البنود على الدفعة ' + z.seq, onchange: function (e) { var s = Number(z.seq); fp = fp.filter(function (q) { return q !== s; }); if (e.target.checked) fp.push(s); fp.sort(function (a, b) { return a - b; }); pl.fpick = fp; e.target.closest('tr').classList.toggle('is-pick', e.target.checked); e.target.blur(); upd(); } })])] : []).concat([el('td', {}, [ltr(String(z.seq))]), el('td', { text: day(z.due) }),
el('td', {}, [man && ed ? el('label', { class: 'cr-money' }, [el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: (pl.amounts && pl.amounts[z.k]) || '', 'aria-label': 'قيمة الدفعة ' + z.seq, oninput: function (e) { pl.amounts = pl.amounts || {}; pl.amounts[z.k] = e.target.value.replace(/[^\d.]/g, ''); upd(); } }), el('span', { text: 'ر.س' })]) : el('span', {}, [ltr(money(z.amt)), el('small', { text: ' ر.س' })])])])); }))]);
}
function grpRow(t, go) { return el('tr', { class: 'is-grp' }, [el('td', { colspan: '4' }, [el('span', { text: t }), go ? el('button', { type: 'button', class: 'cr-mgx-go', 'data-live-ok': '', onclick: function () { goTab(go[0]); } }, [go[1]]) : null])]); }
function valRow(t, v, cls) { return el('tr', { class: cls || '' }, [el('td', { colspan: '3', text: t }), el('td', { class: 'is-v' }, [ltr(money(v))])]); }
function fixRows(x) {
var r = rs(x), out = [grpRow('العقود المُوحَّدة', ['mgc', 'تعديل']) ];
if (!r) return out.concat([el('tr', {}, [el('td', { colspan: '4', class: 'cr-mgx-0 is-bad', text: errT(x) })])]);
(r.contracts || []).forEach(function (k) { out.push(valRow('المتبقي على العقد ' + k.no, k.remain)); });
var pr = r.product || {};
if (pr.on) { out.push(grpRow('المنتج', ['prod', 'تعديل'])); out.push(valRow((pr.type || 'منتج إضافي') + (pr.det ? ' — ' + pr.det : ''), pr.value)); }
return out;
}
function footRows(x) {
var r = rs(x); if (!r) return [];
/* v974: الضريبة لكل بند في سطره — على المنتج الإضافي والرسوم فقط، ولا ضريبة على المتبقي */
var pr = r.product || {}, pv = pr.on ? (Number(pr.vat) || 0) : 0, fv = Number(r.vat) || 0, vt = pv + fv, rt = r.vat_rate || 15, out = [];
if (vt > 0) out.push(valRow('المجموع قبل الضريبة', (Number(r.total) || 0) - vt, 'is-sub'));
if (pr.on) out.push(pv > 0 ? valRow('الضريبة ' + rt + '% على المنتج الإضافي', pv, 'is-tax') : el('tr', { class: 'is-tax' }, [el('td', { colspan: '3', text: 'المنتج الإضافي غير خاضع للضريبة' }), el('td', { class: 'is-v', text: '—' })]));
if (fv > 0) out.push(valRow('الضريبة ' + rt + '% على الرسوم والبنود', fv, 'is-tax'));
else if ((r.lines || []).some(function (l) { return Number(l.amt) > 0; })) out.push(el('tr', { class: 'is-tax' }, [el('td', { colspan: '3', text: 'الرسوم والبنود غير خاضعة للضريبة' }), el('td', { class: 'is-v', text: '—' })]));
if (vt > 0) out.push(el('tr', { class: 'is-tax' }, [el('td', { colspan: '4', class: 'cr-mgx-0', text: 'لا ضريبة على المتبقي على العقود — محتسبة في العقود السابقة.' })]));
return out.concat([el('tr', { class: 'is-tot' }, [el('td', { colspan: '3', text: 'قيمة العقد الموحّد' }), el('td', { class: 'is-v' }, [ltr(money(r.total)), el('small', { text: ' ر.س' })])])]);
}
var UW = { day: 'يومية', week: 'أسبوعية', month: 'شهرية', half: 'نصف سنوية' };
function resLine(x) { var r = rs(x), rp = r && r.plan || {}; if (!r) return []; var eq = rp.fdist !== 'pick' && rp.mode !== 'manual'; return ['النتيجة: ', el('b', { text: pW(rp.count) + ' ' + (UW[rp.unit || 'month'] || '') })].concat(eq ? [' قيمة كل منها ', el('b', {}, [ltr(money(rp.per))]), ' ر.س'] : [' — تختلف قيمها حسب الدفعات التي عليها البنود'], [' · من ', el('b', { text: day(rp.start) }), ' إلى ', el('b', { text: day(rp.last) })]); }
function vatOf(r) { var pr = r.product || {}; return Math.round(((pr.on ? Number(pr.vat) || 0 : 0) + (Number(r.vat) || 0)) * 100) / 100; }
function lnW(n) { return !n ? 'بلا بنود' : n === 1 ? 'بند واحد' : n === 2 ? 'بندان' : n + ' بنود'; }
function tabCalc(x) {
var ed = editable(x), c = x.calc && typeof x.calc === 'object' ? x.calc : (x.calc = {}), r = rs(x), R0 = Number(x.vat_rate) || 15, P = x.proposal || {};
if (!Array.isArray(c.lines)) c.lines = (r && Array.isArray(r.lines) ? r.lines : []).map(function (l) { return { id: l.id, t: l.t, amt: String(l.amt), vat: !!l.vat }; });
if (!Array.isArray(c.hide)) c.hide = (r && Array.isArray(r.hide) ? r.hide : []).slice();
if (!c.plan || typeof c.plan !== 'object') c.plan = {};
var pl = c.plan;
var upd = function (redraw) { x.calc = c; queue({ calc: c }); if (redraw) draw(); };
var feeRows = [grpRow('البنود')].concat(c.lines.length ? c.lines.map(function (l, i) {
var hid = c.hide.indexOf(l.id) >= 0;
return el('tr', { class: 'is-fee' + (hid ? ' is-hid' : '') }, [
el('td', {}, [el('div', { class: 'cr-mgx-n' }, [el('input', { type: 'text', class: 'cr-li-in', value: l.t, maxlength: '80', disabled: !ed, placeholder: 'مسمّى البند', 'aria-label': 'اسم البند', oninput: function (e) { l.t = e.target.value; upd(); } }),
ed ? el('button', { type: 'button', class: 'cr-x cr-li-d', title: 'حذف البند', 'aria-label': 'حذف البند ' + (l.t || ''), 'data-live-ok': '', onclick: function () { c.lines.splice(i, 1); c.hide = c.hide.filter(function (k) { return k !== l.id; }); upd(true); } }, [icon('trash')]) : null])]),
el('td', { class: 'is-c' }, [seg([['1', R0 + '٪'], ['0', 'بلا']], l.vat ? '1' : '0', function (v) { l.vat = v === '1'; upd(true); }, !ed)]),
el('td', { class: 'is-c' }, [seg([['s', 'مستقل'], ['h', 'مدمج']], hid ? 'h' : 's', function (v) { c.hide = c.hide.filter(function (k) { return k !== l.id; }); if (v === 'h') c.hide.push(l.id); upd(true); }, !ed)]),
el('td', { class: 'is-v' }, [el('label', { class: 'cr-money' }, [el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: l.amt === '0' ? '' : l.amt, placeholder: '0.00', disabled: !ed, 'aria-label': 'قيمة ' + (l.t || 'البند'), oninput: function (e) { l.amt = e.target.value.replace(/[^\d.]/g, '') || '0'; upd(); } }), el('span', { text: 'ر.س' })])])]);
}) : [el('tr', {}, [el('td', { colspan: '4', class: 'cr-mgx-0', text: 'لا بنود على هذا الطلب — أضف بندًا من القائمة.' })])]);
var tbl = el('table', { class: 'cr-mgx' }, [el('colgroup', {}, [el('col', {}), el('col', { class: 'is-c' }), el('col', { class: 'is-c' }), el('col', { class: 'is-v' })]),
el('thead', {}, [el('tr', {}, [el('th', { text: 'البند' }), el('th', { text: 'الضريبة' }), el('th', { text: 'يظهر للعميل' }), el('th', { text: 'القيمة ر.س' })])]),
el('tbody', { id: 'cr-mg-fx' }, fixRows(x)), el('tbody', {}, feeRows), el('tfoot', { id: 'cr-mg-ft' }, footRows(x))]);
/* «إضافة بند»: قائمة واحدة — بنود طلبات العقود للتوحيد ثم البنود الجاهزة نفسها في طلبات الأهلية، بلا تكرار وبلا بنود التأجيل */
var add = ed && c.lines.length < 12 ? el('div', { class: 'cr-addrow' }, [(function () {
var b = btn('إضافة بند', { ic: 'plus', on: async function () {
await loadCharges();
var have = c.lines.map(function (l) { return l.id; }), names = c.lines.map(function (l) { return String(l.t || '').trim(); }), seen = [], all = [];
(x.ready || []).concat(ST.charges || []).forEach(function (f) { var n = String(f.name || '').trim(); if (!n || /تأجيل/.test(n) || seen.indexOf(n) >= 0) return; seen.push(n); all.push(f); });
var row = function (f) { return [f.name, [CH_T[f.calc] + (f.calc === 'manual' ? '' : ' ' + (f.calc === 'pct' ? Number(f.value) + '٪' : money(f.value) + ' ر.س')), f.taxable ? 'خاضع للضريبة' : 'غير خاضع'].join(' · '), have.indexOf(f.k) >= 0 || names.indexOf(String(f.name || '').trim()) >= 0, f]; };
picker(b, { title: 'إضافة بند', ph: 'ابحث باسم البند…', groups: [['البنود الجاهزة', all.map(row)]],
free: 'بند جديد لهذا الطلب فقط', freePh: 'مسمّى البند', freeLine: true, freeOk: 'إضافة البند', freeNote: 'يُضاف إلى هذا الطلب وحده، ثم تحدّد قيمته وضريبته من صفّه في الجدول.',
pick: function (v) {
if (v && v.free) { var n = 1; while (c.lines.some(function (l) { return l.id === 'b' + n; })) n++; c.lines.push({ id: 'b' + n, t: v.free.slice(0, 80), amt: '0', vat: true }); }
else if (v) { var a = v.calc === 'fixed' ? Number(v.value) || 0 : v.calc === 'pct' && r ? Math.round((Number(r.remain) || 0) * Number(v.value)) / 100 : 0; c.lines.push({ id: v.k, t: v.name, amt: a ? String(a) : '0', vat: v.taxable !== false }); }
else return;
upd(true); var ins = R.querySelectorAll('.cr-mgx tr.is-fee'), last = ins[ins.length - 1]; if (last) { var i2 = last.querySelector('input.cr-num'); if (i2) i2.focus(); } } });
} }); return b; })(), el('small', { class: 'cr-hint', text: 'البنود الجاهزة نفسها في طلبات الأهلية — تُدار من «الإعدادات ← الرسوم والضرائب والعمولات».' })]) : null;
var cnt = pl.count != null && pl.count !== '' ? String(pl.count) : String((r && r.plan && r.plan.count) || P.months || 12);
var st = pl.start || (r && r.plan && r.plan.start) || '';
/* v953: الدورية بأيقونة والعدد في المربع (بدل القائمة الطويلة)، وتوزيع البنود: على كل الدفعات بالتساوي · على دفعات تختارها · يدويًا */
var unit = pl.unit || (r && r.plan && r.plan.unit) || P.unit || 'month', fd = pl.mode === 'manual' ? 'manual' : pl.fdist === 'pick' ? 'pick' : 'all';
var UNITS = [['day', 'يومي', 'كل يوم', 'sun'], ['week', 'أسبوعي', 'كل أسبوع', 'cal'], ['month', 'شهري', 'كل شهر', 'cal'], ['half', 'نصف سنوي', 'كل 6 أشهر', 'clock']];
var units = el('div', { class: 'cr-mgu', role: 'radiogroup', 'aria-label': 'دورية الدفعات' }, UNITS.map(function (u) { return el('button', { type: 'button', role: 'radio', 'aria-checked': unit === u[0] ? 'true' : 'false', class: 'cr-mgu-i' + (unit === u[0] ? ' is-on' : ''), disabled: !ed, 'data-live-ok': '', onclick: function () { if (unit === u[0]) return; pl.unit = u[0]; upd(true); } }, [el('b', { text: u[1] }), el('small', { text: u[2] })]); }));
var dist = el('div', { class: 'cr-mgd', role: 'radiogroup', 'aria-label': 'توزيع البنود' }, [['all', 'بالتساوي على كل الدفعات', 'قيمة العقد كلها تُقسم على الدفعات بالتساوي.'], ['pick', 'البنود على دفعات تختارها', 'المتبقي والمنتج بالتساوي، والرسوم والبنود على الدفعات التي تحددها في الجدول.'], ['manual', 'يدويًا', 'تكتب قيمة كل دفعة في الجدول، ومجموعها يساوي قيمة العقد.']].map(function (o) {
return el('label', { class: 'cr-opt' + (fd === o[0] ? ' is-on' : '') + (ed ? '' : ' is-ro') }, [el('input', { type: 'radio', name: 'cr-mgd', value: o[0], checked: fd === o[0], disabled: !ed, onchange: function () {
if (o[0] === 'manual') { pl.mode = 'manual'; pl.amounts = {}; (r && r.rows || []).forEach(function (z) { pl.amounts[z.k] = String(z.amt); }); }
else { pl.mode = 'equal'; pl.fdist = o[0]; if (o[0] === 'pick' && !(Array.isArray(pl.fpick) && pl.fpick.length)) pl.fpick = [1]; }
upd(true); } }), el('span', {}, [el('b', { text: o[1] }), el('small', { text: o[2] })])]); }));
var rp = r && r.plan || {};
var planCard = el('section', { class: 'cr-card' }, [el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'خطة الدفع' }), P.months || P.team ? el('small', { class: 'cr-hint', text: 'مقترح العميل: ' + (P.team ? 'يحددها الفريق' : pW(P.months) + ' ' + (UW[P.unit || 'month'] || '')) }) : null]),
el('div', { class: 'cr-fld' }, [el('span', { text: 'الدورية' }), units]),
el('div', { class: 'cr-mg-pl' }, [
el('label', { class: 'cr-fld' }, [el('span', { text: 'عدد الدفعات' }), el('input', { type: 'number', min: '1', max: '120', value: cnt, disabled: !ed, oninput: function (e) { pl.count = e.target.value.replace(/\D/g, ''); if (pl.mode === 'manual') pl.amounts = {}; if (Array.isArray(pl.fpick)) pl.fpick = pl.fpick.filter(function (q) { return q <= (Number(pl.count) || 0); }); upd(); } })]),
el('label', { class: 'cr-fld' }, [el('span', { text: 'تاريخ أول دفعة' }), el('input', { type: 'date', value: st ? String(st).slice(0, 10) : '', disabled: !ed, onchange: function (e) { pl.start = e.target.value; upd(); } })])]),
el('div', { class: 'cr-fld' }, [el('span', { text: 'توزيع البنود على الدفعات' }), dist]),
el('p', { id: 'cr-mg-res', class: 'cr-mgres' }, resLine(x)),
el('div', { id: 'cr-mg-plan', class: 'cr-tw' }, [planTbl(x)])]);
return [el('div', { id: 'cr-sum', class: 'cr-mgsum-w' }, [el('div', { class: 'cr-sidein' }, [summary(x)])]),
el('section', { class: 'cr-card' }, [el('div', { class: 'cr-mgs-h' }, [el('h2', { text: 'مكوّنات قيمة العقد الموحّد' })]), el('div', { class: 'cr-tw' }, [tbl]), add]), planCard,
note('info', 'تغطية الضمانات في تبويب «الضمانات»، ومنه يُطلب الضمان من العميل؛ وأي مستند آخر من «المراسلات».', [el('div', {}, [btn('فتح «الضمانات»', { cls: 'is-sm', ic: 'sign', on: function () { goTab('guar'); } })])])];
}
/* الملخص المالي أعلى الحسبة: قيمة العقد الموحّد وخطتها، ثم مكوّناتها الثلاثة، ثم المواعيد ووسيلة الاستلام */
function summary(x) {
var r = rs(x);
if (!r) return el('section', { class: 'cr-card cr-mgsum' }, [el('h2', { text: 'الملخص المالي' }), note('warn', errT(x))]);
var pr = r.product || {}, pl = r.plan || {}, L = r.lines || [];
var fees = L.reduce(function (a, l) { return a + (Number(l.amt) || 0); }, 0), vt = vatOf(r);
var part = function (k, v, sub, go) { var kids = [el('small', { text: k }), el('b', {}, [ltr(money(v))]), el('span', { text: sub })]; return go ? el('button', { type: 'button', class: 'cr-mgsum-p is-go', 'data-live-ok': '', onclick: function () { goTab(go); } }, kids) : el('div', { class: 'cr-mgsum-p' }, kids); };
return el('section', { class: 'cr-card cr-mgsum' }, [
el('div', { class: 'cr-mgsum-tot' }, [el('small', { text: 'قيمة العقد الموحّد' }), el('b', {}, [ltr(money(r.total)), el('small', { text: ' ر.س' })]), el('span', { text: pW(pl.count) + ' · قيمة الدفعة ' + money(pl.per) + ' ر.س' })]),
el('div', { class: 'cr-mgsum-ps' }, [part('المتبقي على العقود', r.remain, cnW((r.contracts || []).length), 'mgc'), pr.on ? part('المنتج', pr.value, pr.type || 'منتج إضافي', 'prod') : null, part('البنود', fees, lnW(L.filter(function (l) { return Number(l.amt) > 0; }).length)), vt > 0 ? part('ضريبة القيمة المضافة', vt, r.vat_rate + '٪ على المنتج والبنود') : null]),
el('div', { class: 'cr-mgsum-f' }, [el('span', {}, [icon('cal'), 'أول دفعة ', el('b', { text: day(pl.start) }), ' · آخر دفعة ', el('b', { text: day(pl.last) })]), pr.on ? el('span', {}, [icon('box'), 'الاستلام: ', el('b', { text: pr.recv_t || 'لم تُحدَّد' })]) : null])]);
}
function repaint(x) {
if (ST.tab !== 'calc') return;
var w = R.querySelector('#cr-mg-plan'); if (w && !w.contains(document.activeElement)) { w.innerHTML = ''; w.appendChild(planTbl(x)); }
var rl = R.querySelector('#cr-mg-res'); if (rl) { rl.innerHTML = ''; resLine(x).forEach(function (n) { if (n != null) rl.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); }); }
[['#cr-mg-fx', fixRows], ['#cr-mg-ft', footRows]].forEach(function (q) { var b = R.querySelector(q[0]); if (b) { b.innerHTML = ''; q[1](x).forEach(function (tr) { b.appendChild(tr); }); } });
}

/* ── التنفيذ في «السجل»: العقد الموحّد والعقود المغلقة، وتسليم المنتج ووسيلة استلامه ── */
function execCard(x) {
var e = x.executed_ref || {}, pr = e.product && typeof e.product === 'object' ? e.product : null;
var L = [['نُفّذ', at(x.executed_at)], ['العقد الموحّد', ltr(e.new_contract_no || '—')], ['العقود المغلقة بالتوحيد', (e.closed || []).join(' · ') || '—'], ['قيمة العقد الموحّد', ltr(money(e.total))], ['الدفعات المسدَّدة بالتوحيد', String(e.changed || 0)]];
if (pr) {
L.push(['المنتج', el('span', { class: 'cr-mg-dl' }, [el('span', {}, [(pr.type ? pr.type + ' · ' : ''), ltr(money(pr.value)), ' ر.س']), pr.delivered ? el('b', { class: 'cr-py-s is-ok', text: 'سُلّم · ' + at(pr.delivered_at) }) : deliverBtn(x)])]);
if (pr.recv_t) L.push(['وسيلة الاستلام', pr.recv_t + (pr.rd ? ' — ' + pr.rd : '')]);
}
return kvs(L);
}
function deliverBtn(x) {
var armed = ST.mgDel === x.id;
return btn(armed ? 'تأكيد تسليم المنتج' : 'تسجيل تسليم المنتج', { cls: 'is-sm' + (armed ? ' is-pri' : ''), ic: 'check', disabled: ST.busy, on: async function () {
if (!armed) { ST.mgDel = x.id; draw(); return; }
ST.busy = true; draw();
try { await api('POST', '/admin/api/crq/' + x.id + '/product-done', {}); ST.mgDel = null; ST.busy = false; toast(true, 'سُجّل تسليم المنتج للعميل.'); await reload(); }
catch (er) { ST.busy = false; draw(); toast(false, er.message); }
} });
}

/* ── إنشاء طلب من الفريق: العميل ← العقود ← المنتج والاقتراح — المنتج من القائمة نفسها، وتفاصيله ووسيلة استلامه في «طلب المنتج» ── */
function createPanel() {
var C = ST.create, cl = C.clients || [], cur = cl.filter(function (c) { return c.id === C.uid; })[0];
C.sel = C.sel || []; C.miss = C.miss || [];
var opts = C.opts || [], selO = opts.filter(function (o) { return C.sel.indexOf(o.no) >= 0; });
var remOf = function (o) { return (o.payments || []).reduce(function (a, p) { return a + (Number(p.part ? p.left : p.amount) || 0); }, 0); };
var step = !cur ? 1 : !selO.length ? 2 : 3;
var stp = el('ol', { class: 'cr-nw-st' }, [['العميل', 1], ['العقود', 2], ['المنتج والاقتراح', 3]].map(function (t) { return el('li', { class: step > t[1] ? 'is-done' : step === t[1] ? 'is-cur' : '' }, [el('i', {}, [step > t[1] ? icon('check') : ltr(String(t[1]))]), t[0]]); }));
var sec = function (n, title, kids, done) { return el('div', { class: 'cr-nw-s' + (done ? ' is-done' : '') }, [el('div', { class: 'cr-nw-sh' }, [el('span', { class: 'cr-nw-n' }, [done ? icon('check') : ltr(String(n))]), el('b', { text: title })])].concat(kids)); };
var parts = [];
if (cur) parts.push(sec(1, 'العميل', [el('div', { class: 'cr-nw-pk' }, [el('span', { class: 'cr-av', text: initial(cur.name) }), el('div', {}, [el('b', { text: cur.name }), el('small', {}, [cur.phone ? ltr(cur.phone) : '', cur.no ? el('span', {}, [' · ', ltr(cur.no)]) : null])]),
el('button', { type: 'button', class: 'cr-nw-ch', 'data-live-ok': '', onclick: function () { C.uid = null; C.opts = null; C.sel = []; draw(); } }, ['تغيير'])])], true));
else {
var q = String(C.q || '').trim(), hits = cl.filter(function (c) { return !q || (c.name + ' ' + (c.phone || '') + ' ' + (c.no || '')).indexOf(q) >= 0; });
parts.push(sec(1, 'اختر العميل', [el('label', { class: 'cr-lq cr-nw-q' }, [icon('search'), el('input', { type: 'search', value: C.q || '', placeholder: 'ابحث بالاسم أو الجوال أو رقم العميل…', 'aria-label': 'بحث عن عميل', oninput: function (e) { C.q = e.target.value; var p = e.target.selectionStart; draw(); var i = R.querySelector('.cr-nw-q input'); if (i) { i.focus(); try { i.setSelectionRange(p, p); } catch (er) { void er; } } } })]),
!C.clients ? el('div', { class: 'cr-load', text: 'جارٍ تحميل العملاء…' }) : el('div', { class: 'cr-nw-l', role: 'listbox', 'aria-label': 'العملاء' }, hits.length ? hits.slice(0, 40).map(function (c) {
return el('button', { type: 'button', role: 'option', class: 'cr-nw-c', 'data-live-ok': '', onclick: function () { C.q = ''; C.sel = []; loadOpts(c.id); } }, [el('span', { class: 'cr-av', text: initial(c.name) }), el('span', { class: 'cr-nw-ct' }, [el('b', { text: c.name }), el('small', {}, [c.phone ? ltr(c.phone) : '—', c.no ? el('span', {}, [' · ', ltr(c.no)]) : null])]), icon('lt')]); }) : [el('p', { class: 'cr-pop-0', text: 'لا عميل بهذا البحث.' })])]));
}
if (cur) {
if (!C.opts) parts.push(sec(2, 'العقود', [el('div', { class: 'cr-load', text: 'جارٍ تحميل العقود…' })]));
else if (!opts.length) parts.push(sec(2, 'العقود', [note('warn', 'لا عقود قائمة بدفعات متبقية لهذا العميل.')]));
else parts.push(sec(2, 'العقود المطلوب توحيدها', [el('div', { class: 'cr-pys' + (C.miss.indexOf('sel') >= 0 ? ' is-miss' : '') }, opts.map(function (o) {
var on = C.sel.indexOf(o.no) >= 0;
return el('label', { class: 'cr-py cr-mg-c' + (on ? ' is-on' : '') + (o.busy ? ' is-ro' : '') }, [el('input', { type: 'checkbox', checked: on, disabled: !!o.busy, onchange: function (e) { C.sel = C.sel.filter(function (n) { return n !== o.no; }); if (e.target.checked) C.sel.push(o.no); C.miss = []; draw(); } }),
el('span', { class: 'cr-py-ck', 'aria-hidden': 'true' }, [icon('check')]), el('span', { class: 'cr-py-n' }, [icon('file')]),
el('span', { class: 'cr-py-d' }, [el('b', {}, [ltr(o.no)]), el('small', { text: (o.product || 'عقد') + ' · ' + pW((o.payments || []).length) + ' متبقية' })]),
el('span', { class: 'cr-py-a' }, [ltr(money(remOf(o))), el('small', { text: ' ر.س' })]), o.busy ? el('span', { class: 'cr-py-s is-warn', text: 'في طلب قائم ' + o.busy }) : null]); }))], selO.length > 0));
}
if (selO.length) {
if (C.prod === 'yes' && !PRD.rows) loadProds();
var chips = function (L, curV, set) { return el('div', { class: 'cr-seg2' }, L.map(function (o) { return el('button', { type: 'button', class: curV === o[0] ? 'is-on' : '', 'data-live-ok': '', onclick: function () { set(o[0]); C.miss = []; draw(); } }, [o[1]]); })); };
var psel = C.prod === 'yes' ? prodBtn(C.pk === '__other' ? C.pt : (C.pz ? C.pz.name : ''), C.pk, false, function (v) { if (v.free) { C.pk = '__other'; C.pz = null; C.pt = v.free.slice(0, 80); } else { C.pk = v.key; C.pz = v; if (!(Number(C.pv) > 0) && Number(v.price) > 0) C.pv = String(v.price); } C.miss = []; draw(); }) : null;
parts.push(sec(3, 'المنتج واقتراح العميل', [el('div', { class: 'cr-mg-pf' }, [
el('div', { class: 'cr-fld' + (C.miss.indexOf('prod') >= 0 ? ' is-miss' : '') }, [el('span', { text: 'منتج إضافي' }), chips([['no', 'توحيد فقط'], ['yes', 'مع منتج إضافي']], C.prod, function (v) { C.prod = v; })]),
C.prod === 'yes' ? el('div', { class: 'cr-fld' + (C.miss.indexOf('pk') >= 0 ? ' is-miss' : '') }, [el('span', { text: 'المنتج' }), psel]) : null,
C.prod === 'yes' && C.pk === '__other' ? el('label', { class: 'cr-fld' }, [el('span', { text: 'اسم المنتج' }), el('input', { type: 'text', maxlength: '80', value: C.pt || '', oninput: function (e) { C.pt = e.target.value; } })]) : null,
C.prod === 'yes' ? el('label', { class: 'cr-fld' + (C.miss.indexOf('pv') >= 0 ? ' is-miss' : '') }, [el('span', { text: 'قيمة المنتج (قبل الضريبة)' }), el('span', { class: 'cr-money' }, [el('input', { type: 'text', inputmode: 'decimal', class: 'cr-num', value: C.pv || '', oninput: function (e) { C.pv = e.target.value.replace(/[^\d.]/g, ''); } }), el('span', { text: 'ر.س' })])]) : null,
el('div', { class: 'cr-fld' + (C.miss.indexOf('months') >= 0 ? ' is-miss' : '') }, [el('span', { text: 'مدة خطة الدفع المقترحة' }), chips([['6', '6 أشهر'], ['12', '12 شهرًا'], ['18', '18 شهرًا'], ['24', '24 شهرًا'], ['team', 'يحددها الفريق']], C.months, function (v) { C.months = v; })]),
el('label', { class: 'cr-fld is-wide' }, [el('span', { text: 'ملاحظة' }), el('textarea', { rows: '2', maxlength: '300', oninput: function (e) { C.note = e.target.value; } }, [C.note || ''])])]),
C.prod === 'yes' ? el('p', { class: 'cr-hint', text: 'تفاصيل المنتج ووسيلة الاستلام تُحدَّد بعد الإنشاء في تبويب «طلب المنتج».' }) : null], false));
}
var tot = selO.reduce(function (a, o) { return a + remOf(o); }, 0);
return el('section', { class: 'cr-card cr-nw' }, [
el('div', { class: 'cr-nw-h' }, [el('span', { class: 'cr-nw-ic' }, [icon('plus')]), el('div', {}, [el('h2', { text: 'طلب توحيد جديد' }), el('small', { text: 'يُنشأ باسم الفريق ثم يُكمَل من صفحة الطلب.' })]),
el('button', { type: 'button', class: 'cr-pop-x', 'aria-label': 'إغلاق', 'data-live-ok': '', onclick: function () { ST.create = null; draw(); } }, [icon('x')])]),
stp].concat(parts, [C.err ? note('bad', C.err) : null,
el('div', { class: 'cr-nw-f' }, [selO.length ? el('span', { class: 'cr-nw-sum' }, [el('small', { text: cnW(selO.length) + ' · المتبقي' }), el('b', {}, [ltr(money(tot)), ' ر.س'])]) : el('small', { class: 'cr-hint', text: step === 1 ? 'ابدأ باختيار العميل.' : 'اختر عقدين أو أكثر، أو عقدًا مع منتج إضافي.' }),
el('div', { class: 'cr-acts' }, [btn('إلغاء', { on: function () { ST.create = null; draw(); } }), btn(ST.busy ? 'جارٍ الإنشاء…' : 'إنشاء الطلب', { ic: 'check', cls: 'is-pri', disabled: !selO.length || ST.busy, on: async function () {
var m = []; if (!C.prod) m.push('prod'); if (C.prod === 'yes' && !C.pk) m.push('pk'); if (C.prod === 'yes' && !(Number(C.pv) > 0)) m.push('pv'); if (C.prod !== 'yes' && selO.length < 2) m.push('sel'); if (!C.months) m.push('months');
if (m.length) { C.miss = m; C.err = m.indexOf('sel') >= 0 ? 'اختر عقدين أو أكثر، أو عقدًا واحدًا مع منتج إضافي.' : ''; draw(); return; }
ST.busy = true; draw();
var z = C.pz, pd = C.prod === 'yes' ? { on: true, value: C.pv, type: C.pk === '__other' ? (C.pt || '') : (z ? z.name : ''), sec: z ? z.section : '', pk: C.pk } : null;
try { var j = await api('POST', '/admin/api/crq', { kind: 'merge', user_id: C.uid, contract_nos: C.sel, note: C.note || '', prop: { months: C.months === 'team' ? null : C.months, team: C.months === 'team', product: pd } });
ST.create = null; ST.busy = false; await loadList(); open(j.id); toast(true, 'أُنشئ الطلب ' + (j.no || '') + ' وأُضيف إلى القائمة.'); }
catch (e) { ST.busy = false; C.err = e.message; draw(); }
} })])])]));
}
/* v948: القالب العام لعقد التوحيد — يُعتمد من مستند الطلب نفسه (تأكيد بضغطتين)، ويظهر في كل طلبات التوحيد الجديدة ولا يغيّر ما أُرسل */
function tplBtn(T) {
var armed = ST.mgTpl === true;
return btn(armed ? 'تأكيد: اعتماده قالبًا عامًا' : 'اعتماده قالبًا عامًا لعقد التوحيد', { cls: 'is-sm' + (armed ? ' is-pri' : ''), ic: 'file', disabled: ST.busy, title: 'يصير هذا المستند القالب العام لكل طلبات التوحيد الجديدة — لا يغيّر الطلبات المرسلة', on: async function () {
if (!armed) { ST.mgTpl = true; draw(); return; }
ST.busy = true; draw();
try { var v = clone(T); delete v._org; await api('POST', '/admin/api/crq-tpl', { key: 'mg', value: v }); ST.mgTpl = false; ST.busy = false; if (ST.x) { ST.x.tpl = ST.x.tpl || {}; ST.x.tpl.df = clone(v); } toast(true, 'اعتُمد قالبًا عامًا لعقد التوحيد — يظهر في كل طلبات التوحيد الجديدة.'); draw(); }
catch (e) { ST.busy = false; ST.mgTpl = false; draw(); toast(false, e.message); }
} });
}
function tab(x, k) { return k === 'req' ? tabReq(x) : k === 'mgc' ? tabCts(x) : k === 'prod' ? tabProd(x) : tabCalc(x); }
return { TABS: TABS, TABK: TABK, tab: tab, state: tabState, tabReq: tabReq, tabCalc: tabCalc, summary: summary, repaint: repaint, execCard: execCard, createPanel: createPanel, tplBtn: tplBtn };
})();

/* ═════════ الرسم ═════════ */
function draw() {
R.innerHTML = '';
var kids = ST.id ? detailView() : listView();
if (ST.flash) kids.unshift(el('div', { class: 'cr-toast is-' + (ST.flash[0] ? 'ok' : 'bad'), role: 'status', text: ST.flash[1] }));
kids.forEach(function (k) { if (k) R.appendChild(k); });
}
function run() { loadLp(); if (!ST.rows && !ST.loading) { ST.loading = true; loadList(); } if (!restore()) draw(); return R; }
window.addEventListener('beforeunload', function (e) { if (ST.save.pending) { e.preventDefault(); e.returnValue = ''; } });
/* v970: عدّاد «أكمل العميل المطلوب» على عنصر القائمة الجانبية */
function navBack(n) { try { var b = document.querySelector('[data-next-nav="' + KEY + '"]'); if (!b) return; var t = b.querySelector('.cr-nav-back'); if (!n) { if (t && t.parentNode) t.parentNode.removeChild(t); return; } if (!t) { t = document.createElement('span'); t.className = 'cr-nav-back'; t.style.cssText = 'margin-inline-start:auto;min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:#1E7A4C;color:#fff;font-size:11.5px;font-weight:800;display:inline-grid;place-items:center;line-height:1;flex-shrink:0'; b.appendChild(t); } t.textContent = n > 9 ? '9+' : String(n); t.title = 'أكمل العميل المطلوب — ' + n + ' بانتظار مراجعتك'; t.setAttribute('aria-label', t.title); } catch (e) { void e; } }
async function pollBack() { if (document.hidden) return; try { var j = await api('GET', '/admin/api/crq?kind=' + KIND); navBack((j.rows || []).filter(function (r) { return r.back; }).length); } catch (e) { void e; } }
function reg() { if (window.__teraApp && typeof window.__teraApp.page === 'function') { window.__teraApp.page(KEY, TITLE, PICON, run, UP); return true; } return false; }
if (!reg()) { (window.__crqQ = window.__crqQ || []).push(reg); }
setTimeout(pollBack, 4000); setInterval(pollBack, 180000);
}
BOOT('cu-crq-defer', 'defer', 'طلبات تأجيل دفعة', ['clock', 'violet']);
BOOT('cu-crq-merge', 'merge', 'طلبات توحيد العقود', ['stack', 'teal']); /* v946 */
})();
