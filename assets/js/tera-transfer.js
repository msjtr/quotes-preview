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
  var TYPES = {"application/pdf":1,"image/jpeg":1,"image/png":1,"image/webp":1,"image/gif":1,"image/heic":1,"image/heif":1,"image/bmp":1,"image/tiff":1,"application/msword":1,"application/vnd.openxmlformats-officedocument.wordprocessingml.document":1,"application/vnd.ms-excel":1,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":1,"application/vnd.ms-powerpoint":1,"application/vnd.openxmlformats-officedocument.presentationml.presentation":1,"application/vnd.oasis.opendocument.text":1,"application/vnd.oasis.opendocument.spreadsheet":1,"application/vnd.oasis.opendocument.presentation":1,"application/rtf":1,"text/plain":1,"text/csv":1,"application/zip":1,"application/vnd.rar":1,"application/x-7z-compressed":1,"audio/mpeg":1,"audio/mp4":1,"audio/aac":1,"audio/ogg":1,"audio/opus":1,"audio/wav":1,"video/mp4":1,"video/quicktime":1,"video/3gpp":1,"video/webm":1}, FT_EXT = {"pdf":"application/pdf","jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","webp":"image/webp","gif":"image/gif","heic":"image/heic","heif":"image/heif","bmp":"image/bmp","tif":"image/tiff","tiff":"image/tiff","doc":"application/msword","docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","xls":"application/vnd.ms-excel","xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","ppt":"application/vnd.ms-powerpoint","pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation","odt":"application/vnd.oasis.opendocument.text","ods":"application/vnd.oasis.opendocument.spreadsheet","odp":"application/vnd.oasis.opendocument.presentation","rtf":"application/rtf","txt":"text/plain","csv":"text/csv","zip":"application/zip","rar":"application/vnd.rar","7z":"application/x-7z-compressed","mp3":"audio/mpeg","m4a":"audio/mp4","aac":"audio/aac","ogg":"audio/ogg","opus":"audio/opus","wav":"audio/wav","mp4":"video/mp4","mov":"video/quicktime","3gp":"video/3gpp","webm":"video/webm"}, FT_ALIAS = {"image/jpg":"image/jpeg","image/pjpeg":"image/jpeg","image/x-png":"image/png","image/heic-sequence":"image/heic","image/heif-sequence":"image/heif","image/x-ms-bmp":"image/bmp","application/x-zip-compressed":"application/zip","application/x-zip":"application/zip","application/x-rar-compressed":"application/vnd.rar","application/x-rar":"application/vnd.rar","audio/x-m4a":"audio/mp4","audio/m4a":"audio/mp4","audio/mp3":"audio/mpeg","audio/x-wav":"audio/wav","audio/wave":"audio/wav","audio/vnd.wave":"audio/wav","audio/x-aac":"audio/aac","text/comma-separated-values":"text/csv","application/csv":"text/csv","text/rtf":"application/rtf","video/3gpp2":"video/3gpp"}, file = null, busy = false; /* v693: كل الصيغ الشائعة */
  function ftT(f) { var x = /\.([a-z0-9]{1,5})$/i.exec(String((f && f.name) || "")), e = x ? x[1].toLowerCase() : ""; if (FT_EXT[e]) return FT_EXT[e]; var m0 = String((f && f.type) || "").toLowerCase().split(";")[0].trim(), m = FT_ALIAS[m0] || m0; return TYPES[m] ? m : m0; }
  var say = function (t, err) { msg.textContent = t || ""; msg.classList.toggle("is-err", !!err); };
  inp.addEventListener("change", function () {
    var f = inp.files && inp.files[0]; file = null; send.disabled = true; drop.classList.remove("is-on");
    if (!f) { fname.textContent = "اختر صورة الإيصال أو ملف PDF"; return; }
    if (!TYPES[ftT(f)]) { say("الإيصال PDF أو صورة أو أي مستند.", true); return; }
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
    post(base + "/upload-url", { type: ftT(file), size: file.size }).then(function (u) {
      if (!u || u.ok !== true || !u.url) throw new Error((u && u.message) || "تعذّر تجهيز رفع الإيصال.");
      var proxied = String(u.url).replace(/^https?:\/\/[^/]+/, "/sb");
      var put = function (url) { return fetch(url, { method: "PUT", headers: { "Content-Type": ftT(file), "x-upsert": "false" }, body: file }).then(function (r) { return r.ok; }, function () { return false; }); };
      return put(proxied).then(function (ok) { return ok ? true : put(u.url); }).then(function (ok) {
        if (!ok) throw new Error("تعذّر رفع الإيصال — تحقق من الاتصال وحاول مرة أخرى.");
        say("جارٍ إرسال الإيصال…");
        return post(base + "/submit", { path: u.path, name: file.name, mime: ftT(file), size: file.size });
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
