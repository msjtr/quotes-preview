from lib import *
from bs4 import BeautifulSoup, NavigableString

NEW = 'المنتجات الأكثر طلبًا وتداولًا'
GROUPS = {
  'about': dict(t='تعرّف على تيرا', hub='/p/about', ic='PiCompassFill', vid='about',
     sub='منصة رقمية سعودية تنظّم وصولك إلى المنتجات الجاهزة والخدمات والحلول التي تناسب احتياجك.',
     items=[('s01','من نحن','PiUsersThreeFill'),('s02','رؤيتنا','PiEyeFill'),('s03','رسالتنا','PiTargetFill'),('s04','فلسفة تيرا','PiLightbulbFill'),('s19','ما الذي يميز تيرا؟','PiMedalFill'),('s24','لماذا تيرا؟','PiQuestionFill')]),
  'services': dict(t='الخدمات', hub='/p/services', ic='PiGearSixFill', vid='services',
     sub='نموذج مرن يبدأ من احتياجك: منتج جاهز تطلبه مباشرة، أو طلب خاص يمر بالدراسة والتنسيق حتى الحل المناسب.',
     items=[('s05','نموذج عمل تيرا','PiGearSixFill'),('s07','المنتجات والخدمات والحلول','PiPackageFill'),('s25',NEW,'PiFireFill'),('s08','الفئات المستهدفة','PiUsersThreeFill'),('s11','رحلة العميل','PiMapPinFill'),('s12','القيمة المقدمة للعميل','PiStarFill'),('s14','التقنية والتحول الرقمي','PiDevicesFill'),('s15','تجربة العميل','PiHeartFill'),('s16','الشفافية ووضوح المسؤوليات','PiScalesFill'),('s17','حماية بيانات العملاء','PiLockKeyFill'),('s18','الجودة والموثوقية','PiSealCheckFill'),('s20','التوسع والتطوير','PiRocketLaunchFill'),('s23','الالتزام','PiHandshakeFill')]),
  'partners': dict(t='خدمات الشركاء', hub='/p/partners', ic='PiHandshakeFill', vid='partners',
     sub='منظومة تجمع الموردين ومقدمي الخدمات ومزودي الدفع في مسار واحد واضح.',
     items=[('s09','منظومة الموردين والشركاء','PiStorefrontFill'),('s10','منظومة الدفع وخيارات السداد','PiWalletFill'),('s13','القيمة المقدمة للموردين والشركاء','PiChartBarFill'),('s21','فرص الشراكة','PiHandshakeFill')]),
}
POLICIES = [('usage','سياسة الاستخدام','PiFileTextFill'),('privacy','سياسة الخصوصية','PiLockKeyFill'),('user-guide','دليل المستخدم','PiBookOpenTextFill'),
            ('refunds','سياسة الاسترجاع واسترداد المبالغ','PiArrowUUpLeftFill'),('exchange','سياسة الاستبدال','PiArrowsLeftRightFill'),('shipping','سياسة الشحن والتوصيل','PiTruckFill'),
            ('warranty','سياسة الضمان','PiShieldCheckFill'),('complaints','سياسة الشكاوى والاقتراحات','PiChatsCircleFill'),('partners','سياسة خدمات الشركاء','PiHandshakeFill'),('terms','الشروط والأحكام','PiScalesFill')]
PAGE_GROUP = {sid: g for g, d in GROUPS.items() for sid, _, _ in d['items']}
PAGE_META = {sid: (t, ic) for g, d in GROUPS.items() for sid, t, ic in d['items']}

def soup_main(path):
    h = open(path).read(); m = h[h.find('<main'):h.find('</main>') + 7]
    return BeautifulSoup(fix(m), 'lxml')

def svg_d(el):
    s = el.find('svg') if el else None
    if not s: return None
    ps = s.find_all('path')
    return ps[-1]['d'] if ps else None

def txt(el):
    return ' '.join(el.get_text(' ', strip=True).split()) if el else ''

def inner_text_html(el):
    """keep inline links/bold/br, drop svgs"""
    for s in el.find_all('svg'): s.decompose()
    out = ''
    for c in el.children:
        out += str(c)
    return out.strip()

TONES = ['teal', 'teal', 'sky', 'saffron', 'navy']
def li_cards(ul, default_icon='PiCheckCircleFill'):
    cards = ''
    for i, li in enumerate(ul.find_all('li', recursive=False)):
        d = svg_d(li) or ICON[default_icon]
        b = li.find('b'); p = li.find('p')
        title = txt(b) if b else txt(li)
        sub = txt(p) if p else ''
        if b is None and p is None:
            div = li.find('div'); sub = ''
        cards += (f'<div class="hc is-static"><span class="hc-row"><span class="hc-ic">{TP("teal", d)}</span>'
                  f'<span class="hc-tx"><b>{e(title)}</b>' + (f'<small>{e(sub)}</small>' if sub else '') + '</span></span></div>')
    return f'<div class="hc-g ts-items">{cards}@@ITEMS_END@@</div>'

def steps(el):
    items = el.find_all('span', recursive=False) or el.find_all('li', recursive=False)
    out = '<ol class="ts-path">'
    for it in items:
        d = svg_d(it) or ICON['PiCheckCircleFill']
        lab = txt(it.find('em') or it.find('b') or it)
        out += f'<li>{TP("teal", d)}<span>{e(lab)}</span></li>'
    return out + '</ol>'

def convert_band(band, gicon):
    w = band.find(class_='wrap') or band
    title = ''; num = ''; body = ''; items = ''
    def walk(nodes):
        nonlocal title, num, body, items
        for ch in nodes:
            if isinstance(ch, NavigableString) or ch.name is None: continue
            cl = ch.get('class', [])
            if ch.name == 'header' and 'block-head' in cl:
                num = txt(ch.find(class_='num')); title = txt(ch.find('h2'))
            elif ch.name == 'p' and 'lead' in cl: body += f'<p class="ts-lead">{e(txt(ch))}</p>'
            elif ch.name == 'p' and 'pre' in cl: body += f'<p class="ts-pre">{e(txt(ch))}</p>'
            elif ch.name == 'p' and ('quote' in cl):
                parts = [x.strip() for x in ch.get_text('\n').split('\n') if x.strip()]
                body += '<p class="ts-quote">' + '<br>'.join(e(x) if i == 0 else f'<em>{e(x)}</em>' for i, x in enumerate(parts)) + '</p>'
            elif ch.name == 'p' and 'foot-note' in cl: body += f'<p class="ts-note">{T("PiInfoFill")}<span>{e(txt(ch))}</span></p>'
            elif ch.name == 'p' and 'hint' in cl: body += f'<p class="ts-p">{e(txt(ch))}</p>'
            elif ch.name == 'p': body += f'<p class="ts-p">{e(txt(ch))}</p>'
            elif ch.name in ('ul', 'ol') and ('chips' in cl): body += '<ul class="ts-chips">' + ''.join(f'<li>{e(txt(li))}</li>' for li in ch.find_all('li')) + '</ul>'
            elif ch.name in ('ul', 'ol') and set(cl) & {'rows', 'stack', 'wide', 'cards', 'timeline'}:
                if body: items += f'<div class="ts-sb">{body}</div>'; body = ''
                items += li_cards(ch)
            elif ch.name == 'aside' and 'note' in cl:
                d = ch.find('div') or ch
                b = d.find('b'); ps = d.find_all('p')
                lk = d.find('a', class_='inlink')
                body += (f'<div class="ts-note">{T("PiInfoFill")}<div><b>{e(txt(b))}</b>' + ''.join(f'<p>{e(txt(p))}</p>' for p in ps)
                         + (f'<p><button type="button" class="ts-link" data-go="{lk["href"]}">{e(txt(lk))}</button></p>' if lk else '') + '</div></div>')
            elif ch.name == 'div' and 'split' in cl: walk(ch.children)
            elif ch.name == 'div' and 'hero-mark' in cl: pass
            elif ch.name == 'div' and 'prose' in cl:
                body += ''.join(f'<p class="ts-p">{e(txt(p))}</p>' for p in ch.find_all('p'))
            elif ch.name == 'div' and 'vm-row' in cl:
                body += ''.join(f'<p class="ts-lead">{e(txt(p))}</p>' for p in ch.find_all('p'))
            elif ch.name == 'div' and 'versus' in cl:
                body += '<div class="ts-vs">' + ''.join(f'<div class="{"is-new" if "new" in v.get("class", []) else ""}"><span>{e(txt(v.find("span")))}</span><q>{e(txt(v.find("q")))}</q></div>' for v in ch.find_all('div', class_='vs')) + '</div>'
            elif (ch.name == 'div' and 'path' in cl) or (ch.name == 'a' and 'flow' in cl): body += steps(ch)
            elif ch.name == 'a' and 'portal' in cl:
                body += f'<div class="ts-cta"><button type="button" class="t2-btn is-primary" data-go="{ch["href"]}">{e(txt(ch.find("b")))}</button></div>'
            elif ch.name == 'div' and not cl: walk(ch.children)
            elif ch.name == 'section': walk((ch.find(class_='wrap') or ch).children)
            elif 'detail-end' in cl: pass
            else:
                t = txt(ch)
                if t: body += f'<p class="ts-p">{e(t)}</p>'
    walk(w.children)
    inner = (f'<div class="ts-sb">{body}</div>' if body else '') + items
    return title, num, inner

def bands_of(path):
    s = soup_main(path)
    return [(b.get('id') or '', b) for b in s.select('main > section.band, main section.band[id]')]
