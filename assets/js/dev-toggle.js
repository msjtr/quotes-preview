/* تبديل الويب / تطبيق الجوال في صفحات الموقع والبوابة (بدون محرك المنصة) — ويقبل ?dev=web|phone (تضمين مركز الأمان) */
(function(){var m=/[?&]dev=(web|phone)/.exec(location.search);if(m)document.querySelectorAll('.pv-bar button[data-dev]').forEach(function(x){x.classList.toggle('is-on',x.dataset.dev===m[1])})})();
document.querySelectorAll('.pv-bar button[data-dev]').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.pv-bar button[data-dev]').forEach(function(x){x.classList.toggle('is-on',x===b)})})});
