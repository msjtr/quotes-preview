/* v564 — صفحة التحويل البنكي: نسخ الآيبان والمبلغ · اختيار الإيصال · الرفع ثم الإرسال (مرة واحدة) */
(function () {
  "use strict";
  var root = document.getElementById("tp"), tok = root && root.getAttribute("data-tok");
  document.querySelectorAll(".tt-copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy") || "", t0 = b.textContent;
      var ok = function () { b.textContent = "نُسخ ✓"; b.classList.add("is-done"); setTimeout(function () { b.textContent = t0; b.classList.remove("is-done"); }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, function () {});
      else { var i = document.createElement("textarea"); i.value = v; document.body.appendChild(i); i.select(); try { document.execCommand("copy"); ok(); } catch (e) { /* */ } i.remove(); }
    });
  });
  if (!tok) return;
  var inp = document.getElementById("tt-file"), send = document.getElementById("tt-send"), msg = document.getElementById("tt-msg"), fname = document.getElementById("tt-fname"), drop = inp && inp.closest(".tt-drop");
  var TYPES = { "application/pdf": 1, "image/jpeg": 1, "image/png": 1, "image/webp": 1 }, file = null, busy = false;
  var say = function (t, err) { msg.textContent = t || ""; msg.classList.toggle("is-err", !!err); };
  inp.addEventListener("change", function () {
    var f = inp.files && inp.files[0]; file = null; send.disabled = true; drop.classList.remove("is-on");
    if (!f) { fname.textContent = "اختر صورة الإيصال أو ملف PDF"; return; }
    if (!TYPES[f.type]) { say("الإيصال PDF أو صورة (JPG · PNG · WEBP).", true); return; }
    if (f.size > 5 * 1024 * 1024) { say("حجم الإيصال أكبر من 5 ميغابايت.", true); return; }
    file = f; fname.textContent = f.name; drop.classList.add("is-on"); send.disabled = false; say("");
  });
  var post = function (u, body) {
    return fetch(u, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); });
  };
  send.addEventListener("click", function () {
    if (busy || !file) return; busy = true; send.disabled = true; say("جارٍ رفع الإيصال…");
    var base = "/api/pay/t/" + encodeURIComponent(tok);
    post(base + "/upload-url", { type: file.type, size: file.size }).then(function (u) {
      if (!u || u.ok !== true || !u.url) throw new Error((u && u.message) || "تعذّر تجهيز رفع الإيصال.");
      var proxied = String(u.url).replace(/^https?:\/\/[^/]+/, "/sb");
      var put = function (url) { return fetch(url, { method: "PUT", headers: { "Content-Type": file.type, "x-upsert": "false" }, body: file }).then(function (r) { return r.ok; }, function () { return false; }); };
      return put(proxied).then(function (ok) { return ok ? true : put(u.url); }).then(function (ok) {
        if (!ok) throw new Error("تعذّر رفع الإيصال — تحقق من الاتصال وحاول مرة أخرى.");
        say("جارٍ إرسال الإيصال…");
        return post(base + "/submit", { path: u.path, name: file.name, mime: file.type, size: file.size });
      });
    }).then(function (j) {
      if (!j || j.ok !== true) throw new Error((j && j.message) || "تعذّر إرسال الإيصال.");
      var main = document.querySelector(".tt-main");
      var sec = document.createElement("section"); sec.className = "tt-res is-ok";
      sec.innerHTML = '<div class="tt-res-ic" aria-hidden="true"></div><h2></h2><p></p><div class="tt-acts"><a class="tp-cta dark" href="/clients/">حسابي في منصة تيرا</a></div>';
      sec.querySelector("h2").textContent = "تم استلام إيصال التحويل بنجاح";
      sec.querySelector("p").textContent = "رقم طلبك " + (j.ref_no || "") + " — جارٍ تدقيق التحويل، وتصلك رسالة بالاعتماد أو بطلب التعديل. انتهى هذا الرابط بإرسال الإيصال.";
      main.querySelectorAll(".tt-card").forEach(function (c) { c.remove(); });
      var top = main.querySelector(".tp-top"); top.parentNode.insertBefore(sec, top.nextSibling);
      document.querySelectorAll(".tt-steps span").forEach(function (s, i) { s.className = i < 2 ? "done" : "on"; });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }).catch(function (err) { busy = false; send.disabled = !file; say((err && err.message) || "تعذّر إرسال الإيصال.", true); });
  });
})();
