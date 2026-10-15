from content import *

PAGES = {}   # path -> dict(t=title, h=html)
NUM = {}
n = 0
for g in ['about', 'services', 'partners']:
    for sid, t, ic in GROUPS[g]['items']:
        n += 1; NUM[sid] = '%02d' % n

S25_ROWS = [('PiTrendUpFill', 'مختارات مبنية على حجم الطلب والتداول', 'نرصد المنتجات التي يكثر طلبها وتداولها، ونجمعها في مكان واحد.'),
            ('PiDeviceMobileFill', 'الجوالات والأجهزة الذكية', 'أحدث الإصدارات وأكثرها طلبًا من العلامات المعروفة.'),
            ('PiWatchFill', 'الساعات والسماعات والإكسسوارات', 'الملحقات الأكثر تداولًا التي يحتاجها العميل مع جهازه.'),
            ('PiTagFill', 'سعر ومواصفات واضحة قبل الطلب', 'تظهر المواصفات والسعر والخيارات على بطاقة المنتج قبل إتمام الطلب.'),
            ('PiCreditCardFill', 'وسائل دفع متعددة', 'إتمام الطلب عبر وسائل الدفع المتاحة ومزودي الدفع المعتمدين.'),
            ('PiArrowsClockwiseFill', 'قائمة تتجدد باستمرار', 'نحدّث المختارات وفق اتجاهات السوق واحتياجات العملاء.')]
ABOUT_P = f'وتوفر تيرا عبر متجرها منتجات جاهزة للطلب المباشر في سوق الأجهزة الذكية وسوق الحلول الرقمية، بمواصفات وأسعار واضحة قبل الطلب، إلى جانب خدمة {NEW}؛ لتجمع المنصة بين سرعة الوصول إلى المنتج الجاهز ومرونة الطلب حسب الاحتياج.'

# ---- المنتجات الجاهزة: تعديلات على أقسام «تيرا» بما يتسق مع مفهوم «نبدأ من الاحتياج» ----
def _card(ic, b, s='', tone='teal'):
    sm = f'<small>{e(s)}</small>' if s else ''
    return f'<div class="hc is-static"><span class="hc-row"><span class="hc-ic">{T(ic, tone)}</span><span class="hc-tx"><b>{e(b)}</b>{sm}</span></span></div>'
def _p(cls, s): return f'<p class="ts-{cls}">{e(s)}</p>'
def _note(s): return f'<p class="ts-note">{T("PiInfoFill")}<span>{e(s)}</span></p>'
READY = {
  's01': [('تعتمد تيرا على نموذج عمل يبدأ من احتياج العميل وليس من قائمة منتجات ثابتة؛ حيث يستطيع العميل تقديم طلبه ومواصفاته ومتطلباته من خلال منتج حسب الطلب',
           'تعتمد تيرا على نموذج عمل يبدأ من احتياج العميل؛ فإن وجد احتياجه ضمن المنتجات الجاهزة طلبه مباشرة من المتجر، وإن كان احتياجه خاصًا قدّم طلبه ومواصفاته ومتطلباته من خلال منتج حسب الطلب')],
  's02': [('من خلال التقنية والشراكات وتعدد الخيارات.',
           'من خلال التقنية والشراكات وتعدد الخيارات، بين منتجات جاهزة للطلب المباشر وحلول تُبنى حسب الاحتياج.')],
  's03': [('تقديم تجربة رقمية تبدأ بفهم احتياج العميل، ثم دراسة الطلب',
           'تقديم تجربة رقمية تبدأ بفهم احتياج العميل؛ فتضع بين يديه منتجات جاهزة بمواصفات وأسعار واضحة للطلب المباشر، وتتولى في الطلبات الخاصة دراسة الطلب')],
  's04': [('<p class="ts-p">ومن هنا يأتي دور تيرا في تنظيم هذه الرحلة:</p>',
           _p('p', 'ومن هنا يأتي دور تيرا: فإن كان احتياجه متوفرًا ضمن المنتجات الجاهزة وصل إليه مباشرة من المتجر، وإن كان احتياجًا خاصًا نظّمت تيرا رحلته:'))],
  's05': [('تعمل تيرا وفق نموذج مرن يتيح للعميل تقديم احتياجه بدلًا من حصره في منتجات محددة مسبقًا.',
           'تعمل تيرا وفق نموذج مرن بمسارين: منتجات جاهزة يطلبها العميل مباشرة من المتجر، وطلبات حسب الاحتياج لا تنحصر في منتجات محددة مسبقًا.'),
          ('<div class="hc-g ts-items">', '<div class="hc-g ts-items">' + _card('PiShoppingBagFill', 'عرض منتجات جاهزة للطلب المباشر', 'بمواصفات وأسعار واضحة قبل الطلب', 'saffron'))],
  's07': [('لا تقتصر تيرا على فئة محددة من المنتجات أو الخدمات، وإنما يعتمد نطاق العمل على طبيعة الطلب وإمكانية توفير الحل المناسب.',
           'تقدم تيرا منتجات جاهزة للطلب المباشر عبر متجرها، ولا تقتصر على فئة محددة من المنتجات أو الخدمات؛ إذ يمتد نطاق العمل بحسب طبيعة الطلب وإمكانية توفير الحل المناسب.'),
          ('@@ITEMS_END@@', _card('PiDeviceMobileFill', 'الأجهزة الذكية الجاهزة', 'جوالات وأجهزة لوحية وساعات وسماعات وإكسسوارات') +
                            _card('PiCodeFill', 'الحلول الرقمية الجاهزة', 'باقات وتصميم وحلول تقنية وقانونية بمخرجات واضحة') + '@@ITEMS_END@@')],
  's11': [('@@END@@', '<div class="ts-sb">' + _note('وفي المنتجات الجاهزة تختصر الرحلة: تختار المنتج من المتجر، ثم وسيلة الدفع، ثم تتابع طلبك حتى التسليم.') + '</div>')],
  's12': [('@@ITEMS_END@@', _card('PiShoppingBagFill', 'منتجات جاهزة بسعر ومواصفات واضحة', '', 'saffron') + _card('PiClockFill', 'طلب مباشر دون انتظار') + '@@ITEMS_END@@')],
  's14': [('@@ITEMS_END@@', _card('PiStorefrontFill', 'متجر المنتجات الجاهزة') + _card('PiShoppingCartFill', 'السلة والمفضلة وإتمام الطلب') + '@@ITEMS_END@@')],
  's16': [('استقبال الطلب ودراسة الاحتياج والبحث والتنسيق وتقديم الخيارات وتنظيم العملية والمتابعة ضمن نطاق المنصة.',
           'عرض المنتجات الجاهزة وتنظيم طلبها، واستقبال الطلبات الخاصة ودراسة الاحتياج والبحث والتنسيق وتقديم الخيارات وتنظيم العملية والمتابعة ضمن نطاق المنصة.')],
  's19': [('@@END@@', '<div class="ts-sb">' + _p('p', 'ومع ذلك لا تغيب سهولة المتجر؛ فلمن يعرف ما يريد توفر تيرا منتجات جاهزة يطلبها مباشرة، لتجمع المنصة بين سرعة المنتج الجاهز ومرونة الحل حسب الاحتياج.') + '</div>')],
  's20': [('@@ITEMS_END@@', _card('PiShoppingBagFill', 'توسيع متجر المنتجات الجاهزة') + '@@ITEMS_END@@')],
  's24': [('<p class="ts-lead">وهنا يأتي دور تيرا؛ منصة تبدأ من الاحتياج، وتعمل على تنظيم الطريق للوصول إلى المنتج أو الخدمة أو الحل المناسب.</p>',
           _p('lead', 'وهنا يأتي دور تيرا؛ منصة تبدأ من الاحتياج، وتعمل على تنظيم الطريق للوصول إلى المنتج أو الخدمة أو الحل المناسب.') +
           _p('p', 'ولمن يعرف ما يريد، تضع تيرا بين يديه منتجات جاهزة يطلبها مباشرة؛ ليجد في منصة واحدة المنتج الجاهز والحل المخصص.'))],
}
def ready(sid, inner):
    for old, new in READY.get(sid, []):
        if old == '@@END@@': inner += new; continue
        assert old in inner, (sid, old[:60])
        inner = inner.replace(old, new, 1)
    return inner

def band_html(sid):
    """the converted section for sid (title, inner) from its detail file"""
    if sid == 's25':
        cards = ''.join(f'<div class="hc is-static"><span class="hc-row"><span class="hc-ic">{T(ic)}</span><span class="hc-tx"><b>{e(b)}</b><small>{e(s)}</small></span></span></div>' for ic, b, s in S25_ROWS)
        inner = (f'<div class="ts-sb"><p class="ts-lead">خدمة جديدة في منصة تيرا تضع بين يديك مختارات من المنتجات الأكثر طلبًا وتداولًا في السوق، جاهزة للطلب المباشر دون انتظار مرحلة الدراسة والبحث.</p>'
                 '<p class="ts-pre">وتشمل الخدمة:</p></div>' + f'<div class="hc-g ts-items">{cards}</div>'
                 f'<div class="ts-sb"><p class="ts-note">{T("PiInfoFill")}<span>وتكمل هذه الخدمة نموذج تيرا القائم على الاحتياج؛ فإن لم تجد ما تبحث عنه ضمن الأكثر طلبًا، يمكنك تقديم طلبك من خلال خدمة حسب الطلب.</span></p></div>'
                 '<div class="ts-cta"><button type="button" class="t2-btn is-primary" data-go="/store/devices">تصفّح سوق الأجهزة</button><button type="button" class="t2-btn" data-go="/store/custom">خدمة حسب الطلب</button></div>')
        return NEW, inner
    bs = bands_of(Q + f'/p/{sid}.html')
    sid_b = [b for i, b in bs if i == sid] or [b for _, b in bs]
    t, num, inner = convert_band(sid_b[0], 'PiCompassFill')
    if sid == 's01':
        inner = inner.replace('<p class="ts-p">وتعمل تيرا على بناء', f'<p class="ts-p">{e(ABOUT_P)}</p><p class="ts-p">وتعمل تيرا على بناء', 1)
    if sid == 's07':
        add = f'<div class="hc is-static"><span class="hc-row"><span class="hc-ic">{T("PiFireFill", "saffron")}</span><span class="hc-tx"><b>{e(NEW)}</b><small>خدمة جديدة</small></span></span></div>'
        inner = inner.replace('@@ITEMS_END@@', add + '@@ITEMS_END@@', 1)
    inner = ready(sid, inner)
    return t or PAGE_META[sid][0], inner.replace('@@ITEMS_END@@', '')

def lead_of(inner):
    m = re.search(r'<p class="ts-(?:lead|p)">(.*?)</p>', inner)
    s = re.sub('<[^>]+>', '', m.group(1)) if m else ''
    return H.unescape(s)

def short(s, n=90):
    s = s.strip()
    return s if len(s) <= n else s[:n].rsplit(' ', 1)[0] + '…'

BANDS = {}
for g, d in GROUPS.items():
    for sid, t, ic in d['items']:
        BANDS[sid] = band_html(sid)

def section_block(sid, f=None):
    t, inner = BANDS[sid]; ic = PAGE_META[sid][1]
    return hc_sec(PAGE_META[sid][0], 'القسم ' + NUM[sid], ic, inner, f=f, sid=sid)

# ---------- hubs ----------
for g, d in GROUPS.items():
    items = d['items']
    cards = ''.join(hc_link(f'/p/{sid}', t, short(lead_of(BANDS[sid][1])), ic, meta='القسم ' + NUM[sid]) for sid, t, ic in items)
    chips = [('all', 'الكل', count_ar(len(items), 'قسم واحد', 'قسمان', 'أقسام', 'قسمًا'), d['ic'])] + [(sid, t, 'القسم ' + NUM[sid], ic) for sid, t, ic in items]
    body = (phead([('الرئيسية', '/', 'PiHouseFill'), (d['t'], None, None)]) +
            '<div class="t2-stack">' + shb(d['ic'], d['t'], d['sub']) + vid(d['vid']) + hf_row(chips, d['t']) +
            hc_sec('صفحات القسم', count_ar(len(items), 'صفحة واحدة', 'صفحتان', 'صفحات', 'صفحة'), d['ic'], f'<div class="hc-g">{cards}</div>', f='all') +
            ''.join(section_block(sid, f=sid) for sid, _, _ in items) + '</div>')
    PAGES[d['hub']] = dict(t=d['t'], h=body, g=g)

# ---------- detail pages ----------
for g, d in GROUPS.items():
    items = d['items']
    for k, (sid, t, ic) in enumerate(items):
        sib = [x for x in items if x[0] != sid][:6]
        sibs = ''.join(hc_link(f'/p/{s2}', t2, short(lead_of(BANDS[s2][1]), 70), ic2) for s2, t2, ic2 in sib)
        nxt = items[(k + 1) % len(items)]
        body = (phead([('الرئيسية', '/', 'PiHouseFill'), (d['t'], d['hub'], d['ic']), (t, None, None)], back=(d['t'], d['hub'])) +
                '<div class="t2-stack">' + shb(ic, t, short(lead_of(BANDS[sid][1]), 140)) + vid(d['vid']) +
                section_block(sid) +
                f'<section class="st-bulk ts-next"><span class="st-bulk-ic">{T(nxt[2])}</span><div class="st-bulk-tx"><b>التالي: {e(nxt[1])}</b><span>تابع القراءة في {e(d["t"])}.</span></div><button class="t2-btn is-primary" type="button" data-go="/p/{nxt[0]}">{GO}التالي</button></section>' +
                hc_sec('تصفّح أيضًا', d['t'], d['ic'], f'<div class="hc-g">{sibs}</div>', cls='is-rel') + '</div>')
        PAGES[f'/p/{sid}'] = dict(t=t, h=body, g=g)
PAGES['/p/s06'] = PAGES['/p/s05']

# ---------- policies ----------
def policy_page(key, title, ic):
    s = soup_main(Q + f'/policies/{key}.html')
    mast = s.find(class_='policy-mast')
    upd = txt(mast.find(class_='policy-updated')) if mast else ''
    lead = txt(mast.find(class_='lead')) if mast else ''
    scope = txt(mast.find(class_='policy-scope')) if mast else ''
    secs = ''
    lis = s.select('ul.policy-clauses > li')
    for i, li in enumerate(lis):
        b = li.find('b'); pn = b.find(class_='pn') if b else None
        num = txt(pn) if pn else str(i + 1)
        if pn: pn.decompose()
        head = txt(b)
        div = li.find('div') or li
        if b: b.decompose()
        for sv in div.find_all('svg'): sv.decompose()
        cont = ''
        for c in div.find_all(['p', 'ul', 'ol'], recursive=False):
            if c.name == 'p': cont += f'<p class="ts-p">{inner_text_html(c)}</p>'
            else: cont += '<ul class="pp-hl ts-ul">' + ''.join(f'<li><span>{e(txt(x))}</span></li>' for x in c.find_all('li')) + '</ul>'
        if not cont: cont = f'<p class="ts-p">{e(txt(div))}</p>'
        op = i == 0
        secs += (f'<section class="t2-sec"><button type="button" class="t2-group-h t2-sec-h" aria-expanded="{"true" if op else "false"}"><span class="t2-sec-tx"><h2 class="t2-group-t">{e(num)}. {e(head)}</h2></span><span class="t2-chev" aria-hidden="true"></span></button>'
                 f'<div class="t2-sec-b"{"" if op else " hidden"}><div class="t2-stack-tight">{cont}</div></div></section>')
    others = ''.join(hc_link(f'/policies/{k2}', t2, 'المعلومات والسياسات', ic2) for k2, t2, ic2 in POLICIES if k2 != key)
    body = (phead([('الرئيسية', '/', 'PiHouseFill'), ('المعلومات والسياسات', '/policies', 'PiShieldCheckFill'), (title, None, None)], back=('المعلومات والسياسات', '/policies')) +
            '<div class="t2-stack">' + shb(ic, title, upd) + vid('policies') +
            (f'<div class="ts-note">{T("PiInfoFill")}<div><b>{e(title)}</b><p>{e(lead)}</p>' + (f'<p>{e(scope)}</p>' if scope else '') + '</div></div>' if lead else '') +
            f'<div class="ts-faq">{secs}</div>' +
            hc_sec('سياسات أخرى', count_ar(len(POLICIES) - 1, '', '', 'سياسات', 'سياسة'), 'PiShieldCheckFill', f'<div class="hc-g">{others}</div>') + '</div>')
    return body
for k, t, ic in POLICIES:
    PAGES[f'/policies/{k}'] = dict(t=t, h=policy_page(k, t, ic), g='help')
pol_cards = ''.join(hc_link(f'/policies/{k}', t, 'اقرأ السياسة كاملة', ic) for k, t, ic in POLICIES)
PAGES['/policies'] = dict(t='المعلومات والسياسات', g='help', h=(phead([('الرئيسية', '/', 'PiHouseFill'), ('المعلومات والسياسات', None, None)]) +
    '<div class="t2-stack">' + shb('PiShieldCheckFill', 'المعلومات والسياسات', 'سياسات الاستخدام والخصوصية والاسترجاع والاستبدال والشحن والضمان، بوضوح كامل.') + vid('policies') +
    hc_sec('السياسات', count_ar(len(POLICIES), '', '', 'سياسات', 'سياسة'), 'PiShieldCheckFill', f'<div class="hc-g">{pol_cards}</div>') + '</div>'))

# ---------- FAQ ----------
def faq_data():
    s = soup_main(Q + '/faq.html')
    cats = []
    cards = {c.get('aria-controls'): txt(c.find('strong')) for c in s.select('.faq-board .faq-card')}
    for stage in s.select('[id]'):
        sid = stage.get('id')
        if sid not in cards: continue
        qs = []
        for it in stage.select('.faq-item'):
            q = re.sub(r'^\d+\s*[.\-–]\s*', '', txt(it.find(class_='qtext'))); a = it.find(class_='faq-a-inner')
            if q and a: qs.append((it.get('id', ''), q, ''.join(f'<p>{e(txt(p))}</p>' for p in a.find_all('p')) or f'<p>{e(txt(a))}</p>'))
        if qs: cats.append((sid, cards[sid], qs))
    return cats
FAQ = faq_data()
FAQ_READY = {
 'q1': 'كما توفر عبر متجرها منتجات جاهزة للطلب المباشر، إلى جانب خدمة حسب الطلب للاحتياجات الخاصة.',
 'q2': 'وتشمل منتجات جاهزة للطلب المباشر في سوق الأجهزة الذكية وسوق الحلول الرقمية، وخدمة حسب الطلب لمن لديه احتياج خاص.',
 'q9': 'وإن كان ما تحتاجه منتجًا جاهزًا، يمكنك طلبه مباشرة من المتجر وإتمام الطلب بوسيلة الدفع المتاحة.',
}
FAQ = [(c, t, [(qi, q, a + (f'<p>{e(FAQ_READY[qi])}</p>' if qi in FAQ_READY else '')) for qi, q, a in qs]) for c, t, qs in FAQ]
_SPQ = ('q-spam', 'لم يصلني رمز التحقق أو رسالة المنصة على البريد، ماذا أفعل؟',
        '<p>قد تذهب رسائل التحقق ورسائل المنصة أحيانًا إلى مجلد الرسائل غير المرغوب فيها (البريد العشوائي) في بريدك الإلكتروني. تحقّق منه، وانقل الرسالة إلى البريد الوارد ليصلك ما بعدها مباشرة.</p>'
        '<p>وإن لم تجدها، فتأكّد من كتابة البريد بشكل صحيح، وانتظر انتهاء مهلة إعادة الإرسال ثم اطلب رمزًا جديدًا، أو اختر وسيلة أخرى مثل واتساب.</p>')
FAQ = [(c, t, (qs[:1] + [_SPQ] + qs[1:]) if c == 'account' else qs) for c, t, qs in FAQ]
QIC = {}; QTONE = {}
FAQ_IC = ['PiCompassFill', 'PiGearSixFill', 'PiUserFill', 'PiListChecksFill', 'PiIdentificationCardFill', 'PiWalletFill', 'PiCreditCardFill', 'PiTruckFill', 'PiArrowUUpLeftFill', 'PiArrowsLeftRightFill', 'PiShieldCheckFill', 'PiChatsCircleFill', 'PiLockKeyFill', 'PiFingerprintFill', 'PiHandshakeFill', 'PiQuestionFill', 'PiInfoFill']
for _i, _c in enumerate(FAQ):
    for _q in _c[2]: QIC[_q[0]] = FAQ_IC[_i % len(FAQ_IC)]; QTONE[_q[0]] = ['teal', 'saffron', 'navy', 'sky'][_i % 4]
def qsec(qid, q, a, op=False, ic=None):
    ic = ic or QIC.get(qid, 'PiQuestionFill')
    return (f'<section class="t2-sec ts-q" id="{qid}"><button type="button" class="t2-group-h t2-sec-h" aria-expanded="{"true" if op else "false"}"><span class="ts-q-ic">{T(ic, QTONE.get(qid, "teal"))}</span><span class="t2-sec-tx"><h2 class="t2-group-t">{e(q)}</h2></span><span class="t2-chev" aria-hidden="true"></span></button>'
            f'<div class="t2-sec-b"{"" if op else " hidden"}><div class="t2-stack-tight">{a}</div></div></section>')
chips = [('all', 'الكل', f'{sum(len(c[2]) for c in FAQ)} سؤالًا', 'PiQuestionFill')] + [(c[0], c[1], count_ar(len(c[2]), 'سؤال واحد', 'سؤالان', 'أسئلة', 'سؤالًا'), FAQ_IC[i % len(FAQ_IC)]) for i, c in enumerate(FAQ)]
faq_secs = ''.join(hc_sec(c[1], count_ar(len(c[2]), 'سؤال واحد', 'سؤالان', 'أسئلة', 'سؤالًا'), FAQ_IC[i % len(FAQ_IC)], '<div class="ts-faq" style="padding:14px 16px 16px">' + ''.join(qsec(a, b, c2) for a, b, c2 in c[2]) + '</div>', tone=i % 4, f=c[0]) for i, c in enumerate(FAQ))
PAGES['/faq'] = dict(t='الأسئلة الشائعة', g='help', h=(phead([('الرئيسية', '/', 'PiHouseFill'), ('الأسئلة الشائعة', None, None)]) +
    '<div class="t2-stack">' + shb('PiQuestionFill', 'الأسئلة الشائعة', 'مرجع واضح ومختصر عن خدمات المنصة والطلبات والدفع والشحن والاسترجاع والضمان والخصوصية.') + vid('faq') +
    hf_row(chips, 'أقسام الأسئلة') + faq_secs + '</div>'))
