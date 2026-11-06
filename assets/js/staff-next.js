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
      ['cu-docs-sq', 'عروض المتاجر', ['cu']]
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
    'cu-svc': 'clipboard-text', 'cu-docs-pq': 'file-text', 'cu-docs-pc': 'handshake', 'cu-docs-sq': 'storefront',
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
