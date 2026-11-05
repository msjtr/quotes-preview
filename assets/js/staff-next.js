/* v702 — المنصة الجديدة للموظفين (staff/next/)
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
      ['cu-docs-pq', 'عروض أسعار الشركاء', ['cu']],
      ['cu-docs-pc', 'عقود الشركاء', ['cu']],
      ['cu-docs-sq', 'عروض أسعار المتاجر', ['cu']]
    ]],
    ['المالية والتحصيل', [
      ['fin-due', 'الدفعات المستحقة والقادمة', ['fin']],
      /* مسجّلة في المنصة تحت قسم العملاء وتظهر في المالية — تلزمها الصلاحيتان معًا */
      ['cu-trin', 'إيصالات التحويل البنكي', ['fin', 'cu']],
      ['cu-opin', 'طلبات الإلغاء والاسترداد', ['fin', 'cu']],
      ['cu-paylinks', 'روابط الدفع', ['fin', 'cu']],
      ['fin-pay', 'سجل المدفوعات', ['fin']],
      ['fin', 'كل صفحات المالية', ['fin']]
    ]],
    ['التواصل', [
      ['comm-send', 'مركز الإرسال', ['comm-hub']],
      ['cs-tickets', 'التذاكر والمراسلات', ['comm-hub']],
      ['cx', 'تجربة العملاء والجودة', ['comm-hub']],
      ['comm-hub', 'كل صفحات التواصل', ['comm-hub']]
    ]],
    ['الفريق والشركاء', [['team-hub', 'الفريق والشركاء', ['team-hub']]]],
    ['الإعدادات', [['sys', 'إعدادات النظام', ['sys']]]]
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

  var ITEMS = {}, COVER = { 'adm-more': true };
  TREE.forEach(function (g) {
    g[1].forEach(function (i) {
      ITEMS[i[0]] = i; COVER[i[0]] = true;
      i[2].forEach(function (r) { (ALIAS[r] || [r]).forEach(function (k) { COVER[k] = true; }); });
    });
  });

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
    var sig = A.order.join(',');
    if (nav.getAttribute('data-sig') !== sig) {
      var html = FLAG;
      groups(A).forEach(function (g) {
        html += '<div class="t2-side-g tqn-g">' +
          (g[0] ? '<button class="t2-side-gh tqn-gh" type="button" aria-expanded="true"><span>' + esc(g[0]) + '</span><span class="t2-chev" aria-hidden="true"></span></button>' : '') +
          '<div class="t2-side-gb">' + g[1].map(function (i) {
            var ic = A.icon[i[0]] || '';
            return '<button class="t2-side-i tqn-i' + (ic ? '' : ' tqn-sub') + '" type="button" data-next-nav="' + esc(i[0]) + '">' +
              '<span class="t2-side-ic">' + (ic || '<i class="tqn-dot" aria-hidden="true"></i>') + '</span>' +
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

  /* تمييز البند الحالي: الصفحة المفتوحة أو أقرب أصل لها في الشجرة */
  function cur() {
    var k = window.__lvKey || '', g = 0;
    while (k && !ITEMS[k] && !(LAST && LAST.set[k] && !COVER[k]) && g++ < 8) k = UP[k] || '';
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
            ' data-next-nav="' + esc(i[0]) + '"><span>' + esc(i[1]) + '</span><span class="tqn-chev" aria-hidden="true"></span></button>';
        }).join('') + '</div></section>';
    });
    var s = document.createElement('div');
    s.className = 'tqn-sheet';
    s.innerHTML = '<div class="tqn-back" data-close="1"></div>' +
      '<div class="tqn-panel" role="dialog" aria-modal="true" aria-labelledby="tqn-st" dir="rtl">' +
      '<div class="tqn-grip" aria-hidden="true"></div>' +
      '<div class="tqn-head"><h2 id="tqn-st">الأقسام</h2><button type="button" class="tqn-x" data-close="1" aria-label="إغلاق">×</button></div>' +
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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
