/* tera-grace.js (v1147) — صفحة «مهلة السداد»: اختيار الموعد · التوقيع (رسم أو اسم) · الإقرار · الاعتماد */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var tok = $("gr-tok") && $("gr-tok").value, go = $("gr-go"), msg = $("gr-msg");
  if (!tok || !go) return;
  var S = { day: "", kind: "draw", drawn: false, busy: false };

  /* المواعيد */
  var days = document.querySelectorAll(".gr-day");
  Array.prototype.forEach.call(days, function (b) {
    b.addEventListener("click", function () {
      S.day = b.getAttribute("data-day");
      Array.prototype.forEach.call(days, function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      check();
    });
  });

  /* التوقيع */
  var tabs = document.querySelectorAll(".gr-tab");
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener("click", function () {
      S.kind = t.getAttribute("data-k");
      Array.prototype.forEach.call(tabs, function (x) { x.classList.toggle("on", x === t); });
      $("gr-k-draw").hidden = S.kind !== "draw"; $("gr-k-name").hidden = S.kind !== "name";
      if (S.kind === "draw") size();
      check();
    });
  });
  var cv = $("gr-cv"), cx = cv.getContext("2d"), down = false, last = null;
  function size() {
    var r = cv.getBoundingClientRect(), k = window.devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = Math.round(r.width * k); cv.height = Math.round(r.height * k);
    cx.setTransform(k, 0, 0, k, 0, 0); cx.lineWidth = 2.6; cx.lineCap = "round"; cx.lineJoin = "round"; cx.strokeStyle = "#07173A";
    S.drawn = false; check();
  }
  function pt(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  cv.addEventListener("pointerdown", function (e) { down = true; last = pt(e); try { cv.setPointerCapture(e.pointerId); } catch (_e) { /* */ } e.preventDefault(); });
  cv.addEventListener("pointermove", function (e) {
    if (!down) return; var p = pt(e);
    cx.beginPath(); cx.moveTo(last.x, last.y); cx.lineTo(p.x, p.y); cx.stroke(); last = p;
    if (!S.drawn) { S.drawn = true; check(); }
    e.preventDefault();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (n) { cv.addEventListener(n, function () { down = false; }); });
  $("gr-clr").addEventListener("click", function () { cx.clearRect(0, 0, cv.width, cv.height); S.drawn = false; check(); });
  window.addEventListener("resize", function () { if (!S.drawn) size(); });
  size();

  var nm = $("gr-name"), ack = $("gr-ack");
  nm.addEventListener("input", check); ack.addEventListener("change", check);
  function signed() { return S.kind === "draw" ? S.drawn : nm.value.trim().length >= 3; }
  function check() { go.disabled = S.busy || !S.day || !signed() || !ack.checked; }

  go.addEventListener("click", function () {
    if (go.disabled) return;
    S.busy = true; check(); msg.textContent = "جارٍ اعتماد المهلة…"; msg.style.color = "#33415C";
    var body = { until: S.day, kind: S.kind, name: nm.value.trim(), img: S.kind === "draw" ? cv.toDataURL("image/png") : "", ack: true };
    fetch(location.pathname, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        S.busy = false;
        if (!j || j.ok !== true) { msg.style.color = ""; msg.textContent = (j && j.message) || "تعذّر اعتماد المهلة — حاول مرة أخرى."; check(); return; }
        Array.prototype.forEach.call(document.querySelectorAll(".gr-wrap > .gr-card"), function (c) { if (c.id !== "gr-done" && !c.querySelector(".gr-kv")) c.hidden = true; });
        go.hidden = true; msg.textContent = "";
        $("gr-done-t").textContent = "تم تسجيل مهلتك حتى " + (j.until_txt || j.until);
        $("gr-done-p").textContent = "رقم المهلة " + (j.ref_no || "") + ". وصلتك رسالة تأكيد، ونذكّرك قبل الموعد. يمكنك السداد في أي وقت قبله.";
        $("gr-done").hidden = false;
        try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (_e) { window.scrollTo(0, 0); }
      })
      .catch(function () { S.busy = false; msg.style.color = ""; msg.textContent = "تعذّر الاتصال — تحقق من الإنترنت وحاول مرة أخرى."; check(); });
  });
})();
