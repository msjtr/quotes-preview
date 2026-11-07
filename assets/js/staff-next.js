/* v702–v708 — المنصة الجديدة للموظفين (staff/next/)
   v707: قسم المالية بخمس صفحات وتبويبات داخل الصفحة، وبلا أدراج: لوحة التفاصيل صفحة في مساحة المحتوى (الموضع من geo()).
   قائمة تنقّل واحدة فوق محرك المنصة نفسه (platform.js): الخادم والقاعدة والصلاحيات والحسابات كما هي.
   لا يعمل هذا الملف إلا على المسار /staff/next/، ولا يغيّر شيئًا في /staff/ ولا في بوابة العميل.
   الظهور يتبع القائمة الأصلية التي رسمتها المنصة بعد فحص الصلاحيات: البند يظهر إن ظهر مفتاحه فيها،
   أو ظهرت فيها كل الأقسام التي يتبعها. وما في القائمة الأصلية ولا تغطيه الشجرة يظهر في «أقسام أخرى». */
(function () {
  'use strict';
  if (!/^\/staff\/next(\/|$)/.test(location.pathname)) return;
  document.documentElement.classList.add('tq-next');

  /* الشجرة: [عنوان المجموعة, [[مفتاح الصفحة, الاسم, [الأقسام التي يلزم ظهورها كلها في القائمة الأصلية]]]] */
  var TREE = [
    ['', [['adm-home', 'الرئيسية', ['adm-home']]]],
    ['العملاء', [
      ['cu-list', 'ملفات العملاء', ['cu']],
      ['cu-new', 'العملاء الجدد', ['cu']],
      ['cu-pf-ver', 'طلبات توثيق الملف', ['cu']],
      ['cu-pf-launch', 'تدشين الحساب', ['cu']],
      ['cu', 'كل صفحات العملاء', ['cu']]
    ]],
    ['الطلبات والعقود', [
      ['cu-svc', 'طلبات الخدمات', ['cu']],
      ['cu-docs-pq', 'عروض الشركاء', ['cu']],
      ['cu-docs-pc', 'عقود الشركاء', ['cu']],
      ['cu-docs-sq', 'عروض المتاجر', ['cu']],
    ['cu-docs-tl', 'الخطابات الرسمية', ['cu']]
    ]],
    ['المالية', [
    /* v707: خمس صفحات لكل منها عمل واحد — وما تفرّع عنها تبويبات أعلى الصفحة نفسها (VIEWS) لا بنود في القائمة ولا صفحات فهرس */
    ['fin-due', 'التحصيل', ['fin']],
    ['fin-pay', 'المدفوعات', ['fin']],
    ['cu-paylinks', 'روابط الدفع', ['fin', 'cu']],
    ['fin-req', 'الطلبات المالية', ['fin', 'cu']],
    ['cu-admx-rp', 'التقارير', ['fin']]
  ]],
    ['التواصل', [
      ['comm-send', 'مركز الإرسال', ['comm-hub']],
      ['cs-tickets', 'التذاكر والمراسلات', ['comm-hub']],
      ['cx', 'تجربة العملاء', ['comm-hub']],
      ['comm-hub', 'كل صفحات التواصل', ['comm-hub']]
    ]],
    ['الفريق والشركاء', [['team-hub', 'الفريق والشركاء', ['team-hub']]]],
    ['الإعدادات', [['sys', 'إعدادات النظام', ['sys']], ['fin-fee', 'الرسوم والضرائب', ['fin']], ['pay-center', 'إعدادات الدفع', ['fin']]]]
  ];

  /* اسم بديل للقسم نفسه في القائمة الأصلية (المفتاح القديم للقسم ذاته فقط) */
  var ALIAS = { 'comm-hub': ['comm-hub', 'comm'] };

  /* الصفحة الفرعية ← أقرب بند في الشجرة (من سجل صفحات المنصة) — لتمييز البند الحالي فقط */
  var UP = {
    'cu-file': 'cu-list', 'cu-pf-files': 'cu-list', 'cu-pf-file': 'cu-list', 'cu-pf': 'cu',
    'cu-pf-req': 'cu', 'cu-pf-mig': 'cu', 'cu-pf-acct': 'cu', 'cu-inbox': 'cu', 'cu-mem': 'cu',
    'cu-comms': 'cu', 'cu-acc': 'cu', 'cu-secc': 'cu', 'cu-sx-sess': 'cu', 'cu-sx-reccode': 'cu',
    'cu-sx-totp': 'cu', 'cu-sx-mail': 'cu', 'cu-wa-pins': 'cu', 'cu-2fa': 'cu',
    'cu-mon-activity': 'cu', 'cu-mon-alerts': 'cu', 'cu-mon-sens': 'cu', 'cu-mon-sec': 'cu',
    'cu-mon-dev': 'cu', 'cu-mon-live': 'cu', 'cu-audit': 'cu', 'cpg': 'cu', 'cpg-access': 'cu',
    'cpg-log': 'cu', 'cs': 'cu', 'cs-customers': 'cu-list', 'cs-customer': 'cu-list',
    'cs-updates': 'cu', 'cs-devices': 'cu', 'cs-requests': 'cu-svc', 'cs-complaints': 'cs-tickets',
    'cu-docs': 'cu-docs-pq', 'cu-docs-cq': 'cu-docs-sq', 'cu-docs-si': 'cu-docs-sq', 'ctr': 'cu',
    'cu-payops': 'fin-pay', 'fin-gw': 'fin-pay', 'fin-rec': 'fin-pay', 'fin-fee': 'fin',
    'fin-fee-i': 'fin', 'cu-admx': 'fin', 'cu-admx-bd': 'fin', 'cu-admx-dd': 'fin',
    'cu-admx-tr': 'fin', 'cu-admx-ck': 'fin', 'cu-admx-rp': 'fin', 'cu-admx-rpc': 'fin',
    'cu-admx-fee': 'fin', 'pay-center': 'fin',
    'comm': 'comm-hub', 'comm-dir': 'comm-hub', 'comm-rep': 'comm-send', 'sys-push': 'comm-send',
    'cs-ticket': 'cs-tickets', 'cx-dash': 'cx', 'cx-review': 'cx', 'cx-send': 'cx', 'cx-log': 'cx',
    'soon-emp': 'team-hub', 'soon-par': 'team-hub', 'soon-mkt': 'team-hub', 'adm-more': 'adm-home'
  };
  /* v707: الصفحات الفرعية الجديدة ← بندها في القائمة */
  Object.assign(UP, {
  'fin': 'fin-due', 'fin-rec': 'fin-pay', 'cu-admx': 'fin-due', 'cu-admx-bd': 'fin-due', 'cu-admx-dd': 'fin-due', 'cu-admx-ck': 'fin-due',
  'cu-admx-tr': 'fin-pay', 'cu-admx-rpc': 'cu-admx-rp', 'cu-admx-fee': 'cu-admx-rp', 'cu-trin': 'fin-pay', 'cu-opin': 'fin-req', 'fin-fee-i': 'fin-fee', 'fin-plnew': 'cu-paylinks' /* v712 */
});
function upOf(k) { return /^fin-rec-/.test(k) ? 'fin-pay' : (UP[k] || ''); }

/* v707: صفحات البند الواحد تبويبات أعلى الصفحة — [مفتاح, اسم, بادئة صفحات التبويب إن كان له صفحات فرعية] */
var VIEWS = [
  ['fin-due', [['fin-due', 'الدفعات المستحقة'], ['cu-admx-dd', 'الاستقطاع البنكي'], ['cu-admx-ck', 'الشيكات'], ['cu-admx-bd', 'السندات التنفيذية']]],
  ['fin-pay', [['fin-pay', 'سجل المدفوعات'], ['fin-gw', 'عمليات بوابة الدفع'], ['cu-trin', 'التحويلات البنكية'], ['fin-rec-gw', 'سجل السداد', 'fin-rec-'], ['cu-admx-tr', 'الحوالات الصادرة']]],
  ['fin-req', [['fin-req', 'سداد قيمة المنتج والتأجيل والتوحيد'], ['cu-opin', 'الإلغاء والاسترداد']]],
  ['cu-admx-rp', [['cu-admx-rp', 'تقرير العملاء'], ['cu-admx-fee', 'الرسوم والإيراد']]]
];
/* سجل السداد حسب الطريقة — اختيارات داخل التبويب نفسه */
var RECV = [['gw', 'عبر بوابة الدفع'], ['tr', 'تحويل بنكي'], ['cash', 'نقدًا'], ['settle', 'سداد قيمة المنتج'], ['merge', 'توحيد'], ['defer', 'تأجيل'], ['waive', 'إعفاء فرق'], ['round', 'فرق تقريب'], ['oth', 'بلا طريقة مسجّلة']];
  

  /* v703: بلاطة ثلاثية الأبعاد لكل بند — رمز من مكتبة رموز المنصة (window.__PGL) بوصفة البلاطة نفسها */
  var GLY = {
    'cu-list': 'identification-card', 'cu-new': 'user', 'cu-pf-ver': 'seal-check', 'cu-pf-launch': 'rocket-launch',
    'cu-svc': 'clipboard-text', 'cu-docs-pq': 'file-text', 'cu-docs-pc': 'handshake', 'cu-docs-sq': 'storefront', 'cu-docs-tl': 'envelope-simple',
    'fin-due': 'calendar-check', 'cu-trin': 'bank', 'cu-opin': 'arrow-counter-clockwise', 'cu-paylinks': 'link-simple',
    'fin-pay': 'receipt', 'comm-send': 'paper-plane-tilt', 'cs-tickets': 'ticket', 'cx': 'star'
  };
  Object.assign(GLY, { 'fin-due': 'calendar-check', 'fin-pay': 'receipt', 'cu-paylinks': 'link-simple', 'fin-req': 'arrows-left-right', 'cu-admx-rp': 'chart-bar', 'fin-fee': 'coins', 'pay-center': 'credit-card', 'sys': 'gear-six' });
  function tile3d(glyph) {
    var GL = window.__PGL || {}, d = GL[glyph];
    if (!d || !/^[\w\s,.\-]+$/.test(d)) return '';
    return '<svg class="t2-tile" viewBox="0 0 100 112" aria-hidden="true"><ellipse cx="50" cy="101" rx="38" ry="8" fill="url(#gshadow)"/>' +
      '<rect x="10" y="17" width="80" height="80" rx="25" fill="#06707A"/><rect x="10" y="7" width="80" height="80" rx="25" fill="url(#top-teal)"/>' +
      '<g clip-path="url(#tileclip)"><ellipse cx="34" cy="14" rx="58" ry="30" fill="#fff" opacity=".2"/></g>' +
      '<rect x="11.5" y="8.5" width="77" height="77" rx="23.5" fill="none" stroke="url(#rim)" stroke-width="2"/>' +
      '<g transform="translate(29.5,28) scale(0.171875)" fill="#06707A" opacity=".55"><path d="' + d + '"/></g>' +
      '<g transform="translate(28,25) scale(0.171875)" fill="#fff"><path d="' + d + '"/></g></svg>';
  }
  /* v724: بلاطة ثلاثية الأبعاد بلون القسم كما في التصور المعتمد (العملاء أزرق · الطلبات بنفسجي · المالية زعفراني · التواصل أحمر · الإعدادات رمادي)
     الوصفة نفسها (ظل · قاعدة داكنة · وجه متدرّج · لمعة · حافة · رمز بظلّه) بتدرّجات معرّفة مرة واحدة في الصفحة */
  var TQC = {
    blue: ['#2457C5', '#6EA0FF', '#3B74E8'], violet: ['#5B3FD1', '#A18BFF', '#7559F0'], teal: ['#06707A', '#3FD0D3', '#0FA3A8'],
    saffron: ['#B86F0A', '#FFC861', '#F0A12B'], red: ['#B93A2A', '#FF8A75', '#EB5A45'], slate: ['#4E5A6B', '#AAB4C3', '#7C8899'], green: ['#13804F', '#5EE0A0', '#22A86B']
  };
  var COLK = {
    'adm-home': 'teal', 'cu-list': 'blue', 'cu-new': 'blue', 'cu-pf-ver': 'blue', 'cu-pf-launch': 'blue',
    'cu-svc': 'violet', 'cu-docs-pq': 'violet', 'cu-docs-pc': 'teal', 'cu-docs-sq': 'violet',
    'fin-due': 'saffron', 'fin-pay': 'saffron', 'cu-paylinks': 'saffron', 'fin-req': 'saffron', 'cu-admx-rp': 'blue',
    'comm-send': 'red', 'cs-tickets': 'red', 'cx': 'red', 'team-hub': 'teal', 'sys': 'slate', 'fin-fee': 'slate', 'pay-center': 'slate'
  };
  GLY['adm-home'] = GLY['adm-home'] || 'house'; GLY['team-hub'] = GLY['team-hub'] || 'users';
  function tqDefs() {
    if (document.getElementById('tq-tile-defs')) return;
    var h = '<svg id="tq-tile-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>';
    Object.keys(TQC).forEach(function (c) { h += '<linearGradient id="tqg-' + c + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + TQC[c][1] + '"/><stop offset="1" stop-color="' + TQC[c][2] + '"/></linearGradient>'; });
    h += '</defs></svg>';
    document.body.insertAdjacentHTML('afterbegin', h);
  }
  function tile3c(glyph, col) {
    var GL = window.__PGL || {}, d = GL[glyph], C = TQC[col] ? col : 'teal';
    if (!d || !/^[\w\s,.\-]+$/.test(d)) return '';
    try { tqDefs(); } catch (err) { void err; }
    return '<svg class="t2-tile tqn-tile" viewBox="0 0 100 112" aria-hidden="true"><ellipse cx="50" cy="101" rx="38" ry="8" fill="rgba(11,37,82,.18)"/>' +
      '<rect x="10" y="17" width="80" height="80" rx="25" fill="' + TQC[C][0] + '"/><rect x="10" y="7" width="80" height="80" rx="25" fill="url(#tqg-' + C + ')"/>' +
      '<ellipse cx="34" cy="16" rx="40" ry="18" fill="#fff" opacity=".18"/>' +
      '<rect x="11.5" y="8.5" width="77" height="77" rx="23.5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>' +
      '<g transform="translate(29.5,28) scale(0.171875)" fill="' + TQC[C][0] + '" opacity=".55"><path d="' + d + '"/></g>' +
      '<g transform="translate(28,25) scale(0.171875)" fill="#fff"><path d="' + d + '"/></g></svg>';
  }
  window.__tqTile = tile3c;
  function iconOf(A, k) { return tile3c(GLY[k] || '', COLK[k]) || (A && A.icon[k]) || tile3d(GLY[k] || '') || tile3d('info'); } /* v724: بلاطة بلون القسم */

  var ITEMS = {}, COVER = { 'adm-more': true };
  TREE.forEach(function (g) {
    g[1].forEach(function (i) {
      ITEMS[i[0]] = i; COVER[i[0]] = true;
      i[2].forEach(function (r) { (ALIAS[r] || [r]).forEach(function (k) { COVER[k] = true; }); });
    });
  });

  /* v707: صفحات التبويبات وصفحات الفهرس مغطاة فلا تظهر في «أقسام أخرى» */
  VIEWS.forEach(function (g) { g[1].forEach(function (t) { COVER[t[0]] = true; }); });
['fin', 'fin-rec', 'cu-admx', 'cu-admx-rpc', 'fin-fee-i'].forEach(function (k) { COVER[k] = true; });
RECV.forEach(function (r) { COVER['fin-rec-' + r[0]] = true; });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var OLD = null;  /* القائمة الأصلية الحالية (مخفية) — مصدر الصلاحيات ومعالجات الأقسام */
  var LAST = null; /* آخر ما قُرئ منها: المفاتيح والأيقونات والأسماء */

  function readOld(oldNav) {
    var set = {}, icon = {}, name = {}, order = [];
    oldNav.querySelectorAll('.t2-side-i[data-nav]').forEach(function (b) {
      var k = b.dataset.nav;
      if (!set[k]) order.push(k);
      set[k] = true;
      var ic = b.querySelector('.t2-side-ic'), l = b.querySelector('.t2-side-l');
      if (ic) icon[k] = ic.innerHTML;
      name[k] = ((l || b).textContent || '').trim();
    });
    return { set: set, icon: icon, name: name, order: order };
  }
  function has(A, r) { return (ALIAS[r] || [r]).some(function (k) { return A.set[k]; }); }
  function visible(A, i) { return !!A.set[i[0]] || i[2].every(function (r) { return has(A, r); }); }

  function groups(A) {
    var out = TREE.map(function (g) {
      return [g[0], g[1].filter(function (i) { return visible(A, i); })];
    }).filter(function (g) { return g[1].length; });
    /* لا يضيع قسم: ما في القائمة الأصلية ولا تغطيه الشجرة */
    var rest = A.order.filter(function (k) { return !COVER[k]; }).map(function (k) { return [k, A.name[k] || k, [k]]; });
    if (rest.length) out.push(['أقسام أخرى', rest]);
    return out;
  }

  /* القسم الموجود في القائمة الأصلية يُفتح بزرّه نفسه (معالج المنصة نفسه)، وغيره بواجهة المنصة المعلنة */
  function go(k) {
    var b = OLD && OLD.isConnected && OLD.querySelector('.t2-side-i[data-nav="' + k + '"]');
    if (b) { b.click(); return; }
    if (window.__teraApp && typeof window.__teraApp.go === 'function') window.__teraApp.go('other', k);
  }

  var FLAG = '<div class="tqn-flag" role="note"><b>المنصة الجديدة — قيد البناء</b>' +
    '<span>البيانات والإجراءات حقيقية ومشتركة مع المنصة الحالية.</span>' +
    '<a href="/staff/">الانتقال إلى المنصة الحالية</a></div>';

  function build(oldNav) {
    var A = readOld(oldNav);
    if (!A.order.length) return;
    OLD = oldNav; LAST = A;
    var nav = oldNav.nextElementSibling;
    if (!nav || !nav.classList.contains('tqn-nav')) {
      nav = document.createElement('nav');
      nav.className = 't2-side-n tqn-nav';
      nav.setAttribute('aria-label', 'أقسام المنصة الجديدة');
      nav.addEventListener('click', function (ev) {
        var gh = ev.target.closest('.tqn-gh');
        if (gh) {
          var c = gh.parentNode.classList.toggle('is-closed');
          gh.setAttribute('aria-expanded', c ? 'false' : 'true');
          return;
        }
        var b = ev.target.closest('[data-next-nav]');
        if (b) go(b.getAttribute('data-next-nav'));
      });
      oldNav.parentNode.insertBefore(nav, oldNav.nextSibling);
      /* المنصة تمسح تمييز البنود في كل رسم — يُعاد التمييز بعده */
      new MutationObserver(mark).observe(nav, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
    }
    var sig = A.order.join(',') + (window.__PGL ? '|g' : '');
    if (nav.getAttribute('data-sig') !== sig) {
      var html = FLAG;
      groups(A).forEach(function (g) {
        html += '<div class="t2-side-g tqn-g">' +
          (g[0] ? '<button class="t2-side-gh tqn-gh" type="button" aria-expanded="true"><span>' + esc(g[0]) + '</span><span class="t2-chev" aria-hidden="true"></span></button>' : '') +
          '<div class="t2-side-gb">' + g[1].map(function (i) {
            var ic = iconOf(A, i[0]);
            return '<button class="t2-side-i tqn-i' + (ic ? '' : ' tqn-sub') + '" type="button" data-next-nav="' + esc(i[0]) + '">' +
              '<span class="t2-side-ic tqn-ic">' + (ic || '<i class="tqn-dot" aria-hidden="true"></i>') + '</span>' +
              '<span class="t2-side-l">' + esc(i[1]) + '</span></button>';
          }).join('') + '</div></div>';
      });
      nav.setAttribute('data-sig', sig);
      nav.innerHTML = html;
    }
    /* القائمة الأصلية تُخفى بعد نجاح بناء الجديدة فقط */
    oldNav.setAttribute('data-tqn-hide', '1');
    mark();
  }

  /* مفاتيح صفحات المنصة المسجّلة (لا تُعرض تبويبات لصفحة غير مسجّلة) */
function acct() {
  try {
    var L = window.__teraApp && typeof window.__teraApp.keys === 'function' && window.__teraApp.keys().acct;
    if (!L || !L.length) return null;
    var o = {};
    L.forEach(function (k) { o[k] = true; });
    return o;
  } catch (err) { return null; }
}
function viewsOf(k) {
  for (var i = 0; i < VIEWS.length; i++) {
    var L = VIEWS[i][1];
    for (var j = 0; j < L.length; j++) if (L[j][0] === k || (L[j][2] && k.indexOf(L[j][2]) === 0)) return { g: VIEWS[i], cur: L[j] };
  }
  return null;
}
function strip() {
  /* v708: صفحات «إجراءات الإدارة» (cu-admx-*) تُرسم في حاوية adm-live لا lv-page */
  var k = window.__lvKey || '', page = document.querySelector('#pv-root .lv-page') || (/^cu-admx-/.test(k) ? document.querySelector('#pv-root > .t2-stack.adm-live') : null);
  var had = !!(document.activeElement && document.activeElement.closest && document.activeElement.closest('.tqn-views'));
  document.querySelectorAll('.tqn-views').forEach(function (x) { if (x.parentNode !== page || x.getAttribute('data-k') !== k) x.remove(); });
  if (!page || !k) return;
  var V = viewsOf(k);
  /* الصفحة النهائية (طلب مفتوح بمراحله) بلا تبويبات */
  if (!V || page.querySelector('.tqn-stage')) { var o = page.querySelector(':scope > .tqn-views'); if (o) o.remove(); return; }
  if (page.querySelector(':scope > .tqn-views')) return;
  var AK = acct();
  if (!AK) return; /* قبل تسجيل صفحات المنصة لا تبويبات (تُرسم في الفحص التالي) */
  var L = V.g[1].filter(function (t) { return AK[t[0]]; });
  var sub = V.cur[2] ? RECV.filter(function (r) { return AK[V.cur[2] + r[0]]; }) : [];
  if (L.length < 2 && !sub.length) return;
  var html = '<div class="tqn-vt">' + L.map(function (t) {
    var on = t === V.cur;
    return '<button type="button" class="tqn-v' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + ' data-tqn-v="' + esc(t[0]) + '">' + esc(t[1]) + '</button>';
  }).join('') + '</div>';
  if (sub.length) {
    html += '<div class="tqn-vs" role="group" aria-label="طريقة السداد">' + sub.map(function (r) {
      var key = V.cur[2] + r[0], on = key === k;
      return '<button type="button" class="tqn-vc' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + ' data-tqn-v="' + esc(key) + '">' + esc(r[1]) + '</button>';
    }).join('') + '</div>';
  }
  var d = document.createElement('nav');
  d.className = 'tqn-views';
  d.setAttribute('aria-label', 'صفحات القسم');
  d.setAttribute('data-k', k);
  d.innerHTML = html;
  page.insertBefore(d, page.firstChild);
  /* v724: صفحات القسم الواحد تُختار من «العرض» — قائمة اختيار صغيرة بدل صف تبويبات فوق الصفحة */
  var vt = d.querySelector('.tqn-vt');
  if (vt) {
    var sel = document.createElement('select');
    sel.className = 'tqn-vsel';
    sel.setAttribute('aria-label', 'العرض');
    [].forEach.call(vt.querySelectorAll('[data-tqn-v]'), function (b) {
      var op = document.createElement('option');
      op.value = b.getAttribute('data-tqn-v');
      op.textContent = b.textContent;
      if (b.classList.contains('is-on')) op.selected = true;
      sel.appendChild(op);
    });
    sel.addEventListener('change', function () { go(sel.value); });
    var lb = document.createElement('label');
    lb.className = 'tqn-vlb';
    var sp = document.createElement('span');
    sp.textContent = 'العرض';
    lb.appendChild(sp);
    lb.appendChild(sel);
    vt.replaceWith(lb);
  }

  var on = d.querySelector('.tqn-v.is-on');
  if (on && on.scrollIntoView) { try { on.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (err) { void err; } }
  if (had) { var f = d.querySelector('.tqn-vc.is-on') || on; if (f) f.focus(); }
}
document.addEventListener('click', function (ev) {
  var b = ev.target.closest && ev.target.closest('.tqn-views [data-tqn-v]');
  if (!b || b.classList.contains('is-on')) return;
  go(b.getAttribute('data-tqn-v'));
});

/* v707: لوحة التفاصيل صفحة في مساحة المحتوى — موضعها تحت الشريط العلوي وبجانب القائمة الجانبية وفوق شريط التطبيق السفلي */
var GEO = '', RO = null;
function vis(x) { return !!x && getComputedStyle(x).display !== 'none' && getComputedStyle(x).visibility !== 'hidden'; }
function geo() {
  var h = document.querySelector('#pv-host .t2-head'), s = document.querySelector('#pv-host .t2-side'), dk = document.querySelector('#pv-host .t2-dock');
  var top = 0, side = 0, bot = 0, de = document.documentElement;
  if (vis(h)) { var r = h.getBoundingClientRect(); if (r.height) top = Math.max(0, Math.round(r.bottom)); }
  if (vis(s)) { var q = s.getBoundingClientRect(); if (q.width) side = Math.max(0, Math.round(de.clientWidth - q.left)); }
  if (vis(dk)) { var z = dk.getBoundingClientRect(); if (z.height && z.top < de.clientHeight) bot = Math.max(0, Math.round(de.clientHeight - z.top)); }
  var sig = top + '|' + side + '|' + bot;
  if (sig !== GEO) {
    GEO = sig;
    de.style.setProperty('--tqn-top', top + 'px');
    de.style.setProperty('--tqn-side', side + 'px');
    de.style.setProperty('--tqn-bottom', bot + 'px');
  }
  /* المنصة تعيد رسم الغلاف (الويب/الجوال وبعد الدخول) — المراقبة تتبع العناصر الحالية */
  if (RO && (RO.__h !== h || RO.__s !== s || RO.__d !== dk)) { RO.disconnect(); RO = null; }
  if (!RO && typeof ResizeObserver === 'function' && (h || s || dk)) {
    RO = new ResizeObserver(function () { geoQ(); });
    RO.__h = h; RO.__s = s; RO.__d = dk;
    [h, s, dk].forEach(function (x) { if (x) RO.observe(x); });
  }
  /* لوحة التفاصيل صفحة لا نافذة: القائمة والشريط يبقيان متاحين، والصفحة التي تحتها خارج التنقّل بلوحة المفاتيح */
  var root = document.getElementById('pv-root'), open = false;
  document.querySelectorAll('.cu-dh .cu-dr.is-page').forEach(function (d) {
    open = true;
    if (d.getAttribute('aria-modal') !== 'false') d.setAttribute('aria-modal', 'false');
  });
  if (root && root.inert !== open) root.inert = open;
}
var geoQd = false;
function geoQ() {
  if (geoQd) return;
  geoQd = true;
  requestAnimationFrame(function () { geoQd = false; geo(); });
}

  /* تمييز البند الحالي: الصفحة المفتوحة أو أقرب أصل لها في الشجرة */
  function cur() {
    var k = window.__lvKey || '', g = 0;
    while (k && !ITEMS[k] && !(LAST && LAST.set[k] && !COVER[k]) && g++ < 8) k = upOf(k);
    return k;
  }
  function mark() {
    var k = cur();
    document.querySelectorAll('.tqn-nav .t2-side-sub').forEach(function (x) { x.remove(); });
    document.querySelectorAll('.tqn-i').forEach(function (b) {
      var on = !!k && b.getAttribute('data-next-nav') === k;
      b.classList.toggle('is-on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    strip();
  }

  /* التطبيق (الجوال): «الأقسام» في الشريط السفلي يفتح الشجرة نفسها في ورقة سفلية */
  var SHEET = null;
  function closeSheet(back) {
    if (!SHEET) return;
    var s = SHEET; SHEET = null;
    document.removeEventListener('keydown', onKey, true);
    (s.__inert || []).forEach(function (x) { x.inert = false; });
    document.documentElement.classList.remove('tqn-lock');
    s.remove();
    if (back && s.__from && s.__from.focus) s.__from.focus();
  }
  function onKey(ev) {
    if (!SHEET) return;
    if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); closeSheet(true); return; }
    if (ev.key === 'Tab') {
      var f = SHEET.querySelectorAll('button, a[href]');
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === a) { ev.preventDefault(); z.focus(); }
      else if (!ev.shiftKey && document.activeElement === z) { ev.preventDefault(); a.focus(); }
    }
  }
  function openSheet(from) {
    if (!LAST) return false;
    closeSheet(false);
    var k = cur(), html = '';
    groups(LAST).forEach(function (g) {
      html += '<section class="tqn-sg">' + (g[0] ? '<h3 class="tqn-sh">' + esc(g[0]) + '</h3>' : '') +
        '<div class="tqn-sl">' + g[1].map(function (i) {
          var on = i[0] === k;
          return '<button type="button" class="tqn-row' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') +
            ' data-next-nav="' + esc(i[0]) + '"><span class="tqn-ric tqn-ic">' + iconOf(LAST, i[0]) + '</span>' +
            '<span class="tqn-rl">' + esc(i[1]) + '</span><span class="tqn-chev" aria-hidden="true"></span></button>';
        }).join('') + '</div></section>';
    });
    var s = document.createElement('div');
    s.className = 'tqn-sheet';
    s.innerHTML = '<div class="tqn-back" data-close="1"></div>' +
      '<div class="tqn-panel" role="dialog" aria-modal="true" aria-labelledby="tqn-st" dir="rtl">' +
      '<div class="tqn-grip" aria-hidden="true"></div>' +
      '<div class="tqn-head"><h2 id="tqn-st">الأقسام</h2><button type="button" class="tqn-x" data-close="1">رجوع</button></div>' +
      FLAG + '<div class="tqn-body">' + html + '</div></div>';
    s.__from = from;
    s.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-close]')) { closeSheet(true); return; }
      var b = ev.target.closest('[data-next-nav]');
      if (b) { var key = b.getAttribute('data-next-nav'); closeSheet(false); go(key); }
    });
    s.__inert = [].filter.call(document.body.children, function (x) { return !x.inert; });
    s.__inert.forEach(function (x) { x.inert = true; });
    document.body.appendChild(s);
    document.documentElement.classList.add('tqn-lock');
    SHEET = s;
    document.addEventListener('keydown', onKey, true);
    var f = s.querySelector('.tqn-row.is-on') || s.querySelector('.tqn-row');
    if (f) f.focus();
    return true;
  }
  /* الالتقاط قبل معالج المنصة على الزر نفسه؛ وإن لم تُقرأ القائمة بعد يبقى سلوك المنصة كما هو */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('.t2-dock-i[data-nav="adm-more"]');
    if (!b) return;
    if (openSheet(b)) { ev.preventDefault(); ev.stopPropagation(); }
  }, true);

  function scan() {
    var old = document.querySelector('.t2-side-n:not(.tqn-nav)');
    if (old && !old.__tqn) {
      /* القائمة الأصلية تُرسم أولًا بأقسام قليلة ثم تكتمل بعد جلب الأدوار — تُتابَع وتُعاد الجديدة معها */
      old.__tqn = true;
      new MutationObserver(function () { build(old); }).observe(old, { childList: true, subtree: true });
    }
    if (old && (!old.nextElementSibling || !old.nextElementSibling.classList.contains('tqn-nav'))) build(old);
    var t = document.getElementById('pv-title');
    if (t && !t.__tqn) { t.__tqn = true; new MutationObserver(mark).observe(t, { childList: true, characterData: true, subtree: true }); }
    var r = document.getElementById('pv-root');
    if (r && !r.__tqn) { r.__tqn = true; new MutationObserver(mark).observe(r, { childList: true }); }
  /* v719: هوية «تيرا · منصة الموظفين» في رأس القائمة الجانبية كما في التصور */
  var stop = document.querySelector('#pv-host .t2-side-top');
  if (stop && !stop.querySelector('.tqn-brand')) {
    var bd = document.createElement('div');
    bd.className = 'tqn-brand';
    bd.innerHTML = '<span class="tqn-brand-l" aria-hidden="true">TERA</span><span class="tqn-brand-t"><b>تيرا</b><small>منصة الموظفين</small></span>';
    stop.insertBefore(bd, stop.firstChild);
  }
    /* v707: تبويبات الصفحة تُعاد بعد كل رسم داخلها، وموضع لوحة التفاصيل يتبع الشريط والقائمة */
    strip();
    geo();
  }

  /* المنصة تعيد رسم الغلاف (الويب/الجوال وبعد الدخول) — يُفحص بعد كل تغيير في الصفحة، مرة لكل إطار */
  var queued = false;
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; scan(); });
  }
  function start() {
    scan();
    new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', geoQ, { passive: true });
    window.addEventListener('scroll', geoQ, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* v724: الشريط العلوي والقائمة الجانبية كما في التصور المعتمد —
   · زر ثابت في الشريط العلوي للانتقال إلى المنصة الحالية (/staff/) — الصفحة المفتوحة محفوظة في الجلسة فتُفتح هناك إن وُجدت.
   · بطاقة المستخدم أسفل القائمة الجانبية (الاسم والدور، وزر الخروج) — تضغط أزرار الشريط الأصلية نفسها، فلا منطق جديد. */
(function () {
  function put() {
    var r = document.querySelector('#pv-host .t2-hd-r');
    /* v726: شعار تيرا الرسمي الأبيض في رأس القائمة */
    var br = document.querySelector('#pv-host .tqn-brand');
    if (br && window.__tqLogo && window.__tqLogo.w && !br.classList.contains('has-logo')) { br.classList.add('has-logo'); br.innerHTML = '<img class="tqn-brand-img" alt="تيرا" src="' + window.__tqLogo.w + '"><small>منصة الموظفين</small>'; }
    if (r && !r.querySelector('.tqn-sw')) {
      var a = document.createElement('a');
      a.className = 'tqn-sw';
      a.href = '/staff/' + location.search;
      a.title = 'الانتقال إلى المنصة الحالية';
      a.textContent = 'المنصة الحالية';
      r.insertBefore(a, r.querySelector('.has-new') || r.querySelector('.is-out') || null);
    }
    var side = document.querySelector('#pv-host .t2-app > .t2-side'), who = r && r.querySelector('.t2-hwho');
    if (!side || !who) return;
    var nm = (who.querySelector('.t2-hwho-n') || {}).textContent || '', rl = (who.querySelector('.t2-hwho-r') || {}).textContent || '', av = (who.querySelector('.t2-avatar') || {}).textContent || '';
    var u = side.querySelector(':scope > .tqn-user');
    var sig = nm + '|' + rl + '|' + av;
    if (u && u.getAttribute('data-sig') === sig && u === side.lastElementChild) return;
    if (!u) {
      u = document.createElement('div');
      u.className = 'tqn-user';
      u.innerHTML = '<button type="button" class="tqn-user-w"><span class="tqn-user-a"></span><span class="tqn-user-t"><b></b><small></small></span></button>' +
        '<button type="button" class="tqn-user-o" title="تسجيل الخروج" aria-label="تسجيل الخروج"><svg viewBox="0 0 256 256" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"/></svg></button>';
      u.querySelector('.tqn-user-w').addEventListener('click', function (ev) { ev.stopPropagation(); var w = document.querySelector('#pv-host .t2-hd-r .t2-hwho'); if (w) w.click(); });
      u.querySelector('.tqn-user-o').addEventListener('click', function () { var o = document.querySelector('#pv-host .t2-hd-r .is-out'); if (o) o.click(); });
    }
    u.setAttribute('data-sig', sig);
    u.querySelector('.tqn-user-a').textContent = av || (nm ? nm.charAt(0) : '');
    u.querySelector('.tqn-user-t b').textContent = nm;
    u.querySelector('.tqn-user-t small').textContent = rl;
    side.appendChild(u);
  }
  var t = 0;
  try { new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; put(); }, 60); }).observe(document.documentElement, { childList: true, subtree: true }); put(); } catch (err) { void err; }
})();

/* v728: طيّ القائمة الجانبية وفتحها بزرّها في رأس القائمة، وطيّ كل قسم وفتحه بعنوانه — الحالتان تُحفظان على هذا الجهاز ·
   الشعار المختصر عند طيّ القائمة · اسم كل عنصر يظهر عند المرور */
(function () {
  var K = 'tqn.sideMin', KG = 'tqn.sideClosed', busy = false;
  function closedList() { try { var a = JSON.parse(localStorage.getItem(KG) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function ghName(g) { var h = g.querySelector(':scope > .tqn-gh span'); return h ? h.textContent.trim() : ''; }
  function T2() { return document.querySelector('#pv-host .t2'); }
  function want() { try { return localStorage.getItem(K) === '1'; } catch (e) { return false; } }
  function apply() {
    busy = false;
    var t = T2(); if (!t) return;
    if (t.__tqnSide !== 1) { t.__tqnSide = 1; if (want() !== t.classList.contains('is-side-min')) t.classList.toggle('is-side-min', want()); }
    var min = t.classList.contains('is-side-min');
    var b = t.querySelector('.t2-side-t');
    if (b) {
      var l = b.querySelector('span:last-child'), txt = min ? 'توسيع القائمة' : 'طيُّ القائمة';
      if (l && l.textContent !== txt) l.textContent = txt;
      if (b.title !== txt) b.title = txt;
      if (b.getAttribute('aria-expanded') !== String(!min)) b.setAttribute('aria-expanded', String(!min));
    }
    var br = t.querySelector('.tqn-brand.has-logo');
    if (br && !br.querySelector('.tqn-brand-mark')) {
      var m = (window.__tqLogo && window.__tqLogo.m) || '';
      if (m) { var im = document.createElement('img'); im.className = 'tqn-brand-mark'; im.alt = 'تيرا'; im.src = m; br.insertBefore(im, br.firstChild); }
    }
    if (t.__tqnGrp !== 1) {
      t.__tqnGrp = 1;
      var CLs = closedList();
      t.querySelectorAll('.tqn-nav > .tqn-g').forEach(function (g) {
        var n = ghName(g); if (!n) return;
        var c = CLs.indexOf(n) >= 0;
        if (c !== g.classList.contains('is-closed')) g.classList.toggle('is-closed', c);
        var h = g.querySelector(':scope > .tqn-gh'); if (h) h.setAttribute('aria-expanded', String(!c));
      });
    }
    t.querySelectorAll('.tqn-nav .t2-side-i').forEach(function (i) {
      if (!i.title) { var s = i.querySelector('.t2-side-l'); if (s) i.title = s.textContent.trim(); }
    });
  }
  function soon() { if (busy) return; busy = true; (window.requestAnimationFrame || setTimeout)(apply); }
  document.addEventListener('click', function (ev) {
    var gh = ev.target && ev.target.closest && ev.target.closest('#pv-host .tqn-nav .tqn-gh');
    if (gh) {
      setTimeout(function () {
        var t = T2(); if (!t) return; var a = [];
        t.querySelectorAll('.tqn-nav > .tqn-g.is-closed').forEach(function (g) { var n = ghName(g); if (n) a.push(n); });
        try { localStorage.setItem(KG, JSON.stringify(a)); } catch (e) { void e; }
      }, 0);
      return;
    }
    var b = ev.target && ev.target.closest && ev.target.closest('#pv-host .t2-side-t'); if (!b) return;
    setTimeout(function () { var t = T2(); if (!t) return; try { localStorage.setItem(K, t.classList.contains('is-side-min') ? '1' : '0'); } catch (e) { void e; } apply(); }, 0);
  }, true);
  try { new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) { void e; }
  soon();
})();
/* v760: قسم العملاء بالتصوّر المعتمد (v735) + إصلاحات (v736–v748) —
   · v746: الملف بصفوف عرضية بلا عمودين، والمحتوى بعرض الصفحة، وبلا تكرار للأزرار والأرقام.
   · v760: صفحة «بانتظار التدشين» (شاشة المشرف): الخطوات شريط ثم عمودان بطاقات، واختيار الأسباب في المراجعة والقرار.
   · v755: المحتوى الداخلي حتى آخر نقطة — بنود التوثيق صفوف (البند · القيمة · الحالة · الإجراء) والسبب المكرّر مرة للقسم، القرار بعد البنود، المراسلة والسجل بطاقات، وتفاصيل التدشين بطاقة العضوية بجانب حقائقها بلا تكرار، والملف المفتوح من «العملاء الجدد» يرجع إليها.
   · v753–v754: «العملاء الجدد» و«طلبات توثيق الملف» و«تدشين الحساب» بلغة القسم نفسها: ملخص يصفّي، شريط أدوات واحد، جدول، ومسار موحّد في صفحات التفاصيل.
   · v750: التنويهات أعلى الملف · الوصول السريع صف وحده مع «طلبات العميل» و«تقرير العميل» · ما يُفتح من الملف يعود إليه (المسار وزر العودة).
   · ملف العميل مساحة عمل: لوحة العميل ثابتة بجانب المحتوى (البطاقة · أزرار سريعة · دائرة السداد · التنويهات)، والمحتوى بتبويباته.
   · العقد: بطاقة رأس واحدة + تنبيه المتأخرات بأزراره + مسار الدفعات الزمني + تبويب لكل قسم.
   · صفحة الإجراءات: بطاقات مجمّعة حسب الغرض (التحصيل · تعديل الدفعات · حالة العقد) بحالة كل إجراء، وكل إجراء صفحة بإطار ثابت وزر رجوع.
   · قائمة العملاء: ملخص بالأرقام يصفّي بنقرة، بحث وفرز، وجدول (المتبقي · المتأخر · نسبة السداد · الحالة) من بيانات المنصة (data-k).
   · المسار صحيح دائمًا، ومهمة واحدة في كل تبويب، بلا تكرار.
   الأزرار تشغّل إجراءات المنصة نفسها (لا منطق جديد ولا إرسال تلقائي). */
(function () {
  var ST = { K: {} }, busy = false;
  var CT = /^العقد\s/, ACTS = /^الإجراءات$/;
  var ORDER = [/جدول السداد/, /الوسائل/, /مكوّنات|مكونات/, /تفاصيل/, /عرض السعر/, /الرسوم|المصاريف/, /مستندات/, /سجل/];
  var SHORT = [[/^جدول السداد/, 'جدول السداد'], [/^مكوّنات|^مكونات/, 'مكوّنات القيمة'], [/^تفاصيل العقد/, 'التفاصيل'], [/^مستندات العقد/, 'المستندات'], [/^سجل الأحداث/, 'السجل']];
  var SKIPK = /المسددة|آخر دفعة|عرض السعر/, DIAC = /[ً-ْ]/g;
  var AG = [['التحصيل والسداد', ['pset', 'plink', 'btr', 'gwop']], ['تعديل الدفعات', ['edit', 'waive', 'link', 'unset']], ['حالة العقد', ['settle', 'close', 'reopen', 'cedit']]];
  var AIC = { pset: '✓', plink: '⛓', btr: '⇄', settle: '◎', gwop: '↺', edit: '✎', waive: '½', link: '⤳', unset: '↶', close: '■', reopen: '□', cedit: '✎' };
  function txt(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function head(sec) { return sec ? sec.querySelector(':scope > .t2-sec-h') : null; }
  function body(sec) { return sec ? sec.querySelector(':scope > .t2-sec-b') : null; }
  function title(sec) { var h = head(sec); return h ? txt(h.querySelector('.t2-group-t, h2, h3')) : ''; }
  function count(sec) { var h = head(sec); return h ? txt(h.querySelector('.lv-cnt')) : ''; }
  function secsOf(box) { return box ? [].filter.call(box.children, function (k) { return k.matches && k.matches('section.t2-sec') && !!title(k); }) : []; }
  function cls(el, c, on) { if (el && el.classList.contains(c) !== !!on) el.classList.toggle(c, !!on); }
  function mk(tag, c, t) { var x = document.createElement(tag); if (c) x.className = c; if (t != null) x.textContent = t; return x; }
  function quiet(h) { if (h && !h.querySelector('button, a, input, select')) cls(h, 'tqn-st-nh', true); }
  function tone(el) { return (String(el && el.className).match(/is-(ok|warn|bad|danger|info|brand)/) || [])[1] || ''; }
  function short(t) { for (var i = 0; i < SHORT.length; i++) if (SHORT[i][0].test(t)) return SHORT[i][1]; return t; }
  function word(t) { return String(t).split(/\s+/)[0]; }
  function num(s) { var m = String(s || '').replace(/[٬,]/g, '').match(/-?\d+(\.\d+)?/); return m ? +m[0] : 0; }
  function sar(n) { return Math.round(n).toLocaleString('en-US') + ' ر.س'; }
  function jd(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function btn(label, cl, fn, dis) { var b = mk('button', 'tqn-b' + (cl ? ' ' + cl : ''), label); b.type = 'button'; b.setAttribute('data-live-ok', ''); if (dis) b.disabled = true; b.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); fn(); }); return b; }
  function wait(test, cb, n) { n = n || 0; var r = null; try { r = test(); } catch (e) { r = null; } if (r) return cb(r); if (n > 40) return; setTimeout(function () { wait(test, cb, n + 1); }, 100); }
  function days(d) { if (!d) return null; var t = Date.parse(d + 'T00:00:00'); if (isNaN(t)) return null; var n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n.getTime()) / 864e5); }

  /* ── شريط اختيار عام ── */
  function bar(box, before, items, cur, kind, onPick) {
    var sig = kind + '|' + items.map(function (it) { return it.k + ':' + (it.n || ''); }).join('|');
    var b = box.__tqnBar;
    if (!b || b.__sig !== sig || b.parentNode !== box) {
      if (b && b.parentNode) b.parentNode.removeChild(b);
      b = mk('div', 'tqn-st is-' + kind); b.setAttribute('role', 'tablist'); b.__sig = sig;
      items.forEach(function (it) {
        var x = mk('button', 'tqn-st-b'); x.type = 'button'; x.setAttribute('role', 'tab'); x.setAttribute('data-live-ok', ''); x.__k = it.k;
        if (it.node) x.appendChild(it.node); else { x.appendChild(mk('span', '', it.t)); if (it.n) x.appendChild(mk('i', '', it.n)); }
        x.addEventListener('click', function () { onPick(it.k); apply(); });
        b.appendChild(x);
      });
      box.insertBefore(b, before); box.__tqnBar = b;
    } else if (before && before.parentNode === box && b.nextSibling !== before) box.insertBefore(b, before);
    [].forEach.call(b.children, function (x) {
      var on = x.__k === cur; cls(x, 'is-on', on);
      if (x.getAttribute('aria-selected') !== String(on)) x.setAttribute('aria-selected', String(on));
    });
    return b;
  }

  /* ── 1) المسار ── */
  function crumbs() {
    var host = document.querySelector('#pv-host'); if (!host) return;
    var src = host.querySelector('.t2-crumbs'); if (!src) return;
    var on = document.querySelector('.tqn-nav .tqn-i.is-on');
    var mine = src.__tqnCr, back = src.parentNode && src.parentNode.querySelector(':scope > .t2-back');
    var srcBtns = [].slice.call(src.querySelectorAll('.t2-crumb-a'));
    var srcLast = txt(src.querySelector('[aria-current]'));
    var homeBtn = [].filter.call(document.querySelectorAll('.tqn-nav .tqn-i'), function (x) { return /^الرئيسية$/.test(x.getAttribute('title') || txt(x)); })[0];
    var L = [], F = ST.from;
    /* v750: صفحة فُتحت من ملف العميل — المسار والرجوع إلى الملف نفسه */
    if (F && window.TQN_CF && !document.querySelector('#pv-root .tqn-cf')) {
      var fb = [].filter.call(document.querySelectorAll('.tqn-nav .tqn-i'), function (x) { return /^ملفات العملاء$/.test(x.getAttribute('title') || txt(x)); })[0];
      var pt0 = txt(document.getElementById('pv-title')) || srcLast;
      L.push({ t: 'الرئيسية', home: 1, go: function () { if (homeBtn) homeBtn.click(); else if (srcBtns[0]) srcBtns[0].click(); } });
      L.push({ t: 'العملاء', grp: 1 });
      L.push({ t: 'ملفات العملاء', go: fb ? function () { fb.click(); } : null });
      L.push({ t: F.who, go: function () { backFile(F); } });
      if (pt0 && pt0 !== F.who) L.push({ t: pt0 });
      L.back = F;
      return crumbsDraw(src, back, mine, L);
    }
    if (!on || on === homeBtn) { cls(src, 'tqn-cr-src', false); cls(back, 'tqn-hide', false); if (mine && mine.parentNode) mine.parentNode.removeChild(mine); return; }
    var item = on.getAttribute('title') || txt(on);
    /* v755: ملف فُتح من «العملاء الجدد» — المسار يرجع إليها لا إلى «ملفات العملاء» */
    var ncB = null;
    if (ST.fromNc && document.querySelector('#pv-root .tqn-cf')) { ncB = [].filter.call(document.querySelectorAll('.tqn-nav .tqn-i'), function (x) { return /^العملاء الجدد$/.test(x.getAttribute('title') || txt(x)); })[0] || null; if (ncB) item = 'العملاء الجدد'; }
    var g = on.closest('.tqn-g'), gl = g ? txt(g.querySelector('.tqn-gh')) : '';
    L.push({ t: 'الرئيسية', home: 1, go: function () { if (srcBtns[0]) srcBtns[0].click(); else if (homeBtn) homeBtn.click(); } });
    if (gl && gl !== item) L.push({ t: gl, grp: 1 });
    var pt = txt(document.getElementById('pv-title')) || srcLast, deep = src.querySelectorAll('.t2-crumb-li').length >= 3;
    var detail = deep && pt && pt !== item && pt !== 'الرئيسية' && pt !== gl ? pt : '';
    var bk = ncB || srcBtns.filter(function (x) { return txt(x) === item; })[0];
    L.push({ t: item, go: detail ? function () { if (bk) bk.click(); else on.click(); } : null });
    if (detail) {
      var fileC = document.querySelector('#pv-root .tqn-cf') && ST.__curC;
      L.push({ t: detail, go: fileC ? function () { var h = document.querySelector('#pv-root .lx-hero'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); } : null });
      if (fileC) {
        L.push({ t: 'العقد ' + fileC, go: ST.__am ? function () { amClose(); } : null });
        if (ST.__am) L.push({ t: ST.__am === 1 ? 'الإجراءات' : ST.__am });
      }
    }
    return crumbsDraw(src, back, mine, L);
  }
  function backFile(F) { ST.from = null; try { window.TQN_CF.go('cu-pf-file', { pfc: F.pfc }); } catch (e) { void e; } }
  function crumbsDraw(src, back, mine, L) {
    var sig = L.map(function (x) { return x.t + (x.go ? '*' : ''); }).join('›') + (L.back ? '#b' : '');
    cls(src, 'tqn-cr-src', true); cls(back, 'tqn-hide', true);
    if (mine && mine.parentNode === src.parentNode && mine.__sig === sig) { mine.__L = L; return; }
    if (mine && mine.parentNode) mine.parentNode.removeChild(mine);
    mine = mk('nav', 'tqn-cr'); mine.setAttribute('aria-label', 'المسار'); mine.__sig = sig; mine.__L = L;
    var ol = mk('ol', 'tqn-cr-ol');
    L.forEach(function (x, i) {
      var last = i === L.length - 1, li = mk('li', 'tqn-cr-li' + (x.home ? ' is-home' : '') + (x.grp ? ' is-grp' : ''));
      var el;
      if (!last && x.go) { el = mk('button', 'tqn-cr-a'); el.type = 'button'; el.setAttribute('data-live-ok', ''); el.addEventListener('click', function () { var f = (mine.__L[i] || {}).go; if (f) f(); }); }
      else { el = mk('span', last ? 'tqn-cr-c' : 'tqn-cr-t'); if (last) el.setAttribute('aria-current', 'page'); }
      if (x.home) el.appendChild(mk('span', 'tqn-cr-h'));
      el.appendChild(mk('span', 'tqn-cr-l', x.t));
      li.appendChild(el); ol.appendChild(li);
    });
    mine.appendChild(ol);
    if (L.back) { var F = L.back, bb = mk('button', 'tqn-cr-bk'); bb.type = 'button'; bb.setAttribute('data-live-ok', ''); bb.appendChild(mk('span', '', 'العودة إلى ملف العميل')); bb.addEventListener('click', function () { backFile(F); }); mine.appendChild(bb); cls(mine, 'has-bk', true); }
    src.parentNode.insertBefore(mine, src.nextSibling); src.__tqnCr = mine;
  }

  /* ── 2) قائمة العملاء: ملخص يصفّي + بحث وفرز + جدول ── */
  function kOf(card) { var k = jd(card.getAttribute('data-k')); if (!k) return null; var s = (card.getAttribute('data-s') || '').split(' '); k.name = txt(card.querySelector('.cu-card-t b')); k.no = txt(card.querySelector('.cu-card-t small bdi')) || ''; return k; }
  function kState(k) {
    if (!k.n) return ['بلا عقود', 'g', 'none'];
    if (k.l > 0) return [k.w >= 3 ? 'متعثر' : 'متأخر', 'bad', 'late'];
    var d = days(k.nx);
    if (k.r > 0 && d != null && d <= 7) return [d <= 0 ? 'يستحق اليوم' : 'يستحق خلال ' + d + (d === 1 ? ' يوم' : ' أيام'), 'warn', 'soon'];
    if (k.r > 0) return ['منتظم', 'ok', 'ok'];
    return ['مكتمل', 'done', 'ok'];
  }
  function list(root) {
    var box = root.querySelector('.cu-cards'); if (!box) return;
    var cards = [].slice.call(box.querySelectorAll(':scope > .cu-card'));
    var K = cards.map(function (c) { return { c: c, k: kOf(c) }; }).filter(function (x) { return x.k; });
    if (!K.length) return;
    K.forEach(function (x) { ST.K[x.k.name] = x.k; });
    var stack = box.parentNode; cls(stack, 'tqn-cl', true); cls(box, 'tqn-hide', true);
    [].forEach.call(stack.querySelectorAll(':scope > .adm-tools'), function (x) { cls(x, 'tqn-hide', true); });
    /* v741: شرائح حالة الحساب (الأمان) تُدمج في شريط الجدول قائمةً منسدلة — صف تصفية واحد بدل صفّين */
    var SC = [];
    [].forEach.call(stack.querySelectorAll(':scope > .m3-tools, :scope > .ax-tools'), function (x) { var ch = x.querySelectorAll('.st-chip'); if (ch.length) { cls(x, 'tqn-hide', true); SC = SC.concat([].slice.call(ch)); } else cls(x, 'tqn-hide', x.querySelectorAll('button').length <= 1); });
    if (!box.__tqnMo) { try { box.__tqnMo = new MutationObserver(soon); box.__tqnMo.observe(box, { attributes: true, subtree: true, attributeFilter: ['style', 'hidden'] }); } catch (e) { void e; } }
    var F = ST.lf || 'all', SO = ST.ls || 'name', Q = (ST.lq || '').trim().toLowerCase();
    var groups = [['all', 'كل العملاء', K.length, ''], ['ok', 'منتظمون', 0, 'ok'], ['late', 'عليهم متأخرات', 0, 'bad'], ['soon', 'يستحق خلال 7 أيام', 0, 'warn'], ['none', 'بلا عقود', 0, 'g']];
    K.forEach(function (x) { var s = kState(x.k)[2]; groups.forEach(function (g) { if (g[0] === s) g[2]++; }); });
    var sig = K.map(function (x) { return x.k.name + x.c.getAttribute('data-k') + (x.c.hidden || x.c.style.display === 'none' ? 0 : 1); }).join('|') + F + SO + Q + SC.map(function (c) { return txt(c) + (c.classList.contains('is-on') ? 1 : 0); }).join(',');
    var W = stack.__tqnCl;
    if (W && W.parentNode === stack && W.__sig === sig) return;
    var keepQ = W && W.__q === document.activeElement;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    W = mk('div', 'tqn-clw'); W.__sig = sig;
    var SMI = { all: '∑', ok: '✓', bad: '!', warn: '◷', g: '∅' };
    var sm = mk('div', 'tqn-sum');
    groups.forEach(function (g) {
      var b = mk('button', 'tqn-sm is-' + (g[3] || 'all') + (F === g[0] ? ' is-on' : '')); b.type = 'button'; b.setAttribute('data-live-ok', '');
      b.appendChild(mk('i', '', SMI[g[3] || 'all'] || '∑')); var t = mk('span'); t.appendChild(mk('small', '', g[1])); t.appendChild(mk('b', '', String(g[2]))); b.appendChild(t);
      b.addEventListener('click', function () { ST.lf = g[0]; apply(); }); sm.appendChild(b);
    });
    W.appendChild(sm);
    var tb = mk('div', 'tqn-ltb');
    var q = mk('input', 'tqn-lq'); q.type = 'search'; q.placeholder = 'ابحث بالاسم أو الجوال أو رقم تيرا…'; q.value = ST.lq || ''; q.setAttribute('aria-label', 'بحث في العملاء');
    q.addEventListener('input', function () { ST.lq = q.value; clearTimeout(q.__t); q.__t = setTimeout(apply, 160); });
    tb.appendChild(q); W.__q = q;
    var seg = mk('div', 'tqn-seg');
    [['name', 'أ–ي'], ['late', 'الأعلى متأخرًا'], ['rem', 'الأعلى متبقيًا']].forEach(function (o) { var b = mk('button', SO === o[0] ? 'is-on' : '', o[1]); b.type = 'button'; b.setAttribute('data-live-ok', ''); b.addEventListener('click', function () { ST.ls = o[0]; apply(); }); seg.appendChild(b); });
    tb.appendChild(seg);
    if (SC.length > 1) {
      var sl = mk('select', 'tqn-lsel'); sl.setAttribute('aria-label', 'حالة الحساب'); sl.setAttribute('data-live-ok', '');
      SC.forEach(function (c, i) { var lb = txt(c.querySelector('span:not(.st-chip-ic)')) || txt(c), n = txt(c.querySelector('small')); var o = mk('option', '', (i ? '' : 'الحساب: ') + lb.replace(n, '').trim() + (n ? ' (' + n + ')' : '')); o.value = String(i); if (c.classList.contains('is-on')) o.selected = true; sl.appendChild(o); });
      sl.addEventListener('change', function () { var c = SC[+sl.value]; if (c) c.click(); soon(); });
      tb.appendChild(sl);
    }
    var rf = [].filter.call(stack.querySelectorAll('.adm-tools button'), function (x) { return /تحديث/.test(txt(x)); })[0];
    if (rf) tb.appendChild(btn('↻ تحديث', '', function () { rf.click(); }));
    W.appendChild(tb);
    var rows = K.filter(function (x) { return !(x.c.hidden || x.c.style.display === 'none'); })
      .filter(function (x) { return F === 'all' || kState(x.k)[2] === F; })
      .filter(function (x) { return !Q || (x.c.getAttribute('data-s') || '').indexOf(Q) >= 0 || x.k.name.toLowerCase().indexOf(Q) >= 0; });
    rows.sort(function (a, b) { return SO === 'late' ? b.k.l - a.k.l || b.k.r - a.k.r : SO === 'rem' ? b.k.r - a.k.r : a.k.name.localeCompare(b.k.name, 'ar'); });
    var T = mk('div', 'tqn-lt');
    var hr = mk('div', 'tqn-lr is-h'); ['العميل', 'الجوال', 'العقود', 'المتبقي', 'المتأخر', 'نسبة السداد', 'الحالة', ''].forEach(function (h) { hr.appendChild(mk('span', '', h)); }); T.appendChild(hr);
    rows.forEach(function (x) {
      var k = x.k, s = kState(k), pct = k.t > 0 ? Math.round(k.p / k.t * 100) : 0;
      var r = mk('div', 'tqn-lr'); r.setAttribute('role', 'button'); r.tabIndex = 0;
      var who = mk('div', 'tqn-who'); who.appendChild(mk('i', '', String(k.name || '؟').slice(0, 1))); var w2 = mk('span'); w2.appendChild(mk('b', '', k.name)); w2.appendChild(mk('small', '', k.no)); who.appendChild(w2); r.appendChild(who);
      var ph = mk('bdi', 'tqn-ph', k.ph ? String(k.ph).replace(/^966/, '0') : '—'); r.appendChild(ph);
      r.appendChild(mk('b', '', String(k.n)));
      r.appendChild(mk('b', '', k.n ? sar(k.r) : '—'));
      r.appendChild(mk('b', k.l > 0 ? 'is-bad' : 'is-mut', k.l > 0 ? sar(k.l) : '—'));
      var pc = mk('div', 'tqn-pc'); pc.appendChild(mk('b', '', k.n ? pct + '%' : '—')); var mb = mk('span', 'tqn-mb'), mi = mk('i'); mi.style.width = pct + '%'; mb.appendChild(mi); pc.appendChild(mb); r.appendChild(pc);
      r.appendChild(mk('span', 'tqn-chip is-' + s[1], s[0]));
      var ac = mk('div', 'tqn-acts');
      if (k.ph) { var a = mk('a', 'tqn-ib', ''); a.href = 'tel:+' + String(k.ph).replace(/^0/, '966'); a.title = 'اتصال'; a.setAttribute('aria-label', 'اتصال'); a.addEventListener('click', function (ev) { ev.stopPropagation(); }); ac.appendChild(a); }
      ac.appendChild(btn('فتح الملف', 'is-pri is-sm', function () { x.c.click(); }));
      r.appendChild(ac);
      r.addEventListener('click', function () { x.c.click(); });
      r.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') x.c.click(); });
      T.appendChild(r);
    });
    if (!rows.length) T.appendChild(mk('div', 'tqn-le', 'لا عملاء يطابقون البحث أو التصفية.'));
    W.appendChild(T);
    W.appendChild(mk('div', 'tqn-lf', 'عرض ' + rows.length + ' من ' + K.length + ' عميلًا'));
    stack.insertBefore(W, box); stack.__tqnCl = W;
    if (keepQ) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { void e; } }
  }

  /* ── 3) ملف العميل: لوحة العميل الثابتة ── */
  function hero(h, who) {
    cls(h, 'tqn-hx', true);
    var tx = h.querySelector('.lx-tx'), sub = h.querySelector('.lx-sub'); if (!tx) return;
    var stt = [].filter.call(h.querySelectorAll('.lx-tile'), function (t) { return /حالة الحساب|توثيق/.test(txt(t.querySelector('small'))); });
    var parts = sub ? txt(sub).split('·').map(function (p) { return p.trim(); }).filter(Boolean) : [];
    var ph = ((ST.K || {})[who] || {}).ph || '';
    var sig = parts.join('|') + '#' + ph + '#' + stt.map(function (t) { return txt(t) + tone(t); }).join('|');
    var box = tx.__tqnHx;
    if (!(box && box.parentNode === tx && box.__sig === sig)) {
      if (box && box.parentNode) box.parentNode.removeChild(box);
      if (tx.__tqnHf && tx.__tqnHf.parentNode) tx.__tqnHf.parentNode.removeChild(tx.__tqnHf);
      box = mk('div', 'tqn-hx-m'); box.__sig = sig;
      stt.forEach(function (t) { var p = mk('span', 'tqn-hx-st' + (tone(t) ? ' is-' + tone(t) : '')); p.appendChild(mk('small', '', txt(t.querySelector('small')))); p.appendChild(mk('b', '', txt(t.querySelector('b')))); box.appendChild(p); });
      /* حقائق الملف: تسمية · قيمة */
      var F = mk('div', 'tqn-hx-f'), L = [];
      parts.forEach(function (p) {
        var m = p.match(/^(رقم تيرا|عميل منذ|تاريخ التسجيل|رقم الجوال|الجوال)\s+(.+)$/);
        if (m) L.push([m[1], m[2]]); else if (/النظام السابق|مُرحّل|مرحّل|منقول/.test(p)) L.push(['المصدر', p]); else L.push(['', p]);
      });
      if (ph && !L.some(function (x) { return /الجوال/.test(x[0]); })) L.splice(1, 0, ['الجوال', String(ph).replace(/^966/, '0')]);
      L.forEach(function (x) { var f = mk('span', 'tqn-hx-c'); if (x[0]) f.appendChild(mk('small', '', x[0])); f.appendChild(mk('bdi', '', x[1])); F.appendChild(f); });
      var nm = tx.querySelector('h1, h2'); if (nm && nm.nextSibling) tx.insertBefore(box, nm.nextSibling); else tx.appendChild(box);
      tx.appendChild(F); tx.__tqnHx = box; tx.__tqnHf = F;
    }
    stt.forEach(function (t) { cls(t, 'tqn-hide', true); });
    cls(sub, 'tqn-hide', parts.length > 0);
  }
  function tileVal(h, re) { var t = [].filter.call(h.querySelectorAll('.lx-tile'), function (x) { return re.test(txt(x.querySelector('small'))); })[0]; return t ? txt(t.querySelector('b')) : ''; }
  /* أرقام العميل المالية: من بيانات القائمة (data-k) أو من العقود الظاهرة */
  function money(who, stack) {
    var k = ST.K[who];
    if (k && k.t > 0) return { t: k.t, p: k.p, r: k.r, l: k.l, src: 'k' };
    var T = 0, P = 0, R = 0, L = 0, any = false;
    [].forEach.call(stack.querySelectorAll('section.tqn-ct'), function (s) {
      var tr = s.querySelector('.fx-trio'); if (!tr) return; any = true;
      [].forEach.call(tr.querySelectorAll('.fx-trio-i'), function (i) { var l = txt(i.querySelector('span')), v = num(txt(i.querySelector('b'))); if (/إجمالي/.test(l)) T += v; else if (/المدفوع/.test(l)) P += v; else if (/المتبقي/.test(l)) R += v; });
      [].forEach.call(s.querySelectorAll('.fx-kpi'), function (q) { if (/^المتأخر$/.test(txt(q.querySelector('.fx-kpi-l')))) L += num(txt(q.querySelector('.fx-kpi-v'))); });
    });
    if (any && T > 0) { ST.M = ST.M || {}; ST.M[who] = { t: T, p: P, r: R, l: L }; }
    return (ST.M || {})[who] || null;
  }
  /* v746: ملف العميل بصفوف عرضية — (1) بطاقة العميل + مؤشر العميل · (2) الوصول السريع + التنويهات · (3) المسارات · ثم المحتوى بعرض الصفحة */
  /* v750: (0) التنويهات أعلى الملف بعرض الصفحة · (1) بطاقة العميل + مؤشر العميل · (2) الوصول السريع صفًا وحده · (3) المسارات */
  function cfx() { return window.TQN_CF || null; }
  function goFrom(who, k, o) { var C = cfx(); if (!C) return; ST.from = { who: who, pfc: C.pfc() }; ST.__inFile = null; try { C.go(k, o || {}); } catch (e) { void e; } }
  function topBuild(stack, h, who) {
    var tabs = stack.querySelector(':scope > .tqn-tabs');
    var R1 = stack.__tqnR1, R2 = stack.__tqnR2;
    if (!R1 || R1.parentNode !== stack) { R1 = mk('div', 'tqn-r1'); stack.__tqnR1 = R1; }
    if (!R2 || R2.parentNode !== stack) { R2 = mk('div', 'tqn-r2'); stack.__tqnR2 = R2; }
    /* التنويهات أولًا */
    var NT = [].slice.call(stack.querySelectorAll(':scope > .cf-nts, :scope > .tqn-r2 > .cf-nts'));
    NT.forEach(function (n, i) { cls(n, 'tqn-nt-top', true); var ref = i ? NT[i - 1].nextSibling : stack.firstChild; if (n !== ref) stack.insertBefore(n, ref); });
    var at = NT.length ? NT[NT.length - 1].nextSibling : stack.firstChild;
    if (at !== R1) stack.insertBefore(R1, at);
    if (R1.nextSibling !== R2) stack.insertBefore(R2, R1.nextSibling);
    if (h.parentNode !== R1) R1.insertBefore(h, R1.firstChild);
    cls(h.querySelector('.lx-tiles'), 'tqn-hide', true);
    /* مؤشر العميل */
    var C = cfx(), live = null; try { live = C ? C.cnt() : null; } catch (e) { live = null; }
    var m = money(who, stack), nC = tileVal(h, /العقود/), nB = tileVal(h, /السندات/);
    var K = ST.K[who] || {};
    var nX = live && live.x != null ? String(live.x) : K.x != null ? String(K.x) : (ST.X && ST.X[who] != null ? String(ST.X[who]) : '');
    var nQ = live && live.q != null ? String(live.q) : (ST.Q && ST.Q[who] != null ? String(ST.Q[who]) : '');
    var msig = JSON.stringify(m) + nC + nB + nX + '|' + nQ;
    var MO = R1.__mo;
    if (!MO || MO.parentNode !== R1 || MO.__sig !== msig) {
      if (MO && MO.parentNode) MO.parentNode.removeChild(MO);
      MO = mk('div', 'tqn-mo'); MO.__sig = msig;
      var mh = mk('div', 'tqn-bh'); mh.appendChild(mk('b', '', 'مؤشر العميل')); mh.appendChild(mk('small', '', 'كل العقود')); MO.appendChild(mh);
      var mt = mk('div', 'tqn-mo-t');
      if (m && m.t > 0) {
        var pp = Math.round(m.p / m.t * 100), lp = Math.min(100 - pp, Math.round(m.l / m.t * 100));
        var ring = mk('div', 'tqn-ring'); ring.style.background = 'conic-gradient(#06707A 0 ' + pp + '%, #F87171 ' + pp + '% ' + (pp + lp) + '%, #E8EDF3 ' + (pp + lp) + '% 100%)';
        var rin = mk('div'); rin.appendChild(mk('b', '', pp + '%')); rin.appendChild(mk('small', '', 'مسدَّد')); ring.appendChild(rin); mt.appendChild(ring);
        var rows = mk('div', 'tqn-mr');
        [['المدفوع', sar(m.p), 'p'], ['المتأخر', m.l > 0 ? sar(m.l) : '—', m.l > 0 ? 'l' : 'z'], ['المتبقي', sar(m.r), 'r']].forEach(function (x) { var d = mk('div', 'tqn-mri is-' + x[2]); d.appendChild(mk('span', '', x[0])); d.appendChild(mk('b', '', x[1])); rows.appendChild(d); });
        mt.appendChild(rows);
      } else {
        var rem = tileVal(h, /المتبقي/); var rows2 = mk('div', 'tqn-mr is-only');
        var d2 = mk('div', 'tqn-mri is-r'); d2.appendChild(mk('span', '', 'المتبقي')); d2.appendChild(mk('b', '', rem || '—')); rows2.appendChild(d2); mt.appendChild(rows2);
      }
      MO.appendChild(mt);
      var mk4 = mk('div', 'tqn-mk');
      [['العقود', nC, /العقود/], ['الطلبات', nQ, /الطلبات/], ['التحويلات', nX, /السندات/], ['السندات', nB, /السندات/]].forEach(function (x) {
        var b = btn('', 'tqn-mkc', function () { mainTab(x[2]); }); b.appendChild(mk('small', '', x[0])); b.appendChild(mk('b', '', x[1] || '—')); mk4.appendChild(b);
      });
      MO.appendChild(mk4);
      R1.appendChild(MO); R1.__mo = MO;
    }
    /* الوصول السريع — صف وحده */
    var tiles = ctrTiles(stack), en = function (k) { return tiles.some(function (t) { return t[0] === k && t[3]; }); };
    var ph = K.ph || '', rep = !!(C && C.has && C.has('cu-admx-rpc'));
    var qsig = ['pset', 'plink', 'btr'].map(en).join('') + ph + rep;
    var QA = R2.__qa;
    if (!QA || QA.parentNode !== R2 || QA.__sig !== qsig) {
      if (QA && QA.parentNode) QA.parentNode.removeChild(QA);
      QA = mk('div', 'tqn-qa'); QA.__sig = qsig;
      var qh = mk('div', 'tqn-bh'); qh.appendChild(mk('b', '', 'الوصول السريع')); QA.appendChild(qh);
      var qg = mk('div', 'tqn-qg');
      qg.appendChild(qbtn('✓', 'تسجيل سداد', 'is-pri', function () { runAct('pset'); }, !en('pset')));
      qg.appendChild(qbtn('⛓', 'رابط دفع', '', function () { runAct('plink'); }, !en('plink')));
      qg.appendChild(qbtn('⇄', 'طلب تحويل', '', function () { runAct('btr'); }, !en('btr')));
      qg.appendChild(qbtn('▤', 'سند جديد', '', function () { ST.__want = /^تسجيل سند/; mainTab(/السندات/); }));
      qg.appendChild(qbtn('☰', 'طلبات العميل', '', function () { mainTab(/الطلبات/); }));
      qg.appendChild(qbtn('◔', 'تقرير العميل', '', function () { var c = cfx(); goFrom(who, 'cu-admx-rpc', { rp: c ? c.pfc() : '' }); }, !rep));
      qg.appendChild(qbtn('☏', 'اتصال', '', function () { if (ph) location.href = 'tel:+' + String(ph).replace(/^0/, '966'); }, !ph));
      qg.appendChild(qbtn('✉', 'المراسلات', '', function () { mainTab(/التواصل/); }));
      QA.appendChild(qg);
      R2.insertBefore(QA, R2.firstChild); R2.__qa = QA;
    }
    cls(R2, 'is-one', true);
    if (tabs && R2.nextSibling !== tabs) stack.insertBefore(tabs, R2.nextSibling);
  }
  function qbtn(ic, label, cl, fn, dis) { var b = btn('', 'tqn-q ' + cl, fn, dis); b.appendChild(mk('i', '', ic)); b.appendChild(mk('span', '', label)); return b; }
  function mainTab(re, cb) {
    var t = [].filter.call(document.querySelectorAll('#pv-root .tqn-tabs > .tqn-tab'), function (x) { return re.test(txt(x)); })[0];
    if (!t) return;
    if (!t.classList.contains('is-on')) t.click();
    wait(function () { return t.classList.contains('is-on') && document.querySelector('#pv-root .tqn-cf'); }, function () { setTimeout(function () { apply(); if (cb) cb(); try { document.querySelector('#pv-root .tqn-tabs').scrollIntoView({ block: 'nearest' }); } catch (e) { void e; } }, 60); });
  }

  /* ── 4) العقود ── */
  function cInfo(s) {
    var ch = s.querySelector('.cf-chead, .fx-chead'), tr = s.querySelector('.fx-trio');
    var no = ch ? txt(ch.querySelector('.rq-no bdi')) : '';
    if (!no) no = title(s).replace(CT, '').split('·')[0].trim();
    var pills = ch ? [].map.call(ch.querySelectorAll('.fx-chead-s .t2-pill'), function (p) { return { t: txt(p), c: tone(p) }; }) : [];
    var st = pills.filter(function (p) { return !/عقد جديد|مرحّل|منقول/.test(p.t); })[0] || pills[pills.length - 1] || { t: count(s), c: '' };
    var left = '', pct = -1;
    if (tr) {
      [].forEach.call(tr.querySelectorAll('.fx-trio-i'), function (i) { if (/المتبقي/.test(txt(i.querySelector('span')))) left = txt(i.querySelector('b')); });
      var m = txt(tr.querySelector('.fx-trio-n') || tr).match(/(\d{1,3})\s*%/);
      if (m) pct = Math.min(100, +m[1]);
    }
    var lateV = 0; [].forEach.call(s.querySelectorAll('.fx-kpi'), function (q) { if (/^المتأخر$/.test(txt(q.querySelector('.fx-kpi-l')))) lateV = num(txt(q.querySelector('.fx-kpi-v'))); });
    if (lateV > 0 && !/متأخر|متعثر/.test(st.t)) st = { t: 'عليه متأخر', c: 'bad' };
    return { no: no, st: st, left: left, pct: pct, closed: /مغلق|ملغ|مكتمل/.test(st.t) && !(lateV > 0) };
  }
  function cCard(c) {
    var w = mk('span', 'tqn-cc');
    var top = mk('span', 'tqn-cc-top');
    top.appendChild(mk('bdi', 'tqn-cc-no', c.no));
    top.appendChild(mk('span', 'tqn-cc-st' + (c.st.c ? ' is-' + c.st.c : ''), c.st.t));
    w.appendChild(top);
    var ft = mk('span', 'tqn-cc-ft');
    ft.appendChild(mk('small', '', 'المتبقي'));
    ft.appendChild(mk('b', '', c.left || '—'));
    if (c.pct >= 0) ft.appendChild(mk('small', 'tqn-cc-pc', c.pct + '%'));
    w.appendChild(ft);
    if (c.pct >= 0) { var bb = mk('span', 'tqn-cc-bar'), i = mk('i'); i.style.width = c.pct + '%'; bb.appendChild(i); w.appendChild(bb); }
    return w;
  }
  function contractPicker(b, kids, who) {
    var info = kids.map(cInfo), key = who + '|C';
    var cur = ST[key]; if (!cur || !info.some(function (c) { return c.no === cur; })) {
      var open = info.filter(function (c) { return !c.closed; })[0]; cur = (open || info[0]).no;
    }
    /* v741: العقود المغلقة تُطوى خلف بطاقة واحدة حين تكثر — فلا تطول قائمة البطاقات قبل محتوى العقد */
    var shut = info.filter(function (c) { return c.closed && c.no !== cur; }), fold = shut.length >= 3, xk = key + '|x', ex = !!ST[xk];
    var vis = info.filter(function (c) { return !fold || ex || !c.closed || c.no === cur; });
    var items = vis.map(function (c) { return { k: c.no, n: c.st.t + c.left + c.pct, node: cCard(c) }; });
    if (fold) { var mo = mk('span', 'tqn-cc tqn-cc-more'); mo.appendChild(mk('b', '', ex ? 'إخفاء العقود المغلقة' : 'العقود المغلقة')); mo.appendChild(mk('small', '', ex ? '▴' : shut.length + ' عقود · ▾')); items.push({ k: '__more', n: ex ? 'x' : 'm', node: mo }); }
    if (kids.length > 1) bar(b, kids[0], items, cur, 'c', function (k) { if (k === '__more') { ST[xk] = !ex; return; } ST[key] = k; ST.__am = 0; });
    kids.forEach(function (s, i) { var on = info[i].no === cur; cls(s, 'tqn-st-hide', !on); cls(s, 'tqn-ct', true); quiet(head(s)); if (on) contract(s, who + '|' + info[i].no); });
    return cur;
  }
  /* إجراءات العقد كما تعطيها المنصة: [المفتاح، العنوان، الوصف، متاح، اللون] */
  function tilesOf(el) { var t = el ? jd(el.getAttribute('data-tiles')) : null; return Array.isArray(t) ? t : []; }
  function ctrTiles(stack) { var c = stack.querySelector('section.tqn-ct:not(.tqn-st-hide) [data-tiles]') || stack.querySelector('section.tqn-ct [data-tiles]'); return tilesOf(c); }
  function curCt() { return document.querySelector('#pv-root .tqn-cf section.tqn-ct:not(.tqn-st-hide)'); }
  /* تشغيل إجراء: يفتح «إجراء على العقد» ثم يختار المهمة من قائمة المنصة نفسها */
  function runAct(key) {
    mainTab(/العقود/, function () {
      var s = curCt();
      if (key && s) {
        var ok = tilesOf(s.querySelector('[data-tiles]')).some(function (t) { return t[0] === key && t[3]; });
        if (!ok) {
          var who = txt(document.querySelector('#pv-root .lx-hero h2, #pv-root .lx-hero h1'));
          var alt = [].filter.call(document.querySelectorAll('#pv-root section.tqn-ct'), function (x) { return tilesOf(x.querySelector('[data-tiles]')).some(function (t) { return t[0] === key && t[3]; }); })[0];
          if (alt) { var ci = cInfo(alt); ST[who + '|C'] = ci.no; apply(); s = alt; }
        }
      }
      openActs(s, key);
    });
  }
  function openActs(s, key) {
    if (!s) return;
    var pick = s.querySelector('.cf-act-pick');
    var go2 = function () {
      if (!key) return;
      var tl = tilesOf(s.querySelector('.cf-act-pick')).filter(function (t) { return t[0] === key; })[0]; if (!tl) return;
      pickTask(s, tl[1]);
    };
    if (pick) return go2();
    var a = s.querySelector('.cf-act'); if (!a || a.disabled) return;
    a.click();
    wait(function () { return s.querySelector('.cf-act-pick'); }, function () { apply(); go2(); setTimeout(function () { try { (s.querySelector('.tqn-am-h') || s).scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { void e; } }, 120); });
  }
  function pickTask(s, label) {
    var pk = s.querySelector('.cf-act-pick'); if (!pk) return;
    var b = pk.querySelector('.t2-cb-btn'); if (!b) return;
    if (txt(b.querySelector('.t2-cb-v')) === label) return;
    b.click();
    wait(function () { return [].filter.call(pk.querySelectorAll('.t2-cb-l > li'), function (li) { return txt(li) === label; })[0]; }, function (li) { li.click(); setTimeout(apply, 80); });
  }
  function pkBtn(s, re) { var pk = s && s.querySelector('.cf-act-pick'); return pk ? [].filter.call(pk.querySelectorAll('.t2-pb-actions button'), function (x) { return re.test(txt(x)); })[0] : null; }
  function amClose() {
    var s = curCt(); ST.__am = 0; if (!s) return;
    var c = pkBtn(s, /^إغلاق الإجراء$/);
    if (c) c.click(); else apply();
  }
  function amBack() {
    var s = curCt(); if (!s) return;
    var c = pkBtn(s, /^(قائمة الإجراءات|رجوع إلى الإجراءات)$/);
    if (c) c.click(); else amClose();
  }

  /* بطاقة رأس العقد: كل ما يخصّ العقد في مكان واحد بلا تكرار */
  function stat(l, v, s, t) {
    var x = mk('div', 'tqn-ch-s' + (t ? ' is-' + t : ''));
    x.appendChild(mk('small', '', l)); x.appendChild(mk('b', '', v)); if (s) x.appendChild(mk('span', '', s));
    return x;
  }
  /* مسار الدفعات من جدول السداد */
  function sched(b) {
    var tb = b.querySelector('.fx-table.cf-tb, .fx-table-w table'); if (!tb) return [];
    var out = [];
    [].forEach.call(tb.querySelectorAll('tbody tr, tr'), function (tr) {
      var td = tr.querySelectorAll('td'); if (td.length < 3) return;
      var c0 = txt(td[0]), n = (c0.match(/^\d+/) || [])[0], d = (c0.match(/\d{4}-\d{2}-\d{2}/) || [])[0] || '';
      if (!n) return;
      var pill = td[2].querySelector('.t2-pill, [class*="pill"]') || td[2], st = txt(pill), tn = tone(pill);
      var k = /مسد|مدفوع|مُعفى|معفى|مسوّ/.test(st) ? 'p' : /متأخر|متعثر/.test(st) || tn === 'bad' || tn === 'danger' ? 'l' : 'u';
      out.push({ n: n, d: d, a: num(txt(td[1])), s: st, k: k });
    });
    var nx = out.filter(function (x) { return x.k === 'u'; })[0]; if (nx) nx.k = 'n';
    return out;
  }
  function header(b, ch, tr, kp) {
    var S = sched(b);
    var sig = txt(ch) + '#' + txt(tr) + '#' + txt(kp) + '#' + S.map(function (x) { return x.n + x.k + x.s; }).join(',');
    var hd = b.__tqnCh;
    if (!(hd && hd.parentNode === b && hd.__sig === sig)) {
      var old = hd && hd.parentNode === b ? hd : null;
      hd = mk('div', 'tqn-ch'); hd.__sig = sig;
      var top = mk('div', 'tqn-ch-top');
      var ic = ch.querySelector('.fx-card-ic'); if (ic) top.appendChild(ic.cloneNode(true));
      var tt = mk('div', 'tqn-ch-tt');
      tt.appendChild(mk('h3', '', txt(ch.querySelector('.fx-chead-t > b'))));
      var ids = ch.querySelector('.rq-ids'); if (ids) { var ci = ids.cloneNode(true); ci.className = 'rq-ids tqn-ch-ids'; [].forEach.call(ci.children, function (x) { if (txt(x.querySelector('small')) === 'العقد' || /^العقد\s/.test(txt(x))) x.classList.add('tqn-hide'); }); tt.appendChild(ci); }
      var pl = ch.querySelector('.fx-chead-s'); if (pl) { var cp = pl.cloneNode(true); cp.className = 'tqn-ch-pl'; tt.appendChild(cp); }
      top.appendChild(tt);
      var side = mk('div', 'tqn-ch-side');
      side.appendChild(mk('div', 'tqn-ch-q'));
      side.appendChild(mk('div', 'tqn-ch-a'));
      top.appendChild(side);
      hd.appendChild(top);
      /* تنبيه المتأخرات */
      var lateS = S.filter(function (x) { return x.k === 'l'; }), lateV = 0;
      if (kp) [].forEach.call(kp.querySelectorAll('.fx-kpi'), function (q) { if (/^المتأخر$/.test(txt(q.querySelector('.fx-kpi-l')))) lateV = num(txt(q.querySelector('.fx-kpi-v'))); });
      if (lateS.length || lateV > 0) {
        var od = mk('div', 'tqn-od'); od.appendChild(mk('i', '', '!'));
        var ot = mk('div'); var n = lateS.length;
        ot.appendChild(mk('b', '', (n === 1 ? 'دفعة متأخرة' : n === 2 ? 'دفعتان متأخرتان' : n > 2 ? n + ' دفعات متأخرة' : 'مبلغ متأخر') + (lateV > 0 ? ' · ' + sar(lateV) : '')));
        if (n) ot.appendChild(mk('p', '', lateS.map(function (x) { return 'الدفعة ' + x.n + (x.d ? ' (' + x.d + ')' : '') + ' — ' + x.s; }).join('، ')));
        od.appendChild(ot); od.appendChild(mk('div', 'tqn-od-a'));
        hd.appendChild(od);
      }
      hd.appendChild(mk('div', 'tqn-ch-al'));
      /* مسار الدفعات */
      if (S.length) {
        var tl = mk('div', 'tqn-tl'), th = mk('div', 'tqn-tl-h');
        var paidN = S.filter(function (x) { return x.k === 'p'; }).length;
        th.appendChild(mk('b', '', 'مسار الدفعات')); th.appendChild(mk('span', '', paidN + ' من ' + S.length + ' مسدَّدة')); tl.appendChild(th);
        var st = mk('div', 'tqn-tl-s'); st.style.setProperty('--n', S.length);
        S.forEach(function (x) {
          var d = mk('div', 'tqn-tl-i is-' + x.k); d.title = 'الدفعة ' + x.n + ' · ' + x.d + ' · ' + x.s;
          d.appendChild(mk('span', 'tqn-tl-d', x.n)); d.appendChild(mk('b', '', x.a ? Math.round(x.a).toLocaleString('en-US') : '')); d.appendChild(mk('small', '', x.d ? x.d.slice(5) : ''));
          d.appendChild(mk('em', '', x.k === 'p' ? 'مسدَّدة' : x.k === 'l' ? 'متأخرة' : x.k === 'n' ? 'القادمة' : 'لاحقة'));
          st.appendChild(d);
        });
        tl.appendChild(st); hd.appendChild(tl);
      }
      var ks = mk('div', 'tqn-ch-k'), seen = {};
      if (tr) [].forEach.call(tr.querySelectorAll('.fx-trio-i'), function (i) { var l = txt(i.querySelector('span')); seen[l] = 1; ks.appendChild(stat(l, txt(i.querySelector('b')), '', tone(i))); });
      if (kp) [].forEach.call(kp.querySelectorAll('.fx-kpi'), function (k) {
        var l = txt(k.querySelector('.fx-kpi-l')); if (!l || seen[l] || SKIPK.test(l.replace(DIAC, '')) || (/^المتأخر$/.test(l) && hd.querySelector('.tqn-od'))) return; seen[l] = 1;
        ks.appendChild(stat(l, txt(k.querySelector('.fx-kpi-v')), txt(k.querySelector('.fx-kpi-s')), tone(k)));
      });
      hd.appendChild(ks);
      var br = tr && tr.querySelector('.fx-bar2');
      if (br && !S.length) { var pg = mk('div', 'tqn-ch-p'); var cb = br.cloneNode(true); cb.className = 'tqn-ch-bar'; pg.appendChild(cb); pg.appendChild(mk('span', '', txt(tr.querySelector('.fx-trio-n')))); hd.appendChild(pg); }
      if (old) {
        [].forEach.call(old.querySelectorAll('.tqn-ch-a > *'), function (n2) { hd.querySelector('.tqn-ch-a').appendChild(n2); });
        [].forEach.call(old.querySelectorAll('.tqn-ch-al > *'), function (n2) { hd.querySelector('.tqn-ch-al').appendChild(n2); });
        b.replaceChild(hd, old);
      } else b.insertBefore(hd, b.firstChild);
      b.__tqnCh = hd;
    }
    return hd;
  }
  /* أزرار العقد السريعة حسب ما تتيحه المنصة */
  function quick(hd) { [].forEach.call(hd.querySelectorAll('.tqn-ch-q, .tqn-od-a'), function (x) { if (x.children.length) x.textContent = ''; }); }
  /* صفحة الإجراءات */
  function actsPage(b, acts, hd) {
    var ab = body(acts), pk = ab.querySelector('.cf-act-pick'), fm = ab.querySelector('.cf-act-form');
    var T = tilesOf(pk), curL = pk ? txt(pk.querySelector('.t2-cb-v')) : '';
    var cur = T.filter(function (t) { return t[1] === curL; })[0];
    cls(b, 'tqn-am', true); cls(acts, 'tqn-am-sec', true); cls(acts, 'tqn-hide', false); cls(acts, 'tqn-st-hide', false); quiet(head(acts));
    cls(pk, 'tqn-hide', !!T.length);
    ST.__am = fm && cur ? cur[1] : 1;
    /* الرأس */
    var sig = (fm && cur ? cur[0] : 'list') + '|' + T.map(function (t) { return t[0] + (t[3] ? 1 : 0) + t[2]; }).join(',');
    var H = ab.__amH;
    if (!(H && H.parentNode === ab && H.__sig === sig)) {
      if (H && H.parentNode) H.parentNode.removeChild(H);
      var G = ab.__amG; if (G && G.parentNode) G.parentNode.removeChild(G); ab.__amG = null;
      H = mk('div', 'tqn-am-h'); H.__sig = sig;
      if (fm && cur) {
        H.appendChild(mk('span', 'tqn-am-ic is-' + (cur[4] || 'brand'), AIC[cur[0]] || '•'));
        var x = mk('div'); x.appendChild(mk('h2', '', cur[1])); if (cur[2]) x.appendChild(mk('p', '', cur[2])); H.appendChild(x);
        H.appendChild(btn('→ الرجوع إلى الإجراءات', '', amBack));
      } else {
        H.appendChild(mk('span', 'tqn-am-ic is-brand', '⚙'));
        var y = mk('div'); y.appendChild(mk('h2', '', 'إجراءات العقد')); y.appendChild(mk('p', '', 'اختر ما تريد فعله بالعقد — المتاح الآن بارز، وغير المتاح باهت مع سببه.')); H.appendChild(y);
        H.appendChild(btn('→ الرجوع إلى العقد', '', amClose));
      }
      ab.insertBefore(H, ab.firstChild); ab.__amH = H;
      if (!(fm && cur) && T.length) {
        G = mk('div', 'tqn-ag');
        var used = {};
        /* v748: إجراءات قليلة (4 فأقل) في صف واحد بلا تقسيم — فلا تبقى مجموعة ببطاقة وحيدة */
        if (T.length <= 4) { T.forEach(function (t) { used[t[0]] = 1; }); G.appendChild(groupEl('', T, b)); }
        else AG.forEach(function (g) {
          var L = T.filter(function (t) { return g[1].indexOf(t[0]) >= 0; }); if (!L.length) return;
          L.forEach(function (t) { used[t[0]] = 1; });
          G.appendChild(groupEl(g[0], L, b));
        });
        var rest = T.filter(function (t) { return !used[t[0]]; }); if (rest.length) G.appendChild(groupEl('أخرى', rest, b));
        ab.insertBefore(G, H.nextSibling); ab.__amG = G;
      }
    }
    cls(fm, 'tqn-am-form', !!fm);
  }
  function groupEl(name, L, b) {
    var g = mk('div', 'tqn-agr'); if (name) g.appendChild(mk('h4', '', name));
    var w = mk('div', 'tqn-agw');
    L.forEach(function (t) {
      var c = mk('button', 'tqn-a is-' + (t[4] || 'brand') + (t[3] ? '' : ' is-dis')); c.type = 'button'; c.setAttribute('data-live-ok', '');
      if (!t[3]) c.disabled = true;
      c.appendChild(mk('span', 'tqn-a-ic', AIC[t[0]] || '•')); c.appendChild(mk('b', '', t[1])); if (t[2]) c.appendChild(mk('small', '', t[2]));
      c.appendChild(mk('span', 'tqn-a-st', t[3] ? 'متاح' : 'غير متاح الآن'));
      c.addEventListener('click', function () { var s = b.closest('section.tqn-ct'); pickTask(s, t[1]); });
      w.appendChild(c);
    });
    g.appendChild(w); return g;
  }
  function contract(s, key) {
    var b = body(s); if (!b) return;
    var ch = b.querySelector(':scope > .cf-chead, :scope > .fx-chead'), tr = b.querySelector(':scope > .fx-trio'), kp = b.querySelector(':scope > .fx-kpis');
    var secs = secsOf(b), acts = secs.filter(function (x) { return ACTS.test(title(x)); })[0];
    cls(b, 'tqn-cb', true);
    var hd = ch ? header(b, ch, tr, kp) : null;
    var ab = acts ? body(acts) : null, am = !!(ab && ab.querySelector('.cf-act-pick'));
    if (hd) {
      var A = hd.querySelector('.tqn-ch-a'), AL = hd.querySelector('.tqn-ch-al');
      if (ab) {
        var fresh = [].slice.call(ab.querySelectorAll('.cf-act'));
        if (fresh.length) { A.textContent = ''; fresh.forEach(function (x) { A.appendChild(x); }); }
        var fn = [].slice.call(ab.querySelectorAll(':scope > .t2-note'));
        if (fn.length && !am) { [].forEach.call(AL.querySelectorAll(':scope > .tqn-fab'), function (x) { x.parentNode.removeChild(x); }); fn.forEach(function (x) { x.classList.add('tqn-fab'); AL.appendChild(x); }); }
      }
      [].forEach.call(b.querySelectorAll(':scope > .t2-note'), function (x) { AL.appendChild(x); });
      [ch, tr, kp].forEach(function (x) { cls(x, 'tqn-hide', true); });
      /* v747: لا يتكرر المبلغ المتأخر إن ذكرته ملاحظة المنصة نفسها */
      var od = hd.querySelector('.tqn-od'); if (od) { var amt = (txt(od.querySelector('b')).match(/\d[\d,]*(?= ر\.س)/) || [])[0]; cls(od, 'tqn-hide', !!amt && txt(AL).indexOf(amt) >= 0); }
      cls(AL, 'is-empty', !AL.children.length); cls(A, 'is-empty', !A.children.length);
      quick(hd, s, tilesOf(ab && ab.querySelector('[data-tiles]')));
    }
    if (am) { actsPage(b, acts, hd); return; }
    cls(b, 'tqn-am', false); if (acts) { cls(acts, 'tqn-am-sec', false); cls(acts, 'tqn-hide', true); }
    if (ab) { if (ab.__amH && ab.__amH.parentNode) ab.__amH.parentNode.removeChild(ab.__amH); if (ab.__amG && ab.__amG.parentNode) ab.__amG.parentNode.removeChild(ab.__amG); ab.__amH = ab.__amG = null; }
    if (ST.__am) ST.__am = 0;
    var list = secs.filter(function (x) { return x !== acts; });
    if (!list.length) return;
    var rank = function (x) { var t = title(x); for (var i = 0; i < ORDER.length; i++) if (ORDER[i].test(t)) return i; return ORDER.length; };
    list = list.map(function (x, i) { return { x: x, r: rank(x) * 100 + i }; }).sort(function (a, c) { return a.r - c.r; }).map(function (o) { return o.x; });
    var T = list.map(title);
    var cur = ST[key]; if (!cur || T.indexOf(cur) < 0) cur = T[0];
    var tb = bar(b, hd ? hd.nextSibling : list[0], list.map(function (x, i) { var n = count(x); return { k: T[i], t: short(T[i]), n: /^\d{1,3}$/.test(n) ? n : '' }; }), cur, 'k', function (k) { ST[key] = k; });
    cls(tb, 'tqn-o-tabs', true);
    list.forEach(function (x, i) {
      var on = T[i] === cur; cls(x, 'tqn-st-hide', !on); cls(x, 'tqn-cg', true);
      if (on) { quiet(head(x)); inner(x, key); }
    });
  }


  /* ── 7) v753–v755: العملاء الجدد · طلبات توثيق الملف · تدشين الحساب — بنفس لغة قسم العملاء ── */
  var PT = { 'العملاء الجدد': 'nc', 'طلبات توثيق الملف': 'vr', 'تدشين الحساب': 'lch' };
  function pageKey() { return PT[txt(document.getElementById('pv-title'))] || ''; }
  function pages(root) {
    var k = pageKey(), L = root.querySelector('.adm-live');
    [].forEach.call(root.querySelectorAll('.tqn-ncp, .tqn-axp'), function (x) { if (x !== L || !k) { cls(x, 'tqn-ncp', false); cls(x, 'tqn-axp', false); } });
    if (!L || !k) return;
    if (k === 'nc') newClients(L);
    else axTable(L, k);
  }
  /* لون الشارة من صنف حبة المنصة */
  function chipOf(el, t) { var c = tone(el); return mk('span', 'tqn-chip' + (c ? ' is-' + (c === 'danger' ? 'bad' : c === 'info' || c === 'brand' ? 'done' : c) : ''), t || txt(el)); }
  /* ملخص يصفّي: شرائح المنصة نفسها بطاقات أرقام (النقر يشغّل الشريحة الأصلية) */
  function sumTiles(chips, extra) {
    var IC = ['∑', '◷', '✓', '!', '↺', '∅'], sm = mk('div', 'tqn-sum');
    chips.forEach(function (c) {
      var n = txt(c.querySelector('small')) || (txt(c).match(/\d+\s*$/) || [''])[0].trim(), lb = txt(c).replace(new RegExp(n + '\\s*$'), '').trim();
      var tn = /معتمد|المدشّنة|مدشّن/.test(lb) ? 'ok' : /أُعيد|مرفوض|رُفض/.test(lb) ? 'bad' : /بانتظار|قيد|لم يُرسل/.test(lb) ? 'warn' : 'all';
      var b = mk('button', 'tqn-sm is-' + tn + (c.classList.contains('is-on') ? ' is-on' : '')); b.type = 'button'; b.setAttribute('data-live-ok', '');
      b.appendChild(mk('i', '', tn === 'ok' ? '✓' : tn === 'bad' ? '!' : tn === 'warn' ? '◷' : '∑'));
      var t = mk('span'); t.appendChild(mk('small', '', lb)); t.appendChild(mk('b', '', n || '0')); b.appendChild(t);
      b.addEventListener('click', function () { c.click(); soon(); }); sm.appendChild(b);
    });
    (extra || []).forEach(function (x) { var d = mk('div', 'tqn-sm is-info'); d.appendChild(mk('i', '', x[2] || '★')); var t = mk('span'); t.appendChild(mk('small', '', x[0])); t.appendChild(mk('b', '', x[1])); d.appendChild(t); sm.appendChild(d); });
    sm.style.setProperty('--n', String(chips.length + (extra || []).length));
    void IC; return sm;
  }
  function who(name, sub) { var w = mk('div', 'tqn-who'); w.appendChild(mk('i', '', String(name || '؟').replace(/[ﹰ-﻿]/g, function (ch) { return ch.normalize ? ch.normalize('NFKC') : ch; }).slice(0, 1))); var s = mk('span'); s.appendChild(mk('b', '', name || '—')); if (sub) s.appendChild(mk('small', '', sub)); w.appendChild(s); return w; }
  function axTable(L, k) {
    cls(L, 'tqn-axp', true); cls(L, 'is-' + k, true);
    var rows = [].slice.call(L.querySelectorAll('article.cu-bd-r')).filter(function (r) { return !(r.hidden || r.style.display === 'none'); });
    var chips = [].slice.call(L.querySelectorAll('.st-chip'));
    var list = rows.length ? rows[0].parentNode : null, tools = L.querySelector('.adm-tools, .ax-tools');
    var extra = [];
    if (k === 'lch') [].forEach.call(L.querySelectorAll('.cu-kpi'), function (q) { var l = txt(q.querySelector('small')), v = txt(q.querySelector('b')); if (/الافتراضي|الافتراضية/.test(l)) extra.push([l, v, /نقاط/.test(l) ? '◆' : '♛']); });
    var sig = k + '|' + rows.map(function (r) { return txt(r); }).join('|') + '#' + chips.map(function (c) { return txt(c) + (c.classList.contains('is-on') ? 1 : 0); }).join(',') + '#' + extra.join(',');
    var W = L.__tqnAx, SM = L.__tqnSm;
    if (W && L.contains(W) && W.__sig === sig && (!chips.length || (SM && L.contains(SM)))) return;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    if (SM && SM.parentNode) SM.parentNode.removeChild(SM);
    W = mk('div', 'tqn-clw tqn-axw is-' + k); W.__sig = sig;
    if (chips.length && tools) { SM = sumTiles(chips, extra); cls(SM, 'tqn-axs', true); tools.parentNode.insertBefore(SM, tools); L.__tqnSm = SM; [].forEach.call(L.querySelectorAll('.st-chips-w'), function (x) { cls(x, 'tqn-hide', true); }); }
    var T = mk('div', 'tqn-lt is-' + k);
    var H = k === 'vr' ? ['صاحب الملف', 'النوع', 'الحالة', 'أُرسل', 'البنود', 'المسؤول', ''] : ['العميل', 'الحالة', 'المستوى', 'النقاط', 'تاريخ التدشين', ''];
    var hr = mk('div', 'tqn-ar is-h'); H.forEach(function (h) { hr.appendChild(mk('span', '', h)); }); T.appendChild(hr);
    rows.forEach(function (r) {
      var go = r.querySelector('.nr-main') || r, x = mk('div', 'tqn-ar'); x.setAttribute('role', 'button'); x.tabIndex = 0;
      if (k === 'vr') {
        var F = {}; [].forEach.call(r.querySelectorAll('.adm-cm-i'), function (i) { F[txt(i.querySelector('small'))] = i.querySelector(':scope > span'); });
        var role = txt(F['الدور']);
        x.appendChild(who(txt(r.querySelector('.adm-nm b, .adm-ct')), role && role !== 'عميل' ? role : ''));
        var tp = F['نوع العميل'] && F['نوع العميل'].querySelector('.t2-pill'); x.appendChild(tp ? chipOf(tp, /منقول/.test(txt(tp)) ? 'منقول' : txt(tp)) : mk('span', 'is-mut', '—'));
        var sp = F['الحالة'] && F['الحالة'].querySelector('.t2-pill'); x.appendChild(sp ? chipOf(sp) : mk('span', '', txt(F['الحالة']) || '—'));
        x.appendChild(mk('bdi', 'tqn-dt', txt(F['أُرسل']) || '—'));
        var BT = txt(F['البنود']), ok = num((BT.match(/(\d+)\s*مطابق/) || [])[1]), bad = num((BT.match(/(\d+)\s*غير مطابق/) || [])[1]), pd = num((BT.match(/(\d+)\s*بانتظار/) || [])[1]), all = ok + bad + pd;
        var pc = mk('div', 'tqn-vb');
        var tl = mk('b', '', all ? ok + ' / ' + all : '—'); if (bad) tl.appendChild(mk('em', 'is-bad', ' · ' + bad + ' غير مطابق')); else if (pd && !ok) tl.appendChild(mk('em', 'is-mut', ' · بانتظار المطابقة'));
        pc.appendChild(tl);
        var mb = mk('span', 'tqn-mb is-3'); [[ok, 'm'], [bad, 'x'], [pd, 'p']].forEach(function (s) { if (!all || !s[0]) return; var i = mk('i', 'is-' + s[1]); i.style.width = (s[0] / all * 100) + '%'; mb.appendChild(i); }); pc.appendChild(mb);
        x.appendChild(pc);
        var ow = txt(F['المسؤول']); x.appendChild(mk('span', 'tqn-ow' + (/غير مُسند|غير مسند/.test(ow) ? ' is-mut' : ''), ow || '—'));
      } else {
        var nm = txt(r.querySelector('.ax-r-b > b')), ln = txt(r.querySelector('.ax-r-b > span'));
        var pr = ln.split('—'), id = (pr[1] || '').trim(), tk = (pr[0] || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean);
        var st = tk[0] || '—', tier = tk.filter(function (s) { return /^تيرا/.test(s); })[0] || '—', pts = tk.filter(function (s) { return /نقطة/.test(s); })[0] || '—', dt = tk.filter(function (s) { return /\d{4}-\d{2}-\d{2}/.test(s); })[0] || '—';
        x.appendChild(who(nm, id));
        x.appendChild(mk('span', 'tqn-chip ' + (/مُدشَّن|مدشّن|مدشن/.test(st) ? 'is-ok' : 'is-warn'), st));
        x.appendChild(mk('span', 'tqn-tier', tier));
        x.appendChild(mk('b', '', pts.replace(/\s*نقطة/, '')));
        x.appendChild(mk('bdi', 'tqn-dt', dt));
      }
      var ac = mk('div', 'tqn-acts'); ac.appendChild(btn('عرض', 'is-pri is-sm', function () { go.click(); })); x.appendChild(ac);
      x.addEventListener('click', function () { go.click(); });
      x.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') go.click(); });
      T.appendChild(x);
    });
    if (rows.length) { W.appendChild(T); W.appendChild(mk('div', 'tqn-lf', 'عرض ' + rows.length + (k === 'vr' ? ' طلب' : ' حساب'))); }
    if (list) cls(list, 'tqn-hide', true);
    if (tools) tools.parentNode.insertBefore(W, tools.nextSibling); else if (list) list.parentNode.insertBefore(W, list); else L.appendChild(W);
    L.__tqnAx = W;
    /* لوحة المنصة: عنوانها مكرّر مع عنوان الصفحة */
    var ph = L.querySelector('.t2-panel > .t2-panel-h'); cls(ph, 'tqn-hide', !!ph);
  }
  /* العملاء الجدد: مسار المرحلة · شريط التذكير والتصفية · أرقام · جدول بمتابعة كل عميل */
  function newClients(L) {
    cls(L, 'tqn-ncp', true);
    var info = [].filter.call(L.children, function (c) { return c.matches('.t2-note.is-info') && /دورة العميل الجديد/.test(txt(c)); })[0];
    var steps = info ? txt(info.querySelector('.t2-note-b')).split('.')[0].split('←').map(function (s) { return s.trim(); }).filter(Boolean) : [];
    if (info) cls(info, 'tqn-hide', true);
    var J = L.__tqnJ;
    if (steps.length && (!J || J.parentNode !== L)) {
      J = mk('div', 'tqn-jr'); J.appendChild(mk('b', 'tqn-jr-t', 'مسار العميل الجديد'));
      var ol = mk('ol'); steps.forEach(function (s, i) { var li = mk('li'); li.appendChild(mk('i', '', String(i + 1))); li.appendChild(mk('span', '', s)); ol.appendChild(li); }); J.appendChild(ol);
      L.insertBefore(J, L.firstChild); L.__tqnJ = J;
    }
    /* التذكير الآلي: حالته شارة، والشرح سطر صغير */
    var rem = [].filter.call(L.children, function (c) { return c.querySelector(':scope > .t2-note.is-warn, :scope > .t2-note.is-ok, :scope > .t2-note.is-info') && c.querySelector('.cu-bd-form'); })[0];
    if (rem) {
      cls(rem, 'tqn-nc-rem', true);
      var nt = rem.querySelector(':scope > .t2-note'), tt = nt && nt.querySelector('.t2-note-t');
      if (tt && !tt.__tqn) { var m = txt(tt).match(/^(.*?):\s*(.+)$/); if (m) { tt.textContent = ''; tt.appendChild(document.createTextNode(m[1])); tt.appendChild(mk('span', 'tqn-chip ' + (/موقوف|متوقف/.test(m[2]) ? 'is-warn' : 'is-ok'), m[2])); } tt.__tqn = 1; }
    }
    [].forEach.call(L.querySelectorAll(':scope > .cu-bd-form'), function (f) { cls(f, 'tqn-nc-flt', true); });
    var acts = L.querySelector(':scope > .t2-pb-actions'); cls(acts, 'tqn-nc-act', !!acts);
    cls(L.querySelector(':scope > .cu-kpis'), 'tqn-nc-k', true);
    var gl = L.querySelector(':scope > .nr-gl');
    if (gl) {
      cls(gl, 'tqn-nc-gl', true);
      var hd = gl.__tqnH;
      if (!hd || hd.parentNode !== gl) { hd = mk('div', 'tqn-nc-h'); ['العميل', 'سجّل في', 'المرحلة', 'المدة', ''].forEach(function (h) { hd.appendChild(mk('span', '', h)); }); gl.insertBefore(hd, gl.firstChild); gl.__tqnH = hd; }
      [].forEach.call(gl.querySelectorAll(':scope > article.nr'), function (a) {
        var ic = a.querySelector('.nr-ic'), nm = txt(a.querySelector('.nr-top b'));
        if (ic && !ic.__tqn) { ic.textContent = ''; ic.appendChild(mk('i', '', String(nm || '؟').normalize ? String(nm || '؟').normalize('NFKC').slice(0, 1) : '؟')); ic.__tqn = 1; }
        cls(a, 'has-fu', !!a.querySelector('.nr-fu'));
      });
    }
  }
  /* صفحات التفاصيل (لوحة بعرض المحتوى): مسار واحد بأسماء القائمة الجانبية بدل «قسم العملاء › الملف الشخصي» */
  function drHead(d) {
    /* تفاصيل التدشين: العنوان اسم العميل لا اسم الصفحة (اسم الصفحة في المسار) */
    var b = d.querySelector('.cu-dr-h > div > b'), sp = d.querySelector('.cu-dr-h > div > span');
    if (!b || !sp || b.__tqn) return;
    var t = txt(b), parts = txt(sp).split('·').map(function (x) { return x.trim(); }).filter(Boolean);
    if (/^تدشين الحساب$/.test(t) && parts.length >= 2) { b.textContent = parts[0]; sp.textContent = [t].concat(parts.slice(1)).join(' · '); b.__tqn = 1; }
  }
  function drCrumbs() {
    [].forEach.call(document.querySelectorAll('.cu-dh .cu-dr.is-page'), function (d) {
      var nv = d.querySelector('.cu-dr-nav'), src = nv && nv.querySelector('.t2-crumbs'); if (!src) return;
      var li = [].slice.call(src.querySelectorAll('.t2-crumb-li'));
      var T = li.map(function (l) { return txt(l); });
      if (!T.some(function (t) { return /^قسم العملاء$/.test(t); })) return;
      cls(d, 'tqn-dr-cu', true); drHead(d);
      var L = [];
      li.forEach(function (l, i) {
        var t = T[i]; if (/^الملف الشخصي$/.test(t)) return;
        var a = l.querySelector('button, a');
        if (/^قسم العملاء$/.test(t)) L.push({ t: 'العملاء', grp: 1 });
        else L.push({ t: t, home: /^الرئيسية$/.test(t), go: a && i < li.length - 1 ? function () { a.click(); } : null });
      });
      /* آخر المسار يكرّر اسم الصفحة؟ اسم صاحبه بدلًا منه */
      if (L.length >= 2 && L[L.length - 1].t === L[L.length - 2].t) { var hb = txt(d.querySelector('.cu-dr-h > div > b')); if (hb && hb !== L[L.length - 1].t) L[L.length - 1] = { t: hb }; else L.pop(); }
      var sig = L.map(function (x) { return x.t + (x.go ? '*' : ''); }).join('›'), mine = nv.__tqnCr;
      cls(src, 'tqn-hide', true); cls(nv.querySelector(':scope > .t2-back'), 'tqn-hide', true);
      if (!(mine && mine.parentNode === nv && mine.__sig === sig)) {
        if (mine && mine.parentNode) mine.parentNode.removeChild(mine);
        mine = mk('nav', 'tqn-cr is-dr'); mine.setAttribute('aria-label', 'المسار'); mine.__sig = sig;
        var ol = mk('ol', 'tqn-cr-ol');
        L.forEach(function (x, i) {
          var last = i === L.length - 1, it = mk('li', 'tqn-cr-li' + (x.home ? ' is-home' : '') + (x.grp ? ' is-grp' : '')), el;
          if (!last && x.go) { el = mk('button', 'tqn-cr-a'); el.type = 'button'; el.setAttribute('data-live-ok', ''); el.addEventListener('click', function () { var f = (mine.__L[i] || {}).go; if (f) f(); }); }
          else { el = mk('span', last ? 'tqn-cr-c' : 'tqn-cr-t'); if (last) el.setAttribute('aria-current', 'page'); }
          if (x.home) el.appendChild(mk('span', 'tqn-cr-h'));
          el.appendChild(mk('span', 'tqn-cr-l', x.t)); it.appendChild(el); ol.appendChild(it);
        });
        mine.appendChild(ol); nv.appendChild(mine); nv.__tqnCr = mine;
      }
      mine.__L = L;
      vrPage(d); lchPage(d);
    });
  }
  /* تفاصيل طلب التوثيق: بطاقات للأقسام المكتملة، والبنود صفوف (البند · القيمة · الحالة · الإجراء)، والسبب المكرّر مرة واحدة للقسم */
  function vrPage(d) {
    var v = d.querySelector('.vr3'); if (!v) return; cls(v, 'tqn-vr3', true);
    var H = txt(d.querySelector('.cu-dr-h'));
    [].forEach.call(v.querySelectorAll('.vr3-kvs > .vr3-kv'), function (kv) { var val = txt(kv.querySelector(':scope > :not(small)')); cls(kv, 'tqn-hide', !!val && val.length > 1 && H.indexOf(val) >= 0); });
    [].forEach.call(v.querySelectorAll(':scope > section.vr3-sec'), function (s) {
      cls(s, 'tqn-vr-dec', !!s.querySelector(':scope > .vr3-tabs'));
      var g = s.querySelector(':scope > .vr3-grid'); if (!g) return;
      [].forEach.call(g.querySelectorAll(':scope > .vr3-it > .vr3-acts'), function (a) { cls(a, 'tqn-hide', !a.children.length); });
      var W = [].slice.call(g.querySelectorAll(':scope > .vr3-it > .vr3-why')), T = W.map(txt);
      var same = W.length >= 2 && T.every(function (t) { return t === T[0]; });
      W.forEach(function (w) { cls(w, 'tqn-hide', same); });
      var B = s.__tqnWhy;
      if (same) {
        if (!(B && B.parentNode === s && B.__t === T[0])) {
          if (B && B.parentNode) B.parentNode.removeChild(B);
          B = mk('div', 'tqn-vr-why'); B.__t = T[0];
          B.appendChild(mk('b', '', 'سبب عدم المطابقة — لكل البنود (' + W.length + ')'));
          B.appendChild(mk('span', '', T[0].replace(/^السبب:\s*/, '').replace(/\s+/g, ' ')));
          s.insertBefore(B, g); s.__tqnWhy = B;
        }
      } else if (B && B.parentNode) B.parentNode.removeChild(B);
    });
  }
  /* تفاصيل التدشين: البطاقة بجانب حقائق التدشين، ولا تكرار لما في البطاقة (رقم العضوية · البطاقة الممنوحة · اسم العميل) */
  function lchPage(d) {
    var b = d.querySelector('.cu-dr-b'); if (!b) return;
    var card = b.querySelector(':scope > .lch-mc'); cls(b, 'tqn-lchd', !!card);
    /* قبل التدشين: الخطوات أعلى الصفحة ثم عمودان (البطاقة وقرار التدشين والملف · الفيلم) */
    cls(b, 'tqn-lchp', !!b.querySelector(':scope > .lch-grid'));
    [].forEach.call(b.querySelectorAll('section.cu-ds'), function (s) { cls(s, 'tqn-ds', true); });
    if (!card) return;
    [].forEach.call(b.querySelectorAll('section.cu-ds .t2-desc > .t2-field'), function (f) { cls(f, 'tqn-hide', /^(رقم العضوية|البطاقة الممنوحة|العميل)$/.test(txt(f.querySelector('.t2-field-k')))); });
    [].forEach.call(b.querySelectorAll('section.cu-ds .t2-desc > .t2-field'), function (f) { cls(f, 'is-wide', /^ملاحظة$/.test(txt(f.querySelector('.t2-field-k')))); });
  }
  /* ── 5) محتوى القسم ── */
  function isRecs(nested) {
    var forms = nested.filter(function (n) { return /^تسجيل/.test(title(n)); });
    var recs = nested.filter(function (n) { return forms.indexOf(n) < 0; });
    var w0 = recs.length ? word(title(recs[0])) : '';
    return recs.length && recs.every(function (n) { return word(title(n)) === w0; }) && (recs.length >= 2 || forms.length) ? { recs: recs, forms: forms } : null;
  }
  function rCard(t, n, add) {
    var w = mk('span', 'tqn-rc' + (add ? ' is-add' : ''));
    if (add) w.appendChild(mk('span', 'tqn-rc-plus', '+'));
    var x = mk('span', 'tqn-rc-x'); x.appendChild(mk('b', '', t));
    if (n) { var sm = mk('small'); String(n).split('·').forEach(function (p, i) { p = p.trim(); if (!p) return; if (i) sm.appendChild(document.createTextNode(' · ')); if (/^[A-Za-z0-9][\w\-\/.]*$/.test(p)) { var bd = mk('bdi', '', p); bd.dir = 'ltr'; sm.appendChild(bd); } else sm.appendChild(document.createTextNode(p)); }); x.appendChild(sm); }
    w.appendChild(x);
    return w;
  }
  function records(b, R, key) {
    var all = R.recs.concat(R.forms), T = all.map(title);
    var cur = ST[key];
    if (ST.__want) { var wi = T.filter(function (t) { return ST.__want.test(t); })[0]; if (wi) { cur = ST[key] = wi; ST.__want = null; } }
    if (!cur || T.indexOf(cur) < 0) cur = T[0];
    bar(b, all[0], all.map(function (n, i) { var add = R.forms.indexOf(n) >= 0; return { k: T[i], n: count(n) + (add ? '+' : ''), node: rCard(T[i], add ? '' : count(n), add) }; }), cur, 'r', function (k) { ST[key] = k; });
    all.forEach(function (n, i) {
      var on = T[i] === cur; cls(n, 'tqn-st-hide', !on); cls(n, 'tqn-rec', true);
      if (!on) return;
      quiet(head(n)); inner(n, key);
      /* v746: التفاصيل لا تكرّر ما في بطاقة الاختيار (المبلغ · التاريخ · العقد · الحالة) */
      var C = T[i] + ' ' + count(n);
      if (R.forms.indexOf(n) < 0) [].forEach.call(n.querySelectorAll('.t2-field'), function (f) { var v = txt(f.querySelector('.t2-field-v')); cls(f, 'tqn-hide', !!v && v.length > 2 && C.indexOf(v) >= 0); });
    });
  }
  function dedupK(sec) {
    var b = body(sec), t = title(sec), n = count(sec); if (!b) return;
    [].forEach.call(b.querySelectorAll(':scope > .fx-kpis > .fx-kpi'), function (k) {
      var l = txt(k.querySelector('.fx-kpi-l')), v = txt(k.querySelector('.fx-kpi-v'));
      cls(k, 'tqn-hide', !!l && l === t && (!n || v === n));
    });
  }
  function inner(sec, key) {
    var b = body(sec); if (!b) return;
    dedupK(sec);
    var kids = [].filter.call(b.children, function (k) { return !k.matches('.tqn-st'); });
    var nested = secsOf(b);
    if (nested.length >= 2) {
      var R = isRecs(nested);
      if (R) { records(b, R, (key || '') + '|' + title(sec)); return; }
      cls(b, 'tqn-g2', true);
      nested.forEach(function (n) { cls(n, 'tqn-w', !!n.querySelector('.fx-table-w, table, .tl-h') || /^تسجيل/.test(title(n))); });
    } else if (kids.length === 2 && !kids.some(function (k) { return k.matches('.fx-kpis, .cu-dr-hint, .fx-table-w, .tl-h, .t2-note'); })) cls(b, 'tqn-g2s', true);
    if (nested.length === 1 && title(nested[0]) === title(sec)) quiet(head(nested[0]));
  }

  /* ── 6) ملف العميل ── */
  function file(root) {
    var h = root.querySelector('.lx-hero'), tabs = root.querySelector('.tqn-tabs');
    if (!h || !tabs) {
      ST.__curC = ''; ST.__am = 0;
      /* v750: خرجنا من الملف بخدمة فيه (لا من القائمة أو المسار) — الرجوع يعود إلى الملف */
      if (ST.__inFile && !ST.__navU && !root.querySelector('.t2-skel, .lv-loading')) ST.from = ST.__inFile;
      if (ST.__inFile) { ST.__inFile = null; ST.__navU = 0; }
      return;
    }
    var stack = tabs.parentNode; cls(stack, 'tqn-cf', true);
    /* v746: «العقود» بدل «العقود والدفعات» */
    [].forEach.call(tabs.querySelectorAll('.tqn-tab'), function (t) { if (txt(t) === 'العقود والدفعات') t.textContent = 'العقود'; });
    var who = txt(h.querySelector('h1, h2')) || 'file';
    ST.from = null; ST.__navU = 0;
    try { ST.__inFile = window.TQN_CF ? { who: who, pfc: window.TQN_CF.pfc() } : null; } catch (e) { ST.__inFile = null; }
    try { hero(h, who); } catch (e) { void e; }
    var tab = txt(tabs.querySelector('.is-on, [aria-pressed="true"]'));
    var HT = txt(h);
    [].forEach.call(stack.querySelectorAll(':scope > section.t2-sec > .t2-sec-b > .cf-kpis'), function (k) {
      var hits = 0; k.querySelectorAll('.fx-kpi-l, small').forEach(function (x) { var t = txt(x); if (t.length > 2 && HT.indexOf(t) >= 0) hits++; });
      cls(k, 'tqn-dup-k', hits >= 2);
    });
    var top = secsOf(stack).filter(function (s) { return !s.matches('.cf-nts'); }), key = who + '|' + tab, curC = '';
    var items = [];
    top.forEach(function (s) {
      var b = body(s), nested = secsOf(b);
      var loose = b ? [].filter.call(b.children, function (k) { return !k.matches('section.t2-sec, .tqn-st'); }) : [];
      var allC = nested.length && nested.every(function (k) { return CT.test(title(k)); });
      if (nested.length >= 2 && !loose.length && !allC && !isRecs(nested)) nested.forEach(function (n) { items.push({ k: title(s) + '›' + title(n), t: title(n), n: count(n), top: s, sub: n }); });
      else items.push({ k: title(s), t: title(s), n: count(s), top: s });
    });
    items.forEach(function (it) { if (/^تحويلات تيرا/.test(it.t) && /^\d+$/.test(it.n)) { ST.X = ST.X || {}; ST.X[who] = +it.n; } });
    var cur = ST[key]; if (!cur || !items.some(function (it) { return it.k === cur; })) cur = items.length ? items[0].k : '';
    var sel = items.filter(function (it) { return it.k === cur; })[0];
    if (items.length >= 2) bar(stack, top[0], items.map(function (it) { return { k: it.k, t: it.t === 'التواصل' && /البيانات/.test(tab) ? 'بيانات الاتصال' : it.t, n: /^[\d,٬]{1,6}$/.test(it.n) || /^\S{1,8}$/.test(it.n) ? it.n : '' }; }), cur, 's', function (k) { ST[key] = k; });
    top.forEach(function (s) {
      cls(s, 'tqn-top', true);
      var on = !sel || sel.top === s; cls(s, 'tqn-st-hide', items.length >= 2 && !on);
      if (items.length >= 2 || secsOf(body(s)).length) quiet(head(s));
      if (!on) return;
      var b = body(s), kids = secsOf(b);
      if (sel && sel.sub) {
        cls(b, 'tqn-g2', false);
        kids.forEach(function (n) { cls(n, 'tqn-st-hide', n !== sel.sub); cls(n, 'tqn-one', n === sel.sub); });
        quiet(head(sel.sub)); inner(sel.sub, key);
      } else if (kids.length && kids.every(function (k) { return CT.test(title(k)); })) curC = contractPicker(b, kids, who);
      else inner(s, key);
    });
    ST.__curC = /العقود/.test(tab) ? curC : '';
    if (!ST.__curC) ST.__am = 0;
    try { topBuild(stack, h, who); } catch (e) { void e; }
    /* لا تكرار: الاسم ظاهر في بطاقة العميل */
    if (/البيانات/.test(tab)) [].forEach.call(stack.querySelectorAll('.t2-field'), function (f) { var v = txt(f.querySelector('.t2-field-v')); cls(f, 'tqn-hide', !!v && v === who); });
    if (stack.style.minHeight) stack.style.minHeight = '';
    cls(stack, 'tqn-ws', false);
  }
  function dups(root) {
    var ph = document.querySelector('#pv-host .t2-phead-t'), pt = txt(ph);
    if (pt) {
      var first = root.querySelector('.ax-top-t > b, .t2-panel > .t2-panel-h .t2-group-t, .t2-stack > section.t2-sec:first-of-type > .t2-sec-h .t2-group-t');
      if (first && txt(first) === pt) cls(first.closest('.t2-panel-h') || first, 'tqn-dup-t', true);
    }
    root.querySelectorAll('.adm-kpis, .cu-kpis').forEach(function (k) {
      var scope = k.parentNode, chips = scope && scope.querySelector('.st-chips-w');
      if (!chips) return;
      var C = txt(chips), hits = 0;
      k.querySelectorAll('small, .adm-kpi-t, span').forEach(function (s) { var t = txt(s); if (t && t.length > 2 && C.indexOf(t) >= 0) hits++; });
      cls(k, 'tqn-dup-k', hits >= 2);
    });
  }
  function apply() {
    busy = false;
    var root = document.querySelector('#pv-root'); if (!root) return;
    try { list(root); } catch (e) { void e; }
    try { file(root); } catch (e) { void e; }
    try { dups(root); } catch (e) { void e; }
    try { pages(root); } catch (e) { void e; }
    try { drCrumbs(); } catch (e) { void e; }
    try { crumbs(); } catch (e) { void e; }
  }
  function soon() { if (busy) return; busy = true; var t = setTimeout(apply, 80); if (window.requestAnimationFrame) requestAnimationFrame(function () { clearTimeout(t); if (busy) apply(); }); }
  try { new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) { void e; }
  try { window.addEventListener('resize', soon); } catch (e) { void e; }
  /* v750: التنقّل من القائمة الجانبية أو المسار أو الهيدر يُنهي «فُتح من ملف العميل» */
  try { document.addEventListener('click', function (ev) { var t = ev.target; if (t && t.closest && t.closest('.tqn-nav, .tqn-cr, #pv-host .t2-head, .t2-head')) { ST.__navU = 1; if (!t.closest('.tqn-cr-bk')) ST.from = null; if (!t.closest('.tqn-cr')) ST.fromNc = false; } if (t && t.closest && t.closest('#pv-root .tqn-nc-gl > article.nr > .nr-main')) ST.fromNc = true; }, true); } catch (e) { void e; }
  soon();
})();
