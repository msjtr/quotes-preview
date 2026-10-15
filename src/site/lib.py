import re, json, os, html as H
SP = '/tmp/claude-0/-home-claude/c559dbdd-1eea-5df0-9991-28b01da0c844/scratchpad'
B2 = SP + '/sb2'
Q = SP + '/site/quotes'
ICON = json.load(open(SP + '/sb/icons.json'))
TONE = {'teal': ('#06707A', 'top-teal'), 'saffron': ('#B9690F', 'top-saffron'), 'navy': ('#0B2349', 'top-navy'),
        'sky': ('#1B5F93', 'top-sky'), 'gold': ('#B9690F', 'top-gold')}

def TP(tone, d, cls='t2-tile'):
    b, g = TONE[tone]
    return (f'<svg class="{cls}" viewBox="0 0 100 112" aria-hidden="true"><ellipse cx="50" cy="101" rx="38" ry="8" fill="url(#gshadow)"/>'
            f'<rect x="10" y="17" width="80" height="80" rx="25" fill="{b}"/><rect x="10" y="7" width="80" height="80" rx="25" fill="url(#{g})"/>'
            '<g clip-path="url(#tileclip)"><ellipse cx="34" cy="14" rx="58" ry="30" fill="#fff" opacity=".2"/></g>'
            '<rect x="11.5" y="8.5" width="77" height="77" rx="23.5" fill="none" stroke="url(#rim)" stroke-width="2"/>'
            f'<g transform="translate(29.5,28) scale(0.171875)" fill="{b}" opacity=".55"><path d="{d}"/></g>'
            f'<g transform="translate(28,25) scale(0.171875)" fill="#fff"><path d="{d}"/></g></svg>')
def T(icon, tone='teal'):
    return TP(tone, ICON[icon])
def I(icon, cls='ts-i'):
    return f'<svg class="{cls}" viewBox="0 0 256 256" aria-hidden="true"><path d="{ICON[icon]}"/></svg>'
GO = '<svg class="t2-ui-ic" width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M168,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,168,48Z"></path></svg>'
BACK = '<svg class="t2-ui-ic" width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>'
e = H.escape

def phead(crumbs, back=None):
    """crumbs: list of (label, href|None, icon)"""
    out = '<header class="t2-phead">'
    if back:
        out += f'<button type="button" class="t2-back" data-go="{back[1]}">{BACK}<span>رجوع إلى {e(back[0])}</span></button>'
    out += '<nav class="t2-crumbs" aria-label="المسار"><ol class="t2-crumb-ol">'
    for i, (lab, href, ic) in enumerate(crumbs):
        if i: out += '<li class="t2-crumb-s" aria-hidden="true"></li>'
        if href and i < len(crumbs) - 1:
            out += f'<li class="t2-crumb-li"><button type="button" class="t2-crumb-a" data-go="{href}">{T(ic) if ic else ""}<span>{e(lab)}</span></button></li>'
        else:
            out += f'<li class="t2-crumb-li"><span class="t2-crumb-c" aria-current="page">{e(lab)}</span></li>'
    return out + '</ol></nav></header>'

def shb(icon, title, sub='', extra=''):
    return (f'<div class="shb"><div class="shb-h"><span class="shb-ic">{T(icon)}</span><div><h1 class="shb-t">{e(title)}</h1>'
            + (f'<p class="shb-s">{e(sub)}</p>' if sub else '') + f'</div></div>{extra}</div>')

def vmedia(name):
    """video with wide (8:3 / hero 64:27) and mobile (1:1 / hero 4:5) renders; source chosen at runtime"""
    return (f'<video muted loop playsinline preload="none" poster="vid/{name}.jpg" data-w="vid/{name}.mp4" data-m="vid/{name}-m.mp4" '
            f'data-pw="vid/{name}.jpg" data-pm="vid/{name}-m.jpg"></video>')

def vid(name, cls=''):
    return (f'<div class="ts-vid {cls}" data-vid="{name}">{vmedia(name)}'
            f'<button type="button" class="ts-vid-b" aria-label="إيقاف الفيديو">{I("PiPauseFill")}<span>إيقاف</span></button></div>')

def hf_row(items, label='تصفية'):
    """items: (key, title, small, icon)"""
    out = f'<div class="hf-row" role="tablist" aria-label="{e(label)}">'
    for i, (k, t, s, ic) in enumerate(items):
        on = ' is-on' if i == 0 else ''
        out += (f'<button type="button" role="tab" aria-selected="{"true" if i == 0 else "false"}" class="hf-c{on}" data-flt="{k}">'
                f'<span class="hf-ic">{T(ic)}</span><span class="hf-tx"><b>{e(t)}</b><small>{e(s)}</small></span></button>')
    return out + '</div>'

def hc_sec(title, small, icon, inner, tone=0, f=None, cls='', sid=None):
    fa = f' data-f="{f}"' if f else ''
    ia = f' id="{sid}"' if sid else ''
    return (f'<section class="hc-sec is-t{tone} {cls}"{fa}{ia} aria-label="{e(title)}"><header class="hc-sec-h"><span class="hc-sec-ic">{T(icon)}</span>'
            f'<h2>{e(title)}</h2>' + (f'<small>{e(small)}</small>' if small else '') + f'</header>{inner}</section>')

def hc_link(href, title, sub, icon, meta=None, big=False, tone='teal'):
    return (f'<button type="button" class="hc{" is-big" if big else ""}" data-go="{href}"><span class="hc-row"><span class="hc-ic">{T(icon, tone)}</span>'
            f'<span class="hc-tx"><b>{e(title)}</b><small>{e(sub)}</small></span><span class="hc-go" aria-hidden="true">{GO}</span></span>'
            + (f'<span class="hc-meta"><span class="hc-n">{e(meta)}</span></span>' if meta else '') + '</button>')

def count_ar(n, one, two, few, many):
    if n == 1: return one
    if n == 2: return two
    if 3 <= n <= 10: return f'{n} {few}'
    return f'{n} {many}'

REPL = [
    ('منظومة الدفع والتمويل', 'منظومة الدفع وخيارات السداد'), ('الدفع الآجل والتمويل الاستهلاكي', 'الدفع الآجل وخيارات السداد'),
    ('التمويل أو الدفع الآجل', 'الدفع الآجل أو الدفعات'), ('الدفع الآجل والتمويل', 'الدفع الآجل والدفعات'),
    ('الدفع الآجل أو التمويل', 'الدفع الآجل أو الدفعات'), ('التمويل أو التقسيط', 'الدفع الآجل أو الدفعات'),
    ('شركات التمويل والتقسيط', 'شركات الدفع الآجل'), ('قرار التمويل وتحديد شروطه وأقساطه', 'قرار الدفع الآجل وتحديد شروطه ودفعاته'),
    ('الجهات التمويلية', 'جهات الدفع الآجل'), ('الجهة التمويلية', 'جهة الدفع الآجل'), ('حلول تمويلية', 'حلول دفع'),
    ('حلول التمويل', 'حلول الدفع الآجل'), ('مبلغ التمويل', 'مبلغ الدفعات'), ('شركاء التمويل', 'شركاء الدفع الآجل'),
    ('جهة التمويل', 'جهة الدفع الآجل'), ('قرار التمويل', 'قرار الدفع الآجل'), ('والتقسيط', 'والدفع على دفعات'),
    ('التقسيط', 'الدفع على دفعات'), ('تقسيط', 'دفعات'), ('أقساط', 'دفعات'), ('قسط', 'دفعة'), ('التمويل', 'الدفع الآجل'), ('تمويل', 'دفع'),
    ('المحسوب', 'المعتمد'),
]
AR = str.maketrans('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789')
def fix(s):
    for a, b in REPL: s = s.replace(a, b)
    return s.translate(AR)

import hashlib, base64
SI_DIR = B2 + '/out/si'
os.makedirs(SI_DIR, exist_ok=True)
EXT = {'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg', 'image/gif': 'gif'}
def si(uri):
    m = re.match(r'data:([a-z/+]+);base64,(.*)$', uri, re.S)
    if not m or m.group(1) not in EXT: return uri
    raw = base64.b64decode(m.group(2))
    h = hashlib.sha1(raw).hexdigest()[:14]
    p = f'si/{h}.{EXT[m.group(1)]}'
    fp = B2 + '/out/' + p
    if not os.path.exists(fp): open(fp, 'wb').write(raw)
    return p
def si_all(html):
    return re.sub(r'data:image/(?:webp|png|jpeg|gif);base64,[A-Za-z0-9+/=]+', lambda m: si(m.group(0)), html)
