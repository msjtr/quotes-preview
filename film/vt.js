// virtual time for the live platform pages: the film steps time frame by frame, so the real site animates exactly at film speed
(() => { if (window.__vtAdvance) return; try { if (location.pathname.startsWith('/__film/')) return; } catch (e) { }
  const ODate = Date, oPerf = performance.now.bind(performance); let now = 0; const T0 = window.__VT_T0 || ODate.parse('2026-10-17T09:29:40Z');
  let seq = 1; const timers = new Map(); const rafs = new Map();
  let depth = 0; window.setTimeout = function (fn, d, ...a) { const id = seq++; let dd = Math.max(0, +d || 0); if (depth > 0 && dd < 4) dd = 4; timers.set(id, { at: now + dd, fn, a, rep: 0 }); return id; };
  window.setInterval = function (fn, d, ...a) { const id = seq++; const p = Math.max(4, +d || 0); timers.set(id, { at: now + p, fn, a, rep: p }); return id; };
  window.clearTimeout = window.clearInterval = function (id) { timers.delete(id); };
  window.requestAnimationFrame = function (fn) { const id = seq++; rafs.set(id, fn); return id; }; window.cancelAnimationFrame = function (id) { rafs.delete(id); };
  window.requestIdleCallback = function (fn) { return window.setTimeout(() => fn({ didTimeout: false, timeRemaining: () => 8 }), 1); }; window.cancelIdleCallback = window.clearTimeout;
  class VDate extends ODate { constructor(...a) { if (!a.length) super(T0 + now); else super(...a); } static now() { return T0 + now; } }
  VDate.parse = ODate.parse; VDate.UTC = ODate.UTC; window.Date = VDate; performance.now = () => now;
  const run = (fn, a) => { depth++; try { typeof fn === 'function' ? fn(...(a || [])) : (0, eval)(String(fn)); } catch (e) { console.error('vt:', e && e.message); } depth--; };
  const anims = new WeakMap();
  window.__vtNow = () => now;
  window.__vtStats = {}; window.__vtAdvance = function (ms) { const end = now + ms; let guard = 0; const ST = window.__vtStats = { n: 0, slow: {} };
    while (guard++ < 5000) { let nx = null, nid = 0; for (const [id, t] of timers) if (t.at <= end && (!nx || t.at < nx.at)) { nx = t; nid = id; } if (!nx) break;
      now = Math.max(now, nx.at); if (nx.rep) nx.at = now + nx.rep; else timers.delete(nid); const q0 = oPerf(); run(nx.fn, nx.a); const dq = oPerf() - q0; ST.n++; if (dq > 5) { const k = String(nx.fn).slice(0, 90) + '|' + nx.rep; ST.slow[k] = (ST.slow[k] || 0) + dq; } }
    now = end; const cb = [...rafs.values()]; rafs.clear(); const r0 = oPerf(); cb.forEach(f => run(f, [now])); ST.raf = [cb.length, oPerf() - r0]; const a0 = oPerf();
    try { for (const an of document.getAnimations()) { let st = anims.get(an); if (st == null) { st = now - (an.currentTime || 0); anims.set(an, st); } if (an.playState !== 'paused') an.pause(); an.currentTime = Math.max(0, now - st); } } catch (e) { }
    try { document.querySelectorAll('video').forEach(v => { if (v.__vt0 === -1) return; if (!v.__vt0) { if (v.paused && !v.autoplay) { v.__vt0 = -1; return; } v.__vt0 = now || 1; v.muted = true; } v.pause(); const d = v.duration || 0; if (d) { const tt = ((now - v.__vt0) / 1000) % d; if (Math.abs(v.currentTime - tt) > 0.01) v.currentTime = tt; } }); } catch (e) { }
    ST.anim = oPerf() - a0; return now; };
})();
