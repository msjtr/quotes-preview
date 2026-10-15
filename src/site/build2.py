import sys, gzip, shutil
sys.path.insert(0, '/tmp/claude-0/-home-claude/c559dbdd-1eea-5df0-9991-28b01da0c844/scratchpad/sb2')
from store import *

OUT = B2 + '/out'
os.makedirs(OUT + '/site', exist_ok=True); os.makedirs(OUT + '/pp', exist_ok=True); os.makedirs(OUT + '/vid', exist_ok=True)
LOGO = TMI['logoColor']

# ---------- shell ----------
head_raw = open(B2 + '/head_raw.html').read()
MODE = re.search(r'<button class="t2-hbtn t2-hmode".*?</button>', head_raw, re.S).group(0).replace('<button class="t2-hbtn t2-hmode"', '<button data-act="theme" class="t2-hbtn t2-hmode"', 1)
HEADER = (f'<header class="t2-head is-v3"><div class="t2-hd-brand" data-go="/" style="cursor:pointer"><img class="t2-hd-logo is-l" src="vid/logo-light.webp" alt="منصة تيرا" width="641" height="283"><img class="t2-hd-logo is-d" src="vid/logo-dark.webp" alt="" aria-hidden="true" width="641" height="283"><span class="t2-hd-name">منصة تيرا</span></div>'
          '<button type="button" class="t2-hcmd" data-act="search" aria-label="البحث"><span class="t2-hcmd-i" aria-hidden="true"></span><span class="t2-hcmd-t">ابحث في الأقسام والمنتجات…</span><kbd class="t2-kbd">Ctrl K</kbd></button>'
          '<div class="t2-hd-sp"></div><div class="t2-hd-r">' + MODE +
          f'<button class="t2-hbtn is-follow" type="button" data-go="/desk#follow" aria-label="متابعة الطلب">{T("PiListChecksFill", "navy")}<span class="t2-hbtn-t">متابعة الطلب</span></button>'
          f'<button class="t2-hbtn is-in" type="button" data-go="/login" aria-label="تسجيل الدخول">{T("PiSignInFill")}<span class="t2-hbtn-t">تسجيل الدخول</span></button></div></header>')
def side_i(href, label, ic, tone='teal'):
    return f'<button class="t2-side-i" type="button" data-go="{href}" data-tip="{e(label)}"><span class="t2-side-ic">{T(ic, tone)}</span><span class="t2-side-l">{e(label)}</span></button>'
def side_g(title, items, ic='PiCompassFill'):
    return (f'<div class="t2-side-g"><button class="t2-side-gh" type="button" title="{e(title)}"><span class="t2-side-gic">{T(ic)}</span><span class="t2-side-gt">{e(title)}</span><span class="t2-chev" aria-hidden="true"></span></button><div class="t2-side-gb">'
            + ''.join(side_i(*x) for x in items) + '</div></div>')
SIDE = ('<aside class="t2-side" aria-label="شريط التنقل"><div class="t2-side-top"><button class="t2-side-t" type="button" aria-expanded="false" data-tip="توسيع القائمة"><span class="t2-side-burger" aria-hidden="true"><i></i><i></i><i></i></span><span class="t2-side-tl">توسيع القائمة</span><span class="t2-side-pin">تثبيت</span></button></div><nav class="t2-side-n">'
        '<div class="t2-side-g"><div class="t2-side-gb">' + side_i('/', 'الرئيسية', 'PiHouseFill') + side_i('/p/products', 'المتجر', 'PiStorefrontFill') +
        side_i('/membership', 'العضويات', 'PiCrownFill', 'saffron') + side_i('/desk', 'مركز المراسلات', 'PiEnvelopeFill') + '</div></div>' +
        side_g('تعرّف على تيرا', [('/p/about', 'عن تيرا', 'PiCompassFill')] + [(f'/p/{s}', t, ic) for s, t, ic in GROUPS['about']['items']], 'PiCompassFill') +
        side_g('الخدمات', [('/p/services', 'كل الخدمات', 'PiGearSixFill')] + [(f'/p/{s}', t, ic) for s, t, ic in GROUPS['services']['items']], 'PiGearSixFill') +
        side_g('المتجر', [('/store/devices', 'سوق الأجهزة', 'PiDeviceMobileFill'), ('/store/digital', 'سوق الحلول الرقمية', 'PiCodeFill'), ('/store/custom', 'خدمة حسب الطلب', 'PiPaperPlaneTiltFill')], 'PiShoppingBagFill') +
        side_g('خدمات الشركاء', [('/p/partners', 'كل خدمات الشركاء', 'PiHandshakeFill')] + [(f'/p/{s}', t, ic) for s, t, ic in GROUPS['partners']['items']], 'PiHandshakeFill') +
        side_g('المساعدة', [('/faq', 'الأسئلة الشائعة', 'PiQuestionFill'), ('/desk#follow', 'متابعة الطلب', 'PiListChecksFill'), ('/policies', 'المعلومات والسياسات', 'PiShieldCheckFill')], 'PiQuestionFill') +
        '</nav>' + f'<div class="t2-side-foot"><button type="button" class="t2-side-help" data-go="/desk" data-tip="تحتاج مساعدة؟">{T("PiHeadphonesFill", "saffron")}<span><b>تحتاج مساعدة؟</b><small>مركز المراسلات يرد عليك</small></span></button></div></aside>')
pay = ''.join(f'<img src="{"data:image/svg+xml;base64," + base64.b64encode(open(Q + "/pay/" + f, "rb").read()).decode()}" alt="{a}">' for f, a in [('mada.svg', 'mada'), ('visa.svg', 'Visa'), ('mastercard.svg', 'Mastercard'), ('gpay.svg', 'Google Pay'), ('stcpay.svg', 'STC Pay'), ('paypal.svg', 'PayPal')])
LAYERS = [('sym', 'الرمز'), ('tera', 'TERA'), ('ar', 'تيرا'), ('lines', ''), ('tagtx', 'عالمك بلا حدود'), ('en', 'Your world without limits')]
LOGO_ANIM = ('<div class="tf-logo" role="img" aria-label="تيرا — عالمك بلا حدود"><div class="tf-stage">'
             '<img class="tf-ghost" src="vid/logo-dark.webp" alt="" aria-hidden="true">'
             + ''.join(f'<img class="tf-ly tf-{k}" src="vid/lg-{k}.webp" alt="" aria-hidden="true">' for k, _ in LAYERS) +
             '<span class="tf-sheen" aria-hidden="true"></span></div></div>')
def f_link(href, label, ic, tone='teal'):
    return f'<button type="button" class="tf-lk" data-go="{href}">{T(ic, tone)}<span>{e(label)}</span>{GO}</button>'
QUICK = [('/p/about', 'تعرّف على تيرا', 'PiCompassFill', 'teal'), ('/p/services', 'الخدمات', 'PiGearSixFill', 'sky'), ('/p/products', 'المتجر', 'PiStorefrontFill', 'teal'),
         ('/p/s25', NEW, 'PiTrendUpFill', 'saffron'), ('/membership', 'العضويات', 'PiCrownFill', 'gold'), ('/p/partners', 'خدمات الشركاء', 'PiHandshakeFill', 'sky'),
         ('/desk#follow', 'متابعة الطلب', 'PiListChecksFill', 'navy'), ('/store/custom', 'خدمة حسب الطلب', 'PiPaperPlaneTiltFill', 'teal')]
POL_T = {'usage': 'سياسة الاستخدام', 'privacy': 'سياسة الخصوصية', 'user-guide': 'دليل المستخدم', 'refunds': 'سياسة الاسترجاع واسترداد المبالغ', 'exchange': 'سياسة الاستبدال',
         'shipping': 'سياسة الشحن والتوصيل', 'warranty': 'سياسة الضمان', 'partners': 'سياسة الخدمات المقدمة من الشركاء', 'terms': 'شروط وأحكام تقديم الخدمات والطلبات', 'complaints': 'سياسة الشكاوى والاقتراحات'}
POL_TONE = {'usage': 'navy', 'privacy': 'sky', 'user-guide': 'teal', 'refunds': 'saffron', 'exchange': 'navy', 'shipping': 'sky', 'warranty': 'navy', 'partners': 'sky', 'terms': 'saffron', 'complaints': 'teal'}
POL_ORDER = ['usage', 'privacy', 'user-guide', 'refunds', 'exchange', 'shipping', 'warranty', 'partners', 'terms', 'complaints']
POL_IC = {k: ic for k, t, ic in POLICIES}
INFO = [('/faq', 'الأسئلة الشائعة', 'PiQuestionFill', 'saffron'), ('/desk', 'مركز المراسلات', 'PiEnvelopeFill', 'teal')] + [(f'/policies/{k}', POL_T[k], POL_IC.get(k, 'PiFileTextFill'), POL_TONE[k]) for k in POL_ORDER]
CONTACTS = [('https://wa.me/966555698774', 'PiWhatsappLogoFill', 'teal', 'واتساب', '0555698774', 'تواصل فوري'),
            ('mailto:info@tera-ksa.sa.com', 'PiEnvelopeSimpleFill', 'sky', 'البريد الإلكتروني', 'info@tera-ksa.sa.com', 'للاستفسارات العامة'),
            ('mailto:support@tera-services.com.sa', 'PiHeadphonesFill', 'saffron', 'بريد الدعم', 'support@tera-services.com.sa', 'للدعم والمتابعة')]
payimgs = ''.join(f'<li><img src="{"data:image/svg+xml;base64," + base64.b64encode(open(Q + "/pay/" + f, "rb").read()).decode()}" alt="{a}"></li>' for f, a in [('mada.svg', 'مدى'), ('visa.svg', 'Visa'), ('mastercard.svg', 'Mastercard'), ('gpay.svg', 'Google Pay'), ('stcpay.svg', 'STC Pay'), ('paypal.svg', 'PayPal')]) + '<li><span class="tf-tm tf-apay" role="img" aria-label="Apple Pay"><b>Apple</b>&nbsp;Pay</span></li>'
FOOT = ('<footer class="ts-foot tf"><div class="tf-in">'
        '<div class="tf-brand">' + LOGO_ANIM + '</div>'
        '<div class="tf-split">'
        f'<article class="tf-card is-light tf-story"><div class="tf-ch">{T("PiCompassFill")}<h3>لماذا تيرا؟</h3></div>'
        '<p class="tf-lead">اطلب… والباقي علينا.</p>'
        '<p>من فكرة في بالك إلى حلٍّ بين يديك: نبحث، نقارن، وننسّق مع أفضل الموردين والشركاء، ثم نقدّم لك الخيار الأنسب بسعر واضح ودفعات مرنة ومتابعة حتى التسليم.</p>'
        '<ul class="tf-tags"><li>أجهزة وتقنية</li><li>حلول رقمية</li><li>خدمات الشركاء</li><li>حسب الطلب</li></ul>'
        '<div class="tf-end"><b>تيرا</b><span>من الاحتياج إلى الحل</span></div></article>'
        f'<article class="tf-card is-light tf-care"><div class="tf-ch">{T("PiShieldCheckFill", "navy")}<div><small>رعاية خدمة العملاء</small><h3>هل تحتاج إلى مساعدة؟</h3></div></div>'
        '<p>فريق خدمة عملاء منصة تيرا جاهز لاستقبال استفساراتك ومساعدتك عند الحاجة.</p><div class="tf-cons">'
        + ''.join(f'<a class="tf-con" href="{h}" target="_blank" rel="noopener">{T(ic, tn)}<span class="tf-con-t"><small>{lb}</small><b dir="ltr">{v}</b><em>{sub}</em></span>{GO}</a>' for h, ic, tn, lb, v, sub in CONTACTS) +
        '</div></article></div>'
        f'<article class="tf-card tf-pay"><div class="tf-ph">{T("PiShieldCheckFill", "navy")}<div><h3>دفع أسهل، أسرع وأكثر أمانًا</h3><p>أتمم طلبك بوسيلة دفع إلكترونية تناسبك، بخطوات واضحة وتجربة موثوقة.</p></div></div>'
        f'<div class="tf-mq" aria-label="وسائل الدفع المتاحة"><div class="tf-mq-t"><ul>{payimgs}</ul><ul aria-hidden="true">{payimgs}</ul></div></div>'
        f'<div class="tf-prov">{T("PiLockKeyFill", "teal")}<div class="tf-prov-t"><small>مزود خدمة الدفع</small><b>تتم جميع المدفوعات عبر مزود خدمة الدفع المعتمد</b></div><span class="tf-tm tf-paymob" role="img" aria-label="Paymob">paymob</span></div>'
        f'<div class="tf-pf">{T("PiGearSixFill", "saffron")}<b>خيارات دفع متعددة… وتجربة مصممة لراحتك.</b></div></article>'
        '<div class="tf-navs">'
        '<nav class="tf-nav" aria-label="روابط سريعة"><h3>روابط سريعة</h3><div class="tf-lks">' + ''.join(f_link(*x) for x in QUICK) + '</div></nav>'
        '<nav class="tf-nav" aria-label="المعلومات والسياسات"><h3>المعلومات والسياسات</h3><div class="tf-lks">' + ''.join(f_link(*x) for x in INFO) + '</div></nav>'
        '</div><p class="tf-copy">© 2026 منصة تيرا للخدمات المتكاملة — جميع الحقوق محفوظة</p></div></footer>')
DOCK = ('<nav class="t2-dock ts-dock" aria-label="التنقل السريع">'
        f'<button type="button" class="t2-dock-i" data-go="/" data-alt="home">{T("PiHouseFill", "navy")}<span class="t2-dock-l">الرئيسية</span></button>'
        f'<button type="button" class="t2-dock-i" data-go="/sections" data-alt="about services partners store help membership">{T("PiSquaresFourFill", "saffron")}<span class="t2-dock-l">الأقسام</span></button>'
        f'<button type="button" class="t2-dock-i" data-go="/login" data-alt="login">{T("PiSignInFill")}<span class="t2-dock-l">تسجيل الدخول</span></button></nav>')
SPRITE = open(B2 + '/sprite.html').read()
OPENING = (f'<div class="ts-open" role="dialog" aria-label="افتتاح منصة تيرا"><img src="{TMI["logoWhite"]}" alt="تيرا"><p>من الاحتياج إلى الحل</p>'
           '<div class="ts-open-w"><span>يرجى الانتظار</span><span class="ts-open-r"><i></i></span></div></div>')
SHELL = (SPRITE + '<div id="pv-host"><div class="t2 t2-app is-guest is-side-min">' + HEADER + SIDE +
         '<div class="t2-main"><div class="t2-body"><div class="t2-wrap"><div class="t2-stack" id="pv-root">@@ROOT@@</div>' + FOOT + '</div></div></div>' + DOCK + '</div></div>')

# ---------- الأقسام (الجوال) ----------
def sec_page():
    blocks = ''
    for g in ['about', 'services', 'partners']:
        d = GROUPS[g]
        cards = hc_link(d['hub'], 'نظرة عامة', d['sub'], d['ic']) + ''.join(hc_link(f'/p/{s}', t, 'القسم ' + NUM[s], ic) for s, t, ic in d['items'])
        blocks += hc_sec(d['t'], count_ar(len(d['items']) + 1, '', '', 'عناصر', 'عنصرًا'), d['ic'], f'<div class="hc-g">{cards}</div>')
    store = ''.join(hc_link(h, t, s, ic) for h, t, s, ic in [('/p/products', 'المتجر', 'الأسواق والأقسام', 'PiStorefrontFill'), ('/store/devices', 'سوق الأجهزة', 'جوالات وأجهزة لوحية وساعات', 'PiDeviceMobileFill'), ('/store/digital', 'سوق الحلول الرقمية', 'متاجر وتصميم وتقنية', 'PiCodeFill'), ('/p/s25', NEW, 'خدمة جديدة', 'PiFireFill'), ('/store/custom', 'خدمة حسب الطلب', 'صف احتياجك', 'PiPaperPlaneTiltFill')])
    helpc = ''.join(hc_link(h, t, s, ic) for h, t, s, ic in [('/membership', 'العضويات', 'المستويات والمزايا والنقاط', 'PiCrownFill'), ('/desk', 'مركز المراسلات', 'طلب · شكوى · دعم', 'PiEnvelopeFill'), ('/desk#follow', 'متابعة الطلب', 'برقم المراسلة', 'PiListChecksFill'), ('/faq', 'الأسئلة الشائعة', 'إجابات مختصرة', 'PiQuestionFill'), ('/policies', 'المعلومات والسياسات', 'الخصوصية والاسترجاع والضمان', 'PiShieldCheckFill')])
    theme = (f'<button type="button" class="hc" data-act="theme"><span class="hc-row"><span class="hc-ic">{T("PiMoonFill", "navy")}</span><span class="hc-tx"><b>الوضع الليلي</b><small>بدّل بين الوضع النهاري والليلي</small></span><span class="hc-go" aria-hidden="true">{GO}</span></span></button>')
    return (phead([('الرئيسية', '/', 'PiHouseFill'), ('الأقسام', None, None)]) + '<div class="t2-stack">' + shb('PiSquaresFourFill', 'الأقسام', 'كل أقسام منصة تيرا في مكان واحد.') +
            hc_sec('المتجر', '5 عناصر', 'PiStorefrontFill', f'<div class="hc-g">{store}</div>', tone=2) + blocks +
            hc_sec('المساعدة والحساب', '5 عناصر', 'PiQuestionFill', f'<div class="hc-g">{helpc}</div>', tone=1) +
            hc_sec('الإعدادات', 'عنصر واحد', 'PiGearSixFill', f'<div class="hc-g">{theme}</div>', tone=3) + '</div>')
PAGES['/sections'] = dict(t='الأقسام', g='sections', h=sec_page())

# ---------- index / options ----------
FIND = []
for k, v in PAGES.items():
    if k.startswith('/product/'): continue
    FIND.append({'t': v['t'], 'h': k, 'g': {'about': 'تعرّف على تيرا', 'services': 'الخدمات', 'partners': 'خدمات الشركاء', 'store': 'المتجر', 'help': 'المساعدة'}.get(v.get('g'), ''), 'ic': 'PiCaretLeftBold'})
for sku in [k[9:] for k in PAGES if k.startswith('/product/')]:
    FIND.append({'t': NAME.get(sku, sku), 'h': '/product/' + sku, 'g': 'منتج', 'i': pimg(sku), 'k': sku})
OPT = {}
for sku, p in DATA['PD'].items():
    cols = {c[0]: c[1] for c in p.get('c', [])}
    OPT[sku] = [[o[0], [[v[0], v[1]] for v in o[2]], cols if o[0] == 'اللون' else {}] for o in p.get('o', [])]
for sku, p in DG['p'].items():
    if p.get('o'): OPT[sku] = [[o[0], [[v[0], v[1]] for v in o[2]], {}] for o in p['o'] if isinstance(o, list) and len(o) > 2]

EXTRA_CSS = ('.t2-cb{position:relative}.t2-cb.is-open .t2-cb-pop{display:block}.t2-cb-sh{display:none}.t2-cb-q{display:none}'
             '.t2-cb-l{list-style:none;margin:0;padding:0;max-height:260px;overflow:auto;display:grid;gap:2px}'
             '.t2-cb-l li{display:flex;align-items:center;gap:10px;min-height:42px;padding:6px 10px;border-radius:10px;cursor:pointer;color:var(--t2-ink);font:600 .9rem "IBM Plex Sans Arabic",sans-serif}'
             '.t2-cb-l li:hover{background:var(--t2-brand-wash)}.t2-cb-l small{margin-inline-start:auto;color:var(--t2-muted);font-size:.8rem}'
             '@media (min-width:40.01rem) and (max-width:64rem){#pv-host .t2-app>.t2-dock.ts-dock{grid-template-columns:repeat(3,minmax(0,1fr))}}'
             '#pv-host .t2-app{padding-bottom:0}@container app (max-width:40rem){#pv-host .t2-app>.t2-dock{position:fixed;inset-inline:0;bottom:0}#pv-host .t2-main{padding-bottom:84px}}'
             '.pp-hl.ts-ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.pp-hl.ts-ul li{display:flex;gap:8px;align-items:flex-start;line-height:1.85;color:var(--t2-ink-2)}.pp-hl.ts-ul li::before{content:"";width:7px;height:7px;margin-top:.7em;border-radius:50%;background:var(--t2-brand);flex:none}'
             '.ts-home .ad{margin:0}.t2-hd-brand img{cursor:pointer}')
CSS = open(B2 + '/app.css').read() + '\n' + open(B2 + '/site.css').read() + '\n' + EXTRA_CSS
# v237 — أداء: حاويات بطاقات العضوية المتداخلة (tm/mc) كانت تجعل كل تخطيط للصفحة ~1 ثانية.
# نزيلها ونحسب وحدات cqw من متغيّر --mcw يضبطه ts.js بعرض البطاقة الفعلي.
def _no_cq(css):
    css = re.sub(r'container\s*:\s*(tm|mc)\s*/\s*inline-size\s*;?', '', css)
    css = re.sub(r'@container tm \(max-width:\s*760px\)', '@media (max-width: 1100px)', css)
    def rule(m):
        sel, body = m.group(1), m.group(2)
        if '.tm' in sel or 'mcard' in sel:
            body = re.sub(r'(-?\d*\.?\d+)cq[wi]', lambda k: f'calc(var(--mcw, 340px) * {k.group(1)} / 100)', body)
        return sel + '{' + body + '}'
    return re.sub(r'([^{}]+)\{([^{}]*)\}', rule, css)
CSS = _no_cq(CSS)
# map low-res product thumbnails (si/<hash>) to the high-res sources: pimg2 strip (devices) or dimg (digital)
import hashlib as _hl
_HI = {}
for _sku, _v in PIMG.items():
    _m = re.match(r'data:([a-z/+]+);base64,(.*)$', _v or '', re.S)
    if not _m: continue
    _h = _hl.sha1(base64.b64decode(_m.group(2))).hexdigest()[:14]
    if os.path.exists('/home/claude/v99/pimg2/' + _sku + '.webp'): _HI[_h] = ('pimg2/' + _sku + '.webp', True)
    elif os.path.exists('/home/claude/v99/dimg/' + _sku + '.webp'): _HI[_h] = ('dimg/' + _sku + '.webp', False)
def _hires(h):
    def rep(m):
        tag = m.group(0); sm = re.search(r'src="si/([0-9a-f]{14})\.\w+"', tag)
        if not sm or sm.group(1) not in _HI: return tag
        src, strip = _HI[sm.group(1)]
        tag = tag.replace(sm.group(0), f'src="{src}"')
        if strip: tag = re.sub(r'class="', 'class="is-strip ', tag, 1) if 'class="' in tag else tag.replace('<img', '<img class="is-strip"', 1)
        return tag
    return re.sub(r'<img\b[^>]*>', rep, h)
for _k in PAGES: PAGES[_k]['h'] = _hires(PAGES[_k]['h'])
for _k in PAGES: PAGES[_k]['h'] = re.sub(r'<img(?![^>]*\bloading=)', '<img loading="lazy" decoding="async"', re.sub(r'\bis-pre\b(?!v)', '', PAGES[_k]['h']))
CORE = {'css': CSS, 'shell': SHELL, 'opening': OPENING, 'run': open(B2 + '/ts.js').read(), 'icons': ICON, 'find': FIND, 'opt': OPT,
        'pages': {k: v for k, v in PAGES.items() if not k.startswith('/product/')},
        'prods': sorted(k[9:] for k in PAGES if k.startswith('/product/')),
        'ppc': {k[9:]: SKU_CAT.get(k[9:], ('misc', ''))[0] for k in PAGES if k.startswith('/product/')}}
raw = json.dumps(CORE, ensure_ascii=False).encode()
gz = base64.b64encode(gzip.compress(raw, 9, mtime=0)).decode()
open(OUT + '/site/core.js', 'w').write('window.__TS_GZ="' + gz + '";(window.__TS_READY||function(){})();')
shutil.rmtree(OUT + '/pp', ignore_errors=True); os.makedirs(OUT + '/pp', exist_ok=True)
CHUNKS = {}
for k, v in PAGES.items():
    if k.startswith('/product/'):
        sku = k[9:]
        ck = SKU_CAT.get(sku, ('misc', ''))[0]
        CHUNKS.setdefault(ck, {})[sku] = base64.b64encode(gzip.compress(json.dumps(v, ensure_ascii=False).encode(), 9, mtime=0)).decode()
for ck, d in CHUNKS.items():
    open(OUT + f'/pp/{ck}.js', 'w').write('window.__TS_PPS&&window.__TS_PPS(' + json.dumps(d) + ');')
shutil.rmtree(OUT + '/vid', ignore_errors=True); os.makedirs(OUT + '/vid', exist_ok=True)
for f in os.listdir('/home/claude/vid/out'):
    if f.startswith('film'): shutil.copy('/home/claude/vid/out/' + f, OUT + '/vid/' + f)
os.makedirs(OUT + '/hi', exist_ok=True)
for f in os.listdir('/home/claude/vid/prod'):
    if f.startswith('hi-') and not f.startswith('hi-TERA'): shutil.copy('/home/claude/vid/prod/' + f, OUT + '/hi/' + f[3:])
for f in os.listdir('/home/claude/vid/out2'):
    shutil.copy('/home/claude/vid/out2/' + f, OUT + '/vid/' + f)
print('pages', len(PAGES), 'core raw', len(raw), 'core gz b64', len(gz), 'pp', len(os.listdir(OUT + '/pp')))
