from pages import *
import json as _j
DATA = _j.load(open(B2 + '/data.json'))
PIMG = DATA['PIMG']; CAT = DATA['CAT']; PINFO = DATA['PINFO']
TMI = _j.load(open(B2 + '/tmimg.json')) if os.path.exists(B2 + '/tmimg.json') else {}
def pimg(sku):
    v = PIMG.get(sku, '')
    return si(v) if v.startswith('data:') else v
NAME = {}
for c in CAT:
    for br, its in c['br']:
        for sku, nm, pr in its: NAME[sku] = nm
CAT_ROUTE = {c['t']: '/store/cat/' + c['k'] for c in CAT}

# ---------- الرئيسية ----------
def ad_slide(i, eye, title, desc, cta, href, imgs, dg=False, on=False, scr=False):
    if scr:
        im = f'<div class="ad-im is-scr"><img class="scr-w" src="{imgs[0]}" alt="" loading="lazy"><img class="scr-p" src="{imgs[1]}" alt="" loading="lazy"></div>'
    elif dg:
        im = '<div class="ad-im is-dg">' + ''.join(f'<span class="ad-dgw is-{k}"><span class="ad-dgt"><img src="{s}" alt="" loading="lazy"></span></span>' for k, s in enumerate(imgs)) + '</div>'
    else:
        im = '<div class="ad-im">' + ''.join(f'<img src="{s}" alt="" loading="lazy" class="is-{k}">' for k, s in enumerate(imgs)) + '</div>'
    return (f'<article class="ad-s is-t{i}{" is-on" if on else ""}" aria-roledescription="شريحة" aria-hidden="{"false" if on else "true"}"><div class="ad-tx"><span class="ad-eye">{e(eye)}</span>'
            f'<h2 class="ad-t">{e(title)}</h2><p class="ad-d">{e(desc)}</p><button type="button" class="ad-cta" data-go="{href}"><span>{e(cta)}</span></button></div>{im}</article>')

def ad(slides, label='أخبار تيرا'):
    dots = ''.join(f'<button type="button" role="tab" aria-label="الشريحة {k+1}" aria-selected="{"true" if k == 0 else "false"}"{" class=\"is-on\"" if k == 0 else ""}><i></i></button>' for k in range(len(slides)))
    return f'<section class="ad ts-ad" aria-roledescription="لوحة إعلانات" aria-label="{e(label)}"><div class="ad-track">{"".join(slides)}</div><div class="ad-dots" role="tablist" aria-label="الشرائح">{dots}</div></section>'

def feat(kind, kicker, ic, title, desc, links, rev=False, cta=None):
    ls = ''.join(f'<button type="button" data-go="{h}">{T(i2)}<span>{e(t)}</span></button>' for t, h, i2 in links)
    return (f'<section class="ts-feat{" is-rev" if rev else ""}"><div class="ts-feat-v ts-vid" data-vid="{kind}">{vmedia(kind)}</div>'
            f'<div class="ts-feat-b"><div class="ts-feat-tx"><span class="ts-feat-k">{T(ic)}{e(kicker)}</span><h2 class="ts-feat-t">{e(title)}</h2><p class="ts-feat-d">{e(desc)}</p>'
            + (f'<div><button type="button" class="t2-btn is-primary" data-go="{cta[1]}">{GO}{e(cta[0])}</button></div>' if cta else '') + f'</div><div class="ts-feat-l">{ls}</div></div></section>')

STATS = [('+12,500', 'عميل مسجل', 'PiUsersThreeFill'), ('+28,000', 'طلب مستلم', 'PiEnvelopeFill'), ('+21,500', 'طلب مكتمل', 'PiCheckCircleFill'), ('+65', 'خدمة ومنتج', 'PiPackageFill'),
         ('+35', 'شريك ومزود خدمة', 'PiHandshakeFill'), ('+24,000', 'عملية مكتملة', 'PiChartBarFill'), ('+18,000', 'مراسلة تمت معالجتها', 'PiChatsCircleFill'), ('+30,000', 'مستفيد', 'PiUserFill')]

def membership_block(cta=True):
    h = open(SP + '/sb/study/dom-aboutmem.html').read()
    i = h.find('<div class="tiers">'); j = h.find('</section>', i)
    tiers = h[i:j]
    tiers = re.sub(r'<div class="rate">.*?</div>', '', tiers, flags=re.S)
    tiers = re.sub(r'<div><small>الاكتساب · <em>EARN</em></small><b>[^<]*</b></div>', '', tiers)
    tiers = re.sub(r'<span class="cur-pill">[^<]*</span>', '', tiers)
    tiers = re.sub(r'<i class="mc-st[^"]*">[^<]*</i>', '<i class="mc-st is-gen">عضوية تيرا</i>', tiers)
    tiers = tiers.replace('class="tier cur"', 'class="tier"').replace('لا', 'لا')
    for a, b in [('المستوى الأعلى باعتماد المسؤول', 'قمة التميّز وأعلى المزايا'), ('للعملاء ذوي السجل المنتظم', 'مزايا أوسع وتجربة أرقى'), ('عضوية الانطلاق', 'انطلاقة بمزايا فورية'),
                 ('أولوية دعم إذا أمكن', 'أولوية في خدمة العملاء'), ('دعم متقدم إذا أمكن', 'خدمة عملاء مخصصة'), ('عروض إضافية عند توفرها', 'عروض إضافية حصرية'),
                 ('عروض حصرية عند توفرها', 'عروض حصرية لكبار العملاء'), ('العروض العامة المؤهلة', 'عروض الأعضاء'), ('الاستبدال في الخدمات المؤهلة', 'استبدال النقاط في الخدمات'),
                 ('جميع مزايا المستويات السابقة', 'كل مزايا بلس وبريميوم'), ('جميع مزايا بلس', 'كل مزايا تيرا بلس'), ('برنامج نقاط تيرا', 'برنامج نقاط تيرا مع طلباتك'),
                 ('معدل نقاط أعلى', 'نقاط أكثر مع كل طلب'), ('أعلى معدل نقاط', 'أعلى مستوى في برنامج النقاط')]:
        tiers = tiers.replace(a, b)
    tiers = si_all(tiers)
    steps = [('PiShoppingBagFill', 'اطلب واكسب', 'تُضاف النقاط إلى رصيدك مع طلباتك وخدماتك المؤهلة.'),
             ('PiArrowsLeftRightFill', 'استبدل نقاطك', 'استخدم نقاطك في الخدمات والعروض المؤهلة داخل المنصة.'),
             ('PiCrownFill', 'ارتقِ إلى مستوى أعلى', 'كلما توسّع تعاملك مع تيرا ارتقيت إلى مستوى أعلى بمزايا أكبر.')]
    st = ''.join(f'<div class="ts-step">{T(ic, "saffron" if k == 2 else "teal")}<div><b>{e(b)}</b><span>{e(s)}</span></div></div>' for k, (ic, b, s) in enumerate(steps))
    return (f'<section class="ts-mem"><div class="tm"><section class="lux"><div class="ts-mem-h"><small>عضويات تيرا · TERRA MEMBERSHIP</small><h2>عضوية تكافئ ثقتك</h2>'
            '<p>ثلاثة مستويات للعضوية، لكل مستوى مزاياه، وبرنامج نقاط تكسب فيه مع طلباتك وتستبدل نقاطك في الخدمات المؤهلة.</p></div>'
            + vid('membership', 'ts-mem-v') + f'{tiers}<div class="ts-steps">{st}</div>'
            + (f'<div class="ts-mem-cta"><button type="button" class="t2-btn is-primary" data-go="/login">{GO}انضم الآن</button><button type="button" class="t2-btn" data-go="/membership">تعرّف على العضويات</button></div>' if cta else '')
            + '</section></div></section>')

def top_cards(n=6):
    c = _j.load(open(B2 + '/crawl.json'))
    row = c.get('tab:devices:0', '')
    arts = re.findall(r'<article class="pc.*?</article>', row, re.S)[:n]
    return si_all(''.join(arts))

def home():
    hero = (f'<div class="ts-hero ts-vid is-hero" data-vid="hero">{vmedia("hero")}'
            f'<button type="button" class="ts-vid-b" aria-label="إيقاف الفيديو">{I("PiPauseFill")}<span>إيقاف</span></button></div>')
    quick = [('PiStorefrontFill', 'المتجر', 'أجهزة وحلول رقمية', '/p/products'), ('PiGearSixFill', 'الخدمات', 'من الطلب إلى الحل', '/p/services'),
             ('PiPaperPlaneTiltFill', 'خدمة حسب الطلب', 'صف احتياجك', '/store/custom'), ('PiListChecksFill', 'متابعة الطلب', 'برقم المراسلة', '/desk#follow'),
             ('PiEnvelopeFill', 'مركز المراسلات', 'طلب · شكوى · دعم', '/desk')]
    qk = '<div class="hf-row ts-quick">' + ''.join(f'<button type="button" class="hf-c" data-go="{h}"><span class="hf-ic">{T(ic)}</span><span class="hf-tx"><b>{e(t)}</b><small>{e(s)}</small></span></button>' for ic, t, s, h in quick) + '</div>'
    dev = ['hi/' + s + '.jpg' for s in ['XMI-17U', 'APL-IP18PM', 'HUA-GT7P']]
    dgi = ['dimg/' + s + '.webp' for s in ['TERA-PKG-01', 'TERA-LEG-02', 'TERA-DSN-12']]
    topi = ['hi/' + s + '.jpg' for s in ['APL-AP4-ANC', 'APL-IPADAIR11-M3', 'XMI-17TP']]
    scr = [TMI.get(k, '') for k in ('dash', 'home', 'news')]
    news = ad([ad_slide(0, 'خدمة جديدة', NEW, 'مختارات من المنتجات الأكثر طلبًا في السوق، جاهزة للطلب المباشر.', 'اكتشف الخدمة', '/p/s25', topi, on=True),
               ad_slide(1, 'سوق الأجهزة', 'أحدث الجوالات والأجهزة اللوحية والساعات', 'من آبل وسامسونج وشاومي وهواوي وهونر وغيرها.', 'تسوّق الأجهزة', '/store/devices', dev),
               ad_slide(2, 'سوق الحلول الرقمية', 'متجرك الإلكتروني جاهز من الإعدادات إلى أول طلب', 'باقات وتصميم وربط وتوثيق بمخرجات واضحة.', 'تصفّح الحلول الرقمية', '/store/digital', dgi, dg=True),
               ad_slide(3, 'الأخبار والتحديثات', 'تابع طلباتك ومراسلاتك من حسابك', 'اطّلع على حالة طلباتك والردود والتحديثات من مكان واحد.', 'الدخول إلى البوابة', '/login', scr, scr=True)])
    stats = '<div class="ts-stats">' + ''.join(f'<div class="ts-stat">{T(ic, ["teal","saffron","navy","sky"][k % 4])}<div><b data-count="{v}">{v}</b><small>{e(l)}</small></div></div>' for k, (v, l, ic) in enumerate(STATS)) + '</div>'
    feats = (feat('about', 'تعرّف على تيرا', 'PiCompassFill', 'منصة تبدأ من احتياجك: منتج جاهز أو حل حسب الطلب', GROUPS['about']['sub'],
                  [('من نحن', '/p/s01', 'PiUsersThreeFill'), ('رؤيتنا', '/p/s02', 'PiEyeFill'), ('رسالتنا', '/p/s03', 'PiTargetFill'), ('فلسفة تيرا', '/p/s04', 'PiLightbulbFill')], cta=('تعرّف على تيرا', '/p/about')) +
             feat('services', 'الخدمات', 'PiGearSixFill', 'من طلبك إلى الحل المناسب، بخطوات واضحة', GROUPS['services']['sub'],
                  [('نموذج عمل تيرا', '/p/s05', 'PiGearSixFill'), ('رحلة العميل', '/p/s11', 'PiMapPinFill'), ('تجربة العميل', '/p/s15', 'PiHeartFill'), ('الجودة والموثوقية', '/p/s18', 'PiSealCheckFill')], rev=True, cta=('كل الخدمات', '/p/services')) +
             feat('products', 'المتجر', 'PiStorefrontFill', 'أجهزة وحلول رقمية وطلبات خاصة في مكان واحد', 'سوق الأجهزة وسوق الحلول الرقمية وخدمة حسب الطلب، بأسعار ومواصفات واضحة قبل الطلب.',
                  [('سوق الأجهزة', '/store/devices', 'PiDeviceMobileFill'), ('سوق الحلول الرقمية', '/store/digital', 'PiCodeFill'), (NEW, '/p/s25', 'PiFireFill'), ('خدمة حسب الطلب', '/store/custom', 'PiPaperPlaneTiltFill')], cta=('ادخل المتجر', '/p/products')) +
             feat('partners', 'خدمات الشركاء', 'PiHandshakeFill', 'منظومة تجمع الموردين ومزودي الدفع', GROUPS['partners']['sub'],
                  [('منظومة الموردين', '/p/s09', 'PiStorefrontFill'), ('منظومة الدفع', '/p/s10', 'PiWalletFill'), ('القيمة للشركاء', '/p/s13', 'PiChartBarFill'), ('فرص الشراكة', '/p/s21', 'PiHandshakeFill')], rev=True, cta=('خدمات الشركاء', '/p/partners')))
    top = (f'<section class="mk-sec"><div class="ts-h"><div><h2>{e(NEW)}<span class="ts-new">خدمة جديدة</span></h2><p>مختارات قليلة من أكثر المنتجات طلبًا هذا الموسم.</p></div>'
           f'<button type="button" class="t2-btn" data-go="/store/devices">عرض الكل</button></div><div class="tb"><div class="tb-row" role="region" tabindex="0">{top_cards(6)}</div></div></section>')
    film = (f'<section class="ts-film"><div class="ts-film-p ts-vid is-film" data-vid="film">'
            '<video muted loop playsinline preload="none" poster="https://media.tera-services.com.sa/library/launch-landscape.jpg" data-w="https://media.tera-services.com.sa/library/launch-landscape.mp4" data-m="https://media.tera-services.com.sa/library/launch-portrait.mp4" data-pw="https://media.tera-services.com.sa/library/launch-landscape.jpg" data-pm="https://media.tera-services.com.sa/library/launch-portrait.jpg" aria-label="فيلم تدشين منصة تيرا يعمل بدون صوت"></video>'
            f'<div class="ts-film-ctl"><button type="button" class="ts-film-snd" aria-pressed="false">{I("PiSpeakerSlashFill")}<span>تشغيل الصوت</span></button>'
            f'<button type="button" class="ts-film-fs" data-film aria-label="عرض الفيلم بملء الشاشة">{I("PiFilmSlateFill")}<span>ملء الشاشة</span></button></div></div>'
            '<div class="ts-film-b"><small>فيلم التدشين</small><h2>صُنعت لك — فيلم تدشين منصة تيرا</h2><p>ترحيبٌ يُحفَر بالليزر، وبطاقات العضوية الثلاث، وعالمٌ بلا حدود — في 32 ثانية.</p>'
            f'<div><button type="button" class="t2-btn is-primary" data-film>{I("PiPlayFill")} شاهد الفيلم</button></div></div></section>')
    _sp = [q for c in FAQ for q in c[2] if q[0] == 'q-spam']
    fq = ''.join(qsec(a, b, c2) for a, b, c2 in (FAQ[0][2][:3] + _sp + FAQ[3][2][:1]))
    faqb = (f'<section class="ts-feat ts-faqf"><div class="ts-feat-v ts-vid" data-vid="faq">{vmedia("faq")}</div>'
            f'<div class="ts-faqf-b"><div class="ts-h"><div><span class="ts-feat-k">{T("PiQuestionFill")}الأسئلة الشائعة</span><h2 class="ts-feat-t">إجابات واضحة لأكثر ما يسأل عنه العملاء</h2></div>'
            f'<button type="button" class="t2-btn" data-go="/faq">كل الأسئلة</button></div><div class="ts-faq">{fq}</div></div></section>')
    help_ = feat('help', 'مركز المراسلات', 'PiEnvelopeFill', 'طلب أو شكوى أو دعم، برقم مرجعي تتابع به', 'قدّم مراسلتك من مكان واحد، واحصل على رقم مرجعي تتابع به حالتها حتى الحل.',
                 [('طلب جديد', '/desk#request', 'PiPaperPlaneTiltFill'), ('شكوى', '/desk#complaint', 'PiWarningCircleFill'), ('الدعم الفني', '/desk#support', 'PiGearSixFill'), ('متابعة مراسلة', '/desk#follow', 'PiListChecksFill')],
                 rev=True, cta=('مركز المراسلات', '/desk'))
    return ('<div class="t2-stack ts-home">' + hero + qk + news + stats + feats + top + membership_block() + film + faqb + help_ + '</div>')
PAGES['/'] = dict(t='منصة تيرا للخدمات المتكاملة', h=home(), g='home')

# ---------- العضويات ----------
mem_faq = [('m1', 'ما هي عضويات تيرا؟', '<p>برنامج يكافئ عملاء المنصة بمزايا تختلف حسب مستوى العضوية، ويبدأ كل عميل بمستوى تيرا بلس.</p>'),
           ('m2', 'كيف أكسب النقاط؟', '<p>تُضاف النقاط إلى رصيدك مع طلباتك وخدماتك المؤهلة وفق قواعد البرنامج المعتمدة.</p>'),
           ('m3', 'كيف أستبدل نقاطي؟', '<p>يمكنك استبدال نقاطك في الخدمات والعروض المؤهلة من حسابك في المنصة.</p>'),
           ('m4', 'كيف أنتقل إلى مستوى أعلى؟', '<p>يرتبط الانتقال بحجم تعاملك مع المنصة واستمراريته، وتُمنح المستويات الأعلى وفق قواعد البرنامج.</p>')]
PAGES['/membership'] = dict(t='العضويات', g='membership', h=(phead([('الرئيسية', '/', 'PiHouseFill'), ('العضويات', None, None)]) +
    '<div class="t2-stack">' + shb('PiCrownFill', 'العضويات', 'تيرا بلس · تيرا بريميوم · تيرا إيليت — مزايا متدرجة وبرنامج نقاط مع طلباتك المؤهلة.') + membership_block(cta=False) +
    hc_sec('أسئلة عن العضويات', '4 أسئلة', 'PiQuestionFill', '<div class="ts-faq" style="padding:14px 16px 16px">' + ''.join(qsec(*x) for x in mem_faq) + '</div>') +
    f'<section class="st-bulk"><span class="st-bulk-ic">{T("PiCrownFill", "saffron")}</span><div class="st-bulk-tx"><b>ابدأ عضويتك مع أول حساب</b><span>أنشئ حسابك في البوابة، وتبدأ عضويتك بمستوى تيرا بلس.</span></div><button class="t2-btn is-primary" type="button" data-go="/login">{GO}إنشاء حساب</button></section>' + '</div>'))
