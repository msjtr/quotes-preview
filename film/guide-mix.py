# مؤثرات «دليل تيرا» الصوتية — تُركَّب برمجيًا (بلا ملفات صوت خارجية) على خط زمن window.sfx، ثم تُمزج مع موسيقى الفيلم.
#   python3 film/guide-mix.py <sfx.json> <music.mp3> <out.wav>
import json, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)


def t(d): return np.arange(int(d * SR)) / SR
def env(d, a=.004, k=8.0): x = t(d); e = np.exp(-k * x); n = max(1, int(a * SR)); e[:n] *= np.linspace(0, 1, n); return e
def bell(f, d, k=6.0, v=1.0): x = t(d); return v * env(d, k=k) * (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * 2.01 * f * x) + .12 * np.sin(2 * np.pi * 3.02 * f * x))
def band(sig, lo, hi): return sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), sig)
def noise(d): return rng.standard_normal(int(d * SR))
def sweep(f0, f1, d): x = t(d); f = np.linspace(f0, f1, len(x)); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def seq(*parts):
    L = max(int(o * SR) + len(p) for o, p in parts); out = np.zeros(L)
    for o, p in parts: i = int(o * SR); out[i:i + len(p)] += p
    return out


def norm(x, peak): m = np.max(np.abs(x)) or 1; return x / m * peak

S = {
    'tap': norm(seq((0, band(noise(.02), 1500, 6000) * env(.02, .001, 220)), (0, .6 * bell(1400, .05, 90))), .5),
    'tick': norm(band(noise(.015), 2500, 9000) * env(.015, .001, 300), .22),
    # نغمة الإرسال: انزلاق صاعد قصير ثم «بوب» — كإرسال رسالة
    'send': norm(seq((0, sweep(520, 1500, .13) * env(.13, .005, 14)), (.1, bell(1760, .18, 22, .8))), .62),
    # نغمة الاستلام: نغمتان صافيتان
    'recv': norm(seq((0, bell(1318.5, .35, 9)), (.11, bell(1975.5, .5, 7))), .6),
    'notify': norm(seq((0, bell(1046.5, .3, 9)), (.09, bell(1318.5, .3, 9)), (.18, bell(1568, .6, 6))), .55),
    'success': norm(seq((0, bell(523.25, .5, 6)), (.08, bell(659.25, .5, 6)), (.16, bell(783.99, .6, 5)), (.26, bell(1046.5, .9, 4))), .6),
    'whoosh': norm(band(noise(.55), 400, 4000) * np.sin(np.linspace(0, np.pi, int(.55 * SR))) ** 2, .32),
    'pop': norm(sweep(280, 900, .07) * env(.07, .002, 40), .38),
    'ding': norm(bell(1568, .55, 7), .34),
    'strike': norm(band(noise(.22), 1200, 7000) * np.sin(np.linspace(0, np.pi, int(.22 * SR))), .3),
    'scan': norm(np.concatenate([sweep(700, 1300, .8), sweep(1300, 700, .8)]) * .5 * np.sin(np.linspace(0, np.pi, int(1.6 * SR))), .14),
    'beep': norm(bell(1000, .14, 18), .3),
    'rise': norm((band(noise(1.4), 300, 3000) * .6 + sweep(200, 700, 1.4)) * np.linspace(0, 1, int(1.4 * SR)) ** 2, .35),
    'shimmer': norm(sum(bell(f, 1.1, 4.5) * .5 for f in (2093, 2637, 3136, 3951)), .25),
}

cfg = json.load(open(sys.argv[1])); T = cfg['duration']; N = int(T * SR)
fx = np.zeros(N)
for at, name, vol in cfg['sfx']:
    s = S.get(name)
    if s is None: continue
    i = int(at * SR); j = min(N, i + len(s)); fx[i:j] += s[:j - i] * vol
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[2], '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
full = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
# بداية الموسيقى: المقطوعة تبدأ بمقدّمة هادئة ثم ضربة ثم ارتفاع مفاجئ — نأخذ جزءها الثابت (من ث 17.5) ونوصله بنفسه بتلاشٍ متقاطع
a0, a1, b0, xf = int(17.5 * SR), int(49 * SR), int(19 * SR), int(2 * SR)
A = full[a0:a1]; B = full[b0:a1]; mus = A
while len(mus) < N:
    w = np.linspace(0, 1, xf)[:, None]; mus = np.vstack([mus[:-xf], mus[-xf:] * (1 - w) + B[:xf] * w, B[xf:]])
mus = mus[:N]
# مستوى ثابت للموسيقى طوال المقطع: المقطوعة تبدأ هادئة ثم ترتفع فجأة (~ث 17) — نعوّض ذلك بمُسوٍّ ناعم فلا «يتغيّر» الصوت
def mavg(x, w):
    c = np.concatenate([[0], np.cumsum(x)]); i = np.arange(len(x)); a = np.clip(i - w // 2, 0, len(x)); b = np.clip(i + w // 2, 0, len(x))
    return (c[b] - c[a]) / np.maximum(1, b - a)
rms = np.sqrt(mavg((mus ** 2).mean(1), int(2.0 * SR))) + 1e-4
lev = np.clip(10 ** (-17 / 20) / rms, .25, 3.0); lev = mavg(lev, int(1.5 * SR)); mus = mus * lev[:, None]
g = np.ones(N); fi = int(1.4 * SR); fo = int(2.4 * SR); g[:fi] = np.linspace(0, 1, fi); g[-fo:] = np.linspace(1, 0, fo) ** 1.5
# خفض الموسيقى قليلًا تحت المؤثرات حتى تُسمع نغمة الإرسال والاستلام بوضوح
K = int(.25 * SR); c = np.concatenate([[0], np.cumsum(np.abs(fx))]); duck = (c[np.clip(np.arange(N) + K // 2, 0, N)] - c[np.clip(np.arange(N) - K // 2, 0, N)]) / K; duck = 1 - .45 * np.clip(duck / (duck.max() or 1) * 3, 0, 1)
mix = mus * (.5 * g * duck)[:, None] + np.stack([fx, fx], 1) * .9
mix /= max(1e-6, np.max(np.abs(mix)) / .93)  # تطبيع ثابت (بلا loudnorm المتغيّر)
from scipy.io import wavfile
wavfile.write(sys.argv[3], SR, (mix * 32767).astype(np.int16))
print('mixed', T, 's', len(cfg['sfx']), 'events')
