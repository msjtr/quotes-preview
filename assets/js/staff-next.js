/* v702–v804 — المنصة الجديدة للموظفين (staff/next/)
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
      ['cu-pf-req', 'طلبات تحديث الملف', ['cu']],
      ['cu-pf-launch', 'تدشين الحساب', ['cu']],
      ['cu-mem', 'العضويات والنقاط', ['cu']]
    ]],
    ['أمن العملاء', [
      ['cu-secc', 'مركز الأمن', ['cu']],
      ['cpg', 'صفحة العميل', ['cu']]
    ]],
    ['الطلبات والعقود', [
      ['cu-svc', 'طلبات الخدمات', ['cu']],
      ['cu-inbox', 'طلبات المتجر', ['cu']],
      ['cu-docs-pq', 'عروض الشركاء', ['cu']],
      ['cu-docs-pc', 'عقود العملاء', ['cu']],
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
    /* v814: «التواصل» بنود مباشرة لكل عمل — بلا «كل صفحات التواصل» (كانت تكرّر مركز الإرسال والتذاكر وتجربة العملاء)، و«تقرير الإرسال» تبويب داخل «مركز الإرسال» */
    ['التواصل', [
      ['comm-send', 'مركز الإرسال', ['comm-hub']],
      ['comm-rem', 'التذكير', ['comm-hub']],
      ['cs-tickets', 'التذاكر والمراسلات', ['comm-hub']],
      ['comm-dir', 'جهات الاتصال', ['comm-hub']],
      ['cx', 'تجربة العملاء', ['comm-hub']]
    ]],
    ['الفريق والشركاء', [['team-hub', 'الفريق والشركاء', ['team-hub']]]],
    ['الإعدادات', [['sys', 'إعدادات النظام', ['sys']], ['fin-fee', 'الرسوم والضرائب', ['fin']], ['pay-center', 'إعدادات الدفع', ['fin']]]]
  ];

  /* اسم بديل للقسم نفسه في القائمة الأصلية (المفتاح القديم للقسم ذاته فقط) */
  var ALIAS = { 'comm-hub': ['comm-hub', 'comm'] };

  /* الصفحة الفرعية ← أقرب بند في الشجرة (من سجل صفحات المنصة) — لتمييز البند الحالي فقط */
  var UP = {
    'cu-file': 'cu-list', 'cu-pf-files': 'cu-list', 'cu-pf-file': 'cu-list', 'cu-pf': 'cu-list',
    'cu-pf-req': 'cu-list', 'cu-pf-mig': 'cu-pf-ver', 'cu-pf-acct': 'cu-list', 'cu-inbox': 'cu-list', 'cu-mem': 'cu-list',
    'cu-comms': 'cu-list', 'cu-acc': 'cu-list', 'cu-secc': 'cu-list', 'cu-sx-sess': 'cu-secc', 'cu-sx-reccode': 'cu-secc',
    'cu-sx-totp': 'cu-secc', 'cu-sx-mail': 'cu-secc', 'cu-wa-pins': 'cu-secc', 'cu-2fa': 'cu-secc',
    'cu-mon-activity': 'cu-secc', 'cu-mon-alerts': 'cu-secc', 'cu-mon-sens': 'cu-secc', 'cu-mon-sec': 'cu-secc',
    'cu-mon-dev': 'cu-secc', 'cu-mon-live': 'cu-secc', 'cu-audit': 'cu-secc', 'cpg': 'cu-list', 'cpg-access': 'cpg',
    'cpg-log': 'cpg', 'cs': 'cu-list', 'cs-customers': 'cu-list', 'cs-customer': 'cu-list',
    'cs-updates': 'cu-list', 'cs-devices': 'cu-list', 'cs-requests': 'cu-svc', 'cs-complaints': 'cs-tickets',
    'cu-docs-cq': 'cu-docs-sq', 'cu-docs-si': 'cu-docs-sq', 'ctr': 'cu-list',
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
  ['cu-admx-rp', [['cu-admx-rp', 'تقرير العملاء'], ['cu-admx-fee', 'الرسوم والإيراد']]],
  ['comm-send', [['comm-send', 'الإرسال'], ['comm-rep', 'تقرير الإرسال']]]
];
/* سجل السداد حسب الطريقة — اختيارات داخل التبويب نفسه */
var RECV = [['gw', 'عبر بوابة الدفع'], ['tr', 'تحويل بنكي'], ['cash', 'نقدًا'], ['settle', 'سداد قيمة المنتج'], ['merge', 'توحيد'], ['defer', 'تأجيل'], ['waive', 'إعفاء فرق'], ['round', 'فرق تقريب'], ['oth', 'بلا طريقة مسجّلة']];
  

  /* v703: بلاطة ثلاثية الأبعاد لكل بند — رمز من مكتبة رموز المنصة (window.__PGL) بوصفة البلاطة نفسها */
  var GLY = {
    'cu-list': 'identification-card', 'cu-new': 'user', 'cu-pf-ver': 'seal-check', 'cu-pf-launch': 'rocket-launch', 'cu-pf-req': 'note-pencil', 'cu-mem': 'crown-simple', 'cu-secc': 'shield-check', 'cpg': 'user-circle', 'cu-inbox': 'tray',
    'cu-svc': 'clipboard-text', 'cu-docs-pq': 'file-text', 'cu-docs-pc': 'handshake', 'cu-docs-sq': 'storefront', 'cu-docs-tl': 'envelope-simple',
    'fin-due': 'calendar-check', 'cu-trin': 'bank', 'cu-opin': 'arrow-counter-clockwise', 'cu-paylinks': 'link-simple',
    'fin-pay': 'receipt', 'comm-send': 'paper-plane-tilt', 'comm-rem': 'bell-ringing', 'comm-dir': 'users-three', 'cs-tickets': 'ticket', 'cx': 'star'
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
    'adm-home': 'teal', 'cu-list': 'blue', 'cu-new': 'blue', 'cu-pf-ver': 'blue', 'cu-pf-launch': 'blue', 'cu-pf-req': 'blue', 'cu-mem': 'blue', 'cu-secc': 'teal', 'cpg': 'teal', 'cu-inbox': 'violet',
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

/* v827: قسم العملاء بالتصوّر المعتمد (v735) + إصلاحات (v736–v748) —
   · v746: الملف بصفوف عرضية بلا عمودين، والمحتوى بعرض الصفحة، وبلا تكرار للأزرار والأرقام.
   · v827: طلب الأهلية — زرّا «إلغاء الطلب» و«إرسال إشعار للعميل» ثابتان في رأس الطلب، وخطوات العمل شريطًا أفقيًا يعطي المحتوى العرض كاملًا، وقرار الأهلية بنموذج منظّم (حقول بعناوينها · مؤشرات · توصية)، والأرقام إنجليزية فقط.
   · v822: «الطلبات والعقود» بتصميم جديد موحّد — لكل صفحة شريط علوي (الأيقونة · الاسم · وصف سطر · أرقام الحالات تصفّي · أزرار الصفحة) ثم بحث ثم جدول واحد (الرقم · العميل · التفاصيل · الحالة · فتح)، وصفحة الطلب برأس داكن وتبويبات (ومنها طلب الأهلية: العمل على الطلب · الإسناد · المراسلة · المسار).
   · v820: صفوف جداول «الطلبات والعقود» تُفتح (كان حارس الإجراءات يمنع «إصدار عرض السعر…» لأن الصف بلا data-live-ok)، وعدد العقود الصحيح («عقد واحد» كان يُقرأ من المبلغ)، والجدول بأعمدته على الشاشات المتوسطة.
   · v819: «الطلبات والعقود» — «عقود العملاء» جدول (بطاقات ملخص تصفّي · بحث · صف لكل عميل بعقوده والمتبقي وحالاتها)، و«طلبات المتجر» جدول طلبات المتجر وحدها (بلا شرائح الأقسام الأخرى)، وصفحة الطلب والعرض بتبويب لكل قسم (الإجراء أولًا) ومسار «الطلبات والعقود › الصفحة › الطلب».
   · v814: «المالية» و«التواصل» — «المدفوعات» تبويبان (سجل المدفوعات · فروقات تحتاج قرارك) بدل قسم طويل فوق السجل، و«تجربة العملاء» تظهر (كانت فارغة)، واسم الصفحة اسم القائمة (جهات الاتصال · تجربة العملاء)، وخلية العميل في العروض بفاصل بين أجزائها.
   · v813: «الطلبات والعقود» — العروض (الشركاء والمتاجر) جدول صفًّا لكل عرض ببطاقات ملخص تصفّي بلا شريط أرقام مكرّر، واسم الصفحة اسم القائمة نفسه، ورقم عنوان القسم في «طلبات الخدمات» عدد طلباته.
   · v808: «إعدادات النظام» — ثماني مجموعات واضحة وكل عنصر في مكان واحد (مدة الجلسة مع الوصول والأمان، سداد قيمة المنتج مع المالية، النقاط والخصومات معًا) وبحث بدل شريط الشرائح، ومسار كامل في كل صفحة إعدادات، وكل الأقسام مفتوحة، والصفحات الطويلة بتبويب لكل قسم، وبلا رابطين مكرّرين في القائمة الجانبية.
   · v806: «ر.س» أيضًا حين يكون الرقم في عنصر مستقل (مثل «6,200 ريال» في بطاقة طلب الأهلية).
   · v805: إكمال قسم العملاء — «العضويات والنقاط» جدول ببطاقات مستوى تصفّي وسطر النقاط وبحث (بدل شبكة البطاقات)، والمستويات بالعربية وحدها، وبلا تكرار شارة المستوى في تفاصيل العضوية؛ «طلبات تحديث الملف» بطاقة مقارنة (البيان · الحالي · المطلوب) قبل الاعتماد أو الرفض؛ «تدشين الحساب» القيم الافتراضية سطر معلومات لا بطاقات بشكل المرشّحات؛ «العملاء الجدد» الجوال 05… وشرح التذكير سطر واحد؛ و«ر.س» تشمل تبويب «الطلبات» في الملف.
   · v804: مراجعة قسم العملاء — تبويبات العقد ستة بدل أحد عشر (التفاصيل والقيمة · الإيصالات مجمّعة)، بلا تكرار المتبقي ومسار السداد، والوصول السريع يعمل من أي تبويب، والتبويب الفرعي الافتراضي أول ما فيه عناصر، و«مركز الأمن» و«صفحة العميل» بطاقات مباشرة بلا شرائح «عنصر واحد»، و«منذ 0 يوم» ← «اليوم»، و«ريال» ← «ر.س» في ملف العميل.
   · v784: «التقرير الائتماني الخارجي» (مُلم) في طلب الأهلية — قراءة آلية للملف المرفق داخل المتصفح، ودرجة خارجية وقواعد أهلية وقدرة على السداد، ودمج مع سلوك العميل وتوصية استشارية.
   · v783: بطاقة «معايير تقييم العملاء والأهلية» في «إعدادات النظام ← قسم العملاء».
   · v782: «معايير تقييم العملاء والأهلية» في إعدادات النظام — كل وزن ونسبة وحدّ يُعدَّل، مع شرح الطريقة والاحتساب والأهلية ومثال حيّ على عميل حقيقي.
   · v781: درجة تقرير العميل مقياس من أربعة مكوّنات موزونة (سجل السداد في الموعد 40 · الوضع الحالي 30 · الإجراءات 20 · عمق العلاقة 10) وبطاقة «كيف تُحسب الدرجة» وقرار المنصة بأسبابه.
   · v779: رأس العقد المغلق عليه متبقٍّ يُظهر المبلغ «بانتظار القرار»، وبطاقات ملخص قائمة العملاء في صف واحد.
   · v776: التأخر والتعثر والسداد المتأخر من مصدر واحد — العقد المغلق عليه متبقٍّ حالة مستقلة في قائمة العملاء لا «متعثر»، وتقرير العميل يحسب السداد في الموعد والمسدَّد متأخرًا.
   · v773: «طلبات المتجر» تفتح على شريحة المتجر في صندوق «بانتظار إجراء».
   · v771: أيقونات بنود القائمة الجديدة، و«مركز الأمن» و«طلبات المتجر» باسم صفحتهما بلا تكرار في المسار.
   · v770: «طلبات تحديث الملف» جدول بالحقول المعدّلة والقرار في الصف · تقرير العميل بأقسام تبويبات · القائمة الجانبية بلا «كل صفحات العملاء» (صفحاتها بنود مباشرة).
   · v768: الإجراءات الفرعية في البند (السبب · الملاحظة · التعديل) بارزة قبل الأزرار، ورسائل القسم ونتيجة الإجراء السابق ظاهرة، وروابط البنود في القرار تفتح البند.
   · v767: إصلاح ظهور القرار أعلى صفحة «بندًا بندًا».
   · v766: طلب التوثيق «بندًا بندًا»: الأقسام بنسبة إنجازها، وبند واحد كبير بزرّي مطابق/غير مطابق وانتقال تلقائي للتالي، والقرار والمراسلة والسجل من شريط ثابت.
   · v765: صفحة التفاصيل تفتح من أعلى الصفحة فيبقى الهيدر والقائمة الجانبية ظاهرين مهما كان موضع التمرير، وتعود القائمة لموضعها عند الإغلاق.
   · v764: صفحات التفاصيل داخل الصفحة لا أدراج (القائمة الجانبية والهيدر ظاهران) · رأس صفحة بالاسم والوسوم والأزرار · أيقونة لكل معلومة · التدشين: أرقام + البطاقة بجانب مسار التدشين + بيانات الملف · التوثيق: البنود بعمود والملخص والقرار والمراسلة بعمود، والبند يتكيّف مع العرض.
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
  /* v804: تبويبات العقد — مهمة واحدة لكل تبويب، والأقسام المتقاربة في تبويب واحد */
  var CGRP = [['جدول السداد', /جدول السداد/], ['التفاصيل والقيمة', /مكوّنات|مكونات|تفاصيل|عرض السعر|الرسوم|المصاريف/], ['الوسائل المرتبطة', /الوسائل/], ['الإيصالات', /إيصال/], ['المستندات', /مستندات/], ['السجل', /سجل/]];
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
    /* v808: صفحة فُتحت من بطاقة في صفحة أقسام (إعدادات النظام · مركز الأمن …) — المسار: الرئيسية › المجموعة › الصفحة الأم › الصفحة */
    var hf = ST.__hubFrom;
    if (!on && hf && document.body.contains(hf)) {
      var hi = hf.getAttribute('title') || txt(hf), hgr = hf.closest('.tqn-g'), hgl = hgr ? txt(hgr.querySelector('.tqn-gh')) : '', hp = txt(document.getElementById('pv-title')) || srcLast;
      if (hp && hp !== hi) {
        L.push({ t: 'الرئيسية', home: 1, go: function () { if (homeBtn) homeBtn.click(); else if (srcBtns[0]) srcBtns[0].click(); } });
        if (hgl && hgl !== hi) L.push({ t: hgl, grp: 1 });
        L.push({ t: hi, go: function () { hf.click(); } }); L.push({ t: hp });
        return crumbsDraw(src, back, mine, L);
      }
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
    /* v776: متبقٍّ على عقد مغلق — لا يُحسب متأخرًا ولا متعثرًا، ويظهر مستقلًّا بانتظار القرار (إعفاء · تحصيل · إعادة فتح) */
    if (k.cr > 0) return ['متبقٍّ على عقد مغلق', 'cl', 'cl'];
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
    var groups = [['all', 'كل العملاء', K.length, ''], ['ok', 'منتظمون', 0, 'ok'], ['late', 'عليهم متأخرات', 0, 'bad'], ['soon', 'يستحق خلال 7 أيام', 0, 'warn'], ['cl', 'متبقٍّ على عقد مغلق', 0, 'cl'], ['none', 'بلا عقود', 0, 'g']];
    K.forEach(function (x) { var s = kState(x.k)[2]; groups.forEach(function (g) { if (g[0] === s) g[2]++; }); });
    groups = groups.filter(function (g) { return g[0] !== 'cl' || g[2] > 0 || F === 'cl'; });
    var sig = K.map(function (x) { return x.k.name + x.c.getAttribute('data-k') + (x.c.hidden || x.c.style.display === 'none' ? 0 : 1); }).join('|') + F + SO + Q + SC.map(function (c) { return txt(c) + (c.classList.contains('is-on') ? 1 : 0); }).join(',');
    var W = stack.__tqnCl;
    if (W && W.parentNode === stack && W.__sig === sig) return;
    var keepQ = W && W.__q === document.activeElement;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    W = mk('div', 'tqn-clw'); W.__sig = sig;
    var SMI = { all: '∑', ok: '✓', bad: '!', warn: '◷', cl: '⊟', g: '∅' };
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
    /* v804: خارج تبويب «العقود» لا تُعرف إجراءات العقد بعد — الزر يعمل وينقل إلى العقود ثم ينفّذ */
    var tiles = ctrTiles(stack), en = function (k) { return !tiles.length || tiles.some(function (t) { return t[0] === k && t[3]; }); };
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
      /* v804: «المتبقي على العقد» (معلومة) تكرار لأرقام رأس العقد — تُخفى؛ والتنبيهات تبقى */
      [].forEach.call(AL.querySelectorAll('.t2-note'), function (x) { cls(x, 'tqn-hide', /(^|\s)is-info(\s|$)/.test(x.className) && /^المتبقي على العقد/.test(txt(x))); });
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
    /* v804: تجميع الأقسام في تبويبات (CGRP) — ما لا يطابق مجموعة يبقى تبويبًا وحده */
    var G = [], gOf = function (t) { for (var i = 0; i < CGRP.length; i++) if (CGRP[i][1].test(t)) return CGRP[i][0]; return short(t); };
    list.forEach(function (x) { var g = gOf(title(x)), o = G.filter(function (y) { return y.k === g; })[0]; if (!o) { o = { k: g, xs: [], n: 0, nn: false }; G.push(o); } o.xs.push(x); var c = count(x); if (/^\d{1,3}$/.test(c)) { o.n += +c; o.nn = true; } });
    var GK = G.map(function (g) { return g.k; });
    var cur = ST[key]; if (!cur || GK.indexOf(cur) < 0) { var gi = GK.indexOf(gOf(cur || '')); cur = gi >= 0 ? GK[gi] : GK[0]; }
    var tb = bar(b, hd ? hd.nextSibling : list[0], G.map(function (g) { return { k: g.k, t: g.k, n: g.nn && g.n ? String(g.n) : '' }; }), cur, 'k', function (k) { ST[key] = k; });
    cls(tb, 'tqn-o-tabs', true);
    G.forEach(function (g) {
      var on = g.k === cur, many = g.xs.length > 1;
      g.xs.forEach(function (x) {
        cls(x, 'tqn-st-hide', !on); cls(x, 'tqn-cg', true); cls(x, 'tqn-cg-m', on && many);
        if (on) { if (!many) quiet(head(x)); inner(x, key); }
      });
    });
  }


  /* ── 7) v753–v755: العملاء الجدد · طلبات توثيق الملف · تدشين الحساب — بنفس لغة قسم العملاء ── */
  var PT = { 'عروض الشركاء': 'pq', 'عروض المتاجر': 'pq', 'العملاء الجدد': 'nc', 'طلبات توثيق الملف': 'vr', 'تدشين الحساب': 'lch', 'طلبات الملف الشخصي': 'req', 'طلبات تحديث الملف': 'req' };
  /* v813: «طلبات الخدمات» — رقم عنوان القسم عدد طلباته المعروضة (كان «0» وتحته ثلاثة طلبات) */
  function srvCount(root) {
    if (txt(document.getElementById('pv-title')) !== 'طلبات الخدمات') return;
    [].forEach.call(root.querySelectorAll('section.t2-sec'), function (sec) {
      var c = sec.querySelector(':scope > .t2-sec-h .lv-cnt'), b = sec.querySelector(':scope > .t2-sec-b'); if (!c || !b) return;
      var n = [].filter.call(b.querySelectorAll('article, .sr-card, .nr'), function (a) { return !a.parentNode.closest('article, .sr-card, .nr') && a.offsetParent !== null; }).length;
      if (n && txt(c) !== String(n)) c.textContent = String(n);
    });
  }
  /* v814: «المدفوعات» — تبويبان: سجل المدفوعات (الملخص والتنبيه والسجل) · فروقات تحتاج قرارك (كانت قسمًا طويلًا فوق السجل) */
  function finPay(root) {
    var sec = [].filter.call(root.querySelectorAll('section.t2-sec'), function (x) { return /^فروقات تحتاج قرارك/.test(txt(x.querySelector(':scope > .t2-sec-h'))); })[0];
    var card = root.querySelector('section.tqn-fd-card');
    if (!sec || !card || sec.parentNode !== card.parentNode) return;
    var box = sec.parentNode, strip = box.querySelector(':scope > .tqn-fd-strip'), notes = [].slice.call(box.querySelectorAll(':scope > .t2-note'));
    var nd = (txt(sec.querySelector(':scope > .t2-sec-h')).match(/(\d+)\s*بانتظار/) || [])[1] || '';
    var cur = ST.fpT === 'd' ? 'd' : 'l', first = [strip].concat(notes, [sec, card]).filter(Boolean)[0];
    var b = bar(box, first, [{ k: 'l', t: 'سجل المدفوعات' }, { k: 'd', t: 'فروقات تحتاج قرارك', n: nd }], cur, 'k', function (k) { ST.fpT = k; });
    cls(b, 'is-set', true); cls(b, 'tqn-fpt', true);
    [strip, card].concat(notes).forEach(function (x) { cls(x, 'tqn-st-hide', cur !== 'l'); });
    cls(sec, 'tqn-st-hide', cur !== 'd'); quiet(sec.querySelector(':scope > .t2-sec-h'));
  }
  /* v814: نص خانة من أجزاء متعددة بفاصل بينها (كان «العميلتسليم إلكتروني») */
  function tj(v) { if (!v) return ''; while (v.children.length === 1 && v.childNodes.length === 1) v = v.children[0]; var P = [].map.call(v.childNodes, function (n) { return String(n.textContent || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean); return P.length > 1 ? P.join(' · ') : txt(v); }
  function pageKey() { return PT[txt(document.getElementById('pv-title'))] || ''; }
  function pages(root) {
    /* v770: اسم الصفحة كما في القائمة الجانبية */
    var ptl = document.getElementById('pv-title'); if (ptl && txt(ptl) === 'طلبات الملف الشخصي') ptl.textContent = 'طلبات تحديث الملف';
    /* v771: «طلبات المتجر» عنوانها في المنصة «بانتظار إجراء» — اسم القائمة نفسه بلا تكرار في المسار */
    var onI = document.querySelector('.tqn-nav .tqn-i.is-on'), onT = onI ? (onI.getAttribute('title') || txt(onI)) : '';
    if (ptl && onT === 'طلبات المتجر' && txt(ptl) === 'بانتظار إجراء') ptl.textContent = 'طلبات المتجر';
    /* v804: «طلبات المتجر» تفتح صندوق «بانتظار إجراء» على شريحة المتجر نفسها (مرة عند الدخول من القائمة) */
    /* v813: اسم الصفحة اسم القائمة نفسه — بلا «عروض الشركاء › عروض أسعار الشركاء» في المسار */
    var RN = { 'عروض أسعار الشركاء': 'عروض الشركاء', 'عروض أسعار المتاجر': 'عروض المتاجر', 'دليل هواتف وبريد الشركاء': 'جهات الاتصال', 'تجربة العملاء والجودة': 'تجربة العملاء' };
    if (ptl && RN[txt(ptl)] && onT === RN[txt(ptl)]) ptl.textContent = RN[txt(ptl)];
    try { srvCount(root); } catch (e) { void e; }
    try { finPay(root); } catch (e) { void e; }
    try { rqPages(root); } catch (e) { void e; }
    if (ST.__inbx && onT === 'طلبات المتجر') { var sc = [].filter.call(root.querySelectorAll('.st-chip'), function (c) { return /^طلبات المتجر/.test(txt(c)); })[0]; if (sc) { ST.__inbx = 0; if (!sc.classList.contains('is-on')) sc.click(); } }
    try { rpPage(root); } catch (e) { void e; }
    var k = pageKey(), L = root.querySelector('.adm-live');
    [].forEach.call(root.querySelectorAll('.tqn-ncp, .tqn-axp'), function (x) { if (x !== L || !k) { cls(x, 'tqn-ncp', false); cls(x, 'tqn-axp', false); } });
    if (!L || !k) return;
    if (k === 'nc') newClients(L);
    else if (k === 'pq') { cls(L, 'tqn-axp', false); }
    else axTable(L, k);
  }
  /* لون الشارة من صنف حبة المنصة */
  function chipOf(el, t) { var c = tone(el); return mk('span', 'tqn-chip' + (c ? ' is-' + (c === 'danger' ? 'bad' : c === 'info' || c === 'brand' ? 'done' : c) : ''), t || txt(el)); }
  /* ملخص يصفّي: شرائح المنصة نفسها بطاقات أرقام (النقر يشغّل الشريحة الأصلية) */
  function sumTiles(chips, extra) {
    var IC = ['∑', '◷', '✓', '!', '↺', '∅'], sm = mk('div', 'tqn-sum');
    chips.forEach(function (c) {
      var n = txt(c.querySelector('small')) || (txt(c).match(/\d+\s*$/) || [''])[0].trim(), lb = txt(c).replace(new RegExp(n + '\\s*$'), '').trim();
      var tn = /معتمد|المدشّنة|مدشّن|مقبول|مكتملة|منتظم/.test(lb) ? 'ok' : /أُعيد|مرفوض|رُفض|متعثر|متأخر/.test(lb) ? 'bad' : /بانتظار|قيد|لم يُرسل|مراجعة|معدّل|معلّق/.test(lb) ? 'warn' : 'all';
      var b = mk('button', 'tqn-sm is-' + tn + (c.classList.contains('is-on') ? ' is-on' : '')); b.type = 'button'; b.setAttribute('data-live-ok', '');
      b.appendChild(mk('i', '', tn === 'ok' ? '✓' : tn === 'bad' ? '!' : tn === 'warn' ? '◷' : '∑'));
      var t = mk('span'); t.appendChild(mk('small', '', lb)); t.appendChild(mk('b', '', n || '0')); b.appendChild(t);
      b.addEventListener('click', function () { c.click(); soon(); }); sm.appendChild(b);
    });
    /* v805: القيم الافتراضية ليست مرشّحات — سطر معلومات واحد تحت البطاقات لا بطاقات بنفس شكلها */
    if ((extra || []).length) sm.appendChild(infoStrip(extra.title || 'الإعدادات الافتراضية', extra));
    sm.style.setProperty('--n', String(chips.length));
    void IC; return sm;
  }
  function infoStrip(title, items) {
    var d = mk('div', 'tqn-sdef'); d.appendChild(mk('span', 'tqn-sdef-t', title));
    items.forEach(function (x) { var c = mk('span', 'tqn-sdef-i'); c.appendChild(mk('small', '', x[0])); c.appendChild(mk('b', '', x[1])); d.appendChild(c); });
    return d;
  }
  function who(name, sub) { var w = mk('div', 'tqn-who'); w.appendChild(mk('i', '', String(name || '؟').replace(/[ﹰ-﻿]/g, function (ch) { return ch.normalize ? ch.normalize('NFKC') : ch; }).slice(0, 1))); var s = mk('span'); s.appendChild(mk('b', '', name || '—')); if (sub) s.appendChild(mk('small', '', sub)); w.appendChild(s); return w; }
  function axTable(L, k) {
    cls(L, 'tqn-axp', true); cls(L, 'is-' + k, true);
    var rows = [].slice.call(L.querySelectorAll('article.cu-bd-r')).filter(function (r) { return !(r.hidden || r.style.display === 'none'); });
    var chips = [].slice.call(L.querySelectorAll('.st-chip'));
    var list = rows.length ? rows[0].parentNode : null, tools = L.querySelector('.adm-tools, .ax-tools') || (k === 'pq' && chips[0] ? chips[0].closest('.st-chips-w') : null);
    var extra = [];
    if (k === 'lch') [].forEach.call(L.querySelectorAll('.cu-kpi'), function (q) { var l = txt(q.querySelector('small')), v = txt(q.querySelector('b')); if (/الافتراضي|الافتراضية/.test(l)) extra.push([l.replace(/\s*(الافتراضية|الافتراضي)$/, ''), v]); }); extra.title = 'عند التدشين افتراضيًا';
    var sig = k + '|' + rows.map(function (r) { return txt(r); }).join('|') + '#' + chips.map(function (c) { return txt(c) + (c.classList.contains('is-on') ? 1 : 0); }).join(',') + '#' + extra.join(',');
    /* v770: أرقام المنصة مكرّرة مع بطاقات الملخص التي تصفّي — تبقى البطاقات وحدها */
    if (k === 'req' && chips.length) [].forEach.call(L.querySelectorAll(':scope > .cu-kpis'), function (q) { cls(q, 'tqn-hide', true); });
    /* v813: العروض — شريط الأرقام يكرّر الشرائح (مقبولة 4 = مقبول 4) — تبقى بطاقات الملخص التي تصفّي وحدها */
    if (k === 'pq' && chips.length) [].forEach.call(L.querySelectorAll('.cu-kpis'), function (q) { cls(q, 'tqn-hide', true); });
    var QL = k === 'pq' && rows[0] ? [].map.call(rows[0].querySelectorAll('.adm-cm-i'), function (i) { return txt(i.querySelector('small')); }).filter(function (l) { return !/^(أعدّه|أعده|الطلب)$/.test(l); }) : [];
    var W = L.__tqnAx, SM = L.__tqnSm;
    if (W && L.contains(W) && W.__sig === sig && (!chips.length || (SM && L.contains(SM)))) return;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    if (SM && SM.parentNode) SM.parentNode.removeChild(SM);
    W = mk('div', 'tqn-clw tqn-axw is-' + k); W.__sig = sig;
    if (chips.length && tools) { SM = sumTiles(chips, extra); cls(SM, 'tqn-axs', true); tools.parentNode.insertBefore(SM, tools); L.__tqnSm = SM; [].forEach.call(L.querySelectorAll('.st-chips-w'), function (x) { cls(x, 'tqn-hide', true); }); }
    var T = mk('div', k === 'req' ? 'tqn-rqs' : 'tqn-lt is-' + k);
    var H = k === 'pq' ? ['العرض'].concat(QL, ['']) : k === 'vr' ? ['صاحب الملف', 'النوع', 'الحالة', 'أُرسل', 'البنود', 'المسؤول', ''] : k === 'req' ? ['العميل', 'القسم', 'ما عدّله العميل', 'التاريخ', 'الحالة', 'القرار'] : ['العميل', 'الحالة', 'المستوى', 'النقاط', 'تاريخ التدشين', ''];
    if (k === 'pq') T.style.setProperty('--c', String(QL.length));
    var hr = mk('div', 'tqn-ar is-h'); H.forEach(function (h) { hr.appendChild(mk('span', '', h)); }); if (k !== 'req') T.appendChild(hr);
    rows.forEach(function (r) {
      if (k === 'req') { T.appendChild(reqCard(r, L)); return; }
      var go = r.querySelector('.nr-main') || r, x = mk('div', 'tqn-ar'); x.setAttribute('role', 'button'); x.tabIndex = 0;
      if (k === 'pq') {
        /* v813: العرض صفًّا واحدًا — الرقم ثم أعمدة المنصة نفسها (العميل · الطلب · الإجمالي · صالح حتى · أعدّه · الحالة) */
        var QV = {}; [].forEach.call(r.querySelectorAll('.adm-cm-i'), function (i) { QV[txt(i.querySelector('small'))] = i.querySelector(':scope > :not(small)'); });
        var q0 = mk('span', 'tqn-qno'); q0.appendChild(mk('bdi', '', txt(r.querySelector('.ax-r-b > b, .ax-r-b > bdi, .ax-r-b bdi')) || '—')); if (QV['الطلب']) q0.appendChild(mk('small', '', 'الطلب ' + txt(QV['الطلب']))); x.appendChild(q0);
        QL.forEach(function (l) { var v = QV[l], pl = v && (v.matches('.t2-pill') ? v : v.querySelector('.t2-pill')); x.appendChild(pl ? chipOf(pl) : mk(/الإجمالي|المبلغ|القيمة/.test(l) ? 'b' : 'span', /الطلب|صالح|التاريخ/.test(l) ? 'tqn-dt' : '', (l === 'العميل' ? tj(v) : txt(v)) || '—')); });
      } else if (k === 'vr') {
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
      if (!x.__noGo) {
        var ac = mk('div', 'tqn-acts'); ac.appendChild(btn('عرض', 'is-pri is-sm', function () { go.click(); })); x.appendChild(ac);
        x.addEventListener('click', function () { go.click(); });
        x.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') go.click(); });
      }
      T.appendChild(x);
    });
    if (rows.length) { W.appendChild(T); if (k !== 'req') W.appendChild(mk('div', 'tqn-lf', 'عرض ' + rows.length + (k === 'vr' ? ' طلب' : k === 'pq' ? ' عرض' : ' حساب'))); }
    if (list) cls(list, 'tqn-hide', true);
    if (tools) tools.parentNode.insertBefore(W, tools.nextSibling); else if (list) list.parentNode.insertBefore(W, list); else L.appendChild(W);
    L.__tqnAx = W;
    /* لوحة المنصة: عنوانها مكرّر مع عنوان الصفحة */
    var ph = L.querySelector('.t2-panel > .t2-panel-h'); cls(ph, 'tqn-hide', !!ph);
  }
  /* v805: طلب تحديث الملف بطاقةً — البيان والقيمة الحالية والمطلوبة جنبًا إلى جنب قبل الاعتماد أو الرفض */
  function reqCard(r, L) {
    var Q = {}; [].forEach.call(r.querySelectorAll('.adm-cm-i'), function (i) { Q[txt(i.querySelector('small'))] = i.querySelector(':scope > span'); });
    var c = mk('article', 'tqn-rq'), h = mk('div', 'tqn-rq-h');
    h.appendChild(who(txt(r.querySelector('.adm-nm b') || r.querySelector('.adm-nm') || r.querySelector('.adm-ct')), txt(r.querySelector('.adm-nm small, .adm-ct small'))));
    var mt = mk('div', 'tqn-rq-m');
    mt.appendChild(mk('span', 'tqn-chip is-done', txt(Q['القسم']) || '—'));
    mt.appendChild(mk('bdi', 'tqn-dt', txt(Q['التاريخ']) || '—'));
    var sq = Q['الحالة'] && Q['الحالة'].querySelector('.t2-pill'); mt.appendChild(sq ? chipOf(sq) : mk('span', 'tqn-chip', txt(Q['الحالة']) || '—'));
    h.appendChild(mt); c.appendChild(h);
    var P = Q['التغيير'] ? [].slice.call(Q['التغيير'].querySelectorAll('.tqn-pfch > span')) : [];
    if (P.length) {
      var g = mk('div', 'tqn-cmp'), hr = mk('div', 'tqn-cmp-r is-h'); ['البيان', 'الحالي', 'المطلوب'].forEach(function (t) { hr.appendChild(mk('span', '', t)); }); g.appendChild(hr);
      P.forEach(function (p) {
        var b0 = p.getAttribute('data-b') || '—', a0 = p.getAttribute('data-a') || '—', w = mk('div', 'tqn-cmp-r' + (b0 === a0 ? ' is-same' : ''));
        w.appendChild(mk('b', '', txt(p))); w.appendChild(mk('bdi', 'is-old', b0)); w.appendChild(mk('bdi', 'is-new', a0)); g.appendChild(w);
      });
      c.appendChild(g);
    } else {
      var fl = mk('div', 'tqn-flds'); (txt(Q['التغيير']) || '').split(/[،,]/).map(function (z) { return z.trim(); }).filter(Boolean).forEach(function (z) { fl.appendChild(mk('span', '', z)); }); if (!fl.children.length) fl.appendChild(mk('span', 'is-mut', '—')); c.appendChild(fl);
    }
    /* القرار: أزرار المنصة نفسها (تُضغط عند الطلب من الصف الحالي في القائمة الأصلية) */
    var dc = mk('div', 'tqn-acts'), rk = txt(r.querySelector('.ax-r-b')) + '|' + txt(Q['التاريخ']);
    [].forEach.call(Q['القرار'] ? Q['القرار'].querySelectorAll('button') : [], function (pb) {
      var lb = txt(pb); dc.appendChild(btn(lb, /اعتماد/.test(lb) ? 'is-pri' : 'is-no', function () {
        var cur0 = [].filter.call(L.querySelectorAll('article.cu-bd-r'), function (a) { var A = {}; [].forEach.call(a.querySelectorAll('.adm-cm-i'), function (i) { A[txt(i.querySelector('small'))] = txt(i.querySelector(':scope > span')); }); return txt(a.querySelector('.ax-r-b')) + '|' + (A['التاريخ'] || '') === rk; })[0];
        var b0 = cur0 && [].filter.call(cur0.querySelectorAll('button'), function (q) { return txt(q) === lb; })[0]; if (b0) b0.click();
      }));
    });
    if (!dc.children.length) { var sm0 = txt(r.querySelector('.adm-nm small')); if (sm0) dc.appendChild(mk('span', 'is-mut', sm0)); }
    if (dc.children.length) c.appendChild(dc);
    return c;
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
      /* v805: الشرح سطر واحد بلا تكرار العنوان (النص الكامل عند المرور) */
      var nb = nt && nt.querySelector('.t2-note-b');
      if (nb && !nb.__tqn) { var full = txt(nb); nb.title = full; nb.textContent = full.replace(/^للعميل الجديد الذي لم يرسل ملفه للتوثيق:\s*/, '').replace(/\s*يصله في واتساب ما ينقصه بالتحديد\.?$/, ' — يصله في واتساب ما ينقصه.'); nb.__tqn = 1; cls(nb, 'tqn-1l', true); }
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
      /* v819: صفحة فُتحت من «الطلبات والعقود» — المسار: الرئيسية › الطلبات والعقود › اسم الصفحة في القائمة › الطلب */
      var rq = rqOn(), L = [];
      cls(d, 'tqn-dr-rq', !!rq);
      li.forEach(function (l, i) {
        var t = T[i]; if (/^الملف الشخصي$/.test(t)) return;
        var a = l.querySelector('button, a');
        if (/^قسم العملاء$/.test(t)) L.push({ t: rq ? rq.g : 'العملاء', grp: 1 });
        else if (rq && i === li.length - 2 && !/^الرئيسية$/.test(t)) L.push({ t: rq.t, go: a ? function () { a.click(); } : function () { rq.el.click(); } });
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
      try { pgHead(d); } catch (e) { void e; }
      try { vrPage(d); } catch (e) { void e; }
      try { lchPage(d); } catch (e) { void e; }
      try { dsIcons(d); } catch (e) { void e; }
      if (rq) try { drTabs(d, T[T.length - 1] || ''); } catch (e) { void e; }
    });
    inPage();
  }
  /* v819: البند المفتوح في القائمة إن كان من مجموعة «الطلبات والعقود» */
  function rqOn() {
    var on = document.querySelector('.tqn-nav .tqn-i.is-on'); if (!on) return null;
    var g = on.closest('.tqn-g'), gl = g ? txt(g.querySelector('.tqn-gh')) : '';
    return gl === 'الطلبات والعقود' ? { g: gl, t: on.getAttribute('title') || txt(on), el: on } : null;
  }
  /* v819: صفحة الطلب أو العرض — تبويب لكل قسم (الإجراء أولًا)، وأزرار الصفحة ظاهرة دائمًا */
  function drTabs(d, kind) {
    var b = d.querySelector('.cu-dr-b'); if (!b) return;
    var S = [].filter.call(b.children, function (x) { return x.matches('section.cu-ds, section.t2-sec') && !x.classList.contains('tqn-hide'); });
    if (S.length < 2) return;
    var K = S.map(function (s) { var h = s.querySelector(':scope > .cu-ds-h, :scope > .t2-sec-h .t2-group-t, :scope > .t2-sec-h h2, :scope > .t2-sec-h h3'); return txt(h).replace(/\s*\d+\s*$/, '').split(/[:：]/)[0].trim() || '—'; });
    var key = 'dt:' + kind, cur = ST[key];
    if (K.indexOf(cur) < 0) cur = K.filter(function (k) { return /^الإجراء/.test(k); })[0] || K[0];
    var bb = bar(b, S[0], K.map(function (k) { return { k: k, t: k }; }), cur, 'k', function (k) { ST[key] = k; });
    cls(bb, 'is-set', true); cls(bb, 'tqn-drt', true);
    S.forEach(function (x, i) { cls(x, 'tqn-st-hide', K[i] !== cur); quiet(x.querySelector(':scope > .cu-ds-h, :scope > .t2-sec-h')); });
  }
  /* v819: «عقود العملاء» — جدول بدل البطاقات: صف لكل عميل (العقود · المتبقي · حالات العقود) وبطاقات ملخص تصفّي وبحث بالاسم */
  function ctList(root) {
    if (txt(document.getElementById('pv-title')) !== 'عقود العملاء') return;
    var box = root.querySelector('.cu-cards'), stack = box && box.parentNode; if (!box) return;
    var cards = [].slice.call(box.querySelectorAll(':scope > .cu-card')).filter(function (c) { return !c.getAttribute('data-k'); });
    if (!cards.length) return;
    var chips = [].slice.call(stack.querySelectorAll('.st-chip'));
    cls(box, 'tqn-hide', true);
    [].forEach.call(stack.querySelectorAll(':scope > .m3-tools, :scope > .ax-tools'), function (x) { cls(x, 'tqn-hide', true); });
    [].forEach.call(stack.querySelectorAll(':scope > .t2-note'), function (x) { if (/انتقلت إلى/.test(txt(x))) cls(x, 'tqn-hide', true); });
    if (!box.__tqnMo) { try { box.__tqnMo = new MutationObserver(soon); box.__tqnMo.observe(box, { attributes: true, subtree: true, attributeFilter: ['style', 'hidden'] }); } catch (e) { void e; } }
    var Q = (ST.ctq || '').trim();
    var vis = cards.filter(function (c) { return !(c.hidden || c.style.display === 'none'); });
    var sig = vis.map(function (c) { return txt(c); }).join('|') + '#' + chips.map(function (c) { return txt(c) + (c.classList.contains('is-on') ? 1 : 0); }).join(',') + '#' + Q;
    var W = stack.__tqnCt;
    if (W && W.parentNode === stack && W.__sig === sig) return;
    var keepQ = W && W.__q === document.activeElement;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    W = mk('div', 'tqn-clw tqn-ctw'); W.__sig = sig;
    if (chips.length) W.appendChild(sumTiles(chips));
    var tb = mk('div', 'tqn-ltb'), q = mk('input', 'tqn-lq'); q.type = 'search'; q.placeholder = 'ابحث باسم العميل…'; q.value = ST.ctq || ''; q.setAttribute('aria-label', 'بحث في عقود العملاء');
    q.addEventListener('input', function () { ST.ctq = q.value; clearTimeout(q.__t); q.__t = setTimeout(apply, 160); });
    tb.appendChild(q); W.__q = q; W.appendChild(tb);
    var rows = vis.filter(function (c) { return !Q || (c.getAttribute('data-s') || txt(c)).indexOf(Q) >= 0; });
    var T = mk('div', 'tqn-ct');
    var hr = mk('div', 'tqn-ctr is-h'); ['العميل', 'العقود', 'المتبقي', 'حالات العقود', ''].forEach(function (h) { hr.appendChild(mk('span', '', h)); }); T.appendChild(hr);
    rows.forEach(function (c) {
      var nm = txt(c.querySelector('.cu-card-t b')), sm = txt(c.querySelector('.cu-card-t small'));
      var n = (sm.match(/(\d+)\s*عقد/) || [])[1] || (/عقدان/.test(sm) ? '2' : /عقد واحد|^عقد\b/.test(sm) ? '1' : '—'), rm = (sm.match(/المتبقي\s*([\d٬,.]+\s*ر\.س)/) || ['', '—'])[1];
      var r = mk('div', 'tqn-ctr'); r.setAttribute('role', 'button'); r.setAttribute('data-live-ok', ''); r.tabIndex = 0;
      var w = mk('div', 'tqn-who'); w.appendChild(mk('i', '', String(nm || '؟').slice(0, 1))); var w2 = mk('span'); w2.appendChild(mk('b', '', nm)); w.appendChild(w2); r.appendChild(w);
      r.appendChild(mk('b', '', n)); r.appendChild(mk('b', rm === '—' || /^0\s/.test(rm) ? 'is-mut' : '', rm));
      var P = mk('div', 'tqn-ctp'); [].forEach.call(c.querySelectorAll('.cu-card-m .t2-pill'), function (p) { P.appendChild(chipOf(p)); }); if (!P.children.length) P.appendChild(mk('span', 'is-mut', '—')); r.appendChild(P);
      r.appendChild(btn('فتح العقود', 'is-pri is-sm', function () { c.click(); }));
      r.addEventListener('click', function () { c.click(); });
      r.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') c.click(); });
      T.appendChild(r);
    });
    if (!rows.length) T.appendChild(mk('div', 'tqn-le', 'لا عملاء يطابقون البحث أو التصفية.'));
    W.appendChild(T); W.appendChild(mk('div', 'tqn-lf', 'عرض ' + rows.length + ' من ' + vis.length + ' عميلًا'));
    stack.insertBefore(W, box); stack.__tqnCt = W;
    if (keepQ) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { void e; } }
  }
  /* v819: «طلبات المتجر» — طلبات المتجر وحدها في جدول (الإجراء · العميل · الرقم · الحالة)، بلا شرائح أقسام أخرى ولا أرقام لا تخصّها */
  function stInbox(root) {
    var on = rqOn(); if (!on || on.t !== 'طلبات المتجر' || txt(document.getElementById('pv-title')) !== 'طلبات المتجر') return;
    var page = root.querySelector('.lv-page'); if (!page) return;
    var gl = page.querySelector(':scope > .nr-gl'), chw = page.querySelector(':scope > .st-chips-w');
    var sc = chw && [].filter.call(chw.querySelectorAll('.st-chip'), function (c) { return /^طلبات المتجر/.test(txt(c)); })[0];
    if (!sc || !sc.classList.contains('is-on')) return;
    cls(chw, 'tqn-hide', true);
    [].forEach.call(page.querySelectorAll(':scope > .cu-kpis'), function (x) { cls(x, 'tqn-hide', true); });
    var rows = gl ? [].slice.call(gl.querySelectorAll(':scope > article.nr')) : [];
    if (gl) cls(gl, 'tqn-hide', true);
    var sig = rows.map(function (r) { return txt(r); }).join('|'), W = page.__tqnSi;
    if (W && W.parentNode === page && W.__sig === sig) return;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    W = mk('div', 'tqn-clw tqn-siw'); W.__sig = sig;
    var T = mk('div', 'tqn-ct is-si');
    var hr = mk('div', 'tqn-ctr is-h'); ['الإجراء المطلوب', 'العميل', 'الرقم', 'الحالة', ''].forEach(function (h) { hr.appendChild(mk('span', '', h)); }); T.appendChild(hr);
    rows.forEach(function (r) {
      var go = r.querySelector('.nr-main') || r, x = mk('div', 'tqn-ctr'); x.setAttribute('role', 'button'); x.setAttribute('data-live-ok', ''); x.tabIndex = 0;
      x.appendChild(mk('b', '', txt(r.querySelector('.cu-ir-a')) || '—'));
      var cu = txt(r.querySelector('.cu-ir-c')); x.appendChild(mk('span', cu && cu !== 'العميل' ? '' : 'is-mut', cu && cu !== 'العميل' ? cu : '—'));
      x.appendChild(mk('bdi', 'tqn-dt', txt(r.querySelector('.cu-ir-no')) || '—'));
      var pl = r.querySelector('.t2-pill'); x.appendChild(pl ? chipOf(pl) : mk('span', 'is-mut', '—'));
      x.appendChild(btn('فتح', 'is-pri is-sm', function () { go.click(); }));
      x.addEventListener('click', function () { go.click(); });
      x.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') go.click(); });
      T.appendChild(x);
    });
    if (!rows.length) T.appendChild(mk('div', 'tqn-le', 'لا طلبات متجر تنتظر إجراء الآن.'));
    W.appendChild(T); W.appendChild(mk('div', 'tqn-lf', rows.length ? 'عرض ' + rows.length + ' طلب ينتظر إجراء' : ''));
    page.insertBefore(W, gl || null); page.__tqnSi = W;
  }

  /* ═══ v822: «الطلبات والعقود» — هيكل واحد لكل صفحات القسم ═══ */
  var RQI = { 'طلبات الخدمات': ['clip', 'تحقق الأهلية وطلبات العملاء — القرار والتنفيذ من صفحة الطلب.'], 'طلبات المتجر': ['card', 'طلبات المتجر التي تنتظر إجراءً: عرض سعر أو تأكيد طلب.'], 'عروض الشركاء': ['note', 'عروض أسعار الشركاء — الإعداد والاعتماد والإرسال للعميل.'], 'عروض المتاجر': ['note', 'عروض أسعار المتاجر — الإعداد والاعتماد والإرسال للعميل.'], 'عقود العملاء': ['id', 'عقود كل عميل وحالاتها — المراجعة والسداد والتعثّر.'] };
  function rqTone(t) { return /مكتمل|منتظم|مقبول|معتمد|منفّذ|مؤهَّل|مسدد/.test(t) && !/غير|بانتظار/.test(t) ? 'ok' : /متعثر|متأخر|مرفوض|ملغا|رفض/.test(t) ? 'bad' : /بانتظار|مراجعة|قيد|معدّل|معلّق|جديد/.test(t) ? 'warn' : ''; }
  function rqNum(el) { var t = txt(el), m = t.match(/\d[\d,]*/); return m ? m[0] : '0'; }
  function rqLab(el) { return txt(el).replace(/\d[\d,]*/g, '').replace(/\s+/g, ' ').trim(); }
  /* الهيكل: شريط علوي + بحث + جدول؛ يُبنى مرة ويُعاد عند تغيّر البيانات */
  function rqShell(host, before, C) {
    var Q = (ST['rq:' + C.key] || '').trim();
    var sig = C.key + '#' + C.sig + '#' + Q;
    var W = host.__tqnRq;
    if (W && W.parentNode === host && W.__sig === sig) { if (before && W.nextSibling !== before && before.parentNode === host) host.insertBefore(W, before); return W; }
    var keepQ = W && W.__q === document.activeElement;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    W = mk('div', 'tqn-rqw'); W.__sig = sig;
    var H = mk('section', 'tqn-rh');
    var ht = mk('div', 'tqn-rh-t'); ht.appendChild(icBox(C.ic || 'list', 'tqn-rh-ic'));
    var hs = mk('div'); hs.appendChild(mk('h2', '', C.title)); if (C.sub) hs.appendChild(mk('p', '', C.sub)); ht.appendChild(hs);
    if ((C.acts || []).length) { var ha = mk('div', 'tqn-rh-a'); C.acts.forEach(function (a) { ha.appendChild(btn(a.t, 'is-sm', a.fn)); }); ht.appendChild(ha); }
    H.appendChild(ht);
    if ((C.stats || []).length) {
      var st = mk('div', 'tqn-rh-s');
      C.stats.forEach(function (x) {
        var b = mk('button', 'tqn-rh-st' + (x.tone && !/^0$/.test(x.n) ? ' is-' + x.tone : '') + (x.on ? ' is-on' : '')); /* v823: الصفر بلا لون */ b.type = 'button'; b.setAttribute('data-live-ok', '');
        b.appendChild(mk('b', '', x.n)); b.appendChild(mk('small', '', x.t));
        if (x.fn) b.addEventListener('click', function () { x.fn(); soon(); }); else b.disabled = true;
        st.appendChild(b);
      });
      H.appendChild(st);
    }
    W.appendChild(H);
    var tb = mk('div', 'tqn-rq-tb'), q = mk('input', 'tqn-lq'); q.type = 'search'; q.placeholder = C.ph || 'ابحث بالاسم أو الرقم…'; q.value = ST['rq:' + C.key] || ''; q.setAttribute('aria-label', 'بحث');
    q.addEventListener('input', function () { ST['rq:' + C.key] = q.value; clearTimeout(q.__t); q.__t = setTimeout(apply, 160); });
    tb.appendChild(q); W.__q = q;
    var rows = C.items.filter(function (it) { return !Q || it.s.indexOf(Q) >= 0; });
    tb.appendChild(mk('span', 'tqn-rq-n', rows.length + ' من ' + C.items.length));
    W.appendChild(tb);
    var T = mk('div', 'tqn-rqt' + (C.cls ? ' ' + C.cls : ''));
    var hr = mk('div', 'tqn-rqr is-h'); C.cols.forEach(function (h) { hr.appendChild(mk('span', '', h)); }); hr.appendChild(mk('span')); T.appendChild(hr);
    rows.forEach(function (it) {
      var r = mk('div', 'tqn-rqr'); r.setAttribute('role', 'button'); r.setAttribute('data-live-ok', ''); r.tabIndex = 0;
      it.c.forEach(function (n) { r.appendChild(n || mk('span', 'is-mut', '—')); });
      r.appendChild(btn(it.bt || 'فتح', 'is-pri is-sm', it.open));
      r.addEventListener('click', function () { it.open(); });
      r.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') it.open(); });
      T.appendChild(r);
    });
    if (!rows.length) T.appendChild(mk('div', 'tqn-le', C.items.length ? 'لا نتائج تطابق البحث.' : (C.empty || 'لا طلبات هنا الآن.')));
    W.appendChild(T);
    host.insertBefore(W, before && before.parentNode === host ? before : null); host.__tqnRq = W;
    if (keepQ) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { void e; } }
    return W;
  }
  function cNo(no, sub) { var x = mk('span', 'tqn-rq-no'); x.appendChild(mk('bdi', '', no || '—')); if (sub) x.appendChild(mk('small', '', sub)); return x; }
  function cWho(nm, sub) { var w = mk('div', 'tqn-who'); w.appendChild(mk('i', '', String(nm || '؟').replace(/^(ال)/, '').slice(0, 1))); var s2 = mk('span'); s2.appendChild(mk('b', '', nm || '—')); if (sub) s2.appendChild(mk('small', 'is-rtl', sub)); w.appendChild(s2); return w; }
  function cTxt(t, cl) { return mk('span', 'tqn-rq-i' + (cl ? ' ' + cl : ''), t || '—'); }
  function cSt(el, t) { if (el) return chipOf(el); var tn = rqTone(t || ''); return mk('span', 'tqn-chip' + (tn ? ' is-' + tn : ''), t || '—'); }
  function chipStats(chips) { return chips.map(function (c) { var n = txt(c.querySelector('small')) || rqNum(c), lb = txt(c).replace(new RegExp(n.replace(/,/g, ',?') + '\\s*$'), '').trim(); return { t: lb, n: n, tone: rqTone(lb), on: c.classList.contains('is-on'), fn: function () { c.click(); } }; }); }
  function rqPages(root) {
    var on = rqOn(), H = document.documentElement;
    var pt = txt(document.getElementById('pv-title'));
    var page = on && RQI[on.t] && pt === on.t ? on.t : '';
    cls(H, 'tqn-rqp', !!page);
    if (!page) { try { srTabs(root); } catch (e) { void e; } return; }
    var I = RQI[page], C = { key: page, title: page, ic: I[0], sub: I[1] };
    if (page === 'طلبات الخدمات') return rqSrv(root, C);
    if (page === 'طلبات المتجر') return rqStore(root, C);
    if (page === 'عقود العملاء') return rqCt(root, C);
    return rqOffers(root, C);
  }
  /* طلبات الخدمات: بطاقات الطلبات (sr-brief) صفوفًا، وأرقام الحالات من بطاقات المنصة */
  function rqSrv(root, C) {
    var L = root.querySelector('.adm-live'); if (!L) return;
    if (L.querySelector(':scope > .sr-full, :scope > .sr-full-top')) { cls(document.documentElement, 'tqn-rqp', false); try { srTabs(root); } catch (e) { void e; } return; }
    var kp = [].slice.call(L.querySelectorAll('.cu-kpis .cu-kpi')), tools = L.querySelector(':scope > .m3-tools, :scope > .ax-tools');
    var secs = [].filter.call(L.querySelectorAll(':scope > section.t2-sec'), function (s) { return s.querySelector('.cf-srs'); });
    var cards = []; secs.forEach(function (s) { cards = cards.concat([].slice.call(s.querySelectorAll('.cf-srs > .sr-brief'))); });
    [].forEach.call(L.querySelectorAll(':scope > .ax-top, :scope > .cu-kpis'), function (x) { cls(x, 'tqn-hide', true); });
    if (tools) cls(tools, 'tqn-hide', true);
    secs.forEach(function (s) { cls(s, 'tqn-hide', true); });
    C.stats = kp.map(function (k) { var lb = rqLab(k); return { t: lb, n: rqNum(k), tone: k.classList.contains('is-warn') ? 'warn' : rqTone(lb), on: k.classList.contains('is-on'), fn: function () { k.click(); } }; });
    C.acts = tools ? [].filter.call(tools.querySelectorAll(':scope > button'), function (b) { return txt(b); }).map(function (b) { return { t: txt(b), fn: function () { b.click(); } }; }) : [];
    C.cols = ['الطلب', 'العميل', 'التفاصيل', 'الحالة'];
    C.items = cards.map(function (c) {
      var t = txt(c.querySelector('.sr-brief-t b')).split('·'), sm = txt(c.querySelector('.sr-brief-t small')).split('·');
      var inf = [].map.call(c.querySelectorAll('.sr-brief-i small'), function (x) { return txt(x); }).join(' · ');
      var b = c.querySelector('button');
      return { s: txt(c), c: [cNo((t[1] || '').trim(), (t[0] || '').trim()), cWho((sm[0] || '').trim(), (sm[1] || '').trim()), cTxt(inf), cSt(c.querySelector('.t2-pill'))], open: function () { if (b) b.click(); }, bt: 'فتح الطلب' };
    });
    C.sig = C.items.map(function (x) { return x.s; }).join('|') + C.stats.map(function (x) { return x.n + (x.on ? 1 : 0); }).join(',') + C.acts.map(function (a) { return a.t; }).join(',');
    C.empty = 'لا طلبات بهذه الحالة.';
    rqShell(L, secs[0] || null, C);
  }
  /* طلبات المتجر: صفوف صندوق «بانتظار إجراء» لشريحة المتجر وحدها */
  function rqStore(root, C) {
    var page = root.querySelector('.lv-page'); if (!page) return;
    var gl = page.querySelector(':scope > .nr-gl'), chw = page.querySelector(':scope > .st-chips-w');
    var sc = chw && [].filter.call(chw.querySelectorAll('.st-chip'), function (c) { return /^طلبات المتجر/.test(txt(c)); })[0];
    if (!sc || !sc.classList.contains('is-on')) return;
    cls(chw, 'tqn-hide', true); [].forEach.call(page.querySelectorAll(':scope > .cu-kpis'), function (x) { cls(x, 'tqn-hide', true); });
    if (gl) cls(gl, 'tqn-hide', true);
    var rows = gl ? [].slice.call(gl.querySelectorAll(':scope > article.nr')) : [];
    var late = rows.filter(function (r) { return /متأخر/.test(txt(r.querySelector('.t2-pill'))); }).length;
    var q = rows.filter(function (r) { return /عرض السعر/.test(txt(r.querySelector('.cu-ir-a'))); }).length;
    C.stats = [{ t: 'تنتظر إجراء', n: String(rows.length) }, { t: 'متأخرة', n: String(late), tone: late ? 'bad' : '' }, { t: 'عرض سعر', n: String(q) }, { t: 'تأكيد طلب', n: String(rows.length - q) }];
    C.cols = ['الطلب', 'العميل', 'الإجراء المطلوب', 'الحالة'];
    C.items = rows.map(function (r) {
      var go = r.querySelector('.nr-main') || r, cu = txt(r.querySelector('.cu-ir-c'));
      return { s: txt(r), c: [cNo(txt(r.querySelector('.cu-ir-no'))), cWho(cu && cu !== 'العميل' ? cu : '—'), cTxt(txt(r.querySelector('.cu-ir-a')), 'is-b'), cSt(r.querySelector('.t2-pill'))], open: function () { go.click(); } };
    });
    C.sig = C.items.map(function (x) { return x.s; }).join('|');
    C.empty = 'لا طلبات متجر تنتظر إجراءً الآن.';
    rqShell(page, gl, C);
  }
  /* العروض: صف لكل عرض — الرقم ورقم الطلب · العميل وطريقة التسليم · الإجمالي وصلاحيته · الحالة */
  function rqOffers(root, C) {
    var L = root.querySelector('.adm-live'); if (!L) return;
    var rows = [].slice.call(L.querySelectorAll('article.cu-bd-r')).filter(function (r) { return !(r.hidden || r.style.display === 'none'); });
    var chips = [].slice.call(L.querySelectorAll('.st-chip'));
    var list = rows[0] ? rows[0].parentNode : null;
    [].forEach.call(L.querySelectorAll(':scope > .t2-note, :scope > .cu-kpis, :scope > .adm-tools, :scope > .ax-tools, .st-chips-w'), function (x) { cls(x, 'tqn-hide', true); });
    [].forEach.call(L.querySelectorAll(':scope > .tqn-axw, :scope > .tqn-axs'), function (x) { x.parentNode.removeChild(x); }); L.__tqnAx = null; L.__tqnSm = null;
    if (list) cls(list, 'tqn-hide', true);
    var ref = list && list.parentNode === L ? list : (list ? list.closest('.adm-live > *') : null);
    C.stats = chipStats(chips);
    C.cols = ['العرض', 'العميل', 'الإجمالي والصلاحية', 'الحالة'];
    C.items = rows.map(function (r) {
      var QV = {}; [].forEach.call(r.querySelectorAll('.adm-cm-i'), function (i) { QV[txt(i.querySelector('small'))] = i.querySelector(':scope > :not(small)'); });
      var no = txt(r.querySelector('.ax-r-b > b, .ax-r-b > bdi, .ax-r-b bdi')), cu = tj(QV['العميل']).split(' · ');
      var tot = txt(QV['الإجمالي'] || QV['المبلغ']), till = txt(QV['صالح حتى']);
      var pl = null; Object.keys(QV).forEach(function (k) { var v = QV[k]; if (!pl && v) pl = v.matches('.t2-pill') ? v : v.querySelector('.t2-pill'); });
      var go = r.querySelector('.nr-main') || r;
      return { s: txt(r), c: [cNo(no, QV['الطلب'] ? 'الطلب ' + txt(QV['الطلب']) : ''), cWho(cu[0] && cu[0] !== 'العميل' ? cu[0] : '—', cu[1] || ''), cTxt((tot || '—') + (till ? ' · حتى ' + till : '')), cSt(pl, txt(QV['الحالة']))], open: function () { go.click(); } };
    });
    C.sig = C.items.map(function (x) { return x.s; }).join('|') + C.stats.map(function (x) { return x.n + (x.on ? 1 : 0); }).join(',');
    C.empty = 'لا عروض بهذه الحالة.';
    rqShell(L, ref, C);
  }
  /* عقود العملاء: صف لكل عميل — العقود والمتبقي · حالات العقود */
  function rqCt(root, C) {
    var box = root.querySelector('.cu-cards'), stack = box && box.parentNode; if (!box) return;
    var cards = [].slice.call(box.querySelectorAll(':scope > .cu-card')).filter(function (c) { return !c.getAttribute('data-k'); });
    var chips = [].slice.call(stack.querySelectorAll('.st-chip'));
    cls(box, 'tqn-hide', true);
    [].forEach.call(stack.querySelectorAll(':scope > .m3-tools, :scope > .ax-tools, :scope > .t2-note, :scope > .ax-top'), function (x) { cls(x, 'tqn-hide', true); });
    if (!box.__tqnMo) { try { box.__tqnMo = new MutationObserver(soon); box.__tqnMo.observe(box, { attributes: true, subtree: true, attributeFilter: ['style', 'hidden'] }); } catch (e) { void e; } }
    var vis = cards.filter(function (c) { return !(c.hidden || c.style.display === 'none'); });
    C.stats = chipStats(chips);
    C.cols = ['العميل', 'العقود', 'المتبقي', 'حالات العقود']; C.cls = 'is-ct';
    C.ph = 'ابحث باسم العميل…';
    C.items = vis.map(function (c) {
      var nm = txt(c.querySelector('.cu-card-t b')), sm = txt(c.querySelector('.cu-card-t small'));
      var n = (sm.match(/(\d+)\s*عقو?د/) || [])[1] || (/عقدان/.test(sm) ? '2' : /عقد واحد|^عقد\b/.test(sm) ? '1' : '—'), rm = (sm.match(/المتبقي\s*([\d٬,.]+\s*ر\.س)/) || ['', '—'])[1]; /* v824: «4 عقود» */
      var P = mk('div', 'tqn-ctp'); [].forEach.call(c.querySelectorAll('.cu-card-m .t2-pill'), function (p) { P.appendChild(chipOf(p)); });
      return { s: c.getAttribute('data-s') || txt(c), c: [cWho(nm), cTxt(n + ' ' + (n === '1' ? 'عقد' : 'عقود'), 'is-b'), cTxt(rm, 'is-b'), P.children.length ? P : null], open: function () { c.click(); }, bt: 'العقود' };
    });
    C.sig = C.items.map(function (x) { return x.s; }).join('|') + C.stats.map(function (x) { return x.n + (x.on ? 1 : 0); }).join(',');
    C.empty = 'لا عملاء بهذه الحالة.';
    rqShell(stack, box, C);
  }
  /* صفحة طلب الأهلية الكاملة: تبويبات — العمل على الطلب · الإسناد · المراسلة · مسار الطلب */
  /* v827: أزرار الطلب العامة (إلغاء الطلب · إرسال إشعار للعميل) ثابتة في رأس الطلب — لا تتنقّل مع التبويبات */
  function srFix(root) {
    var top = root.querySelector('.sr-full-top'), F = root.querySelector('.sr-full'); if (!top || !F) return;
    [].forEach.call(F.querySelectorAll(':scope > .t2-pb-actions'), function (pa) { cls(pa, 'tqn-sr-acts', true); top.appendChild(pa); });
  }
  function srTabs(root) {
    var F = root.querySelector('.sr-full'); if (!F) return;
    try { srFix(root); } catch (e) { void e; }
    var G = { 'العمل على الطلب': [], 'الإسناد': [], 'المراسلة': [], 'مسار الطلب': [] };
    [].forEach.call(F.children, function (x) {
      if (x.classList.contains('tqn-st')) return;
      var h = txt(x.querySelector(':scope > .t2-sec-h .t2-group-t, :scope > .t2-sec-h h2, :scope > header h2, :scope > h3'));
      var k = /الإسناد/.test(h) ? 'الإسناد' : /مسار|السجل/.test(h) ? 'مسار الطلب' : x.matches('.sr-msg') || /مراسلة|رسالة/.test(h) ? 'المراسلة' : 'العمل على الطلب';
      G[k].push(x);
    });
    var K = Object.keys(G).filter(function (k) { return G[k].length; }); if (K.length < 2) return;
    var cur = K.indexOf(ST.srT) >= 0 ? ST.srT : K[0];
    var first = F.firstElementChild && F.firstElementChild.classList.contains('tqn-st') ? F.firstElementChild.nextElementSibling : F.firstElementChild;
    var b = bar(F, first, K.map(function (k) { return { k: k, t: k }; }), cur, 'k', function (k) { ST.srT = k; });
    cls(b, 'is-set', true); cls(b, 'tqn-drt', true);
    K.forEach(function (k) { G[k].forEach(function (x) { cls(x, 'tqn-st-hide', k !== cur); }); });
  }
  /* ── 8) v764: صفحات التفاصيل داخل الصفحة (لا أدراج): القائمة الجانبية والهيدر ظاهران، ورأس صفحة، وأيقونة لكل معلومة ── */
  var TQIC = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16.5c.8-1.6 5.6-1.6 6.4 0M14.5 10h4M14.5 13.5h3"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
    play: '<circle cx="12" cy="12" r="8.5"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
    note: '<path d="M6 3.5h8.5l4 4V20.5H5.5V3.5z"/><path d="M14 3.5V8h4.5M8.5 12.5h7M8.5 16h4.5"/>',
    ok: '<circle cx="12" cy="12" r="8.5"/><path d="M8.3 12.2l2.5 2.5 4.9-5.4"/>',
    flag: '<path d="M5.5 21V4M5.5 4.5h11l-2.2 4 2.2 4h-11"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-10.8a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    work: '<rect x="3" y="7.5" width="18" height="12.5" rx="2.5"/><path d="M9 7.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18"/>',
    money: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    clip: '<path d="M19.5 11.5l-7.8 7.8a4.6 4.6 0 0 1-6.5-6.5l8.3-8.3a3.1 3.1 0 0 1 4.4 4.4l-8.2 8.2a1.5 1.5 0 0 1-2.2-2.2l7.4-7.4"/>',
    rocket: '<path d="M5 15c-1 1-1.5 3.5-1.5 5.5 2 0 4.5-.5 5.5-1.5M9 15l-3-3c1.5-4.5 5.5-8 12.5-8.5-.5 7-4 11-8.5 12.5z"/><circle cx="14.5" cy="9.5" r="1.6"/>',
    crown: '<path d="M3.5 8l4 3.5L12 5l4.5 6.5 4-3.5-1.5 10.5H5z"/><path d="M5 20.5h14"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M15.5 5.2a3.4 3.4 0 0 1 0 6.6M18 14.3c2 .8 3.5 2.8 3.5 5.7"/>',
    home: '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
    hash: '<path d="M5 9h15M4 15h15M10 3.5L8 20.5M16 3.5l-2 17"/>',
    card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'
  };
  /* أيقونة المعلومة من اسمها (الترتيب مقصود: الأدق أولًا) */
  var LI = [
    [/صاحب الملف|المسؤول|أسنده|دشّنه|بواسطة|الموظف/, 'user'], [/الرمز البريدي|صندوق البريد|منطقة|مدينة|الحي/, 'pin'], [/البريد|الإيميل/, 'mail'], [/جوال|هاتف|التواصل/, 'phone'],
    [/جنسي|دولة|بلد/, 'flag'], [/ساعة|وقت|المدة/, 'clock'], [/ميلاد|تاريخ|انتهاء|إصدار|صالحة|يوم|أُرسل|استُلم|اعتُمد/, 'cal'],
    [/عنوان|مدينة|الحي|شارع|مبنى|المنطقة|الإضافي|الوحدة|الموقع/, 'pin'],
    [/وظيف|جهة العمل|مهنة|العمل|القطاع|المسمى|الخدمة/, 'work'],
    [/راتب|دخل|التزام|مبلغ|قسط|إيجار|رصيد/, 'money'],
    [/مرفق|صورة|مستند|ملف/, 'clip'], [/اجتماعي|أفراد|معال|الأسرة|التابع/, 'users'], [/سكن/, 'home'],
    [/نقاط/, 'star'], [/البطاقة|المستوى|العضوية/, 'crown'], [/فيلم|شاهد/, 'play'],
    [/ملاحظة|سبب|رسالة/, 'note'], [/الحالة|الدور/, 'shield'],
    [/رقم|الهوية|الإقامة|الوثيقة|طلب/, 'hash'],
    [/اسم|العميل|صاحب|دشّنه|المسؤول|أسند|الموظف|بواسطة/, 'user']
  ];
  function tqIc(n) { var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'tqn-svg'); s.innerHTML = TQIC[n] || TQIC.note; return s; }
  function icOf(label) { for (var i = 0; i < LI.length; i++) if (LI[i][0].test(label)) return LI[i][1]; return 'list'; }
  function icBox(n, c) { var i = mk('i', c || 'tqn-ico'); i.appendChild(tqIc(n)); return i; }
  function toneOf(t) { return /مُدشَّن|معتمد|مطابق|نشط|نعم|مكتمل/.test(t) && !/غير|بانتظار/.test(t) ? 'ok' : /مرفوض|غير مطابق|أُعيد|موقوف|لا$/.test(t) ? 'bad' : /قيد|بانتظار|مراجعة|جديد/.test(t) ? 'warn' : ''; }

  /* داخل الصفحة: الدرج يغطي منطقة المحتوى فقط تحت الهيدر، والقائمة الجانبية تبقى ثابتة وظاهرة */
  function inPage() {
    var H = document.documentElement, d = document.querySelector('.cu-dh .cu-dr.is-page.is-on.tqn-dr-cu'), was = H.classList.contains('tqn-inpg');
    cls(H, 'tqn-inpg', !!d);
    /* الهيدر والقائمة الجانبية في مكانهما: الصفحة إلى أعلاها عند الفتح، وتعود لموضعها عند الإغلاق */
    if (!d) { if (was && ST.__pgY != null) { try { window.scrollTo(0, ST.__pgY); } catch (e) { void e; } } ST.__pgY = null; return; }
    if (!was) { ST.__pgY = window.scrollY || 0; try { window.scrollTo(0, 0); } catch (e) { void e; } }
    var hd = document.querySelector('#pv-host .t2-head') || document.querySelector('.t2-head');
    var t = hd ? Math.max(0, Math.round(hd.getBoundingClientRect().bottom)) : 0;
    if (H.style.getPropertyValue('--tqn-pg-t') !== t + 'px') H.style.setProperty('--tqn-pg-t', t + 'px');
  }
  /* التنقّل من القائمة الجانبية أو الهيدر وصفحة تفاصيل مفتوحة: تُغلق أولًا ثم يكمل التنقّل */
  try {
    document.addEventListener('click', function (ev) {
      var t = ev.target; if (!t || !t.closest || !document.documentElement.classList.contains('tqn-inpg')) return;
      if (!t.closest('.t2-side button, .t2-side a, #pv-host .t2-head button, #pv-host .t2-head a, .t2-mnav button, .t2-mnav a')) return;
      [].forEach.call(document.querySelectorAll('.cu-dh .cu-dr.is-page.is-on.tqn-dr-cu'), function (d) { try { if (d.__close) d.__close(); } catch (e) { void e; } });
      cls(document.documentElement, 'tqn-inpg', false); ST.__pgY = null;
    }, true);
  } catch (e) { void e; }

  /* رأس الصفحة: حرف صاحب الملف · الاسم · وسوم (نوع الصفحة · الحالة · ...) · أزرار الصفحة */
  function pgHead(d) {
    var h = d.querySelector('.cu-dr-h'); if (!h) return;
    cls(d, 'tqn-pg', true);
    var b = h.querySelector(':scope > div > b'), sp = h.querySelector(':scope > div > span'); if (!b) return;
    var name = txt(b), sub = txt(sp), sig = name + '|' + sub, M = h.__tqnM;
    if (!(M && M.parentNode && M.__sig === sig)) {
      if (M && M.parentNode) M.parentNode.removeChild(M);
      M = mk('div', 'tqn-pg-tags'); M.__sig = sig;
      sub.split('·').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (p, i) { var t = toneOf(p); M.appendChild(mk('span', 'tqn-pg-tag' + (i === 0 ? ' is-kind' : '') + (t ? ' is-' + t : ''), p)); });
      b.parentNode.insertBefore(M, sp || null); h.__tqnM = M;
    }
    if (sp) cls(sp, 'tqn-hide', true);
    var av = h.__tqnAv, L = String(name || '؟').replace(/^(ال)/, '').slice(0, 1);
    if (!(av && av.parentNode === h)) { av = mk('i', 'tqn-pg-av'); h.insertBefore(av, h.firstChild); h.__tqnAv = av; }
    if (av.textContent !== L) av.textContent = L;
    var A = h.__tqnA; if (!(A && A.parentNode === h)) { A = mk('div', 'tqn-pg-acts'); var x = h.querySelector(':scope > .st-sheet-x'); h.insertBefore(A, x || null); h.__tqnA = A; }
    return A;
  }
  /* حقول الأقسام: أيقونة لكل معلومة (مرة واحدة لكل حقل) */
  function dsIcons(d) {
    [].forEach.call(d.querySelectorAll('.cu-dr-b section.cu-ds.tqn-ds .t2-field > .t2-field-k'), function (k) {
      var f = k.parentNode; if (k.__tqnI || !f.querySelector(':scope > .t2-field-v')) return; k.__tqnI = 1; cls(f, 'tqn-fi', true); f.insertBefore(icBox(icOf(txt(k)), 'tqn-ico is-f'), k);
    });
  }
  function fld(label, valNode, n) { var r = mk('div', 'tqn-kv'); r.appendChild(icBox(n || icOf(label))); var s = mk('span'); s.appendChild(mk('small', '', label)); var b = mk('b'); if (valNode) b.appendChild(valNode); else b.textContent = '—'; s.appendChild(b); r.appendChild(s); return r; }
  function tqBox(title, n, kids, cl) { var s = mk('section', 'tqn-box' + (cl ? ' ' + cl : '')); var h = mk('h3', 'tqn-box-h'); h.appendChild(icBox(n)); h.appendChild(mk('span', '', title)); s.appendChild(h); kids.forEach(function (k) { if (k) s.appendChild(k); }); return s; }

  /* تفاصيل التدشين — بعد التدشين: أرقام · البطاقة بجانب مسار التدشين · بيانات الملف · وكل حقل لم يُعرض في «تفاصيل أخرى» */
  function lchPage(d) {
    var b = d.querySelector('.cu-dr-b'); if (!b) return;
    var A = d.querySelector('.cu-dr-h') && d.querySelector('.cu-dr-h').__tqnA;
    var grid = b.querySelector(':scope > .lch-grid');
    cls(b, 'tqn-lchp', !!grid);
    [].forEach.call(b.querySelectorAll('section.cu-ds'), function (s) { cls(s, 'tqn-ds', true); });
    if (grid) { lchPend(b); return; }
    var card = b.querySelector(':scope > .lch-mc');
    if (!card || b.querySelector(':scope > .tqn-lx')) return;
    var F = {}, O = [], secs = [].slice.call(b.querySelectorAll(':scope > section.cu-ds'));
    secs.forEach(function (s) { var st = txt(s.querySelector('.cu-ds-h')); [].forEach.call(s.querySelectorAll('.t2-field'), function (f) { var k = txt(f.querySelector('.t2-field-k')), v = f.querySelector('.t2-field-v'); if (k && v && !(k in F)) { F[k] = v; O.push([st, k]); } }); });
    var used = { 'البطاقة الممنوحة': 1, 'رقم العضوية': 1, 'العميل': 1 };
    function val(k) { used[k] = 1; var v = F[k]; return v ? v.cloneNode(true) : null; }
    var X = mk('div', 'tqn-lx');
    var S = mk('div', 'tqn-lx-st');
    [['الحالة', 'shield'], ['نقاط التدشين', 'star'], ['صالحة حتى', 'cal', 'العضوية صالحة حتى'], ['شاهد العميل الفيلم', 'play']].forEach(function (x) {
      if (!F[x[0]]) return; var t = mk('div', 'tqn-lx-t'); var tt = toneOf(txt(F[x[0]])); if (tt) cls(t, 'is-' + tt, true);
      t.appendChild(icBox(x[1])); var s = mk('span'); s.appendChild(mk('small', '', x[2] || x[0])); var vb = mk('b'); vb.appendChild(val(x[0])); s.appendChild(vb); t.appendChild(s); S.appendChild(t);
    });
    X.appendChild(S);
    var G = mk('div', 'tqn-lx-g'), CA = mk('div', 'tqn-lx-a'), CB = mk('div', 'tqn-lx-b');
    CA.appendChild(card);
    /* مسار التدشين: اعتماد الملف ← التدشين (من ومتى) ← الملاحظة */
    var tl = mk('ol', 'tqn-ltl');
    function step(t, n, v, sub) { var li = mk('li'); li.appendChild(icBox(n)); var s = mk('span'); s.appendChild(mk('b', '', t)); if (v) { var x = mk('small'); x.appendChild(v); s.appendChild(x); } if (sub) s.appendChild(mk('small', 'is-by', sub)); li.appendChild(s); tl.appendChild(li); }
    if (F['اعتُمد الملف']) step('اعتُمد الملف', 'ok', val('اعتُمد الملف'));
    if (F['يوم وتاريخ وساعة التدشين'] || F['دشّنه']) step('دُشّن الحساب', 'rocket', val('يوم وتاريخ وساعة التدشين'), F['دشّنه'] ? 'بواسطة ' + txt(val('دشّنه')) : '');
    var kids = [tl];
    if (F['ملاحظة']) { var q = mk('blockquote', 'tqn-lq'); q.appendChild(icBox('note')); var qs = mk('span'); qs.appendChild(mk('small', '', 'ملاحظة التدشين')); var qb = mk('b'); qb.appendChild(val('ملاحظة')); qs.appendChild(qb); q.appendChild(qs); kids.push(q); }
    CB.appendChild(tqBox('مسار التدشين', 'rocket', kids, 'is-tl'));
    /* بيانات الملف وبقية الحقول — لا يضيع شيء */
    var groups = {};
    O.forEach(function (o) { if (used[o[1]]) return; (groups[o[0]] = groups[o[0]] || []).push(o[1]); });
    Object.keys(groups).forEach(function (g) {
      var L = mk('div', 'tqn-kvs'); groups[g].forEach(function (k) { L.appendChild(fld(k, val(k))); });
      CB.appendChild(tqBox(/الملف/.test(g) ? 'بيانات الملف' : /تفاصيل التدشين/.test(g) ? 'تفاصيل أخرى' : g, /الملف/.test(g) ? 'id' : 'list', [L]));
    });
    G.appendChild(CA); G.appendChild(CB); X.appendChild(G);
    /* أزرار الأقسام (مثل «إعادة إرسال رسالة التدشين»): في رأس الصفحة */
    if (A) { while (A.firstChild) A.removeChild(A.firstChild); [].forEach.call(b.querySelectorAll('section.cu-ds .cu-dr-fa button, section.cu-ds .cu-dr-fa a'), function (x) { A.appendChild(x); }); }
    secs.forEach(function (s) { cls(s, 'tqn-hide', true); });
    b.insertBefore(X, b.firstChild);
  }
  /* قبل التدشين: الخطوات شريط تقدّم (الحالة من لون المنصة)، والأقسام بطاقات بأيقونات */
  function lchPend(b) {
    var ol = b.querySelector(':scope > .lch-steps'); if (!ol) return;
    [].forEach.call(ol.children, function (li) { var st = li.getAttribute('style') || '', c = li.className || ''; cls(li, 'is-done', /18,\s*121,\s*92|is-done|is-ok/.test(st + ' ' + c)); cls(li, 'is-cur', /0AA5AD|is-on|is-cur/i.test(st + ' ' + c)); });
  }
  /* ── 9) v766: طلب التوثيق «بندًا بندًا» — قائمة الأقسام بنسبة إنجاز كل قسم · بند واحد كبير في الوسط بزرّي مطابق/غير مطابق · انتقال تلقائي للبند التالي · شريط قرار ثابت ── */
  /* المنصة تعيد رسم الطلب كاملًا بعد كل إجراء؛ نحفظ موضع المراجعة (القسم · البند · الوضع) ونعيد البناء من رسمها الجديد. عناصر المنصة تُنقل كما هي (بأزرارها) ولا تُنسخ. */
  ST.fx = ST.fx || {};
  function itSt(it) { return it.classList.contains('is-mismatch') ? 'bad' : it.classList.contains('is-pend') ? 'pend' : 'ok'; }
  function itLab(it) { var b = it.querySelector('.vr3-it-l b'); return txt(b) || txt(it.querySelector('.vr3-it-l')).replace(/·.*$/, '').trim(); }
  function fxModel(v) {
    var S = [];
    [].forEach.call(v.querySelectorAll('section.vr3-sec'), function (s) {
      if (s.querySelector(':scope > .vr3-tabs') || s.matches('.vr3-log')) return;
      var t = txt(s.querySelector('h3')); if (!t) return;
      var g = s.querySelector(':scope > .vr3-grid');
      var its = g ? [].slice.call(g.querySelectorAll(':scope > .vr3-it')) : [];
      var m = txt(s.querySelector('.vr3-sec-m') || s.querySelector('.vr3-sec-h')), mm = m.match(/(\d+)\s*من\s*(\d+)/);
      var n = its.length || (mm ? +mm[2] : 0);
      var ok = its.length ? its.filter(function (i) { return itSt(i) === 'ok'; }).length : (mm ? +mm[1] : 0);
      var bad = its.filter(function (i) { return itSt(i) === 'bad'; }).length;
      var pend = its.length ? its.filter(function (i) { return itSt(i) === 'pend'; }).length : Math.max(0, n - ok);
      S.push({ t: t, s: s, its: its, n: n, ok: ok, bad: bad, pend: pend, open: !!g });
    });
    return S;
  }
  var FXV = null;
  function fxPark(el) { if (!el || el.__tqnPh || !el.parentNode) return; var ph = document.createComment('tqn'); el.parentNode.insertBefore(ph, el); el.__tqnPh = ph; if (FXV) (FXV.__tqnMv = FXV.__tqnMv || []).push(el); }
  function fxBack(el) { var ph = el && el.__tqnPh; if (!ph) return; if (ph.parentNode) ph.parentNode.insertBefore(el, ph); if (ph.parentNode) ph.parentNode.removeChild(ph); el.__tqnPh = null; }
  function fxNextPend(S, si, ii) {
    for (var a = si; a < S.length; a++) { var its = S[a].its; for (var b = a === si ? ii + 1 : 0; b < its.length; b++) if (itSt(its[b]) === 'pend') return [a, b]; }
    for (var c = 0; c <= si && c < S.length; c++) { var J = S[c].its; for (var e = 0; e < J.length; e++) if (itSt(J[e]) === 'pend' && !(c === si && e === ii)) return [c, e]; }
    return null;
  }
  function vrPage(d) {
    var v = d.querySelector('.vr3'); if (!v) return; cls(v, 'tqn-vr3', true);
    var H = txt(d.querySelector('.cu-dr-h > div > b')) + ' ' + txt(d.querySelector('.cu-dr-h > div > span'));
    [].forEach.call(v.querySelectorAll('.vr3-kvs > .vr3-kv'), function (kv) {
      var val = txt(kv.querySelector(':scope > :not(small):not(.tqn-ico)')); cls(kv, 'tqn-hide', !!val && val.length > 1 && H.indexOf(val) >= 0);
      if (!kv.__tqnI) { kv.__tqnI = 1; kv.insertBefore(icBox(icOf(txt(kv.querySelector('small')))), kv.firstChild); }
    });
    [].forEach.call(v.querySelectorAll('section.vr3-sec'), function (s) { cls(s, 'tqn-vr-dec', !!s.querySelector(':scope > .vr3-tabs')); });
    [].forEach.call(v.querySelectorAll('.vr3-it'), function (it) {
      if (!it.__tqnI) { it.__tqnI = 1; it.insertBefore(icBox(icOf(itLab(it)), 'tqn-ico is-it'), it.firstChild); }
      [].forEach.call(it.querySelectorAll(':scope > .vr3-acts > .t2-btn'), function (b) { var t = txt(b); cls(b, 'tqn-fx-ok', /^مطابق$/.test(t)); cls(b, 'tqn-fx-no', /^غير مطابق$/.test(t)); cls(b, 'tqn-fx-2', !/^(مطابق|غير مطابق)$/.test(t)); });
    });
    /* يُعاد البناء عند أي تغيّر في حالات البنود (رسم جديد أو تغيير في المكان) */
    var sig = [].map.call(v.querySelectorAll('.vr3-it'), itSt).join('') + '|' + v.querySelectorAll('.vr3-it .vr3-box').length + '|' + v.querySelectorAll('section.vr3-sec > .vr3-grid').length + '|' + v.querySelectorAll('section.vr3-sec').length;
    if (v.__tqnFx === sig && v.__tqnW && v.__tqnW.parentNode === v) return;
    v.__tqnFx = sig; fxRender(d, v);
  }
  function fxRender(d, v) {
    var key = d.getAttribute('data-r') || 'vr', F = ST.fx[key] = ST.fx[key] || { mode: '', sec: '', lab: '', st: '' };
    cls(v, 'tqn-fx', true);
    /* أعِد كل ما نقلناه سابقًا إلى مكانه قبل القراءة والبناء */
    var W = v.__tqnW;
    FXV = v; (v.__tqnMv || []).splice(0).forEach(fxBack); if (W && W.parentNode) W.parentNode.removeChild(W);
    var S = fxModel(v);
    var dec = v.querySelector('section.tqn-vr-dec'), msg = v.querySelector('.sr-msg'), log = v.querySelector('.vr3-log'), top = v.querySelector('.vr3-top');
    /* الموضع: البند الذي كنا عليه؛ وإن حُسم للتو (كان بانتظار) ننتقل للبند التالي المعلّق */
    var si = -1, ii = -1;
    S.forEach(function (x, a) { if (x.t === F.sec) { si = a; x.its.forEach(function (it, b) { if (itLab(it) === F.lab) ii = b; }); } });
    var flash = '';
    if (si >= 0 && ii >= 0 && F.st === 'pend' && itSt(S[si].its[ii]) !== 'pend' && !S[si].its[ii].querySelector('.vr3-box')) {
      flash = [itLab(S[si].its[ii]), itSt(S[si].its[ii])];
      var nx = fxNextPend(S, si, ii); if (nx) { si = nx[0]; ii = nx[1]; } else if (dec) F.mode = 'dec';
    }
    if (si < 0) { var fp = fxNextPend(S, 0, -1); if (fp) { si = fp[0]; ii = fp[1]; } else { si = S.length ? 0 : -1; ii = si >= 0 && S[0].its.length ? 0 : -1; if (dec && !F.mode && S.length) F.mode = 'dec'; } }
    if (si >= 0 && ii < 0 && S[si].its.length) ii = 0;
    var cur = si >= 0 && ii >= 0 ? S[si].its[ii] : null;
    F.sec = si >= 0 ? S[si].t : ''; F.lab = cur ? itLab(cur) : ''; F.st = cur ? itSt(cur) : '';
    var mode = F.mode || 'item';
    var tot = 0, ok = 0, bad = 0, pend = 0; S.forEach(function (x) { tot += x.n; ok += x.ok; bad += x.bad; pend += x.pend; });
    function go(a, b, m) { if (a >= 0) { F.sec = S[a].t; F.lab = b >= 0 && S[a].its[b] ? itLab(S[a].its[b]) : ''; F.st = b >= 0 && S[a].its[b] ? itSt(S[a].its[b]) : ''; } F.mode = m || ''; fxRender(d, v); var p = d.querySelector('.cu-dr-p'); if (p) p.scrollTop = 0; }
    v.__tqnGo = go;
    W = mk('div', 'tqn-fx-w' + (mode !== 'item' ? ' is-' + mode : '')); v.__tqnW = W; v.appendChild(W);
    /* 1) قائمة الأقسام */
    var N = mk('aside', 'tqn-fx-nav');
    var pc = tot ? Math.round((ok + bad) / tot * 100) : 0;
    var ring = mk('div', 'tqn-fx-ring'); ring.style.setProperty('--p', pc); ring.appendChild(mk('b', '', pc + '%')); ring.appendChild(mk('small', '', 'تمت مراجعته'));
    var sumL = mk('div', 'tqn-fx-sum');
    [['ok', ok, 'مطابق'], ['bad', bad, 'غير مطابق'], ['pend', pend, 'متبقٍ']].forEach(function (x) { var r = mk('span', 'is-' + x[0]); r.appendChild(mk('b', '', String(x[1]))); r.appendChild(mk('small', '', x[2])); sumL.appendChild(r); });
    var hd = mk('div', 'tqn-fx-nh'); hd.appendChild(ring); hd.appendChild(sumL); N.appendChild(hd);
    var L = mk('ol', 'tqn-fx-secs');
    S.forEach(function (x, a) {
      var li = mk('li', 'tqn-fx-sec' + (a === si && mode === 'item' ? ' is-on' : '') + (x.pend === 0 && x.n ? (x.bad ? ' is-bad' : ' is-done') : ''));
      var bt = mk('button', 'tqn-fx-sb'); bt.type = 'button'; bt.setAttribute('data-live-ok', '');
      var ic0 = s0ic(x.s); bt.appendChild(ic0);
      var tx = mk('span', 'tqn-fx-st'); tx.appendChild(mk('b', '', x.t)); var bar = mk('i', 'tqn-fx-bar'); var fill = mk('i'); fill.style.width = (x.n ? Math.round((x.ok + x.bad) / x.n * 100) : 0) + '%'; bar.appendChild(fill); tx.appendChild(bar); bt.appendChild(tx);
      bt.appendChild(mk('em', '', (x.ok + x.bad) + '/' + x.n));
      bt.addEventListener('click', function () {
        if (!x.open) { var ex = [].filter.call(x.s.querySelectorAll('.vr3-sec-h button, :scope > button'), function (q) { return /عرض|إظهار|فتح|البنود/.test(txt(q)); })[0]; F.sec = x.t; F.lab = ''; F.mode = ''; if (ex) { ex.click(); return; } }
        var p0 = -1; x.its.forEach(function (it, b) { if (p0 < 0 && itSt(it) === 'pend') p0 = b; });
        go(a, p0 >= 0 ? p0 : 0, '');
      });
      li.appendChild(bt);
      if (a === si && mode === 'item' && x.its.length) {
        var IL = mk('ul', 'tqn-fx-its');
        x.its.forEach(function (it, b) {
          var r = mk('li'); var q = mk('button', 'tqn-fx-ib is-' + itSt(it) + (b === ii ? ' is-on' : '')); q.type = 'button'; q.setAttribute('data-live-ok', '');
          q.appendChild(mk('i')); q.appendChild(mk('span', '', itLab(it)));
          q.addEventListener('click', function () { go(a, b, ''); }); r.appendChild(q); IL.appendChild(r);
        });
        li.appendChild(IL);
      }
      L.appendChild(li);
    });
    N.appendChild(L);
    if (top) { var dt = mk('details', 'tqn-fx-info'); var sm = mk('summary', '', 'تفاصيل الطلب والإسناد'); dt.appendChild(sm); fxPark(top); dt.appendChild(top); N.appendChild(dt); }
    W.appendChild(N);
    /* 2) المسرح: بند واحد · أو القرار · أو المراسلة · أو السجل */
    var G = mk('section', 'tqn-fx-stage');
    if (mode === 'item' && cur) {
      var x0 = S[si];
      var sh = mk('div', 'tqn-fx-sh');
      var shT = mk('div'); shT.appendChild(mk('small', '', x0.t)); shT.appendChild(mk('b', '', 'البند ' + (ii + 1) + ' من ' + x0.its.length)); sh.appendChild(shT);
      var nv = mk('div', 'tqn-fx-pn');
      var flat = []; S.forEach(function (x, a) { x.its.forEach(function (it, b) { flat.push([a, b]); }); });
      var k = -1; flat.forEach(function (p, j) { if (p[0] === si && p[1] === ii) k = j; });
      var pv = btn('‹ السابق', 'is-sm', function () { var p = flat[k - 1]; if (p) go(p[0], p[1], ''); }, k <= 0);
      var nt = btn('التالي ›', 'is-sm', function () { var p = flat[k + 1]; if (p) go(p[0], p[1], ''); }, k < 0 || k >= flat.length - 1);
      nv.appendChild(pv); nv.appendChild(nt); sh.appendChild(nv); G.appendChild(sh);
      if (flash) { var fl = mk('div', 'tqn-fx-flash is-' + flash[1]); fl.appendChild(tqIc(flash[1] === 'bad' ? 'note' : 'ok')); fl.appendChild(mk('span', '', 'سُجّل «' + flash[0] + '» ' + (flash[1] === 'bad' ? 'غير مطابق' : 'مطابق') + ' — هذا البند التالي.')); G.appendChild(fl); }
      /* رسائل القسم وتنبيهاته (نتيجة إجراء القسم · حقول ناقصة) تظهر هنا بدل أن تختفي مع القسم */
      [].forEach.call(x0.s.children, function (c) { if (c.matches('.vr3-sec-h, .vr3-grid, .tqn-vr-why') || !txt(c)) return; fxPark(c); cls(c, 'tqn-fx-msg', true); G.appendChild(c); });
      var card = mk('div', 'tqn-fx-card is-' + itSt(cur) + (cur.querySelector(':scope > .vr3-box') ? ' has-box' : '')); fxPark(cur); card.appendChild(cur); G.appendChild(card);
      var nxp = fxNextPend(S, si, ii);
      G.appendChild(mk('p', 'tqn-fx-hint', itSt(cur) === 'pend' ? 'اختر «مطابق» أو «غير مطابق» — تنتقل تلقائيًا إلى البند التالي. الأسهم ← → للتنقّل.' : (nxp ? 'حُسم هذا البند. التالي المعلّق: ' + itLab(S[nxp[0]].its[nxp[1]]) : 'لا بنود معلّقة — يمكنك اتخاذ القرار.')));
      if (!nxp && itSt(cur) !== 'pend' && dec) G.appendChild(btn('اتخاذ القرار', 'is-pri', function () { go(-1, -1, 'dec'); }));
      var sa = x0.s.querySelector(':scope > .vr3-sec-h .vr3-acts');
      if (sa) [].forEach.call(sa.querySelectorAll('.t2-btn'), function (q) { cls(q, 'tqn-hide', /^طيّ/.test(txt(q))); });
      if (sa && sa.children.length) { var sb = mk('div', 'tqn-fx-sa'); sb.appendChild(mk('small', '', 'على القسم كاملًا «' + x0.t + '»:')); fxPark(sa); sb.appendChild(sa); G.appendChild(sb); }
    } else if (mode === 'item') {
      var x1 = si >= 0 ? S[si] : null;
      var em = mk('div', 'tqn-fx-empty'); em.appendChild(icBox('ok')); em.appendChild(mk('b', '', x1 ? (x1.pend ? 'بنود القسم «' + x1.t + '» غير معروضة' : 'القسم «' + x1.t + '» مكتمل') : 'لا بنود في هذا الطلب'));
      em.appendChild(mk('small', '', x1 ? (x1.ok + ' مطابق · ' + x1.bad + ' غير مطابق من ' + x1.n) : ''));
      G.appendChild(em);
    } else {
      var back = btn('‹ العودة إلى البنود', 'is-sm', function () { F.mode = ''; fxRender(d, v); });
      var mh = mk('div', 'tqn-fx-sh'); var mt = mk('div'); mt.appendChild(mk('small', '', 'طلب التوثيق')); mt.appendChild(mk('b', '', mode === 'dec' ? 'القرار' : mode === 'msg' ? 'المراسلة مع صاحب الملف' : 'السجل والملاحظات')); mh.appendChild(mt); mh.appendChild(back); G.appendChild(mh);
      var el = mode === 'dec' ? dec : mode === 'msg' ? msg : log;
      if (el) { fxPark(el); if (el.tagName === 'DETAILS') el.open = true; G.appendChild(el); }
      if (mode === 'dec' && pend) G.appendChild(mk('p', 'tqn-fx-warn', 'تنبيه: ما زال ' + pend + ' بندًا بانتظار المطابقة.'));
    }
    W.appendChild(G);
    /* 3) شريط القرار الثابت */
    var B = mk('div', 'tqn-fx-dock');
    var cnt = mk('div', 'tqn-fx-cnt');
    [['ok', ok, 'مطابق'], ['bad', bad, 'غير مطابق'], ['pend', pend, 'متبقٍ']].forEach(function (x) { var r = mk('span', 'is-' + x[0]); r.appendChild(mk('b', '', String(x[1]))); r.appendChild(document.createTextNode(' ' + x[2])); cnt.appendChild(r); });
    B.appendChild(cnt);
    var ba = mk('div', 'tqn-fx-da');
    if (msg) ba.appendChild(btn('المراسلة', 'is-sm' + (mode === 'msg' ? ' is-on' : ''), function () { go(-1, -1, mode === 'msg' ? '' : 'msg'); }));
    if (log) ba.appendChild(btn('السجل', 'is-sm' + (mode === 'log' ? ' is-on' : ''), function () { go(-1, -1, mode === 'log' ? '' : 'log'); }));
    if (dec) ba.appendChild(btn('اتخاذ القرار', 'is-pri' + (mode === 'dec' ? ' is-on' : ''), function () { go(-1, -1, mode === 'dec' ? '' : 'dec'); }));
    B.appendChild(ba); W.appendChild(B);
    /* «الانتقال إلى القرار» في الملخص يفتح القرار هنا */
    [].forEach.call(W.querySelectorAll('.vr3-link'), function (a) {
      if (a.__tqn) return; a.__tqn = 1;
      a.addEventListener('click', function (ev) {
        var t = txt(a);
        if (/^الانتقال إلى القرار|^القرار$/.test(t)) { ev.preventDefault(); ev.stopPropagation(); go(-1, -1, 'dec'); return; }
        /* روابط «القسم — البند» في القرار: تفتح البند نفسه في شاشة المراجعة */
        var pr = t.split(' — '), sec = (pr[0] || '').trim(), lab = (pr.slice(1).join(' — ') || '').trim();
        S.forEach(function (x, a2) { if (x.t === sec) { F.sec = x.t; F.lab = lab; F.st = ''; F.mode = ''; } });
        if (F.mode === '' && F.sec === sec) { var hit = -1; S.forEach(function (x, a2) { if (x.t === sec) x.its.forEach(function (it, b2) { if (itLab(it) === lab) hit = [a2, b2]; }); }); if (hit !== -1) { ev.preventDefault(); ev.stopPropagation(); go(hit[0], hit[1], ''); } }
      }, true);
    });
  }
  function s0ic(s) { var o = s.querySelector('.vr3-sec-ic'); var i = mk('i', 'tqn-fx-si'); if (o && o.firstElementChild) i.appendChild(o.firstElementChild.cloneNode(true)); else i.appendChild(tqIc('list')); return i; }
  /* الأسهم: التنقّل بين البنود (خارج حقول الكتابة) */
  try {
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
      var t = ev.target; if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
      var d = document.querySelector('.cu-dh .cu-dr.is-page.is-on'), v = d && d.querySelector('.vr3.tqn-fx'); if (!v || !v.__tqnW) return;
      var b = [].filter.call(v.__tqnW.querySelectorAll('.tqn-fx-pn .tqn-b'), function (x) { return /التالي|السابق/.test(txt(x)); });
      var want = ev.key === 'ArrowLeft' ? /التالي/ : /السابق/;
      var hit = b.filter(function (x) { return want.test(txt(x)) && !x.disabled; })[0]; if (hit) { ev.preventDefault(); hit.click(); }
    });
  } catch (e) { void e; }
  /* ── 10) v770: تقرير العميل (السجل الائتماني) — أقسام التقرير تبويبات ظاهرة بدل القائمة المنسدلة ── */
  function rpPage(root) {
    var pg = root.querySelector('.lv-page'), hd = pg && pg.querySelector(':scope > .axc-head'), sel = pg && pg.querySelector(':scope > .st-sel');
    if (!hd || !sel) return;
    var cb = sel.querySelector('.t2-cb'); if (!cb) return;
    /* خيارات القائمة تُرسم عند فتحها فقط: نقرأها مرة لكل رسم للتقرير ثم نغلقها */
    if (!pg.__tqnOpts) {
      var lz = cb.querySelectorAll('li.t2-cb-o');
      if (!lz.length) { var ob = cb.querySelector('.t2-cb-btn'); if (ob) { ob.click(); lz = cb.querySelectorAll('li.t2-cb-o'); var cx = cb.querySelector('.t2-cb-x'); pg.__tqnOpts = [].map.call(lz, txt); if (lz.length) { if (cx) cx.click(); else { var ob2 = cb.querySelector('.t2-cb-btn'); if (ob2) ob2.click(); } } } }
      else pg.__tqnOpts = [].map.call(lz, txt);
    }
    var lis = (pg.__tqnOpts || []).map(function (t) { return { t: t }; });
    if (lis.length < 2) { pg.__tqnOpts = null; return; }
    cls(pg, 'tqn-rp', true);
    var curT = txt(cb.querySelector('.t2-cb-btn'));
    var sig = lis.map(function (x) { return x.t; }).join('|') + '#' + curT, B = pg.__tqnRp;
    if (B && B.parentNode === pg && B.__sig === sig) return;
    if (B && B.parentNode) B.parentNode.removeChild(B);
    B = mk('div', 'tqn-rp-tabs'); B.setAttribute('role', 'tablist'); B.__sig = sig;
    var RI = [[/الملخص/, 'list'], [/العقود/, 'note'], [/الإجراءات/, 'shield'], [/التحويلات/, 'money'], [/الرسوم/, 'money'], [/الالتزام|المخاطرة/, 'shield'], [/التوصية/, 'star']];
    lis.forEach(function (li) {
      var t = li.t, m = t.match(/^(.*?)\s*\((\d+)\)\s*$/), lb = m ? m[1] : t, n = m ? m[2] : '';
      var on = t === curT;
      var b = mk('button', 'tqn-rp-t' + (on ? ' is-on' : '')); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(on)); b.setAttribute('data-live-ok', '');
      var nIc = 'list'; RI.forEach(function (r) { if (r[0].test(lb) && nIc === 'list') nIc = r[1]; }); b.appendChild(tqIc(nIc));
      b.appendChild(mk('span', '', lb)); if (n) b.appendChild(mk('i', '', n));
      b.addEventListener('click', function () {
        var pick = function () { return [].filter.call(pg.querySelectorAll('.st-sel li.t2-cb-o'), function (x) { return txt(x) === t; })[0]; };
        var cur = pick(); if (!cur) { var ob = pg.querySelector('.st-sel .t2-cb-btn'); if (ob) ob.click(); cur = pick(); }
        if (cur) cur.click(); else wait(pick, function (x) { x.click(); });
      });
      B.appendChild(b);
    });
    cls(sel, 'tqn-hide', true);
    pg.insertBefore(B, sel); pg.__tqnRp = B;
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
    /* v804: التبويب الفرعي الافتراضي أول ما فيه عناصر لا أول ما في القائمة */
    var cur = ST[key]; if (!cur || !items.some(function (it) { return it.k === cur; })) { var nz = items.filter(function (it) { return !/^0$/.test(String(it.n || '').trim()); })[0]; cur = (nz || items[0] || { k: '' }).k; }
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
  /* v804: نصوص — «منذ 0 يوم» ← «اليوم» · «ريال» ← «ر.س» داخل ملف العميل */
  function ago(n) { n = +n; return n === 0 ? 'اليوم' : n === 1 ? 'أمس' : n === 2 ? 'منذ يومين' : n <= 10 ? 'منذ ' + n + ' أيام' : 'منذ ' + n + ' يومًا'; }
  function texts(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, L = [];
    while ((n = w.nextNode())) { var v = n.nodeValue; if (v && (v.indexOf('منذ') >= 0 || v.indexOf('ريال') >= 0 || v.indexOf('Terra ') >= 0 || v.indexOf('966') >= 0)) L.push(n); }
    L.forEach(function (t) {
      var v = t.nodeValue, o = v.replace(/منذ\s+(\d+)\s+يوم(?![\u0621-\u0652])/g, function (m, d) { return ago(d); }), pe = t.parentNode && t.parentNode.closest ? t.parentNode : null;
      if (pe && pe.closest('.tqn-cf')) o = o.replace(/(\d)\s*ريال(?![\u0621-\u0652])/g, '$1 ر.س');
      /* v806: الرقم في عنصر مستقل (bdi) و«ريال» نصّ بعده — تُستبدل أيضًا */
      if (pe && pe.closest('.tqn-cf') && /^\s*ريال(?![\u0621-\u0652])/.test(o) && t.previousSibling && /\d\s*$/.test(t.previousSibling.textContent || '')) o = o.replace(/^(\s*)ريال/, '$1ر.س');
      /* v805: مستويات العضوية بالعربية وحدها — «Terra Plus — تيرا بلس» ← «تيرا بلس» */
      if (o.indexOf('Terra ') >= 0 && pe && !pe.closest('input, textarea, select, option')) o = o.replace(/Terra (?:Plus|Premium|Elite)\s*[—–-]\s*(?=تيرا)/g, '').replace(/Terra Plus/g, 'تيرا بلس').replace(/Terra Premium/g, 'تيرا بريميوم').replace(/Terra Elite/g, 'تيرا إيليت');
      /* v805: الجوال في العملاء الجدد بصيغة قائمة العملاء نفسها (05…) */
      if (pe && pe.closest('.tqn-nc-gl')) o = o.replace(/(^|[^\d+])966(5\d{8})(?!\d)/g, '$10$2');
      if (o !== v) t.nodeValue = o;
    });
  }
  /* v804: صفحة أقسام كل قسم فيها عنصر واحد (مركز الأمن · صفحة العميل) — بطاقات مباشرة بلا شرائح ولا عناوين «عنصر واحد» */
  function hubs(root) {
    [].forEach.call(root.querySelectorAll('.shb'), function (s) {
      var S = [].slice.call(s.querySelectorAll(':scope > .hc-sec')), one = S.length >= 2 && S.every(function (x) { return x.querySelectorAll('.hc').length === 1; });
      cls(s, 'tqn-hub1', one);
      if (!one) return;
      var on = s.querySelector('.st-chips-w .hf-c.is-on'), all = s.querySelector('.st-chips-w .hf-c');
      if (all && on && on !== all) all.click();
    });
  }
  /* v805: العضويات والنقاط — بطاقات مستوى تصفّي + سطر النقاط + بحث + جدول (بدل شبكة البطاقات وشريطي أرقام بشكلين) */
  var TIER = [['Terra Plus', 'تيرا بلس'], ['Terra Premium', 'تيرا بريميوم'], ['Terra Elite', 'تيرا إيليت']];
  function tierAr(s) { s = String(s || ''); var m = s.match(/تيرا\s+[\u0621-\u064A]+/); if (m) return m[0]; for (var i = 0; i < TIER.length; i++) if (s.indexOf(TIER[i][0]) >= 0) return TIER[i][1]; return s.trim() || '—'; }
  function members(root) {
    var ptl = document.getElementById('pv-title'), stk = root.querySelector('.t2-stack.lv-page.is-cu');
    if (!stk || txt(ptl) !== 'العضويات والنقاط') return;
    var box = stk.querySelector(':scope > .cu-cards'); if (!box) return;
    var cards = [].slice.call(box.querySelectorAll(':scope > .cu-card')); if (!cards.length) return;
    var KP = [].slice.call(stk.querySelectorAll(':scope > .cu-kpis'));
    var kv = function (q) { return [txt(q.querySelector('small')), txt(q.querySelector('b'))]; };
    var K1 = KP[0] ? [].map.call(KP[0].querySelectorAll('.cu-kpi'), kv) : [], K2 = KP[1] ? [].map.call(KP[1].querySelectorAll('.cu-kpi'), kv) : [];
    var M = cards.map(function (c) {
      var sm = c.querySelector('.cu-card-t small'), no = txt(sm && sm.querySelector('bdi')), pts = '', sp = null;
      [].forEach.call(c.querySelectorAll('.cu-card-m .t2-pill'), function (p) { if (/نقطة/.test(txt(p))) pts = txt(p).replace(/\s*نقطة/, ''); else sp = p; });
      return { c: c, name: txt(c.querySelector('.cu-card-t b')), no: no, tier: tierAr(txt(sm).replace(no, '')), pts: pts, sp: sp, hid: c.hidden || c.style.display === 'none' };
    });
    var F = ST.mf || 'all', Q = (ST.mq || '').trim().toLowerCase();
    var sig = M.map(function (x) { return [x.name, x.no, x.tier, x.pts, txt(x.sp), x.hid ? 0 : 1].join('~'); }).join('|') + '#' + K1.concat(K2).join(',') + '#' + F + '#' + Q;
    var W = stk.__tqnMb;
    if (W && W.parentNode === stk && W.__sig === sig) return;
    var keepQ = W && W.__q === document.activeElement;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    KP.forEach(function (q) { cls(q, 'tqn-hide', true); }); cls(box, 'tqn-hide', true);
    W = mk('div', 'tqn-clw tqn-mbw'); W.__sig = sig;
    var sm = mk('div', 'tqn-sum'), T0 = [['all', 'كل الأعضاء', M.length]];
    K1.forEach(function (x) { if (!/الأعضاء/.test(x[0])) T0.push([tierAr(x[0]), tierAr(x[0]), num(x[1])]); });
    T0.forEach(function (g) {
      var b = mk('button', 'tqn-sm is-' + (g[0] === 'all' ? 'all' : 'tier') + (F === g[0] ? ' is-on' : '')); b.type = 'button'; b.setAttribute('data-live-ok', '');
      b.appendChild(mk('i', '', g[0] === 'all' ? '∑' : '♛')); var t = mk('span'); t.appendChild(mk('small', '', g[1])); t.appendChild(mk('b', '', String(g[2]))); b.appendChild(t);
      b.addEventListener('click', function () { ST.mf = g[0]; apply(); }); sm.appendChild(b);
    });
    sm.style.setProperty('--n', String(T0.length));
    if (K2.length) sm.appendChild(infoStrip('النقاط', K2));
    W.appendChild(sm);
    var tb = mk('div', 'tqn-ltb'), q = mk('input', 'tqn-lq'); q.type = 'search'; q.placeholder = 'ابحث بالاسم أو رقم العضوية…'; q.value = ST.mq || ''; q.setAttribute('aria-label', 'بحث في الأعضاء');
    q.addEventListener('input', function () { ST.mq = q.value; clearTimeout(q.__t); q.__t = setTimeout(apply, 160); });
    tb.appendChild(q); W.__q = q; W.appendChild(tb);
    var R = M.filter(function (x) { return !x.hid && (F === 'all' || x.tier === F) && (!Q || (x.name + ' ' + x.no).toLowerCase().indexOf(Q) >= 0); });
    var T = mk('div', 'tqn-lt is-mb'), hr = mk('div', 'tqn-ar is-h'); ['العضو', 'المستوى', 'النقاط', 'الحالة', ''].forEach(function (h) { hr.appendChild(mk('span', '', h)); }); T.appendChild(hr);
    R.forEach(function (x) {
      var r = mk('div', 'tqn-ar'); r.setAttribute('role', 'button'); r.tabIndex = 0;
      r.appendChild(who(x.name, x.no)); r.appendChild(mk('span', 'tqn-tier', x.tier)); r.appendChild(mk('b', '', x.pts || '0'));
      r.appendChild(x.sp ? chipOf(x.sp) : mk('span', 'is-mut', '—'));
      var ac = mk('div', 'tqn-acts'); ac.appendChild(btn('عرض', 'is-pri is-sm', function () { x.c.click(); })); r.appendChild(ac);
      r.addEventListener('click', function () { x.c.click(); }); r.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') x.c.click(); });
      T.appendChild(r);
    });
    if (R.length) { W.appendChild(T); W.appendChild(mk('div', 'tqn-lf', 'عرض ' + R.length + ' من ' + M.length + ' عضو')); }
    else W.appendChild(mk('div', 'tqn-lf', 'لا أعضاء بهذا الاختيار'));
    stk.insertBefore(W, box); stk.__tqnMb = W;
    if (keepQ) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { void e; } }
  }
  /* v805: تفاصيل العضوية — شارة المستوى أعلى البطاقة تكرّر رأس الصفحة وحقل «المستوى» */
  function mbDetail() {
    [].forEach.call(document.querySelectorAll('.cu-dh .cu-dr.is-page'), function (d) {
      if (![].some.call(d.querySelectorAll('.t2-field-k, .t2-field > span:first-child'), function (k) { return txt(k) === 'رقم العضوية'; })) return;
      [].forEach.call(d.querySelectorAll('.cu-dr-st > .t2-pill'), function (p) { cls(p, 'tqn-hide', /^(تيرا|Terra)\s/.test(txt(p))); });
    });
  }
  /* v808: إعدادات النظام — مجموعات واضحة وكل عنصر في مكان واحد + بحث بدل شريط الشرائح المكرّر لعناوين الأقسام */
  var SG = [
    ['الوصول والأمان', ['الأدوار والصلاحيات', 'المسمّيات الوظيفية', 'دعوات الحسابات', 'مدة الجلسة']],
    ['المنشأة والضريبة', ['بيانات المنشأة', 'الضريبة ومواضعها في المستندات']],
    ['المالية والدفع', ['الرسوم والضرائب والعمولات', 'إعدادات الدفع الإلكتروني', 'سداد قيمة المنتج']],
    ['العملاء والأهلية', ['إعدادات تدشين الحساب', 'معايير تقييم العملاء والأهلية', 'مرفقات الوظيفة', 'قرارات مراجعة الترحيل']],
    ['النقاط والخصومات', ['إعدادات النقاط', 'الخصم والنقاط في العروض', 'اعتماد النقاط']],
    ['التواصل', ['قوالب الرسائل', 'إعدادات الإرسال للعملاء', 'إعدادات تجربة العملاء والجودة', 'الرد الآلي']],
    ['القوالب والمستندات', ['قوالب المستندات', 'تنسيق الجداول', 'صفحة التحقق', 'التواقيع المعتمدة']],
    ['التشغيل', ['مدد الإنجاز', 'سجل الإعدادات']]
  ];
  function cntW(n) { return n === 1 ? 'عنصر واحد' : n === 2 ? 'عنصران' : n <= 10 ? n + ' عناصر' : n + ' عنصرًا'; }
  function setHub(root) {
    /* القائمة الجانبية: «الرسوم والضرائب» و«إعدادات الدفع» داخل «إعدادات النظام» — بلا رابط مكرّر */
    [].forEach.call(document.querySelectorAll('.tqn-nav .tqn-i'), function (x) { if (/^(الرسوم والضرائب|إعدادات الدفع)$/.test(x.getAttribute('title') || txt(x))) cls(x, 'tqn-hide', true); });
    if (txt(document.getElementById('pv-title')) !== 'إعدادات النظام') return;
    var s = root.querySelector('.shb'); if (!s) return;
    var OS = [].slice.call(s.querySelectorAll(':scope > .hc-sec')); if (!OS.length) return;
    var C = [];
    OS.forEach(function (sec) { var og = txt(sec.querySelector('.hc-sec-h h2')); [].forEach.call(sec.querySelectorAll('.hc'), function (c) { C.push({ c: c, t: txt(c.querySelector('.hc-tx b')), d: txt(c.querySelector('.hc-tx small')), og: og, sec: sec }); }); });
    var Q = (ST.shq || '').trim();
    var sig = C.map(function (x) { return x.t + '~' + x.d; }).join('|') + '#' + Q;
    [].forEach.call(s.querySelectorAll(':scope > .st-chips-w'), function (x) { cls(x, 'tqn-hide', true); });
    OS.forEach(function (x) { cls(x, 'tqn-hide', true); });
    var W = s.__tqnSh;
    if (W && W.parentNode === s && W.__sig === sig) return;
    var keepQ = W && W.__q === document.activeElement;
    if (W && W.parentNode) W.parentNode.removeChild(W);
    W = mk('div', 'tqn-sh'); W.__sig = sig;
    var tb = mk('div', 'tqn-ltb'), q = mk('input', 'tqn-lq'); q.type = 'search'; q.placeholder = 'ابحث في الإعدادات…'; q.value = ST.shq || ''; q.setAttribute('aria-label', 'بحث في الإعدادات');
    q.addEventListener('input', function () { ST.shq = q.value; clearTimeout(q.__t); q.__t = setTimeout(apply, 160); });
    tb.appendChild(q); W.__q = q; W.appendChild(tb);
    var used = [], G = SG.map(function (g) { var xs = g[1].map(function (n) { return C.filter(function (x) { return x.t === n; })[0]; }).filter(Boolean); used = used.concat(xs); return { t: g[0], xs: xs }; });
    C.forEach(function (x) { if (used.indexOf(x) >= 0 || /يُربط لاحقًا/.test(txt(x.c))) return; var o = G.filter(function (g) { return g.t === x.og; })[0]; if (!o) { o = { t: x.og, xs: [] }; G.push(o); } o.xs.push(x); });
    var any = 0;
    G.forEach(function (g, gi) {
      var xs = g.xs.filter(function (x) { return !Q || (x.t + ' ' + x.d).indexOf(Q) >= 0; }); if (!xs.length) return; any += xs.length;
      var sec = mk('section', 'hc-sec tqn-hs is-t' + (gi % 4)), h = mk('header', 'hc-sec-h'), ic = xs[0].sec.querySelector('.hc-sec-ic');
      h.appendChild(ic ? ic.cloneNode(true) : mk('span', 'hc-sec-ic')); h.appendChild(mk('h2', '', g.t)); h.appendChild(mk('small', '', cntW(xs.length))); sec.appendChild(h);
      var gr = mk('div', 'hc-g');
      xs.forEach(function (x) { var cl = x.c.cloneNode(true); cl.setAttribute('data-live-ok', ''); cl.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); ST.__hubFrom = document.querySelector('.tqn-nav .tqn-i.is-on') || ST.__hubFrom; x.c.click(); }); gr.appendChild(cl); });
      sec.appendChild(gr); W.appendChild(sec);
    });
    if (!any) W.appendChild(mk('div', 'tqn-lf', 'لا إعداد بهذا الاسم'));
    s.insertBefore(W, OS[0]); s.__tqnSh = W;
    if (keepQ) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { void e; } }
  }
  /* v808: صفحات الإعدادات — كل الأقسام مفتوحة، والصفحات الطويلة بتبويب لكل قسم (مهمة واحدة في كل تبويب)، وبلا تكرار العنوان في التنويه */
  var STAB = /^(الرسوم والضرائب والعمولات|سداد قيمة المنتج|مرفقات الوظيفة|إعدادات نقاط ومكافآت تيرا)$/;
  function secT(x) { var h = x.querySelector(':scope > .t2-sec-h .t2-group-t, :scope > .t2-sec-h h2, :scope > .t2-panel-h .t2-group-t, :scope > .t2-panel-h h2, :scope > .t2-panel-h h3, :scope > header h2, :scope > header h3'); return txt(h).replace(/^\d+\s*[.\-–]\s*/, '').split(/[:：]/)[0].trim(); }
  function setPage(root) {
    var hf = ST.__hubFrom, hi = hf ? (hf.getAttribute('title') || txt(hf)) : '', pt = txt(document.getElementById('pv-title'));
    var on = hi === 'إعدادات النظام' && document.body.contains(hf) && pt && pt !== hi && !document.querySelector('.tqn-nav .tqn-i.is-on');
    cls(root, 'tqn-setp', !!on);
    if (!on) return;
    [].forEach.call(root.querySelectorAll('.t2-note .t2-note-t'), function (t) { cls(t, 'tqn-hide', txt(t) === pt); });
    [].forEach.call(root.querySelectorAll('button'), function (b) { if (/^(فتح الكل|طي الكل)$/.test(txt(b))) cls(b, 'tqn-hide', true); });
    var np = pt.replace(/^إعدادات\s+/, ''); [].forEach.call(root.querySelectorAll('.ax-top-t > b'), function (b) { cls(b, 'tqn-hide', txt(b).replace(/^إعدادات\s+/, '') === np); });
    if (!STAB.test(pt)) return;
    var P = [], best = null;
    [].forEach.call(root.querySelectorAll('section.t2-sec, section.t2-panel'), function (x) { if (!secT(x)) return; var p = x.parentNode, o = P.filter(function (y) { return y.p === p; })[0]; if (!o) { o = { p: p, xs: [] }; P.push(o); } o.xs.push(x); });
    P.forEach(function (o) { if (!best || o.xs.length > best.xs.length) best = o; });
    if (!best || best.xs.length < 3) return;
    var S = best.xs, K = S.map(secT), key = 'st:' + pt;
    var cur = ST[key]; if (K.indexOf(cur) < 0) cur = K[0];
    var b = bar(best.p, S[0], K.map(function (k) { return { k: k, t: k }; }), cur, 'k', function (k) { ST[key] = k; });
    cls(b, 'is-set', true);
    S.forEach(function (x, i) { var onx = K[i] === cur; cls(x, 'tqn-st-hide', !onx); cls(x, 'tqn-stab-s', true); quiet(x.querySelector(':scope > .t2-sec-h, :scope > .t2-panel-h')); });
  }
  /* v827: الأرقام إنجليزية فقط — حقول الأرقام والتواريخ بلغة en (كان المتصفح يعرض ١٦٥٠٠)، وأي رقم هندي في النصوص يُحوَّل */
  var ARD = /[\u0660-\u0669\u06F0-\u06F9]/;
  function enDigits(host) {
    /* حقل الرقم يعرضه المتصفح بالأرقام الهندية مهما كانت لغته — يصير حقل نص رقمي بالقيمة نفسها (المنصة تقرأ .value فقط) */
    [].forEach.call(host.querySelectorAll('input[type=number]'), function (i) { i.type = 'text'; i.setAttribute('inputmode', 'decimal'); i.setAttribute('data-tqn-num', ''); i.setAttribute('dir', 'ltr'); });
    [].forEach.call(host.querySelectorAll('input[type=date], input[type=time], input[type=datetime-local], input[type=month]'), function (i) { if (i.getAttribute('lang') !== 'en') i.setAttribute('lang', 'en'); });
    var tw = document.createTreeWalker(host, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) { var v = n.nodeValue; if (ARD.test(v)) n.nodeValue = v.replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); }).replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); }); }
  }
  /* الكتابة في حقل رقمي: الأرقام الهندية تُحوَّل وغير الأرقام يُحذف قبل أن تقرأها المنصة */
  try { document.addEventListener('input', function (ev) { var t = ev.target; if (!t || !t.hasAttribute || !t.hasAttribute('data-tqn-num')) return; var v = t.value, w = v.replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); }).replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); }).replace(/٫/g, '.').replace(/[^0-9.\-]/g, ''); if (w !== v) t.value = w; }, true); } catch (e) { void e; }
  function apply() {
    busy = false;
    var root = document.querySelector('#pv-root'); if (!root) return;
    try { enDigits(document.querySelector('#pv-host') || root); } catch (e) { void e; }
    try { hubs(root); } catch (e) { void e; }
    try { list(root); } catch (e) { void e; }
    try { file(root); } catch (e) { void e; }
    try { dups(root); } catch (e) { void e; }
    try { pages(root); } catch (e) { void e; }
    try { members(root); } catch (e) { void e; }
    try { setHub(root); } catch (e) { void e; }
    try { setPage(root); } catch (e) { void e; }
    try { drCrumbs(); } catch (e) { void e; }
    try { crumbs(); } catch (e) { void e; }
    /* v805: النصوص بعد بناء الملف والصفحات (كانت قبلها فيفوتها ما يُبنى لاحقًا مثل تبويب «الطلبات») */
    try { texts(root); [].forEach.call(document.querySelectorAll('.cu-dh .cu-dr.is-page'), function (d) { if (!root.contains(d)) texts(d); }); } catch (e) { void e; }
    try { mbDetail(); } catch (e) { void e; }
  }
  function soon() { if (busy) return; busy = true; var t = setTimeout(apply, 80); if (window.requestAnimationFrame) requestAnimationFrame(function () { clearTimeout(t); if (busy) apply(); }); }
  try { new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) { void e; }
  try { window.addEventListener('resize', soon); } catch (e) { void e; }
  /* v750: التنقّل من القائمة الجانبية أو المسار أو الهيدر يُنهي «فُتح من ملف العميل» */
  try { document.addEventListener('click', function (ev) { var t = ev.target; if (t && t.closest && t.closest('.tqn-nav, .tqn-cr, #pv-host .t2-head, .t2-head')) { ST.__navU = 1; if (!t.closest('.tqn-cr-bk')) ST.from = null; if (!t.closest('.tqn-cr')) ST.fromNc = false; } if (t && t.closest && t.closest('#pv-root .tqn-nc-gl > article.nr > .nr-main')) ST.fromNc = true; var ni = t && t.closest && t.closest('.tqn-nav .tqn-i'); if (ni) ST.__inbx = /^طلبات المتجر$/.test(ni.getAttribute('title') || txt(ni)) ? 1 : 0; if (t && t.closest && t.closest('.tqn-nav')) ST.__hubFrom = null; else if (t && t.closest && t.closest('#pv-root .shb .hc')) ST.__hubFrom = document.querySelector('.tqn-nav .tqn-i.is-on') || ST.__hubFrom; }, true); } catch (e) { void e; }
  soon();
})();
