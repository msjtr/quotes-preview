from pages3 import *
import segno

# ---------- بوابة الدخول الموحدة (v232): هوية واحدة، مدة جلسة 10 دقائق لكل المسارات ----------
def _pw(i, ph='••••••••'):
    return (f'<span class="ts-pw"><input class="ts-in" id="{i}" type="password" dir="ltr" autocomplete="new-password" placeholder="{ph}">'
            f'<button type="button" class="ts-eye" aria-label="إظهار كلمة المرور">{I("PiEyeFill")}</button></span>')

PW_RULES = [('len', 'من 11 إلى 128 خانة'),
            ('let', 'خمسة أحرف على الأقل'),
            ('dig', 'خمسة أرقام على الأقل'),
            ('sym', 'رمز واحد على الأقل مثل ! أو @'),
            ('seq', 'لا أحرف ولا أرقام متسلسلة أو مكررة'),
            ('old', 'لم تُستخدم من قبل في حسابك')]

def pwkit(p, old=True):
    """كلمة مرور + مؤشر قوة + شروط + تأكيد ومطابقة"""
    rules = ''.join(f'<li data-r="{k}">{I("PiCheckCircleFill")}<span>{e(t)}</span></li>' for k, t in PW_RULES
                    if old or k != 'old')
    return (f'<div class="pk" data-pk="{p}">'
            f'<div class="ts-fld"><label for="{p}-pw">كلمة المرور</label>{_pw(p + "-pw")}'
            f'<div class="pk-meter" aria-live="polite"><span class="pk-bars"><i></i><i></i><i></i><i></i></span><b class="pk-lv">أدخل كلمة مرور</b></div>'
            f'<ul class="pk-rules">{rules}</ul>'
            f'<p class="pt-tip">{I("PiLightbulbFill")}<span>يُرفض التسلسل والتكرار مثل abc و cba و 123 و 321 و 111. اجعلها سهلة التذكّر صعبة التخمين.</span></p></div>'
            f'<div class="ts-fld"><label for="{p}-pw2">تأكيد كلمة المرور</label>{_pw(p + "-pw2", "أعد كتابة كلمة المرور")}'
            f'<p class="pk-match" hidden></p></div>'
            + ('<p class="pt-demo">معاينة: كلمة المرور Tera2468 تُعدّ مستخدمة سابقًا.</p>' if old else '') + '</div>')

def boxes6(cls):
    return f'<div class="ts-otp pt-otp {cls}">' + ''.join(f'<input inputmode="numeric" maxlength="1" aria-label="الخانة {k}">' for k in range(1, 7)) + '</div>'

def vcard(ch, ic, tone, title, dest_id, note=''):
    """بطاقة تحقق: إرسال ← رمز من 6 خانات (تأكيد تلقائي) ← تم التحقق"""
    return (f'<div class="vc" data-ch="{ch}" data-dest="{dest_id}">'
            f'<div class="vc-h"><span class="vc-ic">{T(ic, tone)}</span><div class="vc-t"><b>{e(title)}</b><small class="vc-d" dir="ltr">—</small></div>'
            f'<span class="vc-st">لم يُتحقق</span></div>'
            f'<button type="button" class="t2-btn vc-send">أرسل رمز التحقق</button>'
            f'<div class="vc-code" hidden><span class="pt-lab">أدخل الرمز المكوّن من 6 أرقام</span>{boxes6("vc-in")}'
            f'<p class="ts-meta"><span>صلاحية الرمز <b class="vc-valid" dir="ltr">5:00</b></span><span class="vc-rs">إعادة الإرسال بعد <b class="vc-cd" dir="ltr">0:60</b></span></p>'
            f'<p class="pt-demo">معاينة: اكتب أي 6 أرقام عدا 000000.</p></div>'
            f'<p class="vc-msg" hidden></p>{note}</div>')

def spam_note(text):
    return f'<p class="ts-note ts-spam">{T("PiEnvelopeFill", "saffron")}<span>{e(text)}</span></p>'

SPAM = 'تصل رسائل التحقق إلى بريدك الإلكتروني، وقد تذهب أحيانًا إلى مجلد الرسائل غير المرغوب فيها (البريد العشوائي). إن لم تجدها في البريد الوارد فتحقّق منه، وانقلها إلى البريد الوارد.'

def opt(flow, ic, tone, t, s):
    return f'<button type="button" class="pt-opt" data-flow="{flow}"><span class="pt-opt-ic">{T(ic, tone)}</span><span class="pt-opt-tx"><b>{e(t)}</b><small>{e(s)}</small></span>{GO}</button>'

def why(items, title='ما الهدف وكيف تستخدمها؟'):
    """صندوق شرح: (أيقونة، عنوان، نص)"""
    rows = ''.join(f'<li>{I(ic)}<div><b>{e(t)}</b><span>{e(s)}</span></div></li>' for ic, t, s in items)
    return f'<div class="pt-why"><p class="pt-why-h">{I("PiInfoFill")}<b>{e(title)}</b></p><ul>{rows}</ul></div>'

def yn(name, q, yes='نعم', no='لا، لاحقًا'):
    return (f'<div class="pt-yn" role="radiogroup" aria-label="{e(q)}" data-yn="{name}"><p>{e(q)}</p><div>'
            f'<button type="button" role="radio" aria-checked="false" data-v="yes">{I("PiCheckCircleFill")}<span>{e(yes)}</span></button>'
            f'<button type="button" role="radio" aria-checked="false" data-v="no">{I("PiXBold")}<span>{e(no)}</span></button></div></div>')

# رسوم توضيحية مبسّطة لشاشات تطبيق المصادقة (ليست لقطات من التطبيقات)
def mock(kind):
    if kind == 'store':
        s = (f'<span class="mk-app">{I("PiShieldCheckFill")}</span><b>Authenticator</b><small>مجاني</small><span class="mk-btn">تثبيت</span>')
    elif kind == 'add':
        s = ('<span class="mk-bar">Authenticator</span><span class="mk-menu"><i>' + I('PiQrCodeFill') + 'مسح رمز QR</i><i>' + I('PiKeyFill') + 'إدخال المفتاح</i></span>'
             '<span class="mk-fab">' + I('PiPlusBold') + '</span>')
    elif kind == 'scan':
        s = '<span class="mk-cam"><i></i><i></i><i></i><i></i>' + I('PiQrCodeFill', 'mk-qr') + '<em></em></span><small>وجّه الكاميرا إلى الرمز</small>'
    elif kind == 'code':
        s = ('<span class="mk-bar">Authenticator</span><span class="mk-acc"><small>Tera</small><small dir="ltr">name@…</small>'
             '<b dir="ltr">482 913</b><svg class="mk-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle class="r" cx="18" cy="18" r="15"/></svg></span>')
    else:
        s = f'<span class="mk-ok">{I("PiCheckCircleFill")}</span><b>تم التفعيل</b><small>رمز يتجدد كل 30 ثانية</small>'
    return f'<span class="mk mk-{kind}" aria-hidden="true"><span class="mk-sc">{s}</span></span>'

QR = segno.make('otpauth://totp/Tera:name%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Tera', error='m').svg_inline(scale=5, dark='#0A1F44', light='#ffffff', border=2)
KEY = 'JBSW Y3DP EHPK 3PXP'

STORES = [('آيفون', 'App Store', 'PiAppleLogoFill', [('Google Authenticator', 'https://apps.apple.com/app/id388497605'), ('Microsoft Authenticator', 'https://apps.apple.com/app/id983156458')]),
          ('أندرويد', 'Google Play', 'PiGooglePlayLogoFill', [('Google Authenticator', 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'), ('Microsoft Authenticator', 'https://play.google.com/store/apps/details?id=com.azure.authenticator')]),
          ('هواوي', 'AppGallery', 'PiStorefrontFill', [('ابحث عن Authenticator', 'https://appgallery.huawei.com/search/Microsoft%20Authenticator')])]

def stores():
    out = '<div class="pst-g">'
    for n, s, ic, links in STORES:
        a = ''.join(f'<a href="{u}" target="_blank" rel="noopener" dir="auto">{e(t)}</a>' for t, u in links)
        out += f'<div class="pst"><span class="pst-h">{I(ic)}<b>{e(n)}</b><small dir="ltr">{e(s)}</small></span>{a}</div>'
    return out + '</div>'

# صور حقيقية من تطبيقَي Google Authenticator وMicrosoft Authenticator (آيفون) زوّدنا بها المستخدم — بيانات الحساب والرمز مستبدلة أو محذوفة
SCAN = ('scan', '', 'امسح الرمز', 'تفتح الكاميرا؛ وجّهها إلى رمز QR الظاهر هنا حتى يُقرأ تلقائيًا.')
DONE = ('done', '', 'أكّد هنا', 'اكتب الرمز الظاهر الآن في الخانات أدناه، فيتفعّل التطبيق لحسابك فورًا.')
GUIDES = [
  ('g', 'Google Authenticator', [
    ('store', 'vid/ga-icon.webp', 'حمّل التطبيق', 'ثبّت Google Authenticator من متجر جهازك، ثم افتحه من أيقونته.'),
    ('add', 'vid/ga-add.webp', 'أضف حسابًا', 'اضغط زر الإضافة (+) أسفل الشاشة ①، ثم اختر «مسح ضوئي لرمز استجابة سريعة» ②. إن كنت تتصفح من الجوال نفسه فاختر «إدخال مفتاح الإعداد» والصق المفتاح.'),
    SCAN,
    ('code', 'vid/ga-code.webp', 'اقرأ الرمز', 'يظهر حساب TERA برمز من 6 أرقام يتجدد كل 30 ثانية، والدائرة بجانبه تُظهر الوقت المتبقي.'),
    DONE]),
  ('m', 'Microsoft Authenticator', [
    ('store', 'vid/ms-icon.webp', 'حمّل التطبيق', 'ثبّت Microsoft Authenticator من متجر جهازك، ثم افتحه من أيقونته.'),
    ('add', 'vid/ms-home.webp', 'أضف حسابًا', 'اضغط زر الإضافة (+) أعلى الشاشة ①.'),
    ('add', 'vid/ms-add.webp', 'اختر نوع الحساب', 'اختر «آخر (Google، Facebook، إلخ)» ②، فهو النوع المناسب لحساب تيرا، ثم تفتح الكاميرا. وإن كنت تتصفح من الجوال نفسه فاختر خيار الإدخال اليدوي في شاشة الكاميرا والصق المفتاح.'),
    SCAN,
    ('code', '', 'اقرأ الرمز', 'يظهر حساب TERA في القائمة؛ اضغطه ليظهر الرمز المكوّن من 6 أرقام الذي يتجدد كل 30 ثانية.'),
    DONE])]

def guide():
    tabs = '<div class="gd-tabs" role="tablist" aria-label="تطبيق المصادقة">' + ''.join(
        f'<button type="button" role="tab" data-app="{a}" aria-selected="{"true" if k == 0 else "false"}" class="{"is-on" if k == 0 else ""}" dir="ltr">{e(n)}</button>' for k, (a, n, _) in enumerate(GUIDES)) + '</div>'
    out = tabs
    for k, (a, n, steps) in enumerate(GUIDES):
        out += f'<ol class="gd" data-app="{a}"' + (' hidden' if k else '') + '>'
        for m, (kind, img, t, s) in enumerate(steps, 1):
            pic = (f'<span class="gd-shot gd-{kind}"><img src="{img}" alt="{e(t)} — من تطبيق {e(n)}" loading="lazy" decoding="async"></span>' if img else mock(kind))
            out += f'<li class="{"has-shot" if img else ""}">{pic}<div><i>{m}</i><b>{e(t)}</b><span>{e(s)}</span></div></li>'
        out += '</ol>'
    return out + '<p class="gd-n">الصور من التطبيقين على آيفون، وبيانات الحساب والرمز فيها للمعاينة. الخطوات ذات الرسم التوضيحي تنتظر صورها الحقيقية، وقد يختلف الشكل قليلًا في أندرويد أو مع تحديثات التطبيق.</p>'

def mf(m, ic, tone, t, s, body):
    return (f'<section class="mf" data-m="{m}"><button type="button" class="mf-h" aria-expanded="false"><span class="mf-ic">{T(ic, tone)}</span>'
            f'<span class="mf-tx"><b>{e(t)}</b><small>{e(s)}</small></span><span class="mf-st">غير مفعّل</span><span class="mf-car">{I("PiCaretDownBold")}</span></button>'
            f'<div class="mf-b" hidden>{body}</div></section>')

def devrow(ic, n, s, k):
    return (f'<li class="dv" data-k="{k}"><span class="dv-ic">{I(ic)}</span><div><b>{e(n)}</b><small>{e(s)}</small></div>'
            f'<button type="button" class="dv-x">{I("PiXBold")}<span>إلغاء التصريح</span></button></li>')

DEV_WHY = why([('PiTargetFill', 'لماذا التصريح؟', 'الجهاز المصرّح له لا يُطلب منه الرمز الإضافي عند كل دخول طوال المدة التي تختارها، فيصبح دخولك أسرع مع بقاء حسابك محميًا.'),
               ('PiClockFill', 'كيف تختار المدة؟', '30 يومًا للأجهزة التي تستخدمها أحيانًا، و60 يومًا للاستخدام المنتظم، و90 يومًا لجهازك الشخصي الذي لا يستخدمه غيرك.'),
               ('PiDevicesFill', 'حد الأجهزة', 'يحق لك التصريح لثلاثة أجهزة كحد أقصى. لإضافة جهاز رابع ألغِ تصريح أحد الأجهزة الحالية، ويمكنك ذلك متى شئت من مركز الأمان.'),
               ('PiWarningCircleFill', 'متى لا تصرّح؟', 'لا تصرّح لجهاز عام أو مشترك. يُلغى التصريح تلقائيًا عند انتهاء المدة أو عند تغيير كلمة المرور.')],
              'ما معنى التصريح للجهاز؟')

def trust(p, q):
    return (f'<div class="ts-dev">{T("PiDesktopFill", "sky")}<div><b class="dev-name">هذا المتصفح</b><small>الجهاز الذي تستخدمه الآن</small></div></div>'
            + yn(p + '-trust', q, 'نعم، صرّح له', 'لا، هذه المرة فقط') +
            f'<div class="ts-fld" id="{p}-dur-w" hidden><label for="{p}-dur">مدة التصريح</label><select class="ts-in" id="{p}-dur"><option value="30">30 يومًا</option><option value="60">60 يومًا</option><option value="90" selected>90 يومًا</option></select>'
            f'<span class="hint" id="{p}-dur-h"></span></div>')

def portal2():
    head = (f'<div class="pt-head"><img class="pt-wm" src="vid/mark-white.webp" alt="" aria-hidden="true">'
            f'<button type="button" class="pt-back" id="pt-back" hidden>{I("PiCaretRightBold")}<span>رجوع</span></button>'
            f'<div class="pt-hx"><span class="pt-hic" id="pt-ic">{T("PiLockKeyFill")}</span><div><small>بوابة الدخول الموحدة</small><h2 id="pt-t">تسجيل الدخول</h2><p id="pt-s">حساب واحد لكل خدماتك في منصة تيرا.</p></div></div>'
            '<ol class="pt-steps" id="pt-steps"></ol>'
            f'<div class="pt-timer" id="pt-timer">{I("PiTimerFill")}<span>مدة الجلسة</span><i><b id="timer-bar"></b></i><b id="timer-v" dir="ltr">10:00</b></div></div>')

    login = (f'<form class="pt-f" id="f-login" novalidate>'
             '<p class="pt-who" id="lg-who" hidden>مرحبًا مجددًا — <b dir="ltr"></b> <button type="button" class="ts-link">ليس أنت؟</button></p>'
             '<div class="ts-fld"><label for="lg-id">البريد الإلكتروني أو رقم الجوال</label><input class="ts-in" id="lg-id" dir="ltr" autocomplete="username" inputmode="email" placeholder="name@example.com"></div>'
             f'<div class="ts-fld"><span class="ts-row"><label for="lg-pw">كلمة المرور</label><button type="button" class="ts-link" data-flow="forgot">نسيت كلمة المرور؟</button></span>{_pw("lg-pw").replace("new-password", "current-password")}</div>'
             '<label class="ts-chk"><input type="checkbox" id="lg-rem"><span>تذكّر بريدي أو جوالي على هذا الجهاز <small>(لا تُحفظ كلمة المرور)</small></span></label>'
             '<div class="ts-human" id="human"><span class="ts-sp"></span><span id="human-t">جارٍ التحقق البشري…</span><small>Cloudflare</small></div>'
             '<p class="ts-msg" id="lg-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="lg-go">دخول</button>'
             '<div class="pt-or"><span>خيارات أخرى</span></div><div class="pt-opts">'
             + opt('register', 'PiUserPlusFill', 'teal', 'إنشاء حساب جديد', 'بياناتك، ثم التحقق والمصادقة الثنائية، ثم حسابك جاهز.')
             + opt('recover', 'PiShieldCheckFill', 'navy', 'فقدت وسيلة التحقق؟', 'استخدم رمز الاستعادة الذي حفظته عند تفعيل المصادقة الثنائية.')
             + '</div></form>')

    otp = (f'<form class="pt-f" id="f-otp" hidden novalidate>'
           '<div class="ts-fld"><label for="otp-via">وسيلة التحقق</label><select class="ts-in" id="otp-via"><option value="app">تطبيق المصادقة</option><option value="wa">رمز التحقق عبر واتساب</option><option value="sms">رمز التحقق برسالة نصية</option><option value="mail">رمز التحقق عبر البريد الإلكتروني</option></select><span class="hint" id="otp-hint"></span></div>'
           f'<div class="ts-dest"><span id="otp-dest-i">{I("PiDeviceMobileFill")}</span><span id="otp-dest-t"></span><b id="otp-dest-v" dir="ltr"></b></div>'
           f'<div id="otp-spam" hidden>{spam_note(SPAM)}</div>'
           '<button class="t2-btn" type="button" id="otp-send">أرسل الرمز</button>'
           '<div id="otp-box" hidden class="pt-f"><span class="pt-lab">أدخل الرمز المكوّن من 6 أرقام</span><div class="ts-otp" id="otp-in">'
           + ''.join(f'<input inputmode="numeric" maxlength="1" aria-label="الخانة {k}">' for k in range(1, 7)) + '</div>'
           '<p class="ts-meta"><span>المحاولات المتبقية: <b id="otp-left">5</b> من <b>5</b></span><span id="otp-valid-w">صلاحية الرمز <b id="otp-valid" dir="ltr">5:00</b></span><span id="otp-resend">إعادة الإرسال بعد <b id="otp-cd" dir="ltr">0:60</b></span></p>'
           '<p class="pt-demo">معاينة: اكتب أي 6 أرقام عدا 000000.</p></div>'
           '<p class="ts-msg" id="otp-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="otp-go" disabled>تحقق ومتابعة</button></form>')

    device = (f'<form class="pt-f" id="f-device" hidden novalidate>{trust("lg", "هل ترغب بتوثيق هذا الجهاز والتصريح له بالدخول؟")}'
              f'<div class="dv-w" id="lg-devs" hidden><p class="dv-h">{I("PiDevicesFill")}<b>الأجهزة المصرّح لها</b><span class="dv-n" id="lg-dn">3 من 3</span></p>'
              f'<p class="ts-msg bad" id="lg-full">وصلت إلى الحد الأقصى (3 أجهزة). ألغِ تصريح جهاز لتتمكن من التصريح لهذا الجهاز.</p><ul class="dv-l">'
              + devrow('PiDeviceMobileFill', 'آيفون · Safari', 'آخر دخول قبل يومين · ينتهي بعد 41 يومًا', 1)
              + devrow('PiDesktopFill', 'حاسب Windows · Edge', 'آخر دخول قبل 9 أيام · ينتهي بعد 18 يومًا', 2)
              + devrow('PiDeviceTabletFill', 'جهاز لوحي Android · Chrome', 'آخر دخول قبل شهر · ينتهي بعد 6 أيام', 3)
              + '</ul></div>' + DEV_WHY +
              '<p class="ts-msg" id="dev-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="dev-go" disabled>الدخول إلى حسابي</button></form>')

    # إنشاء حساب: بياناتك ← التواصل ← كلمة المرور ← التحقق ← المصادقة الثنائية ← الجهاز
    reg = (f'<form class="pt-f" id="f-reg1" hidden novalidate>'
           '<div class="ts-fld"><label for="rg-name">الاسم الكامل كما هو مدوّن في الهوية</label><input class="ts-in" id="rg-name" autocomplete="name" placeholder="مثال: محمد عبدالله صالح الأحمد"><span class="hint">اكتب اسمك كاملًا (ثلاثيًا على الأقل) كما يظهر في الهوية الوطنية أو الإقامة.</span></div>'
           '<p class="ts-msg" id="rg1-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit">التالي: بيانات التواصل</button></form>'
           f'<form class="pt-f" id="f-reg2" hidden novalidate>'
           f'<div class="ts-fld"><label for="rg-ph">رقم الجوال</label>{tel("rg-ph")}</div>'
           '<div class="ts-fld"><label for="rg-em">البريد الإلكتروني</label><input class="ts-in" id="rg-em" dir="ltr" inputmode="email" autocomplete="email" placeholder="name@example.com"></div>'
           '<p class="ts-msg" id="rg2-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit">التالي: كلمة المرور</button></form>'
           f'<form class="pt-f" id="f-reg3" hidden novalidate>{pwkit("rg", old=False)}'
           '<label class="ts-chk"><input type="checkbox" id="rg-terms"><span>أوافق على سياسة الاستخدام وسياسة الخصوصية.</span></label>'
           '<p class="ts-msg" id="rg3-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="rg-go" disabled>التالي: التحقق</button></form>'
           f'<form class="pt-f" id="f-reg4" hidden novalidate>'
           + why([('PiTargetFill', 'الهدف', 'التأكد من أن البريد والجوال يخصّانك، لأنهما طريق رموز الدخول والاسترداد وتنبيهات الحساب.'),
                  ('PiListChecksFill', 'الاستخدام', 'اضغط «أرسل رمز التحقق» في كل بطاقة، ثم اكتب الرمز المكوّن من 6 أرقام، ويتأكد تلقائيًا عند اكتماله.')])
           + vcard('mail', 'PiEnvelopeFill', 'sky', 'البريد الإلكتروني', 'rg-em', spam_note('قد تجد رسالة التحقق في مجلد الرسائل غير المرغوب فيها (البريد العشوائي).'))
           + vcard('sms', 'PiChatCircleTextFill', 'teal', 'الجوال (رسالة نصية)', 'rg-ph')
           + '<div class="pt-wa">' + yn('wa', 'هل ترغب بربط رقمكم في واتساب؟', 'نعم، اربطه', 'لا، لاحقًا')
           + '<p class="pt-wa-n">بعد الربط تصلك رموز التحقق وتنبيهات طلباتك على واتساب، ويمكنك إلغاء الربط من مركز الأمان.</p>'
           + '<div id="wa-box" hidden>' + vcard('wa', 'PiWhatsappLogoFill', 'teal', 'واتساب', 'rg-ph') + '</div></div>'
           '<p class="ts-msg" id="rg4-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="rg4-go" disabled>التالي: المصادقة الثنائية</button></form>'
           f'<form class="pt-f" id="f-reg5" hidden novalidate>'
           f'<p class="pt-must">{I("PiShieldCheckFill")}<span><b>خطوة إلزامية:</b> فعّل وسيلة واحدة على الأقل، ويمكنك تفعيل الاثنتين لحماية أعلى.</span><b class="pt-must-n" id="mf-n">0 من 2</b></p>'
           + why([('PiShieldCheckFill', 'ما المصادقة الثنائية؟', 'طبقة حماية ثانية بعد كلمة المرور: حتى لو عرف أحد كلمة مرورك لا يستطيع الدخول دون الرمز الذي يصلك أنت.'),
                  ('PiListChecksFill', 'متى تُطلب؟', 'عند الدخول من جهاز غير مصرّح له، وعند استرداد كلمة المرور، وعند تغيير بيانات الأمان.')], 'لماذا هذه الخطوة؟')
           + mf('app', 'PiDeviceMobileFill', 'navy', 'تطبيق المصادقة', 'رمز يتجدد كل 30 ثانية من جوالك، ويعمل دون إنترنت. الأقوى والأنسب.',
                why([('PiTargetFill', 'الهدف', 'يولّد تطبيق على جوالك رمزًا جديدًا كل 30 ثانية مرتبطًا بحسابك وحده، فلا يمكن اعتراضه برسالة أو بريد.'),
                     ('PiListChecksFill', 'الاستخدام', 'عند الدخول افتح التطبيق واكتب الرمز الظاهر لحساب Tera. لا يحتاج إلى شبكة ولا إلى رصيد رسائل.')])
                + '<h4 class="pt-sub">شاهد الشرح</h4>' + vid('totp', 'pt-v')
                + '<h4 class="pt-sub">1. حمّل التطبيق من متجر جهازك</h4>' + stores()
                + '<h4 class="pt-sub">خطوات التفعيل بالصور</h4>' + guide()
                + f'<div class="qr"><div class="qr-c">{QR}</div><div class="qr-t"><b>امسح هذا الرمز من التطبيق</b><span>أو أدخل مفتاح الإعداد يدويًا:</span>'
                  f'<code dir="ltr" id="qr-key">{KEY}</code><button type="button" class="t2-btn qr-copy">{I("PiCopyFill")}<span>نسخ المفتاح</span></button><small>رمز ومفتاح للمعاينة فقط.</small></div></div>'
                + '<span class="pt-lab">اكتب الرمز الظاهر في التطبيق الآن</span>' + boxes6('mf-in')
                + '<p class="pt-demo">معاينة: اكتب أي 6 أرقام عدا 000000.</p><p class="mf-msg" hidden></p>')
           + mf('code', 'PiKeyFill', 'saffron', 'رمز التحقق الإضافي', 'رمز لمرة واحدة يصلك برسالة نصية أو واتساب أو بريد عند كل دخول.',
                why([('PiTargetFill', 'الهدف', 'رمز من 6 أرقام يُرسل إليك عند الدخول أو الاسترداد، صالح خمس دقائق ولمرة واحدة، يثبت أن من يدخل هو أنت صاحب الجوال أو البريد.'),
                     ('PiListChecksFill', 'الاستخدام', 'اختر القناة التي تفضّلها، ثم أرسل رمز تجربة وأدخله لتأكيد أن الرموز تصلك فعلًا.'),
                     ('PiLightbulbFill', 'متى تختاره؟', 'إذا لم ترغب بتثبيت تطبيق، أو وسيلةً احتياطية بجانب تطبيق المصادقة.')])
                + '<div class="ts-fld"><label for="mc-ch">قناة استلام الرمز</label><select class="ts-in" id="mc-ch"><option value="sms">رسالة نصية إلى الجوال</option><option value="wa">واتساب</option><option value="mail">البريد الإلكتروني</option></select><span class="hint" id="mc-h"></span></div>'
                + '<button type="button" class="t2-btn mc-send">أرسل رمز تجربة</button>'
                + '<div class="mc-box" hidden><span class="pt-lab">أدخل الرمز الذي وصلك</span>' + boxes6('mc-in') + '<p class="pt-demo">معاينة: اكتب أي 6 أرقام عدا 000000.</p></div><p class="mf-msg" hidden></p>')
           + f'<div class="rcodes" id="rcodes" hidden><p class="rc-h">{T("PiKeyFill", "saffron")}<span><b>رموز الاستعادة</b><small>احفظها في مكان آمن خارج جوالك. تستخدم أحدها لاستعادة حسابك إذا فقدت جوالك أو تطبيق المصادقة، وكل رمز يُستعمل مرة واحدة.</small></span></p>'
             '<ol class="rc-l" dir="ltr" id="rc-l"></ol><div class="rc-a"><button type="button" class="t2-btn rc-copy">' + I('PiCopyFill') + '<span>نسخ الرموز</span></button><button type="button" class="t2-btn rc-dl">' + I('PiDownloadSimpleFill') + '<span>تنزيل ملف</span></button></div>'
             '<label class="ts-chk"><input type="checkbox" id="rc-saved"><span>حفظت رموز الاستعادة في مكان آمن.</span></label></div>'
           '<p class="ts-msg" id="rg5-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="rg5-go" disabled>التالي: توثيق الجهاز</button></form>'
           f'<form class="pt-f" id="f-reg6" hidden novalidate>{trust("rg", "هل ترغب بتوثيق هذا الجهاز والتصريح له بالدخول؟")}'
           f'<p class="dv-cap">{I("PiDevicesFill")}<span>الأجهزة المصرّح لها في حسابك: <b id="rg-dn">0 من 3</b></span></p>' + DEV_WHY +
           '<p class="ts-msg" id="rg6-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="rg6-go" disabled>إنشاء الحساب</button></form>')

    # نسيت كلمة المرور: الجوال ← البريد ← التحقق الإضافي ← كلمة مرور جديدة
    fg = (f'<form class="pt-f" id="f-fg1" hidden novalidate>'
          f'<div class="ts-fld"><label for="fg-ph">رقم الجوال المسجّل</label>{tel("fg-ph")}</div>'
          + vcard('sms', 'PiChatCircleTextFill', 'teal', 'رمز إلى جوالك', 'fg-ph') +
          '<p class="ts-msg" id="fg1-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="fg1-go" disabled>التالي: البريد الإلكتروني</button></form>'
          f'<form class="pt-f" id="f-fg2" hidden novalidate>'
          '<div class="ts-fld"><label for="fg-em">البريد الإلكتروني المسجّل</label><input class="ts-in" id="fg-em" dir="ltr" inputmode="email" placeholder="name@example.com"></div>'
          + vcard('mail', 'PiEnvelopeFill', 'sky', 'رمز إلى بريدك', 'fg-em', spam_note('إن لم تجد الرسالة في البريد الوارد فتحقّق من مجلد الرسائل غير المرغوب فيها (البريد العشوائي).')) +
          '<p class="ts-msg" id="fg2-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="fg2-go" disabled>التالي: التحقق الإضافي</button></form>'
          f'<form class="pt-f" id="f-fg3" hidden novalidate>'
          '<div class="ts-fld"><label for="fg3-m">الوسيلة المفعّلة في حسابك</label><select class="ts-in" id="fg3-m"><option value="app">تطبيق المصادقة</option><option value="code">رمز التحقق الإضافي</option></select><span class="hint" id="fg3-h"></span></div>'
          '<button type="button" class="t2-btn" id="fg3-send" hidden>أرسل الرمز الإضافي</button>'
          '<div id="fg3-box"><span class="pt-lab">أدخل الرمز المكوّن من 6 أرقام</span>' + boxes6('fg3-in') + '<p class="pt-demo">معاينة: اكتب أي 6 أرقام عدا 000000.</p></div>'
          '<button type="button" class="ts-link" data-flow="recover">لا تصل إلى أي وسيلة؟ استخدم رمز الاستعادة</button>'
          '<p class="ts-msg" id="fg3-msg" hidden></p></form>'
          f'<form class="pt-f" id="f-fg4" hidden novalidate>{pwkit("fg")}'
          '<p class="ts-msg" id="fg4-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="fg-go" disabled>حفظ كلمة المرور الجديدة</button></form>')

    # رمز الاستعادة: رمز ← كلمة جديدة
    rc = (f'<form class="pt-f" id="f-rc1" hidden novalidate>'
          f'<div class="pt-info">{T("PiInfoFill", "sky")}<div><b>ما رمز الاستعادة؟</b><span>رموز من 10 أرقام تحصل عليها مرة واحدة عند تفعيل المصادقة الثنائية، وتحفظها في مكان آمن. تستخدم أحدها لاستعادة حسابك إذا فقدت جوالك أو تطبيق المصادقة، وكل رمز يُستعمل مرة واحدة فقط.</span></div></div>'
          '<div class="ts-fld"><label for="rc-id">البريد الإلكتروني أو رقم الجوال</label><input class="ts-in" id="rc-id" dir="ltr" placeholder="name@example.com"></div>'
          '<div class="ts-fld"><label for="rc-code">رمز الاستعادة</label><input class="ts-in" id="rc-code" dir="ltr" inputmode="numeric" maxlength="10" placeholder="10 أرقام"></div>'
          '<p class="ts-msg" id="rc1-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit">تحقق من الرمز</button></form>'
          f'<form class="pt-f" id="f-rc2" hidden novalidate>{pwkit("rc")}'
          '<p class="ts-msg" id="rc2-msg" hidden></p><button class="t2-btn is-primary pt-go" type="submit" id="rc-go" disabled>حفظ كلمة المرور الجديدة</button></form>')

    done = (f'<div class="pt-f pt-done" id="f-done" hidden><span class="pt-done-ic">{T("PiCheckCircleFill")}</span><h2 id="done-h">تم الدخول بنجاح</h2><p id="done-p"></p>'
            f'<dl class="pt-ids" id="done-ids" hidden><div>{I("PiIdentificationCardFill")}<dt>رقم المعرّف</dt><dd dir="ltr" id="done-uid"></dd></div>'
            f'<div>{I("PiReceiptFill")}<dt>رقم الطلب</dt><dd dir="ltr" id="done-req"></dd></div></dl>'
            f'<div class="pt-next" id="done-next" hidden><p>يمكنكم الاستمرار لاستكمال ملفكم الشخصي. ستجد في لوحة التحكم:</p><ul>'
            f'<li>{T("PiUserCircleFill", "teal")}<span><b>ملفي الشخصي</b><small>أكمل بياناتك وعنوانك ومعلومات عملك.</small></span></li>'
            f'<li>{T("PiShieldCheckFill", "navy")}<span><b>مركز الأمان</b><small>وسائل التحقق والأجهزة المصرّح لها والجلسات.</small></span></li></ul></div>'
            '<button type="button" class="t2-btn is-primary pt-go" id="done-go">استمرار</button><button type="button" class="t2-btn" id="done-login" hidden>تسجيل الدخول</button>'
            f'<button type="button" class="t2-btn pt-exit" id="done-exit" hidden>{I("PiSignOutFill")}<span>خروج</span></button>'
            '<p class="pt-exit-n" id="done-exit-n" hidden>يمكنك الإكمال لاحقًا بالدخول من البوابة: تسجيل الدخول.</p>'
            '<button type="button" class="ts-link" id="done-again">العودة إلى بداية البوابة</button></div>')

    tiles = '<template id="pt-tiles">' + ''.join(f'<span data-ic="{ic}">{T(ic, tn)}</span>' for ic, tn in [('PiLockKeyFill','teal'),('PiKeyFill','saffron'),('PiDeviceMobileFill','navy'),('PiUserPlusFill','teal'),('PiEnvelopeFill','sky'),('PiShieldCheckFill','navy'),('PiArrowCounterClockwiseFill','saffron'),('PiCheckCircleFill','teal'),('PiDesktopFill','sky'),('PiUserFill','teal'),('PiSealCheckFill','teal'),('PiPhoneFill','teal')]) + '</template>'
    card = ('<div class="pt">' + tiles + head + '<div class="pt-body">' + login + otp + device + reg + fg + rc + done +
            '<p class="ts-legal">باستخدامك البوابة توافق على سياسة الاستخدام وسياسة الخصوصية. هذه معاينة ولا تُرسل أي بيانات.</p></div></div>')
    side = (f'<aside class="pt-side"><div class="ts-lux"><small>بوابة الدخول الموحدة</small><h2>حساب واحد لكل خدماتك</h2><p>الدخول والتحقق والاسترداد بهوية واحدة وخطوات واضحة.</p><ul class="ts-feat-ul">'
            f'<li>{T("PiShieldCheckFill")}<div><b>مصادقة ثنائية إلزامية</b><span>تطبيق المصادقة أو رمز إضافي، أو الاثنان معًا.</span></div></li>'
            f'<li>{T("PiDevicesFill", "sky")}<div><b>ثلاثة أجهزة مصرّح لها</b><span>تختار مدة التصريح 30 أو 60 أو 90 يومًا، وتلغيه متى شئت.</span></div></li>'
            f'<li>{T("PiTimerFill", "saffron")}<div><b>جلسة محمية بعشر دقائق</b><span>تنتهي الجلسة تلقائيًا إن لم تكمل خلالها.</span></div></li></ul></div>' + vid('portal') + '</aside>')
    return (phead([('الرئيسية', '/', 'PiHouseFill'), ('بوابة الدخول', None, None)]) + '<div class="t2-stack"><div class="pt-wrap">' + card + side + '</div></div>')

PAGES['/login'] = dict(t='بوابة الدخول', h=portal2(), g='login')
