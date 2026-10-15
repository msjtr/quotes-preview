from pages4 import *
from bs4 import BeautifulSoup
import json as _j
CR = _j.load(open(B2 + '/crawl.json'))
DG = DATA['DG']
SKU_CAT = {}
CAT_T = {}
for c in CAT:
    CAT_T[c['k']] = c['t']
    for br, its in c['br']:
        for sku, nm, pr in its: SKU_CAT[sku] = (c['k'], br)
for br, its in DG['webCat']['br']:
    for sku, nm, pr in its: SKU_CAT[sku] = ('web', br); NAME[sku] = nm
CAT_T['web'] = DG['webCat']['t']
T2K = {v: k for k, v in CAT_T.items()}
DEV_K = ['mob', 'tab', 'wat', 'aud', 'acc']
MK_OF = lambda k: 'devices' if k in DEV_K else 'digital'
MK_T = {'devices': ('سوق الأجهزة', 'PiDeviceMobileFill'), 'digital': ('سوق الحلول الرقمية', 'PiCodeFill')}
NAME2SKU = {v: k for k, v in NAME.items()}

def clean(h):
    h = si_all(fix(h))
    h = h.replace(' lx-rv is-in', '').replace('lx-rv ', '')
    return h

def soup(h):
    return BeautifulSoup(h, 'lxml')

def body_of(s):
    b = s.body
    return ''.join(str(x) for x in b.contents) if b else str(s)

def wire(s):
    """attach routes to store controls"""
    for a in s.select('article.pc[data-sku]'):
        a['data-go'] = '/product/' + a['data-sku']
        k = SKU_CAT.get(a['data-sku'])
        if k: a['data-br'] = k[1]
    for b in s.select('.hc'):
        t = b.select_one('.hc-tx b')
        t = t.get_text(strip=True) if t else ''
        if t == 'سوق الأجهزة': b['data-go'] = '/store/devices'
        elif t == 'سوق الحلول الرقمية': b['data-go'] = '/store/digital'
        elif t in T2K: b['data-go'] = '/store/cat/' + T2K[t]
        elif 'حسب الطلب' in t: b['data-go'] = '/store/custom'
    for b in s.select('.mk-cat'):
        t = b.select_one('b'); t = t.get_text(strip=True) if t else ''
        if t in T2K: b['data-go'] = '/store/cat/' + T2K[t]
    for sl in s.select('.sh-slide'):
        t = sl.select_one('.sh-t'); t = t.get_text(strip=True) if t else ''
        btn = sl.select_one('.sh-a .t2-btn')
        if btn and t in NAME2SKU: btn['data-go'] = '/product/' + NAME2SKU[t]
    for b in s.select('.st-bulk .t2-btn'): b['data-go'] = '/store/custom'
    for b in s.select('.ad-cta'):
        t = b.get_text(' ', strip=True)
        if 'الأجهزة' in t: b['data-go'] = '/store/devices'
        elif 'الحلول' in t or 'الرقمية' in t: b['data-go'] = '/store/digital'
        elif 'حسب الطلب' in t or 'الخاص' in t: b['data-go'] = '/store/custom'
        else: b['data-act'] = 'top'
    for x in s.select('.st-fbtn, .st-end, .pc-fav.is-bar'):
        x.decompose()
    for x in s.select('.pc-add, .pp-buy-b, .pc-fav'):
        x['data-act'] = 'login'
    return s

def hub():
    s = soup(clean(CR['hub']))
    for sec in s.select('section.hc-sec'):
        lab = sec.get('aria-label', '')
        if 'طلبات' in lab: sec.decompose(); continue
        sec['data-f'] = lab
    for c in s.select('.hf-c'):
        b = c.select_one('b'); t = b.get_text(strip=True) if b else ''
        if 'طلبات' in t: c.decompose(); continue
        c['data-flt'] = 'all' if t == 'الكل' else t
    # remove the hero header block (we build our own)
    wire(s)
    h = body_of(s)
    h = h.replace('أجهزة وحلول رقمية وطلبات خاصة في مكان واحد.', 'أجهزة ذكية وحلول رقمية وطلبات خاصة، بتجربة شراء واحدة.', 1)
    return (phead([('الرئيسية', '/', 'PiHouseFill'), ('المتجر', None, None)]) + h)

def market(mk):
    s = soup(clean(CR['mk:' + mk]))
    tabs = []
    i = 0
    while f'tab:{mk}:{i}' in CR:
        ts = soup(clean(CR[f'tab:{mk}:{i}'])); wire(ts)
        tabs.append(body_of(ts)); i += 1
    for k, t in enumerate(s.select('.st-tab')): t['data-tab'] = str(k)
    wire(s)
    h = body_of(s)
    tpl = ''.join(f'<template data-tabtpl="{k}">{x}</template>' for k, x in enumerate(tabs))
    nm, ic = MK_T[mk]
    return phead([('الرئيسية', '/', 'PiHouseFill'), ('المتجر', '/p/products', 'PiStorefrontFill'), (nm, None, None)], back=('المتجر', '/p/products')) + h + tpl

def category(mk, i):
    s = soup(clean(CR[f'cat:{mk}:{i}']))
    wire(s)
    name = CR[f'catname:{mk}:{i}']
    k = T2K.get(name, 'web' if 'التطوير' in name else name)
    nm, ic = MK_T[mk]
    return k, name, (phead([('الرئيسية', '/', 'PiHouseFill'), ('المتجر', '/p/products', 'PiStorefrontFill'), (nm, '/store/' + mk, ic), (name, None, None)], back=(nm, '/store/' + mk)) + body_of(s))

def product(sku):
    s = soup(clean(CR['pd:' + sku]))
    wire(s)
    k, br = SKU_CAT.get(sku, ('acc', ''))
    mk = MK_OF(k); nm, ic = MK_T[mk]
    name = NAME.get(sku, sku)
    short_n = name if len(name) < 34 else name[:32] + '…'
    return (phead([('الرئيسية', '/', 'PiHouseFill'), ('المتجر', '/p/products', 'PiStorefrontFill'), (CAT_T.get(k, nm), '/store/cat/' + k, 'PiPackageFill'), (short_n, None, None)], back=(CAT_T.get(k, nm), '/store/cat/' + k)) + body_of(s))

PAGES['/p/products'] = dict(t='المتجر', g='store', h=hub())
for mk in ('devices', 'digital'):
    PAGES['/store/' + mk] = dict(t=MK_T[mk][0], g='store', h=market(mk))
    i = 0
    while f'cat:{mk}:{i}' in CR:
        k, name, h = category(mk, i)
        PAGES['/store/cat/' + k] = dict(t=name, g='store', h=h); i += 1
for key in CR:
    if key.startswith('pd:'):
        sku = key[3:]
        PAGES['/product/' + sku] = dict(t=NAME.get(sku, sku), g='store', h=product(sku))
