"use strict";
/* ############################################################
 * session-location.js — v483
 *
 * مُجمِّعُ سجلِّ الجلسةِ وتحديدُ الموقعِ في واجهاتِ المنصّةِ الجديدة،
 * منقولٌ إلى المستودعِ الجديدِ من ملفِّ الأرشيف /admin/session-geo.js
 * (auth_31 … auth_77) بالمنطقِ نفسِه ومساراتِ الخادمِ نفسِها:
 *   /api/account/session/telemetry · events · leaving · close · role
 *   /api/account/session/location · location/trusted · log
 *
 * الذي تغيّرَ في v483 هو الواجهةُ وحدَها:
 *   • كلُّ رسائلِ الموقعِ تظهرُ عبرَ الإشعارِ الموحّد (TeraNotify) بهويةِ تيرا،
 *     بنصوصٍ قصيرة، بدلَ النوافذِ العائمةِ القديمة (t2-float).
 *   • حُذِفَ تنبيهُ الخمولِ المكرّر هنا — session-guard.js يعرضُه وحدَه.
 *
 *   • منتقي الخريطةِ من مكوّناتِ خريطةِ العنوانِ في المستودعِ الجديد (Leaflet
 *     من assets وبلاطاتُ HERE والبحثُ والعنوانُ العكسيُّ عبرَ /api/geo) — لا ملفَّ من الأرشيف.
 *
 * v484: الحسابُ المعفى (يُعرَفُ من ردِّ الخادم idle_off) لا يُرسِلُ حدثَ خمولٍ ولا إعلانَ مغادرة،
 *   ولا تظهرُ له مطالبةُ الموقع — فلا شيءَ آليٌّ يُنهي جلستَه في أيِّ دور.
 *
 * لا يُرسَلُ رمزٌ ولا سِرٌّ في أيِّ حمولة، ولا يُقرأُ من التخزينِ إلّا
 * رمزُ الجلسةِ الذي يستعملُه بقيةُ الواجهةِ نفسُها.
 * ############################################################ */
(function () {
  var BEAT_MS      = 120000;    /* نبضةُ النشاطِ */
  var TELEMETRY_MS = 300000;    /* الإرسالُ الكاملُ */
  var IDLE_MS      = 60 * 60 * 1000;   /* auth_39: كان 20 دقيقة — يُحدِّثُه الخادمُ عندَ كلِّ إرسال */
  var WARN_MS      = 120000;           /* تحذيرٌ قبلَ الإنهاءِ بدقيقتَين */
  var GPS_RETRY_MS = 60000;
  var API_T = "/api/account/session/telemetry";
  var API_C = "/api/account/session/close";
  var API_R = "/api/account/session/role";
  var API_L = "/api/account/session/leaving";
  var API_E = "/api/account/session/events";
  var API_TR = "/api/account/session/location/trusted";   /* auth_75 */

  var state = {
    lat: null, lon: null, acc: null, best: null, alt: null, altAcc: null,
    heading: null, speed: null, status: "unknown", perm: null, err: null,
    source: null, updates: 0, beats: 0, lastAct: Date.now(), actSource: "load",
    fp: null, localIp: null, watch: null, sentOnce: false, stopped: false,
    closing: false, lastBeat: 0, lastFull: 0, geoRetries: 0,
    ev: [], visChanges: 0, netChanges: 0, bestSent: null, sid: null, resumes: 0, fixAt: null, locSource: null, errCode: null,
    firstAcc: null, fixes: 0, path: null, cached: null
  };

  function bearer() {
    /* v591: رمز جلسة المنصة (tera.admin.session) أولًا ما دام ساريًا؛ وإلا أحدث رمز ساري لنفس المستخدم فقط.
     * كان يُختار أول رمز في التخزين أيًّا كان (قد يكون منتهيًا أو من مفتاح آخر) فيُرفض اعتماد الموقع. */
    var now = Date.now() + 30000;
    function pl(t) { try { var p = String(t).split(".")[1].replace(/-/g, "+").replace(/_/g, "/"); while (p.length % 4) p += "="; return JSON.parse(atob(p)) || {}; } catch (_e) { return null; } }
    function tokOf(raw) { if (!raw || raw.charAt(0) !== "{") return ""; var j = null; try { j = JSON.parse(raw); } catch (_e) { return ""; } var t = (j && j.access_token) || (j && j.session && j.session.access_token) || ""; return (t && String(t).split(".").length === 3) ? String(t) : ""; }
    try {
      var adm = tokOf(localStorage.getItem("tera.admin.session")), ap = adm ? pl(adm) : null;
      if (adm && ap && Number(ap.exp) * 1000 > now) return adm;
      var sub = ap && ap.sub ? String(ap.sub) : "", best = "", bestExp = 0;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i); if (k === "tera.admin.session") continue;
        var t = tokOf(localStorage.getItem(k)); if (!t) continue;
        var p = pl(t); if (!p || p.role !== "authenticated" || (sub && String(p.sub) !== sub)) continue;
        var exp = Number(p.exp) || 0;
        if (exp * 1000 > now && exp > bestExp) { best = t; bestExp = exp; }
      }
      return best || adm || "";
    } catch (_e) {}
    return "";
  }

  function post(url, body, keepalive) {
    var t = bearer();
    if (!t) return Promise.resolve({ status: 0, body: null });
    return fetch(url, {
      method: "POST",
      keepalive: keepalive === true,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + t },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      return r.json().catch(function () { return null; })
        .then(function (j) { return { status: r.status, body: j }; });
    }).catch(function () { return { status: 0, body: null }; });
  }

  /* بصمةٌ محلّيةٌ تُميِّزُ الجهازَ دون أن تُعرِّفَ صاحبَه: خصائصُ عرضٍ
   * ولغةٍ ومنطقةٍ زمنيةٍ ومُعالجٍ تُختزَلُ بـSHA-256. لا تُعرَضُ في أيِّ
   * واجهةٍ ولا يُعيدُها أيُّ مسلك. */
  /* v518: مفتاح جهاز ثابت — تُحفظ أوّل بصمة محسوبة على هذا المتصفح (tq.devk) وتُستعمل بعدها دائمًا،
   * فلا يتغيّر «الجهاز» بتحديث المتصفح أو تكبير الصفحة أو تغيير الشاشة فيُطلب التصريح من جديد. */
  function fingerprint() {
    var K = "tq.devk", v = null;
    try { v = localStorage.getItem(K); } catch (_e) { v = null; }
    if (v && /^[0-9a-f]{64}$/.test(v)) return Promise.resolve(v);
    return fingerprintRaw().then(function (fp) {
      if (fp && /^[0-9a-f]{64}$/.test(fp)) { try { localStorage.setItem(K, fp); } catch (_e) { void _e; } }
      return fp;
    });
  }
  function fingerprintRaw() {
    var bits = [
      navigator.userAgent || "", navigator.platform || "",
      (navigator.languages || []).join(","), navigator.hardwareConcurrency || "",
      navigator.deviceMemory || navigator.deviceMemoryGB || "",
      screen.width + "x" + screen.height + "x" + (screen.colorDepth || ""),
      window.devicePixelRatio || "",
      (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; }
                     catch (_e) { return ""; } })()
    ].join("|");
    if (!window.crypto || !window.crypto.subtle) return Promise.resolve(null);
    var enc = new TextEncoder().encode(bits);
    return window.crypto.subtle.digest("SHA-256", enc).then(function (buf) {
      var a = Array.prototype.slice.call(new Uint8Array(buf));
      return a.map(function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    }).catch(function () { return null; });
  }

  /* auth_34: سلسلةُ أحداثِ الجلسةِ — نصٌّ عربيٌّ مقروءٌ مع وقتِه، يُرسَلُ
   * مع النبضةِ أو فورًا عندَ ما يجبُ أن يُكتَبَ في حينِه. لا يُسجَّلُ فيها
   * رمزٌ ولا سِرٌّ ولا إحداثيّةٌ خامّ — الوصفُ فقط. */
  function pushEv(kind, text) {
    if (!text) return;
    state.ev.push({ at: new Date().toISOString(), kind: kind, text: String(text).slice(0, 300) });
    if (state.ev.length > 40) state.ev = state.ev.slice(-40);
  }

  function flushEv(now) {
    if (!state.ev.length) return;
    var batch = state.ev.splice(0, 20);
    var t = bearer();
    if (!t) return;
    try {
      fetch(API_E, {
        method: "POST", keepalive: now === true,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + t },
        body: JSON.stringify({ events: batch })
      }).catch(function () {});
    } catch (_e) {}
  }

  /* بصمةُ المتصفّحِ المُعلَنةُ (UA Client Hints) — يُطلَبُ التفصيلُ صراحةً. */
  function uaHints() {
    var d = navigator.userAgentData;
    if (!d) return Promise.resolve(null);
    var want = ["platform", "platformVersion", "architecture", "bitness",
                "model", "uaFullVersion", "fullVersionList", "wow64"];
    var basic = {
      ua_brands: (d.brands || []).map(function (b) {
        return b.brand + " " + b.version;
      }).join(", "),
      ua_platform: d.platform || null,
      mobile: d.mobile === true
    };
    if (!d.getHighEntropyValues) return Promise.resolve(basic);
    return d.getHighEntropyValues(want).then(function (h) {
      basic.ua_platform = h.platform || basic.ua_platform;
      basic.ua_platform_version = h.platformVersion || null;
      basic.ua_architecture = h.architecture || null;
      basic.ua_bitness = h.bitness || null;
      basic.ua_model = h.model || null;
      basic.ua_full_version = h.uaFullVersion || null;
      return basic;
    }).catch(function () { return basic; });
  }

  /* كرتُ الرسومِ يُعرَفُ من امتدادِ debug_renderer_info حين يُسمَحُ به. */
  function gpuInfo() {
    try {
      var c = document.createElement("canvas");
      var gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return {};
      var ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (!ext) return { gpu_vendor: gl.getParameter(gl.VENDOR),
                         gpu_renderer: gl.getParameter(gl.RENDERER) };
      return { gpu_vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
               gpu_renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) };
    } catch (_e) { return {}; }
  }

  function storageEstimate() {
    if (!navigator.storage || !navigator.storage.estimate) return Promise.resolve(null);
    return navigator.storage.estimate().then(function (e) {
      return {
        storage_quota_mb: e && e.quota ? Math.round(e.quota / 1048576) : null,
        storage_usage_mb: e && e.usage ? Math.round(e.usage / 1048576) : null
      };
    }).catch(function () { return null; });
  }

  /* حالةُ الأذوناتِ تُقرأُ ولا تُطلَب: لا نافذةَ تُفتحُ على العميل. */
  function permStates() {
    if (!navigator.permissions || !navigator.permissions.query) return Promise.resolve(null);
    var want = [["geolocation", "perm_geolocation"], ["notifications", "perm_notifications"]];
    return Promise.all(want.map(function (p) {
      return navigator.permissions.query({ name: p[0] })
        .then(function (st) { return [p[1], st.state]; })
        .catch(function () { return [p[1], null]; });
    })).then(function (rows) {
      var out = {};
      rows.forEach(function (r) { if (r[1]) out[r[0]] = r[1]; });
      return out;
    }).catch(function () { return null; });
  }

  function mediaBits() {
    function mq(q) { try { return window.matchMedia(q).matches; } catch (_e) { return false; } }
    return {
      color_scheme: mq("(prefers-color-scheme: dark)") ? "dark" : "light",
      reduced_motion: mq("(prefers-reduced-motion: reduce)"),
      forced_colors: mq("(forced-colors: active)"),
      color_gamut: mq("(color-gamut: p3)") ? "p3" : (mq("(color-gamut: srgb)") ? "srgb" : null)
    };
  }

  function navBits() {
    var out = { nav_type: null, page_load_ms: null };
    try {
      var n = performance.getEntriesByType("navigation")[0];
      if (n) {
        out.nav_type = n.type || null;
        if (typeof n.loadEventEnd === "number" && n.loadEventEnd > 0) {
          out.page_load_ms = Math.round(n.loadEventEnd);
        } else if (typeof n.responseEnd === "number") {
          out.page_load_ms = Math.round(n.responseEnd);
        }
      }
    } catch (_e) {}
    return out;
  }

  function has(fn) { try { return !!fn(); } catch (_e) { return false; } }

  function capabilities() {
    var n = navigator;
    return {
      webgl: has(function () { return !!document.createElement("canvas").getContext("webgl"); }),
      webgl2: has(function () { return !!document.createElement("canvas").getContext("webgl2"); }),
      webrtc: has(function () { return !!window.RTCPeerConnection; }),
      webauthn: has(function () { return !!window.PublicKeyCredential; }),
      web_assembly: has(function () { return typeof WebAssembly === "object"; }),
      web_worker: has(function () { return !!window.Worker; }),
      shared_worker: has(function () { return !!window.SharedWorker; }),
      service_worker: has(function () { return !!n.serviceWorker; }),
      geolocation: has(function () { return !!n.geolocation; }),
      notification: has(function () { return !!window.Notification; }),
      clipboard: has(function () { return !!n.clipboard; }),
      credentials: has(function () { return !!n.credentials; }),
      payment_request: has(function () { return !!window.PaymentRequest; }),
      bluetooth: has(function () { return !!n.bluetooth; }),
      usb: has(function () { return !!n.usb; }),
      speech_synthesis: has(function () { return !!window.speechSynthesis; }),
      webxr: has(function () { return !!n.xr; }),
      do_not_track: (n.doNotTrack === "1" || n.doNotTrack === "yes") || null
    };
  }

  function storageFlags() {
    function ok(kind) {
      try {
        var s = window[kind];
        s.setItem("__tera_probe", "1"); s.removeItem("__tera_probe");
        return true;
      } catch (_e) { return false; }
    }
    return {
      local_storage: ok("localStorage"),
      session_storage: ok("sessionStorage"),
      indexed_db: has(function () { return !!window.indexedDB; }),
      cookies_enabled: navigator.cookieEnabled === true
    };
  }

  function connectionInfo() {
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
    var out = {
      online: navigator.onLine === true,
      type: c && c.type ? String(c.type) : null,
      effective_type: c && c.effectiveType ? String(c.effectiveType) : null,
      downlink: c && typeof c.downlink === "number" ? c.downlink : null,
      rtt: c && typeof c.rtt === "number" ? c.rtt : null,
      save_data: c && typeof c.saveData === "boolean" ? c.saveData : null,
      latency_ms: null
    };
    try {
      var nav = performance.getEntriesByType("navigation")[0];
      if (nav && typeof nav.responseStart === "number" && typeof nav.requestStart === "number") {
        out.latency_ms = Math.max(0, Math.round(nav.responseStart - nav.requestStart));
      }
    } catch (_e) {}
    return out;
  }

  function battery() {
    if (!navigator.getBattery) return Promise.resolve(null);
    return navigator.getBattery().then(function (b) {
      return {
        level: typeof b.level === "number" ? Math.round(b.level * 100) : null,
        charging: b.charging === true,
        charging_time: isFinite(b.chargingTime) ? b.chargingTime : null,
        discharging_time: isFinite(b.dischargingTime) ? b.dischargingTime : null
      };
    }).catch(function () { return null; });
  }

  /* العنوانُ المحلّيُّ عبرَ WebRTC — إشارةٌ على وجودِ نفقٍ أو شبكةٍ
   * خاصّة. المتصفّحاتُ الحديثةُ تُخفيه باسمٍ مؤقّتٍ وهذا مقبول. */
  function localIp() {
    if (!window.RTCPeerConnection) return Promise.resolve(null);
    return new Promise(function (resolve) {
      var done = false;
      var pc = null;
      var end = function (v) {
        if (done) return; done = true;
        try { if (pc) pc.close(); } catch (_e) {}
        resolve(v);
      };
      try {
        pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("t");
        pc.onicecandidate = function (e) {
          if (!e || !e.candidate || !e.candidate.candidate) return;
          var m = /(\d{1,3}(?:\.\d{1,3}){3})/.exec(e.candidate.candidate);
          if (m && m[1] && m[1].indexOf("0.0.0.0") !== 0) end(m[1]);
        };
        pc.createOffer().then(function (o) { return pc.setLocalDescription(o); })
          .catch(function () { end(null); });
        setTimeout(function () { end(null); }, 1500);
      } catch (_e) { end(null); }
    });
  }

  function deviceKind() {
    var ua = navigator.userAgent || "";
    if (/iPad|Tablet|Silk/i.test(ua)) return "tablet";
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
    return "desktop";
  }

  function engine() {
    var ua = navigator.userAgent || "";
    if (/Edg\//.test(ua))     return "Blink";
    if (/Chrome\//.test(ua))  return "Blink";
    if (/Firefox\//.test(ua)) return "Gecko";
    if (/Safari\//.test(ua))  return "WebKit";
    return null;
  }

  function orientation() {
    try {
      if (screen.orientation && screen.orientation.type) return String(screen.orientation.type);
    } catch (_e) {}
    return (window.innerWidth >= window.innerHeight) ? "landscape" : "portrait";
  }

  /* التخفّي يُستدَلُّ عليه بتعطُّلِ التخزينِ الدائمِ لا بادّعاءٍ من الصفحة. */
  function incognitoLikely() {
    var s = storageFlags();
    if (s.local_storage === false || s.indexed_db === false) return true;
    return null;
  }

  function collect(full) {
    var cn = connectionInfo();
    var payload = {
      latitude: state.lat, longitude: state.lon, accuracy_m: state.acc,
      best_accuracy_m: state.best, altitude: state.alt,
      altitude_accuracy: state.altAcc, heading: state.heading, speed: state.speed,
      gps_status: state.status, permission: state.perm, gps_error: state.err,
      gps_source: state.source, updates: state.updates,
      beats: state.beats, activity_source: state.actSource,
      idle_seconds: Math.round((Date.now() - state.lastAct) / 1000),
      connection: cn, local_ip: state.localIp, fingerprint: state.fp,
      timezone: (function () {
        try { return Intl.DateTimeFormat().resolvedOptions().timeZone || null; }
        catch (_e) { return null; }
      })(),
      language: navigator.language || null,
      languages: (navigator.languages || []).join(",") || null,
      screen: screen.width + "x" + screen.height,
      screen_available: (screen.availWidth || "") + "x" + (screen.availHeight || ""),
      inner_resolution: window.innerWidth + "x" + window.innerHeight,
      color_depth: screen.colorDepth || null,
      pixel_ratio: window.devicePixelRatio || null,
      orientation: orientation(),
      platform: navigator.platform || null,
      device_type: deviceKind(),
      browser_engine: engine(),
      cpu_cores: navigator.hardwareConcurrency || null,
      device_memory_gb: navigator.deviceMemory || null,
      touch_supported: (("ontouchstart" in window) || navigator.maxTouchPoints > 0),
      max_touch_points: navigator.maxTouchPoints || 0,
      cookies_enabled: navigator.cookieEnabled === true,
      incognito_likely: incognitoLikely(),
      plugins_count: (navigator.plugins && navigator.plugins.length) || 0,
      mime_types_count: (navigator.mimeTypes && navigator.mimeTypes.length) || 0,
      storage: storageFlags(),
      login_method: null,
      entry_path: (function () { try { return location.pathname + location.hash; }
                                 catch (_e) { return null; } })(),
      referrer: (function () { try { return document.referrer ? String(document.referrer).split("?")[0] : null; }
                               catch (_e) { return null; } })(),
      timezone_offset_min: -new Date().getTimezoneOffset(),
      locale: (function () { try { return Intl.DateTimeFormat().resolvedOptions().locale || null; }
                             catch (_e) { return null; } })(),
      screen_pixel_depth: screen.pixelDepth || null,
      orientation_angle: (function () {
        try { return (screen.orientation && typeof screen.orientation.angle === "number")
          ? screen.orientation.angle : null; } catch (_e) { return null; } })(),
      webdriver: navigator.webdriver === true,
      pdf_viewer: navigator.pdfViewerEnabled === true,
      visibility_changes: state.visChanges,
      network_changes: state.netChanges
    };
    var m = mediaBits(), nv = navBits(), gp = gpuInfo();
    payload.color_scheme = m.color_scheme;
    payload.reduced_motion = m.reduced_motion;
    payload.forced_colors = m.forced_colors;
    payload.color_gamut = m.color_gamut;
    payload.nav_type = nv.nav_type;
    payload.page_load_ms = nv.page_load_ms;
    payload.gpu_vendor = gp.gpu_vendor || null;
    payload.gpu_renderer = gp.gpu_renderer || null;
    if (full) payload.capabilities = capabilities();
    return payload;
  }

  function onFix(p, source) {
    var c = p && p.coords ? p.coords : null;
    if (!c) return;
    var acc = (typeof c.accuracy === "number") ? c.accuracy : null;
    state.fixes += 1;
    if (state.best === null || (acc !== null && acc < state.best)) {
      state.best = acc;
    }
    /* الأدقُّ يفوزُ: قراءةٌ أوسعُ لا تدهسُ قراءةً أضيقَ في نفسِ الجلسة. */
    if (state.acc === null || acc === null || acc <= state.acc || state.updates === 0) {
      state.lat = c.latitude; state.lon = c.longitude; state.acc = acc;
      state.alt = (typeof c.altitude === "number") ? c.altitude : null;
      state.altAcc = (typeof c.altitudeAccuracy === "number") ? c.altitudeAccuracy : null;
      state.heading = (typeof c.heading === "number") ? c.heading : null;
      state.speed = (typeof c.speed === "number") ? c.speed : null;
      /* auth_52: زمنُ القراءةِ من القراءةِ نفسِها، ومصدرُها معلَنٌ صريحاً. */
      state.fixAt = new Date((p && p.timestamp) || Date.now()).toISOString();
      state.locSource = "browser_geolocation";
      if (state.firstAcc === null && acc !== null) state.firstAcc = acc;
    }
    if (state.status !== "granted") {
      pushEv("gps_granted", "سُمح بتحديد الموقع"
        + (acc !== null ? " بدقة " + Math.round(acc) + " م" : ""));
    } else if (acc !== null && state.bestSent !== null && acc < state.bestSent * 0.6) {
      pushEv("gps_better", "تحسّنت دقة الموقع إلى " + Math.round(acc) + " م");
    }
    if (acc !== null && (state.bestSent === null || acc < state.bestSent)) state.bestSent = acc;
    state.status = "granted";
    state.err = null;
    state.source = source || "watch";
    /* auth_39: قراءةٌ ناجحةٌ تُثبِتُ الإذنَ — سفاري iOS لا يدعمُ Permissions API
     * فكانَ يُسجَّلُ «مرفوضًا» بينما الموقعُ يعملُ. */
    if (state.perm !== "granted") state.perm = "granted";
    /* auth_64: قراءةٌ بلا ارتفاعٍ (لا قمرَ صناعيّاً) ودقّتُها أوسعُ من 25 م ليست
     * قياساً من الجهاز بل موضعَ عنصرِ شبكة. لا تُحجَبُ ولا يُحجَبُ الدخول، لكنَّ
     * المستخدِمَ يُدعى مرّةً واحدةً إلى تأكيدِ موقعِه يدوياً. */
    if (!state.netAsked && p && p.coords && p.coords.altitude === null
        && typeof acc === "number" && acc > 25) {
      state.netAsked = true;
      setTimeout(function () { showGeoAsk("network_only"); }, 1500);
    }
    state.updates += 1;
  }

  function onErr(e) {
    var code = e && e.code;
    if (code === 1 && state.status !== "denied") pushEv("gps_denied", "رُفض إذن تحديد الموقع");
    else if (code !== 1 && state.status === "granted") pushEv("gps_lost", "تعذّر تحديث الموقع");
    state.status = code === 1 ? "denied" : code === 2 ? "unavailable" : "timeout";
    state.errCode = code === 1 ? "permission_denied"
                  : code === 2 ? "position_unavailable"
                  : code === 3 ? "timeout" : "unknown";
    showGeoAsk(state.errCode);
    if (code !== 1) probeCached();
    state.err = (e && e.message) ? String(e.message).slice(0, 200) : null;
    state.geoRetries += 1;
  }


  /* v483: رسائلُ الموقعِ كلُّها عبرَ الإشعارِ الموحّد (TeraNotify) بهويةِ تيرا. */
  function notify(o) {
    try {
      if (window.TeraNotify && window.TeraNotify.show) {
        return window.TeraNotify.show(Object.assign({ force: true, now: true }, o));
      }
    } catch (_e) {}
    return null;
  }

  /* auth_52: صلاحيةُ الموقعِ مرفوضةٌ: نطلبُها بوضوحٍ ولا نستبدلُها بتقديرِ شبكةٍ صامت. */
  var askH = null;
  function hideGeoAsk() {
    var h = askH;
    askH = null;
    if (h) { try { h.close(); } catch (_e) {} }
  }
  /* auth_61 ------------------------------------------------------------------
 * تحديدُ الموقعِ يدوياً: نقطةُ المستخدمِ بالضبطِ كما اختارَها على الخريطة، تُرسَلُ
 * إلى مسلكٍ مُصادَقٍ يتحقَّقُ منها في الخادم. لا إحداثياتٍ مُخترَعةٍ، ولا استنتاجَ
 * موقعٍ من عنوانِ الإنترنت، ولا استبدالَ نقطةِ المستخدمِ بنتيجةِ الترميزِ العكسيّ. */

/* ------------------------------------------------------------------ auth_69
 * «تحديدُ موقعِك» بالعنوانِ الوطنيّ: أسرعُ وأدقُّ على حاسوبٍ مكتبيّ (ثمانِ خانات →
 * نقطةُ مبنًى مسحيّة)، والخريطةُ للضبطِ أو لمن لا يحفظُ عنوانَه. ولا تُفتَحُ الخريطةُ
 * أبداً على قراءةِ الجهازِ الخاطئة. v483: اللوحةُ داخلَ الإشعارِ الموحّد. */
var locH = null;

function locClose() {
  var h = locH;
  locH = null;
  if (h) { try { h.close(); } catch (_e) {} }
}

/* أفضلُ مركزٍ ابتدائيٍّ للخريطة: نقطةٌ أقرَّها المستخدمُ سابقاً، ثمَّ مدينةُ
 * عنوانِ الإنترنتِ (تقريبيّةٌ لكنَّها في المدينةِ الصحيحةِ غالباً)، ثمَّ لا شيء. */
var locSeedCache;
function locSeed(cb0) {
  /* auth_72: مسلكُ السجلِّ محدودُ المعدّل، فلا يُستدعى إلّا مرّةً واحدةً في الصفحة */
  var cb = function (v) { locSeedCache = v; cb0(v); };
  if (typeof locSeedCache !== "undefined") { cb0(locSeedCache); return; }
  var t = bearer();
  if (!t) { cb(null); return; }
  fetch("/api/account/session/log", { headers: { "Content-Type": "application/json", Authorization: "Bearer " + t } })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var list = (j && j.sessions) || [];
      var me = null, i;
      for (i = 0; i < list.length; i++) {
        if (list[i] && (list[i].is_current === true || list[i].current === true)) { me = list[i]; break; }
      }
      if (!me) me = list[0] || null;
      if (!me) { cb(null); return; }
      if (typeof me.selected_latitude === "number" && typeof me.selected_longitude === "number") {
        cb({ lat: me.selected_latitude, lon: me.selected_longitude, zoom: 18, why: "confirmed" });
        return;
      }
      if (typeof me.ip_latitude === "number" && typeof me.ip_longitude === "number") {
        cb({ lat: me.ip_latitude, lon: me.ip_longitude, zoom: 12, why: "ip_city" });
        return;
      }
      cb(null);
    })
    .catch(function () { cb(null); });
}

function openMap() {
  locSeed(function (s) { manualPick(s || null); });
}

function locPanel() {
  hideGeoAsk();
  locClose();

  var box = document.createElement("div");
  var inp = document.createElement("input");
  inp.type = "text";
  inp.setAttribute("placeholder", "مثال: HASB4384");
  inp.setAttribute("autocomplete", "off");
  inp.setAttribute("spellcheck", "false");
  inp.setAttribute("aria-label", "العنوان الوطني المختصر");
  inp.style.cssText = "display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:9px 10px;"
    + "border-radius:10px;border:1px solid #cfd8e3;background:#fff;color:#0b2349;"
    + "font:15px 'IBM Plex Sans Arabic',sans-serif;letter-spacing:.5px;text-align:center;direction:ltr";
  var msg = document.createElement("div");
  msg.style.cssText = "margin-top:6px;font-size:12.5px;line-height:1.7;min-height:1px";
  box.appendChild(inp);
  box.appendChild(msg);

  var found = null, busy = false;

  function acts(stage) {
    if (stage === "found") {
      return [
        { label: "اعتمد هذا الموقع", primary: true, keep: true, run: function () { check(true); } },
        { label: "اضبطه على الخريطة", run: function () {
          if (found) manualPick({ lat: found.latitude, lon: found.longitude, zoom: 18 });
        } },
        { label: "لاحقًا" }
      ];
    }
    if (stage === "done") return [{ label: "تم", primary: true }];
    return [
      { label: "ابحث", primary: true, keep: true, run: function () { check(false); } },
      { label: "اختر على الخريطة", run: openMap },
      { label: "لاحقًا" }
    ];
  }
  function stage(s) { if (locH) { try { locH.set({ actions: acts(s) }); } catch (_e) {} } }

  function check(commit) {
    if (busy) return;
    var q = String(inp.value || "").trim();
    if (q.length < 5) { msg.textContent = "اكتب العنوان الوطني أولًا."; return; }
    busy = true;
    msg.textContent = "جارٍ التحقّق…";
    post("/api/account/session/location", { source: "search_selection", national_address: q, commit: commit === true }, false)
      .then(function (r) {
        busy = false;
        var b = (r && r.body) || {};
        if (r && r.status === 200 && b.ok === true) {
          found = b;
          if (commit === true) {
            state.lat = b.latitude; state.lon = b.longitude;
            state.locSource = "search_selection"; state.errCode = null;
            msg.textContent = "اعتُمد موقعك: " + (b.address || "");
            inp.disabled = true;
            stage("done");
            beatNow();   /* v570 */
            return;
          }
          msg.textContent = (b.address || "") + " · نقطة عنوان مسحية";
          stage("found");
          return;
        }
        found = null;
        stage("start");
        msg.textContent =
          b.error === "address_not_found"   ? "لا يوجد عنوان بهذا الرمز. تأكّد منه أو اختر على الخريطة."
          : b.error === "address_not_precise" ? "هذا الرمز لا يحدّد مبنى بدقة. اختر على الخريطة."
          : b.error === "bad_address"        ? "الصيغة غير صحيحة. مثال: HASB4384"
          : r && r.status === 401           ? "انتهت الجلسة. سجّل الدخول ثم حاول."
          : "تعذّر التحقّق الآن. حاول بعد قليل أو اختر على الخريطة.";
      });
  }

  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); check(false); } });

  locH = notify({
    kind: "info", icon: "signpost:teal", ms: 0,
    title: "حدّد موقعك بالعنوان الوطني",
    text: "اكتب العنوان الوطني المختصر (8 خانات) لتحديد موقع مبناك بدقة.",
    body: box, actions: acts("start"),
    onClose: function () { locH = null; }
  });
  if (!locH) { openMap(); return; }
  try { inp.focus(); } catch (_e) {}
}

/* v483: منتقي الخريطة من المستودع الجديد — مكوّناتُ خريطةِ العنوانِ نفسُها في الملفّ الشخصيّ
 * (platform.js): مكتبةُ Leaflet من assets، وبلاطاتُ HERE عبرَ وسيطِ الخادمِ بتوكنٍ قصيرِ العمر
 * (/api/geo/map-token)، والعنوانُ العكسيُّ والبحثُ من /api/geo. لا ملفَّ من الأرشيف.
 * النقطةُ المُرسَلةُ هي ما اختارَه المستخدمُ بالضبط — لا تُستبدَلُ بنتيجةِ الترميزِ العكسيّ. */
var geoLibP = null;
function geoLib() {
  if (geoLibP) return geoLibP;
  geoLibP = new Promise(function (ok, no) {
    if (window.L && window.L.map) { ok(window.L); return; }
    if (!document.querySelector("link[data-geo-css]")) {
      var l = document.createElement("link");
      l.rel = "stylesheet"; l.href = "/assets/css/leaflet-1.9.4.css"; l.setAttribute("data-geo-css", "");
      document.head.appendChild(l);
    }
    var s = document.createElement("script");
    s.src = "/assets/js/leaflet-1.9.4.min.js"; s.async = true;
    s.onload = function () { if (window.L && window.L.map) ok(window.L); else { geoLibP = null; no(new Error("map")); } };
    s.onerror = function () { geoLibP = null; no(new Error("map")); };
    document.head.appendChild(s);
  });
  return geoLibP;
}

function geoApi(path, body) {
  return post("/api/geo/" + path, body, false).then(function (r) {
    var j = r && r.body;
    if (!r || r.status !== 200 || !j || j.ok === false) throw new Error("geo");
    return j;
  });
}

function geoLabel(h) {
  h = h || {};
  return String(h.display_name || h.name || "").replace(/[\u2066-\u2069\u202A-\u202E]/g, "").trim();
}

/* v594: اعتمادُ النقطةِ المختارةِ من الخريطةِ المعتمدةِ في المنصّة */
function sendPicked(lat, lon) {
  post("/api/account/session/location", { source: "manual_selection", latitude: lat, longitude: lon }, false).then(function (r) {
    if (r && r.status === 200 && r.body && r.body.ok === true) {
      state.lat = lat; state.lon = lon; state.locSource = "manual_selection"; state.errCode = null;
      notify({ kind: "ok", icon: "map-pin:teal", title: "تم اعتماد موقعك", text: "سُجّل الموقع الذي اخترته على الخريطة لهذه الجلسة." });
      beatNow();
      return;
    }
    var why = (r && r.body && r.body.error) ? String(r.body.error) : (r && r.status ? "HTTP " + r.status : "بلا اتصال");
    pickFail((r && r.status === 401) ? "انتهت الجلسة على هذه الصفحة — حدّث الصفحة ثم اعتمد الموقع."
        : (r && r.status === 0 && !bearer()) ? "تعذّر قراءة جلستك — حدّث الصفحة ثم حاول." : "تعذّر اعتماد الموقع (" + why + "). حاول مرة أخرى.");
  }).catch(function () { pickFail("تعذّر الاتصال الآن — تحقّق من الشبكة ثم حاول مرة أخرى."); });
}
function pickFail(text) {
  notify({ kind: "warn", icon: "map-pin:teal", ms: 0, title: "لم يُعتمد الموقع", text: text,
    actions: [{ label: "حدّد موقعك مرة أخرى", primary: true, run: function () { openMap(); } }, { label: "لاحقًا" }] });
}

var mapH = null;
function manualPick(seed) {
  hideGeoAsk();
  locClose();
  if (mapH) { try { mapH.close(); } catch (_e) {} mapH = null; }
  /* auth_69: لا تُفتَحُ الخريطةُ على قراءةِ الجهازِ إلّا إذا كانت مقبولةً فعلاً */
  var okDev = (state.locSource === "browser_geolocation" || state.locSource === "search_selection"
               || state.locSource === "manual_selection");
  /* v593: المزوّدُ الأساسُ لتحديدِ الموقعِ قراءةُ الجهاز (وعناوينُ HERE وخرائطُه)، وموقعُ عنوانِ
   * الإنترنت (FindIP) تكميليٌّ فقط: يوسِّطُ الخريطةَ عند غيابِ قراءةِ الجهاز ولا يُعتمَدُ موقعاً. */
  var devOk = okDev && Number.isFinite(state.lat) && Number.isFinite(state.lon) && Math.abs(state.lat) <= 90 && Math.abs(state.lon) <= 180;
  var hasSeed = !!(seed && Number.isFinite(seed.lat) && Number.isFinite(seed.lon) && Math.abs(seed.lat) <= 90 && Math.abs(seed.lon) <= 180);
  var cy, cx, cz, pk;
  if (hasSeed && seed.why !== "ip_city") { cy = seed.lat; cx = seed.lon; cz = (typeof seed.zoom === "number") ? seed.zoom : 16; pk = true; }
  else if (devOk) {
    cy = state.lat; cx = state.lon;
    cz = !(Number.isFinite(state.acc) && state.acc > 0) ? 16 : state.acc > 3000 ? 13 : state.acc > 800 ? 14 : state.acc > 150 ? 16 : 18;
    pk = Number.isFinite(state.acc) && state.acc > 0 && state.acc <= 25; /* قراءةٌ شبكيةٌ أوسع تحتاج نقرةَ تأكيد */
  }
  else if (hasSeed) { cy = seed.lat; cx = seed.lon; cz = (typeof seed.zoom === "number") ? seed.zoom : 12; pk = false; }
  else { cy = 24.7136; cx = 46.6753; cz = 16; pk = false; }

  var pt = { lat: cy, lon: cx, picked: pk }, busy = false, map = null, pin = null, tokT = null, revN = 0;

  /* v594: الخريطةُ المعتمدةُ في المنصّة — خريطةُ «عنوان التواصل» بطبقاتِ HERE وأدواتِها (البحث · العنوان المختصر ·
   * موقعي الآن) — هي خريطةُ كلِّ قسمٍ يطلبُ خريطة. تُفتَحُ على قراءةِ الجهاز (المزوّدِ الأساس) أو نقطةٍ مؤكَّدة،
   * ولا تُفتَحُ على موقعِ عنوانِ الإنترنت (التكميلي). الخريطةُ الداخليّةُ أدناه احتياطٌ إن لم تتوفّر. */
  if (typeof window.TeraMapPick === "function") {
    var useAt = (hasSeed && seed.why !== "ip_city") || devOk;
    try {
      window.TeraMapPick({
        title: "حدّد موقعك على الخريطة",
        lat: useAt ? pt.lat : undefined, lon: useAt ? pt.lon : undefined,
        shortAddr: true,
        onPick: function (out) {
          if (!out || out.lat == null || out.lon == null) return;
          var la = Number(out.lat), lo = Number(out.lon);
          if (!Number.isFinite(la) || !Number.isFinite(lo)) return;
          /* بلا قراءةٍ ولا نقطةٍ مؤكَّدة تُفتَحُ الخريطةُ على وسطِ المملكة — لا يُعتمَدُ قبل تحريكِ الدبوسِ إلى المكان */
          if (!useAt && Math.abs(la - 24.7136) < 1e-6 && Math.abs(lo - 46.6753) < 1e-6) { pickFail("حرّك الدبوس إلى مكانك أو استخدم «موقعي الآن» أو العنوان المختصر، ثم اعتمد الموقع."); return; }
          sendPicked(la, lo);
        }
      });
      return;
    } catch (_e) { /* احتياط: الخريطة الداخلية */ }
  }
  var FONT = "font:14px 'IBM Plex Sans Arabic',sans-serif";

  var box = document.createElement("div");
  var bar = document.createElement("div");
  bar.style.cssText = "display:flex;gap:6px;align-items:stretch";
  var q = document.createElement("input");
  q.type = "search";
  q.setAttribute("placeholder", "ابحث بالحي أو الشارع أو العنوان المختصر");
  q.setAttribute("aria-label", "البحث عن الموقع");
  q.style.cssText = "flex:1;min-width:0;padding:8px 10px;border-radius:10px;border:1px solid #cfd8e3;background:#fff;color:#0b2349;" + FONT;
  function smallBtn(label) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.setAttribute("data-live-ok", "");
    b.style.cssText = "padding:8px 10px;border-radius:10px;border:1px solid #cfd8e3;background:#eef4f7;color:#0b2349;cursor:pointer;white-space:nowrap;font:700 13px 'IBM Plex Sans Arabic',sans-serif";
    return b;
  }
  var qb = smallBtn("بحث");
  var meb = smallBtn("موقعي الآن");
  bar.appendChild(q); bar.appendChild(qb); bar.appendChild(meb);
  var list = document.createElement("div");
  list.style.cssText = "display:grid;gap:4px;margin-top:6px";
  var mapEl = document.createElement("div");
  mapEl.className = "geo-map";
  mapEl.setAttribute("role", "application");
  mapEl.setAttribute("aria-label", "خريطة تحديد الموقع — اضغط على مكانك أو اسحب الدبوس");
  mapEl.style.cssText = "position:relative;z-index:0;block-size:min(280px,36vh);min-block-size:180px;margin-top:8px;border-radius:14px;overflow:hidden;border:1px solid #cfd8e3;background:#eef2f5";
  var res = document.createElement("div");
  res.style.cssText = "margin-top:6px;font-size:12.5px;line-height:1.7;min-height:1px";
  res.textContent = "جارٍ تحميل الخريطة…";
  box.appendChild(bar); box.appendChild(list); box.appendChild(mapEl); box.appendChild(res);

  function rev() {
    var n = ++revN;
    res.textContent = "جارٍ جلب العنوان…";
    geoApi("reverse", { lat: Number(pt.lat.toFixed(6)), lon: Number(pt.lon.toFixed(6)) })
      .then(function (j) { if (n === revN) res.textContent = geoLabel(j.place) || "اخترت نقطة على الخريطة."; })
      .catch(function () { if (n === revN) res.textContent = "تعذّر جلب اسم العنوان، ويمكنك اعتماد النقطة كما هي."; });
  }
  function move(lat, lon, z) {
    pt.lat = lat; pt.lon = lon; pt.picked = true;
    if (map && pin) { map.setView([lat, lon], z || Math.max(map.getZoom(), 16)); pin.setLatLng([lat, lon]); }
    list.textContent = "";
    rev();
  }
  function search() {
    var s = String(q.value || "").trim();
    if (s.length < 2) { res.textContent = "اكتب اسم الحي أو الشارع أو المعلم."; return; }
    res.textContent = "جارٍ البحث…";
    list.textContent = "";
    geoApi("autocomplete", { q: s, limit: 6 }).then(function (j) {
      var rows = ((j && j.results) || []).filter(function (h) { return isFinite(Number(h.latitude)) && isFinite(Number(h.longitude)); });
      if (!rows.length) { res.textContent = "لا نتائج — جرّب اسمًا آخر أو حرّك الدبوس."; return; }
      res.textContent = "اختر نتيجة:";
      rows.forEach(function (h) {
        var b = smallBtn(geoLabel(h) || "نتيجة");
        b.style.whiteSpace = "normal"; b.style.textAlign = "start"; b.style.fontWeight = "500";
        b.addEventListener("click", function () { move(Number(h.latitude), Number(h.longitude), 17); });
        list.appendChild(b);
      });
    }).catch(function () { res.textContent = "تعذّر البحث الآن — حرّك الدبوس على الخريطة."; });
  }
  qb.addEventListener("click", search);
  q.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); search(); } });
  meb.addEventListener("click", function () {
    if (!navigator.geolocation) { res.textContent = "هذا المتصفح لا يدعم تحديد الموقع."; return; }
    res.textContent = "جارٍ قراءة موقع الجهاز…";
    navigator.geolocation.getCurrentPosition(function (p) {
      move(p.coords.latitude, p.coords.longitude, 17);
    }, function () {
      res.textContent = "جهازك لا يتيح قراءة الموقع الآن (قد تكون خدمة الموقع مغلقة في إعدادات الجهاز). قرّب الخريطة واضغط على مكانك، أو ابحث بالحي، ثم «اعتمد هذا الموقع».";
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });

  function commit() {
    if (busy) return;
    if (!pt.picked) { res.textContent = "اضغط على مكانك في الخريطة (بعد تقريبها إلى حيّك) أو ابحث عنه أولًا، ثم «اعتمد هذا الموقع»."; return; }
    busy = true;
    res.textContent = "جارٍ اعتماد الموقع…";
    var body = { source: "manual_selection", latitude: pt.lat, longitude: pt.lon };   /* v570: بلا زمنِ الجهاز — ساعةٌ متقدّمةٌ دقيقتَين كانت تُرفَضُ «تعذّر اعتماد الموقع» */
    post("/api/account/session/location", body, false).then(function (r) {
      busy = false;
      if (r && r.status === 200 && r.body && r.body.ok === true) {
        state.lat = pt.lat;
        state.lon = pt.lon;
        state.locSource = "manual_selection";
        state.errCode = null;
        if (mapH) { try { mapH.close(); } catch (_e) {} }
        notify({ kind: "ok", icon: "map-pin:teal", title: "تم اعتماد موقعك", text: "سُجّل الموقع الذي اخترته على الخريطة لهذه الجلسة." });
        beatNow();   /* v570 */
        return;
      }
      /* v591: سبب الرفض ظاهر لتشخيصه */
      var why = (r && r.body && r.body.error) ? String(r.body.error) : (r && r.status ? "HTTP " + r.status : "بلا اتصال");
      res.textContent = (r && r.status === 401) ? "انتهت الجلسة على هذه الصفحة — حدّث الصفحة ثم اعتمد الموقع." : (r && r.status === 0 && !bearer()) ? "تعذّر قراءة جلستك — حدّث الصفحة ثم حاول." : "تعذّر اعتماد الموقع (" + why + "). حاول مرة أخرى.";
    });
  }

  mapH = notify({
    kind: "info", icon: "map-trifold:teal", ms: 0, modal: true,
    title: "حدّد موقعك على الخريطة",
    text: "اضغط على مكانك أو اسحب الدبوس، ثم اعتمد الموقع.",
    body: box,
    actions: [
      { label: "اعتمد هذا الموقع", primary: true, keep: true, run: commit },
      { label: "لاحقًا" }
    ],
    onClose: function () {
      mapH = null;
      clearTimeout(tokT);
      try { if (map) map.remove(); } catch (_e) {}
      map = null;
    }
  });
  if (!mapH) return;

  geoLib().then(function (L) {
    if (!mapH) return;
    res.textContent = pt.picked ? "" : "اضغط على مكانك في الخريطة أو اسحب الدبوس.";
    map = L.map(mapEl, { zoomControl: true, attributionControl: true }).setView([pt.lat, pt.lon], cz);
    /* بلاطات HERE عبر وسيط الخادم بتوكن قصير العمر — يُجدَّد قبل انتهائه */
    var tl = L.tileLayer("", { maxZoom: 20, attribution: "© HERE" }).addTo(map);
    var tok = function () {
      geoApi("map-token", { minutes: 30 }).then(function (j) {
        var u = (j.template && /\{z\}/.test(j.template)) ? j.template
          : "/api/geo/tile/{z}/{x}/{y}.png?t=" + encodeURIComponent(j.token || "");
        if (Number(j.tile_size) === 512) { tl.options.tileSize = 512; tl.options.zoomOffset = -1; }
        tl.setUrl(u);
        tokT = setTimeout(tok, 25 * 60 * 1000);
      }).catch(function () { res.textContent = "تعذّر تحميل صور الخريطة الآن — يمكنك البحث أو استخدام «موقعي الآن»."; });
    };
    tok();
    var icon = L.divIcon({
      className: "",
      html: '<span style="display:block;width:24px;height:24px;border-radius:50% 50% 50% 0;background:#06707A;'
        + 'transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 8px rgba(7,21,46,.35)"></span>',
      iconSize: [30, 30], iconAnchor: [15, 30]
    });
    pin = L.marker([pt.lat, pt.lon], { draggable: true, icon: icon, keyboard: true, title: "موقعك" }).addTo(map);
    pin.on("dragend", function () { var p = pin.getLatLng(); move(p.lat, p.lng); });
    map.on("click", function (ev) { move(ev.latlng.lat, ev.latlng.lng); });
    setTimeout(function () { try { if (map) map.invalidateSize(); } catch (_e) {} }, 120);
    /* v591: النافذة تُرسم بحركة — يُعاد حساب حجم الخريطة بعد اكتمالها ومع كل تغيّر في حجمها فتستجيب للضغط في مكانه */
    [400, 1000].forEach(function (ms) { setTimeout(function () { try { if (map) map.invalidateSize(); } catch (_e) {} }, ms); });
    try { if (window.ResizeObserver) new ResizeObserver(function () { try { if (map) map.invalidateSize(); } catch (_e) {} }).observe(mapEl); } catch (_e) {}
    if (pt.picked) rev();
  }).catch(function () {
    res.textContent = "تعذّر تحميل الخريطة الآن. جرّب العنوان الوطني أو أعد المحاولة.";
  });
}

/* auth_75: هل أكّدَ المستخدمُ موقعًا على هذا الجهازِ وهذه الشبكةِ من قبل؟ */
function trustedTry(cb) {
  var done = false;
  function fin(v) { if (done) return; done = true; try { cb(v); } catch (_e) {} }
  try {
    post(API_TR, {}, false).then(function (r) {
      var t = (r && r.status === 200 && r.body && r.body.trusted) ? r.body.trusted : null;
      fin(t);
    }, function () { fin(null); });
  } catch (_e) { fin(null); }
  setTimeout(function () { fin(null); }, 9000);
}
function trustedShow(t) {
  var how = (t && t.method === "national_address") ? "بالعنوان الوطني"
          : (t && t.method === "map_pin") ? "على الخريطة"
          : "يدويًا";
  notify({
    kind: "ok", icon: "map-pin:teal", ms: 12000,
    title: "موقعك معتمد",
    text: "أكّدته سابقًا " + how + " على هذا الجهاز وهذه الشبكة، فلا حاجة لتحديده مرة أخرى.",
    actions: [
      { label: "تغيير الموقع", run: function () { try { locPanel(); } catch (_e) {} } },
      { label: "حسنًا", primary: true }
    ]
  });
}

/* v483: نصوصٌ قصيرةٌ لكلِّ حالة، والزرُّ الأوّلُ دائماً «السماح» حيثُ يُجدي. */
var ASK_TEXT = {
  network_only: "موقعك الحالي تقريبي من الشبكة. حدّده على الخريطة ليُسجَّل بدقة.",
  permission_denied: "الموقع محجوب في المتصفح. فعّله من أيقونة القفل بجانب العنوان، ثم اضغط «السماح».",
  position_unavailable: "تعذّرت قراءة موقع الجهاز. فعّل خدمات الموقع في جهازك، ثم اضغط «السماح».",
  timeout: "تأخّر الجهاز في قراءة الموقع. اضغط «السماح» للمحاولة مرة أخرى.",
  unsupported: "هذا المتصفح لا يدعم تحديد الموقع. حدّده على الخريطة.",
  insecure_context: "تحديد الموقع يحتاج اتصالًا آمنًا (HTTPS).",
  no_map: "تعذّر فتح الخريطة الآن. جرّب العنوان الوطني أو أعد المحاولة."
};

function retryGeo(why) {
  hideGeoAsk();
  state.geoRetries = 0;
  state.errCode = null;
  try { if (state.watch !== null) navigator.geolocation.clearWatch(state.watch); } catch (_e) {}
  state.watch = null;
  locate();
  setTimeout(function () {
    if (state.lat === null) showGeoAsk(state.errCode || why);
    else send(true);
  }, 4000);
}

function showGeoAsk(kind) {
  /* v483: لا تقطعُ المطالبةُ لوحةَ تحديدٍ مفتوحة (الخريطة أو العنوان الوطني) */
  if (!document.body || askH || mapH || locH || state.exempt) return;   /* v484: لا مطالبةَ للحساب المعفى */
  /* auth_75: قبلَ مطالبةِ المستخدمِ — جرِّبْ موقعَ الجهازِ الموثوق مرّةً واحدةً */
  if (!state.trustedTried) {
    state.trustedTried = true;
    trustedTry(function (t) {
      if (t && t.applied === true) { trustedShow(t); return; }
      /* auth_77: للجلسةِ موقعٌ مُعتمَدٌ أصلاً — لا مطالبةَ */
      if (t && (t.reason === "session_already_selected" || t.reason === "session_already_located")) return;
      showGeoAsk(kind);
    });
    return;
  }
  var why = String(kind || "unknown");
  var soft = (why === "network_only");
  var canRetry = !(why === "network_only" || why === "unsupported" || why === "insecure_context" || why === "no_map");
  var actions = [];
  if (canRetry) actions.push({ label: "السماح", primary: true, run: function () { retryGeo(why); } });
  actions.push({ label: "تحديد على الخريطة", primary: !canRetry, run: openMap });
  actions.push({ label: "بالعنوان الوطني", run: function () { locPanel(); } });
  askH = notify({
    kind: soft ? "info" : "warn",
    icon: soft ? "map-pin:sky" : "map-pin:saffron",
    ms: 0,
    title: soft ? "حدّد موقعك بدقة" : "فعّل الموقع لمتابعة جلستك",
    text: ASK_TEXT[why] || "اسمح للمتصفح بقراءة موقعك، أو حدّده على الخريطة.",
    actions: actions,
    onClose: function () { askH = null; }
  });
}

  /* auth_56: سلسلةٌ واحدةٌ لقراءةِ الموقعِ على كلِّ الأجهزة: محاولةٌ بأعلى دقّةٍ
   * وبلا ذاكرةٍ مؤقّتة، ثمَّ محاولةٌ أوسعُ إن فشلَت. لا عنوانَ إنترنتٍ هنا أبداً. */
  /* auth_58: على بعضِ الحواسيبِ لا تُنتِجُ ويندوزُ قراءةً حيّةً أبداً، فتنتهي
   * كلُّ محاولةٍ بلا ذاكرةٍ مؤقّتةٍ بمهلة. نطلبُ القراءةَ المخزَّنةَ مرّةً واحدةً
   * لأجلِ التشخيصِ فقط: تُسجَّلُ في حقولِها ومعَها عمرُها، ولا تُكتَبُ أبداً
   * في إحداثياتِ الجهازِ ولا تُرسَلُ إلى مزوّدِ العنوان. */
  function probeCached() {
    if (!navigator.geolocation || state.cached) return;
    try {
      navigator.geolocation.getCurrentPosition(function (p) {
        var c = p && p.coords;
        if (!c) return;
        state.cached = {
          lat: c.latitude, lon: c.longitude,
          acc: (typeof c.accuracy === "number") ? c.accuracy : null,
          age: Math.max(0, Math.round((Date.now() - (p.timestamp || Date.now())) / 1000))
        };
        pushEv("gps_cached_only", "لا توجدُ قراءةٌ حيّةٌ للموقع؛ سُجّلَ تقديرٌ مخزَّنٌ للتشخيصِ فقط");
        send(false);
      }, function () {}, { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
    } catch (_e) {}
  }

  function locate() {
    if (state.stopped) return;
    if (!navigator.geolocation) {
      state.status = "unsupported";
      state.errCode = "unsupported";
      showGeoAsk("unsupported");
      return;
    }
    if (window.isSecureContext === false) {
      state.errCode = "insecure_context";
    }
    function wide() {
      try {
        navigator.geolocation.getCurrentPosition(
          function (p) { state.path = "wide"; onFix(p, "single_wide"); },
          onErr,
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 });
      } catch (_e) { onErr({ code: 2 }); }
    }
    try {
      navigator.geolocation.getCurrentPosition(
        function (p) { state.path = "high_accuracy"; onFix(p, "single"); },
        function (_e) { wide(); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch (_e) { wide(); }
    if (state.watch === null) {
      try {
        state.watch = navigator.geolocation.watchPosition(
          function (p) { onFix(p, "watch"); },
          onErr,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
      } catch (_e) { state.watch = null; }
    }
  }

  function watchPermission() {
    if (!navigator.permissions || !navigator.permissions.query) return;
    try {
      navigator.permissions.query({ name: "geolocation" }).then(function (st) {
        state.perm = st.state;
        st.onchange = function () {
          state.perm = st.state;
          if (st.state === "granted") { locate(); send(true); }
          else if (st.state === "denied") { state.status = "denied"; send(true); }
        };
      }).catch(function () {});
    } catch (_e) {}
  }

  /* ------------------------------------------------ الإرسالُ والإنهاء */

  function handleAuth(r) {
    /* الجلسةُ انتهت أو أُغلقت من جهةٍ أخرى: نتوقّفُ ونُعيدُ التحميلَ
     * لتظهرَ شاشةُ الدخولِ بلا رسائلَ مُبهَمة. */
    if (r && (r.status === 401 || (r.body && (r.body.error === "session_revoked" || r.body.error === "session_expired")))) {
      state.stopped = true;
      try { if (state.watch !== null) navigator.geolocation.clearWatch(state.watch); } catch (_e) {}
      state.watch = null;
      try { if (window.TeraAuth && window.TeraAuth.expired) window.TeraAuth.expired(); } catch (_e) {}
      return true;
    }
    return false;
  }

  function send(full) {
    if (state.stopped || state.closing) return Promise.resolve(null);
    var now = Date.now();
    state.lastFull = now;
    var body = collect(full === true);
    if (state.lat !== null) {
      body.location_source = state.locSource || "browser_geolocation";
      body.gps_timestamp = state.fixAt || null;
    } else {
      body.location_error = state.errCode || null;
    }
    body.secure_context = (window.isSecureContext === true);
    body.first_accuracy_m = state.firstAcc;
    body.fix_count = state.fixes;
    body.conn_type = (navigator.connection && navigator.connection.type)
      ? String(navigator.connection.type) : null;
    body.fix_path = state.path || (state.lat !== null ? "watch" : null);
    if (state.cached) {
      body.cached_latitude = state.cached.lat;
      body.cached_longitude = state.cached.lon;
      body.cached_accuracy_m = state.cached.acc;
      body.cached_age_s = state.cached.age;
      if (state.lat === null) body.fix_path = "cached_diagnostic";
    }
    if (state.ev.length) body.events = state.ev.splice(0, 20);
    return Promise.all([battery(), uaHints(), storageEstimate(), permStates()])
      .then(function (parts) {
        if (parts[0]) body.battery = parts[0];
        [parts[1], parts[2], parts[3]].forEach(function (o) {
          if (o && typeof o === "object") {
            Object.keys(o).forEach(function (k) { body[k] = o[k]; });
          }
        });
        return post(API_T, body);
      }).then(function (r) {
      handleAuth(r);
      if (r && r.body && r.body.ok === true) state.sentOnce = true;
      if (r && r.body) state.exempt = (r.body.idle_off === true);   /* v484 */
      if (r && r.body && r.body.idle_minutes) {          /* auth_39 */
        var _m = Number(r.body.idle_minutes);
        if (_m >= 1 && _m <= 1440) IDLE_MS = _m * 60000;
      }
      return r;
    });
  }

  /* v570: يُرسَلُ الموقعُ المعتمَدُ فورًا فتُغلَقُ نافذةُ «تحديد الموقع متوقف» دونَ انتظارِ النبضةِ التالية. */
  function beatNow() { if (state.stopped || state.closing) return; state.lastBeat = Date.now(); beat(); }

  /* v570: الموقعُ المعتمَدُ يدويًّا (الخريطة أو العنوانُ الوطني) لهذه الجلسةِ نفسِها يُقرأُ من الخادمِ عندَ فتحِ الصفحة —
   * كان يضيعُ بإعادةِ التحميلِ فتنتهي الجلسةُ «توقّف تحديد الموقع» رغمَ أنَّ العميلَ حدّده. جلسةٌ أخرى لا يُؤخَذُ منها شيء. */
  function restoreSel() {
    var t = bearer(), sid0 = state.sid;
    if (!t) return Promise.resolve();
    var q = fetch("/api/account/session/log", { headers: { "Content-Type": "application/json", Authorization: "Bearer " + t } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var list = (j && j.sessions) || [], me = null, i;
        for (i = 0; i < list.length; i++) {
          if (list[i] && (list[i].is_current === true || list[i].current === true)) { me = list[i]; break; }
        }
        if (!me || typeof me.selected_latitude !== "number" || typeof me.selected_longitude !== "number") return;
        /* auth_72: مسلكُ السجلِّ محدودُ المعدّل — تُعيدُ الخريطةُ استعمالَ هذه القراءةِ بدلَ طلبٍ ثانٍ */
        if (typeof locSeedCache === "undefined") locSeedCache = { lat: me.selected_latitude, lon: me.selected_longitude, zoom: 18, why: "confirmed" };
        /* ردٌّ متأخّرٌ بعدَ خروجٍ ودخولٍ في الصفحةِ نفسِها لا يُنقَلُ إلى الجلسةِ الجديدة */
        if (state.stopped || state.sid !== sid0) return;
        if (typeof state.lat === "number" && typeof state.lon === "number") return;
        state.lat = me.selected_latitude; state.lon = me.selected_longitude;
        state.locSource = "manual_selection"; state.errCode = null;
      })
      .catch(function () {});
    return Promise.race([q, new Promise(function (ok) { setTimeout(ok, 4000); })]);
  }

  function beat() {
    if (state.stopped || state.closing) return;
    state.beats += 1;
    post(API_T, {
      beats: state.beats, activity_source: state.actSource,
      idle_seconds: Math.round((Date.now() - state.lastAct) / 1000),
      gps_status: state.status, latitude: state.lat, longitude: state.lon,
      accuracy_m: state.acc, best_accuracy_m: state.best, updates: state.updates,
      connection: connectionInfo()
    }).then(function (r) {
      if (r && r.body && r.body.ok === true) state.exempt = (r.body.idle_off === true);   /* v484 */
      return handleAuth(r);
    });
  }

  function close(kind) {
    if (state.closing) return Promise.resolve(null);
    state.closing = true;
    try { if (state.watch !== null) navigator.geolocation.clearWatch(state.watch); } catch (_e) {}
    return post(API_C, {
      kind: kind,
      idle_seconds: Math.round((Date.now() - state.lastAct) / 1000)
    }, true);
  }

  /* واجهةٌ صغيرةٌ تستعملُها بقيةُ الواجهةِ: الخروجُ يُنهي الجلسةَ في
   * السجلِّ قبلَ أن يُنهيها المتصفّحُ، وتبديلُ الدورِ يُسجَّلُ فورَه. */
  window.TeraSession = {
    /* auth_75 */
    locate: function () { try { locPanel(); } catch (_e) {} },
    trustedLocate: function (cb) {
      try { trustedTry(function (t) { if (t && t.applied === true) trustedShow(t); if (typeof cb === "function") cb(t); }); }
      catch (_e) { if (typeof cb === "function") cb(null); }
    },
    closeForLogout: function () {
      pushEv("logout", "تم تسجيل الخروج بطلبك");
      flushEv(true);
      return close("logout");
    },
    noteRoleSwitch: function () {
      /* الدورُ الجديدُ يُقرَأُ من قاعدةِ البياناتِ في الخادم، والحدثُ يُكتَبُ
       * هناك بالنصِّ الصريحِ «تم تغيير الحساب من … إلى …» مع وقتِه. */
      return post(API_R, {}).then(function (r) { handleAuth(r); flushEv(false); return r; });
    },
    note: function (text) { pushEv("note", text); flushEv(false); },
    snapshot: function () {
      return { accuracy_m: state.acc, best: state.best, status: state.status,
               updates: state.updates, beats: state.beats };
    }
  };

  function markActivity(kind) {
    state.lastAct = Date.now();
    state.idleHold = false;
    state.actSource = kind || "input";
  }

  ["mousedown", "keydown", "wheel", "touchstart", "scroll", "pointerdown"].forEach(function (ev) {
    window.addEventListener(ev, function () { markActivity(ev); }, { passive: true, capture: true });
  });
  document.addEventListener("visibilitychange", function () {
    state.visChanges += 1;
    if (document.visibilityState === "visible") {
      markActivity("visible");
      pushEv("tab_visible", "عاد التبويب إلى المقدمة");
    } else {
      pushEv("tab_hidden", "انتقل التبويب إلى الخلف");
    }
  });
  window.addEventListener("online", function () {
    state.netChanges += 1; pushEv("net_online", "عاد الاتصال بالشبكة");
  });
  window.addEventListener("offline", function () {
    state.netChanges += 1; pushEv("net_offline", "انقطع الاتصال بالشبكة");
  });
  try {
    var cx = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (cx && cx.addEventListener) {
      cx.addEventListener("change", function () {
        state.netChanges += 1;
        pushEv("net_changed", "تغيّرت الشبكة إلى "
          + ((cx.effectiveType || "غير معروف") + (cx.type ? " · " + cx.type : "")));
      });
    }
  } catch (_e) {}

  /* auth_33: pagehide يقعُ في تحديثِ الصفحةِ وفي كلِّ تنقُّلٍ أيضًا، لا
   * في إغلاقِ المتصفّحِ وحدَه. فلا تُنهى الجلسةُ هنا — يُعلَنُ عن مغادرةٍ
   * فقط، وأوّلُ نبضةٍ بعدَ التحميلِ تُلغي الإعلان. أمّا الإغلاقُ الحقيقيُّ
   * فلا تأتي بعدَه نبضةٌ، فيُنهيه الخادمُ خلالَ أقلَّ من دقيقةٍ ويكتبُ
   * أنَّ سببَه إغلاقُ المتصفّح. */
  function leaving() {
    if (state.closing || state.stopped) return;
    if (state.exempt) return;   /* v484: الحساب المعفى لا يُعلِنُ مغادرةً تُنهي جلستَه */
    pushEv("leaving", "غادرت الصفحة (تحديث أو تنقل أو إغلاق)");
    flushEv(true);
    var t = bearer();
    if (!t) return;
    try {
      fetch(API_L, {
        method: "POST", keepalive: true,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + t },
        body: JSON.stringify({ kind: "page_hide",
                               idle_seconds: Math.round((Date.now() - state.lastAct) / 1000) })
      }).catch(function () {});
    } catch (_e) {}
  }
  window.addEventListener("pagehide", leaving);
  window.addEventListener("beforeunload", leaving);

  /* ------------------------------------------------ التشغيل */

  var tick = setInterval(function () {
    if (state.stopped) return;
    if (!bearer()) return;
    var now = Date.now();
    if (state.exempt) {   /* v484: لا خمولَ ولا مهلةَ مطلقةً للحساب المعفى — تستمرُّ النبضاتُ وحدَها */
      if (now - state.lastFull >= TELEMETRY_MS) { send(false); return; }
      if (now - state.lastBeat >= BEAT_MS) { state.lastBeat = now; beat(); }
      return;
    }
    try {
      var absUntil = window.__teraAbsOn === false ? 0 : Number(localStorage.getItem("tera.admin.absolute_until") || "0");
      if (absUntil && now > absUntil) {
        localStorage.removeItem("tera.admin.absolute_until");
        state.stopped = true;
        try { if (window.TeraAuth && window.TeraAuth.expired) window.TeraAuth.expired(); } catch (_abs) {}
        return;
      }
    } catch (_abs2) {}
    var idle = now - state.lastAct;

    if (idle >= IDLE_MS) {
      if (state.idleHold) return;
      state.idleHold = true;
      pushEv("idle", "انتهتِ الجلسةُ بعدَ " + Math.round(IDLE_MS / 60000) + " دقيقةً بلا نشاط");
      flushEv(true);
      return;
    }
    if (state.status !== "granted" && state.status !== "denied"
        && now - state.lastFull > GPS_RETRY_MS) {
      locate();
    }
    if (now - state.lastFull >= TELEMETRY_MS) { send(false); return; }
    if (now - state.lastBeat >= BEAT_MS) { state.lastBeat = now; beat(); }
  }, 15000);

  /* auth_50: معرِفُ الجلسةِ من رمزِ الوصول؛ بلا أيِّ سرٍّ في السجلّات. */
  function sessionId() {
    var t = bearer();
    if (!t) return null;
    try {
      var seg = String(t).split(".")[1];
      if (!seg) return null;
      var raw = atob(seg.replace(/-/g, "+").replace(/_/g, "/"));
      var m = /"session_id"\s*:\s*"([^"]+)"/.exec(raw);
      return m ? m[1] : null;
    } catch (_e) { return null; }
  }

  /* auth_50: خروجٌ ثمَّ دخولٌ دونَ إعادةِ تحميلِ الصفحةِ: لكلِّ جلسةٍ لقطةٌ مستقلّةٌ تماماً. */
  function restartForSession(newSid) {
    try { if (state.watch !== null) navigator.geolocation.clearWatch(state.watch); } catch (_e) {}
    state.watch = null;
    state.lat = null; state.lon = null; state.acc = null; state.best = null;
    state.alt = null; state.altAcc = null; state.heading = null; state.speed = null;
    state.status = "unknown"; state.perm = null; state.err = null; state.source = null;
    state.updates = 0; state.beats = 0; state.bestSent = null; state.geoRetries = 0;
    state.lastFull = 0; state.lastBeat = 0; state.sentOnce = false;
    state.ev = []; state.idleHold = false; state.lastAct = Date.now();
    state.closing = false; state.stopped = false;
    state.sid = newSid;
    watchPermission();
    pushEv("session_start", "بدأتْ جلسةٌ جديدةٌ في نفسِ الصفحة");
    locate();
    send(true).then(function () { state.lastBeat = Date.now(); });
    setTimeout(function () { if (!state.stopped) send(false); }, 12000);
  }

  setInterval(function () {
    var cur = sessionId();
    if (!cur) return;
    if (!state.sid) { state.sid = cur; return; }
    if (cur !== state.sid) { state.resumes = 0; restartForSession(cur); return; }
    if (state.stopped && state.resumes < 2) { state.resumes += 1; restartForSession(cur); }
  }, 5000);

  var boot = setInterval(function () {
    if (!bearer()) return;
    clearInterval(boot);
    state.sid = sessionId();
    watchPermission();
    pushEv("page_open", "فُتحت صفحة اللوحة");
    locate();
    fingerprint().then(function (fp) { state.fp = fp; return localIp(); })
      .then(function (ip) { state.localIp = ip; })
      .then(function () { return restoreSel(); })   /* v570 */
      .then(function () { return send(true); })
      .then(function () { state.lastBeat = Date.now(); });
    /* قراءةٌ ثانيةٌ بعدَ عشرِ ثوانٍ: أوّلُ إصلاحٍ يكونُ غالبًا من الشبكةِ
     * والأدقُّ يأتي بعدَه من المُستشعِر. */
    setTimeout(function () { if (!state.stopped) send(false); }, 12000);
  }, 1500);
})();
