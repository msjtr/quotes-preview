from pages2 import *
CC = ''.join(f'<option value="{v}">+{v} {n}</option>' for v, n in [('966', 'السعودية'), ('971', 'الإمارات'), ('965', 'الكويت'), ('973', 'البحرين'), ('974', 'قطر'), ('968', 'عُمان'), ('20', 'مصر')])
def tel(idp):
    return f'<span class="ts-tel"><select class="ts-in" id="{idp}-cc" aria-label="مفتاح الدولة">{CC}</select><input class="ts-in" id="{idp}" dir="ltr" inputmode="tel" placeholder="5XXXXXXXX"></span><span class="hint">اكتب الرقم بدون صفر في أوله.</span>'

# ---------- مركز المراسلات ----------
def desk():
    s = soup_main(Q + '/desk.html')
    info = ''
    for k, a in enumerate(s.select('.desk-static article.summary')):
        t = txt(a.find('h2'))
        cont = ''
        for el in a.find_all(['p', 'ul']):
            if el.name == 'ul': cont += '<ul class="pp-hl ts-ul">' + ''.join(f'<li><span>{inner_text_html(li)}</span></li>' for li in el.find_all('li')) + '</ul>'
            elif el.find_parent('ul') is None: cont += f'<p class="ts-p">{inner_text_html(el)}</p>'
        info += (f'<section class="t2-sec"><button type="button" class="t2-group-h t2-sec-h" aria-expanded="{"true" if k == 0 else "false"}"><span class="t2-sec-tx"><h2 class="t2-group-t">{e(t)}</h2></span><span class="t2-chev" aria-hidden="true"></span></button>'
                 f'<div class="t2-sec-b"{"" if k == 0 else " hidden"}><div class="t2-stack-tight">{cont}</div></div></section>')
    kinds = [('request', 'طلب', 'طلب خدمة أو عرض سعر', 'PiPaperPlaneTiltFill'), ('complaint', 'شكوى', 'مشكلة في طلب قدّمته', 'PiWarningCircleFill'),
             ('support', 'الدعم الفني', 'مشكلة تقنية في المنصة', 'PiGearSixFill'), ('inquiry', 'استفسار', 'سؤال عن قسم أو خدمة', 'PiQuestionFill')]
    km = ''.join(f'<button type="button" role="radio" aria-checked="false" class="t2-mp-i" data-kind="{k}"><span class="t2-mp-ic">{T(ic)}</span><span class="t2-mp-t"><span class="t2-mp-n">{e(n)}</span><span class="t2-mp-d m2-d">{e(d)}</span></span></button>' for k, n, d, ic in kinds)
    new = (f'<div data-f="new"><section class="t2-panel"><div class="t2-panel-h"><div class="t2-panel-ht"><h2 class="t2-group-t">نوع المراسلة</h2></div></div>'
           f'<div class="t2-mp ts-desk-kinds" role="radiogroup">{km}</div></section>'
           '<section class="t2-panel" id="dk-form" hidden><div class="t2-panel-h"><div class="t2-panel-ht"><h2 class="t2-group-t" id="dk-title">بيانات المراسلة</h2></div></div>'
           '<div class="ts-grid2">'
           '<div class="ts-fld"><label for="dk-name">الاسم</label><input class="ts-in" id="dk-name" placeholder="الاسم الثلاثي"></div>'
           f'<div class="ts-fld"><label for="dk-ph">رقم الجوال</label>{tel("dk-ph")}</div>'
           '<div class="ts-fld"><label for="dk-em">البريد الإلكتروني</label><input class="ts-in" id="dk-em" dir="ltr" inputmode="email" placeholder="name@example.com"><span class="hint">تصل التحديثات إلى هذا البريد، وقد تجدها في مجلد الرسائل غير المرغوب فيها.</span></div>'
           '<div class="ts-fld"><label for="dk-type" id="dk-type-l">النوع</label><select class="ts-in" id="dk-type"></select></div>'
           '<div class="ts-fld" style="grid-column:1/-1"><label for="dk-subj">الموضوع</label><input class="ts-in" id="dk-subj" placeholder="عنوان مختصر"></div>'
           '<div class="ts-fld" style="grid-column:1/-1"><label for="dk-det" id="dk-det-l">التفاصيل</label><textarea class="ts-in" id="dk-det" placeholder="اكتب التفاصيل بوضوح"></textarea></div>'
           '<div class="ts-fld" style="grid-column:1/-1"><span class="ts-lab">المرفقات</span><input class="ts-in" type="file" multiple style="padding-top:10px"><span class="hint">حتى 2 ميجابايت للملف.</span></div>'
           '</div><p class="ts-msg" id="dk-msg" hidden></p>'
           '<div class="t2-pb-actions" style="display:flex;gap:8px;flex-wrap:wrap"><button class="t2-btn is-primary" type="button" id="dk-send">إرسال المراسلة</button><button class="t2-btn" type="button" id="dk-draft">حفظ كمسودة</button></div>'
           '<p class="ts-legal" style="text-align:start">تقديم الطلب أو الشكوى أو الدعم لا يعني قبوله. المراجعة تتم وفق البيانات والسياسات. هذه معاينة: لا تُرسل أي بيانات.</p></section>'
           f'<section class="t2-panel" id="dk-done" hidden><div class="ts-flow ts-done">{T("PiCheckCircleFill")}<h2>تم إرسال مراسلتك بنجاح</h2><p>رقم المراسلة</p><div class="ts-ref" id="dk-ref">#TERA-000000</div>'
           '<ul class="ts-status"><li class="is-done">جديدة</li><li class="is-now">قيد المراجعة</li><li>قيد المعالجة</li><li>تم الرد</li><li>تم الحل</li></ul>'
           '<p>مدة الرد المتوقعة: من يوم عمل إلى 7 أيام عمل. ستصلك التحديثات على البريد المسجّل، وإن لم تجدها في البريد الوارد فتحقّق من مجلد الرسائل غير المرغوب فيها.</p><button type="button" class="t2-btn" id="dk-again">مراسلة جديدة</button></div></section></div>')
    follow = (f'<div data-f="follow" hidden><section class="t2-panel"><div class="t2-panel-h"><div class="t2-panel-ht"><h2 class="t2-group-t">متابعة مراسلة</h2></div></div>'
              '<div class="ts-grid2"><div class="ts-fld"><label for="fw-ref">رقم المراسلة</label><input class="ts-in" id="fw-ref" dir="ltr" placeholder="TERA-000000"></div>'
              '<div class="ts-fld"><label for="fw-em">البريد المسجّل في المراسلة</label><input class="ts-in" id="fw-em" dir="ltr" inputmode="email" placeholder="name@example.com"></div></div>'
              '<p class="ts-msg" id="fw-msg" hidden></p><div><button class="t2-btn is-primary" type="button" id="fw-go">عرض المراسلة</button></div>'
              '<div id="fw-out" hidden class="ts-flow"><div class="ts-row"><span class="t2-group-t">رقم المراسلة</span><span class="ts-ref" id="fw-ref-v"></span></div>'
              '<ul class="ts-status"><li class="is-done">جديدة</li><li class="is-now">قيد المراجعة</li><li>قيد المعالجة</li><li>تم الرد</li><li>تم الحل</li><li>مغلقة</li></ul>'
              '<p class="ts-p">تتم مراجعة البيانات والمرفقات. ستصلك التحديثات على البريد المسجّل في المراسلة، وقد تجدها في مجلد الرسائل غير المرغوب فيها. (معاينة)</p></div></section></div>')
    chips = [('new', 'مراسلة جديدة', 'طلب · شكوى · دعم', 'PiPaperPlaneTiltFill'), ('follow', 'متابعة مراسلة', 'برقم المراسلة', 'PiListChecksFill'), ('info', 'دليل المراسلات', 'الحالات والمدد', 'PiInfoFill')]
    body = (phead([('الرئيسية', '/', 'PiHouseFill'), ('مركز المراسلات', None, None)]) + '<div class="t2-stack">' +
            shb('PiEnvelopeFill', 'مركز المراسلات', 'قناة منظمة لتقديم طلب أو شكوى أو طلب دعم، ومتابعة كل مراسلة برقم مرجعي مثل #TERA-000000.') + vid('help') +
            hf_row(chips, 'مركز المراسلات') + new + follow + f'<div data-f="info" hidden><div class="ts-faq">{info}</div></div>' + '</div>')
    return body
PAGES['/desk'] = dict(t='مركز المراسلات', h=desk(), g='help')

# ---------- البوابة ----------
def portal():
    pw = lambda i: f'<span class="ts-pw"><input class="ts-in" id="{i}" type="password" dir="ltr" autocomplete="off" placeholder="••••••••"><button type="button" class="ts-eye" aria-label="إظهار كلمة المرور">{I("PiEyeFill")}</button></span>'
    card = (
      '<div class="ts-pcard">'
      f'<ol class="ts-steps3" id="steps"><li data-s="1" class="is-now">{T("PiLockKeyFill")}<span>بيانات الدخول</span></li><li data-s="2">{T("PiKeyFill", "saffron")}<span>رمز التحقق</span></li><li data-s="3">{T("PiDeviceMobileFill", "navy")}<span>تأكيد الجهاز</span></li></ol>'
      f'<div class="ts-timer" id="timer" role="timer">{I("PiClockFill")}<span>مدة الدخول المتبقية، بعدها تبدأ من جديد</span><b id="timer-v">10:00</b><span class="ts-bar"><i id="timer-bar"></i></span></div>'
      f'<form class="ts-flow" id="f-login" novalidate><div class="ts-fh">{T("PiLockKeyFill")}<div><h2>الدخول الموحد</h2><p>البريد أو الجوال، ثم كلمة المرور.</p></div></div>'
      '<div class="ts-fld"><label for="lg-id">البريد الإلكتروني أو رقم الجوال</label><input class="ts-in" id="lg-id" dir="ltr" autocomplete="off" inputmode="email" placeholder="name@example.com"></div>'
      f'<div class="ts-fld"><span class="ts-row"><label for="lg-pw">كلمة المرور</label><button type="button" class="ts-link" data-flow="forgot">نسيت كلمة المرور؟</button></span>{pw("lg-pw")}</div>'
      '<div class="ts-human" id="human"><span class="ts-sp"></span><span id="human-t">جارٍ التحقق البشري…</span><small>Cloudflare</small></div>'
      '<p class="ts-msg" id="lg-msg" hidden></p><button class="t2-btn is-primary" type="submit" id="lg-go" style="min-height:50px">دخول</button>'
      '<p class="ts-alt"><span>ليس لديك حساب؟</span><button type="button" class="ts-link" data-flow="register">إنشاء حساب جديد</button><span aria-hidden="true">·</span><button type="button" class="ts-link" data-flow="recover">لدي رمز استعادة</button></p></form>'
      f'<form class="ts-flow" id="f-otp" hidden novalidate><div class="ts-fh">{T("PiKeyFill", "saffron")}<div><h2>رمز التحقق</h2><p>اختر الوسيلة. لن يُرسل أي رمز قبل الضغط على الإرسال.</p></div></div>'
      '<div class="ts-fld"><label for="otp-via">أرسل الرمز عبر</label><select class="ts-in" id="otp-via"><option value="wa">واتساب</option><option value="mail">البريد الإلكتروني</option><option value="app">تطبيق المصادقة</option></select><span class="hint" id="otp-hint"></span></div>'
      f'<div class="ts-dest"><span id="otp-dest-i">{I("PiWhatsappLogoFill")}</span><span id="otp-dest-t">يُرسل إلى الرقم</span><b id="otp-dest-v">+966 5• ••• ••74</b></div>'
      f'<p class="ts-note ts-spam" id="otp-spam" hidden>{T("PiEnvelopeFill", "saffron")}<span>تصل رسائل التحقق إلى بريدك الإلكتروني، وقد تذهب أحيانًا إلى مجلد الرسائل غير المرغوب فيها (البريد العشوائي). إن لم تجد الرسالة في البريد الوارد فتحقّق منه، وانقلها إلى البريد الوارد لتصلك الرسائل القادمة مباشرة.</span></p>'
      '<button class="t2-btn" type="button" id="otp-send">أرسل رمز واتساب</button>'
      '<div id="otp-box" hidden class="ts-flow"><span class="ts-lab" style="text-align:center;font:600 .86rem Alexandria,sans-serif">أدخل الرمز المكوّن من 6 أرقام</span><div class="ts-otp" id="otp-in">' + ''.join(f'<input inputmode="numeric" maxlength="1" aria-label="الخانة {k}">' for k in range(1, 7)) + '</div>'
      '<p class="ts-meta"><span>المحاولات المتبقية: <b id="otp-left">5</b> من <b>5</b></span><span id="otp-valid-w">صلاحية الرمز <b id="otp-valid" dir="ltr">5:00</b></span><span id="otp-resend">إعادة الإرسال بعد <b id="otp-cd" dir="ltr">0:60</b></span></p></div>'
      '<p class="ts-msg" id="otp-msg" hidden></p><button class="t2-btn is-primary" type="submit" id="otp-go" disabled style="min-height:50px">تحقق ومتابعة</button>'
      '<p class="ts-alt"><button type="button" class="ts-link" data-back>رجوع إلى بيانات الدخول</button></p></form>'
      f'<form class="ts-flow" id="f-device" hidden novalidate><div class="ts-fh">{T("PiDeviceMobileFill", "navy")}<div><h2>تأكيد الجهاز</h2><p>هذا أول دخول من هذا الجهاز. أكّده لإكمال الدخول.</p></div></div>'
      f'<div class="ts-dev">{T("PiDesktopFill", "sky")}<div><b id="dev-name">متصفح على جهاز</b><small>الرياض، المملكة العربية السعودية · الآن</small></div></div>'
      '<div class="ts-fld"><label for="dev-trust">الثقة بهذا الجهاز</label><select class="ts-in" id="dev-trust"><option value="once">هذه المرة فقط</option><option value="30" selected>30 يومًا</option><option value="90">90 يومًا</option></select><span class="hint">خلال المدة لن نطلب رمز التحقق من هذا الجهاز.</span></div>'
      '<label class="ts-chk"><input type="checkbox" checked><span>هذا جهازي الشخصي، ولا يستخدمه غيري.</span></label>'
      '<button class="t2-btn is-primary" type="submit" style="min-height:50px">تأكيد الجهاز والدخول</button><p class="ts-alt"><button type="button" class="ts-link" data-back>ليس جهازي؟ إلغاء الدخول</button></p></form>'
      f'<div class="ts-flow ts-done" id="f-done" hidden>{T("PiCheckCircleFill")}<h2 id="done-h">تم الدخول بنجاح</h2><p id="done-p"></p><button type="button" class="t2-btn is-primary" id="done-go">المتابعة إلى حسابك</button><button type="button" class="ts-link" id="done-again">إعادة التجربة من البداية</button></div>'
      f'<form class="ts-flow" id="f-forgot" hidden novalidate><div class="ts-fh">{T("PiArrowCounterClockwiseFill", "saffron")}<div><h2>نسيت كلمة المرور</h2><p>أدخل الجوال، ثم البريد المسجّل في حسابك.</p></div></div>'
      f'<div class="ts-fld"><label for="fg-ph">رقم الجوال</label>{tel("fg-ph")}</div><div class="ts-fld"><label for="fg-em">البريد الإلكتروني</label><input class="ts-in" id="fg-em" dir="ltr" inputmode="email" placeholder="name@example.com"><span class="hint">يصل رابط الاسترداد إلى هذا البريد، وقد تجده في مجلد الرسائل غير المرغوب فيها.</span></div>'
      '<p class="ts-msg" id="fg-msg" hidden></p><button class="t2-btn is-primary" type="submit">إرسال طلب الاسترداد</button><p class="ts-alt"><button type="button" class="ts-link" data-back>رجوع إلى الدخول</button></p></form>'
      f'<form class="ts-flow" id="f-recover" hidden novalidate><div class="ts-fh">{T("PiShieldCheckFill", "navy")}<div><h2>استعادة الوصول</h2><p>معرّف الدخول ورمز الاستعادة. يُستعمل الرمز مرة واحدة.</p></div></div>'
      '<div class="ts-fld"><label for="rc-id">معرّف الدخول</label><input class="ts-in" id="rc-id" dir="ltr" placeholder="name@example.com"></div>'
      '<div class="ts-fld"><label for="rc-code">رمز الاستعادة</label><input class="ts-in" id="rc-code" dir="ltr" inputmode="numeric" maxlength="10" placeholder="10 أرقام"></div>'
      '<p class="ts-msg" id="rc-msg" hidden></p><button class="t2-btn is-primary" type="submit">تحقق من الرمز</button><p class="ts-alt"><button type="button" class="ts-link" data-back>رجوع إلى الدخول</button></p></form>'
      f'<form class="ts-flow" id="f-register" hidden novalidate><div class="ts-fh">{T("PiUserPlusFill")}<div><h2>إنشاء حساب جديد</h2><p>أكّد بياناتك وأنشئ الحساب، ثم أكمل الملف الشخصي.</p></div></div>'
      '<div class="ts-fld"><label for="rg-name">الاسم كما في الهوية</label><input class="ts-in" id="rg-name" placeholder="الاسم الثلاثي"></div>'
      f'<div class="ts-fld"><label for="rg-ph">رقم الجوال</label>{tel("rg-ph")}</div><div class="ts-fld"><label for="rg-em">البريد الإلكتروني</label><input class="ts-in" id="rg-em" dir="ltr" inputmode="email" placeholder="name@example.com"><span class="hint">تصل رسائل التحقق إلى هذا البريد، وقد تجدها في مجلد الرسائل غير المرغوب فيها.</span></div>'
      f'<div class="ts-fld"><label for="rg-pw">كلمة المرور</label>{pw("rg-pw")}<ul class="ts-rules" id="pw-rules"><li data-r="len">8 أحرف على الأقل</li><li data-r="up">حرف لاتيني كبير</li><li data-r="num">رقم واحد على الأقل</li><li data-r="sym">رمز مثل ! أو @</li></ul></div>'
      '<label class="ts-chk"><input type="checkbox" id="rg-terms"><span>أوافق على سياسة الاستخدام وسياسة الخصوصية.</span></label>'
      '<p class="ts-msg" id="rg-msg" hidden></p><button class="t2-btn is-primary" type="submit">إنشاء الحساب</button><p class="ts-alt"><span>لديك حساب؟</span><button type="button" class="ts-link" data-back>تسجيل الدخول</button></p></form>'
      '<p class="ts-legal">بالدخول توافق على سياسة الاستخدام وسياسة الخصوصية. هذه معاينة: لا تُرسل أي بيانات.</p></div>')
    side = (f'<div class="ts-side"><div class="ts-lux"><small>بوابة الدخول الموحدة</small><h2>حساب واحد لكل خدماتك</h2><p>الدخول والرمز واسترداد الحساب من مكان واحد، وتبقى أجهزتك وعملياتك تحت نظرك.</p><ul>'
            f'<li>{T("PiShieldCheckFill")}<div><b>دخول آمن بخطوتين</b><span>كلمة المرور ثم رمز تحقق صالح خمس دقائق.</span></div></li>'
            f'<li>{T("PiDeviceMobileFill", "sky")}<div><b>أجهزتك تحت نظرك</b><span>تؤكد كل جهاز جديد، وتحدد مدة الثقة به.</span></div></li>'
            f'<li>{T("PiListChecksFill", "saffron")}<div><b>كل عملية موثّقة</b><span>سجل واضح لعمليات الدخول والتغييرات.</span></div></li></ul></div>' + vid('portal') + '</div>')
    return (phead([('الرئيسية', '/', 'PiHouseFill'), ('بوابة الدخول', None, None)]) + '<div class="t2-stack">' +
            shb('PiSignInFill', 'بوابة الدخول الموحدة', 'سجّل الدخول لمتابعة طلباتك وعقودك ومدفوعاتك وعضويتك.') + f'<div class="ts-portal">{card}{side}</div></div>')
PAGES['/login'] = dict(t='بوابة الدخول', h=portal(), g='login')

# ---------- خدمة حسب الطلب ----------
def custom():
    st = '<ol class="ts-path">' + ''.join(f'<li>{T(ic)}<span>{e(t)}</span></li>' for t, ic in [('صف احتياجك', 'PiFileTextFill'), ('دراسة الطلب', 'PiEyeFill'), ('البحث والتنسيق', 'PiChatsCircleFill'), ('عرض السعر', 'PiTagFill'), ('التنفيذ والمتابعة', 'PiCheckCircleFill')]) + '</ol>'
    why = ''.join(f'<div class="hc is-static"><span class="hc-row"><span class="hc-ic">{T(ic)}</span><span class="hc-tx"><b>{e(b)}</b><small>{e(s)}</small></span></span></div>' for ic, b, s in [
        ('PiPackageFill', 'كميات كبيرة', 'نجهّز لك عرضًا مخصصًا بالسعر والتوفر.'), ('PiSparkleFill', 'منتج غير متوفر', 'نبحث عنه لدى الموردين والشركاء.'),
        ('PiGearSixFill', 'مواصفات خاصة', 'تكتب المواصفات ونطابقها مع الخيارات المتاحة.'), ('PiBuildingsFill', 'احتياجات المنشآت', 'تجهيزات ومستلزمات للمشاريع والجهات.')])
    return (phead([('الرئيسية', '/', 'PiHouseFill'), ('المتجر', '/p/products', 'PiStorefrontFill'), ('خدمة حسب الطلب', None, None)], back=('المتجر', '/p/products')) +
            '<div class="t2-stack">' + shb('PiPaperPlaneTiltFill', 'خدمة حسب الطلب', 'لا تجد ما تبحث عنه؟ صف احتياجك، ونبحث لك عن الخيارات ونقدّم لك عرض سعر واضحًا.') + vid('services') +
            hc_sec('كيف تعمل الخدمة', '5 خطوات', 'PiMapPinFill', f'<div class="ts-sb">{st}</div>') +
            hc_sec('متى تستخدمها', '4 حالات', 'PiQuestionFill', f'<div class="hc-g ts-items">{why}</div>') +
            f'<section class="st-bulk"><span class="st-bulk-ic">{T("PiPaperPlaneTiltFill")}</span><div class="st-bulk-tx"><b>ابدأ طلبك الآن</b><span>قدّم الطلب من مركز المراسلات، وتصلك الخيارات وعرض السعر.</span></div><button class="t2-btn is-primary" type="button" data-go="/desk">{GO}قدّم طلبك</button></section></div>')
PAGES['/store/custom'] = dict(t='خدمة حسب الطلب', g='store', h=custom())
